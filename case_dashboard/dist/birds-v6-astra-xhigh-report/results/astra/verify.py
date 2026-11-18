"""Verify deliverable timing, speech-free windows, source alignment and decodeability."""
import json,subprocess,time,re
from pathlib import Path
import numpy as np
from scipy.io import wavfile
from audit import record,run

ROOT=Path('/workspace/submission');TMP=Path('/workspace/scratch')
st=time.time()
run('Decode final AAC for measured verification',['ffmpeg','-v','error','-y','-i',str(ROOT/'final.mp4'),'-vn','-acodec','pcm_s16le',str(TMP/'final_audio.wav')])
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','stream=codec_name,codec_type,width,height,r_frame_rate,sample_rate,channels,nb_frames,duration:format=duration,size','-of','json',str(ROOT/'final.mp4')]))
doc=json.loads((ROOT/'segments.json').read_text())
sr,narr=wavfile.read(ROOT/'narration.wav');sr2,mix=wavfile.read(TMP/'final_audio.wav')
sr3,orig=wavfile.read(TMP/'original.wav');sr4,bal=wavfile.read(TMP/'original_balanced.wav')
assert sr==sr2==sr3==sr4==48000
assert abs(len(narr)/sr-float(probe['format']['duration']))<1/sr
assert abs(float(probe['format']['duration'])-185.504)<.5
v=next(s for s in probe['streams'] if s['codec_type']=='video')
assert v['codec_name']=='h264' and v['width']>=1280 and v['height']>=720 and v['r_frame_rate']=='30/1'
a=next(s for s in probe['streams'] if s['codec_type']=='audio');assert a['codec_name']=='aac'
def rmsdb(x):
    x=np.asarray(x,dtype=np.float64)
    return float(20*np.log10(max(1e-12,np.sqrt(np.mean(x*x)))))
def correlation(x,y):
    return float(np.corrcoef(np.asarray(x).reshape(-1),np.asarray(y).reshape(-1))[0,1])
results=[]
for s in doc['segments']:
    assert s['narration'] and s['original_sound_windows']
    windows=[]
    for w in s['original_sound_windows']:
        assert w['end']-w['start']>=2-1e-6
        assert s['start']<=w['start']<w['end']<=s['end']
        i,j=round(w['start']*sr),round(w['end']*sr)
        nz=int(np.count_nonzero(narr[i:j])); assert nz==0,(s['segment'],w,nz)
        segment=mix[i:j].astype(float)/32768
        assert np.any(segment)
        windows.append({**w,'narration_nonzero_samples':nz,'final_rms_dbfs':rmsdb(segment),
            'same_time_raw_source_correlation':correlation(orig[i:j],mix[i:j]),
            'same_time_processed_source_correlation':correlation(bal[i:j],mix[i:j])})
    speech_seconds=sum(x['end']-x['start'] for x in s['narration'])
    i,j=round(s['start']*sr),min(len(mix),round(s['end']*sr))
    results.append(dict(segment=s['segment'],speech_seconds=round(speech_seconds,3),
        original_sound_windows=windows,final_peak_dbfs=float(20*np.log10(max(abs(mix[i:j].astype(float)).max()/32768,1e-12)))))
text=(ROOT/'subtitles.srt').read_text();cues=text.strip().split('\n\n')
said=[n['text'] for s in doc['segments'] for n in s['narration']]
written=[''.join(c.splitlines()[2:]) for c in cues]
assert said==written,'SRT differs from narrated text plan'
report=dict(technical=probe,narration_sample_rate=sr,narration_samples=len(narr),
    narration_seconds=len(narr)/sr,narration_pcm_peak_dbfs=float(20*np.log10(abs(narr.astype(float)).max()/32768)),
    original_duration_difference_seconds=float(probe['format']['duration'])-185.504,
    subtitle_cues=len(cues),subtitles_match_spoken_text_plan=True,chapters=results,
    limitations='No native audio audition or speech recognition used. Human perceived pronunciation/prosody not independently verified. Identification confidences are stated in segments.json.')
(ROOT/'validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
record('validation','Verify video format/duration, subtitle content, exact silent narration windows and unchanged source timing',st,report='validation.json',outcome='passed')
print(json.dumps(report,ensure_ascii=False,indent=2))
