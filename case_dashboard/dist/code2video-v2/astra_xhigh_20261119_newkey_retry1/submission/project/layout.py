"""Animated print-layout slices, swatches, registration and construction guides."""
import math,json
from pathlib import Path
_AA=[(('M','L','C','Z')[t],v) for t,v in json.loads((Path(__file__).parent/'assets/aa_outline.json').read_text())]
from .graphics import *
from .geometry import LEFT,RIGHT
BLUE='#65BAE5';PINK='#EF3B73'

def handles(ctx,x,y,w,h,col=PINK,round=False):
    rect(ctx,x,y,w,h,None,col,1.4)
    for px,py in [(x,y),(x+w/2,y),(x+w,y),(x,y+h/2),(x+w,y+h/2),(x,y+h),(x+w/2,y+h),(x+w,y+h)]:
        if round:circle(ctx,px,py,8,'#fff',col,1.8)
        else:rect(ctx,px-5,py-5,10,10,'#fff',col,1.4)

def cross(ctx,x,y,amount=1):
    for dx,col in [(-1,'#19c5ef'),(2,'#91e500'),(0,'#000')]:
        line(ctx,[(x-52,y+dx),(x+52,y+dx)],col,1.6)
        line(ctx,[(x+dx,y-52),(x+dx,y+52)],col,1.6)
    if amount>0:
        circle(ctx,x,y,34*amount,None,'#13b8e7',1.5)
        circle(ctx,x+2,y,35*amount,None,'#d2e400',1.5)
        circle(ctx,x,y,33*amount,None,'#000',1.8)
        circle(ctx,x,y,18*amount,'#000')

def rightarc(ctx,paint,width=90):
    ctx.new_path();ctx.arc(1080,540,265,-math.pi/2,math.pi/2);source(ctx,paint);ctx.set_line_width(width);ctx.stroke()

def halftone(ctx,x0,y0,x1,y1,color,space=12,r=4.5,center=None):
    for yy in np.arange(y0,y1,space):
        for xx in np.arange(x0,x1,space):
            rr=r
            if center:
                rr=r*max(0,1-math.hypot((xx-center[0])/center[2],(yy-center[1])/center[3]))
            if rr>.15:circle(ctx,xx,yy,rr,color)

