import numpy as np,subprocess,json
from scipy import signal
sr=48000
x=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i','/candidate/incident.mp4','-map','0:a:0','-f','f32le','-']),dtype=np.float32).reshape(-1,4)
f,t,z=signal.stft(x.T,sr,nperseg=2048,noverlap=1536)
I=(z[0:1].conj()*z[[3,1,2]]).real
P=abs(z[0])**2;V=(abs(z[1:])**2).sum(0);D=np.linalg.norm(I,axis=0)
az=np.degrees(np.arctan2(I[1],I[0]));el=np.degrees(np.arctan2(I[2],np.linalg.norm(I[:2],axis=0)))
# SN3D plane-wave coherence: zero imaginary cross-products; equal total directional / omni power.
gamma=2*D/(P+V+1e-18)
res=[]
for sec in [.5,2.5,8.5,9,9.5,10,12,12.5,13,16,21,23.5,25,27.5,34.5,36.5,37]:
 print('TIME',sec)
 for lo,hi in [(500,3000),(1000,3000),(1500,3000),(3000,5000)]:
  vals=[]
  for threshold in [.4,.6,.8,.9]:
   mask=(f[:,None]>lo)&(f[:,None]<hi)&(abs(t[None,:]-sec)<.5)&(gamma>threshold)&(abs(el)<30)
   hist,bins=np.histogram(az[mask],bins=180,range=(-180,180),weights=D[mask])
   hist=signal.convolve(np.r_[hist[-10:],hist,hist[:10]],signal.windows.gaussian(21,4),mode='valid')
   val=-179+2*np.argmax(hist);vals.append(val)
   res.append({'time_s':sec,'band':[lo,hi],'threshold':threshold,'azimuth_mode':int(val),'weight':float(np.sum(hist))})
  print((lo,hi),vals)
json.dump(res,open('/workspace/analysis/robust_direction.json','w'),indent=2)
