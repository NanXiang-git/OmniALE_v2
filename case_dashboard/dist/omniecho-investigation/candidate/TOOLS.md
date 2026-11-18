# 宿主工具契约 v1

由宿主创建唯一会话并提供 session_id 和服务地址。所有 API 返回 JSON，错误不改变预算。POST /api/<tool>，JSON 含 session_id。工具名：list_stations、listen_at（station_id）、record_observation（receipt_id,direction,distance_m,candidate_belief 可选）、finalize_location（candidate,evidence_ids）、export_evidence（start_s,end_s）、validate_submission、submit。

listen_at 返回原四通道的受控 URL /media/<session_id>/<station_id>.wav、回执和剩余预算；工具已把完整录音交付会话目录。record_observation 返回是否修订，所有记录由宿主保存，下一次新查询或定案冻结原观察。

export_evidence 仅 Case 1，返回 evidence 回执与预览文件地址，实际写入会话 workspace/evidence。模型将交付物写到同一 workspace。validate_submission 仅检查结构、文件、证据出处、冻结观察及报告锚点等，不给事实反馈；submit 在通过后复制到独立 sealed 并生成 SHA256 清单，后续修改工作区不影响封存版本。宿主保存 query_trace.jsonl。

本地作者服务含创建/重置演示会话及查看真值能力，禁止向 Solver 暴露。正式模式 --solver-session SESSION_ID 仅服务已由宿主创建的一个会话，不能创建/重置会话、读看板或其他会话。正式启动仍需独立 OS 沙箱与禁网 runner。
