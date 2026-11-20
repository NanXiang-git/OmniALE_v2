"""Audio-driven editable object revision, sharing the reconstruction scene."""
from pathlib import Path
import math
import cairo
import numpy as np
from renderer import Renderer
from drawing import *
from motifs import cursor
from audio_analysis import AudioAnalysis


class RevisionRenderer(Renderer):
    def __init__(self, config):
        super().__init__(config)
        audio_path = Path(config['audio_path'])
        if not audio_path.is_absolute():
            audio_path = self.root / audio_path
        self.audio_path = audio_path
        self.audio = AudioAnalysis(audio_path)
        self.output_time = 0.
        self.current_source_frame = 0.
        self.current_portrait_index = None
        self.current_portrait_surface = None
        self.mask_cache = {}

    def path_words(self, name):
        return super().path_words(name).replace('TOGETHER', self.cfg['path_text'])

    def blue_cursor(self, ctx, f):
        # Omitted here: the independently delayed layer is inserted between UI and type.
        pass

    @staticmethod
    def ui_opacity(f):
        if f < 35 or f >= 77:
            return 0.
        if f < 45:
            return smooth(35, 45, f)
        if f < 65:
            return 1.
        return 1 - smooth(65, 77, f)

    def delayed_blue(self, ctx):
        delayed_time = self.output_time - float(self.cfg['cursor_delay_s'])
        if delayed_time < 0:
            return
        f = self.audio.source_time(delayed_time) * 24
        a = self.ui_opacity(f)
        self.layer(ctx, a, lambda c: cursor(c, 1071 + math.sin(f * .1) * 8, 621, '#1273df', 1, .08))

    def ui_tube(self, ctx, f):
        # Width varies along the fixed original paths. No scene/path transforms.
        k = 1 + float(self.cfg['pulse_amount']) * self.audio.control(self.output_time)
        c0, c1 = self.cfg['ui_gradient']
        def tint(c, factor=1, white=0, alpha=1):
            rgb = np.array(rgba(c)[:3])
            return tuple(np.clip(rgb * factor * (1-white) + white, 0, 1)) + (alpha,)
        body = gradient(900, 300, 1390, 750, [(0,c0),(1,c1)])
        path(ctx, self.paths['logo_right']); stroke(ctx, body, 90*k)
        # Outer transparent edge, glossy crown, central recessed channel.
        path(ctx, self.paths['logo_right'])
        stroke(ctx, gradient(900,300,1390,750,[(0,tint(c0,1,.45,.30)),(1,tint(c1,1,.6,.30))]), 94*k)
        path(ctx, self.paths['logo_right'])
        stroke(ctx, gradient(900,300,1390,750,[(0,tint(c0,.58)),(1,tint(c1,.58))]), 19*k)
        # A highlight on the same center path cannot displace the centerline.
        partial(ctx, self.samples['logo_right'], 0, 1,
                gradient(900,300,1390,750,[(0,tint(c0,1,.6,.38)),(1,tint(c1,1,.65,.4))]), 65*k)
        path(ctx, self.paths['logo_right'])
        stroke(ctx, gradient(900,300,1390,750,[(0,tint(c0,.62)),(1,tint(c1,.66))]), 14*k)
        sm = self.samples['logo_right']; u = .19 + .09*math.sin((f-45)*.13)
        partial(ctx, sm, max(0,u-.12), min(1,u+.08),
                gradient(1000,230,1310,450,[(0,tint(c0,.63)),(.35,c0),(.7,c1),(1,tint(c1,.64))]),68*k)
        p, _ = at(sm,max(0,u-.12)); circle(ctx,p[0],p[1],13*k,tint(c1,1,.60))

    def overflow_amount(self, t=None):
        t = self.output_time if t is None else t
        start = self.audio.events['C']['time_s']
        if t < start or t > start+.5:
            return 0.
        # Exactly six output frames in and six out. No portrait source delay.
        u = t-start
        return float(self.cfg['head_overflow_px']) * (smooth(0,.25,u) if u <= .25 else 1-smooth(.25,.5,u))

    def portrait_source_index(self, f):
        return float(np.clip(self.cfg['portrait']['source_first_frame'] + f - self.cfg['portrait']['output_first'],24,76))

    def portrait_surface(self, f):
        # Fractional source times interpolate premultiplied foreground and alpha
        # together; opaque faces remain one image, never two displaced heads.
        idx = self.portrait_source_index(f)
        if self.current_portrait_index == idx:
            return self.current_portrait_surface
        lo = int(math.floor(idx)); hi = min(76,lo+1); blend = idx-lo
        for j in (lo,hi):
            if j not in self.portraits:
                self.portraits[j] = image_surface(self.root/self.cfg['portrait']['rgba_directory']/f'{j:04d}.png')
        if blend < 1e-10:
            result = self.portraits[lo]
        else:
            data = np.round(self.portraits[lo][1].astype(float)*(1-blend)+self.portraits[hi][1].astype(float)*blend).astype('uint8')
            result = (cairo.ImageSurface.create_for_data(data,cairo.FORMAT_ARGB32,960,540),data)
        self.current_portrait_index=idx; self.current_portrait_surface=result
        return result

    def window_surface(self, extra=0.):
        key=round(extra,8)
        if key in self.mask_cache:
            return self.mask_cache[key]
        sf=cairo.ImageSurface(cairo.FORMAT_A8,1920,1080); c=cairo.Context(sf)
        self.portrait_window(c);fill(c,'#ffffff')
        if extra>0:
            # Extend only the upper rear window. The torso's window is fixed.
            c.save();c.rectangle(800,0,600,350);c.clip();c.translate(0,-extra)
            self.portrait_window(c);fill(c,'#ffffff');c.restore()
        sf.flush(); self.mask_cache[key]=sf
        return sf

    def portrait_unclipped(self,ctx,f):
        im=self.portrait_surface(f)[0];conf=self.cfg['portrait'];h=self.overflow_amount()
        # Head/shoulders translate once; the lower shirt still fills the fixed
        # torso window. Both regions meet at the same source scanline (470).
        seam=662.6-h
        overlap=1 if h>0 else 0
        ctx.save();ctx.rectangle(700,seam-overlap,800,1080-seam+overlap);ctx.clip();ctx.translate(conf['x'],seam);ctx.scale(conf['scale'],4.0+h/70);ctx.set_source_surface(im,0,-470);ctx.paint();ctx.restore()
        ctx.save();ctx.rectangle(0,0,1920,seam+overlap);ctx.clip();draw_image(ctx,im,conf['x'],conf['y']-h,conf['scale']);ctx.restore()

    def reveal(self,f):
        # Complete the keyed person's reveal at source 5.50 s / event C.
        # This controls alpha only; the source index advances at every frame.
        return smooth(104,132,f)

    def portrait_interior(self,ctx,f):
        ctx.save();self.portrait_window(ctx);ctx.clip()
        self.logo(ctx,gradient(600,270,1370,800,[(0,'#4306bd'),(.5,'#42244d'),(1,'#d6966e')]),111)
        ctx.restore()
        ctx.push_group()
        ctx.push_group();self.portrait_unclipped(ctx,f);ctx.pop_group_to_source()
        ctx.mask_surface(self.window_surface(self.overflow_amount()),0,0)
        ctx.pop_group_to_source();ctx.paint_with_alpha(self.reveal(f))
        # Base portrait() draws the original front rails/slats AFTER this layer.

    def visibility(self,f):
        if f<105 or f>=158:return 0.
        if f<114:return smooth(104,113,f)*self.reveal(f)
        # Later, the row wipe is accounted for in the actual diagnostic alpha.
        return self.reveal(f)

    def portrait_diagnostics(self, f):
        """Exact pre-foreground keyed layer in scene space, including the row wipe."""
        h=self.overflow_amount()
        sf=cairo.ImageSurface(cairo.FORMAT_ARGB32,1920,1080);c=cairo.Context(sf)
        if self.visibility(f)>0:
            c.push_group();self.portrait_unclipped(c,f);c.pop_group_to_source()
            c.mask_surface(self.window_surface(h),0,0)
            if self.visibility(f)<1:
                # Multiply all premultiplied channels after rendering.
                sf.flush();buf=np.frombuffer(sf.get_data(),np.uint8).reshape(1080,1920,4)
                buf[:]=np.round(buf.astype(float)*self.visibility(f)).astype('uint8');sf.mark_dirty()
            if f>=146:
                c.set_operator(cairo.OPERATOR_CLEAR)
                for i in range(7):
                    v=smooth(146+i*.6,154+i*.6,f);c.rectangle(360,110+i*125,1200*v,127)
                c.fill()
        sf.flush();buf=np.frombuffer(sf.get_data(),np.uint8).reshape(1080,1920,4).copy()
        alpha=buf[:,:,3].copy()
        win=self.window_surface(0);win.flush()
        window=np.frombuffer(win.get_data(),np.uint8).reshape(1080,win.get_stride())[:,:1920]
        extended_surface=self.window_surface(h);extended_surface.flush()
        extended=np.frombuffer(extended_surface.get_data(),np.uint8).reshape(1080,extended_surface.get_stride())[:,:1920]
        difference=np.maximum(extended.astype(float)-window.astype(float),0)
        fraction=np.divide(difference,extended,out=np.zeros_like(difference),where=extended>0)
        head=np.round(alpha.astype(float)*fraction).astype('uint8')
        head[350:]=0
        rgb=buf[:,:,[2,1,0]].astype(float)
        return alpha,head,rgb

    def frame(self, output_frame):
        self.output_time=output_frame/24
        f=self.audio.source_time(self.output_time)*24
        self.current_source_frame=f
        surf=cairo.ImageSurface(cairo.FORMAT_ARGB32,1920,1080);ctx=cairo.Context(surf)
        color(ctx,self.cfg['canvas']['background']);ctx.paint()
        # Same reconstruction composition; blue is its own delayed object layer.
        if f<35:self.grid(ctx,f)
        elif f<45:
            self.layer(ctx,1-smooth(35,45,f),self.grid,f);self.layer(ctx,smooth(35,45,f),self.ui,f)
        elif f<65:self.ui(ctx,f)
        elif f<78:self.layer(ctx,1-smooth(65,77,f),self.ui,f)
        self.delayed_blue(ctx)
        if 65<=f<78:self.layer(ctx,smooth(65,76,f),self.illustration,f)
        elif 78<=f<96:self.illustration(ctx,f)
        elif 96<=f<105:
            self.illustration(ctx,f);self.color_bars(ctx,f,False)
            ctx.save();ctx.rectangle(810-(f-96)*35,0,1200,1080);ctx.clip();self.illustration(ctx,f,True);ctx.restore()
        elif 105<=f<114:
            a=smooth(104,113,f);self.layer(ctx,1-a,self.illustration,f,True);self.layer(ctx,a,self.portrait,f)
        elif 114<=f<146:self.portrait(ctx,f)
        elif 146<=f<158:
            self.portrait(ctx,f);ctx.save()
            for i in range(7):
                v=smooth(146+i*.6,154+i*.6,f);ctx.rectangle(360,110+i*125,1200*v,127)
            ctx.clip();color(ctx,'#ffffff');ctx.paint();self.collage(ctx,f);ctx.restore()
        elif 158<=f<181:self.collage(ctx,f)
        elif 181<=f<196:
            self.layer(ctx,1-smooth(187,196,f),self.collage,f);self.draw_garden(ctx,f)
        elif 196<=f<227:self.draw_garden(ctx,f)
        surf.flush();buf=np.frombuffer(surf.get_data(),np.uint8).reshape(1080,1920,4)
        rgb=buf[:,:,[2,1,0]].copy()
        if 4<f<44:
            nonwhite=np.min(rgb,axis=2,keepdims=True)<249
            rgb=np.clip(rgb.astype('float32')+self.grain*nonwhite,0,255).astype('uint8')
        return rgb
