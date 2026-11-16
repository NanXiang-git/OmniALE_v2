# Birds V5 — exact source filtering, retained compatibility limitation

Sol reran the six-clip autonomous narration task using Codex / gpt-6.1-sol / high in a fresh environment with a 60-minute cap. XC238544 and known Flickr source 7245581374 were precisely filtered while independent reference recordings remained available. V4's original score and answer are retained with a confirmed source-exposure notice.

| Score | Body B | Quality Q | Correct | Minutes |
|---:|---:|---:|---:|---:|
| 24.975 | 33.3333333333 | 0.74925 | 2/6 | 47.6864 |

The score is B × Q; an incorrect species zeros that chapter's body score. All delivery gates passed, but the score is below the task's 80-point passing threshold. Original judgments remain available; one identical-input retry resolved previously null fields only.

This run had an early speech WebSocket proxy compatibility problem. Sol independently recovered using websocket-client and speech.platform.bing.com, generating its own XiaoxiaoNeural narration. No voice helper or package recommendation was supplied. V6 repairs the proxy compatibility and reruns Sol independently; V5 remains preserved, not replaced.

Two downloaded reference recordings were compared against all six input chapters, without a detected waveform overlap. No known-source filter hit occurred in this run. Unknown derivatives, transformed audio, short excerpts and opaque infrastructure traffic are outside the audit's guarantee.

[Integrated dashboard](case_dashboard/dist/index.html#packages) · [V5 report and evidence](case_dashboard/dist/birds-v5-report/reports/index.html) · [V6 rerun](case_dashboard/dist/birds-v6-report/reports/index.html)

Original media are in GitHub Releases with SHA256 manifests; website videos are compressed browsing previews only. Structural dashboard tests and media decoding passed. Real browser playback has not been verified.
