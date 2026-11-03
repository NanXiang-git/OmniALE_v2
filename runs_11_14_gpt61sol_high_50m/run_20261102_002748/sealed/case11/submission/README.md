# 双头注意力课程无障碍改版

交付成片为 `accessible_course.mp4`：1280×720，25 fps，198 秒。原片 180 秒完整顺序保留；在源时间 62、96、154 秒各插入 6 秒定格，显示该锚点之前的最后一帧。描述没有烧录到画面。

## 播放、开关与导航

用桌面 Chrome 或 Edge 打开 `player.html`，点击“打开课程文件夹”，选择整个 submission 文件夹，再点击播放。播放器通过本地文件选择器加载媒体，无需服务器或网络。

视频内置混音始终静音，实际声音来自 `base_track.wav` 和 `ad_track.wav`。取消“口述描述”只静音 AD，教师、定格及播放位置不变。音量滑杆同时控制这两个独立音轨。“显示描述文字”在视频下方显示文本，不遮挡图示。章节菜单按 `chapters.json` 跳转。输出章节时间为 0、30、68、108、138、172 秒；后四个时间分别对应源时间 62、96、126、154 秒。锚点处的新阶段原帧在该处定格结束后出现，导航落在新阶段原帧。

直接播放 MP4 可听到教师与描述的混音；要开关描述，请使用播放器。

## 文件与声音素材

- `base_track.wav`：从输入 source.mp4 解码的原教师音轨，逐样本迁移；三个定格段为静音，无教师压低、删字或变速。
- `ad_track.wav`：按计划排列的独立描述轨。
- `mix.wav`：上述两轨的逐样本和，无额外增益、压缩或限制器；成片音轨由此文件编码。
- `cues/AD*.wav`：逐条描述的最终真实语音素材，48 kHz 单声道 PCM 16 bit；对应的 TXT 是实际送入 TTS 的文本。仅裁去合成器多余的尾部静音，保留约 180 ms 尾垫，没有加速。
- `description_plan.json` 与 `description.vtt`：按输出时间逐条对应；区间包含该条完整 WAV，字幕为外挂。
- `timeline.json`、`chapters.json`、`player_config.json`：完整时间轴、六个导航锚点与独立音轨设置。
- `revision_audit.json`：旧 VTT 第 1—8 条逐条修订及实际新 cue 引用。
- `public_checks.json`、`rebuild_check.json`：公开合同自检与实际独立重建记录，不是评分。

新描述使用题包指定 TTS 兼容工具的 V05 配置：Microsoft Kangkang，rate 0，pitch multiplier 0.88。制作阶段合成的最终 WAV 已全部交付。**重建直接读取这些 WAV，不调用 TTS、代理或网络。** 输入视频和旧描述素材来自题包；图示为题包自主制作的教学示意。题包列明的注意力概念/代码参考为 Grant Sanderson / 3Blue1Brown 的 [attention.py](https://github.com/3b1b/videos/blob/master/_2024/transformers/attention.py)，仓库声明 CC BY-NC-SA 4.0。完整原始署名见 `CREDITS.md`；本交付仅在指定本地目录制作。

## 离线重建

`rebuild.json` 的参数数组保留题目规定的占位符：

```json
["{python}", "{submission}/rebuild.py", "--input", "{input}", "--assets", "{submission}", "--output", "{output}"]
```

例如在本环境中，从原始输入和提交的逐条 WAV 重新生成到一个空目录：

```bash
python3 /workspace/submission/rebuild.py --input /candidate/input --assets /workspace/submission --output /workspace/scratch/rebuild_check
```

重建脚本解码输入视频的原声音，按 timeline 插入静音并合成三个音轨；对输入全部视频帧重新编码，按帧编号延后时间戳，使用前一帧填充三个 150 帧空隙。不会读取或复制已有成片。输出 H.264 High / yuv420p，CRF 10，AAC 256 kb/s；成片音轨直接来自 mix.wav，未单独调节增益。重建目录也会获得逐条 WAV、播放器和元数据。

固定制作与重建依赖版本：Python 3.12.3；NumPy 1.26.4；soundfile 0.14.0（libsndfile 1.2.2）；FFmpeg / FFprobe 6.1.1，含 libx264 与原生 AAC 编码器。重建依赖均已在环境中提供。

## 核查方法

新版事实依据实际视频提取的全画面关键帧及过渡帧人工目视核对，并结合公开词典、教师稿和教师保护区间；旧句依据 old_ad.vtt 对照修订。没有访问私有状态表、真值或其他题目。

音频核查实际采用本地 `transcribe`（faster-whisper 1.2.1、small/int8/CPU）的词级转录、PCM 波形及时间窗口分析。转录中的“它/她”“输/书”等同音字按送入 TTS 的文本及画面标签校核，转录不是参考答案。未使用原生音频听觉输入或外部音视频模型，也未作主观评分。制作观察使用 Pillow 10.2.0；校验 JSON schema 使用 jsonschema 4.10.3。这些是制作/自检工具，不是重建依赖。

可重复运行公开自检：

```bash
python3 /workspace/submission/verify.py --input /candidate/input --submission /workspace/submission --report /workspace/scratch/check_again.json
```

自检验证 schema、逐条 WAV/VTT、教师窗口、逐样本叠加、章节迁移、整段原声音及定格静音；并将成片与 mix 转为 16 kHz 单声道比较。画面核查对所有 4950 帧进行完整画面的 32×24 灰度缩略比较，逐帧匹配原片 4500 帧及三段锚点前末帧定格。具体数值见 `public_checks.json`。播放器代码经静态检查；本环境未提供图形浏览器，未声称进行浏览器交互实测。
