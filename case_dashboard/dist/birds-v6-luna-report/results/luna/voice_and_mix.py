#!/usr/bin/env python3
"""Generate Mandarin narration, a full-length silent-padded WAV, and SRT."""

import json
import os
import subprocess
import tempfile
import wave
from pathlib import Path

import numpy as np
from scipy.signal import resample_poly


OUT = Path(__file__).resolve().parent
SCRATCH = Path("/workspace/scratch")
SOURCE = Path("/candidate/birds_source.mp4")
VIDEO_DURATION = 185.466667
SAMPLE_RATE = 48000

SEGMENTS = [
    {
        "segment": 1, "start": 0.0, "end": 46.066667,
        "chinese_name": "加州鸫鹛（暂定）", "english_name": "California Thrasher",
        "scientific_name": "Toxostoma redivivum", "confidence": 55,
        "visual_evidence": [{"start": 0.0, "end": 46.066667,
            "description": "手持近拍一只暖褐色长尾鸟；嘴细长，略向下弯，喉胸较浅。画面未见明显叫鸣动作。"}],
        "audio_evidence": [{"start": 0.0, "end": 46.066667,
            "description": "已解码原始单声道采样并查看波形与0至8 kHz声谱，片段能量较高；没有可用的直接听音工具，不能据此确认具体叫声或声源。"}],
        "narration_start": 5.5,
        "narration_text": "镜头里这只长尾褐鸟，暂按加州鸫鹛辨认。它有细长略弯的嘴和暖褐色羽衣，安静地停在人的手上。原声有连续的背景声，来源无法确认。",
        "sound_window": [29.0, 32.2],
        "sources": [{"url": "https://www.audubon.org/field-guide/bird/california-thrasher",
            "supports": "核对英文名与学名；页面提到该种常见于加州灌丛地带。片中物种判断仍是依据外形作出的暂定识别。"}],
    },
    {
        "segment": 2, "start": 46.066667, "end": 72.8,
        "chinese_name": "未确认的灌丛鸣禽", "english_name": "Unidentified passerine",
        "scientific_name": "Unidentified", "confidence": 0,
        "visual_evidence": [{"start": 46.066667, "end": 72.8,
            "description": "镜头对着层叠的绿色灌木，未见鸟体或可用于种级识别的特征。"}],
        "audio_evidence": [{"start": 46.066667, "end": 72.8,
            "description": "声谱呈现数组间隔相近的窄带高频音调；无法直接听音，也无法仅凭此结构确认物种及声源归属。"}],
        "narration_start": 48.5,
        "narration_text": "灌木层把鸟影遮住了，原声里重复出现几组细高音。无法看到鸣叫者，物种暂不能确认。",
        "sound_window": [67.2, 70.4],
        "sources": [],
    },
    {
        "segment": 3, "start": 72.8, "end": 100.766667,
        "chinese_name": "东菲比霸鹟", "english_name": "Eastern Phoebe",
        "scientific_name": "Sayornis phoebe", "confidence": 68,
        "visual_evidence": [{"start": 72.8, "end": 100.766667,
            "description": "一只灰褐色上体、浅色胸腹的小型鸟停在裸枝上；数次转头，间有张口动作。"}],
        "audio_evidence": [{"start": 72.8, "end": 100.766667,
            "description": "声谱可见多组短促音调，但没有直接听音，无法确认声调是否由画面中的个体发出。"}],
        "narration_start": 75.0,
        "narration_text": "这只东菲比霸鹟停在枝头，张口鸣叫后仍安静守候。原声里也有几声短促的高音。",
        "sound_window": [93.0, 96.2],
        "sources": [{"url": "https://www.audubon.org/field-guide/bird/eastern-phoebe",
            "supports": "核对英文名与学名，并参考该种的霸鹟类别信息；种级判断主要依据本片停栖个体的外观，叫声归属未作确认。"}],
    },
    {
        "segment": 4, "start": 100.766667, "end": 123.966667,
        "chinese_name": "未确认的芦苇区鸟类", "english_name": "Unidentified bird",
        "scientific_name": "Unidentified", "confidence": 0,
        "visual_evidence": [{"start": 100.766667, "end": 123.966667,
            "description": "镜头扫过密集的芦苇与草茎，没有清晰可见的鸟体。"}],
        "audio_evidence": [{"start": 100.766667, "end": 123.966667,
            "description": "原声整体低能量；声谱可见零散短时能量变化，但未能直接听音，无法确认是否为鸟声或判断声源。"}],
        "narration_start": 102.4,
        "narration_text": "芦苇遮住了水边的鸟影。原声很轻，这里听一听零散的细小声响，暂时无法锁定具体种类。",
        "sound_window": [117.0, 120.2],
        "sources": [],
    },
    {
        "segment": 5, "start": 123.966667, "end": 158.466667,
        "chinese_name": "棕鹈鹕", "english_name": "Brown Pelican",
        "scientific_name": "Pelecanus occidentalis", "confidence": 93,
        "visual_evidence": [{"start": 123.966667, "end": 158.466667,
            "description": "海岸繁殖地中可见棕色长嘴成鸟与绒羽幼鸟；成鸟低头靠近幼鸟，幼鸟在地面聚集休息。"}],
        "audio_evidence": [{"start": 123.966667, "end": 158.466667,
            "description": "原声波形在约132至136秒出现较明显的短时能量段；由于无法直接听音，不将其确定归属为鹈鹕叫声。"}],
        "narration_start": 125.5,
        "narration_text": "棕鹈鹕成鸟低头靠近幼鸟，喉囊垂在长嘴下。原声有几段短促声响，暂不能确认来源。",
        "sound_window": [140.0, 143.2],
        "sources": [{"url": "https://www.audubon.org/field-guide/bird/brown-pelican",
            "supports": "核对英文名与学名；页面将该种描述为典型海岸鸟。"}],
    },
    {
        "segment": 6, "start": 158.466667, "end": 185.466667,
        "chinese_name": "莱桑信天翁", "english_name": "Laysan Albatross",
        "scientific_name": "Phoebastria immutabilis", "confidence": 85,
        "visual_evidence": [{"start": 158.466667, "end": 185.466667,
            "description": "多只白色头颈、黑色背翼的大型海鸟与灰色绒羽幼鸟同处地面繁殖群；成鸟站立、转头，个别张口。"}],
        "audio_evidence": [{"start": 158.466667, "end": 185.466667,
            "description": "声谱可见多段频率起伏明显的鸣声样结构；无法直接听音，不能据此判断具体叫声类型或个体归属。"}],
        "narration_start": 160.7,
        "narration_text": "莱桑信天翁和灰绒幼鸟聚在一起，成鸟在地面张望。原声里高低起伏的鸣声此起彼伏。",
        "sound_window": [174.0, 177.2],
        "sources": [{"url": "https://www.audubon.org/field-guide/bird/laysan-albatross",
            "supports": "核对英文名与学名；页面提到该种在岛屿繁殖。"}],
    },
]


