import numpy as np, subprocess,json
from scipy import signal
from PIL import Image,ImageDraw
sr=48000
x=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i','/candidate/incident.mp4','-map','0:a:0','-f','f32le','-']),dtype=np.float32).reshape(-1,4)
f,tt,z=signal.stft(x.T,sr,nperseg=2048,noverlap=1024)
bands=[(200,700),(700,1500),(1500,3000),(3000,5000),(5000,10000),(500,5000),(4000,4300)]
out=[]
for t in np.arange(.5,37.1,.5):
 row={'time_s':t,'bands':[]}
 for lo,hi in bands:
  p=z[:,(f>=lo)&(f<=hi)][:,:,(tt>=t-.25)&(tt<t+.25)]
  cv=np.real(np.einsum('ift,jft->ij',p,p.conj()))
  d=np.array([cv[0,3],cv[0,1],cv[0,2]])
  az=float(np.degrees(np.arctan2(d[1],d[0])));el=float(np.degrees(np.arctan2(d[2],np.linalg.norm(d[:2]))))
  row['bands'].append({'band':[lo,hi],'azimuth':az,'elevation':el,'intensity':d.tolist(),'level':float(cv[0,0]),'directivity':float(np.linalg.norm(d)/cv[0,0])})
 out.append(row)
 if t in [.5,2.5,8.5,9,9.5,12,12.5,13,16,21,25,27.5,34.5,37]:
  print(t,[(r['band'],round(r['azimuth']),round(r['elevation']),round(r['directivity'],2)) for r in row['bands']])
json.dump(out,open('/workspace/analysis/intensity.json','w'),indent=2)
im=Image.new('RGB',(1500,900),'white');d=ImageDraw.Draw(im)
cols=['#b71c1c','#e65100','#4a148c','#1565c0','#006064','#1b5e20','#111111']
for a in range(-180,181,45):
 yy=430-a*2;d.line((50,yy,1475,yy),fill='#dddddd');d.text((5,yy),str(a),fill='black')
for sec in range(0,38,2):
 xx=50+sec*38;d.line((xx,50,xx,790),fill='#dddddd');d.text((xx,800),str(sec),fill='black')
for bi,c in enumerate(cols):
 points=[(50+r['time_s']*38,430-r['bands'][bi]['azimuth']*2) for r in out]
 for a,b in zip(points[:-1],points[1:]):
  if abs(a[1]-b[1])<300:d.line((a,b),fill=c,width=2)
 d.text((80+200*bi,835),str(bands[bi]),fill=c)
d.text((30,15),'Azimuth from real W-X / W-Y cross-spectrum. +left; -right. Channel assumption W,Y,Z,X.',fill='black')
im.save('/workspace/analysis/intensity.jpg')
