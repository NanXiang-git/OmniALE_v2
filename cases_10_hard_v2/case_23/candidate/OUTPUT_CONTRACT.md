# 输出合同与使用方式

提交到一个独立目录，包含以下10个固定文件，以及clips/下6–24个WAV。不要加入源媒体副本、代码、缓存或额外文件。

| 文件 | 内容 |
|---|---|
| accessible.mp4 | 960×540、25fps，180秒加暂停总长；恰好1视频轨、1混音轨、1中文描述字幕轨 |
| teacher_mapped.wav | 原teacher.wav在各暂停处插入等长零样本，其他样本逐个原样保留 |
| description.wav | 与成片等长的独立描述轨，逐条clips音频在指定位置求和，其余为零；不得夹入教师 |
| descriptions.json | 逐条ID、阶段、开始/结束、实际说出的中文和对应WAV路径 |
| description.vtt | 根据descriptions.json生成的准确时间及同文字幕 |
| time_map.json | 合法暂停列表，空列表表示不暂停 |
| navigation.json | 六个固定章节的源起点、扩展起点与标题 |
| player_config.json | 下文固定媒体配置，不能执行候选代码 |
| project.json | 下文受限工程及源文件SHA256 |
| README.md | 中文交付说明、修订思路、播放器运行方法和已知局限 |
| clips/D01.wav等 | 真实逐条中文描述，48000Hz/单声道/16位PCM |

所有WAV均须48000Hz、单声道、有符号16位PCM。每条0.3–18秒，音频文件长度须与end−start一致，误差≤1采样。所有条目按开始时间排序，不得相互重叠；clip ID为D加两位数字，唯一；WAV路径为clips/D加两位数字.wav，唯一。每阶段至少一条，且不能跨阶段，阶段末端合法暂停归属于该阶段。

## JSON格式

以下只是结构示例，不能直接作为已完成交付：
```json
{"pauses":[{"source_time":25,"duration":2.0}]}
```
source_time只能为25/55/85/115/150，升序、无重复；duration>0且≤5，并为0.04秒整数倍，总计≤20。源锚点前一帧重复插入，之后接回锚点原帧。例如源25秒插2秒，扩展25–27秒冻结源24.96秒，扩展27秒恢复源25秒。

```json
{"clips":[{"id":"D01","phase":"P1","start":17.0,"end":20.0,"text":"这里填写实际说出的中文。","audio":"clips/D01.wav"}]}
```
start/end是**扩展输出时间**，start精确到48kHz采样；phase为P1–P6。text必须写实际读音：例如“零点二四五”“查询、键和值”，不要写0.245或Q/K/V；不接受英文、阿拉伯数字或字幕标记。去掉标点后每条1–45个汉字。不得靠伪造较短文本绕过实际语速；原生裁判会听审逐条语音和文本一致性。

```json
{"chapters":[{"id":"P1","source_start":0,"output_start":0,"title":"词元与身份"}]}
```
六项都要有，ID、source_start和title须对应phase_facts.json。output_start = source_start + **所有位于该源起点之前以及正好在该起点的暂停时长**。这样P2不会跳进P1的结束暂停。数值误差≤1ms；实际浏览器定位误差≤0.20秒。

```json
{"version":1,"raw":"input/lesson_v2.mp4","extended":"submission/accessible.mp4","map":"submission/time_map.json","navigation":"submission/navigation.json","descriptions":"submission/descriptions.json","captions":"submission/description.vtt"}
```
player_config.json固定为以上内容，无额外字段。

```json
{"version":1,"renderer":"omni23-v2","map":"time_map.json","descriptions":"descriptions.json","navigation":"navigation.json","source_sha256":"lesson_v2.mp4的SHA256","teacher_sha256":"teacher.wav的SHA256"}
```
project.json固定结构；只读声明数据，不执行任意脚本。

## 制作、渲染和播放

可选中文TTS（Windows已安装Microsoft Huihui Desktop时）：
```powershell
tools/tts.ps1 -TextFile D:\omniALE\draft\line.txt -Output D:\omniALE\submission_23\clips\D01.wav -Rate 0
```
声音可以用其它工具生成，但必须是实际中文语音。每条时长、语速及发声间隙以实际WAV为准，不能用字数推测其长度。

填写结构化文件并制作逐条WAV后，从候选包根目录运行：
```powershell
python tools/render.py --submission D:\omniALE\submission_23
python tools/serve.py --submission D:\omniALE\submission_23 --port 8765
```
打开 http://127.0.0.1:8765/player.html 。不要直接用file://打开，因为浏览器会限制读取JSON。渲染器生成/覆盖accessible.mp4、teacher_mapped.wav、description.wav、description.vtt；它不会生成描述文字、安排暂停或自动修订导航。

## 实际技术验收

- 教师映射轨和描述混合轨逐采样精确核对。成片音轨须与同一FFmpeg参数从“映射教师＋描述”编码出的AAC解码波形一致：峰值误差≤8 PCM单位、RMSE≤2。因此最终封装应使用所附渲染器及相同FFmpeg版本；不能只交正确的独立WAV而成片仍是旧音轨。
- 所有输出帧与源帧／合法冻结帧一一比较，逐帧MAE≤3/255，任一通道偏差>32的像素≤1%；帧时间戳相对25fps误差≤1ms。不得重新绘制图示、删掉难描述的帧或改速。
- VTT文本和时间须精确来自JSON；MP4内嵌字幕逐项核对。音频／视频从0开始，不得偷偷延迟某轨。
- 发声区间以20ms RMS阈值35 PCM单位检测，合并不超过80ms的小间隙并向两侧扩20ms，作为保守代理；每条与教师有效发声交集≤80ms。每条“实际说出的字数／检测有效时长”≤5字/秒，允许0.5字取整容差；滚动10秒代理≤50.5字。静默填充不能稀释语速。代理不能证明音频说了什么，最终仍以原生听审为准。
- 播放器使用实际浏览器解码、媒体时间、已呈现帧、截图和WebAudio波形检测做12项测试。开关响应≤0.30秒，旧播放器停止发声；在同一暂停锚点关闭再开启，恢复保存的暂停游标。跳章节和重新播放属于主动重听，不算错误重复。
- 程序硬条件失败即拒收，语义裁判不能用内容分抵消删音、错导航或假工程。浏览器未安装、API不支持原生音频等是评测环境故障，不当作模型答案低分。

Python依赖numpy、opencv-python，FFmpeg/ffprobe在PATH。评测还需要Playwright及Edge或Chrome；解题者只用浏览器手动检查时不需要Playwright。剪辑软件可选DaVinci Resolve、REAPER或Audacity，不是必需。
