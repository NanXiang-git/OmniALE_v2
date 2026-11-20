import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {JSDOM, VirtualConsole} from 'jsdom';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const work=process.argv[2] ? path.resolve(process.argv[2]) : path.join(root,'github_publish/birds_relaxed_20261119');
const plan=JSON.parse(await fs.readFile(path.join(work,'plan.json'),'utf8'));
const base=JSON.parse(await fs.readFile(path.join(work,'base.json'),'utf8'));
const entries=new Set(base.entries.filter(e=>e.type==='blob').map(e=>e.path));
plan.files.forEach(p=>entries.add(p));
const read=async p=>{try{return await fs.readFile(path.join(work,'stage',p),'utf8');}catch{return fs.readFile(path.join(work,'remote',p),'utf8');}};
const html=await read('case_dashboard/dist/index.html');
const errors=[], vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
const url='https://nanxiang-git.github.io/OmniALE_v2/case_dashboard/dist/index.html';
const dom=new JSDOM(html,{url:url+'#results',runScripts:'outside-only',virtualConsole:vc,pretendToBeVisual:true});
const w=dom.window,d=w.document;w.scrollTo=()=>{};
for(const m of html.matchAll(/<script[^>]+src="([^"]+)"/g))w.eval(await read('case_dashboard/dist/'+m[1].split('?')[0]));
const route=h=>{w.location.hash=h;w.dispatchEvent(new w.HashChangeEvent('hashchange'));};
const checked=new Set();
function links(node){
  assert(!node.textContent.includes('GPT-6 Luna（原轮）'));
  for(const el of node.querySelectorAll('[href],[src]')){
    const raw=el.getAttribute('href')||el.getAttribute('src');
    assert(!raw.includes('birds-v6-luna-report/'),raw);
    const link=new URL(raw,url);
    if(link.origin===new URL(url).origin){
      const rel=decodeURIComponent(link.pathname).replace(/^\/OmniALE_v2\//,'');
      assert(entries.has(rel),'Missing hosted file: '+rel);checked.add(rel);
    }else assert(link.protocol==='https:',raw);
  }
}
assert.equal(w.OMNIALE_DATA.cases.filter(c=>c.key.startsWith('task-birds')).length,1);
assert.equal(d.querySelectorAll('.birds-overview').length,1);
assert(!d.querySelector('#main .note-card'));
assert(d.querySelector('.oe-overview'),'Existing OmniEcho entry retained');
assert(d.querySelector('.score-overview a[href="#task-05/results"]'));
assert(!d.querySelector('.birds-overview').textContent.includes('Luna · high'));
route('#task-birds/task');
for(const tab of ['task','materials','delivery','results']){
  d.querySelector('#tab-'+tab).click();links(d.querySelector('#detail-panel'));
}
assert.equal(d.querySelectorAll('[data-birds-version] option').length,7);
assert.equal(d.querySelectorAll('[data-birds-model] option').length,5);
assert.equal(d.querySelectorAll('[data-v6-relaxed-comparison] tbody tr').length,3);
for(const version of ['v6-relaxed','v6-all','v6-luna-xhigh','v6-sol','v5','v4','v3']){
  route('#task-birds/results/'+version);links(d.querySelector('#detail-panel'));
}
route('#task-birds/results/v6-all');
const combined=d.querySelector('[data-v6-all-comparison]');
assert(combined);
assert.equal(d.querySelectorAll('[data-birds-content] table').length,1);
assert.deepEqual([...combined.querySelectorAll('tbody tr')].map(row=>row.dataset.birdsRun),
  ['sol','sol_relaxed_1','sol_relaxed_2','luna_xhigh','astra_xhigh']);
for(const row of combined.querySelectorAll('tbody tr')){
  assert(row.textContent.includes(w.OMNIALE_BIRDS_CASE.comparison[row.dataset.birdsRun].score.toFixed(4)));
}
for(const model of ['sol_relaxed_1','sol_relaxed_2','astra_xhigh','luna_xhigh','sol']){
  const select=d.querySelector('[data-birds-model]');select.value=model;select.dispatchEvent(new w.Event('change',{bubbles:true}));
  links(d.querySelector('[data-birds-answer]'));
  assert(d.querySelector('[data-birds-answer] video').getAttribute('src').includes('/web-media/'));
  assert(d.querySelector('[data-birds-answer] a').href.includes('/releases/download/'));
}
for(const version of ['v3','v4','v5','v6']){
  route('#task-birds-'+version+'/results');assert(w.location.hash.startsWith('#task-birds/results/'));
}
route('#task-05/results');assert(d.querySelector('#detail-panel').textContent.trim());
route('#task-omniecho-investigation/results');assert(d.querySelector('[data-oe-models]'));
route('');const search=d.querySelector('#search');search.value='鸟类';search.dispatchEvent(new w.Event('input',{bubbles:true}));assert.equal(d.querySelectorAll('#cards .case-card').length,1);
assert.equal(errors.length,0,errors.join('\n'));
const hashes={};
for(const p of plan.files)hashes[p]=crypto.createHash('sha256').update(await fs.readFile(path.join(work,'stage',p))).digest('hex');
const report={passed:true,versions:7,models:5,checked_repository_links:checked.size,hashes,visual_playback_verified:false};
await fs.writeFile(path.join(work,'qa.json'),JSON.stringify(report,null,2));
dom.window.close();console.log(JSON.stringify({...report,hashes:undefined}));
