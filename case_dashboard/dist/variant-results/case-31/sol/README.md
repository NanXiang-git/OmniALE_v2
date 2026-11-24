# EasyCom Session 2 · Four-speaker English subtitles

Open `preview.mp4` for the burned preview. `interview.ass` provides fixed rows for A, B, C and D in the lower part of the picture. The visible letter labels match the ASS Name fields. `interview.srt` uses the same event boundaries and repeats each active speaker’s text across any slices caused by another speaker entering or leaving. `alignment.json` links the subtitle events to all 53 transcript groups and lists the actual SRT cue numbers.

The source uses a 1280 × 652 picture at 25 fps. The preview retains all 3,755 frames and copies the original 48 kHz stereo AAC stream. Video encoding is lossless to preserve source pixels outside the text overlays. A few quiet or interrupted fragments, including “Was like…” and the standalone “Harry,” have estimated boundaries and speaker assignments.

## Offline rebuild

Use Python 3 and FFmpeg with the `ass` filter and `libx264` encoder on PATH. The font is DejaVu Sans with its bold variant available through Fontconfig. The submitted preview was built with Python 3.12.13, FFmpeg n8.1.3-29-gad3b795b72-20261101, libass 0.17.5 and DejaVu Sans 2.37.

Run this from the submission directory. The script takes the supplied input directory, the directory containing `interview.ass`, and the destination MP4 path. Allow roughly 760 MiB for the output.

```bash
python3 rebuild.py /candidate/input . /workspace/submission/preview.mp4
```

The rebuild uses only `source.mp4` and the submitted ASS. It requires no transcription model or network access.

Source media and transcript attribution is to Meta Reality Labs Research, EasyCom Main Session 2, CC BY-NC 4.0. [Candidate package credits](/candidate/CREDITS.md)
