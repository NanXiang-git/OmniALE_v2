"""Declarative edit/mix engine. No solver code execution."""
from pathlib import Path
import math,wave,json,subprocess,cv2,numpy as np
def write(p,x):Path(p).write_text(json.dumps(x,indent=2),encoding="utf-8")
def capture(p):return cv2.VideoCapture(str(p))
def run(args):subprocess.run([str(a) for a in args],check=True)
def encode(images,out,fps=24):
 it=iter(images);first=next(it);h,w=first.shape[:2];p=subprocess.Popen(["ffmpeg","-v","error","-y","-f","rawvideo","-pix_fmt","bgr24","-s",f"{w}x{h}","-r",str(fps),"-i","-","-an","-c:v","libx264","-crf","16","-pix_fmt","yuv420p","-threads","2",str(out)],stdin=subprocess.PIPE)
 p.stdin.write(first.tobytes())
 for im in it:p.stdin.write(im.tobytes())
 p.stdin.close();assert p.wait()==0
def sample_count(seg):return math.ceil((seg['out_frame']-seg['in_frame'])*seg['rate_den']/seg['rate_num'])
def mapping(project):
 rows=[]
 for s in project['segments']:
  for k in range(sample_count(s)):rows.append((s['source'],s['in_frame']+k*s['rate_num']//s['rate_den'],s['id']))
 return rows
def stereo(path):
 with wave.open(str(path),'rb') as w:
  assert w.getnchannels()==2 and w.getsampwidth()==2 and w.getframerate()==48000,'PCM16 stereo48k required'
  return np.frombuffer(w.readframes(w.getnframes()),'<i2').reshape(-1,2).astype(np.float32)/32768
def writewav(path,x):
 with wave.open(str(path),'wb') as w:w.setparams((2,2,48000,0,'NONE','not compressed'));w.writeframes(np.clip(x*32768,-32768,32767).round().astype('<i2').tobytes())
def mix(project,input_dir):
 length=len(mapping(project))*2000;foley=np.zeros((length,2),np.float32);amb=stereo(input_dir/'roomtone.wav');amb=amb[project['ambience']['source_start_sample']:project['ambience']['source_start_sample']+length]*project['ambience']['gain'];assert len(amb)==length
 for e in project['audio_events']:
  x=stereo(input_dir/e['source'])*e['gain'];start=e['out_frame']*2000
  if 0<=start<length:foley[start:min(start+len(x),length)]+=x[:min(len(x),length-start)]
 return foley,amb,foley+amb
def render(project,input_dir,out):
 out=Path(out);out.mkdir(parents=True,exist_ok=True)
 def picture():
  for s in project['segments']:
   cap=capture(input_dir/s['source']);cap.set(cv2.CAP_PROP_POS_FRAMES,s['in_frame']);last=-1;im=None
   for k in range(sample_count(s)):
    idx=s['in_frame']+k*s['rate_num']//s['rate_den']
    while last<idx:
     ok,im=cap.read();assert ok,'source bounds';last=s['in_frame'] if last==-1 else last+1
    yield im
   cap.release()
 encode(picture(),out/'picture.mp4',24)
 f,a,m=mix(project,input_dir)
 for name,x in [('foley.wav',f),('ambience.wav',a),('mix.wav',m)]:writewav(out/name,x)
 run(['ffmpeg','-v','error','-y','-i',out/'picture.mp4','-i',out/'mix.wav','-map','0:v','-map','1:a','-c:v','copy','-c:a','aac','-b:a','192k','-ar','48000','-ac','2','-t',len(mapping(project))/24,'-movflags','+faststart',out/'video.mp4'])
 write(out/'edit.json',project)
 return mapping(project)

if __name__=="__main__":
 import argparse
 p=argparse.ArgumentParser();p.add_argument("--project",required=True);p.add_argument("--input",required=True);p.add_argument("--out",required=True);a=p.parse_args();render(json.loads(Path(a.project).read_text(encoding="utf-8")),Path(a.input),Path(a.out))
