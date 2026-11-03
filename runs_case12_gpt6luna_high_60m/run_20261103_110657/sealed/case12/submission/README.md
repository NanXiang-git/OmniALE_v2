# Four-person meeting subtitles

## Files

- `interview.ass`: positioned, role-labeled subtitles used for the burn-in.
- `interview.srt`: boundary-partitioned equivalent with speaker prefixes.
- `alignment.json`: mapping from source transcript group IDs to ASS events and SRT cues.
- `preview.mp4`: source video with `interview.ass` burned in.
- `rebuild.py`: offline renderer used by the rebuild command.

## Rebuild

From this directory, run:

```sh
python3 rebuild.py --input /candidate/input/source.mp4 --output preview.mp4
```

The `rebuild.json` command uses the required `{python}`, `{input}`, `{submission}` and `{output}` placeholders. Rendering needs Python 3 and FFmpeg with `libass` and `libx264`; the audio stream is stream-copied from the input. No network service, paid API, TTS, or external model is used during rebuild.

## Production method and dependencies

The English wording comes from the supplied `transcript.txt`. Timing was estimated with the provided offline `transcribe` command using faster-whisper small, int8, CPU mode and word timestamps, then checked against the transcript and the public edit boundaries. I inspected FFmpeg-extracted video frames and the provided face references for visual context. I do not have native audio perception in this session; I did not listen to the WAVs or claim an independent auditory identity check. Speaker attribution is therefore a best-effort assignment from turn context and the visible meeting, and short overlaps may be uncertain.

The production tools were Python 3 standard library, faster-whisper (provided offline runtime), FFmpeg/FFprobe, and the system Microsoft YaHei font for libass. The provided original audio/video and transcript remain the only source media; no generated audio or replacement footage was added.

## Source and rights

Source attribution and stated license information are in the supplied `CREDITS.md`: AMI Meeting Corpus IS1009a, AMI Consortium; signals/transcription stated as CC BY 4.0. The source tutorial/manual asset has separate redistribution status. This is a local task build and does not claim broader redistribution permission.
