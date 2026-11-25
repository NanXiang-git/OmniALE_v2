# 《Nasty Old People》普通话译制

片段取自原片 38:00–50:00。成片保留 720 秒、1024 × 576 和 25 fps。画面底部同时显示普通话及瑞典语字幕。手机音频使用同一演出和时间轴。

| 内容 | 文件 |
| --- | --- |
| 普通话成片 | `dub_zh.mp4` |
| 影院立体声和手机单声道 | `mix.wav`、`mobile_mix.wav` |
| 音乐音效和已调电平的七个角色分轨 | `effects_track.wav`、`stems/*.wav` |
| 字幕 | `subtitles_zh.srt`、`subtitles_sv.srt`、`bilingual.ass` |
| 译制事件、原声转录和连续性记录 | `translation_plan.json`、`source_events.json`、`transcript_zh.txt`、`transcript_sv.txt`、`continuity_ledger.json` |
| 角色、音色来源和混音配置 | `speakers.json`、`voice_provenance.json`、`mix_config.json` |
| 离线工程 | `rebuild.py`、`rebuild.json`、`project/assembly.json`、`project/takes/*.flac` |

## 离线重建

在 Linux 上使用 Python 3、NumPy、SoundFile（含 libsndfile）和带 libass、libx264、AAC 编码器的 FFmpeg。字幕字体是文泉驿微米黑（WenQuanYi Micro Hei）和 DejaVu Sans。重建从输入的 `source.mp4`、`music_effects.wav` 以及工程内剪辑好的逐事件 FLAC 开始。脚本根据清单重新生成 48 kHz PCM 角色分轨及两个混音，重新烧录字幕，再编码图像和影院声音。重建过程完全离线，使用已经存入工程的演出，不需要语音模型推理。

```sh
python3 /workspace/submission/rebuild.py \
  --input /candidate/input \
  --submission /workspace/submission \
  --output /workspace/scratch/rebuilt.mp4
```

传入 `--audio-dir /workspace/scratch/rebuilt-audio` 可同时保留新生成的分轨及混音。再加 `--audio-only` 可执行纯音频重建。装配清单中的 `start_sample` 是从片段开头算起的 48 kHz 样本索引，对应译制计划的事件编号。

## 声音来源和校订

台词用本地 F5-TTS v1 Base 和 Vocos 生成。各角色用源片自身的声纹参考，详细的区间和反应声来源见声音溯源。带词的叫喊用普通话重新表演。球赛中的无词喊笑使用短的源人声残差。角色录音作了起尾编辑、音量和透视处理。字幕中的黑板标注只出现在画面上。

瑞典语转录使用源片、逐段离线识别、声学线索和镜头核对。温室的 06:09 左右、早餐的 09:48 左右以及脑图解说的部分短句，个别原词辨识较弱，事件备注保留了这些地点。音色相似度和表演的主观判定仍需听审。音乐音效来自题包的 HTDemucs 估算底轨，原有微量残留会随该轨保留。

## 交付核验

| 项目 | 实测 |
| --- | --- |
| MP4 时间线 | 720.000 秒，18,000 帧，1024 × 576，25 fps |
| 画面顺序 | 逐帧比较画面上部 68%，全部帧通过阈值 |
| 字幕 | 每种语言 95 条，SRT 与 ASS 的文本、时间一致。抽帧检查了烧录的对白字幕与屏幕文字 |
| 影院视频 | −16.4 LUFS，−2.6 dBTP |
| 影院 WAV | −16.4 LUFS，−2.6 dBTP |
| 手机 WAV | −18.8 LUFS，−2.0 dBTP |
| 分轨与波形 | 48 kHz、720 秒。七个角色分轨的非零样本全部位于各自事件窗内。底轨、逐样本加和、手机滤镜复算的相对误差均为零 |
| 原声事件与连续性记录 | 62 个源编号全部关联，96 条事件，C01–C08 各一条记录 |
| 离线重建 | 使用 `rebuild.json` 从输入和工程素材重新生成 MP4，耗时约 125 秒 |

用实际手机 WAV 抽查了十年、二十四年、两个月、夜间生长、洗澡拒绝和儿子到访的条件。个别发音和专名的自动识别结果有差异，整体音色、表演与听感仍需人工听审。

## 片源与许可

*Nasty Old People*（2009），导演 Hanna Sköld，Tangram Film。原片 38:00–50:00 片段及对齐的音源由题包提供。译制为同许可的非商业改编，采用 CC BY-NC-SA 2.5 Sweden。[原作品](https://archive.org/details/nasty-old-people) · [许可条款](https://creativecommons.org/licenses/by-nc-sa/2.5/se/)
