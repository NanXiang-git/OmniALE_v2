# Case07｜双人访谈抠像与对白分轨

交付一条访谈绿底成片和两条独立对白轨。A 是 person_A.jpg 中穿白色外套的人，B 是 person_B.jpg 中拿笔记本的人。A、B 会交换画面位置。素材为真人对白配录，画面动作为辅助。开场第一位说话者是 A，第二位是 B。

## 输入

- input/source.mp4 是 12 秒音画预览。input/frames/0000.png 到 0299.png 为权威图像，512×288、25 fps。
- input/mix.wav 为混音的无损副本，双声道、48 kHz、576000 样本帧。
- input/person_A.jpg、input/person_B.jpg 为人物参考，input/green.png 为标准绿底。

## 模型交付

在 /workspace/submission 提交 finished.mp4、voice_A.wav、voice_B.wav、project.drp、submission.json、README.md，以及重链接所需资产与脚本。submission.json 填 project_name、timeline、render_job_id 三个非空字符串。README.md 记录方法、色彩和重链接方式。

- 画面只保留 A 的当帧可见部分。B、场记板和原背景换成标准纯绿。保留 A 的动作、发丝、手和位置。遮挡位置显示绿底，重新显露后接回同一人。保持全部 300 帧、分辨率、帧率和帧序。
- 两条 WAV 均为双声道 PCM16、48 kHz、576000 样本帧，各自保留原声音色、对白、响度和时轴，去除音乐与另一位说话者。重叠时两条轨都应有各自内容。
- finished.mp4 为 H.264 加 AAC，只带 A 的分离对白。使用 DaVinci Resolve 原生 API 实际编辑合成和渲染，保留独立绿底、带 Alpha 的 A 前景和 A 对白。可用传统算法或本地模型做中间资产。API 用法见 API_RUNTIME.md。
- 临时文件放 /workspace/scratch。隔离工作区，无外网，作答无总时限。

## 评分

画面 70 分。预设帧覆盖无遮挡、交叉、前景道具滑过和重新显露。通过原题主体与编辑门槛后，按整帧边缘 IoU 30%、目标区边缘 IoU 70% 计分。

声音 30 分。自动项 22 分，其中对齐波形保真 10 分、双人重叠区 8 分、非己方话段残留 4 分。A、B 等权且固定身份。独立听评 8 分，两位说话人的内容与音色各 2 分，隔离及伪影各 2 分。工程重开、重渲染和音画一致性单独核验。
