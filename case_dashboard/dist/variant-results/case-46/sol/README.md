# 《Sprite Fright》中文口述影像

这份成片对应原片 02:04–03:25，时长 81 秒，含 15 条普通话旁白。交付时间均从片段第一帧起算。原片为 Blender Foundation／Blender Studio 的《Sprite Fright》，按 CC BY 4.0 发布。本交付在题包片段上制作中文旁白及相应混音。 [原片与许可](https://commons.wikimedia.org/wiki/File:Sprite_Fright_-_Blender_Open_Movie-full_movie.webm)

## 播放

- 直接播放 `accessible.mp4` 即可听到原声与普通话旁白的混音。
- 如需切换旁白，在支持 H.264 和 Web Audio 的浏览器中打开 `player.html`，选取整个 `submission` 文件夹，再点击“播放”。本地 HTTP 服务也可自动读取同目录文件。
- “旁白开启”播放 `ducked_base_track.wav` 与 `ad_track.wav`，“旁白关闭”播放 `base_track.wav`。播放器以静音视频为时间参考，切换时仅调整音轨增益。可选的“显示旁白文字”在画面下方显示独立的 `ad.vtt`。

## 口述与混音

用 FFmpeg 抽帧检查人物、动作和信息首次出现的时间。对白窗口以输入原声为准，使用本地 faster-whisper small 对立体声转单声道后的波形进行整段及分段识别，再与中间、侧边声道频谱以及画面动作对照。辅助中文字幕用来核对台意。普通话旁白使用本地 Piper 华燕音色合成。F5-TTS 在当前 CPU 环境下仅作试跑，试跑未完成。逐条量取实际音频时长，校对脚本、交付 WAV 和 WebVTT 时间。

音轨均为 48 kHz、双声道、16 位 PCM，各 3,888,000 个采样帧。原声统一降低 **1.8 dB** 以留出峰值余量。旁白期间原声相对基轨降低 **6 dB**，起落各 70 毫秒。成片 AAC 和 PCM 混音的实测真峰值均为 −2.2 dBTP。`mix.wav` 是压低基轨与旁白轨逐采样相加的结果。供应的原声 WAV 比视频多 693 个采样帧，基轨使用视频 81 秒范围内的全部采样帧。

配音和对话的可懂度以离线识别和音频数据复核，短语转写可能出现同音字。制作环境无原生听审，非语言声音的主观掩蔽程度仍有不确定性。播放器的轨道切换、寻址和外挂文字通过模拟媒体接口测试，环境无实体浏览器可供播放验证。约 56–61 秒的对白密集，保留倒罐同期声，在片尾仍可看到罐子时交代罐子的状态与持有者。每条旁白的画面依据和自查记录见 `ad_plan.json` 与 `self_check.json`。

## 离线重建

需要 Python 3 标准库和 PATH 上的 FFmpeg。从任意目录运行下面的命令，将重建的 MP4 和四条 WAV 写入指定目录。

```bash
python3 /workspace/submission/rebuild.py \
  --input /candidate/input \
  --submission /workspace/submission \
  --output /workspace/scratch/rebuilt
```

脚本读取输入的 `source.mp4`、`original.wav`、提交的时间表、播放器配置和每条旁白 WAV。它以原 H.264 视频流封装重新生成的 AAC 混音。成片和原片的 1,944 帧像素哈希与时间戳逐帧一致。使用仅含脚本、配置、时间表和配音 WAV 的目录进行重建，生成的 MP4 和四条 WAV 均与交付文件逐字节一致。
