# EasyCom Session 2 subtitles

Deliverables are `interview.ass`, `interview.srt`, `alignment.json`, and the burned `preview.mp4`. ASS uses four fixed speaker lanes in the bottom 32% of the 1280x652 image. SRT cues are split at every subtitle event boundary and include speaker prefixes.

The supplied transcript provides the wording; faster-whisper word timestamps and visual turn checks informed timing and speaker assignment. Repeated wording and overlapping turns are kept as separate mapped events.

Build environment used: Python 3.12.13; FFmpeg/ffprobe n8.1.3-29-gad3b795b72-20261101 with libass and libx264. The timing aid was faster-whisper 1.2.1 using the supplied local Whisper-small checkpoint on CPU (int8); these are not rebuild dependencies.

## Offline rebuild

Rebuild requirements: Python 3.8 or newer with its standard library, plus FFmpeg with the `subtitles`/libass filter and `libx264` encoder. No Python packages, model downloads, network access, or generated speech are used by the rebuild.

Run:

```sh
python3 rebuild.py --input /candidate/input/source.mp4 --submission /workspace/submission --output /workspace/submission/preview.mp4
```

The script reads the source video and `interview.ass`, burns the subtitles into the video, and stream-copies the original audio.
