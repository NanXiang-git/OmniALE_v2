# Sprite Fright Chinese Audio Description

The deliverable covers the supplied 81-second source timeline. `accessible.mp4` keeps the original H.264 video stream and frame count, with the described mix encoded as AAC. The separate WAV files are 48 kHz, stereo, 16-bit PCM and exactly 81 seconds long. `base_track.wav` is the un-ducked source audio. `ducked_base_track.wav` lowers it by 6 dB under narration, with 80 ms fades at cue boundaries. A shared automatic gain reduction of -1.5785 dB was applied to keep the mix sample peak at -2 dBFS; ffmpeg's loudness analysis measured -2.0 dBTP. The gain is recorded in `player_config.json`.

## Rebuild

With `ffmpeg` on `PATH` and Python 3, run:

```sh
python3 rebuild.py --input /candidate/input --submission /workspace/submission --output /workspace/submission
```

The script reads `original.wav`, `source.mp4`, `ad_plan.json`, and the submitted `cues/*.wav`. It rebuilds all four PCM tracks and remuxes the original video stream into `accessible.mp4`; it does not call TTS or access the network. The same directory may be used for `--output` because all inputs are read before the rebuilt media is written.

## Analysis and limitations

The local `faster-whisper` small checkpoint was used for English speech timing. The supplied environment's PyAV integration raised an API error, so ffmpeg decoded the source to mono 16 kHz float PCM before it was passed to the local model. The supplied subtitle draft was only an auxiliary translation reference; the transcript and word timestamps were treated as approximate speech boundaries, not as subtitles or a complete account of the soundtrack. The local Piper Mandarin Huayan medium voice synthesized each cue offline at normal or slightly lengthened rate; the final cue WAVs were converted to 48 kHz stereo PCM and measured to set the VTT and plan end times. A local Mandarin ASR pass roughly recovered the cue sequence but made homophone substitutions, so it was not treated as a pronunciation or naturalness assessment.

Visual review used contact sheets sampled at 0.5 to 3 second intervals and selected full-size frames. There was no independent listening panel or automatic nonverbal-effect classifier. Dialogue was kept out of the narration windows; brief effect masking remains less certain than the speech timing. Descriptive coverage is intentionally selective, leaving the campsite conversation to the original dialogue.
