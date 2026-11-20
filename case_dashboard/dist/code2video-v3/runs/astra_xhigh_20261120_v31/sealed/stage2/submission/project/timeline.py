"""Frame-accurate scene graph. Every group is rendered from its editable source objects."""
import numpy as np
from .drawing import *
from .scenes_graphic import GraphicScenes
from .scenes_portrait import PortraitScene
from .scenes_collage import Collage
from .nature import Garden
class Project:
 def __init__(self,config,mode='reconstruction',config_path=None):
  self.config=dict(config);self.mode=mode;self.audio=None
  if mode=='revision':
   from pathlib import Path
   from .audio import AudioDrive
   from .revision_portrait import RevisionPortraitScene
   self.config['_revision']=True
   audio=Path(config['audio_path'])
   if not audio.is_absolute():audio=(Path(config_path).resolve().parent if config_path else ROOT)/audio
   self.audio=AudioDrive(audio)
   self.portrait=RevisionPortraitScene(self.config)
  else:self.portrait=PortraitScene(self.config)
  self.graphics=GraphicScenes(self.config);self.collage=Collage(self.config);self.garden=Garden(self.config)
 def signals(self,frame):
  t=frame/self.config['fps']
  f=self.audio.source_time(t)*24 if self.audio else min(frame,238)
  return dict(output_frame=frame,output_time_s=t,source_time_s=f/24,
              low_raw_normalized=float(np.interp(t,self.audio.times,self.audio.normalized)) if self.audio else 0,
              low_control=self.audio.pulse(t) if self.audio else 0,
              tube_thickness_scale=1+self.config.get('pulse_amount',0)*(self.audio.pulse(t) if self.audio else 0),
              portrait_source_index=24+f-108 if 108<=f<=150 else -1,
              head_overflow_px=self.audio.overflow(t,self.config.get('head_overflow_px',36)) if self.audio else 0)
 def render(self,f):
  frame=f;signals=self.signals(frame);f=signals['source_time_s']*24 if self.audio else min(frame,238)
  f=min(f,238);c=Canvas(bg=self.config.get('background','#ffffff'))
  self.last_signals=signals
  if self.audio:
   self.portrait.last_person=None;self.portrait.last_overflow=None;self.portrait.last_visibility=0.
  disabled=set(self.config.get('disabled_objects',[]))
  def put(id,layer,alpha=1):
   if id not in disabled and alpha>0:c.image(layer,alpha=alpha)
  if f<50:put('grid.layout',self.graphics.grid(f))
  if 34<=f<=76:put('interface.group',self.graphics.ui(f,signals['low_control']),1-ease((f-72)/4))
  if self.audio:
   from .revision_graphics import blue_cursor
   cf=self.audio.source_time(frame/self.config['fps']-self.config.get('cursor_delay_s',.25))*24
   if 40<=cf<72:put('cursor.blue',blue_cursor(cf),(1-ease((cf-64)/8))*(1-ease((cf-72)/4)))
  if 64<=f<=122:put('illustration.group',self.graphics.illustration(f),1-ease((f-116)/7))
  if 92<=f<=156:put('slices.rear',self.portrait.slices(f,True))
  if 108<=f<=159:
   put('portrait.window',self.portrait.portrait(f,signals['head_overflow_px']) if self.audio else self.portrait.portrait(int(round(f))))
  foreground_slices=None
  if 92<=f<=156:
   foreground_slices=self.portrait.slices(f,False);put('slices.foreground',foreground_slices)
  if 105<=f<=144:put('portrait.orbits',self.portrait.ornaments(f))
  if 144<=f<=200:put('collage.group',self.collage.scene(f))
  if 176<=f<=225:put('garden.path',self.garden.path_layer(f))
  if 179<=f<=223:put('garden.riders',self.garden.riders(f))
  if self.audio:
   signals['portrait_reveal_fraction']=self.portrait.last_visibility
   visible=0.
   if self.portrait.last_person is not None and self.portrait.full_person_area:
    alpha=self.portrait.last_person[...,3].astype(np.float32)*self.portrait.foreground_transmission
    if foreground_slices is not None and 'slices.foreground' not in disabled:alpha*=1-foreground_slices.array()[...,3].astype(np.float32)/255
    visible=float(alpha.sum()/self.portrait.full_person_area)
   signals['portrait_visibility']=visible
   signals['head_overflow_alpha_area_px']=int(self.portrait.last_overflow.sum()/255) if self.portrait.last_overflow is not None else 0
  return c
