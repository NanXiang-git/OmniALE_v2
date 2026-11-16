# Birds V6 — speech compatibility repair and fresh Sol rerun

V6 repairs WebSocket forwarding for api.msedgeservices.com and reruns Sol in a fresh environment, preserving V5's exact task, six-clip input, scorer and same-source filtering. The repaired transport passed a real speech-generation and decode preflight. Codex / gpt-6.1-sol / high had a new 60-minute cap. No prior answer, TTS helper, provider or voice recommendation was supplied.

| Score | Body B | Quality Q | Correct | Minutes |
|---:|---:|---:|---:|---:|
| 39.348 | 49.5333333333 | 0.794375 | 3/6 | 43.2781 |

Chapters 3, 5 and 6 were correctly identified. Sol chose edge-tts and zh-CN-XiaoxiaoNeural, wrote its own narration code, and completed normally within the deadline. All delivery gates passed; the score remains below 80. Integrity acceptance is separate from task passing.

All 544 frozen files and 70 sealed answer files passed integrity checks. After normal solver exit, a missing host-side sealed parent directory interrupted archival. The host recovered by verifying hashes before and after moving the unchanged submission, then ran the original scorer. No solver restart or answer edits occurred; the incident is recorded in the report.

The source audit covered 98 responses approved for return. Eleven distinct reference recordings were compared with all six input chapters; none crossed the waveform-match threshold. No XC238544/known-source block was triggered during this run. Preflight controls independently verified blocking. Approval logs are not proof that the client received or read a full response. Unknown mirrors, sub-two-second excerpts, strong transformations and opaque infrastructure traffic remain outside the guarantee.

Scoring remains S=B×Q. Qwen3.8-omni-flash judged actual audio through DashScope's compatible endpoint after an audio challenge. Original judgments and per-chapter evidence are retained. The V4 contaminated result and V5 compatibility-affected run remain visible; differences are not a controlled estimate of one URL's causal effect.

[Integrated dashboard](case_dashboard/dist/index.html#packages) · [V6 report](case_dashboard/dist/birds-v6-report/reports/index.html) · [Tool calls](case_dashboard/dist/birds-v6-report/reports/index.html#tools) · [Network trajectory](case_dashboard/dist/birds-v6-report/reports/index.html#network)

The dashboard includes task, videos, score components, identification evidence, references, network traces, tool calls, voice implementation and recovery records. Originals retain their SHA256 hashes in Releases; compressed website previews must not be used for rescoring. Structural interaction tests and media decoding passed. Real browser playback was not verified because Computer Use could not establish the current browser URL for policy enforcement and stopped UI operations.
