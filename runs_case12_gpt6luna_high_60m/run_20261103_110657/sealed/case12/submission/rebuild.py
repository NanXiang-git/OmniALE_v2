#!/usr/bin/env python3
"""Burn the submitted ASS file into the supplied source video."""
import argparse
import subprocess
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('--input', required=True)
parser.add_argument('--output', required=True)
args = parser.parse_args()
root = Path(__file__).resolve().parent
ass = root / 'interview.ass'
out = Path(args.output).resolve()
out.parent.mkdir(parents=True, exist_ok=True)
escaped = str(ass).replace('\\', '/').replace(':', r'\\:').replace("'", r"\\'")
cmd = [
    'ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', args.input,
    '-map', '0:v:0', '-map', '0:a:0', '-vf', f"subtitles='{escaped}'",
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p',
    '-c:a', 'copy', '-movflags', '+faststart', str(out)
]
subprocess.run(cmd, check=True)
