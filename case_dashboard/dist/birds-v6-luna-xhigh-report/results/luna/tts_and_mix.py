#!/usr/bin/env python3
"""Synthesize the authored Mandarin narration and render the finished short."""

from __future__ import annotations

import asyncio
from datetime import datetime, timezone
import hashlib
import json
import math
import os
from pathlib import Path
import subprocess
import time
import textwrap
import wave

import numpy as np
import edge_tts


ROOT = Path("/workspace")
SOURCE = Path("/candidate/birds_source.mp4")
CHAPTER_FILE = Path("/candidate/chapters.json")
OUT = ROOT / "submission"
SCRATCH = ROOT / "scratch"
FONT_DIR = OUT / "fonts"
FONT = FONT_DIR / "NotoSansSC.ttf"
VOICE = "zh-CN-XiaoxiaoNeural"
RATE = "-5%"
SAMPLE_RATE = 48_000

CHAPTERS = json.loads(CHAPTER_FILE.read_text(encoding="utf-8"))["segments"]
TOTAL_DURATION = float(json.loads(CHAPTER_FILE.read_text(encoding="utf-8"))["duration"])
TOTAL_SAMPLES = round(TOTAL_DURATION * SAMPLE_RATE)

UTTERANCES = [
    {
        "segment": 1,
        "start": 7.0,
        "text": "这只棕红背、浅色腹部的小鸟，外形暂定为卡罗来纳鹪鹩。它被托在手中，羽毛与长尾清楚可见；开头有几组短促高音，但不能确认来自这只鸟。",
    },
    {
        "segment": 2,
        "start": 53.5,
        "text": "灌木枝叶遮住了鸟体，只留下几组短促的声响。现有画面与声谱不足以可靠定种，这一段保留为未识别的灌丛鸣禽。",
    },
    {
        "segment": 3,
        "start": 76.5,
        "text": "枝头这只灰橄榄背、浅腹的小型鹟，外形暂定为东部林鹟。它停栖时数次张嘴，声谱也有重复的调性脉冲；近似种仍难排除。",
    },
    {
        "segment": 4,
        "start": 106.5,
        "text": "芦苇高而密，鸟体始终被叶片挡住。背景声谱里有零散的窄带短音，来源无法确认；这段只能保留为未定种的芦苇间鸣禽。",
    },
    {
        "segment": 5,
        "start": 131.5,
        "text": "这是褐色燕鸥成鸟与雏鸟。雏鸟张嘴迎向成鸟；亲鸟会反刍喂食。原声有断续短声，但不能只凭波形确定声源属于哪只。",
    },
    {
        "segment": 6,
        "start": 164.5,
        "text": "这群长翼、白色身体配深色背翅的海鸟，外形很像莱山信天翁。绒羽雏鸟紧靠成鸟；亲鸟会反刍喂雏，并共同照看很长时间。原声声谱有不规则短脉冲，具体叫声与来源无法确认。",
    },
]

ORIGINAL_SOUND_WINDOWS = {
    1: [{"start": 0.0, "end": 5.0}],
    2: [{"start": 46.066667, "end": 51.066667}],
    3: [{"start": 95.766667, "end": 100.766667}],
    4: [{"start": 100.766667, "end": 105.5}],
    5: [{"start": 126.5, "end": 131.0}],
    6: [{"start": 158.466667, "end": 163.466667}],
}

