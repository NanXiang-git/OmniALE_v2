const rows = window.V2_RESULTS;
const comparison = document.querySelector('#comparison');
const choices = document.querySelector('#choices');
const report = document.querySelector('#report');
const points = (value, precision = 2) => value == null ? '待评' : Number(value).toFixed(precision);
const clean = text => String(text ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const labels = {visual:'源画面与动作可见性', narration:'口头教学', sync:'音画同步', mix:'混音与可听辨', edit:'教学剪辑'};
const verdicts = {aligned:'对齐', partial:'部分对齐', misaligned:'未对齐'};
function total(row) {
  if (!row.delivery_pass) return '交付未通过';
  if (row.score != null) return points(row.score);
  return row.score_interval?.map(value => points(value)).join('–') || '待评';
}
comparison.innerHTML = '<table><thead><tr><th>模型</th><th>内容 / 85</th><th>质量 / 15</th><th>质量系数</th><th>最终分 / 100</th><th>用时</th></tr></thead><tbody>' +
  rows.map(row => '<tr><td>' + clean(row.model) + '</td><td>' + points(row.content_85) + '</td><td>' + points(row.quality_15) + '</td><td>' + points(row.quality_factor,4) + '</td><td class="summary">' + total(row) + '</td><td>' + points(row.minutes,1) + ' 分钟</td></tr>').join('') + '</tbody></table>';
choices.innerHTML = rows.map(row => '<button type="button" data-model="' + row.id + '" aria-pressed="false">' + clean(row.model) + '</button>').join('');
function select(index) {
  const row = rows[index];
  Array.from(choices.children).forEach((child,i) => child.setAttribute('aria-pressed', String(i === index)));
  const quality = row.review?.quality || {};
  const detail = row.review?.alignment || [];
  report.innerHTML = (row.video ? '<video id="film" controls playsinline preload="metadata" src="' + clean(row.video) + '"></video>' : '') +
    '<div class="links">' + Object.entries(row.links).map(([name,url]) => '<a href="' + clean(url) + '">' + clean(name) + '</a>').join('') + '</div>' +
    ((row.errors || []).length ? '<p>' + clean(row.errors.join('；')) + '</p>' : '') +
    '<h3>内容分</h3><p>识别 ' + points(row.identification_45) + ' / 45 · 定位 ' + points(row.timecode_25) + ' / 25</p>' +
    '<ul>' + (row.review?.observations || []).map(item => '<li>' + clean(item.id) + ' · ' + points(item.points) + ' / 5 · ' + clean(item.reason) + '</li>').join('') + '</ul>' +
    '<h3>成片质量</h3><div class="scroll"><table><thead><tr><th>维度</th><th>得分</th><th>依据</th></tr></thead><tbody>' +
    Object.entries(quality).map(([key,item]) => '<tr><td>' + labels[key] + '</td><td>' + points(item.points) + '</td><td>' + clean(item.reason) + '</td></tr>').join('') + '</tbody></table></div>' +
    '<h3>音画核对记录</h3><div class="scroll"><table><thead><tr><th>成片时间</th><th>讲解</th><th>画面与判断</th></tr></thead><tbody>' +
    detail.map(item => '<tr><td><button data-time="' + Number(item.start) + '">' + points(item.start) + '–' + points(item.end) + ' 秒</button></td><td>' +
      clean(item.speech) + '</td><td><strong>' + verdicts[item.verdict] + '</strong> · ' + clean(item.visible) + '</td></tr>').join('') + '</tbody></table></div>';
  report.querySelectorAll('[data-time]').forEach(button => button.addEventListener('click', () => {
    const video = report.querySelector('#film');
    if (!video) return;
    video.currentTime = Number(button.dataset.time);
    video.play().catch(() => {});
  }));
}
Array.from(choices.children).forEach((button,index) => button.addEventListener('click',() => select(index)));
select(0);
