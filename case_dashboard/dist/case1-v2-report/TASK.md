# Case1 v2 · 篮球解说事实与时间对齐质检

你是体育视频上线前的质检编辑。审核完整视频与待审解说，交付确实需要处理的问题清单。只审核，不剪辑或配音。

## 输入与边界

- `input/video.mp4`：连续11分25秒、480×272、25fps比赛画面，无原声。红衣为中国 CHN，白衣为韩国 KOR。
- 只有前5秒正常展示比分；随后比分、加分动画及部分统计被遮挡。起始比分以这5秒为准。需根据真实进球、罚球和回放关系重建累计比分。回放不能重复计分。
- `input/commentary.wav`：48kHz中文待审解说，与视频共享零点。解说内容不是真值；未提供文字稿、错误数量、正确音轨或事件表。
- `input/glossary.json`：球员名字与球衣号码参考，不能代替画面身份判断。
- 所有时间为文件播放秒数，不是比赛时钟。原声被移除，不能推测哨声、裁判口头解释或未经画面确认的官方助攻。
- 可以使用本地ASR、逐帧查看及波形工具。不能联网搜索比赛或调用其他在线模型。画面无法确认的触球、球员身份或判罚，请列入报告“证据不足”，不要作为确定缺陷。

## 客户规则

1. **时间错位**：确定性结果断言早于画面可确认事件超过0.25秒；或没有回顾标记的即时结果宣告晚于对应事件超过3秒。以决定性词（例如“进”）发声起点为准。预测、条件句以及明确“刚才/回看/慢镜头”的回顾不受即时延迟上限限制。
2. **事实错误**：核查球队、分值、球员角色、传接球关系、首投与补篮、进攻来源、终结动作、回放所对应的原事件、罚球次序、累计比分与胜负状态。球队和两分都说对了，并不代表人物和过程正确。
3. **必要遗漏**：只有音轨已宣告的结果被后续明确可见的判罚推翻，且8秒内没有更正，才要求报告。没有解说某个动作本身不算遗漏。无声或被遮挡造成的不可判定项不强行判错。
4. 同一连续表述中的同一个错误报一条；不同独立错误可分条。两秒内明确的口误自我纠正不另报，远处正确描述不会免除前一错误。同一根因造成的连续比分偏差应合并说明，不能逐秒重复报告。

## 交付到 /workspace/submission

- `flags.json`：`{"flags":[...]}`，字段见 `output_schema.json`。
- `review.csv`：一条flag一行，至少 id,category,audio_start,audio_end,reason,correction。
- `report.md`：可发布/处理后可发布/证据不足的总体结论、方法、关键问题与不确定项。
- `evidence/`：输入视频的完整无标注原帧PNG/JPEG；每条flag至少一张。人物关系、动作过程、回合来源、动作类型或事件对应问题须给出至少两个不同事件链时刻的原帧，并说明先后关系。可另外提供放大图。
- `score_ledger.json`：`{"events":[{"time":事件结果时刻,"team":"CHN或KOR","points":本次得分,"after":{"CHN":累计得分,"KOR":累计得分},"is_replay":false,"basis":"依据"}],"uncertain":[]}`。按时间列出实际发生的有效得分；回放不另加分。不确定事件单列 uncertain，不能伪造确定比分。

每个flag必须包含 category（fact/timing/omission）、issue_type、quote、audio_span、video_spans、reason、correction、corrected_facts、evidence。音频区间定位完整错误语句，最长12秒；每条最多4个视频区间，每段最长12秒。

### issue_type 与对应纠正字段

这是通用分类，并不表示每类都有错误。一个错误选择最具体的一类，不要用 score 替代人物或动作关系问题。

| issue_type | 含义 | corrected_facts 按相关性填写 |
|---|---|---|
| actor_relation | 谁传球、谁出手或终结的角色关系 | passer,scorer,first_shooter,rebounder（中国球员用号码整数或译名）；terminal_pass（是否传给另一人终结） |
| event_identity | 回放/回顾对应哪一次原事件 | scorer,original_event_time（原实时得分秒数） |
| shot_sequence | 第一次是否命中、是否补篮等动作先后 | first_shot_made,putback,first_shooter,scorer；若涉及进攻来源则加 play_origin |
| play_origin | 快攻、底线发球、前场篮板等来源错配 | play_origin,scorer（如可确认）,team |
| shot_type | 上篮/扣篮等终结动作 | shot_type,scorer |
| points | 单次分值错误 | team,points |
| score | 累计比分、领先关系错误 | subject,relation,margin,chn_score,kor_score |
| free_throw_order | 罚球次序错误 | team,free_throw_index |
| replay | 将回放当新增得分 | is_replay,added_points,chn_score,kor_score |
| game_state | 比赛是否结束 | game_over |
| timing | 即时断言时间错位 | team,points；另填timing对象 |
| omission | 必须的更正缺失 | 写明原宣告、可见判罚与需更正事实 |

枚举：play_origin=transition（转换/快攻）、offensive_rebound（进攻篮板二次进攻）、baseline_inbound（前场底线发球组织）、half_court（其他阵地进攻）；shot_type=layup/dunk/jump_shot/free_throw；relation=leading/trailing/tied；布尔值用true/false。号码不能据球员常识猜测。未涉及的字段不必填写。

时间项须提供 `timing={assertion_time,event_time,offset_seconds,shift_seconds}`，其中offset=assertion-event，负值代表提前；shift正值为建议后移。修改后即时断言应在事件后0–3秒，允许0.15秒测量误差。

## 冻结评分（100分）

- 检出与误报控制30：按具体issue_type、category及音频位置一对一匹配，30×F1；报错类型、无依据报告与重复报告损害精确率。
- 事实纠正35：每个真值问题等权，核对其相关结构化事实。时间项还检查建议移位。只说“有误”不给纠正分。
- 时间定位15：音频语句区间5；时间缺陷的决定性词、事件时刻及有符号偏移10。误差≤0.25秒全分，≤0.75秒半分，否则0。音频区间IoU≥0.6全分、≥0.3半分。
- 视频证据及累计比分15：问题证据10，必须对应实际输入原帧；关系类只有一个动作时刻最多半分。累计比分5，核查隐藏的若干清晰得分检查点及其累计结果；匹配事件时刻容差2秒。不得重复记回放或同时列出互相矛盾的确定比分。
- 交付5：flags结构2、对应CSV1、完整报告1、证据文件可读取1。

尚无独立篮球专家认证，这是冻结构造真值实验。分数不设自动及格线；运行异常与能力得分分开报告。
