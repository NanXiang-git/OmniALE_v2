"""Public deterministic preview renderer. No hidden reference required."""
import argparse,zipfile,subprocess
from pathlib import Path
import cv2,numpy as np
p=argparse.ArgumentParser();p.add_argument('--rgba',required=True);p.add_argument('--background',required=True);p.add_argument('--out',required=True);a=p.parse_args()
def lin(x):return np.where(x<=.04045,x/12.92,((x+.055)/1.055)**2.4)
def enc(x):return np.where(x<=.0031308,x*12.92,1.055*np.maximum(x,0)**(1/2.4)-.055)
b=cv2.imread(a.background).astype(np.float32)/255
proc=subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','bgr24','-s','512x288','-r','25','-i','-','-an','-c:v','libx264','-crf','16','-pix_fmt','yuv420p','-threads','2',a.out],stdin=subprocess.PIPE)
with zipfile.ZipFile(a.rgba) as z:
 for n in range(100):
  r=cv2.imdecode(np.frombuffer(z.read(f'{n:04}.png'),np.uint8),-1);assert r.shape==(288,512,4) and r.dtype==np.uint8
  alpha=r[:,:,3:4]/255.;x=lin(r[:,:,:3]/255.)*alpha+lin(b)*(1-alpha);proc.stdin.write(np.clip(enc(x)*255+.5,0,255).astype(np.uint8).tobytes())
proc.stdin.close();assert proc.wait()==0
