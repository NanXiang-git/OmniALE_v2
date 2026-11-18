"""Porcelain rail, continuously shaded colored tube and frosted controls."""
import json
import math
import numpy as np
from .geometry import *
from .drawing import *

TRACKS=json.loads((ROOT/'cursor_tracks.json').read_text())


def pointer(which,t):
    if which=='blue':
        visible=ease(t,1.60,1.665)*(1-ease(t,66/24,67/24))
    elif which=='green':visible=ease(t,1.78,1.84)*(1-ease(t,2.83,2.96))
    else:visible=ease(t,1.38,1.55)*(1-ease(t,2.91,3.02))
    if visible<=0:return ''
    x,y=key(t,TRACKS[which])
    scale=key(t,[(1.36,.3),(1.55,1),(3,1)]) if which=='orange' else 1
    col={'blue':'#087bf6','green':'#95e632','orange':'#ff9b00'}[which]
    s=path('M0 0L59 17L36 28L28 57Z',col,'white',2.4)
    if which!='blue':s+=line(63,39,107,39,'#4dc600' if which=='green' else '#ff8100',12)
    return group(s,f'translate({x:.3f} {y:.3f}) scale({scale})',visible,id=f'cursor-{which}')


def colored_stroke(curve,start,end,width,colors,tint=0):
    if end<=start:return ''
    d=curve.part(start,end)
    s=''
    # Each sample is assigned its arc-distance color. The same continuous
    # coordinate is used for every reveal/slider pose, so colors never reset.
    for a,b in zip(np.linspace(start,end,max(2,int((end-start)*curve.length/14))),np.linspace(start,end,max(2,int((end-start)*curve.length/14)))[1:]):
        c=color_mix(colors[0],colors[1],(a+b)/2)
        if tint:c=color_mix(c,'#ffffff',tint)
        s+=path(curve.part(a,b),stroke=c,width=width)
    return s


def raised_slider(curve,start,end,colors):
    """Rounded translucent volume with shading across its section."""
    if end<=start:return ''
    d=curve.part(start,end)
    s=''
    for width in range(74,17,-3):
        tint=.24*((width-18)/56)**2
        s+=colored_stroke(curve,start,end,width,colors,tint)
    # Blurred highlight follows the raised part, not the whole screen.
    s+=group(path(curve.offset_part(start,end,-18),stroke='#ffffff',width=11),opacity=.13,filter='url(#blur7)')
    s+=path(curve.offset_part(start,end,17),stroke=colors[0],width=10,opacity=.13,filter='url(#blur7)')
    return s


