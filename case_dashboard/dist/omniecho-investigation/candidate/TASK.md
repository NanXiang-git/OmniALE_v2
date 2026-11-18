# 多声源事件调查与证据报告

你是视听材料调查员。调查 incident.mp4 中的报警、塑料摩擦和钥匙声，为复核者交付可播放、可追溯的证据档案。coverage_manifest.json 给出必须覆盖的检查记录及待填字段，按声源和时间组织你的调查。

自主选择分析顺序、重听/抽帧、空间分析和证据片段；通过 export_evidence 导出原声证据。必须提交 report.html、findings.json、evidence_manifest.json 以及 evidence/ 下的实际证据文件。报告按 findings.json 渲染可判分字段，每条报告结论有对应 record_id 锚点和可播放证据。最终调用 validate_submission，再 submit 封存；这两个操作均不返回正确性。

## 字段与证据
方向用 front/front-left/left/back-left/back/back-right/right/front-right。turn_direction 为 left/right；turn_degrees 是非负角度；same_turn_direction 是 yes/no；距离单位米。依 findings.schema.json 填写全部检查记录，record_id 不得重复。

evidence_manifest.json 的 evidence 数组放 export_evidence 返回的完整回执，包含 evidence_id、start_s、end_s、path、sha256、source_sha256。findings.evidence_ids 引用这些 evidence_id。时刻检查片段需覆盖时刻前后各 0.25 秒（到媒体边界时截断）；区间检查需完整覆盖原区间。一个片段可支撑多条结论，无需重复复制。此上下文长度是新增格式约定，不是语义标注。

原四通道证据采用 MKV＋FFV1＋PCM，可用本地 FFmpeg 解码；工具另给浏览器双声道 MP4 预览。报告同时提供原件链接与可播放预览，并注明预览混音。证据只证明来源与时间覆盖，不能替代方向事实正确性。

## 执行环境与输入边界
正式推理禁用公网检索，模型服务通过宿主代理调用。允许 Python/FFmpeg 等本地工具。只挂载本题 candidate 目录与会话工作区；不得挂载出题看板、private、research 或其他会话目录。题包本身不是 OS 沙箱，正式跑题前必须由 runner 实施网络/文件系统隔离。原四通道素材用于分析；看板双声道有损预览只供人工理解。

unknown 允许，但相应事实不得分。不得枚举候选；不得伪造回执、修改原媒体内容或查询隐藏答案。模板为空白骨架，未达到提交要求。
