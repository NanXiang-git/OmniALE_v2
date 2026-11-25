# Offline Mandarin dub delivery

The submitted picture is rebuilt from `input/source.mp4`, `input/music_effects.wav`, the event plan, and the subtitle files. `rebuild.json` provides the argv template; replace `{python}`, `{input}`, `{submission}`, and `{output}` with local paths. For this package the interpreter is `python3`, the input directory is `/candidate/input`, and the submission directory is `/workspace/submission`.

The rebuild uses FFmpeg/FFprobe, Python with NumPy, SciPy, and SoundFile, and the supplied Piper package/model at `/benchmark/piper` and `/benchmark/voices/zh_CN-huayan-medium.onnx`. It runs offline and writes the newly encoded video to the requested output path. The original frame sequence remains at 1024x576, 25 fps, and 720 seconds. Speech is synthesized once per event, placed in full-length character stems, processed with stable pitch/EQ profiles, and summed with the single-gain M&E track. Mobile audio follows the declared mono pan, global gain, and limiter chain.

Voice provenance is stated in `voice_provenance.json`: the Mandarin tracks use Piper TTS with per-character processing, not source-voice cloning. The local F5-TTS voice cloning model was available but a two-second CPU inference took about 126 seconds, so it was not used for the full program. The four output profiles distinguish roles but do not claim to reproduce the original actors' identities or timbres.

The Swedish transcript was drafted from two offline faster-whisper passes over the supplied source and M&E residual, then corrected where the audio and challenge brief made the meaning clear. Several masked Swedish phrases remain uncertain and are described as such in the event notes. No external retrieval or source references were used.

Very short source reactions such as the “no” at 147.60 and the “now” at 597.98 retain sub-0.4-second subtitle cues because the source utterances themselves are that short.

Source: *Nasty Old People* (2009), directed by Hanna Sköld, Tangram Film. Supplied excerpt and derived M&E are licensed CC BY-NC-SA 2.5 Sweden; see `/candidate/CREDITS.md` for attribution and license details. The bundled Piper voice model and local tool dependencies are provided by the benchmark runtime.
