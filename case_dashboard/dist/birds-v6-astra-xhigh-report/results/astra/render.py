"""Preserve source timestamps, mix authored speech, and burn the matching subtitles.
Reference recordings are never read by this script.
"""
import json, math, re, subprocess, time
from pathlib import Path
import numpy as np
from scipy.io import wavfile
from audit import record, run

ROOT=Path('/workspace/submission'); TMP=Path('/workspace/scratch')
SR=48000
CH=json.load(open('/candidate/chapters.json'))
DURATION=CH['duration']; N=round(DURATION*SR)

def measure(path):
    r=subprocess.run(['ffmpeg','-hide_banner','-i',str(path),'-af',
        'loudnorm=I=-19:TP=-3:LRA=11:print_format=json','-f','null','-'],
        capture_output=True,text=True,check=True)
    return json.loads(r.stderr[r.stderr.rfind('{'):])

def ts(s,ass=False):
    ticks=round(s*(100 if ass else 1000)); base=100 if ass else 1000
    h,ticks=divmod(ticks,3600*base);m,ticks=divmod(ticks,60*base);sec,ms=divmod(ticks,base)
    return f'{h}:{m:02d}:{sec:02d}.{ms:02d}' if ass else f'{h:02d}:{m:02d}:{sec:02d},{ms:03d}'

