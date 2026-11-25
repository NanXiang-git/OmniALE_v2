(() => {
  'use strict';

  const data = window.OMNIALE_LIPREADING;
  const registry = window.OMNIALE_DATA;
  const previous = window.OmniResults;
  if (!data || !registry || !previous) return;

  const {case: task, current, history} = data;
  task.seq = Math.max(0, ...registry.cases.map(item => Number(item.seq) || 0)) + 1;
  registry.cases.push(task);
  window.OMNIALE_RESULTS[task.key] = {
    model: current.model, effort: current.effort, total: current.score, verified: current.score,
    seconds: current.lastResponse, gradeStatus: 'complete', judge: current.score, judgeMax: current.maximum,
    automatic: null, automaticMax: 0, accepted: null,
    rows: current.questions.map(({grade}) => ({maximum: 10, points: grade.points})),
    artifacts: [], reports: []
  };

  const escape = value => String(value ?? '').replace(/[&<>"']/g, char =>
    ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[char]);
  const percent = value => (100 * value).toFixed(1) + '%';
  const seconds = value => Number(value).toFixed(3);
  const interval = range => range.map(seconds).join('–') + ' 秒';
  const link = (url, label) => '<a href="' + escape(url) + '" target="_blank" rel="noopener">' + escape(label) + ' ↗</a>';
  const links = files => '<div class="variant-answer-files">' +
    Object.entries(files).map(([label, url]) => link(url, label)).join('') + '</div>';
  const seek = (time, label) => '<button type="button" class="button" data-lip-seek="' +
    time + '">' + escape(label) + '</button>';
  const table = (headings, rows) => '<div class="score-table-wrap"><table class="result-table"><thead><tr>' +
    headings.map(heading => '<th scope="col">' + escape(heading) + '</th>').join('') +
    '</tr></thead><tbody>' + rows + '</tbody></table></div>';
  const row = cells => '<tr>' + cells.map((cell, index) =>
    index === 0 ? '<th scope="row">' + cell + '</th>' : '<td>' + cell + '</td>').join('') + '</tr>';
  const sections = [['answers', '模型答卷'], ['scores', '评分明细'], ['errors', '错误分析'], ['sources', '交付与来源']];
  const evidenceStates = {pass: '通过', fail: '未通过', not_required: '无需核验'};
  const alignmentStates = {consistent: '一致', mismatch: '不一致', uncertain: '不确定'};
  let section = 'answers';

  function predictionText(prediction) {
    if (!prediction.errors.length) return '模型判断无错误';
    return prediction.errors.map(error => '标记「' + escape(error.subtitle_span) + '」 · ' +
      interval(error.time_interval_seconds) + (error.suggested_text ? ' · 建议「' + escape(error.suggested_text) + '」' : '')).join('<br>');
  }

  function answerSection() {
    return '<h3>v2 封存答卷</h3>' + links({
      '模型报告 PDF': current.files['模型报告 PDF'], '模型答卷 JSON': current.files['模型答卷 JSON']
    }) + '<p class="result-note">点击时间跳到题面视频对应位置。每题可展开查看模型提交的整句对齐。</p>' +
      current.questions.map(({question, prediction}) =>
        '<details class="result-details"><summary><strong>' + question.question_id + '</strong> · ' +
        (prediction.decision === 'no_error' ? '模型判断无错误' : '模型标记 ' + prediction.errors.length + ' 处') +
        '</summary><p>' + escape(question.subtitle) + '</p><p>' + predictionText(prediction) + '</p><p>' +
        escape(prediction.uncertainty) + '</p><p>' + seek(question.start_seconds, '跳到本题 ' + interval([question.start_seconds, question.end_seconds])) +
        '</p>' + table(['模型词组', '模型时间', '模型判断', '模型说明'], prediction.alignment.map(item => row([
          escape(item.text), interval(item.time_interval_seconds), escape(alignmentStates[item.status]), escape(item.note)
        ])).join('')) + '</details>').join('');
  }

  function scoreSection() {
    const metrics = current.metrics;
    return '<h3>严格评分</h3><p>每题 10 分。检测、适用的时间定位、口型证据和可审阅交付全部通过才得分。</p>' +
      '<p class="variant-calculation">整题检测正确 ' + metrics.exact_detection_questions + ' / ' + metrics.total_questions +
      ' · 事件级 Precision ' + percent(metrics.event_precision) + ' · Recall ' + percent(metrics.event_recall) +
      ' · F1 ' + percent(metrics.event_F1) + '</p>' +
      table(['题号', '整题检测', '视觉证据', '得分', '复核结论'], current.questions.map(({grade}) => row([
        grade.question_id, grade.detection_pass ? '正确' : '错误', evidenceStates[grade.evidence],
        '<strong>' + grade.points + ' / 10</strong>', escape(grade.reason)
      ])).join('')) +
      '<p class="result-note">最终复核由 ' + escape(current.reviewer) + ' 完成。Q03 的词级边界仍待独立核定，证据项未通过，该题最终为 0 分。</p>' +
      links({'最终评分 JSON': current.files['最终评分 JSON'], '冻结评分规则': task.files.find(file => file.name === 'SCORING.md').url});
  }

  function errorSection() {
    const metrics = current.metrics;
    return '<h3>逐题对照</h3><p class="variant-calculation">检出 ' + metrics.event_TP + ' 处 · 漏报 ' +
      metrics.event_FN + ' 处 · 误报 ' + metrics.event_FP + ' 处</p>' +
      '<div class="lipreading-questions">' + current.questions.map(({question, grade, prediction, official, edits, images, metrics: counts}) => {
        const replacements = edits.length ? edits.map(edit => '「' + escape(edit.original_text) + '」→「' +
          escape(edit.subtitle_text) + '」').join('、') : '无替换';
        return '<article class="lipreading-question"><div class="lipreading-question-head"><h4>' + question.question_id + ' · ' +
          (grade.detection_pass ? '整题检测正确' : [counts.FN ? '漏报 ' + counts.FN + ' 处' : '', counts.FP ? '误报 ' + counts.FP + ' 处' : ''].filter(Boolean).join('、')) +
          '</h4><strong>' + grade.points + ' / 10</strong></div><dl><dt>待核验字幕</dt><dd>' + escape(question.subtitle) +
          '</dd><dt>官方原文</dt><dd>' + escape(official) + '</dd><dt>植入替换</dt><dd>' + replacements +
          '</dd><dt>模型作答</dt><dd>' + predictionText(prediction) + '</dd><dt>最终复核</dt><dd>' + escape(grade.reason) +
          '</dd></dl><div class="lipreading-actions">' + seek(question.start_seconds, '跳到本题') +
          prediction.errors.map(error => seek(error.time_interval_seconds[0], '跳到模型标记')).join('') + '</div>' +
          (images.length ? '<details class="result-details"><summary>口型证据对照 · ' + images.length + ' 张</summary>' +
            images.map((path, index) => '<a class="lipreading-frame" href="' + escape(path) + '" target="_blank" rel="noopener"><img loading="lazy" src="' +
              escape(path) + '" alt="' + question.question_id + ' 口型证据对照 ' + (index + 1) + '"></a>').join('') + '</details>' : '') +
          '</article>';
      }).join('') + '</div>';
  }

  function sourcesSection() {
    return '<h3>运行与交付</h3><dl class="run-details">' +
      '<div><dt>模型 / 推理</dt><dd>' + escape(current.model) + ' / ' + escape(current.effort) + '</dd></div>' +
      '<div><dt>作答环境</dt><dd>Codex 隔离运行 · 单次 · 不限时 · 无声输入</dd></div>' +
      '<div><dt>模型请求</dt><dd>' + current.completed + ' / ' + current.requests + ' 次完成</dd></div>' +
      '<div><dt>最后一次成功响应</dt><dd>启动后 ' + (current.lastResponse / 60).toFixed(2) + ' 分钟</dd></div>' +
      '<div><dt>冻结交付</dt><dd>' + current.submittedFiles + ' 个文件的 SHA‑256 核验通过</dd></div></dl>' +
      '<p>模型生成 JSON 和 ' + current.metrics.pdf_pages + ' 页 PDF 后，上游连接故障。日志总历时 ' +
      (current.elapsed / 3600).toFixed(2) + ' 小时，包含故障等待。进程退出码为 ' +
      current.returnCode + '，评阅使用故障前产生并封存的答卷。</p>' + links(current.files) +
      '<h3>素材与标注</h3><p>选取 Chinese‑LiPS 的 10 段普通话视频和官方句级标注，拼接后去除音轨。数据集采用 CC BY‑NC‑SA 4.0。' +
      '词级时间仅有音频辅助诊断。' + link(data.dataSource, 'Chinese‑LiPS 数据集') + '</p>';
  }

  function historySection() {
    const grade = history.score;
    return '<details class="result-details lipreading-history"><summary>历史版本 v1 · 四选一 · ' +
      escape(grade.model) + ' / ' + escape(grade.reasoning_effort) + '</summary>' +
      '<p>选项正确 ' + grade.raw_answer_correct + ' / ' + grade.total_questions + '。初审确认 ' +
      grade.verified_score_lower_bound + ' / 100，另有 ' + grade.evidence_pending_count + ' 题的证据待复核，当前范围 ' +
      grade.verified_score_lower_bound + '–' + grade.possible_score_upper_bound + ' 分。实际运行 ' +
      (grade.elapsed_seconds / 60).toFixed(2) + ' 分钟。</p>' + links(history.files) +
      table(['题号', '模型选项', '正确选项', '严格得分', '证据复核'], grade.questions.map(item => row([
        item.question_id, escape(item.selected_option), escape(item.correct_option),
        item.strict_score === null ? '待复核' : item.strict_score + ' / 10', escape(item.reason)
      ])).join('')) + '</details>';
  }

  const content = {answers: answerSection, scores: scoreSection, errors: errorSection, sources: sourcesSection};

  function render(item, result, target) {
    if (item.key !== task.key) return previous.render(item, result, target);
    const metrics = current.metrics;
    target.innerHTML = '<section class="variant-case-results lipreading-results"><h2 class="result-section-title">v2 字幕找茬 · 模型评测</h2>' +
      table(['作答模型', '整题检测正确', '事件级 F1', '最终复核', '严格总分'], row([
        escape(current.model) + ' / ' + escape(current.effort), metrics.exact_detection_questions + ' / ' + metrics.total_questions,
        percent(metrics.event_F1), escape(current.reviewer), '<strong>' + current.score + ' / ' + current.maximum + '</strong>'
      ])) + '<div class="variant-result-nav" aria-label="结果分区">' +
      sections.map(([key, label]) => '<button class="button" type="button" data-lip-section="' + key + '" aria-pressed="' +
        (section === key) + '">' + label + '</button>').join('') + '</div><div data-lip-content>' +
      content[section]() + '</div>' + historySection() + '</section>';

    const body = target.querySelector('[data-lip-content]');
    const buttons = [...target.querySelectorAll('[data-lip-section]')];
    for (const button of buttons) {
      button.addEventListener('click', () => {
        section = button.dataset.lipSection;
        body.innerHTML = content[section]();
        for (const choice of buttons) choice.setAttribute('aria-pressed', String(choice === button));
      });
    }
    body.addEventListener('click', event => {
      const button = event.target.closest('[data-lip-seek]');
      const video = target.closest('.detail-main')?.querySelector('.spotlight video');
      if (!button || !video) return;
      video.currentTime = Number(button.dataset.lipSeek);
      video.scrollIntoView({block: 'center'});
      video.focus({preventScroll: true});
    });
  }

  window.OmniResults = Object.freeze({...previous, render, overview(cases, results, target) {
    previous.overview(cases, results, target);
    const resultRow = target.querySelector('a[href="#' + task.key + '/results"]')?.closest('tr');
    if (!resultRow) return;
    resultRow.innerHTML = '<td><a href="#' + task.key + '/results"><b>' + escape(task.title) + '</b><small>Chinese‑LiPS · v2</small></a></td>' +
      '<td colspan="3">' + escape(current.model) + ' / ' + escape(current.effort) + ' · 整题检测 ' +
      current.metrics.exact_detection_questions + ' / ' + current.metrics.total_questions + '</td><td><strong>' +
      current.score + ' / ' + current.maximum + '</strong></td><td>已完成复核</td><td><a class="button" href="#' +
      task.key + '/results">查看 ↗</a></td>';
  }});
})();
