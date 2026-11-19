# Delivery verification

The videos were rendered offline from a clean copy containing `render.py` and `project/`. The reference video is not an input to that renderer. Geometry, text contours, materials, ornament groups, individual cursor tracks and paper folds are editable code. The only static asset is the outlined `Aa` badge.

## Verified checks

- Reconstruction: 96 decodable frames, 1920×1080, 24 fps, exactly 4 seconds, H.264/yuv420p, no audio stream.
- Revision: 144 decodable frames, the same image format, exactly 6 seconds, no audio stream.
- Parameter variant: a separate, complete 144-frame video, using `DESIGN ON`, `#7C3AED → #FBBF24`, and 0.125 seconds of cursor delay.
- All five time anchors evaluate exactly. Source 4.00 seconds is an exclusive boundary, not an extra reference frame.
- In the encoded revision, 29 uniquely observable blue-arrow silhouettes match a zero-delay control six output frames earlier. The largest measured tip difference is √2 pixels, attributable to the thresholded encoded edge. Occluded and ambiguous samples are excluded explicitly.
- A delay-only render comparison changes 2,526 pixels in the two blue-arrow silhouettes at output frame 52. The green and orange cursor states are identical across every output frame.
- Changing only the text to `DESIGN ON` changes 36,535 pixels at output 4.75 seconds, with zero changed pixels outside the lettering arcs.
- Changing only the UI gradient produces zero changed pixels in the settled illustration at output 4.75 seconds.

These results are recorded in `results.json`. The cursor measurement checks actual rendered silhouettes as well as the object timing data; it does not infer correctness from a bounding-box pixel translation.

## Visual evidence and limitations

Frame numbers below are zero-based. `reference_comparison_1.jpg` through `_4.jpg` contain all 96 source/reconstruction pairs at fixed absolute times. `revision_all_frames_1.jpg` through `_6.jpg` cover all 144 revision frames. The frame-by-frame CSV supplies descriptive pixel and silhouette differences, not an automatic aesthetic score.

| Acceptance item | Evidence to review | Observed result and remaining differences |
| --- | --- | --- |
| Composition and logo structure | R 8, 24, 40, 54, 75, 83, 95 | Preserves the central double-loop topology, white field, large right arc, smaller left arc and diagonal crossing. Curves were manually reconstructed; some local tangents and cap contours differ. |
| Layout and grid | Every R frame 0–47; comparison sheets 1–2 | Incremental lower swatches, expanding selected ring tile, inverse logo strips, color cards, guides, targets, badge and halftones are present. The original irregular grain and some graded reveals are approximated. |
| Dimensional UI | Every R frame 37–74; especially R 54 | White/grey recessed track, travelling knob, pink carrier and sleeve, selection boxes, three cursors, orbs, speech bubble and frosted panel are present. Shading and local backdrop blur are procedural approximations of the original optics. |
| Illustration | Every R frame 61–95; comparison sheets 3–4 | Separate flowers, stars, pencil, leaves, camera-like capsule, orb, ribbon, arrow, coin, orbit lines, curls and lettered logo bands build over the UI. The original's complex nonrigid deformation is approximated with independent transforms, growing paths and shaded folds. |
| Curved text revision | E 102–143; `parameter_variant.jpg` | `CREATE ON` is laid out as full editable glyphs on both main arcs and the exposed monochrome arc. It retains orange fill, dark outline and scene occlusion. Glyph shapes are more regular than the reference's bespoke lettering. |
| Local material revision | E 54–84 and the parameter comparison sheet | The tube, moving sleeve, neon groove and glass refraction change to blue/cyan. Control colors and the illustration keep their separate materials. The carrier's translucency and sleeve highlight are approximate. |
| Base time mapping | `results.json` and `checkpoints/revision_timing.json` | Exact anchor evaluation and linear interpolation between anchors. Each object is evaluated on its own source track; observed two-frame holds are retained for the grid and illustration. |
| Unique cursor delay | `results.json:blue_cursor_pixel_check` | Six output frames for the identified internal blue cursor. Other cursor tracks and UI geometry use the base map. New illustration layers may occlude the delayed arrow. |
| Layering and transitions | R 37–50, 61–79, 89–95; corresponding E frames | Editable layers replace and cover one another; there is no reference-frame overlay. The corrected first curl and ornament entrances improve the handoffs. Some fold silhouettes and detailed overlap timing remain approximate. |
| Rebuild and variants | README commands; `variant.mp4`; `results.json` | Both requested full videos and a full alternate configuration were actually rendered from the clean copy. No external media or font is needed to rebuild. |

Every rendered frame was reviewed in timestamped contact sheets, with full-resolution checkpoints used for the grid, cursor identity, material, lettering and transition details. No corrupt frames were found. The intentional held poses are part of the reconstructed animation cadence.

The numeric acceptance threshold and exact two-frame tolerance for every subtle reference event have not been independently certified. No formal total score is asserted. In particular, manual lettering style, optical fidelity, print texture and detailed paper deformation should receive human review rather than an automatic full-credit conclusion.
