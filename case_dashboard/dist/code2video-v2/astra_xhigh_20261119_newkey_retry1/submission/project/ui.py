"""Soft UI, moving tube sleeves, glass controls, independent cursor animation."""
import math
import numpy as np
import cv2
from .graphics import *
from .geometry import *
from .layout import handles

def marker(ctx,x,y,size=27):
    line(ctx,[(x-size,y),(x-5,y)],'#121717',2)
    line(ctx,[(x+5,y),(x+size,y)],'#121717',2)
    line(ctx,[(x,y-size),(x,y-5)],'#121717',2)
    line(ctx,[(x,y+5),(x,y+size)],'#121717',2)
    rect(ctx,x+17,y+16,8,8,None,'#121717',2)

def grey_tube(ctx,f,gradient=None,revision=False):
    reveal=key(f,[(36,0),(37,.035),(38,.17),(40,.36),(42,.57),(44,.77),(47,.97),(49,1)])
    if reveal<=0:return
    # Near the end the UI is removed in the same direction as the illustrated band.
    start=key(f,[(66,0),(70,.42),(73,.77),(75,1)])
    if start>=reveal:return
    shadow(ctx,lambda c:stroke(c,LEFT,'#000',101,start,reveal),18,.14,9,16)
    # Continuous cross-section shading, sampled at one-pixel widths.
    widths=np.array([0,16,20,25,40,68,85,94,98])
    values=np.array([239,234,182,248,252,240,215,233,251])
    for width in range(98,0,-2):
        v=float(np.interp(width,widths,values))/255
        stroke(ctx,LEFT,linear(580,355,1010,845,(v*.97,v*.975,v*.97,1),(min(1,v+.025),min(1,v+.027),min(1,v+.02),1)),width,start,reveal)
    groove=key(f,[(39,0),(42,.17),(46,.46),(50,.59),(54,.727),(58,.79),(63,.82),(70,.88)])
    if groove>start:
        wire=linear(1020,545,590,630,*gradient) if revision else linear(750,390,710,750,'#ee4ce9','#ef80ef')
        stroke(ctx,LEFT,wire,17,start,min(reveal,groove))
        ctx.save();ctx.translate(-1,-2);stroke(ctx,LEFT,(1,1,1,.50),4,start,min(reveal,groove));ctx.restore()
    # Rim contours on the two sides of the track.
    p=segment(LEFT,start,reveal)
    if len(p)>3:
        tt=np.gradient(p,axis=0);tt/=np.maximum(np.linalg.norm(tt,axis=1)[:,None],1e-8);nn=np.c_[-tt[:,1],tt[:,0]]
        line(ctx,p+nn*34,(1,1,1,.58),.85)
        line(ctx,p-nn*35,(1,1,1,.48),.8)
    u=min(reveal-.01,max(.005,groove))
    if f<41:u=min(reveal-.015,.008+reveal*.075)
    if u>start:
        q=sample(LEFT,u);tg=tangent(LEFT,u);angle=math.atan2(tg[1],tg[0])
        shadow(ctx,lambda c:circle(c,*q,39,'#000'),10,.2,5,9)
        circle(ctx,*q,40,linear(q[0],q[1]-42,q[0],q[1]+42,'#ffffff','#b8bcba'))
        circle(ctx,q[0]-2,q[1]-3,37,linear(q[0]-15,q[1]-35,q[0]+20,q[1]+35,'#f7f9f6','#e1e4e0'),'#dadbd7',1)
        ctx.save();ctx.translate(*q);ctx.rotate(angle)
        for yy in [-9,9]:
            line(ctx,[(-21,yy+2),(21,yy+2)],'#fafcf9',5)
            line(ctx,[(-21,yy),(21,yy)],'#acafac',4)
        ctx.restore()