SEGMENT_INFO = [
    {
        "chinese_name": "卡罗来纳鹪鹩（暂定）",
        "english_name": "Carolina Wren (tentative)",
        "scientific_name": "Thryothorus ludovicianus",
        "confidence": 55,
        "visual_evidence": [
            {"start": 2.0, "end": 6.0, "description": "棕红色上体、浅色腹部、较长尾羽；鸟被人托起，画面静止，未显示觅食或飞行动作。"}
        ],
        "audio_evidence": [
            {"start": 0.0, "end": 5.0, "description": "单声道波形与声谱有数组短时、高频调性成分；没有原生听音工具，不能确认它们是鸟鸣，也不能归属于手持个体。"}
        ],
        "sources": [
            {
                "url": "https://www.audubon.org/field-guide/bird/carolina-wren",
                "supports": "候选种的棕红上体、浅黄褐下体與明显眉纹；只用于外形比对，片中个体仍为暂定识别。",
            }
        ],
    },
    {
        "chinese_name": "未定种灌丛鸣禽",
        "english_name": "Unidentified passerine in shrubland",
        "scientific_name": "Passeriformes indet.",
        "confidence": 0,
        "visual_evidence": [
            {"start": 46.066667, "end": 72.8, "description": "画面持续为浓密灌木，未见可确认的鸟体或具体行为；抽帧未能支持物种识别。"}
        ],
        "audio_evidence": [
            {"start": 46.066667, "end": 51.066667, "description": "谱图显示数组短时窄带能量；无听音工具，无法判断音色、节律是否具物种诊断性，声源归属也不明。"}
        ],
        "sources": [],
    },
    {
        "chinese_name": "东部林鹟（暂定）",
        "english_name": "Eastern Wood-Pewee (tentative)",
        "scientific_name": "Contopus virens",
        "confidence": 53,
        "visual_evidence": [
            {"start": 72.8, "end": 100.766667, "description": "灰橄榄色背部、浅色喉腹、较长暗色尾羽；停在裸枝上，多次张嘴。外形接近林鹟，画面未提供地理线索。"}
        ],
        "audio_evidence": [
            {"start": 95.766667, "end": 100.766667, "description": "重复调性脉冲与张嘴时段相邻，支持可能的发声行为；无听音工具，不能依赖鸣声排除西部林鹟或确认声源个体。"}
        ],
        "sources": [
            {
                "url": "https://www.audubon.org/field-guide/bird/eastern-wood-pewee",
                "supports": "候选种的素淡灰橄榄外观、浅色翼斑；资料亦指出东部与西部林鹟外形极相近，故此处仅作暂定识别。",
            }
        ],
    },
    {
        "chinese_name": "未定种芦苇间鸣禽",
        "english_name": "Unidentified reedbed bird",
        "scientific_name": "Aves indet.",
        "confidence": 0,
        "visual_evidence": [
            {"start": 100.766667, "end": 123.966667, "description": "全段为高密芦苇与草茎，抽帧未见可辨认鸟体，不能据栖境单独推断物种或行为。"}
        ],
        "audio_evidence": [
            {"start": 100.766667, "end": 105.5, "description": "谱图只有稀疏的低能量窄带成分；无听音工具，不能确认其为鸟声或判别物种，声源归属不明。"}
        ],
        "sources": [],
    },
    {
        "chinese_name": "褐色燕鸥",
        "english_name": "Brown Noddy",
        "scientific_name": "Anous stolidus",
        "confidence": 92,
        "visual_evidence": [
            {"start": 123.966667, "end": 158.466667, "description": "地面聚集的深褐色成鸟与绒羽幼鸟；成鸟俯向张口幼鸟，多次接触其嘴部，符合育雏喂食画面。"}
        ],
        "audio_evidence": [
            {"start": 126.5, "end": 131.0, "description": "原声波形包含断续短脉冲，与幼鸟张嘴及成鸟靠近的时间相邻；没有听音工具，不能确认声源属于哪只个体。"}
        ],
        "sources": [
            {
                "url": "https://www.audubon.org/field-guide/bird/brown-noddy",
                "supports": "种名、成鸟深褐色外观及亲鸟以反刍方式喂育幼鸟。",
            }
        ],
    },
    {
        "chinese_name": "莱山信天翁",
        "english_name": "Laysan Albatross",
        "scientific_name": "Phoebastria immutabilis",
        "confidence": 92,
        "visual_evidence": [
            {"start": 158.466667, "end": 185.466667, "description": "开阔草地上有大型白身、深色背翅和长翼海鸟，周围可见灰褐绒羽幼鸟；成鸟靠近幼鸟并俯首互动。"}
        ],
        "audio_evidence": [
            {"start": 158.466667, "end": 163.466667, "description": "原声有多个不规则的短时能量脉冲；无听音工具，不能据此判别叫声类型或将其归给特定个体。"}
        ],
        "sources": [
            {
                "url": "https://www.audubon.org/field-guide/bird/laysan-albatross",
                "supports": "种名、白色身体与深色上翼的外形，以及亲鸟反刍喂雏、在草地或沙地岛屿繁殖的事实。",
            }
        ],
    },
]

