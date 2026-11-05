#!/usr/bin/env python3
"""Rebuild preview.mp4 from the original input video + submitted ASS (offline, no network).
Usage: rebuild.py --input <dir with source.mp4> --submission <dir with interview.ass> --output <dir>
Deps: python3 stdlib, ffmpeg (libass, libx264). All temp files stay in --output."""
import argparse, os, subprocess, sys, shutil
from pathlib import Path
p = argparse.ArgumentParser()
p.add_argument('--input', required=True); p.add_argument('--submission', required=True)
p.add_argument('--output', required=True)
a = p.parse_args()
src = Path(a.input) / 'source.mp4'
ass = Path(a.submission) / 'interview.ass'
out = Path(a.output); out.mkdir(parents=True, exist_ok=True)
tmp = out / '_rebuild_tmp'; tmp.mkdir(exist_ok=True)
dst = out / 'preview.mp4'
ass2 = tmp / 'interview.ass'; shutil.copyfile(ass, ass2)
cmd = ['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(src),
       '-vf', 'ass=%s' % ass2, '-c:v', 'libx264', '-crf', '20', '-preset', 'medium',
       '-pix_fmt', 'yuv420p', '-r', '25', '-c:a', 'copy', '-movflags', '+faststart', str(dst)]
subprocess.run(cmd, check=True)
shutil.rmtree(tmp, ignore_errors=True)
print('rebuilt', dst)
