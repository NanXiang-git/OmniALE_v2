"use strict";

const comparison = document.getElementById("video-comparison");
const controls = comparison.querySelector(".comparison-controls");
const videos = Array.from(comparison.querySelectorAll("video"));
const [leader, follower] = videos;
const fps = Number(comparison.dataset.fps);
const lastFrame = Number(comparison.dataset.last);
const playButton = document.getElementById("compare-play");
const backButton = document.getElementById("compare-back");
const nextButton = document.getElementById("compare-next");
const jump = document.getElementById("compare-jump");
const frameField = document.getElementById("compare-frame");
const timeline = document.getElementById("compare-timeline");
const position = document.getElementById("compare-position");
const audio = document.getElementById("compare-audio");
const captions = document.getElementById("compare-captions");
const status = document.getElementById("compare-status");

let frame = 0;
let playing = false;

function showFrame(next) {
  frame = Math.max(0, Math.min(lastFrame, next));
  timeline.value = frame;
  if (document.activeElement !== frameField || !playing) {
    frameField.value = frame;
  }
  const centiseconds = Math.round(frame * 100 / fps);
  const minutes = String(Math.floor(centiseconds / 6000)).padStart(2, "0");
  const seconds = String(Math.floor(centiseconds / 100) % 60).padStart(2, "0");
  const fraction = String(centiseconds % 100).padStart(2, "0");
  position.value = `第 ${frame} 帧 · ${minutes}:${seconds}.${fraction}`;
  backButton.disabled = frame === 0;
  nextButton.disabled = frame === lastFrame;
}

function alignFrame(video) {
  if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
    // Seek inside the frame interval, away from browser timestamp rounding.
    video.currentTime = (frame + 0.5) / fps;
  }
}

function goToFrame(next) {
  playing = false;
  playButton.textContent = "播放";
  videos.forEach(video => video.pause());
  showFrame(next);
  videos.forEach(alignFrame);
}

function updateAudio() {
  videos.forEach((video, index) => {
    video.muted = index !== Number(audio.value);
  });
}

function showStatus(message) {
  status.textContent = message;
  status.hidden = !message;
}

function followPlayback() {
  if (!playing) return;

  const time = leader.currentTime;
  const followerBehind = Math.abs(follower.currentTime - time) > 2 / fps;
  if (followerBehind && !leader.seeking && !follower.seeking) {
    follower.currentTime = time;
  }
  const current = Math.floor(time * fps);
  if (current !== frame) showFrame(current);
  requestAnimationFrame(followPlayback);
}

async function togglePlayback() {
  if (playing) {
    goToFrame(Math.floor(leader.currentTime * fps));
    return;
  }

  showStatus("");
  goToFrame(frame === lastFrame ? 0 : frame);
  updateAudio();
  playing = true;
  playButton.disabled = true;
  playButton.textContent = "暂停";
  try {
    await Promise.all(videos.map(video => video.play()));
    if (playing) followPlayback();
  } catch (error) {
    if (error.name !== "AbortError") {
      goToFrame(frame);
      showStatus("视频暂时无法播放，可以从下方链接单独打开。");
    }
  } finally {
    playButton.disabled = false;
  }
}

function openLinkedFrame() {
  const match = /^#compare-frame-(\d+)$/.exec(location.hash);
  if (!match) return;

  goToFrame(Number(match[1]));
  comparison.scrollIntoView();
}

playButton.addEventListener("click", togglePlayback);
backButton.addEventListener("click", () => goToFrame(frame - 1));
nextButton.addEventListener("click", () => goToFrame(frame + 1));
timeline.addEventListener("input", () => goToFrame(timeline.valueAsNumber));
jump.addEventListener("submit", event => {
  event.preventDefault();
  goToFrame(frameField.valueAsNumber);
});
audio.addEventListener("change", updateAudio);
captions.addEventListener("change", () => {
  videos.forEach(video => {
    video.textTracks[0].mode = captions.checked ? "showing" : "disabled";
  });
});
videos.forEach(video => {
  video.addEventListener("loadedmetadata", () => {
    if (!playing) alignFrame(video);
  });
});
leader.addEventListener("ended", () => goToFrame(lastFrame));
window.addEventListener("hashchange", openLinkedFrame);
document.addEventListener("click", event => {
  const link = event.target.closest('a[href^="#compare-frame-"]');
  if (link && !event.defaultPrevented && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
    if (link.hash === location.hash) openLinkedFrame();
  }
});

controls.hidden = false;
showFrame(0);
videos.forEach(alignFrame);
openLinkedFrame();
