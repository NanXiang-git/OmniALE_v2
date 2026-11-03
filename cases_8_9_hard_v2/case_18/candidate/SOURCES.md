# 来源、改编及授权

真实会议来源：**AMI Meeting Corpus，会议IS1009a**。原始信号由 AMI Consortium / University of Edinburgh 托管；官方说明与下载入口：

- https://groups.inf.ed.ac.uk/ami/corpus/
- https://groups.inf.ed.ac.uk/ami/corpus/license.shtml
- https://groups.inf.ed.ac.uk/ami/download/
- 视频URL模式：`https://groups.inf.ed.ac.uk/ami/AMICorpusMirror/amicorpus/IS1009a/video/IS1009a.Closeup1.avi`（1至4）
- 音频URL模式：`https://groups.inf.ed.ac.uk/ami/AMICorpusMirror/amicorpus/IS1009a/audio/IS1009a.Headset-0.wav`（0至3）

使用 AMI v1.6.2 标注中的 meetings.xml 对照机位和话筒：A=Closeup1/Headset0；B=Closeup2/Headset1；C=Closeup3/Headset2；D=Closeup4/Headset3。原始转录中B自称Francina；“林岚”是题方虚构的发布化名，“林岚研究所”是独立虚构机构，不宣称是真实个人或机构信息。

官方标注ZIP当次访问返回403，因此使用公开镜像的固定版本：
https://huggingface.co/datasets/FluidInference/ami-corpus-mirror/resolve/722d8891643e1e4dc62cfd0d198fa05a1646c3cc/annotations/ami_public_manual_1.6.2.zip

该镜像声明重新打包AMI官方v1.6.2。本题保留镜像哈希和原始XML出处；**没有声称与当时无法下载的官方ZIP逐字节相同**。上游地址为 https://groups.inf.ed.ac.uk/ami/AMICorpusAnnotations/ami_public_manual_1.6.2.zip 。

AMI 信号和标注采用 **CC BY 4.0**：https://creativecommons.org/licenses/by/4.0/ 。完整许可见本目录 AMI_LICENCE.txt。原始文件URL、字节数和SHA256见SOURCE_MANIFEST.json，正式候选输入哈希另见FILE_MANIFEST.json。

本题为改编作品：对原片截取、缩放、分屏、复制画中画、剪辑回放，添加中文姓名带与说明；对原始录音截取、按0.60增益和5ms边缘淡化重新排列；刻意构造重叠，不宣称保留原会议连续语境。字幕是题方根据官方词级转录撰写的中文参考译稿，不是AMI官方中文译本；片段不完整之处保留省略号。仅中文屏外主持声由本机 Microsoft Huihui Desktop 系统TTS生成，未克隆参与者声音。

未把未做分离的原始麦克风当作完美干净真值：选段经官方词级标注确认前后80ms内没有他人发言重叠，给定分轨和最终源混音逐采样一致。此方法仍受原始标注质量约束；原生裁判应复核真实音频，发现材料与真值冲突要转待复核，不因题方材料缺陷误罚。

此候选包仅含任务输入和公共渲染器，不含隐藏逐帧真值、精确人名波形边界或匿名成片答案。保留本文件的来源署名与改编说明；AMI原始素材不暗示当事人认可本题。
