#!/usr/bin/env python3
"""Create a sample-aligned narration track, source-preserving ducked mix, and word-timed subtitles.
No source audio is moved, duplicated, denoised, or replaced. No tempo filters are used.
"""
import json,re,subprocess,pathlib,math
import numpy as np
from scipy.io import wavfile
ROOT=pathlib.Path('/workspace');SCR=ROOT/'scratch';OUT=ROOT/'submission';SR=48000
chap=json.load(open('/candidate/chapters.json'));D=185.5;N=round(D*SR)  # 30 fps final timeline; supplied chapters end at 185.466667 s
plan=json.load(open(SCR/'narration_generated.json'))
voice=np.zeros(N,dtype=np.float32);occupied=[]
for v in plan:
 data=subprocess.check_output(['ffmpeg','-v','error','-i',v['file'],'-f','f32le','-ar',str(SR),'-ac','1','-'])
 y=np.frombuffer(data,dtype='<f4').copy();a=round(v['start']*SR);b=a+len(y)
 assert b<=N,(v,b,N)
 for c,d in occupied:assert b<=c or a>=d
 fade=min(480,len(y)//4);y[:fade]*=np.linspace(0,1,fade);y[-fade:]*=np.linspace(1,0,fade)
 voice[a:b]=y;v['end']=b/SR;v['duration_decoded']=len(y)/SR;occupied.append((a,b))
wavfile.write(SCR/'narration_float.wav',SR,voice)
proc=subprocess.run(['ffmpeg','-hide_banner','-i',str(SCR/'narration_float.wav'),'-af','loudnorm=I=-19.5:TP=-3:LRA=11:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
stats=json.loads(re.search(r'\{\s*"input_i".*?\}',proc.stderr,re.S).group())
gain=10**((-19.5-float(stats['input_i']))/20)
gain=min(gain,10**(-3/20)/max(np.max(np.abs(voice)),1e-8));voice*=gain
wavfile.write(OUT/'narration.wav',SR,np.rint(np.clip(voice,-1,1)*32767).astype(np.int16))
sr,orig=wavfile.read(SCR/'original.wav');assert sr==SR
orig=orig[:N].astype(np.float32)/32768
base_db=[-5,6,-1,18,16,1];duck_db=[-10,-8,-10,-9,-7,-9]
gains=np.ones(N,dtype=np.float32)
for s,base,duck in zip(chap['segments'],base_db,duck_db):
 a=round(s['start']*SR);b=min(N,round(s['end']*SR));env=np.ones(b-a,dtype=np.float32)
 for v in plan:
  if v['segment']!=s['segment']:continue
  x=round(v['start']*SR);y=round(v['end']*SR);lo=max(a,x-round(.16*SR));hi=min(b,y+round(.35*SR))
  t=np.arange(lo,hi)/SR
  db=np.where(t<v['start'],np.clip((t-(v['start']-.16))/.16,0,1),np.where(t<=v['end'],1,np.clip(1-(t-v['end'])/.35,0,1)))*duck
  env[lo-a:hi-a]=np.minimum(env[lo-a:hi-a],10**(db/20))
 gains[a:b]=10**(base/20)*env
mix=orig*gains[:,None]+voice[:,None]
wavfile.write(SCR/'mix_float.wav',SR,mix.astype(np.float32))
# Word metadata aligns subtitle phrase changes to synthesized speech.
def clock(t):
 ms=round(t*1000);h,ms=divmod(ms,3600000);m,ms=divmod(ms,60000);s,ms=divmod(ms,1000);return f'{h:02}:{m:02}:{s:02},{ms:03}'
subs=[]
for v in plan:
 meta=json.load(open(v['file']+'.json'));char_times=[]
 for event in meta['metadata']:
  for entry in event.get('Metadata',[]):
   if entry['Type']!='WordBoundary':continue
   q=entry['Data'];txt=q['text']['Text'];off=q['Offset']/1e7;dur=q['Duration']/1e7
   for j,c in enumerate(txt):
    if re.match(r'[\w\u4e00-\u9fff]',c):char_times.append((c,off+dur*j/len(txt),off+dur*(j+1)/len(txt)))
 pieces=re.findall(r'[^，。；！？、]+[，。；！？、]?',v['text']);pos=0
 for piece in pieces:
  # Keep adjacent short comma phrases together when total length is comfortable.
  chars=[c for c in piece if re.match(r'[\w\u4e00-\u9fff]',c)]
  if not chars:continue
  n=len(chars);part=char_times[pos:pos+n];pos+=n
  assert ''.join(x[0] for x in part)==''.join(chars),(v['text'],piece,part)
  start=v['start']+part[0][1];end=min(v['end'],v['start']+part[-1][2]+.12)
  subs.append({'start':start,'end':end,'text':piece})
 assert pos==len(char_times),(pos,len(char_times))
# Avoid very brief subtitles by joining consecutive fragments within the same utterance.
joined=[]
for q in subs:
 if joined and q['start']-joined[-1]['end']<.4 and len(joined[-1]['text'])+len(q['text'])<=23 and (joined[-1]['end']-joined[-1]['start']<1.5 or q['end']-q['start']<1.0) and not joined[-1]['text'].endswith('。'):
  joined[-1]['text']+=q['text'];joined[-1]['end']=q['end']
 else:joined.append(q.copy())
for i in range(len(joined)-1):joined[i]['end']=min(joined[i]['end'],joined[i+1]['start']-.02)
with open(OUT/'subtitles.srt','w') as f:
 for i,q in enumerate(joined,1):f.write(f"{i}\n{clock(q['start'])} --> {clock(q['end'])}\n{q['text']}\n\n")
json.dump(plan,open(SCR/'narration_aligned.json','w'),ensure_ascii=False,indent=2)
report={'duration':D,'sample_rate':SR,'samples':N,'narration_input_loudness':stats,'narration_linear_gain':float(gain),'narration_peak_dbfs':float(20*np.log10(np.max(np.abs(voice)))),'source_chapter_gain_db':base_db,'source_duck_db':duck_db,'duck_attack_s':.16,'duck_release_s':.35,'mix_peak_before_limiter':float(np.max(np.abs(mix))),'subtitles':len(joined)}
json.dump(report,open(OUT/'mix_report.json','w'),ensure_ascii=False,indent=2);print(json.dumps(report,ensure_ascii=False,indent=2))
