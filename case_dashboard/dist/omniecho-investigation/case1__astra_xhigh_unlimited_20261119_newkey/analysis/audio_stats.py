import numpy as np, soundfile as sf, json
from scipy import signal
from PIL import Image,ImageDraw
import subprocess
sr=48000
x=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i','/candidate/incident.mp4','-map','0:a:0','-f','f32le','-']),dtype=np.float32).reshape(-1,4); print('audio',x.shape,sr)
print('rms',np.sqrt(np.mean(x*x,0)));print('corr',np.corrcoef(x.T))
rows=[]
for t in [0.5,2.5,5,8.5,9,9.5,10,12,12.5,13,16,18,21,25,27.5,30,34.5,37]:
 y=x[max(0,int((t-.15)*sr)):min(len(x),int((t+.15)*sr))]
 cov=y.T@y/len(y);w,v=np.linalg.eigh(cov);a=v[:,-1];a*=np.sign(a[0]);a/=a[0]
 print(t,'rms',np.round(np.sqrt(np.diag(cov)),5),'pca ratio',np.round(a,3),'evals',np.round(w/w.sum(),3))
 rows.append({'time_s':t,'rms':np.sqrt(np.diag(cov)).tolist(),'principal_ratios':a.tolist(),'eigen_fractions':(w/w.sum()).tolist()})
json.dump(rows,open('/workspace/analysis/channel_statistics.json','w'),indent=2)
f,t,z=signal.stft(x[:,0],sr,nperseg=1024,noverlap=768)
zz=np.maximum(-90,20*np.log10(np.abs(z)+1e-12));zz=zz[(f>=100)&(f<10000)]
a=np.uint8(np.clip((zz+90)/60,0,1)*255)[::-1]
im=Image.fromarray(a).resize((1500,600));im=im.convert('RGB');d=ImageDraw.Draw(im)
for sec in range(0,38,2):
 xx=int(sec/37.3333*1500);d.line((xx,0,xx,600),fill=(50,80,100));d.text((xx+2,570),str(sec),fill='white')
im.save('/workspace/analysis/spectrogram.png')
