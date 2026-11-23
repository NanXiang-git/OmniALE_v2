# Four-person meeting subtitles

The preview burns in the English ASS subtitles at 704 × 576 and 25 fps. A, B, C and D each have a fixed row in the bottom 32% of the picture. The SRT carries the same speaker text over the same intervals. Its cues split wherever a speaker starts or stops, and every displayed line carries a speaker prefix.

`alignment.json` maps the audible dialogue from all 85 transcript groups to 115 ASS events and 139 SRT cues. Cue times are in seconds. The subtitle files retain the supplied repetitions, fillers and unfinished words. Some speaker assignments and boundaries for quiet or overlapping speech are best estimates, particularly U046, U051 and U085.

## Offline rebuild

From any directory, run the following command. The script uses the source video and the delivered ASS and stream-copies the original stereo 48 kHz audio. The scratch directory defaults to a sibling of the submission directory.

```sh
python3 /workspace/submission/rebuild.py \
  --input /candidate/input \
  --submission /workspace/submission \
  --output /workspace/scratch/rebuilt-preview.mp4
```

The supplied Linux runtime was tested with Python 3.12.13, FFmpeg n8.1.3-29-gad3b795b72-20261101 with libass and libx264, and DejaVu Sans 2.37 in regular and bold weights. The script uses the Python standard library. `rebuild.json` provides the same invocation with the public path placeholders.

The source is AMI Meeting Corpus IS1009a, credited to the AMI Consortium under CC BY 4.0 in the supplied credits. This edition adds English subtitles to the three reordered excerpts.
