# Resolve 原生脚本工具协议（待配置）

本文件规定未来正式环境向 Agent 提供的能力。**当前桥接尚未部署或连通，不是可立即调用的工具清单。** 出题端负责配置通用工具，不预置目标 mask、参考节点参数或抠像成品。所有模型使用同一预检通过并冻结的实现。

| 接口 | 入参 | 返回与边界 |
|---|---|---|
| resolve_status | 无 | 版本、会话 ID、工程/时间线列表、已验证能力；只查询 |
| resolve_lua | code | Resolve 内执行 Lua，提供 resolve、project、media_pool、INPUT_ROOT、OUTPUT_ROOT；返回 request_id、ok、result、prints、error、耗时 |
| render_video | timeline_index、output | 指定原生时间线渲染；返回真实 job_id、状态、路径、哈希和解码规格；不替 Agent 设计抠像 |
| render_status | job_id | 查询状态；超时不能未经核查直接重复提交 |
| export_project | output | 导出真实 DRP；文件存在不等于可编辑验证通过 |
| frames / probe | 文件、时间或帧号 | 查看公开输入及自己的中间/最终产物；不暴露隐藏答案 |

架构：外部 Agent → 本地请求/回执通道 → 从 Resolve 内启动的 Lua 入口 → Resolve/Fusion API。首次 GUI 启动属于环境配置；Agent 可使用 GUI 或主要通过脚本工作。传输机制由实现决定，不声称等同于对方未公开的桥接源码，不要求开启 Studio 外部脚本功能。

每次执行使用唯一 request_id、session_id，记录参数、提交/结束时间、状态、错误及实际观察。请求文件完整写入后才发布；超时先核对回执及真实工程，避免重复创建/渲染。日志由编排端保存，Agent 方法报告不能替代日志。

这不是沙箱承诺：原生 Lua 入口不能自行隔离任意代码。正式测评须用独立账户/工作区及文件权限控制输入、输出和私有评测目录，隐藏答案不应出现在可读范围。仅检查工具路径不足以隔离任意脚本。

桥接只提供通用操作，不自动选人物、生成分割、修边或把评委结论反馈给 Agent。允许查看官方软件文档，禁止访问隐藏参考/历史答卷。
