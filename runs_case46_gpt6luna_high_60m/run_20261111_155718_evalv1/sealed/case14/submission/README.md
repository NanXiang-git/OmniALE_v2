# Case46 口述影像交付

成片时长148.064583秒，1280×720、24000/1001 fps。原视频流直接复制，未暂停、变速、删帧或补黑场。原声基轨为输入 `original.wav`；旁白出现时局部压低6dB，前后各用70ms线性过渡。为限制混音峰值，四条轨统一降低约0.68dB（重建脚本以4倍过采样估算真峰值）。旁白真实合成自本机 `/candidate/tools/tts.py`，使用Microsoft Kangkang兼容语音V02；四条配音WAV保存在 `cues/`，没有在线TTS或占位音频。

使用FFmpeg/ffprobe检查输入视频参数并复制视频流、编码AAC声音；使用Pillow抽取并查看2秒间隔画面；使用本地 `transcribe`（Whisper small/int8/CPU）观察对白时间和合成语音内容。ASR可能漏掉混合语言、短句和声音，字幕只是辅助稿。接口不支持原生听音，因此没有声称已人工听过原声或成片；自查中的对白和音效风险据识别结果、波形及抽帧评估，细小关键音效尚未人工核听。

离线重建：

```sh
python3 submission/rebuild.py --input /candidate/input --submission submission --output /workspace/rebuilt
```

需要Python 3、NumPy、SciPy、soundfile、FFmpeg/ffprobe以及已交付的四条配音WAV。重建不调用TTS或网络服务，按 `ad_plan.json` 排程，生成四条48kHz立体声PCM轨、VTT与H.264视频直拷、AAC音频的MP4。播放器通过文件夹选择器加载提交目录；描述关闭时切回未压低基轨，不改变画面时间轴。未制作完整逐字听审；已省略对白密集时段及无法确认的手部转移叙述。
