(() => {
  'use strict';

  const pack = window.CAPTAINCOOK_RESULT;
  const prior = window.OmniResults;
  const registry = window.OMNIALE_DATA;
  if (!pack || !prior || !registry) return;

  const task = pack.task;
  const models = pack.models;
  const key = task.key;
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
  const number = value => value == null ? '—' : Number(value.toFixed(2)).toString();
  const link = (url, label) => '<a href="' + escape(url) + '" target="_blank" rel="noopener">' + escape(label) + ' ↗</a>';
  const categories = {technique: '技术', order: '顺序', omission: '遗漏', other: '其他'};
  const formatWindow = span => span.map(number).join('–') + ' 秒';
  const status = row => row.grade.delivery_pass ? '交付通过' : '交付未通过';
  const first = models[0];
  task.seq = Math.max(...registry.cases.map(c => Number(c.seq) || 0)) + 1;
  if (!registry.cases.some(c => c.key === key)) registry.cases.push(task);

  const result = row => ({
    key, model: row.model, effort: 'xhigh', total: row.grade.score, verified: row.grade.score,
    gradeStatus: row.grade.score != null ? 'complete' : row.grade.delivery_pass ? 'partial' : 'failed',
    automatic: row.grade.automatic_70, automaticMax: 70, judgeMax: 30,
    judge: row.grade.human_review ? row.grade.human_review.observation_and_correction + row.grade.human_review.training_video : null,
    rows: [{maximum: 100, points: row.grade.score}], pendingPoints: row.grade.human_pending ? 30 : 0,
    artifacts: [], reports: [], seconds: row.seconds, timedOut: false,
    integrity: {passed: row.integrity}, attempt: '单次'
  });
  window.OMNIALE_RESULTS[key] = {...result(first), comparisons: models.slice(1).map(result)};

  let selected = first.key;
  let active = 'answer';

  function answer(row) {
    const findings = row.findings?.recordings || [];
    const video = row.video ? '<video data-training-video controls playsinline preload="metadata" src="' + escape(row.video) + '"></video>' : '<p>该次运行未交付成片。</p>';
    return '<h3>冻结提交</h3>' + video
      + '<p class="oe-links">' + (row.links.original ? link(row.links.original, '原始成片下载') : '') + (row.links.findings ? link(row.links.findings, 'findings.json') : '') + '</p>'
      + findings.map(recording => '<details open><summary>录像 ' + escape(recording.recording) + ' · '
        + (recording.status === 'issues_found' ? '发现问题' : '未见偏差') + '</summary><p>' + escape(recording.summary) + '</p>'
        + recording.findings.map(item => '<article><h4>' + escape(categories[item.kind] || item.kind) + ' · 步骤 ' + escape(item.step_ids.join('、')) + '</h4><p>'
          + escape(item.observed) + '</p><p><b>纠正方法</b> ' + escape(item.correction) + '</p><ul>'
          + item.evidence.map(entry => '<li>原片 ' + formatWindow(entry.source_seconds)
            + ' · <button class="button" data-cc-seek="' + escape(entry.output_seconds[0]) + '">成片 ' + formatWindow(entry.output_seconds) + '</button></li>').join('')
          + '</ul></article>').join('') + '</details>').join('');
  }

  function scores(row) {
    const grade = row.grade;
    const review = grade.human_review;
    return '<h3>评分明细</h3><table><thead><tr><th>项目</th><th>得分</th></tr></thead><tbody>'
      + [['识别与误报', grade.identification_45, 45], ['源片证据定位', grade.timecode_25, 25],
        ['观察与纠正', review?.observation_and_correction, 15], ['成片证据与教学可用性', review?.training_video, 15]]
        .map(([label, value, cap]) => '<tr><td>' + label + '</td><td>' + number(value) + ' / ' + cap + '</td></tr>').join('')
      + '</tbody></table>' + (grade.errors || []).map(error => '<p>' + escape(error) + '</p>').join('')
      + (review?.notes || []).map(note => '<p>' + escape(note) + '</p>').join('')
      + '<div class="oe-scroll"><table><thead><tr><th>录像</th><th>类型与步骤</th><th>判定</th><th>证据窗口</th></tr></thead><tbody>'
      + (grade.events || []).map(event => '<tr><td>' + escape(event.recording) + '</td><td>' + escape(categories[event.kind] || event.kind)
        + ' · ' + escape(event.step_ids.join('、')) + '</td><td>' + (event.false_positive ? '误报' : event.matched ? '识别正确' : '漏报')
        + '</td><td>' + (event.false_positive ? '—' : event.windows_hit + ' / ' + event.windows_total) + '</td></tr>').join('')
      + '</tbody></table></div><p>' + link(row.links.grade, '评分记录 JSON') + '</p>';
  }

  function records(row) {
    return '<h3>运行与来源</h3><p>' + escape(row.model) + ' · Codex CLI ' + escape(row.codex) + ' · xhigh · 不限时 · '
      + (row.seconds / 60).toFixed(1) + ' 分钟</p><p>两次运行使用相同只读题包，各自封存。模型通过本地工具处理音视频。'
      + '接口返回模型名见运行记录。</p><p class="oe-links">'
      + link(row.links.run, '运行与封存校验') + link('captaincook4d/asset_provenance.json', '素材来源和哈希')
      + link('https://captaincook4d.github.io/captain-cook/', 'CaptainCook4D') + '</p>';
  }

  function render(entry, row, target) {
    if (entry.key !== key) return prior.render(entry, row, target);
    const model = models.find(item => item.key === selected);
    const tabs = [['answer','答卷与证据'],['scores','评分明细'],['records','运行与来源']];
    target.innerHTML = '<section class="oe" data-captaincook><div class="oe-top"><h2>厨房操作纠错片 · 两模型对照</h2></div>'
      + '<div class="oe-scroll"><table><thead><tr><th>模型</th><th>程序分 / 70</th><th>总分 / 100</th><th>实际用时</th><th>答卷</th></tr></thead><tbody>'
      + models.map(item => '<tr><td>' + escape(item.model) + '<small>Codex · xhigh · 不限时</small></td><td>' + number(item.grade.automatic_70)
        + '</td><td><b>' + number(item.grade.score) + '</b></td><td>' + (item.seconds / 60).toFixed(1) + ' 分钟</td><td>'
        + status(item) + ' <button class="button" data-cc-model="' + escape(item.key) + '" aria-pressed="' + (item.key === selected)
        + '">查看</button></td></tr>').join('')
      + '</tbody></table></div><div class="oe-tabs" role="group" aria-label="答卷详情">'
      + tabs.map(([id, label]) => '<button data-cc-tab="' + id + '" aria-pressed="' + (active === id) + '">' + label + '</button>').join('')
      + '</div><div id="captaincook-panel">' + ({answer, scores, records}[active])(model) + '</div></section>';
    target.querySelectorAll('[data-cc-model]').forEach(button => button.onclick = () => {
      selected = button.dataset.ccModel;
      render(entry, row, target);
      target.querySelector('[data-cc-model="' + selected + '"]').focus();
    });
    target.querySelectorAll('[data-cc-tab]').forEach(button => button.onclick = () => {
      active = button.dataset.ccTab;
      render(entry, row, target);
      target.querySelector('[data-cc-tab="' + active + '"]').focus();
    });
    const player = target.querySelector('[data-training-video]');
    target.querySelectorAll('[data-cc-seek]').forEach(button => button.onclick = () => {
      if (!player) return;
      player.currentTime = Number(button.dataset.ccSeek);
      player.play().catch(() => {});
    });
  }

  window.OmniResults = Object.freeze({...prior, render, overview(cases, results, target) {
    prior.overview(cases, results, target);
    const row = target.querySelector('a[href="#' + key + '/results"]')?.closest('tr');
    if (!row) return;
    row.innerHTML = '<td><a href="#' + key + '/results"><b>' + escape(task.title) + '</b><small>CaptainCook4D · 两组</small></a></td>'
      + '<td colspan="4">' + models.map(m => escape(m.model) + ' · <b>' + number(m.grade.score) + '</b> / 100').join('<br>')
      + '</td><td>' + models.filter(m => m.grade.delivery_pass).length + ' 组通过交付</td><td><a class="button" href="#' + key + '/results">查看 ↗</a></td>';
  }});
})();
