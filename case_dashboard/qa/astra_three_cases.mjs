import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {JSDOM,VirtualConsole} from 'jsdom';
const root='D:/omniALE', dist=process.env.ASTRA_STAGE_DIST||root+'/case_dashboard/dist';
const cases=[
  {folder:'omniecho-investigation',key:'task-omniecho-investigation',global:'OMNIECHO_INVESTIGATION',selector:'[data-oe-model]',tabs:'[data-oe-section]'},
  {folder:'code2video-v2',key:'task-code2video',global:'CODE2VIDEO_V2',selector:'[data-c2v-model]',tabs:'[data-c2v-tab]'},
  {folder:'case26-current',key:'task-05',global:'CASE26_LATEST',selector:'[data-c26-model]',tabs:'[data-c26-section]'},
];
const report={passed:false,cases:[],links:0};
const hosted=!!process.env.ASTRA_STAGE_DIST;
let remoteEntries=new Set();
if(hosted){const base=JSON.parse(await fs.readFile(root+'/experiment_batch_20261119/publication/base.json','utf8'));remoteEntries=new Set(base.entries.map(e=>e.path));}
async function checkLinks(target){
  for(const el of target.querySelectorAll('[src],[href]')){
    const url=el.getAttribute('src')||el.getAttribute('href');
    if(!url||/^(https?:|data:|#)/.test(url))continue;
    const relative=decodeURIComponent(url.split('#')[0].split('?')[0]);
    const present=await fs.stat(path.join(dist,relative)).then(s=>s.isFile(),()=>false);
    assert(present||(hosted&&remoteEntries.has('case_dashboard/dist/'+relative)),url);report.links++;
  }
}
for(const c of cases){
  const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>{if(!e.message.includes('Not implemented:'))errors.push(e.message);});
  const dom=new JSDOM('<main id="out"></main>',{url:'https://local/index.html#'+c.key+'/results',runScripts:'outside-only',virtualConsole:vc});
  const w=dom.window,d=w.document;w.HTMLMediaElement.prototype.pause=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};
  w.OMNIALE_DATA={cases:[{key:'task-05',seq:5}]};w.OMNIALE_RESULTS={};w.OmniResults={render(){},overview(){}};
  for(const f of ['data.js','integration.js'])w.eval(await fs.readFile(path.join(dist,c.folder,f),'utf8'));
  const data=w[c.global],models=c.folder==='code2video-v2'?[data,...(data.comparisonRuns||[])]:data.models;
  assert(models.some(m=>m.model==='gpt-6-astra'),c.folder+' missing Astra');
  assert(models.every(m=>Number.isFinite(m.grade?.score??m.score?.formal_total)));
  const target=d.querySelector('#out'),task=w.OMNIALE_DATA.cases.find(x=>x.key===c.key);
  w.OmniResults.render(task,w.OMNIALE_RESULTS[c.key],target);
  const selectors=[...target.querySelectorAll(c.selector)];assert.equal(selectors.length,models.length,c.selector);
  for(let i=0;i<models.length;i++){
    target.querySelectorAll(c.selector)[i].click();
    const count=target.querySelectorAll(c.tabs).length;assert(count>=3,c.tabs);
    for(let t=0;t<count;t++){
      target.querySelectorAll(c.tabs)[t].click();
      assert(!/undefined|NaN/.test(target.textContent));
      await checkLinks(target);
    }
  }
  assert.equal(errors.length,0,errors.join('\n'));
  report.cases.push({key:c.key,models:models.map(m=>m.model),scores:models.map(m=>m.grade?.score??m.score?.formal_total),sections:true,errors});
  dom.window.close();
}
report.passed=true;
const out=hosted?root+'/experiment_batch_20261119/publication/dom-qa.json':root+'/case_dashboard/qa/astra-three-cases.json';
await fs.writeFile(out,JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
