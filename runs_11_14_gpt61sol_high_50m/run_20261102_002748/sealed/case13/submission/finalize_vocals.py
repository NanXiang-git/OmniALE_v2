import json,io
from pathlib import Path
import numpy as np,soundfile as sf
from scipy.signal import resample_poly
from scipy.ndimage import minimum_filter1d
import argparse
ap=argparse.ArgumentParser();ap.add_argument('--input',type=Path,required=True);ap.add_argument('--submission',type=Path,default=Path(__file__).resolve().parent);ap.add_argument('--preview',type=Path,required=True);args=ap.parse_args()
P=args.submission;ME,sr=sf.read(io.BytesIO((args.input/'music_effects.wav').read_bytes()),dtype='float32');ME*=10**(json.load(open(P/'mix_config.json'))['effects_gain_db']/20)
parts=[];log=[]
for e in json.load(open(P/'translation_plan.json'))['events']:
 if e['type']=='screen_text':continue
 p=P/'assets/takes'/(e['event_id']+'.wav');y,sr=sf.read(p,dtype='float32');y*=10**(2.0/20);a=round(e['start']*sr);m=resample_poly(ME[a:a+len(y)],4,1,axis=0);mm=m.mean(axis=1)
 for it in range(4):
  v=resample_poly(y,4,1)
  stereo=np.where(v>=0,(.814-np.max(m,axis=1))/np.maximum(v,1e-8),(-.814-np.min(m,axis=1))/np.minimum(v,-1e-8))
  mono=np.where(v>=0,(.765-mm)/np.maximum(v,1e-8),(-.765-mm)/np.minimum(v,-1e-8))
  need=np.clip(np.minimum(stereo,mono),0,1)
  if np.min(need)>.9999:break
  need=need[:len(y)*4].reshape(-1,4).min(1);need=minimum_filter1d(need,size=241,mode='nearest');env=np.empty(len(y),dtype='float32');prev=1.;alpha=1-np.exp(-1/(.05*sr))
  for i,g in enumerate(need):prev=min(float(g),prev+(1-prev)*alpha);env[i]=prev
  y*=env
 sf.write(p,y,sr,subtype='PCM_24');vv=resample_poly(y,4,1);stereo=float(np.max(np.abs(m+vv[:,None])));mono=float(np.max(np.abs(mm+vv)));log.append({'event_id':e['event_id'],'stereo_tp_4x':20*np.log10(stereo),'mono_tp_4x':20*np.log10(mono)})
 parts.append((a,y))
# A single prototype sum allows level measurement before final stem render.
for a,y in parts:ME[a:a+len(y)]+=y[:,None]
b=io.BytesIO();sf.write(b,ME,48000,format='WAV',subtype='PCM_24');args.preview.write_bytes(b.getvalue());(P/'assets/final_vocal_levels.json').write_text(json.dumps({'boost_db':2.0,'stereo_ceiling':.814,'mono_ceiling':.765,'events':log},ensure_ascii=False,indent=2))
