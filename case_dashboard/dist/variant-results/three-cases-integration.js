(() => {
  'use strict';
  const cases = window.OMNIALE_DETAILED_VARIANTS;
  const registry = window.OMNIALE_DATA;
  const old = window.OmniResults;
  if (!cases || !registry || !old) return;
  const key = item => item.key || 'task-variant-' + item.id;
  const route = item => '#' + key(item) + '/task';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
  const format = value => typeof value === 'number' ? String(Number(value.toFixed(4))) : esc(value ?? '待评');
  const duration = value => value == null ? '待记录' : Math.floor(value / 60) + ' 分 ' + Math.floor(value % 60) + ' 秒';
  const link = file => file.url ? `<a href="${esc(file.url)}" download>${esc(file.name)}</a>` :
    `<span title="${esc(file.label)}">${esc(file.name)}（服务器封存）</span>`;
  const table = (cols, rows) => `<div class="score-table-wrap"><table class="result-table">
    <thead><tr>${cols.map(c => `<th scope="col">${esc(c)}</th>`).join('')}</tr></thead>
    <tbody>${rows.map(row => `<tr><th scope="row">${esc(row[0])}</th>${row.slice(1).map(cell =>
      `<td>${format(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const player = media => `<figure><video class="variant-video" controls playsinline preload="metadata"
    src="${esc(media.url)}"${media.poster ? ' poster="' + esc(media.poster) + '"' : ''}>
    ${(media.tracks || []).map((track,i) => `<track kind="subtitles" src="${esc(track.url)}"
      srclang="${esc(track.lang)}" label="${esc(track.label)}"${i===0 ? ' default' : ''}>`).join('')}
    </video><figcaption>${esc(media.label || media.name)} · ${link(media)}</figcaption></figure>`;

  function mediaComparison(target, media) {
    target.innerHTML = `<h3>三路音画对比</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,185px),1fr));gap:12px">
        ${media.map(clip => `<figure style="margin:0;min-width:0">
          <video class="variant-video" style="display:block;width:100%;margin:0;aspect-ratio:640/338;background:#000"
            playsinline preload="auto" muted aria-label="${esc(clip.label)}" src="${esc(clip.url)}"></video>
          <figcaption><a href="${esc(clip.url)}" target="_blank" rel="noopener">${esc(clip.label)}</a></figcaption>
        </figure>`).join('')}
      </div>
      <div class="variant-result-nav" style="align-items:center" role="group" aria-label="同步播放">
        <button type="button" class="button" data-compare-play>同步播放</button>
        <label>收听 <select data-compare-audio>
          <option value="mute">静音</option>
          ${media.map((clip,i) => `<option value="${i}">${esc(clip.label)}</option>`).join('')}
        </select></label>
        <output data-compare-time>0.00 / 26.00 秒</output>
      </div>
      <input aria-label="三路同步进度" type="range" min="0" max="26" step="0.01" value="0"
        data-compare-seek style="width:100%">
      <p class="result-note" data-compare-status aria-live="polite"></p>`;
    const videos = [...target.querySelectorAll('video')];
    const play = target.querySelector('[data-compare-play]');
    const audio = target.querySelector('[data-compare-audio]');
    const seek = target.querySelector('[data-compare-seek]');
    const time = target.querySelector('[data-compare-time]');
    const status = target.querySelector('[data-compare-status]');
    const [leader, ...followers] = videos;
    let wantsPlayback = false;
    let buffering = false;
    let playbackAttempt = 0;

    function display(seconds) {
      seek.value = seconds;
      time.textContent = seconds.toFixed(2) + ' / 26.00 秒';
    }

    function goTo(seconds) {
      for (const video of videos) {
        if (Math.abs(video.currentTime - seconds) > 0.02) video.currentTime = seconds;
      }
      display(seconds);
    }

    function pause() {
      wantsPlayback = false;
      buffering = false;
      playbackAttempt++;
      videos.forEach(video => video.pause());
      play.textContent = '同步播放';
      status.textContent = '';
    }

    function resumeWhenReady() {
      if (!buffering || videos.some(video => video.seeking ||
          video.readyState < HTMLMediaElement.HAVE_FUTURE_DATA)) return;
      buffering = false;
      status.textContent = '';
      const attempt = playbackAttempt;
      Promise.all(videos.map(video => video.play())).catch(() => {
        if (attempt !== playbackAttempt) return;
        pause();
        status.textContent = '同步播放未能启动。可重试，或点击视频下方的名称单独打开。';
      });
    }

    function bufferAt(seconds) {
      buffering = true;
      playbackAttempt++;
      videos.forEach(video => video.pause());
      status.textContent = '正在缓冲三路视频…';
      goTo(seconds);
      resumeWhenReady();
    }

    play.addEventListener('click', () => {
      if (wantsPlayback) {
        pause();
        return;
      }
      wantsPlayback = true;
      play.textContent = '暂停';
      bufferAt(Number(seek.value) >= Number(seek.max) ? 0 : Number(seek.value));
    });
    audio.addEventListener('change', () => {
      videos.forEach((video,i) => { video.muted = audio.value !== String(i); });
    });
    seek.addEventListener('input', () => {
      const seconds = Number(seek.value);
      if (wantsPlayback && seconds < Number(seek.max)) {
        bufferAt(seconds);
      } else {
        pause();
        goTo(seconds);
      }
    });
    leader.addEventListener('timeupdate', () => {
      if (!wantsPlayback || buffering || leader.seeking) return;
      const seconds = leader.currentTime;
      display(seconds);
      for (const video of followers) {
        if (!video.seeking && video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA &&
            Math.abs(video.currentTime - seconds) > 0.16) video.currentTime = seconds;
      }
    });
    leader.addEventListener('ended', () => {
      pause();
      display(leader.duration);
    });
    for (const video of videos) {
      video.addEventListener('canplay', resumeWhenReady);
      video.addEventListener('seeked', resumeWhenReady);
      video.addEventListener('waiting', () => {
        if (wantsPlayback && !buffering && !video.ended &&
            video.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) bufferAt(video.currentTime);
      });
      video.addEventListener('error', () => {
        pause();
        status.textContent = '有视频加载失败。可刷新页面，或点击视频下方的名称单独打开。';
      });
    }
    return pause;
  }

  function bilingual(zh,en) {
    const language = (cues, label, lang) => `<div lang="${lang}">
      <strong>${label}</strong>${cues.length ? cues.map(cue=>`<p style="white-space:pre-line">${esc(cue.text ?? cue)}${cue.time ? `<br><small>${esc(cue.time)}</small>` : ''}</p>`).join('') : '<p>未提交字幕</p>'}</div>`;
    return language(zh,'中文','zh-CN')+language(en,'English','en');
  }

  function signTable(comparison,segment) {
    const columns = ['参考译文',...comparison.models];
    const cards = [bilingual([segment.zh],[segment.en]),...segment.answers.map(answer=>
      bilingual(answer.zh,answer.en)+`<details><summary>逐段评语</summary><p>${esc(answer.note)}</p></details>`)];
    return `<div class="variant-grid">${cards.map((card,i)=>`<article class="variant-case">
      <h4>${esc(columns[i])}</h4>${card}</article>`).join('')}</div>`;
  }

  let sequence = Math.max(...registry.cases.map(x => Number(x.seq) || 0));
  for (const item of cases) {
    const original = registry.cases.find(entry => entry.key === item.original);
    const taskFile = item.files.find(f => f.name === 'TASK.md');
    const folder = taskFile.url.slice(0,taskFile.url.lastIndexOf('/'));
    const main = item.files.find(f => f.name === item.main);
    const files = item.files.map(f => ({...f,path:f.url.startsWith(folder+'/') ? f.url.slice(folder.length+1) : f.path}));
    const freeze = item.runs.filter(run => run.total != null).map(run => run.model + ' ' + run.total);
    registry.cases.push({
      key:key(item), resultKey:key(item), caseId:item.id, seq:++sequence,
      category:original?.category || '音视频制作', status:'packaged', versionLabel:item.versionLabel || '换素材变式',
      title:item.title + ' · 换素材变式',summary:item.summary,
      main:files.find(f=>f.name===item.main)?.path, poster:main?.poster, directory:folder,
      task:item.task,contract:item.delivery.map(t=>'- '+t).join('\n')+'\n\n## 评分\n\n'+item.formula,
      files,delivery:item.delivery,resultCount:item.runs.length,
      resultSummary:freeze.length ? freeze.join(' · ') : item.runs[0].summary,
    });
  }

  function overview(tasks, results, target) {
    old.overview(tasks, results, target);
    const panel = target.querySelector('.variant-grid') || target.querySelector('.variant-entry') || target.querySelector('.hero');
    if (!panel) return;
    const html = `<section aria-label="换素材变式题" class="variant-dashboard">
      <header class="variant-case-head"><h2>音画修复、手语与导播抠像</h2></header>
      <div class="variant-grid">${cases.map(item=>`<article class="variant-case">
        <p class="variant-case-id">Case ${String(item.id).padStart(2,'0')}</p>
        <h3>${esc(item.title)}</h3><p>${esc(item.summary)}</p>
        <p>${item.runs.map(run=>esc(run.model+' · '+(run.total ?? run.status))).join(' / ')}</p>
        <a class="button" href="${route(item)}">查看题面</a>
        <a class="button primary" href="#${key(item)}/results">查看模型交付与评分</a>
      </article>`).join('')}</div></section>`;
    panel.insertAdjacentHTML('afterend',html);
  }

  function render(entry, result, target) {
    const item = cases.find(candidate => key(candidate) === entry.key);
    if (!item) return old.render(entry,result,target);
    const panels = [['answer','模型交付'],['scores','分数构成'],['analysis','错误分析']];
    if (item.mediaComparison) panels.unshift(['media-compare','三路音画对比']);
    if (item.comparison) panels.unshift(['compare','逐段答案对照']);
    if (item.runs.some(run=>run.listening)) panels.push(['listening','音频独立听评']);
    const initial = item.runs.length > 1 && item.id===7 ? item.runs.length-1 : 0;
    let current = initial;
    let selected = panels[0][0];
    let signIndex = 0;
    let stopComparison;
    target.innerHTML = `<section class="variant-case-results" data-detailed-case="${item.id}">
      <h2 class="result-section-title">模型作答对照</h2>
      ${table(['模型','推理','作答预算','用时','正式分 / 100','状态'],
        item.runs.map(run => [run.model,run.effort,run.budget,duration(run.seconds),run.total,run.status]))}
      <div class="variant-result-nav" role="group" aria-label="选择答卷">
        ${item.runs.map((run,i)=>`<button type="button" class="button" data-detailed-run="${i}">${esc(run.model)}</button>`).join('')}
      </div>
      <div class="variant-result-nav" role="group" aria-label="答卷内容">
        ${panels.map(([id,label])=>`<button type="button" class="button" data-detailed-panel="${id}">${label}</button>`).join('')}
      </div><div data-detailed-body class="variant-result-content"></div>
      <p class="variant-result-links"><a href="#${item.original}/task">查看原题</a>
      <a href="#results/variants">变式汇总</a></p></section>`;
    const buttons = target.querySelectorAll('[data-detailed-run],[data-detailed-panel]');
    function update() {
      stopComparison?.();
      stopComparison = undefined;
      const run = item.runs[current];
      buttons.forEach(button => button.setAttribute('aria-pressed',String(button.dataset.detailedRun === String(current)
        || button.dataset.detailedPanel === selected)));
      const body = target.querySelector('[data-detailed-body]');
      const reports = (run.reports || []).map(link).join(' · ');
      if (selected === 'media-compare') {
        stopComparison = mediaComparison(body, item.mediaComparison);
      } else if (selected === 'compare' && item.comparison) {
        const compare = item.comparison;
        const segment = compare.segments[signIndex];
        body.innerHTML = `<h3>逐段答案对照</h3>
          <p>中文参考来自 CE-CSL 标注，英文是题方参考译文。右侧三份答案直接读取各模型封存的 SRT。</p>
          <figure><video controls playsinline preload="metadata" style="width:100%" src="${esc(item.files.find(f=>f.name===item.main).url)}" data-sign-video></video></figure>
          <div class="variant-result-nav"><label>表达片段
            <select data-sign-segment>${compare.segments.map((entry,i)=>`<option value="${i}"${i===signIndex?' selected':''}>${entry.id} · ${entry.start.toFixed(2)}–${entry.end.toFixed(2)} 秒</option>`).join('')}</select></label>
            <button type="button" class="button" data-sign-play>播放该片段</button>${link(compare.download)}</div>
          <div data-sign-answers>${signTable(compare,segment)}</div>`;
        const video = body.querySelector('[data-sign-video]');
        const select = body.querySelector('[data-sign-segment]');
        select.addEventListener('change',()=>{
          signIndex=Number(select.value);
          video.pause();
          body.querySelector('[data-sign-answers]').innerHTML=signTable(compare,compare.segments[signIndex]);
        });
        body.querySelector('[data-sign-play]').addEventListener('click',()=>{
          video.currentTime=compare.segments[signIndex].start;
          video.play().catch(()=>{});
        });
        video.addEventListener('timeupdate',()=>{
          if (video.currentTime>=compare.segments[signIndex].end) video.pause();
        });
      } else if (selected === 'listening' && run.listening) {
        const listening = run.listening;
        body.innerHTML = `<h3>${esc(listening.title)}</h3><p>${esc(listening.intro)}</p>
          ${(listening.audio || []).map(clip=>`<figure><figcaption>${esc(clip.name)}</figcaption><audio controls preload="none" src="${esc(clip.url)}"></audio></figure>`).join('')}
          ${table(listening.columns,listening.rows)}<p>${reports}</p>`;
      } else if (selected === 'answer') {
        body.innerHTML = `<h3>模型交付</h3><p>${esc(run.summary)}</p>
          ${run.video.map(player).join('')}
          ${(run.stems || []).map(clip=>`<figure><figcaption>${esc(clip.name)}</figcaption><audio controls preload="none" src="${esc(clip.url)}"></audio></figure>`).join('')}
          <h3>封存文件</h3><div class="variant-answer-files">${run.files.map(link).join('')}</div>`;
      } else if (selected === 'scores') {
        body.innerHTML = `<h3>分数构成</h3><p>${esc(item.formula)}</p><p>${esc(run.summary)}</p>
          ${table(['评分项','得分','满分'],run.rows)}
          ${(run.breakdown || []).map(group => `<h4>${esc(group.label)}</h4>${table(group.columns,group.rows)}`).join('')}
          <p class="result-note">${esc(item.note)}</p><p>${reports}</p>`;
      } else {
        body.innerHTML = window.OmniErrorAnalysis.detailed(item, run, current);
      }
    }
    buttons.forEach(button => button.addEventListener('click', () => {
      if (button.dataset.detailedRun != null) {
        current = Number(button.dataset.detailedRun);
        if (selected==='compare') selected='answer';
      }
      if (button.dataset.detailedPanel != null) selected = button.dataset.detailedPanel;
      update();
    }));
    update();
  }
  window.OmniResults = Object.freeze({...old,overview,render});
})();
