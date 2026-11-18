Analysis provenance

The evidence/ files were exported by the host and were not altered. The HTML report and findings.json contain the same final finding object.

The bearing CSV and plot were computed from the four AAC channels decoded from incident.mp4, using NumPy/SciPy. The exported original MKV contains the host PCM rendering of those channels. Run python3 analysis/measure_audio.py from this archive to recompute measurements from that original evidence. Minor numerical differences may result from the host PCM quantization.

The assumed ambisonic channel order is W,Y,Z,X. This convention was inferred, not supplied in the public metadata. The selected bands reduce high-frequency inconsistency but do not make the estimates ground truth.

The grid_geometry.py script includes the manually inspected grid intersection pixel coordinates and the single-image square-grid calibration. Grid units are taken as metres for rough scale only.

validation_receipt.json is the real initial host validation response. It confirms format/provenance only. decode_checks.json records the local FFmpeg full-file decoding checks.
