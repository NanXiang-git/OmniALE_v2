#!/usr/bin/env bash
set -euo pipefail

WORKSPACE=/workspace
SOURCE=/candidate/birds_source.mp4
OUT="$WORKSPACE/submission"
DURATION=185.466667

python3 "$OUT/voice_and_mix.py"

ffmpeg -hide_banner -y -i "$SOURCE" -i "$OUT/narration.wav" \
  -filter_complex "[0:a]volume=0.72[original];[original][1:a]sidechaincompress=threshold=0.04:ratio=5:attack=20:release=450[ducked];[ducked][1:a]amix=inputs=2:duration=first:dropout_transition=0,alimiter=limit=0.95[mixed]" \
  -map 0:v:0 -map "[mixed]" \
  -vf "fps=30,subtitles='$OUT/subtitles.srt':fontsdir='$OUT/fonts':force_style='FontName=WenQuanYi Zen Hei,FontSize=26,Outline=2,Shadow=1,MarginV=48,Alignment=2'" \
  -t "$DURATION" -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -r 30 \
  -c:a aac -b:a 192k -ar 48000 -movflags +faststart "$OUT/final.mp4"
