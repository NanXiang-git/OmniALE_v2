import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {JSDOM, VirtualConsole} from 'jsdom';
const dist = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const html = await fs.readFile(path.join(dist, 'index.html'), 'utf8');
const scriptPaths = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(m => m[1].split('?')[0]);
const scripts = await Promise.all(scriptPaths.map(p => fs.readFile(path.join(dist, p), 'utf8')));
const report = {passed:false, modes:[], versions:7, models:5, checkedLinks:0};
for (const url of [pathToFileURL(path.join(dist,'index.html')).href, 'http://127.0.0.1:8765/case_dashboard/dist/index.html']) {
  const errors = [], vc = new VirtualConsole();
  vc.on('jsdomError', e => errors.push(e.message));
  const dom = new JSDOM(html, {url:url+'#results', runScripts:'outside-only', virtualConsole:vc, pretendToBeVisual:true});
  const w=dom.window, d=w.document;
  w.scrollTo=()=>{};
  for (const script of scripts) w.eval(script);
  const route = hash => {w.location.hash=hash;w.dispatchEvent(new w.HashChangeEvent('hashchange'));};
  const links = async root => {
    assert(!root.textContent.includes('GPT-6 Luna（原轮）'));
    assert(!root.querySelector('[href*="birds-v6-luna-report/"], [src*="birds-v6-luna-report/"]'));
    for (const el of root.querySelectorAll('[href],[src]')) {
      const raw=el.getAttribute('href')||el.getAttribute('src');
      if (!raw || /^(#|https?:|data:)/.test(raw)) continue;
      const p=path.resolve(dist,decodeURIComponent(raw.split('#')[0].split('?')[0]));
      assert((await fs.stat(p)).isFile(),p); report.checkedLinks++;
    }
  };
  assert.equal(w.OMNIALE_DATA.cases.filter(c=>c.key.startsWith('task-birds')).length,1);
  assert(!('luna_timed' in w.OMNIALE_BIRDS_CASE.comparison));
  assert.equal(d.querySelectorAll('.birds-overview').length,1);
  assert.equal(d.querySelectorAll('#main .note-card').length,0,'No bird banners above overview');
  assert.equal(d.querySelectorAll('.score-overview a[href="#task-birds/results"]').length,1);
  assert(d.querySelector('.c26-overview'));
  assert(d.querySelector('.oe-overview'));
  route('#task-birds/task');
  assert(d.querySelector('#detail-panel').textContent.includes('不限时'));
  for (const tab of ['materials','delivery','results']) {
    d.querySelector('#tab-'+tab).click();
    assert(d.querySelector('#detail-panel').textContent.trim());
    await links(d.querySelector('#detail-panel'));
  }
  assert.equal(d.querySelectorAll('[data-birds-version] option').length,7);
  assert.equal(d.querySelectorAll('[data-birds-model] option').length,5);
  assert.equal(d.querySelectorAll('[data-v6-relaxed-comparison] tbody tr').length,3);
  assert(d.querySelector('[data-v6-relaxed-comparison]').textContent.includes('25.8611'));
  assert(d.querySelector('[data-v6-relaxed-comparison]').textContent.includes('26.9847'));
  for (const option of [...d.querySelectorAll('[data-birds-version] option')]) {
    const select=d.querySelector('[data-birds-version]'); select.value=option.value;
    select.dispatchEvent(new w.Event('change',{bubbles:true}));
    assert(d.querySelector('[data-birds-content]').textContent.trim());
    assert(!d.querySelector('#detail-panel iframe'));
    await links(d.querySelector('#detail-panel'));
  }
  route('#task-birds/results/v6-all');
  const combined=d.querySelector('[data-v6-all-comparison]');
  assert(combined,'All five runs share one comparison');
  assert.equal(d.querySelectorAll('[data-birds-content] table').length,1);
  assert.deepEqual([...combined.querySelectorAll('tbody tr')].map(row=>row.dataset.birdsRun),
    ['sol','sol_relaxed_1','sol_relaxed_2','luna_xhigh','astra_xhigh']);
  for (const row of combined.querySelectorAll('tbody tr')) {
    assert(row.textContent.includes(w.OMNIALE_BIRDS_CASE.comparison[row.dataset.birdsRun].score.toFixed(4)));
  }
  await links(combined);
  for (const option of [...d.querySelectorAll('[data-birds-model] option')]) {
    const select=d.querySelector('[data-birds-model]');select.value=option.value;
    select.dispatchEvent(new w.Event('change',{bubbles:true}));
    const score=w.OMNIALE_BIRDS_CASE.comparison[option.value].score.toFixed(4);
    assert(d.querySelector('[data-birds-answer]').textContent.includes(score));
    await links(d.querySelector('[data-birds-answer]'));
  }
  for (const version of ['v3','v4','v5','v6']) {
    route(`#task-birds-${version}/results`);
    assert.equal(w.location.hash,`#task-birds/results/${version==='v6'?'v6-all':version}`);
    assert.equal(d.querySelector('[data-birds-version]').value,version==='v6'?'v6-all':version);
  }
  route('#task-05/task');assert(d.querySelector('h1').textContent.includes('修复'));
  route('#task-05/results');assert(d.querySelector('#detail-panel').textContent.includes('49.787'));
  route('');
  const search=d.querySelector('#search'); search.value='鸟类';search.dispatchEvent(new w.Event('input',{bubbles:true}));
  assert.equal(d.querySelectorAll('#cards .case-card').length,1);
  assert.equal(errors.length,0,errors.join('\n'));
  report.modes.push(url.startsWith('file:')?'file':'http');
  dom.window.close();
}
report.passed=true;
await fs.writeFile(new URL('./birds-case-report.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
