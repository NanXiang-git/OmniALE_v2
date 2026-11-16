#!/usr/bin/env python3
"""Generate narration, synchronized subtitles, audit JSON, and the final bird video."""
import asyncio
import json
import os
import subprocess
import wave
from pathlib import Path

import edge_tts
import numpy as np
from scipy.io import wavfile

ROOT = Path('/workspace')
OUT = ROOT / 'submission'
SCRATCH = ROOT / 'scratch' / 'tts'
SOURCE = Path('/candidate/birds_source.mp4')
FPS = 30
RATE = 48000
DURATION = 185.4666666667
TOTAL = round(DURATION * RATE)
VOICE = 'zh-CN-XiaoxiaoNeural'
PROXY = os.environ.get('HTTPS_PROXY') or os.environ.get('https_proxy')

CHAPTERS = [
    (0.0, 46.066667),
    (46.066667, 72.8),
    (72.8, 100.766667),
    (100.766667, 123.966667),
    (123.966667, 158.466667),
    (158.466667, 185.466667),
]

# Start times are chosen to leave an uninterrupted original-audio window in each chapter.
LINES = [
    (6.0, 1, '這只短翅莺呈褐色，喉胸较浅，尾羽也比较长。画面里它被人托在手上，姿态安静。'),
    (24.0, 1, '音轨前段有重复的窄带谐波声纹；只看频谱，无法确认声音是否来自这只鸟。'),
    (58.0, 2, '枝叶遮住了主体，这里暂认作夜莺。音轨有间歇谐波脉冲，画面不足以确认声音来自这只鸟。'),
    (76.5, 3, '枝上的小鸟胸腹浅、体侧微带橄榄色，暂认作灰纹鹟。它几次转头，仍停在枝上；原声里有成组谐波，但仅凭频谱不能确认声音来自它。'),
    (104.0, 4, '镜头对着芦苇，鸟没有进入清晰焦点；这里暂认作芦苇莺。原声电平很低，无法据频谱确认鸣声类型或来源。'),
    (128.0, 5, '南方巨鹱的成鸟俯身喂食；地上的雏鸟张嘴接食，身上覆盖着绒羽。'),
    (143.5, 5, '这个时段原声较弱，微弱信号不能仅凭波形归到这对鸟身上。'),
    (162.5, 6, '这些白色头颈、深色长翅的海鸟，暂认作黑眉信天翁。成鸟与雏鸟散布草地；一只成鸟抬头张嘴，原声里有多组谐波脉冲。'),
]

