#!/usr/bin/env python3
"""Freeze a conservative vocal-only peak envelope. The M&E waveform is never modified."""
import argparse,json,io
from pathlib import Path
import numpy as np,soundfile as sf
from scipy.signal import resample_poly
from scipy.ndimage import minimum_filter1d

def apply(inp,sub):
 me,sr=sf.read(io.BytesIO((inp/'music_effects.wav').read_bytes()),dtype='float32');cfg=json.load(open(sub/'mix_config.json'));me*=10**(cfg['effects_gain_db']/20)
 reports=json.loads((sub/'assets/vocal_peak_processing.json').read_text()) if (sub/'assets/vocal_peak_processing.json').exists() else []
 for e in json.load(open(sub/'translation_plan.json'))['events']:
  if e['type']=='screen_text':continue
  p=sub/'assets/takes'/(e['event_id']+'.wav');y,sr=sf.read(p,dtype='float32');a=round(e['start']*sr);b=a+len(y);m=resample_poly(me[a:b],4,1,axis=0)
  before=float(np.max(np.abs(m+resample_poly(y,4,1)[:,None])))
  if before<=.82:continue
  min_gain=1.
  for iteration in range(4):
   v=resample_poly(y,4,1)
   upper=(.812-np.max(m,axis=1))/np.maximum(v,1e-8)
   lower=(-.812-np.min(m,axis=1))/np.minimum(v,-1e-8)
   need=np.where(v>=0,upper,lower);need=np.clip(need,0,1)
   need=need[:len(y)*4].reshape(-1,4).min(axis=1)
   need=minimum_filter1d(need,size=241,mode='nearest')
   env=np.empty(len(y),dtype=np.float32);prev=1.;alpha=1-np.exp(-1/(.050*sr))
   for i,g in enumerate(need):prev=min(float(g),prev+(1-prev)*alpha);env[i]=prev
   y*=env;min_gain=min(min_gain,float(np.min(env)))
   peak=float(np.max(np.abs(m+resample_poly(y,4,1)[:,None])))
   if peak<=.82:break
  sf.write(p,y,sr,subtype='PCM_24')
  reports.append({'event_id':e['event_id'],'before_dbtp_4x':20*np.log10(before),'after_dbtp_4x':20*np.log10(peak),'minimum_gain_db':20*np.log10(max(min_gain,1e-8)),'method':'actor-only 5 ms lookahead envelope, 50 ms release; M&E untouched'})
 (sub/'assets/vocal_peak_processing.json').write_text(json.dumps(reports,ensure_ascii=False,indent=2));print(json.dumps(reports,ensure_ascii=False,indent=2))
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--input',type=Path,required=True);p.add_argument('--submission',type=Path,default=Path(__file__).resolve().parent);a=p.parse_args();apply(a.input,a.submission)
