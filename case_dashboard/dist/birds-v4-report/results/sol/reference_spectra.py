import subprocess,numpy as np
from scipy.signal import stft
from scipy.io import wavfile
from PIL import Image,ImageDraw
for name in ['russet','brownbush','cetti','willow','alder']:
 p=f'/workspace/scratch/reference_{name}';subprocess.run(['ffmpeg','-v','error','-y','-i',p+'.mp3','-ac','1','-ar','24000',p+'.wav'],check=True)
 sr,a=wavfile.read(p+'.wav');x=a.astype(float)/32768
 # First 12 seconds; no matching to source waveform is performed.
 f,t,z=stft(x[:12*sr],sr,nperseg=512,noverlap=448);v=np.clip((20*np.log10(np.abs(z[f<10000])+1e-8)+80)/65,0,1)
 im=Image.fromarray((v[::-1]*255).astype('uint8')).resize((1440,500));out=Image.new('RGB',(1520,550),'white');out.paste(im,(65,10));d=ImageDraw.Draw(out);d.text((5,5),name,fill='black')
 for freq in [0,2000,4000,6000,8000,10000]:d.text((5,505-freq/10000*500),str(freq),fill='black')
 for i in range(13):d.text((65+i*120,520),str(i),fill='black')
 out.save(p+'_spec.png')
