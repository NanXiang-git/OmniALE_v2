#!/usr/bin/env python3
"""Offline subtitle and preview builder for the supplied four-speaker clip."""
import argparse
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path


# Times are on the reordered source timeline. Every interval stays within an edit block.
TIMES = {
    "U001": ("B", 171.91, 176.53), "U002": ("C", 0.00, 4.92),
    "U003": ("A", 237.44, 238.93), "U004": ("D", 85.68, 87.34),
    "U005": ("A", 252.61, 252.85), "U006": ("A", 96.69, 102.07),
    "U007": ("D", 175.05, 175.42), "U008": ("C", 164.82, 169.75),
    "U009": ("B", 201.04, 204.54), "U010": ("D", 198.32, 200.62),
    "U011": ("B", 176.79, 181.57), "U012": ("A", 130.62, 131.12),
    "U013": ("D", 84.26, 84.82), "U014": ("C", 246.87, 248.31),
    "U015": ("C", 10.90, 16.76), "U016": ("C", 47.32, 50.04),
    "U017": ("C", 18.48, 20.80), "U018": ("C", 5.22, 10.90),
    "U019": ("D", 232.46, 233.34), "U020": ("C", 85.68, 90.70),
    "U021": ("A", 181.00, 181.38), "U022": ("B", 61.64, 62.38),
    "U023": ("A", 82.60, 84.26), "U024": ("C", 187.96, 193.40),
    "U025": ("D", 83.58, 83.90), "U026": ("A", 90.73, 96.07),
    "U027": ("D", 75.63, 79.56), "U028": ("A", 256.93, 257.25),
    "U029": ("B", 77.66, 79.56), "U030": ("B", 252.61, 253.13),
    "U031": ("B", 84.26, 86.66), "U032": ("A", 58.86, 59.20),
    "U033": ("C", 251.37, 253.13), "U034": ("C", 79.56, 83.58),
    "U035": ("A", 84.50, 84.82), "U036": ("A", 163.55, 163.79),
    "U037": ("C", 57.74, 62.88), "U038": ("C", 40.21, 47.32),
    "U039": ("C", 253.31, 256.32), "U040": ("C", 62.88, 63.52),
    "U041": ("D", 180.39, 180.61), "U042": ("A", 192.94, 193.40),
    "U043": ("D", 15.98, 16.76), "U044": ("C", 70.84, 76.11),
    "U045": ("A", 218.49, 237.44), "U046": ("D", 83.90, 84.26),
    "U047": ("A", 211.74, 216.33), "U048": ("A", 36.36, 37.46),
    "U049": ("B", 82.60, 83.58), "U050": ("B", 163.55, 163.79),
    "U051": ("D", 21.44, 22.08), "U052": ("C", 216.33, 218.49),
    "U053": ("B", 196.52, 196.98), "U054": ("C", 195.60, 196.52),
    "U055": ("B", 196.98, 201.04), "U056": ("A", 102.07, 107.44),
    "U057": ("C", 90.73, 96.75), "U058": ("D", 184.06, 184.25),
    "U059": ("B", 181.57, 186.37), "U060": ("A", 208.76, 211.74),
    "U061": ("A", 180.61, 180.95), "U062": ("D", 38.01, 41.53),
    "U063": ("A", 49.18, 57.00), "U064": ("C", 117.70, 121.04),
    "U065": ("B", 169.75, 170.10), "U066": ("C", 31.42, 36.08),
    "U067": ("C", 238.33, 238.65), "U068": ("A", 238.93, 239.35),
    "U069": ("A", 112.72, 113.80), "U070": ("B", 193.40, 193.78),
    "U071": ("D", 191.26, 191.40), "U072": ("D", 107.44, 113.48),
    "U073": ("C", 121.50, 127.16), "U074": ("A", 196.52, 196.98),
    "U075": ("C", 127.98, 130.62), "U076": ("D", 180.95, 181.25),
    "U077": ("D", 53.80, 58.86), "U078": ("C", 65.38, 70.84),
    "U079": ("A", 21.00, 25.99), "U080": ("A", 25.99, 31.42),
    "U081": ("C", 131.63, 135.23), "U082": ("A", 248.31, 251.37),
    "U083": ("D", 166.47, 166.79), "U084": ("C", 241.11, 246.87),
    "U085": ("D", 251.37, 252.61),
}