SPECIES = [
    dict(chinese_name='短翅莺', english_name="Cetti's Warbler", scientific_name='Cettia cetti', confidence=43,
         visual_evidence=[dict(start=1, end=4, description='手持近景；褐色上体、浅色喉胸、细嘴和较长尾羽可见，物种细节仍有限。')],
         audio_evidence=[dict(start=1, end=5, description='频谱见重复窄带谐波成分；无原生听音工具，无法判定声音是否来自画面中的个体。')],
         windows=[dict(start=1, end=5)]),
    dict(chinese_name='夜莺', english_name='Common Nightingale', scientific_name='Luscinia megarhynchos', confidence=16,
         visual_evidence=[dict(start=46.1, end=72.8, description='密集绿叶和枝条遮挡主体，未能观察到可用于定种的形态。')],
         audio_evidence=[dict(start=53.5, end=56.5, description='低电平原声中可见间歇性谐波脉冲；没有听音能力，不能做音色或物种级声纹判断。')],
         windows=[dict(start=53.5, end=56.5)]),
    dict(chinese_name='灰纹鹟', english_name='Grey-streaked Flycatcher', scientific_name='Muscicapa griseisticta', confidence=38,
         visual_evidence=[dict(start=75, end=100, description='小型鸟停在裸枝；浅色胸腹、较深头背、细嘴和长尾可见，羽纹不够清楚以作可靠定种。')],
         audio_evidence=[dict(start=91.5, end=94.5, description='可见较强的成组谐波条纹；未用听音工具，叫声类别及个体归属不确定。')],
         windows=[dict(start=96, end=99.5)]),
    dict(chinese_name='芦苇莺', english_name='Eurasian Reed Warbler', scientific_name='Acrocephalus scirpaceus', confidence=12,
         visual_evidence=[dict(start=100.8, end=124, description='芦苇及穗状花序占据画面，镜头失焦，没有清晰鸟体。')],
         audio_evidence=[dict(start=109, end=112, description='低电平原声；频谱不足以判别鸣声种类。不能将环境声归给某物种。')],
         windows=[dict(start=120.5, end=123.8)]),
    dict(chinese_name='南方巨鹱', english_name='Southern Giant Petrel', scientific_name='Macronectes giganteus', confidence=68,
         visual_evidence=[dict(start=133, end=156, description='灰褐色成鸟与覆绒雏鸟相邻；成鸟俯身，雏鸟张嘴，符合喂食动作。')],
         audio_evidence=[dict(start=137.5, end=140.5, description='喂食动作附近保留原声；没有听音工具，不能确认其中是否为巨鹱叫声。')],
         windows=[dict(start=137.5, end=140.5)]),
    dict(chinese_name='黑眉信天翁', english_name='Black-browed Albatross', scientific_name='Thalassarche melanophris', confidence=63,
         visual_evidence=[dict(start=159, end=185, description='群聚的大型海鸟呈白色头颈和腹部、深色长翅，淡色粗嘴；成鸟抬头张嘴。')],
         audio_evidence=[dict(start=174, end=177, description='原声有成组谐波脉冲，能量明显；无听音能力，不能证明每个声音均来自可见的信天翁。')],
         windows=[dict(start=180, end=183)]),
]


def run(args, **kwargs):
    subprocess.run(args, check=True, **kwargs)


async def synthesize():
    SCRATCH.mkdir(parents=True, exist_ok=True)
    for i, (start, seg, text) in enumerate(LINES, 1):
        mp3 = SCRATCH / f'line_{i:02}.mp3'
        tts = edge_tts.Communicate(text, VOICE, rate='-4%', proxy=PROXY)
        await tts.save(str(mp3))
        run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(mp3),
             '-ac', '1', '-ar', str(RATE), '-c:a', 'pcm_s16le', str(SCRATCH / f'line_{i:02}.wav')])


def timestamp(sec):
    ms = int(round(sec * 1000))
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f'{h:02}:{m:02}:{s:02},{ms:03}'


