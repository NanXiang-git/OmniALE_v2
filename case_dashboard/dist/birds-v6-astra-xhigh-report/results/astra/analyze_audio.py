import json, time
import numpy as np
from scipy.io import wavfile
from scipy import signal
from PIL import Image, ImageDraw, ImageFont
from audit import record

started=time.time()
sr,pcm=wavfile.read('/workspace/scratch/original.wav')
x=pcm.astype(np.float32).mean(axis=1)/32768
chapters=json.load(open('/candidate/chapters.json'))['segments']
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',17)

def spectrogram(a,b,out,maxhz=10000,nfft=1024):
    f,t,z=signal.stft(x[int(a*sr):int(b*sr)],sr,nperseg=nfft,noverlap=nfft-128)
    keep=f<=maxhz
    db=20*np.log10(np.maximum(abs(z[keep]),1e-8))
    hi=np.percentile(db,99.7); lo=hi-65
    v=np.clip((db-lo)/(hi-lo),0,1)
    rgb=np.stack([np.clip(v*2.5,0,1),np.clip(v*2.5-.7,0,1),np.clip(v*3-2,0,1)],-1)
    im=Image.fromarray((rgb[::-1]*255).astype('uint8')).resize((1440,370))
    canvas=Image.new('RGB',(1540,445),'white');canvas.paste(im,(80,30));d=ImageDraw.Draw(canvas)
    d.text((80,4),f'Original audio {a:.2f}-{b:.2f} s | {maxhz} Hz | relative dB {lo:.1f}..{hi:.1f}',font=font,fill='black')
    for fr in np.linspace(0,maxhz,6):
        y=400-fr/maxhz*370;d.text((3,y-8),f'{fr/1000:g}k',font=font,fill='black')
    for tt in np.linspace(a,b,13):
        xx=80+(tt-a)/(b-a)*1440;d.text((xx-20,405),f'{tt:.1f}',font=font,fill='black')
    canvas.save(out)

stats=[]
for s in chapters:
    a,b=s['start'],s['end'];v=x[int(a*sr):int(b*sr)]
    spectrogram(a,b,f"/workspace/scratch/spectrum_{s['segment']}.png")
    stats.append(dict(segment=s['segment'],peak_dbfs=float(20*np.log10(max(abs(v)))),rms_dbfs=float(20*np.log10(np.sqrt(np.mean(v*v))))))
print(json.dumps(stats,indent=2))
json.dump(stats,open('/workspace/scratch/audio_stats.json','w'),indent=2)
record('audio_analysis','Decode PCM and compute STFT spectrograms for all six chapters',started,method='scipy.signal.stft; 1024 sample Hann windows, 128 sample hop; original stereo downmix for analysis only',limitations='No native listening tool; no claim of auditory listening or recognition-model analysis.')
