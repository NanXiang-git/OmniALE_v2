"""Independent vector stickers, curved lettering and animated paper reveals."""
import re
import math
import xml.etree.ElementTree as ET
from .drawing import *
from .geometry import *
from .lettering import Lettering,reverse


def unnamespace(el):
    for e in el.iter():
        e.tag=e.tag.split('}')[-1]
    return ET.tostring(el,encoding='unicode')


class Illustration:
    def __init__(self,text):
        tree=ET.parse(ROOT/'assets/illustration.svg').getroot()
        self.defs=''
        self.objects={}
        for e in tree:
            if e.tag.endswith('defs'):self.defs+=''.join(unnamespace(c) for c in e)
            elif e.attrib.get('id'):self.objects[e.attrib['id']]=unnamespace(e)
        self.defs+=gradient('lateOrange',[(0,'#ffffff'),(.38,'#ffb34b'),(.7,'#ff970b'),(1,'#ff970b')])
        lettering=Lettering()
        self.text=text
        self.leftcurve=reverse(LEFT_ILL)
        self.rightcurve=reverse(RIGHT)
        lower_height=lambda d: 83*clamp(d/(LEFT_ILL.length*.13))
        # Reflow revised words away from the thin pointed end so no glyph is
        # squeezed into the vanishing tail of the ribbon.
        tail_start=16 if text=='TOGETHER' else 85
        self.lefttext=lettering.word(self.leftcurve,text,tail_start,456,height=lower_height)+lettering.word(self.leftcurve,text,471,1104,height=83)
        self.righttext=lettering.repeated(self.rightcurve,text,[(0,643),(667,1382)],height=84)
        self.mono=lettering.repeated(self.rightcurve,text,[(0,643),(667,1382)],fill='#ffffff',height=80)
        self.mono=self.mono.replace('stroke="#211118"','stroke="#ffffff"')

    def obj(self,name,t,start,end,center,rot=0,flip=False,move=(0,0)):
        p=ease(t,start,end)
        if name=='yellow_fan':
            p=key(t,[(2.60,0),(2.625,.45),(2.667,.70),(2.792,.96),(2.917,1)])
        if p<=0:return ''
        # Cubic easing and a small spring settle for the sticker unfurl.
        sc=p+(math.sin(p*math.pi)*.075 if not flip else 0)
        sx=sc if not flip else max(.015,p*p)
        cx,cy=center
        dx,dy=move
        angle=rot*(1-p)
        late=ease(t,3.77,4.03)
        # The final beat turns several stickers away as fresh print enters.
        # Fold each named surface around its own hinge; the main composition
        # stays fixed, and lettering is still attached to its original curves.
        sy=sc
        if name=='crown':
            sy*=1-.53*late;angle+=-14*late
        elif name=='flower_sticker':
            sx*=1-.91*late;sy*=1-.93*late;angle+=60*late
        elif name=='mushroom':
            sy*=1-.48*late;angle+=10*late
        elif name=='right_arrow':angle+=-27*late
        elif name=='right_leaf':angle+=-21*late;sy*=1-.15*late
        elif name=='apple':sy*=1-.42*late;angle+=15*late
        elif name in ('green_spark','tiny_spark'):
            sx*=1.3*(1-.92*late);sy*=1.3*(1-.87*late);angle+=32*late
        elif name=='yellow_fan':
            sy*=1-.10*ease(t,3.60,3.85);angle+=5*late
        transform=f'translate({cx+dx*(1-p)} {cy+dy*(1-p)}) rotate({angle}) scale({sx} {sy}) translate({-cx} {-cy})'
        return group(self.objects[name],transform,id=f'anim-{name}')

    def back(self,t):
        if t<2.56:return '', ''
        s='';defs=self.defs
        if t>3.53:
            a,b=self.mono_interval(t)
            d=RIGHT.part(a,b)
            defs+=f'<mask id="monoClip" maskUnits="userSpaceOnUse" x="0" y="0" width="1920" height="1080">{path(d,stroke="white",width=88)}</mask>'
            s+=path(d,stroke='#050505',width=92)
            s+=group(self.mono,mask='url(#monoClip)')
        # Stable depth order; all pieces remain individual edit targets.
        specs=[
            ('red_petals',2.78,3.06,(1230,740),-45,True,(0,0)),
            ('yellow_fan',2.55,2.88,(842,718),-20,False,(-55,70)),
            ('lavender_blob',2.69,2.93,(670,565),-55,True,(-40,40)),
            ('right_lime',2.84,3.04,(1230,510),30,True,(0,20)),
            ('top_feather',2.82,3.05,(1005,365),30,True,(45,50)),
            ('crown',3.10,3.34,(1019,270),-10,True,(0,10)),
            ('bottom_star',3.09,3.27,(1237,921),-65,False,(0,-40)),
            ('left_star',3.00,3.17,(489,664),-45,False,(80,25)),
            ('rolled_paper',3.13,3.29,(527,760),45,True,(15,-10)),
            ('pastel_plus',3.13,3.30,(531,698),-45,False,(0,0)),
            ('pencil',3.26,3.43,(589,354),-25,True,(0,15)),
            ('left_curl',3.30,3.47,(421,501),-65,False,(25,0)),
            ('eye_sticker',3.20,3.40,(1431,630),45,True,(-25,0)),
            ('orbit',3.13,3.39,(1386,794),-25,False,(-20,0)),
            ('mushroom',3.23,3.49,(1229,188),35,True,(0,20)),
            ('flower_sticker',3.24,3.41,(1333,267),-20,True,(-20,0)),
            ('right_leaf',3.28,3.44,(1434,365),-25,True,(-20,0)),
            ('right_arrow',3.33,3.52,(1467,436),-35,True,(-25,0)),
            ('green_spark',3.44,3.62,(1383,184),40,True,(0,0)),
            ('tiny_spark',3.51,3.67,(957,72),-20,False,(0,10)),
            ('small_link',3.40,3.62,(478,884),-65,False,(10,-10)),
            ('little_tiles',3.46,3.68,(365,837),-50,True,(30,-10)),
        ]
        # Color bars that enter at the end of the supplied excerpt.
        bar=ease(t,3.82,3.99)
        if bar:
            s+=group(rect(1417,265,111,267,'#a887ff')+rect(1417,265,111,267,'url(#cool)',opacity=.5),opacity=bar)
            s+=group(rect(1100,132,398,133,'url(#lateOrange)')+rect(1466,132,32,265,'#a99aff')+rect(1555,265,9,132,'#f8b0f4'),opacity=bar)
            # A tiny warm flower is revealed behind the folded flower sticker.
            tulip=path('M1372 450Q1387 416 1385 390',stroke='#a4f000',width=6)
            tulip+=path('M1384 411C1350 409 1348 378 1360 371C1368 363 1374 376 1377 383C1378 360 1392 359 1398 380C1413 370 1421 388 1410 403Q1398 418 1384 411Z','#ffaa25')
            s+=group(tulip,opacity=bar)
        for a in specs:s+=self.obj(a[0],t,*a[1:])
        s+=self.obj('magenta_body',t,2.69,2.89,(1120,652),-25,True,(35,30))
        return defs,s

    def mono_interval(self,t):
        return .724,key(t,[(3.53,.724),(3.67,.83),(3.83,.93),(3.96,1)])

    def front(self,t):
        if t<2.57:return '', ''
        s='';defs=''
        pl=key(t,[(2.57,0),(2.625,.028),(2.71,.095),(2.792,.27),(2.875,.46),(2.958,.64),(3.042,.73),(3.167,.95),(3.25,1),(4,1)])
        pr=key(t,[(2.57,0),(2.625,.025),(2.71,.09),(2.792,.20),(2.875,.37),(2.958,.54),(3.042,.66),(3.125,.76),(3.208,.92),(3.292,1),(4,1)])
        # The main ribbons share the reference topology. Text is clipped by
        # the real developing ribbon, then foreground objects occlude it.
        for name,curve,progress,letters in [('left',LEFT_ILL,pl,self.lefttext),('right',RIGHT,pr,self.righttext)]:
            d=curve.part(0,progress)
            if not d:continue
            if name=='right' and t>3.53:
                a,b=self.mono_interval(t)
                # Color peels away to a monochrome surface behind the leaves.
                d=curve.part(0,min(a,progress))+curve.part(b,progress)
            if name=='left':
                shape=ribbon_outline(curve,progress,89)
                defs+=f'<clipPath id="ink-{name}">{path(shape,"white")}</clipPath>'
                s+=group(path(ribbon_outline(curve,progress,99),'#000'),transform='translate(5 6)')
                s+=path(shape,'url(#hot)','#191219',1.5)
                s+=group(letters,clip_path=f'url(#ink-{name})',opacity=ease(t,2.66,2.735))
            else:
                defs+=f'<mask id="ink-{name}" maskUnits="userSpaceOnUse" x="0" y="0" width="1920" height="1080">{path(d,stroke="white",width=88)}</mask>'
                s+=group(path(d,stroke='#000000',width=99),transform='translate(6 7)')
                s+=path(d,stroke='#191219',width=92)
                s+=path(d,stroke='url(#hot)',width=89)
                s+=group(letters,mask=f'url(#ink-{name})',opacity=ease(t,2.66,2.735))
        # Apple is a foreground sticker, masking the inner edge of the tube.
        s+=self.obj('apple',t,3.04,3.135,(1175,562),40,True,(30,-10))
        s+=self.obj('link_badge',t,3.03,3.17,(649,848),-45,False,(0,-30))
        # Two small white glints sit above the ink and below the paper curls.
        s+=self.obj('white_spark_bottom',t,3.22,3.40,(763,752),35,False,(0,0))
        s+=self.obj('white_spark_top',t,3.42,3.62,(930,266),-15,False,(0,0))
        return defs,s

    def peels(self,t):
        if t<2.52:return ''
        s=''
        # Animated curl surfaces are designed paths, never pieces of input.
        data=[
            (2.53,2.65,[(2.53,[643,626,-32,.3]),(2.57,[666,626,-30,1]),(2.65,[697,675,-48,.1])]),
            (2.64,2.93,[(2.64,[798,740,-42,.1]),(2.71,[935,721,-65,1]),(2.80,[1139,750,-82,1]),(2.87,[1252,718,-105,.8]),(2.93,[1280,720,-115,0])]),
            (2.93,3.13,[(2.93,[994,390,4,.1]),(3.0,[1015,400,8,1]),(3.08,[1076,365,40,.65]),(3.13,[1115,320,65,0])]),
            (3.14,3.43,[(3.14,[603,451,-62,.1]),(3.23,[626,403,-65,1]),(3.33,[657,356,-65,.75]),(3.43,[685,330,-65,0])]),
            (3.18,3.40,[(3.18,[1150,197,8,.1]),(3.30,[1220,180,8,.9]),(3.40,[1300,180,8,0])]),
            (3.83,4.02,[(3.83,[1095,505,10,0]),(3.96,[1187,574,20,.85]),(4.02,[1285,620,25,.3])]),
        ]
        for a,b,keys in data:
            if not a<=t<=b:continue
            x,y,ang,sc=key(t,keys)
            d='M-130 -10C-96 -39 -40 -28 0 -12C54 9 88 18 135 11L116 -19C44 -23 -24 -32 -61 -21C-93 -14 -112 -3 -130 -10Z'
            s+=group(path(d,'url(#peel)',None),f'translate({x} {y}) rotate({ang}) scale({sc})')
        # Broad curled fronts of the large lavender and magenta stickers.
        # These develop independently of the ink ribbons behind them.
        for a,b,keys,local_d in [
            (2.69,2.91,[(2.69,[775,582,-7,.08]),(2.79,[730,590,-9,1]),(2.85,[698,582,-11,.8]),(2.91,[653,565,-15,0])],
             'M-18 -190C34 -92 44 39 0 172C-38 194 -66 191 -85 176C-13 72 2 -47 -18 -190Z'),
            (2.77,3.03,[(2.77,[1152,693,-12,.05]),(2.83,[1161,694,-10,1]),(2.91,[1270,672,-29,.85]),(3.03,[1384,615,-38,0])],
             'M-24 -209C48 -129 61 67 35 190L-26 203C-19 169 -71 118 -93 72C-105 40 -107 -11 -59 -24C-50 -109 -39 -172 -24 -209Z'),
        ]:
            if a<=t<=b:
                x,y,ang,sc=key(t,keys)
                s+=group(path(local_d,'url(#peel)'),f'translate({x} {y}) rotate({ang}) scale({sc})')
        # The turned colored tab sits above the new monochrome upper arc.
        if t>3.64:
            u=ease(t,3.64,4.0)
            x=1122-186*u;y=273+48*u;ang=-4-22*u
            tab=path('M-45 38L-40 -38L47 -25L61 30Z','#080808')
            tab+=path('M-50 28L-46 -42L39 -31L50 20Z','url(#hot)','#20151d',1.5)
            s+=group(tab,f'translate({x} {y}) rotate({ang}) scale({1-.28*u})')
        return s
