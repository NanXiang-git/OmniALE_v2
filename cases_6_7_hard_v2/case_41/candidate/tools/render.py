"""Trusted declarative editor: source-only hard cuts + supplied narration + SRT.
Never runs candidate commands. Every file it writes is under --work-dir / --output.
"""
from pathlib import Path
import argparse, json, subprocess, wave, shutil, math, hashlib

FPS=25
RATE=48000
SUBTITLE_FILTER="subtitles=captions.srt:force_style='FontName=Microsoft YaHei,FontSize=24,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,BorderStyle=1,Outline=2,Shadow=0,Alignment=2,MarginV=24'"

def run(args,cwd=None):
 p=subprocess.run([str(x) for x in args],cwd=cwd,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
 if p.returncode: raise RuntimeError(p.stderr.decode('utf-8','replace')[-7000:])
 return p

def ff(*args,cwd=None): return run(['ffmpeg','-nostdin','-hide_banner','-loglevel','error','-y',*args],cwd=cwd)

def read(p): return json.loads(Path(p).read_text(encoding='utf-8-sig'))

def validate_timeline(t,source_frames=139840,competition=True):
 errors=[]
 if set(t)!={'version','fps','width','height','segments','master_gain_db'}: errors.append('Unexpected/missing timeline keys')
 if [t.get(k) for k in ['version','fps','width','height']]!=[1,25,1280,720]:errors.append('Timeline format must be v1 / 25fps / 1280x720')
 gain=t.get('master_gain_db')
 if type(gain) not in (int,float) or not math.isfinite(gain) or not -24<=gain<=12:errors.append('Invalid master_gain_db')
 segs=t.get('segments',[])
 if not isinstance(segs,list):return ['segments must be array']
 if competition and not 40<=len(segs)<=90:errors.append('Must have 40–90 segments')
 ids=set();total=0
 for row in segs:
  if not isinstance(row,dict) or set(row)!={'id','source_in_frame','source_out_frame','original_gain_db'}: errors.append('Invalid segment keys');continue
  sid=row.get('id');a=row.get('source_in_frame');b=row.get('source_out_frame');g=row.get('original_gain_db')
  if not isinstance(sid,str) or not sid or sid in ids:errors.append('Invalid/duplicate segment id')
  else:ids.add(sid)
  if type(a)!=int or type(b)!=int or not 0<=a<b<=source_frames: errors.append('Invalid source frame bounds');continue
  total+=b-a
  if competition and not 50<=b-a<=500:errors.append('Each segment must be 2–20s')
  if g is not None and (type(g) not in (int,float) or not math.isfinite(g) or not -60<=g<=6):errors.append('original_gain_db must be null or -60..6')
 if competition and not 12750<=total<=14250:errors.append('Duration must be 510–570 seconds')
 return errors

def build(submission,source,output,work_dir,competition=True):
 sub=Path(submission).resolve();source=Path(source).resolve();out=Path(output).resolve();work=Path(work_dir).resolve();work.mkdir(parents=True,exist_ok=True);out.parent.mkdir(parents=True,exist_ok=True)
 t=read(sub/'timeline.json');errors=validate_timeline(t,competition=competition)
 if errors:raise ValueError('; '.join(errors))
 total_frames=sum(s['source_out_frame']-s['source_in_frame'] for s in t['segments']);duration=total_frames/FPS
 parts=[];audio_parts=[]
 for i,s in enumerate(t['segments']):
  start=s['source_in_frame']/FPS;n=s['source_out_frame']-s['source_in_frame'];dur=n/FPS
  v=work/f'shot_{i:03d}.mp4';a=work/f'audio_{i:03d}.wav'
  ff('-ss',f'{start:.8f}','-i',source,'-an','-frames:v',n,'-vf','scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,setsar=1','-r',25,'-c:v','libx264','-preset','veryfast','-crf',18,'-pix_fmt','yuv420p',v)
  g=s['original_gain_db'];gain=0 if g is None else 10**(g/20)
  ff('-ss',f'{start:.8f}','-i',source,'-vn','-t',f'{dur:.8f}','-af',f'volume={gain},apad,atrim=end_sample={n*1920}','-ar',RATE,'-ac',2,'-c:a','pcm_s16le',a)
  parts.append(v.name);audio_parts.append(a)
 stem=work/'expected_original.wav'
 with wave.open(str(stem),'wb') as dst:
  dst.setnchannels(2);dst.setsampwidth(2);dst.setframerate(RATE)
  for a in audio_parts:
   with wave.open(str(a),'rb') as src:
    if src.getnframes()%1920:raise ValueError('Audio frame rounding mismatch')
    dst.writeframes(src.readframes(src.getnframes()))
 (work/'concat.txt').write_text(''.join(f"file '{p}'\n" for p in parts),encoding='utf-8')
 joined=work/'joined.mp4';ff('-f','concat','-safe',1,'-i','concat.txt','-c','copy',joined,cwd=work)
 shutil.copyfile(sub/'zh.srt',work/'captions.srt')
 # Fixed style is part of the interchange contract. All candidate-controlled text is in SRT, never shell/filter syntax.
 vf=SUBTITLE_FILTER
 ff('-i',joined,'-i',sub/'narration.wav','-i',stem,'-filter_complex',f'[1:a]aresample=48000,aformat=channel_layouts=stereo[n];[2:a]aresample=48000,aformat=channel_layouts=stereo[o];[n][o]amix=inputs=2:duration=longest:normalize=0,volume={t["master_gain_db"]}dB,apad,atrim=duration={duration}[a]','-map','0:v:0','-map','[a]','-vf',vf,'-frames:v',total_frames,'-t',duration,'-c:v','libx264','-preset','veryfast','-crf',18,'-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-ar',48000,'-ac',2,'-movflags','+faststart',out,cwd=work)
 return {'output':str(out),'expected_original':str(stem),'duration':duration,'frames':total_frames}

if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--submission',required=True);p.add_argument('--source',required=True);p.add_argument('--output',required=True);p.add_argument('--work-dir',required=True);p.add_argument('--write-original-stem',action='store_true');a=p.parse_args()
 result=build(a.submission,a.source,a.output,a.work_dir)
 if a.write_original_stem:shutil.copyfile(result['expected_original'],Path(a.submission)/'original_audio.wav')
 print(json.dumps(result,ensure_ascii=False,indent=2))
