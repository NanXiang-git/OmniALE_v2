"""Shared scene and timing evaluator for both deliverables."""
import numpy as np
import cv2
from .graphics import *
from .layout import render_layout
from .ui import pink_tube,grey_tube,ui_guides,icons,extras,glass_panel,speech,draw_cursor,cursor_state
from .illustration import render_art
DEFAULT={'path_text':'CREATE ON','ui_gradient':['#2563EB','#22D3EE'],'cursor_delay_s':.25,'time_map':{'source_s':[0,1.75,2.75,3.75,4],'output_s':[0,1.75,3.25,5.25,6]}}
_NOISE=None

def source_time(t,mode,config):
    if mode=='reconstruction':return t
    tm=config['time_map']
    return float(np.interp(t,tm['output_s'],tm['source_s']))

def frame_state(t,mode,config):
    st=source_time(t,mode,config)
    delayed=source_time(t-config['cursor_delay_s'],mode,config) if mode=='revision' and t>=config['cursor_delay_s'] else (-1 if mode=='revision' else st)
    return {'output_s':t,'source_s':st,'source_frame':st*24,'layout_source_frame':int(st*24/2)*2,'art_source_frame':(int((st*24-1)/2)*2+1 if st*24>=61 else st*24),'blue_source_s':delayed,'blue_cursor':cursor_state(delayed*24,'blue'),'green_cursor':cursor_state(st*24,'green'),'orange_cursor':cursor_state(st*24,'orange')}

def render_frame(t,mode,config):
    global _NOISE
    state=frame_state(t,mode,config);f=state['source_frame']
    surf,ctx=surface();source(ctx,'#fff');ctx.paint()
    render_layout(ctx,float(int(f/2)*2))
    # Stationary print grain is synthesized once and applied only to colored ink.
    if 2<=f<43:
        if _NOISE is None:_NOISE=np.random.default_rng(279).normal(0,2.5,(H,W,1)).astype(np.float32)
        a=array(surf);p=a[:,:,:3].astype(np.float32);weight=(255-np.min(p,axis=2,keepdims=True))/255
        a[:,:,:3]=np.clip(p+_NOISE*weight,0,255).astype(np.uint8);surf.mark_dirty()
    pink_tube(ctx,f,config['ui_gradient'],mode=='revision' and f>=36)
    grey_tube(ctx,f,config['ui_gradient'],mode=='revision')
    ui_guides(ctx,f)
    icons(ctx,f)
    extras(ctx,f)
    glass_panel(ctx,f,config['ui_gradient'],mode=='revision')
    speech(ctx,f)
    draw_cursor(ctx,f,'green');draw_cursor(ctx,f,'orange')
    draw_cursor(ctx,state['blue_source_s']*24,'blue')
    render_art(ctx,(float(int((f-1)/2)*2+1) if f>=61 else f),config['path_text'] if mode=='revision' else 'TOGETHER')
    return array(surf)[:,:,:3][:,:,::-1].copy()
