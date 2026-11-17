# Birds V6: Luna xhigh without a total time cap

GPT-6 Luna independently completed the six-video bird narration task with Codex and xhigh reasoning, without a total wall-clock deadline. The prior high / 60-minute Sol and Luna runs remain unchanged. The new run changes both reasoning effort and time policy, so it is not a same-condition comparison.

| Run | Effort | Total cap | Actual minutes | Score | Audiovisual recognition |
|---|---|---|---:|---:|---:|
| GPT-6.1 Sol, retained | high | 60 minutes | 43.28 | 39.348 | 3/6 |
| GPT-6 Luna, retained | high | 60 minutes | 60.01 | 0 | 0/6 |
| GPT-6 Luna, new | xhigh | none | 104.70 | 10.7291 | 1/6 |

New result: B = 15.6666666667, Q = 0.6848333333, S = B × Q. Chapter 6, Laysan Albatross, was correct. Written scientific-name labels also matched 1/6. All delivery gates passed; the score is below the unchanged 80-point task pass threshold. Unlike timed Luna, this run delivered intelligible Mandarin in all six chapters.

The solver installed edge-tts 7.3.1 and selected zh-CN-XiaoxiaoNeural in its own Python implementation. No TTS helper or mandated voice was supplied. The sealed answer includes its implementation, dependency notes, research log, final video, narration and subtitles. Nine sealed files and 544 frozen files passed integrity checks.

All 97 formal model requests used xhigh; completed responses identified gpt-6-luna and xhigh. Three provider concurrency failures consumed approximately 366 seconds and remain in the trace. The solver exited normally; no timeout kill or extra formal attempt occurred. A PyPI TLS failure during generic preflight and its successful unchanged-environment retry are retained. A postprocessing observer age check exited while the independent scorer continued; only the observer was corrected and restarted. Answers, frozen scorer and scores were unchanged.

Known XC238544 and Flickr source material remained blocked. Post-run inspection found no known-source hits and no inspected reference-audio downloads in this run. This does not rule out all unknown derivatives or content on encrypted infrastructure passthrough connections. Approved proxy responses alone do not prove the solver read every byte.

- [Integrated dashboard](case_dashboard/dist/index.html#packages)
- [New task, result and score details](case_dashboard/dist/birds-v6-luna-xhigh-report/reports/index.html)
- [Tool calls](case_dashboard/dist/birds-v6-luna-xhigh-report/reports/index.html#tools)
- [Network trajectory](case_dashboard/dist/birds-v6-luna-xhigh-report/reports/index.html#network)
- [Reference URL inventory](case_dashboard/dist/birds-v6-luna-xhigh-report/reports/reference_inventory.html)
- [Configuration and three-run results](case_dashboard/dist/birds-v6-luna-xhigh-report/comparison.json)
- [Original asset hashes and download locations](case_dashboard/dist/birds-v6-luna-xhigh-report/publication-manifest.json)

Validation covers media decoding, frozen/sealed hashes, score formula checks, dashboard DOM interactions and links. Hosted videos are compressed browsing previews; original assets remain in Releases. No human browser playback claim is made.
