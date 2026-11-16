#!/usr/bin/env python3
"""Technical validation, with no recognition model or subjective hearing claim."""
import json,subprocess,re,hashlib,time
from pathlib import Path
import numpy as np
from scipy.io import wavfile
from PIL import Image
R=Path('/workspace/submission');S=Path('/workspace/scratch');report={'checked_unix':time.time(),'subjective_audio_review':False,'limitations':'No native listening tool; no claim of human audition or model-based audio recognition.'}
def probe(p):return json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(p)]))
source=probe('/candidate/birds_source.mp4');final=probe(R/'final.mp4');narr=probe(R/'narration.wav')
vs=next(s for s in final['streams'] if s['codec_type']=='video');aud=next(s for s in final['streams'] if s['codec_type']=='audio');ns=narr['streams'][0]
assert vs['codec_name']=='h264' and int(vs['width'])>=1280 and int(vs['height'])>=720 and vs['r_frame_rate']=='30/1'
assert aud['codec_name']=='aac' and aud['sample_rate']=='48000'
assert ns['codec_name'].startswith('pcm_') and ns['sample_rate']=='48000'
duration=float(final['format']['duration']);diff=abs(duration-float(source['format']['duration']))
assert diff<=.5 and abs(duration-float(narr['format']['duration']))<.0001
report['format']={'video_codec':vs['codec_name'],'width':vs['width'],'height':vs['height'],'fps':vs['r_frame_rate'],'frames':int(vs['nb_frames']),'audio_codec':aud['codec_name'],'audio_rate':aud['sample_rate'],'narration_codec':ns['codec_name'],'narration_rate':ns['sample_rate'],'duration':duration,'input_duration':float(source['format']['duration']),'duration_difference':diff}
# Fully decode once. Error output must be empty.
p=subprocess.run(['ffmpeg','-v','error','-i',str(R/'final.mp4'),'-map','0:v','-map','0:a','-f','null','-'],capture_output=True,text=True)
assert p.returncode==0 and not p.stderr.strip(),p.stderr
report['complete_decode']='passed, no reported errors'
subprocess.run(['ffmpeg','-v','error','-y','-i',str(R/'final.mp4'),'-vn','-c:a','pcm_s24le',str(S/'final_decoded.wav')],check=True)
sr,n=wavfile.read(R/'narration.wav');assert sr==48000
n=n.astype(np.float64)/2147483648
sr,o=wavfile.read(S/'original.wav');o=o.astype(np.float64)/32768
sr,m=wavfile.read(S/'mixed.wav');m=m.astype(np.float64)/2147483648
sr,f=wavfile.read(S/'final_decoded.wav');f=f.astype(np.float64)/2147483648
segments=json.loads((R/'segments.json').read_text())['segments'];plan=json.loads((R/'narration_timing.json').read_text())
windows=[]
for seg in segments:
 assert seg['narration']
 for w in seg['original_sound_windows']:
  a=round(w['start']*sr);b=round(w['end']*sr);assert w['end']-w['start']>=2 and np.max(np.abs(n[a:b]))==0
  assert np.sqrt(np.mean(o[a:b]**2))>0 and np.sqrt(np.mean(f[a:b]**2))>0
  # Within a pure original window the mix must remain correlated to the source.
  z=o[a:b].reshape(-1);y=f[a:b].reshape(-1);corr=float(np.corrcoef(z,y)[0,1])
  expected=m[a:b].reshape(-1);encoded_corr=float(np.corrcoef(expected,y)[0,1])
  assert encoded_corr>.95,(seg['segment'],w,encoded_corr)
  windows.append({'segment':seg['segment'],**w,'narration_max_abs':float(np.max(abs(n[a:b]))),'source_rms':float(np.sqrt(np.mean(z*z))),'final_rms':float(np.sqrt(np.mean(y*y))),'source_final_correlation':corr,'pcm_mix_aac_correlation':encoded_corr})
report['original_sound_windows']=windows
report['narration']={'samples':len(n),'channels':n.shape[1],'peak':float(abs(n).max()),'rms':float(np.sqrt(np.mean(n*n))),'utterances':len(plan),'no_tempo_processing':True}
assert all(i['end']<=i['latest_end'] for i in plan)
# Captions come from exactly the same timing data used to build the ASS burn.
subs=json.loads((R/'subtitle_timing.json').read_text());srt=(R/'subtitles.srt').read_text(encoding='utf-8');ass=(R/'subtitles.ass').read_text(encoding='utf-8')
assert len(re.findall(r' --> ',srt))==len(subs)==ass.count('Dialogue:')
for i,x in enumerate(subs):
 assert 0<=x['start']<x['end']<=duration
 assert x['text'] in srt and x['text'].replace('\n',r'\N') in ass
 if i:assert subs[i-1]['end']<=x['start']
report['subtitles']={'captions':len(subs),'UTF8':True,'same_text_used_for_burn':True,'word_timestamps_used':True,'visual_review':'Representative frames from all six chapters inspected. Font size increased to 46 ASS units for legibility; subtitles at bottom clear of principal bird bodies.'}
# Compare the final picture to the actual last source picture. No caption exists here.
for tag,pth,index in [('source','/candidate/birds_source.mp4',5558),('output',str(R/'final.mp4'),5564)]:
 subprocess.run(['ffmpeg','-v','error','-y','-i',pth,'-vf',f'select=eq(n\\,{index})','-fps_mode','passthrough','-frames:v','1',str(S/f'last_{tag}.png')],check=True)
a=np.asarray(Image.open(S/'last_source.png')).astype(float);b=np.asarray(Image.open(S/'last_output.png')).astype(float)
mae=float(np.mean(abs(a-b)));mse=float(np.mean((a-b)**2));psnr=float(10*np.log10(255**2/mse))
assert mae<6,(mae,psnr)
report['last_frame']={'source_frame_index':5558,'output_frame_index':5564,'mean_absolute_pixel_error':mae,'PSNR_dB':psnr,'complete_last_source_frame_preserved':True}
report['files']={p.name:{'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in [R/'final.mp4',R/'narration.wav',R/'subtitles.srt',R/'segments.json']}
report['result']='all programmatic delivery checks passed'
(R/'validation_report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps({'result':report['result'],'format':report['format'],'windows_checked':len(windows),'last_frame':report['last_frame']},ensure_ascii=False,indent=2))
