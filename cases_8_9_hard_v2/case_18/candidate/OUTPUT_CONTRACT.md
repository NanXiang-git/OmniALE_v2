# 交付合同

提交目录只能包含以下9个文件；不得夹带源片、原始人像、额外音轨或源姓名。不要把脚本或缓存放进提交目录。

| 文件 | 约束 |
|---|---|
| anonymous.mp4 | 300s，704×640，25fps，7500帧；恰好1视频+1 ALAC 音频+1 中文字幕轨，元数据不得含目标姓名 |
| mask.mkv | 同尺寸/帧率/时长的灰度二值遮罩，推荐FFV1无损；白色(255)替换为RGB(16,16,16)，黑色(0)保留；不得有音轨 |
| final_audio.wav | 恰好4,800,000采样，16000Hz单声道16位PCM；从提供分轨建立定向删除混音 |
| subtitles.json | 与input/subtitle_cues.json结构、顺序、ID、start/end、speaker完全相同，只按下文改text |
| zh.srt | 与tools/render.py根据上述JSON生成的SRT完全一致；重叠发言被合并为多行同一时段，不能丢一个人的文字 |
| cover.png | 源首帧按照mask首帧处理后的无损PNG；必须与匿名成片首帧表达一致 |
| project.json | 下方固定结构，不能执行任意代码 |
| edits.json | target固定B；visual/audio/text/checks各为非空数组，记录处理区间、决策及自检依据，使用匿名称谓 |
| README.md | 中文交付说明、使用方法、已知局限；不得重新暴露目标姓名 |

project.json（SHA请自行计算；不允许额外字段）：
```json
{"version":1,"renderer":"omni18-v3","source_sha256":"programme.mp4的SHA256","mask":"mask.mkv","audio":"final_audio.wav","subtitles":"subtitles.json"}
```

字幕编辑规则：A/C/D文字完全保留。B的身份自述两处统一改为“我是受访者B，负责用户界面。”，B其他文字保留。主持人字幕原样保留，包括“受访者B”称呼和“林岚研究所”。JSON 的 speaker 保持原 B 代码，渲染的 SRT 和 MP4 字幕统一显示“受访者B”。既有译稿中的省略号表示原录音片段未说完整，不得补写不存在的决定。所有时间戳半开区间，精度保持输入值。

音频逐采样等于 A+C+D+host 的整数 PCM 和。B 整轨不进入混音。最终 WAV 与 MP4 解码出的 ALAC 均须为 16kHz 单声道 16-bit，起点为零，恰有 4,800,000 个采样，与参考 PCM 的差异为 0。主持轨全部保留。建议用 32 位整数完成求和后转成 16 位 WAV。

遮罩：每个同时可见的目标脸都要处理，位置会变化。可以围绕目标面部加适当边缘，不得遮整个机位；目标姓名带可以在题方允许区域内覆盖。所有可见目标核心区域和姓名带像素必须覆盖，允许区外及非目标脸像素禁止遮挡。对原片逐帧应用所交遮罩后，应与实际MP4平均绝对像素误差≤4/255（逐帧），任一通道误差>32的像素占比≤1%。这是常规CRF18编码容差，不允许重构背景或改变其他人的面孔。cover.png须与该重建首帧像素完全一致。

最终成片还对**每一个人脸实例**单独核对，不能靠大画面的平均数掩盖小画中画泄漏：目标脸/姓名区域相对于深灰16的MAE≤3，任一通道偏差>24的像素≤0.5%；非目标人脸相对于源帧MAE≤4、任一通道偏差>32的像素≤1%。建议在目标脸周围保留合理遮罩边缘，避免编码边界漏出面部。

推荐完成遮罩、音频、字幕与project.json后运行：
```powershell
python tools/render.py --submission D:\omniALE\submission_18 --source input/programme.mp4
```
渲染器生成/覆盖anonymous.mp4、zh.srt、cover.png；其余六个文件仍由解题者提交。素材与输出应位于D盘。Python需numpy、opencv-python；FFmpeg在PATH。可在其他软件中完成编辑决策，但最终文件须满足同一合同。

程序通过后进行原生声画裁判，证据不足显示待评。硬条件失败即不予验收，正式总分最高 59。
