交付文件

- `final.mp4`：完整六段画面，H.264、1280×720、30 fps；AAC 48 kHz立体声；烧录与SRT相同的中文字幕。
- `narration.wav`：与成片对齐的48 kHz、24-bit PCM立体声独立旁白；无旁白处为零采样静音。
- `subtitles.srt`：UTF-8，按语音服务返回的词级时间戳对齐；字幕不包含未念出的物种答案。
- `segments.json`：逐段中英文名、学名、置信度、画面与原声证据、旁白时间、原声窗口及成功访问的引用。
- `research_log.json`、`audit/`：实际工具选择、独立资料访问、失败及放弃的来源。

配音与依赖

实际使用 Python 3.12.3、edge-tts 7.3.1 和微软 Edge 在线语音合成接口，音色 `zh-CN-XiaoxiaoNeural`，原生 `rate=-8%`、`pitch=+0Hz`、`volume=+0%`。只发送自行编写的中文文本；没有上传输入视频或原始音轨，没有使用商业密钥或宿主凭据。16段语音全部实际生成，原始MP3及返回的词级时间戳保存在 `voice_assets/`。没有对合成语音进行后期加速、拉伸或改变音高。

安装命令为 `python3 -m pip install --target /workspace/site-packages edge-tts`。实际安装的全部依赖及版本见 `requirements-lock.txt`，预置科学计算库和FFmpeg版本见 `environment.json`。分析与排版使用预置 NumPy、SciPy、Pillow、requests、BeautifulSoup；没有使用matplotlib。字体为Google Fonts正常分发的 Noto Sans SC，已保存在 `fonts/`。

`generate_narration.py` 是实际配音调用脚本，读取 `narration_plan.json`，明确使用环境变量提供的HTTPS代理；`narration_timing.json` 为真实音频的长度、位置和词级时间文件索引。`build_media.py` 是实际时间线、字幕及混音实现；`render_video.py` 是实际字幕烧录与编码实现，`render_command.json` 保存最终命令。

在本环境复现：运行 `python3 generate_narration.py`；确保 `/workspace/scratch/original.wav` 是由 `ffmpeg -i /candidate/birds_source.mp4 -vn -c:a pcm_s16le /workspace/scratch/original.wav` 解码得到的原始音轨，并将 `fonts/NotoSansSC.ttf` 放到 `/workspace/scratch/NotoSansSC.ttf`；再运行 `python3 build_media.py`、`python3 render_video.py`。脚本中的绝对目录对应本次任务环境。

声音和画面的处理

保留原始立体声的时间位置，只施加逐章增益、旁白期间的平滑音量避让和瞬时峰值限制。旁白目标综合响度为−18.5 LUFS；原声窗口及增益参数见 `mix_settings.json`。不加音乐，不使用参考鸟叫，不移动、复制或替换任何原始叫声。每章安排多处至少2秒的无旁白原声窗口，已检查其中独立旁白采样精确为零。

输入视频有5559个解码帧及少量章间时间戳间隙，视频流首帧PTS约0.021秒，末帧PTS约185.463秒。按要求转为30 fps恒定帧率时，正常转码需要在时间戳空隙重复既有帧；最终共5565帧，保留全部输入帧及最后一帧，未改变播放速度或添加静态替代画面。成片185.500秒，与输入容器185.504秒差约4毫秒。前五个章界按所给边界保留；最后一章结束按完整末帧延至185.500秒。`audit/source_pts_summary.json` 保留技术核对数据，这些数据仅用于完整性与编码，不用于识别鸟种。

分析限制

本环境没有原生听音工具，未亲耳试听输入、参考录音或合成旁白。实际读取PCM采样，计算RMS和峰值，查看整体与局部声谱，结合画面代表帧和开喙动作判断。独立参考只做手工声谱观察，没有ASR、鸟声识别模型、其他识别模型、子代理、反向搜图或音视频指纹。配音听感没有人工听审；通过稳定音色、原生语速、语音时长、波形和词级时间戳作有限质量核验。

第2、4段因鸟体不可见或严重遮挡，实际旁白明确给出单一暂定识别；不能确定每一声的画外归属。其余声音功能和食物不可见之处也分别限定，不将一般习性当作片中确定发生的事件。参考资料只支持其明确记载的事实，失败网页和未取得的媒体不列为成功阅读或听过的依据。
