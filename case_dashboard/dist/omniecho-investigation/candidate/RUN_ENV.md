# 本轮运行适配（两模型完全相同）

开发试跑；xhigh，35分钟墙钟。WSL/bubblewrap 禁网，模型服务仅经宿主代理。/candidate 只读；/workspace 为独立工作区；交付文件写 /workspace/submission。原音频用本地信号处理工具分析，支持 numpy/scipy/soundfile/Pillow/FFmpeg，不是原生音频输入轨道。无其他模型、ASR 服务或联网检索。

工具通过宿主管道调用，不需要 session_id：
```
python /runtime/tools/task_tool.py list_stations
python /runtime/tools/task_tool.py listen_at '{"station_id":"M01"}'
python /runtime/tools/task_tool.py record_observation '{"receipt_id":"<实际回执>","direction":"unknown","distance_m":"unknown"}'
python /runtime/tools/task_tool.py finalize_location '{"candidate":"<单个字母>","evidence_ids":["<实际回执>"]}'
python /runtime/tools/task_tool.py export_evidence '{"start_s":0,"end_s":1}'
python /runtime/tools/task_tool.py validate_submission
python /runtime/tools/task_tool.py submit
```
初始回执见 /workspace/session.json。Case 3 已交付录音会由宿主复制到 /workspace/submission/evidence/Mxx.wav；只有已解锁点可见。Case 1 export_evidence 生成四通道 MKV 与浏览器预览 MP4，返回完整回执；不要篡改它们。

为了可复核报告与结构化结论一致性，请从最终 JSON 渲染报告，并把同一完整 JSON 对象嵌入报告的 `<script type="application/json" id="structured-findings">…</script>`。显示文本必须与 JSON 相同；嵌入匹配并不豁免散文事实冲突。报告需离线、有声源/时间（或录音回执）索引、可播放证据和下载原件链接。

Case 3 selected_location.png 在原图上圈出你选择的 A/B/C/D，保持原场景内容；location_report.html 明确展示该图。所有观察以宿主冻结记录为准。可生成双声道浏览副本，但保留原四通道。失败/未知照实记录，不枚举候选。submit 是封存操作，不返回正误。