def main():
    started=time.time()
    plan=json.loads((ROOT/'narration_plan.json').read_text())
    plan.sort(key=lambda a:a['start'])
    narr=np.zeros(N,np.float32); cues=[]; actual=[]; levels=[]
    for item in plan:
        p=TMP/'tts'/f"{item['id']}.wav"
        sr,x=wavfile.read(p);assert sr==SR
        x=x.astype(np.float32)/32768
        level=measure(p)
        gain_db=min(-19-float(level['input_i']),-3-float(level['input_tp']))
        x*=10**(gain_db/20)
        start=round(item['start']*SR); end=start+len(x)
        chapter=CH['segments'][item['segment']-1]
        assert start>=round(chapter['start']*SR) and end<=round(chapter['end']*SR),(item,end/SR)
        assert not np.any(narr[start:end]),'Overlapping voice placements'
        narr[start:end]+=x
        meta=json.loads(p.with_suffix('.json').read_text())
        words=meta['boundaries']
        a=item['start']+words[0]['offset']/1e7
        b=item['start']+(words[-1]['offset']+words[-1]['duration'])/1e7
        # Include synthesis release, but no long encoder tail.
        active=np.flatnonzero(abs(x)>10**(-55/20))
        aa=item['start']+active[0]/SR; bb=item['start']+(active[-1]+1)/SR
        a=min(a,aa);b=max(b,bb)
        actual.append(dict(segment=item['segment'],id=item['id'],start=round(aa,4),end=round(bb,4),text=item['text'],clip_start=item['start'],clip_end=end/SR))
        cues.append(dict(start=max(item['start'],a-.04),end=min(end/SR,b+.12),text=item['text'],segment=item['segment']))
        levels.append(dict(id=item['id'],measured_lufs=float(level['input_i']),measured_true_peak=float(level['input_tp']),gain_db=gain_db,output_peak_dbfs=float(20*np.log10(max(abs(x))))))
    wavfile.write(ROOT/'narration.wav',SR,np.round(narr*32767).astype(np.int16))
    (TMP/'actual_narration.json').write_text(json.dumps(actual,ensure_ascii=False,indent=2))
    (TMP/'narration_levels.json').write_text(json.dumps(levels,indent=2))

    # Same words and times feed both sidecar SRT and the positioned ASS burn-in.
    srt='\n\n'.join(f"{i+1}\n{ts(c['start'])} --> {ts(c['end'])}\n{c['text']}" for i,c in enumerate(cues))+'\n'
    (ROOT/'subtitles.srt').write_text(srt,encoding='utf-8')
    ass='''[Script Info]
ScriptType: v4.00+
PlayResX: 1280
PlayResY: 720
ScaledBorderAndShadow: yes
WrapStyle: 2

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Bottom,WenQuanYi Zen Hei,36,&H00FFFFFF,&H00FFFFFF,&H00181818,&H64000000,0,0,0,0,100,100,0,0,1,2.2,0.7,2,44,44,30,1
Style: Top,WenQuanYi Zen Hei,36,&H00FFFFFF,&H00FFFFFF,&H00181818,&H64000000,0,0,0,0,100,100,0,0,1,2.2,0.7,8,44,44,22,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
'''
    for c in cues:
        style='Top' if c['segment'] in (5,6) else 'Bottom'
        ass+=f"Dialogue: 0,{ts(c['start'],True)},{ts(c['end'],True)},{style},,0,0,0,,{c['text']}\n"
    (TMP/'subtitles.ass').write_text(ass,encoding='utf-8')

    # Gain changes only; no original samples are copied, shifted, replaced or denoised.
    sr,src=wavfile.read(TMP/'original.wav');assert sr==SR
    original=src[:N].astype(np.float32)/32768
    if len(original)<N:original=np.pad(original,((0,N-len(original)),(0,0)))
    base_db=np.zeros(N,np.float32)
    chapter_db=[-8,5,-3,16,16,0]
    for s,db in zip(CH['segments'],chapter_db):
        base_db[round(s['start']*SR):round(s['end']*SR)]=db
    duck_db=np.zeros(N,np.float32)
    for a in actual:
        left=max(0,round((a['start']-.22)*SR));on=round(a['start']*SR)
        off=round(a['end']*SR);right=min(N,round((a['end']+.42)*SR))
        duck_db[left:on]=np.minimum(duck_db[left:on],np.linspace(0,-10,on-left))
        duck_db[on:off]=-10
        duck_db[off:right]=np.minimum(duck_db[off:right],np.linspace(-10,0,right-off))
    gain=(10**((base_db+duck_db)/20)).astype(np.float32)
    adjusted=original*gain[:,None]
    # First limit original-only rare transient peaks, with delay compensation.
    wavfile.write(TMP/'original_gained.wav',SR,adjusted)
    run('Control rare source transients after per-chapter gain',[
        'ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(TMP/'original_gained.wav'),
        '-af','alimiter=limit=0.79:attack=5:release=80:level=false:latency=true',
        '-c:a','pcm_f32le',str(TMP/'original_balanced.wav')])
    sr,balanced=wavfile.read(TMP/'original_balanced.wav');balanced=balanced[:N]
    assert len(balanced)==N
    mix=balanced+narr[:,None]
    wavfile.write(TMP/'premix.wav',SR,mix.astype(np.float32))
    run('Final mix peak control without automatic makeup gain',[
        'ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(TMP/'premix.wav'),
        '-af','alimiter=limit=0.79:attack=5:release=80:level=false:latency=true',
        '-c:a','pcm_s24le',str(TMP/'mix.wav')])
    record('mix_and_subtitles','Compose aligned speech and original soundtrack',started,
        duration=DURATION,sample_rate=SR,original_gain_db_by_chapter=chapter_db,
        narration_duck_db=-10,attack_seconds=.22,release_seconds=.42,
        speech_target_lufs=-19,speech_true_peak_limit_db=-3,
        method='Source-only gain/limiting then speech summation. Two delay-compensated limiters. No music or reference audio. SRT and burn-in have identical text.')

    run('Encode full video timeline with burned Chinese captions',[
        'ffmpeg','-hide_banner','-loglevel','warning','-y',
        '-i','/candidate/birds_source.mp4','-i',str(TMP/'mix.wav'),
        '-map','0:v:0','-map','1:a:0','-map_metadata','-1',
        '-vf',f"fps=fps=30:start_time=0,ass={TMP/'subtitles.ass'}:fontsdir={TMP/'font-package/usr/share/fonts/truetype/wqy'}",
        '-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p',
        '-c:a','aac','-b:a','192k','-ar','48000','-t',f'{DURATION:.9f}',
        '-movflags','+faststart',str(ROOT/'final.mp4')])

if __name__=='__main__':main()
