"""Independently transformable illustration stickers and interface controls."""
from drawing import *

def star(ctx,x,y,r,n,c,inner=.35,rot=0,outline='#101010'):
    pts=[]
    for i in range(n*2):
        a=rot+i*PI/n-PI/2;rr=r if i%2==0 else r*inner;pts.append((x+rr*math.cos(a),y+rr*math.sin(a)))
    poly(ctx,pts,c,outline,1.2)

def flower(ctx,x,y,r,c,center='#ffe57c',n=7,outline=None,tilt=0):
    for i in range(n):
        a=2*PI*i/n+tilt
        ellipse(ctx,x+math.cos(a)*r*.53,y+math.sin(a)*r*.53,r*.47,r*.29,c,outline,1,rot=a)
    circle(ctx,x,y,r*.25,center,outline,.6)

def sticker_flower(ctx,x,y,r,c):
    pts=[]
    for a in np.linspace(0,2*PI,192,endpoint=False):
        rr=r*(.83+.17*math.cos(8*a));pts.append((x+rr*math.cos(a),y+rr*math.sin(a)))
    poly(ctx,[(xx+4,yy+5) for xx,yy in pts],'#111111','#111111',21)
    poly(ctx,pts,'#ffffff','#ffffff',16)
    poly(ctx,pts,gradient(x-r,y-r,x+r,y+r,[(0,'#f6ff00'),(.55,c),(1,'#70dfba')]),'#111111',1.1)

def mushroom(ctx,x,y,s=1,rot=0):
    ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(s,s)
    path(ctx,[['M',-19,-6],['C',-11,17,-8,53,-30,76],['C',-9,91,17,92,31,77],['C',17,53,15,18,17,-6],['Z']]);fill(ctx,gradient(-30,0,30,80,[(0,'#ff82ce'),(.5,'#9189fa'),(1,'#68cded')]),'#0c0c0c',1.1)
    path(ctx,[['M',-79,-9],['C',-80,-37,-47,-45,-34,-80],['C',-12,-125,25,-107,52,-72],['C',64,-57,101,-52,85,-18],['C',58,28,-49,27,-79,-9],['Z']]);fill(ctx,gradient(-80,-60,80,20,[(0,'#fd89d6'),(.5,'#9f8cf0'),(1,'#30aae9')]),'#111111',1.3)
    ellipse(ctx,3,-2,69,29,gradient(-40,0,50,-15,[(0,'#0ac6ed'),(.4,'#9c1fff'),(1,'#5124bf')]),'#171020',1)
    ctx.restore()

def pencil_sticker(ctx,x,y,s=1,rot=-.65):
    ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(s,s)
    poly(ctx,[(-134,-36),(64,-36),(86,-24),(86,37),(64,42),(-134,42),(-193,3)],'#ffffff','#131313',1.1)
    poly(ctx,[(-128,-29),(65,-29),(76,-19),(76,31),(-128,34),(-181,3)],'#ffde17','#151515',1)
    poly(ctx,[(-128,-29),(-128,34),(-181,3)],'#d3ab79','#151515',1)
    poly(ctx,[(-160,-10),(-181,3),(-158,16)],'#080808')
    rect(ctx,-127,-29,151,18,gradient(-130,-20,20,-20,[(0,'#ff9300'),(1,'#fff329')]),'#181818',1,r=8)
    rect(ctx,-127,-9,151,18,'#ffbd0a','#181818',1,r=8)
    rect(ctx,-127,12,151,19,'#f9d828','#181818',1,r=8)
    rect(ctx,24,-29,20,62,'#ffb805','#151515',1)
    ctx.restore()

def arrow_sticker(ctx,x,y,s=1,rot=0):
    pts=[(84,-27),(-7,-27),(21,-73),(-5,-83),(-79,-4),(0,72),(24,55),(-10,18),(84,18)]
    ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(s,s)
    poly(ctx,[(a+5,b+6) for a,b in pts],'#111111','#111111',12)
    poly(ctx,pts,'#ffffff','#ffffff',12)
    poly(ctx,pts,gradient(-80,-20,80,40,[(0,'#a2fb00'),(1,'#faff00')]),'#111111',1.2)
    ctx.restore()

def coil(ctx,x,y,s=1,rot=0):
    ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(s,s)
    p=[['M',-98,21],['C',-85,-57,-15,-75,-2,-12],['C',18,79,-47,86,-47,32],['C',-47,-33,68,-44,99,27]]
    path(ctx,p);stroke(ctx,'#111111',23)
    path(ctx,p);stroke(ctx,gradient(-100,0,100,0,[(0,'#e800d4'),(1,'#fa003d')]),20)
    ctx.restore()

