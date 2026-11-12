"""Final approved weights; recompute from immutable public adjudications, never rejudge."""
from pathlib import Path
import json,copy,shutil,hashlib,re
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'case13_checklist_v3/review_v31/public'
OUT=ROOT/'case_dashboard/dist/case13-v31-report'
MODELS=['gpt-6.1-sol','gpt-6-luna','gpt-6-astra']
A={'A_identity':25,'A_stable':15,'A_prosody':15,'A_content':10,'A_quality':5}
def write(p,x):
 p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(x,ensure_ascii=False,indent=2),encoding='utf-8')
def transform(original):
 r=copy.deepcopy(original);r['version']='final-content-times-audio';r['formula']='(E20 + T10) * (A70 / 70) * V_coefficient * (100 / 30)'
 for key,s in r['subcriteria'].items():
  before=original['subcriteria'][key];group=key[0]
  maximum=A[key] if group=='A' else before['maximum']/original['groups'][group]['maximum']*({'E':20,'T':10,'V':1}[group])
  factor=maximum/before['maximum']
  for field in ['score','lower','upper']:s[field]=before[field]*factor if before.get(field) is not None else None
  s['maximum']=maximum;s['unit']='coefficient' if group=='V' else 'points'
  for row in r['checklist']:
   if row['subcriterion']==key:
    for field in ['maximum','earned','lost']:
     if row.get(field) is not None:row[field]*=factor
    row['unit']=s['unit']
 r['groups']={g:{'maximum':maximum,'score':sum(s['score'] for k,s in r['subcriteria'].items() if k.startswith(g+'_'))} for g,maximum in [('E',20),('T',10),('A',70)]}
 coefficient=sum(s['score'] for k,s in r['subcriteria'].items() if k.startswith('V_'))
 content=r['groups']['E']['score']+r['groups']['T']['score'];audio=r['groups']['A']['score']/70
 core=content*(100/30)*audio;r['content_score']=content;r['content_percent']=content*(100/30);r['audio_coefficient']=audio;r['audio_deduction']=r['content_percent']*(1-audio);r['content_deduction']=100-r['content_percent'];r['core_score']=core;r['visual_coefficient']=coefficient
 r['visual_deduction']=core*(1-coefficient);r['core_deduction']=100-core
 r['total_score']=round(core*coefficient,4);r['score_lower_bound']=r['total_score'];r['score_upper_bound']=r['total_score']
 r['passed']=core*coefficient>=80 and all(g['pass'] is True for g in r['gates'].values());r['status']='score_complete_not_passed' if not r['passed'] else 'passed'
 for key in ['majority_3','invalid_original_response_zero','invalid_new_response_zero']:
  rows=[x for x in r['checklist'] if x.get('adjudication')==key]
  r['adjudication_summary'][key+'_lost_points']=sum(x['lost'] for x in rows if x['unit']=='points')
  r['adjudication_summary'][key+'_lost_coefficient']=sum(x['lost'] for x in rows if x['unit']=='coefficient')
 r['weight_policy']={'E':20,'T':10,'A':A,'V':{'V_frames':.6,'V_timeline':.2,'V_display':.2},'pass_score':80,'gate_policy':'All existing gates retained. Failed or pending gates do not pass.','formula':r['formula'],'scope':'Frozen submissions, subcriterion scores, QA answers, reasons and votes unchanged. Content is multiplied by audio and visual coefficients, normalized to 100.'}
 r['adjudication_policy']['scope']='QA verdicts retained; final scoring weights defined in rules.json.'
 return r

