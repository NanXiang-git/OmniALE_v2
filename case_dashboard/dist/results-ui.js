/* Read-only visualizations of frozen submissions and existing scores. */
(() => {
  'use strict';
  const E = v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const U = p=>/^https?:\/\//i.test(String(p||''))?encodeURI(String(p)):String(p||'').split('/').map(encodeURIComponent).join('/');
  const N = n=>Number.isFinite(n)?n.toFixed(3).replace(/\.?0+$/,''):'—';
  const T = seconds=>{const s=Math.max(0,Number(seconds)||0);return `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;};
  const SZ = n=>n>=1e9?(n/1e9).toFixed(2)+' GB':n>=1e6?(n/1e6).toFixed(1)+' MB':n>=1e3?(n/1e3).toFixed(1)+' KB':n+' B';
  const K = {video:'视频',audio:'音频',image:'图片',document:'文档',project:'工程 / 归档'};
  const O = {space:'场景空间',arm:'机械手臂',jacket:'外套颜色',rifle:'长枪状态',capsule:'容器盖子',switch:'开关状态'};
  const STATE = {visible:'可见',not_visible:'不可见',visible_uncertain:'状态未定',outdoor:'室外',indoor:'室内',title:'片名',body_right:'身体右侧',blue:'蓝色',burgundy:'酒红色',aiming:'保持瞄准',lowered:'放下',sealed:'关闭',open:'打开',on:'开',off:'关'};
  const RULE = {R1:'品牌',R2:'电话号码',R3:'声音插播',R4:'画面闪烁'};
  let current=null, result=null, panel=null, tab='visual', filePage=50, fileKind='all', fileQuery='', mediaPath='';
  const known = r => (r.rows||[]).filter(x=>x.points!=null).reduce((s,x)=>s+x.maximum,0);
  const gradeLabel = r => !r ? '暂无记录' : r.accepted===false?'硬门槛未通过':r.total!=null?(r.accepted?'通过':'未通过'):r.gradeStatus==='partial'?'部分评分 · 待评':'未评分';
  const pill = r=>`<span class="grade-pill ${r?.accepted===false?'bad':r?.gradeStatus==='partial'?'partial':'pending'}">${gradeLabel(r)}</span>`;
  function scoreBar(r) {
    const earned=r.verified??0, assessed=known(r), lost=Math.max(0,assessed-earned), pending=Math.max(0,100-assessed);
    return `<div class="score-stack" role="img" aria-label="已核实 ${N(earned)} 分，已评失分 ${N(lost)} 分，待评 ${N(pending)} 分"><i class="earned" style="width:${earned}%"></i><i class="lost" style="width:${lost}%"></i><i class="ungraded" style="width:${pending}%"></i></div>`;
  }
  function overview(cases,records,target) {
    const rs=cases.map(c=>records[c.resultKey || c.key]).filter(Boolean),scored=rs.filter(r=>r.verified!=null).length,fail=rs.filter(r=>r.accepted===false).length;
    target.innerHTML=`<section class="hero animate-in"><div><span class="eyebrow">OMNIALE / SUBMISSIONS & EVALUATION</span><h1>答卷与评分<span>Evidence first.</span></h1><p>查看实际冻结答卷和已有评测明细。已核实小计、评分覆盖范围与正式总分分别呈现。</p></div><div class="hero-badge">多试次 · 模型与预算见各题记录</div></section><section class="metrics"><div class="metric"><div class="metric-top">常规评分答卷<span>▣</span></div><div class="metric-value"><strong>${rs.length}</strong><span>共 ${rs.reduce((s,r)=>s+r.artifacts.length,0)} 个文件</span></div></div><div class="metric"><div class="metric-top">已有部分评分<span>▥</span></div><div class="metric-value"><strong>${scored}</strong><span>其余 ${rs.length-scored} 题未评分</span></div></div><div class="metric"><div class="metric-top">已完成正式总分<span>○</span></div><div class="metric-value"><strong>${rs.filter(r=>r.total!=null).length+cases.filter(c=>c.formalScore!=null&&!records[c.resultKey||c.key]).length}</strong><span>待评不记作零分</span></div></div><div class="metric"><div class="metric-top">已确认硬门槛失败<span>!</span></div><div class="metric-value"><strong>${fail}</strong><span>其他题尚不能宣称通过</span></div></div></section><div class="result-notice">评分来源及专家标注分别记录；同题追加测试在题目详情中展示。第3题正式质量分采用ALE方式，计入正式成绩数量；其程序指标与裁判门槛不拆成其他题的60/40分制。部分题受音频能力或评审时间限制，内容项仍待评；未评分题的提交者自检不作为正式成绩。</div><div class="score-legend"><span><i class="earned"></i>已核实得分</span><span><i class="lost"></i>已评部分失分</span><span><i class="ungraded"></i>尚待评分</span><span>所有条形使用 100 分总量尺，题目按原顺序排列。</span></div><div class="result-notice"><b>Case3 新增 Luna / high 不限时试次：原始分 9.5955/100</b>，含成片对比、逐项扣分、错误分析与评测边界。<a href="case3-luna-report/index.html">查看完整报告 ↗</a> · <a href="#task-03/results">查看同题 Sol / Luna 结果 ↗</a></div><div class="score-table-wrap"><table class="score-overview"><thead><tr><th>题目 / Case</th><th>程序分</th><th>已确认裁判分</th><th>已核实小计</th><th>正式总分</th><th>状态与评分覆盖</th><th>答卷</th></tr></thead><tbody>${cases.map(c=>{const r=records[c.resultKey || c.key];if(!r)return `<tr><td><a href="#${c.key}/results"><b>${String(c.seq).padStart(2,'0')} · ${E(c.title)}</b><small>${E(c.versionLabel || '')}</small></a></td>${c.experimentReport ? `<td colspan="2">ALE 指标与视觉门槛联合计分</td><td>${Number(c.formalScore).toFixed(4)}</td><td><strong>${Number(c.formalScore).toFixed(4)} / 100</strong></td><td>正式质量分 · 全片语义未通过</td>` : `<td colspan="5">新版已准备，尚未实验；旧版成绩不沿用。</td>`}<td><a class="button" href="#${c.key}/results">查看详情 ↗</a></td></tr>`;return `<tr><td><a href="#${c.key}/results"><b>${String(c.seq).padStart(2,'0')} · ${E(c.title)}</b><small>Case ${String(c.caseId).padStart(2,'0')} · ${N(r.seconds/60)} 分钟${r.timedOut?' · 到时冻结':''}</small></a></td><td>${r.automatic==null?'未评分':N(r.automatic)}<small>满分 ${N(r.automaticMax)}</small></td><td>${r.judge==null?'待评':N(r.judge)}<small>满分 ${N(r.judgeMax)}</small></td><td><strong>${r.verified==null?'—':N(r.verified)}</strong><small>已评权重 ${N(known(r))}/100</small></td><td>${r.total==null?'待评':N(r.total)}</td><td>${pill(r)}${scoreBar(r)}</td><td><a class="button" href="#${c.key}/results">查看 ↗</a></td></tr>`;}).join('')}</tbody></table></div><div class="result-note">第 3 题为 Resolve v3，实验状态及独立报告见该题详情，v2 答卷留在历史入口；第 12 题采用 case12_retry2；第 1、2、6 题采用最终汇总确认的答卷。旧基础设施异常试次未混入当前成果。分数来源和冻结记录可在各题“运行与来源”中查看。</div>`;
  }
  function comparisonReview(x,index) {
    const video=x.artifacts.find(f=>f.name==='preview.mp4');
    if(!video)return '';
    const subtitle=x.artifacts.find(f=>f.name==='interview.srt');
    const cues=parseCues(subtitle?.text);
    return `<section class="comparison-review" aria-label="${E(x.model)} 专家标注参考"><h3 class="result-section-title">${E(x.model)} 最终视频<span>视听可读性 · ${x.judge==null?'待专家标注（满分 10 分）':N(x.judge)+' / 10（专家标注）'}</span></h3><p class="result-note">自动分 ${N(x.automatic)} / 90；视觉抽样${x.visualPassed===true?'通过':x.visualPassed===false?'发现问题':'待评'}。${x.judge==null?'请播放成片并开启声音，观看后给出视听可读性评分（0–10 分），可附问题时间点与说明。':'已记录用户提供的专家评分；可播放成片复核，并记录问题时间点。'}</p>${player(video,'review-video-'+index)}<div class="output-label"><span>当前时间 <output id="review-time-${index}">0:00</output> · 实际冻结答卷</span><a href="${U(video.url)}" target="_blank" rel="noopener">打开最终视频 ↗</a><a href="${U(video.url)}" download="${E(video.name)}">下载视频</a></div><p class="review-links">${x.artifacts.filter(f=>['interview.srt','interview.ass','README.md'].includes(f.name)).map(f=>`<a href="${U(f.url)}" target="_blank" rel="noopener">${E(f.name)} ↗</a>`).join(' · ')}</p>${cues.length?`<details class="caption-section"><summary>${E(x.model)} 字幕导航 · ${cues.length} 条</summary><p class="result-note">以下为模型提交字幕，点击仅跳转上方视频；文本正确性以评测为准。</p><div class="cue-scroll">${cues.map(c=>`<button class="cue-row" data-review-index="${index}" data-review-seek="${c.start}"><time>${T(c.start)}–${T(c.end)}</time><span>${E(c.text)}</span></button>`).join('')}</div></details>`:''}</section>`;
  }
  function comparisonPanel(r) {
    if(!r.comparisons?.length)return '';
    const base={model:r.model,effort:r.effort,limitMinutes:50,seconds:r.seconds,automatic:r.automatic,judge:r.judge,total:r.total};
    const all=[base,...r.comparisons];
    return `<section class="result-comparison"><h3 class="result-section-title">同题模型对比</h3><div class="score-table-wrap"><table class="result-table"><thead><tr><th>模型 / 推理</th><th>限时 / 实际用时</th><th>自动分 / 90</th><th>视听 / 10</th><th>总分 / 100</th></tr></thead><tbody>${all.map(x=>`<tr><td>${E(x.model)} / ${E(x.effort)}</td><td>${x.limitMinutes} / ${N(x.seconds/60)} 分钟</td><td>${N(x.automatic)}</td><td>${x.judge==null?'待专家标注':N(x.judge)+'（专家标注）'}</td><td>${x.total==null?'待评':N(x.total)}</td></tr>`).join('')}</tbody></table></div>${r.comparisons.map((x,index)=>`<p class="result-note">${E(x.note)} 视觉抽样：${x.visualPassed===true?'通过':x.visualPassed===false?'发现问题':'待评'}；已测硬门槛：${x.failedGates.length?'未通过':'未发现失败'}；冻结哈希：${x.integrity.passed?'一致':'异常'}。</p>${comparisonReview(x,index)}<details class="result-details"><summary>${E(x.model)}：分项、答卷与评测报告</summary><table class="result-table"><tbody>${x.rows.map(y=>`<tr><td>${E(y.label)}</td><td>${y.points==null?'待评':N(y.points)} / ${y.maximum}</td></tr>`).join('')}</tbody></table><p>失败门槛：${E(x.failedGates.join(', ')||'无已测失败')}</p><p>${x.reports.map(f=>`<a href="${U(f.url)}" target="_blank" rel="noopener">${E(f.role)} ↗</a>`).join(' · ')}</p><p>${x.artifacts.map(f=>`<a href="${U(f.url)}" target="_blank" rel="noopener">${E(f.name)} ↗</a>`).join(' · ')}</p></details>`).join('')}</section>`;
  }
  function render(c,r,target) {
    if(current?.key!==c.key){tab='visual';filePage=50;fileKind='all';fileQuery='';mediaPath=r?.main||'';}
    current=c;result=r;panel=target;
    if(!r){target.innerHTML='<div class="result-empty"><h3>暂无接入的答卷</h3></div>';return;}
    if(!r.rows){target.innerHTML=`<h2>${E(r.title)}</h2><p>${E(r.summary)}</p>`;return;}
    target.innerHTML=`<div class="result-heading"><div><span class="eyebrow">FROZEN SUBMISSION / ${E(r.attempt)}</span><h2>答卷与评测</h2></div>${pill(r)}</div><div class="result-kpis"><div><span>正式总分</span><strong>${r.total==null?'待评':N(r.total)}</strong></div><div><span>已核实小计</span><strong>${r.verified==null?'未评分':N(r.verified)}</strong><small>已评权重 ${N(known(r))} / 100</small></div><div><span>答题用时</span><strong>${(r.seconds/60).toFixed(2)}<em> 分钟</em></strong><small>${r.timedOut?'达到时间上限后冻结':'正常结束后冻结'}</small></div><div><span>冻结文件</span><strong>${r.artifacts.length}<em> 个</em></strong><small>${r.integrity.passed?'冻结哈希一致':'完整性存在异常'}</small></div></div>${scoreBar(r)}<p class="result-note">${E(r.gradeNote)}</p>${comparisonPanel(r)}<div class="result-subnav" aria-label="答卷内容">${[['visual','结果可视化'],['scores','评分明细'],['files','交付文件'],['provenance','运行与来源']].map(([id,name])=>`<button data-result-tab="${id}" class="${tab===id?'active':''}" aria-pressed="${tab===id}">${name}</button>`).join('')}</div><div id="result-content"></div>`;
    if(c.key==='task-13') target.insertAdjacentHTML('afterbegin', `<section class="result-notice"><h2>Case13 Checklist v3 · 三模型新评分</h2><p>新增原人物音色保持、实际语气与逐点QA。权重2∶1∶3∶1，high / 60分钟。</p><table><thead><tr><th>本轮模型</th><th>正式总分</th><th>已确认分数范围</th><th>待评项</th></tr></thead><tbody>${(window.CASE13_SUMMARY||[]).map(x=>`<tr><td>${E(x.model)}</td><td>${x.total_score==null?'待评':N(x.total_score)}</td><td>${x.score_lower_bound==null?'—':N(x.score_lower_bound)+'–'+N(x.score_upper_bound)}</td><td>${x.pending_count??'—'}</td></tr>`).join('')}</tbody></table><a class="button" href="case13-v3-report/index.html">查看最终视频、完整分项与关键失分 ↗</a> · <a href="case13-v3-report/TASK.md">新版题面</a><p><b>以下是历史v2答卷及旧评分；未换算为新版成绩。</b></p></section>`);
    renderContent();
    (r.comparisons||[]).forEach((x,index)=>{
      const video=panel.querySelector('#review-video-'+index);
      video?.addEventListener('timeupdate',()=>{panel.querySelector('#review-time-'+index).textContent=T(video.currentTime);});
    });
    const comparison=panel.querySelector('.result-comparison');
    if(comparison)attachMediaErrors(comparison);
  }
  function renderContent() {
    const target=panel.querySelector('#result-content');if(!target)return;
    if(tab==='visual')renderVisual(target);
    if(tab==='scores')renderScores(target);
    if(tab==='files')renderFiles(target);
    if(tab==='provenance')renderProvenance(target);
  }
  function jsonDetails(label,obj) {return `<details class="result-details"><summary>${E(label)}</summary><pre>${E(JSON.stringify(obj,null,2))}</pre></details>`;}
  function case12LossAnalysis(r) {
    const all=[...(r.comparisons||[]),r].filter(x=>x.case12Analysis);
    const pct=n=>(100*n).toFixed(2)+'%', exact=n=>Number(n).toFixed(4);
    return `<section class="case12-loss-analysis" aria-label="第12题关键失分与边界"><h3 class="result-section-title">关键失分与边界 · 两模型 <span>原评分解释，不重新判分</span></h3><p class="result-note">展开对应模型，查看失分排行、门槛差距、角色覆盖和具体字幕例子。硬门槛失败不重复扣分。</p>${all.map((x,index)=>{
      const a=x.case12Analysis, video=x.artifacts.find(f=>f.name==='preview.mp4');
      const top=a.rows.filter(y=>y.loss>0).slice(0,3);
      return `<details class="case12-model-analysis" ${index===0?'open':''} data-analysis-model="${E(x.model)}"><summary><b>${E(x.model)}</b><span>总分 ${exact(a.total)} / 100 · 失分 ${exact(a.loss)} · ${a.failedCount} 个门槛失败</span></summary><div class="case12-analysis-body"><p class="case12-headline">${E(a.headline)}</p>${a.parserBoundary?`<div class="result-notice case12-parser-boundary"><b>评测边界 · 角色标签解析</b><p>${E(a.parserBoundary)}</p></div>`:''}<div class="case12-loss-highlights">${top.map(y=>`<article><span>${E(y.label)}</span><strong>−${exact(y.loss)}</strong><small>得分 ${exact(y.points)} / ${y.maximum}</small></article>`).join('')}</div><h4>分怎么扣 · 按失分从高到低</h4><div class="score-table-wrap"><table class="result-table case12-loss-table"><thead><tr><th>项目</th><th>得分 / 满分</th><th>失分</th><th>模型具体哪里做得差 / 计分依据</th></tr></thead><tbody>${a.rows.map(y=>`<tr><td>${E(y.label)}</td><td>${exact(y.points)} / ${y.maximum}</td><td class="${y.loss?'bad-text':'good-text'}">${exact(y.loss)}</td><td><p>${E(y.why)}</p><details><summary>计算方式与解释边界</summary><p>${E(y.formula)}</p><p>${E(y.boundary)}</p></details></td></tr>`).join('')}</tbody></table></div><h4>差多少才到门槛</h4><p class="result-note">以下均要求“至少达到”；差距使用百分点。正值表示已超过门槛。</p><div class="score-table-wrap"><table class="result-table"><thead><tr><th>检查项</th><th>实际</th><th>要求 ≥</th><th>与边界的距离</th></tr></thead><tbody>${a.gates.map(g=>`<tr><td>${E(g.label)}</td><td>${pct(g.value)}</td><td>${pct(g.limit)}</td><td class="${g.passed?'good-text':'bad-text'}">${g.passed?'通过 · 超出':'未通过 · 还差'} ${Math.abs(g.gap).toFixed(2)} 个百分点</td></tr>`).join('')}</tbody></table></div><h4>谁的发言保留得较差</h4><p class="result-note">这是按人物分组后的词序列召回，不是纯身份分类准确率。每个角色、每种格式都需达到 95%。</p><div class="score-table-wrap"><table class="result-table"><thead><tr><th>角色</th><th>ASS 召回</th><th>SRT 召回</th><th>较低值与 95% 的差距</th></tr></thead><tbody>${a.speakers.map(v=>`<tr><td>${v.speaker}</td><td>${pct(v.ass)}</td><td>${pct(v.srt)}</td><td>${Math.min(v.ass,v.srt)>=.95?'已通过':'还差 '+(100*(.95-Math.min(v.ass,v.srt))).toFixed(2)+' 个百分点'}</td></tr>`).join('')}</tbody></table></div><h4>具体例子与解析边界 · 可回看成片</h4><p class="result-note">只引用模型实际提交的字幕，例子已包含在原评分中，不再单独扣分。时间码保留两位小数。</p>${a.examples.map(e=>`<article class="case12-error-example"><div><b>${E(e.title)}</b> <a href="${U(video.url)}#t=${e.start},${e.end}" target="_blank" rel="noopener">${e.start.toFixed(2)}–${e.end.toFixed(2)} 秒 · 打开成片 ↗</a></div><pre>${E(e.actual)}</pre><p>${E(e.explanation)}</p></article>`).join('')||'<p>当前记录没有可直接展示的逐条例子；不据此认定没有错误。</p>'}<details class="result-details"><summary>判分边界、尚未核验的内容与来源</summary><ul class="case12-boundaries">${a.boundaries.map(t=>`<li>${E(t)}</li>`).join('')}</ul><p>${a.sources.map(f=>`<a href="${U(f.url)}" target="_blank" rel="noopener">${E(f.label)} ↗</a>`).join(' · ')}</p></details></div></details>`;
    }).join('')}</section>`;
  }
  function lossAnalysis(r) {
    if(r.case12Analysis)return case12LossAnalysis(r);
    const assessed=r.rows.filter(x=>x.points!=null), maximum=assessed.reduce((s,x)=>s+x.maximum,0);
    const earned=assessed.reduce((s,x)=>s+x.points,0), lost=Math.max(0,maximum-earned);
    const losses=assessed.map(x=>({...x,loss:Math.max(0,x.maximum-x.points)})).filter(x=>x.loss>.00005).sort((a,b)=>b.loss-a.loss);
    const pending=r.rows.filter(x=>x.points==null).reduce((s,x)=>s+x.maximum,0), a=r.scoreAnalysis;
    const source=r.reports?.find(x=>x.role===(a?.sourceRole||'独立评分'));
    const exact=x=>Number(x).toFixed(4), metric=x=>Number(x).toFixed(6);
    const breakdown=losses.map((x,i)=>{
      const finding=a?.findings?.find(f=>f.id===x.id);
      return `<article class="loss-item"><div class="loss-item-head"><h4>${i+1}. ${E(x.label)}</h4><strong>失分 ${exact(x.loss)}<small> / ${N(x.maximum)}</small></strong></div><div class="loss-meter"><span style="width:${lost?100*x.loss/lost:0}%"></span></div><p class="loss-caption">得分 ${exact(x.points)} / ${N(x.maximum)} · 占已确认失分 ${lost?(100*x.loss/lost).toFixed(1):0}%</p>${finding?`<p>${E(finding.title)} ${E(finding.interpretation)}</p><div class="score-table-wrap"><table class="result-table loss-evidence"><thead><tr><th>位置 / 测量项</th><th>实际值</th><th>硬门槛 ≤</th><th>距离边界</th></tr></thead><tbody>${finding.measurements.map(m=>`<tr><td>片段 ${m.clip} · ${E(m.label)}</td><td>${metric(m.value)}</td><td>${metric(m.limit)}</td><td class="${m.passed?'good-text':'bad-text'}">${m.passed?'低于':'超出'} ${metric(Math.abs(m.value-m.limit))}${m.passed?' · 通过':' · 未通过'}</td></tr>`).join('')}</tbody></table></div><details class="loss-formula"><summary>这项分数怎么算</summary><p>${E(finding.formula)}</p><p>${E(a.normalization)}</p></details><p class="loss-action"><b>复查方向（建议）：</b>${E(finding.action)}</p>`:`<p>${x.finding?E(x.finding):'现有记录确认了这项得分差额；未提供可直接定位的错误说明，请查看下方原始指标与判分证据。'}</p>`}</article>`;
    }).join('');
    return `<section class="loss-analysis" aria-label="关键失分与评分边界"><h3 class="result-section-title">关键失分与边界 <span>基于已有评分，不重新判分</span></h3>${a?`<p class="loss-headline">${E(a.headline)}</p><p class="result-note">${E(a.scope)}</p>`:''}<div class="loss-summary"><div><span>已评得分 / 已评满分</span><strong>${maximum?exact(earned):'未评分'} <small>/ ${N(maximum)}</small></strong></div><div><span>已确认失分</span><strong>${maximum?exact(lost):'暂无'}</strong></div><div><span>尚未评分 · 不算扣分</span><strong>${N(pending)} <small>分</small></strong></div></div>${losses.length?breakdown:`<p class="result-note">${maximum?'已评分项目没有失分；待评项目尚不能下结论。':'暂无已确认扣分。当前不能判断模型具体哪里做得差。'}</p>`}<div class="loss-boundaries"><h4>能确认什么，暂时不能确认什么</h4><ul>${(a?.boundaries||['失分按已评项目的“满分 − 得分”计算；未评项目不算扣分。','硬门槛失败与连续分数分别记录，不重复追加扣分。','没有时间码、区域或观察证据的项目，不推断具体错误位置或根因。']).map(t=>`<li>${E(t)}</li>`).join('')}</ul>${source?`<a class="button" href="${U(source.url)}" target="_blank" rel="noopener">打开原始评分记录 ↗</a>`:''}</div></section>`;
  }
  function renderScores(target) {
    const r=result;
    const failures=r.checks.filter(x=>x.passed===false);
    const bad=failures.length?failures:r.failures.map(f=>({id:f.id,detail:f.label,passed:false}));
    target.innerHTML=`${lossAnalysis(r)}${r.case12Analysis?`<h3 class="result-section-title">${E(r.model)} · 原始评分明细</h3>`:''}${bad.length?`<div class="failure-box"><h3>已确认的失败项</h3>${bad.map(f=>`<div><b>${E(({precision_gate:'检测精确率未达到 80%',recall_gate:'检测召回率未达到 90%',every_frame_privacy:'部分帧的目标脸遮挡不足',other_people_and_minimal_area:'遮挡范围超出允许区域'})[f.id]||r.failures.find(x=>x.id===f.id)?.label||f.id)}</b><small>${E(f.id)}</small>${jsonDetails('查看实际测量',f.detail)}</div>`).join('')}</div>`:''}${r.judgeProgress?`<div class="result-notice">独立评审已处理 ${r.judgeProgress.completed} / ${r.judgeProgress.total} 个窗口；完整评审未结束，窗口观察未折算成最终裁判分。</div>`:''}${['automatic','judge'].map(group=>{const rows=r.rows.filter(x=>x.group===group);return `<h3 class="result-section-title">${group==='automatic'?'程序评分':'独立裁判评分'}<span>满分 ${N(group==='automatic'?r.automaticMax:r.judgeMax)}</span></h3><div class="score-rows">${rows.map(x=>`<div class="score-row"><div><b>${E(x.label)}</b><small>${E(x.id)}</small></div><div class="component-bar ${x.points==null?'is-pending':''}"><span style="width:${x.points==null?0:100*x.points/x.maximum}%"></span></div><div class="component-value">${x.points==null?'<span class="pending-text">待评</span>':N(x.points)} <small>/ ${N(x.maximum)}</small></div>${x.finding && x.points!=null?`<div class="component-finding">${E(x.finding)}${x.evidence?.length?jsonDetails('判分证据',x.evidence):''}</div>`:''}</div>`).join('')}</div>`;}).join('')}<div class="result-notice">待评权重 ${N(r.pendingPoints)} 分。待评项目没有获得零分，也没有被计入正式总分；硬门槛失败与连续分数分别保留。</div>${r.metrics?.per_rule?ruleTable(r.metrics.per_rule):''}${r.metrics?.by_object?objectTable(r.metrics.by_object):''}${r.pending?.length?jsonDetails('全部待评项与待核验门槛（原始 ID）',r.pending):''}${r.checks.length?`<h3 class="result-section-title">程序检查逐项记录 <span>${r.checks.length} 项</span></h3>${r.checks.map(x=>`<details class="check-detail"><summary><span class="check-state ${x.passed===false?'bad':x.passed===true?'good':'pending'}">${x.passed===false?'未通过':x.passed===true?'通过':'待核验'}</span>${E(x.id)}</summary><pre>${E(JSON.stringify(x.detail??x.details??x,null,2))}</pre></details>`).join('')}`:''}${r.metrics?jsonDetails('完整测量指标',r.metrics):''}${r.review?.gates?jsonDetails('独立裁判门槛与依据',r.review.gates):''}`;
  }
  function ruleTable(rows) {
    return `<h3 class="result-section-title">各规则检测表现</h3><div class="score-table-wrap"><table class="result-table"><thead><tr><th>规则</th><th>正确 TP</th><th>误报 FP</th><th>漏报 FN</th><th>精确率</th><th>召回率</th><th>F1</th></tr></thead><tbody>${Object.entries(rows).map(([id,x])=>`<tr><td>${id} ${RULE[id]||''}</td><td>${x.tp}</td><td class="${x.fp?'bad-text':''}">${x.fp}</td><td class="${x.fn?'bad-text':''}">${x.fn}</td><td>${N(100*x.precision)}%</td><td>${N(100*x.recall)}%</td><td>${N(x.f1)}</td></tr>`).join('')}</tbody></table></div>`;
  }
  function objectTable(rows) {
    return `<h3 class="result-section-title">各对象识别表现</h3><div class="score-table-wrap"><table class="result-table"><thead><tr><th>对象</th><th>可见性 F1</th><th>状态准确率</th><th>覆盖率</th></tr></thead><tbody>${Object.entries(rows).map(([id,x])=>`<tr><td>${O[id]||id}</td><td>${N(x.visibility_f1)}</td><td>${N(100*x.state_accuracy)}%</td><td>${N(100*x.coverage)}%</td></tr>`).join('')}</tbody></table></div>`;
  }
  function player(f,id='result-video',source=false) {
    return `<div class="result-video-shell"><video id="${id}" controls playsinline preload="metadata" src="${U(f.preview||f.url)}" ${f.poster?`poster="${U(f.poster)}"`:''}></video>${source?'<div id="result-bbox" aria-hidden="true" hidden></div>':''}</div>`;
  }
  function renderVisual(target) {
    const r=result,viz=r.visualization;
    selectedEvent=null;
    if(viz?.type==='flags'||viz?.type==='states'){renderTimeline(target,viz);return;}
    const videos=r.artifacts.filter(f=>f.kind==='video'&&(f.name.endsWith('.mp4')||f.preview));
    const selected=videos.find(f=>f.path===mediaPath)||videos.find(f=>f.path===r.main)||videos[0];
    if(selected)mediaPath=selected.path;
    const audios=r.artifacts.filter(f=>f.kind==='audio'&&!f.path.includes('/'));
    const texts=r.artifacts.filter(f=>/\.(md|srt|vtt|json)$/i.test(f.name)&&!f.path.includes('/'));
    target.innerHTML=`${selected?`<div class="output-label">实际冻结成片 <a href="${U(selected.url)}" target="_blank" rel="noopener">打开原文件 ↗</a></div>${player(selected)}<div class="output-caption">${E(selected.path)} · ${T(selected.meta?.duration)} · ${selected.meta?.width||''} × ${selected.meta?.height||''}</div>${videos.length>1?`<div class="media-choice">${videos.map(f=>`<button class="${f===selected?'active':''}" data-result-media="${E(f.path)}">${E(f.name)}</button>`).join('')}</div>`:''}`:'<p class="result-note">此提交没有可直接播放的成片；请查看交付文件。</p>'}${viz?.type==='alpha'?alphaPanel(viz):''}${[5,9].includes(current.seq)?`<details class="comparison-section"><summary>打开输入 / 输出对照</summary><p class="result-note">两个播放器使用同一时间位置。点击“同步播放”可连续对照；预览压缩不用于重新评分。</p><div class="compare-grid"><div><span>题目输入</span>${player(current.files.find(f=>f.path===current.main),'compare-input')}</div><div><span>实际输出</span>${player(selected,'compare-output')}</div></div><button class="button" data-compare>同步播放 / 暂停</button><button class="button" data-compare-reset>回到开头</button></details>`:''}${audios.length?`<h3 class="result-section-title">主要音频交付 <span>${audios.length} 条</span></h3><div class="audio-results">${audios.map(f=>`<div><span>${E(f.name)}</span><audio controls preload="none" src="${U(f.preview||f.url)}"></audio></div>`).join('')}</div>`:''}<div id="result-captions"></div>${texts.length?`<details class="result-details"><summary>查看报告、字幕与工程说明</summary><div class="file-list">${texts.map(f=>artifactRow(f)).join('')}</div></details>`:''}`;
    renderCaptions(target,selected);
    attachMediaErrors(target);
  }
  function alphaPanel(viz) {
    const samples=viz.samples,frame=0;
    return `<div class="alpha-panel"><h3 class="result-section-title">透明前景抽帧 <span>来自提交 RGBA ZIP</span></h3><p class="result-note">选取 0 / 25 / 50 / 75 / 99 帧观察边缘；以上深浅背景视频可查看完整动态。</p><div class="alpha-controls"><label>检查帧 <select id="alpha-frame">${[0,25,50,75,99].map(n=>`<option>${n}</option>`).join('')}</select></label><label>显示背景 <select id="alpha-bg"><option value="checker">棋盘格</option><option value="light">浅色</option><option value="dark">深色</option></select></label></div><div class="alpha-grid">${[1,2].map(n=>`<figure><div class="alpha-canvas checker"><img id="alpha-${n}" src="${U(samples.find(x=>x.clip===n&&x.frame===frame).url)}" alt="片段 ${n} 透明前景第 0 帧"></div><figcaption>片段 ${n} · 提交前景</figcaption></figure>`).join('')}</div></div>`;
  }
  function parseCues(text) {
    const time=t=>t.split(':').reduce((n,x)=>n*60+Number(x.replace(',','.')),0);
    return (text||'').replaceAll('\r','').split(/\n\s*\n/).map(block=>{const lines=block.split('\n'),i=lines.findIndex(l=>l.includes('-->'));if(i<0)return null;const m=lines[i].match(/(\d{1,2}:\d{2}(?::\d{2})?[.,]\d+)\s*-->\s*(\d{1,2}:\d{2}(?::\d{2})?[.,]\d+)/);return m?{start:time(m[1]),end:time(m[2]),text:lines.slice(i+1).join(' ')}:null;}).filter(Boolean);
  }
  function renderCaptions(target,selected) {
    const f=result.artifacts.find(f=>['subtitles_zh.srt','interview.srt','description.vtt','ad.vtt','zh.srt'].includes(f.name));
    if(!f?.text||!selected)return;
    const cues=parseCues(f.text),dest=target.querySelector('#result-captions');
    dest.innerHTML=`<details class="caption-section"><summary>字幕 / 描述导航 · ${cues.length} 条</summary><p class="result-note">以下为提交字幕原文，点击可跳转成片；文本正确性以独立评分为准。</p><div class="cue-scroll">${cues.map(c=>`<button class="cue-row" data-seek="${c.start}" data-cue-start="${c.start}" data-cue-end="${c.end}"><time>${T(c.start)}–${T(c.end)}</time><span>${E(c.text)}</span></button>`).join('')}</div></details>`;
    const video=target.querySelector('#result-video');
    video?.addEventListener('timeupdate',()=>dest.querySelectorAll('[data-cue-start]').forEach(el=>el.classList.toggle('current',video.currentTime>=+el.dataset.cueStart&&video.currentTime<+el.dataset.cueEnd)));
  }
  function renderTimeline(target,viz) {
    const source=current.files.find(f=>f.path===current.main),length=source?.meta?.duration||180;
    const rows=viz.type==='flags'?Object.keys(RULE):Object.keys(O);
    const entries=viz.type==='flags'?viz.flags:viz.states;
    const rowLabel=id=>viz.type==='flags'?id+' '+RULE[id]:O[id];
    target.innerHTML=`<div class="output-label">${viz.type==='flags'?'审核清单可视化':'对象状态可视化'} <span>下方视频是题目输入，用于定位答卷证据</span></div>${player(source,'result-video',viz.type==='flags')}<div class="timeline-note">点击时间轴片段或事件，可跳转到原片对应位置。时间轴展示 Solver 提交内容，颜色不代表独立裁判已确认语义正确。</div><div class="event-timeline"><div class="time-axis"><span>0:00</span><span>${T(length/2)}</span><span>${T(length)}</span></div>${rows.map(id=>`<div class="timeline-row"><b>${rowLabel(id)}</b><div class="timeline-track">${entries.filter(e=>(e.rule_id||e.object_id)===id).map(e=>{const start=Number(e.start),end=Number(e.end),title=viz.type==='flags'?`${id} ${e.identity||''} · ${T(start)}–${T(end)}`:`${STATE[e.visibility]||e.visibility} / ${STATE[e.state]||e.state||'—'} · ${T(start)}–${T(end)}`;return `<button style="left:${start/length*100}%;width:${Math.max(.3,(end-start)/length*100)}%" class="timeline-segment ${viz.type==='flags'?id:e.visibility==='not_visible'?'not-visible':e.visibility==='visible_uncertain'?'uncertain':'state-'+e.state}" data-seek="${start}" title="${E(title)}" aria-label="${E(rowLabel(id)+' '+title)}"></button>`;}).join('')}</div></div>`).join('')}</div>${viz.type==='states'?'<div class="score-legend"><span><i class="not-visible"></i>不可见</span><span><i class="uncertain"></i>状态未定</span><span>其余颜色区分状态，悬停查看具体标签。</span></div>':''}<div id="event-inspector" class="event-inspector">选择一条事件查看说明。</div><h3 class="result-section-title">${viz.type==='flags'?'提交的触发事件':'提交的连续性问题'}<span>${viz.type==='flags'?viz.flags.length:viz.issues.length} 项</span></h3><div class="score-table-wrap"><table class="result-table"><thead><tr><th>事件</th><th>时间</th><th>${viz.type==='flags'?'身份 / 匹配情况':'对象'}</th><th>依据</th></tr></thead><tbody>${(viz.type==='flags'?viz.flags:viz.issues).map((e,i)=>`<tr><td>${E(e.id)}</td><td><button class="text-button" data-event="${i}">${T(e.start??e.time)} ↗</button></td><td>${viz.type==='flags'?`${E(e.identity||RULE[e.rule_id])}<small class="${viz.matchedPredictionIndices.includes(i)?'good-text':'bad-text'}">${viz.matchedPredictionIndices.includes(i)?'程序匹配命中':'程序未匹配'}</small>`:O[e.object_id]}</td><td class="reason-cell">${E(e.reason)}</td></tr>`).join('')}</tbody></table></div>${viz.type==='flags'?ruleTable(viz.perRule):objectTable(viz.byObject)}<details class="result-details"><summary>${viz.type==='flags'?'提交的反例':'合法 / 未定变化复核'} · ${(viz.negatives||viz.controls||[]).length} 项</summary>${(viz.negatives||viz.controls||[]).map((e,i)=>`<div class="control-record"><button class="text-button" data-control="${i}">${E(e.rule_id||O[e.object_id])} · ${T(e.start??e.time)} ↗</button><p>${E(e.reason)}</p></div>`).join('')}</details>${viz.type==='states'?jsonDetails('完整对象状态表（提交内容）',viz.states):''}`;
    const video=target.querySelector('#result-video');
    if(viz.type==='flags')video.addEventListener('timeupdate',()=>drawBox(video,viz));
    attachMediaErrors(target);
  }
  let selectedEvent=null;
  function drawBox(video,viz) {
    const box=panel.querySelector('#result-bbox');if(!box)return;
    const e=selectedEvent==null?null:viz.flags[selectedEvent];
    if(!e?.track?.length||video.currentTime<e.start||video.currentTime>=e.end){box.hidden=true;return;}
    const track=e.track, t=video.currentTime;
    let a=track[0],b=track.at(-1);
    for(let i=0;i<track.length-1;i++){if(t>=track[i].time&&t<=track[i+1].time){a=track[i];b=track[i+1];break;}}
    const ratio=a===b?0:Math.max(0,Math.min(1,(t-a.time)/(b.time-a.time)));
    const rect=a.bbox.map((v,i)=>v+(b.bbox[i]-v)*ratio);
    box.hidden=false;box.style.left=rect[0]*100+'%';box.style.top=rect[1]*100+'%';box.style.width=(rect[2]-rect[0])*100+'%';box.style.height=(rect[3]-rect[1])*100+'%';
  }
  function artifactRow(f,report=false) {
    const collection=report?result.reports:result.artifacts,index=collection.indexOf(f);
    return `<div class="file-row"><span class="file-symbol">${f.kind==='video'?'▷':f.kind==='audio'?'♫':f.kind==='image'?'▧':'≡'}</span><div class="file-info"><div class="file-name">${E(report?f.role:f.name)}</div><div class="file-path">${E(f.path)}</div></div><span class="file-size">${SZ(f.bytes)}</span><div class="file-actions">${f.kind!=='project'?`<button data-file="${index}" data-case="${report?'report-':'result-'}${current.key}">预览</button>`:''}<a href="${U(f.url)}" target="_blank" rel="noopener" download="${E(f.name)}">原文件 ↗</a></div></div>`;
  }
  function renderFiles(target) {
    target.innerHTML=`<h3 class="result-section-title">全部冻结交付 <span>${result.artifacts.length} 个文件</span></h3><p class="result-note">原文件只读引用；预览和索引生成在看板目录。未运行提交中的重建脚本。</p><div class="file-toolbar">${['all',...Object.keys(K)].map(k=>`<button class="file-filter ${fileKind===k?'active':''}" data-result-kind="${k}">${k==='all'?'全部':K[k]}</button>`).join('')}</div><input type="search" class="file-search" id="result-file-search" aria-label="搜索作答文件" placeholder="搜索答卷文件或子目录…" value="${E(fileQuery)}"><div id="result-file-list" class="file-list"></div><div id="result-file-more"></div>`;
    updateFileList();
    target.querySelector('#result-file-search').addEventListener('input',e=>{fileQuery=e.target.value;filePage=50;updateFileList();});
  }
  function updateFileList(){const files=result.artifacts.filter(f=>(fileKind==='all'||f.kind===fileKind)&&f.path.toLowerCase().includes(fileQuery.toLowerCase()));panel.querySelector('#result-file-list').innerHTML=files.slice(0,filePage).map(f=>artifactRow(f)).join('')||'<p class="result-note">没有匹配的文件。</p>';panel.querySelector('#result-file-more').innerHTML=files.length>filePage?`<button class="button load-more" data-result-more>继续显示 · 还有 ${files.length-filePage} 个</button>`:'';}
  function renderProvenance(target) {
    const r=result;
    target.innerHTML=`<h3 class="result-section-title">运行与完整性</h3><dl class="run-details"><div><dt>Solver</dt><dd>${E(r.model)} / ${E(r.effort)}</dd></div><div><dt>Harness</dt><dd>${E(r.harness)}</dd></div><div><dt>所选试次</dt><dd>${E(r.attempt)}</dd></div><div><dt>开始时间</dt><dd>${r.started?E(new Date(r.started).toLocaleString('zh-CN',{timeZone:'Asia/Shanghai',hour12:false}))+'（北京时间）':'未记录'}</dd></div><div><dt>冻结路径</dt><dd>${E(r.submission)}</dd></div><div><dt>哈希核验</dt><dd>${r.integrity.passed?'全部一致':'存在差异'} · ${r.integrity.checkedFiles} 个文件</dd></div></dl>${r.timingNote?`<p class="result-note">${E(r.timingNote)}</p>`:''}${r.excludedAttempts.length?`<div class="result-notice">${r.excludedAttempts.map(E).join('<br>')}</div>`:''}<h3 class="result-section-title">独立评测与运行原始记录</h3><div class="file-list">${r.reports.map(f=>artifactRow(f,true)).join('')}</div>${r.selfChecks.length?`<h3 class="result-section-title">提交者自检 <span>不计为独立评分</span></h3><p class="result-note">以下文件由作答 Agent 自己生成。即使写有通过，也不能替代独立裁判成绩。</p><div class="file-list">${r.artifacts.filter(f=>r.selfChecks.includes(f.path)).map(f=>artifactRow(f)).join('')}</div>`:''}${jsonDetails('当前文件核验记录',r.integrity)}`;
  }
  function seek(t,id='result-video') {
    const v=panel?.querySelector('#'+id);if(!v)return;
    const action=()=>{v.currentTime=Math.max(0,Number(t)||0);};
    if(v.readyState>=1)action();else{v.addEventListener('loadedmetadata',action,{once:true});v.load();}
  }
  function attachMediaErrors(target){target.querySelectorAll('video,audio').forEach(v=>v.addEventListener('error',()=>{if(v.nextElementSibling?.classList.contains('media-error'))return;const p=document.createElement('p');p.className='media-error';p.textContent='浏览器未能播放该文件。请使用“启动看板.cmd”的本地服务模式，或打开原文件。';v.after(p);},{once:true}));}
  document.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b||!panel?.isConnected)return;
    if(b.dataset.resultTab){panel.querySelectorAll('video,audio').forEach(m=>m.pause());tab=b.dataset.resultTab;render(current,result,panel);}
    else if(b.dataset.resultMedia){mediaPath=b.dataset.resultMedia;renderContent();}
    else if(b.dataset.resultKind){fileKind=b.dataset.resultKind;filePage=50;renderContent();}
    else if(b.hasAttribute('data-result-more')){filePage+=50;updateFileList();}
    else if(b.dataset.reviewSeek!==undefined){seek(b.dataset.reviewSeek,'review-video-'+b.dataset.reviewIndex);}
    else if(b.dataset.seek!==undefined){selectedEvent=null;seek(b.dataset.seek);}
    else if(b.dataset.event!==undefined||b.dataset.control!==undefined){const viz=result.visualization;const control=b.dataset.control!==undefined;const idx=Number(control?b.dataset.control:b.dataset.event);const entry=(control?(viz.negatives||viz.controls):(viz.flags||viz.issues))[idx];selectedEvent=!control&&viz.type==='flags'?idx:null;seek(entry.start??entry.time);const inspector=panel.querySelector('#event-inspector');inspector.innerHTML=`<b>${E(entry.id||entry.rule_id||entry.object_id)} · ${T(entry.start??entry.time)}</b><p>${E(entry.reason)}</p>${entry.track?.length?'<small>绿框为提交者报告的区域，随视频时间插值显示。</small>':''}`;}
    else if(b.hasAttribute('data-compare')){const a=panel.querySelector('#compare-input'),o=panel.querySelector('#compare-output');a.currentTime=o.currentTime;if(o.paused){Promise.allSettled([a.play(),o.play()]);}else{a.pause();o.pause();}}
    else if(b.hasAttribute('data-compare-reset')){panel.querySelectorAll('#compare-input,#compare-output').forEach(v=>{v.pause();v.currentTime=0;});}
  });
  document.addEventListener('change',e=>{
    if(e.target.id==='alpha-frame'){for(const clip of [1,2]){const f=result.visualization.samples.find(x=>x.clip===clip&&x.frame===Number(e.target.value));const img=panel.querySelector('#alpha-'+clip);img.src=U(f.url);img.alt=`片段 ${clip} 透明前景第 ${f.frame} 帧`;}}
    if(e.target.id==='alpha-bg')panel.querySelectorAll('.alpha-canvas').forEach(el=>el.className='alpha-canvas '+e.target.value);
  });
  window.OmniResults=Object.freeze({render,overview});
})();
