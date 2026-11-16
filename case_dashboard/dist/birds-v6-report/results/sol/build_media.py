#!/usr/bin/env python3
"""Align synthesized speech, create word-aligned subtitles, duck original audio,
and burn subtitles without changing source pictures or timeline."""
import json,re,subprocess,math
from pathlib import Path
import numpy as np
from scipy.io import wavfile
ROOT=Path('/workspace/submission');SCR=Path('/workspace/scratch');SR=48000
DURATION=185.5
PLAN=json.loads((ROOT/'narration_timing.json').read_text())
N=round(DURATION*SR)
def run(args):return subprocess.run(args,check=True,capture_output=True,text=True)
def timestamp(t):
 ms=round(t*1000);h,ms=divmod(ms,3600000);m,ms=divmod(ms,60000);s,ms=divmod(ms,1000)
 return f'{h:02}:{m:02}:{s:02},{ms:03}'
voice=np.zeros((N,2),np.float32);subtitles=[]
for item in PLAN:
 sr,y=wavfile.read(item['audio_file']);assert sr==SR
 y=y.astype(np.float32)/32768
 # Original synthesis speed; only a 5ms fade at the outermost edges.
 fade=min(240,len(y)//2);y[:fade]*=np.linspace(0,1,fade);y[-fade:]*=np.linspace(1,0,fade)
 a=round(item['start']*SR);b=a+len(y);assert b<=N
 voice[a:b,:]+=y[:,None]
 events=json.loads(Path(item['word_timing_file']).read_text())['events']
 events=[q for q in events if q['type']=='WordBoundary']
 # Map service token times back to authored text, including its punctuation.
 text=item['text'];pos=0;tokens=[]
 for ev in events:
  q=text.find(ev['text'],pos)
  if q<0:raise ValueError((item['id'],ev['text'],text,pos))
  tokens.append((q,q+len(ev['text']),ev['offset']/1e7,(ev['offset']+ev['duration'])/1e7));pos=q+len(ev['text'])
 phrases=[m for m in re.finditer(r'[^，。；！？、]+[，。；！？、]?',text)]
 # Keep subtitle chunks short but avoid flashes shorter than ~1s.
 groups=[]
 for m in phrases:
  if groups and len(groups[-1][2].rstrip('，。；！？、'))<7 and len(groups[-1][2]+m.group())<=25:
   st,_,tx=groups.pop();groups.append((st,m.end(),tx+m.group()))
  else:groups.append((m.start(),m.end(),m.group()))
 for lo,hi,tx in groups:
  ts=[t for t in tokens if t[0]<hi and t[1]>lo]
  assert ts
  start=item['start']+ts[0][2];end=min(item['end'],item['start']+ts[-1][3]+.15)
  tx=tx.rstrip('，。；、')
  if len(tx)>23:
   # Two balanced lines, with no more than 23 Chinese characters each.
   split=math.ceil(len(tx)/2);tx=tx[:split]+'\n'+tx[split:]
  subtitles.append({'start':round(start,3),'end':round(end,3),'text':tx,'utterance':item['id']})
# Ensure captions never overlap.
for i in range(len(subtitles)-1):subtitles[i]['end']=min(subtitles[i]['end'],subtitles[i+1]['start']-.025)
(ROOT/'subtitles.srt').write_text(''.join(f"{i}\n{timestamp(s['start'])} --> {timestamp(s['end'])}\n{s['text']}\n\n" for i,s in enumerate(subtitles,1)),encoding='utf-8')
(ROOT/'subtitle_timing.json').write_text(json.dumps(subtitles,ensure_ascii=False,indent=2))
wavfile.write(SCR/'narration_raw.wav',SR,voice)
# Two-pass loudness normalization keeps the voice gain consistent over all chapters.
cmd=['ffmpeg','-v','info','-i',str(SCR/'narration_raw.wav'),'-af','loudnorm=I=-18.5:TP=-2.5:LRA=11:print_format=json','-f','null','-']
r=run(cmd);measure=json.loads(r.stderr[r.stderr.rfind('{'):]);(SCR/'voice_loudness_pass1.json').write_text(json.dumps(measure,indent=2))
af='loudnorm=I=-18.5:TP=-2.5:LRA=11:linear=true:measured_I={input_i}:measured_TP={input_tp}:measured_LRA={input_lra}:measured_thresh={input_thresh}:offset={target_offset}'.format(**measure)
run(['ffmpeg','-v','error','-y','-i',str(SCR/'narration_raw.wav'),'-af',af,'-ar',str(SR),'-c:a','pcm_s24le',str(ROOT/'narration.wav')])
# Source remains stereo, sample aligned, in place. Smooth chapter gains and duck
# only when narration is present. Nothing is copied, moved or replaced.
sr,original=wavfile.read(SCR/'original.wav');assert sr==SR
original=original[:N].astype(np.float32)/32768
chapters=json.loads(Path('/candidate/chapters.json').read_text())['segments']
base=np.ones(N,np.float32)
gains=[.65,3.0,1.0,8.0,8.0,1.3]
for ch,g in zip(chapters,gains):base[round(ch['start']*SR):round(ch['end']*SR)]=g
# Smooth source-level transitions only within a 60ms neighbourhood of the cuts.
for ch in chapters[1:]:
 b=round(ch['start']*SR);a=max(0,b-1440);e=min(N,b+1440);base[a:e]=np.linspace(base[a],base[e-1],e-a)
duck=np.ones(N,np.float32)
for it in PLAN:
 a=round(it['start']*SR);b=round(it['end']*SR);attack=round(.18*SR);release=round(.35*SR);depth=.32
 duck[max(0,a-attack):a]=np.minimum(duck[max(0,a-attack):a],np.linspace(1,depth,min(attack,a)))
 duck[a:b]=np.minimum(duck[a:b],depth)
 e=min(N,b+release);duck[b:e]=np.minimum(duck[b:e],np.linspace(depth,1,e-b))
original*= (base*duck)[:,None]
wavfile.write(SCR/'original_ducked_float.wav',SR,original)
# Limiting controls isolated source transients. latency=true preserves alignment.
run(['ffmpeg','-v','error','-y','-i',str(SCR/'original_ducked_float.wav'),'-i',str(ROOT/'narration.wav'),'-filter_complex','[0:a]alimiter=limit=0.70:attack=5:release=70:level=false:latency=true[original];[original][1:a]amix=inputs=2:normalize=0:duration=longest,alimiter=limit=0.94:attack=5:release=70:level=false:latency=true,atrim=end=185.5[a]','-map','[a]','-ar',str(SR),'-c:a','pcm_s24le',str(SCR/'mixed.wav')])
(ROOT/'mix_settings.json').write_text(json.dumps({'source_gain_by_segment':gains,'duck_multiplier':.32,'attack_seconds':.18,'release_seconds':.35,'voice_loudness_target_LUFS':-18.5,'original_preserved':'All original samples remain at their original times; only scalar gains and peak limiting are applied. No music or reference recording is mixed.','original_limiter_ceiling':.70,'mix_limiter_ceiling':.94,'duration':DURATION},ensure_ascii=False,indent=2))
print('Narration, subtitles, and mix ready.',len(subtitles),'captions',flush=True)
