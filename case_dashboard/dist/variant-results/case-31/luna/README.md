# Four-Speaker Meeting Subtitles

Deliverables:

- `interview.ass`: four fixed role slots with A/B/C/D labels.
- `interview.srt`: non-overlapping global cue cells; each active speaker line is shown together.
- `alignment.json`: source utterance group to ASS event and SRT cue mapping.
- `preview.mp4`: source picture with the submitted ASS burned in and original AAC audio stream copied.
- `rebuild.py` and `rebuild.json`: offline rebuild entry point and its argument contract.

Build environment used: Python 3.12.13 and FFmpeg n8.1.3 with the `subtitles`/libass filter and libx264 encoder. The rebuild also works with Python 3.10+ and an FFmpeg build that provides those same components. No additional Python packages or network access are required.

Run with `ffmpeg` on `PATH`:

```sh
python3 /workspace/submission/rebuild.py \
  --input /candidate/input \
  --submission /workspace/submission \
  --output /workspace/submission/preview.mp4
```

No network access, TTS, ASR, or additional Python packages are needed by the rebuild. It reads the supplied `transcript.txt` and `source.mp4`, writes the subtitle and mapping files, then renders a new video from the source.
