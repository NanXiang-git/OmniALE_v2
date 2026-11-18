# 实现与依赖

本次从零编写检索、取帧、声谱、配音、混音和核验代码；未调用子代理或其他识别模型，也未上传输入视频或输入音轨。

## 实际配音方案

- 客户端：`edge-tts 7.3.1`，由 pip 安装到 `/workspace/site-packages`。
- 服务：Microsoft Edge 在线神经语音合成，音色 `zh-CN-XiaoxiaoNeural`。
- 参数：`rate=-5%`，默认音高与音量。每次请求只含自行撰写的中文句子。`synthesize.py` 显式传入环境变量 `HTTPS_PROXY`，使用代理上的加密 WebSocket。
- `narration_plan.json` 保存实际提交给 TTS 的文本与放置时间；`tts_metadata.json` 保存返回的字词时间信息及每次合成的参数。试音文本也在 `research_log.json` 中保留。
- 合成 MP3 在本地解码、重采样为 48 kHz PCM，再按完整时间线放置。没有变速、时间拉伸或移动原声。旁白单句以 -19 LUFS 为归一化目标，真峰值上限 -3 dB，必要时优先满足峰值限制。
- 没有原生听音工具，不能声称试听过。核验采用实际 PCM、波形、字词边界、响度、峰值及画面动作。服务合成成功不等于已经由人耳确认音色、韵律和每个读音；这个限制也已写入 `segments.json`。

## 本地环境

Python 3.12；FFmpeg/ffprobe 6.1.1，使用 libx264、AAC、libass。

`requirements.txt` 列出直接 Python 依赖的实际版本；`python_versions.json` 另保存 TTS 客户端及其依赖的实际版本。NumPy、SciPy、Pillow、Requests 为环境预置，实际新增下载的是 edge-tts 与其依赖。

字幕字体为 **文泉驿正黑 WenQuanYi Zen Hei**。发行包：

`https://deb.debian.org/debian/pool/main/f/fonts-wqy-zenhei/fonts-wqy-zenhei_0.9.45-8_all.deb`

使用 curl 经环境代理下载后，通过 `dpkg-deb -x` 本地解包。包共 7,478,908 字节；首次限时下载不完整，随后从同一允许网址续传成功。下载和解包的实际耗时均有记录。成片已烧录字幕，播放不依赖本地安装字体。

曾尝试下载 Noto 字体但得到 403，未通过镜像重取该资源；改用不同字体的独立发行包。系统不具备可用的 apt/dpkg 数据目录，apt 安装尝试失败；没有更改系统软件源。失败也记录在日志中。

## 代码与复现

- `audit.py`：带文件锁的开始/结束时间、实际墙钟耗时和命令退出码记录。
- `research.py`：仅通过环境代理访问独立资料；重定向逐跳检查禁用域名。保存实际 URL、状态和响应哈希，不执行网页脚本或跟随其嵌入媒体。
- `analyze_audio.py`：解码后 PCM 的声谱和数值分析。单独参考录音仅用于人工声谱比较，没有混入成片。
- `synthesize.py`：自撰旁白的真实 TTS 请求、缓存、字词时间保存与本地 PCM 解码。
- `render.py`：时间线旁白、与旁白一致的 SRT/ASS、逐段原声增益、平滑避让与限幅、烧录字幕、H.264/AAC 编码。
- `write_segments.py`：按实际语音时间写入识别结果和证据。
- `verify.py`：输出参数、完整时间线、字幕文稿一致性、无旁白窗口的逐采样静音、原声同时间位置相关性检查。

环境变量保留题目提供的代理配置，不设置直连例外。依赖安装命令：

```bash
python3 -m pip install --target /workspace/site-packages -r /workspace/submission/requirements.txt
```

在本次工作区中重建：

```bash
python3 /workspace/submission/synthesize.py /workspace/submission/narration_plan.json
python3 /workspace/submission/render.py
python3 /workspace/submission/write_segments.py
python3 /workspace/submission/verify.py
```

`render.py` 使用 `/candidate/birds_source.mp4`、`/candidate/chapters.json` 与 `/workspace/scratch` 中的解码音轨、字体及合成缓存。若清空 scratch，需要先从输入视频解码 `original.wav`，重新下载并解包上述字体包，再运行合成脚本。所有中间文件仅在本地处理。

## 交付核验

`final.mp4` 为 1280×720、30 fps、H.264 + AAC，时长 185.466667 秒，比源容器短 0.037333 秒。原始六章完整保留，既未删章，也未改变顺序或速度。原始输入本身的静态近照仍照原样保留；转为标准 30 fps 仅做正常帧率转换。

`narration.wav` 为 48 kHz、单声道、16-bit PCM，8,902,400 个采样，精确对齐成片。字幕共20条，烧录与 SRT 的文字来自同一份实际 TTS 文本。前四章字幕在下缘，后两章在上方空白处。

原声按章调整电平，旁白期间再平滑降低10 dB；保留双声道与原时间位置。两级限幅均启用延迟补偿，没有补入参考鸟声、音乐或合成鸟声。最终 AAC 实测综合响度 -16.07 LUFS，真峰值 -1.85 dBTP，无峰值溢出。

详细数值、原声窗口和限制见 `validation.json` 与 `segments.json`。前四章使用单一暂定识别；尤其第2、4章鸟体遮挡严重，不能把一般习性写成可见动作。

## 实际用时

`research_log.json` 使用真实 Unix 开始/结束时刻和墙钟秒数。记录覆盖选择、安装、网络失败、代码开发、合成、混音、编码和核验。工作阶段与并行下载有重叠，不能把所有事件耗时简单相加。总墙钟用时以日志最后的 `total_elapsed_seconds` 为准，无截止时间。

最初一次 Google 请求在完善网络日志器之前超时，其完整异常留在工具轨迹，日志明确注明单次精确区间未被初版脚本捕获；没有倒填虚构的精确时间。其用时包含在任务总墙钟时间与研究阶段区间中。
