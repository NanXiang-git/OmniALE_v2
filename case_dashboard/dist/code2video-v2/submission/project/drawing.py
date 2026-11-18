import base64
from pathlib import Path
from .geometry import clamp

ROOT = Path(__file__).resolve().parent


def path(d, fill='none', stroke=None, width=1, **attrs):
    if not d: return ''
    a = f'<path d="{d}" fill="{fill}"'
    if stroke is not None: a += f' stroke="{stroke}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"'
    for k,v in attrs.items(): a += f' {k.replace("_","-")}="{v}"'
    return a+'/>'


def rect(x,y,w,h,fill='none',stroke=None,sw=1,r=0,**attrs):
    a=f'<rect x="{x}" y="{y}" width="{max(0,w)}" height="{max(0,h)}" rx="{r}" fill="{fill}"'
    if stroke: a+=f' stroke="{stroke}" stroke-width="{sw}"'
    for k,v in attrs.items():a+=f' {k.replace("_","-")}="{v}"'
    return a+'/>'


def circle(x,y,r,fill='none',stroke=None,sw=1,**attrs):
    a=f'<circle cx="{x:.3f}" cy="{y:.3f}" r="{r:.3f}" fill="{fill}"'
    if stroke: a+=f' stroke="{stroke}" stroke-width="{sw}"'
    for k,v in attrs.items():a+=f' {k.replace("_","-")}="{v}"'
    return a+'/>'


def group(body,transform='',opacity=1,**attrs):
    if opacity<=0:return ''
    a=f'<g opacity="{clamp(opacity):.5f}"'
    if transform:a+=f' transform="{transform}"'
    for k,v in attrs.items():a+=f' {k.replace("_","-")}="{v}"'
    return a+'>'+body+'</g>'


def line(x1,y1,x2,y2,color,width=1,**kwargs):
    return path(f'M{x1},{y1}L{x2},{y2}',stroke=color,width=width,**kwargs)


def color_mix(a,b,v):
    v=clamp(v)
    a=[int(a.lstrip('#')[i:i+2],16) for i in (0,2,4)]
    b=[int(b.lstrip('#')[i:i+2],16) for i in (0,2,4)]
    return '#'+''.join(f'{round(x+(y-x)*v):02x}' for x,y in zip(a,b))


def gradient(name,colors,xy=('0%','0%','100%','0%'),radial=False):
    tag='radialGradient' if radial else 'linearGradient'
    att='' if radial else ' '.join(f'{k}="{v}"' for k,v in zip(('x1','y1','x2','y2'),xy))
    s=f'<{tag} id="{name}" {att}>'
    for v,c in colors:s+=f'<stop offset="{v}" stop-color="{c}"/>'
    return s+f'</{tag}>'


def selection(x,y,w,h,color='#49bf63',handles='circle',size=8):
    b=rect(x,y,w,h,stroke=color,sw=1.35)
    for a,c in [(0,0),(.5,0),(1,0),(0,.5),(1,.5),(0,1),(.5,1),(1,1)]:
        cx,cy=x+a*w,y+c*h
        if handles=='circle':b+=circle(cx,cy,size,'white',color,1.5)
        else:b+=rect(cx-size/2,cy-size/2,size,size,'white',color,1.3)
    return b


GRAIN=base64.b64encode((ROOT/'assets/paper_grain.png').read_bytes()).decode()
COMMON_DEFS='''
<filter id="blur3" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3"/></filter>
<filter id="blur7" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7"/></filter>
<filter id="blur14" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>
<filter id="blur24" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="24"/></filter>
'''+f'<pattern id="grain" width="256" height="256" patternUnits="userSpaceOnUse"><image width="256" height="256" href="data:image/png;base64,{GRAIN}"/></pattern>'
COMMON_DEFS+=gradient('porcelain',[(0,'#eeeeec'),(.28,'#fefefd'),(.55,'#d8d9d6'),(.78,'#fdfdfd'),(1,'#dedfdd')],('0%','100%','100%','0%'))
COMMON_DEFS+=gradient('groove',[(0,'#c5c6c3'),(.35,'#c7c8c6'),(.65,'#fefefd'),(1,'#d6d6d3')],('0%','0%','0%','100%'))
COMMON_DEFS+=gradient('knob',[(0,'#fcfcfb'),(.45,'#e6e7e4'),(1,'#d0d1ce')],('0%','0%','100%','100%'))
COMMON_DEFS+=gradient('speech',[(0,'#d3ceff'),(1,'#b6b4f5')],('0%','0%','100%','100%'))
COMMON_DEFS+=gradient('switch',[(0,'#aeb0ae'),(.35,'#c8ccca'),(1,'#fbfcf9')],('0%','0%','0%','100%'))
