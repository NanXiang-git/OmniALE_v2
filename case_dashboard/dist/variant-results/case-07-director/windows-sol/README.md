# Case07 audio-directed Resolve handoff

Contract version: `case3-resolve-green-v3.1-draft` (draft contract; completed native Windows deliverable). Resolve Free 21.1.2.10, NVIDIA RTX4060 Laptop; API-only native RunScript route through the supplied `/runtime/resolve_rpc.py`.

The director audio selects **right in clip 1** and **left in clip 2**. `cue_decisions.json` records the recognized words, confidence, and identity-image correspondence. The original illustrative identity choices were not used.

## Delivery timelines and renders

| Clip | Native delivery timeline | Output | Native job ID |
|---|---|---|---|
| clip_1 | DELIVERY_1_Keep_Right | output_1.mp4 | 94176bbd-ad7c-4574-a47f-9607d10a47a8 |
| clip_2 | DELIVERY_2_Keep_Left | output_2.mp4 | 991dfbf3-6658-4b83-b6fc-7982b23409f4 |

Both delivery timelines start at 00:00:00:00 and end at frame 100 exclusive: 512×288, 25 fps, 100 frames. Source frame n maps to output frame n, time n/25 seconds. Each has V1 `green_prores.mov` and V2 `foreground_1_prores.mov` or `foreground_2_prores.mov`, normal composite, 100% opacity, zoom 1, pan/tilt 0, no crops, no audio. Final MP4s were rendered in Resolve with inclusive marks 0–99. The only extra stream is Resolve's permitted `tmcd` metadata.

`project.drp` was saved/exported after both final render jobs reported Complete. The project also contains two obsolete diagnostic timelines named `Clip_1_Keep_Right` and `Clip_2_Keep_Left`. They tested PNG-in-QuickTime decoding, which produced black background/corrupt edges in Resolve. **Use the DELIVERY timelines above.** The frozen bridge has no deletion endpoint, so these diagnostic timelines and their source dependencies are retained. They are not the final render sources. The fresh rebuild script creates only the two delivery timelines.

## Open and relink

1. In Resolve's Project Manager, import `project.drp` as a separate project. Use the same Resolve version where available.
2. If media is offline, select the Media Pool clips and use **Relink Selected Clips** or **Change Source Folder** to point the old submission root to this delivery folder. The original native root was `D:\omniALE\case07_director_windows\solver\case3\submission`; the bridge view was `/workspace/submission`.
3. Relink active media to `assets/foreground_1_prores.mov`, `assets/foreground_2_prores.mov`, and `assets/green_prores.mov`. All are 25 fps, exactly 100 frames. Preserve foreground **Alpha mode: Straight**, **Data Level: Video**, **Input Color Space: sRGB**. Preserve the green media's Video level and sRGB input.
4. To keep every Media Pool entry online, also relink the three legacy `assets/foreground_1.mov`, `foreground_2.mov`, `green.mov` files and the sequences in `assets/foreground_1/`, `foreground_2/`, `green/`. Sequence names are duplicated across directories, so retain the directory structure. These PNG sequences are the intermediate source for encoding the active ProRes media; the MOVs without `_prores` are diagnostic dependencies only.
5. Open each DELIVERY timeline and render marks 0–99 at 512×288, 25 fps, MP4/H.264, no audio. Do not use the diagnostic timelines or their jobs.

No original task-package file is required to reopen/render the active compositions: their complete dependencies are in `assets/`. Recomputing the mattes requires the original `/candidate/input/clip_1/0000.png` through `0099.png`, corresponding clip_2 PNGs, and green.png. The original recordings and identity JPGs remain in the task package and are used as decision evidence, not timeline audio.

For an editability check in a copy of the project, disable V1 or replace it with a different solid color. The background and transparent gaps change independently of V2; V2 is an alpha foreground, not a baked green video. Sixteen-bit RGBA PNGs also allow replacing/refining individual matte frames.

## Method and color

