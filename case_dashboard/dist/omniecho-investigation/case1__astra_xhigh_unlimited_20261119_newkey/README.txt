Open report.html locally. No network access is required.

Required artifacts: report.html, findings.json, evidence_manifest.json, evidence/*.mkv, evidence/*_preview.mp4.
The report is rendered from findings.json and embeds the same complete JSON object.
The original evidence has four channels; the browser preview is a lossy simplified stereo mix.

Analysis: local Python/NumPy/SciPy and FFmpeg only. No other model, ASR, external search, or native model audio listening was used.
The camera grid and spectrogram images derive from the supplied media.
Scripts preserve the original /candidate/incident.mp4 input path used in this environment.

All four distance values are low-confidence scene-scale estimates, not calibrated measurements. See analysis/method_and_uncertainty.json and the individual report notes.

Validation checks structure, real evidence files, provenance, coverage, and report consistency. It does not return semantic correctness feedback.
