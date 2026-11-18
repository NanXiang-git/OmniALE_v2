"""Integrate V6 as a separate package; retain the V3 fixed-voice experiment."""
from pathlib import Path
import hashlib,json,re,shutil,subprocess,sys
sys.stdout.reconfigure(encoding="utf-8")
BASE=Path(__file__).resolve().parent;ROOT=BASE.parent;SOURCE=ROOT/'case_birds/omni_task_v6';OUT=BASE/'dist/birds-v6-report'
def read(p):return json.loads(p.read_text(encoding='utf8'))
def js(x):return json.dumps(x,ensure_ascii=False).replace('<','\\u003c')
def build():
    paths=set(read(SOURCE/'reports/dashboard_links.json'))|{'reports/index.html','reports/dashboard_links.json','reports/dashboard_qa.json','reports/version_change.json','reports/comparability.json'}
    for name in ['SUMMARY.json','SUMMARY.md','final_acceptance.json','voice_choices.json','source_delivery_audit.json','source_guard_controls.json','contamination_notice.json','tts_transport_control.json','previous_v5_summary.json']:
        if (SOURCE/'reports'/name).exists():paths.add('reports/'+name)
    paths.update(p.relative_to(SOURCE).as_posix() for p in (SOURCE/'candidate').iterdir() if p.is_file())
    paths.update(p.relative_to(SOURCE).as_posix() for p in (SOURCE/'results').rglob('*') if p.is_file())
    manifest=[];secret=re.compile(r'(?:sk-[A-Za-z0-9_-]{24,}|gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|Bearer\s+[A-Za-z0-9._-]{24,})')
    for rel in sorted(paths):
        src=(SOURCE/rel).resolve();assert src.is_relative_to(SOURCE.resolve()) and src.is_file(),rel
        assert rel.startswith(('reports/','results/','candidate/','evaluator/')) or rel in ('candidate_package.zip','frozen_manifest.json'),rel
        if src.suffix in {'.json','.jsonl','.html','.md','.txt','.log','.srt','.js','.py'}:assert not secret.search(src.read_text(encoding='utf8')),f'Credential review required: {rel}'
        dst=OUT/rel;dst.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(src,dst)
        manifest.append({'path':rel,'bytes':src.stat().st_size,'sha256':hashlib.sha256(src.read_bytes()).hexdigest()})
    (OUT/'publication-manifest.json').write_text(js({'files':manifest,'secret_scan':'passed','scope':'Linked report evidence, public task, frozen answers only; no credentials or run homes.'}),encoding='utf8')
    shutil.copy2(BASE/'dist/birds-v3-report/poster.jpg',OUT/'poster.jpg')
    summary=read(SOURCE/'reports/SUMMARY.json') if (SOURCE/'reports/SUMMARY.json').exists() else {}
    label=' · '.join(f'{m.upper()} {summary[m]["score"] if summary[m]["score"] is not None else "待评"}' for m in ['sol']) if summary else 'Sol 实验运行中，结果待完成'
    task=(SOURCE/'candidate/TASK.md').read_text(encoding='utf8');files=[]
    for p in sorted((SOURCE/'candidate').iterdir()):
        files.append({'name':p.name,'path':p.name,'url':'birds-v6-report/candidate/'+p.name,'bytes':p.stat().st_size,'kind':'video' if p.suffix=='.mp4' else 'document','text':p.read_text(encoding='utf8') if p.suffix!='.mp4' else None,'meta':{'duration':185.466667} if p.suffix=='.mp4' else {}})
    c={'key':'task-birds-v6','seq':18,'caseId':'BIRDS','title':'鸟类科普 V6 · 同源拦截与语音兼容修复','summary':'保持 V5 题面、输入和评分，修复语音 WebSocket 转发；全新目录重跑 Sol。XC238544 同源素材仍拦截，独立参考录音可用，high、60分钟封顶。'+label,'versionLabel':'V6 同源拦截 · 语音兼容性已修复','status':'packaged','category':'鸟类科普','directory':'case_birds/omni_task_v6/candidate','main':'birds_source.mp4','poster':'birds-v6-report/poster.jpg','files':files,'task':task,'outputs':[{'title':'完整合同','text':task}],'delivery':['final.mp4 完整科普成片','narration.wav 独立解说','subtitles.srt 与 segments.json','自主实现、来源与依赖说明'],'resultCount':1,'resultSummary':label,'resultKey':'task-birds-v6'}
    overlay=r'''(()=>{const c=PAYLOAD,d=window.OMNIALE_DATA,o=window.OmniResults;if(!d||!o)return;const i=d.cases.findIndex(x=>x.key===c.key);if(i<0)d.cases.push(c);else d.cases[i]=c;
const old=d.cases.find(x=>x.key==='task-birds-v3');if(old){old.title='鸟类科普 V3 · 预置固定音色';old.versionLabel='V3 预置配音 · 历史条件';}
const oldV4=d.cases.find(x=>x.key==='task-birds-v4');if(oldV4){oldV4.versionLabel='V4 · 已确认同源素材暴露';if(!oldV4.summary.includes('审计补充'))oldV4.summary+=' 审计补充：Sol 曾读取与第一章同源的 XC238544，历史分数保留，不代表无泄漏识别成绩。';}
const oldV5=d.cases.find(x=>x.key==='task-birds-v5');if(oldV5){oldV5.versionLabel='V5 · 语音端点兼容性受限';oldV5.summary+=' 已保留本轮记录；早期配音尝试受到代理兼容性影响，V6修复后独立重跑。';}
const report='birds-v6-report/reports/index.html';
function content(){return '<section class="note-card"><h2>V6 · 同源拦截与语音兼容修复</h2><p>'+c.resultSummary+'</p><p>保持 V5 的同源拦截、题面和评分，修复语音端点兼容性后独立重跑 Sol；新目录、新60分钟预算。V5原记录保留，V4存在同源素材暴露。</p><p><a class="button primary" href="'+report+'">新实验完整看板 ↗</a> <a class="button" href="'+report+'#tools">工具调用 ↗</a> <a class="button" href="'+report+'#network">联网轨迹 ↗</a> <a class="button" href="birds-v5-report/reports/index.html">V5历史结果（兼容性受限） ↗</a> <a class="button" href="birds-v4-report/reports/index.html">V4历史结果（有同源素材暴露） ↗</a> <a class="button" href="birds-v3-report/reports/index.html">V3历史结果 ↗</a></p></section>'}
(window.OMNIALE_BIRDS_SECTIONS ||= {})['v6-sol']={content,report};
window.OmniResults=Object.freeze({...o,render(x,r,target){if(x.key!==c.key)return o.render(x,r,target);target.innerHTML=content()+'<iframe title="V6自主配音实验与证据" src="'+report+'" style="width:100%;height:1400px;border:0" allow="fullscreen"></iframe>'}});
document.addEventListener('DOMContentLoaded',()=>{const n=document.querySelector('[data-view="packages"] .nav-count');if(n)n.textContent=d.cases.length;});})();'''.replace('PAYLOAD',js(c))
    (OUT/'integration.js').write_text(overlay,encoding='utf8')
    index=BASE/'dist/index.html';text=index.read_text(encoding='utf8')
    if 'birds-v6-report/integration.js' not in text:text=text.replace('<script defer src="app.js">','<script defer src="birds-v6-report/integration.js"></script>\n  <script defer src="app.js">')
    index.write_text(text,encoding='utf8');print('BIRDS_V6_EXPORTED',len(manifest),label,flush=True)
if __name__=='__main__':build()
