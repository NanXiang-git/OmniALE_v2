from pathlib import Path
import numpy as np
q=np.load(str(Path(__file__).resolve().parent/'stft.npz'));f,t,z=q['f'],q['t'],q['z']
def cov(a,b,lo,hi):
 zz=z[(f>=lo)&(f<hi)][:,:, (t>=a)&(t<b)];return np.einsum('fct,fdt->cd',zz,zz.conj()).real/zz.shape[-1]
for lo,hi in [(400,1500),(1500,3000),(500,3000)]:
 print('band',lo,hi)
 for a,b in [(0,.15),(10.8,11.1),(11.1,11.4),(11.4,11.7),(21.4,21.7),(21.7,22),(22,22.3)]:
  c=cov(a,b,lo,hi);print('bg',a,b,'p',c[0,0], 'az',np.degrees(np.arctan2(c[0,1],c[0,3])),'i',c[0,[1,3]])
 for a,b in [(12.3,12.7),(12.8,13.2),(15.8,16.2),(20.8,21.2),(24.8,25.2),(27.3,27.7),(34.3,34.7)]:
  c=cov(a,b,lo,hi);print('obs',a,b,'p',c[0,0], 'rawaz',round(np.degrees(np.arctan2(c[0,1],c[0,3])),1))
  for ba,bb in [(0,.15),(11.1,11.4),(21.7,22)]:
   d=c-cov(ba,bb,lo,hi);print(' sub',ba,'az',round(np.degrees(np.arctan2(d[0,1],d[0,3])),1),'p',d[0,0])
