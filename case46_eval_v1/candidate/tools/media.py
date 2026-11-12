from pathlib import Path
import subprocess,json,hashlib,re
import numpy as np
ROOT=Path(__file__).resolve().parents[1]
def run(args,**kw):
 p=subprocess.run([str(a) for a in args],stdout=subprocess.PIPE,stderr=subprocess.PIPE,**kw)
 if p.returncode:raise RuntimeError(p.stderr.decode('utf8',errors='replace')[-5000:])
 return p.stdout
def ff(*args):return run(['ffmpeg','-hide_banner','-loglevel','error','-y',*args])
def probe(path):return json.loads(run(['ffprobe','-v','error','-show_format','-show_streams','-of','json',path]))
def sha(path):
 h=hashlib.sha256()
 with Path(path).open('rb') as f:
  while b:=f.read(1048576):h.update(b)
 return h.hexdigest()
def write_json(p,data):
 p=Path(p);p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf8')
def audio(path,sr=16000):return np.frombuffer(ff('-i',path,'-map','0:a:0','-ac','1','-ar',str(sr),'-f','f32le','pipe:1'),dtype='<f4').copy()
def frames(path,full=False):
 filt='scale=32:24' if full else 'crop=iw:trunc(ih*0.68/2)*2:0:0,scale=32:24'
 b=ff('-i',path,'-an','-vf',filt,'-pix_fmt','gray','-f','rawvideo','pipe:1')
 return np.frombuffer(b,dtype=np.uint8).reshape(-1,24,32)
def stamp(t):
 ms=round(t*1000);h,ms=divmod(ms,3600000);m,ms=divmod(ms,60000);s,ms=divmod(ms,1000)
 return f'{h:02}:{m:02}:{s:02}.{ms:03}'
def secs(s):
 h,m,v=s.strip().replace(',','.').split(':');return int(h)*3600+int(m)*60+float(v)
def read_cues(path):
 text=Path(path).read_text(encoding='utf-8-sig',errors='replace').replace('\r','')
 cues=[]
 if Path(path).suffix.lower()=='.ass':
  for line in text.splitlines():
   if line.startswith('Dialogue:'):
    a=line[len('Dialogue:'):].strip().split(',',9)
    if len(a)!=10:raise ValueError('Malformed ASS Dialogue')
    body=re.sub(r'\{[^}]*\}','',a[9]).replace('\\N','\n').replace('\\n','\n')
    cues.append({'start':secs(a[1]),'end':secs(a[2]),'text':body,'speaker':a[4].strip(),'style':a[3]})
 else:
  lines=text.splitlines()
  for i,line in enumerate(lines):
   if '-->' not in line:continue
   a,b=line.split('-->');body=[]
   for value in lines[i+1:]:
    if not value.strip():break
    body.append(value)
   cue={'start':secs(a.strip()),'end':secs(b.strip().split()[0]),'text':'\n'.join(body)}
   if Path(path).suffix.lower()=='.srt':
    number=lines[i-1].strip() if i else ''
    if not number.isdigit():raise ValueError('SRT requires numeric cue IDs')
    cue['cue_id']=number
   cues.append(cue)
 for i,c in enumerate(cues):
  if not (0<=c['start']<c['end']) or not c['text'].strip():raise ValueError(f'Invalid cue {i}')
 if Path(path).suffix.lower()=='.srt' and len({c['cue_id'] for c in cues})!=len(cues):raise ValueError('Duplicate SRT cue ID')
 return cues
def write_cues(path,cues):
 vtt=Path(path).suffix=='.vtt';lines=['WEBVTT',''] if vtt else []
 for i,c in enumerate(cues,1):
  a,b=stamp(c['start']),stamp(c['end'])
  if not vtt:a,b=a.replace('.',','),b.replace('.',',')
  lines.extend([str(i),f'{a} --> {b}',c['text'],''])
 Path(path).write_text('\n'.join(lines),encoding='utf8')
def manifest(directory):
 return [{'file':str(p.relative_to(directory)).replace('\\','/'),'bytes':p.stat().st_size,'sha256':sha(p)} for p in sorted(Path(directory).rglob('*')) if p.is_file() and p.name!='input_manifest.json']
