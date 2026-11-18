from pathlib import Path
import numpy as np,soundfile as sf
from scipy import signal
x,sr=sf.read('/workspace/analysis/audio.wav')
f,t,z=signal.stft(x,sr,nperseg=2048,noverlap=1536,axis=0)
# z freq,channel,time
print('zshape',z.shape)
np.savez_compressed(str(Path(__file__).resolve().parent/'stft.npz'),f=f,t=t,z=z)
for a,b in [(0.5,1),(2.25,2.75),(8.25,8.75),(8.75,9.25),(9.25,9.75),(10,10.5),(12.25,12.75),(12.75,13.25),(15.75,16.25),(20.75,21.25),(24.75,25.25),(27.25,27.75),(34.25,34.75),(36.5,37)]:
 print('\nT',a,b)
 for lo,hi in [(100,500),(500,1500),(1500,3000),(3000,6000),(6000,10000),(10000,16000),(16000,22000),(300,20000)]:
  zz=z[(f>=lo)&(f<hi)][:,:, (t>=a)&(t<b)];C=np.einsum('fct,fdt->cd',zz,zz.conj()).real
  r=C[0];angle=np.degrees(np.arctan2(r[1],r[3]));elev=np.degrees(np.arctan2(r[2],np.hypot(r[1],r[3])))
  print(lo,hi,'az',round(angle,1),'el',round(elev,1),'rms',np.round(np.sqrt(C.diagonal()),3),'int',np.round(r[1:]/r[0],2))
