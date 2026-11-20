"""Frame-addressed reconstruction. Reference footage is never read by this module."""
import json,math,random,sys
from pathlib import Path
import cairo,numpy as np
from drawing import *
from motifs import *
from nature import *

class Renderer:
    def __init__(self,config):
        self.root=Path(__file__).resolve().parent;self.cfg=config;self.paths=config['paths'];self.samples={k:sample(p) for k,p in self.paths.items()};self.garden=Garden(self.paths,config['seed'])
        make_textures(self.root/'assets/procedural')
        self.images={}
        for n in ['water','cloud','stars']:self.images[n]=image_surface(self.root/f'assets/procedural/{n}.png')
        self.portraits={}
        self.hero_right=[]
        for cmd in self.paths['logo_right']:
            vals=list(cmd)
            for j in range(1,len(vals),2):
                if vals[j]>938:vals[j]=938+(vals[j]-938)*1.09
            self.hero_right.append(vals)
        self.hero_samples={'logo_left':self.samples['logo_left'],'logo_right':sample(self.hero_right)}
        self.effects={
            'ui_shadow':soft_stroke_surface(self.paths['logo_left'],98,(.22,.25,.23,.19),9,5,8),
            'ui_recess':soft_stroke_surface(self.paths['logo_left'],45,(.39,.43,.40,.22),5,0,3),
            'ui_glow':soft_stroke_surface(self.paths['logo_left'],18,(.93,.1,1,.23),6)
        }
        self.grain=np.random.default_rng(17).normal(0,1.8,(1080,1920,1)).astype('float32')
    def logo(self,ctx,c,w=90,which=('logo_left','logo_right')):
        for n in which:path(ctx,self.paths[n]);stroke(ctx,c,w)
    def layer(self,ctx,alpha,fn,*args):
        if alpha<=0:return
        if alpha>.999:fn(ctx,*args);return
        ctx.push_group();fn(ctx,*args);ctx.pop_group_to_source();ctx.paint_with_alpha(alpha)
    def grid(self,ctx,f):
        # Independently sliding print swatches and typographic selection rectangle.
        r=smooth(4,20,f)
        if r>0:
            x=1084;y=897-(714*smooth(3,15,f));w=230+184*smooth(8,16,f);h=897-y
            ctx.save();ctx.rectangle(x,y,w,h);ctx.clip()
            ctx.new_path();ctx.arc(1084,539,306,-PI/2,PI/2);ctx.arc_negative(1084,539,217,PI/2,-PI/2);ctx.close_path()
            fill(ctx,gradient(1084,200,1320,875,[(0,'#7d114c'),(.6,'#8e195b'),(1,'#fba728')]))
            for j in range(23):
                for i in range(24):
                    xx=1100+i*11;yy=610+j*9
                    rr=max(.3,3.2-((xx-1288)**2+(yy-704)**2)/9000)
                    if (xx-1084)**2+(yy-539)**2<306**2 and (xx-1084)**2+(yy-539)**2>217**2:circle(ctx,xx,yy,rr,'#f1aa12')
            ctx.restore();handles(ctx,x,y,w,h,'#dc1779')
            n=3+int(2*smooth(9,22,f));sw=(w+6)/n
            for j in range(n):rect(ctx,x+j*sw,914,sw,148,['#d427a1','#de64b5','#e884c2','#edadd4','#f7d8ea'][max(0,5-n)+j],'#ffffff',.7)
            line(ctx,[(1069,max(165,y-90)),(1069,1062)],'#5eb5e3',.7)
            if f>14:
                rect(ctx,1388,198,98,86,'#f19b00');text(ctx,'Aa',1437,259,60,'#ffffff',center=True)
                crosshair(ctx,1497,539,52);circle(ctx,1497,539,34,(1,1,1,0),'#111111',2);circle(ctx,1497,539,18,'#000000')
        for idx,(x,y,w,h) in enumerate([(819,180,250,455),(532,447,271,451),(351,210,357,221),(723,64,80,383),(819,64,250,101)]):
            a=smooth(10+idx*1.4,19+idx*1.1,f)
            if a<=0:continue
            ctx.save();ctx.rectangle(x,y+h*(1-a),w*a,h*a);ctx.clip()
            if idx==0:
                rect(ctx,x,y,w,h,gradient(850,180,1050,635,[(0,'#c1167c'),(.45,'#da4098'),(1,'#3bb2c3')]))
                path(ctx,[['M',877,309],['C',932,258,1006,229,1069,229],['L',1069,319],['C',1030,320,990,332,963,354],['Z']]);fill(ctx,'#ffffff')
                path(ctx,[['M',795,381],['C',866,415,933,477,1020,545]]);stroke(ctx,'#ffffff',90)
            elif idx==1:
                rect(ctx,x,y,w,h,gradient(x,y,x,y+h,[(0,'#bc788e'),(1,'#bfc3c4')]))
                path(ctx,self.paths['logo_left']);stroke(ctx,'#ffffff',90)
                circle(ctx,760,584,46,'#ffffff');line(ctx,[(760,584),(830,655)],'#ffffff',91)
            elif idx==2:
                v=smooth(24,32,f);c0=(.36*(1-v)+.84*v,.80*(1-v)+.03*v,.88*(1-v)+.70*v);c1=(.21*(1-v)+.93*v,.74*(1-v)+.01*v,.84*(1-v)+.57*v)
                rect(ctx,x,y,w,h,gradient(x,y,x+w,y+h,[(0,c0),(1,c1)]))
                for j,col in enumerate(['#4e4d4f','#922ba1','#f34eee','#f0d611']):rect(ctx,x+j*w/4,y,w/4,30,col)
                for xx in [421,517,613,708]:line(ctx,[(xx,165),(xx,512)],'#39a8d5',.7)
                line(ctx,[(x,335),(x+w,335)],(1,1,1,.18),1)
            elif idx==3:rect(ctx,x,y,w,h,gradient(x,64,x,270,[(0,'#8bdc26'),(.5,'#8fdb29'),(1,'#ffffff')]))
            else:rect(ctx,x,y,w,h,gradient(x,y,x+w,y,[(0,'#e9a73e'),(1,'#9fae9b')]))
            ctx.restore()
        if f>16:
            ctx.save();ctx.rectangle(819,635,250,215);ctx.clip();path(ctx,self.paths['logo_right']);stroke(ctx,gradient(820,640,1084,850,[(0,'#fce2d4'),(1,'#e92c90')]),90);ctx.restore()
            for xx in [532,628,724,819]:line(ctx,[(xx,447),(xx,898)],'#4eacd4',.7)
            crosshair(ctx,517,540,53)
            for j,w in enumerate([120,120,90,10]):line(ctx,[(927,901+j*16),(927+w,901+j*16)],'#da2778',1.3)
    def ui(self,ctx,f):
        # Wireframes are true vector objects behind the shaded track.
        handles(ctx,522,342,539,508,'#42c64d',True)
        rect(ctx,712,198,683,676,(0,0,0,0),'#45a6cf',.8)
        for i in range(13):
            a=-1.34+i*.091;x=1082+328*math.cos(a);y=535+328*math.sin(a)
            line(ctx,[(x,y),(x+23*math.cos(a),y+23*math.sin(a))],'#70dc60',1.8)
        for xx,yy,c in [(548,267,'#38abe6'),(624,267,'#222322')]:circle(ctx,xx,yy,27,c)
        poly(ctx,[(542,254),(542,280),(561,267)],'#ffffff');line(ctx,[(611,267),(637,267)],'#ffffff',8);line(ctx,[(624,254),(624,280)],'#ffffff',8)
        rect(ctx,1180,414,120,120,gradient(1180,414,1300,534,[(0,'#f4ae32'),(1,'#fff4c8')]),'#f3c268',1,r=9)
        for j in range(4):rect(ctx,1189+j*10,423+j*10,101-j*20,102-j*20,(1,1,1,0),(1,1,1,.8),.7)
        for r in [20,42]:circle(ctx,1240,474,r,(1,1,1,0),(1,1,1,.7),.7)
        line(ctx,[(1183,417),(1298,531)],(1,1,1,.8),.7);line(ctx,[(1298,417),(1183,531)],(1,1,1,.8),.7)
        rect(ctx,1271,747,101,102,(1,1,1,0),'#9fdc50',2)
        line(ctx,[(1271,747),(1372,849)],'#9fdc50',2);line(ctx,[(1271,849),(1372,747)],'#9fdc50',2)
        # Soft cast shadows, bevelled white track and recessed neon guide.
        draw_image(ctx,self.effects['ui_shadow'][0],0,0)
        for off,w,a in [(8,111,.025),(6,104,.04),(4,98,.06)]:
            ctx.save();ctx.translate(4,off);path(ctx,self.paths['logo_left']);stroke(ctx,(.2,.2,.2,a),w);ctx.restore()
        path(ctx,self.paths['logo_left']);stroke(ctx,gradient(550,400,900,820,[(0,'#e5e6e4'),(.4,'#fdfdfc'),(1,'#d9dcda')]),90)
        path(ctx,self.paths['logo_left']);stroke(ctx,'#f7f8f6',68)
        draw_image(ctx,self.effects['ui_recess'][0],0,0)
        path(ctx,self.paths['logo_left']);stroke(ctx,gradient(700,350,730,800,[(0,'#bdc2be'),(.35,'#f1f2f0'),(1,'#dce0dc')]),40)
        path(ctx,self.paths['logo_left']);stroke(ctx,'#ffffff',26)
        draw_image(ctx,self.effects['ui_glow'][0],0,0)
        partial(ctx,self.samples['logo_left'],0,smooth(35,50,f), '#e72cf0',15)
        self.ui_tube(ctx,f)
        u=.50+.15*math.sin((f-45)*.12);p,a=at(self.samples['logo_left'],u)
        ctx.save();ctx.translate(*p);ctx.rotate(a+PI/2)
        circle(ctx,4,6,41,(.1,.1,.1,.12));circle(ctx,0,0,39,radial(0,0,45,[(0,'#f3f5f2'),(1,'#c7ccc8')]),'#f5f6f2',2)
        for x in [-8,8]:line(ctx,[(x,-19),(x,19)],'#a5aaa5',6);line(ctx,[(x-2,-19),(x-2,19)],'#f6f7f5',3)
        ctx.restore()
        glass_panel(ctx,f)
        ctx.save();ctx.translate(857,830);ctx.rotate(.08)
        rect(ctx,-62,-45,124,86,gradient(-60,-40,60,40,[(0,'#d1b9ff'),(1,'#b4b3eb')]),'#c0b6eb',1,r=13)
        poly(ctx,[(17,40),(32,60),(32,40)],'#bbb7ed','#a29de3',.8)
        for j in range(3):line(ctx,[(-29,-13+j*13),(30,-13+j*13)],'#ffffff',2)
        ctx.restore()
        cursor(ctx,676,309,'#9dff39',.9,-.08);line(ctx,[(714,323),(758,323)],'#60d900',12)
        self.blue_cursor(ctx,f)
        cursor(ctx,903,936,'#f3a000',.9,-.02);line(ctx,[(950,951),(994,951)],'#f17b00',12)
        crosshair(ctx,712,874,26);rect(ctx,730,889,7,10,(1,1,1,0),'#111111',2)
    def ui_tube(self,ctx,f):
        path(ctx,self.paths['logo_right']);stroke(ctx,gradient(900,300,1390,750,[(0,'#f7acf0'),(.5,'#ef8bd9'),(1,'#ef77d4')]),90)
        path(ctx,self.paths['logo_right']);stroke(ctx,'#d300e7',19)
        sm=self.samples['logo_right'];u=.19+.09*math.sin((f-45)*.13);partial(ctx,sm,max(0,u-.12),min(1,u+.08),gradient(1000,230,1310,450,[(0,'#b600bb'),(.35,'#dd28d6'),(.7,'#e45ad8'),(1,'#b90ebe')]),68)
        p,a=at(sm,max(0,u-.12));circle(ctx,p[0],p[1],13,'#ff9ff4')
    def blue_cursor(self,ctx,f):
        cursor(ctx,1071+math.sin(f*.1)*8,621,'#1273df',1,.08)
    def path_words(self,name):
        return 'TOGETHER' if name=='letter_left' else 'CREATE TOGETHER'
    def illustration(self,ctx,f,mono=False):
        stickers(ctx,f)
        # Large gradient disks and clouds interlace with the typographic tubes.
        ellipse(ctx,678,562,163,162,gradient(520,400,810,700,[(0,'#928cfa'),(.6,'#ad70f4'),(1,'#7d75eb')]),'#111111',1)
        ellipse(ctx,1250,494,138,100,gradient(1120,460,1380,550,[(0,'#d4ff00'),(1,'#8be733')]),'#111111',1)
        for n in ['letter_left','letter_right']:
            ctx.save();ctx.translate(8,8);path(ctx,self.paths[n]);stroke(ctx,'#000000',109);ctx.restore()
            path(ctx,self.paths[n]);stroke(ctx,'#0a0908',105)
            path(ctx,self.paths[n]);stroke(ctx,gradient(550,400,1380,800,[(0,'#ff00cb'),(.48,'#f0009b'),(1,'#ef002e')]),94)
            if mono:path(ctx,self.paths[n]);stroke(ctx,'#050505',97)
            path_type(ctx,self.samples[n],self.path_words(n),118 if n=='letter_left' else 119,'#ffffff' if mono else '#f59b00',None if mono else '#0c0b09',tracking=-5)
        cloud_shape(ctx,1100,660,.92,gradient(980,620,1220,770,[(0,'#d700ef'),(1,'#f0009d')]))
        ellipse(ctx,1183,567,97,98,gradient(1120,510,1210,665,[(0,'#aa8afa'),(.6,'#9f88ee'),(1,'#32c9ec')]),'#151515',1)
        # Freely floating outlined squiggles and decorative stems.
        if f>78:
            line(ctx,[(1407,340),(1447,313),(1490,311),(1530,320)],'#e70078',10)
            for x,y,a in [(1294,802,.3),(1458,888,.4)]:
                line(ctx,[(1290,740),(x,y)],'#d1eb30',8);circle(ctx,x,y,10,'#6ccdb4','#111111',1)
    def color_bars(self,ctx,f,foreground=False):
        # Slices reorganize in a regular four-row rhythm while their contents slide.
        amt=smooth(95,108,f)*(1-smooth(138,153,f) if foreground else 1-smooth(113,124,f))
        if amt<.001:return
        rows=[(833,132,628,133),(1095,265,398,133),(1096,398,355,133),(994,531,512,133)] if not foreground else [(422,265,414,132),(430,398,408,134),(451,532,353,131),(355,663,501,132),(821,663,410,132)]
        for i,(x,y,w,h) in enumerate(rows):
            if foreground:
                xx=x+math.sin(f*.16+i)*35
                # At the hero hold only the left slats and low front slat remain.
                if i==4:w*=.85
            else:xx=x
            reveal=amt
            xx+=(1-reveal)*(280 if i%2 else -220)
            stops=[(0,'#ffffff'),(.09,'#ff9900'),(.33,'#ee35d4'),(.55,'#f47c7e'),(.70,'#6740df'),(.9,'#4a00e8'),(1,'#bfa5ff')]
            if i%2:stops=[(0,'#200b0d'),(.09,'#ffffff'),(.13,'#ed30dd'),(.45,'#fa7b89'),(.73,'#5002d5'),(1,'#b2a4fd')]
            if foreground and f>122:
                if i==0:stops=[(0,'#f42bd9'),(.42,'#fa58b0'),(.86,'#ffe3c6'),(1,(1,.95,.9,.02))]
                elif i==1:stops=[(0,'#080908'),(.06,'#b9b9b4'),(.09,'#ec3fce'),(.65,'#ec9a69'),(1,(.15,.05,.02,.1))]
                elif i==2:stops=[(0,'#9e8af0'),(.8,'#b2a2fb'),(1,(.8,.7,1,.1))]
                elif i==3:stops=[(0,'#f67300'),(.06,'#ffcf39'),(.10,'#ef6ee3'),(.6,'#f7afde'),(1,(1,.95,.9,0))]
                else:stops=[(0,'#e72e00'),(.14,'#ffbb00'),(.22,'#ec62b1'),(.6,(1,.8,.6,.3)),(1,(1,.95,.9,0))]
            rect(ctx,xx,y,w*reveal,h,gradient(xx,y,xx+w,y,stops))
            if f<124:
                for j in range(3):
                    col=['#00adeb','#ff17b8','#2c04d9'][j];ww=24+((i*29+j*33)%79)
                    xxx=xx+(f*13+i*98+j*121)%max(w,1)
                    if xxx+ww<xx+w:rect(ctx,xxx,y,ww,h,col)
    def portrait_window(self,ctx):
        # Explicit union window: ring silhouette plus the interior of the right bowl.
        ctx.new_path()
        ctx.move_to(560,610);ctx.curve_to(480,477,590,291,812,281);ctx.line_to(879,252)
        ctx.curve_to(968,165,1147,111,1291,193);ctx.curve_to(1469,297,1536,531,1451,713)
        ctx.curve_to(1366,908,1099,976,918,925);ctx.curve_to(753,982,551,899,517,750);ctx.close_path()
    def portrait(self,ctx,f):
        self.color_bars(ctx,f,False)
        # Dark backing is shaded like the segmented outer metallic ring.
        metal=gradient(550,220,1480,920,[(0,'#28111d'),(.25,'#220015'),(.55,'#37204a'),(.8,'#b55d13'),(1,'#f0bf6b')])
        path(ctx,self.paths['logo_left']);stroke(ctx,metal,171)
        path(ctx,self.hero_right);stroke(ctx,metal,215)
        for j in range(10):
            lo=j*.10;hi=lo+.093
            cc=['#230b13','#351627','#311333','#38111b','#794018','#d99543','#71300f','#ba773c','#321317','#110b17'][j]
            partial(ctx,self.hero_samples['logo_right'],lo,hi,cc,212+6*math.sin(f*.15+j))
        # Jewel-toned interior remains visible through the curved negative spaces.
        self.portrait_interior(ctx,f)
        # Rounded translucent glass rails pass in front of hair and clothing.
        for n in ['logo_left','logo_right']:
            pts,ds=self.hero_samples[n];rail=pts if n=='logo_left' else pts[ds>ds[-1]*.27]
            ctx.new_path();ctx.move_to(*rail[0])
            for q in rail[1:]:ctx.line_to(*q)
            stroke(ctx,gradient(640,330,1260,840,[(0,(.95,.75,.65,.65)),(.25,(.63,.38,.9,.55)),(.55,(.9,.53,.65,.65)),(.78,(1,.84,.59,.94)),(1,(1,.96,.7,.95))]),91)
            ctx.save();ctx.translate(-5,-5);line(ctx,rail,(1,.91,.83,.25),80);ctx.restore()
            ctx.new_path();ctx.move_to(*rail[0])
            for q in rail[1:]:ctx.line_to(*q)
            stroke(ctx,gradient(600,300,1360,850,[(0,(1,1,1,.04)),(.5,(.45,.12,.5,.1)),(1,(1,.86,.5,.22))]),65)
            delta=np.gradient(rail,axis=0);normal=np.column_stack((-delta[:,1],delta[:,0]));normal/=np.maximum(np.linalg.norm(normal,axis=1,keepdims=True),1e-5)
            line(ctx,rail+normal*34,(1,.93,.84,.37),2.8)
            line(ctx,rail-normal*31,(.65,.3,.51,.2),2)
        self.color_bars(ctx,f,True)
        # Orbiting chart ring, lime tracer and moving primitives.
        ctx.save();ctx.translate(470,888);ctx.rotate(f*.08)
        for j in range(72):
            a=j*PI/36;b=(j+1)*PI/36
            ctx.new_path();ctx.arc(0,0,102,a,b+.01);ctx.arc_negative(0,0,42,b+.01,a);ctx.close_path();c=gradient(-80,-80,80,80,[(0,'#5212df'),(.35,'#8eec2a'),(.7,'#e8f338'),(1,'#f49800')]);
            import colorsys
            col=colorsys.hsv_to_rgb((j/72+.6)%1,.9,1);fill(ctx,col)
        ctx.restore()
        path(ctx,[['M',375,622],['C',402,433,553,372,704,465]]);stroke(ctx,'#c7ff20',6)
        path(ctx,[['M',988,1020],['C',1215,1041,1381,970,1407,787]]);stroke(ctx,'#c7ff20',6)
        for i,(x,y,r) in enumerate([(774,803,33),(859,1014,14),(1218,276,18)]):
            x+=math.sin(f*.12+i)*14;y+=math.cos(f*.1+i)*9;circle(ctx,x,y,r,gradient(x-r,y-r,x+r,y+r,[(0,'#c4ff17'),(.55,'#e9f600'),(1,'#ff6b14')]))
        ctx.save();ctx.translate(720,482);ctx.rotate(PI/4+f*.03);rect(ctx,-26,-26,52,52,gradient(-26,-26,26,26,[(0,'#80efff'),(.5,'#c6ff19'),(1,'#efdb00')]));ctx.restore()
        poly(ctx,[(1011,984),(1063,984),(1049,1020),(1068,1052),(1019,1052),(1032,1021)],gradient(1010,985,1070,1050,[(0,'#86cefd'),(.5,'#cfff00'),(1,'#e8ff1a')]))
    def portrait_interior(self,ctx,f):
        ctx.save();self.portrait_window(ctx);ctx.clip()
        self.logo(ctx,gradient(600,270,1370,800,[(0,'#4306bd'),(.5,'#42244d'),(1,'#d6966e')]),111)
        idx=self.cfg['portrait']['source_first_frame']+int(f)-self.cfg['portrait']['output_first'];idx=max(24,min(76,idx))
        if idx not in self.portraits:self.portraits[idx]=image_surface(self.root/self.cfg['portrait']['rgba_directory']/f'{idx:04d}.png')
        conf=self.cfg['portrait']
        # Stretch only the lower shirt continuation, leaving facial proportions intact.
        ctx.save();ctx.rectangle(700,662.6,800,500);ctx.clip();ctx.translate(conf['x'],662.6);ctx.scale(conf['scale'],4.0);ctx.set_source_surface(self.portraits[idx][0],0,-470);ctx.paint();ctx.restore()
        ctx.save();ctx.rectangle(0,0,1920,662.6);ctx.clip();draw_image(ctx,self.portraits[idx][0],conf['x'],conf['y'],conf['scale']);ctx.restore()
        ctx.restore()
    def collage(self,ctx,f):
        # Distant airy atmosphere is subtle and localized.
        for x,y,r in [(996,396,400),(690,540,240)]:circle(ctx,x,y,r,radial(x,y,r,[(0,(.7,.88,.94,.05)),(1,(1,1,1,0))]))
        # Two inner environments independently clipped to their drawn shapes.
        ctx.save();path(ctx,[['M',611,585],['C',610,457,708,402,802,427],['C',922,448,993,532,1057,582],['L',1121,717],['C',992,825,783,805,697,748],['C',645,711,608,653,611,585],['Z']]);ctx.clip();draw_image(ctx,self.images['water'][0],581,365,.75);ctx.restore()
        ctx.save();ctx.new_path();ctx.arc(1084,560,115,0,2*PI);ctx.clip();draw_image(ctx,self.images['stars'][0],817,300,.9);ctx.restore()
        path(ctx,self.paths['logo_left']);stroke(ctx,gradient(560,350,870,850,[(0,'#f74a15'),(.3,'#ffb400'),(.45,'#f4de00'),(.52,'#d400e8'),(.85,'#ad44fc'),(1,'#5afc38')]),89)
        path(ctx,self.paths['logo_right']);stroke(ctx,gradient(912,270,1330,834,[(0,'#725bc8'),(.3,'#615bd0'),(.63,'#2cdbe0'),(1,'#a6c18d')]),90)
        staircase(ctx)
        # Meadow on the top rim, below the seated observer.
        rng=random.Random(834)
        for i in range(740):
            a=rng.uniform(-2.16,.1);r=rng.uniform(307,329);x=1084+r*math.cos(a);y=560+r*math.sin(a);h=rng.uniform(5,18)
            line(ctx,[(x,y),(x+math.sin(f*.08+i)*2,y-h)],['#4a793b','#7d9b3c','#476b38'][i%3],rng.uniform(1,2.6))
            if i%8==0:
                line(ctx,[(x,y),(x+2,y-h-9)],'#5e8b37',1);flower(ctx,x+2,y-h-11,rng.uniform(2,5),['#ffd300','#fff6b0','#739bff'][i%3],n=5)
        dock(ctx)
        boat(ctx,856,515,-.59,.65,False);boat(ctx,914,580,.10,.79,True)
        if f<185:self.layer(ctx,1-smooth(179,185,f),hand_left,f);self.layer(ctx,1-smooth(177,183,f),tentacle,f)
        hand_right(ctx);hiker(ctx)
        for x,y,s,k in [(760,47,.53,0),(1152,402,.51,1),(560,675,.61,2)]:
            draw_image(ctx,self.images['cloud'][0],x+math.sin(f*.04+k)*8,y,s)
    def draw_garden(self,ctx,f):
        self.garden.draw(ctx,f)
        if 181<=f<220:
            u=.08+.24*smooth(181,189,f)+.68*smooth(202,220,f)
            p,a=at(self.samples['logo_left'],u);angle=a+PI
            cyclist(ctx,p[0]+math.sin(angle)*50,p[1]-math.cos(angle)*50,angle,f,.98,True)
        if 190<=f<224:
            u=.50-.47*smooth(200,224,f)
            p,a=at(self.samples['logo_right'],u);angle=a
            cyclist(ctx,p[0]+math.sin(angle)*42,p[1]-math.cos(angle)*42,angle,f+19,.78,False)
        if 194<=f<224:
            u=1-.53*smooth(198,224,f)
            p,a=at(self.samples['logo_right'],u);angle=a
            cyclist(ctx,p[0]+math.sin(angle)*38,p[1]-math.cos(angle)*38,angle,f+47,.72,True)
    def frame(self,f):
        surf=cairo.ImageSurface(cairo.FORMAT_ARGB32,1920,1080);ctx=cairo.Context(surf);color(ctx,self.cfg['canvas']['background']);ctx.paint()
        # The first frame and the final white interval are intentionally empty.
        if f<35:self.grid(ctx,f)
        elif f<45:
            self.layer(ctx,1-smooth(35,45,f),self.grid,f);self.layer(ctx,smooth(35,45,f),self.ui,f)
        elif f<65:self.ui(ctx,f)
        elif f<78:
            self.layer(ctx,1-smooth(65,77,f),self.ui,f)
            a=smooth(65,76,f)
            self.layer(ctx,a,self.illustration,f)
        elif f<96:self.illustration(ctx,f)
        elif f<105:
            self.illustration(ctx,f)
            self.color_bars(ctx,f,False)
            ctx.save();ctx.rectangle(810-(f-96)*35,0,1200,1080);ctx.clip();self.illustration(ctx,f,True);ctx.restore()
        elif f<114:
            a=smooth(104,113,f);self.layer(ctx,1-a,self.illustration,f,True);self.layer(ctx,a,self.portrait,f)
        elif f<146:self.portrait(ctx,f)
        elif f<158:
            # Slice wipe reveals the collage a row at a time.
            self.portrait(ctx,f)
            ctx.save()
            for i in range(7):
                v=smooth(146+i*.6,154+i*.6,f);ctx.rectangle(360,110+i*125,1200*v,127)
            ctx.clip();color(ctx,'#ffffff');ctx.paint();self.collage(ctx,f);ctx.restore()
        elif f<181:self.collage(ctx,f)
        elif f<196:
            self.layer(ctx,1-smooth(187,196,f),self.collage,f);self.draw_garden(ctx,f)
        elif f<227:self.draw_garden(ctx,f)
        surf.flush();buf=np.frombuffer(surf.get_data(),np.uint8).reshape(1080,1920,4);rgb=buf[:,:,[2,1,0]].copy()
        if 4<f<44:
            nonwhite=np.min(rgb,axis=2,keepdims=True)<249
            rgb=np.clip(rgb.astype('float32')+self.grain*nonwhite,0,255).astype('uint8')
        return rgb
