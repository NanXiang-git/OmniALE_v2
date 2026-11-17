# Birds V6 — Luna under the Sol configuration

GPT-6 Luna ran once in a fresh Codex environment with high reasoning and a new 3,600-second cap. The six input clips, task, runtime prompt, scorer, generic Python packages, source filter and speech compatibility repair match V6 Sol. The model identifier and user-supplied Luna credential differ. Runs occurred at different times, so service availability and latency are not controlled.

| Model | Score | Body B | Effective Q | Scored recognition | Text labels correct | Minutes |
|---|---:|---:|---:|---:|---:|---:|
| GPT-6.1 Sol | 39.348 | 49.533333 | 0.794375 | 3/6 | 3/6 | 43.28 |
| GPT-6 Luna | 0 | 0 | 0 | 0/6 | 1/6 | 60.01 |

Luna's zero score must not be read as six incorrect written labels. Its sixth written label, Phoebastria immutabilis, matches the frozen truth. However, the audio judge found no intelligible Mandarin narration in any delivered chapter. The unchanged scorer applies its existing no-Mandarin rule, reducing effective Q from the raw weighted 0.27 to 0. The audiovisual species criteria also received I=0. Original audio, blind transcripts, reasons, judgments and a separate text-label comparison are available for human review; no answer or score was changed.

Luna independently attempted online TTS, installed edge-tts, and ultimately used the existing system eSpeak NG 1.51 / cmn command in its own voice_and_mix.py. The delivered voice is not XiaoxiaoNeural. Sol and Luna could both access the system speech executable; neither received a prepared TTS helper or a required voice. Network speech attempts and fallback decisions are retained in tool records.

The hard deadline stopped the solver at 3,600.858 seconds, within the existing five-second shutdown tolerance, and sealed nine files including final.mp4, narration.wav, subtitles.srt and segments.json. The video decodes and the other delivery gates pass. Two provider concurrency errors occurred during the run; a third API transport error coincided with deadline teardown. These service effects are recorded, not compensated with extra time.

All 544 frozen files and nine answer hashes passed integrity checks. The source audit found eight responses approved for return, no known source delivered and no inspected reference-audio downloads to compare. Known-source blocking passed preflight controls. Unknown derivatives, transformed or short excerpts, images and encrypted infrastructure traffic remain outside the audit guarantee.

The host acceptance checker initially omitted the scorer's global quality override when checking arithmetic. Its report was preserved, and the checker was corrected to validate the already-existing rule. The frozen evaluator, reviewed score and submitted files remain unchanged. Integrity acceptance now passes; task passing does not.

[Integrated V6 comparison](case_dashboard/dist/index.html#packages) · [Luna report](case_dashboard/dist/birds-v6-luna-report/reports/index.html) · [Luna tool calls](case_dashboard/dist/birds-v6-luna-report/reports/index.html#tools) · [Luna network trace](case_dashboard/dist/birds-v6-luna-report/reports/index.html#network) · [Sol report](case_dashboard/dist/birds-v6-report/reports/index.html)

The existing V6 task card now contains both results; all 18 task packages and previous results remain available. Original large files are stored in Releases with SHA256 manifests. Compressed website videos are browsing previews only. DOM interaction, local link, media decode and publication checks are automated; real browser playback is not claimed verified.
