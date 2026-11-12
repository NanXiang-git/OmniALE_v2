#!/usr/bin/env python3
"""Rebuild the audio stems and accessible MP4 from source media and recorded cues."""
import argparse
import json
import subprocess
from pathlib import Path

import numpy as np
import soundfile as sf
from scipy.signal import resample_poly


SR = 48000
DURATION = 148.064583333
SAMPLES = round(SR * DURATION)
DUCK = 10 ** (-6 / 20)
FADE = round(0.07 * SR)


def run(args):
    subprocess.run([str(x) for x in args], check=True)


def write_wav(path, data):
    sf.write(path, np.asarray(data, dtype=np.float32), SR, subtype="PCM_16")


def stamp(seconds):
    ms = round(seconds * 1000)
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02}.{ms:03}"


def build(input_dir, submission_dir, output_dir):
    input_dir, submission_dir, output_dir = map(Path, (input_dir, submission_dir, output_dir))
    output_dir.mkdir(parents=True, exist_ok=True)
    cues = json.loads((submission_dir / "ad_plan.json").read_text(encoding="utf8"))["cues"]
    base, _ = sf.read(input_dir / "original.wav", dtype="float32", always_2d=True)
    base = base[:SAMPLES]
    if len(base) < SAMPLES:
        base = np.pad(base, ((0, SAMPLES - len(base)), (0, 0)))
    base = base.astype(np.float64)
    ad = np.zeros((SAMPLES, 2), dtype=np.float64)
    envelope = np.ones(SAMPLES, dtype=np.float64)
    for cue in cues:
        audio, rate = sf.read(submission_dir / cue["wav"], dtype="float32", always_2d=True)
        if rate != SR:
            raise ValueError(f"{cue['id']} must be 48 kHz")
        if audio.shape[1] == 1:
            audio = np.repeat(audio, 2, axis=1)
        start = round(cue["start"] * SR)
        expected = round((cue["end"] - cue["start"]) * SR)
        if abs(len(audio) - expected) > 1:
            raise ValueError(f"{cue['id']} duration differs from ad_plan.json")
        end = start + len(audio)
        if start < 0 or end > SAMPLES:
            raise ValueError(f"{cue['id']} is outside the source timeline")
        ad[start:end] += audio
        # Reach -6 dB by the first narrated sample and restore it after the last.
        left = max(0, start - FADE)
        envelope[left:start] = np.linspace(1.0, DUCK, max(1, start - left), endpoint=False)
        envelope[start:end] = DUCK
        right = min(SAMPLES, end + FADE)
        envelope[end:right] = np.linspace(DUCK, 1.0, max(1, right - end), endpoint=False)
    ducked = base * envelope[:, None]
    mixed = ducked + ad
    peak = np.max(np.abs(resample_poly(mixed, 4, 1, axis=0)))
    gain = min(1.0, (10 ** (-1 / 20)) / max(peak, 1e-12))
    base *= gain
    ducked *= gain
    ad *= gain
    mixed *= gain
    write_wav(output_dir / "base_track.wav", base)
    write_wav(output_dir / "ducked_base_track.wav", ducked)
    write_wav(output_dir / "ad_track.wav", ad)
    write_wav(output_dir / "mix.wav", mixed)
    vtt = ["WEBVTT", ""]
    for cue in cues:
        vtt.extend([cue["id"], f"{stamp(cue['start'])} --> {stamp(cue['end'])}", cue["text"], ""])
    (output_dir / "ad.vtt").write_text("\n".join(vtt), encoding="utf8")
    run([
        "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
        "-i", input_dir / "source.mp4", "-i", output_dir / "mix.wav",
        "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy", "-c:a", "aac",
        "-b:a", "256k", "-t", str(DURATION), "-movflags", "+faststart",
        output_dir / "accessible.mp4"
    ])
    return gain


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--submission", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    gain = build(args.input, args.submission, args.output)
    print(f"Built outputs; common linear gain={gain:.8f}")


if __name__ == "__main__":
    main()
