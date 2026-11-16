本次实际实现与复现说明

配音：Microsoft Edge 在线普通话神经语音 zh-CN-XiaoxiaoNeural，rate=-4%，pitch=+0Hz。没有后期变速、移调、背景音乐或合成鸟叫。只发送自行撰写的旁白文字，没有上传原视频、原音轨或其片段。没有调用其他识别模型或子代理。

实际调用由 synthesize_narration.py 自行实现，用 websocket-client 1.9.2 通过环境 HTTPS_PROXY/HTTP_PROXY 显式建立 HTTP CONNECT/WSS。端点为 speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1。服务返回 24kHz/48kbps 单声道 MP3 及 WordBoundary 时间，ffmpeg 解码重采样至48kHz。所有句子的实际服务返回时间信息保存在 speech_metadata/，实际生成的分句MP3保存在 speech_sources/。

调试选择：最初安装 edge-tts 7.2.3，旧端点/旧签名调用失败。随后安装 edge-tts 7.3.1，其 v2 请求令牌与 Chromium 143.0.3650.75 协议调通；真正配音使用该协议。由于 aiohttp 依赖下载慢，自行用 websocket-client 实现传输，没有使用 edge_tts.Communicate。edge_token.py 来自实际安装的 edge-tts 7.3.1 drm.py，仅去掉 aiohttp 及包内导入，保留 v2 算法；其 LGPLv3 许可随 EDGE_TTS_LICENSE.txt 提供。公开客户端常量来自该开源包，不使用宿主、用户或商业凭据。旧版本的 dist-info 可能残留，因此 pip 元数据不能单独反映最终采用的源文件版本。

未采用的方案：Google Translate TTS 被代理拒绝，StreamElements Zhiyu 返回401；未获得可用声音。另尝试安装 Piper 作备用，但其语音模型目录/配置请求被网关拒绝后放弃，未下载或运行模型。最初 matplotlib/soundfile 和部分自动依赖安装被终止；声谱和混音最终用预置 numpy/scipy/Pillow 完成。aiohttp 3.12.15 的 wheel 虽装入环境，未参与最终调用。

环境：Python3.12；预置 requests 2.31.0、numpy 1.26.4、scipy 1.11.4、Pillow 10.2.0、ffmpeg/ffprobe（libx264、libass）。真正新增且需要的运行依赖只有 websocket-client 1.9.2；edge_token.py 已随交付保存，无须安装整个 edge-tts。requirements.txt 同时列出本次运行库版本。字体为 Google Fonts 的 Noto Sans SC Regular，已保存 fonts/NotoSansSC.ttf。

复现命令（保持代理环境变量，不绕过代理）：
  python3 -m pip install --target /workspace/site-packages websocket-client==1.9.2
  python3 /workspace/submission/generate_narration.py
  bash /workspace/submission/render.sh

如只需用本次已生成配音离线重做混音和成片，可先运行 python3 /workspace/submission/generate_narration.py --cached，再运行 render.sh，无须再次联网生成。

声轨：独立 narration.wav 为48kHz、16bit PCM、单声道，完整185.5秒，未说话部分为零采样。整轨只施加一致的线性增益及句首句尾10ms淡化，没有压缩时间。原轨全程按原顺序保持立体声；分章增益、旁白时避让与短斜坡记录于 mix_report.json。最后混音使用轻度峰值限制（alimiter=limit=0.87:level=false:latency=true），AAC192kbps，无音乐。

图像：1280×720，H.264，30fps，正常转码。原视频的帧时间略不规则，转30fps会作标准帧率转换；没有剪段、改速、冻结片段或替换任何画面。第一章静态照片来自输入本身。SRT字幕按本次TTS的字词时间生成，并以相同文件烧录；字体放于下方空余处，抽帧核对主要鸟体不被遮挡。

限制：当前模型无原生听音工具，未亲耳听音。实际读取了原轨PCM及声谱，并结合画面动作核验；自然听感及个别声音归属不能由这些客观检查完全验证。第二、三、四章在实际旁白和 segments.json 中明确为单一暂定识别。