def pink_tube(ctx,f,gradient,revision):
    # Pink is introduced as two travelling open sections of the same CC path.
    # The construction reveal converges on the precise UI centerline.
    end1=key(f,[(25,0),(26,.013),(30,.12),(34,.28),(36,.42),(40,.68),(43,.86),(46,1)])
    if f<37 and end1<=0:return
    colors=gradient if revision else ['#c914df','#e756c7']
    c0,c1=colors
    pale0=mix(c0,'#fff',.60 if revision else .70);pale1=mix(c1,'#fff',.48 if revision else .61)
    if not revision:pale0='#fbb1f2';pale1='#f79dde'
    outer=linear(700,700,1380,350,pale0,pale1)
    if f<43:
        # Earlier flat swatch arc grows anticlockwise from the rightmost point.
        theta0=key(f,[(25,0),(26,0),(30,-.45),(34,-1.35),(38,-2.45),(42,-2.15)])
        theta1=key(f,[(25,0),(26,.004),(30,-.05),(34,-.55),(38,-.95),(42,-1.65)])
        if f>=26:
            ctx.new_path();ctx.arc(1080,540,265,theta0,theta1);source(ctx,outer);ctx.set_line_width(90);ctx.stroke()
        prog=key(f,[(35,0),(36,.006),(38,.12),(40,.35),(42,.48),(43,.52)])
        if prog>0:stroke(ctx,RIGHT,outer,90,0,prog)
    else:
        # Gaps close in the top arc as the complete soft UI arrives.
        gap=1-key(f,[(43,.43),(44,.61),(45,.77),(46,.87),(48,.96),(50,1)])
        lo=key(f,[(67,0),(68,.39),(70,.52),(72,.71),(73,.86),(75,1)])
        if lo<1-gap:
            stroke(ctx,RIGHT,outer,90,lo,1-gap)
        if gap>.001:stroke(ctx,RIGHT,outer,90,.94,1)
    if f<37:return
    lo=key(f,[(67,0),(68,.39),(70,.52),(72,.71),(73,.86),(75,1)])
    high=key(f,[(37,.01),(38,.035),(40,.084),(42,.27),(44,.39),(46,.53),(48,.70),(50,.76),(52,.81),(54,.85),(58,.94),(62,.98),(66,1)])
    if high<=lo:return
    main=linear(760,580,1340,330,c0,c1) if revision else linear(740,700,1310,340,'#dc06ed','#b81edf','#e849d6')
    stroke(ctx,RIGHT,main,19,lo,high)
    # A travelling, rounded sleeve rides in the groove. It retains a continuous
    # world-space material while its point and path length change.
    lead=high
    slen=key(f,[(37,.01),(40,.084),(42,.17),(48,.11),(54,.19),(60,.14),(67,.15),(72,.10),(75,0)])
    sa=max(lo,lead-slen);sb=lead
    if sb>sa:
        # The bright upper lip and dark center establish the rounded volume.
        # Smooth, rounded cross-section without discrete contour bands.
        for width in range(66,0,-2):
            v=width/66
            blend=.38+.29*math.cos(v*math.pi*1.4)
            ca=mix(c0,c1,blend)
            cb=mix(c0,c1,min(1,blend+.17))
            stroke(ctx,RIGHT,linear(850,700,1250,260,ca,cb),width,sa,sb)
        # A broad blurred reflection lies on the upper shoulder.
        ctx.save();ctx.translate(-2,-5)
        for width in range(24,0,-3):
            stroke(ctx,RIGHT,(*rgb(mix(c1,'#fff',.44))[:3],.025),width,sa+.008,sb-.008)
        ctx.restore()
        q=sample(RIGHT,max(sa,sb-.003))
        circle(ctx,*q,13,mix(c1,'#fff',.65))
    if f>=46:
        # Delicate dashed edge of selected translucent material.
        p=segment(RIGHT,max(lo,.015),max(lo+.001,min(1,high+.04)))
        if len(p)>3:
            tt=np.gradient(p,axis=0);tt/=np.maximum(np.linalg.norm(tt,axis=1)[:,None],1e-6);n=np.c_[-tt[:,1],tt[:,0]]
            ctx.save();ctx.set_dash([4,11]);line(ctx,p+n*45,(*rgb(c0)[:3],.30),.7);ctx.restore()

def cursor_state(f,name):
    if name=='blue':
        x=key(f,[(38,558),(40,559),(42,609),(44,791),(46,900),(48,961),(50,999),(52,1025),(54,1041),(56,1051),(58,1055),(60,1054),(64,1053),(66,1083),(68,1111),(70,1130)])
        y=key(f,[(38,596),(64,596),(66,584),(68,576)])
        a=smooth(f,38,39)*(1-smooth(f,68,69));size=1
    elif name=='green':
        x=key(f,[(43,762),(44,753),(46,739),(48,722),(50,705),(52,685),(54,663),(56,653),(58,645),(60,641),(62,639)])
        y=key(f,[(43,142),(44,157),(46,207),(48,241),(50,267),(52,285),(54,293),(56,283),(58,277),(60,273),(62,271),(68,273),(72,305)])
        a=smooth(f,42.5,44)*(1-smooth(f,68,72));size=1
    else:
        x=key(f,[(37,650),(40,649),(42,655),(44,663),(46,697),(48,809),(50,857),(52,877),(54,885),(58,887),(68,887),(70,895),(73,930)])
        y=key(f,[(37,704),(40,702),(42,713),(44,727),(46,791),(48,885),(50,903),(52,907),(54,909),(58,917),(60,919),(68,921),(70,933),(73,965)])
        a=smooth(f,36.5,38)*(1-smooth(f,70,74));size=key(f,[(37,1.25),(42,1.10),(44,1),(74,1)])
    return x,y,a,size

