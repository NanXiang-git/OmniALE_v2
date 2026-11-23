(() => {
  'use strict';
  const report = window.OMNIALE_VARIANT_RESULTS;
  const previous = window.OmniResults;
  const route = '#results/variants';
  const navigation = document.querySelector('[data-variant-nav]');
  if (!report || !previous || !navigation) return;

  const cases = [
    {
      id: 31, title: '多人会议字幕', original: 'task-12', source: 'AMI Meeting Corpus · IS1009a',
      method: '按原题的时间对齐、说话人、重叠对白、文字、格式、一致性、可读性及重建规则计分。',
      finding: '两份答卷均通过离线重建，主要失分在说话人归属、重叠对白和时间对齐。',
      notes: [
        'Sol 在部分窗口漏交关键信息，预览呈现也有问题。1 个复核窗口记录了标注争议。',
        'Luna 的重叠对白项为 0 分，ASS 与 SRT 一致性未达门槛。2 个复核窗口记录了标注争议。'
      ],
      review: '重建评分兼容题包素材目录、可写临时目录及文件形式的输出路径。'
    },
    {
      id: 40, title: '中文配音', original: 'task-13', source: '《Cosmos Laundromat: First Cycle》· 02:48–04:07',
      method: '总分 =（英文理解 E + 中文译文 T）×（配音 A ÷ 70）× 画面系数 V ×（100 ÷ 30）。',
      finding: '两份答卷均超过 80 分，并触发原题硬门槛。',
      notes: [
        '约 26 秒处译配丢失原声在 “you’re…” 后的明显犹豫停顿。离线重建通过。',
        '末段 76.25–78.708 秒的维克托台词进入弗兰克轨。拒绝句缺少原声的停顿。离线重建在 600 秒内未完成。'
      ],
      review: '使用补充画面和官方角色分轨复核。英文词错率按复核后的原声转录计词，排除时间戳和说话人标签。两份连续性记录各有一项时间窗诊断待确认。'
    },
    {
      id: 46, title: '口述影像', original: 'task-14', source: '《Sprite Fright》· 81 秒片段',
      method: '按原题权重合并叙事核心与交付评分，并应用关键揭示等封顶规则。',
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

  function duration(value) {
    const seconds = Math.round(value);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds / 60) % 60;
    return (hours ? hours + '小时' : '') + minutes + '分' + String(seconds % 60).padStart(2, '0') + '秒';
  }

  function comparison(item) {
    const runs = report.runs.filter(run => run.case === item.id);
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
          <p>${escape(item.notes[index])}</p>
          <p class="variant-meta">封存校验 ${run.sealed_files_verified} 个文件 · 完成 ${run.verified_solver_responses}/${run.solver_requests} 次模型请求</p>
          ${run.failed_gates.length ? `<p class="variant-gates">${run.failed_gates.map(gate => `<code>${escape(gate)}</code>`).join(' ')}</p>` : ''}
        `).join('')}
        ${item.review ? `<p class="variant-meta">${escape(item.review)}</p>` : ''}
      </details>
      <a class="variant-original" href="#${item.original}/results">查看原题评分 <span aria-hidden="true">↗</span></a>
    </article>`;
  }

  function overview(tasks, results, target) {
    if (!viewingVariants()) {
      previous.overview(tasks, results, target);
      target.querySelector('.hero')?.insertAdjacentHTML('afterend', `<a class="variant-entry" href="${route}">
        <span><b>变式题评测</b><small>会议字幕、中文配音与口述影像 · 六份答卷</small></span>
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
    navigation.classList.toggle('active', viewingVariants());
    if (viewingVariants()) navigation.setAttribute('aria-current', 'page');
    else navigation.removeAttribute('aria-current');
  }

  window.OmniResults = Object.freeze({...previous, overview});
  window.addEventListener('hashchange', syncNavigation);
  syncNavigation();
})();
