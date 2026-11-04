# Case3 Resolve Delivery

Version: `case3-resolve-green-v3.1-draft` (exploratory API pilot)  
Resolve project: `Case3_Luna_20261104_105511`  
Resolve version: Free 21.1.2.10  
Interface: allowlisted native API through the supplied RunScript queue; no GUI operations.

## Timelines

- `Clip 1 - Woman Matte`: green sequence on video track 1, straight-alpha woman sequence on track 2.
- `Clip 2 - Mother and Child Matte`: green sequence on video track 1, straight-alpha pair sequence on track 2.

Both renders cover frames 0 through 99. `assets/clip_1_rgba/` and `assets/clip_2_rgba/` contain the editable RGBA intermediates. `assets/green_sequence/` contains the separate green plate. The DRP references these assets by absolute path in the run workspace.

## Relinking

On another machine, import `project.drp` into Resolve, then relink the three image-sequence media items to the corresponding folders under `assets/`. Choose frame `0000.png` for each sequence. Ensure the RGBA sequences are interpreted as straight alpha. The project contains two timelines and separate foreground and background tracks; replacing the green sequence changes the background independently of the foreground.

## Matte and color notes

The public frame-zero green previews supplied clean identity mattes. Clip 1 reuses its matte across the clip; clip 2 applies hand-estimated horizontal translations. A coarse blue hue exclusion was applied to reduce the passing man's saturated blue shirt. This does not solve the moving bar, foreground plants, the passer's non-blue pixels, or subject motion and pose. Output therefore does not meet the requested full-clip occlusion and edge quality.

The green plate is RGB `(0,255,0)`. RGBA intermediates use straight alpha. Resolve's native composite/render path was used. The project was not explicitly calibrated to linear-light compositing, so the output may not match the contract's linear-light edge colors.

## Documentation consulted

The supplied `API_RUNTIME.md` describes the available native operations. `PROJECT_HANDOFF.md` specifies independent import, relinking, and rerender checks. The API surface did not expose Fusion node editing or a way to build a per-pixel mask node graph; the editable foreground and background tracks are the available composite relationship.

## Known limitations

The mattes are approximate, preview-derived silhouettes rather than frame-accurate masks. They do not reliably preserve motion, occlusion order, fine hair, glasses, hands, soft edges, or the gap between the two subjects. Inspect and replace the alpha sequences before production use.
