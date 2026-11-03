# Case3 / source case 07

Contract: `case3-resolve-green-v3.1-draft`. Built with DaVinci Resolve **Free 21.1.2.10**, Windows, through the supplied native RunScript RPC API. No GUI, network downloads, pretrained models, Fusion node editor, or externally composited green-background movie was used.

## Deliveries

Project name: `Case3_API_20261103_1850`.

| Output | Delivery timeline | Native render job ID |
|---|---|---|
| `output_1.mp4` | `Delivery_1_Woman` | `ba9b9863-7094-4304-b966-0b4f9cd934f7` |
| `output_2.mp4` | `Delivery_2_Adult_Child` | `ff0a4e44-5b32-4188-9a4e-f6b18bf87cf5` |

Both deliveries use timeline frames **0–99 inclusive**, 512×288, 25 fps, 100 decoded frames, 4 seconds. Input PNG frame n corresponds to output frame n. Render this marked range, not the entire timeline: the native still-image append gives the green background a 125-frame duration. There is no audio. Resolve's `tmcd` data track is retained as permitted by the contract.

The project also contains **one diagnostic timeline**, `Clip_1_Woman_Green`. It tests PNG sequence import, which Resolve interpreted at 24 fps. It is not a delivery timeline. The frozen API has no timeline deletion operation and its overlapping append did not replace that clip, so this diagnostic timeline is retained and fully relinkable. Only the two timelines in the table are delivery renders.

## Open and relink

1. Import `project.drp` into Resolve 21.1.2.10, preferably as a separate project. Independent project import/reopening was not exposed by the pilot API, so that independent audit has not been run here.
2. Relink the two **Animation / qtrle RGBA** clips by basename to this submission's `assets/foreground_1.mov` and `assets/foreground_2.mov`. They contain straight alpha, 25 fps, exactly 100 frames, with no green compositing baked into their RGB.
3. Relink `green.png` to the public `/candidate/input/green.png`. The original Windows paths contain `.../candidate/input/green.png` and `.../submission/assets/`; map these roots to the corresponding local candidate and submission directories.
4. For the optional diagnostic timeline, relink `[0000-0099].png` to `assets/foreground_1/0000.png` through `0099.png`. Do not substitute this sequence for either delivery movie.
5. Check the media attributes below, select a delivery timeline, set In=0 and Out=99, then render H.264 MP4, 512×288, 25 fps, no audio. Keep native output range at Video/Auto, as in the recorded render settings.

Each delivery has a separate **green PNG on V1** and **straight-alpha foreground on V2**, normal composite, opacity 100, unit zoom and zero pan/tilt. Changing or replacing the V1 green media changes the background without replacing the foreground. Alpha is embedded in the V2 movie. For further matte editing, the lossless RGBA frame sequences and separate 8-bit alpha sequences are supplied in `assets/foreground_1_final/`, `foreground_2_final/`, `alpha_1/`, and `alpha_2/`.

## Color and alpha

The final native settings are Resolve Color Managed v2 (`davinciYRGBColorManagedv2`), combined color-space selection (`separateColorSpaceAndGamma=0`), **ACEScg timeline**, **sRGB project input and output**, and no output DRT/tone or gamut mapping. ACEScg provides the linear working space. Each delivery foreground is explicitly tagged **Input Color Space=sRGB**, **Data Level=Full**, **Alpha mode=Straight**. These settings are significant: Resolve's automatic data range expanded qtrle RGB as video levels in a test. Full range fixed the opaque color mismatch.

PNG RGB inputs are sRGB. Matte estimation and edge color unmixing use linearized sRGB values. Alpha is untransformed coverage, stored as 8-bit alpha. RGB in the intermediates is straight sRGB, including padded colors outside the visible support. The green layer is the public RGB(0,255,0) PNG. Final native H.264 is 8-bit 4:2:0, video range, with sRGB transfer / BT.709 primaries and the native SMPTE170M matrix tag; chroma subsampling and compression affect edge colors. The actual settings and receipts are in `scripts/native_color_settings.json` and `scripts/native_receipts.jsonl`.

The API rejected direct `Linear` timeline gamma and a separate media `Input Gamma=sRGB` setter. Those were not claimed as applied. The accepted combined `ACEScg` timeline and combined `sRGB` input selections are used instead; the separate legacy gamma fields are not the active combined selection.

## Segmentation and reproducibility

Only public PNG pixels, identity images, and frame-zero previews were used. Clip 1 keeps the long-haired woman wearing glasses. Clip 2 keeps the adult and child. The shared bar and passing man are detected by comparing the two public clips at each frame, filtering common opaque components, and conservatively expanding their exclusion by one pixel. Their excluded regions have zero alpha; hidden body parts are not painted in.

For clip 1, the public initial support is aligned with ORB/RANSAC, followed by constrained per-frame GrabCut. Clip 2 uses hand-authored contour anchors, corresponding contour landmarks, cubic head-position interpolation, and a local Lab color / spatial nearest-neighbor binary min-cut. A narrow closed-form color-line matte softens the contour; local foreground/background samples remove mixed background color from soft edges. There is no pretrained or downloaded segmentation model.

`assets/contour_guides.npz` preserves the chosen binary guides before final edge treatment. `scripts/anchors.py` contains the authored contours. To regenerate the final RGBA/alpha PNGs from those guides and the public PNG inputs, run `python scripts/finalize_mattes.py`, then `python scripts/encode_foregrounds.py`. Both replace the corresponding intermediates. `scripts/build_mattes.py` also reconstructs the upstream guides. Scratch products go to `/workspace/scratch`. These scripts require the original `/candidate` layout; path constants can be adjusted when moving the package.

All final compositing, MP4 rendering, and project export happened natively in Resolve. `scripts/resolve_project.py` supplies the actual RPC helper; `native_receipts.jsonl` records operations, arguments, returned job IDs and applied settings. `export_finished_project.py` was run only after both delivery jobs reported Complete / 100%. Do not rerun `new_project` against the existing assigned project: its initial attempt reported creation failure, and inspection showed an empty assigned project which was then configured before any timelines were made. Another timeline creation returned an SDK/assert error after actually creating the empty timeline; inspection established its two tracks before append continued.

Official supplied documentation consulted: `/candidate/reference/README.md`, **Internal Scripting**, **Looking up Project and Clip properties**, **Setting values**, and **Looking up Timeline item properties**; `/candidate/reference/DaVinciResolveScript.pyi`, the `Project`, `MediaPool`, `MediaPoolItem`, and `ProjectManager` API declarations. One direct application was querying the actual applied/current media properties after setting Full data level, rather than treating an RPC success as evidence that every setter applied. The pilot's `API_RUNTIME.md` defines the narrower operations actually used.

## Checks and limitations

`verification.json` records schema validation, decoded frame counts and timestamps, stream inspection, source alignment/color diagnostics, asset hashes and DRP container checks. Both complete movies and contact sheets spanning occlusions/reappearance were inspected. `checksums.sha256` binds the delivered files. Only native renders are delivered as the two output MP4s.

This is a manually anchored classical matte, not a pixel-perfect reconstruction. Fine hair, fingers, phone edges, vegetation-colored edge contamination and narrow gaps can remain imperfect, especially in clip 2. The one-pixel occluder expansion can remove a thin visible fringe near an occlusion. No hidden reference or independent semantic judge was accessed; formal score, acceptance and independent software audit remain unverified. A real editable DRP was exported, but successful independent reopening/rerendering is not claimed because the frozen API has no import-project/relink endpoint. The extra diagnostic timeline is an explicit handoff limitation.
