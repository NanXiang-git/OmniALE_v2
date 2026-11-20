"""One continuous live-action layer, a window alpha, and an additive head aperture.

The aperture changes independently of the actor's source clock. The foreground
glass and color blades are composited afterwards. No duplicate head is drawn.
"""
import functools
import cv2
import numpy as np
from .drawing import Canvas, ROOT, W, H
from .scenes_portrait import PortraitScene


class RevisionPortraitScene(PortraitScene):
    @functools.lru_cache(maxsize=48)
    def source_rgba(self, idx):
        return cv2.cvtColor(cv2.imread(str(ROOT/f'assets/portrait/{idx:04}.png'),cv2.IMREAD_UNCHANGED),cv2.COLOR_BGRA2RGBA)

    def person_image(self, f):
        idx = float(np.clip(24+f-108,24,66))
        lo=int(np.floor(idx));hi=min(66,lo+1);u=idx-lo
        if u<1e-8:
            rgba=self.source_rgba(lo)
        else:
            # Interpolate neighboring source samples in premultiplied alpha.
            a=self.source_rgba(lo).astype(np.float32)/255
            b=self.source_rgba(hi).astype(np.float32)/255
            alpha=a[...,3:]*(1-u)+b[...,3:]*u
            color=(a[...,:3]*a[...,3:]*(1-u)+b[...,:3]*b[...,3:]*u)/np.maximum(alpha,1e-6)
            rgba=np.uint8(np.clip(np.dstack([color,alpha]),0,1)*255)
        scale=self.cfg['portrait']['scale']
        if 'person_mesh' not in self.cache:
            yh,xw=np.mgrid[:780,:int(960*scale)].astype(np.float32)
            head_end=400*scale
            sy=np.where(yh<head_end,yh/scale,400+(yh-head_end)/((780-head_end)/140)).astype(np.float32)
            self.cache['person_mesh']=(xw/scale,sy)
        sx,sy=self.cache['person_mesh']
        return cv2.remap(rgba,sx,sy,cv2.INTER_LINEAR,borderMode=cv2.BORDER_CONSTANT)

    def local_reveal(self, f, alpha):
        """The same right-to-left sliced mechanism, completing at source 132.

        Only the aperture is retimed. Video samples always use 24+f-108.
        Row boundaries match the independently moving color blades.
        """
        if f>=132:
            return np.ones((H,W),np.float32)
        mask=np.zeros((H,W),np.float32)
        finishes=[130,131,132,131.5,132,131,130,129]
        thresholds=[1370,1310,1430,1300,1450,1350,1480,1410]
        for row in range(8):
            y0=max(0,132+row*133) if row else 0
            y1=min(H,132+(row+1)*133)
            occupied=np.flatnonzero(alpha[y0:y1].sum(axis=0)>2)
            if not len(occupied):continue
            left,right=float(occupied[0]),float(occupied[-1])
            start=107+min(row,5)
            u=np.clip((f-start)/(finishes[row]-start),0,1)**2
            edge=(max(thresholds[row],right+3))*(1-u)+(left-3)*u
            mask[y0:y1]=np.clip((self.xx[y0:y1]-edge)/3+.5,0,1)
        return mask

    def person_layers(self, f, lift=0):
        empty=np.zeros((H,W,4),np.uint8)
        self.full_person_area=0.
        if not 108<=f<=150:
            return empty,np.zeros((H,W),np.uint8),0.
        c=Canvas();x,y=self.cfg['portrait']['translate']
        c.image(self.person_image(f),x,y-lift)
        person=c.array()
        self.full_person_area=float(person[...,3].sum())
        window=self.aperture().astype(np.float32)/255
        if lift>0:
            raised=cv2.warpAffine(window,np.float32([[1,0,0],[0,1,-lift]]),(W,H),flags=cv2.INTER_LINEAR)
            # Extend the back window upwards only around the head. The torso
            # retains the unmodified aperture even while the person rises.
            head_zone=(self.yy<370)&(self.xx>860)&(self.xx<1320)
            window=np.maximum(window,raised*head_zone)
        local=self.local_reveal(f,person[...,3].astype(np.float32)/255)
        reveal=local*self.reveal(f)
        alpha=person[...,3].astype(np.float32)*window*reveal
        denom=float(np.sum(person[...,3].astype(np.float32)*window))
        visible=float(alpha.sum()/denom) if denom else 0.
        overflow=np.uint8(person[...,3].astype(np.float32)*reveal*np.maximum(window-self.aperture().astype(np.float32)/255,0))
        person[...,3]=np.uint8(alpha)
        return person,overflow,visible

    def portrait(self, f, lift=0):
        c=Canvas()
        self.last_person=None;self.last_overflow=None;self.last_visibility=0.
        if not 108<=f<=159:return c
        if f>=150:
            self.last_person,self.last_overflow,self.last_visibility=self.person_layers(f,0)
            reveal=self.reveal(f)
            ga=self.glass('large',f)[...,3].astype(np.float32)/255*np.clip((self.yy-385)/85,0,1)*reveal
            sa=self.glass('small',f)[...,3].astype(np.float32)/255*reveal
            self.foreground_transmission=(1-ga)*(1-sa)
            return super().portrait(int(round(f)))
        window=self.aperture().astype(np.float32)/255
        reveal=self.reveal(f)
        bg=self.satin_background(f);bg[...,3]=np.uint8(bg[...,3]*reveal);c.image(bg)
        glass=self.glass('large',f)
        back=glass.copy();back[...,3]=np.uint8(back[...,3]*window*reveal);c.image(back)
        person,overflow,visible=self.person_layers(f,lift)
        self.last_person=person;self.last_overflow=overflow;self.last_visibility=visible
        c.image(person)
        # These foreground layers remain above the union of body and head.
        front=glass.copy();front[...,3]=np.uint8(front[...,3]*np.clip((self.yy-385)/85,0,1)*reveal)
        c.image(front)
        small=self.glass('small',f);small[...,3]=np.uint8(small[...,3]*reveal);c.image(small)
        self.foreground_transmission=(1-front[...,3].astype(np.float32)/255)*(1-small[...,3].astype(np.float32)/255)
        return c
