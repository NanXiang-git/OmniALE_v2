# 四人会议英文字幕交付

本目录含实际烧录的 `preview.mp4`、`interview.ass`、`interview.srt`、`alignment.json`、`rebuild.json` 及离线脚本。最终编辑源为 `subtitle_events.json`。共 118 个 ASS 事件、161 个 SRT 时间单元，映射覆盖 U001—U101。

字幕采用 A/B/C/D 四个固定的全宽角色槽，20px DejaVu Sans；每位最多两行，每行含标签最多 42 字符。所有新增画面均在底部 y=392—575。SRT 每行有角色前缀，按全部事件边界切分；持续文本的技术切片不代表重复说话。独立的重复回应保留独立 ASS 事件和 SRT 边界。

财务段保留 twenty five Euro、fifty million Euro，以及 should not exceed / hopefully should be less than twelve fifty Euro。最后一个金额在同一字幕事件内呈现。原稿的口头词、连续重复、自我修正及未完成词均保留，只调整了少量标点和大小写。

## 离线重建

```bash
python3 /workspace/submission/rebuild.py \
  --input /candidate/input \
  --submission /workspace/submission \
  --output /workspace/scratch/rebuilt.mp4
```

自动调用格式在 `rebuild.json.argv`，使用规定的 `{python}`、`{input}`、`{submission}`、`{output}`。输入参数可为含 source.mp4 的目录、含 input/source.mp4 的目录，或原视频文件本身。

脚本从原始 `source.mp4` 和本目录的 ASS 重新烧录，不读取已有 preview，不联网，不运行 ASR/TTS。视频为原尺寸、25fps、6487 帧、259.48 秒，使用 lossless x264 编码；原 48kHz 双声道 AAC 音轨直接复制。保留片尾原有的无台词画面和声音。

重新导出两种字幕和映射：

```bash
python3 /workspace/submission/export_subtitles.py
```

这会读取最终 `subtitle_events.json`。导出后如改动字幕，应再执行重建，以保持烧录与文件一致。

## 自检

```bash
python3 /workspace/submission/validate.py --input /candidate/input --media
```

实际结果见 `validation_report.json`：

- 公开稿全部 738 个词的规范化多重集与 ASS 一致，101 个文本组全部有映射。
- 在 ASS/SRT 的每个联合时间边界，角色及实际显示文本一致；SRT cue 编号唯一，无时间重叠。
- 没有事件跨越 93.52 或 170.76 秒拼接边界，也没有同一角色的事件互相遮挡。
- 行长不超过 42；读速包含角色标签计算，不超过 24 字符/秒。
- 成片与原视频的全部 6487 帧，顶部 392 行解码像素逐帧完全一致。
- 两视频的解码音频 SHA-256 完全一致。

`rebuild_test.json` 另记录移走已有 preview 后按提交 argv 实际重建的结果。这些自检验证文件、音画完整性及格式一致性，不是对真实说话人/时间准确率的评分。

## 实际制作方法与限制

阅读了题目、规则、schema 和本地手册；查看教程六部分画面，并用本地 ASR 转录教程。对白处理使用提供的离线 faster-whisper small / int8 / CPU，结合公开逐词稿做检索、词时码对齐和短窗口复核；另用 NumPy/SciPy 分析波形、MFCC、基频及谐波残差信号，并查看解码视频帧来辅助确认发声动作。参考了提供的人物头像和声音 WAV。B/C/D 声音参考之间存在大量相同的音频片段，因此没有把整段参考直接视为纯净的单人录音。

本次没有可直接听取音频的原生音频接口；没有声称进行了人工逐句听审。短附和和被其他声音遮盖的词，其角色与边界仍有估计成分，尤其 U004、U024、U025、U034、U062、U079，以及部分孤立的 Yes / Yeah / Mm-hmm。独立的完整听审未完成。这一限制不影响上述文件及媒体完整性自检，但不应将程序自检当作准确率保证。

未访问外部标注或私有真值，未调用外部 API、其他模型或 TTS，未合成任何对白。

## 依赖与素材

重建只需要 Python 3 标准库和带 libass/libx264 的 FFmpeg。本次版本：Python 3.12.3、FFmpeg 6.1.1、libass 0.17.1。字体 `assets/DejaVuSans.ttf` 已随交付保存，许可见 `assets/FONT-LICENSE.txt`。

本次分析工具：faster-whisper 1.2.1、CTranslate2 4.8.4、NumPy 1.26.4、SciPy 1.11.4、Pillow 10.2.0、soundfile 0.14.0；分析模型不用于重建，也不需要复制。

原始视频、original.wav、人物参考、逐词稿、拼接信息及教程均依赖题目输入包。未复制源视频或模型到提交目录；没有新增的配音或其他媒体素材。草稿、ASR 输出及渲染临时文件均放在 /workspace/scratch，不是正式交付物。

原始会议与字体的署名和许可说明见 `CREDITS.md`。
