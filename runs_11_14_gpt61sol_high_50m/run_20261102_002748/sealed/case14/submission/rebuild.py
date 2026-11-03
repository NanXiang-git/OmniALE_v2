#!/usr/bin/env python3
"""Offline rebuild. Requires Python 3, NumPy, soundfile and FFmpeg on PATH.
Uses source video packets and original.wav, plus the delivered per-cue PCM masters.
No TTS, network, ducking, limiter, respeeding or video re-encoding.
"""
import argparse,json,shutil,subprocess
from pathlib import Path
import numpy as np
import soundfile as sf

SR=48000
N=264*SR

def build(input_dir,submission_dir,output_dir):
    src=Path(input_dir).resolve();assets=Path(submission_dir).resolve();out=Path(output_dir).resolve()
    if not (src/'source.mp4').is_file() and (src/'input/source.mp4').is_file():
        src=src/'input'
    out.mkdir(parents=True,exist_ok=True)
    plan=json.loads((assets/'ad_plan.json').read_text(encoding='utf-8'))
    cfg=json.loads((assets/'player_config.json').read_text(encoding='utf-8'))
    gain=float(cfg['base_gain_db'])
    assert -6<=gain<=0 and cfg['pause_policy']=='fixed_timeline'
    original,sr=sf.read(src/'original.wav',dtype='float64',always_2d=True)
    assert sr==SR and original.shape==(N,2),(sr,original.shape)
    base=original*10**(gain/20)
    del original
    sf.write(out/'base_track.wav',base,SR,subtype='PCM_24')
    # Sum the delivered PCM base, so the three exported WAVs obey the exact same relation.
    base,sr=sf.read(out/'base_track.wav',dtype='float64',always_2d=True)
    ad=np.zeros_like(base)
    prev_end=0
    for c in sorted(plan['cues'],key=lambda c:c['start']):
        p=assets/c['wav'];clip,cs=sf.read(p,dtype='float64',always_2d=True)
        start=round(float(c['start'])*SR)
        assert cs==SR and clip.shape[1]==2 and start>=prev_end
        assert abs(len(clip)/SR-(c['end']-c['start']))<.001
        assert 0<=start and start+len(clip)<=N
        ad[start:start+len(clip)]+=clip
        prev_end=start+len(clip)
        if assets!=out:
            target=out/c['wav'];target.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(p,target)
    sf.write(out/'ad_track.wav',ad,SR,subtype='PCM_24')
    ad,sr=sf.read(out/'ad_track.wav',dtype='float64',always_2d=True)
    mix=base+ad
    assert np.max(np.abs(mix))<.89,'No clipping or post-bus limiting allowed'
    sf.write(out/'mix.wav',mix,SR,subtype='PCM_24')
    del base,ad,mix
    subprocess.run([
        'ffmpeg','-hide_banner','-loglevel','error','-y',
        '-i',str(src/'source.mp4'),'-i',str(out/'mix.wav'),
        '-map','0:v:0','-map','1:a:0','-map_metadata','0','-map_chapters','-1',
        '-c:v','copy','-c:a','aac','-b:a','256k','-ar','48000','-ac','2',
        '-metadata','title=Sintel — 中文口述影像',
        '-metadata:s:a:0','language=zho','-metadata:s:a:0','title=原声与中文口述混音',
        '-movflags','+faststart',str(out/'accessible.mp4')
    ],check=True)
    if assets!=out:
        names=['ad_plan.json','selection_audit.json','player_config.json','ad.vtt','rebuild.json',
               'rebuild.py','README.md','player.html','CREDITS.md','narration.txt','cue_processing.json']
        for name in names:
            if (assets/name).is_file():shutil.copyfile(assets/name,out/name)
    print('Rebuilt 264 seconds, 6336 unchanged video frames,',len(plan['cues']),'description cues.')

if __name__=='__main__':
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--input',required=True)
    p.add_argument('--submission',required=True)
    p.add_argument('--output',required=True)
    a=p.parse_args();build(a.input,a.submission,a.output)
