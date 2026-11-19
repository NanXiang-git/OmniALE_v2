"""Build the current Code2Video v2 presentation from existing graded evidence."""
from pathlib import Path
import copy
import hashlib
import html
import json
import os
import shutil

BASE = Path(__file__).resolve().parent
SRC = BASE.parent / 'case_code2video/real_v2'
RUN = SRC / 'runs/sol_xhigh_01'
OUT = BASE / 'dist/code2video-v2'
UI = BASE / 'code2video_ui'

def read(p): return json.loads(p.read_text(encoding='utf-8'))
def digest(p):
    with p.open('rb') as f: return hashlib.file_digest(f, 'sha256').hexdigest()

def build():
    OUT.mkdir(parents=True, exist_ok=True)
    grade = copy.deepcopy(read(RUN/'reports/grade_strict.json'))
    # History remains in the source audit files. The presentation has one current version.
    for k in ['original_score','retrospective','frozen_rubric_sha256','strict_rubric_sha256']:
        grade.pop(k, None)
    grade['rubric_version'] = 'v2'
    grade['verdict'] = '未通过 · 60/100，低于通过阈值 85'
    grade['summary'] = '完整可编辑工程与局部修改已完成；主要失分来自光学材质、路径文字、插画形变及转场保真。'
    grade['limitations'] = '视觉档位由助手结合固定时间对照和连续帧评审，功能项辅以独立重渲染及对象检查；不是独立人工、盲评或官方 benchmark 分数。档位及子项权重尚未经多评审者校准，小数来自权重乘法，不代表对应测量精度。原片没有源工程真值，不能认证所有核心事件均在两帧误差内。'
    grade['findings'] = [x for x in grade['findings'] if '79/100' not in x]
    grade['gates'][-1]['evidence'] = '重建 22/40 <30；文字材质 13.25/25 <18；时间 14.75/20 <15；总分 60/100 <85。'
    for item in grade['items']:
        item.pop('original_score', None); item.pop('original_reason', None)
        for sub in item['subcriteria']:
            sub['reason'] = sub['reason'].replace('原评审确认','已确认').replace('原评审 ', '对照检查 ').replace('既有','')
        item['reason'] = '；'.join(s['reason'] for s in item['subcriteria'])
        item['deduction'] = item['max'] - item['score']
    assert grade['score'] == sum(x['score'] for x in grade['items']) == 60

    tiers = [dict(rate=1, label='完整达到', rule='对应要求有充分证据支持，视觉无实质偏差，功能验证通过。'),
             dict(rate=.75, label='轻微偏差', rule='核心效果和运动机制正确，仅有局部细节差异。'),
             dict(rate=.5, label='明显近似', rule='对象与效果可辨，存在显著的形态、布局或细节简化。'),
             dict(rate=.25, label='严重偏离', rule='只有效果提示，关键特征或动作机制严重偏离；多个显著词段方向错误时，该方向子项最多取此档。'),
             dict(rate=0, label='缺失或相反', rule='有证据证明要求缺失或目标行为相反。')]
    method = '总分 S = Σ 子项权重 w × 质量档位 q；子项扣分 = w × (1−q)。所有子项权重合计 100；无全局折扣、无额外总分惩罚。'
    rules = '# Code2Video 评分标准 v2\n\n'+method+'\n\n'
    rules += '| 档位 | 系数 | 判据 |\n|---|---:|---|\n'+''.join(f'|{t["label"]}|{t["rate"]:.0%}|{t["rule"]}|\n' for t in tiers)
    rules += '\n视觉与功能分别计分。对象出现、改字和改色生效不能代替材质、字形和运动保真。工具不限，不因未使用 Blender 扣分。E 同时与 R 和真实原片对照，避免两版共同出错却被当作成功。\n\n'
    rules += '通过需总分 ≥85、重建 ≥30/40、文字材质 ≥18/25、时间 ≥15/20，并满足媒体规格、共享可编辑工程、无视频套壳、指定光标局部修改和三阶段完整性要求。核心事件允许 ±2 个输出帧，蓝色光标延迟为 6±2 帧。未知项单列，不能直接记零。\n\n'
    rules += grade['limitations']+'\n\n## 子项与计算\n\n'
    for item in grade['items']:
        rules += f'### {item["name"]} · {item["score"]:g}/{item["max"]}\n\n| 子项 | 权重 | 系数 | 得分 | 扣分 | 判定依据 |\n|---|---:|---:|---:|---:|---|\n'
        rules += ''.join(f'|{s["name"]}|{s["max"]}|{s["tier"]:.0%}|{s["score"]:g}|{s["max"]-s["score"]:g}|{s["reason"]}|\n' for s in item['subcriteria'])+'\n'
    (SRC/'SCORING_V2.md').write_text(rules, encoding='utf-8')
    (SRC/'RESULTS.md').write_text('# Code2Video v2 · 结果\n\n**60/100，未通过。**\n\n'+grade['summary']+'\n\n'+rules, encoding='utf-8')
    (RUN/'reports/grade_v2.json').write_text(json.dumps(grade,ensure_ascii=False,indent=2),encoding='utf-8')

    audit=[]
    def publish(src, relative, immutable=True):
        dst=OUT/relative; dst.parent.mkdir(parents=True,exist_ok=True)
        if immutable:
            if not dst.exists(): os.link(src,dst)
            assert digest(src)==digest(dst), f'Immutable published file changed: {dst}'
        elif not dst.exists() or dst.read_bytes()!=src.read_bytes():
            # Replace atomically: an earlier immutable publication may be a hard link.
            temporary=dst.with_name(dst.name+'.publishing')
            shutil.copy2(src,temporary)
            os.replace(temporary,dst)
        audit.append(dict(path=relative,sha256=digest(dst)))
        return 'code2video-v2/'+relative
    publish(SRC/'review/poster.jpg','poster.jpg')
    files=[]
    for src,rel in [(SRC/'candidate/TASK.md','candidate/TASK.md'),(SRC/'candidate/SOURCE.md','candidate/SOURCE.md'),
                    (SRC/'candidate/input/reference.mp4','candidate/input/reference.mp4'),(SRC/'candidate/input/ui_identity.png','candidate/input/ui_identity.png'),
                    (SRC/'SCORING_V2.md','candidate/SCORING.md')]:
        url=publish(src,rel,src.name!='SCORING_V2.md')
        kind='video' if src.suffix=='.mp4' else 'image' if src.suffix=='.png' else 'document'
        f=dict(name=Path(rel).name,path=rel.removeprefix('candidate/'),url=url,bytes=src.stat().st_size,kind=kind)
        if kind=='document':f['text']=src.read_text(encoding='utf-8')
        if kind=='video':f.update(poster='code2video-v2/poster.jpg',meta=dict(duration=4,width=1920,height=1080,fps='24/1'))
        files.append(f)
    artifacts=[]
    for src in sorted((RUN/'sealed/submission').rglob('*')):
        if src.is_file() and 'validation' not in src.relative_to(RUN/'sealed/submission').parts:
            rel=src.relative_to(RUN/'sealed/submission').as_posix()
            artifacts.append(dict(name=rel,url=publish(src,'submission/'+rel),bytes=src.stat().st_size))
    publish(SRC/'sol_submission.zip','submission.zip')
    for name in ['grade_v2.json','media_checks.json','rebuild_checks.json','motion_checks.json','scene_checks.json','infrastructure.json']:
        publish(RUN/'reports'/name,'reports/'+name,name!='grade_v2.json')
    for src in (RUN/'reports/evidence').glob('*.jpg'):publish(src,'evidence/'+src.name)
    publish(SRC/'SCORING_V2.md','SCORING.md',False)
    publish(SRC/'RESULTS.md','RESULTS.md',False)

    errors=[
        dict(title='UI 体积和玻璃光学效果不足', observed='管道厚度、凹槽反光、玻璃边缘和折射关系被渐变与模糊近似；可识别为 UI，但没有保留原片质感。', cause='工程采用 SVG 渐变和滤镜模拟三维外观；结合画面对照判断关键光学结构表达不足。工具选择本身不扣分。', impact='UI 阶段扣 5.25 分；改色后的材质保真扣 3.75 分。前者评 R，后者评 E，均为各自交付要求。', evidence='reconstruction_compare_051.jpg', items=[2,5]),
        dict(title='文字方向、字形变形和排版偏离', observed='E #117 的右下弧与左下斜段倒向，尾端字拥挤；规整路径字形未保留参考的夸张挤压和手绘变形。', cause='文字内容替换成功，但路径上的字符朝向、间距及形变适配不足；该解释来自代码方案与画面，不推断模型内部思考。', impact='文字修改扣 8 分，其中方向扣 3、沿曲线字形扣 3、填色描边间距遮挡扣 2；内容替换不扣分。', evidence='revision_compare_117.jpg', items=[4]),
        dict(title='插画展开的姿态和时序不一致', observed='R #74–#81 连续对照中，皇冠、纸卷和装饰的成形状态与原片不同，部分展开呈现为缩放或显露。', cause='重建的对象动作进程已经偏离原片；E 对 R 的正确时间映射无法补回缺失动作。无源工程真值，不虚构精确帧误差。', impact='插画阶段扣 6.75 分；时间映射扣 5.25 分。分别检查外观/动作形态与时间进程，不再追加总分惩罚。', evidence='event_window_074_081.jpg', items=[3,6]),
        dict(title='图层与跨阶段连接被简化', observed='纸卷和装饰层次近似；UI 到插画的翻卷与原片不同。没有坏帧并不意味着正确复现转场。', cause='可编辑分层存在，但跨阶段几何形变和局部遮挡连接表达不足。', impact='连续性与遮挡扣 5 分：图层扣 2、跨阶段转换扣 3；稳定性 2/2。', evidence='reconstruction_compare_069.jpg', items=[8]),
        dict(title='排版细节与局部几何仍有偏差', observed='R #25 色卡和网点位置、颗粒、渐变及套准标记有差异；局部轮廓与曲率近似，部分退场以淡化替代几何运动。', cause='整体布局较接近，但细部参数、材质纹理和显露/退场动作的重建精度不足。', impact='构图结构扣 2.5 分；排版网格扣 3.5 分。整体拓扑、对象覆盖得到相应分数。', evidence='reconstruction_compare_025.jpg', items=[0,1]),
    ]
    infra=read(RUN/'reports/infrastructure.json')
    seconds=sum(s['elapsed_seconds'] for s in infra['sessions'])
    task=dict(key='task-code2video',caseId='CODE2VIDEO',title='真实品牌动效 · 代码重建与定向返修',versionLabel='Code2Video v2',
              summary='BUCK × Adobe 真实品牌动画：4 秒重建、6 秒定向返修；改字、改色、阶段重定时与唯一光标延迟。Sol / xhigh：60/100。',
              status='packaged',category='动画重建',directory='case_code2video/real_v2/candidate',main='input/reference.mp4',
              poster='code2video-v2/poster.jpg',files=files,task=(SRC/'candidate/TASK.md').read_text(encoding='utf-8'),contract=rules,
              delivery=['重建 R · 4 秒 / 96 帧','返修 E · 6 秒 / 144 帧','共享可编辑工程与 render.py','edit_map.json 与 README.md'],resultCount=1,resultSummary='v2 · gpt-6.1-sol / xhigh · 60/100 · 未通过')
    payload=dict(case=task,grade=grade,tiers=tiers,method=method,errors=errors,artifacts=artifacts,seconds=seconds,
                 requests=sum(s['completed'] for s in infra['sessions']),model='gpt-6.1-sol',effort='xhigh')
    comparisons = []
    for extra in sorted((SRC/'runs').glob('*_xhigh_20261119_newkey*')):
        grade_path = extra/'reports/grade_v2.json'
        if not grade_path.exists():
            continue
        other = read(grade_path)
        run = read(extra/'reports/run.json')
        assert run['provider_configuration_verified'] and run['input_unchanged']
        assert other['review_complete'] and other['score'] == sum(x['score'] for x in other['items'])
        prefix = extra.name+'/'
        items = []
        for f in sorted((extra/'sealed/submission').rglob('*')):
            if f.is_file():
                rel = f.relative_to(extra/'sealed/submission').as_posix()
                items.append(dict(name=rel, url=publish(f,prefix+'submission/'+rel),bytes=f.stat().st_size))
        for name in ['grade_v2.json','run.json','media_checks.json','rebuild_checks.json','motion_checks.json','scene_checks.json']:
            f = extra/'reports'/name
            if f.exists():
                publish(f,prefix+'reports/'+name)
        evidence = []
        for f in sorted((extra/'reports/evidence').glob('*.jpg')):
            publish(f,prefix+'evidence/'+f.name)
            if '_compare_' in f.name:
                evidence.append(dict(file=f.name,label=f.stem))
        publish(extra/'reports/frozen_scoring_v2.md',prefix+'reports/frozen_scoring_v2.md')
        publish(extra/'reports/SCORING.md',prefix+'SCORING.md',False)
        comparisons.append(dict(model=run['model'],effort=run['reasoning_effort'],
                                base='code2video-v2/'+prefix,grade=other,artifacts=items,
                                seconds=run['elapsed_seconds'],requests=run['api_completed'],evidence=evidence))
    if comparisons:
        payload['comparisonRuns'] = comparisons
        task['resultCount'] = 1+len(comparisons)
        task['resultSummary'] = ' / '.join(f'{m["model"]} {m["grade"]["score"]:g}/100' for m in [payload,*comparisons])
        task['summary'] = 'BUCK × Adobe 真实品牌动画：4 秒重建、6 秒定向返修；同题 xhigh / 不限时。'+task['resultSummary']
    (OUT/'data.json').write_text(json.dumps(payload,ensure_ascii=False,indent=2),encoding='utf-8')
    (OUT/'data.js').write_text('window.CODE2VIDEO_V2 = '+json.dumps(payload,ensure_ascii=False).replace('</',r'<\/')+';\n',encoding='utf-8')
    for name in ['integration.js','style.css']:shutil.copy2(UI/name,OUT/name)
    standalone='''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Code2Video v2 · 结果与评分</title>BASE_TAG<link rel="stylesheet" href="code2video-v2/style.css"><script defer src="code2video-v2/data.js"></script><script defer src="code2video-v2/integration.js"></script></head><body class="c2v-standalone"><main><nav><a href="index.html#results">← 答卷与评分总览</a> · <a href="index.html#task-code2video/task">完整题面与素材</a></nav><div id="code2video-report"></div></main></body></html>'''
    (OUT/'index.html').write_text(standalone.replace('BASE_TAG','<base href="../">'),encoding='utf-8')
    (SRC/'review/results.html').write_text(standalone.replace('BASE_TAG','<base href="../../../case_dashboard/dist/">'),encoding='utf-8')
    (SRC/'review/index.html').write_text('<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>Code2Video v2</title><meta http-equiv="refresh" content="0;url=../../../case_dashboard/dist/index.html#task-code2video/task"><a href="../../../case_dashboard/dist/index.html#task-code2video/task">打开 Code2Video v2 题面</a></html>',encoding='utf-8')
    index=BASE/'dist/index.html'; page=index.read_text(encoding='utf-8')
    if 'code2video-v2/data.js' not in page:
        page=page.replace('<script defer src="app.js"></script>','<script defer src="code2video-v2/data.js"></script>\n  <script defer src="code2video-v2/integration.js"></script>\n  <script defer src="app.js"></script>')
    if 'code2video-v2/style.css' not in page:page=page.replace('</head>','<link rel="stylesheet" href="code2video-v2/style.css">\n</head>')
    index.write_text(page,encoding='utf-8')
    before=read(RUN/'reports/rescore_integrity_before.json')
    assert all(digest(SRC/n)==h for n,h in before.items()),'Protected task or solver files changed'
    (BASE/'qa/code2video-publish.json').write_text(json.dumps(dict(passed=True,protected_files_unchanged=len(before),published_files=audit),ensure_ascii=False,indent=2),encoding='utf-8')
    print(f'Code2Video v2: 60/100; {len(audit)} assets; {len(before)} protected files unchanged')

if __name__=='__main__':build()