RESEARCH_EVENTS = [
    {
        "type": "species_reference",
        "url": "https://www.audubon.org/field-guide/bird/carolina-wren",
        "status": 200,
        "response_sha256": "3779c55ef65c4363260c2d710d38ae425a391ca35c36b8c859d4375d555d75b4",
        "used": True,
        "note": "Read page body; used only for candidate plumage comparison.",
    },
    {
        "type": "species_reference",
        "url": "https://www.audubon.org/field-guide/bird/eastern-wood-pewee",
        "status": 200,
        "response_sha256": "9a959f8483c634492b83d416812f73a3a9fa3a13486c5a8315606a974df0e751",
        "used": True,
        "note": "Read page body; used for tentative flycatcher comparison and eastern/western ambiguity.",
    },
    {
        "type": "species_reference",
        "url": "https://www.audubon.org/field-guide/bird/brown-noddy",
        "status": 200,
        "response_sha256": "b72158b09d0a7b0d947ec77d176cc41dbdc72491000c00ff18b7b616d7dafa65",
        "used": True,
        "note": "Read page body; used for adult plumage and regurgitative feeding fact.",
    },
    {
        "type": "species_reference",
        "url": "https://www.audubon.org/field-guide/bird/laysan-albatross",
        "status": 200,
        "response_sha256": "2b112ec426c2a316576f0716be8b60d041eb2b0dfb2475f990bdeb7bb11482dc",
        "used": True,
        "note": "Read page body; used for plumage, nesting setting, and parent-to-young feeding fact.",
    },
    {
        "type": "species_reference",
        "url": "https://www.audubon.org/field-guide/bird/bewicks-wren",
        "status": 200,
        "response_sha256": "69f5590844cf16bdb3d8020c9a650ffc6b3c50de11bcf7883ccc2ca66381e3b5",
        "used": False,
        "note": "Read for comparison; white tail corners and paler underparts fit less well than the chosen tentative candidate.",
    },
    {
        "type": "species_reference",
        "url": "https://www.audubon.org/field-guide/bird/eastern-phoebe",
        "status": 200,
        "response_sha256": "5168bbfb6d5143561b9e2898136bd29000a3fdf1e7a12cd8d82338e7a48afcf8",
        "used": False,
        "note": "Read for flycatcher comparison; no call-based conclusion drawn.",
    },
    {
        "type": "species_reference",
        "url": "https://www.audubon.org/field-guide/bird/eastern-kingbird",
        "status": 200,
        "response_sha256": "fa6ce68a48ecad52e2fd0d345080ac84e20915cfadb05bf75f4d30ef6703a88a",
        "used": False,
        "note": "Page returned navigation/title text but no useful identification body; not used as evidence.",
    },
    {
        "type": "species_reference",
        "url": "https://www.audubon.org/field-guide/bird/western-kingbird",
        "status": 403,
        "response_sha256": "9cd4cf9302730492289d66373bb73c0502528f4b15e8ca9a7e97a81775012387",
        "used": False,
        "note": "Access denied; abandoned without trying another host or mirror.",
    },
    {
        "type": "tts_probe",
        "url": "https://translate.google.com/translate_tts",
        "status": 403,
        "response_sha256": None,
        "used": False,
        "note": "HTTP CONNECT returned 403; abandoned this service and did not retry via another route.",
    },
    {
        "type": "tts_service",
        "url": "https://speech.platform.bing.com/consumer/speech/synthesize/readaloud/voices/list",
        "status": 200,
        "response_sha256": None,
        "used": True,
        "note": "Voice-list probe succeeded; Edge TTS receives authored text only, never video or source audio.",
    },
    {
        "type": "font_download",
        "url": "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;600&display=swap",
        "status": 200,
        "response_sha256": None,
        "used": True,
        "note": "CSS identifies a Simplified Chinese Noto Sans font file used for burned subtitles.",
    },
    {
        "type": "font_download",
        "url": "https://fonts.gstatic.com/s/notosanssc/v41/k3kCo84MPvpLmixcA63oeAL7Iqp5IZJF9bmaG9_FnYw.ttf",
        "status": 200,
        "response_sha256": "450625c8d46ab3df97b7904ded955ec2746d17ec76740cb1e91d1ba63a0f89af",
        "used": True,
        "note": "Noto Sans SC TrueType font, downloaded for local subtitle rendering.",
    },
]


def run(command: list[str], *, capture: bool = False) -> subprocess.CompletedProcess:
    return subprocess.run(
        command,
        check=True,
        text=True,
        stdout=subprocess.PIPE if capture else None,
        stderr=subprocess.PIPE if capture else None,
    )


def probe_duration(path: Path) -> float:
    result = run(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            str(path),
        ],
        capture=True,
    )
    return float(result.stdout.strip())


