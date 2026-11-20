"""Revision-only materials and independently clocked cursor geometry."""
import math
import numpy as np
from scipy.spatial import cKDTree
from .drawing import Canvas, W, H, sample_curve, poly_segment, curve_at, rgb, mixcol


def blue_tube(g, c, f, pulse):
    """Sweep the original centerline with a varying cross-section; never scale XY."""
    extension = sample_curve([g.cfg['curves']['large'][-1][-2:], [912,333,887,355,870,379]],95)
    ext = np.vstack([g.big, extension[1:]])
    ratio = (len(ext)-1)/(len(g.big)-1)
    main_end = float(np.interp(f,[34,36,40,44,48,52],[0,.02,.335,.675,.915,1]))
    top_start = float(np.interp(f,[34,36,40,44,48,50],[.68,.73,.85,.96,1.05,ratio]))
    parts = [(g.big,0,main_end)]+([(ext,top_start/ratio,1)] if f<50 else [])
    scale = 1 + g.cfg.get('pulse_amount',.12)*pulse
    colors = g.cfg.get('ui_gradient',['#2563EB','#22D3EE'])
    if 'blue_tube_coords' not in g.cache:
        yy,xx = np.mgrid[:H,:W].astype(np.float32)
        dist, idx = cKDTree(ext).query(np.c_[xx.ravel(),yy.ravel()],workers=4)
        idx = idx.reshape(H,W)
        tangent = np.gradient(ext,axis=0)[idx]
        tangent /= np.linalg.norm(tangent,axis=-1,keepdims=True)
        q = ext[idx]
        signed = (xx-q[...,0])*(-tangent[...,1])+(yy-q[...,1])*tangent[...,0]
        g.cache['blue_tube_coords'] = (signed.astype(np.float32), np.clip((xx-720)/670,0,1))
    signed, along = g.cache['blue_tube_coords']
    profile = signed/(46*scale)
    base = np.array(rgb(colors[0]))[None,None,:]*(1-along[...,None])+np.array(rgb(colors[1]))[None,None,:]*along[...,None]
    volume = .64+.36*np.sqrt(np.clip(1-profile*profile,0,1))
    specular = .40*np.exp(-((profile+.62)/.14)**2)+.19*np.exp(-((profile-.84)/.045)**2)
    body = np.clip(base*volume[...,None]+specular[...,None],0,1)
    mask = Canvas()
    for curve,a,b in parts:
        if b>a:
            mask.line(poly_segment(curve,a,b),'#ffffff',92*scale)
    coverage = mask.array()[...,3].astype(np.float32)/255
    # Thin transparent edges and a white reflected stripe stay attached to the section.
    opacity = 1-.23*np.clip((np.abs(profile)-.74)/.26,0,1)
    c.image(np.dstack([np.uint8(body*255), np.uint8(coverage*opacity*255)]))
    if f>=43:
        c.line(poly_segment(g.big,0,main_end),mixcol(colors[0],'#063b85',.40),15*scale)
    if f>=40:
        at=float(np.interp(f,[40,44,48,52,56,60,64,68,72],[.055,.26,.54,.72,.79,.82,.875,.95,1.01]))
        span=float(np.interp(f,[40,44,48,52,56,64,72],[.10,.38,.27,.24,.21,.16,.11]))
        a=max(0,at-span/2);b=min(ratio,at+span/2)
        for width in range(78,8,-2):
            u=(78-width)/70
            # Preserve the separately traveling glossy sleeve on the original rail.
            col=mixcol(colors[1],colors[0],math.sin(u*math.pi)*.74)
            c.line(poly_segment(ext,a/ratio,b/ratio),col,width*scale)
        q,d=curve_at(ext,(b-.015)/ratio)
        c.ellipse(*q,13,13,'#b8fbff')


def blue_cursor(f):
    c=Canvas()
    if not 40<=f<72:
        return c
    bx=float(np.interp(f,[40,44,48,52],[558,795,971,1050]))
    c.c.save();c.c.translate(bx,596);c.c.rotate(-.05)
    c.shape([(0,0),(52,14),(28,26),(20,56),'z'],'#1475ed','#ffffff',2)
    c.c.restore()
    return c
