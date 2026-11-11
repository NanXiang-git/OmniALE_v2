"""Explain the published historical Case9 deductions; never rescore submissions."""
from pathlib import Path
import json, sys, importlib.util, hashlib, html, shutil
import cv2
import numpy as np

BASE=Path('D:/omniALE')
OLD=BASE/'runs_6_10_gpt61sol_high_50m/run_20261102_0045'
SUB=OLD/'sealed/case9/submission'
CASE=BASE/'cases_8_9_hard_v2/case_18'
DIST=BASE/'case_dashboard/dist'
PUBLISH=BASE/'github_publish/case9_deduction_frames_20261111/case_dashboard/dist'
OUT=DIST/'case9-deduction-frames'
OUT.mkdir(exist_ok=True)
sys.path.insert(0,str(CASE.parent))
spec=importlib.util.spec_from_file_location('checks18',CASE/'evaluator/deterministic.py')
checks=importlib.util.module_from_spec(spec);spec.loader.exec_module(checks)
read=lambda p:json.loads(p.read_text(encoding='utf-8-sig'))
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
selection=read(OLD/'judge_supplements/case9_qwen38omni_20261105/critical_frames.json')
truth=read(CASE/'evaluator/truth/faces.json')['frames']
before={p.name:sha(p) for p in SUB.iterdir() if p.is_file()}
caps={name:cv2.VideoCapture(str(path)) for name,path in {'source':CASE/'candidate/input/programme.mp4','output':SUB/'anonymous.mp4','mask':SUB/'mask.mkv'}.items()}
rows=[]
for i,item in enumerate(selection['selected']):
 n=item['frame'];frames={}
 for key,cap in caps.items():
  cap.set(cv2.CAP_PROP_POS_FRAMES,n);ok,frame=cap.read();assert ok;frames[key]=frame
 mask=cv2.cvtColor(frames['mask'],cv2.COLOR_BGR2GRAY)>=128
 met=checks.mask_metrics(mask,truth[n],mask.shape)
 assert all(abs(met[k]-v)<1e-12 for k,v in item['metrics'].items())
 target,allowed,other,names=checks.regions(truth[n],mask.shape)
 category='face_privacy' if i<4 else 'non_target_visual'
 problem=(target&~mask) if i<4 else (mask&~allowed)
 assert problem.any()
 diagnostic=frames['output'].copy()
 for region,color in [(target,(0,215,255)),(allowed,(255,220,0))]:
  contours,_=cv2.findContours(region.astype(np.uint8),cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
  cv2.drawContours(diagnostic,contours,-1,color,1)
 diagnostic[problem]=(45,45,255)
 ys,xs=np.where(problem);x0=max(0,int(xs.min())-35);x1=min(mask.shape[1],int(xs.max())+36);y0=max(0,int(ys.min())-35);y1=min(mask.shape[0],int(ys.max())+36)
 crop=diagnostic[y0:y1,x0:x1]
 scale=min(4,800/max(crop.shape[:2]));crop=cv2.resize(crop,None,fx=scale,fy=scale,interpolation=cv2.INTER_NEAREST)
 files={}
 for name,frame in [('source',frames['source']),('output',frames['output']),('diagnostic',crop)]:
  p=OUT/f'{n}_{name}.png';assert cv2.imwrite(str(p),frame);files[name]={'name':p.name,'sha256':sha(p)}
 sec=n/25;stamp=f'{int(sec//60):02}:{sec%60:05.2f}'
 rows.append({'frame_zero_based':n,'seconds':sec,'timecode':stamp,'category':category,'metrics':met,'problem_pixels':int(problem.sum()),'crop_xyxy':[x0,y0,x1,y1],'files':files})
for cap in caps.values():cap.release()
assert before=={p.name:sha(p) for p in SUB.iterdir() if p.is_file()}
data={'submission':str(SUB.relative_to(BASE)).replace('\\','/'),'submission_sha256':before,'score_unchanged':True,'fps':25,'frames':rows,'selection':selection['selection'],'interpretation':'Representative geometric failures; not a per-frame deduction or a new human identity judgment.'}
(OUT/'evidence.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
css='''<style>.case9-evidence{margin:24px 0;color:#203831}.case9-evidence h3{font-size:23px}.case9-evidence .c9-note{background:#edf3ef;padding:16px;border-radius:10px;line-height:1.7}.case9-evidence .c9-card{border:1px solid #ccd8d1;border-radius:12px;padding:18px;margin:16px 0;background:#fff}.case9-evidence .c9-images{display:grid;grid-template-columns:1fr 1fr;gap:16px}.case9-evidence figure{margin:0}.case9-evidence img{width:100%;height:290px;object-fit:contain;background:#eef1ef}.case9-evidence figcaption{line-height:1.6;font-size:14px;margin-top:6px}.case9-evidence .c9-metric{font-weight:700;color:#9d3428}.case9-evidence a{color:#146047}.case9-evidence summary{cursor:pointer;padding:12px;font-weight:700}.case9-evidence .c9-red{color:#c82b2b}.case9-evidence .c9-yellow{color:#8e6900}.case9-evidence .c9-cyan{color:#007a8c}@media(max-width:650px){.case9-evidence .c9-images{grid-template-columns:1fr}.case9-evidence img{height:auto;max-height:400px}.case9-evidence .c9-card{padding:12px}}</style>'''
def markup(prefix):
 groups=[]
 for cat,title,points,reason in [('face_privacy','目标脸与姓名遮挡',25,'面部核心区域的遮罩覆盖率须每帧 ≥ 99.5%。这组示例的姓名覆盖率均为 100%，实际触发的是面部核心区域覆盖不足。'),('non_target_visual','其他人物与遮挡范围',15,'超出允许区域的遮罩像素数 ÷ 允许区域像素数须每帧 ≤ 1%。这组示例的其他人物脸部遮罩占比均为 0%，实际触发的是遮挡范围超界。')]:
  cards=[]
  for row in [r for r in rows if r['category']==cat]:
   n=row['frame_zero_based'];m=row['metrics'];isface=cat=='face_privacy'
   metric=f"面部覆盖 {m['face_coverage']*100:.4f}% ＜ 99.5%" if isface else f"超界比 {m['outside_allowed']*100:.4f}% ＞ 1%"
   pixel=f"红色显示 {row['problem_pixels']} 个"+('应遮未遮的核心区域像素。' if isface else '超出允许区域的遮罩像素。')
   card=f'''<article class="c9-card"><h4>{row['timecode']} · 帧 {n}（从 0 起）</h4><p class="c9-metric">{metric}</p><p>{pixel}</p><div class="c9-images"><figure><a href="{prefix}{n}_output.png" target="_blank" rel="noopener"><img loading="lazy" src="{prefix}{n}_output.png" alt="{row['timecode']} 未加标记的冻结成片截图"></a><figcaption>实际成片原帧 · 点击查看原尺寸</figcaption></figure><figure><a href="{prefix}{n}_diagnostic.png" target="_blank" rel="noopener"><img loading="lazy" src="{prefix}{n}_diagnostic.png" alt="{row['timecode']} 程序问题像素的标注放大图"></a><figcaption>局部诊断图：<span class="c9-red">红色＝问题像素</span>；<span class="c9-yellow">黄色线＝面部核心边界</span>；<span class="c9-cyan">青色线＝允许区域边界</span>。标注仅用于解释，不属于成片。</figcaption></figure></div><p><a href="{prefix}{n}_source.png" target="_blank" rel="noopener">查看同一帧原片对照 ↗</a></p></article>'''
   cards.append(card)
  groups.append(f'<section><h3>{title} · 0 / {points}（扣 {points} 分）</h3><p>{reason}</p>'+cards[0]+'<details><summary>展开另外 3 个问题帧</summary>'+''.join(cards[1:])+'</details></section>')
 return css+'''<section class="case9-evidence" id="case9-deduction-evidence" aria-label="第九题扣分帧证据"><h3>扣分发生在哪里？</h3><p class="c9-note">对应当前展示的 GPT-6.1-sol / high 历史答卷：程序 40/80、裁判 20/20、总分 60/100。以下是两项程序扣分的 8 个代表性帧，并非全部问题帧；每项按整段门槛计分，<b>不是每张截图分别扣分</b>。裁判曾认定这些几何不足未构成肉眼可识别身份，裁判分未扣；截图解释原有程序扣分，不更改成绩，也不把肩部或背景超界称为遮住他人脸。</p>'''+''.join(groups)+f'<p>来源：冻结成片 anonymous.mp4、提交遮罩 mask.mkv、原评分器及已存异常帧清单。25 fps，时间＝从 0 起的帧号 ÷ 25。诊断图按原评分器的区域计算，像素放大不做平滑。<a href="{prefix}evidence.json" target="_blank" rel="noopener">查看帧号、实测值和哈希 ↗</a></p></section>'
(OUT/'index.html').write_text('<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>第九题扣分帧证据</title><body style="max-width:1100px;margin:30px auto;padding:16px;font-family:system-ui">'+markup('')+'</body></html>',encoding='utf-8')
js='  function case9DeductionFrames(r) {\n    if(current?.key!==\'task-09\'||r.submission!=='+json.dumps(data['submission'])+')return \'\';\n    return '+json.dumps(markup('case9-deduction-frames/'),ensure_ascii=False)+';\n  }\n'
for dist in [DIST,PUBLISH]:
 if dist!=DIST:shutil.copytree(OUT,dist/OUT.name,dirs_exist_ok=True)
 p=dist/'results-ui.js';s=p.read_text(encoding='utf-8')
 assert 'function case9DeductionFrames' not in s
 s=s.replace('  function renderScores(target) {',js+'  function renderScores(target) {')
 s=s.replace('target.innerHTML=`${lossAnalysis(r)}','target.innerHTML=`${case9DeductionFrames(r)}${lossAnalysis(r)}')
 needle='${comparisonPanel(r)}<div class="result-subnav"'
 replacement='${comparisonPanel(r)}${current?.key===\'task-09\'?\'<div class="result-notice">已补充 8 个扣分帧及局部标注：<button class="text-button" data-result-tab="scores">查看评分明细中的扣分截图 ↗</button></div>\':\'\'}<div class="result-subnav"'
 assert needle in s;s=s.replace(needle,replacement)
 p.write_text(s,encoding='utf-8')
print(json.dumps({'frames':len(rows),'score_unchanged':True,'submission_unchanged':True,'output':str(OUT)}))
