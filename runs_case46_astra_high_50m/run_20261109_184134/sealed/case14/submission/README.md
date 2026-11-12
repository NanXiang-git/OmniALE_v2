# 消失的纸牌 · 中文口述影像

已实际制作可播放的中文口述成片，完整时长 **148.064583秒**。13条旁白共约33.51秒，采用正常语速，各条约3.2—4.1汉字/秒；原画面3550帧完整保留。

## 观看

- 直接打开 **accessible.mp4**：H.264画面与AAC立体声，已经内置真实旁白混音。
- 用支持目录选择和Web Audio的桌面浏览器打开 **player.html**，选择整个 **submission** 文件夹，然后点击“播放”。关闭“旁白”即可恢复未局部压低的原声，开启则播放压低原声加旁白。开关不跳转、不重启时间轴。页面音量滑块控制声音。
- “显示旁白文字”默认关闭；开启时文字在画面下方显示。也可展开旁白稿跳转时间。**ad.vtt** 为外挂旁白字幕，未烧录入画面。

## 内容与时间安排

以“蓝衬衫男子、眼镜男子、黑裙女子、礼帽男子”为外观指代，没有猜测姓名、纸牌用途或人物心理。旁白围绕藏牌、飞牌交接、衣内移动、靴底取牌、胸罩掩护、保安腰后取牌和再次传牌展开，不补写片段之外的结局。

先检查原声，再写旁白：使用本地Whisper small分别作英文、中文带词时间戳转录；对开头、105—116秒、130秒至片尾另作不启用VAD的切片转录；辅以Silero语音检测和原声频谱图。把双语转录、切片转录、保守VAD区间合并，并留出边界空间。辅助中文字幕只用于理解，不用其边界安排旁白。候选空隙里仍有音乐与音效，并非静音。

逐秒及每秒4帧查看画面，关键动作另看原尺寸抽帧。飞牌音效和密集口令段留给原声；35.4秒补述此前飞牌的接收，78.9秒补述女子从靴底取牌和颈后藏牌。这两处有意稍后说明，避免盖住对白。其他省略和不确定处见 **self_check.json**。

## 声音制作

- 所有实际使用的配音均在 **cues/AD01.wav—AD13.wav**，48kHz、双声道、24位PCM，无静音占位。
- 通过题目提供的 `/candidate/tools/tts.py` 实际合成，使用 **V01 / Microsoft Huihui Desktop**，经受控宿主System.Speech兼容层完成，不调用外网服务。
- 每句按实际音频长度排程。只裁去合成文件首尾近静音，保留约70ms前沿和140ms尾沿；未加速、未拉伸、未截断词尾。随后以固定增益统一旁白响度，目标约−22 LUFS；具体增益和原始时长记在ad_plan.json。使用离线ASR回读配音，13句均有实际语音，少数同音字识别差异已记录。
- 四条主WAV均为 **7,107,100个采样帧、48kHz立体声24位PCM**，从0开始，长度与视频时间轴一致。
- **base_track.wav**：视频时间范围内的原声，只转换至24位PCM，无旁白、无局部压低。**整体增益为0 dB**。
- **ducked_base_track.wav**：每条旁白期间比base低 **6 dB**；旁白前后各用80ms半余弦平滑过渡。
- **ad_track.wav**：全长旁白，其他位置为零。
- **mix.wav**：ducked_base与ad的24位PCM整数逐样本精确相加，没有限幅器或额外动态压缩。
- 输入original.wav含7,107,584个采样帧，比画面终点多484个解码尾样本（10.083ms）。只去掉**视频终点之后**的这段尾样本，其峰值约−88.1 dBFS；视频时间内的原声完整保留。统一全长不是删镜头或补黑场。

## 验证结果

- 输入与输出的全部3550个H.264视频包，逐包内容SHA-256、PTS、DTS和时长一致；视频没有重编码、改速、删帧或加画面。
- 成片完整解码无错误；1280×720，24000/1001 fps，3550帧。
- 13条配音与ad_plan.json、VTT和全长旁白轨一致；VTT精度到毫秒，误差小于0.5ms。
- 与本次独立分析的保守对白区间重叠为0；80ms压低过渡也未进入这些区间。检测不是人工听审，不能当作绝对无遗漏的真值。
- 原声非旁白区域逐样本不变；旁白区域实测相对压低6dB；mix严格等于ducked_base+ad。
- FFmpeg EBU R128测量：mix与AAC解码后均约 **−24.3 LUFS、−3.5 dBTP**，留有峰值余量。
- 播放器JavaScript语法检查通过；V8模拟DOM/Web Audio测试了共同起播、开关增益、进度不变、跳转和暂停。三个缓冲音源使用同一音频时钟；视频内置音轨在该播放器中保持静音，防止双重播放。
- 已在独立目录执行离线重建；四条WAV与accessible.mp4均与提交版本SHA-256完全一致。详情记录于self_check.json。

## 离线重建

只需输入视频、原声与已提交的配音素材，不重新调用TTS，不联网，也不复制成片冒充重建：

```bash
python3 /workspace/submission/rebuild.py \
  --input /candidate/input \
  --submission /workspace/submission \
  --output /workspace/scratch/rebuilt
```

脚本重建四条主音轨、重新编码AAC并原样封装源视频流。命令模板、采样长度、压低量及依赖见 **rebuild.json**。可换用其他输出目录；脚本也会复制播放器、计划及现有配音以便独立播放。

## 实际工具、依赖与局限

实际使用Python 3、FFmpeg/ffprobe、NumPy、SciPy、Pillow、soundfile/libsndfile、faster-whisper、onnxruntime/Silero，以及题目提供的本地TTS兼容接口。Whisper模型固定为 `/runtime/models/whisper-small`，small/int8/CPU。图片通过抽帧和图片查看工具检查；频谱图由SciPy和Pillow生成。具体版本见下方记录。

未使用解题子代理，未调用其他在线模型或外网服务，未读取历史答案或评分器，未修改输入。草稿、原始合成、分析图和临时重建位于/workspace/scratch；交付内容位于/workspace/submission。

本接口**不支持原生音频输入**，没有原生听过音轨，也没有人工听审。语音判断来自离线ASR、VAD、频谱和数值检查；短促中英混合口令仍可能漏识别。环境未安装浏览器，未做真实浏览器扬声器试听；播放器仅做语法和模拟行为验证。深色衣内的快速动作只描述看得清的移动位置，不猜测机关。除此之外，必交视频、声音、播放器、计划及重建脚本均已生成。

```text
python: 3.12.3
ffmpeg: ffmpeg version 6.1.1-3ubuntu5 Copyright (c) 2000-2023 the FFmpeg developers
numpy: 1.26.4
scipy: 1.11.4
Pillow: 10.2.0
soundfile: 0.14.0
faster-whisper: 1.2.1
onnxruntime: 1.31.1
```

素材来源按输入SOURCES.md记录：《Now You See Me 2》（2016），Movieclips公开片段“Disappearing Card Trick Scene (6/11)”。原来源：https://www.youtube.com/watch?v=YmGBAiHnK0U 。本次使用题目给定的本地裁切版本。
