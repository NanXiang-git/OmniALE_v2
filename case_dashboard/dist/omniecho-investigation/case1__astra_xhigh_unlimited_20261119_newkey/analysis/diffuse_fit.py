import numpy as np,subprocess,json
from scipy import signal,optimize
sr=48000
x=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i','/candidate/incident.mp4','-map','0:a:0','-f','f32le','-']),dtype=np.float32).reshape(-1,4)
f,t,z=signal.stft(x.T,sr,nperseg=2048,noverlap=1536)
res=[]
for lo,hi in [(700,3000),(1500,3000),(3000,5000)]:
 p=z[:,(f>=lo)&(f<hi)];cv=np.real(np.einsum('ift,jft->ijt',p,p.conj()))
 nc=cv[:,:,abs(t-22.7)<.2].mean(-1)
 print('BAND',lo,hi)
 for sec in [.5,2.5,8.5,9,9.5,10,12,12.5,13,16,21,23.5,25,27.5,34.5,37]:
  c=cv[:,:,abs(t-sec)<.5].mean(-1)-nc;c/=c[0,0]
  def fun(par):
   az,el,g,s,nw,nh,nv=par
   v=np.array([1,g*np.cos(el)*np.sin(az),g*np.sin(el),g*np.cos(el)*np.cos(az)])
   model=s*np.outer(v,v)+np.diag([nw,nh,nv,nh])
   return (model-c).flatten()
  ini=[np.arctan2(c[0,1],c[0,3]),-.1,1,.5,.5,.2,.2]
  fit=optimize.least_squares(fun,ini,bounds=([-np.pi,-np.pi/2,.5,0,0,0,0],[np.pi,np.pi/2,2,2,2,2,2]))
  az,el,g,s,nw,nh,nv=fit.x;print(sec, 'az/el',np.round(np.degrees([az,el]),1), 'g/s/diff',np.round([g,s,nh],2),'resid',round(np.linalg.norm(fit.fun),3))
  res.append({'band':[lo,hi],'time_s':sec,'azimuth':float(np.degrees(az)),'elevation':float(np.degrees(el)),'gain':float(g),'direct_energy':float(s),'diffuse_energy':float(nh),'residual':float(np.linalg.norm(fit.fun))})
json.dump(res,open('/workspace/analysis/diffuse_fit.json','w'),indent=2)
