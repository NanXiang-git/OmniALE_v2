import numpy as np,subprocess,json
from scipy import signal,linalg
from PIL import Image,ImageDraw
sr=48000
x=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i','/candidate/incident.mp4','-map','0:a:0','-f','f32le','-']),dtype=np.float32).reshape(-1,4)
f,t,z=signal.stft(x.T,sr,nperseg=2048,noverlap=1536)
res=[]
for lo,hi in [(500,3000),(700,1500),(1500,3000),(3000,5000)]:
 p=z[:,(f>=lo)&(f<hi)];cv=np.real(np.einsum('ift,jft->ijt',p,p.conj()))
 noise=cv[:,:,abs(t-22.7)<.2].mean(-1)
 for sec in np.arange(.5,37.01,.25):
  raw=cv[:,:,abs(t-sec)<.5].mean(-1)
  c=raw-noise
  w,v=np.linalg.eigh(c);a=v[:,-1];a*=np.sign(a[0]);a/=a[0]
  direct=np.linalg.norm(c[0,1:])/c[0,0]
  az=np.degrees(np.arctan2(c[0,1],c[0,3]));el=np.degrees(np.arctan2(c[0,2],np.hypot(c[0,1],c[0,3])))
  azp=np.degrees(np.arctan2(a[1],a[3]));elp=np.degrees(np.arctan2(a[2],np.hypot(a[1],a[3])))
  res.append({'time_s':float(sec),'band':[lo,hi],'azimuth':float(az),'elevation':float(el),'pca_azimuth':float(azp),'pca_elevation':float(elp),'level':float(raw[0,0]),'directivity':float(direct),'eigenvalues':w.tolist()})
  if sec in [.5,2.5,8.5,9,9.5,10,12,12.5,13,16,21,23.5,25,27.5,34.5,36.5,37] and lo in [500,1500]:
   print(lo,hi,sec,'az',round(az,1),'pca',round(azp,1),'el',round(el,1),'pcael',round(elp,1),'direct',round(direct,2),'eig',np.round(w/w.sum(),2))
json.dump(res,open('/workspace/analysis/source_tracks.json','w'),indent=2)
