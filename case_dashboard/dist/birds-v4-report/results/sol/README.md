本目录为六章中文鸟类科普视频交付。

必需文件：final.mp4、narration.wav、subtitles.srt、segments.json。

成片保留输入的画面顺序、正常速度和完整时间线，以1280×720、30fps、H.264/AAC转码。最终时长185.500秒，覆盖输入末帧；输入容器时长185.504秒。原片的时间戳在章节接缝处有极小空隙，常规30fps转换只填补这些帧间时间，不进行删章、变速、人工冻结或图片替换。

配音使用 edge-tts 7.3.1 调用 zh-CN-XiaoxiaoNeural，rate=-5%、pitch=+0Hz，统一普通话女声。17段自写文本分别合成，保留服务返回的自然停顿，没有用变速挤压时长。仅旁白文字发送给语音合成服务，没有上传输入视频、原音轨或画面。synthesize_narration.py 为实际实现，narration_plan.json 为实际文本和排布，tts_implementation.json 记录方案，narration_intervals.json 记录解码后的时间区间。

narration.wav 为48kHz、16-bit PCM、单声道，长度与成片一致，未配音处为数字静音。原声保留双声道及原来的每个采样位置，只进行章节音量平衡、旁白时约9dB避让及输出峰值限制。未添加音乐、参考鸟叫或任何伪造的动物声音。mix_report.json 记录增益及淡变参数。

中文字幕依据语音服务实际返回的字词时间戳生成。subtitles.srt 与烧录使用的 burn_subtitles.ass 文字、时间一致（ASS以百分之一秒精度储存）。多数字幕放在底部空地或原有黑边，末章字幕放在右下方并适当换行，避开中央前景雏鸟和成鸟头颈。

限制：没有原生听音工具，未亲耳试听。实际以numpy/scipy读取原声和合成语音，查看声谱、幅度、停顿与字词边界，并人工检查画面动作。因此不声称完成主观听感验收。segments.json 如实记录识别置信度、遮挡情况与声音归属限制。第二、四章保留暂定判断。未调用其他识别模型或子代理。

独立资料研究见 research_log.json；其中包含成功访问、失败访问、放弃来源和安装过程。参考鸟叫仅用于人工查看候选物种的一般声谱结构，均排除在混音输入之外。没有反向搜图、声纹检索或原素材溯源，也没有访问题目禁止的域名。

复现命令（须保留输入路径）：

```bash
python3 -m pip install --target /workspace/site-packages -r /workspace/submission/requirements.txt
mkdir -p /workspace/scratch
ffmpeg -y -i /candidate/birds_source.mp4 -vn -c:a pcm_s16le /workspace/scratch/original.wav
python3 /workspace/submission/synthesize_narration.py
python3 /workspace/submission/assemble.py
bash /workspace/submission/render.sh
```

中文字体为 WenQuanYi Micro Hei，已附 fonts/wqy-microhei.ttc 和许可证。依赖的实际版本见 environment_versions.json；FFmpeg须支持libx264、AAC和libass。
