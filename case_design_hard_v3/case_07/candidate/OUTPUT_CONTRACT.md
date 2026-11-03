# 交付合同

固定版本 `case3-resolve-green-v3.1-draft`。文件名与字段见 `submission.schema.json`、`report.schema.json` 和 examples/。

| 文件 | 规格 |
|---|---|
| output_1.mp4 / output_2.mp4 | MP4 容器、单路 H.264 视频、512×288、25/1 恒定帧率、100 帧、标称 4 秒、无音频/字幕/额外视频流 |
| submission.json | 版本、源编号、两条固定视频路径、对应 clip ID、帧映射、工程名/路径、README 路径、时间线名、render job ID |
| report.json | 实际方法、目标处理策略、工具/模型及版本、GUI/API 使用方式、颜色与 alpha 约定、局限 |
| project.drp | 必需；两条时间线，可编辑前景/遮罩/绿底合成；独立重开重渲染核验 |
| README.md | 必需；版本、时间线、重链接、方法、色彩/alpha 与局限说明 |
| assets/、scripts/ | 实际用到的非题包中间素材及工程构建脚本；不用则无需提供 |

时间从零开始，帧 n 对应 n/25 秒，输入与输出同序号对齐。容器/流 duration 允许一帧（0.04 秒）记录误差，仍须严格解码出 100 帧；不能据此多一帧或少一帧。

允许 Resolve 原生 MP4 附带的 `data/tmcd` 时间码元数据轨；它不算额外视频、音频或字幕。其他额外流仍不允许。

输入 PNG RGB 为 sRGB。参考合成使用 `C_linear = alpha*F_linear + (1-alpha)*G_linear`，G 为绿色，再编码 sRGB；alpha 是覆盖率，不做 gamma 变换。中间素材如为预乘 alpha，导入时正确解释并配置，不能直接当 straight alpha 使用。

`render_preset.json` 描述格式目标，不是承诺每版 SDK 都接受的 API 字典。当前提供的 FFmpeg 参考编码是作者生成参考用的固定实现，不是允许替代 Resolve 最终交付的捷径。Resolve 免费版渲染设置、色彩管理和量程须在环境预检后冻结并公开。

背景色误差和软边误差当前只报告诊断数值，不设置未经校准的硬阈值。实际软件审计来自评测端，不把 solver 自写报告当作合规证据。无需购买/安装未在环境清单提供的插件。
