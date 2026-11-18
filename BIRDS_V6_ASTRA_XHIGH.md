# Birds V6: GPT-6 Astra, xhigh, unlimited duration

GPT-6 Astra completed the task independently under the same configured conditions as Luna xhigh: identical task, prompt, six-video input, frozen scorer, generic software, network proxy and blacklist, with no total time cap. The model and actual service timing differ. The user explicitly selected `gpt-6-astra` after both existing credentials rejected `gpt-6.2-astra`; those access checks are retained and are not formal benchmark attempts.

| Run | Effort | Total cap | Actual minutes | Score | Audiovisual recognition |
|---|---|---|---:|---:|---:|
| GPT-6 Astra, new | xhigh | none | 39.46 | 24.8514 | 2/6 |
| GPT-6 Luna, retained | xhigh | none | 104.70 | 10.7291 | 1/6 |
| GPT-6.1 Sol, retained | high | 60 minutes | 43.28 | 39.348 | 3/6 |
| GPT-6 Luna, retained | high | 60 minutes | 60.01 | 0 | 0/6 |

The high / 60-minute rows are historical results with different conditions. A single run does not establish a general model ranking.

Astra: B = 33.3333333333, Q = 0.7455416667, S = 24.8514. Chapters 5 and 6 were correct, matching Black-footed and Laysan Albatross. Written scientific names also matched 2/6. All six delivery gates passed, but the score remained below the unchanged 80-point pass threshold. Mean quality groups were H = 0.65625, A = 0.9333333333 and D = 0.995.

The solver installed edge-tts 7.3.1, selected zh-CN-XiaoxiaoNeural and wrote its own synthesis, rendering, research and verification scripts. No helper or voice choice was supplied by the host. The run ended normally after 2367.377874 seconds; 59 formal model requests had no recorded API failures. Requested and returned model/effort were verified. Twenty submitted files and 544 frozen files passed integrity checks. The report includes 133 operation records and 65 recorded URLs.

Source checks inspected 55 approved responses, including six media responses representing five unique reference recordings. Comparisons against all six input chapters found no waveform overlap meeting the detection threshold; no known forbidden source was delivered. Unknown derivatives, strong transformations, short excerpts and encrypted infrastructure remain outside a complete exclusion guarantee. Proxy approval alone does not prove the solver read every byte.

- [Integrated dashboard](case_dashboard/dist/index.html#packages)
- [Astra task, result and score details](case_dashboard/dist/birds-v6-astra-xhigh-report/reports/index.html)
- [Tool calls](case_dashboard/dist/birds-v6-astra-xhigh-report/reports/index.html#tools)
- [Network trajectory](case_dashboard/dist/birds-v6-astra-xhigh-report/reports/index.html#network)
- [Reference URL inventory](case_dashboard/dist/birds-v6-astra-xhigh-report/reports/reference_inventory.html)
- [Model choice and failed 6.2 access preflight](case_dashboard/dist/birds-v6-astra-xhigh-report/reports/model_selection.json)
- [Configuration and four-run comparison](case_dashboard/dist/birds-v6-astra-xhigh-report/comparison.json)
- [Original asset hashes and downloads](case_dashboard/dist/birds-v6-astra-xhigh-report/publication-manifest.json)

Validation includes media decoding, unchanged frozen/sealed hashes, independent formula checks, dashboard DOM interactions and links. Hosted videos are compressed browsing previews; Releases preserve original assets. Human browser playback is not claimed.
