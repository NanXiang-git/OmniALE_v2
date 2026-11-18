# Creative Cloud ident reconstruction and revision

`reconstruction.mp4`: 1920 × 1080, 24 fps, 96 frames, 4 seconds.  
`revision.mp4`: 1920 × 1080, 24 fps, 144 frames, 6 seconds.  
Both are silent H.264, yuv420p. The shared scene is authored as editable cubic curves, vector illustrations, masks, gradients, independent object transforms and warped glyph outlines.

## Rebuild

Use the supplied environment's **`/usr/bin/python3`**, FFmpeg, Cairo and librsvg. Python packages: NumPy 1.26.4, OpenCV 4.10.0, Pillow 10.2.0 and Pycairo 1.25.1. No download, Blender project, online service or source media is required. The font, font license, vector artwork, glyphs, geometric tracks and procedural grain tile are included under `project/`.

From this directory:

```bash
/usr/bin/python3 render.py --mode reconstruction --config project/revision.json --output reconstruction.mp4
/usr/bin/python3 render.py --mode revision --config project/revision.json --output revision.mp4
```

Example clean-directory rebuild:

```bash
mkdir -p /tmp/ident-clean
cp -R render.py project /tmp/ident-clean/
cd /tmp/ident-clean
/usr/bin/python3 render.py --mode reconstruction --config project/revision.json --output reconstruction.mp4
/usr/bin/python3 render.py --mode revision --config project/revision.json --output revision.mp4
```

The root of the asset tree is resolved relative to the script, so the command can also be invoked from another working directory with absolute paths. Movies are sampled at `frame / 24`; neither mode samples an extra frame at the duration boundary. Accurate FFmpeg color conversion preserves the neutral white canvas.

## Public revision controls

`project/revision.json` copies the supplied configuration. It sets `path_text` to `CREATE ON`, `ui_gradient` to `#2563EB` → `#22D3EE`, and `cursor_delay_s` to `0.25`.

| Source seconds | Revision seconds |
| --- | --- |
| 0 | 0 |
| 1.75 | 1.75 |
| 2.75 | 3.25 |
| 3.75 | 5.25 |
| 4.00, right boundary | 6.00, right boundary |

`Scene.source_time()` linearly interpolates the anchors. All base animation curves evaluate at this source time. Only the specified cyan triangle evaluates at `source_time(output_time - cursor_delay_s)`, including its visibility. The green and orange pointers, selections and controls retain base timing. The scene redraws underlying geometry and recomputes occlusion on each frame.

`path_text` accepts 6–10 uppercase letters/spaces; each occurrence, including the late monochrome patch, is regenerated from glyph outlines. Character widths reflow within the original curved spans. Revised tail lettering starts farther from the pointed tip to remain readable. `ui_gradient` accepts two hex colors; tube color is attached to arc distance throughout reveals and slider motion. The porcelain LED, pink switch and illustration retain their own palettes. `cursor_delay_s` accepts 0–0.35 seconds. Reconstruction mode uses original text, pink material and undelayed pointers.

`project/variant.json` exercises all three public edit controls with `MAKE ART`, orange–yellow material and a 0.10-second delay, retaining the time map:

```bash
/usr/bin/python3 render.py --mode revision --config project/variant.json --output validation/variant.mp4
```

## Editing and inspection

`edit_map.json` lists locations, intervals, object identities and compositing order. Main files:

- `project/scene.py`: composition and source-time mapping.
- `project/print_stage.py`: individual print slices, swatches, halftones and guides.
- `project/ui_stage.py`: tube material, raised slider, porcelain rail, glass, controls and three pointers.
- `project/cursor_tracks.json`: independent pointer tip tracks in design pixels.
- `project/geometry.py`: shared mark curves and arc-length sampling.
- `project/illustration_stage.py`: sticker entrances, curved ribbon growth, folds and curls.
- `project/assets/illustration.svg`: named, editable illustration objects.
- `project/lettering.py` and `project/assets/lettering.json`: warped glyph layout and heavy custom display outlines.

To inspect an editable scene snapshot and its rasterization:

```bash
/usr/bin/python3 render.py --mode revision --config project/revision.json --output previews/edit.mp4 --preview-times 2.5,4.75,5.875
```

This writes SVG/PNG pairs instead of a movie. All changing objects are represented by geometry and animation functions. The only raster asset used by the renderer is a small, static procedural grain tile. The reference movie and extracted images are never loaded by the render path.

## Validation and limits

`validation/report.json` records actual decoded frame counts, codecs, hashes, mapped-pose comparisons and pointer measurements. `validation/cursor_pairs.json` and `cursor_observations.csv` contain frame-specific observations. Contact sheets and selected images document the rendered R, E and public-parameter variant. Reference comparison sheets are documentation only and are never used by the renderer.

```bash
/usr/bin/python3 project/validate.py
# Optional: regenerate labeled reference/R/E comparison sheets:
/usr/bin/python3 project/validate.py --reference /candidate/input/reference.mp4
```

`validation/clean_rebuild.json` records the separate-directory rebuild check. `validation/visual_review.md` describes inspected visual evidence and remaining approximations. These checks do not certify a rubric score or exact original 3D lighting. This is an independently authored reconstruction: some hand-drawn contours, paper deformation, glass refraction and subtle original timing remain approximations.

Reference attribution: BUCK, *Adobe Creative Cloud Ident*, https://buck.co/work/adobe-creative-cloud-ident . This exercise is not an Adobe commission or endorsed project. No reference video is included in the rendering assets.
