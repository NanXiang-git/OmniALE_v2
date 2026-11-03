# 《Valkaama》中文剧情解说：离开之后，仍要面对彼此

本成片为 567.32 秒中文剧情解说，包含剧透。使用题包内 Michael Georgi 配乐版 `source.mp4`，以 66 个原速片段硬切连接。五段原声对白共 52 秒；旁白标注约 351.45 秒。未增加外部配乐或其他影像。

## 文件与重建

- `commentary.mp4`：1280×720、25fps、H.264 / AAC，中文字幕已烧录。
- `narration.wav`：仅中文人声；`original_audio.wav`：仅源片剪接与片段增益。两轨均从成片零点开始、覆盖全长，48kHz、双声道、16-bit PCM。
- `zh.srt` 与 `script.md`：对应烧录字幕及完整中文旁白。五段原声使用场景标识，未伪造未经核实的逐字译文。
- `timeline.json`：所有源片入出点按整数帧记录，固定等比缩放与补边。
- `source_map.json`：逐段映射、按句发声、原声保护区间与因果证据。
- `claims.json`：53 项实际讲述的断言；角色说法与解释单独标记。
- `project.json`：题包指定的声明式交换工程。

使用题包原始渲染工具生成全部画面及原声轨；响度调整后按相同混音公式更新 AAC，画面码流保持一致。重建命令如下（相对路径应按所在目录调整）：

```bash
python3 -B candidate/tools/render.py \
  --submission submission \
  --source candidate/input/source.mp4 \
  --output scratch/rebuilt.mp4 \
  --work-dir scratch/rebuild_cache \
  --write-original-stem
```

最终混音严格为两条交付音轨相加后应用 `master_gain_db`。未对最终混音增加限制器或归一化。旁白采用 Microsoft Huihui Desktop 本地中文语音；去除首尾及过长静音，使用 FFmpeg `atempo=0.9` 调整语速，并仅对旁白轨进行动态响度整形（目标 -19 LUFS、峰值 -5 dBTP）。字体为 Microsoft YaHei，字幕样式沿用题包工具。时间线与画面不变速、不调色、不裁切。

制作工具：Python 3、NumPy、Pillow、OpenCV、FFmpeg 6.1.1、libx264、libass；本地系统 TTS。素材通过源片提帧和场景逐段核对，不使用网络剧情梗概，没有外部辅助资料。

## 署名与许可

原作 **Valkaama**，导演 / 制片 **Tim Baumann**，故事 **Hendrik Behnisch**；本次使用 **Michael Georgi 配乐版本**。本次制作对原作进行片段选择、重排与压缩，增加中文解说、合成中文旁白和中文字幕。

原作及本改编按 **Creative Commons Attribution-ShareAlike 3.0（CC BY-SA 3.0）** 署名、相同方式共享：
https://creativecommons.org/licenses/by-sa/3.0/

影片官方页面：https://www.valkaama.com/index.php?page=movie&l=en

原 SD 素材：https://www.valkaama.com/media/movie/Valkaama(music-MichaelGeorgi).avi

上述链接来自题包公开的 `SOURCES.md`，未联网检索其他版本。中文解说、选镜、字幕与声明式工程：本次任务独立制作。

## 成品自检

最终 AAC 实测综合响度 **-17.47 LUFS**，真峰值 **-1.94 dBTP**。全片解码无报错；视频共 **14183 帧**。两条 PCM 音轨各 **27231360 个采样帧**。五段原声保护区间内，旁白轨样本全部为零。原声轨与题包渲染器生成的预期原声文件 SHA-256 完全一致；画面码流与题包渲染器输出一致。公开 JSON Schema、跨文件时间映射、字幕字数 / 时长 / 速度均通过本地自检。
