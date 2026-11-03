#!/usr/bin/env python3
"""Offline vocal editing from supplied, frozen System.Speech takes; no TTS calls."""
import argparse,json,subprocess,math,concurrent.futures
from pathlib import Path
import numpy as np
import soundfile as sf
from scipy.signal import butter,sosfilt
PROFILES={
 'celia':dict(pitch=1.015,hp=100,lp=9500,eq='equalizer=f=2500:t=q:w=0.8:g=1'),
 'thom_young':dict(pitch=.85,hp=95,lp=8500,eq='equalizer=f=180:t=q:w=0.8:g=1'),
 'thom_older':dict(pitch=.78,hp=85,lp=7000,eq='equalizer=f=260:t=q:w=0.9:g=2,equalizer=f=2700:t=q:w=0.8:g=-1'),
 'captain':dict(pitch=.68,hp=80,lp=6500,eq='equalizer=f=190:t=q:w=1:g=3,equalizer=f=1500:t=q:w=0.7:g=1.5'),
 'barley':dict(pitch=.66,hp=100,lp=7100,eq='equalizer=f=650:t=q:w=0.7:g=1.5'),
 'operator':dict(pitch=.84,hp=145,lp=7800,eq='equalizer=f=2400:t=q:w=0.8:g=2'),
 'assistant':dict(pitch=1.04,hp=130,lp=9000,eq='equalizer=f=3300:t=q:w=0.8:g=1')}
def atempo(f):
 out=[]
 while f>2:out.append('atempo=2');f/=2
 while f<.5:out.append('atempo=0.5');f/=.5
 out.append(f'atempo={f:.9f}');return ','.join(out)
def prepare(e,submission,work,force=False):
 if e['type']=='screen_text':return None
 dest=submission/'assets/takes'/(e['event_id']+'.wav')
 if dest.exists() and not force:return dest
 raw=submission/e['raw_asset']
 if not raw.exists():return None
 x,sr=sf.read(raw,dtype='float32');x=x.mean(axis=1) if x.ndim==2 else x
 inds=np.flatnonzero(np.abs(x)>max(.0035,float(np.max(np.abs(x)))*.018))
 if not len(inds):raise ValueError('Silent raw take: '+str(raw))
 lo=max(0,int(inds[0]-.025*sr));hi=min(len(x),int(inds[-1]+.065*sr));x=x[lo:hi]
 p=PROFILES[e['role']];pitch=p['pitch']*e.get('raw_pitch_correction',1)
 # Contextual pitch and dynamics are fixed per occurrence, never copied from another event.
 sid=e['source_ids'][0]
 if sid in ['S035','S044']:pitch*=1.018
 if sid in ['S055','S057','S059']:pitch*=.98
 target=e['end']-e['start']-.025
 speed=len(x)/sr/(target*pitch)
 filters=f'asetrate={sr*pitch:.3f},aresample=48000,'+atempo(speed)+f",highpass=f={p['hp']},lowpass=f={p['lp']},"+p['eq']
 if e['role']=='barley' and sid in ['S018','S041','S066']:
  filters+=',highpass=f=270,lowpass=f=4400'
 filters+=',acompressor=threshold=0.13:ratio=2.8:attack=8:release=75:makeup=1'
 b=subprocess.check_output(['ffmpeg','-v','error','-f','f32le','-ar',str(sr),'-ac','1','-i','pipe:0','-af',filters,'-f','f32le','-ac','1','-ar','48000','pipe:1'],input=x.astype('<f4').tobytes())
 y=np.frombuffer(b,dtype='<f4').copy();n=round(target*48000)
 if len(y)>n:y=y[:n]
 elif len(y)<n:y=np.pad(y,(0,n-len(y)))
 # Per-take controlled vocal compression: only character stems are processed.
 # Normalization is referenced to vocal activity, not leading/trailing silence.
 active=np.abs(y)>.008
 rms=float(np.sqrt(np.mean(y[active]**2))) if np.any(active) else .1
 desired=.185
 if sid in ['S006','S007','S008','S021','S035','S042','S043','S049','S050','S051','S054','S066','S068','S070']:desired*=1.12
 if sid in ['S014','S024','S030','S055','S056','S058','S060','S061','S062','S071','S072']:desired*=.87
 y*=desired/max(rms,.005)
 # A smooth actor-only saturator provides peak headroom without processing M&E.
 y=.59*np.tanh(y/.59)
 # Small per-role harmonic coloration differentiates deep male profiles.
 if e['role']=='captain':y=.58*np.tanh(y*1.1/.58)
 elif e['role']=='thom_older':y=y*(1+.022*np.sin(2*np.pi*7*np.arange(len(y))/48000))
 # Keep all vocal tails inside the declared event, including fades.
 fade=min(400,len(y)//10);y[:fade]*=np.linspace(0,1,fade);y[-fade:]*=np.linspace(1,0,fade)
 dest.parent.mkdir(exist_ok=True,parents=True);sf.write(dest,y,48000,subtype='PCM_24')
 return dest
if __name__=='__main__':
 a=argparse.ArgumentParser();a.add_argument('--submission',type=Path,default=Path(__file__).resolve().parent);a.add_argument('--work',type=Path,required=True);a.add_argument('--force',action='store_true');args=a.parse_args();args.work.mkdir(exist_ok=True,parents=True)
 events=json.loads((args.submission/'translation_plan.json').read_text())['events']
 with concurrent.futures.ThreadPoolExecutor(max_workers=3) as ex:
  results=list(ex.map(lambda e:prepare(e,args.submission,args.work,args.force),events))
 print('Prepared',sum(x is not None for x in results),'vocal takes')
