#!/usr/bin/env python3
"""Render the delivered ASS over the original video with FFmpeg and libass."""

import argparse
from pathlib import Path
import shutil
import subprocess
from tempfile import TemporaryDirectory


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, required=True, help="Input directory")
    parser.add_argument("--submission", type=Path, required=True, help="Subtitle directory")
    parser.add_argument("--output", type=Path, required=True, help="Output MP4 file")
    parser.add_argument("--scratch", type=Path, help="Directory for temporary render files")
    args = parser.parse_args()

    source = (args.input / "source.mp4").resolve(strict=True)
    subtitles = (args.submission / "interview.ass").resolve(strict=True)
    output = args.output.resolve()
    if source == output:
        parser.error("The output path must differ from the input video path.")

    scratch = args.scratch or args.submission.resolve().parent / "scratch"
    scratch.mkdir(parents=True, exist_ok=True)
    output.parent.mkdir(parents=True, exist_ok=True)

    with TemporaryDirectory(prefix="interview-render-", dir=scratch) as directory:
        work = Path(directory)
        # A local filename avoids FFmpeg filtergraph escaping for arbitrary paths.
        shutil.copyfile(subtitles, work / "captions.ass")
        preview = work / "preview.mp4"
        subprocess.run(
            [
                "ffmpeg", "-nostdin", "-hide_banner", "-loglevel", "error",
                "-i", str(source), "-map", "0:v:0", "-map", "0:a:0",
                "-vf", "ass=captions.ass",
                "-c:v", "libx264", "-preset", "fast", "-crf", "14",
                "-pix_fmt", "yuv420p", "-threads", "2",
                "-c:a", "copy", "-movflags", "+faststart", str(preview),
            ],
            cwd=work,
            check=True,
        )
        shutil.move(str(preview), str(output))


if __name__ == "__main__":
    main()
