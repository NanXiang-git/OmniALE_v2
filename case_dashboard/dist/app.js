(() => {
  'use strict';
  const data = window.OMNIALE_DATA;
  const main = document.querySelector('#main');
  if (!data) { main.innerHTML = '<div class="empty"><h1>题目索引尚未生成</h1><p>请先运行 case_dashboard/build.py。</p></div>'; return; }
  const categories = [...new Set(data.cases.map(c => c.category))];
  const state = { view: 'packages', category: '全部', query: '', media: 'all', layout: 'grid', current: null, tab: 'task', fileKind: 'all', fileQuery: '', fileLimit: 50 };
  const symbols = { video: '▷', audio: '♫', image: '▧', document: '≡', project: '◇' };
  const labels = { video: '视频', audio: '音频', image: '图片', document: '文档', project: '工程' };
  const delivery = {
    1: ['横版 master.mp4 · 118–122 秒', '竖版 vertical.mp4 · 49–51 秒', 'edit / events / fact_check JSON', 'submission.json 交付索引'],
    2: ['横竖双版 MP4 · 各 8 秒 / 240 帧', '自包含 project.blend', 'events.json 音画事件', 'submission.json 交付索引'],
    3: ['两条绿底 MP4 · 各 4 秒 / 100 帧', 'Resolve 实际工程与渲染记录', 'report.json 处理报告', 'submission.json 交付索引'],
    4: ['video.mp4 · 24–28 秒', 'mix / foley / ambience WAV', 'edit.json 可重建工程', 'notes.json 与 submission.json'],
    5: ['restored.mkv 无损母版', 'preview.mp4 浏览预览', 'repair.mkv 可编辑修订层', 'project / report / submission JSON'],
    6: ['commentary.mp4 · 510–570 秒', '旁白 / 原声两条全长 WAV', '中文字幕 SRT 与解说稿', '时间线 / 来源 / 事实 / 工程 JSON'],
    7: ['flags.json 全部触发与反例', 'report.md 中文复核报告'],
    8: ['states.csv 六对象全时轴', 'issues.json 矛盾及复核记录', 'report.md 中文审核报告'],
    9: ['匿名成片、音频及字幕', '逐帧遮罩与匿名封面', '可重建工程与编辑记录'],
    10: ['新版课程与真实描述音频', '描述字幕、章节与播放器配置', '时间映射和可重建工程'],
    11: ['accessible_course.mp4', 'mix / base / ad 轨及逐条 WAV', 'VTT、描述计划、时间线、章节', '播放器、修订审计及离线重建'],
    12: ['interview.ass / interview.srt', 'preview.mp4 烧录预览', 'alignment.json 对轴映射', '重建脚本、rebuild.json 与 README'],
    13: ['dub_zh.mp4 普通话译制片', '电影 / 手机混音、音效与角色轨', '中英 SRT 与双语 ASS', '翻译计划、混音、连续性及重建'],
    14: ['accessible.mp4 口述影像', 'mix / base / ad 轨及逐条 WAV', 'ad.vtt 与描述计划', '取舍审计、播放器配置及重建']
  };
  const esc = v => String(v ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const url = p => /^https?:\/\//i.test(String(p)) ? encodeURI(String(p)) : String(p).split('/').map(encodeURIComponent).join('/');
  const bytes = n => n >= 1e9 ? (n / 1e9).toFixed(2) + ' GB' : n >= 1e6 ? (n / 1e6).toFixed(1) + ' MB' : n >= 1e3 ? (n / 1e3).toFixed(1) + ' KB' : n + ' B';
  const duration = n => n ? (n >= 3600 ? Math.floor(n / 3600) + ':' : '') + (n >= 3600 ? String(Math.floor(n % 3600 / 60)).padStart(2,'0') : Math.floor(n / 60)) + ':' + String(Math.floor(n % 60)).padStart(2,'0') : '';
  const kindCount = (c, kind) => c.files.filter(f => f.kind === kind).length;
  const currentCase = key => { if(key?.startsWith('result-') || key?.startsWith('report-')) { const base=key.slice(7); const c=data.cases.find(c=>c.key===base); return c ? {...c,key,files:(resultData[base]?.[key.startsWith('report-')?'reports':'artifacts'] || [])} : null; } return [...data.cases, ...data.catalogue].find(c => c.key === key); };
  const mainFile = c => c.files?.find(f => f.path === c.main);
  const fileUrl = f => url(f.url);
  const previewUrl = f => f.preview ? url(f.preview) : fileUrl(f);
  let resultData = window.OMNIALE_RESULTS || {};
  let toastTimer;
  function toast(text) { const el = document.querySelector('#toast'); el.textContent = text; el.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2200); }
  function markdown(text, c) {
    const template = document.createElement('template');
    template.innerHTML = window.marked.parse(text || '', { gfm: true });
    const allowed = new Set('P H1 H2 H3 H4 H5 H6 UL OL LI STRONG EM B I DEL A CODE PRE TABLE THEAD TBODY TR TH TD BLOCKQUOTE HR BR IMG INPUT'.split(' '));
    for (const el of [...template.content.querySelectorAll('*')]) {
      if (!allowed.has(el.tagName)) { el.replaceWith(document.createTextNode(el.textContent)); continue; }
      const href = el.getAttribute('href');
      const src = el.getAttribute('src');
      const alt = el.getAttribute('alt');
      for (const a of [...el.attributes]) el.removeAttribute(a.name);
      if (el.tagName === 'INPUT') { el.type = 'checkbox'; el.disabled = true; }
      if (el.tagName === 'A' && href) {
        const normalized = href.replace(/^\.\//,'').replaceAll('\\', '/');
        const index = c?.files?.findIndex(f => f.path === normalized || f.name === normalized) ?? -1;
        if (index >= 0) { el.href = fileUrl(c.files[index]); el.dataset.file = index; el.dataset.case = c.key; }
        else if (/^https?:\/\//i.test(href)) { el.href = href; el.target = '_blank'; el.rel = 'noopener noreferrer'; }
      }
      if (el.tagName === 'IMG') {
        const file = c?.files?.find(f => f.path === src?.replace(/^\.\//,''));
        if (file) { el.src = fileUrl(file); el.alt = alt || file.name; el.loading = 'lazy'; }
        else el.remove();
      }
    }
    return template.innerHTML;
  }
  function mediaMeta(f) {
    const m = f.meta || {};
    return [duration(m.duration), m.width ? `${m.width} × ${m.height}` : '', m.fps && m.fps !== '0/0' ? ((+m.fps.split('/')[0] / +m.fps.split('/')[1]).toFixed(2).replace(/\.00$/,'') + ' fps') : '', m.sampleRate ? (Number(m.sampleRate)/1000) + ' kHz' : '', bytes(f.bytes)].filter(Boolean).join(' · ');
  }
  function modelCover() { return '<div class="model-cover"><div class="model-mark">ORBIT<small>3D PRODUCT / C1</small></div></div>'; }
  function card(c) {
    if (c.status === 'concept') return `<article class="case-card concept-card"><div class="card-body"><span class="concept-index">${String(c.caseId).padStart(2,'0')}</span><div class="card-kicker"><span class="task-number">CASE ${String(c.caseId).padStart(2,'0')}</span></div><h2><button class="title-link" data-open="${c.key}">${esc(c.title)}</button></h2><p class="card-description">${esc(c.summary)}</p><div class="card-tags"><span class="tag ${c.packages.length ? 'category' : ''}">${c.packages.length ? '已有 ' + c.packages.length + ' 个正式题包' : '概念策划'}</span></div></div><div class="card-footer"><span>${c.packages.length ? '题序 ' + c.packages.join(' / ') : '尚无本地正式素材包'}</span><button data-open="${c.key}">查看概念 <span>↗</span></button></div></article>`;
    const f = mainFile(c);
    const kinds = ['video','audio','image','project'].filter(k => kindCount(c,k));
    return `<article class="case-card"><button class="card-cover" data-open="${c.key}" aria-label="查看第 ${c.seq} 题 ${esc(c.title)}">${c.poster ? `<img src="${url(c.poster)}" alt="第 ${c.seq} 题输入素材预览" loading="lazy">` : modelCover()}<span class="cover-label">${esc(c.versionLabel || 'HARD V2')}</span><span class="cover-bottom">${c.poster ? 'INPUT PREVIEW' : 'BLENDER PROJECT'}</span>${f?.meta?.duration ? `<span class="cover-duration">${duration(f.meta.duration)}</span>` : ''}</button><div class="card-body"><div class="card-kicker"><span class="task-number">TASK ${String(c.seq).padStart(2,'0')}</span><span class="case-id">CASE ${String(c.caseId).padStart(2,'0')}</span></div><h2><button class="title-link" data-open="${c.key}">${esc(c.title)}</button></h2><p class="card-description">${esc(c.summary)}</p><div class="card-tags"><span class="tag category">${esc(c.category)}</span>${kinds.map(k => `<span class="tag">${symbols[k]} ${labels[k]} ${kindCount(c,k)}</span>`).join('')}</div></div><div class="card-footer"><span><i class="result-dot"></i>${c.experimentReport ? 'API 实验已评 · 正式分待校准' : resultData[c.resultKey || c.key]?.verified != null ? `已核实 ${resultData[c.resultKey || c.key].verified.toFixed(2)} · 总分待评` : c.experimentStatus === 'prepared_not_experimented' ? '新版已准备 · 尚未实验' : '答卷已冻结 · 未评分'}</span><button data-open="${c.key}">查看题目 <span>↗</span></button></div></article>`;
  }
  function renderNav() {
    document.querySelectorAll('[data-view]').forEach(b => b.classList.toggle('active', b.dataset.view === state.view));
    document.querySelector('#category-nav').innerHTML = categories.map(cat => `<button class="category-item ${state.category === cat && state.view === 'packages' ? 'active' : ''}" data-category="${esc(cat)}">${esc(cat)}<span>${data.cases.filter(c => c.category === cat).length.toString().padStart(2,'0')}</span></button>`).join('');
    document.querySelector('#breadcrumb').textContent = state.current ? (state.current.status === 'concept' ? `Case ${String(state.current.caseId).padStart(2,'0')} · 概念条目` : `第 ${state.current.seq} 题 / Case ${String(state.current.caseId).padStart(2,'0')}`) : state.view === 'packages' ? '正式题包' : state.view === 'results' ? '答卷与评分' : '全部 Case 图谱';
  }
  function filteredCases() {
    let cases = state.view === 'packages' ? data.cases : data.catalogue;
    const q = state.query.trim().toLowerCase();
    return cases.filter(c => {
      if (state.view === 'packages' && state.category !== '全部' && c.category !== state.category) return false;
      if (state.view === 'packages' && state.media !== 'all' && !kindCount(c, state.media)) return false;
      if (state.view === 'concepts' && state.media === 'packaged' && !c.packages.length) return false;
      if (state.view === 'concepts' && state.media === 'concept' && c.packages.length) return false;
      return !q || `${c.title} ${c.summary} ${c.task} ${c.category} case${String(c.caseId).padStart(2,'0')} case ${c.caseId} ${c.seq ? '第'+c.seq+'题 task'+String(c.seq).padStart(2,'0') : ''}`.toLowerCase().includes(q);
    });
  }
  function updateCards() {
    const cases = filteredCases();
    document.querySelector('#cards').innerHTML = cases.length ? cases.map(card).join('') : '<div class="empty"><h3>没有匹配的题目</h3><p>试试其他关键词，或清除筛选条件。</p><button class="button" data-reset>清除筛选</button></div>';
    document.querySelector('#shown-count').textContent = `${cases.length} / ${state.view === 'packages' ? 14 : 48}`;
  }
  function renderList() {
    state.current = null;
    renderNav();
    const concepts = state.view === 'concepts';
    const allFiles = data.cases.flatMap(c => c.files);
    const videoCount = allFiles.filter(f => f.kind === 'video').length;
    const imageCount = allFiles.filter(f => f.kind === 'image').length;
    main.innerHTML = `<section class="hero animate-in"><div><span class="eyebrow">OMNIALE / ${concepts ? 'CASE LANDSCAPE' : 'BENCHMARK COLLECTION'}</span><h1>${concepts ? '全部 Case 图谱' : '真实任务，多模态交付。'}<span>${concepts ? '48 ideas.' : 'See. Hear. Create.'}</span></h1><p>${concepts ? '48 个任务概念，从现实委托到输入、输出与评测设计。已有正式题包的条目可继续进入实际题面。' : '在这里浏览 14 道困难版任务，阅读完整题面、查看输入素材与交付要求。<br>每一题，都从真实的画面、声音和制作决策开始。'}</p></div><div class="hero-badge"><span class="status-dot"></span>${concepts ? '概念清单 · 48 CASES' : '困难版 V2 · 公开题面'}</div></section><section class="metrics" aria-label="题库概况"><div class="metric"><div class="metric-top">正式题包<span>▦</span></div><div class="metric-value"><strong>14</strong><span>独立任务 / ${new Set(data.cases.map(c=>c.caseId)).size} 个 Case</span></div></div><div class="metric"><div class="metric-top">视频素材<span>▷</span></div><div class="metric-value"><strong>${videoCount}</strong><span>可直接预览</span></div></div><div class="metric"><div class="metric-top">图片素材<span>▧</span></div><div class="metric-value"><strong>${imageCount}</strong><span>含逐帧序列</span></div></div><div class="metric"><div class="metric-top">能力维度<span>◈</span></div><div class="metric-value"><strong>${categories.length.toString().padStart(2,'0')}</strong><span>从感知到交付</span></div></div></section><section aria-label="题目列表"><div class="library-toolbar"><div class="library-title">${concepts ? '概念索引' : '探索题目'}<small id="shown-count"></small></div><label class="search"><span aria-hidden="true">⌕</span><input id="search" type="search" aria-label="搜索题目" placeholder="搜索题目、Case 或关键词" value="${esc(state.query)}"></label><select class="filter-select" id="media-filter" aria-label="${concepts?'题包状态':'素材类型'}">${concepts ? '<option value="all">全部状态</option><option value="packaged">已有正式题包</option><option value="concept">仅概念策划</option>' : '<option value="all">全部素材类型</option><option value="video">含视频素材</option><option value="audio">含音频素材</option><option value="image">含图片素材</option><option value="project">含工程文件</option>'}</select><div class="view-switch" aria-label="列表布局"><button class="${state.layout==='grid'?'active':''}" data-layout="grid" aria-label="卡片布局" aria-pressed="${state.layout==='grid'}">▦</button><button class="${state.layout==='list'?'active':''}" data-layout="list" aria-label="列表布局" aria-pressed="${state.layout==='list'}">≡</button></div></div>${concepts ? '<div class="catalogue-note"><span>◈</span><span>概念条目保留总表原文。正式题包采用对应 TASK.md；两者有差异时，以正式题面为准。</span></div>' : `<div class="chips" aria-label="能力维度筛选">${['全部', ...categories].map(cat=>`<button class="chip ${state.category===cat?'active':''}" data-category="${esc(cat)}">${esc(cat)}</button>`).join('')}</div>`}<div id="cards" class="cards ${state.layout==='list'?'list':''}"></div></section>`;
    document.querySelector('#media-filter').value = state.media;
    document.querySelector('#search').addEventListener('input', e => { state.query = e.target.value; updateCards(); });
    document.querySelector('#media-filter').addEventListener('change', e => { state.media = e.target.value; updateCards(); });
    updateCards();
  }
  function videoHtml(f) {
    if(f.originalUnavailable && !f.url && !f.preview) return `<div class="proxy-note">媒体大文件暂未上传。题面、评分和文字报告可正常查看。</div>`;
    return `<video controls playsinline preload="metadata" ${f.poster ? `poster="${url(f.poster)}"` : ''} src="${previewUrl(f)}" data-media-error="${esc(fileUrl(f))}">浏览器不支持视频播放，请打开原文件。</video>`;
  }
  function renderDetail(c) {
    state.current = c;
    renderNav();
    if (c.status === 'concept') {
      main.innerHTML = `<button class="back-button" data-back>← 返回 Case 图谱</button><div class="detail-heading"><div><div class="detail-labels"><span class="badge neutral">概念策划</span><span class="case-id">CASE ${String(c.caseId).padStart(2,'0')}</span></div><h1>${esc(c.title)}</h1><p>${esc(c.summary)}</p></div></div><div class="concept-content"><div class="concept-links">${c.packages.map(n=>`<button class="button primary" data-open="task-${String(n).padStart(2,'0')}">打开第 ${n} 题正式题包 ↗</button>`).join('')}</div><div class="panel markdown">${markdown(c.task,c)}</div><p class="source-note">来源：所有case汇总.md · ${c.packages.length ? '此处为概念原文，实际作答请使用对应正式题面。' : '该概念尚未收录本地正式题包和输入媒体。'}</p></div>`;
      return;
    }
    const f = mainFile(c);
    const docs = c.files.filter(f => /^(TASK\.md|OUTPUT_CONTRACT\.md|(?:public_)?rules\.json|output_schema\.json|submission_schema\.json|SCORING\.md)$/.test(f.name));
    const totals = c.files.reduce((n,f)=>n+f.bytes,0);
    main.innerHTML = `<button class="back-button" data-back>← 返回题库</button><div class="detail-heading animate-in"><div><div class="detail-labels"><span class="badge">${esc(c.versionLabel || 'HARD V2')}</span><span class="badge neutral">${esc(c.category)}</span><span class="case-id">第 ${c.seq} 题 / CASE ${String(c.caseId).padStart(2,'0')}</span></div><h1>${esc(c.title)}</h1><p>${esc(c.summary)}</p></div><div class="heading-actions"><button class="button" data-copy-link>复制题目链接 ↗</button><a class="button primary" href="${fileUrl(c.files.find(f=>f.name==='TASK.md'))}" target="_blank" rel="noopener">打开原始题面 ↗</a></div></div><div class="detail-layout"><div class="detail-main"><div class="spotlight">${f ? videoHtml(f) : modelCover()}<div class="spotlight-footer"><span>${f ? `${esc(f.path)} · ${esc(mediaMeta(f))}` : 'starter.blend · 自包含基础场景 · 音频提示轨'}</span><button data-tab="materials">全部素材 ↗</button></div></div>${f?.preview ? '<div class="proxy-note">浏览器预览为 H.264 转码；权威输入仍是原始文件，可在素材列表打开。</div>' : ''}<div class="tabs" role="tablist" aria-label="题目详情"><button class="tab" role="tab" id="tab-task" data-tab="task">完整题面</button><button class="tab" role="tab" id="tab-materials" data-tab="materials">输入素材<small>${c.files.length}</small></button><button class="tab" role="tab" id="tab-delivery" data-tab="delivery">交付规范</button><button class="tab" role="tab" id="tab-results" data-tab="results">作答结果<small>${c.key==='task-13' ? '3组' : c.experimentReport ? '新' : (resultData[c.resultKey || c.key]?.artifacts?.length || 0)}</small></button></div><section id="detail-panel" class="panel" role="tabpanel"></section></div><aside class="detail-aside"><section class="side-panel"><h3>任务概览 <span>↗</span></h3><dl><div class="detail-spec"><dt>任务编号</dt><dd>第 ${String(c.seq).padStart(2,'0')} 题</dd></div><div class="detail-spec"><dt>原始 Case</dt><dd>Case ${String(c.caseId).padStart(2,'0')}</dd></div><div class="detail-spec"><dt>题目版本</dt><dd>${esc(c.versionLabel || '困难版 v2')}</dd></div><div class="detail-spec"><dt>公开文件</dt><dd>${c.files.length} 个 / ${bytes(totals)}</dd></div><div class="detail-spec"><dt>输入类型</dt><dd>${['video','audio','image','project'].filter(k=>kindCount(c,k)).map(k=>labels[k]).join(' / ')}</dd></div></dl>${c.caseId===23?'<p class="side-note">第 10、11 题都对应 Case23，采用不同课程输入与制作合同，分别展示。</p>':''}</section><section class="side-panel"><h3>公开规范 <span>≡</span></h3>${docs.map(d=>`<button class="document-link" data-file="${c.files.indexOf(d)}" data-case="${c.key}"><span>▤</span><span>${esc(d.name)}</span><small>↗</small></button>`).join('')}</section><section class="side-panel"><h3>交付速览 <span>◇</span></h3>${delivery[c.seq].map((d,i)=>`<div class="document-link"><span>${String(i+1).padStart(2,'0')}</span><span>${esc(d)}</span></div>`).join('')}<p class="side-note">此处为速览；精确文件名、格式和验收标准见完整题面及公开规范。</p></section><section class="side-panel result-box"><h3>作答结果 <span>○</span></h3><p>${c.key==='task-13' ? '新版三模型视频与Qwen裁决评分已接入；待核验QA为0。' : c.experimentReport ? '本轮 API 实验成片、原始评分和工程复验已接入；正式分待校准。' : resultData[c.resultKey || c.key]?.gradeStatus === 'partial' ? '已有程序或部分裁判评分；正式总分待评。' : c.experimentStatus === 'prepared_not_experimented' ? '新版题包与评分机制已准备，尚未实验；旧版成绩仅作历史查看。' : '冻结答卷已接入；独立评分尚未执行。'}</p><button data-tab="results">查看答卷与评分 →</button></section></aside></div>`;
    renderTab();
    wireMediaErrors(main);
  }
  function renderTab() {
    const c = state.current;
    const panel = document.querySelector('#detail-panel');
    if (!panel || c?.status !== 'packaged') return;
    document.querySelectorAll('.tab').forEach(b=>{ const selected=b.dataset.tab===state.tab; b.classList.toggle('active',selected); b.setAttribute('aria-selected',String(selected)); b.setAttribute('aria-controls','detail-panel'); b.tabIndex=selected?0:-1; });
    panel.setAttribute('aria-labelledby','tab-'+state.tab);
    if (state.tab === 'task') panel.innerHTML = `<div class="read-source">▤ &nbsp; 正式题面 · ${esc(c.directory)}/TASK.md</div><article class="markdown">${markdown(c.task,c)}</article>`;
    else if (state.tab === 'delivery') {
      const schema = c.files.filter(f=>/schema/i.test(f.name));
      panel.innerHTML = `<h2 class="panel-title">交付与验收合同 <small>PUBLIC CONTRACT</small></h2><div class="markdown">${markdown(c.contract || c.outputs.map(s=>'## '+s.title+'\n\n'+s.text).join('\n\n'),c)}</div><h3 class="panel-title">结构化输出格式 <small>${schema.length} 个文件</small></h3><div class="file-list">${schema.length ? schema.map(f=>fileRow(c,f)).join('') : '<p class="side-note">输出字段已包含在上方题面或交付合同中。</p>'}</div>`;
    } else if (state.tab === 'materials') renderMaterials();
    else renderResults();
  }
  function fileRow(c,f) {
    const i = c.files.indexOf(f);
    const canPreview = f.kind !== 'project';
    return `<div class="file-row"><span class="file-symbol">${symbols[f.kind]}</span><div class="file-info"><div class="file-name">${esc(f.name)}</div><div class="file-path">${esc(f.path)}${f.meta?.duration ? ' · '+duration(f.meta.duration) : ''}</div></div><span class="file-size">${bytes(f.bytes)}</span><div class="file-actions">${canPreview ? `<button data-file="${i}" data-case="${c.key}" aria-label="预览 ${esc(f.path)}">预览</button>` : ''}<a href="${fileUrl(f)}" target="_blank" rel="noopener" download="${esc(f.name)}" aria-label="打开或保存 ${esc(f.path)}">原文件 ↗</a></div></div>`;
  }
  function renderMaterials() {
    const c=state.current, panel=document.querySelector('#detail-panel');
    const visuals=c.files.filter(f=>f.kind==='video'||(f.kind==='image'&&!/^\d+\./.test(f.name))).slice(0,12);
    panel.innerHTML=`<h2 class="panel-title">输入与公开附件 <small>${c.files.length} 个文件</small></h2><div class="media-grid">${visuals.map(f=>`<button class="media-tile" data-file="${c.files.indexOf(f)}" data-case="${c.key}"><img src="${f.kind==='image'?fileUrl(f):url(f.poster||'')}" alt="${esc(f.path)} 预览" loading="lazy"><span>${symbols[f.kind]} ${esc(f.name)}<b>${duration(f.meta?.duration)}</b></span></button>`).join('')}</div><div class="file-toolbar">${['all','video','audio','image','document','project'].map(k=>`<button class="file-filter ${state.fileKind===k?'active':''}" data-file-kind="${k}">${k==='all'?'全部':labels[k]} ${k==='all'?c.files.length:kindCount(c,k)}</button>`).join('')}</div><input class="file-search" type="search" id="file-search" value="${esc(state.fileQuery)}" placeholder="搜索文件名或路径…" aria-label="搜索当前题目文件"><div class="file-list" id="file-list"></div><div id="file-more"></div>`;
    document.querySelector('#file-search').addEventListener('input',e=>{state.fileQuery=e.target.value;state.fileLimit=50;updateFiles();});
    updateFiles();
  }
  function updateFiles() {
    const c=state.current;
    const files=c.files.filter(f=>(state.fileKind==='all'||f.kind===state.fileKind)&&f.path.toLowerCase().includes(state.fileQuery.toLowerCase()));
    document.querySelector('#file-list').innerHTML=files.length?files.slice(0,state.fileLimit).map(f=>fileRow(c,f)).join(''):'<p class="side-note">没有匹配的文件。</p>';
    document.querySelector('#file-more').innerHTML=files.length>state.fileLimit?`<button class="button load-more" data-more>继续显示 · 还有 ${files.length-state.fileLimit} 个文件</button>`:'';
  }
  function safeArtifactUrl(value) { return typeof value==='string' && !/^[\s]*(?:javascript|data|vbscript):/i.test(value) && (/^https?:\/\//i.test(value)||(!/^[a-z]+:/i.test(value)&&!value.startsWith('//'))) ? value : null; }
  function renderResults() {
    const c=state.current, panel=document.querySelector('#detail-panel'), result=resultData[c.resultKey];
    if (c.experimentReport && safeArtifactUrl(c.experimentReport)) {
      panel.innerHTML = "<section class=\"result-comparison\" data-case3-comparison><h3 class=\"result-section-title\">同题模型对比</h3><div class=\"score-table-wrap\"><table class=\"result-table\"><thead><tr><th>模型 / 推理</th><th>限时 / 实际用时</th><th>片段 1 / 50</th><th>片段 2 / 50</th><th>质量得分 / 100</th></tr></thead><tbody><tr><td>gpt-6.1-sol / high</td><td>120 分钟 / 94.1 分钟</td><td>31.7242</td><td>19.2052</td><td><b>50.9294</b><small style=\"display:block\">正式质量分</small></td></tr><tr><td>gpt-6-luna / high</td><td>不限时 / 25.98 分钟</td><td>6.0140</td><td>3.5815</td><td><b>9.5955</b><small style=\"display:block\">原始质量分</small></td></tr></tbody></table></div><p class=\"result-note\">两模型使用同一题面与评分公式。Sol 已采用为正式质量分；Luna 为原始质量分，正式分待校准。时间预算不同，分数与合规状态分别展示。</p><section class=\"comparison-review\"><h3 class=\"result-section-title\">gpt-6.1-sol 最终视频 <span>质量得分 50.9294 / 100</span></h3><div class=\"media-grid\"><div><video controls preload=\"metadata\" playsinline style=\"width:100%\" src=\"case3-api-report/output_1.mp4\"></video><p class=\"result-note\">片段 1 · <a href=\"case3-api-report/output_1.mp4\" target=\"_blank\" rel=\"noopener\">打开 / 下载成片 ↗</a></p></div><div><video controls preload=\"metadata\" playsinline style=\"width:100%\" src=\"case3-api-report/output_2.mp4\"></video><p class=\"result-note\">片段 2 · <a href=\"case3-api-report/output_2.mp4\" target=\"_blank\" rel=\"noopener\">打开 / 下载成片 ↗</a></p></div></div><details class=\"result-details\" open><summary>gpt-6.1-sol：关键失分与边界</summary><p class=\"result-note\">主要问题：灰色矩形残留、孩子小腿误删。已确认失分 49.0706 / 100；两段各5个计分样本，基础门槛均通过。</p><div class=\"score-table-wrap\"><table class=\"result-table\"><thead><tr><th>片段</th><th>得分</th><th>门槛失分</th><th>全画面边缘失分</th><th>目标区域边缘失分</th></tr></thead><tbody><tr><td>片段 1</td><td>31.7242 / 50</td><td>0.0000</td><td>5.4827</td><td>12.7931</td></tr><tr><td>片段 2</td><td>19.2052 / 50</td><td>0.0000</td><td>9.2384</td><td>21.5564</td></tr></tbody></table></div><p class=\"result-note\">每样本得分 = 3 × 全画面边缘IoU + 7 × 目标区域边缘IoU；本次失分均来自边缘不匹配。全片语义未通过，单独报告，不重复追加扣分。独立重渲染逐像素一致；线性光合成待核实。</p><p><a class=\"button\" href=\"case3-api-report/index.html\">画面对照与详细错误分析 ↗</a> <a class=\"button\" href=\"case3-api-report/submission.zip\">完整交付下载 ↗</a></p></details></section><section class=\"comparison-review\"><h3 class=\"result-section-title\">gpt-6-luna 最终视频 <span>质量得分 9.5955 / 100</span></h3><div class=\"media-grid\"><div><video controls preload=\"metadata\" playsinline style=\"width:100%\" src=\"case3-luna-report/output_1.mp4\"></video><p class=\"result-note\">片段 1 · <a href=\"case3-luna-report/output_1.mp4\" target=\"_blank\" rel=\"noopener\">打开 / 下载成片 ↗</a></p></div><div><video controls preload=\"metadata\" playsinline style=\"width:100%\" src=\"case3-luna-report/output_2.mp4\"></video><p class=\"result-note\">片段 2 · <a href=\"case3-luna-report/output_2.mp4\" target=\"_blank\" rel=\"noopener\">打开 / 下载成片 ↗</a></p></div></div><details class=\"result-details\" open><summary>gpt-6-luna：关键失分与边界</summary><p class=\"result-note\">主要问题：背景与路人残留、目标人物大面积误删。已确认失分 90.4045 / 100；两段各5个计分样本，基础门槛均通过。</p><div class=\"score-table-wrap\"><table class=\"result-table\"><thead><tr><th>片段</th><th>得分</th><th>门槛失分</th><th>全画面边缘失分</th><th>目标区域边缘失分</th></tr></thead><tbody><tr><td>片段 1</td><td>6.0140 / 50</td><td>0.0000</td><td>13.3037</td><td>30.6823</td></tr><tr><td>片段 2</td><td>3.5815 / 50</td><td>0.0000</td><td>13.9804</td><td>32.4381</td></tr></tbody></table></div><p class=\"result-note\">每样本得分 = 3 × 全画面边缘IoU + 7 × 目标区域边缘IoU；本次失分均来自边缘不匹配。全片语义未通过，单独报告，不重复追加扣分。工程可导入；独立重渲染未完成，线性光合成待核实。</p><p><a class=\"button\" href=\"case3-luna-report/index.html\">画面对照与详细错误分析 ↗</a> <a class=\"button\" href=\"case3-luna-report/submission.zip\">完整交付下载 ↗</a></p></details></section><details class=\"result-details\"><summary>运行记录与历史答卷</summary><p><a href=\"case3-api-report/trajectory.html\">Sol 完整运行轨迹 ↗</a> · <a href=\"case3-luna-report/result.public.json\">Luna 独立评测记录 ↗</a></p><button class=\"button\" id=\"show-previous-result\">查看旧版 v2 历史答卷与成绩</button><div id=\"previous-result\"></div></details></section>";
      panel.querySelector('#show-previous-result').addEventListener('click', () => {
        window.OmniResults.render(c,resultData[c.previousResultKey],panel.querySelector('#previous-result'));
        wireMediaErrors(panel);
      });
      return;
    }
    if (!result && c.previousResultKey) {
      panel.innerHTML = '<div class="result-empty"><h2>新版已准备 · 尚未实验</h2><p>原两段素材保持不变。新版采用 Resolve 绿底视频交付与 ALE 式评分，等待本地软件安装和校准；当前没有新版答卷或分数。</p><p>旧版采用 RGBA 交付和不同量表，成绩不能套用到新版。</p><button class="button" id="show-previous-result">查看旧版 v2 历史答卷与成绩</button></div><div id="previous-result"></div>';
      panel.querySelector('#show-previous-result').addEventListener('click', () => {
        window.OmniResults.render(c,resultData[c.previousResultKey],panel.querySelector('#previous-result'));
        wireMediaErrors(panel);
      });
    } else window.OmniResults.render(c,result,panel);
    wireMediaErrors(panel);
  }
  function openFile(c,index) {
    const f=c?.files?.[index];if(!f)return;
    const viewer=document.querySelector('#viewer');
    document.querySelector('#viewer-title').textContent=f.name;
    document.querySelector('#viewer-kind').textContent=labels[f.kind]+(c.key.startsWith('result-')?' / FROZEN SUBMISSION':c.key.startsWith('report-')?' / EVALUATION RECORD':' / PUBLIC MATERIAL');
    document.querySelector('#viewer-meta').textContent=f.path+' · '+mediaMeta(f);
    document.querySelector('#viewer-source').href=fileUrl(f);
    const body=document.querySelector('#viewer-body');
    if(f.kind==='video')body.innerHTML=videoHtml(f)+(f.preview?'<p class="proxy-note">这是浏览器转码预览，原始文件通过右下角入口打开。</p>':'');
    else if(f.kind==='audio')body.innerHTML=`<div class="result-symbol" style="text-align:center;font-size:48px;color:#9aad81">♫</div><audio controls preload="metadata" src="${url(f.preview||f.url)}" data-media-error="${esc(fileUrl(f))}"></audio>`;
    else if(f.kind==='image')body.innerHTML=`<img src="${fileUrl(f)}" alt="${esc(f.path)}">`;
    else if(f.name.endsWith('.md'))body.innerHTML=`<article class="markdown">${markdown(f.text,c)}</article>`;
    else { const pre=document.createElement('pre');let text=f.text||'此文件请使用对应本地软件打开。';if(f.name.endsWith('.json')){try{text=JSON.stringify(JSON.parse(text),null,2);}catch{}}pre.textContent=text;body.replaceChildren(pre); }
    wireMediaErrors(body);
    if(!viewer.open)viewer.showModal();
  }
  function wireMediaErrors(parent) {
    parent.querySelectorAll('[data-media-error]').forEach(el=>el.addEventListener('error',()=>{
      if(el.nextElementSibling?.classList.contains('media-error'))return;
      const note=document.createElement('div');note.className='media-error';
      note.innerHTML=`浏览器未能播放此素材。可尝试本地服务器模式，或<a href="${esc(el.dataset.mediaError)}" target="_blank" rel="noopener">打开原文件</a>。`;
      el.after(note);
    },{once:true}));
  }
  function closeViewer(){document.querySelector('#viewer').close();}
  document.querySelector('#close-viewer').addEventListener('click',closeViewer);
  document.querySelector('#viewer').addEventListener('close',()=>{document.querySelector('#viewer-body').querySelectorAll('video,audio').forEach(m=>m.pause());document.querySelector('#viewer-body').replaceChildren();});
  document.querySelector('#viewer').addEventListener('click',e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeViewer();}});
  function navigate(key){location.hash=key;}
  document.addEventListener('click',async e=>{
    const b=e.target.closest('button,a');if(!b)return;
    if(b.dataset.view){state.view=b.dataset.view;state.query='';state.media='all';navigate(state.view);if(!state.current && state.view!=='results')renderList();}
    else if(b.dataset.category){state.view='packages';state.category=b.dataset.category;state.media='all';navigate('packages');renderList();}
    else if(b.dataset.open){state.fileKind='all';state.fileQuery='';state.fileLimit=50;navigate(b.dataset.open);}
    else if(b.hasAttribute('data-back'))navigate(state.current?.status==='concept'?'concepts':'packages');
    else if(b.dataset.layout){state.layout=b.dataset.layout;renderList();}
    else if(b.hasAttribute('data-reset')){state.query='';state.category='全部';state.media='all';renderList();}
    else if(b.dataset.tab){state.tab=b.dataset.tab;const fragment='#'+state.current.key+'/'+state.tab;try{history.replaceState(null,'',fragment);}catch{location.hash=fragment;}renderTab();}
    else if(b.dataset.fileKind){state.fileKind=b.dataset.fileKind;state.fileLimit=50;renderMaterials();}
    else if(b.hasAttribute('data-more')){state.fileLimit+=50;updateFiles();}
    else if(b.dataset.file!==undefined){e.preventDefault();openFile(currentCase(b.dataset.case),Number(b.dataset.file));}
    else if(b.hasAttribute('data-copy-link')){try{await navigator.clipboard.writeText(location.href);toast('题目链接已复制');}catch{const input=document.createElement('textarea');input.value=location.href;document.body.appendChild(input);input.select();const ok=document.execCommand('copy');input.remove();toast(ok?'题目链接已复制':'请从浏览器地址栏复制题目链接');}}
  });
  document.addEventListener('keydown',e=>{
    const tab=e.target.closest('[role="tab"]');if(!tab)return;
    const tabs=[...document.querySelectorAll('[role="tab"]')];let next;
    if(e.key==='ArrowRight')next=tabs[(tabs.indexOf(tab)+1)%tabs.length];
    if(e.key==='ArrowLeft')next=tabs[(tabs.indexOf(tab)+tabs.length-1)%tabs.length];
    if(e.key==='Home')next=tabs[0];if(e.key==='End')next=tabs.at(-1);
    if(next){e.preventDefault();next.click();next.focus();}
  });
  function route() {
    if(document.querySelector('#viewer').open)closeViewer();
    const [key,tab]=decodeURIComponent(location.hash.slice(1)).split('/');
    if(key==='results'){state.current=null;state.view='results';renderNav();window.OmniResults.overview(data.cases,resultData,main);window.scrollTo(0,0);return;}
    const c=currentCase(key);
    if(c){if(state.current?.key!==c.key){state.fileKind='all';state.fileQuery='';state.fileLimit=50;}state.tab=['task','materials','delivery','results'].includes(tab)?tab:'task';state.view=c.status==='concept'?'concepts':'packages';renderDetail(c);}
    else{state.view=key==='concepts'?'concepts':'packages';if(!['all','video','audio','image','project'].includes(state.media)&&state.view==='packages')state.media='all';if(state.view==='concepts'&&!['all','packaged','concept'].includes(state.media))state.media='all';renderList();}
    window.scrollTo(0,0);
  }
  window.OmniALE=Object.freeze({
    version:1,
    setResults(records){if(!records||typeof records!=='object'||Array.isArray(records))throw new TypeError('Results must be an object keyed by task-01 … task-14');resultData={...records};if(state.current&&state.tab==='results')renderResults();else if(state.view==='results')window.OmniResults.overview(data.cases,resultData,main);},
    getResult(key){return resultData[key]||null;},
    taskKeys(){return data.cases.map(c=>c.key);}
  });
  document.querySelector('#build-note').textContent='题面与答卷 · '+(window.OMNIALE_RESULTS_META?.builtAt || data.builtAt).slice(0,10)+' · 正式总分待评';
  window.addEventListener('hashchange',route);
  route();
})();