def tube(t,revision,gradient_colors):
    if t<25/24 or t>3.16:return '', ''
    defs=''
    s=''
    material_blend=ease(t,1.52,1.625) if revision else 0
    # Pink replacements sweep over the flat print before becoming the UI tube.
    if t<2.09:
        aa=key(t,[(25/24,-3),(28/24,-5),(32/24,-20),(36/24,-145),(40/24,-145),(44/24,-145),(48/24,-135),(50/24,-122)])
        bb=key(t,[(25/24,-3),(28/24,2),(32/24,-73),(36/24,-43),(40/24,-73),(42/24,-90),(44/24,-105),(46/24,-122),(48/24,-136),(50/24,-145)])
        if aa>bb:aa,bb=bb,aa
        pre=circle_arc(1080,540,266,aa,bb)
        colors=[color_mix('#f9a7f5',color_mix(gradient_colors[0],'#ffffff',.25),material_blend),color_mix('#f7a1de',color_mix(gradient_colors[1],'#ffffff',.15),material_blend)]
        defs+=gradient('preTube',[(0,colors[0]),(1,colors[1])])
        s+=path(pre,stroke='url(#preTube)',width=90,opacity=1-ease(t,2.0,2.09))
    # Arc fractions measured at the cap centre in the extracted reference.
    # Cap radius accounts for about .03 of the apparent pink interval.
    reveal=key(t,[(35/24,0),(36/24,.025),(37/24,.095),(38/24,.173),(39/24,.254),(40/24,.34),(41/24,.429),(42/24,.520),(43/24,.607),(44/24,.686),(45/24,.757),(46/24,.817),(47/24,.869),(48/24,.911),(49/24,.945),(50/24,1),(3.16,1)])
    start=key(t,[(0,0),(2.9,0),(3.0,.60),(3.04,.79),(3.09,.92),(3.15,1)])
    if reveal>start:
        p=RIGHT.part(start,reveal)
        if revision and material_blend>0:
            s+=path(p,stroke='#78c7f0',width=91,opacity=.65)
            base_colors=[color_mix('#fba8fa',gradient_colors[0],material_blend),color_mix('#fa9cdd',gradient_colors[1],material_blend)]
            s+=colored_stroke(RIGHT,start,reveal,88,base_colors,.24*material_blend)
            s+=path(RIGHT.offset_part(start,reveal,-36),stroke='#d8ffff',width=2,opacity=.24)
            s+=group(path(RIGHT.offset_part(start,reveal,31),stroke=gradient_colors[0],width=8),opacity=.10,filter='url(#blur7)')
        else:
            defs+=gradient('tubePink',[(0,'#ffadfb'),(.5,'#ffa5ed'),(1,'#ff9de3')])
            s+=path(p,stroke='#f000de',width=91,stroke_dasharray='10 11',opacity=.55)
            s+=path(p,stroke='url(#tubePink)',width=90)
        head=key(t,[(38/24,.02),(40/24,.095),(44/24,.34),(48/24,.65),(52/24,.79),(56/24,.885),(60/24,.94),(66/24,.96),(70/24,.985),(74/24,1)])
        end=min(reveal,head)
        if end>start and t>1.55:
            if revision and material_blend>0:
                channel_colors=[color_mix('#d200e9',c,material_blend) for c in gradient_colors]
                s+=colored_stroke(RIGHT,start,end,19,channel_colors,0)
            else:s+=path(RIGHT.part(start,end),stroke='#d200e9',width=19)
            slider_start=max(start,end-.16)
            slider=RIGHT.part(slider_start,end)
            if slider and t>1.55:
                col0,col1=gradient_colors if revision else ('#dc32d1','#d122d3')
                s+=group(raised_slider(RIGHT,slider_start,end,(col0,col1)),opacity=.9)
                pos,_=RIGHT.at(end*RIGHT.length)
                s+=circle(*pos,13.5,'#abf9ff' if revision else '#ffb8f3')
    return defs,s


def left_rail(t):
    if t<1.52 or t>3.14:return ''
    end=key(t,[(1.52,0),(1.58,.04),(1.667,.28),(1.75,.40),(1.833,.62),(1.92,.84),(2.0,1),(3.14,1)])
    p=LEFT.part(0,end)
    if not p:return ''
    alpha=1-ease(t,3.0,3.14)
    s=group(path(p,stroke='#777a76',width=97),transform='translate(5 8)',opacity=.16,filter='url(#blur14)')
    s+=path(p,stroke='#f9faf8',width=94)
    for width,col in [(90,'#eeeeec'),(86,'#e7e8e5'),(82,'#dedfdd'),(78,'#d7d9d5'),(74,'#d4d6d2'),(70,'#d5d7d3'),(66,'#dadcd8'),(62,'#e3e5e0'),(58,'#eceee9'),(54,'#f5f6f2'),(50,'#fafbf7')]:
        s+=path(p,stroke=col,width=width)
    s+=path(LEFT.offset_part(0,end,27),stroke='#ffffff',width=4,opacity=.62)
    s+=path(LEFT.offset_part(0,end,27),stroke='#90958d',width=10,opacity=.13,filter='url(#blur7)')
    knob=key(t,[(1.55,0),(1.667,.03),(1.75,.16),(1.833,.3),(2.0,.53),(2.167,.68),(2.333,.75),(2.5,.8),(2.75,.85),(3,.92)])
    knob=min(end,knob)
    if t>1.70:
        s+=path(LEFT.part(0,knob),stroke='#e03af3',width=15,opacity=ease(t,1.70,1.9))
        s+=path(LEFT.offset_part(0,knob,-3.4),stroke='#ffbafa',width=4,opacity=.45)
    if t<2.04:
        # Fine translucent ruler ticks on the porcelain, before the pink inset.
        for dist in np.arange(50,end*LEFT.length,110):
            pos,v=LEFT.at(dist);normal=np.array([-v[1],v[0]])
            a,b=pos-normal*43,pos+normal*43
            s+=line(*a,*b,'#ffffff',1.4,opacity=.62)
    pos,v=LEFT.at(knob*LEFT.length)
    x,y=pos
    angle=math.degrees(math.atan2(v[1],v[0]))
    k=group(circle(3,8,38,'#858783',opacity=.4),filter='url(#blur7)')
    k+=circle(0,0,38,'url(#knob)','#f8faf7',2)
    k+=circle(0,0,34,'none','#f5f6f3',1)
    k+=path('M-13 -12L13 -12M-13 2L13 2',stroke='#a8aaa6',width=5)
    k+=path('M-13 -14L13 -14M-13 0L13 0',stroke='#f7f8f5',width=3.4)
    s+=group(k,f'translate({x} {y}) rotate({angle-5})')
    return group(s,opacity=alpha,id='porcelain-rail')


