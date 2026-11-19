import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {JSDOM, VirtualConsole} from 'jsdom';
const base = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(base, 'dist');
const payload = JSON.parse(await fs.readFile(path.join(dist, 'case26-current/data.json'), 'utf8'));
const report = {passed:false,modes:[],models:payload.models.map(m=>m.model),links:0,browser_visual_verification:false};
assert(payload.models.length >= 2);
assert.equal(new Set(payload.models.map(m=>m.model)).size,payload.models.length);
assert.equal(payload.models.find(m=>m.model==='gpt-6-luna').score.formal_total,32.9005);
assert.equal(payload.models.find(m=>m.model==='gpt-6.1-sol').score.formal_total,49.787);
for(const m of payload.models) {
  assert.equal(m.score.pending.length,0);
  assert.equal(m.artifacts.length,9);
  assert.equal(m.score.formal_total,Math.round((m.score.visual_points+m.score.audio_points_verified)*10000)/10000);
  for(const url of [m.media,m.audio,...Object.values(m.links),...m.artifacts.map(f=>f.url)]) {
    assert((await fs.stat(path.join(dist,url))).isFile(),url);report.links++;
  }
}
for(const f of payload.case.files) {assert((await fs.stat(path.join(dist,f.url))).isFile());report.links++;}
for(const url of ['file:///D:/omniALE/case_dashboard/dist/index.html#task-05/results','http://local/index.html#task-05/results']) {
  const errors=[], vc=new VirtualConsole();vc.on('jsdomError',e=>{if(!e.message.includes('Not implemented:')) errors.push(e.message)});
  const dom=new JSDOM(await fs.readFile(path.join(dist,'index.html'),'utf8'),{url,runScripts:'outside-only',virtualConsole:vc,beforeParse(w){w.scrollTo=()=>{};w.HTMLMediaElement.prototype.pause=()=>{};w.HTMLMediaElement.prototype.play=()=>Promise.resolve();w.HTMLElement.prototype.scrollIntoView=()=>{}}});
  const w=dom.window,d=w.document;
  for(const tag of d.querySelectorAll('script')) {const src=tag.getAttribute('src');w.eval(src?await fs.readFile(path.join(dist,src.split('?')[0]),'utf8'):tag.textContent);}
  const c=w.OMNIALE_DATA.cases.find(x=>x.key==='task-05');
  assert.equal(c.resultCount,payload.models.length);assert.equal(c.packageVersion,'3.2-av-music-heavy');
  assert(c.task.includes('复杂音乐联合修复'));assert.equal(c.main,'input/damaged_av.mkv');
  assert.equal(d.querySelectorAll('#detail-panel iframe').length,0);
  assert.equal(d.querySelectorAll('[data-c26-models] tbody tr').length,payload.models.length);
  assert(d.querySelector('.c26-player').src.includes(payload.models[0].key+'/preview.mp4'));
  assert(!d.querySelector('#detail-panel').textContent.includes('64.5244'));
  for(const m of payload.models) {
    d.querySelector(`[data-c26-model="${m.key}"]`).click();
    assert.equal(d.querySelector(`[data-c26-model="${m.key}"]`).getAttribute('aria-pressed'),'true');
    d.querySelector('[data-c26-section="media"]').click();
    assert(d.querySelector('.c26-player').src.includes(m.key+'/preview.mp4'));
    d.querySelector('[data-c26-section="scores"]').click();
    assert(d.querySelector('#c26-content').textContent.includes(m.score.formal_total.toFixed(4)));
    assert.equal(d.querySelectorAll('.c26-score-table').length,2);
    assert(!d.querySelector('#c26-content').textContent.includes('NaN'));
    d.querySelector('[data-c26-section="records"]').click();
    assert.equal(d.querySelectorAll('.c26-file-table tbody tr').length,9);
    assert(d.querySelector('#c26-content').textContent.includes(m.run));
    const records=d.querySelector('[data-c26-section="records"]');
    records.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Home',bubbles:true}));
    assert.equal(d.querySelector('[data-c26-section="media"]').getAttribute('aria-selected'),'true');
  }
  d.querySelector('#tab-task').click();
  assert(d.querySelector('#detail-panel').textContent.includes('不限时'));
  d.querySelector('#tab-materials').click();
  assert(d.querySelector('#detail-panel').textContent.includes('music_damaged.wav'));
  d.querySelector('#tab-results').click();
  assert.equal(d.querySelectorAll('[data-c26-models] tbody tr').length,payload.models.length);
  w.location.hash='#results';w.dispatchEvent(new w.HashChangeEvent('hashchange'));
  const row=d.querySelector('.c26-overview');assert(row);
  assert(row.textContent.includes('32.9005')&&row.textContent.includes('49.7870'));
  for(const model of payload.models) assert(row.textContent.includes(model.score.formal_total.toFixed(4)));
  assert(!row.textContent.includes('64.5244'));
  assert.equal(errors.length,0,errors.join('\n'));
  report.modes.push({url,model_switch:true,sections:true,keyboard_tabs:true,task_materials:true,overview:true,script_errors:errors});
  dom.window.close();
}
report.passed=true;
await fs.writeFile(path.join(base,'qa/case26-latest-report.json'),JSON.stringify(report,null,2),'utf8');
console.log(JSON.stringify(report));
