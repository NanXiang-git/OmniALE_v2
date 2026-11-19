"""A small editable, heavy display alphabet, warped pointwise along Bezier arcs.
All counters and silhouettes are authored outlines. No text is baked into textures.
"""
import numpy as np
import cairo
from .graphics import *
# Coordinates are a 100 x 100 cap-height box. Cubic corners deliberately bulge.
GLYPHS={
'T':'M0 0 L100 0 L100 34 L71 34 L71 79 C71 107 29 107 29 79 L29 34 L0 34 Z',
'O':'M50 0 C84 -3 100 20 100 50 C100 82 82 102 50 102 C17 102 0 82 0 50 C0 19 17 -2 50 0 Z M47 38 C39 38 40 64 49 65 C60 66 60 38 47 38 Z',
'G':'M97 17 L76 41 C67 30 43 29 41 50 C39 71 58 78 67 65 L53 65 L53 47 L100 47 L100 88 C80 105 51 107 30 98 C-10 84 -9 30 17 9 C40 -8 78 -2 97 17 Z',
'E':'M0 0 L100 0 L100 28 L43 28 L43 36 L82 36 L82 63 L43 63 L43 72 L100 72 L100 100 L0 100 Z',
'H':'M0 0 L40 0 L40 34 L60 34 L60 0 L100 0 L100 82 C100 107 60 108 60 82 L60 66 L40 66 L40 82 C40 107 0 108 0 82 Z',
'R':'M0 0 L50 0 C83 -2 100 11 100 36 C100 55 89 65 71 69 L102 100 L56 100 L37 70 L37 100 L0 100 Z M37 25 L37 46 L49 46 C64 46 63 25 49 25 Z',
'C':'M99 19 L76 43 C67 29 41 30 40 50 C40 73 66 75 77 58 L100 81 C87 102 56 108 32 98 C-11 83 -10 23 22 6 C48 -7 82 -1 99 19 Z',
'A':'M28 0 L73 0 L105 100 L66 100 L60 78 L39 78 L34 100 L-4 100 Z M45 53 L56 53 L50 30 Z',
'N':'M0 100 L0 0 L39 0 L65 45 L65 0 L100 0 L100 100 L66 100 L36 52 L36 100 Z',
'D':'M0 0 L47 0 C82 0 100 18 100 49 C100 82 83 100 47 100 L0 100 Z M39 30 L39 72 L47 72 C66 72 65 30 47 30 Z',
'W':'M0 0 L30 0 L37 50 L49 0 L76 0 L87 50 L94 0 L124 0 L104 100 L77 100 L62 53 L48 100 L21 100 Z',
'M':'M0 100 L0 0 L36 0 L53 37 L71 0 L107 0 L107 100 L72 100 L72 54 L53 84 L35 54 L35 100 Z',
'K':'M0 0 L40 0 L40 37 L68 0 L108 0 L71 47 L111 100 L66 100 L40 64 L40 100 L0 100 Z',
'I':'M0 0 L45 0 L45 100 L0 100 Z',
'S':'M95 10 L87 41 C62 22 38 27 41 37 C45 46 105 37 103 71 C100 107 37 110 0 90 L8 59 C35 78 68 78 65 67 C61 57 -2 69 0 31 C2 0 58 -10 95 10 Z',
'B':'M0 0 L53 0 C89 0 102 22 85 46 C113 71 94 100 56 100 L0 100 Z M37 24 L37 40 L50 40 C62 40 62 24 50 24 Z M37 61 L37 78 L53 78 C66 78 66 61 53 61 Z',
'U':'M0 0 L39 0 L39 61 C39 79 62 79 62 61 L62 0 L101 0 L101 63 C101 116 0 116 0 63 Z',
'V':'M0 0 L39 0 L54 59 L68 0 L108 0 L74 100 L33 100 Z',
'F':'M0 0 L100 0 L100 30 L41 30 L41 41 L86 41 L86 71 L41 71 L41 100 L0 100 Z',
'P':'M0 0 L52 0 C85 0 103 11 103 39 C103 65 85 76 41 74 L41 100 L0 100 Z M40 27 L40 49 L52 49 C68 49 68 27 52 27 Z',
'L':'M0 0 L43 0 L43 70 L100 70 L100 100 L0 100 Z',
'Y':'M0 0 L41 0 L56 30 L71 0 L112 0 L78 62 L78 100 L35 100 L35 62 Z',
'X':'M0 0 L42 0 L54 26 L67 0 L108 0 L78 50 L110 100 L68 100 L54 72 L41 100 L-1 100 L31 50 Z',
'Z':'M0 0 L100 0 L100 28 L45 71 L100 71 L100 100 L0 100 L0 72 L57 28 L0 28 Z',
'J':'M42 0 L100 0 L100 63 C100 116 0 115 0 62 L36 62 C36 80 62 80 62 62 L62 30 L42 30 Z',
'Q':'M50 0 C84 -3 100 20 100 50 C100 70 94 81 85 88 L103 100 L68 107 L55 100 C17 102 0 82 0 50 C0 19 17 -2 50 0 Z M47 38 C39 38 40 64 49 65 C60 66 60 38 47 38 Z',
}

@lru_cache(maxsize=64)
def outlines(ch):
    s,c=surface(1,1);path(c,GLYPHS.get(ch,GLYPHS['O']));c.set_tolerance(.3)
    return list(c.copy_path_flat())

def text_on_path(ctx,text,d,a=0,b=1,height=86,color='#FF9900',outline='#14110f',width=1.25):
    p,dist=points(d);length=dist[-1]
    widths=[.46 if ch==' ' else (1.18 if ch in 'MW' else .46 if ch=='I' else 1) for ch in text]
    total=sum(widths);advance=(b-a)*length/total
    pos=a*length
    for ch,weight in zip(text,widths):
        cell=advance*weight
        if ch==' ':pos+=cell;continue
        glyphw=124 if ch=='W' else 107 if ch=='M' else 45 if ch=='I' else 100
        ctx.new_path()
        for typ,v in outlines(ch):
            if typ==cairo.PATH_CLOSE_PATH:ctx.close_path();continue
            gx,gy=v
            u=np.clip((pos+gx/glyphw*cell)/length,0,1)
            q=sample(d,u);tg=tangent(d,u);normal=np.array([-tg[1],tg[0]])
            q=q+normal*(gy/100-.5)*height
            if typ==cairo.PATH_MOVE_TO:ctx.move_to(*q)
            else:ctx.line_to(*q)
        source(ctx,color);ctx.fill_preserve();source(ctx,outline);ctx.set_line_width(width);ctx.stroke()
        pos+=cell
