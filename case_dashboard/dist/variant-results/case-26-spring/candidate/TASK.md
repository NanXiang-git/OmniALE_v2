# Case26｜电影弱光画面与原混音修复

修复26秒电影片段的画面和原立体声混音。混音含同段原配乐和电影音效。input/damaged_av.mkv含受损音画；input/damaged.mkv和input/music_damaged.wav为无损分离版。

画面合同、保护窗、修订层重放和报告schema详见VISUAL_TASK_V3.md。音频可能有时变有色噪声、漂移窄带干扰、不同形态爆音、单声道短缺口和局部非线性失真，可能相互重叠。自行定位损伤，保留原配乐的音符、节奏、起音、弱音、衰减、立体声和原有电影音效。0–2秒与24–26秒为正常音频保护段。不得换曲、静音掩盖、删段、错移、变速或下载原曲替换。

## 交付

submission/submission.json: version="3.2-av-music-heavy", case_id="26"，files必须有：master=restored.mkv（无声FFV1 RGB8视觉母版）、repair=repair.mkv（无声修订层）、preview=preview.mp4（无声H264预览）、project=project.json、report=report.json、audio=restored_audio.wav（48kHz双声道PCM16，1248000采样帧）、av_preview=restored_av.mp4（同一画面H264和同一音频AAC）、audio_report=audio_report.json（method、limitations、checks，各检查含start/end/observation）。路径相对submission，不能使用外部路径或链接。视频640×338、24fps、624帧。音画预览对无损音轨SNR≥25dB，对母版逐帧MAE≤0.025。

## 评分与环境

总分100，视觉70、听觉30。视觉0.7×C×(客观40＋视觉评审60)，C=min(交付完成度,重放完成度)。视觉裁判GPT-6.1-sol/high，使用v3最终量表与完整逐帧对照证据。

音频：相对改善6＋绝对波形保真6＋频谱保真6＋真实音乐起音2＋损伤事件恢复1＋立体声1＋正常段保护2＋实际听评6。格式/时长/同步为硬门槛，不加分。较差窗口参与汇总，不能以少数容易片段掩盖未修复片段。真值预先固定的音符起音与损伤事件用于局部测量；具体公式和阈值公开于public_rules.json。听评有相同音频对照，不通过则待复核。总分≥80、视觉≥42、音频≥18且没有硬/核心失败才通过。

本次实验使用 GPT-6.2-sol、xhigh，无总时限。仅可访问/candidate和/workspace；无外网、干净参考、损伤参数、其他答卷或评测反馈。用实际工具观察媒体，不得声称未进行的试听。完成自检后交付全部文件。
