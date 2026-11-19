import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {JSDOM,VirtualConsole} from 'jsdom';
const root='D:/omniALE',work=root+'/experiment_batch_20261119/publication';
const hosted=!!process.env.ASTRA_STAGE_DIST,dist=process.env.ASTRA_STAGE_DIST||root+'/case_dashboard/dist';
const read=async relative=>{try{return await fs.readFile(path.join(dist,relative),'utf8');}catch(e){if(!hosted)throw e;return fs.readFile(path.join(work,'remote/case_dashboard/dist',relative),'utf8');}};
const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>{if(!e.message.includes('Not implemented:'))errors.push(e.message);});
const dom=new JSDOM(await read('index.html'),{url:'https://nanxiang-git.github.io/OmniALE_v2/case_dashboard/dist/index.html#results',runScripts:'outside-only',virtualConsole:vc,beforeParse(w){w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.HTMLMediaElement.prototype.pause=()=>{};w.HTMLMediaElement.prototype.play=()=>Promise.resolve();}});
const w=dom.window,d=w.document;
for(const tag of d.querySelectorAll('script')){const src=tag.getAttribute('src');w.eval(src?await read(src.split('?')[0]):tag.textContent);}
const route=h=>{w.location.hash=h;w.dispatchEvent(new w.HashChangeEvent('hashchange'));};
const configs=[['task-omniecho-investigation','[data-oe-model]','[data-oe-section]',3,'77.7778'],['task-code2video','[data-c2v-model]','[data-c2v-tab]',2,'71.75'],['task-05','[data-c26-model]','[data-c26-section]',3,null]];
for(const [key,modelSelector,tabSelector,count,score] of configs){
 route('#'+key+'/results');
 assert.equal(d.querySelectorAll(modelSelector).length,count,key);
 if(score)assert(d.querySelector('#detail-panel').textContent.includes(score));
 for(let i=0;i<count;i++){
  d.querySelectorAll(modelSelector)[i].click();
  const tabCount=d.querySelectorAll(tabSelector).length;
  for(let j=0;j<tabCount;j++){d.querySelectorAll(tabSelector)[j].click();assert(!/undefined|NaN/.test(d.querySelector('#detail-panel').textContent));}
 }
 for(const tab of ['task','materials','delivery','results']){d.querySelector('#tab-'+tab).click();assert(d.querySelector('#detail-panel').textContent.trim());}
}
route('#results');
for(const cls of ['.oe-overview','.c2v-overview','.c26-overview'])assert(d.querySelector(cls).textContent.includes('astra'),cls);
assert.equal(d.querySelectorAll('.birds-overview').length,1);
assert.equal(w.OMNIALE_DATA.cases.filter(c=>c.key.startsWith('task-birds')).length,1);
assert(!d.querySelector('#main').textContent.includes('GPT-6 Luna（原轮）'));
route('#task-birds/results/v6-all');assert.equal(d.querySelectorAll('[data-birds-model] option').length,3);
assert(!d.querySelector('#detail-panel').textContent.includes('GPT-6 Luna（原轮）'));
assert.equal(errors.length,0,errors.join('\n'));
const report={passed:true,hosted,cases:configs.map(c=>c[0]),case_count:w.OMNIALE_DATA.cases.length,birds_grouping_preserved:true,invalid_luna_hidden:true,script_errors:errors,browser_playback_verified:false};
await fs.writeFile(hosted?work+'/full-page-qa.json':root+'/case_dashboard/qa/astra-full-page.json',JSON.stringify(report,null,2));
dom.window.close();console.log(JSON.stringify(report));
