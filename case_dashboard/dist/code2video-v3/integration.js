(() => {
 'use strict';const data=window.CODE2VIDEO_V3,prior=window.OmniResults,registry=window.OMNIALE_DATA;
 if(!data||!prior||!registry)return;const key='task-code2video';
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const task=registry.cases.find(x=>x.key===key);if(!task)return;
 const g=data.models[0];
 Object.assign(task,{title:'真实品牌动画 · 全段重建、人像合成与音画同步',versionLabel:'Code2Video v3 / 评分v3.1',summary:'BUCK × Adobe完整10秒。阶段一无声重建并抠像；阶段二释放新音轨，执行局部音频驱动返修。'+data.models.map(x=>x.model+' '+x.total+'/100').join('；'),main:'stage1/input/reference_silent_10s.mp4',poster:'code2video-v3/poster.jpg',directory:'case_code2video/av_v3',files:data.files,task:data.task,contract:data.contract,delivery:['R：10秒无声重建','E：10秒候选B音轨驱动返修','真实人像alpha、窗口与前景遮挡','共享可编辑工程、控制配置与诊断'],resultCount:data.models.length,resultSummary:data.models.map(x=>x.model+' / xhigh · '+x.total+'/100').join('；')});
 const old=window.OMNIALE_RESULTS[key];window.OMNIALE_RESULTS[key]={...old,total:g.total,verified:g.total,accepted:g.passed,gradeStatus:'complete',gradeNote:g.summary,seconds:g.runtime_seconds,model:g.model,rows:g.criteria.map(x=>({id:x.id,label:x.title,maximum:x.weight,points:x.score,group:'judge'})),comparisons:data.models.slice(1).map(x=>({model:x.model,total:x.total,verified:x.total})),artifacts:[],integrity:{passed:true}};
 let selected=0,section='media';
 const asset=p=>'code2video-v3/'+p;
 const link=(p,label)=>`<a href="${esc(asset(p))}" target="_blank" rel="noopener">${esc(label)} ↗</a>`;
 const modelKey=m=>m.model.includes('astra')?'astra':'sol';
 const base=m=>modelKey(m)==='astra'?'runs/astra_xhigh_20261120_v31/':'';
 const movie=(p,label)=>`<div><p><b>${esc(label)}</b></p><video controls playsinline preload="metadata" src="${esc(asset(p))}" aria-label="${esc(label)}"></video></div>`;
 function media(m){const k=modelKey(m),b=base(m);return movie(`review/derived/${k}_same_audio_compare.mp4`,'同音轨对照 · 左 R+B / 右 E')+`<p class="cv-note">左侧把无声重建直接配上 B；右侧为模型按声音调整后的返修成片。请正常速度比较动作完成时刻：A 0.90 秒、B 2.61 秒、C 4.30 秒。</p><div class="cv-actions">${[['0.55','A · 网格拼装'],['2.2','B · 插画展开'],['3.85','C · 人物揭示']].map(([t,l])=>`<button data-cv-jump="${t}">${l}</button>`).join('')}</div><div class="cv-pair">${movie(b+'sealed/stage1/submission/reconstruction.mp4','第一阶段 R · 无声重建')}${movie(b+'sealed/stage2/submission/revision.mp4','第二阶段 E · 音频驱动返修')}</div>`;}
 function scores(m){return `<div class="cv-metrics">${m.categories.map(x=>`<div>${esc(x.title)}<strong>${x.score} <small>/ ${x.maximum}</small></strong></div>`).join('')}</div><p><b>总分 ${m.total} / 100 · ${m.passed?'通过':'未通过'}</b> · 通过线 ${m.pass_threshold}。</p><p>总分 = Σ（子项权重 × 达成档位）。档位固定为 0 / 0.25 / 0.5 / 0.75 / 1；无总分折扣或模型分数上限。展开下列项目可查看计算、扣分原因和原始证据。</p>${m.criteria.map(c=>`<details class="cv-criterion"><summary>${esc(c.title)} <b>${c.score} / ${c.weight}</b></summary><div class="cv-scroll"><table><thead><tr><th>子项</th><th>权重 × 档位</th><th>得分</th><th>错误原因与证据</th></tr></thead><tbody>${c.components.map(x=>`<tr><td>${esc(x.name)}</td><td>${x.weight} × ${x.tier}</td><td>${x.score}</td><td>${esc(x.reason)}<div>${x.evidence.map((e,i)=>link(e,'证据 '+(i+1))).join(' · ')}</div></td></tr>`).join('')}</tbody></table></div></details>`).join('')}<p>${link('evaluation_v31/SCORING.md','完整评分规则')} · ${link(`evaluation_v31/${modelKey(m)}/grade.json`,'原始评分 JSON')}</p>`;}
 function records(m){const k=modelKey(m);return `<h3>运行与交付</h3><p>${esc(m.model)} / xhigh · Codex · 不限时<br>累计运行 ${(m.runtime_seconds/60).toFixed(2)} 分钟 · ${m.completed_requests} 次完成请求</p><p>${esc(m.implementation||'Python/Cairo绘制、RVM/ONNX抠像、NumPy/SciPy/OpenCV分析合成和FFmpeg编码；未使用Blender。')}</p><div class="cv-actions">${link(`evaluation_v31/${k}/project.zip`,'下载可编辑工程')}${link(`evaluation_v31/${k}/RESULTS.md`,'评分报告')}${link(k==='sol'?'reports/verification.json':'evaluation_v31/astra/verification.json','独立验证')}</div><h3>实验说明与评测边界</h3><ul>${m.limitations.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;}
 function rhythmComparison(newGrade, oldGrade) {
  const root = 'rhythm_v4/';
  const scoreRow = (label, grade) => `<tr><td><b>${label}</b></td>${grade.categories.map(category => `<td>${category.score}</td>`).join('')}<td><b>${grade.total}</b></td></tr>`;
  const eventRows = newGrade.events.map(event => `<tr><td>${esc(event.action)}</td><td>${esc(event.sound)}</td><td>${esc(event.actual)}</td><td>${esc(event.finding)}</td></tr>`).join('');
  const breakdown = newGrade.criteria.map(criterion => `<details class="cv-criterion">
   <summary>${esc(criterion.title)} <b>${criterion.score} / ${criterion.weight}</b></summary>
   <div class="cv-scroll"><table><thead><tr><th>子项</th><th>权重 × 档位</th><th>得分</th><th>依据</th></tr></thead>
   <tbody>${criterion.components.map(item => `<tr><td>${esc(item.name)}</td><td>${item.weight} × ${item.tier}</td><td>${item.score}</td><td>${esc(item.reason)}<div>${item.evidence.map((file, i) => link(file, `证据 ${i + 1}`)).join(' · ')}</div></td></tr>`).join('')}</tbody></table></div>
  </details>`).join('');
  return `<section data-cv-rhythm class="cv-criterion">
   <h2>Sol 新旧题对照 · 自主音画节奏</h2>
   <p>GPT‑6.1‑Sol · xhigh · Codex · 不限时。使用同一份第一阶段重建和同一条候选 B 音轨。新版第二阶段用时 ${(newGrade.runtime_seconds / 60).toFixed(1)} 分钟。</p>
   <div class="cv-scroll"><table><thead><tr><th>第二阶段题目</th><th>视觉 /70</th><th>音画 /25</th><th>工程 /5</th><th>总分 /100</th></tr></thead><tbody>
    ${scoreRow('v3 · 指定对齐规则', oldGrade)}${scoreRow('v4 · 自主选择动作落点', newGrade)}
   </tbody></table></div>
   <p class="cv-note">两行均为各自题目的正式成绩。音画维度的评分项不同，分差同时包含题面和评分口径变化。</p>
   <p>${esc(newGrade.summary)}</p>
   ${movie(root + 'evidence/old_vs_new.mp4', '同一音轨 · 左 v3 指定对齐 / 右 v4 自主节奏')}
   <div class="cv-scroll"><table><thead><tr><th>动作</th><th>所选声音线索</th><th>新版实际画面</th><th>核验</th></tr></thead><tbody>${eventRows}</tbody></table></div>
   <details class="cv-criterion"><summary>原始成片和偏移对照</summary>
    <p class="cv-note">偏移对照保留 v4 画面，将 B 延后 0.25 秒。</p>
    ${movie(root + 'run/sealed/submission/revision.mp4', 'v4 原始提交成片')}
    ${movie(root + 'evidence/audio_delayed_250ms.mp4', 'v4 音轨延后 0.25 秒')}
    <p>${link('sealed/stage2/submission/revision.mp4', '打开 v3 原始成片')} · ${link(root + 'evidence/timeline.jpg', '新旧关键帧')}</p>
   </details>
   <details class="cv-criterion"><summary>v4 评分计算与逐项扣分</summary><p>总分为各子项权重 × 达成档位之和。通过线 85 分。</p>${breakdown}</details>
   <p>${link('stage2/TASK.md', 'v3 题面')} · ${link(root + 'candidate/TASK.md', 'v4 题面')} · ${link(root + 'SCORING.md', 'v4 冻结评分规则')} · ${link(root + 'RESULTS.md', 'v4 完整评审记录')}</p>
   <p class="cv-note">评分结合音频信号、逐帧检查和独立重渲染。偏移样片供自行对照，本次未安排独立人耳盲评。</p>
  </section>`;
 }
 function render(c,r,target){
  if(c.key!==key)return prior.render(c,r,target);
  target.querySelectorAll('video,audio').forEach(v=>v.pause());const m=data.models[selected];
  target.innerHTML=`<section class="cv3" data-code2video-v3><header><p class="cv-note">CODE2VIDEO · 最新实验 · 题目 v3 / 评分 v3.1</p><h2>真实品牌动画重建与音画同步</h2><p>两阶段 · 完整 10 秒 · 真实人像抠像与合成 · 双模型评分完成</p></header><div class="cv-scroll"><table data-cv-models><thead><tr><th>模型 / 推理</th><th>视觉 /70</th><th>音画 /25</th><th>工程 /5</th><th>总分 /100</th><th>答卷</th></tr></thead><tbody>${data.models.map((x,i)=>`<tr class="${selected===i?'cv-selected':''}"><td><b>${esc(x.model)}</b><small>xhigh · 不限时</small></td>${x.categories.map(cat=>`<td>${cat.score}</td>`).join('')}<td><b class="cv-total">${x.total}</b><small>${x.passed?'通过':'未通过'}</small></td><td><button data-cv-model="${i}" aria-pressed="${selected===i}">${selected===i?'正在查看':'查看答卷'}</button></td></tr>`).join('')}</tbody></table></div><p class="cv-note">Sol 为既有答卷按新规则复评；Astra 为规则冻结后的新运行。下方均为最新结果。</p><h3>${esc(m.model)} <span class="cv-note">xhigh · ${m.total} / 100</span></h3><p>${esc(m.summary)}</p><nav class="cv-actions" aria-label="模型结果分区">${[['media','成片与音画对照'],['scores','评分与扣分'],['records','交付与记录']].map(([k,l])=>`<button data-cv-section="${k}" aria-pressed="${section===k}">${l}</button>`).join('')}</nav><div data-cv-content>${section==='scores'?scores(m):section==='records'?records(m):media(m)}</div><p class="cv-note">${link('review/index.html','单独打开完整证据看板')}</p></section>`;
  if (data.rhythmComparison) {
   target.querySelector('[data-code2video-v3] header').insertAdjacentHTML('afterend', rhythmComparison(data.rhythmComparison, g));
  }
  target.querySelectorAll('[data-cv-model]').forEach(b=>b.onclick=()=>{selected=Number(b.dataset.cvModel);render(c,r,target);target.querySelector(`[data-cv-model="${selected}"]`).focus({preventScroll:true});});
  target.querySelectorAll('[data-cv-section]').forEach(b=>b.onclick=()=>{section=b.dataset.cvSection;render(c,r,target);target.querySelector(`[data-cv-section="${section}"]`).focus({preventScroll:true});});
  target.querySelectorAll('[data-cv-jump]').forEach(b=>b.onclick=()=>{const v=target.querySelector('[data-cv-content] video');v.currentTime=Number(b.dataset.cvJump);v.play().catch(()=>{});});
  target.querySelectorAll('video,audio').forEach(v=>v.addEventListener('play',()=>target.querySelectorAll('video,audio').forEach(other=>{if(other!==v)other.pause();})));
 }
 const style=document.createElement('style');style.textContent=`.cv3{min-width:0;line-height:1.7}.cv3 h2{font-size:25px}.cv3 h3{margin-top:24px}.cv3 video{width:100%;background:#eef2f7;border-radius:10px}.cv3 .cv-note{color:#617087;font-size:13px}.cv-scroll{overflow:auto}.cv3 table{width:100%;border-collapse:collapse;min-width:620px}.cv3 th,.cv3 td{padding:12px;text-align:left;border-bottom:1px solid #dde4ee;vertical-align:top}.cv3 th{font-size:13px}.cv3 small{display:block;font-size:12px;font-weight:400;color:#617087}.cv-selected{background:#edf4ff}.cv-total{font-size:24px;color:#245bc1}.cv-actions{display:flex;gap:9px;flex-wrap:wrap;margin:16px 0}.cv3 button{padding:9px 12px;border:1px solid #cbd5e1;border-radius:8px;background:white;font:inherit;font-size:13px;cursor:pointer}.cv3 button[aria-pressed=true]{background:#245bc1;color:white;border-color:#245bc1}.cv-pair,.cv-metrics{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.cv-metrics{grid-template-columns:repeat(3,minmax(0,1fr))}.cv-metrics>div{padding:16px;border:1px solid #dde4ee;border-radius:10px}.cv-metrics strong{display:block;font-size:28px}.cv-metrics small{display:inline}.cv-criterion,.cv-task-text{padding:15px;border:1px solid #dde4ee;border-radius:9px;margin:12px 0}.cv-criterion summary,.cv-task-text summary{cursor:pointer;font-weight:600}.cv-criterion summary b{float:right}.cv3 li{margin:9px 0}.cv3 a{overflow-wrap:anywhere}@media(max-width:700px){.cv-pair,.cv-metrics{grid-template-columns:1fr}.cv-criterion summary b{float:none;margin-left:8px}.cv3 h2{font-size:21px}}`;document.head.append(style);
 style.textContent+='@media(max-width:650px){body:has([data-code2video-v3]) .sidebar{flex-wrap:wrap;gap:12px}body:has([data-code2video-v3]) .sidebar>nav:first-of-type{flex-wrap:wrap;max-width:100%}}';
 // Keep the user's exact /task bookmark usable: results first, full task below.
 // Observe only the app root; other cases and their route handling stay native.
 const taskEntry=()=>{if(!['#'+key+'/task','#'+key].includes(location.hash))return;const panel=document.querySelector('#detail-panel');if(!panel||panel.querySelector('[data-code2video-v3]')||document.querySelector('#tab-task')?.getAttribute('aria-selected')!=='true')return;const details=document.createElement('details');details.className='cv-task-text';const summary=document.createElement('summary');summary.textContent='完整题面 · 阶段一重建 / 阶段二音频驱动返修';details.append(summary);while(panel.firstChild)details.append(panel.firstChild);const results=document.createElement('div');panel.append(results,details);render(task,window.OMNIALE_RESULTS[key],results);};
 new MutationObserver(taskEntry).observe(document.querySelector('#main'),{childList:true,subtree:true});
 window.OmniResults=Object.freeze({...prior,render,
  overview(cases,results,target){prior.overview(cases,results,target);const row=target.querySelector(`a[href="#${key}/results"]`)?.closest('tr');if(row){row.innerHTML=`<td><a href="#${key}/results"><b>${esc(task.title)}</b><small>Code2Video v3 · 评分v3.1</small></a></td><td colspan="3">${data.models.map(m=>`${esc(m.model)} / xhigh · <b>${m.total} / 100</b>`).join('<br>')}</td><td>不限时</td><td>${data.models.filter(m=>m.passed).length}组通过</td><td><a class="button" href="#${key}/results">查看 ↗</a></td>`;row.dataset.code2videoVersion='v3';}}
 });
})();
