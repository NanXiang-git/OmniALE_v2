"""Individually animated print swatches, sliced negative mark and editor guides."""
import math
from .geometry import *
from .drawing import *


def crosshair(x,y,t,side):
    s=''
    for dx,dy,c in [(1.5,-1.5,'#ef00e7'),(-1.5,1.5,'#6ace00'),(0,0,'#101112')]:
        s+=line(x-53+dx,y+dy,x+53+dx,y+dy,c,1.5)
        s+=line(x+dx,y-53+dy,x+dx,y+53+dy,c,1.5)
    ring=ease(t,.73 if side else .86,.88 if side else 1.1)*(1-ease(t,1.36,1.55))
    if ring>0:
        s+=group(circle(x,y,35,'white','#060b11',2)+circle(x+1,y-1,32,'none','#46c6f4',1)+circle(x-1,y+1,32,'none','#7ad300',1),opacity=ring)
    core=ease(t,.88 if side else 1.12,.94 if side else 1.18)*(1-ease(t,1.30,1.40))
    s+=circle(x,y,18,'#030509',opacity=core)
    return s


def draw(t):
    if t>2.23:return '', ''
    defs=''
    b=''
    # The first visible object is the pale rightmost color chip.
    chips=key(t,[(0,0),(.042,0),(.083,1),(.25,2),(.333,3),(.50,4),(.583,5),(1.79,5),(2.05,2),(2.18,0)])
    chip_colors=['#d52d9d','#e980b9','#ed9dca','#edb4d0','#fbddea']
    # Grow from rightmost pale to leftmost saturated, anchored at x=1084.
    for i in range(5):
        x=1084+i*84
        a=clamp(chips-(4-i))
        # Before the composition opens, the narrow palette sits at x=1084.
        if t<.55:
            k=max(0,4-i)
            x=1084+max(0,i-(5-chips))*84
        if a:
            b+=group(rect(x,913,84,149,chip_colors[i], '#f8e4ef',.6),opacity=a)
    if t<.245:return defs,b
    # Expanding frame around a fixed crop of the right half-circle.
    ytop=key(t,[(.25,616),(.458,616),(.5,567),(.542,567),(.583,306),(.625,306),(.667,190),(.708,190),(.75,183),(36/24,183),(38/24,246),(40/24,361),(42/24,524),(44/24,762),(46/24,897)])
    ww=key(t,[(.25,0),(.292,0),(.333,230),(.375,230),(.417,350),(.458,350),(.5,414),(2.1,414)])
    yy=min(ytop,897)
    defs+=f'<clipPath id="rightPrintCrop">{rect(1084,yy,ww,897-yy)}</clipPath>'
    orange_ink=ease(t,.45,.70)
    defs+=gradient('printRight',[(0,'#7f264f'),(.55,'#8d2e58'),(.72,'#96305d'),(.89,color_mix('#85274f','#ff9d18',orange_ink)),(1,color_mix('#82254d','#ff9a19',orange_ink))],('0%','0%','0%','100%'))
    d=circle_arc(1080,540,266,-90,90)
    right=path(d,stroke='url(#printRight)',width=90)
    defs+=f'<mask id="rightInk" maskUnits="userSpaceOnUse" x="0" y="0" width="1920" height="1080">{path(d,stroke="white",width=90)}</mask>'
    dots=''
    for y in range(454,854,12):
        for x in range(1084,1395,12):
            # Traveling halftone screen, in vector circles.
            dist=math.hypot((x-1250)/1.0,(y-(804-180*ease(t,.5,1.5)))*.85)
            rad=clamp(1-dist/165)*5.2
            if rad>.35:
                dots+=circle(x,y,rad,'#ffb20b' if y<720 else '#8f2862')
    right+=group(dots,mask='url(#rightInk)',opacity=orange_ink)
    right+=group(rect(1050,200,440,690,'url(#grain)'),mask='url(#rightInk)',opacity=.6)
    b+=group(right,clip_path='url(#rightPrintCrop)',opacity=1-ease(t,1.78,1.88))
    guide=selection(1084,yy,ww,897-yy,'#e83c7c','square',9)
    if t>.55:
        guide+=line(1498,yy-62,1498,yy-22,'#e83c7c',1.4)+line(1520,yy,1560,yy,'#e83c7c',1.3)
        guide+=line(1084,850,1390,850,'#e83c7c',1.3)
        aa=rect(1388,yy+15,99,86,'#ff9900')
        aa+='<text x="1438" y="'+str(yy+76)+'" fill="white" text-anchor="middle" font-family="DejaVu Sans" font-size="61"><tspan font-weight="bold">A</tspan>a</text>'
        guide+=group(aa,opacity=1-ease(t,1.69,1.79))
    b+=group(guide,opacity=(1-ease(t,1.82,2.04))*ease(t,.25,.32))
    # Central vertical specimen. Its two negative white curves are independent.
    defs+=gradient('midInk',[(0,'#e22c77'),(.4,'#dc3982'),(1,color_mix('#db317a','#47a8be',ease(t,.68,.92)))],('0%','0%','0%','100%'))
    defs+=gradient('midReveal',[(0,'#ffffff'),(.45,'#ffffff'),(1,'#ffffff')])
    defs+=f'<clipPath id="midCard">{rect(819,180,250,455)}</clipPath>'
    mid=rect(819,180,250,455,'url(#midInk)')
    mid+=path(LEFT.svg(),stroke='#f5f6f4',width=90)
    mid+=path(circle_arc(1080,540,266,-140,-90),stroke='#f7f7f5',width=90)
    mid+=rect(819,180,250,455,'url(#grain)',opacity=.65)
    # White wipes are tied to each card, not to the whole composition.
    reveal=ease(t,.44,.69);exit=ease(t,1.35,1.66)
    if reveal<1:
        defs+=gradient('midFade',[(0,'#ffffff'),(.2,'#ffffff'),(.95,'#ffffff')])
        # Progressive top-to-bottom ink reveal through a local mask.
        defs+=f'<linearGradient id="midAlpha" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="white" stop-opacity="0"/><stop offset="{max(.001,1-reveal):.4f}" stop-color="white" stop-opacity="0"/><stop offset="1" stop-color="white"/></linearGradient><mask id="midAM">{rect(819,180,250,455,"url(#midAlpha)")}</mask>'
        mid=group(mid,mask='url(#midAM)')
    b+=group(mid,clip_path='url(#midCard)',opacity=(1-exit)*reveal)
    # Pink lower diagonal emerges ahead of the UI rail.
    defs+=gradient('coral',[(0,'#fff8ef'),(.45,'#ffb5b9'),(1,'#fc3c7d')],('0%','0%','100%','100%'))
    defs+=f'<clipPath id="lowerSlice">{rect(819,635,250,215)}</clipPath>'
    lower_start=key(t,[(.52,.18),(.667,.15),(.85,.08),(1,0)])
    b+=group(path(RIGHT.part(lower_start,1),stroke='url(#coral)',width=90),clip_path='url(#lowerSlice)',opacity=ease(t,.52,.72)*(1-ease(t,1.51,1.69)))
    # Left printed negative, built from card, outer loop and white diagonal.
    red=ease(t,1.02,1.22)
    defs+=gradient('leftInk',[(0,color_mix('#afb0b0','#d7274e',red)),(.4,color_mix('#aaa9ab','#c75975',red)),(.72,'#a8a3a4'),(1,'#a8aaac')],('0%','0%','0%','100%'))
    defs+=f'<clipPath id="leftCard">{rect(532,446,271,452)}</clipPath>'
    left=rect(532,446,271,452,'url(#leftInk)')
    left+=path(LEFT.svg(),stroke='white',width=90)
    left+=path(RIGHT.svg(),stroke='white',width=90)
    left+=rect(532,446,271,452,'url(#grain)',opacity=.8)
    top_a=1-ease(t,1.40,1.72)
    mid_a=1-ease(t,1.52,1.76)
    low_a=1-ease(t,1.70,1.88)
    defs+=f'<linearGradient id="leftPrintAlpha" x1="0" y1="446" x2="0" y2="898" gradientUnits="userSpaceOnUse"><stop stop-color="white" stop-opacity="{top_a}"/><stop offset=".48" stop-color="white" stop-opacity="{mid_a}"/><stop offset="1" stop-color="white" stop-opacity="{low_a}"/></linearGradient><mask id="leftPrintExit" maskUnits="userSpaceOnUse" x="532" y="446" width="271" height="452">{rect(532,446,271,452,"url(#leftPrintAlpha)")}</mask>'
    b+=group(left,clip_path='url(#leftCard)',mask='url(#leftPrintExit)',opacity=ease(t,.64,.92))
    # Top horizontal registration swatches have independent horizontal wipes.
    topalpha=ease(t,.56,.78)*(1-ease(t,1.40,1.62))
    if topalpha:
        yellowblue=key(t,[(.5,0),(.70,0),(.85,.55),(1,1),(1.2,.6),(1.4,0)])
        c=color_mix('#efb13c','#27c0ee',yellowblue)
        defs+=gradient('swatchOne',[(0,color_mix('#ffffff',c,yellowblue)),(.32,c),(.8,c),(1,color_mix('#af9a77','#27c0ee',yellowblue))])
        defs+=gradient('swatchTwo',[(0,c),(.22,c),(.60,color_mix('#ffffff',c,yellowblue)),(1,color_mix('#ffffff','#28bfed',yellowblue))])
        left_x=key(t,[(.56,707),(.667,515),(.75,351),(1.33,351),(1.50,351),(1.62,351)])
        right_x=key(t,[(.56,708),(1.33,708),(1.50,516),(1.62,516)])
        lower_x=key(t,[(.56,351),(1.33,351),(1.50,516),(1.62,708)])
        defs+=f'<clipPath id="upperSwatchClip">{rect(left_x,210,right_x-left_x,125)}</clipPath><clipPath id="lowerSwatchClip">{rect(lower_x,335,708-lower_x,96)}</clipPath>'
        upper=rect(351,210,357,29,'#fb65ef')+rect(351,210,165*clamp(1.5-(t-.8)*2),29,'#474047')+rect(667,210,41,29,'#f9db00')
        upper+=rect(351,239,357,96,'url(#swatchOne)')
        lower=rect(351,335,357,96,'url(#swatchTwo)')
        # Independently traveling magenta ink passes through the two rows.
        for name,y,phase,body in [('upper',239,0,upper),('lower',335,.055,lower)]:
            wave=ease(t,1.02+phase,1.33+phase)
            wx=key(t,[(1.02+phase,708),(1.16+phase,470),(1.33+phase,351)])
            defs+=gradient('wave-'+name,[(0,color_mix('#29bfe9','#ec29ca',wave)),(.45,'#ec29ca'),(1,'#ec29ca')])
            body+=group(rect(wx,y,708-wx,96,'url(#wave-'+name+')'),opacity=clamp(wave*2))
            body+=rect(351,210,357,221,'url(#grain)',opacity=.65)
            b+=group(body,clip_path='url(#'+name+'SwatchClip)',opacity=topalpha)
    # Green and orange/blue head swatches.
    defs+=gradient('greenFade',[(0,'#84cf1b'),(.3,'#89ce25'),(1,'#ffffff')],('0%','0%','0%','100%'))
    defs+=gradient('headFade',[(0,'#efa52b'),(.5,'#e8a537'),(1,'#a9bcb1')])
    defs+=gradient('headBlue',[(0,'#429ed4'),(.65,'#a4d0eb'),(1,'#f2f8fc')])
    b+=group(rect(723,64,80,281,'url(#greenFade)')+rect(723,64,80,281,'url(#grain)',opacity=.3),opacity=ease(t,.61,.78)*(1-ease(t,1.25,1.47)))
    b+=group(rect(819,64,250,101,'url(#headFade)')+group(rect(819,64,250,101,'url(#headBlue)'),opacity=ease(t,1.10,1.33)),opacity=ease(t,.55,.78)*(1-ease(t,1.30,1.46)))
    # Small CMYK dot triangles sit across, and below, the middle slice.
    dots=''
    for y in range(346,444,10):
        for x in range(723,891,10):
            if x < key(t,[(.65,723),(.95,891),(1.3,840),(1.6,723)]):
                dots+=circle(x,y,2.6,'#ff00ed')+circle(x+2,y+2,1.5,'#f0f000')
    for y in range(782,848,10):
        for x in range(821,918,10):
            if (x-821)/97<(y-782)/66:dots+=circle(x,y,3,'#ff00c5')+circle(x+3,y+1,1.5,'#ffb900')
    b+=group(dots,opacity=ease(t,.58,.91)*(1-ease(t,1.54,1.75)))
    # Thin cyan construction grid retreats one line at a time.
    guides=''
    for i,(x,ya,yb) in enumerate([(421,165,610),(437,299,635),(517,165,898),(532,165,898),(612,165,898),(627,239,898),(708,197,898),(723,64,898),(803,64,898),(819,64,898),(1069,180,1062)]):
        alpha=ease(t,.45+i*.015,.65+i*.016)*(1-ease(t,1.60+i*.017,1.82+i*.017))
        guides+=group(line(x,ya,x,yb,'#61b6e1',1),opacity=alpha)
    guides+=group(line(351,446,637,446,'#61b6e1',1),opacity=ease(t,.7,.85)*(1-ease(t,1.8,1.9)))
    b+=guides
    if t>.54:
        b+=group(crosshair(1498,539,t,1),opacity=ease(t,.54,.65)*(1-ease(t,1.64,1.78)))
    if t>.79:
        b+=group(crosshair(517,540,t,0),opacity=ease(t,.79,.94)*(1-ease(t,1.69,1.84)))
    rules=''
    for j in range(5):
        w=key(t,[(.68,0),(.92,120),(1.3,120),(1.6,120-j*7),(1.85,0)])
        rules+=line(1047-w,901+j*16.5,1047,901+j*16.5,'#ed4584',1.4)
    b+=rules
    return defs,b
