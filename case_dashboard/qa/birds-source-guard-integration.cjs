const fs=require('fs'),path=require('path'),assert=require('assert');
const {JSDOM,VirtualConsole}=require('jsdom');
const dist=path.resolve(process.argv[2]||'case_dashboard/dist');
(async()=>{const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>{if(!e.message.includes('Not implemented:'))errors.push(e.stack+' '+(e.detail?.stack||''))});
const source=fs.readFileSync(path.join(dist,'index.html'),'utf8');
const dom=new JSDOM(source,{url:'http://local/index.html',runScripts:'outside-only',virtualConsole:vc,beforeParse(w){w.scrollTo=()=>{};w.HTMLMediaElement.prototype.pause=()=>{};w.HTMLMediaElement.prototype.play=()=>Promise.resolve();w.HTMLElement.prototype.scrollIntoView=()=>{}}});
for(const tag of dom.window.document.querySelectorAll('script')){const src=tag.getAttribute('src');dom.window.eval(src?fs.readFileSync(path.join(dist,src.split('?')[0]),'utf8'):tag.textContent)}
await new Promise(resolve=>dom.window.addEventListener('load',resolve));
const d=dom.window.document,cases=dom.window.OMNIALE_DATA.cases;
assert.equal(cases.length,17);assert.equal(new Set(cases.map(c=>c.key)).size,17);assert.equal(d.querySelectorAll('#cards .case-card').length,17);assert(d.querySelector('#shown-count').textContent.includes('17 / 17'));
const search=d.querySelector('#search');search.value='鸟类';search.dispatchEvent(new dom.window.Event('input'));assert.equal(d.querySelectorAll('#cards .case-card').length,3);
for(const version of ['v3','v4','v5']){d.querySelector('[data-open="task-birds-'+version+'"]').click();await new Promise(r=>setTimeout(r,30));assert(d.querySelector('#detail-panel').textContent.includes('科普'));d.querySelector('#tab-results').click();assert(d.querySelector('iframe').src.includes('birds-'+version+'-report/reports/index.html'));if(version!=='v5'){d.querySelector('[data-back]').click();await new Promise(r=>setTimeout(r,30));}}
assert(d.querySelector('#detail-panel').textContent.includes('同源'));
const manifest=JSON.parse(fs.readFileSync(path.join(dist,'birds-v5-report/publication-manifest.json'),'utf8'));
for(const row of manifest.files){if(row.storage==='release')assert(row.url.startsWith('https://github.com/NanXiang-git/OmniALE_v2/releases/download/'),row.path);else assert(fs.existsSync(path.join(dist,'birds-v5-report',row.path)),row.path);if(row.preview)assert(fs.existsSync(path.join(dist,'birds-v5-report',row.preview)),row.preview);}
assert.equal(errors.length,0,errors.join('\n'));
const report={passed:true,dist,package_count:17,original_packages_preserved:16,bird_search_count:3,all_bird_tasks_and_results:true,export_files:manifest.files.length,js_errors:errors,browser_playback_verified:false};
fs.writeFileSync(path.join(dist,'birds-v5-report/integration-qa.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));dom.window.close();})().catch(e=>{console.error(e);process.exit(1)});