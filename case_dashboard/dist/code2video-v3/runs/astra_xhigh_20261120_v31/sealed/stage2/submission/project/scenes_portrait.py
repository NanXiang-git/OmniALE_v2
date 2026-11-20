"""Live portrait, true alpha, logo-shaped aperture, glass foreground and moving color slices."""
import math,functools
import cv2,numpy as np
from scipy.spatial import cKDTree
from .drawing import *

class PortraitScene:
 def __init__(self,cfg):
  self.cfg=cfg;self.objects=__import__('json').loads((ROOT/'objects.json').read_text());self.big=sample_curve(cfg['curves']['large']);self.small=sample_curve(cfg['curves']['small']);self.cache={}
  self.yy,self.xx=np.mgrid[:H,:W].astype(np.float32)
 def aperture(self):
  if 'aperture' not in self.cache:
   m=Canvas();m.shape([(505,604),(505,399,638,282,803,283),(877,204,994,140,1110,145),(1313,129,1491,313,1491,503),(1555,706,1408,927,1127,914),(1035,940,914,921,844,943),(655,970,493,813,505,604),'z'],'#ffffff')
   # A segmented contour provides the thin stepped silhouette of the optical ring.
   m.shape([(1279,177),(1295,158),(1362,208),(1348,229),'z'],'#ffffff');m.shape([(1478,463),(1512,457),(1516,579),(1493,592),'z'],'#ffffff')
   self.cache['aperture']=m.array()[...,3]
  return self.cache['aperture']
 def reveal(self,f):
  x=self.xx;y=self.yy
  thresholds=np.array([1370,1310,1430,1300,1450,1350,1480,1410],np.float32)
  row=np.clip(((y-132)//133).astype(int),0,7)
  edge=thresholds[row]-max(0,f-107)*94
  mask=np.clip((x-edge)/3+.5,0,1)
  if f>139:
   edgeout=400+(f-140)*60+np.array([0,30,-80,110,-40,80,0,70])[row]
   mask*=np.clip((x-edgeout)/5+.5,0,1)
  return mask
 def satin_background(self,f):
  x,y=self.xx,self.yy
  a=np.arctan2(y-540,x-1090);r=np.sqrt((x-1090)**2+(y-540)**2)
  glow=np.exp(-((r-355)/47)**2)
  ridge=(.5+.5*np.sin(a*8+r*.035+f*.045))**5
  warm=np.clip((y-380)/420,0,1)
  col=np.zeros((H,W,3),np.float32)
  col[:,:,0]=.025+.12*warm+glow*(.16+.53*warm)+ridge*glow*.21
  col[:,:,1]=.008+.035*warm+glow*(.04+.29*warm)+ridge*glow*.10
  col[:,:,2]=.025+.06*(1-warm)+glow*(.23-.19*warm)+ridge*glow*.10
  rgba=np.dstack((np.uint8(np.clip(col*255,0,255)),self.aperture()))
  return rgba
 def glass(self,which,f):
  pts=self.big if which=='large' else self.small
  if which not in self.cache:
   # Surface coordinates of an editable swept round profile.
   xx,yy=self.xx,self.yy
   d,i=cKDTree(pts).query(np.c_[xx.ravel(),yy.ravel()],workers=4)
   d=d.reshape(H,W);i=i.reshape(H,W);q=pts[i];tan=np.gradient(pts,axis=0)[i];tan/=np.linalg.norm(tan,axis=-1,keepdims=True)
   signed=(xx-q[:,:,0])*(-tan[:,:,1])+(yy-q[:,:,1])*tan[:,:,0]
   self.cache[which]=(d.astype(np.float32),i.astype(np.float32)/(len(pts)-1),signed.astype(np.float32))
  d,u,signed=self.cache[which];v=signed/51
  edge=np.clip((53-d)/1.4,0,1)
  warm=np.clip((self.yy-310)/500,0,1)
  colors=[(.20,.07,.42),(.43,.19,.47),(.79,.40,.36),(1,.83,.55)]
  base=np.empty((H,W,3),np.float32)
  for ch in range(3):base[...,ch]=np.interp(warm,[0,.35,.67,1],[x[ch] for x in colors])
  shine=.18*np.exp(-((v+.72)/.22)**2)+.43*np.exp(-((v-.84)/.07)**2)
  reflection=.05*np.sin(v*5+u*9+f*.025)
  base=base*(.76+.22*np.sqrt(np.clip(1-v*v,0,1)))[...,None]+(shine+reflection)[...,None]
  al=edge*(.42+.27*np.abs(np.clip(v,-1,1))+.22*warm)
  return np.dstack([np.uint8(np.clip(base*255,0,255)),np.uint8(al*255)])
 def portrait(self,f):
  c=Canvas()
  if not 108<=f<=159:return c
  bg=self.satin_background(f);c.image(bg)
  glassbig=self.glass('large',f);c.image(glassbig)
  if f<=150:
   idx=24+f-108;rgba=cv2.cvtColor(cv2.imread(str(ROOT/f'assets/portrait/{idx:04}.png'),cv2.IMREAD_UNCHANGED),cv2.COLOR_BGRA2RGBA)
   # Preserve head proportions, extending the lower shirt mesh to the bottom of the window.
   scale=self.cfg['portrait']['scale'];yh,xw=np.mgrid[:780,:int(960*scale)].astype(np.float32)
   head_end=400*scale;sy=np.where(yh<head_end,yh/scale,400+(yh-head_end)/((780-head_end)/140)).astype(np.float32);sx=xw/scale
   person=cv2.remap(rgba,sx,sy,cv2.INTER_LINEAR,borderMode=cv2.BORDER_CONSTANT)
   c.image(person,*self.cfg['portrait']['translate'])
  # The true person alpha is combined with the independently editable logo aperture.
  a=c.array();a[...,3]=np.uint8(a[...,3].astype(np.float32)*self.aperture()/255)
  c=Canvas();c.image(a)
  glassfront=glassbig.copy();glassfront[...,3]=np.uint8(glassfront[...,3]*np.clip((self.yy-385)/85,0,1));c.image(glassfront);c.image(self.glass('small',f))
  a=c.array();a[...,3]=np.uint8(a[...,3]*self.reveal(f))
  return a
 def slices(self,f,back=False):
  c=Canvas()
  if f<92 or f>155:return c
  # Independently translated strips, with shared row boundaries across the transition.
  keys=self.objects['slice_keyframes']
  rows=[(v['y'],v['x_keys'],v['width_keys'],v['row_index']) for v in self.objects['slices']]
  for y,xs,ws,i in rows:
   if back!=(i==0):continue
   x=float(np.interp(f,keys,xs));w=float(np.interp(f,keys,ws));h=133
   if w<1:continue
   if i==0:stops=[(0,'#f59d13'),(.235,'#f5a11d'),(.236,'#a891ff'),(.49,'#6827f5'),(.491,'#a78fff'),(.75,'#7230fc'),(1,'#6b1af5')]
   elif i==1:stops=[(0,'#e238e6'),(.34,'#f349bd'),(.70,'#fa696a'),(1,(1,1,1,0))]
   elif i==2:stops=[(0,'#121412'),(.055,'#a0a6a5'),(.056,'#eb42df'),(.40,'#ee41c0'),(.7,'#f86c6a'),(1,'#b424e5')]
   elif i==3:stops=[(0,'#a193f1'),(.4,'#a390ff'),(.57,'#409ef1'),(.58,'#ec2300'),(.68,'#ffb200'),(.73,'#e92c00'),(.77,'#6333e7'),(1,'#9a7ef9')]
   else:stops=[(0,'#ed2000'),(.05,'#f8a119'),(.08,'#ffd674'),(.081,'#ed65ef'),(.42,'#ee49d4'),(.75,'#ec35cf'),(1,(1,.7,.94,0))]
   if i==4 and 119<=f<=137 and w>400:
    # Two foreground blades leave a moving central aperture onto the person.
    gap0=x+w*.34;gap1=x+w*.67
    c.c.save();c.c.rectangle(x,y,gap0-x,h);c.c.rectangle(gap1,y,x+w-gap1,h);c.c.clip();c.rect(x,y,w,h,gradient=((x,y,x+w,y),stops));c.c.restore()
    c.rect(gap1,y,min(92,w*.15),h,gradient=((gap1,y,gap1+92,y),[(0,'#cf0b00'),(.35,'#ffbd00'),(.72,'#fa4b00'),(1,'#c02bdc')]))
   else:c.rect(x,y,w,h,gradient=((x,y,x+w,y),stops))
   if i==2 and f<127:
    # Metallic blue/violet narrow sub-slices with a single black cut.
    for j in range(4):
     xx=x+w*.42+j*60
     if xx<x+w:c.rect(xx,y,min(60,x+w-xx),h,gradient=((xx,y,xx+60,y),[(0,'#9c8bf8'),(.45,'#6f33f5'),(1,'#3417cb')]))
    c.rect(min(x+w-24,x+w*.69),y,42,h,'#080709')
  return c
 def ornaments(self,f):
  c=Canvas()
  if not 105<=f<=144:return c
  k=ease((f-105)/6)*(1-ease((f-136)/8))
  if not k:return c
  # Acid green orbit, diamond markers, and a spectral torus.
  c.c.save();c.c.translate(960,540);c.c.scale(k,k);c.c.translate(-960,-540)
  c.line([(374,624),(393,414,593,363,718,473)],'#ceff28',6)
  c.line([(1400,728),(1375,959,1269,1029,989,1023)],'#b9ff21',6)
  for x,y,s in [(720,486,35),(1040,1018,27)]:c.shape([(x,y-s),(x+s,y),(x,y+s),(x-s,y),'z'],gradient=((x-s,y+s,x+s,y-s),[(0,'#1da2eb'),(.55,'#c7ff22'),(1,'#f8ff20')]))
  for x,y,r in [(774,803,33),(857,1014,15)]+([(747,335,31)] if f<121 else []):
   xx=x+10*math.sin(f*.14+y);c.ellipse(xx,y,r,r,gradient=((xx-10,y-10,1,xx,y,r*1.3),[(0,'#dcff19'),(.45,'#f7f928'),(1,'#f47912')],True))
  # Shaded cross section of a spectral torus, with animated angular color phase.
  ty,tx=np.mgrid[:212,:212].astype(float);dx,dy=tx-106,ty-106;radius=np.hypot(dx,dy);ang=(np.arctan2(dy,dx)+(f-128)*.10)%(2*math.pi)
  stops=[(0,'#9df31b'),(.24,'#f6b70b'),(.48,'#adb5ac'),(.66,'#310091'),(.83,'#4d08b7'),(1,'#9df31b')]
  v=(radius-71.5)/30.5;shade=.70+.30*np.sqrt(np.clip(1-v*v,0,1));color=np.stack([np.interp(ang/(2*math.pi),[q[0] for q in stops],[rgb(q[1])[ch] for q in stops]) for ch in range(3)],axis=-1)*shade[...,None]
  alpha=np.clip(102.5-radius,0,1)*np.clip(radius-40.5,0,1)
  c.image(np.dstack([np.uint8(np.clip(color*255,0,255)),np.uint8(alpha*255)]),363,783)
  c.c.restore()
  if f<121:
   x,y=1370,265;c.line([(1320,920),(1400,822,1432,656,1380,450),(1370,372),(1362,307)],'#c7fa27',5)
   for j in range(8):
    a=j*math.pi/4;c.ellipse(x+54*math.cos(a),y+38*math.sin(a),59,24,gradient=((x,y,x+100,y+30),[(0,'#ffdd25'),(1,'#f5734d')]),angle=a)
   c.ellipse(x,y,34,25,gradient=((x-15,y-14,1,x,y,40),[(0,'#a17efb'),(.6,'#5b28e1'),(1,'#271d9e')],True))
  return c