def main():
    asyncio.run(synthesize())
    narration = np.zeros(TOTAL, dtype=np.float64)
    line_entries = []
    for i, (start, seg, text) in enumerate(LINES, 1):
        sr, pcm = wavfile.read(SCRATCH / f'line_{i:02}.wav')
        assert sr == RATE
        if pcm.ndim > 1:
            pcm = pcm.mean(axis=1)
        samples = pcm.astype(np.float64) / 32768.0
        # Trim only digital leading/trailing silence while keeping the natural spoken pauses.
        active = np.flatnonzero(np.abs(samples) > 0.002)
        if active.size:
            lo, hi = max(0, int(active[0]) - 1200), min(len(samples), int(active[-1]) + 2400)
            samples = samples[lo:hi]
        peak = np.max(np.abs(samples)) if len(samples) else 0
        if peak > 0:
            samples *= min(1.7, 0.34 / peak)
        at = round(start * RATE)
        end = at + len(samples)
        chap_start, chap_end = CHAPTERS[seg - 1]
        if end > round(chap_end * RATE):
            raise RuntimeError(f'Line {i} exceeds segment {seg}: {end / RATE:.2f} > {chap_end:.2f}')
        narration[at:end] += samples
        line_entries.append(dict(segment=seg, start=at / RATE, end=end / RATE, text=text))

    narrator_i16 = np.clip(narration, -1, 1)
    wavfile.write(OUT / 'narration.wav', RATE, np.rint(narrator_i16 * 32767).astype(np.int16))

    # Load the untouched original soundtrack and apply only per-chapter gain and narration ducking.
    raw = subprocess.check_output(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-i', str(SOURCE),
        '-vn', '-ac', '2', '-ar', str(RATE), '-f', 'f32le', '-'])
    original = np.frombuffer(raw, dtype='<f4').reshape(-1, 2).astype(np.float64)
    if len(original) < TOTAL:
        original = np.pad(original, ((0, TOTAL - len(original)), (0, 0)))
    original = original[:TOTAL]
    gains = [0.54, 1.0, 0.66, 4.5, 3.2, 0.68]
    gain_curve = np.empty(TOTAL, dtype=np.float64)
    for (a, b), gain in zip(CHAPTERS, gains):
        gain_curve[round(a * RATE):round(b * RATE)] = gain
    fade = round(0.2 * RATE)
    for boundary, left, right in zip([c[1] for c in CHAPTERS[:-1]], gains[:-1], gains[1:]):
        center = round(boundary * RATE)
        lo, hi = max(0, center - fade // 2), min(TOTAL, center + fade // 2)
        gain_curve[lo:hi] = np.linspace(left, right, hi - lo)
    original *= gain_curve[:, None]
    # Smooth ducking keeps narration legible while leaving the continuous original track present.
    level = np.abs(narration)
    env = np.convolve(level, np.ones(4800) / 4800, mode='same')
    duck = 1.0 - 0.68 * np.clip(env / 0.025, 0, 1)
    original *= duck[:, None]
    mixed = original + narration[:, None]
    # Gentle soft limiting prevents the louder source chapters from clipping.
    mixed = np.tanh(1.35 * mixed) / 1.35
    mix_path = SCRATCH / 'mixed.wav'
    with wave.open(str(mix_path), 'wb') as wf:
        wf.setnchannels(2); wf.setsampwidth(2); wf.setframerate(RATE)
        wf.writeframes(np.rint(np.clip(mixed, -1, 1) * 32767).astype('<i2').tobytes())

    srt = []
    for idx, entry in enumerate(line_entries, 1):
        srt.extend([str(idx), f"{timestamp(entry['start'])} --> {timestamp(entry['end'])}", entry['text'], ''])
    (OUT / 'subtitles.srt').write_text('\n'.join(srt), encoding='utf-8')

    for i, sp in enumerate(SPECIES, 1):
        # Narration is populated from the actual spoken lines, not a separate manuscript.
        sp['narration'] = [e for e in line_entries if e['segment'] == i]
        for entry in sp['narration']:
            for window in sp['windows']:
                if entry['start'] < window['end'] and entry['end'] > window['start']:
                    raise RuntimeError(f"Narration overlaps original sound window in segment {i}")
        sp['sources'] = []
        sp['original_sound_windows'] = sp.pop('windows')
    segments = dict(
        audio_analysis_method='本地解码原音为16 kHz单声道，逐段查看波形、短时RMS和0–8 kHz声谱图；没有原生听音工具，未调用语音识别、鸟声识别或其他模型。因此频谱只用于描述谐波/脉冲与能量，不能确定音色、叫声种类或声源归属。',
        segments=[dict(segment=i, start=a, end=b, **SPECIES[i-1]) for i, (a, b) in enumerate(CHAPTERS, 1)],
    )
    (OUT / 'segments.json').write_text(json.dumps(segments, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

    # Burn captions while stream-copying neither video nor audio, preserving the source timeline.
    style = "FontName=Noto Sans SC Thin,FontSize=22,PrimaryColour=&H00FFFFFF,OutlineColour=&H99000000,BorderStyle=1,Outline=2,Shadow=0,MarginV=8"
    vf = f"subtitles={OUT / 'subtitles.srt'}:fontsdir={OUT / 'fonts'}:force_style='{style}'"
    run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(SOURCE), '-i', str(mix_path),
         '-map', '0:v:0', '-map', '1:a:0', '-vf', vf, '-r', str(FPS), '-c:v', 'libx264', '-preset', 'medium',
         '-crf', '19', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-t', str(DURATION),
         '-movflags', '+faststart', str(OUT / 'final.mp4')])


if __name__ == '__main__':
    main()
