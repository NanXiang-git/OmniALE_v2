"""Publish an explicit set of bird experiment artifacts; never copy run homes."""
from pathlib import Path
import hashlib,json,re,shutil,subprocess

BASE=Path(__file__).resolve().parent
ROOT=BASE.parent
SOURCE=ROOT/'case_birds/omni_task_v3'
OUT=BASE/'dist/birds-v3-report'

def read(p):return json.loads(p.read_text(encoding='utf-8'))
def js(x):return json.dumps(x,ensure_ascii=False).replace('<','\\u003c')
def build():
    paths=set(read(SOURCE/'reports/dashboard_links.json'))
    paths.update(['reports/index.html','reports/SUMMARY.json','reports/SUMMARY.md','reports/dashboard_qa.json','reports/dashboard_links.json'])
    paths.update(p.relative_to(SOURCE).as_posix() for p in (SOURCE/'candidate').iterdir() if p.is_file())
    paths.update(p.relative_to(SOURCE).as_posix() for p in (SOURCE/'results').rglob('*') if p.is_file())
    # Copy only files displayed or downloadable in the reviewed report.
    manifest=[]
    secret=re.compile(r'(?:sk-[A-Za-z0-9_-]{24,}|gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|Bearer\s+[A-Za-z0-9._-]{24,})')
    for rel in sorted(paths):
        src=(SOURCE/rel).resolve()
        assert src.is_relative_to(SOURCE.resolve()) and src.is_file(),rel
        assert rel.startswith(('reports/','results/','candidate/','evaluator/','private_truth/reference_v3/')) or rel in ('candidate_package.zip','frozen_manifest.json'),rel
        if src.suffix in {'.json','.jsonl','.html','.md','.txt','.log','.srt','.js'}:
            assert not secret.search(src.read_text(encoding='utf-8')),f'Possible credential in {rel}; review before export'
        dst=OUT/rel;dst.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(src,dst)
        with src.open('rb') as f:sha=hashlib.file_digest(f,'sha256').hexdigest()
        manifest.append({'path':rel,'bytes':src.stat().st_size,'sha256':sha})
    (OUT/'publication-manifest.json').write_text(js({'files':manifest,'secret_scan':'passed','scope':'Only linked report artifacts, public candidate and sealed answers; no runs or credentials.'}),encoding='utf8')
    poster=OUT/'poster.jpg'
    if not poster.exists():subprocess.run(['ffmpeg','-v','error','-y','-ss','129','-i',str(SOURCE/'candidate/birds_source.mp4'),'-frames:v','1','-vf','scale=960:-2',str(poster)],check=True)
    task=(SOURCE/'candidate/TASK.md').read_text(encoding='utf8')
    files=[]
    for p in sorted((SOURCE/'candidate').iterdir()):
        files.append({'name':p.name,'path':p.name,'url':'birds-v3-report/candidate/'+p.name,'bytes':p.stat().st_size,'kind':'video' if p.suffix=='.mp4' else 'document','text':p.read_text(encoding='utf8') if p.suffix!='.mp4' else None,'meta':{'duration':185.466667} if p.suffix=='.mp4' else {}})
    c={'key':'task-birds-v3','seq':15,'caseId':'BIRDS','title':'六段鸟类识别与中文科普视频','summary':'六段匿名鸟类素材；Sol 23.65 / Luna 25.22。两组均 Codex + high、60分钟封顶。可查看完整成片、分数构成、识别证据、参考访问核实及工具调用。','versionLabel':'BIRDS V3 · 六段实验','status':'packaged','category':'鸟类科普','directory':'case_birds/omni_task_v3/candidate','main':'birds_source.mp4','poster':'birds-v3-report/poster.jpg','files':files,'task':task,'outputs':[{'title':'交付规范', 'text':task}],'delivery':['final.mp4 完整科普成片','narration.wav 中文解说','subtitles.srt 与 segments.json','识别证据、参考来源与研究记录'],'resultCount':2,'resultSummary':'Sol 23.65 · Luna 25.22 · 已完成评分','resultKey':'task-birds-v3'}
    overlay=r'''(()=>{const c=PAYLOAD,d=window.OMNIALE_DATA,o=window.OmniResults;if(!d||!o)return;
if(!d.cases.some(x=>x.key===c.key))d.cases.push(c);
const report='birds-v3-report/reports/index.html';
function content(){return '<section class="note-card"><h2>六段鸟类科普 · Sol / Luna</h2><p>Sol 23.6521；Luna 25.2222。均识别正确2/6段，Codex + high，60分钟封顶。</p><p><a class="button primary" href="'+report+'">完整实验看板 ↗</a> <a class="button" href="'+report+'#tools">工具调用 ↗</a> <a class="button" href="'+report+'#network">实际联网轨迹 ↗</a></p></section>'}
(window.OMNIALE_BIRDS_SECTIONS ||= {})['v3']={content,report};
window.OmniResults=Object.freeze({...o,render(x,r,target){if(x.key!==c.key)return o.render(x,r,target);target.innerHTML=content()+'<iframe title="六段鸟类实验：成片、分数与调用证据" src="'+report+'" style="width:100%;height:1400px;border:0" allow="fullscreen"></iframe>'}});
document.addEventListener('DOMContentLoaded',()=>{const n=document.querySelector('[data-view="packages"] .nav-count');if(n)n.textContent=d.cases.length;});})();'''.replace('PAYLOAD',js(c))
    (OUT/'integration.js').write_text(overlay,encoding='utf8')
    p=BASE/'dist/index.html';s=p.read_text(encoding='utf8')
    if 'birds-v3-report/integration.js' not in s:s=s.replace('<script defer src="app.js">','<script defer src="birds-v3-report/integration.js"></script>\n  <script defer src="app.js">')
    p.write_text(s,encoding='utf8')
    print('BIRDS_EXPORTED',len(manifest),sum(x['bytes'] for x in manifest),flush=True)
if __name__=='__main__':build()
