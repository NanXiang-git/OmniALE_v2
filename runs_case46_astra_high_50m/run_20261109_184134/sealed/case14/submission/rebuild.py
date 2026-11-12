#!/usr/bin/env python3
"""Rebuild from the original picture/sound and the delivered, already spoken cues.
No networking, model inference or TTS is used. Python 3 + numpy + soundfile + FFmpeg.
"""
from pathlib import Path
import argparse,json,subprocess,shutil,hashlib
import numpy as np
import soundfile as sf
SR=48000
SCALE=8388608

def write_json(p,obj):
 p.write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n',encoding='utf8')

def quantize(x):
 q=np.rint(x*SCALE).astype(np.int64)
 if np.any(q < -SCALE) or np.any(q >= SCALE):raise ValueError('PCM would clip')
 return q

def write_pcm(path,q):
 sf.write(path,(q.astype(np.int32)<<8),SR,subtype='PCM_24')

def build(inp,sub,out):
 out.mkdir(parents=True,exist_ok=True)
 cfg=json.loads((sub/'rebuild.json').read_text(encoding='utf8'))['render']
 plan=json.loads((sub/'ad_plan.json').read_text(encoding='utf8'))
 n=int(cfg['samples']);gain=10**(cfg['global_gain_db']/20);duck=10**(cfg['duck_db']/20);ramp=round(cfg['ramp_seconds']*SR)
 original,sr=sf.read(inp/'original.wav',dtype='float64',always_2d=True)
 if sr!=SR or original.shape[1]!=2:raise ValueError('Expected 48 kHz stereo original.wav')
 if len(original)<n:raise ValueError('Original audio shorter than video')
 # original.wav includes 484 extra decoded tail samples after the final video frame.
 base=original[:n]*gain
 envelope=np.ones(n,dtype=np.float64);ad=np.zeros((n,2),dtype=np.float64)
 for c in plan['cues']:
  a,cs=sf.read(sub/c['wav'],dtype='float64',always_2d=True)
  if cs!=SR or a.shape[1]!=2:raise ValueError('Cue must be 48 kHz stereo PCM')
  start=round(c['start']*SR);end=start+len(a)
  if abs(end/SR-c['end'])>1/SR:raise ValueError('Cue length disagrees with plan')
  if start<0 or end>n:raise ValueError('Cue outside timeline')
  ad[start:end]+=a*gain
  envelope[start:end]=np.minimum(envelope[start:end],duck)
  lo=max(0,start-ramp);hi=min(n,end+ramp)
  if start>lo:
   u=np.arange(start-lo)/(start-lo)
   e=1-(1-duck)*(.5-.5*np.cos(np.pi*u))
   envelope[lo:start]=np.minimum(envelope[lo:start],e)
  if hi>end:
   u=np.arange(hi-end)/(hi-end)
   e=duck+(1-duck)*(.5-.5*np.cos(np.pi*u))
   envelope[end:hi]=np.minimum(envelope[end:hi],e)
 bq=quantize(base);dq=quantize(base*envelope[:,None]);aq=quantize(ad);mq=dq+aq
 if np.any(np.abs(mq)>=SCALE):raise ValueError('Mix would clip')
 for name,q in [('base_track.wav',bq),('ducked_base_track.wav',dq),('ad_track.wav',aq),('mix.wav',mq)]:write_pcm(out/name,q)
 # Copy the H.264 elementary stream, including all 3550 frames and original PTS.
 command=['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(inp/'source.mp4'),'-i',str(out/'mix.wav'),'-map','0:v:0','-map','1:a:0','-map_metadata','0','-c:v','copy','-c:a','aac','-b:a','256k','-ar','48000','-ac','2','-metadata:s:a:0','language=zho','-metadata:s:a:0','title=原声与中文口述影像','-disposition:a:0','default','-movflags','+faststart',str(out/'accessible.mp4')]
 subprocess.run(command,check=True)
 if out.resolve()!=sub.resolve():
  for name in ['ad_plan.json','ad.vtt','player.html','player_config.json','rebuild.json','rebuild.py','README.md','self_check.json','dialogue_analysis.json','player_self_test.json']:
   if (sub/name).exists():shutil.copy2(sub/name,out/name)
  shutil.copytree(sub/'cues',out/'cues',dirs_exist_ok=True)
 report={'samples':n,'sample_rate':SR,'channels':2,'duration':n/SR,'global_gain_db':cfg['global_gain_db'],'duck_db':cfg['duck_db'],'ramp_seconds':cfg['ramp_seconds'],'source_audio_samples':len(original),'decoder_padding_samples_omitted':len(original)-n,'mix_sum_exact_in_pcm24':True,'cue_count':len(plan['cues']),'ffmpeg_argv':command}
 write_json(out/'render_report.json',report)
 print(json.dumps(report,ensure_ascii=False,indent=2))

if __name__=='__main__':
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--input',type=Path,required=True);p.add_argument('--submission',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();build(a.input,a.submission,a.output)
