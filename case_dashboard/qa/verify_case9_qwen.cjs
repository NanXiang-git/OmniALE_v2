const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM,VirtualConsole}=require('jsdom');
(async()=>{
 for(const root of [path.resolve(__dirname,'../..'),path.resolve(__dirname,'../../github_publish/case9_qwen_update_20261105')]){
  const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
  const dom=await JSDOM.fromFile(path.join(root,'case_dashboard/dist/index.html'),{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){w.scrollTo=()=>{};w.HTMLMediaElement.prototype.pause=()=>{};w.HTMLMediaElement.prototype.load=()=>{};}});
  const w=dom.window,d=w.document;await new Promise(r=>d.readyState==='complete'?r():w.addEventListener('load',r,{once:true}));
  w.location.hash='task-09/results';await new Promise(r=>setTimeout(r,100));
  const x=w.OmniALE.getResult('task-09');assert.equal(x.automatic,40);assert.equal(x.accepted,false);assert.equal(x.judgeModel,'qwen3.8-omni-flash');
  assert.equal(x.verified,40+x.judge);assert.equal(x.model,'gpt-6.1-sol');assert.match(d.body.textContent,/Qwen3.8-omni-flash/);
  d.querySelector('[data-result-tab="scores"]').click();assert.equal(d.querySelectorAll('.score-row').length,8);assert.match(d.body.textContent,/重叠语音与语义保留/);
  const report=x.reports.find(f=>f.name==='qwen-supplement.html');assert(report);assert(fs.statSync(path.resolve(root,'case_dashboard/dist',report.url)).isFile());
  assert.deepEqual(errors,[]);console.log(JSON.stringify({root,total:x.total,judge:x.judge,pending:x.pendingPoints,passed:true}));w.close();
 }
})().catch(e=>{console.error(e);process.exitCode=1});
