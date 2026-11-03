#!/usr/bin/env python3
"""Offline rebuild: input source frames/audio plus supplied, already-synthesized PCM cues."""
from pathlib import Path
import argparse, json, shutil, subprocess
import numpy as np
import soundfile as sf

def run(argv):
    subprocess.run([str(x) for x in argv], check=True)

def build(input_dir, assets, output):
    input_dir, assets, output = map(lambda x: Path(x).resolve(), (input_dir, assets, output))
    output.mkdir(parents=True, exist_ok=True)
    timeline = json.loads((assets/'timeline.json').read_text(encoding='utf8'))
    plan = json.loads((assets/'description_plan.json').read_text(encoding='utf8'))
    sr = 48000
    duration = timeline['output_duration']
    total = round(duration*sr)
    # Decode the audio actually present in source.mp4, without gain changes.
    raw = subprocess.check_output(['ffmpeg','-v','error','-i',str(input_dir/'source.mp4'),
        '-map','0:a:0','-ac','1','-ar',str(sr),'-c:a','pcm_s16le','-f','s16le','-'])
    original = np.frombuffer(raw, dtype='<i2')
    assert len(original) >= round(timeline['source_duration']*sr)
    base = np.zeros(total, dtype=np.int16)
    for s in timeline['segments']:
        if s['kind']=='source':
            a,b = round(s['source_start']*sr),round(s['source_end']*sr)
            c,d = round(s['output_start']*sr),round(s['output_end']*sr)
            assert b-a==d-c
            base[c:d] = original[a:b]
    ad = np.zeros(total, dtype=np.int32)
    for c in plan['cues']:
        wav, rate = sf.read(assets/c['wav'], dtype='int16')
        assert rate==sr and wav.ndim==1
        a = round(c['start']*sr)
        assert abs((c['end']-c['start'])*sr-len(wav))<1
        ad[a:a+len(wav)] += wav.astype(np.int32)
    mix = base.astype(np.int32)+ad
    assert int(np.max(np.abs(mix))) <= 32767, 'Clipping: do not hide it with a limiter.'
    for name, audio in [('base_track.wav',base),('ad_track.wav',ad),('mix.wav',mix)]:
        sf.write(output/name, audio.astype(np.int16), sr, subtype='PCM_16')
    # Delay frame timestamps at each anchor, then fill the gaps by repeating the
    # preceding frame. No frame is dropped, cropped, scaled, or replaced.
    fps = timeline['fps']
    expression='N'
    for s in timeline['segments']:
        if s['kind']=='hold':
            n=round(s['anchor_source_time']*fps)
            count=round((s['output_end']-s['output_start'])*fps)
            expression+=f'+{count}*gte(N\\,{n})'
    vf=f'settb=1/{fps},setpts={expression},fps={fps}:eof_action=pass'
    run(['ffmpeg','-hide_banner','-loglevel','warning','-y','-i',input_dir/'source.mp4',
        '-i',output/'mix.wav','-map','0:v:0','-map','1:a:0','-vf',vf,
        '-c:v','libx264','-preset','veryfast','-crf','10','-profile:v','high',
        '-pix_fmt','yuv420p','-threads','4','-fps_mode','cfr',
        '-c:a','aac','-b:a','256k','-ar',str(sr),'-ac','1',
        '-movflags','+faststart','-metadata','title=双头注意力：稳定身份、局部参与与融合',
        '-metadata:s:a:0','language=zho',output/'accessible_course.mp4'])
    # Copy only reusable assets/metadata. Never copy an existing rendered movie.
    if output != assets:
        for name in ['description_plan.json','timeline.json','chapters.json','player_config.json',
                     'revision_audit.json','description.vtt','rebuild.json','rebuild.py',
                     'verify.py','README.md','CREDITS.md','player.html']:
            p=assets/name
            if p.exists():shutil.copy2(p,output/name)
        for c in plan['cues']:
            p=output/c['wav'];p.parent.mkdir(parents=True,exist_ok=True)
            shutil.copy2(assets/c['wav'],p)
            text=(assets/c['wav']).with_suffix('.txt')
            if text.exists():shutil.copy2(text,p.with_suffix('.txt'))
    print(f'Rebuilt {output / "accessible_course.mp4"} from source.mp4 and {len(plan["cues"])} offline WAV assets.')

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--input',required=True)
    p.add_argument('--assets',required=True);p.add_argument('--output',required=True)
    a=p.parse_args();build(a.input,a.assets,a.output)
