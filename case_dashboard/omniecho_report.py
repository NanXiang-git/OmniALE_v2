"""Publish frozen OmniEcho case 1 results locally; never rerun or regrade."""
import hashlib
import json
import os
import shutil
from pathlib import Path

BASE = Path(__file__).resolve().parent
SRC = BASE.parent / 'omniecho_agent_cases_v1'
OUT = BASE / 'dist/omniecho-investigation'

def read(p):
    return json.loads(p.read_text(encoding='utf-8-sig'))

def digest(p):
    with p.open('rb') as f:
        return hashlib.file_digest(f, 'sha256').hexdigest()

def build():
    OUT.mkdir(parents=True, exist_ok=True)
    audit = []
    def publish(src, relative):
        dst = OUT / relative
        dst.parent.mkdir(parents=True, exist_ok=True)
        if not dst.exists():
            # Large immutable evidence uses same-volume hardlinks, avoiding GB duplication.
            if src.stat().st_size > 10_000_000:
                os.link(src, dst)
            else:
                shutil.copy2(src, dst)
        expected, actual = digest(src), digest(dst)
        if expected != actual:
            raise ValueError(f'Published file differs: {dst}')
        audit.append({'path': relative, 'source': str(src), 'sha256': actual})
        return 'omniecho-investigation/' + relative

    files = []
    for f in sorted((SRC / 'candidate/case1').iterdir()):
        url = publish(f, 'candidate/' + f.name)
        files.append(dict(name=f.name, path=f.name, url=url, bytes=f.stat().st_size,
                          kind='video' if f.suffix == '.mp4' else 'document',
                          text=None if f.suffix == '.mp4' else f.read_text(encoding='utf-8'),
                          meta={'duration': 37.333333, 'width': 1920, 'height':1080} if f.suffix == '.mp4' else {}))
    for name in ['incident_poster.jpg', 'incident_preview.mp4']:
        publish(SRC / 'dashboard/assets' / name, name)
    for f in files:
        if f['kind'] == 'video':
            f.update(preview='omniecho-investigation/incident_preview.mp4', poster='omniecho-investigation/incident_poster.jpg')
    models = []
    names = ['case1__sol_01', 'case1__luna_01']
    for p in sorted((SRC / 'reports').glob('case1__astra*_grade.json')):
        result = read(p)
        if result.get('infrastructure_valid') and result.get('review_complete') and result.get('score') is not None:
            names.append(p.name.removesuffix('_grade.json'))
    for name in names:
        grade = read(SRC / f'reports/{name}_grade.json')
        run = read(SRC / f'reports/{name}_run.json')
        sealed = SRC / f'orchestrator/{name}/frozen_submission'
        artifacts = []
        for f in sorted(sealed.rglob('*')):
            if f.is_file():
                rel = f.relative_to(sealed).as_posix()
                artifacts.append(dict(name=rel, url=publish(f, name + '/' + rel), bytes=f.stat().st_size))
        links = {}
        for key, suffix in [('grade','grade.json'), ('run','run.json'), ('review','manual_review.json')]:
            links[key] = publish(SRC / f'reports/{name}_{suffix}', name + '/' + suffix)
        trace = SRC / f'dashboard/results/{name}/host_query_trace.json'
        if trace.exists():
            links['trace'] = publish(trace, name + '/host_query_trace.json')
        else:
            links['trace'] = publish(SRC / f'orchestrator/{name}/actions.jsonl', name + '/host_query_trace.jsonl')
        links['final'] = publish(SRC / f'orchestrator/{name}/final_message.txt', name + '/final_message.txt')
        links['report'] = f'omniecho-investigation/{name}/report.html'
        models.append(dict(key=name, model=grade['model'], grade=grade, effort=run['effort'],
                           seconds=run['elapsed_seconds'], exports=run['tool_state']['exports'],
                           apiCalls=run['api_calls'], apiErrors=run['api_errors'],
                           isolation=run['isolation'], links=links, artifacts=artifacts,
                           timeBudget='不限时' if 'unlimited' in name else '35 分钟上限'))
    for name in ['TRIAL_PROTOCOL.md', 'trial_freeze.json']:
        publish(SRC / 'reports' / name, name)
    publish(SRC / 'private/asset_provenance.json', 'asset_provenance.json')
    case = dict(key='task-omniecho-investigation', caseId='OMNIECHO-1', title='多声源事件调查与证据报告 · 开发试跑',
                summary='37.33 秒真实四通道视频，三个声源；自主分析、导出证据、制作可追溯报告并封存。Sol 61.11 / Luna 33.33；单样本开发结果。',
                versionLabel='OmniEcho V1 · 开发试跑', status='packaged', maturity='development-pilot', category='多声源调查',
                directory='omniecho_agent_cases_v1/candidate/case1', main='incident.mp4',
                poster='omniecho-investigation/incident_poster.jpg', files=files,
                task=(SRC / 'candidate/case1/TASK.md').read_text(encoding='utf-8'),
                contract='> 以下保留冻结前的评分设计原文，其中“本次未执行”是制题时的历史状态；两模型现已完成开发试跑，结果见“作答结果”。本入口仅对应 Case 1，原文中的 Case 3 不属于本题。\n\n'+(SRC / 'candidate/case1/SCORING.md').read_text(encoding='utf-8'),
                delivery=['report.html 可播放证据报告', 'findings.json · 17 条检查记录 / 18 个事实', 'evidence_manifest.json · 导出回执', 'evidence/ · 原四通道与双声道预览'],
                resultCount=2, resultSummary='开发试跑 · Sol 61.11 / Luna 33.33 · 均未通过')
    totals = ' / '.join(f'{m["model"]} {m["grade"]["score"]:.2f}' for m in models)
    case.update(resultCount=len(models), resultSummary='开发试跑 · '+totals,
                summary='37.33 秒真实四通道视频，三个声源；自主分析、导出证据、制作可追溯报告并封存。'+totals+'；单样本开发结果。')
    case['contract'] = case['contract'].replace('两模型现已完成开发试跑', '已有模型完成开发试跑')
    payload = dict(case=case, models=models, coverage=read(SRC / 'candidate/case1/coverage_manifest.json'))
    (OUT / 'data.json').write_text(json.dumps(payload,ensure_ascii=False,indent=2),encoding='utf-8')
    (OUT / 'data.js').write_text('window.OMNIECHO_INVESTIGATION = '+json.dumps(payload,ensure_ascii=False).replace('</',r'<\/')+';\n',encoding='utf-8')
    index = BASE / 'dist/index.html'
    html = index.read_text(encoding='utf-8')
    if 'omniecho-investigation/data.js' not in html:
        html = html.replace('<script defer src="app.js"></script>', '<script defer src="omniecho-investigation/data.js"></script>\n  <script defer src="omniecho-investigation/integration.js"></script>\n  <script defer src="app.js"></script>')
    if 'omniecho-investigation/style.css' not in html:
        html = html.replace('</head>', '  <link rel="stylesheet" href="omniecho-investigation/style.css">\n</head>')
    index.write_text(html,encoding='utf-8')
    # Check input/tools/grader stayed byte-identical to the original trial freeze.
    freeze = read(SRC / 'reports/trial_freeze.json')
    for f in freeze['files']:
        assert digest(SRC / f['path']) == f['sha256'], f['path']
    (BASE / 'qa/omniecho-publish.json').write_text(json.dumps(dict(passed=True, frozen_inputs_unchanged=True, files=audit),ensure_ascii=False,indent=2),encoding='utf-8')
    print(f'OmniEcho investigation: {len(models)} runs, {len(audit)} hash-verified local files')

if __name__ == '__main__':
    build()
