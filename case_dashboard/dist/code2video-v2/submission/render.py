#!/usr/bin/env python3
"""Render either ident edit from the same editable project.

Example: /usr/bin/python3 render.py --mode revision --config project/revision.json --output revision.mp4
"""
import argparse
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import tempfile

ROOT=Path(__file__).resolve().parent


def validate(c):
    if not isinstance(c.get('path_text'),str) or not re.fullmatch(r'[A-Z ]{6,10}',c['path_text']):
        raise ValueError('path_text must contain 6–10 uppercase letters/spaces')
    if len(c.get('ui_gradient',[]))!=2 or any(not re.fullmatch('#[0-9A-Fa-f]{6}',x) for x in c['ui_gradient']):
        raise ValueError('ui_gradient must be two #RRGGBB colors')
    if not 0<=float(c.get('cursor_delay_s',-1))<=.35:raise ValueError('cursor_delay_s must be 0–0.35')
    m=c['time_map'];s=m['source_s'];o=m['output_s']
    if len(s)!=len(o) or len(s)<2 or s[0]!=0 or s[-1]!=4 or o[0]!=0 or o[-1]!=6:
        raise ValueError('time_map must map source [0,4] to output [0,6]')
    if any(b<=a for seq in [s,o] for a,b in zip(seq,seq[1:])):raise ValueError('time anchors must increase')
    return c


def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--mode',choices=['reconstruction','revision'],required=True)
    p.add_argument('--config',type=Path,required=True)
    p.add_argument('--output',type=Path,required=True)
    p.add_argument('--preview-times',help='Comma-separated output times; writes PNG/SVG instead of a movie')
    p.add_argument('--size',default='1920x1080',help='Preview raster size; final deliverables use 1920x1080')
    args=p.parse_args()
    cfg=validate(json.loads(args.config.read_text()))
    # Bundle the exact typeface used to produce glyph outlines.
    font_cfg=Path(tempfile.gettempdir())/'ident-fontconfig.xml'
    font_cfg.write_text('<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "fonts.dtd"><fontconfig><dir>'+str(ROOT/'project/assets')+'</dir><cachedir>/tmp/ident-font-cache</cachedir></fontconfig>')
    os.environ['FONTCONFIG_FILE']=str(font_cfg)
    from project.scene import Scene
    from project.svg_renderer import Rasterizer
    import cv2
    scene=Scene(args.mode,cfg)
    width,height=map(int,args.size.split('x'))
    raster=Rasterizer(width,height)
    args.output.parent.mkdir(parents=True,exist_ok=True)
    if args.preview_times:
        for tt in args.preview_times.split(','):
            t=float(tt);svg=scene.svg(t)
            base=args.output.parent/(args.output.stem+f'_{t:.3f}')
            Path(str(base)+'.svg').write_text(svg)
            cv2.imwrite(str(base)+'.png',raster.render(svg))
        return
    fps=24;count=round(scene.duration*fps)
    # Accurate chroma rounding keeps the white design canvas neutral. The
    # platform's default fast BGR conversion otherwise produces Y=234,U=127.
    cmd=['ffmpeg','-hide_banner','-loglevel','error','-y','-f','rawvideo','-pix_fmt','bgr24','-s',f'{width}x{height}','-r',str(fps),'-i','pipe:0','-an','-sws_flags','accurate_rnd+full_chroma_int','-c:v','libx264','-preset','medium','-crf','16','-pix_fmt','yuv420p','-movflags','+faststart','-frames:v',str(count),str(args.output)]
    process=subprocess.Popen(cmd,stdin=subprocess.PIPE)
    try:
        for i in range(count):
            frame=raster.render(scene.svg(i/fps))
            process.stdin.write(frame.tobytes())
            if i%12==0 or i==count-1:print(f'{args.mode}: {i+1}/{count}',flush=True)
        process.stdin.close()
        if process.wait()!=0:raise RuntimeError('ffmpeg failed')
    except BaseException:
        process.kill();raise
    print(f'Wrote {args.output} ({count} frames, {width}x{height}, 24 fps)',flush=True)


if __name__=='__main__':main()
