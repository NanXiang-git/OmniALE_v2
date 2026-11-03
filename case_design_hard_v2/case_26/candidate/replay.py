"""Pack/replay editable corrections without hidden truth. OpenCV + ffmpeg required."""
import argparse,subprocess,json
from pathlib import Path
import cv2,numpy as np
cv2.setNumThreads(1)
p=argparse.ArgumentParser();p.add_argument('--input',required=True);p.add_argument('--repair');p.add_argument('--master');p.add_argument('--out',required=True);p.add_argument('--strength',type=float,default=1.0);a=p.parse_args();assert bool(a.repair)!=bool(a.master),'choose repair to replay OR master to pack';assert 0<=a.strength<=1
caps=[cv2.VideoCapture(str(x),cv2.CAP_FFMPEG,[cv2.CAP_PROP_N_THREADS,1]) for x in [a.input,a.repair or a.master]];proc=subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','bgr24','-s','640x338','-r','24','-i','-','-an','-c:v','ffv1','-level','3','-threads','2',a.out],stdin=subprocess.PIPE)
for n in range(624):
 x=[]
 for c in caps:
  ok,f=c.read();assert ok and f.shape==(338,640,3);x.append(f.astype(np.float32))
 if a.master:z=np.clip(np.rint((x[1]-x[0])/2)+128,0,255)
 else:z=np.clip(np.rint(x[0]+2*(x[1]-128)*a.strength),0,255)
 proc.stdin.write(z.astype(np.uint8).tobytes())
for c in caps:assert not c.read()[0];c.release()
proc.stdin.close();assert proc.wait()==0
