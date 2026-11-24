# Windows Resolve 原生 API

在 Python 中先执行 sys.path.insert(0, '/runtime')，再使用 from resolve_rpc import resolve_call。调用 resolve_call('操作', **参数)，结果返回 ok 与 result。检查实际对象、渲染状态和文件。

- status 查看版本和本次工程名。new_project 创建独立工程及 512×288 / 25 fps 设置。
- import_media(path='/workspace/submission/assets/name.mov') 返回媒体 ID。源路径必须处于 /candidate 或 /workspace。对于 PNG 序列，可传 start_index 和 end_index，路径用 %04d.png。音轨可直接导入 WAV。带 Alpha 的 25 fps ProRes 4444 中间件适用于 Resolve。
- media_properties(media_id=..., properties={'Alpha mode':'Straight'}) 设置前景的 Alpha 解释。可查返回的 current 字段。
- project_settings(settings={...}) 设置分辨率、帧率、色彩空间或 Gamma。检查实际应用值。
- create_timeline(name=..., video_tracks=2) 建立从 00:00:00:00 开始的时间线。
- append(timeline=...,media_id=...,media_type='video',start_frame=0,end_frame=300,record_frame=0,track_index=1) 加入底层。带 Alpha 的前景放第二视频轨。加入对白时传 media_type='audio' 和 track_index=1。注意区分片段终点与渲染入出点。
- item_properties(timeline=...,track=2,index=1,properties={...}) 可调整 CompositeMode、Opacity、ZoomX、ZoomY、Pan、Tilt 等属性。
- inspect 查看当前工程、时间线层、媒体和渲染任务。
- render(timeline=...,output='/workspace/submission/finished.mp4',mark_in=0,mark_out=299,audio=True) 调用原生 MP4 H.264 + AAC 输出。目标路径不可已存在。
- render_status(job_id=...) 查看任务。export_project(path='/workspace/submission/project.drp') 保存并导出。
