const fs=require('fs'),path=require('path'),assert=require('assert');
const {JSDOM,VirtualConsole}=require('jsdom');
const dist=path.resolve(process.argv[2]||'case_dashboard/dist');
(async()=>{const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>{if(!e.message.includes('Not implemented:'))errors.push(e.stack)});
const dom=new JSDOM(fs.readFileSync(path.join(dist,'index.html'),'utf8'),{url:'http://local/index.html',runScripts:'outside-only',virtualConsole:vc,beforeParse(w){w.scrollTo=()=>{};w.HTMLMediaElement.prototype.pause=()=>{};w.HTMLMediaElement.prototype.play=()=>Promise.resolve();w.HTMLElement.prototype.scrollIntoView=()=>{}}});
for(const tag of dom.window.document.querySelectorAll('script')){const src=tag.getAttribute('src');dom.window.eval(src?fs.readFileSync(path.join(dist,src.split('?')[0]),'utf8'):tag.textContent)}
await new Promise(resolve=>dom.window.addEventListener('load',resolve));const d=dom.window.document,cases=dom.window.OMNIALE_DATA.cases;
assert.equal(cases.length,18);assert.equal(new Set(cases.map(x=>x.key)).size,18);assert.equal(cases.find(x=>x.key==='task-birds-v6').resultCount,2);
const search=d.querySelector('#search');search.value='鸟类';search.dispatchEvent(new dom.window.Event('input'));assert.equal(d.querySelectorAll('#cards .case-card').length,4);
d.querySelector('[data-open="task-birds-v6"]').click();await new Promise(r=>setTimeout(r,30));d.querySelector('#tab-results').click();
assert(d.querySelector('iframe').src.includes('birds-v6-luna-report/reports/index.html'));assert(d.querySelector('[data-v6-comparison]').textContent.includes('GPT-6.1 Sol'));assert(d.querySelector('[data-v6-comparison]').textContent.includes('GPT-6 Luna'));
const comparison=JSON.parse(fs.readFileSync(path.join(dist,'birds-v6-luna-report/comparison.json'),'utf8'));assert.equal(comparison.sol.score,39.348);
for(const a of d.querySelectorAll('[data-v6-comparison] a')){const rel=new URL(a.href).pathname.slice(1);assert(fs.existsSync(path.join(dist,rel)),rel)}
const manifest=JSON.parse(fs.readFileSync(path.join(dist,'birds-v6-luna-report/publication-manifest.json'),'utf8'));for(const row of manifest.files){if(row.storage==='release')assert(row.url.startsWith('https://github.com/NanXiang-git/OmniALE_v2/releases/download/'));else assert(fs.existsSync(path.join(dist,'birds-v6-luna-report',row.path)),row.path);if(row.preview)assert(fs.existsSync(path.join(dist,'birds-v6-luna-report',row.preview)))}
assert.equal(errors.length,0,errors.join('\n'));const report={passed:true,package_count:18,bird_packages:4,v6_results:2,sol_preserved:true,luna_score:comparison.luna.score,export_files:manifest.files.length,js_errors:errors,browser_playback_verified:false};fs.writeFileSync(path.join(dist,'birds-v6-luna-report/integration-qa.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));dom.window.close();})().catch(e=>{console.error(e);process.exit(1)});
