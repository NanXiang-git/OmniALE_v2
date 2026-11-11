from pathlib import Path
import sys,json,copy,hashlib
R=Path(__file__).resolve().parents[2];sys.path.insert(0,str(R/'case_dashboard'))
from case26_final_scoring import score,rules
run=R/'runs_case26_v3_gpt61sol_high_60m/run_20261111'
old=json.loads((run/'evaluation/score.json').read_text(encoding='utf-8'));cfg=json.loads((R/'case26_v3/case_26/candidate/public_rules.json').read_text(encoding='utf-8'))
new=score(old,cfg);assert new['formal_total']==64.5244 and new['compliance']['coefficient']==1
assert new['metrics']==old['metrics'] and new['binding']==old['binding']
assert sum(rules(cfg)['automatic_weights'].values())==40
assert sum(x['weight'] for x in rules(cfg)['judge_items'])==60
partial=copy.deepcopy(old);partial['automatic_scores']['delivery']=2.5
assert score(partial,cfg)['formal_total']==round(new['quality_subtotal']*.5,4)
missing=copy.deepcopy(old);missing['automatic_scores']['repair_replay']=0
assert score(missing,cfg)['formal_total']==0
perfect=copy.deepcopy(old)
for k in perfect['automatic_scores']:perfect['automatic_scores'][k]=cfg['automatic_weights'][k]
for i in cfg['judge_items']:perfect['judge_scores'][i['id']]=i['weight']
assert score(perfect,cfg)['formal_total']==100 and score(perfect,cfg)['accepted']
perfect['hard_failures']=['preview_not_master'];assert not score(perfect,cfg)['accepted']
pending=copy.deepcopy(old);pending['formal_total']=None;assert score(pending,cfg)['formal_total'] is None
assert score(new,cfg)==new
manifest=json.loads((run/'sealed/case_26/freeze.json').read_text(encoding='utf-8'))['submission_manifest']
for item in manifest:
 p=run/'sealed/case_26/submission'/item['path']
 with p.open('rb') as f:assert hashlib.file_digest(f,'sha256').hexdigest()==item['sha256']
result={'passed':True,'formal_total':new['formal_total'],'raw_metrics_unchanged':True,'frozen_submission_hashes_verified':len(manifest),'weight_sum':100,'half_coefficient_scales_total':True,'zero_coefficient_zeroes_total':True,'hard_failure_blocks_perfect_quality':True,'pending_remains_pending':True}
(R/'case_dashboard/case26-final-scoring-qa.json').write_text(json.dumps(result,indent=2),encoding='utf-8');print(json.dumps(result))
