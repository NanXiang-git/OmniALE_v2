#!/usr/bin/env python3
"""Build aligned PCM narration, exact spoken-text subtitles, and source-preserving mix.
Input media never leaves the local machine. No speech/bird recognition is invoked.
"""
import json,pathlib,re,subprocess,numpy as np
from scipy.io import wavfile
from scipy.ndimage import gaussian_filter1d
B=pathlib.Path('/workspace/submission');W=pathlib.Path('/workspace/scratch');SR=48000
chap=json.load(open('/candidate/chapters.json'));duration=185.5;N=round(duration*SR)  # CFR ceiling includes the source's final video frame
plan=json.loads((B/'narration_plan.json').read_text())
parts={
's1a':['这只小鸟，我判断是四川短翅莺。'],
's1b':['看它暖褐色的背部、深色细嘴，','还有向后伸出的长尾。'],
's1c':['原声里的短音有节奏地重复，','像一串简短的鸣唱。'],
's1d':['不过，画面没有同步的张嘴动作，','声音归属仍需谨慎。'],
's2a':['枝叶把鸟遮住了。','根据成串重复的鸣唱，','我暂按四川短翅莺识别。'],
's2b':['声音一阵接着一阵，','鸟却藏在浓密的枝叶后。'],
's3a':['这只鸟，我判断是桤木纹霸鹟。'],
's3b':['浅色喉部、淡眼圈和两道翼斑，','是主要线索。'],
's3c':['它在枝头抬头鸣唱，','短句之间留着停顿。'],
's4a':['芦苇后的这只小鸟，','暂按芦苇莺识别。'],
's4b':['画面失焦，细节看不清。'],
's4c':['原声中，短小多变的鸣唱接连出现。'],
's5a':['这是黑脚信天翁。','深褐色的成鸟，','正靠近全身绒羽的雏鸟。'],
's5b':['成鸟俯身，和雏鸟嘴对嘴地接触。','信天翁会把食物反刍出来，','喂给幼鸟。'],
's5c':['原声里，还夹着尖细的叫声。'],
's6a':['这是黑背信天翁。','白头白腹，背翼深黑。'],
's6b':['仰头长鸣、相互碰嘴，配合点头，','这是它们的求偶展示。']}
def norm(s):return ''.join(c for c in s if c.isalnum())
def srtt(t):
 ms=round(t*1000);return f'{ms//3600000:02d}:{ms//60000%60:02d}:{ms//1000%60:02d},{ms%1000:03d}'
def asst(t):
 cs=round(t*100);return f'{cs//360000}:{cs//6000%60:02d}:{cs//100%60:02d}.{cs%100:02d}'
narr=np.zeros(N,np.float32);duck=np.ones(N,np.float32);cues=[];intervals=[]
for i in plan:
 sr,raw=wavfile.read(W/'tts'/(i['id']+'.wav'));assert sr==SR
 x=raw.astype(np.float32)/32768*.89
 a=round(i['start']*SR);z=a+len(x)
 seg=chap['segments'][i['segment']-1];assert z<=round(seg['end']*SR)
 assert not np.any(narr[a:z]);narr[a:z]=x
 # Fixed gain only; no resampling, time stretching or speech tempo manipulation.
 attack=.16;release=.30;lo=10**(-9/20)
 left=max(0,a-round(attack*SR));right=min(N,z+round(release*SR))
 env=np.ones(right-left,np.float32);al=a-left;cl=z-left
 if al:env[:al]=np.linspace(1,lo,al)
 env[al:cl]=lo
 if right>z:env[cl:]=np.linspace(lo,1,right-z)
 duck[left:right]=np.minimum(duck[left:right],env)
 bounds=json.loads((W/'tts'/(i['id']+'_boundary.json')).read_text());chars=[];combined=''
 for b in bounds:
  word=norm(b['text']);off=b['offset']/1e7;dur=b['duration']/1e7
  for j,c in enumerate(word):chars.append((off+j*dur/max(1,len(word)),off+(j+1)*dur/max(1,len(word))))
  combined+=word
 assert combined==norm(i['text']),(i['id'],combined,norm(i['text']))
 assert norm(''.join(parts[i['id']]))==combined
 pos=0
 for txt in parts[i['id']]:
  k=len(norm(txt));start=i['start']+chars[pos][0]-.035;end=i['start']+chars[pos+k-1][1]+.13
  cues.append({'start':round(start,3),'end':round(end,3),'text':txt,'segment':i['segment']});pos+=k
 intervals.append({'id':i['id'],'segment':i['segment'],'start':i['start'],'end':round(z/SR,6),'speech_start':round(i['start']+chars[0][0],6),'speech_end':round(i['start']+chars[-1][1],6),'text':i['text']})
