# 《钢铁之泪》普通话译制交付

本目录包含525秒译制成片 `dub_zh.mp4`、影院立体声 `mix.wav`、手机单声道 `mobile_mix.wav`、音乐音效 `effects_track.wav`，以及 `characters/` 内七条全长最终音量角色分轨。画面保持1280×534、24fps、原镜头顺序；中英双语字幕实际烧录。另交中英文SRT、双语ASS、角色表、79事件配音计划、C01—C08连续性记录及混音设置。

七条轨对应西莉亚、年轻汤姆、老年汤姆、队长、巴利、设备操作员和现场女助手。年轻／老年汤姆属于同一剧情角色的两个声音实例；后半段年轻外貌投影继续使用老年实例。屏幕“四十年后”、片名及关键设备文字只显示字幕。两次质问分别制作，老年汤姆的回应没有沿用片头的噩梦辩解。

## 离线重建

依赖：Python 3、NumPy、SciPy、soundfile，以及带libass、libx264、AAC、alimiter的FFmpeg／FFprobe。工程内带本次使用的中文字体。重建不需要网络、TTS代理、Whisper或任何模型。

```bash
python3 /workspace/submission/rebuild.py \
  --input /candidate/input \
  --submission /workspace/submission \
  --output /workspace/scratch/rebuilt/dub_zh.mp4
```

`rebuild.json`使用题目要求的占位符。`{input}`是含source.mp4和music_effects.wav的输入目录，`{submission}`是本交付目录，`{output}`是新MP4的完整路径。若输出参数是已存在的目录，则在其中写dub_zh.mp4。伴随WAV、角色轨、字幕与JSON写在新MP4同目录。请使用独立输出目录以保留正式交付。

脚本从 `assets/takes/` 的冻结普通话表演片段按计划重建七条角色轨；从输入M&E重新施加唯一全局增益；逐样本求和生成mix；按规定FFmpeg链生成手机音频；最后重新解码输入source.mp4、烧录ASS并编码成片。不会复制已渲染主视频。`engineering.json`记录角色／事件的最终增益；本次没有总和后的处理。

`assets/*.wav`及相邻UTF-8文本保留本次System.Speech兼容TTS原始素材。`prepare_takes.py`记录去静音、独立时间适配、角色音高、EQ、压缩和淡入淡出；`limit_vocals.py`记录必要的角色峰值包络。它们用于审计原始素材到冻结表演的处理，不是重建所需的在线合成步骤。正式重建无需重新处理原始TTS。若审计原始素材处理过程，顺序为prepare_takes.py的--force、limit_vocals.py、finalize_vocals.py；最后一步需传--input、--submission及指向scratch的--preview路径，且只执行一次，避免重复增加增益。首轮三个局部角色峰值处理记录在assets/vocal_peak_processing.json；随后finalize_vocals.py为全片角色增加2dB并在角色轨内约束立体声及单声道峰值，记录在assets/final_vocal_levels.json。正式重建直接使用这批冻结素材，不重复增加增益。M&E全程没有duck、剪接、移动或局部处理。

## 声音来源与混音

普通话由题目提供的Windows System.Speech TTS兼容层生成，使用V02、V03、V04、V05、V06、V07、V08配置；没有演员克隆或外部模型。各人物通过稳定的音高、频谱和动态处理区分。老年汤姆的后续V02原始素材先应用V05的0.88基准音高配置，再采用与其老年实例一致的处理。重复出现的台词各自保留原始素材，并按当前场景独立适配时间和强度。

M&E仅乘 `mix_config.json` 中的全局增益。所有音轨48kHz、525秒；除手机版为单声道外均为立体声。角色对白同相居中，避免单声道抵消。角色轨和effects轨均为24位PCM，mix由交付的量化分轨相加后写为24位PCM。

手机算法固定为 `mono_downmix_gain_limiter`，使用：

```
pan=mono|c0=0.5*c0+0.5*c1,volume={gain_db}dB,alimiter=limit=0.7943282347:attack=5:release=50:level=0:latency=1
```

实际增益见mix_config.json；没有另剪内容、改时轴或改变表演。响度、true peak、长度、分轨求和、M&E来源和手机链复算结果见 `validation_report.json`。视频AAC音轨另行实测，不以WAV结果替代。

## 实际使用的分析方法与限制

制作依据为公开英文参考、术语和人物图片，以及源视频的带时刻抽帧检查。本地faster-whisper small/int8/CPU用于英文词级定位；对难段另做局部转录、波形检查和原混音减M&E的辅助分析。相减音频只用于分析，未混入成片。合成后的普通话片段另做中文ASR复核，关键手机版片段也单独复核。ASR可能误词，未将其当成说话人真值。

本次没有原生听觉输入或人工试听，也未调用视听Judge；声源判断基于画面、公开稿、时间和转录结果。未宣称做过逐音素嘴型校准或人工表演验收。TTS表演及抽帧定位存在此方法的限制。技术自检只报告实测文件结果，不生成评分或伪造主观通过结论。

## 素材署名

Tears of Steel，Blender Foundation / Mango Open Movie Project，2012。视频和音轨均来自题目提供的只读输入；M&E来源为官方TOS_MUSIC+FX_NO_DIALOGUE.aif经题包披露的32ms对齐处理版本，本工程不再次移轴。原始输入不在交付中复制，离线重建仍需题目输入source.mp4与music_effects.wav。

题包特别注明Original Soundtrack为CC BY-ND 3.0，不能推广成全部电影资产的统一许可。完整原始说明见CREDITS.md。本次成果仅用于指定本地测试交付，没有对外发布。Microsoft YaHei为测试环境提供的字体，保留于本地重建资源中。

最终实测：mix −15.20 LUFS／−1.78 dBTP；视频AAC −15.22 LUFS／−1.54 dBTP；mobile −18.45 LUFS／−2.28 dBTP。角色活动全部位于计划区间；分轨求和及手机参考链复算相对误差均为0，M&E增益复算误差约8.7×10⁻⁷。独立目录重建的mix及mobile与提交音频SHA-256一致。全部规定文件已交付；未执行人工试听或视听Judge。
