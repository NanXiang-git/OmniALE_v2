const fs=require('fs'),path=require('path'),assert=require('assert');
const {JSDOM,VirtualConsole}=require('jsdom');
const dist=path.resolve(process.argv[2]||'case_dashboard/dist');
(async()=>{const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>{if(!e.message.includes('Not implemented:'))errors.push(e.message)});
const dom=await JSDOM.fromFile(path.join(dist,'index.html'),{resources:'usable',runScripts:'dangerously',virtualConsole:vc,beforeParse(w){w.scrollTo=()=>{};w.HTMLMediaElement.prototype.pause=()=>{};w.HTMLMediaElement.prototype.play=()=>Promise.resolve();w.HTMLElement.prototype.scrollIntoView=()=>{}}});
await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('load timeout')),60000);dom.window.addEventListener('load',()=>{clearTimeout(timer);resolve()})});
const d=dom.window.document;assert.equal(dom.window.OMNIALE_DATA.cases.length,15);assert.equal(d.querySelectorAll('#cards .case-card').length,15);assert(d.querySelector('#shown-count').textContent.includes('15 / 15'));
const search=d.querySelector('#search');search.value='鸟类';search.dispatchEvent(new dom.window.Event('input'));assert.equal(d.querySelectorAll('#cards .case-card').length,1);
d.querySelector('[data-open="task-birds-v3"]').click();await new Promise(r=>setTimeout(r,30));assert(d.querySelector('#detail-panel').textContent.includes('科普'));d.querySelector('#tab-results').click();assert(d.querySelector('#detail-panel').textContent.includes('23.6521'));assert(d.querySelector('iframe').src.includes('birds-v3-report/reports/index.html'));
const manifest=JSON.parse(fs.readFileSync(path.join(dist,'birds-v3-report/publication-manifest.json'),'utf8'));
for(const row of manifest.files){if(row.storage==='release')assert(row.url.startsWith('https://github.com/NanXiang-git/OmniALE_v2/releases/download/'),row.path);else assert(fs.existsSync(path.join(dist,'birds-v3-report',row.path)),row.path);if(row.preview)assert(fs.existsSync(path.join(dist,'birds-v3-report',row.preview)),row.preview);}
assert.equal(errors.length,0,errors.join('\n'));
const report={passed:true,dist,package_count:15,original_packages:14,bird_search:true,bird_task_and_results:true,export_files:manifest.files.length,js_errors:errors,browser_playback_verified:false};
fs.writeFileSync(path.join(dist,'birds-v3-report/integration-qa.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));dom.window.close();})().catch(e=>{console.error(e);process.exit(1)});