for j in range(len(cues)-1):cues[j]['end']=min(cues[j]['end'],cues[j+1]['start']-.04)
wavfile.write(B/'narration.wav',SR,(np.clip(narr,-1,1)*32767).astype(np.int16))
(B/'narration_intervals.json').write_text(json.dumps(intervals,ensure_ascii=False,indent=2))
(B/'subtitle_cues.json').write_text(json.dumps(cues,ensure_ascii=False,indent=2))
with (B/'subtitles.srt').open('w',encoding='utf-8') as f:
 for j,c in enumerate(cues,1):f.write(f'{j}\n{srtt(c["start"])} --> {srtt(c["end"])}\n{c["text"]}\n\n')
ass='''[Script Info]
ScriptType: v4.00+
PlayResX: 1280
PlayResY: 720
ScaledBorderAndShadow: yes
WrapStyle: 2

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Bottom,WenQuanYi Micro Hei,34,&H00FFFFFF,&H000000FF,&H00101010,&H70000000,0,0,0,0,100,100,0,0,1,2,0.6,2,45,45,28,1
Style: Right,WenQuanYi Micro Hei,32,&H00FFFFFF,&H000000FF,&H00101010,&H70000000,0,0,0,0,100,100,0,0,1,2,0.6,3,45,32,28,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
'''
for c in cues:
 txt=c['text'];style='Bottom'
 if c['segment']==6:
  style='Right'
  if len(txt)>12:
   comma=[m.end() for m in re.finditer('[，、]',txt) if 6<=m.end()<=12];cut=comma[-1] if comma else len(txt)//2;txt=txt[:cut]+r'\N'+txt[cut:]
 ass+=f'Dialogue: 0,{asst(c["start"])},{asst(c["end"])},{style},,0,0,0,,{txt}\n'
(B/'burn_subtitles.ass').write_text(ass,encoding='utf-8')
# Original audio retains every sample's original temporal position and both channels.
sr,original=wavfile.read(W/'original.wav');assert sr==SR
original=original[:N].astype(np.float32)/32768
if len(original)<N:original=np.pad(original,((0,N-len(original)),(0,0)))
gains_db=[-7,6,1,20,18,1];g=np.ones(N,np.float32)
for s,db in zip(chap['segments'],gains_db):g[round(s['start']*SR):round(s['end']*SR)]=10**(db/20)
# Smooth only gain changes, never crossfade or shift the source recording itself.
for s in chap['segments'][1:]:
 a=round(s['start']*SR);rad=round(.055*SR);l=max(0,a-rad);r=min(N,a+rad);g[l:r]=np.linspace(g[l],g[r-1],r-l)
original*=g[:,None]*duck[:,None]
mixed=original+narr[:,None]
wavfile.write(W/'mixed_float.wav',SR,mixed.astype(np.float32))
report={'duration':N/SR,'narration_peak_dbfs':float(20*np.log10(np.max(abs(narr)))),'original_chapter_gain_db':gains_db,'duck_db':-9,'duck_attack_seconds':.16,'duck_release_seconds':.30,'source_samples_shifted':False,'source_channels':2,'narration_frames':N,'narration_sample_rate':SR,'cue_count':len(cues),'tts_chunks':len(plan),'narration_clip_seconds':sum(i['end']-i['start'] for i in intervals)}
(B/'mix_report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print(json.dumps(report,indent=2))
