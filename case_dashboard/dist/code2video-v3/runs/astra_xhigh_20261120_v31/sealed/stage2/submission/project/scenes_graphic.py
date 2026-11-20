"""First three treatments: printed grid, spatial interface, curved letter illustration."""
import math,functools,json
import cairo,cv2,numpy as np
from .drawing import *

class GraphicScenes:
 def __init__(self,cfg):
  self.cfg=cfg;self.objects=__import__('json').loads((ROOT/'objects.json').read_text());self.big=sample_curve(cfg['curves']['large']);self.small=sample_curve(cfg['curves']['small']);self.cache={}
 def grid(self,f):
  c=Canvas();fade=1-ease((f-45)/5)
  if f>49:return c
  top=np.interp(f,[0,4,8,12,16],[1090,1080,615,350,183]);rw=np.interp(f,[0,4,8,12,16],[0,0,230,410,413])
  if rw>0 and top<897:
   sel_top=float(np.interp(f,[32,36,40,44,46],[top,208,360,761,897])) if f>32 else top
   c.c.save();c.c.rectangle(1084,sel_top,rw,max(0,897-sel_top));c.c.clip()
   if 'right_ink_mask' not in self.cache:
    m=Canvas();m.ellipse(1080,540,266,266,None,'#ffffff',90);self.cache['right_ink_mask']=m
   boundary=float(np.interp(f,[12,16,24,32,40],[.80,.77,.71,.59,.53]))
   stops=[(0,'#67183f'),(max(.01,boundary-.09),'#861747'),(boundary,'#942454'),(boundary+float(np.interp(f,[24,40],[.05,.10])),'#f69824'),(1,'#f6aa23')]
   if f<12:stops=[(0,'#841747'),(1,'#841747')]
   c.image(mask_texture(self.cache['right_ink_mask'],gradient_texture(W,H,stops,1,.014,8)))
   # The dot screen and warm ink front advance independently around the bend.
   dot_center=float(np.interp(f,[12,16,24,32,40],[870,845,810,670,590]))
   for y in range(max(440,int(dot_center-125)//12*12),845,12):
    for x in range(1085,1400,12):
     rr=math.hypot(x-1080,y-540)
     if 223<rr<310:
      r=3.2*max(0,1-abs(y-dot_center)/135)
      if r>.01:c.ellipse(x,y,r,r,'#ecab31' if y<dot_center else '#8c2260')
   c.c.restore()
   if sel_top<897:
    c.c.save();c.c.rectangle(1080,sel_top-7,430,918-sel_top);c.c.clip();selection(c,1084,sel_top,rw,897-sel_top)
    if f>12:
     c.rect(1387,sel_top+15,100,87,'#f49b00');c.text('Aa',1398,sel_top+78,61,'#ffffff')
    c.c.restore()
   c.line([(1084,850),(1390,850)],'#d7297b',1.5)
  # Color swatches independently assemble from bottom right.
  if f>=4:
   k=ease((f-4)/8);sw=420*k
   for i,col in enumerate(['#d834a6','#e978b4','#ec9ac5','#edbad7','#f8d9e9']):
    if i>=int(np.interp(f,[40,44,48,51],[0,1,3,5])):c.rect(1084+i*sw/5,913,sw/5-1,149,col)
   c.line([(1068,808),(1068,1062)],'#55a8d2',1)
  alpha=ease((f-10)/10)
  if alpha>0:
   p=Canvas()
   # Printed cards roll out of their individual bounds as the spatial rails arrive.
   card_exit=ease((f-32)/7)
   p.c.save();p.c.rectangle(700,64+230*card_exit,390,230*(1-card_exit));p.c.clip()
   p.rect(819,64,250,101,gradient=((819,64,1069,165),[(0,'#f1aa33'),(1,'#9ba9a0')]))
   p.rect(723,64,80,220,gradient=((0,64,0,264),[(0,'#8bdd2d'),(1,(1,1,1,0))]));p.c.restore()
   # Printed negative-space logo columns.
   p.c.save();p.c.rectangle(819,180,249,455*(1-ease((f-32)/8)));p.c.clip()
   p.rect(819,180,249,455,gradient=((0,180,0,635),[(0,'#ce277b'),(.45,'#c02c82'),(1,'#49b6c8')]))
   p.c.set_line_cap(0);p.line([(1080+266*math.cos(a),540+266*math.sin(a)) for a in np.linspace(-2.28,-1.0,100)], '#f7f8f7',90);p.c.set_line_cap(1)
   p.line(poly_segment(self.small), '#f7f8f7',90)
   p.c.restore()
   p.c.save();p.c.rectangle(819,635+214*ease((f-34)/6),249,214*(1-ease((f-34)/6)));p.c.clip()
   p.line(poly_segment(self.big),'#ed4e93',90,gradient=((820,630,1068,840),[(0,'#ffd9c6'),(1,'#ed3183')]))
   p.c.restore()
   left_top=447+451*ease((f-40)/5)
   p.c.save();p.c.rectangle(532,left_top,271,max(0,898-left_top));p.c.clip()
   saturated=ease((f-30)/6)
   p.rect(532,447,271,451,gradient=((530,447,750,900),[(0,mixcol('#b8b7b8','#cd086a',ease((f-22)/9))),(.5,mixcol('#bab8b9','#b3135b',saturated)),(1,mixcol('#dedcdb','#b53b73',saturated))]))
   p.line(poly_segment(self.small),'#ffffff',90)
   p.c.restore()
   for x in [421,517,612,707,803,818]:p.line([(x,165 if x<800 else 64),(x,898 if x>520 else 514)],'#59afdb',.9)
   for x in [436,532,628,723]:p.line([(x,489),(x,898 if x>500 else 635)],'#5caed3',.8)
   # CMYK proof card with animated overprints.
   p.c.save();p.c.rectangle(351,210,357*(1-ease((f-36)/4)),221);p.c.clip()
   col=mixcol('#31c1dc','#ec17bc',ease((f-24)/7))
   p.rect(351,239,357,192,col)
   for i,col2 in enumerate(['#514856','#9d27b0','#ea3aea','#ee7ef7','#ffdf16']):p.rect(351+i*80,210,80,29,col2)
   for x in [421,517,612,707]:p.line([(x,210),(x,431)],'#4b83af',.8)
   p.line([(351,335),(708,335)],'#75b3d1',.8)
   p.c.restore()
   for y in range(345,465,9):
    for x in range(795,889,9):
     if (x-800)<y-336:p.ellipse(x,y,1.6,1.6,'#ed02a2');p.ellipse(x+2,y+2,1.25,1.25,'#f1dd00')
   for y in range(790,850,9):
    for x in range(820,914,9):
     if x<820+(y-790)*1.6:p.ellipse(x,y,1.4,1.4,'#f200a6');p.ellipse(x+2,y+2,1.2,1.2,'#e7d700')
   for i,l in enumerate([120,120,91,12]):p.line([(927,901+i*16),(927+l,901+i*16)],'#cf1c6e',1.5)
   for x in ([517,1497] if f<39 else []):
    p.line([(x-53,540),(x+53,540)],'#acd543',5);p.line([(x,488),(x,591)],'#da36c2',4)
    p.line([(x-53,539),(x+53,539)],'#131517',2);p.line([(x,487),(x,591)],'#0a1723',2)
    if f>20:
     p.ellipse(x,540,34,34,None,'#050708',2);p.ellipse(x,540,30,30,None,'#60a8cb',1.2)
     if f>22:p.ellipse(x,540,18,18,'#000000')
   c.image(p,alpha=alpha)
  if 27<=f<34:
   k=ease((f-27)/10);a0=-.60-k*1.82;a1=-.40
   pp=[(1080+266*math.cos(a),540+266*math.sin(a)) for a in np.linspace(a0,a1,80)]
   c.line(pp,'#ed91dc',90)
  # Deterministic printed-paper grain, restricted to ink-bearing areas.
  if 'paper_grain' not in self.cache:self.cache['paper_grain']=np.random.default_rng(42).normal(0,2.3,(H,W,1))
  arr=c.array();ink=(np.min(arr[...,:3],axis=2)<240)&(arr[...,3]>200);arr[ink,:3]=np.uint8(np.clip(arr[ink,:3].astype(float)+self.cache['paper_grain'][ink],0,255));c=Canvas();c.image(arr)
  # Layers unpin and disappear into the spatial interface.
  if f>35:
   a=c.array();a[...,3]=np.uint8(a[...,3]*fade);return a
  return c
 def ui(self,f,pulse=0):
  c=Canvas();start=ease((f-33)/12)
  if start<=0:return c
  # Optical plastic rails with soft ambient shadow.
  m=Canvas();sm_end=.92*ease((f-36)/10)
  m.line(poly_segment(self.small,0,sm_end),'#aaaaaa',100)
  if f>34:
   c.image(shadow_layer(m,12,(7,10),.20))
   for width in range(106,13,-2):
    v=np.interp(width,[14,25,35,46,65,87,101,106],[.97,.99,.97,.85,.89,.94,.99,.97]);c.line(poly_segment(self.small,0,sm_end),(v,v,v*.998),width)
   # The magenta channel fills only up to the traveling circular control.
   channel_end=float(np.interp(f,[36,40,48,56,64],[0,.04,.49,.70,.72]))
   if f>=43:
    c.line(poly_segment(self.small,0,min(channel_end,sm_end)),'#f7a4fa',20)
    c.line(poly_segment(self.small,0,min(channel_end,sm_end)),'#e02bec',13)
   # Fine white construction rails recede as the solid surface finishes forming.
   if f<51:
    rail=Canvas()
    for w in [22,49,78]:rail.line(poly_segment(self.small,0,sm_end),'#ffffff',w)
    # Strokes above would fill the center; retain only their narrow contour bands.
    for w in [21,48,77]:
     rail.c.set_operator(cairo.OPERATOR_DEST_OUT);rail.line(poly_segment(self.small,0,sm_end),'#ffffff',w-2);rail.c.set_operator(cairo.OPERATOR_OVER)
    c.image(rail,alpha=1-ease((f-46)/5))
  if self.cfg.get('_revision'):
   from .revision_graphics import blue_tube
   if 'interface.tube' not in self.cfg.get('disabled_objects',[]):blue_tube(self,c,f,pulse)
  else:
   # Pink tube reveals from both round terminals, then carries a traveling glossy slider.
   main_end=float(np.interp(f,[34,36,40,44,48,52],[0,.02,.335,.675,.915,1]))
   extension=sample_curve([self.cfg['curves']['large'][-1][-2:],[912,333,887,355,870,379]],95)
   ext=np.vstack([self.big,extension[1:]]);ratio=(len(ext)-1)/(len(self.big)-1)
   top_start=float(np.interp(f,[34,36,40,44,48,50],[.68,.73,.85,.96,1.05,ratio]))
   pink_parts=[(self.big,0,main_end)]+([(ext,top_start/ratio,1)] if f<50 else [])
   for curve,a,b in pink_parts:
    if b<=a:continue
    c.line(poly_segment(curve,a,b),'#f5a0df',92,gradient=((720,550,1390,550),[(0,'#f9adf3'),(.6,'#f08cda'),(1,'#ed81d4')]))
    if f>=43 and curve is self.big:c.line(poly_segment(curve,a,b),'#cf00e8',15)
   if f>=40:
    at=float(np.interp(f,[40,44,48,52,56,60,64,68,72],[.055,.26,.54,.72,.79,.82,.875,.95,1.01]));span=float(np.interp(f,[40,44,48,52,56,64,72],[.10,.38,.27,.24,.21,.16,.11]))
    a=max(0,at-span/2);b=min(ratio,at+span/2)
    for width in range(78,8,-2):
     t=(78-width)/70;col=mixcol('#e151d7','#ba00bc',math.sin(t*math.pi)*.84)
     c.line(poly_segment(ext,a/ratio,b/ratio),col,width)
    q,d=curve_at(ext,(b-.015)/ratio);c.ellipse(*q,13,13,'#ff9cf2')
  # Small circular slider on left tube.
  u=float(np.interp(f,[36,40,48,56,64,72],[0,.02,.49,.70,.72,.87]));q,d=curve_at(self.small,u)
  c.ellipse(q[0]+3,q[1]+8,40,38,'#c8c9c7')
  c.ellipse(*q,39,39,gradient=((q[0]-20,q[1]-20,1,q[0],q[1],48),[(0,'#ffffff'),(.7,'#e5e6e3'),(1,'#bfc0bd')],True))
  c.c.save();c.c.translate(*q);c.c.rotate(math.atan2(d[1],d[0]))
  for x in [-8,8]:c.line([(x,-20),(x,20)],'#b2b4b2',5);c.line([(x-1,-20),(x-1,20)],'#fafbf8',2)
  c.c.restore()
  c.c.push_group()
  if f>=40:
   # Selection boxes and editable anchor controls.
   k=ease((f-39)/9);x=lerp(520,522,k);y=lerp(510,342,k);w=lerp(40,539,k);h=lerp(170,508,k)
   c.rect(x,y,w,h,None,'#68ce61',1.5)
   for px,py in [(x,y),(x+w/2,y),(x+w,y),(x,y+h/2),(x+w,y+h/2),(x,y+h),(x+w/2,y+h),(x+w,y+h)]:c.ellipse(px,py,8,8,'#ffffff','#63ce61',1.5)
   blue_left=float(np.interp(f,[40,44,48,52],[1282,770,719,712]));blue_bottom=float(np.interp(f,[40,44,48,52],[310,817,868,874]));c.rect(blue_left,198,1395-blue_left,blue_bottom-198,None,'#45a7d0',1)
   for tx in range(1160,1404,24):
    a=(tx-1160)/244*.9-math.pi/2
    px=1094+341*math.cos(a);py=540+341*math.sin(a)
    c.line([(px,py),(px+22*math.cos(a),py+22*math.sin(a))],'#82df65',1.7)
   for x,col in ([(549,'#38b5ee')] if f>=42 else [])+[(624,'#242524')]:c.ellipse(x,267,27,27,col)
   if f>=42:c.shape([(541,255),(541,280),(562,267),'z'],'#ffffff')
   c.line([(611,267),(637,267)],'#ffffff',7);c.line([(624,254),(624,280)],'#ffffff',7)
   def pointer(x,y,col,rot):
    c.c.save();c.c.translate(x,y);c.c.rotate(rot);c.shape([(0,0),(52,14),(28,26),(20,56),'z'],col,'#ffffff',2);c.c.restore()
   if f>=42:
    gx=float(np.interp(f,[42,44,48,52],[800,750,720,652]));gy=float(np.interp(f,[42,44,48,52],[170,155,242,284]));pointer(gx,gy,'#a9fa39',-.02)
    if f>=47:c.line([(gx+63,gy+39),(gx+106,gy+39)],'#54d600',12)
   if not self.cfg.get('_revision'):
    bx=float(np.interp(f,[40,44,48,52],[558,795,971,1050]));pointer(bx,596,'#1475ed',-.05)
   ox=float(np.interp(f,[40,44,48,52],[650,660,810,887]));oy=float(np.interp(f,[40,44,48,52],[700,733,880,911]));pointer(ox,oy,'#f6a000',-.05);c.line([(ox+64,oy+40),(ox+107,oy+40)],'#f68000',12)
   c.line([(687,874),(737,874)],'#11191b',2);c.line([(713,849),(713,900)],'#11191b',2);c.rect(729,891,8,9,None,'#11191b',2)
   if f>=49:
    c.c.save();c.c.translate(800,780);c.c.rotate(.08)
    c.shape([(0,0),(113,0),(125,6,125,12,125,18),(125,72),(123,89,116,90,95,90),(95,107),(79,90),(0,90),(-8,88,-9,80,-9,70),(-9,17),(-9,4,-5,0,0,0),'z'],'#bdb7ee','#a49ede',1)
    for yy in [31,44,57]:c.line([(25,yy),(84,yy)],'#ffffff',2)
    c.c.restore()
  if f>=49:
   # Transparent optical control card with independently animated switches.
   k=ease((f-48)/7);c.c.save();c.c.translate(1344,600);c.c.scale(k,k);c.c.translate(-1344,-600)
   c.rect(1180,414,120,120,gradient=((1180,414,1300,534),[(0,'#efaa31'),(1,'#f6e9bf')]),r=6)
   for qx in [1190,1240,1290]:c.line([(qx,420),(qx,530)],'#fff3cd',.8)
   for qy in [424,474,524]:c.line([(1186,qy),(1294,qy)],'#fff3cd',.8)
   c.ellipse(1240,474,45,45,None,'#fff3cd',.8);c.line([(1184,419),(1296,529)],'#fff3cd',.8);c.line([(1184,529),(1296,419)],'#fff3cd',.8)
   c.ellipse(1456,609,54,48,gradient=((1420,575,1,1457,611,65),[(0,'#e6e3ff'),(1,'#aaa1ed')],True))
   c.rect(1333,701,81,41,'#a8ff1e',r=20)
   c.rect(1214,469,261,261,gradient=((1214,470,1474,730),[(0,(.98,.98,.98,.74)),(.32,(1,.98,1,.68)),(1,(.90,.92,.91,.88))]),stroke='#c8c9c8',sw=1.2,r=9)
   # Blurred transmitted colors of objects behind the frosted plane.
   for xx,yy,rx,ry,col in [(1341,538,48,80,'#f61ce9'),(1315,641,37,82,'#ed006e'),(1380,697,56,31,'#abfb23')]:
    if self.cfg.get('_revision') and col in ['#f61ce9','#ed006e']:col=self.cfg['ui_gradient'][int(col=='#ed006e')]
    temp=Canvas();temp.ellipse(xx,yy,rx,ry,col);a=temp.array();a=cv2.GaussianBlur(a,(0,0),17);c.c.save();c.c.rectangle(1215,470,259,259);c.c.clip();c.image(a,alpha=.66);c.c.restore()
   c.rect(1248,519,190,64,'#faf5f2',r=32)
   c.ellipse(1405,551,27,27,'#e634e9')
   c.rect(1248,620,191,66,gradient=((0,620,0,686),[(0,'#b7bab6'),(1,'#f7f9f5')]),stroke='#d9dcd7',sw=1,r=33)
   bx=1283+100*ease((f-60)/8);c.ellipse(bx,653,27,27,'#dfe4df','#a8ada7',1)
   c.rect(1271,748,101,101,None,'#ace45d',1.6);c.line([(1271,748),(1372,849)],'#ace45d',1.6);c.line([(1372,748),(1271,849)],'#ace45d',1.6)
   c.c.restore()
  c.c.pop_group_to_source();c.c.paint_with_alpha(1-ease((f-64)/8))
  if f>68:
   c.c.set_operator(cairo.OPERATOR_DEST_OUT);c.c.set_line_cap(cairo.LINE_CAP_BUTT);c.line(poly_segment(self.big,.65,.65+.20*ease((f-68)/4)),'#ffffff',110);c.c.set_operator(cairo.OPERATOR_OVER)
  return c
 def warped_text(self,c,text,pts,width=96,start=.02,end=.98,color='#f3a000',style='bubble'):
  if self.cfg.get('_revision'):text=text.replace('TOGETHER',self.cfg.get('path_text','CREATE ON'))
  # Glyph outlines are bent along the true centerline. No image of the reference is used.
  cc=cairo.Context(cairo.ImageSurface(cairo.FORMAT_ARGB32,8,8));cc.select_font_face('DejaVu Sans',cairo.FONT_SLANT_NORMAL,cairo.FONT_WEIGHT_BOLD);cc.set_font_size(100)
  cc.move_to(0,0);cc.text_path(text);glyph=cc.copy_path_flat();ext=cc.text_extents(text);total=max(ext.x_advance,1)
  def warp(x,y):
   u=start+(end-start)*x/total;q,d=curve_at(pts,u);v=(y+36)*width/74
   return q[0]-d[1]*v,q[1]+d[0]*v
  c.c.new_path()
  for typ,co in glyph:
   if typ==cairo.PATH_MOVE_TO:c.c.move_to(*warp(*co))
   elif typ==cairo.PATH_LINE_TO:c.c.line_to(*warp(*co))
   elif typ==cairo.PATH_CLOSE_PATH:c.c.close_path()
  if style=='bubble':
   c.color(color);c.c.fill_preserve();c.c.set_line_width(12);c.c.stroke_preserve();c.color('#111017');c.c.set_line_width(1.2);c.c.stroke()
  else:c.color(color);c.c.fill()
 def sticker(self,c,kind,x,y,s=1,rot=0,f=80):
  c.c.save();c.c.translate(x,y);c.c.rotate(rot);c.c.scale(s,s)
  if kind=='burst':
   p=[(-115,-61),(-32,-17),(0,-110),(32,-17),(115,-61),(84,64),(-85,64),'z'];c.shape(p,'#92ed08','#111111',1.2)
   for p in [[(-96,-47),(-58,-25)],[(-13,-58),(0,-80),(18,-34)],[(58,-25),(96,-47)],[(-89,15),(-83,39)]]:c.line(p,'#162417',1)
  elif kind=='spark':c.shape(star_points(0,0,70,7,.32,.06),'#dfff32','#1a201b',1.1)
  elif kind=='pinkstar':c.shape(star_points(0,0,97,5,.37,.3),'#f300b8','#141118',1)
  elif kind=='cloud':
   p=[(-117,0),(-147,-39,-111,-88,-78,-65),(-94,-120,-23,-119,-11,-72),(5,-130,59,-130,64,-73),(100,-116,143,-75,100,-35),(163,-15,160,51,103,44),(152,104,78,126,47,83),(21,148,-34,126,-35,78),(-80,127,-132,79,-106,45),(-165,47,-161,-9,-117,0),'z']
   c.shape(p,None,'#ffffff',12)
   c.shape(p,stroke='#15131b',sw=1.2,gradient=((-120,-80,130,100),[(0,'#ed00c6'),(.45,'#ed00b8'),(1,'#f00020')]))
  elif kind=='yellowcloud':
   # Long overlapping paint fingers have deliberately unequal silhouettes.
   p=[(-80,-80),(-129,-150,-118,-49,-85,9),(-144,-60,-128,29,-72,102),(-42,143,-9,173,-15,143),(-23,103,-60,47,-69,12),(-5,115,49,168,42,121),(35,76,-23,-13,-39,-52),(47,72,101,118,89,69),(78,24,37,-42,16,-87),(77,-7,129,53,119,11),(110,-35,60,-139,41,-174),(19,-212,5,-186,19,-137),(33,-81,55,-30,39,-52),(-12,-132,-65,-180,-63,-145),(-62,-120,-40,-71,-21,-37),'z']
   c.shape(p,stroke='#18151b',sw=1.3,gradient=((-60,-160,45,150),[(0,'#a0ee40'),(.4,'#d9ff00'),(1,'#f8ff00')]))
  elif kind=='leaf':
   p=[(0,-65),(80,-135,155,-50,80,38),(54,120,-55,129,-93,53),(-155,-22,-99,-100,-30,-90),(-6,-85,1,-80,0,-65),'z']
   c.shape(p,stroke='#151321',sw=1.2,gradient=((-80,-70,60,120),[(0,'#a88bf9'),(.45,'#958bf7'),(.8,'#25b6ec'),(1,'#b8f740')]))
   c.line([(-9,-40),(8,-16,7,16,-9,31),(10,10,29,8,45,22)],'#49418b',1)
   c.shape([(-9,31),(33,-60,99,-82,137,-54),(58,-48,18,-15,-9,31),'z'],'#9b8af4','#49418b',1)
  elif kind=='mushroom':
   c.shape([(-79,6),(-91,-6,-55,-35,-43,-65),(-25,-113,8,-89,26,-71),(47,-51,88,-39,81,-13),(77,13,33,31,-6,33),(-42,35,-68,24,-79,6),'z'],stroke='#182564',sw=1.3,gradient=((-65,-50,80,10),[(0,'#f98dcc'),(.45,'#9879e2'),(1,'#22b2ef')]))
   c.ellipse(0,8,73,29,gradient=((-62,5,65,5),[(0,'#f600df'),(.5,'#b028f6'),(1,'#4a39e9')]),stroke='#4d2f95',sw=1,angle=-.12)
   c.shape([(-16,-7),(-6,-39,9,-30,13,-4),(20,19,29,44,31,67),(14,84,-15,78,-28,69),(-28,54,-20,17,-16,-7),'z'],stroke='#263082',sw=1.2,gradient=((-20,0,30,60),[(0,'#da80cd'),(.45,'#9e84e6'),(1,'#4f99ee')]))
  elif kind=='flower':
   p=[]
   for i in range(100):
    a=i/100*2*math.pi;r=69+12*math.cos(a*8);p.append((math.cos(a)*r,math.sin(a)*r))
   p+=['z'];c.shape(p,None,'#ffffff',13);c.shape(p,stroke='#182620',sw=1.2,gradient=((-70,-60,70,80),[(0,'#f9ea26'),(.5,'#abff3a'),(1,'#ffad00')]))
  elif kind=='pencil':
   c.shape([(-105,-37),(81,-37),(104,-13),(104,33),(-105,33),(-149,0),'z'],'#ffffff','#181719',1.5)
   c.rect(-99,-30,174,57,'#ffd322','#303021',1)
   for yy in [-19,0,19]:
    c.line([(-87,yy),(60,yy)],'#d58900',16);c.line([(-87,yy-1),(60,yy-1)],'#ffcd13',14);c.line([(-87,yy-5),(60,yy-5)],'#fff15e',3)
   c.rect(74,-30,17,57,'#edb541','#6c5c20',1)
   c.shape([(-103,-29),(-103,30),(-142,0),'z'],'#f9dbb2','#181818',1);c.shape([(-131,-8),(-142,0),(-131,8),'z'],'#263337')
  elif kind=='camera':
   c.ellipse(0,0,96,96,'#ffffff','#15151c',1.3);c.ellipse(0,0,88,88,'#f5a000','#292018',1)
   c.ellipse(0,0,45,45,None,'#5c480c',1.1);c.shape([(-78,-36),(19,-39,47,-10,78,35),(-9,40,-39,18,-78,-36),'z'],None,'#5c480c',1.1)
  elif kind=='scroll':
   c.shape([(-83,-35),(69,-35),(98,-17,97,28,71,38),(-83,38),(-118,38,-118,-35,-83,-35),'z'],stroke='#17232b',sw=1.4,gradient=((-100,-40,100,40),[(0,'#81f1ad'),(.5,'#24bee5'),(1,'#bddb35')]))
   c.ellipse(-77,0,27,34,'#68ed9a','#173632',1.2)
   for j in range(4):c.ellipse(-77+j*3,-j*2,9+j*4,14+j*5,None,'#168886',1)
  elif kind=='seal':
   c.shape(star_points(0,0,66,14,.90),'#fa004c','#131321',1)
   c.line([(-20,22),(-27,-5,-28,-25,-8,-28),(14,-31,18,-16,18,7),(19,26,38,24,38,7),(38,-18,25,-43,3,-43)],'#ffb800',12)
  elif kind=='arrow':
   p=[(-68,2),(7,-84),(32,-66),(-8,-20),(65,-35),(73,-6),(-5,13),(44,44),(24,67),'z'];c.shape(p,None,'#ffffff',15);c.shape(p,'#b2ed19','#181f23',1.3);c.line([(-56,2),(8,-69)],'#ffffff',3)
  elif kind=='ribbon':
   c.line([(-57,23),(-95,-35,-16,-36,-34,6),(-47,42,-63,-18,-31,-25),(-1,-39,23,5,57,0)],'#ef007e',15)
  elif kind=='spring':
   p=[(4,-65),(-55,-54,-56,-8,-12,1),(36,12,39,-31,5,-33),(-43,-34,-52,42,5,63)]
   c.line(p,'#365b58',19);c.line(p,'#dbf51d',17,gradient=((-33,-65,12,65),[(0,'#4ad2ba'),(.48,'#ffff3e'),(1,'#95e572')]))
  elif kind=='apple':
   p=[(-8,-35),(-43,-71,-94,-36,-64,17),(-42,62,2,72,31,40),(66,8,68,-38,37,-46),(18,-52,1,-43,-8,-35),'z']
   c.shape(p,stroke='#1b1421',sw=1.3,gradient=((-55,-40,45,40),[(0,'#ee00d3'),(.6,'#f90094'),(1,'#f70031')]))
   c.shape([(-15,-12),(16,-66,65,-71,100,-48),(109,-39),(99,-35),(49,-64,13,-38,-15,-12),'z'],'#f0008a','#1b1421',1.1)
   c.line([(-15,-12),(-8,-24,-4,-35,-4,-43)],'#84114e',1.1)
  elif kind=='blueburst':
   c.shape(star_points(0,0,65,8,.48,-.2),stroke='#223438',sw=1.2,gradient=((-60,0,60,0),[(0,'#a5ef64'),(1,'#47a0cd')]))
  elif kind=='purpleburst':
   c.shape(star_points(0,0,39,9,.48,-.2),stroke='#31194b',sw=1,gradient=((-35,-20,20,35),[(0,'#e900cc'),(1,'#b300e8')]))
  elif kind=='plus':
   c.line([(0,-44),(0,44)],'#4f273b',43);c.line([(-42,0),(42,0)],'#4f273b',43)
   c.line([(0,-44),(0,44)],'#f7ce28',41,gradient=((0,-45,0,45),[(0,'#e4b5be'),(1,'#fbff20')]))
   c.line([(-42,0),(42,0)],'#f7ce28',41,gradient=((-42,0,42,0),[(0,'#fcff23'),(1,'#d9a1c8')]))
  elif kind=='antenna':
   p=[(-45,32),(13,65,95,45,105,-12),(107,-34,96,-54,80,-69)]
   c.line(p,'#6a7c25',10);c.line(p,'#dcff2b',8)
   c.line([(-45,32),(64,99)],'#5b7768',10);c.line([(-45,32),(64,99)],'#c8f43d',8)
   for x,y in [(-45,32),(80,-69)]:
    c.c.save();c.c.translate(x,y);c.c.rotate(-.40);c.rect(-15,-15,30,30,stroke='#25504b',sw=1,gradient=((-15,0,15,0),[(0,'#b7ef32'),(1,'#30c7d8')]));c.c.restore()
   for x,y in [(105,-12),(64,99)]:c.ellipse(x,y,10,10,gradient=((x-5,y-5,0,x,y,15),[(0,'#b3f53d'),(1,'#38b6cd')],True),stroke='#25504b',sw=1)
  elif kind=='badges':
   for x,y,col,r in [(-37,3,'#eb0089',0),(-13,0,'#a994dd',.5),(21,-6,'#e9fb19',.72)]:
    c.c.save();c.c.translate(x,y);c.c.rotate(r);c.rect(-17,-23,34,46,stroke='#272139',sw=1,r=8,gradient=((-17,-23,17,23),[(0,col),(1,'#64cbc3')]));c.c.restore()
  c.c.restore()
 def illustration(self,f,monochrome=False):
  c=Canvas()
  # A separately editable reverse side appears inside the upper paper fold.
  if f>=83:
   rear=Canvas();rear.line(poly_segment(self.big,.60,.86),'#09080e',99)
   self.warped_text(rear,'MOVE TOGETHER',self.big,66,.01,.99,'#ffffff','plain')
   mask=Canvas();mask.c.set_line_cap(cairo.LINE_CAP_BUTT);mask.line(poly_segment(self.big,.60,.86),'#ffffff',99)
   a=rear.array();a[...,3]=np.uint8(a[...,3].astype(float)*mask.array()[...,3]/255);c.image(a,alpha=ease((f-83)/5))
  # Stickers pop out on their own tracks around the continuous loop.
  objects=[(v['kind'],v['x'],v['y'],v['scale'],v['rotation'],v['entry_frame']) for v in self.objects['illustration_stickers']]
  for i,(kind,x,y,s,r,entry) in enumerate(objects):
   entry=min(entry,76);k=ease((f-entry)/4)
   if k<=0:continue
   if f>92:
    exit_at=94+(i%7)*2
    k*=1-ease((f-exit_at)/16)
   if k<=0:continue
   bounce=1+.025*math.sin((f-entry)*.3+i)
   fold=ease((f-75)/4)*(1-ease((f-80)/7)) if kind in ['pencil','camera','arrow','mushroom'] else 0
   c.c.save();c.c.translate(x,y)
   if kind=='mushroom':c.c.scale(1,1-.74*fold)
   elif fold:c.c.scale(1-.68*fold,1)
   c.c.translate(-x,-y);self.sticker(c,kind,x,y,s*k*bounce,r+.02*math.sin(f*.13+i),f);c.c.restore()
   if fold>.08:
    # A lit paper reverse rolls across the independently transformed icon.
    c.c.save();c.c.translate(x,y);c.c.rotate(r);c.c.scale(s*k,s*k)
    if kind=='mushroom':lip=[(-72,-8),(-46,-7,13,8,80,-13),(41,19,8,32,-34,18),(-60,10,-63,0,-72,-8),'z']
    else:lip=[(-13,-76),(5,-27,25,20,13,77),(37,18,49,-29,-13,-76),'z']
    c.c.push_group();c.shape(lip,gradient=((-30,-35,30,35),[(0,'#68719f'),(.45,'#e4f3f8'),(1,'#8589ac')]));c.c.pop_group_to_source();c.c.paint_with_alpha(fold);c.c.restore()
  # A large angular, multicolor lightning bolt crosses behind the curved words.
  k=ease((f-70)/8)*(1-ease((f-96)/14))
  if k:
   c.c.save();c.c.translate(1040,414);c.c.scale(k,k);c.c.translate(-1040,-414)
   c.shape([(766,331),(1035,245),(1238,313),(1130,373),(1177,478),(1060,424),(1020,509),(982,427),(840,507),(899,410),'z'],stroke='#111b20',sw=1.1,gradient=((810,270,1150,520),[(0,'#62b58b'),(.4,'#82ed32'),(.67,'#479af2'),(1,'#6ca1ed')]))
   c.c.restore()
  # Purple inner curl, individually editable beneath the left letter ribbon.
  k=ease((f-66)/7)*(1-ease((f-98)/10))
  if k:
   c.c.save();c.c.translate(736,570);c.c.scale(k,k);c.c.translate(-736,-570)
   c.shape([(649,452),(748,408,814,444,832,535),(866,635,809,666,786,641),(770,588),(748,557,715,558,716,595),(718,625,743,654,757,687),(777,726,724,748,682,714),(601,657,580,516,649,452),'z'],stroke='#221327',sw=1.2,gradient=((630,420,825,730),[(0,'#9a8cf8'),(.5,'#b28afa'),(1,'#af35fa')]))
   c.c.restore()
  # The pointed paper terminal is independent of the round terminals in other scenes.
  small_paper=sample_curve(self.cfg['curves']['small'][:-1]+[[808,818,865,851,909,849]])
  for name,pts,begin in [('small',small_paper,61),('large',self.big,61)]:
   prog=float(np.interp(f,[61,64,68,72,76,80],[0,.10,.35,.65,.93,1]))
   if prog<=0:continue
   p=poly_segment(pts,0,prog);bed=Canvas()
   if name=='small' and prog>.89:
    uu=np.linspace(0,prog,320);q,d=curve_at(pts,uu);n=np.stack([-d[:,1],d[:,0]],axis=-1);w=50*np.clip((1-uu)/.15,0,1)
    outline=[tuple(v) for v in q+n*w[:,None]]+[tuple(v) for v in (q-n*w[:,None])[::-1]]+['z']
    bed.c.save();bed.c.translate(7,9);bed.shape(outline,'#050509','#050509',8);bed.ellipse(*pts[0],54,54,'#050509');bed.c.restore()
    bed.shape(outline,gradient=((530,350,1410,850),[(0,'#b700ff'),(.32,'#ef00be'),(.68,'#ff0087'),(1,'#f70020')]))
    bed.ellipse(*pts[0],50,50,'#ef00a5')
   else:
    bed.line([(x+7,y+9) for x,y in p],'#050509',108)
    bed.line(p,'#ef00a5',100,gradient=((530,350,1410,850),[(0,'#b700ff'),(.32,'#ef00be'),(.68,'#ff0087'),(1,'#f70020')]))
   if prog>0:
    tp=pts[::-1] if name=='small' else pts;words=Canvas()
    ink=mixcol('#ed008c','#f5a000',ease((f-65)/5))
    if name=='small':self.bubble_text(words,'DRAW TOGETHER',tp,96,.11,.98,ink)
    else:
     self.bubble_text(words,'DRAW TOGETHER',tp,96,.015,.672,ink)
     self.bubble_text(words,'DRAW',tp,96,.775,.985,ink)
    mask=Canvas()
    if name=='small' and prog>.89:mask.shape(outline,'#ffffff');mask.ellipse(*pts[0],50,50,'#ffffff')
    else:mask.line(p,'#ffffff',101)
    wa=words.array();wa[...,3]=np.uint8(wa[...,3].astype(float)*mask.array()[...,3]/255);bed.image(wa)
   if name=='large' and f>=83:
    fold=ease((f-83)/5);erase=Canvas();erase.c.set_line_cap(cairo.LINE_CAP_BUTT);erase.line(poly_segment(pts,.62,.62+.19*fold),'#ffffff',130)
    a=bed.array();a[...,3]=np.uint8(a[...,3].astype(float)*(1-erase.array()[...,3]/255));c.image(a)
   else:c.image(bed)
  # Curved words turn into black and white typographic bands during the wipe.
  if f>=91:
   for name,pts in [('large',self.big),('small',self.small)]:
    prog=ease((f-91)/17) if name=='large' else ease((f-97)/10)
    if prog<=0:continue
    p=poly_segment(pts,1-prog,1);c.line(p,'#0a080e',93)
    temp=Canvas();self.warped_text(temp,'MOVE TOGETHER',pts if name=='large' else pts[::-1],51,.01,.99,'#ffffff','plain')
    # Clip the text to the replacement section with a stroke mask.
    mask=Canvas();mask.line(p,'#ffffff',96);a=temp.array();a[...,3]=np.uint8(a[...,3].astype(float)*mask.array()[...,3]/255);c.image(a)
  # Last paper curls lift away to expose the next treatment.
  if 96<=f<=116:
   for i,(x,y,r) in enumerate([(1158,648,.65),(696,596,-.7),(1270,355,.3)]):
    a=ease((f-96-i*3)/7)*(1-ease((f-108-i*2)/8))
    if a:
     c.c.save();c.c.translate(x,y);c.c.rotate(r);c.c.scale(a,a)
     c.shape([(-38,-104),(-75,-43,-45,36,51,133),(11,34,38,-8,-38,-104),'z'],stroke='#898897',sw=.8,gradient=((-55,-45,45,35),[(0,'#d8f2fc'),(.3,'#fbffff'),(.6,'#91a2bc'),(1,'#51386c')]))
     c.c.restore()
  return c

 def bubble_text(self,c,text,pts,width,start,end,color='#f5a000'):
  glyphs=json.loads((ROOT/'glyphs.json').read_text())
  if self.cfg.get('_revision'):
   text=text.replace('TOGETHER',self.cfg.get('path_text','CREATE ON'))
   glyphs.update(json.loads((ROOT/'revision_glyphs.json').read_text()))
  for ch in set(text)-set(glyphs):
   cc=cairo.Context(cairo.ImageSurface(cairo.FORMAT_ARGB32,1,1));cc.select_font_face('DejaVu Sans',cairo.FONT_SLANT_NORMAL,cairo.FONT_WEIGHT_BOLD);cc.set_font_size(135);cc.move_to(0,100);cc.text_path(ch)
   contours=[];current=[]
   for typ,xy in cc.copy_path_flat():
    if typ==cairo.PATH_MOVE_TO:
     if current:contours.append(current)
     current=[list(xy)]
    elif typ==cairo.PATH_LINE_TO:current.append(list(xy))
    elif typ==cairo.PATH_CLOSE_PATH:current.append('z')
   if current:contours.append(current)
   glyphs[ch]={'width':cc.text_extents(ch).x_advance,'paths':contours}
  total=sum(glyphs[ch]['width']+1 for ch in text)
  xoff=0
  for ch in text:
   g=glyphs[ch]
   c.c.new_path()
   for contour in g['paths']:
    cc=cairo.Context(cairo.ImageSurface(cairo.FORMAT_ARGB32,1,1));path(cc,contour);flat=cc.copy_path_flat()
    for typ,xy in flat:
     if typ in [cairo.PATH_MOVE_TO,cairo.PATH_LINE_TO]:
      u=start+(end-start)*(xoff+xy[0])/total;q,d=curve_at(pts,u);v=(xy[1]-50)*width/100;out=(q[0]-d[1]*v,q[1]+d[0]*v)
      if typ==cairo.PATH_MOVE_TO:c.c.move_to(*out)
      else:c.c.line_to(*out)
     elif typ==cairo.PATH_CLOSE_PATH:c.c.close_path()
   c.c.set_fill_rule(cairo.FILL_RULE_EVEN_ODD);c.color(color);c.c.fill_preserve();c.color('#1e101b');c.c.set_line_width(1.2);c.c.stroke();c.c.set_fill_rule(cairo.FILL_RULE_WINDING)
   xoff+=g['width']+1