def main():
 OUT.mkdir(exist_ok=True);results=[]
 for model in MODELS:
  original=json.loads((SOURCE/model/'result.json').read_text(encoding='utf-8'));r=transform(original)
  for x,y in zip(original['checklist'],r['checklist']):
   assert all(x.get(k)==y.get(k) for k in ['id','answer','reason','votes','original_votes','source_intervals','output_intervals'])
  assert original['gates']==r['gates'] and original['submission_manifest_sha256']==r['submission_manifest_sha256']
  write(OUT/model/'result.json',r);results.append(r)
 (OUT/'data.js').write_text('window.CASE13_V3='+json.dumps(results,ensure_ascii=False).replace('</','<\\/')+';',encoding='utf-8')
 summary=[{k:r[k] for k in ['model','total_score','content_score','content_percent','audio_coefficient','core_score','visual_coefficient','status','elapsed_seconds','pending_count']} for r in results]
 (OUT/'summary.js').write_text('window.CASE13_SUMMARY='+json.dumps(summary,ensure_ascii=False)+';',encoding='utf-8')
 rules=json.loads((SOURCE/'rules.json').read_text(encoding='utf-8'));rules.update(version='final-content-times-audio',score_formula='(E20 + T10) * (A70 / 70) * (0.6*V_frames_rate + 0.2*V_timeline_rate + 0.2*V_display_rate) * (100 / 30)',groups={'E':20,'T':10,'A':70},visual_coefficient={'V_frames':.6,'V_timeline':.2,'V_display':.2},reweighting_policy=results[0]['weight_policy'])
 for key,s in rules['subcriteria'].items():
  s['maximum']=results[0]['subcriteria'][key]['maximum'];s['unit']=results[0]['subcriteria'][key]['unit'];s['within_group_weight']=s['maximum']/({'E':20,'T':10,'A':70,'V':1}[s['group']])
 write(OUT/'rules.json',rules)
 policy=json.loads((SOURCE/'adjudication-policy.json').read_text());policy['scope']='QA verdicts and solver submissions retained. Scoring uses final multiplicative rules.json.';write(OUT/'adjudication-policy.json',policy)
 shutil.copy2(Path(__file__).with_name('case13_final_report.html'),OUT/'index.html')
 # Task text and frozen materials are kept byte-identical; the current score has a dedicated specification.
 assert (OUT/'TASK.md').read_bytes()==(SOURCE/'TASK.md').read_bytes()
 overlay='''(()=>{const previous=window.OmniResults;if(!previous)return;const scores=window.CASE13_SUMMARY;
const c=window.OMNIALE_DATA.cases.find(x=>x.key==='task-13'),r=window.OMNIALE_RESULTS['task-13'];
if(c){c.versionLabel='最终评分 · 配音听感优先';c.resultKey='task-13';}
if(r){const s=scores.find(x=>x.model==='gpt-6.1-sol');Object.assign(r,{model:s.model,total:s.total_score,verified:s.total_score,accepted:false,gradeStatus:'complete',scoringMode:'visual_times_delivery',coreScore:s.core_score,deliveryCoefficient:s.visual_coefficient,rows:[{points:s.total_score,maximum:100}],comparisons:[],failedGates:['现有硬门槛未全部通过']});}
window.OmniResults=Object.freeze({...previous,overview(cases,records,target){previous.overview(cases,records,target);const row=target.querySelector('a[href="#task-13/results"]')?.closest('tr');if(row){const cell=row.querySelector('td[colspan="2"]');if(cell)cell.innerHTML=cell.innerHTML.replace('视觉理解','内容百分制 × 配音系数').replace('有效交付系数','画面一致性系数');}},render(c,r,target){if(c.key!=='task-13')return previous.render(c,r,target);target.innerHTML='<section class="case13-current-results"><h2>CASE 40 · 最终评分与模型答卷</h2><p>最终分 = (E + T) × (A ÷ 70) × C × (100 ÷ 30)。分数构成、完整 QA 与原有硬门槛见下方。</p><a href="case13-v31-report/index.html?v=content-audio-20261112" target="_blank">单独打开完整结果 ↗</a><iframe id="case13-current-report" title="CASE 40 最终评分算法与三模型答卷" src="case13-v31-report/index.html?embedded=1&v=content-audio-20261112" style="width:100%;height:2400px;border:0" allow="fullscreen"></iframe></section>';}});
})();'''
 (OUT/'final-integration.js').write_text(overlay,encoding='utf-8')
 index=OUT.parent/'index.html';s=index.read_text(encoding='utf-8')
 if 'case13-v31-report/final-integration.js' not in s:s=s.replace('<script defer src="app.js">','<script defer src="case13-v31-report/final-integration.js"></script>\n  <script defer src="app.js">')
 for name in ['summary.js','final-integration.js']:
  s=re.sub(r'src="case13-v31-report/'+re.escape(name)+r'(?:\?[^"]*)?"','src="case13-v31-report/'+name+'?v=content-audio-20261112"',s)
 index.write_text(s,encoding='utf-8')
 print(json.dumps(summary,ensure_ascii=False))
if __name__=='__main__':main()
