from pathlib import Path
import json,datetime,collections,hashlib,re
ROOT=Path(__file__).resolve().parents[1]
TITLES={6:'长片中文解说',7:'节目发布质检',8:'粗剪连续性审查',9:'会议定向去标识化',10:'课程中文音频描述修订'}
MAXIMUM={6:35,7:75,8:80,9:80,10:45}
CHECK_LABELS={'precision_gate':'精确率未达到80%','recall_gate':'召回率未达到90%','every_frame_privacy':'部分帧的目标脸遮挡不足','other_people_and_minimal_area':'遮挡范围超出允许区域'}
def read(p):return json.loads(p.read_text(encoding='utf-8-sig'))
def lines(p):
 result=[]
 if p.exists():
  for line in p.read_text(encoding='utf-8',errors='replace').splitlines():
   try:result.append(json.loads(line))
   except json.JSONDecodeError:pass
 return result
rows=[]
for n in range(6,11):
 runpath=ROOT/f'solver/case{n}/run.json'
 if not runpath.exists():rows.append({'task':n,'title':TITLES[n],'status':'not_started'});continue
 run=read(runpath);events=lines(runpath.parent/'events.jsonl');api=lines(ROOT/f'reports/case{n}_gateway.jsonl');scorepath=ROOT/f'judge/case{n}/score.json';score=read(scorepath) if scorepath.exists() else None
 usage=[x['usage'] for x in events if x.get('type')=='turn.completed' and x.get('usage')]
 row={'task':n,'title':TITLES[n],'status':run['status'],'start_utc':run['start_utc'],'end_utc':run.get('end_utc'),'seconds':run.get('elapsed_seconds'),'exit_code':run.get('exit_code'),'solver_usage':usage,'solver_api_calls':sum(x.get('route','').startswith('/v1/') for x in api),'tts_calls':sum(x.get('route')=='/tts' for x in api),'api_status_counts':dict(collections.Counter(str(x.get('status','error')) for x in api if x.get('route','').startswith('/v1/'))),'automatic_max':MAXIMUM[n],'score':score,'answer':f'../sealed/case{n}/submission','trace':f'../solver/case{n}/events.jsonl'}
 row.update(timing_valid=run.get('timing_valid'),deadline_utc=run.get('deadline_utc'),active_clock_seconds=run.get('active_clock_seconds'),wall_clock_seconds=run.get('wall_clock_seconds'))
 technical=ROOT/f'judge/case{n}/technical.json'
 if technical.exists():
  t=read(technical);components=t.get('components',{});row['automatic_score']=sum(x['score'] for x in components) if isinstance(components,list) else sum(components.values());row['technical_failed_checks']=[x['id'] for x in t.get('checks',[]) if not x['passed']]
 row['judge_completed_reviews']=[{k:d.get(k) for k in ['model_returned','reasoning_returned','id','usage']} for p in sorted((ROOT/f'judge/case{n}').glob('reviewer_*.json')) if re.fullmatch(r'reviewer_[123]\.json',p.name) for d in [read(p)]]
 if n==9 and score and score.get('judge_protocol',{}).get('model')=='qwen3.8-omni-flash':
  row['judge_completed_reviews']=[{'model_returned':d.get('models_returned'),'reasoning_returned':'provider default; not high','usage':d.get('usage'),'request_sha256':d.get('request_sha256')} for p in sorted((ROOT/'judge/case9').glob('reviewer_*.json')) for d in [read(p)]]
 rows.append(row)
