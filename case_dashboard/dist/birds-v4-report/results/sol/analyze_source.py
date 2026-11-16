#!/usr/bin/env python3
"""Reproduce the actual local sample analysis used to inspect source sounds.
No model or remote service is invoked. Frequency pictures are not direct hearing.
"""
import json,pathlib,numpy as np
from scipy.io import wavfile
from scipy.signal import stft
from PIL import Image,ImageDraw
W=pathlib.Path('/workspace/scratch');B=pathlib.Path('/workspace/submission');sr,a=wavfile.read(W/'original.wav');x=a.astype(float).mean(axis=1)/32768
stats=[]
for s in json.load(open('/candidate/chapters.json'))['segments']:
 y=x[round(s['start']*sr):round(s['end']*sr)]
 f,t,z=stft(y,sr,nperseg=1024,noverlap=768);db=20*np.log10(np.abs(z)+1e-7);v=np.clip((db[f<12000]+85)/65,0,1)
 im=Image.fromarray((v[::-1]*255).astype('uint8')).resize((1500,500));out=Image.new('RGB',(1600,580),'white');out.paste(im,(70,25));d=ImageDraw.Draw(out)
 for freq in range(0,12001,2000):d.text((5,520-freq/12000*500),str(freq),fill='black')
 for sec in range(0,int(s['end']-s['start'])+1,2):d.text((70+sec/(s['end']-s['start'])*1500,535),f'{s["start"]+sec:.1f}',fill='black')
 out.save(B/'audit'/'source_spectrograms'/f'spec{s["segment"]}.png')
 stats.append({'segment':s['segment'],'rms_dbfs':float(20*np.log10(np.sqrt(np.mean(y*y))+1e-9)),'peak_dbfs':float(20*np.log10(np.max(np.abs(y))+1e-9))})
(B/'source_audio_stats.json').write_text(json.dumps(stats,indent=2))