def draw_cursor(ctx,f,name):
    x,y,a,sz=cursor_state(f,name)
    if a<=0:return
    colors={'blue':'#127bf1','green':'#9bdf32','orange':'#ff9900'}
    def go():
        ctx.save();ctx.translate(x,y);ctx.scale(sz,sz)
        draw(ctx,'M0 0 L58 17 L37 27 L29 55 Z',colors[name],'#fff',2.3)
        if name!='blue':
            rect(ctx,57,34,55,12,'#51bd06' if name=='green' else '#ff8300',r=6)
        ctx.restore()
    group_alpha(ctx,a,go)

def ui_guides(ctx,f):
    if f<39 or f>=70:return
    aa=(1-smooth(f,65,69))
    def go():
        # Green selection follows the blue pointer's horizontal drag.
        xx=key(f,[(39,558),(40,558),(42,608),(44,790),(46,899),(48,959),(50,997),(52,1025),(54,1052),(58,1066)])
        yt=key(f,[(39,515),(41,479),(43,389),(45,346),(54,345),(64,341)])
        yb=key(f,[(39,681),(41,753),(44,847),(54,847),(64,852)])
        handles(ctx,522,yt,max(2,xx-522),yb-yt,'#66c272',True)
        # Blue bounds grow from the upper-right corner.
        x=key(f,[(39,1320),(40,1282),(42,1080),(44,795),(47,712)])
        yb2=key(f,[(39,274),(40,309),(42,548),(44,755),(47,875)])
        rect(ctx,x,198,1395-x,yb2-198,None,'#69b7d7',1)
        marker(ctx,x,yb2,26)
        if f>=50:
            ap=smooth(f,50,54)*(1-smooth(f,62,67))
            for ang in np.linspace(-64,-12,15):
                rad=math.radians(ang)
                xx1=1080+346*math.cos(rad);yy1=540+346*math.sin(rad)
                xx2=1080+370*math.cos(rad);yy2=540+370*math.sin(rad)
                line(ctx,[(xx1,yy1),(xx2,yy2)],(.35,.78,.34,ap),2)
    group_alpha(ctx,aa,go)

def icons(ctx,f):
    a=smooth(f,39,43)*(1-smooth(f,66,72))
    if a<=0:return
    def go():
        for x,col in [(549,'#2ca7f0'),(624,'#252625')]:
            circle(ctx,x,267,26,col)
        poly(ctx,[(541,255),(541,280),(561,267)],'#fff')
        rect(ctx,619,253,10,28,'#fff');rect(ctx,610,262,28,10,'#fff')
    group_alpha(ctx,a,go)

def extras(ctx,f):
    a=ease(f,48,55)*(1-smooth(f,70,74))
    if a<=0:return
    def go():
        # The wireframe tile and colored solids are behind the glass.
        sz=110*ease(f,49,54)
        rect(ctx,1197,420,sz,sz,linear(1197,420,1307,530,'#fbb02c','#fff1d6'),r=10)
        ctx.save();rrpath(ctx,1197,420,sz,sz,10);ctx.clip()
        for i in range(5):
            line(ctx,[(1197+i*27.5,420),(1197+i*27.5,530)],(1,1,1,.55),.8)
            line(ctx,[(1197,420+i*27.5),(1307,420+i*27.5)],(1,1,1,.55),.8)
        circle(ctx,1252,475,40,None,(1,1,1,.65),.8);circle(ctx,1252,475,14,None,(1,1,1,.65),.8)
        line(ctx,[(1197,420),(1307,530)],(1,1,1,.5),1);line(ctx,[(1307,420),(1197,530)],(1,1,1,.5),1)
        ctx.restore()
        sr=ease(f,52,55)
        circle(ctx,1442+30*smooth(f,58,66),603+25*smooth(f,58,66),47*sr,radial(1428,584,75,'#eeeefe','#b7b5fa','#9080ff'))
        if sr>.8:
            for ang in np.linspace(0,math.tau,10,endpoint=False):
                cx=1471;cy=628
                line(ctx,[(cx+18*math.cos(ang),cy+18*math.sin(ang)),(cx+26*math.cos(ang),cy+26*math.sin(ang))],(1,1,1,.48),.8)
        circle(ctx,1381,715,59*ease(f,52,57),linear(1381,660,1381,775,'#e7fdd4','#8de021','#bdf456'))
        q=key(f,[(48,22),(54,99),(65,108)])
        rect(ctx,1272,745,q,q,None,'#adce6d',2)
        line(ctx,[(1272,745),(1272+q,745+q)],'#afd16b',1.8);line(ctx,[(1272+q,745),(1272,745+q)],'#afd16b',1.8)
    group_alpha(ctx,a,go)

