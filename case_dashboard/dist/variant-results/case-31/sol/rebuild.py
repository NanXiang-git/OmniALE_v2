#!/usr/bin/env python3
"""Burn the submitted ASS file over the supplied source with offline FFmpeg."""

import argparse
import os
from pathlib import Path
import shutil
import subprocess
import tempfile


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path, help="directory containing source.mp4")
    parser.add_argument("submission", type=Path, help="directory containing interview.ass")
    parser.add_argument("output", type=Path, help="path for the rendered MP4")
    args = parser.parse_args()

    source = args.input.resolve() / "source.mp4"
    submission = args.submission.resolve()
    output = args.output.resolve()
    for required in (source, submission / "interview.ass"):
        if not required.is_file():
            parser.error(f"missing file {required}")
    if output in {source, submission / "interview.ass"}:
        parser.error("output must be a separate file")

    ffmpeg = shutil.which("ffmpeg")
    if ffmpeg is None:
        parser.error("FFmpeg must be on PATH")

    output.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix=".render-", dir=output.parent) as work:
        temporary = Path(work) / "preview.mp4"
        subprocess.run(
            [
                ffmpeg, "-hide_banner", "-loglevel", "error", "-nostdin", "-y",
                "-copyts", "-i", os.fspath(source),
                "-map", "0:v:0", "-map", "0:a:0",
                "-vf", "ass=filename=interview.ass",
                "-fps_mode", "passthrough", "-enc_time_base", "1:12800",
                "-c:v", "libx264", "-preset", "veryfast", "-qp", "0",
                "-pix_fmt", "yuv420p", "-threads:v", "2", "-c:a", "copy",
                "-video_track_timescale", "12800", "-movie_timescale", "192000",
                "-movflags", "+faststart", os.fspath(temporary),
            ],
            cwd=submission,
            check=True,
        )
        os.replace(temporary, output)


if __name__ == "__main__":
    main()
