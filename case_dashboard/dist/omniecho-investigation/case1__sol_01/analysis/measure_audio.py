"""Reproduce bearing_measurements.csv from the host-exported original evidence.
Run: python3 analysis/measure_audio.py
Dependencies: FFmpeg, NumPy, SciPy. No network or model calls.
"""
import csv,json,pathlib,subprocess,numpy as np
from scipy import signal
base=pathlib.Path(__file__).resolve().parent
root=base.parent
receipts=json.loads((root/'evidence_manifest.json').read_text())['evidence']
e=next(e for e in receipts if e['start_s']==0 and e['end_s']>37)
raw=subprocess.run(['ffmpeg','-v','error','-i',str(root/e['path']),'-map','0:a:0','-f','f32le','-c:a','pcm_f32le','-'],capture_output=True,check=True).stdout
x=np.frombuffer(raw,dtype='<f4').reshape(-1,4).astype(float)
f,t,z=signal.stft(x,48000,nperseg=2048,noverlap=1536,axis=0)
np.savez_compressed(base/'stft.npz',f=f,t=t,z=z)
rows=[]
for tt in np.arange(.5,37.01,.5):
 for lo,hi in [(500,3000),(1500,3000)]:
  zz=z[(f>=lo)&(f<hi)][:,:,abs(t-tt)<.25]
  C=np.einsum('fct,fdt->cd',zz,zz.conj()).real
  rows.append(dict(time_s=float(tt),band_low_hz=lo,band_high_hz=hi,azimuth_deg_left_positive=round(float(np.degrees(np.arctan2(C[0,1],C[0,3]))),3),horizontal_cross_power_over_W_power=round(float(np.hypot(C[0,1],C[0,3])/C[0,0]),5)))
with (base/'bearing_measurements_reproduced.csv').open('w') as out:
 w=csv.DictWriter(out,fieldnames=rows[0].keys());w.writeheader();w.writerows(rows)
print('Saved STFT and bearing measurements beside this script. Small differences from the submitted CSV can reflect the exported PCM quantization.')