def run(cmd):
    subprocess.run(cmd, check=True)


def srt_time(seconds):
    ms = round(seconds * 1000)
    h, ms = divmod(ms, 3_600_000)
    m, ms = divmod(ms, 60_000)
    s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"


def main():
    SCRATCH.mkdir(parents=True, exist_ok=True)
    total_samples = round(VIDEO_DURATION * SAMPLE_RATE)
    track = np.zeros(total_samples, dtype=np.float32)
    subtitles = []
    for item in SEGMENTS:
        with tempfile.NamedTemporaryFile(suffix=".wav", dir=SCRATCH, delete=False) as f:
            temp_path = Path(f.name)
        run(["espeak-ng", "-v", "cmn", "-s", "190", "-p", "45", "-a", "165",
             "-w", str(temp_path), item["narration_text"]])
        with wave.open(str(temp_path), "rb") as wav:
            rate = wav.getframerate()
            channels = wav.getnchannels()
            width = wav.getsampwidth()
            data = wav.readframes(wav.getnframes())
        temp_path.unlink(missing_ok=True)
        if width != 2:
            raise RuntimeError(f"Unexpected eSpeak PCM width: {width}")
        speech = np.frombuffer(data, dtype="<i2").astype(np.float32) / 32768.0
        if channels > 1:
            speech = speech.reshape(-1, channels).mean(axis=1)
        if rate != SAMPLE_RATE:
            from math import gcd
            factor = gcd(rate, SAMPLE_RATE)
            speech = resample_poly(speech, SAMPLE_RATE // factor, rate // factor).astype(np.float32)
        speech *= 0.87
        start_sample = round(item["narration_start"] * SAMPLE_RATE)
        stop_sample = min(total_samples, start_sample + len(speech))
        if stop_sample < start_sample + len(speech):
            speech = speech[: stop_sample - start_sample]
        track[start_sample:stop_sample] += speech
        item["narration"] = [{"start": round(start_sample / SAMPLE_RATE, 3),
            "end": round(stop_sample / SAMPLE_RATE, 3), "text": item["narration_text"]}]
        subtitles.append((item["narration_start"], stop_sample / SAMPLE_RATE, item["narration_text"]))
        voice_start, voice_end = item["narration_start"], stop_sample / SAMPLE_RATE
        window_start, window_end = item["sound_window"]
        if voice_start < item["start"] or voice_end > item["end"]:
            raise RuntimeError(f"Narration outside chapter {item['segment']}")
        if window_end - window_start < 2 or window_start < item["start"] or window_end > item["end"]:
            raise RuntimeError(f"Invalid original sound window in chapter {item['segment']}")
        if voice_start < window_end and window_start < voice_end:
            raise RuntimeError(f"Narration overlaps original sound window in chapter {item['segment']}")
        del item["narration_start"]
        del item["narration_text"]

    peak = float(np.max(np.abs(track)))
    if peak > 0.98:
        track *= 0.98 / peak
    pcm = np.int16(np.clip(track, -1, 1) * 32767)
    with wave.open(str(OUT / "narration.wav"), "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(SAMPLE_RATE)
        wav.writeframes(pcm.tobytes())

    with (OUT / "subtitles.srt").open("w", encoding="utf-8", newline="\n") as f:
        for i, (start, end, text) in enumerate(subtitles, 1):
            f.write(f"{i}\n{srt_time(start)} --> {srt_time(end)}\n{text}\n\n")

    metadata = {
        "audio_analysis_method": "使用 ffmpeg 将原始 AAC 解码为 16 kHz 单声道 float32 PCM；用 numpy 逐章计算幅度能量，并以 scipy.signal.spectrogram 检视 0–8 kHz 频谱。没有可用的原生听音工具，也未使用语音识别或其他识别模型；对鸣声音色、物种与具体声源均不作亲耳确认。",
        "segments": SEGMENTS,
    }
    for item in SEGMENTS:
        start, end = item.pop("sound_window")
        item["original_sound_windows"] = [{"start": start, "end": end}]
    (OUT / "segments.json").write_text(json.dumps(metadata, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
