(() => {
  const data = window.OMNIALE_ERROR_EVIDENCE || {};
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const number = value => Number(value.toFixed(3)).toString();
  const finite = Number.isFinite;
  const time = t => Math.floor(t/60)+':'+(t%60).toFixed(2).padStart(5,'0');
  const labels = {timing:'字幕时间对齐',speakers:'说话人归属',overlap:'重叠对白',text:'文字准确度',format:'交付格式',consistency:'预览与字幕一致性',rebuild:'离线重建',readability:'烧录字幕可读性',actual_preview:'实际烧录预览'};
  const url = (path, external = false) => external && location.protocol === 'file:' && !/^https?:/.test(path)
    ? 'https://nanxiang-git.github.io/OmniALE_v2/case_dashboard/dist/'+path : path;
  function chart(rows) {
    const values = rows.map(row => Array.isArray(row) ? {label:row[0],score:row[1],maximum:row[2]} : row)
      .filter(r => finite(r.maximum) && (finite(r.score) || finite(r.lower)) && r.maximum > 0)
      .map(r => ({...r,lo:Math.max(0,r.maximum-(r.score??r.upper)),hi:Math.max(0,r.maximum-(r.score??r.lower))}))
      .filter(r => r.hi > .00001).sort((a,b)=>b.lo/a.maximum-a.lo/b.maximum || b.hi/b.maximum-a.hi/a.maximum);
    return '<h3>失分构成</h3><p class="result-note">显示各评分项自身的失分与待判范围，最终总分按题目原公式计算。</p><div class="error-bars">'+values.map(r=>{
      const formatted = Math.abs(r.hi-r.lo)<.00001 ? number(r.lo) : number(r.lo)+'–'+number(r.hi);
      return `<div class="error-bar"><div><strong>${escape(r.label || labels[r.id] || r.id)}</strong><span>扣 ${formatted} / ${number(r.maximum)}</span></div>
        <div class="error-track" role="img" aria-label="${escape(r.label||r.id)} 扣 ${formatted}"><i style="width:${100*r.lo/r.maximum}%"></i><b style="width:${100*(r.hi-r.lo)/r.maximum}%"></b></div></div>`;
    }).join('')+'</div>';
  }
  function compareCard(card, source, answer) {
    const clip = (path,t,end) => escape(path+'#t='+Math.max(0,t-.35).toFixed(2)+','+Math.max(t+.5,end+.35).toFixed(2));
    return `<article class="error-card">
      <div class="error-card-title"><h4>${escape(card.title)}</h4><span>${time(card.start)}–${time(card.end)}</span></div>
      <p>${escape(card.reason)}</p><p class="error-category">${escape(card.label || labels[card.criterion] || card.criterion)} ${escape(card.specific_loss || '')}</p>
      <div class="error-comparison">
        <figure><img src="${escape(card.source_image)}" loading="lazy" alt="原始素材该时间点"><figcaption>原片 ${time(card.frame_time)} <a href="${clip(source,card.start,card.end)}" target="_blank" rel="noopener">播放证据</a></figcaption></figure>
        <figure><img src="${escape(card.answer_image)}" loading="lazy" alt="模型交付对应时间点"><figcaption>模型 ${time(card.output_time)} <a href="${clip(answer, Math.min(card.output_time,card.start), Math.max(card.output_time,card.end))}" target="_blank" rel="noopener">播放证据</a></figcaption></figure>
      </div>
      ${card.kind==='audio' ? '<p class="result-note">画面供定位，扣分依据为对应时段的实际声音。</p>':''}
    </article>`;
  }
  function primary(id, alias, source, model) {
    const score = model.scoring;
    if (!score) return '<p>评分待完成。</p>';
    const sourceVideo=source.files.find(f=>f.path==='input/source.mp4')?.url;
    const cards=(data[id]?.[alias]||[]).map(card=>{
      const row=score.rows.find(r=>r.id===card.criterion);
      return {...card,label:row?.label||labels[card.criterion]||card.criterion};
    });
    const gates=Array.isArray(score.gates) ? score.gates.filter(g=>typeof g==='object' && g.status==='fail').map(g=>g.reason||g.id) : [];
    return chart(score.rows)+`<h3>主要错误与原片对照</h3><p class="result-note">时间以本题视频为准。点击播放证据可复听对应片段。</p>
      <div class="error-cards">${cards.map(c=>compareCard(c,sourceVideo,model.video.url)).join('')}</div>
      ${gates.length ? '<h3>硬门槛</h3><p>'+gates.map(escape).join(' · ')+'</p>':''}
      <p class="result-note"><a href="variant-results/case-${id}/${alias}/scoring.json" download>完整评分记录</a></p>`;
  }
  function detailed(item,run,index) {
    const reports=(run.reports||[]).map(f=>f.url?`<a href="${escape(url(f.url,true))}" download>${escape(f.name)}</a>`:'').join(' · ');
    const evidence=(run.evidence||[]).filter(g=>/帧分|全帧诊断|秒/.test(g.title));
    let content=chart(run.rows||[]);
    if(item.comparison) {
      const source=item.files.find(f=>f.name===item.main);
      const candidates=item.comparison.segments.filter(s=>s.answers[index]?.errors?.length || s.answers[index]?.note)
        .sort((a,b)=>(b.answers[index]?.errors?.length||0)-(a.answers[index]?.errors?.length||0)).slice(0,4);
      content+=`<h3>代表性手语误译</h3><div class="error-cards">${candidates.map(s=>{
        const ans=s.answers[index];
        const caption=items=>items.map(x=>x.text??x).join(' / ');
        return `<article class="error-card"><div class="error-card-title"><h4>${escape(s.id)} · ${escape((ans.errors||[]).join(' / ')||'语义评审')}</h4><span>${time(s.start)}–${time(s.end)}</span></div>
          <video controls playsinline preload="none" src="${escape(url(source.url,true)+'#t='+s.start+','+s.end)}"></video>
          <div class="error-comparison"><div><strong>参考</strong><p>${escape(s.zh)}</p><small>${escape(s.en)}</small></div><div><strong>模型字幕</strong><p>${escape(caption(ans.zh))}</p><small>${escape(caption(ans.en))}</small></div></div>
          <details><summary>评审依据</summary><p>${escape(ans.note)}</p></details></article>`;
      }).join('')}</div>`;
      return content+'<p>'+reports+'</p>';
    }
    const concise=(run.notes||[]).filter(n=>/残留|错抠|最低|偏软|淡影|衰减|漏|串音|缺少|分差|未通过|失分/.test(n)).slice(0,4);
    content+=`<h3>主要扣分原因</h3><ul class="error-notes">${(concise.length?concise:(run.notes||[]).slice(0,3)).map(n=>'<li>'+escape(n)+'</li>').join('')}</ul>`;
    const chosen=evidence.filter(g=>/全帧诊断/.test(g.title));
    const frames=chosen.length ? [...chosen,...evidence.filter(g=>!chosen.includes(g)).slice(0,2)] : evidence.slice(0,4);
    content+=`<h3>证据帧对照</h3><div class="error-cards">${frames.map(group=>`<article class="error-card"><h4>${escape(group.title)}</h4><div class="error-comparison">
      ${group.files.map(f=>`<figure><img loading="lazy" src="${escape(url(f.url,true))}" alt="${escape(f.label||f.name)}"><figcaption>${escape(f.label||f.name)}</figcaption></figure>`).join('')}</div></article>`).join('')}</div><p>${reports}</p>`;
    if(run.listening) content+=`<details><summary>收听音频证据</summary>${(run.listening.audio||[]).map(f=>`<figure><figcaption>${escape(f.name)}</figcaption><audio controls preload="none" src="${escape(url(f.url,true))}"></audio></figure>`).join('')}</details>`;
    return content;
  }
  window.OmniErrorAnalysis={primary,detailed};
})();

