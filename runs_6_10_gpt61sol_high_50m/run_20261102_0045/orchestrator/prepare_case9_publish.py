"""Stage a bounded publication set; no commit or push is performed here."""
from pathlib import Path
import shutil,json,subprocess,re,hashlib
ROOT=Path(__file__).resolve().parents[1];BASE=ROOT.parents[1]
WORK=BASE/'github_publish/case9_qwen_update_20261105'
OUT=ROOT/'judge_supplements/case9_qwen38omni_20261105'
def copy(p):
 dest=WORK/p.relative_to(BASE);dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(p,dest)
def main():
 audit=json.loads((OUT/'integrity_audit.json').read_text(encoding='utf-8'));assert audit['passed']
 for name in ['score.json','review.json']+[f'reviewer_{i}.json' for i in range(1,audit['sessions']+1)]:copy(ROOT/'judge/case9'/name)
 for name in ['protocol.json','consensus.json','capability.json','capability_probe.json','critical_frames.json','integrity_audit.json','scheduling_resume.json']+[f'reviewer_{i}.json' for i in range(1,audit['sessions']+1)]:copy(OUT/name)
 for p in (OUT/'observations').rglob('*.json'):copy(p)
 for p in (OUT/'previous_gpt61_visual_only').glob('*.json'):copy(p)
 for name in ['qwen_case9_supplement.py','qwen_case9_critical.py','adopt_case9_qwen.py','prepare_case9_publish.py','report.py']:copy(ROOT/'orchestrator'/name)
 for name in ['RESULTS.md','results.json']:copy(ROOT/'reports'/name)
 copy(BASE/'case_dashboard/qa/verify_case9_qwen.cjs')
 manifest_path=WORK/'asset-manifest.json';manifest=json.loads(manifest_path.read_text(encoding='utf-8'))
 for row in manifest:
  if row.get('storage')=='repository' and '/judge/case9/' in row.get('path',''):
   p=WORK/row['path'];row['bytes']=p.stat().st_size;row['sha256']=hashlib.sha256(p.read_bytes()).hexdigest()
 manifest_path.write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
 roots=['case_dashboard/dist/results.js','case_dashboard/dist/case9-qwen-report','case_dashboard/qa/verify_case9_qwen.cjs',str(ROOT.relative_to(BASE)).replace('\\','/')+'/judge/case9',str(OUT.relative_to(BASE)).replace('\\','/'),str(ROOT.relative_to(BASE)).replace('\\','/')+'/orchestrator',str(ROOT.relative_to(BASE)).replace('\\','/')+'/reports']
 subprocess.run(['git','add','--','asset-manifest.json',*roots],cwd=WORK,check=True,capture_output=True)
 names=subprocess.run(['git','diff','--cached','--name-only','-z'],cwd=WORK,capture_output=True,check=True).stdout.decode().split('\0')
 for name in filter(None,names):
  p=WORK/name
  if p.suffix in ['.json','.js','.py','.cjs','.md','.html']:
   text=p.read_text(encoding='utf-8')
   assert not re.search(r'sk-[A-Za-z0-9]{20,}|gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}',text),'Credential-like content in '+name
 # Verify no other dashboard record changed relative to the base commit.
 before=subprocess.run(['git','show','HEAD:case_dashboard/dist/results.js'],cwd=WORK,capture_output=True,check=True).stdout.decode('utf-8')
 after=(WORK/'case_dashboard/dist/results.js').read_text(encoding='utf-8')
 def records(s):return json.loads(s.split('window.OMNIALE_RESULTS = ',1)[1].strip().removesuffix(';'))
 a,b=records(before),records(after)
 assert {k:v for k,v in a.items() if k!='task-09'}=={k:v for k,v in b.items() if k!='task-09'}
 for key in ['artifacts','seconds','timedOut','model','effort','harness','attempt','submission']:
  assert a['task-09'][key]==b['task-09'][key],key
 print(json.dumps({'staged_files':len(list(filter(None,names))),'other_dashboard_records_unchanged':True,'credential_scan_passed':True}))
if __name__=='__main__':main()
