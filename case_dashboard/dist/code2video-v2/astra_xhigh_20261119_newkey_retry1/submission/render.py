#!/usr/bin/env python3
"""Clean offline renderer. Example:
/usr/bin/python3 render.py --mode revision --config project/revision.json --output revision.mp4
"""
import argparse,json,os,re,sys,subprocess
from pathlib import Path
from concurrent.futures import ProcessPoolExecutor
import numpy as np
from PIL import Image
from project.scene import render_frame,frame_state,DEFAULT

def validate(c):
    if not re.fullmatch(r'[A-Z ]{6,10}',c['path_text']):raise ValueError('path_text must contain 6–10 uppercase letters/spaces')
    if not 0<=float(c['cursor_delay_s'])<=.35:raise ValueError('cursor_delay_s must be in 0–0.35 seconds')
    if len(c['ui_gradient'])!=2 or any(not re.fullmatch('#[0-9A-Fa-f]{6}',v) for v in c['ui_gradient']):raise ValueError('ui_gradient must contain two #RRGGBB colors')
    tm=c['time_map'];s=tm['source_s'];o=tm['output_s']
    if len(s)!=len(o) or len(s)<2 or s[0]!=0 or o[0]!=0 or s[-1]!=4 or o[-1] not in (4,6):raise ValueError('invalid time_map endpoints')
    if any(b<=a for vs in (s,o) for a,b in zip(vs,vs[1:])):raise ValueError('time_map anchors must increase')

def job(args):
    i,mode,c=args;return i,render_frame(i/24,mode,c)

def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--mode',choices=['reconstruction','revision'],required=True)
    p.add_argument('--config',type=Path,required=True)
    p.add_argument('--output',type=Path,required=True)
    p.add_argument('--workers',type=int,default=4)
    p.add_argument('--still',type=float,help='Render one output-time checkpoint in seconds, as PNG')
    p.add_argument('--preview-frames',help='Comma-separated output frame numbers; saves PNG checkpoints instead of encoding')
    p.add_argument('--validation-dir',type=Path,help='Also save selected rendered frames and all timing states')
    args=p.parse_args();c=json.loads(args.config.read_text());validate(c)
    args.output.parent.mkdir(parents=True,exist_ok=True)
    if args.still is not None:
        Image.fromarray(render_frame(args.still,args.mode,c)).save(args.output);print(args.output);return
    if args.preview_frames:
        args.output.mkdir(parents=True,exist_ok=True)
        indices=[int(s) for s in args.preview_frames.split(',')]
        with ProcessPoolExecutor(max_workers=args.workers) as pool:
            for i,im in pool.map(job,[(i,args.mode,c) for i in indices]):Image.fromarray(im).save(args.output/f'{i:03d}.png');print(f'checkpoint {i}',flush=True)
        return
    count=96 if args.mode=='reconstruction' else 144
    cmd=['ffmpeg','-hide_banner','-loglevel','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s','1920x1080','-r','24','-i','-','-an','-c:v','libx264','-preset','slow','-crf','17','-pix_fmt','yuv420p','-movflags','+faststart','-color_primaries','bt709','-color_trc','bt709','-colorspace','bt709',str(args.output)]
    proc=subprocess.Popen(cmd,stdin=subprocess.PIPE)
    keep={0,8,16,24,32,40,44,48,54,60,63,66,69,72,76,80,84,90,95} if args.mode=='reconstruction' else {0,24,42,48,60,66,72,78,84,90,96,108,120,126,132,143}
    if args.validation_dir:args.validation_dir.mkdir(parents=True,exist_ok=True)
    try:
        with ProcessPoolExecutor(max_workers=args.workers) as pool:
            for i,im in pool.map(job,[(i,args.mode,c) for i in range(count)],chunksize=1):
                proc.stdin.write(im.tobytes())
                if args.validation_dir and i in keep:Image.fromarray(im).save(args.validation_dir/f'{args.mode}_{i:03d}.png')
                if i%12==0 or i==count-1:print(f'{args.mode}: {i+1}/{count}',flush=True)
        proc.stdin.close();code=proc.wait()
        if code:raise RuntimeError(f'ffmpeg exited {code}')
    except BaseException:
        proc.kill();raise
    if args.validation_dir:
        states=[frame_state(i/24,args.mode,c) for i in range(count)]
        (args.validation_dir/f'{args.mode}_timing.json').write_text(json.dumps(states,indent=2))
    print(str(args.output.resolve()))
if __name__=='__main__':main()
