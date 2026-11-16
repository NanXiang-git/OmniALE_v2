import numpy as np
from scipy.io import wavfile
from scipy.signal import stft, resample_poly
from PIL import Image,ImageDraw
sr,x=wavfile.read('/workspace/scratch/original.wav');x=x.astype(float)/32768
if x.ndim==2:x=x.mean(axis=1)
np.save('/workspace/scratch/audio_mono.npy',x)
chap=[(0,46.066667),(46.066667,72.8),(72.8,100.766667),(100.766667,123.966667),(123.966667,158.466667),(158.466667,185.466667)]
for j,(a,b) in enumerate(chap,1):
 y=resample_poly(x[int(a*sr):int(b*sr)],1,3)
 f,t,z=stft(y,16000,nperseg=512,noverlap=448);v=20*np.log10(np.maximum(abs(z),1e-7));v=np.clip((v+85)/65,0,1)
 v=v[:225];v=v[::-1];v=(v*255).astype('uint8')
 im=Image.fromarray(v).resize((1450,600));out=Image.new('RGB',(1530,680),'white');out.paste(im,(65,25));d=ImageDraw.Draw(out)
 for tt in np.arange(0,b-a,2):
  xx=65+int(tt/(b-a)*1450);d.line((xx,25,xx,625),fill='#444444',width=1);d.text((xx,633),f'{a+tt:.1f}',fill='black')
 for ff in range(0,7001,1000):
  yy=625-int(ff/7000*600);d.text((5,yy),f'{ff}',fill='black')
 d.text((65,5),f'CHAPTER {j} spectrogram (Hz / seconds on full timeline)',fill='black');out.save(f'/workspace/scratch/spec{j}.png')
 print(j,'RMS',np.sqrt(np.mean(y*y)),'peak',abs(y).max())
