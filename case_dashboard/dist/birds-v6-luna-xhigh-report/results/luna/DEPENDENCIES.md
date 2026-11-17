# 配音与渲染依赖

## 实际选择

- 配音客户端：`edge-tts 7.3.1`
- 在线音色：Microsoft Edge `zh-CN-XiaoxiaoNeural`，语速 `-5%`，标准音高
- HTTP 客户端：`aiohttp 3.14.5`，通过 `edge_tts.Communicate(proxy=HTTPS_PROXY)` 显式走环境代理
- 本地处理：Python 3.12、NumPy 1.26.4、SciPy 1.11.4、FFmpeg / FFprobe
- 字幕字体：`fonts/NotoSansSC.ttf`，Noto Sans SC

`tts_and_mix.py` 只把我撰写的六段中文旁白文字发送给语音合成服务。原视频、原始音轨和抽取出的音频都没有上传。脚本不尝试直连；未找到 HTTP(S) 代理时会停止。

## 安装记录

环境预装 Python、NumPy、SciPy、FFmpeg 与 FFprobe。通过代理下载并安装了 `edge-tts 7.3.1` 及其运行依赖：

- `aiohttp 3.14.5`
- `certifi 2023.11.17`
- `aiohappyeyeballs 2.7.1`
- `aiosignal 1.4.0`
- `attrs 26.1.0`
- `frozenlist 1.8.0`
- `idna 3.20`
- `multidict 7.2.1`
- `propcache 0.5.4`
- `tabulate 0.10.0`
- `typing_extensions 4.16.0`
- `yarl 1.25.1`

依赖安装和字体下载的实际耗时、SHA-256、语音合成调用与渲染耗时记录在 `research_log.json`。由于环境没有原生听音工具，已对输出语音做时长、采样率、电平和峰值检查，但不能声称完成了主观试听。
