from pathlib import Path
import sys,json,math
ROOT=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(ROOT/'case46_eval_v1/browser_deps'))
from playwright.sync_api import sync_playwright
base=Path(sys.argv[1]) if len(sys.argv)>1 else ROOT/'case_dashboard/dist'
models=['gpt-6.1-sol','gpt-6-luna','gpt-6-astra'];expected=[63.4766,9.6468,45.4968]
for model,total in zip(models,expected):
 r=json.loads((base/'case13-v31-report'/model/'result.json').read_text(encoding='utf8'))
 g=r['groups'];actual=(g['E']['score']+g['T']['score'])*g['A']['score']/70*r['visual_coefficient']*100/30
 assert round(actual,4)==total==r['total_score']
 assert math.isclose(r['content_deduction']+r['audio_deduction']+r['visual_deduction'],100-actual)
 original=json.loads((ROOT/'case13_checklist_v3/review_v31/public'/model/'result.json').read_text(encoding='utf8'))
 assert original['gates']==r['gates'] and original['submission_manifest_sha256']==r['submission_manifest_sha256']
 for before,after in zip(original['checklist'],r['checklist']):
  assert all(before.get(k)==after.get(k) for k in ['id','answer','reason','votes','source_intervals','output_intervals'])
with sync_playwright() as p:
 b=p.chromium.launch(channel='msedge',headless=True,args=['--allow-file-access-from-files']);page=b.new_page(viewport={'width':1440,'height':1000});errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto((base/'index.html').as_uri()+'#task-13/results');page.wait_for_selector('#case13-current-report')
 assert page.evaluate("window.OMNIALE_RESULTS['task-13'].total")==expected[0]
 assert page.locator('#case13-history').count()==0
 page.goto((base/'case13-v31-report/index.html').as_uri());page.wait_for_selector('.score')
 assert page.locator('.score').all_text_contents()==[f'{x:.4f} / 100' for x in expected]
 for i in range(3):
  page.locator('#model').select_option(str(i));assert '(100 ÷ 30)' in page.locator('#calculation').inner_text()
 assert 'E（20 分）+ T（10 分）+ A（70 分）' not in page.locator('body').inner_text()
 out=ROOT/'case_dashboard/qa/case13-multiplicative.png';page.screenshot(path=str(out),full_page=False)
 assert not errors,errors;b.close()
print(json.dumps({'passed':True,'scores':expected,'checks':['formula','unchanged QA and gates','main dashboard','three model render','no historical UI','javascript']}))
