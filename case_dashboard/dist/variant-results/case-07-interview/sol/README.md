# Case07 双人访谈

`finished.mp4` 为 Resolve 原生渲染成片，画面为 512×288、25 fps，共 300 帧，配有 A 的双声道 AAC 对白。`voice_A.wav` 与 `voice_B.wav` 均从原始零点开始，各为 48 kHz、双声道 PCM16、576000 个样本帧。`submission.json` 记录实际工程、时间线与交付渲染任务。

## 处理方法

- 逐帧使用 `input/frames`。参考 `person_A.jpg` 跟踪白外套人物，通过可见背景拟合原背景的纹理与移动光照。对三个镜头中相同的姿势做配准，用于在交叉区域判定 A 的轮廓。根据 B 的前景边缘与场记板的位置扣除遮挡，只保留 A 当帧可见的区域。半透明边缘保留在 Alpha 中。
- 从 `mix.wav` 估计合成器乐的音高、包络及声像并减去其估计波形，再根据两位说话者随时间变化的左右声道增益求解对白。开场对应 A，随后发言的人对应 B。两人同说时同时求解两轨。对白保留原始采样网格及电平，片段边界使用短淡变。

## 工程与色彩

时间线 `Case07 - Person A` 从 `00:00:00:00` 开始。两个画面层和对白层均连续覆盖 300 帧。

| 轨道 | 媒体 | 内容 |
| --- | --- | --- |
| V1 | `assets/Green.mov` | 来自 `green.png` 的 RGB `#00FF00` 标准绿底 |
| V2 | `assets/Person_A_Straight.mov` | A 的 ProRes 4444 前景，Alpha 设为 `Straight` |
| A1 | `voice_A.wav` | A 的 48 kHz 双声道对白 |

项目使用 DaVinci YRGB，时间线与输出色彩空间设为 Rec.709 Gamma 2.4。中间件以 Rec.709 视频电平编码。Resolve 的 H.264 输出为 8 位 4:2:0，平坦绿底区域解码测得 RGB `(0, 252, 0)`，底层素材解码为 `(0, 255, 0)`。

## 重链接与复核

1. 将交付目录整体保留并在 Resolve 项目管理器中导入 `project.drp`。
2. 若媒体离线，在媒体池选中两个 MOV，使用 **Relink Selected Clips** 指向 `assets` 文件夹。将 `voice_A.wav` 指向交付目录。也可在启用了 Resolve Python 脚本 API 的环境中，打开工程后运行 `scripts/relink_case07.py`。
3. 确认 V2 素材的 **Alpha Mode** 为 **Straight**。在 Deliver 页选择单片段 MP4 H.264 与 48 kHz 立体声 AAC，渲染整个时间线。隔离环境内可用 `scripts/render_case07.py` 从当前工程通过原生桥重新渲染到交付目录中的新文件名。

已检查导出工程的归档完整性及两条画面轨和一条音轨。对活动工程进行了两次原生渲染，两次解码的音画流哈希一致。AAC 相对 A 轨为零样本偏移，两个声道的波形相关系数均大于 0.9998。AAC 封装末端含 512 个填充样本。此环境的原生桥提供工程导出，导入操作需要 Resolve 项目管理器。
