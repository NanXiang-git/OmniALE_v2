import glob,subprocess,os
import numpy as np
from scipy.io import wavfile
from scipy.signal import stft
from PIL import Image,ImageDraw
for p in glob.glob('/workspace/scratch/references/*.mp3'):
 name=os.path.basename(p).replace('.mp3','');w='/workspace/scratch/references/'+name+'.wav'
 if not os.path.exists(w):subprocess.run(['ffmpeg','-v','error','-i',p,'-ac','1','-ar','16000',w])
 sr,x=wavfile.read(w);x=x.astype(float)/32768
 for a,b in [(0,min(len(x)/sr,25))]:
  f,t,z=stft(x[int(a*sr):int(b*sr)],sr,nperseg=512,noverlap=448);v=20*np.log10(np.maximum(abs(z),1e-8));v=(np.clip((v+85)/60,0,1)*255).astype('uint8');v=v[:225][::-1]
  out=Image.new('RGB',(1530,680),'white');out.paste(Image.fromarray(v).resize((1450,600)),(65,25));d=ImageDraw.Draw(out);d.text((65,5),name,fill='black')
  for tt in np.arange(a,b,1):
   xx=65+int((tt-a)/(b-a)*1450);d.line((xx,25,xx,625),fill='#333333');d.text((xx,633),str(tt),fill='black')
  for ff in range(0,7001,1000):d.text((5,625-int(ff/7000*600)),str(ff),fill='black')
  out.save('/workspace/scratch/references/'+name+'_spec.png')
 print(name,len(x)/sr,flush=True)
