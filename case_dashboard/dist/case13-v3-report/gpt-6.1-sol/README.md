# 《钢铁之泪》普通话译制交付

主文件为 `dub_zh.mp4`，全长525秒，保留1280×534、24fps和原始镜头顺序；中英文字幕已实际烧录。`mobile_mix.wav` 是同内容的48kHz单声道版。

## 文件与工程

- `mix.wav`：48kHz立体声影院混音；`effects_track.wav`：原M&E仅乘mix_config中的全局增益。
- `speakers/*.wav`：各角色全长、最终音量的48kHz立体声分轨。青年／记忆形象汤姆和四十年后的汤姆使用两个有画面及声音依据的实例，剧情身份同为汤姆。
- `assets/voices/`：本次本地F5生成的原始中文WAV；`assets/references/`：从本题原片提取的参考WAV。
- `assets/aligned/`：去除生成头尾空白、时长适配、角色处理和最终音量均已烘焙的短音频。`timeline.json` 以48kHz整数采样点定位。
- SRT、ASS、转录、source_events、translation_plan、speakers、continuity_ledger及voice_provenance提供文本、声源、事件和C01—C08决策记录。画面文字不进入配音。
- `validation_report.json` 和 `measurements/` 记录实际自动自检结果；它们不是主观评分或角色真值。

## 离线重建

需Python 3、NumPy、soundfile，以及具有libass、libx264和AAC编码器的FFmpeg；字体为Microsoft YaHei、DejaVu Sans（本次环境已安装）。不需网络、TTS代理、ASR或F5模型。

```bash
python3 rebuild.py --input /candidate/input --submission /workspace/submission --output /workspace/scratch/rebuilt
```

`rebuild.json` 使用题目要求的 `{python}`、`{input}`、`{submission}`、`{output}` 占位符。output可为目录，或具体MP4路径。脚本从原片重新烧录ASS，按timeline重新装配角色轨，用输入M&E生成effects，再逐样本相加得到mix，最后用声明的精确FFmpeg链生成mobile；不会复制成片视频。重建复用提交中的已生成短音频。

## 实际制作方法及局限

英文理解使用离线faster-whisper small/int8/CPU：先全片词级转录，再对长静默、短答、强音效区间单独解码；部分区间用原M&E幅度谱作频谱抑噪帮助识别。逐段接触表和原片抽帧用于人物、嘴部、镜头连续性与屏幕文字校核。本模型没有原生听取音频；没有把调用音频工具描述成亲耳听辨。英文中少数含混短语结合多次ASR及上下文作了人工文本判断，可能仍有听写或归属错误。

全部中文采用提供的F5-TTS v1 Base + Vocos本地CPU跨语言参考条件合成，12或16步。每个声音实例固定使用同一源参考；重复对白独立生成，分别适配两次节奏。未使用Windows通用TTS，未使用外网或其他模型。音色参考区间及实际方法见voice_provenance；不能保证克隆的主观相似度。部分短句先以较完整时长生成，再用FFmpeg atempo压缩，可能偏快；跨语言音质、情绪和极短感叹仍有限制。非语言呻吟、喘息和惊叫以该角色参考重制，未混入整句源英语。

角色短音频先做轻度高通、K加权响度匹配，必要时平滑饱和；机器人西莉亚及状态播报增加少量11ms延迟色彩。仅角色信号根据4倍过采样估计的剩余峰值空间施加平滑增益，随后把处理写入aligned资产。M&E没有移轴、duck、EQ或局部操作；混音求和后不另加处理。角色在中央声像，避免单声道抵消。手机只使用mix_config声明的全局增益和题定alimiter链。

来源与模型许可见CREDITS.md。所有结果用于本次本地制作测试，未对外发布；不声称已另行取得外部发行许可。
