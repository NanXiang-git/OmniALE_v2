# Sintel 连续片段 · 中文口述影像

本提交使用题包主片的完整 264 秒、24 fps、6336 帧。`accessible.mp4` 含原画面与实际中文口述混音；视频直接复制 H.264 码流，没有重编码、暂停、变速、插帧、删镜头、加黑场、烧录字幕或图形覆盖。原片自身的暗转原样保留。独立前情只用于核对受伤小龙与女子的既有关系，没有拼入成片。

## 播放与真实开关

直接打开 `accessible.mp4` 可听混音。需要开关口述时，打开随附的题包原版 `player.html`，选择整个 submission 文件夹，然后播放。它把 MP4 的内置声音静音，分别同步 `base_track.wav` 与 `ad_track.wav`；“描述”按钮只切换 AD 静音，不改变画面、进度或原声。外挂 `ad.vtt` 与每条 WAV、计划一一对应；可在支持外挂 WebVTT 的播放器中加载。

## 文件

- `mix.wav`：base + AD 的全长混音。
- `base_track.wav`：题包 `original.wav` 仅施加 **−4.000 dB 单一全局增益**。
- `ad_track.wav`：从 0 秒开始的独立口述轨，未描述处为数字静音。
- `cues/*.wav`：28 条实际中文描述的离线主素材，48 kHz、双声道、24-bit PCM，与 AD 轨逐样本对应。
- 上述三个全长 WAV 也都是 48 kHz、双声道、24-bit PCM，恰为 12,672,000 个采样帧。
- `ad_plan.json`、`selection_audit.json`：主片相对时间、视觉依据、信息可知时刻与取舍记录。审计包含 32 个事件；名字、年龄数字、未经证实的心理解释不用于补画面。
- `narration.txt`：实际描述文字；`cue_processing.json`：逐条语音的静态增益与截静音记录。
- `validation_report.json`：客观媒体、排程、引用、波形与重建自检结果。
- `CREDITS.md`：题包素材署名，Sintel (2010), Blender Foundation / Durian Open Movie Project。

## 音频处理

描述使用本次提供的 Windows System.Speech 兼容 TTS，V01（Microsoft Huihui Desktop 对应配置），按逐条文本生成 WAV。保留自然速度，**没有语音加速**；仅裁去句前句后冗余静音、加极短边缘淡变，并对每条 AD 使用固定增益。实际播放与离线重建都直接使用提交的 `cues/*.wav`，无需再次合成。

原声没有任何局部 duck、动态压缩、删声或挖空。全局增益固定 −4 dB；AD 以相同声音送入左右声道。混音是两轨相加，没有混音总线限幅、额外声轨或隐藏处理。MP4 的声音只是该混音的 256 kb/s AAC 编码。PCM 与 AAC 的真峰值测量见 `validation_report.json`。

## 离线重建

依赖：Python 3、NumPy、soundfile（libsndfile）、FFmpeg/FFprobe；无需模型、网络、TTS 代理、字体或图形程序。制作及验证时的确切版本记录在 `validation_report.json`。

示例（输出到一个新目录）：

```bash
python3 /workspace/submission/rebuild.py \
  --input /candidate/input \
  --submission /workspace/submission \
  --output /workspace/scratch/rebuilt
```

机器接口为 `rebuild.json` 的 `argv`，使用 `{python}`、`{input}`、`{submission}`、`{output}` 占位符。输入目录可以是直接含 source.mp4 / original.wav 的目录，也可为它的上级题包目录。脚本从题包原视频、原 WAV 和本提交逐条 WAV 重新放置 AD、生成三轨，再复制原视频码流并编码混音；不会复制已渲染的 `accessible.mp4`，不会调用 TTS。输出不需要输入中的 context、字幕或 voice_samples。

## 实际核对方式与限制

我通过图像工具查看前情和主片的逐秒准确取帧，以及动作与识别段的 0.25–0.5 秒密集取帧和原分辨率特写。声音定位实际使用了题包字幕、原 WAV 波形/能量分析、FFmpeg 真峰值测量，以及题目提供的本地 faster-whisper small/int8/CPU 转录。原声全片 ASR 曾无识别输出，局部增益后的对白窗口和独立描述素材另做转录辅助校核；没有把 ASR 当成事实真值。

当前会话没有可直接感知音频的输入接口，也没有浏览器音视频播放工具，因此**没有完成直接听评或真实浏览器中的听看测试**，不声称已通过主观原声保护/语言听评。播放器沿用题包提供的实现，并核对了本提交路径与开关同步代码；自动自检不能代替人耳听评。波形一致性、实际发声、自然语速、真峰值、视频完整性和重建已经用本地工具检查。未读取外网剧情或现成口述稿，没有使用解题子代理或其他外部模型。
