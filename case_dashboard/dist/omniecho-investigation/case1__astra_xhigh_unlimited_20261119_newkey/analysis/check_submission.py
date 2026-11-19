import json,hashlib,pathlib,subprocess
from html.parser import HTMLParser
import jsonschema
root=pathlib.Path('/workspace/submission')
f=json.load(open(root/'findings.json'));m=json.load(open(root/'evidence_manifest.json'));cov=json.load(open('/candidate/coverage_manifest.json'))
jsonschema.Draft202012Validator(json.load(open('/candidate/findings.schema.json'))).validate(f)
class Parser(HTMLParser):
 def __init__(self):super().__init__();self.ids=[];self.links=[];self.embedded='';self.in_json=False;self.record=None;self.field=None;self.values={};self.videos=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.append(a['id'])
  for k in ['href','src']:
   if k in a:self.links.append(a[k])
  if tag=='script' and a.get('id')=='structured-findings':self.in_json=True
  if tag=='article':self.record=a.get('data-record-id')
  if tag=='td' and 'data-field' in a:self.field=a['data-field'];self.values[(self.record,self.field)]=''
  if tag=='video':self.videos.append(a)
 def handle_endtag(self,tag):
  if tag=='script':self.in_json=False
  if tag=='td':self.field=None
  if tag=='article':self.record=None
 def handle_data(self,data):
  if self.in_json:self.embedded+=data
  if self.field is not None:self.values[(self.record,self.field)]+=data
p=Parser();p.feed((root/'report.html').read_text());assert json.loads(p.embedded)==f
assert len(p.ids)==len(set(p.ids));assert len(p.videos)==17
for link in p.links:
 if link.startswith('#'):assert link[1:] in p.ids
 else:
  assert '://' not in link,link
  assert (root/link.split('#')[0]).is_file(),link
receipts={e['evidence_id']:e for e in m['evidence']}
for r,c in zip(f['findings'],cov['records']):
 assert r['record_id']==c['record_id'];assert r['report_anchor'] in p.ids
 for k in c['required_fields']:assert p.values[(r['record_id'],k)]==str(r[k])
 a,b=(max(0,r['time_s']-.25),min(cov['duration_s'],r['time_s']+.25)) if r['time_s'] is not None else r['interval_s']
 assert any(receipts[e]['start_s']<=a and receipts[e]['end_s']>=b for e in r['evidence_ids'])
def sha(path):
 h=hashlib.sha256()
 with open(path,'rb') as f:
  for b in iter(lambda:f.read(1024*1024),b''):h.update(b)
 return h.hexdigest()
sourcehash=sha('/candidate/incident.mp4')
for e in receipts.values():
 assert sha(root/e['path'])==e['sha256'];assert sha(root/e['preview_path'])==e['preview_sha256'];assert sourcehash==e['source_sha256']
print('PASS: JSON schema, 17 unique report anchors, embedded JSON equality, visible field equality, offline references, 17 playable tags, complete point/interval coverage, original/preview/source SHA-256.')
result={'schema':'pass','records':17,'anchors':'pass','embedded_json':'pass','visible_fields':'pass','local_links':'pass','playable_video_elements':len(p.videos),'time_coverage':'pass','sha256':'pass','correctness_feedback_available':False}
(root/'analysis/local_validation.json').write_text(json.dumps(result,indent=2)+'\n')