def srt_time(seconds: float) -> str:
    ms = round(seconds * 1000)
    hours, ms = divmod(ms, 3_600_000)
    minutes, ms = divmod(ms, 60_000)
    secs, ms = divmod(ms, 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{ms:03d}"


async def synthesize_all(proxy: str) -> list[dict]:
    details = []
    for utterance in UTTERANCES:
        n = utterance["segment"]
        mp3 = SCRATCH / f"narration_{n}.mp3"
        wav = SCRATCH / f"narration_{n}.wav"
        started = time.perf_counter()
        communication = edge_tts.Communicate(
            utterance["text"],
            voice=VOICE,
            rate=RATE,
            pitch="+0Hz",
            boundary="SentenceBoundary",
            proxy=proxy,
        )
        audio_bytes = bytearray()
        sentence_boundaries = []
        async for message in communication.stream():
            if message["type"] == "audio":
                audio_bytes.extend(message["data"])
            elif message["type"] == "SentenceBoundary":
                sentence_boundaries.append(
                    {
                        "offset": message["offset"] / 10_000_000,
                        "duration": message["duration"] / 10_000_000,
                        "text": message["text"],
                    }
                )
        if not sentence_boundaries or "".join(x["text"] for x in sentence_boundaries) != utterance["text"]:
            raise RuntimeError(f"TTS sentence boundaries do not cover segment {n} verbatim")
        mp3.write_bytes(audio_bytes)
        run(
            [
                "ffmpeg",
                "-hide_banner",
                "-loglevel",
                "error",
                "-y",
                "-i",
                str(mp3),
                "-ac",
                "1",
                "-ar",
                str(SAMPLE_RATE),
                "-c:a",
                "pcm_s16le",
                str(wav),
            ]
        )
        details.append(
            {
                **utterance,
                "mp3": mp3,
                "wav": wav,
                "duration": probe_duration(wav),
                "sentence_boundaries": sentence_boundaries,
                "synthesis_elapsed_seconds": time.perf_counter() - started,
                "mp3_sha256": hashlib.sha256(mp3.read_bytes()).hexdigest(),
            }
        )
    return details


def assemble_narration(details: list[dict]) -> tuple[Path, list[dict]]:
    timeline = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
    narration_data = []
    for item in details:
        with wave.open(str(item["wav"]), "rb") as wf:
            if wf.getframerate() != SAMPLE_RATE or wf.getnchannels() != 1 or wf.getsampwidth() != 2:
                raise RuntimeError("Unexpected converted narration format")
            pcm = np.frombuffer(wf.readframes(wf.getnframes()), dtype="<i2").astype(np.float32)
        peak = float(np.max(np.abs(pcm))) if len(pcm) else 0.0
        if peak < 1:
            raise RuntimeError(f"Silent TTS chunk for segment {item['segment']}")
        pcm *= (10 ** (-8.0 / 20.0) * 32767.0) / peak
        fade = min(round(0.08 * SAMPLE_RATE), len(pcm) // 4)
        if fade:
            pcm[:fade] *= np.linspace(0.0, 1.0, fade, endpoint=False, dtype=np.float32)
            pcm[-fade:] *= np.linspace(1.0, 0.0, fade, endpoint=False, dtype=np.float32)
        offset = round(item["start"] * SAMPLE_RATE)
        end = offset + len(pcm)
        chapter = CHAPTERS[item["segment"] - 1]
        if end > round(float(chapter["end"]) * SAMPLE_RATE):
            raise RuntimeError(f"Narration runs past segment {item['segment']}")
        for window in ORIGINAL_SOUND_WINDOWS[item["segment"]]:
            if item["start"] < window["end"] and end / SAMPLE_RATE > window["start"]:
                raise RuntimeError(f"Narration overlaps sound window in segment {item['segment']}")
        timeline[offset:end] += pcm
        item["end"] = end / SAMPLE_RATE
        narration_data.append(
            {
                "start": item["start"],
                "end": item["end"],
                "text": item["text"],
            }
        )

    stereo = np.column_stack((timeline, timeline))
    stereo = np.clip(stereo, -32768, 32767).astype("<i2")
    path = OUT / "narration.wav"
    with wave.open(str(path), "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(SAMPLE_RATE)
        wf.writeframes(stereo.tobytes())
    return path, narration_data


def write_subtitles(details: list[dict]) -> Path:
    cues = []
    for item in details:
        chapter = CHAPTERS[item["segment"] - 1]
        for sentence_index, sentence in enumerate(item["sentence_boundaries"]):
            cue_start = item["start"] + sentence["offset"]
            cue_end = min(cue_start + sentence["duration"], item["end"], float(chapter["end"]))
            if sentence_index + 1 < len(item["sentence_boundaries"]):
                next_start = item["start"] + item["sentence_boundaries"][sentence_index + 1]["offset"]
                cue_end = min(cue_end, next_start)
            lines = textwrap.wrap(sentence["text"], width=22, break_long_words=True, break_on_hyphens=False)
            caption = "\n".join(lines)
            cues.append(
                f"{len(cues) + 1}\n{srt_time(cue_start)} --> {srt_time(cue_end)}\n{caption}\n"
            )
    path = OUT / "subtitles.srt"
    path.write_text("\n".join(cues), encoding="utf-8")
    return path


def render_video(narration: Path, subtitles: Path, duration: float) -> float:
    subtitle_path = str(subtitles).replace("\\", "\\\\").replace(":", "\\:").replace("'", "\\'")
    font_path = str(FONT_DIR).replace("\\", "\\\\").replace(":", "\\:").replace("'", "\\'")
    video_filter = (
        f"subtitles='{subtitle_path}':fontsdir='{font_path}':"
        "force_style='FontName=Noto Sans SC,FontSize=22,PrimaryColour=&H00FFFFFF,"
        "OutlineColour=&H00000000,BorderStyle=1,Outline=1.5,Shadow=0,MarginV=22'"
    )
    audio_filter = (
        f"[1:a]atrim=0:{duration:.6f},asetpts=PTS-STARTPTS[original];"
        "[2:a]asplit=2[narr_sc][narr_mix];"
        "[original][narr_sc]sidechaincompress=threshold=0.04:ratio=4:attack=35:release=350[ducked];"
        "[ducked][narr_mix]amix=inputs=2:duration=first:dropout_transition=0:normalize=0,"
        "alimiter=limit=0.95:attack=5:release=60[aout]"
    )
    output = OUT / "final.mp4"
    started = time.perf_counter()
    run(
        [
            "ffmpeg",
            "-hide_banner",
            "-loglevel",
            "error",
            "-y",
            "-i",
            str(SOURCE),
            "-i",
            str(SOURCE),
            "-i",
            str(narration),
            "-filter_complex",
            audio_filter,
            "-map",
            "0:v:0",
            "-map",
            "[aout]",
            "-vf",
            video_filter,
            "-t",
            f"{duration:.6f}",
            "-r",
            "30",
            "-fps_mode",
            "cfr",
            "-c:v",
            "libx264",
            "-preset",
            "slow",
            "-crf",
            "18",
            "-pix_fmt",
            "yuv420p",
            "-c:a",
            "aac",
            "-b:a",
            "192k",
            "-ar",
            str(SAMPLE_RATE),
            "-ac",
            "2",
            "-movflags",
            "+faststart",
            str(output),
        ]
    )
    return time.perf_counter() - started


def write_segments(details: list[dict], narration_data: list[dict]) -> None:
    result = []
    for idx, chapter in enumerate(CHAPTERS):
        info = SEGMENT_INFO[idx]
        result.append(
            {
                "segment": idx + 1,
                "start": chapter["start"],
                "end": chapter["end"],
                **info,
                "narration": [narration_data[idx]],
                "original_sound_windows": ORIGINAL_SOUND_WINDOWS[idx + 1],
            }
        )
    data = {
        "audio_analysis_method": (
            "Extracted the source track to mono 48 kHz PCM with FFmpeg, then inspected quarter-second RMS and "
            "1024-point Hann spectrograms with 75% overlap using SciPy. I viewed sampled frames and compared "
            "beak/feeding movements with the source timeline. No native listening tool was available, so I did "
            "not claim to hear timbre, identify a call by ear, or assign ambiguous pulses to an individual bird."
        ),
        "segments": result,
    }
    (OUT / "segments.json").write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def write_research_log(
    started_at: str,
    phase_elapsed: dict,
    details: list[dict],
    render_elapsed: float,
    audio_similarity: list[dict],
) -> None:
    actions = [
        {
            "action": "initial_visual_and_audio_analysis",
            "elapsed_seconds": 110.477,
            "note": "Frame extraction, chapter inspection, source PCM decoding and initial RMS/spectrogram analysis; measured from the supplied task start timestamp to the first recorded shell timestamp.",
        },
        {
            "action": "first_edge_tts_dependency_resolution_attempt",
            "elapsed_seconds": 95.0,
            "note": "Pip remained in dependency resolution without installing packages; stopped after the recorded 95-second process age and switched to a direct wheel download through the proxy.",
        },
        {
            "action": "edge_tts_wheel_download_and_local_install",
            "elapsed_seconds": 15.538,
            "note": "Downloaded edge-tts 7.3.1 wheel through the configured proxy and installed it locally without dependencies.",
        },
        {
            "action": "proxy_debug_and_tts_sample",
            "elapsed_seconds": 11.12,
            "note": "First attempt used a direct connection and failed DNS in 4.40 s; explicit HTTPS_PROXY passed to Edge TTS then synthesized a 5.76 s test MP3 in 6.72 s. Only authored test text was sent.",
        },
        {
            "action": "sentence_boundary_alignment_probe",
            "elapsed_seconds": 4.0,
            "note": "Confirmed Microsoft Edge SentenceBoundary offsets and durations concatenate to the authored Mandarin exactly; used these returned boundaries for SRT timing.",
        },
        {
            "action": "font_download",
            "elapsed_seconds": 4.536,
            "note": "Downloaded the Noto Sans SC TrueType font for local subtitle rendering.",
        },
        {
            "action": "aiohttp_and_cli_dependencies_install",
            "elapsed_seconds": 120.0,
            "note": "Installed aiohttp and its runtime dependencies plus tabulate through pip and the configured proxy.",
        },
        {
            "action": "narration_synthesis_and_conversion",
            "elapsed_seconds": phase_elapsed["tts"],
            "note": "Six Mandarin passages synthesized with zh-CN-XiaoxiaoNeural at -5% rate; MP3s converted to 48 kHz PCM.",
        },
        {
            "action": "superseded_full_render_passes",
            "elapsed_seconds": 71.45 + 62.98 + 59.46 + 70.17,
            "note": "Four earlier full render passes took 71.45 s, 62.98 s, 59.46 s, and 70.17 s respectively; subtitle size and placement were revised after visual review. Per-pass phase timing is retained in generation.prior_attempts.",
        },
        {
            "action": "narration_assembly_and_metadata",
            "elapsed_seconds": phase_elapsed["assembly"],
            "note": "Created the exact-length stereo PCM narration bed, SRT subtitles, and segment metadata.",
        },
        {
            "action": "video_render",
            "elapsed_seconds": render_elapsed,
            "note": "Burned subtitles, retained the source audio with voice-triggered ducking, and encoded H.264/AAC at 30 fps.",
        },
        {
            "action": "output_validation",
            "elapsed_seconds": phase_elapsed["validation"],
            "note": "Checked stream codecs, dimensions, duration, chapter coverage, narration sample count and required output files.",
        },
    ]
    packages = {
        "edge-tts": "7.3.1",
        "aiohttp": "3.14.5",
        "certifi": "2023.11.17",
        "tabulate": "0.10.0",
        "aiohappyeyeballs": "2.7.1",
        "aiosignal": "1.4.0",
        "attrs": "26.1.0",
        "frozenlist": "1.8.0",
        "idna": "3.20",
        "multidict": "7.2.1",
        "propcache": "0.5.4",
        "typing_extensions": "4.16.0",
        "yarl": "1.25.1",
        "numpy": np.__version__,
        "scipy": "1.11.4 (system-provided, spectrogram analysis)",
        "ffmpeg": "system-provided",
        "ffprobe": "system-provided",
        "font": "Noto Sans SC TrueType from Google Fonts CSS endpoint",
    }
    research = {
        "started_at_utc": datetime.fromtimestamp(1794909552.0251586, timezone.utc).isoformat(),
        "final_generation_started_at_utc": started_at,
        "completed_at_utc": datetime.now(timezone.utc).isoformat(),
        "elapsed_seconds_from_supplied_start": round(time.time() - 1794909552.0251586, 3),
        "elapsed_accounting_note": "Recorded command/session wall times are listed per action; exploratory visual review and source reading are covered by the initial-analysis interval and individual HTTP records.",
        "network_policy": {
            "proxy": "Used HTTP_PROXY/HTTPS_PROXY/ALL_PROXY from the environment; Edge TTS receives the HTTPS_PROXY value explicitly.",
            "source_media_uploaded": False,
            "external_speech_input": "Only the six authored Chinese narration passages and a short authored test sentence.",
            "blocked_or_failed_targets_retried_via_alternate_hosts": False,
            "other_recognition_models_or_subagents_used": False,
        },
        "tool_choices": {
            "vision": "FFmpeg sampled frames/contact sheets and local image viewing; no image recognition model.",
            "audio": "FFmpeg PCM decode, NumPy RMS, SciPy spectrogram; no native listening tool.",
            "tts": {
                "client": "edge-tts 7.3.1",
                "service": "Microsoft Edge neural speech endpoint",
                "voice": VOICE,
                "rate": RATE,
                "proxy_argument": "HTTPS_PROXY passed to edge_tts.Communicate(proxy=...).",
                "media_upload": False,
            },
            "mixing": "FFmpeg sidechaincompress lowers the unchanged source audio only while narration is active, followed by a limiter; no music added.",
            "subtitles": "UTF-8 SRT burned with FFmpeg/libass and local Noto Sans SC.",
        },
        "dependencies": packages,
        "events": RESEARCH_EVENTS,
        "generation": {
            "prior_attempts": [
                {
                    "reason_superseded": "Initial captions were shortened and the font directory included non-font outputs.",
                    "wall_seconds": 71.45,
                    "tts_seconds": 29.233,
                    "assembly_seconds": 1.018,
                    "render_seconds": 33.944,
                    "validation_seconds": 0.264,
                },
                {
                    "reason_superseded": "Full transcript was restored, then sentence-level subtitle timing was added after preview.",
                    "wall_seconds": 62.98,
                    "tts_seconds": 21.714,
                    "assembly_seconds": 1.095,
                    "render_seconds": 33.342,
                    "validation_seconds": 0.254,
                },
                {
                    "reason_superseded": "Sentence timing was correct, but preview showed that a smaller subtitle size would reduce overlap with the birds.",
                    "wall_seconds": 59.46,
                    "tts_seconds": 20.292,
                    "assembly_seconds": 1.068,
                    "render_seconds": 31.138,
                    "validation_seconds": 0.173,
                },
                {
                    "reason_superseded": "The smaller subtitle was readable, but segment 1 has a clean lower letterbox area and should not use top placement; adjacent sentence cues also had a 50 ms overlap.",
                    "wall_seconds": 70.17,
                    "tts_seconds": 25.604,
                    "assembly_seconds": 0.408,
                    "render_seconds": 31.734,
                    "validation_seconds": 5.727,
                },
            ],
            "tts_clips": [
                {
                    "segment": item["segment"],
                    "seconds": round(item["synthesis_elapsed_seconds"], 3),
                    "audio_duration_seconds": round(item["duration"], 3),
                    "mp3_sha256": item["mp3_sha256"],
                    "text": item["text"],
                    "sentence_boundaries": [
                        {
                            "offset_seconds": round(boundary["offset"], 3),
                            "duration_seconds": round(boundary["duration"], 3),
                            "text": boundary["text"],
                        }
                        for boundary in item["sentence_boundaries"]
                    ],
                }
                for item in details
            ],
            "narration_wav_samples": TOTAL_SAMPLES,
            "narration_wav_sample_rate": SAMPLE_RATE,
            "narration_wav_peak_dbfs": round(
                20 * math.log10(max(1.0, float(np.max(np.abs(np.fromfile(OUT / "narration.wav", dtype="<i2"))))) / 32768.0),
                2,
            ),
            "render_seconds": round(render_elapsed, 3),
            "render_duration_seconds": probe_duration(OUT / "final.mp4"),
            "original_audio_window_similarity_after_codec_alignment": audio_similarity,
        },
        "subjective_listening_limit": "The synthesized track was not auditioned because no native listening tool was available; naturalness is not claimed as personally heard. The chosen voice is a neural Mandarin voice at near-normal rate, with no time-stretching.",
        "actions": actions,
    }
    (OUT / "research_log.json").write_text(json.dumps(research, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def check_original_audio_windows() -> list[dict]:
    source_raw = SCRATCH / "source_stereo.raw"
    final_raw = SCRATCH / "final_stereo.raw"
    for source, target in ((SOURCE, source_raw), (OUT / "final.mp4", final_raw)):
        run(
            [
                "ffmpeg",
                "-hide_banner",
                "-loglevel",
                "error",
                "-y",
                "-i",
                str(source),
                "-vn",
                "-ac",
                "2",
                "-ar",
                str(SAMPLE_RATE),
                "-f",
                "s16le",
                str(target),
            ]
        )
    original = np.fromfile(source_raw, dtype="<i2").reshape(-1, 2).astype(np.float32)
    final = np.fromfile(final_raw, dtype="<i2").reshape(-1, 2).astype(np.float32)
    lag = round(0.005 * SAMPLE_RATE)
    results = []
    for segment, windows in ORIGINAL_SOUND_WINDOWS.items():
        window = windows[0]
        begin = round(window["start"] * SAMPLE_RATE)
        finish = min(round(window["end"] * SAMPLE_RATE), len(original), len(final))
        correlations = []
        for channel in range(2):
            source_window = original[begin : finish - lag : 4, channel]
            final_window = final[begin + lag : finish : 4, channel]
            source_window = source_window - source_window.mean()
            final_window = final_window - final_window.mean()
            corr = float(
                np.dot(source_window, final_window)
                / (np.linalg.norm(source_window) * np.linalg.norm(final_window) + 1e-9)
            )
            correlations.append(round(corr, 3))
        results.append(
            {
                "segment": segment,
                "window": window,
                "codec_delay_alignment_seconds": lag / SAMPLE_RATE,
                "channel_correlations": correlations,
            }
        )
    return results


def validate_outputs(details: list[dict], narration: Path) -> tuple[float, list[dict]]:
    started = time.perf_counter()
    required = [OUT / "final.mp4", narration, OUT / "subtitles.srt", OUT / "segments.json", FONT]
    missing = [str(path) for path in required if not path.is_file() or path.stat().st_size == 0]
    if missing:
        raise RuntimeError(f"Missing output(s): {missing}")
    with wave.open(str(narration), "rb") as wf:
        if wf.getframerate() != SAMPLE_RATE or wf.getnframes() != TOTAL_SAMPLES or wf.getnchannels() != 2:
            raise RuntimeError("Narration WAV is not aligned to the full timeline")
    if abs(probe_duration(OUT / "final.mp4") - TOTAL_DURATION) > 0.5:
        raise RuntimeError("Final duration differs from the chapter timeline by more than 0.5 seconds")
    probe = run(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "stream=codec_type,codec_name,width,height,r_frame_rate,sample_rate,channels",
            "-of",
            "json",
            str(OUT / "final.mp4"),
        ],
        capture=True,
    )
    streams = json.loads(probe.stdout)["streams"]
    video = next(stream for stream in streams if stream["codec_type"] == "video")
    audio = next(stream for stream in streams if stream["codec_type"] == "audio")
    if video["codec_name"] != "h264" or video["width"] < 1280 or video["height"] < 720 or video["r_frame_rate"] != "30/1":
        raise RuntimeError(f"Unexpected video output stream: {video}")
    if audio["codec_name"] != "aac" or audio["sample_rate"] != "48000":
        raise RuntimeError(f"Unexpected final audio stream: {audio}")
    audio_similarity = check_original_audio_windows()
    return time.perf_counter() - started, audio_similarity


async def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    SCRATCH.mkdir(parents=True, exist_ok=True)
    started_at = datetime.now(timezone.utc).isoformat()
    proxy = os.environ.get("HTTPS_PROXY") or os.environ.get("HTTP_PROXY") or os.environ.get("ALL_PROXY")
    if not proxy or not proxy.startswith(("http://", "https://")):
        raise RuntimeError("An HTTP(S) proxy is required; no direct connection will be attempted")
    FONT_DIR.mkdir(parents=True, exist_ok=True)
    if not FONT.is_file():
        raise RuntimeError(f"Subtitle font not found: {FONT}")

    tts_started = time.perf_counter()
    details = await synthesize_all(proxy)
    tts_elapsed = time.perf_counter() - tts_started

    assembly_started = time.perf_counter()
    narration, narration_data = assemble_narration(details)
    subtitles = write_subtitles(details)
    write_segments(details, narration_data)
    assembly_elapsed = time.perf_counter() - assembly_started

    render_elapsed = render_video(narration, subtitles, TOTAL_DURATION)
    validation_elapsed, audio_similarity = validate_outputs(details, narration)
    write_research_log(
        started_at,
        {"tts": tts_elapsed, "assembly": assembly_elapsed, "validation": validation_elapsed},
        details,
        render_elapsed,
        audio_similarity,
    )
    print(
        json.dumps(
            {
                "tts_seconds": round(tts_elapsed, 3),
                "assembly_seconds": round(assembly_elapsed, 3),
                "render_seconds": round(render_elapsed, 3),
                "validation_seconds": round(validation_elapsed, 3),
                "final_duration_seconds": probe_duration(OUT / "final.mp4"),
            },
            ensure_ascii=False,
        )
    )


if __name__ == "__main__":
    asyncio.run(main())
