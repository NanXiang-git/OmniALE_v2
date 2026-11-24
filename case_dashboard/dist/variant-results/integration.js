(() => {
  'use strict';
  const report = window.OMNIALE_VARIANT_RESULTS;
  const caseData = window.OMNIALE_VARIANT_CASES;
  const registry = window.OMNIALE_DATA;
  const previous = window.OmniResults;
  const route = '#results/variants';
  const navigation = document.querySelector('[data-variant-nav]');
  if (!report || !caseData || !registry || !previous || !navigation) return;

  const cases = [
    {
      id: 31, title: '多人会议字幕', original: 'task-12', source: 'EasyCom · Session 2',
      method: '总分 =（内容得分 ÷ 65）×（交付得分 ÷ 35）× 100。',
      finding: '四名新的发言者在同一场英语小组讨论中交谈，三个片段重新排序。',
      review: '使用 EasyCom 的官方发言者标注和逐句稿，逐词时间由离线对齐生成。'
    },
    {
      id: 40, title: '中文配音', original: 'task-13', source: '《Cosmos Laundromat: First Cycle》· 02:48–04:07',
      method: '总分 =（英文理解 E + 中文译文 T）×（配音 A ÷ 70）× 画面系数 V ×（100 ÷ 30）。',
      finding: '角色分轨复评确认 Sol 的维克托跨段音色漂移。两份答卷均未通过验收。',
      notes: [
        '约 26 秒处译配丢失原声在 “you’re…” 后的明显犹豫停顿。离线重建通过。',
        '末段 76.25–78.708 秒的维克托台词进入弗兰克轨。拒绝句缺少原声的停顿。离线重建在 600 秒内未完成。'
      ],
      review: '视觉裁判为 GPT‑6.2 Sol。qwen3.8-omni-flash 对照官方角色分轨和交付分轨，复评原人物音色与跨段稳定。每项至少两次听审。两份连续性记录各有一项时间窗诊断待确认。'
    },
    {
      id: 46, title: '口述影像', original: 'task-14', source: '《Sprite Fright》· 81 秒片段',
      method: '总分 = 视觉理解分 ×（有效交付分 ÷ 65），再应用硬门槛封顶。',
      finding: 'Sol 低于 85 分通过线。Luna 触发关键揭示规则。',
      notes: [
        '人物共同视线、瓢虫段的队形和动线，以及树洞处的动作衔接交代不完整。',
        '约 5.37 秒时旁白说红帽「蹦开」，画面仍显示它留在原处。封顶前 62.3619 分，最终封顶 59 分。'
      ]
    }
  ];
  const modelNames = {'gpt-6.2-sol': 'GPT‑6.2 Sol', 'gpt-6-luna': 'GPT‑6 Luna'};
  const escape = value => String(value).replace(/[&<>"']/g, char =>
    ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[char]);
  const viewingVariants = () => location.hash === route;
  const caseKey = id => 'task-variant-' + id;
  const pretty = value => Number(value.toFixed(4)).toString();
  const mediaLink = (url, label, attributes = '') => `<a href="${escape(url)}" ${attributes}>${escape(label)}</a>`;
  const reportRoot = (id, alias) => 'variant-results/case-' + id + '/' + alias + '/';
  const scoringLabels = {
    timing: '字幕时间对齐', speakers: '说话人归属', overlap: '重叠对白', text: '文字准确度',
    format: '交付格式', consistency: '预览与字幕一致性', rebuild: '离线重建', readability: '烧录字幕可读性'
  };
  const delivery = {
    31: ['带说话人标识的 ASS、SRT 字幕', '烧录字幕预览视频', '对轴记录、阅读说明和离线重建'],
    40: ['普通话译配成片、双语字幕和转录', '分角色声轨、电影与手机混音', '译配计划、连续性记录和离线重建'],
    46: ['普通话口述影像成片', '独立原声、旁白与混音', 'VTT、口述计划、播放器和离线重建']
  };
  const milestones = {
    40: {
      sol: ['抽取末段原声和角色参考', '检查本地 F5-TTS 试生成记录', '调整本地语音生成脚本', '检查预览渲染', '执行离线重建', '用本地 Whisper 复核译配'],
      luna: ['抽帧检查人物动作及口型', '分析对白残差声轨', '测试低内存 F5-TTS 生成', '检查译配工程及离线合成入口', '检查成片的口型与字幕帧', '剪出片段复核最终画面']
    },
    46: {
      sol: ['用本地 Whisper 定位原片对白', '以 Piper 生成逐句旁白', '加密抽帧核对后段动作', '编写音轨与成片的重建脚本', '编写可开关旁白的播放器', '校验交付文件和音画'],
      luna: ['按秒抽帧梳理原片镜头', '继续检查林间段的动作', '合成瓢虫段旁白', '生成开场红帽旁白', '装配播放器和交付文件', '执行离线重建命令']
    }
  };
  const allRuns = id => report.runs.filter(run => run.case === id);
  const runtimeNote = '> 本轮使用 Codex CLI、xhigh、Linux 工作区，作答不限时。离线重建仍按原题的验收时限执行。下文保留封存题面。看板内的音视频为完整时间轴的浏览器转码。';

  let sequence = Math.max(...registry.cases.map(item => Number(item.seq) || 0));
  for (const item of cases) {
    const key = caseKey(item.id);
    const source = caseData[item.id];
    const original = registry.cases.find(entry => entry.key === item.original);
    const runs = allRuns(item.id);
    if (!source) continue;
    const [first] = runs;
    const files = source.files.map(file => file.kind === 'video' ? {
      ...file, poster: 'variant-results/case-' + item.id + '/poster.jpg'
    } : file);
    registry.cases.push({
      key, resultKey: key, caseId: item.id, seq: ++sequence, status: 'packaged',
      category: original?.category || '音视频制作', versionLabel: '换素材变式',
      title: item.title + ' · 换素材变式', summary: item.source + '。' + item.finding,
      main: 'input/source.mp4', poster: 'variant-results/case-' + item.id + '/poster.jpg',
      directory: 'variant-results/case-' + item.id + '/candidate',
      task: runtimeNote + '\n\n' + source.task + '\n\n## 素材来源\n\n' + source.credit,
      contract: (source.task.match(/^## (?:交付|必交文件)[^\n]*\n[\s\S]*?(?=^## |(?![\s\S]))/m)?.[0] || source.task)
        + '\n\n## 评分\n\n' + item.method,
      files, delivery: delivery[item.id], resultCount: runs.length,
      resultSummary: runs.length ? runs.map(run => modelNames[run.model] + ' ' + run.score).join(' · ') : source.result_status
    });
    const toResult = run => ({
      model: run.model, effort: report.solver_effort, total: run.score, verified: run.score,
      accepted: run.passed, seconds: run.elapsed_seconds, gradeStatus: 'complete', artifacts: [], reports: [],
      integrity: {passed: true}
    });
    if (first) window.OMNIALE_RESULTS[key] = {...toResult(first), comparisons: runs.slice(1).map(toResult)};
  }

  function duration(value) {
    const seconds = Math.round(value);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds / 60) % 60;
    return (hours ? hours + '小时' : '') + minutes + '分' + String(seconds % 60).padStart(2, '0') + '秒';
  }

  function comparison(item) {
    const runs = allRuns(item.id);
    if (!runs.length) {
      const source = caseData[item.id];
      return '<article class="variant-case" data-variant-case="31"><p class="variant-case-id">Case 31</p>'
        + '<h2>多人会议字幕</h2><p>' + escape(source?.result_status || '更换素材中') + '</p>'
        + (source ? '<p>EasyCom Session 2 · 四位发言者</p><a class="button primary" href="#task-variant-31/task">查看新题包 ↗</a>'
          : '<p>先前发布的素材与原题同属 AMI IS1009a，已撤回这组变式成绩。</p><a class="variant-original" href="#task-12/task">查看原题 ↗</a>')
        + '</article>';
    }
    return `<article class="variant-case" data-variant-case="${item.id}">
      <div class="variant-case-head">
        <div><p class="variant-case-id">Case ${item.id}</p><h2>${item.title}</h2></div>
        <span class="variant-threshold">通过线 ${runs[0].threshold} 分</span>
      </div>
      <p class="variant-source">${escape(item.source)}</p>
      <div class="variant-scores">${runs.map(run => `
        <div class="variant-score">
          <span>${modelNames[run.model]}</span>
          <b data-variant-score="${run.score}">${run.score} <small>/ 100</small></b>
          <meter min="0" max="100" value="${run.score}" aria-label="${modelNames[run.model]}得分"></meter>
          <div class="variant-run-meta"><span>${duration(run.elapsed_seconds)}</span>
            <span class="${run.passed ? 'variant-pass' : 'variant-fail'}">${run.passed ? '通过' : '未通过'}</span></div>
        </div>`).join('')}</div>
      <p class="variant-finding">${escape(item.finding)}</p>
      <details class="variant-details">
        <summary>评分明细</summary>
        <p>${escape(item.method)}</p>
        ${runs.map((run, index) => `
          <h3>${modelNames[run.model]}</h3>
            <p>${escape(caseData[item.id].models[runs[index].model === 'gpt-6-luna' ? 'luna' : 'sol'].notes || item.notes?.[index] || item.review)}</p>
          <p class="variant-meta">封存校验 ${run.sealed_files_verified} 个文件 · 完成 ${run.verified_solver_responses}/${run.solver_requests} 次模型请求</p>
          ${run.failed_gates.length ? `<p class="variant-gates">${run.failed_gates.map(gate => `<code>${escape(gate)}</code>`).join(' ')}</p>` : ''}
        `).join('')}
        ${item.review ? `<p class="variant-meta">${escape(item.review)}</p>` : ''}
      </details>
      <a class="button primary" href="#${caseKey(item.id)}/task">查看变式题包 <span aria-hidden="true">↗</span></a>
    </article>`;
  }

  function overview(tasks, results, target) {
    if (!viewingVariants()) {
      previous.overview(tasks, results, target);
      target.querySelector('.hero')?.insertAdjacentHTML('afterend', `<a class="variant-entry" href="${route}">
        <span><b>变式题评测</b><small>会议字幕、中文配音与口述影像 · ${report.runs.length} 份已评分答卷</small></span>
        <span aria-hidden="true">↗</span></a>`);
      return;
    }

    document.querySelector('#breadcrumb').textContent = '变式题评测';
    document.querySelector('[data-view="results"]')?.classList.remove('active');
    target.innerHTML = `<section class="variant-dashboard" aria-labelledby="variant-title">
      <header class="variant-header">
        <div>
          <p class="variant-kicker">OmniALE · 2026年11月23日</p>
          <h1 id="variant-title">变式题评测</h1>
          <p>三道换素材变式沿用原题交付和评分规则，比较两种 Codex 模型的表现。</p>
        </div>
        <div class="variant-status"><strong>${report.runs.filter(run => run.passed).length} / ${report.runs.length}</strong><span>通过验收</span></div>
      </header>
      <dl class="variant-settings">
        <div><dt>作答</dt><dd>Codex ${escape(report.codex)} · ${escape(report.solver_effort)} · 不限时</dd></div>
        <div><dt>视觉裁判</dt><dd>${modelNames[report.visual_judge]}</dd></div>
        <div><dt>听觉裁判</dt><dd>${escape(report.audio_judge)}</dd></div>
      </dl>
      <div class="variant-grid">${cases.map(comparison).join('')}</div>
      <footer class="variant-footer">
        <span>听觉评分使用 DashScope 原生多模态接口。</span>
        <button type="button" class="button" data-variant-download>下载评测汇总 JSON</button>
      </footer>
    </section>`;
    target.querySelector('[data-variant-download]').addEventListener('click', downloadReport);
  }

  function downloadReport() {
    const file = new Blob([JSON.stringify(report, null, 2) + '\n'], {type: 'application/json'});
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'omniale-variant-results-20261123.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function syncNavigation() {
    if (!caseData[31] && /^#task-variant-31(?:\/|$)/.test(location.hash)) {
      location.replace(route);
    }
    navigation.classList.toggle('active', viewingVariants());
    if (viewingVariants()) navigation.setAttribute('aria-current', 'page');
    else navigation.removeAttribute('aria-current');
  }

  function answer(model, root) {
    return `<h3>封存答卷</h3>
      <video class="variant-video" controls playsinline preload="metadata" src="${escape(model.video.url)}"></video>
      <p class="result-note">完整成片的浏览器转码。${mediaLink(model.video.url, '下载视频', 'download')} · ${mediaLink(root + 'video_provenance.json', '视频校验记录', 'download')}</p>
      <div class="variant-answer-files">${model.files.map(file => mediaLink(file.url, file.name, 'download')).join('')}</div>`;
  }

  function process(model, item, alias, root) {
    return `<h3>作答过程</h3><ol class="variant-timeline">
      ${model.milestones.map((step, index) => `<li><strong>${escape(step.title || milestones[item.id]?.[alias]?.[index] || '运行工具')}</strong>
        <small>${escape(step.id)}${step.tools?.length ? ' · ' + escape(step.tools.join('、')) : ''}
        ${step.exit_code == null ? '' : ' · 退出码 ' + step.exit_code}</small></li>`).join('')}
      </ol><p class="result-note">按 Codex 日志中的工具调用顺序整理。共记录 ${model.actions} 次已结束的工具操作或文件修改。</p>
      <p>${mediaLink(root + 'process.json', '下载作答操作记录', 'download')}</p>`;
  }

  function breakdown(model, item, run, note, root) {
    const score = model.scoring;
    const isMeeting = item.id === 31;
    const isDub = item.id === 40;
    const isDescription = item.id === 46;
    const showVoiceClips = isDub && model.video.url.includes('/sol/') && score.voice_review;
    let computation = '';
    if (isMeeting) {
      const {content, delivery} = score.groups;
      computation = '内容 ' + pretty(content.score) + ' / ' + content.maximum
        + ' · 交付 ' + pretty(delivery.score) + ' / ' + delivery.maximum
        + ' · 质量系数 ' + delivery.coefficient.toFixed(5);
    } else if (isDub) {
      computation = ['E', 'T', 'A'].map(key => key + ' ' + pretty(score.groups[key].score) + ' / ' + score.groups[key].maximum)
        .join(' · ') + ' · 配音系数 ' + pretty(score.audio_coefficient ?? score.groups.A.score / 70)
        + ' · V ' + pretty(score.coefficient);
    } else if (isDescription) {
      computation = '视觉理解 ' + pretty(score.core) + ' / 100 · 交付 ' + pretty(score.delivery) + ' / '
        + score.delivery_max + ' · 交付系数 ' + pretty(score.coefficient)
        + ' · 封顶前 ' + pretty(score.raw) + ' · 封顶 ' + score.cap;
    }
    return `<h3>分数构成</h3><p>${escape(item.method)}</p>${computation ? `<p class="variant-calculation">${computation}</p>` : ''}
      <div class="score-table-wrap"><table class="result-table"><thead><tr><th scope="col">评分项</th><th scope="col">得分</th><th scope="col">满分</th></tr></thead>
        <tbody>${score.rows.map(row => `<tr><th scope="row">${isMeeting ? (row.group === 'content' ? '内容 · ' : '交付 · ') : ''}${escape(row.label || scoringLabels[row.id] || row.id)}</th>
          <td>${pretty(row.score)}</td><td>${pretty(row.maximum)}</td></tr>`).join('')}</tbody>
        <tfoot><tr><th scope="row">最终总分</th><td><strong>${run.score}</strong></td><td>100</td></tr></tfoot>
      </table></div>
      <h3>验收与扣分</h3><p>通过线 ${run.threshold} 分 · ${run.passed ? '通过' : '未通过'}。${escape(note)}</p>
      ${run.failed_gates.length ? `<p class="variant-gates">${run.failed_gates.map(gate => `<code>${escape(gate)}</code>`).join(' ')}</p>` : ''}
      ${item.review ? `<p class="result-note">${escape(item.review)}</p>` : ''}
      ${showVoiceClips ? `<details><summary>试听维克托的跨段音色</summary>
        <p class="result-note">片段做了音量匹配。时间为变式视频的时间轴。</p>
        ${[[22, 74], [26, 61]].map(pair => `<div class="score-table-wrap"><table class="result-table">
          <thead><tr><th scope="col">约在</th><th scope="col">官方原声</th><th scope="col">Sol 配音分轨</th></tr></thead>
          <tbody>${pair.map(second => `<tr><th scope="row">${second} 秒</th>${['source', 'sol'].map((track, index) =>
            `<td><audio controls preload="none" aria-label="${second} 秒 ${index ? '配音分轨' : '官方原声'}" src="variant-results/case-40/voice-review/${track}-${second}.wav"></audio></td>`).join('')}</tr>`).join('')}</tbody>
        </table></div>`).join('')}
      </details>` : ''}
      <p>${mediaLink(root + 'scoring.json', '下载分项评分记录', 'download')}</p>`;
  }

  function render(entry, record, target) {
    const item = cases.find(test => caseKey(test.id) === entry.key);
    if (!item) return previous.render(entry, record, target);
    const source = caseData[item.id];
    const runs = allRuns(item.id);
    if (!runs.length) {
      target.innerHTML = '<div class="result-empty"><h2>作答结果</h2><p>' + escape(source.result_status) + '</p></div>';
      return;
    }
    let alias = 'sol';
    let selected = 'answer';
    const tabs = [['answer', '答卷与成片'], ['process', '作答过程'], ['scores', '分数构成']];
    target.innerHTML = `<section class="variant-case-results" data-variant-results="${item.id}">
      <h2 class="result-section-title">模型作答对照</h2>
      <div class="score-table-wrap"><table class="result-table"><thead><tr><th scope="col">模型</th><th scope="col">用时</th><th scope="col">总分</th><th scope="col">验收</th></tr></thead>
      <tbody>${runs.map((run, index) => `<tr><td><button type="button" class="button" data-variant-model="${index ? 'luna' : 'sol'}">${modelNames[run.model]}</button></td><td>${duration(run.elapsed_seconds)}</td><td><b>${run.score}</b> / 100</td><td>${run.passed ? '通过' : '未通过'}</td></tr>`).join('')}</tbody></table></div>
      <p class="result-note">Codex ${escape(report.codex)} · ${escape(report.solver_effort)} · 不限时。视觉裁判 GPT‑6.2 Sol，听觉裁判 ${escape(report.audio_judge)}。</p>
      <div class="variant-result-nav" role="group" aria-label="作答结果分区">${tabs.map(([id, label]) => `<button type="button" class="button" data-variant-panel="${id}">${label}</button>`).join('')}</div>
      <div class="variant-result-content"></div>
      <p class="variant-result-links"><a href="#${item.original}/results">原题评分 ↗</a> <a href="${route}">三道变式汇总 ↗</a></p>
    </section>`;
    const content = target.querySelector('.variant-result-content');
    function update() {
      const index = alias === 'sol' ? 0 : 1;
      const model = source.models[alias];
      const root = reportRoot(item.id, alias);
      target.querySelectorAll('[data-variant-model]').forEach(button => {
        button.setAttribute('aria-pressed', String(button.dataset.variantModel === alias));
      });
      target.querySelectorAll('[data-variant-panel]').forEach(button => {
        button.setAttribute('aria-pressed', String(button.dataset.variantPanel === selected));
      });
      if (selected === 'process') content.innerHTML = process(model, item, alias, root);
      else if (selected === 'scores') content.innerHTML = breakdown(model, item, runs[index], model.notes || item.notes?.[index] || item.review, root);
      else content.innerHTML = answer(model, root);
    }
    target.querySelectorAll('[data-variant-model]').forEach(button => button.addEventListener('click', () => {
      alias = button.dataset.variantModel;
      update();
    }));
    target.querySelectorAll('[data-variant-panel]').forEach(button => button.addEventListener('click', () => {
      selected = button.dataset.variantPanel;
      update();
    }));
    update();
  }

  window.OmniResults = Object.freeze({...previous, overview, render});
  window.addEventListener('hashchange', syncNavigation);
  syncNavigation();
})();
