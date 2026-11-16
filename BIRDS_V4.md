# Birds V4 — autonomous narration

Six-clip Chinese science-video task. Both models used Codex/high, independent fresh environments and a 60-minute cap. No preset TTS package, helper script, provider or voice was supplied. Model-authored narration was synthesized through independently selected edge-tts / zh-CN-XiaoxiaoNeural.

| Model | Score | Body B | Quality Q | Correct | Minutes |
|---|---:|---:|---:|---:|---:|
| gpt-6.1-sol | 63.2175 | 80.866667 | 0.78175 | 5/6 | 47.89 |
| gpt-6-luna | 0.0000 | 0 | 0.71975 | 0/6 | 40.84 |

The frozen scoring rule is S=B×Q; wrong species makes that chapter's body score zero. Both scores are below 80. Original judgments are retained. Previously null visual sub-scores received one retry using the exact same prompt and media; decided sub-scores were not replaced.

[Integrated dashboard](case_dashboard/dist/index.html#packages) · [V4 report](case_dashboard/dist/birds-v4-report/reports/index.html) · [Tool calls](case_dashboard/dist/birds-v4-report/reports/index.html#tools)

Reports include sealed submissions, audio, subtitle samples, per-chapter judgments, autonomous voice implementation evidence, model API records and generic proxy trajectory. Known blacklist domains had no successful connections. HTTPS paths and bodies remain encrypted; domain connection is not proof of reading a cited page. Host post-run reference checks are explicitly separate. Unknown derivative sources cannot be fully excluded.

Qwen3.8-omni-flash evaluated actual audio via the DashScope compatible endpoint, verified by an audio challenge. Automated judgments can contain perceptual and timestamp errors; reports retain original reasons for inspection. Browser playback is not claimed verified.

Original media are stored in GitHub Releases with SHA256 checksums. Compressed website videos are browsing previews only and must not be used to rescore. V3 preset-voice history and the other 15 packages are preserved.