def render_layout(ctx,f):
    if f<2 or f>53:return
    # A measurable expansion of a selected tile, rather than a whole-scene fade.
    top=key(f,[(2,897),(6,897),(8,616),(10,616),(12,575),(14,318),(16,190),(18,183),(34,183),(36,200),(38,263),(40,361),(42,495),(44,670),(46,792),(49,897)])
    rw=key(f,[(2,0),(6,0),(8,230),(10,355),(12,413),(49,413)])
    bottom=897
    if f<49 and rw>0 and top<bottom:
        ctx.save();ctx.rectangle(1084,top,rw,bottom-top);ctx.clip()
        orange=mix('#8c274e','#ff9b21',smooth(f,12,25))
        rightarc(ctx,{'linear':[1100,260,1230,850],'stops':[(0,'#842347'),(.6,'#8e2551'),(.81,orange),(1,orange)]})
        ctx.save()
        ctx.new_path();ctx.arc(1080,540,310,-math.pi/2,math.pi/2);ctx.arc_negative(1080,540,220,math.pi/2,-math.pi/2);ctx.close_path();ctx.clip()
        group_alpha(ctx,smooth(f,13,20),lambda:halftone(ctx,1080,540,1395,850,'#ffb000',12,5,center=(1250,695,175,160)))
        group_alpha(ctx,smooth(f,13,20),lambda:halftone(ctx,1080,617,1385,850,'#8c2456',12,3.8,center=(1180,810,155,175)))
        ctx.restore();ctx.restore()
        handles(ctx,1084,top,rw,bottom-top)
        line(ctx,[(1084,850),(1084+rw*.74,850)],PINK,1.2)
        if 14<=f<42:
            ah=min(88,max(0,897-top-20));ay=top+15
            rect(ctx,1387,ay,99,ah,'#ff9900')
            if ah>45:
                ctx.save();ctx.translate(1396,ay+61);path(ctx,_AA);source(ctx,'#fff');ctx.fill();ctx.restore()
        line(ctx,[(1498,top-60),(1498,top-22)],PINK,1.4)
        line(ctx,[(1520,top),(1559,top)],PINK,1.4)
    # Five incremental tint chips remain at the same print-layout baseline.
    sw=key(f,[(2,84),(4,84),(6,168),(8,252),(10,252),(12,336),(14,420),(42,420),(44,420),(46,336),(48,168),(50,84),(52,0)])
    if f<44:sx=1084
    else:sx=1504-sw
    cols=['#e735a8','#ef79b8','#f69cc6','#f3bfd7','#fcdeed']
    n=int(math.ceil(sw/84))
    for j in range(n):
        col=cols[max(0,5-n)+j]
        rect(ctx,sx+84*j,913,min(84,sw-j*84),149,col,'#ead2df',.8)
    if f<47 and f>=6:line(ctx,[(1068,808 if f<12 else 180),(1068,1062)],BLUE,1)
    # Middle spine, overprinted pink/cyan and white CC cutouts.
    al=smooth(f,10,16)*(1-smooth(f,31,40))
    if al>0:
        def spine():
            ctx.save();reveal_y=key(f,[(10,635),(12,445),(14,325),(16,180),(40,180)])
            ctx.rectangle(819,reveal_y,249,635-reveal_y);ctx.clip()
            rect(ctx,819,180,249,455,{'linear':[900,200,1010,665],'stops':[(0,'#ec3888'),(.48,'#ec3888'),(1,mix('#ec3888','#3ca9bf',smooth(f,17,24)))]})
            stroke(ctx,LEFT,'#f7f7f5',90)
            draw(ctx,'M877 308 C935 258 1006 230 1068 230 L1068 319 C1027 320 992 332 964 354 Z','#f7f7f5')
            ctx.restore()
        group_alpha(ctx,al,spine)
    al2=smooth(f,12,20)*(1-smooth(f,33,39))
    if al2>0:
        def lower():
            ctx.save();ctx.rectangle(819,635,249,215);ctx.clip()
            stroke(ctx,RIGHT,linear(850,650,1068,840,'#ffc6ba','#fb3d88'),90,key(f,[(12,.32),(14,.28),(16,.21),(18,.17),(20,.12),(22,.07),(24,0)]),1)
            ctx.save();poly(ctx,[(819,780),(917,850),(819,850)]);ctx.clip();halftone(ctx,819,780,917,850,'#ff00c4',10,3.4);ctx.restore()
            ctx.restore()
        group_alpha(ctx,al2,lower)
    # Left inverse tile gradually assembles from the lower grid.
    al3=smooth(f,16,24)*(1-smooth(f,37,46))
    if al3>0:
        def lefttile():
            ctx.save();ctx.rectangle(532,447,271,451);ctx.clip()
            rect(ctx,532,447,271,451,{'linear':[580,450,760,920],'stops':[(0,mix('#cccccb','#df325e',smooth(f,22,33))),(.45,mix('#a8a8a8','#b33759',smooth(f,22,33))),(1,'#bcbdbb')]})
            stroke(ctx,LEFT,'#fff',90)
            stroke(ctx,RIGHT,'#fff',90)
            ctx.restore()
        group_alpha(ctx,al3,lefttile)
    # Halftone cutouts at the joins of the tiles.
    if 19<f<39:
        aa=smooth(f,19,26)*(1-smooth(f,34,39))
        group_alpha(ctx,aa,lambda:halftone(ctx,723,345,885,436,'#ff00e8',10,3.4,center=(807,372,160,100)))
    # The color-comparison card changes its swatches during assembly.
    if 14<f<39:
        aa=smooth(f,13.5,17)*(1-smooth(f,32,39))
        def swatches():
            x=key(f,[(14,532),(16,512),(20,351)])
            cc=mix('#eaba40','#22bce7',smooth(f,18,24))
            cc=mix(cc,'#ed37b9',smooth(f,26,32))
            rect(ctx,x,239,708-x,96,linear(x,239,708,239,mix('#fff',cc,smooth(f,17,22)),cc))
            rect(ctx,351,335,357,96,linear(351,335,708,335,cc,mix('#fff',cc,smooth(f,17,24)),mix('#fff',cc,smooth(f,18,24))))
            topcolors=['#454048','#8c4fba','#f368ff','#f58afa','#ffcf13']
            for j,col in enumerate(topcolors):
                xx=x+(708-x)*j/5;rect(ctx,xx,210,(708-x)/5+1,29,col)
            if f>=20:
                for j in range(3):
                    rect(ctx,351+j*119,239,119,192,None,(.3,.5,.6,.22),.5)
        group_alpha(ctx,aa,swatches)
    aatop=smooth(f,14,18)*(1-smooth(f,31,38))
    if aatop>0:
        def tops():
            rect(ctx,723,64,80,220,linear(723,64,723,284,'#86ca32','#fff'))
            c=mix('#efa938','#46a5dc',smooth(f,23,30))
            rect(ctx,819,64,249,101,linear(819,64,1068,64,mix('#fff',c,smooth(f,16,20)),mix(c,'#d5d6c6',.65)))
        group_alpha(ctx,aatop,tops)
    # Registration targets and paragraph rules.
    if f>=14:
        aa=(1-smooth(f,35,42));group_alpha(ctx,aa,lambda:cross(ctx,1497,540,smooth(f,19,22)*(1-smooth(f,31,36))))
    if f>=20:
        aa=(1-smooth(f,35,42));group_alpha(ctx,aa,lambda:cross(ctx,517,540,smooth(f,21,24)*(1-smooth(f,32,36))))
    if 18<f<46:
        for j,ww in enumerate([120,120,90,72,10]):
            if f>18+j*1.2:
                line(ctx,[(926,901+j*16.5),(926+ww*(1-smooth(f,36+j,43+j)),901+j*16.5)],PINK,1.1)
    # Hairline guides extend independently; they are not baked into the tiles.
    ag=smooth(f,10,19)*(1-smooth(f,39,48))
    if ag>0:
        def guides():
            for j,x in enumerate([421,517,612,708,723,803,819,1068]):
                yt=165 if j<4 else 64 if x==819 else 180
                yb=[311,453,514,591,898,898,898,1062][j]
                off=35*math.sin(f*.14+j)
                line(ctx,[(x,yt),(x,yb+off)],BLUE,.9)
            for x in [436,532,628,724]:line(ctx,[(x,490 if x==436 else 447),(x,635 if x==436 else 898)],BLUE,.9)
            line(ctx,[(351,447),(823,447)],BLUE,.9)
        group_alpha(ctx,ag,guides)
