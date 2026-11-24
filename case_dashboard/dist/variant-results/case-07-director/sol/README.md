# Case07 人物绿底交付

| 成片 | 保留对象 | 导播口令 |
| --- | --- | --- |
| `output_1.mp4` | 画面右侧的白大褂人物 | “Keep the person on the right.” |
| `output_2.mp4` | 画面左侧拿笔记本的人物 | “Keep the person on the left.” |

使用 FFmpeg 的 PocketSphinx 滤镜离线识别导播 WAV，逐段记录在 `cue_decisions.json`。两段成片均为 RGB 4:4:4 无损 H.264 MP4，512×288，25 fps，100 帧，4 秒，无音轨。完全透明区域解码为 RGB(0,255,0)。

## 前景分离

Python、NumPy、OpenCV 和 SciPy 从权威 PNG 序列的空场区域重建固定背景。按口令选定人物的一侧，逐帧比较源像素与背景，通过邻近不透明像素的线性光颜色估算边缘覆盖率，再从半透明像素中扣除原背景的颜色贡献。每个前景像素来自同一帧的实际画面。

`assets/clip_1/` 和 `assets/clip_2/` 各含 100 张实际用来渲染的 16 位 RGBA PNG。RGB 为 sRGB，alpha 为直通覆盖率（straight alpha）。序列的 `0000.png` 到 `0099.png` 与成片逐帧对应，画幅内位置来自输入 PNG。

## 离线重建

在交付目录运行以下命令。需要 Python 3.10 或更新版本、NumPy、OpenCV 和带 `libx264rgb` 的 FFmpeg。脚本读取交付的 RGBA 序列，在线性光中合成 RGB(0,255,0) 绿底，再编码为 MP4。

```sh
python3 -B scripts/render.py --output /workspace/scratch/rebuild --scratch /workspace/scratch
```

如需从权威 PNG 重新提取前景，另需 SciPy。

```sh
python3 -B scripts/extract_foreground.py /candidate/input --assets /workspace/scratch/rebuilt_assets
python3 -B scripts/render.py --assets /workspace/scratch/rebuilt_assets --output /workspace/scratch/rebuild --scratch /workspace/scratch
```

本次采用 `TASK.md` 允许的离线脚本交付，Resolve 软件合规待核验。正式边缘分和视觉门槛结果由持有隐藏参考及独立裁判结果的评测端计算。
