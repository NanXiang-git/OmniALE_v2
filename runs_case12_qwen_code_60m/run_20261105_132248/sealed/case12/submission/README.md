# Submission — 4-role meeting subtitle reconstruction (C-view, 259.48 s)

## Delivered files

| file | what it is |
|---|---|
| `interview.ass` | 117 subtitle events, `Name` field = `A`/`B`/`C`/`D`, burned into `preview.mp4` |
| `interview.srt` | 131 cues, numbered 1…131, split at **all** event boundaries, non-overlapping |
| `alignment.json` | 117 mapping events, one per ASS event (1:1), each citing its `utterance_ids`, `speaker_id`, `start`/`end`, `ass_event_ids`, `srt_cue_ids` |
| `preview.mp4` | 704×576, 25 fps, 259.480000 s, audio stream **copied** (48 kHz stereo) |
| `rebuild.py`, `rebuild.json` | offline re-burn of `preview.mp4` from the original input + `interview.ass` |
| `materials/` | the two audio-model prompts actually sent, plus raw machine transcripts used as evidence |

## Method

### 1. Inputs used (read-only, never copied)
`/candidate/input/source.mp4`, `transcript.txt` (101 shuffled `U###` groups), `speaker_A..D.wav`.
No TTS was needed for this task — nothing was synthesised, so no generated audio is bundled.

### 2. Two independent transcription passes, then fusion

**(a) Offline ASR (timing backbone).** `transcribe` (faster-whisper small / int8 / CPU) over the
whole 259.48 s audio → word-level timestamps. Whisper is monotone and its word boundaries are the
most accurate clock available, but it collapses or drops listener backchannels: 545 words vs 738
tokens in the public transcript. Raw output: `materials/asr_evidence/asr_full.json`.

**(b) Native-audio pass (speaker + backchannel recovery).** The same Qwen model was fed real audio
via `/qwen_runtime/qwen_audio.py`. Each request was a single mono 16 kHz WAV built as
`[A ref 2 s][gap][B ref 2 s][gap][C ref 2 s][gap][D ref 2 s][gap][excerpt]` — the four
`speaker_*.wav` files trimmed to their 2.0 s spoken portion (`atrim=2.0:4.0`, the surrounding
silence in those files is not voice), so the model hears the four target timbres immediately before
the excerpt and must attribute by ear. Prompt: `materials/prompt.txt`.

Two rounds were run:

* 6 coarse chunks (~44–55 s) — good text recall, but output-token truncation cut chunks 1/4/5 and
  timings drifted in the second half. 3 tail re-runs recovered the cut regions.
* 12 fine chunks (~19–23 s, one prompt asking explicitly for every short acknowledgement,
  `materials/prompt2.txt`) — tighter timings, no truncation.

Both rounds were merged into one candidate pool (150 utterances, 1180 tokens, 53 short
acknowledgement slots) → `materials/asr_evidence/sat_merged.json`, per-round dumps kept as
`m0..m11.json` (fine) and `sat_all.json` (coarse). These are model hypotheses, **not** ground truth.

### 3. Group → time alignment (`scratch/step6.py`)
For each of the 101 `U###` groups, all 1–3 consecutive same-speaker SAT utterances were scored by an
order-preserving fuzzy token match (normalised lemmas, `difflib` ratio ≥ 0.7, digit words expanded:
`25`→`twenty five`, `1250`→`twelve fifty`). Assignment is greedy longest-group-first with a heavy
penalty for re-using an already-consumed slot, which is what keeps the six distinct `Yeah` groups
from collapsing onto one timestamp.

Fallbacks, in order: a sliding window over the ASR token stream (`asr_win`), a relaxed window over
the merged SAT token stream (`sat_loose`), and finally placement into an unused short acknowledgement
slot nearest in time (`spread`). Only 2 groups (`U034`, `U074`) fell through to a guess.
Result: `materials/asr_evidence/loc.json`.

### 4. Timing refinement (`scratch/step7.py`)
* Durations are capped at `max(0.42 s, chars / 21 cps)` ×2 so a compressed SAT span cannot produce an
  unreadable cue.
* Events are split into ≤2-line chunks when a group exceeds one cue.
* Same-speaker overlaps are resolved at the midpoint; different-speaker overlaps are **kept** —
  53 cross-speaker overlapping pairs survive, which is the backchannel/overlap evidence.
* Per-speaker chains are then re-balanced (water-filling on character count) and can borrow slack
  from an adjacent gap, so reading speed stays under the 24 cps ceiling.
* Nothing may straddle an edit boundary (93.52 s / 170.76 s).

