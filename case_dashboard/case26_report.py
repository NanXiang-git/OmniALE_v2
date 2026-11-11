"""Task-05 versioned overlay; preserves every other task and historical v2 result."""
from pathlib import Path
import json,shutil,os,hashlib,datetime,html
ROOT=Path(__file__).resolve().parents[1];DIST=ROOT/'case_dashboard/dist';OUT=DIST/'case26-v3-report'
C=ROOT/'case26_v3/case_26';RUN=ROOT/'runs_case26_v3_gpt61sol_high_60m/run_20261111'
def read(p):return json.loads(p.read_text(encoding='utf-8'))
def js(x):return json.dumps(x,ensure_ascii=False).replace('</','<\\/')
def link(src,dst):
    dst.parent.mkdir(parents=True,exist_ok=True)
    if not dst.exists():os.link(src,dst)
def build():
    if not C.exists():return
    OUT.mkdir(parents=True,exist_ok=True)
    preview=ROOT/'case26_damage_preview_v3'
    for name in ['style.css','app.js']:shutil.copy2(preview/name,OUT/name)
    for p in (preview/'media').iterdir():
        if p.is_file():link(p,OUT/'media'/p.name)
    link(C/'candidate/input/previous_attempt.mp4',OUT/'media/previous_attempt_v3.mp4')
    public=OUT/'candidate';public.mkdir(exist_ok=True)
    files=[]
    for p in sorted((C/'candidate').rglob('*')):
        if not p.is_file():continue
        rel=p.relative_to(C/'candidate').as_posix();url='case26-v3-report/candidate/'+rel
        if p.suffix in ['.mkv','.mp4']:
            link(p,public/rel);kind='video'
        else:
            (public/rel).parent.mkdir(parents=True,exist_ok=True);shutil.copy2(p,public/rel);kind='document'
        f={'name':p.name,'path':rel,'url':url,'bytes':p.stat().st_size,'kind':kind}
        if kind=='document':f['text']=p.read_text(encoding='utf-8')
        else:
            f['meta']={'width':640,'height':338,'fps':'24/1','duration':26}
            f['preview']='case26-v3-report/media/'+('damaged_v3.mp4' if p.suffix=='.mkv' else 'previous_attempt_v3.mp4')
        files.append(f)
    status='环境预检完成 · 等待正式答题';explanation='已验证 gpt-6.1-sol / high、图像读取、隔离环境和60分钟超时终止。成绩将在答卷封存后生成。'
    freeze=RUN/'sealed/case_26/freeze.json';scorepath=RUN/'evaluation/score.json'
    active=RUN/'orchestrator/case_26/events.jsonl'
    automatic_path=RUN/'evaluation/automatic.json'
    score=read(scorepath) if scorepath.exists() else read(automatic_path) if automatic_path.exists() else None
    seconds=None;result=None
    if freeze.exists():
        result=read(freeze);seconds=result.get('elapsed_solver_environment_seconds');status='答卷已封存 · 评分进行中';explanation='60分钟独立答题已结束，正在检查交付、计算自动分并完成独立视听评审。'
    elif active.exists():status='Sol/high 正式答题进行中';explanation='独立环境限时60分钟，过程中不提供评分或参考答案。结束后封存并评分。'
    rules=read(C/'candidate/public_rules.json');rows=[]
    for group,weights in [('automatic',rules['automatic_weights']),('judge',{x['id']:x['weight'] for x in rules['judge_items']})]:
        for key,maximum in weights.items():rows.append({'id':key,'maximum':maximum,'points':score.get(group+'_scores',{}).get(key) if score else None,'group':group})
    summary={'key':'task-05-v3','title':'弱光修复 · 加重损伤v3','attempt':'case26-v3-sol-high-60m','model':'gpt-6.1-sol','effort':'high','harness':'Codex CLI 0.163.0','packageVersion':'3.0','artifacts':[],'rows':rows,'automaticMax':60,'judgeMax':40,'automatic':sum(score.get('automatic_scores',{}).values()) if score else None,'judge':sum(score.get('judge_scores',{}).values()) if score else None,'verified':score['verified_subtotal'] if score else None,'total':score['formal_total'] if score else None,'accepted':score['accepted'] if score else None,'gradeStatus':'complete' if score and score['formal_total'] is not None else 'partial' if score else 'not_started','seconds':seconds,'timedOut':result.get('timed_out') if result else None,'integrity':{'passed':bool(result)},'pendingPoints':score.get('pending_points',100) if score else 100,'gradeNote':explanation,'summary':explanation,'main':'preview.mp4'}
    score_html=''
    if score:
        status='评分完成' if score['formal_total'] is not None else '已有部分评分 · 待评项保留'
        explanation='正式总分与硬门槛分别展示；本轮输入为v3，历史v2分数不作同条件比较。'
        summary['gradeNote']=explanation;summary['summary']=explanation
        labels={'delivery':'交付格式','repair_replay':'修订层重放','restoration':'分段修复改善','motion_detail':'运动细节','temporal':'时间连续性','lighting':'设计光变','protected':'正常保护段','motion_evidence':'真实动作保留','restoration_quality':'实际修复质量','lighting_intent':'灯光意图'}
        table=''.join('<tr><td>'+labels.get(x['id'],x['id'])+'</td><td>'+('待评' if x['points'] is None else f"{x['points']:.4f}")+'</td><td>'+str(x['maximum'])+'</td></tr>' for x in rows)
        fails=score['hard_failures']+score['critical_failures'];total=score['formal_total']
        failure_labels={'preview_not_master':'预览与无损母版不够一致','motion_error':'运动区域误差超标','edge_detail':'边缘细节门槛未达标','temporal_residual':'时间连续性残差超标','frozen_motion':'动作出现冻结','protected_changed':'正常保护片段被改动','light_intent_1':'暖光意图偏离','light_intent_2':'冷暗意图偏离','light_tile_error':'局部灯光误差超标','repair_reconstruction':'修订层无法准确重放','empty_repair':'修订层为空','motion_evidence':'动作证据核心项失败','restoration_quality':'实际修复质量核心项失败','lighting_intent':'光变意图核心项失败'}
        failure_labels.update({f'insufficient_gain_block_{i}':f'第{i}受损区段改善不足' for i in range(1,5)})
        readable_failures='；'.join(failure_labels.get(f,f) for f in fails) or '无'
        score_html=f'<div class="score-summary"><strong>总分：{total if total is not None else "待评"} / 100</strong><span>已核实：{score["verified_subtotal"]} · 待评权重：{score["pending_points"]}</span><span>硬门槛：{"未通过" if fails else "已通过" if total is not None else "待确认"} · 实际用时：{(seconds or 0)/60:.2f} 分钟</span></div><table class="grade-table"><thead><tr><th>评分项</th><th>得分</th><th>满分</th></tr></thead><tbody>{table}</tbody></table><p>失败项：{html.escape(", ".join(fails) or "无")}</p>'
        score_html=score_html.replace(html.escape(', '.join(fails) or '无'),html.escape(readable_failures))
        (OUT/'score.json').write_text(js(score),encoding='utf-8')
    submission=RUN/'sealed/case_26/submission'
    if result:
        for entry in result['submission_manifest']:
            p=submission/entry['path'];relative=entry['path'].replace('\\','/')
            assert hashlib.file_digest(p.open('rb'),'sha256').hexdigest()==entry['sha256']
            link(p,OUT/'submission'/relative)
            summary['artifacts'].append({'name':p.name,'path':relative,'url':'case26-v3-report/submission/'+relative,'bytes':p.stat().st_size,'kind':'video' if p.suffix in ['.mp4','.mkv'] else 'document'})
        (OUT/'freeze.public.json').write_text(js({k:result.get(k) for k in ['submission_manifest','elapsed_solver_environment_seconds','timed_out']}),encoding='utf-8')
        settings=read(RUN/'environment/experiment_settings.json')
        api=RUN/'orchestrator/case_26/api.jsonl'
        calls=[json.loads(line) for line in api.read_text(encoding='utf-8').splitlines()] if api.exists() else []
        protocol={k:settings[k] for k in ['model','reasoning_effort','harness','wall_clock_seconds','truth_access','external_network','grading']}
        protocol.update({'task_version':'3.0','status':'scored' if score and score['formal_total'] is not None else 'sealed','actual_elapsed_seconds':seconds,'timed_out':result.get('timed_out'),'formal_attempts':1,'api_requests':len(calls),'returned_models':sorted({x['model'] for x in calls if x.get('model')}),'returned_efforts':sorted({x['reasoning']['effort'] for x in calls if x.get('reasoning',{}).get('effort')}),'environment_acceptance':read(RUN/'environment/acceptance.json')['checks'],'preflight_note':'Earlier credential smoke checks failed before the formal attempt; they are infrastructure checks, not solver scores.'})
        (OUT/'run_protocol.json').write_text(js(protocol),encoding='utf-8')
        if score:
            (OUT/'judge-evidence').mkdir(exist_ok=True)
            for source,name in [(RUN/'evaluation/primary/judge.json','primary.json'),(RUN/'evaluation/independent/judge.json','independent.json'),(RUN/'evaluation/resolved_judge.json','resolved.json')]:
                if source.exists():
                    evidence=read(source);evidence.pop('base_url',None);evidence.pop('usage',None)
                    (OUT/'judge-evidence'/name).write_text(js(evidence),encoding='utf-8')
    output_html=''
    if (OUT/'submission/preview.mp4').exists():
        output_html='<section class="note-card" style="margin-bottom:24px"><h2>Sol / high · 实际修复成片</h2><video controls playsinline preload="metadata" src="submission/preview.mp4" style="width:100%;max-width:960px"></video><p>该视频来自冻结答卷，未代改。<a href="submission/preview.mp4" download>下载成片 ↗</a> · <a href="freeze.public.json">冻结文件清单 ↗</a></p></section>'
    if (OUT/'result-media/clean-damaged-sol.mp4').exists():
        stills=''.join(f'<a href="result-media/frame_{n:03}.png" target="_blank"><img src="result-media/frame_{n:03}.png" style="width:100%;height:auto" loading="lazy" alt="{n/24:.2f}秒：左无损参考、中受损输入、右Sol修复"><span>{n/24:.2f} 秒 · 打开原尺寸 PNG ↗</span></a>' for n in [96,192,336,456,552,612])
        output_html='<section class="note-card" style="margin-bottom:24px"><h2>无损参考 / 受损输入 / Sol 修复</h2><p>左、中、右三栏顺序固定；同一视频逐帧同步，可全屏观察。</p><video controls playsinline preload="metadata" src="result-media/clean-damaged-sol.mp4" style="width:100%"></video><details><summary>查看 6 个关键时刻的无损 PNG</summary>'+stills+'</details><p>修复画面来自封存母版；网页视频为浏览副本。</p></section>'+output_html
    banner=f'<section class="note-card" style="margin-bottom:24px"><span class="card-kicker mint">GPT-6.1 SOL / HIGH + CODEX · 60 MIN</span><h2>{status}</h2><p>{explanation}</p>{score_html}</section>{output_html}'
    if result:banner= banner.replace('</section>','<p><a href="run_protocol.json">运行条件与验收记录 ↗</a> · <a href="freeze.public.json">答卷哈希清单 ↗</a></p></section>',1)
    page=(preview/'index.html').read_text(encoding='utf-8').replace('<section class="lab"',banner+'\n<section class="lab"',1)
    page=page.replace('CASE 26 · V3 试制','CASE 26 · V3 正式题包').replace('此页用于审阅新损伤强度，尚未证明修复难度或更新正式评分规则。','本轮使用冻结的 v3 题包与评分规则。对照工具已通过正反例检查；常规修复基线未通过门槛，任务可修复性仍需结合实际答题结果判断。')
    page=page.replace('<link rel="stylesheet" href="style.css">','<link rel="stylesheet" href="style.css"><style>.score-summary{display:flex;gap:20px;flex-wrap:wrap;margin:16px 0}.grade-table{width:100%;border-collapse:collapse}.grade-table td,.grade-table th{padding:9px;border-bottom:1px solid #34434e;text-align:left}</style>')
    (OUT/'index.html').write_text(page,encoding='utf-8')
    generation=read(preview/'generation_report.json')
    public_generation={k:v for k,v in generation.items() if k not in ['per_frame','source','seed']}
    public_generation['status']='Integrated into frozen Case26 v3. Numeric rules preserved; this report alone does not certify recoverability.'
    public_generation['note']='Public review comparison. Clean reference is excluded from isolated solver input. Exact damage-generation parameters remain private.'
    (OUT/'generation_report.json').write_text(js(public_generation),encoding='utf-8')
    case={'title':'弱光修复 · 加重损伤与动作保护','summary':'26秒控制台操作实拍；v3加重暗部噪声、色斑、闪动与运动残影。保留设计光变和正常片段；Sol/high + Codex限时60分钟。','versionLabel':'V3 加重损伤 · 60分钟','packageVersion':'3.0','directory':'case26_v3/case_26/candidate','resultKey':'task-05-v3','previousResultKey':'task-05','experimentStatus':'running' if active.exists() else 'prepared_not_experimented','main':'input/damaged.mkv','files':files,'task':(C/'candidate/TASK.md').read_text(encoding='utf-8'),'outputs':[{'title':'v3公开交付合同','text':(C/'candidate/TASK.md').read_text(encoding='utf-8')}],'status':'packaged'}
    case['experimentStatus']='completed' if score and score['formal_total'] is not None else 'grading' if result else 'running' if active.exists() else 'prepared_not_experimented'
    payload={'case':case,'result':summary,'status':status,'explanation':explanation}
    (OUT/'summary.json').write_text(js(payload),encoding='utf-8')
    overlay='''(()=>{const x=PAYLOAD,d=window.OMNIALE_DATA,r=window.OMNIALE_RESULTS,o=window.OmniResults;if(!d||!r||!o)return;
const c=d.cases.find(c=>c.key==='task-05');window.CASE26_PREVIOUS={case:JSON.parse(JSON.stringify(c)),result:r['task-05']};
Object.assign(c,x.case);r['task-05-v3']=x.result;
window.OmniResults=Object.freeze({...o,render(c,r,target){if(c.key!=='task-05'||c.showHistoricalResults)return o.render(c,r,target);
target.innerHTML='<section><h2>Case26 v3 · 损伤对比与60分钟答题</h2><p id="case26-status"></p><p><a class="button" href="case26-v3-report/index.html" target="_blank">单独打开损伤对比与评测 ↗</a></p><iframe title="Case26 v3 无损参考与受损输入同步对比" src="case26-v3-report/index.html" style="display:block;width:100%;height:2100px;border:0;border-radius:12px" allow="fullscreen"></iframe></section><details class="result-details" id="case26-history"><summary>查看历史 v2 题面、答卷与旧评分</summary><p>旧版输入损伤较轻，时间预算不同，成绩未换算为v3。</p><pre id="case26-old-task" style="white-space:pre-wrap"></pre><div id="case26-old-result"></div></details>';
target.querySelector('#case26-status').textContent=x.status+'。'+x.explanation;
const h=target.querySelector('#case26-history');h.addEventListener('toggle',()=>{if(h.open&&!h.dataset.loaded){h.dataset.loaded='1';target.querySelector('#case26-old-task').textContent=window.CASE26_PREVIOUS.case.task;o.render({...window.CASE26_PREVIOUS.case,showHistoricalResults:true},window.CASE26_PREVIOUS.result,target.querySelector('#case26-old-result'));}});
}});})();'''.replace('PAYLOAD',js(payload))
    (OUT/'integration.js').write_text(overlay,encoding='utf-8')
    index=DIST/'index.html';s=index.read_text(encoding='utf-8')
    if 'case26-v3-report/integration.js' not in s:s=s.replace('<script defer src="app.js">','<script defer src="case26-v3-report/integration.js"></script>\n  <script defer src="app.js">')
    index.write_text(s,encoding='utf-8')
    print('Case26 v3 report updated:',status,flush=True)
if __name__=='__main__':build()