def cloud_shape(ctx,x,y,s,c,outline='#111111'):
    ctx.save();ctx.translate(x,y);ctx.scale(s,s)
    path(ctx,[['M',-70,25],['C',-135,10,-103,-75,-56,-60],['C',-66,-132,25,-130,35,-73],['C',68,-116,125,-92,116,-42],['C',184,-43,178,41,119,42],['C',141,102,77,142,37,105],['C',-3,149,-69,119,-70,74],['C',-129,95,-151,42,-106,24],['Z']]);fill(ctx,c,outline,1.3/s)
    ctx.restore()

def stickers(ctx,f,amount=1):
    # Motifs pop independently, then continue a small, elastic motion.
    positions=[('crown',1000,232,1),('mushroom',1222,154,1),('flower',1340,256,1),('star',1400,167,1),('pencil',620,350,1),('arrow',1458,430,1),('coil',415,495,1),('cloud',1240,706,1),('burst',470,656,1),('ring',1427,633,1),('spray',554,790,1),('smallstar',1240,923,1)]
    for i,(kind,x,y,s) in enumerate(positions):
        a=smooth(70+i*.78,83+i*.78,f)*amount
        if a<.002:continue
        wig=math.sin(f*.16+i)*2
        ctx.save();ctx.translate(x,y+wig);ctx.scale(a,a);ctx.translate(-x,-y)
        if kind=='crown':
            pts=[(836,157),(970,217),(1015,80),(1060,218),(1180,164),(1140,315),(1110,356),(901,308)]
            poly(ctx,pts,'#8ceb00','#111111',1.3)
            line(ctx,[(877,190),(941,231)],'#111111',1);line(ctx,[(993,161),(1016,133),(1036,209)],'#111111',1)
            star(ctx,968,101,37,8,'#db00d8',.34,rot=.22)
            star(ctx,900,301,58,4,'#ffffff',.15,rot=.23)
            star(ctx,1060,375,194,5,gradient(910,270,1170,470,[(0,'#b4f800'),(.55,'#80dc47'),(1,'#329aff')]),.33,rot=.2)
        elif kind=='mushroom':mushroom(ctx,x,y+15,.80,.12)
        elif kind=='flower':sticker_flower(ctx,x,y,85,'#a0f533')
        elif kind=='star':star(ctx,x,y,64,8,gradient(x-50,y,x+50,y,[(0,'#a2fc37'),(1,'#56b8ea')]),.51,rot=.07)
        elif kind=='pencil':pencil_sticker(ctx,x,y,.95,-.63)
        elif kind=='arrow':arrow_sticker(ctx,x,y,.94,.07)
        elif kind=='coil':coil(ctx,x,y,1,.10)
        elif kind=='cloud':
            cloud_shape(ctx,1270,686,1.42,gradient(1120,600,1400,770,[(0,'#ee00f0'),(1,'#ff0038')]))
            ellipse(ctx,1183,567,97,98,gradient(1120,510,1210,665,[(0,'#aa8afa'),(.6,'#9f88ee'),(1,'#32c9ec')]),'#151515',1)
            line(ctx,[(1155,515),(1170,545),(1190,520)],'#222222',1)
        elif kind=='burst':
            star(ctx,476,653,95,7,gradient(400,620,530,690,[(0,'#e000da'),(1,'#ff004b')]),.49,rot=.1)
            rect(ctx,504,641,43,111,gradient(504,641,550,750,[(0,'#ffabe1'),(1,'#efff00')]),'#111111',1,r=23)
            rect(ctx,467,678,125,43,gradient(470,680,600,720,[(0,'#efff00'),(1,'#ffb0db')]),'#111111',1,r=22)
        elif kind=='ring':
            circle(ctx,x+4,y+6,90,'#111111');circle(ctx,x,y,89,'#ffffff','#111111',1)
            circle(ctx,x,y,79,'#ffa600','#111111',1)
            circle(ctx,x,y,52,(1,.7,0,0),'#653d00',1)
            poly(ctx,[(x-57,y+35),(x+55,y+37),(x,y-49)],(1,.6,0,0),'#653d00',1)
        elif kind=='spray':
            ctx.save();ctx.translate(x,y);ctx.rotate(-.63)
            rect(ctx,-102,-39,172,78,'#ffffff','#111111',1,r=35)
            rect(ctx,-94,-31,161,62,gradient(-90,0,60,0,[(0,'#7ded3e'),(1,'#23a5f0')]),'#111111',1,r=30)
            ellipse(ctx,-66,0,30,31,'#77e87f','#111111',1)
            for j in range(6):ellipse(ctx,-68+j*5,0,17,27,(.2,.9,.5,0),'#111111',.8)
            ctx.restore()
            coil(ctx,482,875,.45,1.47)
            star(ctx,654,853,70,12,gradient(610,810,700,900,[(0,'#dc00dd'),(1,'#ff001a')]),.87,rot=.1)
            text(ctx,'∞',654,878,84,'#f79b00',center=True)
            for j in range(3):
                ctx.save();ctx.translate(354+j*28,836-j*19);ctx.rotate(-.7);rect(ctx,-22,-22,44,44,gradient(-20,-20,20,20,[(0,'#ec00a9'),(1,'#9dfa43')]),'#111111',1,r=6);ctx.restore()
        elif kind=='smallstar':star(ctx,x,y,74,9,'#bcfa24',.25,rot=.13)
        ctx.restore()
    if f>79:
        cloud_shape(ctx,857,742,1.05,gradient(780,660,940,890,[(0,'#87f73a'),(1,'#faff00')]))

