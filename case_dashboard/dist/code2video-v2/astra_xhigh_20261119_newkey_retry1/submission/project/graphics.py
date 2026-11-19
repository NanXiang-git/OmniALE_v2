"""Editable Cairo geometry, sampling, gradients and compositing primitives."""
import math, re
from functools import lru_cache
import numpy as np
import cairo
import cv2
W,H=1920,1080

def rgb(c):
    if isinstance(c,str):
        c=c.lstrip('#');c=''.join(v*2 for v in c) if len(c)==3 else c;return tuple(int(c[i:i+2],16)/255 for i in (0,2,4))+(1.,)
    c=tuple(c)
    return c+(1.,) if len(c)==3 else c

def mix(a,b,t):
    a=rgb(a);b=rgb(b);return tuple(x*(1-t)+y*t for x,y in zip(a,b))

def source(ctx,paint):
    if isinstance(paint,dict):
        if 'radial' in paint:
            p=cairo.RadialGradient(*paint['radial'])
        else:p=cairo.LinearGradient(*paint['linear'])
        for stop,col in paint['stops']:p.add_color_stop_rgba(stop,*rgb(col))
        ctx.set_source(p)
    else:ctx.set_source_rgba(*rgb(paint))

def linear(x1,y1,x2,y2,*colors):
    return {'linear':[x1,y1,x2,y2], 'stops':[(i/(len(colors)-1),c) for i,c in enumerate(colors)]}

def radial(x,y,r,*colors):
    return {'radial':[x,y,0,x,y,r], 'stops':[(i/(len(colors)-1),c) for i,c in enumerate(colors)]}

@lru_cache(maxsize=1024)
def parse(d):
    tok=re.findall(r'[MLCQZmlcqz]|[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?',d)
    out=[];i=0;cmd='M';last=(0,0);start=(0,0)
    sizes={'M':2,'L':2,'C':6,'Q':4,'Z':0}
    while i<len(tok):
        if tok[i].isalpha():cmd=tok[i].upper();i+=1
        n=sizes[cmd]
        if not n:out.append(('Z',()));last=start;cmd='M';continue
        vals=tuple(float(v) for v in tok[i:i+n]);i+=n
        if cmd=='Q':
            x,y=last;qx,qy,ex,ey=vals
            vals=(x+2/3*(qx-x),y+2/3*(qy-y),ex+2/3*(qx-ex),ey+2/3*(qy-ey),ex,ey);op='C'
        else:op=cmd
        out.append((op,vals));last=vals[-2:]
        if cmd=='M':start=last;cmd='L'
    return tuple(out)

def path(ctx,d):
    ctx.new_path()
    for op,v in parse(d) if isinstance(d,str) else d:
        if op=='M':ctx.move_to(*v)
        elif op=='L':ctx.line_to(*v)
        elif op=='C':ctx.curve_to(*v)
        elif op=='Z':ctx.close_path()

def draw(ctx,d,fill=None,stroke=None,width=1):
    path(ctx,d)
    if fill is not None:
        source(ctx,fill)
        if stroke is not None:ctx.fill_preserve()
        else:ctx.fill()
    if stroke is not None:
        source(ctx,stroke);ctx.set_line_width(width);ctx.stroke()

def poly(ctx,pts,fill=None,stroke=None,width=1,close=True):
    ctx.new_path();ctx.move_to(*pts[0])
    for p in pts[1:]:ctx.line_to(*p)
    if close:ctx.close_path()
    if fill is not None:
        source(ctx,fill)
        if stroke is not None:ctx.fill_preserve()
        else:ctx.fill()
    if stroke is not None:source(ctx,stroke);ctx.set_line_width(width);ctx.stroke()

def line(ctx,pts,paint,width=1,closed=False):
    poly(ctx,pts,None,paint,width,closed)

def circle(ctx,x,y,r,fill=None,stroke=None,width=1):
    ctx.new_path();ctx.arc(x,y,max(.001,r),0,math.tau)
    if fill is not None:
        source(ctx,fill)
        if stroke is not None:ctx.fill_preserve()
        else:ctx.fill()
    if stroke is not None:source(ctx,stroke);ctx.set_line_width(width);ctx.stroke()

def rrpath(ctx,x,y,w,h,r=0):
    r=min(r,w/2,h/2);ctx.new_path()
    if r<=0:ctx.rectangle(x,y,w,h);return
    ctx.arc(x+w-r,y+r,r,-math.pi/2,0);ctx.arc(x+w-r,y+h-r,r,0,math.pi/2)
    ctx.arc(x+r,y+h-r,r,math.pi/2,math.pi);ctx.arc(x+r,y+r,r,math.pi,math.pi*1.5);ctx.close_path()