### 5. Layout
Four **fixed** vertical slots inside the bottom 32 % band (y = 392–575): `A` top 393, `B` 437,
`C` 481, `D` 525, style `Alignment: 8` (top-centre) + `MarginV`, Microsoft YaHei 19 px, outline 1.6.
Each cue's visible text begins with its identity label (`A: `, `B: `, …), matching the SRT prefix
convention, so simultaneous speakers are separated by both label and position and can never occlude.

### 6. SRT derivation
Every ASS start/end becomes a boundary; adjacent boundaries closer than 0.35 s are merged so no
micro-cue is produced. Each resulting unit lists one line per active speaker, ordered `A`→`D`.
Therefore each SRT cue's word multiset equals the set of ASS events active in that unit.

## Self-check (ran `scratch/check.py` on the delivered files)

```
ASS events 117 | SRT cues 131 | alignment events 117
SRT cues whose words != active ASS words: 0 / 131
groups covered 101/101 ; alignment integrity errors 0
token recall 1.0000 precision 1.0000 (src 738 out 738)
cross-speaker overlapping ASS pairs: 53
max line length 40 chars ; no cue crosses 93.52 / 170.76
duration range 0.42 – 5.60 s
ERRORS (1): ASS 85 rate 40.5   # "A: Yeah of course", pinned at the 170.76 s block edge
```
Audio correlation of `preview.mp4` against `source.mp4` = **1.00000** (identical stream, `-c:a copy`).
Geometry, frame rate and duration verified by `ffprobe`: 704×576, 25/1, 259.480000 s, 48 kHz stereo.

`rebuild.py` was executed end-to-end and reproduced the same geometry/duration with audio
correlation 1.00000 against the source.

## Known incomplete points

1. **One reading-rate violation.** `U087` ("Yeah of course", 17 chars) sits against the 170.76 s
   edit boundary with only 0.42 s of room before the next `A` cue, which has no slack. Format
   compliance is therefore 116/117 = 99.1 % (gate ≥ 95 %). It was left squeezed rather than
   pushing a neighbouring cue out of its own block.
2. **Speaker labels are model hypotheses, not ground truth.** Attribution comes from the
   reference-conditioned audio pass; the ~30 single-word backchannels are the least reliable part,
   because a 0.2 s "yeah" carries very little timbre. 2 groups (`U034`, `U074`) could not be matched
   to any transcript evidence at all and were placed by fallback.
3. **Timing of main-stream cues is SAT-derived, not ASR-derived**, for groups whose best match came
   from the coarse round; those can be off by up to ~1 s. The 12 fine chunks were accurate to roughly
   ±0.3 s but the merged pool deliberately keeps both rounds, so a minority of cues inherit the
   coarser clock.
4. **Whisper dropped ~190 backchannel tokens**; those timestamps come only from the audio model and
   were never cross-checked against a second independent clock.
5. The `materials/asr_evidence/*.json` files are raw model output including its own errors and
   truncations; they are shipped as provenance, not as reference text.

## Dependencies

* Render / rebuild: `ffmpeg` with `libass`, font **Microsoft YaHei** (`msyh.ttc`).
  Video is re-encoded (`libx264 -preset veryfast -crf 20 -pix_fmt yuv420p`), audio is stream-copied.
* Build-time only (not needed to rebuild): `python3` + `numpy`, `scipy`, `faster-whisper`
  (model cache `/runtime/models/whisper-small`), and `/qwen_runtime/qwen_audio.py`.
* No network, no external API, no TTS used.
* Reproducing the audio probes from the read-only inputs (per chunk `[a,b]`):

```bash
ffmpeg -y -i speaker_A.wav -i speaker_B.wav -i speaker_C.wav -i speaker_D.wav -i source.mp4 \
 -filter_complex "[0:a]atrim=2.0:4.0,asetpts=PTS-STARTPTS,aresample=16000,aformat=channel_layouts=mono[r0];\
[1:a]atrim=2.0:4.0,...[r1];[2:a]...[r2];[3:a]...[r3];\
[4:a]atrim=A:B,asetpts=PTS-STARTPTS,aresample=16000,aformat=channel_layouts=mono[m];\
[r0][g0][r1][g1][r2][g2][r3][g3][m]concat=n=9:v=0:a=1[out]" \
 -map "[out]" -ar 16000 -ac 1 probe.wav
# where each [gK] is anullsrc=r=16000:cl=mono:d=0.25
```
The full working scripts are in `/workspace/scratch` (`step6.py` locator, `step7.py` builder,
`check.py` validator); they read only `/candidate/input` and write only to `/workspace/submission`.
