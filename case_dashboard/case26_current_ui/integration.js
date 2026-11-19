(() => {
  'use strict';
  const data = window.CASE26_LATEST, prior = window.OmniResults;
  const task = window.OMNIALE_DATA?.cases.find(x => x.key === 'task-05');
  if (!data || !prior || !task) return;
  const E = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const F = value => Number.isFinite(value) ? value.toFixed(4) : '待评';
  const budget = m => m.budget == null ? '不限时' : `${m.budget / 60} 分钟`;
  const size = bytes => bytes >= 1e6 ? `${(bytes / 1e6).toFixed(1)} MB` : `${(bytes / 1e3).toFixed(1)} KB`;
  const names = {restoration:'分段修复改善',motion_detail:'运动细节',temporal:'时间连续性',lighting:'设计光变',protected:'正常画面保护',motion_evidence:'真实动作保留',restoration_quality:'实际修复质量',lighting_intent:'灯光意图',relative_improvement:'相对改善',absolute_waveform:'绝对波形保真',spectral_fidelity:'频谱保真',musical_onsets:'音乐起音',damage_events:'损伤事件恢复',stereo_preservation:'立体声保留',normal_protection:'正常音频保护',musical_content:'音乐内容',timbre_detail:'音色细节',audible_artifacts:'听觉伪影',light_tile_error:'局部光照误差超限'};
  const audioMax = {relative_improvement:6,absolute_waveform:6,spectral_fidelity:6,musical_onsets:2,damage_events:1,stereo_preservation:1,normal_protection:2};
  Object.assign(task, data.case);
  delete task.previousResultKey;
  delete task.experimentReport;
  const newest = data.models[0];
  window.OMNIALE_RESULTS['task-05'] = {
    key:'task-05', model:newest.model, effort:newest.effort, total:newest.score.formal_total,
    verified:newest.score.formal_total, accepted:newest.score.accepted, gradeStatus:'complete',
    pendingPoints:0, automatic:null, judge:null, automaticMax:52, judgeMax:48,
    rows:[{maximum:100, points:newest.score.formal_total}], artifacts:newest.artifacts,
    seconds:newest.seconds, timedOut:false, comparisons:data.models.slice(1), integrity:{passed:true}
  };
  let selected = newest.key, section = 'media';
  function media(m) {
    return `<video class="c26-player" controls playsinline preload="metadata" src="${E(m.media)}" aria-label="${E(m.model)} 最新修复成片"></video>
      <div class="c26-media-label"><span>26 秒 · 640 × 338 · 24 fps · 含音乐</span><a href="${E(m.media)}" target="_blank" rel="noopener">单独打开成片 ↗</a></div>
      <p class="c26-note">此处为浏览器播放副本；原始音视频、无损母版及音轨见“交付与记录”。</p>
      <details><summary>对照受损输入与干净参考</summary><p class="c26-note">干净参考仅供评后复核，答题模型无法访问。</p><div class="c26-comparison"><div><p>受损音画输入</p><video controls playsinline preload="none" src="${E(data.input)}" aria-label="受损音画输入"></video></div><div><p>干净参考</p><video controls playsinline preload="none" src="${E(data.reference)}" aria-label="评后干净参考"></video></div></div></details>
      <details><summary>单独听无损修复音轨</summary><audio controls preload="none" src="${E(m.audio)}" aria-label="${E(m.model)} 修复音轨"></audio></details>`;
  }
  function table(rows) {
    return `<div class="c26-table-scroll"><table class="c26-score-table"><thead><tr><th>评分项</th><th>得分</th><th>满分</th></tr></thead><tbody>${rows.map(([key, points, max]) => `<tr><td>${E(names[key] || key)}</td><td>${F(points)}</td><td>${Number(max.toFixed(4))}</td></tr>`).join('')}</tbody></table></div>`;
  }
  function evidence(items) {
    return Object.entries(items).map(([key, item]) => `<details><summary>${E(names[key] || key)} · ${item.rating === 0 ? '零分档' : item.rating === .5 ? '半分档' : '满分档'}${item.confirmation ? ' · 已独立复核' : ''}</summary><p>${E(item.reason)}</p>${(item.evidence || []).map(e => `<div class="c26-evidence"><span>${E(e.source_time || (e.source_interval || []).join('–') + ' 秒')}</span>${E(e.reason || e.finding)}</div>`).join('')}</details>`).join('');
  }
  function scores(m) {
    const s = m.score, v = s.visual;
    const automatic = Object.entries(v.automatic_scores).map(([k, n]) => [k, n * .7, v.quality_weights.automatic[k] * .7]);
    const visual = Object.entries(v.judge_scores).map(([k, n]) => [k, n * .7, v.quality_weights.judge[k] * .7]);
    const audio = Object.entries(s.audio_automatic.automatic_scores).map(([k, n]) => [k, n, audioMax[k] || 0]);
    const listening = Object.entries(m.audioJudge).map(([k, x]) => [k, x.rating * 2, 2]);
    const failures = [...s.hard_failures, ...s.critical_failures];
    return `<div class="c26-grid"><div class="c26-metric">视觉<strong>${F(s.visual_points)} <small>/ 70</small></strong></div><div class="c26-metric">音频<strong>${F(s.audio_points_verified)} <small>/ 30</small></strong></div><div class="c26-metric">正式总分<strong>${F(s.formal_total)} <small>/ 100</small></strong></div></div>
      <div class="c26-failure"><b>${s.accepted ? '通过' : '未通过'}</b> · ${failures.length ? failures.map(k => E(names[k] || k)).join('；') : '总分或分域分数未达通过线'}。待评项：${s.pending.length}。</div>
      <p class="c26-note">总分 = 视觉分 + 音频分。视觉分 = 0.7 × 合规系数 ${v.compliance.coefficient} ×（自动质量40 + 视觉评审60）；音频 = 客观24 + 听评6。通过需总分≥80、视觉≥42、音频≥18，且无硬约束或核心失败。</p>
      <p class="c26-note">下表视觉项已折算至70分权重；沿用评分器的分阶段舍入，显示四位小数。</p>
      <h3>视觉分项 · / 70</h3>${table([...automatic, ...visual])}
      <h3>音频分项 · / 30</h3>${table([...audio, ...listening])}
      <details><summary>查看视觉扣分证据与时间点</summary>${evidence(m.visualJudge)}</details>
      <details><summary>查看听评证据与时间段</summary><p class="c26-note">听评使用实际音频、匿名对照和正常段校验；零分按原协议独立复核。裁判的乐器名称或失真比喻不等同于客观身份及波形事实。</p>${evidence(m.audioJudge)}</details>
      <a href="${E(m.links.score)}" target="_blank" rel="noopener">打开完整评分 JSON ↗</a>`;
  }
  function records(m) {
    return `<h3>本次运行</h3><dl class="c26-facts"><div><dt>模型 / 推理</dt><dd>${E(m.model)} / ${E(m.effort)}</dd></div><div><dt>预算 / 实际用时</dt><dd>${budget(m)} / ${(m.seconds / 60).toFixed(2)} 分钟</dd></div><div><dt>完成时间（北京时间）</dt><dd>${m.date}</dd></div><div><dt>运行工具</dt><dd>${E(m.harness)}</dd></div><div><dt>封存与核验</dt><dd>${m.sealedFiles} 个文件 · 哈希一致</dd></div><div><dt>工具与接口</dt><dd>${m.commands} 次完成命令 · ${m.apiFailed} 次 API 失败</dd></div></dl>
      <div class="c26-links">${[['report','实验报告'],['score','评分原始记录'],['audit','完整性核验'],['settings','实验配置'],['trace','工具轨迹']].map(([k,label]) => `<a class="button" href="${E(m.links[k])}" target="_blank" rel="noopener">${label} ↗</a>`).join('')}</div>
      <h3>冻结交付文件</h3><div class="c26-table-scroll"><table class="c26-file-table"><thead><tr><th>文件</th><th>大小</th><th>操作</th></tr></thead><tbody>${m.artifacts.map(f => `<tr><td>${E(f.name)}</td><td>${size(f.bytes)}</td><td><a href="${E(f.url)}" download="${E(f.name)}">下载</a></td></tr>`).join('')}</tbody></table></div><p class="c26-note">试次：${E(m.run)}。同一模型的旧试次与启动失败记录保留在实验目录，当前页只列最新的已评分封存答卷。</p>`;
  }
  function render(c, r, target) {
    if (c.key !== 'task-05') return prior.render(c, r, target);
    const m = data.models.find(x => x.key === selected) || newest;
    target.querySelectorAll('video,audio').forEach(el => el.pause());
    target.innerHTML = `<div class="c26" data-case26-current><header class="c26-intro"><div><p class="c26-kicker">CASE 26 · 最新实验</p><h2>弱光画面 × 较重档音乐修复</h2><p>同题 ${data.models.length} 个模型 · 每个模型只保留最新一次展示</p></div><span class="c26-chip">全部评分完成</span></header>
      <details class="c26-task-brief"><summary>题目目标与交付要求</summary><p>修复26秒弱光视频与受损器乐：降低噪声、色斑、拖影和异常闪动，同时保留动作、设计光变、音符、节奏和立体声。画面640×338、24fps、624帧；音频48kHz双声道。</p><p>交付无损画面、可重放修订层、无损音轨、音视频预览及说明。画面保护窗为0–2、11–12、25–26秒；音频保护窗为0–2、24–26秒。</p><p><a href="#task-05/task">完整题面</a> · <a href="#task-05/materials">输入素材</a> · <a href="#task-05/delivery">交付规范</a></p></details>
      <div class="c26-table-scroll"><table data-c26-models><thead><tr><th>模型 / 最新完成日期</th><th>推理 / 预算</th><th>视觉 / 70</th><th>音频 / 30</th><th>总分 / 100</th><th>答卷</th></tr></thead><tbody>${data.models.map(x => `<tr data-model="${E(x.model)}" class="${x.key === m.key ? 'c26-selected' : ''}"><td><b>${E(x.model)}</b><small>${x.date.split(' ')[0]}</small></td><td>${E(x.effort)}<small>${budget(x)}</small></td><td>${F(x.score.visual_points)}</td><td>${F(x.score.audio_points_verified)}</td><td><b class="c26-total">${F(x.score.formal_total)}</b><small class="c26-status">${x.score.accepted ? '通过' : '未通过'}</small></td><td><button class="c26-select" data-c26-model="${x.key}" aria-pressed="${x.key === m.key}">${x.key === m.key ? '正在查看' : '查看答卷'}</button></td></tr>`).join('')}</tbody></table></div>
      <p class="c26-note">这 ${data.models.length} 次实验使用相同较重档输入与评分规则；推理强度、时间预算不同，成绩不代表同等算力预算下的排名。</p>
      <section class="c26-selected-run" aria-label="选中模型的最新答卷"><div class="c26-run-heading"><div><h3>${E(m.model)} <span class="c26-chip">${E(m.effort)} · ${budget(m)}</span></h3><p class="c26-note">实际用时 ${(m.seconds / 60).toFixed(2)} 分钟 · ${m.date} 完成（北京时间）</p></div></div>
      <div class="c26-section-tabs" role="tablist" aria-label="模型结果分区">${[['media','修复成片'],['scores','评分与扣分'],['records','交付与记录']].map(([key,label]) => `<button role="tab" id="c26-tab-${key}" aria-selected="${section === key}" aria-controls="c26-content" tabindex="${section === key ? 0 : -1}" data-c26-section="${key}">${label}</button>`).join('')}</div><div id="c26-content" role="tabpanel" aria-labelledby="c26-tab-${section}">${section === 'scores' ? scores(m) : section === 'records' ? records(m) : media(m)}</div></section></div>`;
    target.querySelectorAll('[data-c26-model]').forEach(button => button.addEventListener('click', () => {
      selected = button.dataset.c26Model; render(c, r, target);
      target.querySelector(`[data-c26-model="${selected}"]`).focus({preventScroll:true});
    }));
    target.querySelectorAll('[data-c26-section]').forEach(button => {
      button.addEventListener('click', () => {section = button.dataset.c26Section; render(c, r, target); target.querySelector(`[data-c26-section="${section}"]`).focus({preventScroll:true});});
      button.addEventListener('keydown', event => {
        if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
        event.preventDefault();
        event.stopPropagation();
        const keys = ['media','scores','records'], i = keys.indexOf(section);
        section = keys[event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (i + (event.key === 'ArrowRight' ? 1 : 2)) % 3];
        render(c, r, target); target.querySelector(`[data-c26-section="${section}"]`).focus({preventScroll:true});
      });
    });
    target.querySelectorAll('video,audio').forEach(el => el.addEventListener('play', () => target.querySelectorAll('video,audio').forEach(other => {if (other !== el) other.pause();})));
  }
  window.OmniResults = Object.freeze({...prior, render, overview(cases, records, target) {
    prior.overview(cases, records, target);
    const row = target.querySelector('table.score-overview a[href="#task-05/results"]')?.closest('tr');
    if (row) {
      row.classList.add('c26-overview');
      row.innerHTML = `<td><a href="#task-05/results"><b>05 · ${E(task.title)}</b><small>每模型最新一次 · ${data.models.length} 组</small></a></td><td colspan="4">${data.models.map(m => `<div>${E(m.model)} · <b>${F(m.score.formal_total)}</b> / 100 <small>${E(m.effort)} · ${budget(m)}</small></div>`).join('')}</td><td>评分完成 · 均未通过</td><td><a class="button" href="#task-05/results">查看 ↗</a></td>`;
    }
  }});
})();
