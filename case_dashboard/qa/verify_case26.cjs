const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM,VirtualConsole}=require('jsdom');
(async()=>{
const target=process.argv[2]||path.resolve(__dirname,'../dist/index.html');
const errors=[],unrelated=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>{if(/case46-report\/overlay.js/.test(e.message)){unrelated.push(e.message);return;}if(!/HTMLCanvasElement|HTMLMediaElement|Not implemented.*getContext|not implemented.*getContext/i.test(e.message))errors.push(e.message)});
const dom=await JSDOM.fromFile(target,{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){w.scrollTo=()=>{};w.HTMLMediaElement.prototype.pause=()=>{};w.HTMLMediaElement.prototype.load=()=>{};w.HTMLDialogElement.prototype.showModal=function(){this.open=true};w.HTMLDialogElement.prototype.close=function(){this.open=false}}});
const w=dom.window;await new Promise(resolve=>w.addEventListener('load',resolve,{once:true}));
const c=w.OMNIALE_DATA.cases.find(x=>x.seq===5);assert.equal(c.packageVersion,'3.0');assert.equal(c.resultKey,'task-05-v3');assert.match(c.task,/60分钟/);
assert(!w.CASE26_PREVIOUS);assert(!w.document.querySelector('#case26-history'));assert(c.files.every(x=>!x.url.includes('/evaluator/')));
w.location.hash='task-05/results';await new Promise(r=>setTimeout(r,300));
if(!w.document.querySelector('iframe[title*="Case26"]'))console.log(JSON.stringify({url:w.location.href,errors,panel:w.document.querySelector('#detail-panel')?.textContent?.slice(0,700),keys:Object.keys(w.OMNIALE_RESULTS),wrap:String(w.OmniResults.render).slice(0,180)}));
assert(w.document.querySelector('iframe[title*="Case26"]'));assert(w.document.querySelector('#case26-status'));
const result=w.OMNIALE_RESULTS['task-05-v3'];assert(result.total===null||(typeof result.total==='number'&&result.total>=0&&result.total<=100));
if(result.total!==null){assert.equal(result.gradeStatus,'complete');assert.equal(result.total,64.5244);assert.equal(result.automaticMax,40);assert.equal(result.judgeMax,60);assert.equal(result.compliance.coefficient,1);assert(Math.abs(result.compliance.coefficient*(result.automatic+result.judge)-result.total)<0.0001);}
if(result.total!==null){
const deductions=w.document.querySelector('#answer-deductions');assert(deductions,'Visible deduction section missing');
assert.equal(deductions.querySelectorAll('tbody tr').length,5);assert.equal(deductions.querySelectorAll('.deduction-card').length,6);
assert.match(deductions.textContent,/35\.4756/);assert.match(deductions.textContent,/不是按片段额外扣分/);assert(!w.document.body.textContent.includes('73.1555'));assert(!c.task.includes('自动60分'));
for(const a of deductions.querySelectorAll('a')){const u=new URL(a.href);if(u.protocol==='file:')assert(fs.existsSync(require('node:url').fileURLToPath(new URL(u.pathname,u))),a.href);}
const detailPath=path.join(path.dirname(target),'case26-v3-report/index.html');
const detail=new JSDOM(fs.readFileSync(detailPath,'utf8'),{url:'https://example.test/index.html?review=8#answer-comparison',runScripts:'dangerously',beforeParse(w){w.HTMLMediaElement.prototype.pause=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{}}});
const video=detail.window.document.querySelector('#answer-video');video.dispatchEvent(new detail.window.Event('loadedmetadata'));assert.equal(video.currentTime,8);detail.window.close();
}
assert.equal(w.OMNIALE_DATA.cases.length,14);
assert.equal(errors.length,0,errors.join('\n'));
const report={passed:true,route:'task-05/results',version:'3.0',scoringVersion:'final-quality-coefficient-1',historical_scheme_visible:false,total:result.total,method:'JSDOM integration/data validation; not real video playback',errors,preexisting_unrelated_warnings:unrelated};
fs.writeFileSync(path.resolve(__dirname,'../case26-v3-qa.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));dom.window.close();
})().catch(e=>{console.error(e);process.exit(1)});
