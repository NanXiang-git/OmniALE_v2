# 第13题 / Case40：原人物声音保留译制 · Checklist v3

将输入的《Nasty Old People》720秒连续瑞典语片段制作成普通话译制成片，并交付同内容的手机单声道音频。必须同时解决重复台词的不同表演、修正与否定范围、声源归属和非语言反应；实际成片、分轨、字幕与工程须相互一致。角色轨真实活动至少97%落在该角色的计划事件内；不可漏报分轨中的发声。只提交策划或翻译文本不算完成。

## 已提供输入

`input/source.mp4`：官方源片38:00—50:00，1024×576、25/1 fps；`original.wav`原混音；`music_effects.wav`用 Demucs 从原混音分离、按原时间轴对齐的音乐音效参考底轨；62 个源事件粗检索编号 S001—S062（occurrence_catalog.json，不提供瑞典语全文）、术语、人物视觉提示、中性中文声线试音。底轨由原成片混音估算，可能有少量残留。混音须以此对齐底轨为基准。镜头不是说话人标签；参考字幕可能合并不同表达类型，须听看源片确认。每个S编号代表一次出现，重复文本不得去重。

`input/hard_constraints.json`列明8组必须审计的事件和全部交付参数；它给问题范围，不给中文译文、角色答案或完整配音轴。已发布的英语译文由题方用于核验语义。按素材中的瑞典语听写，题包仅提供粗定位。

## 交付合同

交付 `dub_zh.mp4`、`mix.wav`、`effects_track.wav`、`mobile_mix.wav`、每角色全长WAV、`subtitles_zh.srt`、`subtitles_sv.srt`、`bilingual.ass`、`speakers.json`、`translation_plan.json`、`mix_config.json`、`continuity_ledger.json`、离线重建脚本、`rebuild.json`及README。JSON精确结构见 `submission_schema.json`。

- 保留全部画面顺序、尺寸、帧率和720秒长度；不可变速、补帧、删镜头。必须将交付的ZH/SV双语字幕实际烧录到dub_zh.mp4底部32%区域；另交SRT和ASS，只有软字幕或字幕文件不算实际显示。不能用字幕代替应有的普通话声音。
- 每个角色WAV为48kHz立体声、全长、已应用最终音量的分轨，不得混入其他人物、音乐或源瑞典语。至少四位实际发声角色，声线听感可辨且稳定。`speakers.instance`区分有源证据支持的年龄/声音实例，不允许每句新增角色规避一致性。
- `effects_track.wav`必须严格等于输入M&E乘一个全局增益，范围[-12,0]dB，写入mix_config；不得移轴、duck、拼接、替换或局部消音。最终 `mix.wav` 是所有角色轨与effects轨的逐样本和（相对波形误差≤2%，长度差<80ms）；总和后不可另加未交付处理。影院视频和mix分别满足-16±1 LUFS、true peak≤-1dBTP；峰值测量容差0.1dB。角色内可压限、EQ和混响，交出的轨须是已处理的最终轨。
- `mobile_mix.wav`为48kHz单声道：由0.5×(mix左+mix右)经声明的单一全局增益及峰值限制生成，不改表演、内容和时间；-18±1 LUFS、true peak≤-2dBTP。方法字段固定mono_downmix_gain_limiter，gain_db范围[-12,6]，limiter_ceiling_dbtp=-2。实际单声道必须保留数字、否定、短句和必要音效，不能靠影院版听得清来抵扣。
- 手机版精确参考滤镜为FFmpeg `pan=mono|c0=0.5*c0+0.5*c1,volume={gain_db}dB,alimiter=limit=0.7943282347:attack=5:release=50:level=0:latency=1`，输出48kHz PCM；可用等价实现，但与该链生成波形的相对误差须≤2%。采样峰值限幅不自动保证true peak合格，须实测并选择合适gain；true peak测量容差0.1dB。
- 每个plan.events事件列event_id（唯一）、source_ids、type、speaker_id、speaker_instance、voice_id、source_text、zh_text、start/end、visible_speech、delivery_note。speech关联有效角色和实例；screen_text的speaker_id、speaker_instance、voice_id填空字符串；non_speech若含角色叫喊则填对应角色/实例/声音，放入该角色轨，没有角色声源时可留空。S编号可拆成多个类型，但每个编号均须有去向。屏幕文字翻成字幕，不给人物补念；非语言叫喊可以合法重制，或从源片分离保留不含可辨瑞典语单词的叫喊放入角色轨；不得把整句瑞典语作为叫喊混入，不可悄悄删除关键反应。字幕参考粗边界不能作为逐音素嘴型真值。
- 中文SRT反映实际译制对白与需译屏幕文字，瑞典语SRT反映源意；双语ASS应语义和事件对应。每种语言每cue≤2行，中文≤18非空白Unicode字符/行、≤10字符/秒，瑞典语≤42字符/行；标点计数。常规cue 0.4—7秒，源本身极短感叹允许0.2—0.4秒并注明。屏幕文字可与对白重叠，不能为挤字幕裁掉限定词。双语烧录不得超过每种语言2行，适当字号、清晰对比度，避免遮住必要动作。
- bilingual.ass使用Style名称ZH、SV分别表示两种语言，Name填speaker_id，screen_text可空；各语言和对应SRT的实际可见时间积分一致率≥98%，不以双方空白刷分。SRT可合理重分句，不要求等于配音事件边界。plan的zh_text/source_text与对应SRT全片文本序列召回与精确率均≥95%，包括屏幕文字；实际声音另由Judge核实。
- continuity_ledger.decisions对C01—C08各写恰一条：source_ids、event_indices（plan.events零起索引）、source_evidence（源片start/end和观察）、decision、alternative_rejected。证据区间各自start<end，C02至少1处，其他每组至少2处。指出具体制作选择与舍弃方案，不需要长篇剧评，也不能把自述当验收证明。

