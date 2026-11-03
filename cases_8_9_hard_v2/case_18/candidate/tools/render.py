"""Trusted declarative renderer. Reads fixed media paths; executes no submission code."""
from pathlib import Path
import argparse,hashlib,json,subprocess,cv2,numpy as np,wave
VERSION='omni18-v2'
def sha(p):
 with Path(p).open('rb') as f:return hashlib.file_digest(f,'sha256').hexdigest()
def read(p):return json.loads(Path(p).read_text(encoding='utf-8-sig'))
def safe(root,name):
 p=(Path(root)/name).resolve()
 if not p.is_relative_to(Path(root).resolve()):raise ValueError('Path escape')
 return p
def project(root,source):
 p=read(Path(root)/'project.json')
 expected={'version':1,'renderer':VERSION,'source_sha256':sha(source),'mask':'mask.mkv','audio':'final_audio.wav','subtitles':'subtitles.json'}
 if p!=expected:raise ValueError('project.json must have exactly the documented fixed fields and current source hash')
 for n in ('mask.mkv','final_audio.wav','subtitles.json'):safe(root,n)
 return p
def timestamp(t):
 n=round(float(t)*1000);return f'{n//3600000:02}:{n//60000%60:02}:{n//1000%60:02},{n%1000:03}'
def srt(cues):
 # MP4 mov_text cannot represent overlapping samples. Partition the timeline
 # and combine concurrent speakers into one multi-line timed sample.
 boundaries=sorted({c[k] for c in cues for k in ('start','end')});rows=[]
 for a,b in zip(boundaries,boundaries[1:]):
  active=[c for c in cues if c['start']<=a+.000001 and c['end']>=b-.000001]
  if active:rows.append((a,b,'\n'.join(f"[{c['speaker']}] {c['text']}" for c in active)))
 return '\n\n'.join(f'{i+1}\n{timestamp(a)} --> {timestamp(b)}\n{t}' for i,(a,b,t) in enumerate(rows))+'\n'
def apply(frame,mask):
 if mask.ndim==3:mask=cv2.cvtColor(mask,cv2.COLOR_BGR2GRAY)
 out=frame.copy();out[mask>=128]=16;return out
def render(sub,source):
 sub=Path(sub).resolve();source=Path(source).resolve();project(sub,source)
 cues=read(sub/'subtitles.json');(sub/'zh.srt').write_text(srt(cues),encoding='utf-8')
 cap=cv2.VideoCapture(str(source));m=cv2.VideoCapture(str(sub/'mask.mkv'));w=int(cap.get(3));h=int(cap.get(4));fps=cap.get(5)
 cmd=['ffmpeg','-v','error','-y','-f','rawvideo','-pixel_format','bgr24','-video_size',f'{w}x{h}','-framerate',str(fps),'-i','-','-i',str(sub/'final_audio.wav'),'-i',str(sub/'zh.srt'),'-map','0:v:0','-map','1:a:0','-map','2:s:0','-map_metadata','-1','-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-c:s','mov_text','-metadata:s:s:0','language=zho','-movflags','+faststart',str(sub/'anonymous.mp4')]
 p=subprocess.Popen(cmd,stdin=subprocess.PIPE);n=0
 try:
  while True:
   ok,f=cap.read();mk,b=m.read()
   if not ok:
    if mk:raise ValueError('Extra mask frames')
    break
   if not mk or b.shape[:2]!=f.shape[:2]:raise ValueError('Mask timeline/geometry mismatch')
   o=apply(f,b)
   if n==0:cv2.imwrite(str(sub/'cover.png'),o)
   p.stdin.write(o.tobytes());n+=1
 finally:p.stdin.close();cap.release();m.release()
 if p.wait()!=0:raise RuntimeError('FFmpeg render failed')
 print(f'Rendered {n} frames; review final artifacts before submitting.')
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--submission',required=True);p.add_argument('--source',default=str(Path(__file__).resolve().parents[1]/'input/programme.mp4'));a=p.parse_args();render(a.submission,a.source)
