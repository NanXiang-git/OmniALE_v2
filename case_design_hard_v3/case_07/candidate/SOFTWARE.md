# 软件准备与允许的工具

目标环境：Windows + DaVinci Resolve **普通免费版 21.1.2.10**。本机已安装并能启动，附带 Python 与 SDK 模块可加载；外部 `scriptapp('Resolve')` 返回 None。内部脚本桥接、Fusion 操作及完整渲染尚待预检。无需 Studio，不依赖 Magic Mask 等 Studio 专属功能。

## Agent 如何操作

参考 OmniALE 3A 的“免费版 + 原生 Lua 脚本桥接”：由出题端在计时前启动 Resolve，并从应用内部的 Console 或 Scripts 菜单启动本地脚本入口。Agent 通过工具提交 Lua 代码，在 Resolve 进程内部调用原生 API，取得结构化结果；必要时允许 GUI。首次 GUI 启动可以由出题端完成，不把点鼠标作为能力要求。

普通版内部脚本与 Studio 的 External scripting=Local 是不同路线；本题不要求普通版开放外部 API 端口。官方 SDK 文档列出内部 Console/菜单入口，本机可用入口和 API 范围须实测后冻结。接口设计见 TOOL_PROTOCOL.md，当前为待部署/验证的协议，不是已连通工具。

创建时间线、导入、访问 Fusion 合成、修改节点、渲染和导出工程须逐项预检。未覆盖的操作允许 GUI；不能假设有“一键人物抠像 API”。官方 SDK 位于 `%PROGRAMDATA%\Blackmagic Design\DaVinci Resolve\Support\Developer\Scripting\`。

## 辅助工具与流程边界

允许 Python、OpenCV、FFmpeg 做查看、格式转换和自检；允许冻结清单中提供的分割/跟踪模型生成 mask 或带 alpha 的前景。中间素材须交付并能重链接。最终在 Resolve 内保留可编辑的前景、遮罩/alpha 与绿底合成关系，由 Resolve 渲染；禁止外部先生成完整绿底成片再导入原样转码。不按节点、代码行或鼠标点击数量评分。

所有模型使用相同冻结环境。GPU、辅助模型、桥接和渲染状态尚待确认；未列出的模型不能假定已安装。

## 计时与预检

答题预算 120 分钟。出题端先验证内部脚本、导入、两条时间线、Fusion 合成、渲染、工程导出/重开/重链接，再开始计时。基础设施恢复须留痕，不提供抠像建议；有效处理与失败渲染计时，纯停机等待另记。环境失败不计模型零分。

本修订只修改题目和测评机制，不运行 solver、裁判或 Case3 渲染实验。

参考：[OmniALE 3A 题目](https://huayuankou333.github.io/omniale/resolve/files/task-current.md)、[实际工具轨迹](https://huayuankou333.github.io/omniale/resolve/records/gpt-6-luna/tool-trace.json)。对方公开轨迹不等于本机验证结果。