def controls(t,revision_colors=None):
    if t<1.61 or t>3.08:return '', ''
    defs='';s=''
    fade=1-ease(t,2.82,3.04)
    # Fine blue selection around the large circular track.
    box=key(t,[(40/24,[1282,198,113,112]),(42/24,[1136,198,259,256]),(44/24,[770,198,625,620]),(2.08,[712,198,683,676]),(3.08,[712,198,683,676])])
    s+=group(rect(*box,'none','#55a9d2',1),opacity=ease(t,1.64,1.75))
    # Green transform bounds track the cyan handle, but not its revision delay.
    box=key(t,[(40/24,[522,515,36,166]),(42/24,[522,497,88,233]),(44/24,[522,433,275,329]),(46/24,[522,395,386,404]),(48/24,[522,373,449,447]),(2.25,[522,345,530,502]),(2.5,[522,341,544,512]),(3.08,[522,341,544,512])])
    s+=group(selection(*box),opacity=ease(t,1.62,1.75))
    # Plus and play buttons arrive with distinct springy scale envelopes.
    for x,col,start,icon in [(624,'#282926',1.6,'plus'),(549,'#28a6f5',1.72,'play')]:
        sc=key(t,[(start,0),(start+.13,1.08),(start+.24,1),(3.08,1)])
        button=circle(0,0,26.5,col)
        if icon=='plus':button+=path('M-13 0H13M0 -13V13',stroke='white',width=7)
        else:button+=path('M-8 -13L14 0L-8 13Z','white')
        button_fade=1-ease(t,2.58 if icon=='plus' else 2.63,2.83 if icon=='plus' else 3.0)
        s+=group(button,f'translate({x} 267) scale({sc})',button_fade)
    # Radial tick marks along the right arc.
    ticks=''
    count=round(key(t,[(2.02,0),(2.25,17),(2.5,6),(2.7,2),(2.9,0)]))
    for i in range(count):
        a=math.radians(-65+i*4)
        ticks+=line(1080+326*math.cos(a),540+326*math.sin(a),1080+351*math.cos(a),540+351*math.sin(a),'#76d66a',2)
    s+=ticks
    # Crop tool below the left rail.
    xx,yy=key(t,[(1.62,[1282,308]),(1.75,[1190,445]),(1.833,[770,816]),(2.15,[712,874]),(3.08,[712,875])])
    crop=path('M-27 0H-5M5 0H26M0 -27V-5M0 5V26',stroke='#101411',width=2.4)
    crop+=rect(17,17,8,8,'white','#111',2)
    s+=group(crop,f'translate({xx} {yy})')
    # Speech tile is separate from the orange cursor and the porcelain.
    sc=key(t,[(2.02,0),(2.10,1.1),(2.25,1),(3.08,1)])
    speech=rect(-61,-45,122,86,'url(#speech)','#c9c7f7',1,15)
    speech+=path('M7 39L26 60L25 39Z','#bdbafa','#a6a1e5',1)
    for y in (-15,-2,11):speech+=line(-31,y,29,y,'white',2)
    speech_x,speech_y=key(t,[(2.02,[790,873]),(2.10,[824,850]),(2.167,[852,826]),(2.25,[852,826]),(2.5,[852,854]),(3.08,[852,854])])
    s+=group(speech,f'translate({speech_x} {speech_y}) rotate({key(t,[(2.05,-8),(2.25,4),(2.5,0),(3,0)])}) scale({sc})')
    # Lime wireframe icon behind the control panel.
    w=ease(t,2.03,2.17)
    s+=group(rect(1272,730,99,115,'none','#9bd84e',2)+path('M1272 730L1371 845M1371 730L1272 845',stroke='#9bd84e',width=2),opacity=w)
    # Colored objects, seen through and behind the frosted pane.
    defs+=gradient('orangeGlass',[(0,'#ffb52b'),(.45,'#ffd671'),(1,'#fff0c9')],('0%','0%','100%','100%'))
    defs+=gradient('blueBubble',[(0,'#f4efff'),(.5,'#c8c0ff'),(1,'#9689ff')],('0%','0%','100%','100%'))
    panel=key(t,[(1.83,[1325,530,40,140]),(2.0,[1282,497,156,173]),(2.167,[1218,470,254,259]),(3.08,[1218,470,260,265])])
    px,py,pw,ph=panel
    grow=ease(t,1.82,2.13)
    s+=group(circle(1449,606,42,'url(#blueBubble)'),opacity=ease(t,2.18,2.31))
    defs+=gradient('limeBubble',[(0,'#efffc4'),(.4,'#b9ff45'),(1,'#96e900')],('0%','0%','0%','100%'))
    s+=group(rect(1320,684,126,81,'url(#limeBubble)',r=42),opacity=ease(t,2.12,2.27))
    grid=rect(1196,420,110,110,'url(#orangeGlass)',r=9)
    for k in range(3):
        x=1205+k*46;y=429+k*46
        grid+=line(x,420,x,530,'#fff3cd',.8)+line(1196,y,1306,y,'#fff3cd',.8)
    grid+=circle(1251,475,39,'none','#fff2bf',.8)+circle(1251,475,15,'none','#fff2bf',.8)+path('M1203 427L1299 524M1299 427L1203 524',stroke='#fff2bf',width=.8)
    s+=group(grid,opacity=ease(t,2.04,2.18))
    # Clipped, blurred layers reconstruct translucent contents behind glass.
    defs+=f'<clipPath id="glassClip">{rect(px,py,pw,ph,r=9)}</clipPath>'
    glass=rect(px,py,pw,ph,'#ffffff',r=9,opacity=.32)
    refracted=color_mix(*revision_colors,.6) if revision_colors else '#ff1dbb'
    glass+=group(path('M1320 460C1355 540 1340 630 1262 730',stroke=refracted,width=70,opacity=.90)+circle(1453,605,43,'#a695fc',opacity=.85)+circle(1370,750,51,'#9df000',opacity=.7)+rect(1190,432,92,94,'#ffc764',opacity=.6),filter='url(#blur14)')
    glass+=rect(px,py,pw,ph,'#f6f8f6',r=9,opacity=.18)
    s+=group(glass,clip_path='url(#glassClip)',opacity=grow)
    s+=group(rect(px,py,pw,ph,'none','#c7c9c7',1.1,9),opacity=grow)
    # Switches are normalized within the growing pane.
    switches=rect(1253,519,180,64,'#fffafc',r=32,opacity=.92)
    sliderx=key(t,[(1.9,0),(2.10,1),(2.38,1),(2.62,.45),(2.74,.7),(2.88,.2),(3.08,.2)])
    switches+=circle(1286+117*sliderx,551,27,'#f643f5','white',1)
    switches+=rect(1253,620,180,64,'url(#switch)','#d3d7d3',1,32)
    switches+=group(circle(1287,656,28,'#7f827c',opacity=.25),filter='url(#blur3)')
    switches+=circle(1287,651,27,'#dce3de','#e3eae5',1)
    # Scale switches with their panel, keeping the bottom switch independent.
    switches=group(switches,f'translate({px} {py}) scale({pw/254} {ph/259}) translate(-1218 -470)')
    s+=group(switches,opacity=grow)
    return defs,group(s,opacity=fade,id='ui-controls')