The background is stable and the people are spatially separate. A separable background plate was estimated from unobstructed public source pixels. Color difference within the audio-selected person's region defined a narrow trimap. A 3×3 closed-form matting Laplacian was solved in linear RGB, with physically possible alpha bounds. The old background contribution was removed from edge RGB in linear light. Subject RGB, gestures, coordinates and frame order were retained; no learned segmentation model was used.

`assets/foreground_N/*.png` stores unassociated sRGB color plus 16-bit linear coverage alpha. Zero-alpha pixels have zero RGB. These were encoded to 25 fps ProRes 4444 with straight alpha, BT.709 YUV matrix and video range. ProRes supports alpha while keeping media frame rate explicit. The 24 fps default import interpretation of the intermediate PNG sequences is irrelevant to the active delivery timelines, which use the 25 fps ProRes files exclusively.

Project settings are custom DaVinci YRGB Color Managed v2, combined spaces (`separateColorSpaceAndGamma=0`), sRGB input/output, ACEScg timeline, no input/output DRT or gamut mapping, and Linear resizing gamma. The separate gamma-setting probes were unsupported; the final accepted combined color-space settings are recorded in native receipts. Full-resolution assets need no resizing.

Native H.264 output is 8-bit 4:2:0, Video range, SMPTE170M matrix, BT.709 primaries and sRGB transfer tag. Compression/chroma filtering and estimated matting affect soft edges. The decoded distant green measures approximately RGB(0,252,0), rather than exact (0,255,0); background/soft-edge errors are reported diagnostically under this contract. Exact reference-linear blending after the complete Resolve/codec path is not asserted. `evidence/compositing_diagnostic.json` compares a decoded sample with local mathematical composites; it is not a hidden-reference score.

## Scripts, dependencies and verification

- `scripts/generate_assets.py`: exact matting implementation used, with portable input/assets arguments. Requires Python, NumPy, SciPy and OpenCV.
- `scripts/encode_assets.py`: reproduce ProRes intermediates from PNGs; `--include-legacy` also reconstructs diagnostic MOV dependencies. Existing files are not overwritten automatically.
- `scripts/rebuild_project.py`: construct only the two delivery timelines in a **fresh assigned bridge project**, render final MP4s natively, then export a DRP. Requires the supplied runtime bridge and a fresh output directory under the bridge's allowed submission location. Do not run it inside the delivered project.
- `scripts/session/`: actual native construction/recovery/render scripts used for this session. These depend on recorded state/IDs; use the portable rebuild script for a new project.
- `scripts/verify_delivery.py`: read-only schema checks, real decoding, timestamp/stream checks, source frame-lag checks, distant distractor-region checks, DRP archive integrity and hashes. It writes `verification.json` and ffprobe evidence. Review-frame images go to `/workspace/scratch`.
- `dependencies.json` and `checksums.sha256`: included dependency inventory and file hashes. `submission.schema.json`, `report.schema.json` are the supplied schemas; `cue_decisions.schema.json` documents the additional audio-decision file.

Validation covers all 200 decoded output frames, CFR timing, stream types, frame alignment, and absence of the other person in their distant region. Endpoint/gesture frames were visually reviewed. Native receipts record actual render job status, export and editable timeline structure. This is not an independent semantic judgment or quality score. The frozen API has no project import/reopen endpoint, so independent DRP import/relink/rerender remains an evaluator step; its tolerance has not been calibrated here.

Documentation actually consulted: supplied `API_RUNTIME.md` / `TOOL_PROTOCOL.md` operation table (project settings, import_media/media_properties, create_timeline/append/item_properties, render/render_status, export_project/inspect), `TASK.md`, `WINDOWS_RUN.md`, `OUTPUT_CONTRACT.md`, `PROJECT_HANDOFF.md` and supplied schemas. Application example: media properties set straight alpha before native normal composition; native AppendToTimeline receipts confirm 100-frame, time-zero layers. The corresponding official API areas are ProjectManager/Project, MediaPool, MediaPoolItem and TimelineItem. The official manual/API reference itself was not supplied and no network was used, so no claim is made to having consulted an unavailable official chapter.
