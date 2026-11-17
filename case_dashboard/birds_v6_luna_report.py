"""Export Luna evidence and add its result to the existing V6 task card."""
from pathlib import Path
import hashlib,json,re,shutil,sys
sys.stdout.reconfigure(encoding='utf8')
BASE=Path(__file__).resolve().parent;ROOT=BASE.parent
SOURCE=ROOT/'case_birds/omni_task_v6_luna';OUT=BASE/'dist/birds-v6-luna-report'
def read(p):return json.loads(p.read_text(encoding='utf8'))
def build():
    paths=set(read(SOURCE/'reports/dashboard_links.json'))|{'reports/index.html','reports/dashboard_links.json','reports/dashboard_qa.json','reports/SUMMARY.json','reports/SUMMARY.md','reports/final_acceptance.json','reports/comparability.json','reports/version_change.json','reports/voice_choices.json'}
    paths.update(p.relative_to(SOURCE).as_posix() for p in (SOURCE/'candidate').iterdir() if p.is_file())
    paths.update(p.relative_to(SOURCE).as_posix() for p in (SOURCE/'results').rglob('*') if p.is_file())
    manifest=[];secret=re.compile(r'(?:sk-[A-Za-z0-9_-]{24,}|gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|Bearer\s+[A-Za-z0-9._-]{24,})')
    for rel in sorted(paths):
        src=(SOURCE/rel).resolve();assert src.is_relative_to(SOURCE.resolve()) and src.is_file(),rel
        assert rel.startswith(('reports/','results/','candidate/','evaluator/')) or rel in ('candidate_package.zip','frozen_manifest.json'),rel
        if src.suffix in {'.json','.jsonl','.html','.md','.txt','.log','.srt','.js','.py'}:assert not secret.search(src.read_text(encoding='utf8')),f'Credential pattern: {rel}'
        dst=OUT/rel;dst.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(src,dst)
        manifest.append({'path':rel,'bytes':src.stat().st_size,'sha256':hashlib.sha256(src.read_bytes()).hexdigest()})
    (OUT/'publication-manifest.json').write_text(json.dumps({'files':manifest,'secret_scan':'passed','scope':'Public task, sealed Luna answers and linked audit evidence only.'},ensure_ascii=False,indent=2),encoding='utf8')
    sol=read(ROOT/'case_birds/omni_task_v6/reports/SUMMARY.json')['sol'];luna=read(SOURCE/'reports/SUMMARY.json')['luna']
    truth={x['segment']:x['latin'].strip().casefold() for x in read(SOURCE/'private_truth/truth.json')['segments']}
    answers=read(ROOT/'case_birds/omni_task_v6/results/sol/segments.json')['segments']
    sol['text_label_matches']=sum(x.get('scientific_name','').strip().casefold()==truth[x['segment']] for x in answers)
    comparison={'sol':sol,'luna':luna,'conditions':read(SOURCE/'reports/comparability.json')}
    (OUT/'comparison.json').write_text(json.dumps(comparison,ensure_ascii=False,indent=2),encoding='utf8')
    overlay=r'''(()=>{const data=PAYLOAD,d=window.OMNIALE_DATA,o=window.OmniResults,c=d?.cases.find(x=>x.key==='task-birds-v6');if(!c||!o)return;
c.title='鸟类科普 V6 · Sol / Luna 自主配音';c.versionLabel='V6 同源拦截 · 语音兼容修复 · 双模型';c.resultCount=2;c.resultSummary='Sol '+data.sol.score+' · Luna '+data.luna.score;c.summary='六段相同视频、题面、评分规则、提示词、通用环境与网络拦截；两组分别使用 Codex / high / 60分钟封顶，独立自主识别与配音。'+c.resultSummary;
const report='birds-v6-luna-report/reports/index.html',solReport='birds-v6-report/reports/index.html';
const fmt=(x,n=3)=>typeof x==='number'?x.toFixed(n):'待评';
function content(){return '<section class="note-card" data-v6-comparison><h2>V6 · Sol 与 Luna 相同配置实验</h2><p>相同题面、输入、评分器、提示词和代理。两组独立新目录，不共享历史答案；各自最多60分钟。Luna使用本轮用户提供的对应凭据，实际运行时间与服务延迟不同。</p><div style="overflow:auto"><table style="width:100%;text-align:left"><thead><tr><th>模型</th><th>得分</th><th>主体分 B</th><th>质量 Q</th><th>成片计分识别</th><th>文字标签正确</th><th>分钟</th></tr></thead><tbody>'+['sol','luna'].map(m=>'<tr><td>'+({sol:'GPT-6.1 Sol',luna:'GPT-6 Luna'}[m])+'</td><td>'+fmt(data[m].score)+'</td><td>'+fmt(data[m].body?.[0])+'</td><td>'+fmt(data[m].quality?.[0],6)+'</td><td>'+data[m].correct_chapters+'/6</td><td>'+data[m].text_label_matches+'/6</td><td>'+fmt(data[m].minutes,2)+'</td></tr>').join('')+'</tbody></table></div><p><a class="button primary" href="'+report+'">Luna 成片与完整证据 ↗</a> <a class="button" href="'+solReport+'">Sol 成片与完整证据 ↗</a> <a class="button" href="'+report+'#tools">Luna 工具调用 ↗</a> <a class="button" href="'+report+'#network">Luna 联网轨迹 ↗</a> <a class="button" href="birds-v6-luna-report/comparison.json">配置与结果 JSON ↗</a></p><p><strong>Luna：文字标签第6章正确（1/6），但成片六章均被评为无可懂中文旁白，触发原有归零规则，最终0分。不能解读为六段文字识别全错。</strong></p><p>V4同源素材暴露与V5兼容性受限的历史记录保留。未检出同源不等于排除所有未知派生素材；单轮差异不能独立归因于模型能力。</p></section>'}
window.OmniResults=Object.freeze({...o,overview(cases,records,target){o.overview(cases,records,target);target.insertAdjacentHTML('afterbegin',content())},render(x,r,target){if(x.key!==c.key)return o.render(x,r,target);target.innerHTML=content()+'<iframe title="V6 Luna 自主配音实验与证据" src="'+report+'" style="width:100%;height:1400px;border:0" allow="fullscreen"></iframe>'}});
})();'''.replace('PAYLOAD',json.dumps(comparison,ensure_ascii=False).replace('<','\u003c'))
    (OUT/'integration.js').write_bytes(overlay.encode('utf8'))
    index=BASE/'dist/index.html';text=index.read_bytes().decode('utf8')
    if 'birds-v6-luna-report/integration.js' not in text:text=text.replace('<script defer src="app.js">','<script defer src="birds-v6-luna-report/integration.js"></script>\n  <script defer src="app.js">')
    index.write_bytes(text.encode('utf8'));print('LUNA_EXPORTED',len(manifest),luna['score'])
if __name__=='__main__':build()
