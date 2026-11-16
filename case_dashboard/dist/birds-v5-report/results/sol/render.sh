#!/bin/bash
set -euo pipefail
mkdir -p /workspace/scratch
ffmpeg -y -v error -i /candidate/birds_source.mp4 -vn -c:a pcm_s16le /workspace/scratch/original.wav
python3 /workspace/submission/assemble_media.py
ffmpeg -y -hide_banner -i /candidate/birds_source.mp4 -i /workspace/scratch/mix_float.wav \
 -map 0:v:0 -map 1:a:0 \
 -vf "subtitles=/workspace/submission/subtitles.srt:fontsdir=/workspace/submission/fonts:force_style='FontName=Noto Sans SC,FontSize=24,PrimaryColour=&H00FFFFFF,OutlineColour=&H00181818,BorderStyle=1,Outline=1.5,Shadow=0.5,Alignment=2,MarginV=12'" \
 -af 'alimiter=limit=0.87:level=false:latency=true' \
 -c:v libx264 -preset fast -crf 19 -pix_fmt yuv420p -r 30 \
 -c:a aac -b:a 192k -ar 48000 -t 185.5 -movflags +faststart /workspace/submission/final.mp4