# The audio pauses inside these groups, so each spoken piece gets its own display life.
SPECIAL_SPANS = {
    "U006": [("already", 96.69, 96.75), ("I guess the tool is really our the computer as far as I can see Uh we get", 96.76, 102.07)],
    "U060": [("And remember, you have to press so it works", 208.76, 211.25), ("Mm-hmm", 211.25, 211.74)],
    "U039": [("I don't know we'll", 253.31, 254.94), ("get to that later", 255.58, 256.32)],
    "U045": [("I've", 218.49, 219.23), ("a very fat cat And it likes to", 229.47, 237.44)],
}
SPECIAL_SPEAKERS = {"U060": ["A", "D"]}

EDIT_BLOCKS = (0.0, 96.76, 187.96, 268.60)
ROLE_ORDER = {"A": 0, "B": 1, "C": 2, "D": 3}
ROLE_MARGIN = {"A": 8, "B": 52, "C": 96, "D": 140}


def stamp_ass(t):
    cs = round(t * 100)
    h, cs = divmod(cs, 360000)
    m, cs = divmod(cs, 6000)
    s, cs = divmod(cs, 100)
    return f"{h}:{m:02}:{s:02}.{cs:02}"


def stamp_srt(t):
    ms = round(t * 1000)
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"


def parse_transcript(path):
    groups = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        match = re.match(r"(U\d+)\s+(.*)$", line.strip())
        if match:
            groups[match.group(1)] = match.group(2).strip()
    return groups


def wrap_words(text, width=38):
    words = text.split()
    lines, line = [], ""
    for word in words:
        if line and len(line) + 1 + len(word) > width:
            lines.append(line)
            line = word
        else:
            line = f"{line} {word}".strip()
    if line:
        lines.append(line)
    return lines or [text]


def spans_for(uid, text):
    if uid in SPECIAL_SPANS:
        return SPECIAL_SPANS[uid]
    who, start, end = TIMES[uid]
    return [(text, start, end)]


def split_event_text(text, start, end):
    lines = wrap_words(text)
    pieces = ["\\N".join(lines[i:i + 2]) for i in range(0, len(lines), 2)]
    weights = [max(1, len(p.replace("\\N", " "))) for p in pieces]
    total = sum(weights)
    cursor = start
    result = []
    for i, (piece, weight) in enumerate(zip(pieces, weights)):
        piece_end = end if i == len(pieces) - 1 else cursor + (end - start) * weight / total
        result.append((piece, cursor, piece_end))
        cursor = piece_end
    return result


def build_events(groups):
    missing = sorted(set(groups) - set(TIMES))
    extra = sorted(set(TIMES) - set(groups))
    if missing or extra:
        raise ValueError(f"Transcript/timing mismatch; missing={missing}, extra={extra}")
    events = []
    next_id = 1
    for uid in sorted(groups):
        who = TIMES[uid][0]
        spans = spans_for(uid, groups[uid])
        speakers = SPECIAL_SPEAKERS.get(uid, [who] * len(spans))
        for span_index, (source_text, start, end) in enumerate(spans):
            who = speakers[span_index]
            for text, a, b in split_event_text(source_text, start, end):
                if not (0 <= a < b <= EDIT_BLOCKS[-1]):
                    raise ValueError(f"Invalid time for {uid}: {a}-{b}")
                if any(a < boundary < b for boundary in EDIT_BLOCKS[1:-1]):
                    raise ValueError(f"Event crosses edit boundary: {uid}")
                lines = text.split("\\N")
                labeled = "\\N".join(f"{who}: {line}" for line in lines)
                events.append({
                    "id": str(next_id), "utterance_id": uid, "speaker": who,
                    "start": round(a, 3), "end": round(b, 3),
                    "body": text, "labeled": labeled,
                })
                next_id += 1
    events.sort(key=lambda e: (e["start"], ROLE_ORDER[e["speaker"]], int(e["id"])))
    for index, event in enumerate(events, 1):
        event["id"] = str(index)
    return events


