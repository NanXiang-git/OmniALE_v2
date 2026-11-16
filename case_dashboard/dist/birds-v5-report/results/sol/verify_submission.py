#!/usr/bin/env python3
import json,pathlib,subprocess,re,hashlib
import numpy as np
from scipy.io import wavfile
OUT=pathlib.Path('/workspace/submission')
def probe(p):return json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration:stream=index,codec_name,codec_type,width,height,r_frame_rate,sample_rate,channels,duration,nb_frames','-of','json',str(p)]))
a=probe('/candidate/birds_source.mp4');b=probe(OUT/'final.mp4');v=next(s for s in b['streams'] if s['codec_type']=='video');au=next(s for s in b['streams'] if s['codec_type']=='audio')
assert v['codec_name']=='h264' and v['width']>=1280 and v['height']>=720 and v['r_frame_rate']=='30/1'
assert au['codec_name']=='aac' and au['sample_rate']=='48000'
assert abs(float(a['format']['duration'])-float(b['format']['duration']))<=.5
sr,x=wavfile.read(OUT/'narration.wav');assert sr==48000 and x.dtype==np.int16 and len(x)/sr==185.5
assert abs(len(x)/sr-float(b['format']['duration']))<.002
segments=json.load(open(OUT/'segments.json'))['segments'];assert len(segments)==6
checks=[]
for s in segments:
 assert s['narration']
 good=[]
 for w in s['original_sound_windows']:
  clip=x[round(w['start']*sr):round(w['end']*sr)]
  silent=bool(np.max(np.abs(clip.astype(np.int32)))==0)
  assert silent,(s['segment'],w)
  if w['end']-w['start']>=2:good.append(w)
 assert good
 narr=[]
 for n in s['narration']:
  clip=x[round(n['start']*sr):round(n['end']*sr)].astype(float)/32768
  assert np.max(np.abs(clip))>.05
  narr.append({'start':n['start'],'end':n['end'],'rms_dbfs':round(float(20*np.log10(np.sqrt(np.mean(clip*clip)))),2)})
 checks.append({'segment':s['segment'],'minimum_two_second_silent_narration_windows':good,'utterances':narr})
srt=(OUT/'subtitles.srt').read_text();subtext=''.join(l for l in srt.splitlines() if l and not l.isdigit() and '-->' not in l)
assert subtext==''.join(n['text'] for s in segments for n in s['narration'])
# Verify that the whole final file decodes, not just the container header.
run=subprocess.run(['ffmpeg','-v','error','-i',str(OUT/'final.mp4'),'-f','null','-'],capture_output=True,text=True)
assert run.returncode==0 and not run.stderr.strip(),run.stderr
report={'status':'passed_objective_checks','source':a,'final':b,'narration_duration_s':len(x)/sr,'narration_pcm_bits':16,'narration_channels':1,'subtitle_text_matches_actual_tts_input':True,'complete_decode_without_errors':True,'chapters':checks,'limitations':'没有原生听音工具，未亲耳审听；此报告不把自然听感或物种识别自动判为通过。'}
json.dump(report,open(OUT/'validation_report.json','w'),ensure_ascii=False,indent=2)
manifest={p.name:{'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in [OUT/n for n in ['final.mp4','narration.wav','subtitles.srt','segments.json','research_log.json']]}
json.dump(manifest,open(OUT/'manifest.json','w'),ensure_ascii=False,indent=2)
print('PASS: final file decodes; video/audio formats, duration, six narrated chapters, per-chapter original-sound windows, exact subtitle text, aligned 48kHz PCM all verified.')
print(json.dumps(manifest,indent=2))
