#!/usr/bin/env python3
"""Offline rebuild of the burned preview from the ORIGINAL input + submitted subtitles.

    python rebuild.py --input <dir containing source.mp4> \
                      --submission <dir containing interview.ass> \
                      --output <path for the new mp4>

No network access, no paid API. Requires only ffmpeg (>=4.x) built with libass,
plus a "Microsoft YaHei" font available to fontconfig (the authoring environment
provided /runtime/fonts/msyh.ttc).

Video size / frame rate / duration and the audio stream are preserved: the video
is re-encoded (subtitles are burned in) while the audio is stream-copied.
"""
import argparse
import os
import shutil
import subprocess
import sys
import tempfile


def find_source(root):
    p = os.path.join(root, 'source.mp4')
    if os.path.isfile(p):
        return p
    for sub in ('input', 'Input', '.'):
        q = os.path.join(root, sub, 'source.mp4')
        if os.path.isfile(q):
            return q
    for dirpath, _dirs, files in os.walk(root):
        if 'source.mp4' in files:
            return os.path.join(dirpath, 'source.mp4')
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--input', required=True)
    ap.add_argument('--submission', required=True)
    ap.add_argument('--output', required=True)
    a = ap.parse_args()

    src = find_source(os.path.abspath(a.input))
    if not src:
        sys.exit('source.mp4 not found under --input (%s)' % a.input)

    ass = os.path.join(os.path.abspath(a.submission), 'interview.ass')
    if not os.path.isfile(ass):
        sys.exit('interview.ass not found under --submission (%s)' % a.submission)

    out = os.path.abspath(a.output)
    if os.path.isdir(out):
        out = os.path.join(out, 'preview.mp4')
    os.makedirs(os.path.dirname(out) or '.', exist_ok=True)

    # libass interprets the filter argument relative to the ffmpeg working
    # directory, so run from a scratch dir holding a copy of the .ass file.
    # This avoids every escaping problem with ':' and '\' on Windows or Linux.
    tmpdir = tempfile.mkdtemp(prefix='rebuild_', dir=os.path.dirname(out))
    try:
        shutil.copyfile(ass, os.path.join(tmpdir, 'interview.ass'))
        cmd = ['ffmpeg', '-y', '-v', 'error',
               '-i', src,
               '-vf', 'ass=interview.ass',
               '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20',
               '-pix_fmt', 'yuv420p',
               '-c:a', 'copy',
               '-movflags', '+faststart',
               out]
        subprocess.run(cmd, check=True, cwd=tmpdir)
    finally:
        shutil.rmtree(tmpdir, ignore_errors=True)
    print('wrote %s' % out)


if __name__ == '__main__':
    main()
