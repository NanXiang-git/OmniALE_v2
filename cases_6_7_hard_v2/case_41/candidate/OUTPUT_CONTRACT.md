# 交付格式 v2

所有时间单位为秒；所有区间为左闭右开。源视频25fps，时间线以整数帧定位，帧0对应0秒。源视频共139840帧、5593.60秒；容器含音频尾部总长5593.64秒。所有JSON使用UTF-8，不写绝对路径。缺字段、越界、重复ID、NaN/Infinity、不相符的映射均不通过。

`timeline.json` 顶层固定：`version:1, fps:25, width:1280, height:720, master_gain_db:数值, segments:数组`。master_gain_db范围-24至12，是两条轨相加后的统一增益；不归一化、不限制器。segments有40–90项，每项字段恰好为：

| 字段 | 格式与含义 |
|---|---|
| id | 唯一非空字符串 |
| source_in_frame | 源片入点整数帧，含 |
| source_out_frame | 源片出点整数帧，不含 |
| original_gain_db | -60至6的数值，或null表示源声静音 |

片段顺序即输出顺序，没有空隙、叠化或变速。长度为出点减入点。最终画面按随题工具等比缩放补边、烧录统一字幕。原声轨按每段增益构建；旁白轨保持自己交付的波形；最终音频为 `(narration + original) × 10^(master_gain_db/20)`。禁止把旁白预先混入original_audio。

`source_map.json`：

- `segments`：与timeline逐项一一对应，每项含 `id, output:{start,end}, source:{start,end}, fact`。fact是此镜头支持的叙事信息或明确的过场作用。
- `narration_regions`：每项 `{start,end,text}`，时间为输出时间，text为该句中文旁白。按实际发声首尾标注，不重叠；300毫秒以内句内停顿可计入，长停顿拆开；合计300–420秒。
- `protected_audio`：4–6个 `{start,end}` 输出区间，不重叠。每段4–15秒、合计30–65秒，实际包含有意义的源片对白；所覆盖的时间线片段原声增益不得低于-12dB或为null。
- `causal_links`：3–8项，每项 `{cause:{start,end}, effect:{start,end}, output:{start,end}, claim}`。cause/effect为源片证据，单窗≤45秒，`effect.start - cause.end >= 180`；output是实际表达这条因果的成片位置。claim写原因如何导致结果，不得仅列两件事情。请按希望被评分的优先级排列：前三项分别对应三项因果得分；额外项提供补充证据，不能重复刷分。整体合格门槛仍要求至少三条独立成立的因果。

`claims.json` 顶层为 `claims` 数组，15–60项；每项 `{id,text,kind,output:{start,end},evidence:[{start,end},...]}`。kind限 `visible_or_audible`（镜头/对白直接证明）、`character_claim`（角色自述，旁白须归属）、`interpretation`（有依据的解释且须表达推测程度）。每条1–4个源片证据窗、各≤45秒，output必须对应实际成片出现的这条内容；不能把未写进成片的正确断言作为补分材料。

`project.json` 必须恰好为以下对象，它指定通用交换工程，不执行你提交的程序：

```json
{"format":"omni41-timeline-v1","entrypoint":"timeline.json","dependencies":["narration.wav","zh.srt"],"renderer":"provided tools/render.py"}
```

运行示例（仅是命令，不是本题解答）：

```powershell
python -B candidate/tools/render.py --submission D:/omniALE/my_submission --source D:/omniALE/case41_candidate/input/source.mp4 --output D:/omniALE/my_submission/commentary.mp4 --work-dir D:/omniALE/my_render_cache --write-original-stem
```

先自行完成时间线、旁白WAV与SRT。工具自动构建original_audio.wav、统一混音并导出。依赖Python3和FFmpeg/FFprobe（含libx264、libass及Microsoft YaHei字体）。可使用系统已有中文字体，但正式重建使用Microsoft YaHei，最好使用提供的工具得到一致输出。工具不会帮你判断剧情、写旁白或选镜头。

机器可读JSON Schema在`schemas/`，跨字段关系、区间长度、音视频一致性仍由实际验收器检查。