interrupted=[{'path':str(p.parent.parent.relative_to(ROOT)),'run':read(p)} for p in (ROOT/'interrupted_attempts').glob('*/solver/run.json')]
report={'requested_model':'gpt-6.1-sol','harness':'Codex CLI 0.163.0','reasoning_effort':'high','per_task_limit_seconds':3000,'serial_order':[6,7,8,9,10],'audio_judge_limitation':'Native audio unavailable; user authorized pending audio criteria and null totals.','all_solver_runs_finished':all(x['status'] in ['finished','timeout'] for x in rows),'all_grades_recorded':all(x.get('score') is not None for x in rows),'excluded_infrastructure_attempts':interrupted,'tasks':rows,'updated_utc':datetime.datetime.now(datetime.timezone.utc).isoformat()}
(ROOT/'reports/results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
md=['# 第6—10题串行实测结果','', '固定条件：gpt-6.1-sol + Codex CLI 0.163.0，high，每题最多50分钟，独立上下文，顺序6→7→8→9→10。已冻结答案不由主持人修复。','', '**所有总分保留待评（null）**：指定Judge原生听音不可用，用户明确批准听审项待评。程序分及有证据的视觉/文本分不等于最终总分。','', '| 题号 | 题目 | 答题耗时 | 运行状态 | 程序分 | 已核实小计 | 总分 | 验收状态 |','|---|---|---:|---|---:|---:|---|---|']
for row in rows:
 n=row['task'];s=row.get('score');duration=f"{row['seconds']/60:.2f}分钟" if row.get('seconds') is not None else '运行中/未开始';auto=f"{row['automatic_score']:.3f}/{MAXIMUM[n]}" if 'automatic_score' in row else '未完成';subtotal=str(s['verified_subtotal']) if s else '未完成';accepted='硬约束未通过' if s and s['accepted'] is False else '待听审' if s else '尚未评分'
 md.append(f"| {n} | {row['title']} | {duration} | {row['status']} | {auto} | {subtotal} | 待评 | {accepted} |")
md+=['','## 逐题文件','']
if interrupted:md+=[f'已排除{len(interrupted)}次基础设施中断试次；轨迹和文件保存在interrupted_attempts中，不计入上表。正式试次重新初始化上下文，没有继承旧答案。当前采用绝对UTC截止，并通过时间跳变测试；队列保持系统唤醒。','']
if (ROOT/'reports/case6_timing_reconciliation.json').exists():md+=['本轮第6题在绝对截止前完成，墙钟用时40分46秒。初始监控因WSL时钟差异误标中断，核验成功退出、全部文件时间和哈希后已纠正；没有重跑或改动答案。原记录及修正依据见[计时核验](case6_timing_reconciliation.json)。计时以墙钟为准，暂停和等待均占用预算。','']
if (ROOT/'judge_infrastructure_attempts/case6_wsl_shell_quoting').exists():md+=['第6题初次程序评分遇到Windows→WSL参数传递错误，重建检查未执行完整；该次分数已作废归档。修复为直接执行并通过滤镜及路径参数测试后，仅重评原冻结答案；没有更改题目阈值。','']
for row in rows:
 n=row['task'];md.append(f"- 第{n}题：[冻结答案](../sealed/case{n}/submission)、[输入输出冻结记录](../sealed/case{n}/MANIFEST.json)、[可见运行轨迹](../solver/case{n}/events.jsonl)、[程序检查](../judge/case{n}/technical.json)、[评分明细](../judge/case{n}/score.json)。")
 if row.get('technical_failed_checks'):md.append('  程序未通过项：'+'；'.join(CHECK_LABELS.get(k,k) for k in row['technical_failed_checks'])+'。')
if (ROOT/'reports/final_audit.json').exists():md+=['','[最终完整性核验](final_audit.json)已通过：五题串行时间、冻结答案哈希、每题两次指定模型/high评审回执均核实；所有总分保持null。','']
md+=['','## 解释与复现','', 'Judge继续使用gpt-6.1-sol high。每题提供有限的实际画面与提交文本做独立诊断；诊断不补算未听审的内容分。第8题usable_report为独立可评的5分视觉/文本标准，其余冻结LLM内容项均包含声音条件，保持pending。两个独立评审有分歧时使用第三次仲裁。所有语义硬门槛仍需完整听审。','', '环境隔离、TTS和Codex实际调用、独立子进程硬截止已通过预检。只挂载当前公开candidate；作者材料、真值、评测日志、其他题和密钥不向Solver暴露。API网关强制模型名和high。没有预装ASR或额外音频模型，网络关闭；这是本次工具环境条件，不可把由此产生的限制说成所有Codex环境都不具备该能力。','', '评分使用原题包冻结标准，运行副本与原素材校验；不执行考生代码。正式开始后的API等待、媒体处理、配音与自检计入50分钟。超时杀掉整个隔离进程树，提前结束按实际结束时刻冻结。单次观察不构成普遍难度结论。','', '用量、API调用次数、返回模型及推理配置（Judge端）、开始结束时间见results.json。脚本位于../orchestrator；环境、能力探针及来源记录位于../environment。不要把私有评分文件交给被测模型。']
supplement=ROOT/'judge_supplements/case9_qwen38omni_20261105/integrity_audit.json'
if supplement.exists():
 audit=read(supplement)
 report['audio_judge_limitation']='Original gpt-6.1-sol native audio unavailable. Case9 supplemented using qwen3.8-omni-flash; other cases unchanged.'
 report['case9_supplement']=audit
 (ROOT/'reports/results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
 md=[line.replace('**所有总分保留待评（null）**：指定Judge原生听音不可用，用户明确批准听审项待评。','**第9题已追加Qwen原生音视频补评，其余题总分仍待评**：原指定Judge听审受限；补评分及证据独立记录。').replace('[最终完整性核验](final_audit.json)已通过：','历史原始批次[完整性核验](final_audit.json)已通过：') for line in md]
 for i,line in enumerate(md):
  if line.startswith('| 9 |'):
   fields=line.split('|');fields[7]=' '+str(audit['total'] if audit['total'] is not None else '待评')+' ';md[i]='|'.join(fields)
 md+=['','## 第9题后续补评（2026-11-05）','',f"原程序40/80不变，Qwen3.8-omni-flash补评{audit['judge_score']}/20，总分{audit['total']}，硬门槛未通过。Solver和冻结答卷未改变。Qwen采用供应商默认推理配置，不声明high。上文gpt听审限制及旧完整性核验描述的是原始批次，不能套用于此次补评。",'', '[补评完整性核验](../judge_supplements/case9_qwen38omni_20261105/integrity_audit.json)；[评审共识](../judge/case9/review.json)。']
(ROOT/'reports/RESULTS.md').write_text('\n'.join(md)+'\n',encoding='utf-8')
print(json.dumps({'complete':report['all_solver_runs_finished'] and report['all_grades_recorded'],'rows':[{'task':x['task'],'status':x['status'],'auto':x.get('automatic_score'),'total':x.get('score',{}).get('total') if x.get('score') else None} for x in rows]},ensure_ascii=False))
