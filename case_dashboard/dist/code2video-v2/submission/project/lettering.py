"""Real vector glyph outlines bent continuously onto the mark's curves."""
import cairo
import json
import re
import numpy as np
from .drawing import path, group, ROOT
from .geometry import Curve


def reverse(c):
    starts=[c.start]+[s[2] for s in c.segments[:-1]]
    seg=[(b,a,p) for (a,b,_),p in reversed(list(zip(c.segments,starts)))]
    return Curve(c.segments[-1][2],seg)


class Lettering:
    def __init__(self):
        # A font is bundled for clean rebuilds; fontconfig is set by render.py.
        surf=cairo.ImageSurface(cairo.FORMAT_A8,16,16)
        self.ctx=cairo.Context(surf)
        self.ctx.select_font_face('DejaVu Sans', cairo.FONT_SLANT_NORMAL,cairo.FONT_WEIGHT_BOLD)
        self.ctx.set_font_size(100)
        self.glyphs={}
        for ch in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ':
            self.ctx.new_path();self.ctx.move_to(0,0);self.ctx.text_path(ch)
            # Flattened outlines bend through the arc, including each counter.
            self.ctx.set_tolerance(.3)
            p=list(self.ctx.copy_path_flat());ext=self.ctx.path_extents()
            self.glyphs[ch]=(p,ext)
        # The principal words use purpose-drawn, soft, extra-heavy outlines.
        custom=json.loads((ROOT/'assets/lettering.json').read_text())
        for ch,d in custom.items():
            if len(ch)!=1:continue
            tokens=re.findall(r'[MLCZ]|-?\d+(?:\.\d+)?',d)
            p=[];i=0;pos=np.zeros(2);origin=pos.copy()
            while i<len(tokens):
                op=tokens[i];i+=1
                if op in ('M','L'):
                    pos=np.array([float(tokens[i]),float(tokens[i+1])]);i+=2
                    p.append((cairo.PATH_MOVE_TO if op=='M' else cairo.PATH_LINE_TO,tuple(pos)))
                    if op=='M':origin=pos.copy()
                elif op=='C':
                    values=list(map(float,tokens[i:i+6]));i+=6
                    a,b,q=np.array(values).reshape(3,2)
                    for u in np.linspace(0,1,13)[1:]:
                        xy=(1-u)**3*pos+3*(1-u)**2*u*a+3*(1-u)*u*u*b+u**3*q
                        p.append((cairo.PATH_LINE_TO,tuple(xy)))
                    pos=q
                else:p.append((cairo.PATH_CLOSE_PATH,()));pos=origin.copy()
            self.glyphs[ch]=(p,(0,0,100,100))

    def word(self,curve,text,a,b,height=83,fill='#ff9c00',stroke='#211118',sw=1.25):
        if b<=a:return ''
        weights=[.5 if c==' ' else (0.52 if c=='I' else 1.0) for c in text]
        total=sum(weights)
        unit=(b-a)/total
        cursor=a
        out=''
        for ch,weight in zip(text,weights):
            width=unit*weight
            if ch!=' ':
                poly,ext=self.glyphs[ch]
                x0,y0,x1,y1=ext
                body=''
                for typ,coords in poly:
                    if typ==cairo.PATH_CLOSE_PATH:
                        body+='Z';continue
                    xx,yy=coords
                    d=cursor+width*((xx-x0)/(x1-x0))
                    local_height=height(d) if callable(height) else height
                    offset=((yy-y0)/(y1-y0)-.5)*local_height
                    pos,tangent=curve.at(d)
                    q=pos+np.array([-tangent[1],tangent[0]])*offset
                    body+=('M' if typ==cairo.PATH_MOVE_TO else 'L')+f'{q[0]:.2f},{q[1]:.2f}'
                # Rounded expansion gives the dense, puffy hand lettering.
                out+=path(body,fill,stroke,sw)
            cursor+=width
        return out

    def repeated(self,curve,text,spans,fill='#ff9c00',height=83):
        return ''.join(self.word(curve,text,a,b,height,fill) for a,b in spans)
