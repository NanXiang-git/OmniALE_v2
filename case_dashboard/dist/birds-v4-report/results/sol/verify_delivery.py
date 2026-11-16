#!/usr/bin/env python3
import pathlib,json,subprocess,numpy as np,re
from scipy.io import wavfile
B=pathlib.Path('/workspace/submission');W=pathlib.Path('/workspace/scratch')
info=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(B/'final.mp4')],text=True));video=next(s for s in info['streams'] if s['codec_type']=='video');audio=next(s for s in info['streams'] if s['codec_type']=='audio')
source=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','json','/candidate/birds_source.mp4'],text=True));sd=float(source['format']['duration']);duration=float(info['format']['duration'])
assert video['codec_name']=='h264' and audio['codec_name']=='aac';assert video['width']>=1280 and video['height']>=720;assert video['r_frame_rate']=='30/1';assert abs(duration-sd)<=.5
sr,n=wavfile.read(B/'narration.wav');assert sr==48000 and n.dtype==np.int16;assert abs(len(n)/sr-duration)<=1/sr
ss=json.load(open(B/'segments.json'));sr2,orig=wavfile.read(W/'original.wav');windows=[]
for s in ss['segments']:
 assert s['narration'];long=False
 for win in s['original_sound_windows']:
  a=round(win['start']*sr);b=round(win['end']*sr);peak=int(np.max(np.abs(n[a:b].astype(np.int32))));assert peak==0,(s['segment'],win,peak)
  q=orig[a:b].astype(float)/32768;rms=float(20*np.log10(np.sqrt(np.mean(q*q))+1e-12));assert np.any(q)
  windows.append({'segment':s['segment'],**win,'narration_peak_pcm':peak,'source_rms_dbfs':rms})
  if win['end']-win['start']>=2:long=True
 assert long
 cues=json.load(open(B/'subtitle_cues.json'));ct=''.join(c['text'] for c in cues if c['segment']==s['segment']);nt=''.join(i['text'] for i in s['narration']);assert ct==nt
for f in ['final.mp4','narration.wav','subtitles.srt','segments.json','research_log.json','synthesize_narration.py','README.md']:assert (B/f).stat().st_size>0
# Full audiovisual decode checks stream validity and the entire delivered file.
r=subprocess.run(['ffmpeg','-v','error','-i',str(B/'final.mp4'),'-f','null','-'],capture_output=True,text=True);assert r.returncode==0 and not r.stderr.strip(),r.stderr
report={'video':{k:video.get(k) for k in ['codec_name','width','height','r_frame_rate','nb_frames','duration']},'audio':{k:audio.get(k) for k in ['codec_name','sample_rate','channels','duration']},'output_duration':duration,'input_duration':sd,'duration_difference':duration-sd,'narration_duration':len(n)/sr,'narration_format':'48000 Hz signed 16-bit mono PCM','six_chapters_present':len(ss['segments'])==6,'caption_text_equals_spoken_text':True,'full_decode':'passed','original_sound_window_checks':windows,'subjective_listening':'Not performed: no native audio audition tool available. Checked actual waveforms and spectrograms instead.'}
(B/'validation_report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print(json.dumps(report,ensure_ascii=False,indent=2))