def rect(ctx,x,y,w,h,fill=None,stroke=None,width=1,r=0):
    if w<=0 or h<=0:return
    rrpath(ctx,x,y,w,h,r)
    if fill is not None:
        source(ctx,fill)
        if stroke is not None:ctx.fill_preserve()
        else:ctx.fill()
    if stroke is not None:source(ctx,stroke);ctx.set_line_width(width);ctx.stroke()

@lru_cache(maxsize=128)
def points(d,steps=65):
    pts=[];last=np.zeros(2);start=last
    for op,v in parse(d):
        if op=='M':last=np.array(v);start=last;pts.append(last)
        if op=='L':
            end=np.array(v);n=max(2,int(np.linalg.norm(end-last)/3))
            pts.extend(last+(end-last)*t for t in np.linspace(0,1,n)[1:]);last=end
        if op=='C':
            a,b,c=np.array(v).reshape(3,2);t=np.linspace(0,1,steps+1)[1:,None]
            pts.extend((1-t)**3*last+3*(1-t)**2*t*a+3*(1-t)*t*t*b+t**3*c);last=c
        if op=='Z':pts.append(start);last=start
    p=np.array(pts);dist=np.r_[0,np.cumsum(np.linalg.norm(np.diff(p,axis=0),axis=1))]
    dist,idx=np.unique(dist,return_index=True)
    return p[idx],dist

def sample(d,u):
    p,dist=points(d);u=np.asarray(u);s=np.clip(u,0,1)*dist[-1]
    return np.stack([np.interp(s,dist,p[:,i]) for i in (0,1)],axis=-1)

def segment(d,a=0,b=1):
    if b-a<.00005:return np.empty((0,2))
    p,dist=points(d);a=max(0,a);b=min(1,b)
    mask=(dist>dist[-1]*a)&(dist<dist[-1]*b)
    return np.vstack([sample(d,a),p[mask],sample(d,b)])

def stroke(ctx,d,paint,width,a=0,b=1):
    p=segment(d,a,b)
    if len(p)>1:line(ctx,p,paint,width)

def tangent(d,u):
    p0=sample(d,np.clip(u-.0005,0,1));p1=sample(d,np.clip(u+.0005,0,1))
    delta=p1-p0;return delta/(np.linalg.norm(delta)+1e-10)

def ramp(x,a,b):return max(0.,min(1.,(x-a)/(b-a)))
def smooth(x,a,b):
    v=ramp(x,a,b);return v*v*(3-2*v)
def ease(x,a,b):return 1-(1-ramp(x,a,b))**3

def key(x,keys):
    return float(np.interp(x,[i[0] for i in keys],[i[1] for i in keys]))

def surface(w=W,h=H):
    s=cairo.ImageSurface(cairo.FORMAT_ARGB32,w,h);c=cairo.Context(s)
    c.set_line_join(cairo.LINE_JOIN_ROUND);c.set_line_cap(cairo.LINE_CAP_ROUND);return s,c

def array(s):
    s.flush();return np.frombuffer(s.get_data(),np.uint8).reshape(s.get_height(),s.get_stride()//4,4)[:,:s.get_width()]

def from_array(a):
    a=np.ascontiguousarray(a);s=cairo.ImageSurface.create_for_data(a,cairo.FORMAT_ARGB32,a.shape[1],a.shape[0],a.strides[0]);return s

def shadow(ctx,fn,sigma=16,opacity=.16,dx=8,dy=12):
    # Half-size offscreen shadow makes a full, stable Gaussian penumbra.
    s,c=surface(W//2,H//2);c.scale(.5,.5);c.translate(dx,dy);fn(c)
    a=array(s).copy();alpha=cv2.GaussianBlur(a[:,:,3],(0,0),sigma/2)
    a[:,:,:3]=0;a[:,:,3]=(alpha*opacity).astype(np.uint8)
    sh=from_array(a);ctx.save();ctx.scale(2,2);ctx.set_source_surface(sh,0,0);ctx.paint();ctx.restore()

def group_alpha(ctx,alpha,fn):
    if alpha<=0:return
    if alpha>=.999:fn();return
    ctx.push_group();fn();p=ctx.pop_group();ctx.set_source(p);ctx.paint_with_alpha(alpha)

def star_points(x,y,r,n=7,inner=.44,angle=-math.pi/2):
    return [(x+math.cos(angle+i*math.pi/n)*r*(1 if i%2==0 else inner),y+math.sin(angle+i*math.pi/n)*r*(1 if i%2==0 else inner)) for i in range(n*2)]
