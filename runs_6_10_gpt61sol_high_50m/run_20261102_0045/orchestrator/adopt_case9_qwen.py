"""Adopt completed evidence-bound review and update only Case9 dashboard records."""
from pathlib import Path
import sys,json,hashlib,shutil,datetime,html,re
ROOT=Path(__file__).resolve().parents[1]; BASE=ROOT.parents[1]
OUT=ROOT/'judge_supplements/case9_qwen38omni_20261105'
sys.path.insert(0,str(BASE/'cases_8_9_hard_v2'))
from evaluate import aggregate,evaluation_binding,media_rows
def read(p):return json.loads(p.read_text(encoding='utf-8-sig'))
def save(p,x):p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(x,ensure_ascii=False,indent=2),encoding='utf-8')
def sha(p):
 with p.open('rb') as f:return hashlib.file_digest(f,'sha256').hexdigest()
def main():
 case=BASE/'cases_8_9_hard_v2/case_18'; sub=ROOT/'sealed/case9/submission'; canonical=ROOT/'judge/case9'
 review=read(OUT/'consensus.json');spec=read(case/'evaluator/judge_spec.json');protocol=read(OUT/'protocol.json')
 assert all(x['status'] in ['pass','fail','unverified'] for x in review['gates'])
 assert all(x['rating']=={'pass':1,'partial':.5,'fail':0,'unverified':None}[x['status']] for x in review['items'])
 archive=OUT/'previous_gpt61_visual_only';archive.mkdir(exist_ok=True)
 for name in ['score.json','review.json','reviewer_1.json','reviewer_2.json','technical.json']:
  if not (archive/name).exists():shutil.copy2(canonical/name,archive/name)
 assert sha(canonical/'technical.json')==sha(archive/'technical.json')
 expected={x['path']:x['sha256'] for x in read(ROOT/'sealed/case9/MANIFEST.json')['files']}
 assert expected==review['submission_hashes']=={p.relative_to(sub).as_posix():sha(p) for p in sub.rglob('*') if p.is_file()}
 receipts=[]
 for mid in ('meeting_source','meeting_anonymous'):
  for start in range(0,300,30):
   folder=OUT/f'evidence/{mid}_{start:03}';packet=read(folder/'receipt.json');window=packet['windows'][0]
   assert window['start']==start and window['end']==start+30 and abs(window['audio_duration']-30)<.05
   assert sha(folder/'packet.wav')==packet['audio_sha256'] and sha(folder/'0.wav')==window['audio_sha256']
   assert len(window['frames'])==30
   for frame in window['frames']:assert sha(OUT/frame['path'])==frame['sha256']
 for i in range(1,review['sessions']+1):
  for mid in ('meeting_source','meeting_anonymous'):
   for start in range(0,300,30):
    p=OUT/f'observations/reviewer_{i}/{mid}_{start:03}.json';r=read(p)
    assert r['models_returned']==['qwen3.8-omni-flash'] and r['audio_count']==1 and r['image_count']==30
    assert r['result']['audio_received'] and r['result']['images_received']
    receipts.append({'path':p.relative_to(OUT).as_posix(),'sha256':sha(p)})
  r=read(OUT/f'reviewer_{i}.json');assert r['models_returned']==['qwen3.8-omni-flash']
 review['evaluation_hashes']=evaluation_binding(case)
 assert review['evaluation_hashes']==read(archive/'review.json')['evaluation_hashes'],'Frozen rubric/truth changed since original evaluation'
 assert review['input_hashes']=={k:r['sha256'] for k,r in media_rows(case,sub,spec).items()}
 technical=read(canonical/'technical.json');score=aggregate(technical,review,spec)
 assert sum(technical['components'].values())==40
 score['experiment']='Frozen gpt-6.1-sol high Solver; original automatic80 unchanged; Qwen native audiovisual supplementary20'
 score['judge_protocol']={**protocol,'native_audio_supported':True,'reasoning_setting':'provider default','capability_probe_passed':True}
 save(canonical/'review.json',review);save(canonical/'score.json',score)
 for i in range(1,review['sessions']+1):shutil.copy2(OUT/f'reviewer_{i}.json',canonical/f'reviewer_{i}.json')
 audit={'passed':True,'updated_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'submission_unchanged':True,'technical_unchanged':True,'technical_sha256':sha(canonical/'technical.json'),'automatic_score':40,'judge_score':score['verified_subtotal']-40,'total':score['total'],'accepted':score['accepted'],'sessions':review['sessions'],'audio_seconds_per_review':600,'visual_sampling_fps':1,'critical_frames':read(OUT/'critical_frames.json')['selected'],'observation_receipts':receipts,'limitations':['音轨全时长分段输入；视觉1fps独立图片和8个异常帧，不是逐帧人工审查。','程序全7500帧检测失败仍保留；LLM听看不能豁免硬约束。','Qwen使用供应商默认推理配置，不声称high。','两轮独立会话是同一模型，不等于独立人类评审。']}
 save(OUT/'integrity_audit.json',audit)
 labels={'remaining_identity':'剩余可识别身份','semantic_and_overlap_preservation':'重叠语音与语义保留','usable_delivery':'观看可用性'}
 rows=''.join(f'<tr><td>{labels[x["id"]]}</td><td>{score["components"].get(x["id"],"待评")} / {x["weight"]}</td><td>Qwen判定：{next(y["status"] for y in review["items"] if y["id"]==x["id"])}<details><summary>展开判定依据与时间点</summary>{html.escape(next(y["finding"] for y in review["items"] if y["id"]==x["id"]))}</details></td></tr>' for x in spec['items'])
 detail=f'''<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>第9题 Case18 · Qwen补评</title><style>body{{font:17px/1.7 system-ui;max-width:1100px;margin:40px auto;padding:0 24px;color:#172337;background:#f5f7fb}}table{{border-collapse:collapse;background:white;width:100%}}td,th{{border:1px solid #d6dfeb;padding:16px;text-align:left}}a{{color:#1252a0}}small{{color:#526079}}</style><a href="../index.html#task-09/results">← 返回第9题答卷与评分</a><h1>第9题 / Case18：Qwen原生音视频补评</h1><p><b>程序40/80 + 裁判{audit['judge_score']}/20；总分{score['total'] if score['total'] is not None else '待评'}/100。硬门槛未通过。</b></p><p>Solver：gpt-6.1-sol / high，原冻结答卷未修改。补评Judge：qwen3.8-omni-flash，供应商默认推理配置。此次仅补剩余20分，原程序评分及标准未修改。</p><table><tr><th>项目</th><th>得分</th><th>判定依据</th></tr>{rows}</table><h2>验收门槛</h2><ul>{''.join('<li>'+html.escape(x['id']+'：'+x['status']+'；'+x['finding'])+'</li>' for x in review['gates'])}</ul><p>程序仍确认：部分帧目标脸覆盖率不足，遮罩超出允许区域。因此即使主观评审未发现直接可辨身份，也不能宣称题目通过。</p><h2>评审覆盖与边界</h2><ul>{''.join('<li>'+html.escape(x)+'</li>' for x in audit['limitations'])}</ul><p>{review['sessions']}轮独立完整评审；每轮原片300秒、成片300秒原生音轨，600张独立采样图片；关键姓名/机构/重叠片段额外复听，并复看8个程序定位异常帧。若前两轮分歧，增加第三轮按项目多数决；无多数项仍待评。</p><h2>可追溯记录</h2><p>以下仅公开评分结论、调用回执及完整性核验；不公开API密钥或私有题库真值。</p><ul>{''.join(f'<li><a href="{n}">{n}</a></li>' for n in ['score.json','review.json','protocol.json','integrity_audit.json','capability_probe.json']+[f'reviewer_{i}.json' for i in range(1,review['sessions']+1)])}</ul><details><summary>两轮/三轮原始判定对比</summary><pre>{html.escape(json.dumps([read(OUT/f'reviewer_{i}.json')['result'] for i in range(1,review['sessions']+1)],ensure_ascii=False,indent=2))}</pre></details></html>'''
 detail=detail.replace('</style>','th:first-child{width:180px}th:nth-child(2){width:110px}table{table-layout:fixed;overflow-wrap:anywhere}pre{white-space:pre-wrap;overflow-wrap:anywhere}details{margin-top:8px}</style>')
 for root in [BASE,BASE/'github_publish/case9_qwen_update_20261105']:
  dist=root/'case_dashboard/dist';dest=dist/'case9-qwen-report';dest.mkdir(exist_ok=True)
  (dest/'index.html').write_text(detail,encoding='utf-8')
  gallery='<h2>程序定位异常帧：成片实际画面</h2><p>下列图片用于复核，不代表所有未采样帧均已人工检查。</p>'
  for entry in audit['critical_frames']:
   name=f"output-frame-{entry['frame']}.jpg";shutil.copy2(OUT/entry['images']['meeting_anonymous'],dest/name)
   gallery+=f'<figure><img loading="lazy" style="max-width:100%" src="{name}" alt="成片第{entry["frame"]}帧"><figcaption>{entry["frame"]/25:.2f}秒；脸覆盖率{entry["metrics"]["face_coverage"]:.4f}；超出允许遮挡区域{entry["metrics"]["outside_allowed"]:.4f}</figcaption></figure>'
  (dest/'index.html').write_text(detail.replace('</html>',gallery+'</html>'),encoding='utf-8')
  for name in ['score.json','review.json']:shutil.copy2(canonical/name,dest/name)
  for name in ['protocol.json','integrity_audit.json','capability_probe.json']+[f'reviewer_{i}.json' for i in range(1,review['sessions']+1)]:shutil.copy2(OUT/name,dest/name)
  js=dist/'results.js';text=js.read_text(encoding='utf-8');prefix,payload=text.split('window.OMNIALE_RESULTS = ',1);data=json.loads(payload.strip().removesuffix(';'));before={k:json.dumps(v,sort_keys=True,ensure_ascii=False) for k,v in data.items() if k!='task-09'}
  r=data['task-09'];r.update(automatic=40,judge=audit['judge_score'],verified=score['verified_subtotal'],total=score['total'],accepted=False,pending=score['pending'],gradeStatus='complete' if score['total'] is not None else 'partial',judgeModel='qwen3.8-omni-flash',gradeNote=f"程序40/80保持不变；Qwen3.8-omni-flash原生音视频补评{audit['judge_score']}/20，总分{score['total'] if score['total'] is not None else '待评'}。Solver仍为gpt-6.1-sol high；程序硬门槛未通过。补评详情见“运行与来源”。",review=review)
  for row in r['rows']:
   if row['group']=='judge':
    finding=next(x for x in review['items'] if x['id']==row['id']);row.update(points=score['components'].get(row['id']),finding=finding['finding'],evidence=finding['evidence'])
  r['pendingPoints']=sum(x['maximum'] for x in r['rows'] if x['points'] is None)
  r['failures']=[{'id':x,'label':'程序硬约束未通过' if x=='deterministic_hard_constraints' else x} for x in score['hard_failures']]
  for f in r['reports']:
   name=f.get('name')
   if name in ['score.json','review.json','reviewer_1.json','reviewer_2.json']:
    p=dest/name;f.update(url='case9-qwen-report/'+name,text=p.read_text(encoding='utf-8'),bytes=p.stat().st_size)
  r['reports']=[f for f in r['reports'] if f.get('name')!='qwen-supplement.html']
  r['reports'].append({'name':'qwen-supplement.html','label':'Qwen补评详情','role':'Qwen原生音视频补评与完整性核验','kind':'document','path':'qwen-supplement.html','url':'case9-qwen-report/index.html','bytes':(dest/'index.html').stat().st_size})
  assert before=={k:json.dumps(v,sort_keys=True,ensure_ascii=False) for k,v in data.items() if k!='task-09'}
  js.write_text(prefix+'window.OMNIALE_RESULTS = '+json.dumps(data,ensure_ascii=False).replace('</',r'<\/')+';\n',encoding='utf-8')
  build_audit=root/'case_dashboard/result-build-report.json'
  if build_audit.exists():
   b=read(build_audit)
   for row in b.get('tasks',[]):
    if row.get('task')==9:row.update(scoreStatus=r['gradeStatus'],automatic=40,verified=r['verified'],formalTotal=r['total'],accepted=False)
   b['case9SupplementUpdatedAt']=audit['updated_utc'];save(build_audit,b)
 print(json.dumps({'total':score['total'],'judge':audit['judge_score'],'pending':score['pending'],'accepted':score['accepted']},ensure_ascii=False))
if __name__=='__main__':main()
