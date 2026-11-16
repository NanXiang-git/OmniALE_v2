#!/usr/bin/env bash
set -euo pipefail
ffmpeg -hide_banner -y -i /candidate/birds_source.mp4 -i /workspace/scratch/mixed_float.wav \
  -map 0:v:0 -map 1:a:0 \
  -vf 'ass=/workspace/submission/burn_subtitles.ass:fontsdir=/workspace/submission/fonts' \
  -af 'alimiter=limit=0.92:attack=5:release=80:level=false:latency=true' \
  -c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p -r 30 -fps_mode cfr -threads 4 \
  -c:a aac -b:a 256k -ar 48000 -ac 2 -t 185.5 -movflags +faststart \
  /workspace/submission/final.mp4
