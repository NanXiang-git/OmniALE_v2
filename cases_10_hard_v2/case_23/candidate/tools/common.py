"""Public timeline/audio contract. No solution text or hidden visual facts."""
from pathlib import Path
import json,hashlib,math,re,wave
import numpy as np
FPS=25;SR=48000;SOURCE_SECONDS=180;WIDTH=960;HEIGHT=540
ANCHORS=[25,55,85,115,150];PHASE_STARTS=[0,*ANCHORS];PHASE_ENDS=[*ANCHORS,180]
def read(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def sha(p):
 with Path(p).open('rb') as f:return hashlib.file_digest(f,'sha256').hexdigest()
def safe(root,name):
 if not isinstance(name,str):raise ValueError('Expected relative path')
 p=(Path(root)/name).resolve()
 if Path(name).is_absolute() or not p.is_relative_to(Path(root).resolve()):raise ValueError('Path escapes root')
 return p
def finite(x):return type(x) in (float,int) and math.isfinite(x)
def pauses(data):
 if not isinstance(data,dict) or set(data)!={'pauses'} or not isinstance(data['pauses'],list):raise ValueError('Invalid time_map object')
 rows=data['pauses'];last=-1;total=0
 for p in rows:
  if not isinstance(p,dict) or set(p)!={'source_time','duration'}:raise ValueError('Invalid pause fields')
  a,d=p['source_time'],p['duration']
  if not finite(a) or not finite(d) or a not in ANCHORS or a<=last or not 0<d<=5 or abs(d*FPS-round(d*FPS))>1e-6:raise ValueError('Pause anchor/order/frame duration invalid')
  last=a;total+=d
 if total>20+1e-8:raise ValueError('Pause budget exceeded')
 return rows
def source_to_output(t,ps):return t+sum(p['duration'] for p in ps if p['source_time']<=t)
def output_to_source(t,ps):
 offset=0
 for p in ps:
  a=p['source_time']+offset
  if t<a:return t-offset
  if t<a+p['duration']:return p['source_time']
  offset+=p['duration']
 return t-offset
def frame_map(ps):
 mapping=[];by={int(p['source_time']*FPS):round(p['duration']*FPS) for p in ps}
 for i in range(round(SOURCE_SECONDS*FPS)):
  if i in by:mapping.extend([i-1]*by[i])
  mapping.append(i)
 return np.array(mapping,dtype=np.int32)
def loadwav(path):
 with wave.open(str(path),'rb') as w:
  if (w.getframerate(),w.getnchannels(),w.getsampwidth())!=(SR,1,2):raise ValueError('Expected 48000Hz mono signed16 PCM WAV')
  return np.frombuffer(w.readframes(w.getnframes()),'<i2').astype(np.int32)
def writewav(path,x):
 if np.max(np.abs(x),initial=0)>=32767:raise ValueError('Clipping forbidden')
 with wave.open(str(path),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes(x.astype('<i2').tobytes())
def map_teacher(x,ps):
 if len(x)!=round(SOURCE_SECONDS*SR):raise ValueError('Source teacher length changed')
 parts=[];last=0
 for p in ps:
  at=round(p['source_time']*SR);parts.extend([x[last:at],np.zeros(round(p['duration']*SR),np.int32)]);last=at
 parts.append(x[last:]);return np.concatenate(parts)
def activity(x):
 block=SR//50;z=np.pad(x.astype(float),(0,(-len(x))%block)).reshape(-1,block);active=np.sqrt(np.mean(z*z,axis=1))>=35
 ids=np.flatnonzero(active);rows=[]
 for i in ids:
  if rows and i<=rows[-1][1]+4:rows[-1][1]=int(i+1)
  else:rows.append([int(i),int(i+1)])
 return [[max(0,a*.02-.02),min(len(x)/SR,b*.02+.02)] for a,b in rows]
def speech_chars(text):
 if not isinstance(text,str) or re.search('[A-Za-z0-9<>\n\r]',text):raise ValueError('Use literal spoken Chinese, spell numbers and Q/K/V in Chinese; no markup')
 chars=re.sub(r'[\s，。！？、；：,.!?;:“”‘’（）()《》…—\-]','',text)
 if not 1<=len(chars)<=45 or any(not ('\u3400'<=c<='\u9fff') for c in chars):raise ValueError('Each utterance requires 1–45 spoken Chinese characters')
 return len(chars)
def clips(sub,ps):
 data=read(Path(sub)/'descriptions.json')
 if not isinstance(data,dict) or set(data)!={'clips'} or not isinstance(data['clips'],list) or not 6<=len(data['clips'])<=24:raise ValueError('Require 6–24 description clips')
 result=[];last_end=-1;ids=set();paths=set();phases=set();duration=SOURCE_SECONDS+sum(p['duration'] for p in ps)
 for c in data['clips']:
  if not isinstance(c,dict) or set(c)!={'id','phase','start','end','text','audio'}:raise ValueError('Invalid description fields')
  if not isinstance(c['id'],str) or not re.fullmatch(r'D\d{2}',c['id']) or c['id'] in ids:raise ValueError('Unique D01 style clip ids required')
  a,b=c['start'],c['end'];phase=c['phase']
  if phase not in [f'P{i}' for i in range(1,7)] or not all(finite(v) for v in (a,b)) or not 0<=a<b<=duration or a<last_end-1e-7 or abs(a*SR-round(a*SR))>1e-5:raise ValueError('Invalid phase/clip timing/order')
  k=int(phase[1:])-1;lo=source_to_output(PHASE_STARTS[k],ps);hi=source_to_output(PHASE_ENDS[k],ps)
  if a<lo-1e-6 or b>hi+1e-6:raise ValueError('Description must remain in its phase, including its end pause')
  if not re.fullmatch(r'clips/D\d{2}\.wav',c['audio']) or c['audio'] in paths:raise ValueError('Unique clips/Dxx.wav paths required')
  x=loadwav(safe(sub,c['audio']));chars=speech_chars(c['text'])
  if not .3<=len(x)/SR<=18 or abs((b-a)-len(x)/SR)>1.01/SR:raise ValueError('Actual WAV duration does not match cue')
  active=activity(x);voiced=sum(b-a for a,b in active)
  if voiced<.20 or chars>5*voiced+.5:raise ValueError('Silent clip or conservative speech rate exceeds5 characters/s')
  result.append({**c,'samples':x,'active':active,'chars':chars});ids.add(c['id']);paths.add(c['audio']);phases.add(phase);last_end=b
 if len(phases)!=6:raise ValueError('Each phase requires at least one description')
 return result
def assemble(sub,teacher):
 ps=pauses(read(Path(sub)/'time_map.json'));cs=clips(sub,ps);mapped=map_teacher(teacher,ps);desc=np.zeros(len(mapped),np.int32)
 for c in cs:
  at=round(c['start']*SR);desc[at:at+len(c['samples'])]+=c['samples']
 mix=mapped+desc
 if np.max(np.abs(mix),initial=0)>=32767:raise ValueError('Mixed audio clips')
 return ps,cs,mapped,desc,mix
def stamp(t):
 n=round(t*1000);return f'{n//3600000:02}:{n//60000%60:02}:{n//1000%60:02}.{n%1000:03}'
def vtt(cs):return 'WEBVTT\n\n'+'\n\n'.join(f"{c['id']}\n{stamp(c['start'])} --> {stamp(c['end'])}\n{c['text']}" for c in cs)+'\n'
PROJECT={'version':1,'renderer':'omni23-v2','map':'time_map.json','descriptions':'descriptions.json','navigation':'navigation.json'}
CONFIG={'version':1,'raw':'input/lesson_v2.mp4','extended':'submission/accessible.mp4','map':'submission/time_map.json','navigation':'submission/navigation.json','descriptions':'submission/descriptions.json','captions':'submission/description.vtt'}
def project(sub,source,teacher):
 expected={**PROJECT,'source_sha256':sha(source),'teacher_sha256':sha(teacher)}
 if read(Path(sub)/'project.json')!=expected:raise ValueError('Project fields/hash differ from fixed declarative contract')
 if read(Path(sub)/'player_config.json')!=CONFIG:raise ValueError('Player configuration must use the documented safe media paths')