## 新版声音与转录要求

中文必须尽量保持原人物音色、身份及语气；仅使用性别近似的通用TTS不等于保持原人物声音。跨段稳定与像不像源人物分开计分。允许从本题源片抽取参考，使用合法本地音色转换/克隆工具；必须写 voice_provenance.json，注明每角色实际方法和源参考区间。不得伪称克隆成功。

新增 transcript_sv.txt（按实际出现顺序的瑞典语转录，含需翻译的屏幕文字并标明）、transcript_zh.txt（对应中文译文）、source_events.json（原声理解事件，结构见schema），同时保留全部原交付。source_events.events可使用模型自己的分句，每项标source_ids、speaker_id、start/end、source_text、delivery_note。S编号只给粗检索区间，不能直接当配音轴。没有提供完整瑞典语稿，须自行识别。

## 最终评分合同

最终分 = (E + T) × (A ÷ 70) × V × (100 ÷ 30)。E 满分 20，T 满分 10，A 满分 70，V 为 0–1 画面系数。
- E源内容：词序列准确40%、事件覆盖粗定位20%、说话人/实例归属15%、语义/关键语气理解25%。词序列采用max(0,1−WER)，非全文二值匹配；官方参考争议进入pending。
- T翻译：意义完整45%、自然度30%、术语称呼15%、语体功能10%。
- A实际配音：原人物音色 25 分、同人物跨段稳定 15 分、情绪语气表演 15 分、实际内容 10 分、自然清晰和双版本混音 5 分。
- V画面：原画面顺序内容60%、时间线20%、声画时机及字幕实际显示20%。字幕底部新增内容不作为原画面错误。

所有主观项使用公开rules.json中的逐点Yes/No QA；缺模态、标签冲突记pending。每点两次独立评审，分歧第三次；源/输出均须有时间证据。普通点权重1，事先冻结的关键语义点3。音色和稳定性按源角色宏平均，不让话多的角色掩盖其他角色。跨段复核只计相应检查，不按全片时长再加一半权重。

≥80且关键门槛通过才通过。需保持完整画面、交付可解码及可重建；无关键漏配、整句错角色、否定/关系/状态反转、大片瑞典语双叠、关键音效丢失及手机端角色消失。原有分轨、混音、字幕和审计合同继续检查，检查结果逐项报告。音色数值尚无人工校准阈值，不擅自新增未校准一票否决线；音色失真正常扣对应分。

## 执行边界

Codex CLI 作答不设总时限。使用服务器的 8 核 CPU 和离线工具。允许合法TTS及字幕工具，不要求固定GUI；离线重建的验收时限为 600 秒。自带TTS的V01—V08是系统声音/音高配置，不是八位真人或演员克隆。重建必须完全离线，依赖与合法声音来源写README；不得只复制已渲染主视频。`rebuild.json`argv支持{python}、{input}、{submission}、{output}，须把新成片写到{output}。

考生仅获candidate目录，禁读evaluator/authoring、其他考生答案或外网现成答案。测试纯视听能力时由主办方断网并隔离文件系统，不能靠文字禁令阻止公开字幕检索。全部新增结果、缓存和临时目录放服务器指定工作目录；只在独立submission目录写入，不改输入。许可和来源见CREDITS.md。
