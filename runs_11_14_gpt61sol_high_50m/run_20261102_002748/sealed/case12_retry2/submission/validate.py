#!/usr/bin/env python3
"""Validate delivered files, including actual ASS/SRT time semantics."""
import argparse,collections,json,pathlib,re,subprocess,hashlib
R=pathlib.Path(__file__).resolve().parent

def tokens(s):
 return [re.sub(r"[^a-z0-9']",'',w.lower()) for w in s.split() if re.sub(r"[^a-z0-9']",'',w.lower())]
def seconds(s):
 h,m,x=s.replace(',','.').split(':');return round((3600*int(h)+60*int(m)+float(x))*100)
def main():
 p=argparse.ArgumentParser();p.add_argument('--input',required=True);p.add_argument('--media',action='store_true');a=p.parse_args();inp=pathlib.Path(a.input)
 if not (inp/'transcript.txt').exists():inp=inp/'input'
 report={};events=[]
 for line in (R/'interview.ass').read_text(encoding='utf-8-sig').splitlines():
  if not line.startswith('Dialogue:'):continue
  f=line.split(',',9);s=f[4];body=re.sub(r'\{[^}]*\}','',f[9]);ls=body.split('\\N')
  assert s in 'ABCD' and f[3]==s
  assert all(z.startswith(s+': ') for z in ls)
  assert len(ls)<=2 and all(len(z)<=42 for z in ls),(s,ls)
  st,en=seconds(f[1]),seconds(f[2]);assert 0<=st<en<=25948
  assert not any(st<q<en for q in [9352,17076])
  events.append(dict(id=str(len(events)+1),s=s,a=st,b=en,lines=ls))
 for s in 'ABCD':
  ee=sorted([e for e in events if e['s']==s],key=lambda e:e['a'])
  assert all(x['b']<=y['a'] for x,y in zip(ee,ee[1:])),s
 cues=[];ids=set()
 for block in re.split(r'\n\s*\n',(R/'interview.srt').read_text(encoding='utf-8-sig').strip()):
  ls=block.splitlines();uid=ls[0];assert uid not in ids;ids.add(uid)
  aa,bb=ls[1].split(' --> ');st,en=seconds(aa),seconds(bb);assert st<en
  assert all(re.match('[ABCD]: ',t) and len(t)<=42 for t in ls[2:])
  cues.append(dict(id=uid,a=st,b=en,lines=ls[2:]))
 assert all(x['b']<=y['a'] for x,y in zip(cues,cues[1:]))
 bounds=sorted({e[k] for e in events+cues for k in ['a','b']})
 for aa,bb in zip(bounds,bounds[1:]):
  t=(aa+bb)/2
  aa_text=sorted(line for e in events if e['a']<=t<e['b'] for line in e['lines'])
  ss_text=sorted(line for e in cues if e['a']<=t<e['b'] for line in e['lines'])
  assert aa_text==ss_text,(aa,bb,aa_text,ss_text)
 # Count each actual ASS event once; SRT continuations are not new dialogue.
 supplied=[line.split(' ',1) for line in (inp/'transcript.txt').read_text().splitlines()]
 expected=collections.Counter(w for _,tx in supplied for w in tokens(tx))
 actual=collections.Counter(w for e in events for line in e['lines'] for w in tokens(line[3:]))
 assert expected==actual,{'missing':expected-actual,'extra':actual-expected}
 mapping=json.loads((R/'alignment.json').read_text())['events'];covered=set();by_ass={e['id']:e for e in events};by_srt={e['id']:e for e in cues}
 assert len(mapping)==len(events)
 for m in mapping:
  assert isinstance(m['start'],(int,float)) and isinstance(m['end'],(int,float))
  covered.update(m['utterance_ids']);assert m['speaker_id'] in 'ABCD'
  for i in m['ass_event_ids']:
   e=by_ass[i];assert e['s']==m['speaker_id'] and e['a']==round(m['start']*100) and e['b']==round(m['end']*100)
  allc=[by_srt[i] for i in m['srt_cue_ids']]
  assert allc and min(c['a'] for c in allc)==e['a'] and max(c['b'] for c in allc)==e['b']
  assert all(e['a']<=c['a']<c['b']<=e['b'] for c in allc)
  assert all(all(z in c['lines'] for z in e['lines']) for c in allc)
 assert covered=={uid for uid,_ in supplied}
 # Every ASS boundary is an explicit SRT boundary, including repeated identical
 # utterances. No coalescing of adjacent identical responses is permitted.
 sr_bounds={c[k] for c in cues for k in ['a','b']}
 assert all(e[k] in sr_bounds for e in events for k in ['a','b'])
 fast=[]
 for e in events:
  cps=sum(map(len,e['lines']))/((e['b']-e['a'])/100)
  if cps>24.01:fast.append(dict(id=e['id'],speaker=e['s'],cps=round(cps,2)))
 report.update(ass_events=len(events),srt_cues=len(cues),covered_source_groups=len(covered),public_transcript_tokens=sum(expected.values()),text_multiset_exact=True,ass_srt_equivalent=True,mapping_valid=True,short_repetitions_preserve_boundaries=True,max_line_length=max(len(l) for e in events for l in e['lines']),cps_including_labels_over_24=fast)
 if a.media:
  def probe(path):return json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(path)]))
  src=inp/'source.mp4';q=probe(src);v=probe(R/'preview.mp4')
  for key in ['width','height','avg_frame_rate','nb_frames']:assert q['streams'][0][key]==v['streams'][0][key],key
  assert q['format']['duration']==v['format']['duration']
  assert v['streams'][1]['sample_rate']=='48000'
  def audio_hash(path):return subprocess.check_output(['ffmpeg','-v','error','-i',str(path),'-map','0:a:0','-c:a','pcm_s32le','-f','hash','-hash','sha256','-']).decode().strip()
  ha,hb=audio_hash(src),audio_hash(R/'preview.mp4');assert ha==hb
  def top_hash(path):
   data=subprocess.check_output(['ffmpeg','-v','error','-threads','2','-i',str(path),'-an','-vf','crop=704:392:0:0','-c:v','rawvideo','-threads','2','-f','framemd5','-']).decode()
   return [l for l in data.splitlines() if not l.startswith('#')]
  first,second=top_hash(src),top_hash(R/'preview.mp4');assert first==second
  report['media']={'duration':float(v['format']['duration']),'dimensions':[704,576],'fps':25,'frames':int(v['streams'][0]['nb_frames']),'audio_sample_rate':48000,'decoded_audio_sha256':ha,'decoded_audio_identical':True,'all_top_392_rows_identical':True,'top_frames_compared':len(first)}
 (R/'validation_report.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
if __name__=='__main__':main()