def cursor(ctx,x,y,c,scale=1,rot=0):
    ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(scale,scale)
    poly(ctx,[(-20,-30),(38,-8),(5,4),(-5,39)],c,'#ffffff',2.5);ctx.restore()

def handles(ctx,x,y,w,h,c,rounds=False):
    rect(ctx,x,y,w,h,(0,0,0,0),c,1.1)
    for xx,yy in [(x,y),(x+w/2,y),(x+w,y),(x,y+h/2),(x+w,y+h/2),(x,y+h),(x+w/2,y+h),(x+w,y+h)]:
        if rounds:circle(ctx,xx,yy,8,'#ffffff',c,1.3)
        else:rect(ctx,xx-5,yy-5,10,10,'#ffffff',c,1.5)

def crosshair(ctx,x,y,size=50):
    for dy,c in [(-1.2,'#ff00dd'),(1.2,'#b5fd00'),(0,'#111111')]:
        line(ctx,[(x-size,y+dy),(x+size,y+dy)],c,2)
        line(ctx,[(x+dy,y-size),(x+dy,y+size)],c,2)

def glass_panel(ctx,f):
    dx=math.sin((f-46)*.13)*8
    ctx.save();ctx.translate(dx,0)
    # Diffuse refractions behind a translucent card.
    for x,y,r,c in [(1320,550,89,(1,.05,.8,.25)),(1400,613,52,(.52,.42,1,.58)),(1347,707,34,(.5,1,0,.9))]:circle(ctx,x,y,r,c)
    from PIL import ImageFilter
    target=ctx.get_group_target();target.flush()
    try:
        arr=np.frombuffer(target.get_data(),np.uint8).reshape(target.get_height(),target.get_stride()//4,4)
        # The crop is a lighting effect computed from the independently editable underlying vectors.
        if target.get_width()>=1480 and target.get_height()>=735:
            crop=arr[470:731,1214:1476][:,:,[2,1,0,3]].copy()
            im=Image.fromarray(crop).filter(ImageFilter.GaussianBlur(17));data=np.array(im);data=data[:,:,[2,1,0,3]].copy()
            sf=cairo.ImageSurface.create_for_data(data,cairo.FORMAT_ARGB32,262,261)
            ctx.save();rect(ctx,1214,470,262,261,(0,0,0,0),r=12)
            ctx.new_path();ctx.rectangle(1215,471,260,259);ctx.clip();draw_image(ctx,sf,1214,470);ctx.restore()
    except (AttributeError,ValueError):pass
    rect(ctx,1214,470,262,261,gradient(1210,475,1480,740,[(0,(1,1,1,.62)),(.4,(1,1,1,.25)),(1,(.92,.92,.94,.55))]),'#c9c9cd',1.1,r=12)
    rect(ctx,1249,517,189,66,gradient(1250,520,1440,580,[(0,'#fff6fa'),(1,'#f8e8e9')]),None,r=35)
    circle(ctx,1404,549,27,'#e933eb')
    rect(ctx,1249,619,189,66,gradient(1250,615,1250,690,[(0,'#a7b0a9'),(.4,'#c3c8c7'),(1,'#fbfbfa')]),'#bcc5ba',1,r=35)
    circle(ctx,1281,652,30,(.3,.3,.3,.2));circle(ctx,1283,650,27,'#dce5e6','#c4cdcd',1)
    ctx.restore()
