# Case 13 deliverables

Built offline from `/candidate/input/source.mp4`, `original.wav`, and the supplied aligned M&E. TTS was generated with `/candidate/tools/tts.py` (local Microsoft System.Speech compatibility voices V01/V02/V03/V05); generated event WAVs are bundled under `audio/`, so rebuild does not call TTS or a network service. These are generic system voices, not actor clones; source actor identity matching is not claimed. English was obtained with the provided `transcribe` command using faster-whisper small/int8/CPU. I do not have native audio perception: transcript and visual inspection were used, without claiming a listening-based actor or performance match. The local ASR output contained omissions and a long false segment, so transcript/event coverage is incomplete and uncertain.

Run `python3 {submission}/rebuild.py {input} {submission} {output}`. It uses NumPy and soundfile plus FFmpeg; `{input}` may be the candidate input directory or `source.mp4`. It recreates compressed/limited role stems, effects, cinema mix, mobile mix, bilingual SRT/ASS, and burned-in video. The bundled audio is authoritative, so the voice proxy is not needed for rebuild.

Original source: *Tears of Steel* (Blender Foundation / Mango Open Movie Project, 2012); attribution and asset-specific license notes are in `/candidate/CREDITS.md`.

Final `ebur128=peak=true` checks: `mix.wav` -17.5 LUFS / -2.0 dBTP; `mobile_mix.wav` -19.6 LUFS / -1.9 dBTP; video AAC -17.5 LUFS / -2.0 dBTP. Mobile true peak is 0.1 dB above the stated ceiling and mobile loudness is 0.6 LU below range; cinema and video loudness are 0.5 LU below range. The ASR transcript is incomplete, and role attribution/actor likeness cannot be claimed from the available transcription and visual inspection.
