"""Publish frozen Sol network-policy repeats into the unified bird dashboard."""
from pathlib import Path
import hashlib,html,json,re,shutil,sys
sys.stdout.reconfigure(encoding='utf8')
BASE=Path(__file__).resolve().parent;ROOT=BASE.parent;OUT=BASE/'dist/birds-v6-relaxed-report'
SOURCES=[ROOT/'case_birds/omni_task_v6_sol_high_relaxed',ROOT/'case_birds/omni_task_v6_sol_high_relaxed_repeat02']
E=lambda s:html.escape(str(s if s is not None else '待评'),quote=True)
def read(p):return json.loads(p.read_text(encoding='utf8'))
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def dump(p,v):p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(v,ensure_ascii=False,indent=2),encoding='utf8')
def copy(src,dst):
    if src.suffix.lower() in {'.json','.jsonl','.md','.srt','.txt','.py'}:
        assert not re.search(r'sk-[A-Za-z0-9_-]{24,}|gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|Bearer\s+[A-Za-z0-9._-]{24,}',src.read_text(encoding='utf8')),str(src)
    dst.parent.mkdir(parents=True,exist_ok=True)
    if not dst.exists() or sha(src)!=sha(dst):shutil.copy2(src,dst)
    assert sha(src)==sha(dst)