def write_ass(path, events):
    styles = []
    for who in "ABCD":
        styles.append(
            f"Style: {who},DejaVu Sans,18,&H00FFFFFF,&H000000FF,&H00101010,&H80000000,"
            f"0,0,0,0,100,100,0,0,1,1.5,0.6,2,12,12,{ROLE_MARGIN[who]},1"
        )
    lines = [
        "[Script Info]", "Title: Four speaker meeting subtitles", "ScriptType: v4.00+",
        "WrapStyle: 2", "ScaledBorderAndShadow: yes", "YCbCr Matrix: TV.601",
        "PlayResX: 704", "PlayResY: 576", "", "[V4+ Styles]",
        "Format: Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,OutlineColour,BackColour,"
        "Bold,Italic,Underline,StrikeOut,ScaleX,ScaleY,Spacing,Angle,BorderStyle,Outline,Shadow,"
        "Alignment,MarginL,MarginR,MarginV,Encoding",
        *styles, "", "[Events]",
        "Format: Layer,Start,End,Style,Name,MarginL,MarginR,MarginV,Effect,Text",
    ]
    for event in events:
        lines.append(
            f"Dialogue: 0,{stamp_ass(event['start'])},{stamp_ass(event['end'])},"
            f"{event['speaker']},{event['speaker']},0,0,0,,{event['labeled']}"
        )
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def build_srt_and_alignment(events, path):
    boundaries = sorted({e["start"] for e in events} | {e["end"] for e in events})
    cues, event_cues = [], {e["id"]: [] for e in events}
    cue_number = 1
    for a, b in zip(boundaries, boundaries[1:]):
        active = [e for e in events if e["start"] <= a + 1e-6 and e["end"] >= b - 1e-6]
        if not active or b - a < 0.001:
            continue
        active.sort(key=lambda e: (ROLE_ORDER[e["speaker"]], int(e["id"])))
        content = []
        for event in active:
            for line in event["body"].split("\\N"):
                content.append(f"{event['speaker']}: {line}")
            event_cues[event["id"]].append(str(cue_number))
        cues.append((str(cue_number), a, b, "\n".join(content)))
        cue_number += 1
    lines = []
    for cue_id, a, b, text in cues:
        lines.extend([cue_id, f"{stamp_srt(a)} --> {stamp_srt(b)}", text, ""])
    path.write_text("\n".join(lines), encoding="utf-8")
    mapping = []
    for e in events:
        mapping.append({
            "utterance_ids": [e["utterance_id"]], "speaker_id": e["speaker"],
            "start": e["start"], "end": e["end"],
            "ass_event_ids": [e["id"]], "srt_cue_ids": event_cues[e["id"]],
        })
    return mapping


def run_render(input_dir, submission_dir, output):
    source = input_dir / "source.mp4"
    ass = submission_dir / "interview.ass"
    output.parent.mkdir(parents=True, exist_ok=True)
    ffmpeg = shutil.which("ffmpeg") or "/benchmark/ffmpeg/bin/ffmpeg"
    cmd = [
        ffmpeg, "-hide_banner", "-loglevel", "error", "-y", "-i", str(source),
        "-map", "0:v:0", "-map", "0:a:0", "-vf", f"subtitles={ass}",
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "19", "-pix_fmt", "yuv420p",
        "-r", "25", "-fps_mode", "cfr", "-c:a", "copy", "-map_metadata", "0",
        "-movflags", "+faststart", str(output),
    ]
    subprocess.run(cmd, check=True)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=Path, required=True, help="Candidate input directory")
    parser.add_argument("--submission", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True, help="Rendered preview path")
    args = parser.parse_args()
    args.input = args.input.resolve()
    args.submission = args.submission.resolve()
    args.output = args.output.resolve()
    args.submission.mkdir(parents=True, exist_ok=True)
    groups = parse_transcript(args.input / "transcript.txt")
    events = build_events(groups)
    write_ass(args.submission / "interview.ass", events)
    mapping = build_srt_and_alignment(events, args.submission / "interview.srt")
    (args.submission / "alignment.json").write_text(
        json.dumps({"events": mapping}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    run_render(args.input, args.submission, args.output)


if __name__ == "__main__":
    main()
