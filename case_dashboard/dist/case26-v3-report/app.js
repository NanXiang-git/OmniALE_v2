'use strict';
const $ = id => document.getElementById(id);
const video = $('source'), left = $('left'), right = $('right');
const lc = left.getContext('2d'), rc = right.getContext('2d');
const FPS = 24, MAX_FRAME = 623;
let version = 'v3', currentFrame = 192, stillFrame = 192;
let range = [6, 10.5], initialSeek = 8, resumeAfterLoad = false, switching = false;
let loopSeeking = false, lastMediaTime = 8;
const crops = {full:[0,0,640,338], hand:[0,125,320,169], cloth:[290,30,320,169]};

function draw(source = video, mediaTime = video.currentTime) {
  const [x,y,w,h] = crops[$('crop').value];
  if (source === video && video.readyState < 2) return;
  lc.drawImage(source,x,y,w,h,0,0,640,338);
  rc.drawImage(source,640+x,y,w,h,0,0,640,338);
  if (source === video) {
    lastMediaTime = mediaTime;
    currentFrame = Math.max(0,Math.min(MAX_FRAME, Math.floor(mediaTime*FPS+.001)));
    $('seek').value=currentFrame;
    $('time').textContent=(currentFrame/FPS).toFixed(2);
    $('frame').textContent=`第 ${currentFrame} 帧 / ${MAX_FRAME}`;
    if (!video.paused && $('loop').checked && !loopSeeking && mediaTime >= range[1]-1/FPS) {
      loopSeeking=true; video.currentTime=range[0]+.001;
    }
  }
}
function frameCallback(_, metadata) { draw(video,metadata.mediaTime); video.requestVideoFrameCallback(frameCallback); }
if ('requestVideoFrameCallback' in video) video.requestVideoFrameCallback(frameCallback);
else { const tick=()=>{if(!video.paused)draw();requestAnimationFrame(tick)};requestAnimationFrame(tick); }
function pause(){video.pause();$('play').textContent='▶ 同步播放';}
async function play(){
  if ($('loop').checked && (video.currentTime<range[0] || video.currentTime>=range[1]-.02)) video.currentTime=range[0]+.001;
  try {await video.play();$('play').textContent='Ⅱ 暂停';} catch(e){$('status').textContent='播放失败：'+e.message;}
}
function seekFrame(n){pause();currentFrame=Math.max(0,Math.min(MAX_FRAME,n));video.currentTime=(currentFrame+.1)/FPS;}
function updateStill(){
  const path=`media/${version==='v2'?'v2_':''}frame_${String(stillFrame).padStart(3,'0')}.png`;
  $('still').src=path;$('stillLink').href=path;
  $('still').alt=`左侧无损参考，右侧${version.toUpperCase()}受损画面，${(stillFrame/FPS).toFixed(2)}秒PNG对照`;
  $('stillVersion').textContent=version==='v3'?'V3 加重损伤':'V2 原有损伤';
}
const poster=new Image();poster.onload=()=>{if(video.readyState<2)draw(poster)};poster.src='media/frame_192.png';
video.addEventListener('loadedmetadata',()=>{video.currentTime=Math.min(initialSeek+.001,25.96);video.playbackRate=Number($('rate').value);});
video.addEventListener('seeked',()=>{loopSeeking=false;draw();if(switching){switching=false;if(resumeAfterLoad)play();}});
video.addEventListener('canplay',()=>{$('play').disabled=false;$('status').textContent='已就绪 · 建议先以 1× 速度观察闪动，再暂停检查颗粒';});
video.addEventListener('pause',()=>{$('play').textContent='▶ 同步播放';});
video.addEventListener('play',()=>{$('play').textContent='Ⅱ 暂停';});
video.addEventListener('ended',()=>{if($('loop').checked){video.currentTime=range[0]+.001;play()}else pause()});
video.addEventListener('error',()=>{$('status').textContent='视频未能载入，请使用“启动看板.cmd”打开；也可下载并排视频。';$('play').disabled=true;});
$('play').onclick=()=>video.paused?play():pause();
$('prev').onclick=()=>seekFrame(currentFrame-1);$('next').onclick=()=>seekFrame(currentFrame+1);
$('seek').oninput=e=>seekFrame(Number(e.target.value));
$('crop').onchange=()=>draw();$('rate').onchange=e=>video.playbackRate=Number(e.target.value);
$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.querySelector('.lab').requestFullscreen()}catch(e){$('status').textContent='浏览器未开启全屏，可使用浏览器缩放。'}};
document.querySelectorAll('[data-version]').forEach(button=>button.onclick=()=>{
  if(button.dataset.version===version)return;
  initialSeek=currentFrame/FPS;resumeAfterLoad=!video.paused;switching=true;pause();version=button.dataset.version;
  document.querySelectorAll('[data-version]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button))});
  $('versionLabel').textContent=version==='v3'?'V3 加重损伤':'V2 原有损伤';
  $('defectTag').textContent=version==='v3'?'噪声 · 闪动 · 拖影':'原题包损伤强度';
  $('play').disabled=true;$('status').textContent='正在切换版本，保留当前位置…';
  video.src=`media/comparison_${version}.mp4`;video.load();updateStill();
});
document.querySelectorAll('.chapter').forEach(button=>button.onclick=()=>{
  range=[Number(button.dataset.start),Number(button.dataset.end)];
  document.querySelectorAll('.chapter').forEach(b=>b.classList.toggle('active',b===button));
  const wasPlaying=!video.paused;seekFrame(Math.round(range[0]*FPS));if(wasPlaying)play();
});
document.querySelectorAll('[data-still]').forEach(button=>button.onclick=()=>{
  stillFrame=Number(button.dataset.still);updateStill();
  document.querySelectorAll('[data-still]').forEach(b=>b.classList.toggle('active',b===button));
});
document.addEventListener('keydown',e=>{
  if(['INPUT','SELECT','BUTTON','A'].includes(document.activeElement.tagName))return;
  if(e.code==='Space'){e.preventDefault();video.paused?play():pause();}
  if(e.code==='ArrowLeft'){e.preventDefault();seekFrame(currentFrame-1);}
  if(e.code==='ArrowRight'){e.preventDefault();seekFrame(currentFrame+1);}
});