def table(headers,rows):return '<div class="scroll"><table><thead><tr>'+''.join('<th>'+E(x)+'</th>' for x in headers)+'</tr></thead><tbody>'+''.join('<tr>'+''.join('<td>'+str(x)+'</td>' for x in row)+'</tr>' for row in rows)+'</tbody></table></div>'
def page(title,body):return '<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+E(title)+'</title><link rel="stylesheet" href="../style.css"><main>'+body+'</main><script src="../report.js"></script></html>'
STYLE='''*{box-sizing:border-box}body{margin:0;background:#f4f6f8;color:#182536;font:16px/1.65 system-ui,sans-serif}main{max-width:1200px;margin:auto;padding:32px 20px}h1{font-size:30px}h2{margin-top:36px}a{color:#145d8b}nav,.links{display:flex;flex-wrap:wrap;gap:16px}.card,details{background:white;border:1px solid #dce3e9;border-radius:12px;padding:18px;margin:16px 0}.scroll{overflow:auto}table{width:100%;border-collapse:collapse;font-size:14px}th,td{text-align:left;vertical-align:top;padding:12px;border-bottom:1px solid #dce3e9}th{white-space:nowrap;background:#edf2f6}video{width:100%;max-height:520px;background:#111}audio{width:100%}pre{white-space:pre-wrap;overflow-wrap:anywhere;font-size:13px}summary{cursor:pointer;font-weight:650}.muted{color:#536675}button{padding:6px 10px;cursor:pointer}.score{font-size:34px;font-weight:750;color:#165c66}.good{color:#17633d}.bad{color:#a13a32}td a{overflow-wrap:anywhere} @media(max-width:600px){main{padding:18px 12px}h1{font-size:24px}th,td{padding:8px}}'''
def build():
    OUT.mkdir(parents=True,exist_ok=True)
    (OUT/'style.css').write_text(STYLE,encoding='utf8')
    js="document.addEventListener('click',e=>{const b=e.target.closest('[data-seek]');if(!b)return;const v=document.querySelector('video');v.currentTime=Number(b.dataset.seek);v.play().catch(()=>{});v.scrollIntoView({block:'center',behavior:'smooth'})});"
    (OUT/'report.js').write_text(js,encoding='utf8')
    base=read(ROOT/'case_birds/omni_task_v6/reports/SUMMARY.json')['sol']
    truth=read(SOURCES[0]/'private_truth/truth.json')['segments'];attempts=[]
    for n,src in enumerate(SOURCES,1):
        frozen=read(src/'frozen_manifest.json')
        assert all(sha(src/x['path'])==x['sha256'] for x in frozen['files'])
        result=read(src/'reports/sol/reviewed_result.json');summary=read(src/'reports/SUMMARY.json')['relaxed'];assert summary['score']==result['final_score']
        dest=OUT/f'attempt-{n:02d}'
        paths=['candidate/TASK.md','candidate/chapters.json','evaluator/rubric.json','reports/SUMMARY.json','reports/SUMMARY.md','reports/original_blacklist_accesses.json','reports/sol/reviewed_result.json','reports/sol/tool_trajectory.json','reports/sol/network_trajectory.json','reports/sol/audit.json','reports/sol/technical.json','results/sol/final.mp4','results/sol/narration.wav','results/sol/subtitles.srt','results/sol/segments.json','results/sol/research_log.json']
        if n==2:paths+=['reports/scoring_recovery.json','reports/REPEAT_COMPARISON.json','reports/REPEAT_COMPARISON.md']
        sealed=read(src/'runs/sol/sealed/birds/freeze.json')['submission_manifest']
        for x in sealed:
            if x.get('sha256'):assert sha(src/'results/sol'/x['path'])==x['sha256']
        for rel in paths:copy(src/rel,dest/rel)
        (dest/'style.css').write_text(STYLE,encoding='utf8');(dest/'report.js').write_text(js,encoding='utf8')
        answer=read(src/'results/sol/segments.json')['segments'];network=read(src/'reports/original_blacklist_accesses.json')
        title=f'V6 Sol high · 放宽网站限制 · 第 {n} 次'
        body=f'<p><a href="../../reports/index.html">← 三轮对照</a> · <a href="../../../index.html#task-birds/results/v6-relaxed">返回总看板</a></p><h1>{title}</h1><nav><a href="#film">成片</a><a href="#scores">扣分明细</a><a href="#network">联网轨迹</a><a href="#tools">运行轨迹</a><a href="#task">本轮题面</a></nav><section class="card"><div class="score">{summary["score"]:.4f} / 100</div><p>识别 {summary["correct_chapters"]}/6 · 实际 {summary["minutes"]:.2f} 分钟 · 不限总时长 · 全部硬性交付要求通过 · 总分不足 80，未通过。</p><p>B = {summary["body"][0]:.4f}；Q = {summary["quality"][0]:.6f}；S = B × Q。</p></section>'
        if n==2:body+='<p class="card">本轮 31.63 分钟交卷。评分阶段曾发生 DNS 故障及补评脚本异常；已对同一封存答卷续评，保留原始失败记录。答卷、评分规则及已完成判项未修改。<a href="scoring_recovery.json">恢复记录</a></p>'
        body+='<h2 id="film">成片与交付</h2><video controls playsinline preload="none" src="../results/sol/final.mp4"></video><p class="links"><a href="../results/sol/final.mp4">下载原始成片</a><a href="../results/sol/narration.wav">独立旁白 WAV</a><a href="../results/sol/subtitles.srt">字幕</a><a href="../results/sol/segments.json">物种与证据 JSON</a></p>'
        body+='<h2 id="scores">逐章识别与扣分依据</h2><p>六章等权；物种必须在实际旁白中说对。说错物种，该章内容分为 0；下列评语来自冻结评分器的实际音视频评审。</p>'
        rows=[]
        for t,a,row,j in zip(truth,answer,result['rows'],result['judgments']):
            rows.append([f'<button data-seek="{t["start"]}">第 {t["segment"]} 章 ▶</button>',E(t['zh']),E(a['chinese_name']),('✓ 正确' if row['I']==1 else '✗ 错误'),f'{row["body_interval"][0]:.4f} / 16.6667',E(row.get('I_reason'))])
        body+=table(['章节','正确物种','模型答案','判定','内容分','识别判据'],rows)
        body+='<h2>声音、原声与交付质量</h2><p>Q = 0.70H + 0.20A + 0.10D。H：自然韵律 35%、音色 25%、清晰度 25%、语速停顿 15%；A：原声保留 40%、平衡 40%、原声窗口 20%；D：画面完整 40%、字幕 30%、解说时机 20%、有效交付 10%。F/E 即使有分，识别错误章仍不获得内容分。</p>'
        for row,j in zip(result['rows'],result['judgments']):
            body+=f'<details><summary>第 {row["segment"]} 章 · H {row["groups"]["H"][0]:.3f} / A {row["groups"]["A"][0]:.3f} / D {row["groups"]["D"][0]:.3f} · 查看全部分项与扣分</summary>'
            parts=[]
            names={'F':'事实准确性','E':'视听证据对应','naturalness':'自然韵律','timbre':'音色舒适','clarity':'发音清晰','pacing':'语速停顿','balance':'混音平衡','preservation':'原声保留','subtitles':'字幕','timing':'解说时机'}
            for group,keys in [('body',['F','E']),('quality',['naturalness','timbre','clarity','pacing','preservation','balance']),('visual',['subtitles','timing'])]:
                for key in keys:
                    v=j.get(group,{}).get(key,{})
                    parts.append([names[key],E(v.get('score')),E(v.get('reason')),E(v.get('times',[]))])
            body+=table(['指标','得分（0–1）','评审依据 / 扣分原因','章内秒数'],parts)+'</details>'
        body+='<p><a href="sol/reviewed_result.json">完整评分 JSON</a> · <a href="sol/technical.json">硬性要求与技术检查</a></p><h2 id="network">原黑名单网站的实际访问</h2>'
        body+=table(['域名','请求','成功响应','重定向','HTTP错误','素材拦截','其他失败'],[[E(d)]+[str(c.get(k,0)) for k in ['attempt','successful_response','redirect','http_error','blocked_source','blocked_or_failed']] for d,c in network['domains'].items()])
        body+='<p>成功响应表示网关批准交付 2xx，不单独证明模型完整阅读或用于推理。YouTube 未记录访问。Wikipedia 已从整站黑名单移除，但两轮均未获得正文：第一轮上游连接超时；第二轮解析结果含非公网地址。网关统一返回 403，不能据此认定命中了素材黑名单。</p>'
        body+=table(['结果','网址 / 主机','HTTP','原因'],[[E(e['category']),E(e.get('url',e.get('host'))),E(e.get('status','—')),E(e.get('error') or e.get('reason') or '—')] for e in network['records'] if e['category']!='attempt'])
        body+='<p class="links"><a href="original_blacklist_accesses.json">原黑名单访问记录</a><a href="sol/network_trajectory.json">完整网络轨迹</a><a href="../results/sol/research_log.json">模型研究日志</a></p><h2 id="tools">运行轨迹</h2>'
        tools=read(src/'reports/sol/tool_trajectory.json')
        for t in tools:
            if t.get('type') not in ['command_execution','agent_message']:continue
            body+='<details><summary>'+E(str(t.get('sequence',''))+' · '+t.get('type','')+' · '+t.get('status',''))+'</summary><pre>'+E(t.get('command') or t.get('text',''))+'</pre><pre>'+E(t.get('aggregated_output',''))+'</pre></details>'
        body+='<p><a href="sol/tool_trajectory.json">完整工具轨迹 JSON</a></p><h2 id="task">本轮题面</h2><p><a href="../candidate/TASK.md">下载原题面</a> · <a href="../evaluator/rubric.json">冻结评分规则</a></p><details><summary>展开完整题面</summary><pre>'+E((src/'candidate/TASK.md').read_text(encoding='utf8'))+'</pre></details>'
        (dest/'reports/index.html').write_text(page(title,body),encoding='utf8')
        attempts.append({'id':f'sol_relaxed_{n}','folder':f'birds-v6-relaxed-report/attempt-{n:02d}','label':f'Sol · high · 放宽限制第 {n} 次 · 不限时',**summary})
    payload={'baseline':base,'attempts':attempts,'truth':[x['zh'] for x in truth]}
    dump(OUT/'comparison.json',payload)
    rows=[[label,f'{v["score"]:.4f}',f'{v["body"][0]:.4f}',f'{v["quality"][0]:.6f}',f'{v["correct_chapters"]}/6',f'{v["minutes"]:.2f}',limit] for label,v,limit in [('原 V6',base,'60 分钟'),('放宽第 1 次',attempts[0],'不限时'),('放宽第 2 次',attempts[1],'不限时')]]
    overview='<h2>Sol high · 网站限制三轮对照</h2>'+table(['实验','总分','内容 B','质量 Q','识别','分钟','时限'],rows)+'<p>两次放宽实验平均 26.4229 分，均仅认对两种信天翁。原基线多认对第 3 章；重复第 2 次比第 1 次高 1.1236 分，来自成品质量改善，识别数未提高。三轮硬性交付要求全部通过。</p><p>后两轮题面、视频、评分器、模型、推理强度和网络规则相同；原基线总时限不同。Wikipedia 实际不可用，YouTube 未被访问。样本量有限，不能把分差归因于放宽网站限制。</p>'
    for n,a in enumerate(attempts,1):overview+=f'<p><a href="../attempt-{n:02d}/reports/index.html">第 {n} 次：成片、扣分依据、网站访问与工具轨迹 ↗</a></p>'
    overview+='<p>已放开 YouTube、Macaulay Library、Cornell/eBird、Wikipedia/Wikidata 和 FWS 等独立资料；保留 Wikimedia 原数据集、镜像、原素材 ID、同源音频及历史答卷限制。</p>'
    (OUT/'reports').mkdir(exist_ok=True);(OUT/'reports/index.html').write_text(page('V6 Sol · 三轮网站限制对照','<p><a href="../../index.html#task-birds/results/v6-relaxed">← 返回看板</a></p><h1>鸟类科普 V6 · Sol 重复实验</h1>'+overview),encoding='utf8')
    # Loaded after birds-case/data.js and before unified case registration.
    overlay="""(()=>{const p=PAYLOAD,d=window.OMNIALE_BIRDS_CASE,s=window.OMNIALE_BIRDS_SECTIONS;if(!d||!s)return;d.relaxedAttempts=p.attempts;for(const a of p.attempts)d.comparison[a.id]=a;const report='birds-v6-relaxed-report/reports/index.html';const markup=MARKUP;s['v6-relaxed']={report,content:()=>'<section class="note-card" data-v6-relaxed-comparison>'+markup+'</section>'};const old=s['v6-all'];if(old)s['v6-all']={...old,content:()=>old.content()+s['v6-relaxed'].content()};})();"""
    markup=overview.replace('../attempt-','birds-v6-relaxed-report/attempt-')
    (OUT/'integration.js').write_text(overlay.replace('PAYLOAD',json.dumps(payload,ensure_ascii=False).replace('<','\\u003c')).replace('MARKUP',json.dumps(markup,ensure_ascii=False).replace('<','\\u003c')),encoding='utf8')
    index=BASE/'dist/index.html';s=index.read_text(encoding='utf8')
    if 'birds-v6-relaxed-report/integration.js' not in s:s=s.replace('<script defer src="birds-case/integration.js">','<script defer src="birds-v6-relaxed-report/integration.js"></script>\n  <script defer src="birds-case/integration.js">')
    index.write_text(s,encoding='utf8')
    files=[{'path':p.relative_to(OUT).as_posix(),'bytes':p.stat().st_size,'sha256':sha(p)} for p in sorted(OUT.rglob('*')) if p.is_file() and p.name!='publication-manifest.json']
    dump(OUT/'publication-manifest.json',{'files':files,'scope':'Frozen answers, scores and audited trajectories of two independent Sol high repeats; no credentials or private infrastructure.','secret_scan':'passed'})
    print('EXPORTED',len(files),[a['score'] for a in attempts])
if __name__=='__main__':build()
