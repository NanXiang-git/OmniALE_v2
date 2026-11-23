# Cosmos Laundromat Mandarin Dub

This directory contains a 79-second Mandarin dub and a deterministic offline rebuild. The source dialogue was transcribed locally with faster-whisper. Both Mandarin voices use F5-TTS v1 Base/Vocos voice cloning, conditioned on short clean excerpts of the supplied original character dialogue after subtracting the aligned M&E stem. The inference helper computes F5 classifier-free guidance sequentially to fit the local CPU memory limit; it does not use the supplied generic Piper voice.

## Rebuild

Requirements: Linux, ffmpeg/ffprobe with libass and libx264, Python with NumPy, SciPy, SoundFile, PyTorch, torchaudio and safetensors, and the provided offline F5-TTS/Vocos files under `/benchmark/f5`. No network access is used.

Run:

```sh
python3 rebuild.py --input /candidate/input --submission /workspace/submission --output /workspace/submission/dub_zh.mp4 --work-dir /workspace/scratch
```

The rebuild synthesizes each Mandarin turn, lays it into a separate full-length role track, applies the global effects gain and declared mobile downmix chain, writes the audit/subtitle files, and burns the bilingual ASS into the source picture. TTS seeds, event timings, source references, mix gains and subtitle text are fixed in the script.

## Source and voice provenance

Picture, original audio and dialogue-free M&E derive from *Cosmos Laundromat: First Cycle*, Blender Foundation / Blender Studio, CC BY 4.0. Mandarin voice references are taken only from the supplied excerpt; `voice_provenance.json` records their source intervals. The generated voices are F5-TTS clones conditioned on those references, not independently verified human identity matches.
