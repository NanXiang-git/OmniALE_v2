from .geometry import *
from .drawing import *
from . import print_stage,ui_stage
from .illustration_stage import Illustration


class Scene:
    def __init__(self,mode,config):
        self.mode=mode
        self.config=config
        self.revision=mode=='revision'
        self.duration=6 if self.revision else 4
        self.text=config['path_text'] if self.revision else 'TOGETHER'
        self.illustration=Illustration(self.text)

    def source_time(self,out_time):
        if not self.revision:return clamp(out_time,0,4)
        m=self.config['time_map']
        return float(np.interp(out_time,m['output_s'],m['source_s']))

    def svg(self,out_time):
        t=self.source_time(out_time)
        blue_t=self.source_time(out_time-self.config['cursor_delay_s']) if self.revision else t
        defs=COMMON_DEFS
        parts=[]
        pd,p=print_stage.draw(t);defs+=pd;parts.append(p)
        td,p=ui_stage.tube(t,self.revision,self.config['ui_gradient']);defs+=td;parts.append(p)
        parts.append(ui_stage.left_rail(t))
        cd,p=ui_stage.controls(t,self.config['ui_gradient'] if self.revision else None);defs+=cd;parts.append(p)
        parts.append(ui_stage.pointer('green',t))
        parts.append(ui_stage.pointer('orange',t))
        # Illustrated rear objects precede the cyan cursor, while the growing
        # foreground ink ribbons may occlude it. A delay changes only blue_t.
        id_,p=self.illustration.back(t);defs+=id_;parts.append(p)
        parts.append(ui_stage.pointer('blue',blue_t))
        fd,p=self.illustration.front(t);defs+=fd;parts.append(p)
        parts.append(self.illustration.peels(t))
        return '<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080"><defs>'+defs+'</defs>'+rect(0,0,1920,1080,'white')+''.join(parts)+'</svg>'
