"""Build the current strict V2 evaluation; preserve immutable solver deliveries."""
import hashlib
import json
import os
import shutil
from pathlib import Path

BASE = Path(__file__).resolve().parent
SRC = BASE.parent / 'omniecho_agent_cases_v1'
V2 = BASE.parent / 'omniecho_investigation_v2'
EVAL = V2 / 'reports/retrograde_20261120'
OUT = BASE / 'dist/omniecho-investigation'
RUNS = ['case1__sol_01', 'case1__luna_01', 'case1__astra_xhigh_unlimited_20261119_newkey']

def read(p):
    return json.loads(p.read_text(encoding='utf-8-sig'))

def digest(p):
    with p.open('rb') as f:
        return hashlib.file_digest(f, 'sha256').hexdigest()

def build():
    OUT.mkdir(parents=True, exist_ok=True)
    allowed = set()
    audit = []
    def publish(src, rel):
        allowed.add(rel)
        dst = OUT / rel
        dst.parent.mkdir(parents=True, exist_ok=True)
        if not dst.exists():
            if src.stat().st_size > 10_000_000:
                os.link(src, dst)
            else:
                shutil.copy2(src, dst)
        assert digest(src) == digest(dst), f'Immutable published artifact differs: {dst}'
        audit.append(dict(path=rel, sha256=digest(dst)))
        return 'omniecho-investigation/' + rel
    def generated(obj, rel):
        allowed.add(rel)
        p = OUT / rel
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(json.dumps(obj, ensure_ascii=False, indent=2), encoding='utf-8')
        return 'omniecho-investigation/' + rel
    scoring = """# V2 最终使用的评分规则（严格版）

本次按用户要求复评已有封存答卷，不改题、不重跑。公开页面仅展示本版成绩。任务与真值的专家审核按用户确认接受。

F=18个原事实的正确率。方向精确匹配；角度误差≤15°且转向正确；距离误差≤0.5米且方向正确；yes/no精确匹配。边界包含，超过即错，unknown记错。

A=0.50G+0.20P+0.15L+0.15R；S=100F(0.50+0.50A)。

- G：18个事实的证据支持均值。充分支持1，相关但关键歧义未消解0.5，只有断言或不支持0。
- P：行动产生有用分析并核验关键歧义与交付1；有用分析但关键歧义未解决0.5；无有用行动0。
- L：17条证据定位均值。链接/按钮指向真实证据、覆盖要求时段，且范围≤max(3秒,要求时段+2秒)记1。既有HTML控制按等价机制接受。
- R：真实浏览器离线打开、17条定位、视频播放、实际音频输出、可见值与JSON一致五项均值。未实际确认记null，总分只显示区间。

通过需S≥80、F≥0.8、G≥0.8、R=1且封存及来源校验通过。三模型F均未达到门槛，因此结论均为未通过，即使音频待验收也不影响该结论。

G/P由助手独立于答题会话复核，非盲审，不冒充人工专家评审。权重与通过线尚需跨样本校准，当前仍是单样本开发试跑。本版替代旧版展示，不能据此推断泛化排名。
"""
    allowed.add('candidate/SCORING.md')
    (OUT / 'candidate/SCORING.md').write_text(scoring, encoding='utf-8')
    files = []
    for f in sorted((SRC / 'candidate/case1').iterdir()):
        if f.name in ('SCORING.md', 'package_manifest.json'):
            continue
        url = publish(f, 'candidate/' + f.name)
        files.append(dict(name=f.name,path=f.name,url=url,bytes=f.stat().st_size,kind='video' if f.suffix=='.mp4' else 'document',text=None if f.suffix=='.mp4' else f.read_text(encoding='utf-8'),meta={'duration':37.333333,'width':1920,'height':1080} if f.suffix=='.mp4' else {}))
    files.append(dict(name='SCORING.md',path='SCORING.md',url='omniecho-investigation/candidate/SCORING.md',bytes=len(scoring.encode()),kind='document',text=scoring,meta={}))
    for name in ['incident_poster.jpg','incident_preview.mp4']:
        publish(SRC / 'dashboard/assets' / name,name)
    for f in files:
        if f['kind']=='video':
            f.update(preview='omniecho-investigation/incident_preview.mp4',poster='omniecho-investigation/incident_poster.jpg')
    models=[]
    browser=read(EVAL / 'browser_acceptance.json')
    for name in RUNS:
        result=read(EVAL / (name+'_score.json'))
        review=read(EVAL / (name+'_review.json'))
        # Current public result has no obsolete score, verdict, or diagnostic fields.
        grade={k:result[k] for k in ['version','run','model','strict_fact_correct','fact_total','F','G','P','L','R','R_interval','A_interval','v2_score_interval','v2_formal_score','status','failed_known_gate']}
        grade.update(score=result['v2_formal_score'],task_pass=False,
                     facts=[{k:v for k,v in a.items() if k!='old_correct'} for a in result['facts']],
                     breakdown={k:{'correct':v['new_correct'],'total':v['total']} for k,v in result['breakdown'].items()})
        run=read(SRC / f'reports/{name}_run.json')
        sealed=SRC / f'orchestrator/{name}/frozen_submission'
        artifacts=[]
        for f in sorted(sealed.rglob('*')):
            if f.is_file():
                rel=f.relative_to(sealed).as_posix()
                artifacts.append(dict(name=rel,url=publish(f,name+'/'+rel),bytes=f.stat().st_size))
        links=dict(grade=generated(grade,name+'/grade.json'),review=generated(review,name+'/review.json'))
        links['run']=publish(SRC / f'reports/{name}_run.json',name+'/run.json')
        trace=SRC / f'dashboard/results/{name}/host_query_trace.json'
        links['trace']=publish(trace,name+'/host_query_trace.json') if trace.exists() else publish(SRC / f'orchestrator/{name}/actions.jsonl',name+'/host_query_trace.jsonl')
        links['final']=publish(SRC / f'orchestrator/{name}/final_message.txt',name+'/final_message.txt')
        links['report']=f'omniecho-investigation/{name}/report.html'
        links['browser']=publish(EVAL / (name+'_browser.png'),name+'/browser.png')
        models.append(dict(key=name,model=result['model'],grade=grade,browser=review['browser'],review=review,effort=run['effort'],seconds=run['elapsed_seconds'],exports=run['tool_state']['exports'],apiCalls=run['api_calls'],apiErrors=run['api_errors'],isolation=run['isolation'],links=links,artifacts=artifacts,timeBudget='不限时' if 'unlimited' in name else '35 分钟上限'))
    publish(SRC / 'private/asset_provenance.json','asset_provenance.json')
    publish(EVAL / 'browser_acceptance.json','browser_acceptance.json')
    for name in ['independent_signal_checks.json','independent_geometry_checks.json']:
        publish(EVAL / name,name)
    totals=' / '.join(f"{m['model']} {m['grade']['v2_score_interval'][0]:.2f}–{m['grade']['v2_score_interval'][1]:.2f}" for m in models)
    case=dict(key='task-omniecho-investigation',caseId='OMNIECHO-1',title='多声源事件调查与证据报告 · 开发试跑',summary='37.33秒真实四通道视频，三个声源；自主调查、导出证据、提交HTML与JSON。V2严格版；音频出声待验收。',versionLabel='V2 严格版 · 当前唯一评分',status='packaged',maturity='development-pilot',category='多声源调查',directory='omniecho_agent_cases_v1/candidate/case1',main='incident.mp4',poster='omniecho-investigation/incident_poster.jpg',files=files,task=(SRC/'candidate/case1/TASK.md').read_text(encoding='utf-8'),contract=scoring,delivery=['report.html 可播放证据报告','findings.json · 17条检查记录 / 18个事实','evidence_manifest.json · 导出回执','evidence/ · 原四通道与双声道预览'],resultCount=3,resultSummary='V2严格版 · '+totals+' · 均未通过')
    payload=dict(case=case,models=models,coverage=read(SRC/'candidate/case1/coverage_manifest.json'),browserEnvironment=browser['environment'])
    generated(payload,'data.json')
    allowed.add('data.js')
    (OUT/'data.js').write_text('window.OMNIECHO_INVESTIGATION = '+json.dumps(payload,ensure_ascii=False).replace('</',r'<\/')+';',encoding='utf-8')
    allowed.update(['integration.js','style.css'])
    # Only obsolete generated/public files are removed; immutable originals stay in SRC.
    for p in list(OUT.rglob('*')):
        if p.is_file() and p.relative_to(OUT).as_posix() not in allowed:
            assert OUT.resolve() in p.resolve().parents
            p.unlink()
    index=BASE/'dist/index.html'
    html=index.read_text(encoding='utf-8')
    if 'omniecho-investigation/data.js' not in html:
        html=html.replace('<script defer src="app.js"></script>', '<script defer src="omniecho-investigation/data.js"></script>\n<script defer src="omniecho-investigation/integration.js"></script>\n<script defer src="app.js"></script>')
    if 'omniecho-investigation/style.css' not in html:
        html=html.replace('</head>', '<link rel="stylesheet" href="omniecho-investigation/style.css">\n</head>')
    html='\n'.join(l for l in html.split('\n') if 'omniecho-v2-local/integration.js' not in l)
    index.write_text(html,encoding='utf-8')
    freeze=read(SRC/'reports/trial_freeze.json')
    for f in freeze['files']:
        assert digest(SRC/f['path'])==f['sha256'],f['path']
    (BASE/'qa/omniecho-publish.json').write_text(json.dumps(dict(passed=True,frozen_inputs_unchanged=True,files=audit),ensure_ascii=False,indent=2),encoding='utf-8')
    print('Published current V2 data locally:',totals)

if __name__=='__main__':
    build()
