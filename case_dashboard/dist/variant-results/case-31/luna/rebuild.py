#!/usr/bin/env python3
"""Burn interview.ass into the supplied source video without changing its audio."""

import argparse
import shutil
import subprocess
from pathlib import Path


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', required=True, help='source.mp4 or its containing directory')
    parser.add_argument('--submission', required=True, help='directory containing interview.ass')
    parser.add_argument('--output', required=True, help='destination MP4')
    args = parser.parse_args()

    input_path = Path(args.input).resolve()
    if input_path.is_dir():
        input_path = input_path / 'source.mp4'
    submission = Path(args.submission).resolve()
    ass_path = submission / 'interview.ass'
    output_path = Path(args.output).resolve()
    if not input_path.is_file():
        parser.error(f'Input video not found: {input_path}')
    if not ass_path.is_file():
        parser.error(f'ASS file not found: {ass_path}')
    if input_path == output_path:
        parser.error('Output must not overwrite the input video')
    ffmpeg = shutil.which('ffmpeg')
    if not ffmpeg:
        parser.error('ffmpeg is required on PATH')
    output_path.parent.mkdir(parents=True, exist_ok=True)

    command = [
        ffmpeg, '-hide_banner', '-loglevel', 'error', '-y',
        '-i', str(input_path),
        '-map', '0:v:0', '-map', '0:a:0',
        '-vf', 'subtitles=interview.ass',
        '-c:v', 'libx264', '-preset', 'medium', '-crf', '18',
        '-pix_fmt', 'yuv420p', '-c:a', 'copy',
        '-movflags', '+faststart', str(output_path),
    ]
    subprocess.run(command, cwd=submission, check=True)


if __name__ == '__main__':
    main()
