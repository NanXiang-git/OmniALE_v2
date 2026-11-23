# 《Cosmos Laundromat: First Cycle》普通话译制

`dub_zh.mp4` 是完整的 79 秒译制成片，保留 1280×536、24 fps 的 1,896 帧。中英文字幕烧录于画面下部。最后一组镜头的字幕向左移动，为弗兰克的口部和表情让出空间。`mobile_mix.wav` 是同一译制的 48 kHz 单声道版。

| 文件 | 内容 |
| --- | --- |
| `mix.wav` | 48 kHz、24 bit 立体声影院混音 |
| `stems/victor.wav`、`stems/franck.wav` | 与影片同长、已施加最终音量的两条角色分轨 |
| `effects_track.wav` | 以 0 dB 全局增益交付的原始 M&E |
| `subtitles_zh.srt`、`subtitles_en.srt`、`bilingual.ass` | 两种字幕及实际烧录的 ASS |
| `transcript_en.txt`、`transcript_zh.txt` | 按出现顺序排列的源语转录和译文 |
| `source_events.json`、`translation_plan.json` | 源片证据区间与实际配音区间 |
| `continuity_ledger.json` | C01–C08 的时间证据、归属和取舍 |
| `speakers.json`、`voice_provenance.json` | 角色、声音实例和本地声音来源 |
| `project/`、`rebuild.py`、`rebuild.json` | 分句素材、音频编辑参数和离线重建入口 |

## 声音和来源

维克托和弗兰克使用本地 F5-TTS v1 Base 与 Vocos。声线由本题原混音里相应角色的独立发声区间条件化。`project/references.json` 与 `project/takes.json` 记录参考台词、区间、实际采用的分句提示词、随机种子和素材哈希。角色轨使用这些生成的普通话录音，经剪辑、节拍调整、淡化和电平控制。72.43–73.17 秒弗兰克的干笑从对齐的源混音与 M&E 差分中保留。16.72 秒附近短促上扬的应声按弗兰克的回应处理。这个片段的转录包含对白与干笑标记。

*Cosmos Laundromat: First Cycle* 原画面、源音频及 M&E 来自 Blender Foundation / Blender Studio，CC BY 4.0。使用提供的 02:48–04:07 片段及其素材。[项目](https://studio.blender.org/projects/cosmos-laundromat/) · [许可](https://creativecommons.org/licenses/by/4.0/)

## 离线重建

使用 Linux、Python 3、NumPy、SciPy、SoundFile 和 FFmpeg。FFmpeg 需要 libx264、libass、librubberband 和 AAC 编码器。字幕字体为 WenQuanYi Micro Hei 与 DejaVu Sans，使用 Linux 的 Fontconfig 查找。运行时读取提供的 `source.mp4`、`original.wav`、`music_effects.wav` 以及项目内的分句素材，重新做角色剪辑、混音、单声道处理和字幕烧录。所选 F5-TTS 分句作为 24 kHz WAV 随工程交付，重建运行时直接读取这些分句。

```bash
python3 /workspace/submission/rebuild.py \
  --input /candidate/input \
  --submission /workspace/submission \
  --output /workspace/scratch/rebuilt/dub_zh.mp4
```

新 MP4 和 WAV 写入输出路径所在目录，包括 `stems/`。临时文件使用 `/workspace/scratch`，可通过 `--scratch` 指定另一目录。 `rebuild.json` 提供同一入口的参数数组。

## 本地验收

| 交付 | 综合响度 | 真峰值 |
| --- | ---: | ---: |
| 影片音轨 | −15.9 LUFS | −3.1 dBTP |
| `mix.wav` | −15.9 LUFS | −3.1 dBTP |
| `mobile_mix.wav` | −18.1 LUFS | −2.3 dBTP |

- 源片与成片均为 79.000 秒。按公开画面规则比较上部区域，1,896 帧全部通过。抽查成片可见两种烧录字幕。
- 两种 SRT 各 26 条，行数、行长、时长及中文阅读速度均在合同范围内。每种语言与 ASS 的可见时间及文本均完全一致。
- 24 个源编号对应 25 个计划事件，包含弗兰克的独立干笑。8 项审计、角色映射及交付 JSON 通过结构检查。两条角色轨分别有 100% 的非静音采样落在自己的计划区间。
- M&E 采用 0 dB 增益，逐样本与输入一致。影院混音与三条交付分轨之和逐样本一致。手机版采用 +0.8 dB 增益和指定限幅链，波形相对误差约 0.000073%。单声道语音识别复核找到了三次“一分钟”和跨镜头的“不能……这么做”。
- 按 `rebuild.json` 在独立目录完成一次重建，MP4 与五个交付 WAV 的 SHA-256 逐个一致。本地结果涵盖技术检查，公开规则所述的人声音色、表演和综合评分待独立评审。
