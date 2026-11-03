#!/usr/bin/env python3
"""Fully offline reconstruction: frozen voice takes + input M&E + unchanged source pictures."""
import argparse,json,subprocess,shutil,sys,io
from pathlib import Path
import numpy as np
import soundfile as sf
SR=48000;N=525*SR
META=['speakers.json','translation_plan.json','mix_config.json','continuity_ledger.json','bilingual.ass','subtitles_zh.srt','subtitles_en.srt']
def readwav(path,**kw):
 return sf.read(io.BytesIO(Path(path).read_bytes()),**kw)
def writewav(path,data,sr,**kw):
 b=io.BytesIO();sf.write(b,data,sr,format='WAV',**kw);Path(path).write_bytes(b.getvalue())
def run(args):
 print(' '.join(str(x) for x in args),flush=True);subprocess.run([str(x) for x in args],check=True)
def audio_build(inp,sub,out,allow_missing=False):
 out.mkdir(parents=True,exist_ok=True)
 cfg=json.loads((sub/'mix_config.json').read_text());eng=json.loads((sub/'engineering.json').read_text());plan=json.loads((sub/'translation_plan.json').read_text())['events'];sp=json.loads((sub/'speakers.json').read_text())['speakers']
 me,sr=readwav(inp/'music_effects.wav',dtype='float32',always_2d=True)
 assert sr==SR and me.shape==(N,2)
 me*=10**(cfg['effects_gain_db']/20)
 writewav(out/'effects_track.wav',me,SR,subtype='PCM_24')
 # Sum the quantized delivered stems; no mastering is applied after this sum.
 mix,_=readwav(out/'effects_track.wav',dtype='float32',always_2d=True)
 for s in sp:
  track=np.zeros((N,2),dtype=np.float32)
  for e in plan:
   if e.get('track')!=s['wav'] or e['type']=='screen_text':continue
   take=sub/'assets/takes'/(e['event_id']+'.wav')
   if not take.exists():
    if allow_missing:continue
    raise FileNotFoundError(take)
   x,sr=readwav(take,dtype='float32');assert sr==SR and x.ndim==1
   gain=eng['dialogue_gain_db']+eng.get('role_gain_db',{}).get(e['role'],0)+eng.get('event_gain_db',{}).get(e['event_id'],0)
   x=x*10**(gain/20);a=round(e['start']*SR);count=min(len(x),round((e['end']-e['start'])*SR),N-a)
   track[a:a+count,0]+=x[:count];track[a:a+count,1]+=x[:count]
  dst=out/s['wav'];dst.parent.mkdir(exist_ok=True,parents=True);writewav(dst,track,SR,subtype='PCM_24')
  delivered,_=readwav(dst,dtype='float32',always_2d=True);mix+=delivered
  print('Stem',s['wav'],'peak',float(np.max(np.abs(delivered))),flush=True)
 writewav(out/'mix.wav',mix,SR,subtype='PCM_24')
 mob=cfg['mobile'];f=f"pan=mono|c0=0.5*c0+0.5*c1,volume={mob['gain_db']}dB,alimiter=limit=0.7943282347:attack=5:release=50:level=0:latency=1"
 run(['ffmpeg','-v','error','-y','-i',out/'mix.wav','-af',f,'-ar','48000','-c:a','pcm_s24le',out/'mobile_mix.wav'])
 return out/'mix.wav'
def video_build(inp,sub,mix,output,picture_only=False):
 ass=str(sub/'bilingual.ass').replace('\\','/').replace(':','\\:').replace("'",r"\'")
 fonts=sub/'assets/fonts'
 filt=f"ass=filename='{ass}':fontsdir='{fonts}'"
 args=['ffmpeg','-hide_banner','-loglevel','warning','-y','-i',inp/'source.mp4']
 if not picture_only:args+=['-i',mix]
 args+=['-map','0:v:0']
 if not picture_only:args+=['-map','1:a:0']
 args+=['-vf',filt,'-c:v','libx264','-preset','veryfast','-crf','18','-threads','4','-pix_fmt','yuv420p','-fps_mode','passthrough']
 if not picture_only:args+=['-c:a','aac','-b:a','320k','-ar','48000','-ac','2','-metadata:s:a:0','language=zho']
 else:args+=['-an']
 args+=['-t','525','-movflags','+faststart',output]
 run(args)
def main():
 p=argparse.ArgumentParser();p.add_argument('--input',type=Path,required=True);p.add_argument('--submission',type=Path,default=Path(__file__).resolve().parent);p.add_argument('--output',type=Path,required=True);p.add_argument('--audio-only',action='store_true');p.add_argument('--picture-only',action='store_true');p.add_argument('--allow-missing',action='store_true');a=p.parse_args()
 output=a.output.resolve()
 if output.is_dir():output=output/'dub_zh.mp4'
 output.parent.mkdir(exist_ok=True,parents=True);sub=a.submission.resolve();out=output.parent
 if a.picture_only:video_build(a.input,sub,None,output,True);return
 mix=audio_build(a.input,sub,out,a.allow_missing)
 for name in META:
  if (sub/name).resolve()!=(out/name).resolve():shutil.copy2(sub/name,out/name)
 if not a.audio_only:video_build(a.input,sub,mix,output)
if __name__=='__main__':main()