def glass_panel(ctx,f,gradient=None,revision=False):
    a=ease(f,44,50)*(1-smooth(f,70,75))
    if a<=0:return
    sc=key(f,[(44,.10),(45,.20),(46,.35),(48,.75),(51,1),(69,1),(72,.87),(75,.01)])
    x=1217+key(f,[(44,130),(46,70),(48,15),(51,0),(54,0),(66,-9),(72,25)])
    y=470+key(f,[(46,40),(54,0),(66,0),(72,20)])
    w=255*sc;h=259*sc
    # Genuine local backdrop blur, computed from the current editable scene.
    original=array(ctx.get_target()).copy()
    x0=max(0,int(x)-65);x1=min(W,int(x+w)+65);y0=max(0,int(y)-65);y1=min(H,int(y+h)+65)
    patch=original[y0:y1,x0:x1].copy()
    blurred=cv2.GaussianBlur(patch,(0,0),18)
    blurred[:,:,:3]=np.minimum(255,blurred[:,:,:3]*.92+255*.08).astype(np.uint8)
    back=from_array(blurred)
    def go():
        ctx.save();rrpath(ctx,x,y,w,h,9);ctx.clip();ctx.set_source_surface(back,x0,y0);ctx.paint();ctx.restore()
        rect(ctx,x,y,w,h,linear(x,y,x+w,y+h,(1,1,1,.08),(.89,.91,.89,.21)),(.65,.67,.65,.60),1,9)
        line(ctx,[(x+9,y+1),(x+w-9,y+1)],(1,1,1,.9),1.3)
        # Broad colored caustic from the tube behind the frosted panel.
        ctx.save();rrpath(ctx,x,y,w,h,9);ctx.clip()
        refl=mix(gradient[0],gradient[1],.45) if revision else rgb('#ff2c71')
        cx=x+w*.48;cy=y+h*.50
        ctx.translate(cx,cy);ctx.scale(.82,1.6)
        circle(ctx,0,0,73*sc,{'radial':[0,0,0,0,0,73*sc],'stops':[(0,(*rgb(refl)[:3],.60)),(1,(*rgb(refl)[:3],0))]})
        ctx.restore()
        # Toggle cavities and knobs are independent controls.
        ctx.save();ctx.translate(x,y);ctx.scale(sc,sc)
        tx=35;tw=181;hh=64
        rect(ctx,tx,49,tw,hh,linear(tx,49,tx+tw,113,'#fff','#fff6f7'),r=32)
        u=key(f,[(46,1),(58,1),(64,.55),(67,.15),(70,0),(74,0)])
        circle(ctx,tx+30+(tw-60)*u,81,27,'#f451ed')
        rect(ctx,tx,148,tw,hh,linear(tx,148,tx,212,'#9d9e9c','#edf0ec'),r=32)
        u2=key(f,[(46,0),(58,0),(64,.30),(67,.5),(70,.8),(73,1)])
        xx=tx+31+(tw-62)*u2
        circle(ctx,xx+4,185,39,{'radial':[xx+3,183,21,xx+4,185,39],'stops':[(0,(.15,.18,.16,.4)),(1,(.15,.18,.16,0))]})
        circle(ctx,xx,179,27,linear(xx,151,xx,207,'#e3e7e3','#cbd1cd'),'#e5e9e4',1)
        ctx.restore()
    group_alpha(ctx,a,go)

def speech(ctx,f):
    a=ease(f,49,54)*(1-smooth(f,68,73))
    if a<=0:return
    def go():
        ctx.save();ctx.translate(856,831+10*smooth(f,56,63));ctx.rotate(.065*(1-smooth(f,55,61)));ctx.scale(a,a)
        draw(ctx,'M-43 -46 L43 -46 Q62 -46 62 -28 L62 25 Q62 42 44 42 L31 42 L31 58 L17 42 L-45 42 Q-61 42 -61 25 L-61 -29 Q-61 -46 -43 -46 Z',linear(-55,-46,55,55,'#d0d0fa','#b8baf4'),'#b1b8ec',1)
        for y in [-14,-2,11]:line(ctx,[(-30,y),(29,y)],'#fff',2)
        ctx.restore()
    group_alpha(ctx,a,go)
