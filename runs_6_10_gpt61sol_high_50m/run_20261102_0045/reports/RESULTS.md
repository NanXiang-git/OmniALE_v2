# 第6—10题串行实测结果

固定条件：gpt-6.1-sol + Codex CLI 0.163.0，high，每题最多50分钟，独立上下文，顺序6→7→8→9→10。已冻结答案不由主持人修复。

**第9题已追加Qwen原生音视频补评，其余题总分仍待评**：原指定Judge听审受限；补评分及证据独立记录。程序分及有证据的视觉/文本分不等于最终总分。

| 题号 | 题目 | 答题耗时 | 运行状态 | 程序分 | 已核实小计 | 总分 | 验收状态 |
|---|---|---:|---|---:|---:|---|---|
| 6 | 长片中文解说 | 40.77分钟 | finished | 35.000/35 | 35.0 | 待评 | 待听审 |
| 7 | 节目发布质检 | 37.78分钟 | finished | 62.143/75 | 62.143 | 待评 | 硬约束未通过 |
| 8 | 粗剪连续性审查 | 29.16分钟 | finished | 77.077/80 | 82.077 | 待评 | 待听审 |
| 9 | 会议定向去标识化 | 19.66分钟 | finished | 40.000/80 | 60.0 | 60.0 | 硬约束未通过 |
| 10 | 课程中文音频描述修订 | 9.90分钟 | finished | 45.000/45 | 45.0 | 待评 | 待听审 |

## 逐题文件

已排除2次基础设施中断试次；轨迹和文件保存在interrupted_attempts中，不计入上表。正式试次重新初始化上下文，没有继承旧答案。当前采用绝对UTC截止，并通过时间跳变测试；队列保持系统唤醒。

本轮第6题在绝对截止前完成，墙钟用时40分46秒。初始监控因WSL时钟差异误标中断，核验成功退出、全部文件时间和哈希后已纠正；没有重跑或改动答案。原记录及修正依据见[计时核验](case6_timing_reconciliation.json)。计时以墙钟为准，暂停和等待均占用预算。

第6题初次程序评分遇到Windows→WSL参数传递错误，重建检查未执行完整；该次分数已作废归档。修复为直接执行并通过滤镜及路径参数测试后，仅重评原冻结答案；没有更改题目阈值。

- 第6题：[冻结答案](../sealed/case6/submission)、[输入输出冻结记录](../sealed/case6/MANIFEST.json)、[可见运行轨迹](../solver/case6/events.jsonl)、[程序检查](../judge/case6/technical.json)、[评分明细](../judge/case6/score.json)。
- 第7题：[冻结答案](../sealed/case7/submission)、[输入输出冻结记录](../sealed/case7/MANIFEST.json)、[可见运行轨迹](../solver/case7/events.jsonl)、[程序检查](../judge/case7/technical.json)、[评分明细](../judge/case7/score.json)。
  程序未通过项：精确率未达到80%；召回率未达到90%。
- 第8题：[冻结答案](../sealed/case8/submission)、[输入输出冻结记录](../sealed/case8/MANIFEST.json)、[可见运行轨迹](../solver/case8/events.jsonl)、[程序检查](../judge/case8/technical.json)、[评分明细](../judge/case8/score.json)。
- 第9题：[冻结答案](../sealed/case9/submission)、[输入输出冻结记录](../sealed/case9/MANIFEST.json)、[可见运行轨迹](../solver/case9/events.jsonl)、[程序检查](../judge/case9/technical.json)、[评分明细](../judge/case9/score.json)。
  程序未通过项：部分帧的目标脸遮挡不足；遮挡范围超出允许区域。
- 第10题：[冻结答案](../sealed/case10/submission)、[输入输出冻结记录](../sealed/case10/MANIFEST.json)、[可见运行轨迹](../solver/case10/events.jsonl)、[程序检查](../judge/case10/technical.json)、[评分明细](../judge/case10/score.json)。

历史原始批次[完整性核验](final_audit.json)已通过：五题串行时间、冻结答案哈希、每题两次指定模型/high评审回执均核实；所有总分保持null。


## 解释与复现

Judge继续使用gpt-6.1-sol high。每题提供有限的实际画面与提交文本做独立诊断；诊断不补算未听审的内容分。第8题usable_report为独立可评的5分视觉/文本标准，其余冻结LLM内容项均包含声音条件，保持pending。两个独立评审有分歧时使用第三次仲裁。所有语义硬门槛仍需完整听审。

环境隔离、TTS和Codex实际调用、独立子进程硬截止已通过预检。只挂载当前公开candidate；作者材料、真值、评测日志、其他题和密钥不向Solver暴露。API网关强制模型名和high。没有预装ASR或额外音频模型，网络关闭；这是本次工具环境条件，不可把由此产生的限制说成所有Codex环境都不具备该能力。

评分使用原题包冻结标准，运行副本与原素材校验；不执行考生代码。正式开始后的API等待、媒体处理、配音与自检计入50分钟。超时杀掉整个隔离进程树，提前结束按实际结束时刻冻结。单次观察不构成普遍难度结论。

用量、API调用次数、返回模型及推理配置（Judge端）、开始结束时间见results.json。脚本位于../orchestrator；环境、能力探针及来源记录位于../environment。不要把私有评分文件交给被测模型。

## 第9题后续补评（2026-11-05）

原程序40/80不变，Qwen3.8-omni-flash补评20.0/20，总分60.0，硬门槛未通过。Solver和冻结答卷未改变。Qwen采用供应商默认推理配置，不声明high。上文gpt听审限制及旧完整性核验描述的是原始批次，不能套用于此次补评。

[补评完整性核验](../judge_supplements/case9_qwen38omni_20261105/integrity_audit.json)；[评审共识](../judge/case9/review.json)。
