"""Export a distinct unlimited/xhigh Luna run without replacing timed history."""
from pathlib import Path
import hashlib,json,re,shutil,sys
sys.stdout.reconfigure(encoding='utf8')
BASE=Path(__file__).resolve().parent;ROOT=BASE.parent
SOURCE=ROOT/'case_birds/omni_task_v6_luna_xhigh';OUT=BASE/'dist/birds-v6-luna-xhigh-report'
def read(p):return json.loads(p.read_text(encoding='utf8'))
def build():
    assert read(SOURCE/'reports/final_acceptance.json')['passed']
    paths=set(read(SOURCE/'reports/dashboard_links.json'))|{'reports/index.html','reports/dashboard_links.json','reports/dashboard_qa.json','reports/SUMMARY.json','reports/SUMMARY.md','reports/final_acceptance.json','reports/comparability.json','reports/version_change.json','reports/voice_choices.json','reports/delivery_explanation.json','reports/reference_inventory.json','reports/reference_inventory.html'}
    paths.update(p.relative_to(SOURCE).as_posix() for p in (SOURCE/'candidate').iterdir() if p.is_file())
    paths.update(p.relative_to(SOURCE).as_posix() for p in (SOURCE/'results').rglob('*') if p.is_file())
    manifest=[];secret=re.compile(r'(?:sk-[A-Za-z0-9_-]{24,}|gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|Bearer\s+[A-Za-z0-9._-]{24,})')
    for rel in sorted(paths):
        src=(SOURCE/rel).resolve();assert src.is_relative_to(SOURCE.resolve()) and src.is_file(),rel
        assert rel.startswith(('reports/','results/','candidate/','evaluator/')) or rel in ('candidate_package.zip','frozen_manifest.json'),rel
        if src.suffix in {'.json','.jsonl','.html','.md','.txt','.log','.srt','.js','.py'}:assert not secret.search(src.read_text(encoding='utf8')),f'Credential pattern: {rel}'
        dst=OUT/rel;dst.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(src,dst)
        manifest.append({'path':rel,'bytes':src.stat().st_size,'sha256':hashlib.sha256(src.read_bytes()).hexdigest()})
    (OUT/'publication-manifest.json').write_text(json.dumps({'files':manifest,'secret_scan':'passed','scope':'Public task, sealed xhigh/unlimited Luna answers and linked audit evidence only.'},ensure_ascii=False,indent=2),encoding='utf8')
    prior=read(BASE/'dist/birds-v6-luna-report/comparison.json')
    comparison={'sol':prior['sol'],'luna_xhigh':read(SOURCE/'reports/SUMMARY.json')['luna'],'conditions':read(SOURCE/'reports/comparability.json'),'explanation':read(SOURCE/'reports/delivery_explanation.json')['explanation']}
    (OUT/'comparison.json').write_text(json.dumps(comparison,ensure_ascii=False,indent=2),encoding='utf8')
    overlay=r'''(()=>{const data=PAYLOAD,d=window.OMNIALE_DATA,o=window.OmniResults,c=d?.cases.find(x=>x.key==='task-birds-v6');if(!c||!o)return;
c.title='鸟类科普 V6 · Sol / Luna · 含 xhigh 不限时';c.versionLabel='V6 同源拦截 · Luna xhigh 不限时';c.resultCount=2;c.resultSummary='Sol '+data.sol.score+' · Luna xhigh '+data.luna_xhigh.score;c.summary='六段同视频、同评分与联网拦截。新增 Luna xhigh 不限总时长实验；保留 Sol high / 60分钟记录。条件不同，不作同条件比较。'+c.resultSummary;
const report='birds-v6-luna-xhigh-report/reports/index.html';const fmt=(x,n=3)=>typeof x==='number'?x.toFixed(n):'待评';
const settings={sol:['GPT-6.1 Sol','high','60分钟','birds-v6-report'],luna_xhigh:['GPT-6 Luna（本轮）','xhigh','不设总时限','birds-v6-luna-xhigh-report']};
function content(){return '<section class="note-card" data-v6-xhigh-comparison><h2>V6 · 新增 Luna xhigh 不限时实验</h2><p><strong>本轮同时改变推理强度和总时限；不能把分差单独归因于其中一个因素，也不能当作同条件模型排名。</strong> 六段视频、评分器、通用环境与同源素材拦截沿用 V6；题面仅修改时间条款。</p><div style="overflow:auto"><table style="width:100%;text-align:left"><thead><tr><th>模型</th><th>推理强度</th><th>总时限</th><th>得分</th><th>主体 B</th><th>质量 Q</th><th>成片识别</th><th>文字标签</th><th>实际分钟</th></tr></thead><tbody>'+Object.keys(settings).map(m=>'<tr><td>'+settings[m][0]+'</td><td>'+settings[m][1]+'</td><td>'+settings[m][2]+'</td><td>'+fmt(data[m].score)+'</td><td>'+fmt(data[m].body?.[0])+'</td><td>'+fmt(data[m].quality?.[0],6)+'</td><td>'+data[m].correct_chapters+'/6</td><td>'+data[m].text_label_matches+'/6</td><td>'+fmt(data[m].minutes,2)+'</td></tr>').join('')+'</tbody></table></div><p>'+Object.keys(settings).map(m=>'<a class="button" href="'+settings[m][3]+'/reports/index.html">'+settings[m][0]+' · '+settings[m][1]+' 证据 ↗</a>').join(' ')+'</p><p><a class="button" href="'+report+'#task">本轮题目 ↗</a> <a class="button" href="'+report+'#method">分数构成 ↗</a> <a class="button" href="'+report+'#tools">工具调用 ↗</a> <a class="button" href="'+report+'#network">实际联网轨迹 ↗</a> <a class="button" href="birds-v6-luna-xhigh-report/reports/reference_inventory.html">资料访问核实 ↗</a> <a class="button" href="birds-v6-luna-xhigh-report/comparison.json">结果与配置 JSON ↗</a></p><p>'+data.explanation+'</p><p>未检出已知同源不等于排除所有未知派生素材。原始调用、错误与服务等待均保留；单次网络请求仍有连接及读空闲超时，未设置总作答截止时间。</p></section>'}
(window.OMNIALE_BIRDS_SECTIONS ||= {})['v6-luna-xhigh']={content,report};
window.OmniResults=Object.freeze({...o,render(x,r,target){if(x.key!==c.key)return o.render(x,r,target);target.innerHTML=content()+'<iframe title="V6 Luna xhigh 不限时实验与证据" src="'+report+'" style="width:100%;height:1400px;border:0" allow="fullscreen"></iframe>'}});
})();'''.replace('PAYLOAD',json.dumps(comparison,ensure_ascii=False).replace('<','\u003c'))
    (OUT/'integration.js').write_bytes(overlay.encode('utf8'))
    index=BASE/'dist/index.html';text=index.read_bytes().decode('utf8')
    if 'birds-v6-luna-xhigh-report/integration.js' not in text:text=text.replace('<script defer src="app.js">','<script defer src="birds-v6-luna-xhigh-report/integration.js"></script>\n  <script defer src="app.js">')
    index.write_bytes(text.encode('utf8'));print('LUNA_XHIGH_EXPORTED',len(manifest),comparison['luna_xhigh']['score'])
if __name__=='__main__':build()
