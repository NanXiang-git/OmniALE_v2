window.OMNIALE_VARIANT_CASES = {
  "40": {
    "task": "# 第13题 / Case40：原人物声音保留译制 · Checklist v3\n\n将输入的《Nasty Old People》720秒连续瑞典语片段制作成普通话译制成片，并交付同内容的手机单声道音频。必须同时解决重复台词的不同表演、修正与否定范围、声源归属和非语言反应；实际成片、分轨、字幕与工程须相互一致。角色轨真实活动至少97%落在该角色的计划事件内；不可漏报分轨中的发声。只提交策划或翻译文本不算完成。\n\n## 已提供输入\n\n`input/source.mp4`：官方源片38:00—50:00，1024×576、25/1 fps；`original.wav`原混音；`music_effects.wav`用 Demucs 从原混音分离、按原时间轴对齐的音乐音效参考底轨；62 个源事件粗检索编号 S001—S062（occurrence_catalog.json，不提供瑞典语全文）、术语、人物视觉提示、中性中文声线试音。底轨由原成片混音估算，可能有少量残留。混音须以此对齐底轨为基准。镜头不是说话人标签；参考字幕可能合并不同表达类型，须听看源片确认。每个S编号代表一次出现，重复文本不得去重。\n\n`input/hard_constraints.json`列明8组必须审计的事件和全部交付参数；它给问题范围，不给中文译文、角色答案或完整配音轴。已发布的英语译文由题方用于核验语义。按素材中的瑞典语听写，题包仅提供粗定位。\n\n## 交付合同\n\n交付 `dub_zh.mp4`、`mix.wav`、`effects_track.wav`、`mobile_mix.wav`、每角色全长WAV、`subtitles_zh.srt`、`subtitles_sv.srt`、`bilingual.ass`、`speakers.json`、`translation_plan.json`、`mix_config.json`、`continuity_ledger.json`、离线重建脚本、`rebuild.json`及README。JSON精确结构见 `submission_schema.json`。\n\n- 保留全部画面顺序、尺寸、帧率和720秒长度；不可变速、补帧、删镜头。必须将交付的ZH/SV双语字幕实际烧录到dub_zh.mp4底部32%区域；另交SRT和ASS，只有软字幕或字幕文件不算实际显示。不能用字幕代替应有的普通话声音。\n- 每个角色WAV为48kHz立体声、全长、已应用最终音量的分轨，不得混入其他人物、音乐或源瑞典语。至少四位实际发声角色，声线听感可辨且稳定。`speakers.instance`区分有源证据支持的年龄/声音实例，不允许每句新增角色规避一致性。\n- `effects_track.wav`必须严格等于输入M&E乘一个全局增益，范围[-12,0]dB，写入mix_config；不得移轴、duck、拼接、替换或局部消音。最终 `mix.wav` 是所有角色轨与effects轨的逐样本和（相对波形误差≤2%，长度差<80ms）；总和后不可另加未交付处理。影院视频和mix分别满足-16±1 LUFS、true peak≤-1dBTP；峰值测量容差0.1dB。角色内可压限、EQ和混响，交出的轨须是已处理的最终轨。\n- `mobile_mix.wav`为48kHz单声道：由0.5×(mix左+mix右)经声明的单一全局增益及峰值限制生成，不改表演、内容和时间；-18±1 LUFS、true peak≤-2dBTP。方法字段固定mono_downmix_gain_limiter，gain_db范围[-12,6]，limiter_ceiling_dbtp=-2。实际单声道必须保留数字、否定、短句和必要音效，不能靠影院版听得清来抵扣。\n- 手机版精确参考滤镜为FFmpeg `pan=mono|c0=0.5*c0+0.5*c1,volume={gain_db}dB,alimiter=limit=0.7943282347:attack=5:release=50:level=0:latency=1`，输出48kHz PCM；可用等价实现，但与该链生成波形的相对误差须≤2%。采样峰值限幅不自动保证true peak合格，须实测并选择合适gain；true peak测量容差0.1dB。\n- 每个plan.events事件列event_id（唯一）、source_ids、type、speaker_id、speaker_instance、voice_id、source_text、zh_text、start/end、visible_speech、delivery_note。speech关联有效角色和实例；screen_text的speaker_id、speaker_instance、voice_id填空字符串；non_speech若含角色叫喊则填对应角色/实例/声音，放入该角色轨，没有角色声源时可留空。S编号可拆成多个类型，但每个编号均须有去向。屏幕文字翻成字幕，不给人物补念；非语言叫喊可以合法重制，或从源片分离保留不含可辨瑞典语单词的叫喊放入角色轨；不得把整句瑞典语作为叫喊混入，不可悄悄删除关键反应。字幕参考粗边界不能作为逐音素嘴型真值。\n- 中文SRT反映实际译制对白与需译屏幕文字，瑞典语SRT反映源意；双语ASS应语义和事件对应。每种语言每cue≤2行，中文≤18非空白Unicode字符/行、≤10字符/秒，瑞典语≤42字符/行；标点计数。常规cue 0.4—7秒，源本身极短感叹允许0.2—0.4秒并注明。屏幕文字可与对白重叠，不能为挤字幕裁掉限定词。双语烧录不得超过每种语言2行，适当字号、清晰对比度，避免遮住必要动作。\n- bilingual.ass使用Style名称ZH、SV分别表示两种语言，Name填speaker_id，screen_text可空；各语言和对应SRT的实际可见时间积分一致率≥98%，不以双方空白刷分。SRT可合理重分句，不要求等于配音事件边界。plan的zh_text/source_text与对应SRT全片文本序列召回与精确率均≥95%，包括屏幕文字；实际声音另由Judge核实。\n- continuity_ledger.decisions对C01—C08各写恰一条：source_ids、event_indices（plan.events零起索引）、source_evidence（源片start/end和观察）、decision、alternative_rejected。证据区间各自start<end，C02至少1处，其他每组至少2处。指出具体制作选择与舍弃方案，不需要长篇剧评，也不能把自述当验收证明。\n\n## 新版声音与转录要求\n\n中文必须尽量保持原人物音色、身份及语气；仅使用性别近似的通用TTS不等于保持原人物声音。跨段稳定与像不像源人物分开计分。允许从本题源片抽取参考，使用合法本地音色转换/克隆工具；必须写 voice_provenance.json，注明每角色实际方法和源参考区间。不得伪称克隆成功。\n\n新增 transcript_sv.txt（按实际出现顺序的瑞典语转录，含需翻译的屏幕文字并标明）、transcript_zh.txt（对应中文译文）、source_events.json（原声理解事件，结构见schema），同时保留全部原交付。source_events.events可使用模型自己的分句，每项标source_ids、speaker_id、start/end、source_text、delivery_note。S编号只给粗检索区间，不能直接当配音轴。没有提供完整瑞典语稿，须自行识别。\n\n## 最终评分合同\n\n最终分 = (E + T) × (A ÷ 70) × V × (100 ÷ 30)。E 满分 20，T 满分 10，A 满分 70，V 为 0–1 画面系数。\n- E源内容：词序列准确40%、事件覆盖粗定位20%、说话人/实例归属15%、语义/关键语气理解25%。词序列采用max(0,1−WER)，非全文二值匹配；官方参考争议进入pending。\n- T翻译：意义完整45%、自然度30%、术语称呼15%、语体功能10%。\n- A实际配音：原人物音色 25 分、同人物跨段稳定 15 分、情绪语气表演 15 分、实际内容 10 分、自然清晰和双版本混音 5 分。\n- V画面：原画面顺序内容60%、时间线20%、声画时机及字幕实际显示20%。字幕底部新增内容不作为原画面错误。\n\n所有主观项使用公开rules.json中的逐点Yes/No QA；缺模态、标签冲突记pending。每点两次独立评审，分歧第三次；源/输出均须有时间证据。普通点权重1，事先冻结的关键语义点3。音色和稳定性按源角色宏平均，不让话多的角色掩盖其他角色。跨段复核只计相应检查，不按全片时长再加一半权重。\n\n≥80且关键门槛通过才通过。需保持完整画面、交付可解码及可重建；无关键漏配、整句错角色、否定/关系/状态反转、大片瑞典语双叠、关键音效丢失及手机端角色消失。原有分轨、混音、字幕和审计合同继续检查，检查结果逐项报告。音色数值尚无人工校准阈值，不擅自新增未校准一票否决线；音色失真正常扣对应分。\n\n## 执行边界\n\nCodex CLI 作答不设总时限。使用服务器的 8 核 CPU 和离线工具。允许合法TTS及字幕工具，不要求固定GUI；离线重建的验收时限为 600 秒。自带TTS的V01—V08是系统声音/音高配置，不是八位真人或演员克隆。重建必须完全离线，依赖与合法声音来源写README；不得只复制已渲染主视频。`rebuild.json`argv支持{python}、{input}、{submission}、{output}，须把新成片写到{output}。\n\n考生仅获candidate目录，禁读evaluator/authoring、其他考生答案或外网现成答案。测试纯视听能力时由主办方断网并隔离文件系统，不能靠文字禁令阻止公开字幕检索。全部新增结果、缓存和临时目录放服务器指定工作目录；只在独立submission目录写入，不改输入。许可和来源见CREDITS.md。\n",
    "credit": "Nasty Old People (2009), director Hanna Sköld, Tangram Film. Excerpt 38:00–50:00, CC BY-NC-SA 2.5 Sweden. Source: https://archive.org/details/nasty-old-people . License: https://creativecommons.org/licenses/by-nc-sa/2.5/se/ . Excerpt and audio separation prepared for this benchmark. Original soundtrack is preserved in source.mp4 and original.wav. The derived non-dialogue mix is an estimate from the release mix using HTDemucs.",
    "files": [
      {
        "name": "CREDITS.md",
        "path": "CREDITS.md",
        "url": "variant-results/case-40/candidate/CREDITS.md",
        "kind": "document",
        "bytes": 433,
        "text": "Nasty Old People (2009), director Hanna Sköld, Tangram Film. Excerpt 38:00–50:00, CC BY-NC-SA 2.5 Sweden. Source: https://archive.org/details/nasty-old-people . License: https://creativecommons.org/licenses/by-nc-sa/2.5/se/ . Excerpt and audio separation prepared for this benchmark. Original soundtrack is preserved in source.mp4 and original.wav. The derived non-dialogue mix is an estimate from the release mix using HTDemucs.\n"
      },
      {
        "name": "README.md",
        "path": "README.md",
        "url": "variant-results/case-40/candidate/README.md",
        "kind": "document",
        "bytes": 145,
        "text": "先读 TASK.md、rules.json 与 submission_schema.json。题包包含瑞典语原片、原混音、对齐的音乐音效底轨和声线样例。\n"
      },
      {
        "name": "TASK.md",
        "path": "TASK.md",
        "url": "variant-results/case-40/candidate/TASK.md",
        "kind": "document",
        "bytes": 8971,
        "text": "# 第13题 / Case40：原人物声音保留译制 · Checklist v3\n\n将输入的《Nasty Old People》720秒连续瑞典语片段制作成普通话译制成片，并交付同内容的手机单声道音频。必须同时解决重复台词的不同表演、修正与否定范围、声源归属和非语言反应；实际成片、分轨、字幕与工程须相互一致。角色轨真实活动至少97%落在该角色的计划事件内；不可漏报分轨中的发声。只提交策划或翻译文本不算完成。\n\n## 已提供输入\n\n`input/source.mp4`：官方源片38:00—50:00，1024×576、25/1 fps；`original.wav`原混音；`music_effects.wav`用 Demucs 从原混音分离、按原时间轴对齐的音乐音效参考底轨；62 个源事件粗检索编号 S001—S062（occurrence_catalog.json，不提供瑞典语全文）、术语、人物视觉提示、中性中文声线试音。底轨由原成片混音估算，可能有少量残留。混音须以此对齐底轨为基准。镜头不是说话人标签；参考字幕可能合并不同表达类型，须听看源片确认。每个S编号代表一次出现，重复文本不得去重。\n\n`input/hard_constraints.json`列明8组必须审计的事件和全部交付参数；它给问题范围，不给中文译文、角色答案或完整配音轴。已发布的英语译文由题方用于核验语义。按素材中的瑞典语听写，题包仅提供粗定位。\n\n## 交付合同\n\n交付 `dub_zh.mp4`、`mix.wav`、`effects_track.wav`、`mobile_mix.wav`、每角色全长WAV、`subtitles_zh.srt`、`subtitles_sv.srt`、`bilingual.ass`、`speakers.json`、`translation_plan.json`、`mix_config.json`、`continuity_ledger.json`、离线重建脚本、`rebuild.json`及README。JSON精确结构见 `submission_schema.json`。\n\n- 保留全部画面顺序、尺寸、帧率和720秒长度；不可变速、补帧、删镜头。必须将交付的ZH/SV双语字幕实际烧录到dub_zh.mp4底部32%区域；另交SRT和ASS，只有软字幕或字幕文件不算实际显示。不能用字幕代替应有的普通话声音。\n- 每个角色WAV为48kHz立体声、全长、已应用最终音量的分轨，不得混入其他人物、音乐或源瑞典语。至少四位实际发声角色，声线听感可辨且稳定。`speakers.instance`区分有源证据支持的年龄/声音实例，不允许每句新增角色规避一致性。\n- `effects_track.wav`必须严格等于输入M&E乘一个全局增益，范围[-12,0]dB，写入mix_config；不得移轴、duck、拼接、替换或局部消音。最终 `mix.wav` 是所有角色轨与effects轨的逐样本和（相对波形误差≤2%，长度差<80ms）；总和后不可另加未交付处理。影院视频和mix分别满足-16±1 LUFS、true peak≤-1dBTP；峰值测量容差0.1dB。角色内可压限、EQ和混响，交出的轨须是已处理的最终轨。\n- `mobile_mix.wav`为48kHz单声道：由0.5×(mix左+mix右)经声明的单一全局增益及峰值限制生成，不改表演、内容和时间；-18±1 LUFS、true peak≤-2dBTP。方法字段固定mono_downmix_gain_limiter，gain_db范围[-12,6]，limiter_ceiling_dbtp=-2。实际单声道必须保留数字、否定、短句和必要音效，不能靠影院版听得清来抵扣。\n- 手机版精确参考滤镜为FFmpeg `pan=mono|c0=0.5*c0+0.5*c1,volume={gain_db}dB,alimiter=limit=0.7943282347:attack=5:release=50:level=0:latency=1`，输出48kHz PCM；可用等价实现，但与该链生成波形的相对误差须≤2%。采样峰值限幅不自动保证true peak合格，须实测并选择合适gain；true peak测量容差0.1dB。\n- 每个plan.events事件列event_id（唯一）、source_ids、type、speaker_id、speaker_instance、voice_id、source_text、zh_text、start/end、visible_speech、delivery_note。speech关联有效角色和实例；screen_text的speaker_id、speaker_instance、voice_id填空字符串；non_speech若含角色叫喊则填对应角色/实例/声音，放入该角色轨，没有角色声源时可留空。S编号可拆成多个类型，但每个编号均须有去向。屏幕文字翻成字幕，不给人物补念；非语言叫喊可以合法重制，或从源片分离保留不含可辨瑞典语单词的叫喊放入角色轨；不得把整句瑞典语作为叫喊混入，不可悄悄删除关键反应。字幕参考粗边界不能作为逐音素嘴型真值。\n- 中文SRT反映实际译制对白与需译屏幕文字，瑞典语SRT反映源意；双语ASS应语义和事件对应。每种语言每cue≤2行，中文≤18非空白Unicode字符/行、≤10字符/秒，瑞典语≤42字符/行；标点计数。常规cue 0.4—7秒，源本身极短感叹允许0.2—0.4秒并注明。屏幕文字可与对白重叠，不能为挤字幕裁掉限定词。双语烧录不得超过每种语言2行，适当字号、清晰对比度，避免遮住必要动作。\n- bilingual.ass使用Style名称ZH、SV分别表示两种语言，Name填speaker_id，screen_text可空；各语言和对应SRT的实际可见时间积分一致率≥98%，不以双方空白刷分。SRT可合理重分句，不要求等于配音事件边界。plan的zh_text/source_text与对应SRT全片文本序列召回与精确率均≥95%，包括屏幕文字；实际声音另由Judge核实。\n- continuity_ledger.decisions对C01—C08各写恰一条：source_ids、event_indices（plan.events零起索引）、source_evidence（源片start/end和观察）、decision、alternative_rejected。证据区间各自start<end，C02至少1处，其他每组至少2处。指出具体制作选择与舍弃方案，不需要长篇剧评，也不能把自述当验收证明。\n\n## 新版声音与转录要求\n\n中文必须尽量保持原人物音色、身份及语气；仅使用性别近似的通用TTS不等于保持原人物声音。跨段稳定与像不像源人物分开计分。允许从本题源片抽取参考，使用合法本地音色转换/克隆工具；必须写 voice_provenance.json，注明每角色实际方法和源参考区间。不得伪称克隆成功。\n\n新增 transcript_sv.txt（按实际出现顺序的瑞典语转录，含需翻译的屏幕文字并标明）、transcript_zh.txt（对应中文译文）、source_events.json（原声理解事件，结构见schema），同时保留全部原交付。source_events.events可使用模型自己的分句，每项标source_ids、speaker_id、start/end、source_text、delivery_note。S编号只给粗检索区间，不能直接当配音轴。没有提供完整瑞典语稿，须自行识别。\n\n## 最终评分合同\n\n最终分 = (E + T) × (A ÷ 70) × V × (100 ÷ 30)。E 满分 20，T 满分 10，A 满分 70，V 为 0–1 画面系数。\n- E源内容：词序列准确40%、事件覆盖粗定位20%、说话人/实例归属15%、语义/关键语气理解25%。词序列采用max(0,1−WER)，非全文二值匹配；官方参考争议进入pending。\n- T翻译：意义完整45%、自然度30%、术语称呼15%、语体功能10%。\n- A实际配音：原人物音色 25 分、同人物跨段稳定 15 分、情绪语气表演 15 分、实际内容 10 分、自然清晰和双版本混音 5 分。\n- V画面：原画面顺序内容60%、时间线20%、声画时机及字幕实际显示20%。字幕底部新增内容不作为原画面错误。\n\n所有主观项使用公开rules.json中的逐点Yes/No QA；缺模态、标签冲突记pending。每点两次独立评审，分歧第三次；源/输出均须有时间证据。普通点权重1，事先冻结的关键语义点3。音色和稳定性按源角色宏平均，不让话多的角色掩盖其他角色。跨段复核只计相应检查，不按全片时长再加一半权重。\n\n≥80且关键门槛通过才通过。需保持完整画面、交付可解码及可重建；无关键漏配、整句错角色、否定/关系/状态反转、大片瑞典语双叠、关键音效丢失及手机端角色消失。原有分轨、混音、字幕和审计合同继续检查，检查结果逐项报告。音色数值尚无人工校准阈值，不擅自新增未校准一票否决线；音色失真正常扣对应分。\n\n## 执行边界\n\nCodex CLI 作答不设总时限。使用服务器的 8 核 CPU 和离线工具。允许合法TTS及字幕工具，不要求固定GUI；离线重建的验收时限为 600 秒。自带TTS的V01—V08是系统声音/音高配置，不是八位真人或演员克隆。重建必须完全离线，依赖与合法声音来源写README；不得只复制已渲染主视频。`rebuild.json`argv支持{python}、{input}、{submission}、{output}，须把新成片写到{output}。\n\n考生仅获candidate目录，禁读evaluator/authoring、其他考生答案或外网现成答案。测试纯视听能力时由主办方断网并隔离文件系统，不能靠文字禁令阻止公开字幕检索。全部新增结果、缓存和临时目录放服务器指定工作目录；只在独立submission目录写入，不改输入。许可和来源见CREDITS.md。\n"
      },
      {
        "name": "hard_constraints.json",
        "path": "input/hard_constraints.json",
        "url": "variant-results/case-40/candidate/input/hard_constraints.json",
        "kind": "document",
        "bytes": 4330,
        "text": "{\n  \"version\": \"2.0-hard\",\n  \"duration\": 720,\n  \"challenges\": [\n    {\n      \"id\": \"C01\",\n      \"source_ids\": [\n        \"S004\",\n        \"S005\",\n        \"S008\",\n        \"S009\"\n      ],\n      \"requirement\": \"区分植物的开花周期与说话人实际等候的年份，保留开花持续时间和随后发生的事。\",\n      \"minimum_evidence_intervals\": 2\n    },\n    {\n      \"id\": \"C02\",\n      \"source_ids\": [\n        \"S012\",\n        \"S013\",\n        \"S014\"\n      ],\n      \"requirement\": \"保留对答两人的区别，以及转场后反复出现的回应。\",\n      \"minimum_evidence_intervals\": 1\n    },\n    {\n      \"id\": \"C03\",\n      \"source_ids\": [\n        \"S016\",\n        \"S019\",\n        \"S023\"\n      ],\n      \"requirement\": \"核对问候对象、梦里见到的人及洗澡提议被拒绝时的声源和语气。\",\n      \"minimum_evidence_intervals\": 2\n    },\n    {\n      \"id\": \"C04\",\n      \"source_ids\": [\n        \"S024\",\n        \"S025\",\n        \"S026\",\n        \"S027\",\n        \"S028\"\n      ],\n      \"requirement\": \"保留儿子未到访、提议干预以及未来条件之间的因果和否定范围。\",\n      \"minimum_evidence_intervals\": 2\n    },\n    {\n      \"id\": \"C05\",\n      \"source_ids\": [\n        \"S031\",\n        \"S032\",\n        \"S033\",\n        \"S034\",\n        \"S035\"\n      ],\n      \"requirement\": \"区分有关睡眠和父母的问答，保留反问、判断和相互回应。\",\n      \"minimum_evidence_intervals\": 2\n    },\n    {\n      \"id\": \"C06\",\n      \"source_ids\": [\n        \"S042\",\n        \"S043\",\n        \"S044\",\n        \"S046\"\n      ],\n      \"requirement\": \"区分物件的问题和气味评论、称呼和随后重复提及的气味，保持角色归属。\",\n      \"minimum_evidence_intervals\": 2\n    },\n    {\n      \"id\": \"C07\",\n      \"source_ids\": [\n        \"S050\",\n        \"S051\",\n        \"S052\",\n        \"S053\",\n        \"S054\"\n      ],\n      \"requirement\": \"保留哈尔德在不同说话人处的称呼、态度和指代。\",\n      \"minimum_evidence_intervals\": 2\n    },\n    {\n      \"id\": \"C08\",\n      \"source_ids\": [\n        \"S055\",\n        \"S056\"\n      ],\n      \"requirement\": \"保留生长时间、用于比较的身体部位和夜间生长条件，并核对其在手机版的可闻性。\",\n      \"minimum_evidence_intervals\": 2\n    }\n  ],\n  \"audio_contract\": {\n    \"sample_rate\": 48000,\n    \"stereo_tracks\": [\n      \"mix.wav\",\n      \"effects_track.wav\",\n      \"all speaker wav files\"\n    ],\n    \"mono_tracks\": [\n      \"mobile_mix.wav\"\n    ],\n    \"duration_tolerance_seconds\": 0.08,\n    \"effects_gain_db_range\": [\n      -12,\n      0\n    ],\n    \"effects_formula\": \"effects_track = input/music_effects.wav * 10 ** (effects_gain_db / 20); no shifting, ducking, EQ, splicing, time stretching, or replacement\",\n    \"mix_formula\": \"mix.wav = effects_track.wav + sum(all final-gain speaker tracks); no post-sum processing\",\n    \"maximum_relative_waveform_error\": 0.02,\n    \"cinema_integrated_lufs\": [\n      -17,\n      -15\n    ],\n    \"cinema_true_peak_max_dbtp\": -1,\n    \"mobile_integrated_lufs\": [\n      -19,\n      -17\n    ],\n    \"mobile_true_peak_max_dbtp\": -2,\n    \"mobile_formula\": \"0.5*(mix.left+mix.right), followed only by declared global gain and peak limiter; no content edits\",\n    \"mobile_ffmpeg_filter\": \"pan=mono|c0=0.5*c0+0.5*c1,volume={gain_db}dB,alimiter=limit=0.7943282347:attack=5:release=50:level=0:latency=1\"\n  },\n  \"subtitle_contract\": {\n    \"max_lines_per_language\": 2,\n    \"zh_max_chars_per_line\": 18,\n    \"en_max_chars_per_line\": 42,\n    \"max_zh_chars_per_second\": 10,\n    \"regular_min_duration\": 0.4,\n    \"max_duration\": 7,\n    \"screen_text_may_overlap_speech\": true,\n    \"note\": \"Unicode non-whitespace code points; punctuation counts; speech cues must intersect corresponding plan event. Very short original interjections may last 0.2-0.4 s if source duration is similarly short and documented.\",\n    \"burn_in_required\": true,\n    \"burn_in_region\": \"bottom 32 percent of frame; both ZH and EN visible\"\n  },\n  \"reference_policy\": \"S001–S062 标记不同源事件，粗时间只供检索。字幕上同一个编号如包含多位发言者须拆分；非语言角色叫声和背景声按真实声源处理。\",\n  \"delivery_budget\": {\n    \"suggested_minutes\": 180,\n    \"cpu_cores\": 8,\n    \"ram_gb\": 32,\n    \"optional_gpu_gb\": 24,\n    \"workspace_gb\": 30\n  },\n  \"minimum_roles\": 4\n}\n"
      },
      {
        "name": "music_effects.m4a",
        "path": "input/music_effects.m4a",
        "url": "variant-results/case-40/candidate/input/music_effects.m4a",
        "kind": "audio",
        "bytes": 8828489,
        "meta": {
          "duration": 720.0,
          "width": null,
          "height": null,
          "fps": "0/0",
          "sampleRate": "48000"
        }
      },
      {
        "name": "occurrence_catalog.json",
        "path": "input/occurrence_catalog.json",
        "url": "variant-results/case-40/candidate/input/occurrence_catalog.json",
        "kind": "document",
        "bytes": 6144,
        "text": "{\n  \"note\": \"粗检索区间，不给逐字稿、人物或精确发声轴。\",\n  \"occurrences\": [\n    {\n      \"source_id\": \"S001\",\n      \"search_window\": [\n        0,\n        10\n      ]\n    },\n    {\n      \"source_id\": \"S002\",\n      \"search_window\": [\n        0,\n        10\n      ]\n    },\n    {\n      \"source_id\": \"S003\",\n      \"search_window\": [\n        0,\n        10\n      ]\n    },\n    {\n      \"source_id\": \"S004\",\n      \"search_window\": [\n        0,\n        20\n      ]\n    },\n    {\n      \"source_id\": \"S005\",\n      \"search_window\": [\n        10,\n        20\n      ]\n    },\n    {\n      \"source_id\": \"S006\",\n      \"search_window\": [\n        10,\n        20\n      ]\n    },\n    {\n      \"source_id\": \"S007\",\n      \"search_window\": [\n        20,\n        30\n      ]\n    },\n    {\n      \"source_id\": \"S008\",\n      \"search_window\": [\n        20,\n        30\n      ]\n    },\n    {\n      \"source_id\": \"S009\",\n      \"search_window\": [\n        30,\n        40\n      ]\n    },\n    {\n      \"source_id\": \"S010\",\n      \"search_window\": [\n        30,\n        40\n      ]\n    },\n    {\n      \"source_id\": \"S011\",\n      \"search_window\": [\n        30,\n        50\n      ]\n    },\n    {\n      \"source_id\": \"S012\",\n      \"search_window\": [\n        40,\n        50\n      ]\n    },\n    {\n      \"source_id\": \"S013\",\n      \"search_window\": [\n        60,\n        70\n      ]\n    },\n    {\n      \"source_id\": \"S014\",\n      \"search_window\": [\n        60,\n        70\n      ]\n    },\n    {\n      \"source_id\": \"S015\",\n      \"search_window\": [\n        70,\n        80\n      ]\n    },\n    {\n      \"source_id\": \"S016\",\n      \"search_window\": [\n        90,\n        100\n      ]\n    },\n    {\n      \"source_id\": \"S017\",\n      \"search_window\": [\n        100,\n        110\n      ]\n    },\n    {\n      \"source_id\": \"S018\",\n      \"search_window\": [\n        100,\n        120\n      ]\n    },\n    {\n      \"source_id\": \"S019\",\n      \"search_window\": [\n        110,\n        130\n      ]\n    },\n    {\n      \"source_id\": \"S020\",\n      \"search_window\": [\n        120,\n        130\n      ]\n    },\n    {\n      \"source_id\": \"S021\",\n      \"search_window\": [\n        130,\n        140\n      ]\n    },\n    {\n      \"source_id\": \"S022\",\n      \"search_window\": [\n        130,\n        140\n      ]\n    },\n    {\n      \"source_id\": \"S023\",\n      \"search_window\": [\n        140,\n        150\n      ]\n    },\n    {\n      \"source_id\": \"S024\",\n      \"search_window\": [\n        240,\n        250\n      ]\n    },\n    {\n      \"source_id\": \"S025\",\n      \"search_window\": [\n        250,\n        260\n      ]\n    },\n    {\n      \"source_id\": \"S026\",\n      \"search_window\": [\n        250,\n        260\n      ]\n    },\n    {\n      \"source_id\": \"S027\",\n      \"search_window\": [\n        250,\n        270\n      ]\n    },\n    {\n      \"source_id\": \"S028\",\n      \"search_window\": [\n        260,\n        280\n      ]\n    },\n    {\n      \"source_id\": \"S029\",\n      \"search_window\": [\n        310,\n        320\n      ]\n    },\n    {\n      \"source_id\": \"S030\",\n      \"search_window\": [\n        310,\n        330\n      ]\n    },\n    {\n      \"source_id\": \"S031\",\n      \"search_window\": [\n        340,\n        350\n      ]\n    },\n    {\n      \"source_id\": \"S032\",\n      \"search_window\": [\n        340,\n        350\n      ]\n    },\n    {\n      \"source_id\": \"S033\",\n      \"search_window\": [\n        360,\n        370\n      ]\n    },\n    {\n      \"source_id\": \"S034\",\n      \"search_window\": [\n        360,\n        370\n      ]\n    },\n    {\n      \"source_id\": \"S035\",\n      \"search_window\": [\n        360,\n        380\n      ]\n    },\n    {\n      \"source_id\": \"S036\",\n      \"search_window\": [\n        380,\n        390\n      ]\n    },\n    {\n      \"source_id\": \"S037\",\n      \"search_window\": [\n        410,\n        430\n      ]\n    },\n    {\n      \"source_id\": \"S038\",\n      \"search_window\": [\n        420,\n        430\n      ]\n    },\n    {\n      \"source_id\": \"S039\",\n      \"search_window\": [\n        450,\n        470\n      ]\n    },\n    {\n      \"source_id\": \"S040\",\n      \"search_window\": [\n        460,\n        470\n      ]\n    },\n    {\n      \"source_id\": \"S041\",\n      \"search_window\": [\n        460,\n        480\n      ]\n    },\n    {\n      \"source_id\": \"S042\",\n      \"search_window\": [\n        480,\n        490\n      ]\n    },\n    {\n      \"source_id\": \"S043\",\n      \"search_window\": [\n        480,\n        500\n      ]\n    },\n    {\n      \"source_id\": \"S044\",\n      \"search_window\": [\n        490,\n        500\n      ]\n    },\n    {\n      \"source_id\": \"S045\",\n      \"search_window\": [\n        490,\n        510\n      ]\n    },\n    {\n      \"source_id\": \"S046\",\n      \"search_window\": [\n        500,\n        510\n      ]\n    },\n    {\n      \"source_id\": \"S047\",\n      \"search_window\": [\n        510,\n        530\n      ]\n    },\n    {\n      \"source_id\": \"S048\",\n      \"search_window\": [\n        520,\n        530\n      ]\n    },\n    {\n      \"source_id\": \"S049\",\n      \"search_window\": [\n        520,\n        540\n      ]\n    },\n    {\n      \"source_id\": \"S050\",\n      \"search_window\": [\n        570,\n        580\n      ]\n    },\n    {\n      \"source_id\": \"S051\",\n      \"search_window\": [\n        580,\n        590\n      ]\n    },\n    {\n      \"source_id\": \"S052\",\n      \"search_window\": [\n        580,\n        590\n      ]\n    },\n    {\n      \"source_id\": \"S053\",\n      \"search_window\": [\n        580,\n        600\n      ]\n    },\n    {\n      \"source_id\": \"S054\",\n      \"search_window\": [\n        590,\n        600\n      ]\n    },\n    {\n      \"source_id\": \"S055\",\n      \"search_window\": [\n        630,\n        640\n      ]\n    },\n    {\n      \"source_id\": \"S056\",\n      \"search_window\": [\n        640,\n        650\n      ]\n    },\n    {\n      \"source_id\": \"S057\",\n      \"search_window\": [\n        680,\n        690\n      ]\n    },\n    {\n      \"source_id\": \"S058\",\n      \"search_window\": [\n        680,\n        700\n      ]\n    },\n    {\n      \"source_id\": \"S059\",\n      \"search_window\": [\n        690,\n        700\n      ]\n    },\n    {\n      \"source_id\": \"S060\",\n      \"search_window\": [\n        690,\n        710\n      ]\n    },\n    {\n      \"source_id\": \"S061\",\n      \"search_window\": [\n        700,\n        710\n      ]\n    },\n    {\n      \"source_id\": \"S062\",\n      \"search_window\": [\n        700,\n        720\n      ]\n    }\n  ]\n}\n"
      },
      {
        "name": "original.m4a",
        "path": "input/original.m4a",
        "url": "variant-results/case-40/candidate/input/original.m4a",
        "kind": "audio",
        "bytes": 8826724,
        "meta": {
          "duration": 720.0,
          "width": null,
          "height": null,
          "fps": "0/0",
          "sampleRate": "48000"
        }
      },
      {
        "name": "source.mp4",
        "path": "input/source.mp4",
        "url": "variant-results/case-40/candidate/input/source.mp4",
        "kind": "video",
        "bytes": 38834858,
        "meta": {
          "duration": 720.005,
          "width": 800,
          "height": 450,
          "fps": "25/1",
          "sampleRate": null
        }
      },
      {
        "name": "terminology.json",
        "path": "input/terminology.json",
        "url": "variant-results/case-40/candidate/input/terminology.json",
        "kind": "document",
        "bytes": 250,
        "text": "{\n  \"Mette\": \"梅特\",\n  \"Märta\": \"梅尔塔\",\n  \"Elsie\": \"埃尔茜\",\n  \"Harald\": \"哈尔德\",\n  \"note\": \"允许一致的其他合理译名。答卷需根据画面和声音确认角色归属；提示列表不代表片中每一个发声角色。\"\n}\n"
      },
      {
        "name": "V01.m4a",
        "path": "input/voice_samples/V01.m4a",
        "url": "variant-results/case-40/candidate/input/voice_samples/V01.m4a",
        "kind": "audio",
        "bytes": 87957,
        "meta": {
          "duration": 8.041,
          "width": null,
          "height": null,
          "fps": "0/0",
          "sampleRate": "48000"
        }
      },
      {
        "name": "V02.m4a",
        "path": "input/voice_samples/V02.m4a",
        "url": "variant-results/case-40/candidate/input/voice_samples/V02.m4a",
        "kind": "audio",
        "bytes": 87957,
        "meta": {
          "duration": 8.041,
          "width": null,
          "height": null,
          "fps": "0/0",
          "sampleRate": "48000"
        }
      },
      {
        "name": "V03.m4a",
        "path": "input/voice_samples/V03.m4a",
        "url": "variant-results/case-40/candidate/input/voice_samples/V03.m4a",
        "kind": "audio",
        "bytes": 87957,
        "meta": {
          "duration": 8.041,
          "width": null,
          "height": null,
          "fps": "0/0",
          "sampleRate": "48000"
        }
      },
      {
        "name": "V04.m4a",
        "path": "input/voice_samples/V04.m4a",
        "url": "variant-results/case-40/candidate/input/voice_samples/V04.m4a",
        "kind": "audio",
        "bytes": 85821,
        "meta": {
          "duration": 8.043,
          "width": null,
          "height": null,
          "fps": "0/0",
          "sampleRate": "48000"
        }
      },
      {
        "name": "V05.m4a",
        "path": "input/voice_samples/V05.m4a",
        "url": "variant-results/case-40/candidate/input/voice_samples/V05.m4a",
        "kind": "audio",
        "bytes": 85642,
        "meta": {
          "duration": 8.043,
          "width": null,
          "height": null,
          "fps": "0/0",
          "sampleRate": "48000"
        }
      },
      {
        "name": "V06.m4a",
        "path": "input/voice_samples/V06.m4a",
        "url": "variant-results/case-40/candidate/input/voice_samples/V06.m4a",
        "kind": "audio",
        "bytes": 88470,
        "meta": {
          "duration": 8.037,
          "width": null,
          "height": null,
          "fps": "0/0",
          "sampleRate": "48000"
        }
      },
      {
        "name": "V07.m4a",
        "path": "input/voice_samples/V07.m4a",
        "url": "variant-results/case-40/candidate/input/voice_samples/V07.m4a",
        "kind": "audio",
        "bytes": 79936,
        "meta": {
          "duration": 7.226,
          "width": null,
          "height": null,
          "fps": "0/0",
          "sampleRate": "48000"
        }
      },
      {
        "name": "V08.m4a",
        "path": "input/voice_samples/V08.m4a",
        "url": "variant-results/case-40/candidate/input/voice_samples/V08.m4a",
        "kind": "audio",
        "bytes": 80327,
        "meta": {
          "duration": 7.225,
          "width": null,
          "height": null,
          "fps": "0/0",
          "sampleRate": "48000"
        }
      },
      {
        "name": "voices.json",
        "path": "input/voice_samples/voices.json",
        "url": "variant-results/case-40/candidate/input/voice_samples/voices.json",
        "kind": "document",
        "bytes": 1075,
        "text": "{\n  \"V01\": {\n    \"system_voice\": \"Microsoft Huihui Desktop\",\n    \"rate\": 0,\n    \"pitch_multiplier\": 1.0,\n    \"sample\": \"V01.wav\"\n  },\n  \"V02\": {\n    \"system_voice\": \"Microsoft Kangkang\",\n    \"rate\": 0,\n    \"pitch_multiplier\": 1.0,\n    \"sample\": \"V02.wav\"\n  },\n  \"V03\": {\n    \"system_voice\": \"Microsoft Yaoyao\",\n    \"rate\": 0,\n    \"pitch_multiplier\": 1.0,\n    \"sample\": \"V03.wav\"\n  },\n  \"V04\": {\n    \"system_voice\": \"Microsoft Huihui Desktop\",\n    \"rate\": 0,\n    \"pitch_multiplier\": 0.9,\n    \"sample\": \"V04.wav\"\n  },\n  \"V05\": {\n    \"system_voice\": \"Microsoft Kangkang\",\n    \"rate\": 0,\n    \"pitch_multiplier\": 0.88,\n    \"sample\": \"V05.wav\"\n  },\n  \"V06\": {\n    \"system_voice\": \"Microsoft Yaoyao\",\n    \"rate\": 0,\n    \"pitch_multiplier\": 1.1,\n    \"sample\": \"V06.wav\"\n  },\n  \"V07\": {\n    \"system_voice\": \"Microsoft Huihui Desktop\",\n    \"rate\": 1,\n    \"pitch_multiplier\": 1.08,\n    \"sample\": \"V07.wav\"\n  },\n  \"V08\": {\n    \"system_voice\": \"Microsoft Kangkang\",\n    \"rate\": 1,\n    \"pitch_multiplier\": 1.1,\n    \"sample\": \"V08.wav\"\n  }\n}"
      },
      {
        "name": "rules.json",
        "path": "rules.json",
        "url": "variant-results/case-40/candidate/rules.json",
        "kind": "document",
        "bytes": 11269,
        "text": "{\n  \"main_output\": \"dub_zh.mp4\",\n  \"required_files\": [\n    \"dub_zh.mp4\",\n    \"mix.wav\",\n    \"subtitles_zh.srt\",\n    \"subtitles_sv.srt\",\n    \"bilingual.ass\",\n    \"speakers.json\",\n    \"translation_plan.json\",\n    \"rebuild.json\",\n    \"README.md\",\n    \"effects_track.wav\",\n    \"mobile_mix.wav\",\n    \"mix_config.json\",\n    \"continuity_ledger.json\",\n    \"transcript_sv.txt\",\n    \"transcript_zh.txt\",\n    \"source_events.json\",\n    \"voice_provenance.json\"\n  ],\n  \"case_number\": 13,\n  \"original_case_id\": 40,\n  \"version\": \"final-content-times-audio\",\n  \"task_summary\": \"将525秒真实连续电影片段制作成普通话译制成片及手机单声道版，解决8组跨场景语义/声源挑战，交付可逐样本审计的角色轨和音乐音效轨。\",\n  \"passing_score\": 80,\n  \"scoring_status\": \"experimental_source_grounded\",\n  \"rebuild_timeout\": 600,\n  \"score_formula\": \"(E20 + T10) * (A70 / 70) * (0.6*V_frames_rate + 0.2*V_timeline_rate + 0.2*V_display_rate) * (100 / 30)\",\n  \"source_transcript_provided\": false,\n  \"groups\": {\n    \"E\": 20,\n    \"T\": 10,\n    \"A\": 70\n  },\n  \"subcriteria\": {\n    \"E_words\": {\n      \"group\": \"E\",\n      \"within_group_weight\": 0.4,\n      \"maximum\": 8.0,\n      \"label\": \"瑞典语词序列准确性\",\n      \"method\": \"automatic\",\n      \"unit\": \"points\"\n    },\n    \"E_events\": {\n      \"group\": \"E\",\n      \"within_group_weight\": 0.2,\n      \"maximum\": 4.0,\n      \"label\": \"源事件覆盖与粗定位\",\n      \"method\": \"judge\",\n      \"unit\": \"points\"\n    },\n    \"E_roles\": {\n      \"group\": \"E\",\n      \"within_group_weight\": 0.15,\n      \"maximum\": 3.0,\n      \"label\": \"源说话人/声音实例归属\",\n      \"method\": \"judge\",\n      \"unit\": \"points\"\n    },\n    \"E_meaning\": {\n      \"group\": \"E\",\n      \"within_group_weight\": 0.25,\n      \"maximum\": 5.0,\n      \"label\": \"源语义与关键语气识别\",\n      \"method\": \"judge\",\n      \"unit\": \"points\"\n    },\n    \"T_meaning\": {\n      \"group\": \"T\",\n      \"within_group_weight\": 0.45,\n      \"maximum\": 4.5,\n      \"label\": \"中文意义准确完整\",\n      \"method\": \"judge\",\n      \"unit\": \"points\"\n    },\n    \"T_natural\": {\n      \"group\": \"T\",\n      \"within_group_weight\": 0.3,\n      \"maximum\": 3.0,\n      \"label\": \"中文自然度\",\n      \"method\": \"judge\",\n      \"unit\": \"points\"\n    },\n    \"T_terms\": {\n      \"group\": \"T\",\n      \"within_group_weight\": 0.15,\n      \"maximum\": 1.5,\n      \"label\": \"术语和称呼一致\",\n      \"method\": \"judge\",\n      \"unit\": \"points\"\n    },\n    \"T_style\": {\n      \"group\": \"T\",\n      \"within_group_weight\": 0.1,\n      \"maximum\": 1.0,\n      \"label\": \"语体与语用功能\",\n      \"method\": \"judge\",\n      \"unit\": \"points\"\n    },\n    \"A_identity\": {\n      \"group\": \"A\",\n      \"within_group_weight\": 0.35714285714285715,\n      \"maximum\": 25,\n      \"label\": \"原人物音色与身份保持\",\n      \"method\": \"judge\",\n      \"unit\": \"points\"\n    },\n    \"A_stable\": {\n      \"group\": \"A\",\n      \"within_group_weight\": 0.21428571428571427,\n      \"maximum\": 15,\n      \"label\": \"同人物跨段声音一致性\",\n      \"method\": \"judge\",\n      \"unit\": \"points\"\n    },\n    \"A_prosody\": {\n      \"group\": \"A\",\n      \"within_group_weight\": 0.21428571428571427,\n      \"maximum\": 15,\n      \"label\": \"情绪语气与表演保持\",\n      \"method\": \"judge\",\n      \"unit\": \"points\"\n    },\n    \"A_content\": {\n      \"group\": \"A\",\n      \"within_group_weight\": 0.14285714285714285,\n      \"maximum\": 10,\n      \"label\": \"实际中文内容忠实度\",\n      \"method\": \"judge\",\n      \"unit\": \"points\"\n    },\n    \"A_quality\": {\n      \"group\": \"A\",\n      \"within_group_weight\": 0.07142857142857142,\n      \"maximum\": 5,\n      \"label\": \"自然度清晰度与双版本混音\",\n      \"method\": \"judge\",\n      \"unit\": \"points\"\n    },\n    \"V_frames\": {\n      \"group\": \"V\",\n      \"within_group_weight\": 0.6,\n      \"maximum\": 0.6,\n      \"label\": \"原画面内容与顺序\",\n      \"method\": \"automatic\",\n      \"unit\": \"coefficient\"\n    },\n    \"V_timeline\": {\n      \"group\": \"V\",\n      \"within_group_weight\": 0.2,\n      \"maximum\": 0.2,\n      \"label\": \"时间线完整性\",\n      \"method\": \"automatic\",\n      \"unit\": \"coefficient\"\n    },\n    \"V_display\": {\n      \"group\": \"V\",\n      \"within_group_weight\": 0.2,\n      \"maximum\": 0.2,\n      \"label\": \"声画时机与字幕呈现\",\n      \"method\": \"judge\",\n      \"unit\": \"coefficient\"\n    }\n  },\n  \"checklist\": {\n    \"E_events\": [\n      [\n        \"occurrence\",\n        \"这次源事件是否独立记录而未漏掉或与另一次重复出现合并？\"\n      ],\n      [\n        \"window\",\n        \"提交事件窗口是否覆盖实际源发声/屏幕事件，且无明显跨场景错置？\"\n      ]\n    ],\n    \"E_roles\": [\n      [\n        \"source_role\",\n        \"提交的 speaker_id 对应的可见人物/画外声源是否正确？\"\n      ],\n      [\n        \"instance\",\n        \"提交的声音实例区分是否符合实际源人物，而非按每句任意新增身份？\"\n      ]\n    ],\n    \"E_meaning\": [\n      [\n        \"proposition\",\n        \"瑞典语转录及事件声明是否保留本次源事件的核心命题、关系及限定方向？\"\n      ],\n      [\n        \"intent\",\n        \"提交的 delivery_note 是否正确识别源句实际语用/情绪功能？\"\n      ]\n    ],\n    \"T_meaning\": [\n      [\n        \"proposition\",\n        \"中文译文是否保留源事件核心命题及人物关系？\"\n      ],\n      [\n        \"scope\",\n        \"源句中的否定/数字/条件/完成性/自我修正/后置限定是否均保留且作用范围正确？\"\n      ]\n    ],\n    \"T_natural\": [\n      [\n        \"grammar\",\n        \"中文句子语法是否成立且无需读者补修即可理解？\"\n      ],\n      [\n        \"spoken\",\n        \"中文措辞搭配是否适合自然口语且无明显生硬直译？\"\n      ]\n    ],\n    \"T_terms\": [\n      [\n        \"terms\",\n        \"本事件中的术语、专名、称呼是否正确且与其他同一所指相容？\"\n      ]\n    ],\n    \"T_style\": [\n      [\n        \"function\",\n        \"中文文字是否保留源句命令/请求/疑问/讽刺/辩解等实际语用功能？\"\n      ]\n    ],\n    \"A_identity\": [\n      [\n        \"pitch\",\n        \"中文声音的音高区间是否与该源人物相容？\"\n      ],\n      [\n        \"texture\",\n        \"中文声音是否保留源人物可稳定辨认的气声/沙哑/明亮等音质特征？\"\n      ],\n      [\n        \"resonance\",\n        \"中文声音的共鸣、厚薄特征是否与源人物相容？\"\n      ],\n      [\n        \"identity\",\n        \"排除语言差异后中文声音是否仍可辨认为同一人物，而非仅性别相近的通用声音？\"\n      ]\n    ],\n    \"A_stable\": [\n      [\n        \"stable\",\n        \"同一人物/合法声音实例在这些跨段样本中是否保持相同音色身份？\"\n      ],\n      [\n        \"distinct\",\n        \"此人物声音是否仍可与其他实际角色区分，未发生声线交换？\"\n      ]\n    ],\n    \"A_prosody\": [\n      [\n        \"intent\",\n        \"实际中文声音是否保留源句的关键语气/情绪功能？\"\n      ],\n      [\n        \"delivery\",\n        \"实际中文是否保留源句可听的强调、停顿、犹豫、修正或被打断的表演结构（以源实际存在者为准）？\"\n      ]\n    ],\n    \"A_content\": [\n      [\n        \"spoken\",\n        \"源中应发声的中文核心意思是否实际完整可听，而非仅写在译稿/字幕？\"\n      ],\n      [\n        \"critical\",\n        \"实际中文是否保留源句否定、关系、数字、条件和状态，未反转或擅自补全？\"\n      ]\n    ],\n    \"A_quality\": [\n      [\n        \"mandarin\",\n        \"实际配音是否为可懂普通话且无妨碍理解的误读？\"\n      ],\n      [\n        \"natural\",\n        \"实际语音是否自然连贯，无明显机械节奏/不合理停顿？\"\n      ],\n      [\n        \"clean\",\n        \"实际混音是否无妨碍听辨的伪影、削波或瑞典语双叠？\"\n      ],\n      [\n        \"effects\",\n        \"故事必要的源音效是否仍可听且未遮住关键中文？\"\n      ],\n      [\n        \"mobile\",\n        \"实际手机单声道版是否保留同一完整中文及必要音效，数字/否定/短句可懂？\"\n      ]\n    ],\n    \"V_display\": [\n      [\n        \"sync\",\n        \"实际可见嘴部发声/画外事件窗口与中文发声是否可用，无明显错位或拖尾？\"\n      ],\n      [\n        \"burned\",\n        \"中瑞双语字幕是否均实际烧录且对应交付文本？\"\n      ],\n      [\n        \"safe_area\",\n        \"字幕是否位于底部32%且不遮挡必要动作，字号对比度可读？\"\n      ]\n    ]\n  },\n  \"judge_protocol\": {\n    \"answers\": [\n      \"yes\",\n      \"no\",\n      \"pending\"\n    ],\n    \"independent_votes\": 2,\n    \"third_vote_on_disagreement\": true,\n    \"evidence_required\": true,\n    \"critical_weight\": 3,\n    \"ordinary_weight\": 1,\n    \"identity_aggregation\": \"equal source-role macro average\",\n    \"global_review_weight\": \"only cross-scene check items; no double full-duration weighting\",\n    \"no_answer\": \"pending, not zero\"\n  },\n  \"source_reference_policy\": \"English translation captions are timing and semantic hints. Actual source language is Swedish. Source listening and independent Swedish ASR supply an audit reference; irresolvable acoustic disagreements are pending.\",\n  \"voice_minimum_policy\": \"No uncalibrated numeric identity gate. Identity/stability scores reported; entire-role identity swap remains critical gate.\",\n  \"automatic_definitions\": {\n    \"E_words\": \"max(0,1-word Levenshtein distance/reference word count); lowercase, punctuation ignored, screen labels removed, Fourty/40/forty normalized; no semantic paraphrase credit for English transcription\",\n    \"V_frames\": \"fraction of all top68% 32x24 grayscale frames with MAE<12 at corresponding frame index, multiplied by min(1,output_frames/source_frames); threshold>=98% and frame count difference<=1 remains hard gate\",\n    \"V_timeline\": \"max(0,1-abs(output_duration-525)/525); duration within one frame+30ms and original frame sequence remain hard gates\",\n    \"pending\": \"No score substitution or denominator shrinking; report confirmed lower/upper bounds. Formal total withheld while any scored item pending.\"\n  },\n  \"run_conditions\": {\n    \"solver_effort\": \"high\",\n    \"wall_seconds\": 3600,\n    \"maximum_parallel_solvers\": 2,\n    \"maximum_api_requests\": 2,\n    \"local_voice_tool\": \"F5-TTS v1 Base/Vocos CPU, optional; common System.Speech and offline ASR also available\",\n    \"resources\": \"Two solvers share host CPU/disk; GPU not exposed; actual disk space visible; batch inference recommended\"\n  },\n  \"visual_coefficient\": {\n    \"V_frames\": 0.6,\n    \"V_timeline\": 0.2,\n    \"V_display\": 0.2\n  },\n  \"reweighting_policy\": {\n    \"E\": 20,\n    \"T\": 10,\n    \"A\": {\n      \"A_identity\": 25,\n      \"A_stable\": 15,\n      \"A_prosody\": 15,\n      \"A_content\": 10,\n      \"A_quality\": 5\n    },\n    \"V\": {\n      \"V_frames\": 0.6,\n      \"V_timeline\": 0.2,\n      \"V_display\": 0.2\n    },\n    \"pass_score\": 80,\n    \"gate_policy\": \"All existing gates retained. Failed or pending gates do not pass.\",\n    \"formula\": \"(E20 + T10) * (A70 / 70) * V_coefficient * (100 / 30)\",\n    \"scope\": \"Frozen submissions, subcriterion scores, QA answers, reasons and votes unchanged. Content is multiplied by audio and visual coefficients, normalized to 100.\"\n  }\n}\n"
      },
      {
        "name": "submission_schema.json",
        "path": "submission_schema.json",
        "url": "variant-results/case-40/candidate/submission_schema.json",
        "kind": "document",
        "bytes": 8794,
        "text": "{\n  \"$schema\": \"https://json-schema.org/draft/2020-12/schema\",\n  \"file_schemas\": {\n    \"speakers.json\": {\n      \"type\": \"object\",\n      \"properties\": {\n        \"speakers\": {\n          \"type\": \"array\",\n          \"minItems\": 4,\n          \"items\": {\n            \"type\": \"object\",\n            \"properties\": {\n              \"speaker_id\": {\n                \"type\": \"string\"\n              },\n              \"name\": {\n                \"type\": \"string\"\n              },\n              \"voice_id\": {\n                \"type\": \"string\"\n              },\n              \"wav\": {\n                \"type\": \"string\"\n              },\n              \"instance\": {\n                \"type\": \"string\",\n                \"minLength\": 1\n              }\n            },\n            \"required\": [\n              \"speaker_id\",\n              \"name\",\n              \"voice_id\",\n              \"wav\",\n              \"instance\"\n            ],\n            \"additionalProperties\": true\n          }\n        }\n      },\n      \"required\": [\n        \"speakers\"\n      ],\n      \"additionalProperties\": true\n    },\n    \"translation_plan.json\": {\n      \"type\": \"object\",\n      \"properties\": {\n        \"events\": {\n          \"type\": \"array\",\n          \"minItems\": 1,\n          \"items\": {\n            \"type\": \"object\",\n            \"properties\": {\n              \"source_ids\": {\n                \"type\": \"array\",\n                \"minItems\": 1,\n                \"items\": {\n                  \"type\": \"string\"\n                }\n              },\n              \"speaker_id\": {\n                \"type\": \"string\"\n              },\n              \"source_text\": {\n                \"type\": \"string\"\n              },\n              \"zh_text\": {\n                \"type\": \"string\"\n              },\n              \"voice_id\": {\n                \"type\": \"string\"\n              },\n              \"start\": {\n                \"type\": \"number\"\n              },\n              \"end\": {\n                \"type\": \"number\"\n              },\n              \"visible_speech\": {\n                \"type\": \"boolean\"\n              },\n              \"type\": {\n                \"enum\": [\n                  \"speech\",\n                  \"screen_text\",\n                  \"non_speech\"\n                ]\n              },\n              \"event_id\": {\n                \"type\": \"string\",\n                \"minLength\": 1\n              },\n              \"speaker_instance\": {\n                \"type\": \"string\"\n              },\n              \"delivery_note\": {\n                \"type\": \"string\"\n              }\n            },\n            \"required\": [\n              \"source_ids\",\n              \"speaker_id\",\n              \"source_text\",\n              \"zh_text\",\n              \"voice_id\",\n              \"start\",\n              \"end\",\n              \"visible_speech\",\n              \"type\",\n              \"event_id\",\n              \"speaker_instance\",\n              \"delivery_note\"\n            ],\n            \"additionalProperties\": true\n          }\n        }\n      },\n      \"required\": [\n        \"events\"\n      ],\n      \"additionalProperties\": true\n    },\n    \"rebuild.json\": {\n      \"type\": \"object\",\n      \"properties\": {\n        \"argv\": {\n          \"type\": \"array\",\n          \"minItems\": 1,\n          \"items\": {\n            \"type\": \"string\"\n          }\n        }\n      },\n      \"required\": [\n        \"argv\"\n      ],\n      \"additionalProperties\": true\n    },\n    \"mix_config.json\": {\n      \"type\": \"object\",\n      \"required\": [\n        \"effects_gain_db\",\n        \"mobile\"\n      ],\n      \"additionalProperties\": false,\n      \"properties\": {\n        \"effects_gain_db\": {\n          \"type\": \"number\",\n          \"minimum\": -12,\n          \"maximum\": 0\n        },\n        \"mobile\": {\n          \"type\": \"object\",\n          \"required\": [\n            \"method\",\n            \"gain_db\",\n            \"limiter_ceiling_dbtp\"\n          ],\n          \"additionalProperties\": false,\n          \"properties\": {\n            \"method\": {\n              \"const\": \"mono_downmix_gain_limiter\"\n            },\n            \"gain_db\": {\n              \"type\": \"number\",\n              \"minimum\": -12,\n              \"maximum\": 6\n            },\n            \"limiter_ceiling_dbtp\": {\n              \"const\": -2\n            }\n          }\n        }\n      }\n    },\n    \"continuity_ledger.json\": {\n      \"type\": \"object\",\n      \"required\": [\n        \"decisions\"\n      ],\n      \"additionalProperties\": false,\n      \"properties\": {\n        \"decisions\": {\n          \"type\": \"array\",\n          \"minItems\": 8,\n          \"maxItems\": 8,\n          \"items\": {\n            \"type\": \"object\",\n            \"required\": [\n              \"challenge_id\",\n              \"source_ids\",\n              \"event_indices\",\n              \"source_evidence\",\n              \"decision\",\n              \"alternative_rejected\"\n            ],\n            \"additionalProperties\": false,\n            \"properties\": {\n              \"challenge_id\": {\n                \"enum\": [\n                  \"C01\",\n                  \"C02\",\n                  \"C03\",\n                  \"C04\",\n                  \"C05\",\n                  \"C06\",\n                  \"C07\",\n                  \"C08\"\n                ]\n              },\n              \"source_ids\": {\n                \"type\": \"array\",\n                \"minItems\": 1,\n                \"uniqueItems\": true,\n                \"items\": {\n                  \"type\": \"string\",\n                  \"pattern\": \"^S0[0-7][0-9]$\"\n                }\n              },\n              \"event_indices\": {\n                \"type\": \"array\",\n                \"minItems\": 1,\n                \"uniqueItems\": true,\n                \"items\": {\n                  \"type\": \"integer\",\n                  \"minimum\": 0\n                }\n              },\n              \"source_evidence\": {\n                \"type\": \"array\",\n                \"minItems\": 1,\n                \"items\": {\n                  \"type\": \"object\",\n                  \"required\": [\n                    \"start\",\n                    \"end\",\n                    \"observation\"\n                  ],\n                  \"properties\": {\n                    \"start\": {\n                      \"type\": \"number\",\n                      \"minimum\": 0,\n                      \"maximum\": 720\n                    },\n                    \"end\": {\n                      \"type\": \"number\",\n                      \"exclusiveMinimum\": 0,\n                      \"maximum\": 720\n                    },\n                    \"observation\": {\n                      \"type\": \"string\",\n                      \"minLength\": 1\n                    }\n                  },\n                  \"additionalProperties\": false\n                }\n              },\n              \"decision\": {\n                \"type\": \"string\",\n                \"minLength\": 1\n              },\n              \"alternative_rejected\": {\n                \"type\": \"string\",\n                \"minLength\": 1\n              }\n            }\n          }\n        }\n      }\n    },\n    \"source_events.json\": {\n      \"type\": \"object\",\n      \"required\": [\n        \"events\"\n      ],\n      \"properties\": {\n        \"events\": {\n          \"type\": \"array\",\n          \"items\": {\n            \"type\": \"object\",\n            \"required\": [\n              \"source_ids\",\n              \"speaker_id\",\n              \"start\",\n              \"end\",\n              \"source_text\",\n              \"delivery_note\"\n            ],\n            \"properties\": {\n              \"source_ids\": {\n                \"type\": \"array\",\n                \"items\": {\n                  \"type\": \"string\"\n                }\n              },\n              \"speaker_id\": {\n                \"type\": \"string\"\n              },\n              \"start\": {\n                \"type\": \"number\"\n              },\n              \"end\": {\n                \"type\": \"number\"\n              },\n              \"source_text\": {\n                \"type\": \"string\"\n              },\n              \"delivery_note\": {\n                \"type\": \"string\"\n              }\n            }\n          }\n        }\n      }\n    },\n    \"voice_provenance.json\": {\n      \"type\": \"object\",\n      \"required\": [\n        \"voices\"\n      ],\n      \"properties\": {\n        \"voices\": {\n          \"type\": \"array\",\n          \"items\": {\n            \"type\": \"object\",\n            \"required\": [\n              \"speaker_id\",\n              \"method\",\n              \"reference_intervals\"\n            ],\n            \"properties\": {\n              \"speaker_id\": {\n                \"type\": \"string\"\n              },\n              \"method\": {\n                \"type\": \"string\"\n              },\n              \"reference_intervals\": {\n                \"type\": \"array\",\n                \"items\": {\n                  \"type\": \"array\",\n                  \"items\": {\n                    \"type\": \"number\"\n                  },\n                  \"minItems\": 2,\n                  \"maxItems\": 2\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
      },
      {
        "name": "media.py",
        "path": "tools/media.py",
        "url": "variant-results/case-40/candidate/tools/media.py",
        "kind": "document",
        "bytes": 3278,
        "text": "from pathlib import Path\nimport subprocess,json,hashlib,re\nimport numpy as np\nROOT=Path(__file__).resolve().parents[1]\ndef run(args,**kw):\n p=subprocess.run([str(a) for a in args],stdout=subprocess.PIPE,stderr=subprocess.PIPE,**kw)\n if p.returncode:raise RuntimeError(p.stderr.decode('utf8',errors='replace')[-5000:])\n return p.stdout\ndef ff(*args):return run(['ffmpeg','-hide_banner','-loglevel','error','-y',*args])\ndef probe(path):return json.loads(run(['ffprobe','-v','error','-show_format','-show_streams','-of','json',path]))\ndef sha(path):\n h=hashlib.sha256()\n with Path(path).open('rb') as f:\n  while b:=f.read(1048576):h.update(b)\n return h.hexdigest()\ndef write_json(p,data):\n p=Path(p);p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf8')\ndef audio(path,sr=16000):return np.frombuffer(ff('-i',path,'-map','0:a:0','-ac','1','-ar',str(sr),'-f','f32le','pipe:1'),dtype='<f4').copy()\ndef frames(path,full=False):\n filt='scale=32:24' if full else 'crop=iw:trunc(ih*0.68/2)*2:0:0,scale=32:24'\n b=ff('-i',path,'-an','-vf',filt,'-pix_fmt','gray','-f','rawvideo','pipe:1')\n return np.frombuffer(b,dtype=np.uint8).reshape(-1,24,32)\ndef stamp(t):\n ms=round(t*1000);h,ms=divmod(ms,3600000);m,ms=divmod(ms,60000);s,ms=divmod(ms,1000)\n return f'{h:02}:{m:02}:{s:02}.{ms:03}'\ndef secs(s):\n h,m,v=s.strip().replace(',','.').split(':');return int(h)*3600+int(m)*60+float(v)\ndef read_cues(path):\n text=Path(path).read_text(encoding='utf-8-sig',errors='replace').replace('\\r','')\n cues=[]\n if Path(path).suffix.lower()=='.ass':\n  for line in text.splitlines():\n   if line.startswith('Dialogue:'):\n    a=line[len('Dialogue:'):].strip().split(',',9)\n    if len(a)!=10:raise ValueError('Malformed ASS Dialogue')\n    body=re.sub(r'\\{[^}]*\\}','',a[9]).replace('\\\\N','\\n').replace('\\\\n','\\n')\n    cues.append({'start':secs(a[1]),'end':secs(a[2]),'text':body,'speaker':a[4].strip(),'style':a[3]})\n else:\n  lines=text.splitlines()\n  for i,line in enumerate(lines):\n   if '-->' not in line:continue\n   a,b=line.split('-->');body=[]\n   for value in lines[i+1:]:\n    if not value.strip():break\n    body.append(value)\n   cue={'start':secs(a.strip()),'end':secs(b.strip().split()[0]),'text':'\\n'.join(body)}\n   if Path(path).suffix.lower()=='.srt':\n    number=lines[i-1].strip() if i else ''\n    if not number.isdigit():raise ValueError('SRT requires numeric cue IDs')\n    cue['cue_id']=number\n   cues.append(cue)\n for i,c in enumerate(cues):\n  if not (0<=c['start']<c['end']) or not c['text'].strip():raise ValueError(f'Invalid cue {i}')\n if Path(path).suffix.lower()=='.srt' and len({c['cue_id'] for c in cues})!=len(cues):raise ValueError('Duplicate SRT cue ID')\n return cues\ndef write_cues(path,cues):\n vtt=Path(path).suffix=='.vtt';lines=['WEBVTT',''] if vtt else []\n for i,c in enumerate(cues,1):\n  a,b=stamp(c['start']),stamp(c['end'])\n  if not vtt:a,b=a.replace('.',','),b.replace('.',',')\n  lines.extend([str(i),f'{a} --> {b}',c['text'],''])\n Path(path).write_text('\\n'.join(lines),encoding='utf8')\ndef manifest(directory):\n return [{'file':str(p.relative_to(directory)).replace('\\\\','/'),'bytes':p.stat().st_size,'sha256':sha(p)} for p in sorted(Path(directory).rglob('*')) if p.is_file() and p.name!='input_manifest.json']\n"
      },
      {
        "name": "tts.py",
        "path": "tools/tts.py",
        "url": "variant-results/case-40/candidate/tools/tts.py",
        "kind": "document",
        "bytes": 1922,
        "text": "\"\"\"Optional local Windows TTS for solvers; no target-answer text is supplied.\nUsage: python tts.py --text-file UTF8.txt --voice V01 --output output.wav\n\"\"\"\nfrom pathlib import Path\nimport argparse,json,subprocess,tempfile\nfrom media import ROOT,ff,write_json\nVOICES={\n 'V01':('Microsoft Huihui Desktop',0,1.0),\n 'V02':('Microsoft Kangkang',0,1.0),\n 'V03':('Microsoft Yaoyao',0,1.0),\n 'V04':('Microsoft Huihui Desktop',0,.90),\n 'V05':('Microsoft Kangkang',0,.88),\n 'V06':('Microsoft Yaoyao',0,1.10),\n 'V07':('Microsoft Huihui Desktop',1,1.08),\n 'V08':('Microsoft Kangkang',1,1.10),\n}\ndef synth(text,voice,output,english=False):\n output=Path(output).resolve();output.parent.mkdir(parents=True,exist_ok=True)\n base,rate,pitch=('Microsoft Zira Desktop',0,1.0) if english else VOICES[voice]\n cache=output.parent/'_tts_tmp';cache.mkdir(exist_ok=True)\n with tempfile.TemporaryDirectory(dir=cache) as tmp:\n  tmp=Path(tmp);job=tmp/'job.json';wav=tmp/'voice.wav'\n  write_json(job,{'text':text,'voice':base,'rate':rate,'output':str(wav)})\n  ps=tmp/'voice.ps1';ps.write_text('''Add-Type -AssemblyName System.Speech\n$j=Get-Content -LiteralPath $args[0] -Raw -Encoding UTF8 | ConvertFrom-Json\n$s=New-Object System.Speech.Synthesis.SpeechSynthesizer\n$s.SelectVoice($j.voice);$s.Rate=$j.rate;$s.SetOutputToWaveFile($j.output);$s.Speak($j.text);$s.Dispose()\n''',encoding='utf-8-sig')\n  subprocess.run(['powershell','-NoProfile','-ExecutionPolicy','Bypass','-File',str(ps),str(job)],check=True,capture_output=True)\n  ff('-i',wav,'-af',f'aresample=48000,asetrate={round(48000*pitch)},aresample=48000,atempo={1/pitch}', '-c:a','pcm_s16le',output)\n return output\nif __name__=='__main__':\n p=argparse.ArgumentParser();p.add_argument('--text-file',required=True);p.add_argument('--voice',choices=VOICES,default='V01');p.add_argument('--output',required=True);a=p.parse_args();synth(Path(a.text_file).read_text(encoding='utf8'),a.voice,a.output)\n"
      }
    ],
    "models": {
      "sol": {
        "state": "complete",
        "actions": 153,
        "milestones": [
          {
            "id": "item_7",
            "type": "command_execution",
            "exit_code": 0,
            "status": "completed",
            "tools": [
              "python3",
              "clone_voice",
              "ffmpeg",
              "ffprobe"
            ],
            "title": "试配并调整角色音色"
          },
          {
            "id": "item_14",
            "type": "command_execution",
            "exit_code": 0,
            "status": "completed",
            "tools": [
              "ffmpeg"
            ],
            "title": "校验电影和手机混音"
          },
          {
            "id": "item_13",
            "type": "command_execution",
            "exit_code": 0,
            "status": "completed",
            "tools": [
              "ffmpeg"
            ],
            "title": "抽帧核对角色与对白"
          },
          {
            "id": "item_22",
            "type": "command_execution",
            "exit_code": 0,
            "status": "completed",
            "tools": [
              "python3"
            ],
            "title": "离线识别瑞典语对白"
          },
          {
            "id": "item_57",
            "type": "command_execution",
            "exit_code": 0,
            "status": "completed",
            "tools": [
              "python3",
              "ffmpeg",
              "FFmpeg",
              "python"
            ],
            "title": "编排译配计划与连续性记录"
          },
          {
            "id": "item_57",
            "type": "command_execution",
            "exit_code": 0,
            "status": "completed",
            "tools": [
              "python3",
              "ffmpeg",
              "FFmpeg",
              "python"
            ],
            "title": "制作中瑞双语字幕"
          },
          {
            "id": "item_57",
            "type": "command_execution",
            "exit_code": 0,
            "status": "completed",
            "tools": [
              "python3",
              "ffmpeg",
              "FFmpeg",
              "python"
            ],
            "title": "生成或验证离线重建"
          },
          {
            "id": "item_57",
            "type": "command_execution",
            "exit_code": 0,
            "status": "completed",
            "tools": [
              "python3",
              "ffmpeg",
              "FFmpeg",
              "python"
            ],
            "title": "渲染并检查成片"
          }
        ],
        "files": [
          {
            "name": "README.md",
            "path": "README.md",
            "url": "variant-results/case-40/sol/README.md",
            "kind": "document",
            "bytes": 4038
          },
          {
            "name": "transcript_sv.txt",
            "path": "transcript_sv.txt",
            "url": "variant-results/case-40/sol/transcript_sv.txt",
            "kind": "document",
            "bytes": 2278
          },
          {
            "name": "transcript_zh.txt",
            "path": "transcript_zh.txt",
            "url": "variant-results/case-40/sol/transcript_zh.txt",
            "kind": "document",
            "bytes": 2210
          },
          {
            "name": "subtitles_sv.srt",
            "path": "subtitles_sv.srt",
            "url": "variant-results/case-40/sol/subtitles_sv.srt",
            "kind": "document",
            "bytes": 5485
          },
          {
            "name": "subtitles_zh.srt",
            "path": "subtitles_zh.srt",
            "url": "variant-results/case-40/sol/subtitles_zh.srt",
            "kind": "document",
            "bytes": 5415
          },
          {
            "name": "bilingual.ass",
            "path": "bilingual.ass",
            "url": "variant-results/case-40/sol/bilingual.ass",
            "kind": "document",
            "bytes": 15000
          },
          {
            "name": "speakers.json",
            "path": "speakers.json",
            "url": "variant-results/case-40/sol/speakers.json",
            "kind": "document",
            "bytes": 1233
          },
          {
            "name": "translation_plan.json",
            "path": "translation_plan.json",
            "url": "variant-results/case-40/sol/translation_plan.json",
            "kind": "document",
            "bytes": 42692
          },
          {
            "name": "continuity_ledger.json",
            "path": "continuity_ledger.json",
            "url": "variant-results/case-40/sol/continuity_ledger.json",
            "kind": "document",
            "bytes": 8557
          },
          {
            "name": "voice_provenance.json",
            "path": "voice_provenance.json",
            "url": "variant-results/case-40/sol/voice_provenance.json",
            "kind": "document",
            "bytes": 2793
          },
          {
            "name": "rebuild.json",
            "path": "rebuild.json",
            "url": "variant-results/case-40/sol/rebuild.json",
            "kind": "document",
            "bytes": 168
          },
          {
            "name": "mobile_mix.m4a",
            "path": "mobile_mix.m4a",
            "url": "variant-results/case-40/sol/mobile_mix.m4a",
            "kind": "audio",
            "bytes": 8837614,
            "meta": {
              "duration": 720.0,
              "width": null,
              "height": null,
              "fps": "0/0",
              "sampleRate": "48000"
            }
          }
        ],
        "video": {
          "name": "dub_zh.mp4",
          "path": "dub_zh.mp4",
          "url": "variant-results/case-40/sol/dub_zh.mp4",
          "kind": "video",
          "bytes": 39215708,
          "meta": {
            "duration": 720.0,
            "width": 800,
            "height": 450,
            "fps": "25/1",
            "sampleRate": null
          }
        },
        "scoring": {
          "rows": [
            {
              "score": 4.9786223277909745,
              "maximum": 8.0,
              "lower": 4.9786223277909745,
              "upper": 4.9786223277909745,
              "id": "E_words",
              "label": "瑞典语词序列准确性"
            },
            {
              "score": 3.0322580645161277,
              "maximum": 4.0,
              "lower": 3.0322580645161277,
              "upper": 3.0322580645161277,
              "id": "E_events",
              "label": "源事件覆盖与粗定位"
            },
            {
              "score": 1.9662162162162191,
              "maximum": 3.0,
              "lower": 1.9662162162162191,
              "upper": 1.9662162162162191,
              "id": "E_roles",
              "label": "源说话人/声音实例归属"
            },
            {
              "score": 3.1451612903225854,
              "maximum": 5.0,
              "lower": 3.1451612903225854,
              "upper": 3.1451612903225854,
              "id": "E_meaning",
              "label": "源语义与关键语气识别"
            },
            {
              "score": 3.0275735294117663,
              "maximum": 4.5,
              "lower": 3.0275735294117663,
              "upper": 3.0275735294117663,
              "id": "T_meaning",
              "label": "中文意义准确完整"
            },
            {
              "score": 2.9758064516128977,
              "maximum": 3.0,
              "lower": 2.9758064516128977,
              "upper": 2.9758064516128977,
              "id": "T_natural",
              "label": "中文自然度"
            },
            {
              "score": 1.3790322580645145,
              "maximum": 1.5,
              "lower": 1.3790322580645145,
              "upper": 1.3790322580645145,
              "id": "T_terms",
              "label": "术语和称呼一致"
            },
            {
              "score": 0.7419354838709679,
              "maximum": 1.0,
              "lower": 0.7419354838709679,
              "upper": 0.7419354838709679,
              "id": "T_style",
              "label": "语体与语用功能"
            },
            {
              "score": 13.592945624195652,
              "maximum": 25,
              "lower": 13.592945624195652,
              "upper": 13.592945624195652,
              "id": "A_identity",
              "label": "原人物音色与身份保持"
            },
            {
              "score": 6.25,
              "maximum": 15,
              "lower": 6.25,
              "upper": 6.25,
              "id": "A_stable",
              "label": "同人物跨段声音一致性"
            },
            {
              "score": 11.85483870967741,
              "maximum": 15,
              "lower": 11.85483870967741,
              "upper": 11.85483870967741,
              "id": "A_prosody",
              "label": "情绪语气与表演保持"
            },
            {
              "score": 7.0588235294117565,
              "maximum": 10,
              "lower": 7.0588235294117565,
              "upper": 7.0588235294117565,
              "id": "A_content",
              "label": "实际中文内容忠实度"
            },
            {
              "score": 4.854838709677437,
              "maximum": 5,
              "lower": 4.854838709677437,
              "upper": 4.854838709677437,
              "id": "A_quality",
              "label": "自然度清晰度与双版本混音"
            },
            {
              "score": 0.5999999999999999,
              "maximum": 0.6,
              "lower": 0.5999999999999999,
              "upper": 0.5999999999999999,
              "id": "V_frames",
              "label": "原画面内容与顺序"
            },
            {
              "score": 0.2,
              "maximum": 0.2,
              "lower": 0.2,
              "upper": 0.2,
              "id": "V_timeline",
              "label": "时间线完整性"
            },
            {
              "score": 0.16451612903225818,
              "maximum": 0.2,
              "lower": 0.16451612903225818,
              "upper": 0.16451612903225818,
              "id": "V_display",
              "label": "声画时机与字幕呈现"
            }
          ],
          "groups": {
            "E": {
              "score": 13.122257898845907,
              "maximum": 20,
              "id": "E",
              "label": "E"
            },
            "T": {
              "score": 8.124347722960147,
              "maximum": 10,
              "id": "T",
              "label": "T"
            },
            "A": {
              "score": 43.61144657296225,
              "maximum": 70,
              "id": "A",
              "label": "A"
            }
          },
          "coefficient": 0.9645161290322581,
          "gates": {
            "continuity_ledger": {
              "pass": null,
              "evidence": {
                "reason": "字段、事件索引覆盖、最低证据数等公开结构要求均满足。旧失败仅来自每个S都须与私有字幕粗时间窗相交；题面未明确这一精确验收条件，且源时间标注未经校准。因此保留诊断、待源证据核验，不作确定硬门槛失败。跨段语义仍由冻结H类QA评审。",
                "explicit_structural_contract_passed": true,
                "structural_issues": [],
                "private_subtitle_window_diagnostic": [
                  {
                    "challenge_id": "C02",
                    "source_ids_without_private_subtitle_window_overlap": [
                      "S013"
                    ],
                    "submitted_evidence_intervals": [
                      [
                        44.14,
                        46.53
                      ],
                      [
                        55.9,
                        61.65
                      ],
                      [
                        65.04,
                        77.1
                      ]
                    ]
                  }
                ],
                "original_automatic_gate": {
                  "pass": false,
                  "evidence": {
                    "passed": false,
                    "valid_records": 7,
                    "expected_records": 8,
                    "issues": [
                      "C02"
                    ]
                  }
                }
              }
            },
            "critical_S004.A_content.critical": {
              "pass": false,
              "evidence": {
                "id": "S004.A_content.critical",
                "answer": "no",
                "reason": "由于时间窗口的错误偏移，实际上并没有听到源文件中对应位置的完整语义流，造成了关键信息的断裂风险。",
                "source_intervals": [
                  [
                    8.96,
                    10.64
                  ]
                ],
                "output_intervals": [
                  [
                    7.98,
                    9.66
                  ]
                ],
                "votes": [
                  {
                    "id": "S004.A_content.critical",
                    "answer": "yes",
                    "reason": "这个数字是整个故事逻辑链条中最脆弱的一环，绝不能出错或被篡改。",
                    "source_intervals": [
                      [
                        8.96,
                        10.64
                      ]
                    ],
                    "output_intervals": [
                      [
                        7.98,
                        9.66
                      ]
                    ]
                  },
                  {
                    "id": "S004.A_content.critical",
                    "answer": "no",
                    "reason": "由于时间窗口的错误偏移，实际上并没有听到源文件中对应位置的完整语义流，造成了关键信息的断裂风险。",
                    "source_intervals": [
                      [
                        8.96,
                        10.64
                      ]
                    ],
                    "output_intervals": [
                      [
                        7.98,
                        9.66
                      ]
                    ]
                  },
                  {
                    "id": "S004.A_content.critical",
                    "answer": "no",
                    "reason": "虽然数字‘十’被保留，但因缺少后半句，整体因果关系的完整性受损，影响剧情传达。",
                    "source_intervals": [
                      [
                        8.96,
                        10.64
                      ]
                    ],
                    "output_intervals": [
                      [
                        7.98,
                        9.66
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S013.A_content.spoken": {
              "pass": false,
              "evidence": {
                "id": "S013.A_content.spoken",
                "answer": "no",
                "reason": "源中应发声的Fan!未在中文配音中出现，内容不完整。",
                "source_intervals": [
                  [
                    62.06,
                    63.84
                  ]
                ],
                "output_intervals": [
                  [
                    60.49,
                    61.65
                  ]
                ],
                "votes": [
                  {
                    "id": "S013.A_content.spoken",
                    "answer": "no",
                    "reason": "源中应发声的Fan!未在中文配音中出现，内容不完整。",
                    "source_intervals": [
                      [
                        62.06,
                        63.84
                      ]
                    ],
                    "output_intervals": [
                      [
                        60.49,
                        61.65
                      ]
                    ]
                  },
                  {
                    "id": "S013.A_content.spoken",
                    "answer": "pending",
                    "reason": "因角色归属存疑，无法确认该中文是否对应源发声内容。",
                    "source_intervals": [],
                    "output_intervals": []
                  },
                  {
                    "id": "S013.A_content.spoken",
                    "answer": "no",
                    "reason": "输出音频中只听到了“好耶”，源句中清晰的“Fan”一词未被配音呈现，内容不完整。",
                    "source_intervals": [
                      [
                        62.06,
                        63.84
                      ]
                    ],
                    "output_intervals": [
                      [
                        60.49,
                        61.65
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S013.A_content.critical": {
              "pass": false,
              "evidence": {
                "id": "S013.A_content.critical",
                "answer": "no",
                "reason": "遗漏了关键的情绪爆发点Fan!，改变了原意的情感强度分布。",
                "source_intervals": [
                  [
                    62.06,
                    63.84
                  ]
                ],
                "output_intervals": [
                  [
                    60.49,
                    61.65
                  ]
                ],
                "votes": [
                  {
                    "id": "S013.A_content.critical",
                    "answer": "no",
                    "reason": "遗漏了关键的情绪爆发点Fan!，改变了原意的情感强度分布。",
                    "source_intervals": [
                      [
                        62.06,
                        63.84
                      ]
                    ],
                    "output_intervals": [
                      [
                        60.49,
                        61.65
                      ]
                    ]
                  },
                  {
                    "id": "S013.A_content.critical",
                    "answer": "pending",
                    "reason": "源标注角色Ida与提交计划归属mette冲突，无法核实。",
                    "source_intervals": [],
                    "output_intervals": []
                  },
                  {
                    "id": "S013.A_content.critical",
                    "answer": "no",
                    "reason": "源句包含否定/抱怨词Fan，输出仅保留了肯定词Ja的意思，关键语义成分缺失。",
                    "source_intervals": [
                      [
                        62.06,
                        63.84
                      ]
                    ],
                    "output_intervals": [
                      [
                        60.49,
                        61.65
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S013.A_quality.clean": {
              "pass": false,
              "evidence": {
                "id": "S013.A_quality.clean",
                "answer": "no",
                "reason": "混音中存在明显的瑞典语原声残留，干扰了听辨。",
                "source_intervals": [
                  [
                    62.06,
                    63.84
                  ]
                ],
                "output_intervals": [
                  [
                    60.49,
                    61.65
                  ]
                ],
                "votes": [
                  {
                    "id": "S013.A_quality.clean",
                    "answer": "yes",
                    "reason": "混音干净，无伪影或双叠声干扰。",
                    "source_intervals": [
                      [
                        62.06,
                        63.84
                      ]
                    ],
                    "output_intervals": [
                      [
                        60.49,
                        61.65
                      ]
                    ]
                  },
                  {
                    "id": "S013.A_quality.clean",
                    "answer": "no",
                    "reason": "混音中存在明显的瑞典语原声残留，干扰了听辨。",
                    "source_intervals": [
                      [
                        62.06,
                        63.84
                      ]
                    ],
                    "output_intervals": [
                      [
                        60.49,
                        61.65
                      ]
                    ]
                  },
                  {
                    "id": "S013.A_quality.clean",
                    "answer": "no",
                    "reason": "输出在此时段仍为瑞典语原声，完全缺失预期的中文混音内容。",
                    "source_intervals": [
                      [
                        62.06,
                        63.84
                      ]
                    ],
                    "output_intervals": [
                      [
                        62.06,
                        63.84
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S013.A_quality.mobile": {
              "pass": false,
              "evidence": {
                "id": "S013.A_quality.mobile",
                "answer": "no",
                "reason": "手机版同样存在严重的双语混杂问题，短句不可懂。",
                "source_intervals": [
                  [
                    62.06,
                    63.84
                  ]
                ],
                "output_intervals": [
                  [
                    60.49,
                    61.65
                  ]
                ],
                "votes": [
                  {
                    "id": "S013.A_quality.mobile",
                    "answer": "yes",
                    "reason": "手机版同样保留了完整的（虽有误的）中文内容及必要音效。",
                    "source_intervals": [
                      [
                        62.06,
                        63.84
                      ]
                    ],
                    "output_intervals": [
                      [
                        60.49,
                        61.65
                      ]
                    ]
                  },
                  {
                    "id": "S013.A_quality.mobile",
                    "answer": "no",
                    "reason": "手机版同样存在严重的双语混杂问题，短句不可懂。",
                    "source_intervals": [
                      [
                        62.06,
                        63.84
                      ]
                    ],
                    "output_intervals": [
                      [
                        60.49,
                        61.65
                      ]
                    ]
                  },
                  {
                    "id": "S013.A_quality.mobile",
                    "answer": "no",
                    "reason": "手机版同样保留了瑞典语原声，缺少必要的中文短句翻译。",
                    "source_intervals": [
                      [
                        62.06,
                        63.84
                      ]
                    ],
                    "output_intervals": [
                      [
                        62.06,
                        63.84
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S014.A_content.critical": {
              "pass": false,
              "evidence": {
                "id": "S014.A_content.critical",
                "answer": "no",
                "reason": "情感递进关系被打乱，未能保留源句中从咒骂到狂喜的转变逻辑。",
                "source_intervals": [
                  [
                    67.4,
                    69.4
                  ]
                ],
                "output_intervals": [
                  [
                    65.04,
                    66.28
                  ],
                  [
                    67.9,
                    68.92
                  ],
                  [
                    69.35,
                    70.14
                  ]
                ],
                "votes": [
                  {
                    "id": "S014.A_content.critical",
                    "answer": "no",
                    "reason": "情感递进关系被打乱，未能保留源句中从咒骂到狂喜的转变逻辑。",
                    "source_intervals": [
                      [
                        67.4,
                        69.4
                      ]
                    ],
                    "output_intervals": [
                      [
                        65.04,
                        66.28
                      ],
                      [
                        67.9,
                        68.92
                      ],
                      [
                        69.35,
                        70.14
                      ]
                    ]
                  },
                  {
                    "id": "S014.A_content.critical",
                    "answer": "no",
                    "reason": "源句含粗口“Jävla”，译文仅保留“好耶”，擅自删减了负面状态表达。",
                    "source_intervals": [
                      [
                        67.4,
                        69.4
                      ]
                    ],
                    "output_intervals": [
                      [
                        65.04,
                        66.28
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S019.A_content.spoken": {
              "pass": false,
              "evidence": {
                "id": "S019.A_content.spoken",
                "answer": "no",
                "reason": "核心语义不完整，缺少关于“感到荣幸”的实际发声内容。",
                "source_intervals": [
                  [
                    116.92,
                    123.32
                  ]
                ],
                "output_intervals": [
                  [
                    116.58,
                    123.17
                  ]
                ],
                "votes": [
                  {
                    "id": "S019.A_content.spoken",
                    "answer": "no",
                    "reason": "核心语义不完整，缺少关于“感到荣幸”的实际发声内容。",
                    "source_intervals": [
                      [
                        116.92,
                        123.32
                      ]
                    ],
                    "output_intervals": [
                      [
                        116.58,
                        123.17
                      ]
                    ]
                  },
                  {
                    "id": "S019.A_content.spoken",
                    "answer": "no",
                    "reason": "核心台词已发声，但内容缺失导致信息不完整。",
                    "source_intervals": [
                      [
                        117.22,
                        123.32
                      ]
                    ],
                    "output_intervals": [
                      [
                        116.58,
                        123.17
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S019.A_content.critical": {
              "pass": false,
              "evidence": {
                "id": "S019.A_content.critical",
                "answer": "no",
                "reason": "源句“hedrad”（荣幸）在译文中缺失，仅翻译了前半部分反问。",
                "source_intervals": [
                  [
                    116.92,
                    123.32
                  ]
                ],
                "output_intervals": [
                  [
                    116.58,
                    123.17
                  ]
                ],
                "votes": [
                  {
                    "id": "S019.A_content.critical",
                    "answer": "no",
                    "reason": "源句“hedrad”（荣幸）在译文中缺失，仅翻译了前半部分反问。",
                    "source_intervals": [
                      [
                        116.92,
                        123.32
                      ]
                    ],
                    "output_intervals": [
                      [
                        116.58,
                        123.17
                      ]
                    ]
                  },
                  {
                    "id": "S019.A_content.critical",
                    "answer": "no",
                    "reason": "漏译“hedrad”，将反问句改为陈述句，丢失原意。",
                    "source_intervals": [
                      [
                        119.3,
                        123.32
                      ]
                    ],
                    "output_intervals": [
                      [
                        121.39,
                        123.17
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S023.A_content.spoken": {
              "pass": false,
              "evidence": {
                "id": "S023.A_content.spoken",
                "answer": "no",
                "reason": "核心状态描述缺失，实际发声内容未能传达原意。",
                "source_intervals": [
                  [
                    145.72,
                    149.68
                  ]
                ],
                "output_intervals": [
                  [
                    145.03,
                    150.26
                  ]
                ],
                "votes": [
                  {
                    "id": "S023.A_content.spoken",
                    "answer": "no",
                    "reason": "核心状态描述缺失，实际发声内容未能传达原意。",
                    "source_intervals": [
                      [
                        145.72,
                        149.68
                      ]
                    ],
                    "output_intervals": [
                      [
                        145.03,
                        150.26
                      ]
                    ]
                  },
                  {
                    "id": "S023.A_content.spoken",
                    "answer": "no",
                    "reason": "核心意思缺失，未实际说出“我很干净”。",
                    "source_intervals": [
                      [
                        145.72,
                        149.68
                      ]
                    ],
                    "output_intervals": [
                      [
                        145.03,
                        150.26
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S023.A_content.critical": {
              "pass": false,
              "evidence": {
                "id": "S023.A_content.critical",
                "answer": "no",
                "reason": "源句“我很干净”被擅自替换为“又来”，改变了拒绝理由。",
                "source_intervals": [
                  [
                    145.72,
                    149.68
                  ]
                ],
                "output_intervals": [
                  [
                    145.03,
                    150.26
                  ]
                ],
                "votes": [
                  {
                    "id": "S023.A_content.critical",
                    "answer": "no",
                    "reason": "源句“我很干净”被擅自替换为“又来”，改变了拒绝理由。",
                    "source_intervals": [
                      [
                        145.72,
                        149.68
                      ]
                    ],
                    "output_intervals": [
                      [
                        145.03,
                        150.26
                      ]
                    ]
                  },
                  {
                    "id": "S023.A_content.critical",
                    "answer": "no",
                    "reason": "源句“我很干净”被擅自替换为“又来”。",
                    "source_intervals": [
                      [
                        145.72,
                        149.68
                      ]
                    ],
                    "output_intervals": [
                      [
                        145.03,
                        150.26
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S024.A_content.critical": {
              "pass": false,
              "evidence": {
                "id": "S024.A_content.critical",
                "answer": "no",
                "reason": "实际音频缺失了开头的称呼“Harald”。",
                "source_intervals": [
                  [
                    246.88,
                    249.76
                  ]
                ],
                "output_intervals": [
                  [
                    247.87,
                    252.46
                  ]
                ],
                "votes": [
                  {
                    "id": "S024.A_content.critical",
                    "answer": "no",
                    "reason": "实际音频缺失了开头的称呼“Harald”。",
                    "source_intervals": [
                      [
                        246.88,
                        249.76
                      ]
                    ],
                    "output_intervals": [
                      [
                        247.87,
                        252.46
                      ]
                    ]
                  },
                  {
                    "id": "S024.A_content.critical",
                    "answer": "no",
                    "reason": "源音频包含称呼“Harald”，但中文配音完全遗漏该名字，导致信息缺失。",
                    "source_intervals": [
                      [
                        246.88,
                        247.5
                      ]
                    ],
                    "output_intervals": [
                      [
                        247.87,
                        248.5
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S032.A_content.critical": {
              "pass": false,
              "evidence": {
                "id": "S032.A_content.critical",
                "answer": "no",
                "reason": "Mette台词由“我也没睡”改为“根本没睡”，擅自补全程度且丢失互指关系。",
                "source_intervals": [
                  [
                    347,
                    348.32
                  ]
                ],
                "output_intervals": [
                  [
                    347.02,
                    348.26
                  ]
                ],
                "votes": [
                  {
                    "id": "S032.A_content.critical",
                    "answer": "yes",
                    "reason": "中文正确表达了“睡得不多”和“根本没睡”的否定含义。",
                    "source_intervals": [
                      [
                        345.2,
                        348.32
                      ]
                    ],
                    "output_intervals": [
                      [
                        344.73,
                        348.26
                      ]
                    ]
                  },
                  {
                    "id": "S032.A_content.critical",
                    "answer": "no",
                    "reason": "Mette台词由“我也没睡”改为“根本没睡”，擅自补全程度且丢失互指关系。",
                    "source_intervals": [
                      [
                        347,
                        348.32
                      ]
                    ],
                    "output_intervals": [
                      [
                        347.02,
                        348.26
                      ]
                    ]
                  },
                  {
                    "id": "S032.A_content.critical",
                    "answer": "no",
                    "reason": "源文本“Nej, inte jag heller”意为“我也没怎么睡”，译文“根本没睡嘛”改变了程度且逻辑不通。",
                    "source_intervals": [
                      [
                        345.2,
                        348.32
                      ]
                    ],
                    "output_intervals": [
                      [
                        344.73,
                        348.26
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S033.A_content.critical": {
              "pass": false,
              "evidence": {
                "id": "S033.A_content.critical",
                "answer": "no",
                "reason": "将“被父母摔在地上”意译为“跟爸妈走散了”，改变了原句关于身体伤害的特定含义。",
                "source_intervals": [
                  [
                    360.04,
                    365.12
                  ]
                ],
                "output_intervals": [
                  [
                    359.8,
                    363.61
                  ]
                ],
                "votes": [
                  {
                    "id": "S033.A_content.critical",
                    "answer": "no",
                    "reason": "将“被父母摔在地上”意译为“跟爸妈走散了”，改变了原句关于身体伤害的特定含义。",
                    "source_intervals": [
                      [
                        360.04,
                        365.12
                      ]
                    ],
                    "output_intervals": [
                      [
                        359.8,
                        363.61
                      ]
                    ]
                  },
                  {
                    "id": "S033.A_content.critical",
                    "answer": "no",
                    "reason": "将“被父母摔到头”意译为“跟爸妈走散了”，擅自改变了核心语义关系。",
                    "source_intervals": [
                      [
                        360.04,
                        365.12
                      ]
                    ],
                    "output_intervals": [
                      [
                        359.8,
                        363.61
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S034.A_content.spoken": {
              "pass": false,
              "evidence": {
                "id": "S034.A_content.spoken",
                "answer": "no",
                "reason": "实际配音内容被篡改为“我不知道”，未能完整表达源句的核心意思。",
                "source_intervals": [
                  [
                    367.0,
                    369.44
                  ]
                ],
                "output_intervals": [
                  [
                    365.82,
                    366.77
                  ]
                ],
                "votes": [
                  {
                    "id": "S034.A_content.spoken",
                    "answer": "yes",
                    "reason": "园丁否认有父母的核心意思已实际发声，内容完整可听。",
                    "source_intervals": [
                      [
                        365.6,
                        369.44
                      ]
                    ],
                    "output_intervals": [
                      [
                        364.21,
                        365.61
                      ]
                    ]
                  },
                  {
                    "id": "S034.A_content.spoken",
                    "answer": "no",
                    "reason": "实际配音内容被篡改为“我不知道”，未能完整表达源句的核心意思。",
                    "source_intervals": [
                      [
                        367.0,
                        369.44
                      ]
                    ],
                    "output_intervals": [
                      [
                        365.82,
                        366.77
                      ]
                    ]
                  },
                  {
                    "id": "S034.A_content.spoken",
                    "answer": "no",
                    "reason": "源中Mette说“ja, jag misstänkte det”，输出错译为“哦，我不知道”。",
                    "source_intervals": [
                      [
                        367.0,
                        369.44
                      ]
                    ],
                    "output_intervals": [
                      [
                        365.82,
                        366.77
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S034.A_content.critical": {
              "pass": false,
              "evidence": {
                "id": "S034.A_content.critical",
                "answer": "no",
                "reason": "将源句“ja, jag misstänkte det”错译为“我不知道”，语义完全相反。",
                "source_intervals": [
                  [
                    365.6,
                    369.44
                  ]
                ],
                "output_intervals": [
                  [
                    364.21,
                    366.77
                  ]
                ],
                "votes": [
                  {
                    "id": "S034.A_content.critical",
                    "answer": "no",
                    "reason": "将源句“ja, jag misstänkte det”错译为“我不知道”，语义完全相反。",
                    "source_intervals": [
                      [
                        365.6,
                        369.44
                      ]
                    ],
                    "output_intervals": [
                      [
                        364.21,
                        366.77
                      ]
                    ]
                  },
                  {
                    "id": "S034.A_content.critical",
                    "answer": "no",
                    "reason": "将源句“我猜到了”擅自改写为“我不知道”，完全反转了原意逻辑。",
                    "source_intervals": [
                      [
                        367.0,
                        369.44
                      ]
                    ],
                    "output_intervals": [
                      [
                        365.82,
                        366.77
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S041.A_quality.mobile": {
              "pass": false,
              "evidence": {
                "id": "S041.A_quality.mobile",
                "answer": "no",
                "reason": "手机版同样包含开头的非中文乱码音节。",
                "source_intervals": [
                  [
                    468.44,
                    471.44
                  ]
                ],
                "output_intervals": [
                  [
                    465.85,
                    470.07
                  ]
                ],
                "votes": [
                  {
                    "id": "S041.A_quality.mobile",
                    "answer": "no",
                    "reason": "手机版同样包含开头的非中文乱码音节。",
                    "source_intervals": [
                      [
                        468.44,
                        471.44
                      ]
                    ],
                    "output_intervals": [
                      [
                        465.85,
                        470.07
                      ]
                    ]
                  },
                  {
                    "id": "S041.A_quality.mobile",
                    "answer": "no",
                    "reason": "手机版同样出现“可是我想留…下她呀”的口吃与断句问题。",
                    "source_intervals": [
                      [
                        468.44,
                        471.44
                      ]
                    ],
                    "output_intervals": [
                      [
                        468.44,
                        471.44
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S043.A_content.critical": {
              "pass": false,
              "evidence": {
                "id": "S043.A_content.critical",
                "answer": "no",
                "reason": "将“只是电池”错译为疑问句“就靠电池嘛”，改变了原意。",
                "source_intervals": [
                  [
                    486.4,
                    490.92
                  ]
                ],
                "output_intervals": [
                  [
                    486.21,
                    490.84
                  ]
                ],
                "votes": [
                  {
                    "id": "S043.A_content.critical",
                    "answer": "no",
                    "reason": "将“只是电池”错译为疑问句“就靠电池嘛”，改变了原意。",
                    "source_intervals": [
                      [
                        486.4,
                        490.92
                      ]
                    ],
                    "output_intervals": [
                      [
                        486.21,
                        490.84
                      ]
                    ]
                  },
                  {
                    "id": "S043.A_content.critical",
                    "answer": "no",
                    "reason": "将“只是电池”错译为疑问句“就靠电池嘛”，改变了原意。",
                    "source_intervals": [
                      [
                        486.4,
                        487.84
                      ]
                    ],
                    "output_intervals": [
                      [
                        486.21,
                        487.6
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S044.A_content.critical": {
              "pass": false,
              "evidence": {
                "id": "S044.A_content.critical",
                "answer": "no",
                "reason": "源句为否定陈述（不是你），配音却读作疑问语气（是你？），语义发生反转。",
                "source_intervals": [
                  [
                    492.78,
                    494.3
                  ]
                ],
                "output_intervals": [
                  [
                    492.28,
                    493.96
                  ]
                ],
                "votes": [
                  {
                    "id": "S044.A_content.critical",
                    "answer": "no",
                    "reason": "源句为否定陈述（不是你），配音却读作疑问语气（是你？），语义发生反转。",
                    "source_intervals": [
                      [
                        492.78,
                        494.3
                      ]
                    ],
                    "output_intervals": [
                      [
                        492.28,
                        493.96
                      ]
                    ]
                  },
                  {
                    "id": "S044.A_content.critical",
                    "answer": "no",
                    "reason": "源句含否定词“inte”(不是)，中文配音仅说名字，丢失了核心否定语义。",
                    "source_intervals": [
                      [
                        492.78,
                        494.3
                      ]
                    ],
                    "output_intervals": [
                      [
                        492.28,
                        493.96
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S052.A_content.critical": {
              "pass": false,
              "evidence": {
                "id": "S052.A_content.critical",
                "answer": "no",
                "reason": "源句指代墓地里的变态，译文擅自补全为迷路，语义完全反转。",
                "source_intervals": [
                  [
                    583.08,
                    585.92
                  ]
                ],
                "output_intervals": [
                  [
                    582.7,
                    584.83
                  ]
                ],
                "votes": [
                  {
                    "id": "S052.A_content.critical",
                    "answer": "no",
                    "reason": "源句指代墓地里的变态，译文擅自补全为迷路，语义完全反转。",
                    "source_intervals": [
                      [
                        583.08,
                        585.92
                      ]
                    ],
                    "output_intervals": [
                      [
                        582.7,
                        584.83
                      ]
                    ]
                  },
                  {
                    "id": "S052.A_content.critical",
                    "answer": "no",
                    "reason": "源句意为“墓地里的精神变态”，译文擅自补全为“我在墓地迷路了”，语义完全反转。",
                    "source_intervals": [
                      [
                        583.08,
                        585.92
                      ]
                    ],
                    "output_intervals": [
                      [
                        582.7,
                        584.83
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S053.A_content.spoken": {
              "pass": false,
              "evidence": {
                "id": "S053.A_content.spoken",
                "answer": "no",
                "reason": "实际发声内容为“你也留意到哈尔德了吧”，未包含源句中关于月经的核心意思。",
                "source_intervals": [
                  [
                    588.76,
                    592.72
                  ]
                ],
                "output_intervals": [
                  [
                    588.05,
                    590.23
                  ]
                ],
                "votes": [
                  {
                    "id": "S053.A_content.spoken",
                    "answer": "no",
                    "reason": "实际发声内容为“你也留意到哈尔德了吧”，未包含源句中关于月经的核心意思。",
                    "source_intervals": [
                      [
                        588.76,
                        592.72
                      ]
                    ],
                    "output_intervals": [
                      [
                        588.05,
                        590.23
                      ]
                    ]
                  },
                  {
                    "id": "S053.A_content.spoken",
                    "answer": "no",
                    "reason": "中文核心意思未实际发声，提交的音频内容与源句毫无关联。",
                    "source_intervals": [
                      [
                        588.76,
                        592.72
                      ]
                    ],
                    "output_intervals": [
                      [
                        588.51,
                        590.23
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S053.A_content.critical": {
              "pass": false,
              "evidence": {
                "id": "S053.A_content.critical",
                "answer": "no",
                "reason": "源句为Ida质问对方是否来月经，提交内容却变成Mette询问是否留意到哈尔德，语义完全不符。",
                "source_intervals": [
                  [
                    588.76,
                    592.72
                  ]
                ],
                "output_intervals": [
                  [
                    588.05,
                    590.23
                  ]
                ],
                "votes": [
                  {
                    "id": "S053.A_content.critical",
                    "answer": "no",
                    "reason": "源句为Ida质问对方是否来月经，提交内容却变成Mette询问是否留意到哈尔德，语义完全不符。",
                    "source_intervals": [
                      [
                        588.76,
                        592.72
                      ]
                    ],
                    "output_intervals": [
                      [
                        588.05,
                        590.23
                      ]
                    ]
                  },
                  {
                    "id": "S053.A_content.critical",
                    "answer": "no",
                    "reason": "源句为Ida质问对方是否来月经，提交内容完全替换成了Mette询问哈尔德的无关台词。",
                    "source_intervals": [
                      [
                        588.76,
                        592.72
                      ]
                    ],
                    "output_intervals": [
                      [
                        588.51,
                        590.23
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S056.A_content.critical": {
              "pass": false,
              "evidence": {
                "id": "S056.A_content.critical",
                "answer": "no",
                "reason": "实际音频朗读内容为“我现在又弄明白了”，擅自补全并反转了源句的条件否定逻辑。",
                "source_intervals": [
                  [
                    640.08,
                    644.76
                  ]
                ],
                "output_intervals": [
                  [
                    639.07,
                    644.14
                  ]
                ],
                "votes": [
                  {
                    "id": "S056.A_content.critical",
                    "answer": "no",
                    "reason": "实际音频朗读内容为“我现在又弄明白了”，擅自补全并反转了源句的条件否定逻辑。",
                    "source_intervals": [
                      [
                        640.08,
                        644.76
                      ]
                    ],
                    "output_intervals": [
                      [
                        639.07,
                        644.14
                      ]
                    ]
                  },
                  {
                    "id": "S056.A_content.critical",
                    "answer": "no",
                    "reason": "配音内容擅自补全了主语和时态，反转了原句的条件预设含义。",
                    "source_intervals": [
                      [
                        642.08,
                        644.76
                      ]
                    ],
                    "output_intervals": [
                      [
                        642.08,
                        644.14
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_role.Mette.A_stable.distinct": {
              "pass": false,
              "evidence": {
                "id": "role.Mette.A_stable.distinct",
                "answer": "no",
                "reason": "源角色Mette的台词被分配给其他音色，导致声线交换无法区分。",
                "source_intervals": [
                  [
                    6.52,
                    7.48
                  ],
                  [
                    136.28,
                    138.96
                  ]
                ],
                "output_intervals": [
                  [
                    5.83,
                    7.42
                  ],
                  [
                    135.71,
                    137.29
                  ]
                ],
                "votes": [
                  {
                    "id": "role.Mette.A_stable.distinct",
                    "answer": "no",
                    "reason": "源角色Mette的台词被分配给其他音色，导致声线交换无法区分。",
                    "source_intervals": [
                      [
                        6.52,
                        7.48
                      ],
                      [
                        136.28,
                        138.96
                      ]
                    ],
                    "output_intervals": [
                      [
                        5.83,
                        7.42
                      ],
                      [
                        135.71,
                        137.29
                      ]
                    ]
                  },
                  {
                    "id": "role.Mette.A_stable.distinct",
                    "answer": "no",
                    "reason": "S022和S043原属Mette，提交却分配给marta和elsie，导致声线交换。",
                    "source_intervals": [
                      [
                        136.28,
                        138.96
                      ],
                      [
                        487.84,
                        490.92
                      ]
                    ],
                    "output_intervals": [
                      [
                        135.71,
                        137.29
                      ],
                      [
                        488.67,
                        490.84
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_role.Marta.A_stable.distinct": {
              "pass": false,
              "evidence": {
                "id": "role.Marta.A_stable.distinct",
                "answer": "no",
                "reason": "源角色为Marta，输出却由Elsie配音，发生严重声线交换。",
                "source_intervals": [
                  [
                    103.94,
                    104.7
                  ],
                  [
                    481.48,
                    485.72
                  ]
                ],
                "output_intervals": [
                  [
                    103.19,
                    103.63
                  ],
                  [
                    481.02,
                    485.54
                  ]
                ],
                "votes": [
                  {
                    "id": "role.Marta.A_stable.distinct",
                    "answer": "no",
                    "reason": "源角色为Marta，输出却由Elsie配音，发生严重声线交换。",
                    "source_intervals": [
                      [
                        103.94,
                        104.7
                      ],
                      [
                        481.48,
                        485.72
                      ]
                    ],
                    "output_intervals": [
                      [
                        103.19,
                        103.63
                      ],
                      [
                        481.02,
                        485.54
                      ]
                    ]
                  },
                  {
                    "id": "role.Marta.A_stable.distinct",
                    "answer": "no",
                    "reason": "源片中Marta为老年女性，而提交音频中该角色台词被分配给埃尔茜（Elsie），导致与其他角色声线混淆。",
                    "source_intervals": [
                      [
                        103.94,
                        104.7
                      ],
                      [
                        117.22,
                        118.8
                      ],
                      [
                        481.48,
                        485.72
                      ]
                    ],
                    "output_intervals": [
                      [
                        103.19,
                        103.63
                      ],
                      [
                        116.58,
                        118.53
                      ],
                      [
                        481.02,
                        485.54
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_role.Elsie.A_stable.distinct": {
              "pass": false,
              "evidence": {
                "id": "role.Elsie.A_stable.distinct",
                "answer": "no",
                "reason": "源角色为老年女性，输出却混入年轻女声及男声，导致身份无法区分。",
                "source_intervals": [
                  [
                    147.0,
                    149.68
                  ],
                  [
                    462.0,
                    465.12
                  ],
                  [
                    528.9,
                    531.02
                  ],
                  [
                    703.5,
                    706.8
                  ]
                ],
                "output_intervals": [
                  [
                    146.75,
                    149.93
                  ],
                  [
                    461.75,
                    465.37
                  ],
                  [
                    528.65,
                    531.27
                  ],
                  [
                    703.25,
                    707.05
                  ]
                ],
                "votes": [
                  {
                    "id": "role.Elsie.A_stable.distinct",
                    "answer": "no",
                    "reason": "源角色为老年女性，输出却混入年轻女声及男声，导致身份无法区分。",
                    "source_intervals": [
                      [
                        147.0,
                        149.68
                      ],
                      [
                        462.0,
                        465.12
                      ],
                      [
                        528.9,
                        531.02
                      ],
                      [
                        703.5,
                        706.8
                      ]
                    ],
                    "output_intervals": [
                      [
                        146.75,
                        149.93
                      ],
                      [
                        461.75,
                        465.37
                      ],
                      [
                        528.65,
                        531.27
                      ],
                      [
                        703.25,
                        707.05
                      ]
                    ]
                  },
                  {
                    "id": "role.Elsie.A_stable.distinct",
                    "answer": "no",
                    "reason": "S023源为Elsie，输出错配给marta；S061源为Elsie，输出错配给marta。存在声线交换。",
                    "source_intervals": [
                      [
                        147.0,
                        149.68
                      ],
                      [
                        703.5,
                        706.8
                      ]
                    ],
                    "output_intervals": [
                      [
                        147.65,
                        150.26
                      ],
                      [
                        704.52,
                        705.9
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_H02.A_content.relation": {
              "pass": false,
              "evidence": {
                "id": "H02.A_content.relation",
                "answer": "no",
                "reason": "音频将原片中Ida的台词错误分配给了Mette的声音，破坏了角色间的区别。",
                "source_intervals": [
                  [
                    61.76,
                    63.84
                  ],
                  [
                    67.4,
                    69.4
                  ]
                ],
                "output_intervals": [
                  [
                    55.9,
                    61.65
                  ],
                  [
                    65.04,
                    70.14
                  ]
                ],
                "votes": [
                  {
                    "id": "H02.A_content.relation",
                    "answer": "no",
                    "reason": "音频将原片中Ida的台词错误分配给了Mette的声音，破坏了角色间的区别。",
                    "source_intervals": [
                      [
                        61.76,
                        63.84
                      ],
                      [
                        67.4,
                        69.4
                      ]
                    ],
                    "output_intervals": [
                      [
                        55.9,
                        61.65
                      ],
                      [
                        65.04,
                        70.14
                      ]
                    ]
                  },
                  {
                    "id": "H02.A_content.relation",
                    "answer": "no",
                    "reason": "源片中Ida与Mette音色不同，输出将两者均合成为同一女声，未保留角色声音区别。",
                    "source_intervals": [
                      [
                        61.76,
                        63.84
                      ],
                      [
                        67.4,
                        69.4
                      ]
                    ],
                    "output_intervals": [
                      [
                        55.9,
                        56.49
                      ],
                      [
                        65.04,
                        66.28
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_H03.T_meaning.relation": {
              "pass": false,
              "evidence": {
                "id": "H03.T_meaning.relation",
                "answer": "no",
                "reason": "S020将护工的台词错配给老人，导致人物关系与语义逻辑混乱。",
                "source_intervals": [
                  [
                    124.6,
                    127.4
                  ]
                ],
                "output_intervals": [
                  [
                    124.31,
                    127.05
                  ]
                ],
                "votes": [
                  {
                    "id": "H03.T_meaning.relation",
                    "answer": "no",
                    "reason": "S020将护工的台词错配给老人，导致人物关系与语义逻辑混乱。",
                    "source_intervals": [
                      [
                        124.6,
                        127.4
                      ]
                    ],
                    "output_intervals": [
                      [
                        124.31,
                        127.05
                      ]
                    ]
                  },
                  {
                    "id": "H03.T_meaning.relation",
                    "answer": "no",
                    "reason": "将原片中护工的台词错误分配给老人，导致人物关系与语义完全颠倒。",
                    "source_intervals": [
                      [
                        124.6,
                        127.4
                      ]
                    ],
                    "output_intervals": [
                      [
                        124.31,
                        127.05
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_H06.T_meaning.relation": {
              "pass": false,
              "evidence": {
                "id": "H06.T_meaning.relation",
                "answer": "no",
                "reason": "译文将气味台词错配给埃尔茜，破坏了原片角色归属逻辑。",
                "source_intervals": [
                  [
                    487.84,
                    490.92
                  ],
                  [
                    506.88,
                    508.8
                  ]
                ],
                "output_intervals": [
                  [
                    488.67,
                    490.84
                  ],
                  [
                    506.19,
                    508.1
                  ]
                ],
                "votes": [
                  {
                    "id": "H06.T_meaning.relation",
                    "answer": "no",
                    "reason": "译文将气味台词错配给埃尔茜，破坏了原片角色归属逻辑。",
                    "source_intervals": [
                      [
                        487.84,
                        490.92
                      ],
                      [
                        506.88,
                        508.8
                      ]
                    ],
                    "output_intervals": [
                      [
                        488.67,
                        490.84
                      ],
                      [
                        506.19,
                        508.1
                      ]
                    ]
                  },
                  {
                    "id": "H06.T_meaning.relation",
                    "answer": "no",
                    "reason": "译文将气味评论错配给埃尔茜，破坏了原片中梅特抱怨异味并称呼对方的角色归属逻辑。",
                    "source_intervals": [
                      [
                        487.84,
                        490.92
                      ],
                      [
                        492.78,
                        494.3
                      ]
                    ],
                    "output_intervals": [
                      [
                        488.67,
                        490.84
                      ],
                      [
                        492.28,
                        493.96
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_H06.A_content.relation": {
              "pass": false,
              "evidence": {
                "id": "H06.A_content.relation",
                "answer": "no",
                "reason": "配音音色与画面人物不符，导致气味台词由错误角色说出。",
                "source_intervals": [
                  [
                    487.84,
                    490.92
                  ],
                  [
                    506.88,
                    508.8
                  ]
                ],
                "output_intervals": [
                  [
                    488.67,
                    490.84
                  ],
                  [
                    506.19,
                    508.1
                  ]
                ],
                "votes": [
                  {
                    "id": "H06.A_content.relation",
                    "answer": "no",
                    "reason": "配音音色与画面人物不符，导致气味台词由错误角色说出。",
                    "source_intervals": [
                      [
                        487.84,
                        490.92
                      ],
                      [
                        506.88,
                        508.8
                      ]
                    ],
                    "output_intervals": [
                      [
                        488.67,
                        490.84
                      ],
                      [
                        506.19,
                        508.1
                      ]
                    ]
                  },
                  {
                    "id": "H06.A_content.relation",
                    "answer": "no",
                    "reason": "配音中气味台词由老年女声说出，与画面中年轻女子动作不符；随后称呼台词亦为同一声音，未体现双人互动。",
                    "source_intervals": [
                      [
                        487.84,
                        490.92
                      ],
                      [
                        492.78,
                        494.3
                      ]
                    ],
                    "output_intervals": [
                      [
                        488.67,
                        490.84
                      ],
                      [
                        492.28,
                        493.96
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_H07.T_meaning.relation": {
              "pass": false,
              "evidence": {
                "id": "H07.T_meaning.relation",
                "answer": "no",
                "reason": "译文将Ida的粗鲁质问篡改为Mette试探提及哈尔德，态度完全反转。",
                "source_intervals": [
                  [
                    588.76,
                    592.72
                  ]
                ],
                "output_intervals": [
                  [
                    588.05,
                    590.23
                  ]
                ],
                "votes": [
                  {
                    "id": "H07.T_meaning.relation",
                    "answer": "no",
                    "reason": "译文将Ida的粗鲁质问篡改为Mette试探提及哈尔德，态度完全反转。",
                    "source_intervals": [
                      [
                        588.76,
                        592.72
                      ]
                    ],
                    "output_intervals": [
                      [
                        588.05,
                        590.23
                      ]
                    ]
                  },
                  {
                    "id": "H07.T_meaning.relation",
                    "answer": "no",
                    "reason": "译文将Ida的质问篡改为Mette提及哈尔德，严重破坏角色态度与指代关系。",
                    "source_intervals": [
                      [
                        588.76,
                        592.72
                      ]
                    ],
                    "output_intervals": [
                      [
                        588.05,
                        590.23
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_H07.A_content.relation": {
              "pass": false,
              "evidence": {
                "id": "H07.A_content.relation",
                "answer": "no",
                "reason": "原声为Ida愤怒质问月经，输出却替换成Mette语气的画外音，角色与情绪均不符。",
                "source_intervals": [
                  [
                    588.76,
                    592.72
                  ]
                ],
                "output_intervals": [
                  [
                    588.05,
                    590.23
                  ]
                ],
                "votes": [
                  {
                    "id": "H07.A_content.relation",
                    "answer": "no",
                    "reason": "原声为Ida愤怒质问月经，输出却替换成Mette语气的画外音，角色与情绪均不符。",
                    "source_intervals": [
                      [
                        588.76,
                        592.72
                      ]
                    ],
                    "output_intervals": [
                      [
                        588.05,
                        590.23
                      ]
                    ]
                  },
                  {
                    "id": "H07.A_content.relation",
                    "answer": "no",
                    "reason": "原声中Ida愤怒质问被替换为Mette语气的试探性台词，完全丢失了原有的攻击性与情绪内容。",
                    "source_intervals": [
                      [
                        588.76,
                        592.72
                      ]
                    ],
                    "output_intervals": [
                      [
                        588.05,
                        590.23
                      ]
                    ]
                  }
                ]
              }
            }
          },
          "losses": [
            {
              "id": "role.Mette.A_stable.stable",
              "reason": "同一角色的不同片段使用了完全不同的合成音色，缺乏一致性。",
              "lost": 1.25,
              "source_intervals": [
                [
                  6.52,
                  7.48
                ],
                [
                  136.28,
                  138.96
                ]
              ],
              "output_intervals": [
                [
                  5.83,
                  7.42
                ],
                [
                  135.71,
                  137.29
                ]
              ]
            },
            {
              "id": "role.Mette.A_stable.distinct",
              "reason": "源角色Mette的台词被分配给其他音色，导致声线交换无法区分。",
              "lost": 1.25,
              "source_intervals": [
                [
                  6.52,
                  7.48
                ],
                [
                  136.28,
                  138.96
                ]
              ],
              "output_intervals": [
                [
                  5.83,
                  7.42
                ],
                [
                  135.71,
                  137.29
                ]
              ]
            },
            {
              "id": "role.Ida.A_stable.stable",
              "reason": "样本中仅S053为Ida（金发），其余均为Mette（棕发）；成片将唯一的Ida台词错配给了Mette的配音轨，导致该角色无有效同角色样本进行音色比对。",
              "lost": 1.25,
              "source_intervals": [
                [
                  586.36,
                  595.12
                ]
              ],
              "output_intervals": [
                [
                  586.36,
                  595.12
                ]
              ]
            },
            {
              "id": "role.Marta.A_stable.stable",
              "reason": "由于角色映射错误，实际听到的并非Marta的声音，无法评估其音色稳定性；且提交的marta.wav在对应时间段无有效语音输出。",
              "lost": 1.25,
              "source_intervals": [
                [
                  103.94,
                  104.7
                ],
                [
                  117.22,
                  118.8
                ],
                [
                  481.48,
                  485.72
                ]
              ],
              "output_intervals": [
                [
                  103.19,
                  103.63
                ],
                [
                  116.58,
                  118.53
                ],
                [
                  481.02,
                  485.54
                ]
              ]
            },
            {
              "id": "role.Marta.A_stable.distinct",
              "reason": "源角色为Marta，输出却由Elsie配音，发生严重声线交换。",
              "lost": 1.25,
              "source_intervals": [
                [
                  103.94,
                  104.7
                ],
                [
                  481.48,
                  485.72
                ]
              ],
              "output_intervals": [
                [
                  103.19,
                  103.63
                ],
                [
                  481.02,
                  485.54
                ]
              ]
            },
            {
              "id": "role.Elsie.A_stable.stable",
              "reason": "音色在沙哑老妪、清亮少女与低沉男声间剧烈切换，完全丧失一致性。",
              "lost": 1.25,
              "source_intervals": [
                [
                  147.0,
                  149.68
                ],
                [
                  462.0,
                  465.12
                ],
                [
                  528.9,
                  531.02
                ],
                [
                  703.5,
                  706.8
                ]
              ],
              "output_intervals": [
                [
                  146.75,
                  149.93
                ],
                [
                  461.75,
                  465.37
                ],
                [
                  528.65,
                  531.27
                ],
                [
                  703.25,
                  707.05
                ]
              ]
            },
            {
              "id": "role.Elsie.A_stable.distinct",
              "reason": "源角色为老年女性，输出却混入年轻女声及男声，导致身份无法区分。",
              "lost": 1.25,
              "source_intervals": [
                [
                  147.0,
                  149.68
                ],
                [
                  462.0,
                  465.12
                ],
                [
                  528.9,
                  531.02
                ],
                [
                  703.5,
                  706.8
                ]
              ],
              "output_intervals": [
                [
                  146.75,
                  149.93
                ],
                [
                  461.75,
                  465.37
                ],
                [
                  528.65,
                  531.27
                ],
                [
                  703.25,
                  707.05
                ]
              ]
            },
            {
              "id": "S055.A_identity.pitch",
              "reason": "源音调低沉且颤抖，输出音调偏高且平稳，区间不兼容。",
              "lost": 0.390625,
              "source_intervals": [
                [
                  632.32,
                  639.08
                ]
              ],
              "output_intervals": [
                [
                  631.76,
                  638.99
                ]
              ]
            },
            {
              "id": "S055.A_identity.texture",
              "reason": "源有明显气声/沙哑纹理，输出声音过于干净光滑。",
              "lost": 0.390625,
              "source_intervals": [
                [
                  632.32,
                  639.08
                ]
              ],
              "output_intervals": [
                [
                  631.76,
                  638.99
                ]
              ]
            },
            {
              "id": "S055.A_identity.resonance",
              "reason": "源具苍老共鸣质感，输出缺乏相应厚度与年龄特征。",
              "lost": 0.390625,
              "source_intervals": [
                [
                  632.32,
                  639.08
                ]
              ],
              "output_intervals": [
                [
                  631.76,
                  638.99
                ]
              ]
            },
            {
              "id": "S055.A_identity.identity",
              "reason": "源为老年男性沙哑声，输出为年轻平滑男声，音色不符。",
              "lost": 0.390625,
              "source_intervals": [
                [
                  632.32,
                  639.08
                ]
              ],
              "output_intervals": [
                [
                  631.76,
                  638.99
                ]
              ]
            },
            {
              "id": "S056.A_identity.pitch",
              "reason": "源为低沉老年男声，输出为中高音成年男声，音高区间明显不符。",
              "lost": 0.390625,
              "source_intervals": [
                [
                  640.08,
                  644.76
                ]
              ],
              "output_intervals": [
                [
                  639.07,
                  644.14
                ]
              ]
            },
            {
              "id": "S056.A_identity.texture",
              "reason": "源带沙哑颤抖气声，输出平滑清晰无颗粒感，未保留音质特征。",
              "lost": 0.390625,
              "source_intervals": [
                [
                  640.08,
                  644.76
                ]
              ],
              "output_intervals": [
                [
                  639.07,
                  644.14
                ]
              ]
            },
            {
              "id": "S056.A_identity.resonance",
              "reason": "源具苍老胸腔共鸣，输出偏扁平缺乏厚度，共鸣特征不相容。",
              "lost": 0.390625,
              "source_intervals": [
                [
                  640.08,
                  644.76
                ]
              ],
              "output_intervals": [
                [
                  639.07,
                  644.14
                ]
              ]
            },
            {
              "id": "S056.A_identity.identity",
              "reason": "源声为沙哑苍老的男性（Harald），成片却替换成了清晰平滑的年轻男声，音色与年龄感完全不符",
              "lost": 0.390625,
              "source_intervals": [
                [
                  637.68,
                  647.16
                ]
              ],
              "output_intervals": [
                [
                  637.68,
                  647.16
                ]
              ]
            },
            {
              "id": "S036.A_identity.texture",
              "reason": "输出丢失源角色明显的颗粒感与气声摩擦，音质过于纯净。",
              "lost": 0.2604166666666667,
              "source_intervals": [
                [
                  383.04,
                  385.96
                ]
              ],
              "output_intervals": [
                [
                  382.79,
                  383.66
                ]
              ]
            },
            {
              "id": "S036.A_identity.identity",
              "reason": "输出音色平滑干净，缺乏源角色特有的低沉沙哑质感，非同一人声。",
              "lost": 0.2604166666666667,
              "source_intervals": [
                [
                  383.04,
                  385.96
                ]
              ],
              "output_intervals": [
                [
                  382.79,
                  383.66
                ]
              ]
            },
            {
              "id": "S004.A_prosody.delivery",
              "reason": "源句中“tio år”后有明显的吸气停顿准备接下文，但中文配音一气呵成缺失了这一重要的呼吸节点。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  8.96,
                  10.64
                ]
              ],
              "output_intervals": [
                [
                  7.98,
                  9.66
                ]
              ]
            },
            {
              "id": "S013.A_prosody.intent",
              "reason": "实际中文配音仅保留了“Ja!”对应的庆祝语气，完全遗漏了源音频中前置的强烈感叹词“Fan!”的情绪表达。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  62.06,
                  63.84
                ]
              ],
              "output_intervals": [
                [
                  60.49,
                  61.65
                ]
              ]
            },
            {
              "id": "S013.A_prosody.delivery",
              "reason": "实际中文配音未能保留源句从急促感叹到兴奋肯定的明显停顿与语调突变结构，表演层次缺失。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  62.06,
                  63.84
                ]
              ],
              "output_intervals": [
                [
                  60.49,
                  61.65
                ]
              ]
            },
            {
              "id": "S014.A_prosody.delivery",
              "reason": "严重的断句和重叠使得表演结构崩塌，不再是自然的连续呼喊。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  67.4,
                  69.4
                ]
              ],
              "output_intervals": [
                [
                  65.04,
                  66.28
                ],
                [
                  67.9,
                  68.92
                ],
                [
                  69.35,
                  70.14
                ]
              ]
            },
            {
              "id": "S034.A_prosody.intent",
              "reason": "源句为“我就猜到”，中文译为“我不知道”完全反转了语气意图。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  367.0,
                  369.44
                ]
              ],
              "output_intervals": [
                [
                  365.82,
                  366.77
                ]
              ]
            },
            {
              "id": "S034.A_prosody.delivery",
              "reason": "源句“Ja, jag misstänkte det”带有了然和调侃的语气，译文“哦，我不知道”语气平淡且语义相反，丢失了原表演的强调结构。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  365.6,
                  369.44
                ]
              ],
              "output_intervals": [
                [
                  364.21,
                  366.77
                ]
              ]
            },
            {
              "id": "S043.A_prosody.delivery",
              "reason": "两句台词被分配给不同角色（梅特与埃尔茜），破坏了原片单人连续表演的结构。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  486.4,
                  490.92
                ]
              ],
              "output_intervals": [
                [
                  486.21,
                  490.84
                ]
              ]
            },
            {
              "id": "S044.A_prosody.intent",
              "reason": "源句是平静的确认/排除，配音变成了上扬的疑问，情绪意图完全偏离。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  492.78,
                  494.3
                ]
              ],
              "output_intervals": [
                [
                  492.28,
                  493.96
                ]
              ]
            },
            {
              "id": "S044.A_prosody.delivery",
              "reason": "源句“Det är inte du, Elsie.”在“inte”后有明显的迟疑停顿，成片中文配音语速连贯，未保留该停顿结构",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  490.08,
                  497.68
                ]
              ],
              "output_intervals": [
                [
                  490.08,
                  497.68
                ]
              ]
            },
            {
              "id": "S053.A_prosody.intent",
              "reason": "源意图是愤怒挑衅（问是否来月经），输出变成了温和的确认（问是否注意到某人）。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  588.76,
                  592.72
                ]
              ],
              "output_intervals": [
                [
                  588.05,
                  590.23
                ]
              ]
            },
            {
              "id": "S053.A_prosody.delivery",
              "reason": "源句是连续快速的质问，输出语速缓慢且有试探性的停顿，节奏完全不同。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  588.76,
                  592.72
                ]
              ],
              "output_intervals": [
                [
                  588.05,
                  590.23
                ]
              ]
            },
            {
              "id": "S055.A_prosody.intent",
              "reason": "源声沙哑颤抖且缓慢，输出为平稳清晰男声，未保留虚弱感。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  632.32,
                  639.08
                ]
              ],
              "output_intervals": [
                [
                  631.76,
                  638.99
                ]
              ]
            },
            {
              "id": "S056.A_prosody.intent",
              "reason": "源语气不耐烦轻蔑，输出平淡陈述，未传达关键情绪功能。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  640.08,
                  644.76
                ]
              ],
              "output_intervals": [
                [
                  639.07,
                  644.14
                ]
              ]
            },
            {
              "id": "S056.A_prosody.delivery",
              "reason": "源语速缓慢有停顿喘息，输出节奏均匀紧凑，缺失原表演结构。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  640.08,
                  644.76
                ]
              ],
              "output_intervals": [
                [
                  639.07,
                  644.14
                ]
              ]
            },
            {
              "id": "S004.A_content.critical",
              "reason": "由于时间窗口的错误偏移，实际上并没有听到源文件中对应位置的完整语义流，造成了关键信息的断裂风险。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  8.96,
                  10.64
                ]
              ],
              "output_intervals": [
                [
                  7.98,
                  9.66
                ]
              ]
            },
            {
              "id": "S013.A_content.spoken",
              "reason": "源中应发声的Fan!未在中文配音中出现，内容不完整。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  62.06,
                  63.84
                ]
              ],
              "output_intervals": [
                [
                  60.49,
                  61.65
                ]
              ]
            },
            {
              "id": "S013.A_content.critical",
              "reason": "遗漏了关键的情绪爆发点Fan!，改变了原意的情感强度分布。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  62.06,
                  63.84
                ]
              ],
              "output_intervals": [
                [
                  60.49,
                  61.65
                ]
              ]
            },
            {
              "id": "S014.A_content.critical",
              "reason": "情感递进关系被打乱，未能保留源句中从咒骂到狂喜的转变逻辑。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  67.4,
                  69.4
                ]
              ],
              "output_intervals": [
                [
                  65.04,
                  66.28
                ],
                [
                  67.9,
                  68.92
                ],
                [
                  69.35,
                  70.14
                ]
              ]
            },
            {
              "id": "S019.A_content.spoken",
              "reason": "核心语义不完整，缺少关于“感到荣幸”的实际发声内容。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  116.92,
                  123.32
                ]
              ],
              "output_intervals": [
                [
                  116.58,
                  123.17
                ]
              ]
            },
            {
              "id": "S019.A_content.critical",
              "reason": "源句“hedrad”（荣幸）在译文中缺失，仅翻译了前半部分反问。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  116.92,
                  123.32
                ]
              ],
              "output_intervals": [
                [
                  116.58,
                  123.17
                ]
              ]
            },
            {
              "id": "S023.A_content.spoken",
              "reason": "核心状态描述缺失，实际发声内容未能传达原意。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  145.72,
                  149.68
                ]
              ],
              "output_intervals": [
                [
                  145.03,
                  150.26
                ]
              ]
            },
            {
              "id": "S023.A_content.critical",
              "reason": "源句“我很干净”被擅自替换为“又来”，改变了拒绝理由。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  145.72,
                  149.68
                ]
              ],
              "output_intervals": [
                [
                  145.03,
                  150.26
                ]
              ]
            },
            {
              "id": "S024.A_content.critical",
              "reason": "实际音频缺失了开头的称呼“Harald”。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  246.88,
                  249.76
                ]
              ],
              "output_intervals": [
                [
                  247.87,
                  252.46
                ]
              ]
            },
            {
              "id": "S032.A_content.critical",
              "reason": "Mette台词由“我也没睡”改为“根本没睡”，擅自补全程度且丢失互指关系。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  347,
                  348.32
                ]
              ],
              "output_intervals": [
                [
                  347.02,
                  348.26
                ]
              ]
            },
            {
              "id": "S033.A_content.critical",
              "reason": "将“被父母摔在地上”意译为“跟爸妈走散了”，改变了原句关于身体伤害的特定含义。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  360.04,
                  365.12
                ]
              ],
              "output_intervals": [
                [
                  359.8,
                  363.61
                ]
              ]
            },
            {
              "id": "S034.A_content.spoken",
              "reason": "实际配音内容被篡改为“我不知道”，未能完整表达源句的核心意思。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  367.0,
                  369.44
                ]
              ],
              "output_intervals": [
                [
                  365.82,
                  366.77
                ]
              ]
            },
            {
              "id": "S034.A_content.critical",
              "reason": "将源句“ja, jag misstänkte det”错译为“我不知道”，语义完全相反。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  365.6,
                  369.44
                ]
              ],
              "output_intervals": [
                [
                  364.21,
                  366.77
                ]
              ]
            },
            {
              "id": "S043.A_content.critical",
              "reason": "将“只是电池”错译为疑问句“就靠电池嘛”，改变了原意。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  486.4,
                  490.92
                ]
              ],
              "output_intervals": [
                [
                  486.21,
                  490.84
                ]
              ]
            },
            {
              "id": "S044.A_content.critical",
              "reason": "源句为否定陈述（不是你），配音却读作疑问语气（是你？），语义发生反转。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  492.78,
                  494.3
                ]
              ],
              "output_intervals": [
                [
                  492.28,
                  493.96
                ]
              ]
            },
            {
              "id": "S052.A_content.critical",
              "reason": "源句指代墓地里的变态，译文擅自补全为迷路，语义完全反转。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  583.08,
                  585.92
                ]
              ],
              "output_intervals": [
                [
                  582.7,
                  584.83
                ]
              ]
            },
            {
              "id": "S053.A_content.spoken",
              "reason": "实际发声内容为“你也留意到哈尔德了吧”，未包含源句中关于月经的核心意思。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  588.76,
                  592.72
                ]
              ],
              "output_intervals": [
                [
                  588.05,
                  590.23
                ]
              ]
            },
            {
              "id": "S053.A_content.critical",
              "reason": "源句为Ida质问对方是否来月经，提交内容却变成Mette询问是否留意到哈尔德，语义完全不符。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  588.76,
                  592.72
                ]
              ],
              "output_intervals": [
                [
                  588.05,
                  590.23
                ]
              ]
            },
            {
              "id": "S056.A_content.critical",
              "reason": "实际音频朗读内容为“我现在又弄明白了”，擅自补全并反转了源句的条件否定逻辑。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  640.08,
                  644.76
                ]
              ],
              "output_intervals": [
                [
                  639.07,
                  644.14
                ]
              ]
            },
            {
              "id": "H02.A_content.relation",
              "reason": "音频将原片中Ida的台词错误分配给了Mette的声音，破坏了角色间的区别。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  61.76,
                  63.84
                ],
                [
                  67.4,
                  69.4
                ]
              ],
              "output_intervals": [
                [
                  55.9,
                  61.65
                ],
                [
                  65.04,
                  70.14
                ]
              ]
            },
            {
              "id": "H06.A_content.relation",
              "reason": "配音音色与画面人物不符，导致气味台词由错误角色说出。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  487.84,
                  490.92
                ],
                [
                  506.88,
                  508.8
                ]
              ],
              "output_intervals": [
                [
                  488.67,
                  490.84
                ],
                [
                  506.19,
                  508.1
                ]
              ]
            },
            {
              "id": "H07.A_content.relation",
              "reason": "原声为Ida愤怒质问月经，输出却替换成Mette语气的画外音，角色与情绪均不符。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  588.76,
                  592.72
                ]
              ],
              "output_intervals": [
                [
                  588.05,
                  590.23
                ]
              ]
            },
            {
              "id": "S004.E_meaning.proposition",
              "reason": "源句含“Den tar tio år och sen...”，提交仅截取“Det tar tio år.”丢失了后续连接词及隐含的时间延续逻辑。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  8.96,
                  10.64
                ]
              ],
              "output_intervals": [
                [
                  7.98,
                  9.66
                ]
              ]
            },
            {
              "id": "S013.E_meaning.proposition",
              "reason": "瑞典语转录丢失了核心感叹词Fan!，仅保留Ja!。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  62.06,
                  63.84
                ]
              ],
              "output_intervals": [
                [
                  60.49,
                  61.65
                ]
              ]
            },
            {
              "id": "S013.E_meaning.intent",
              "reason": "提交将说话人误标为Mette且时间错位至60.49秒，此时画面中Mette并未发声；该描述无法对应源段Ida的实际语用功能。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  62.0,
                  63.84
                ]
              ],
              "output_intervals": []
            },
            {
              "id": "S014.E_meaning.proposition",
              "reason": "瑞典语转录混乱，将一句话拆碎并张冠李戴，破坏了原始命题结构。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  67.4,
                  69.4
                ]
              ],
              "output_intervals": [
                [
                  65.04,
                  66.28
                ],
                [
                  67.9,
                  68.92
                ],
                [
                  69.35,
                  70.14
                ]
              ]
            },
            {
              "id": "S014.E_meaning.intent",
              "reason": "delivery_note描述的是另一个场景的动作，与本处源事件的语境不符。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  67.4,
                  69.4
                ]
              ],
              "output_intervals": [
                [
                  65.04,
                  66.28
                ],
                [
                  67.9,
                  68.92
                ],
                [
                  69.35,
                  70.14
                ]
              ]
            },
            {
              "id": "S019.E_meaning.proposition",
              "reason": "E019a将源句时间状语“i natt”（昨晚）篡改为“innan”（之前），丢失了具体的夜间限定信息。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  117.22,
                  118.8
                ]
              ],
              "output_intervals": [
                [
                  116.58,
                  118.53
                ]
              ]
            },
            {
              "id": "S019.E_meaning.intent",
              "reason": "将Mette调侃反问“该害怕还是受宠若惊”误作Marta询问物品。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  119.3,
                  123.32
                ]
              ],
              "output_intervals": [
                [
                  121.39,
                  123.17
                ]
              ]
            },
            {
              "id": "S023.E_meaning.proposition",
              "reason": "提交将Jag är ren替换为Inte igen，核心语义被篡改。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  145.72,
                  149.68
                ]
              ],
              "output_intervals": [
                [
                  145.03,
                  150.26
                ]
              ]
            },
            {
              "id": "S023.E_meaning.intent",
              "reason": "源情绪为激动大声拒绝，提交描述平淡且偏离原意。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  145.72,
                  149.68
                ]
              ],
              "output_intervals": [
                [
                  145.03,
                  150.26
                ]
              ]
            },
            {
              "id": "S032.E_meaning.proposition",
              "reason": "E032c声称源文本为Nej, inte alls但实际听到的是Nej, inte jag heller，命题内容不符。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  345.2,
                  348.32
                ]
              ],
              "output_intervals": [
                [
                  344.73,
                  348.26
                ]
              ]
            },
            {
              "id": "S033.E_meaning.proposition",
              "reason": "源句“Blev du tappad i golvet”意为摔到头导致变傻，提交文本误译为“跟爸妈走散了”。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  360.04,
                  365.12
                ]
              ],
              "output_intervals": [
                [
                  361.95,
                  363.61
                ]
              ]
            },
            {
              "id": "S034.E_meaning.proposition",
              "reason": "提交将“我猜到了”错译为“我不知道”，完全反转了源句的语用逻辑。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  365.6,
                  369.44
                ]
              ],
              "output_intervals": []
            },
            {
              "id": "S034.E_meaning.intent",
              "reason": "源句“Ja, jag misstänkte det”意为“我就猜到了”，delivery_note误判为“不知道”。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  365.6,
                  369.44
                ]
              ],
              "output_intervals": [
                [
                  365.82,
                  366.77
                ]
              ]
            },
            {
              "id": "S043.E_meaning.proposition",
              "reason": "前半句漏译“bara”，改变了原意；后半句命题保留正确。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  486.4,
                  490.92
                ]
              ],
              "output_intervals": [
                [
                  486.21,
                  490.84
                ]
              ]
            },
            {
              "id": "S043.E_meaning.intent",
              "reason": "后半句是闻到异味的嫌弃，并非从物件转到房间的过渡。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  486.4,
                  490.92
                ]
              ],
              "output_intervals": [
                [
                  486.21,
                  490.84
                ]
              ]
            },
            {
              "id": "S046.E_meaning.intent",
              "reason": "源声为年轻女护工嫌弃发问，笔记误判为老年女性起身追问。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  506.88,
                  509.72
                ]
              ],
              "output_intervals": [
                [
                  506.19,
                  508.1
                ]
              ]
            },
            {
              "id": "S050.E_meaning.proposition",
              "reason": "后半句源文本应为Hänt något roligt?，提交将其错误归属并改写为另一人台词。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  576.34,
                  577.76
                ]
              ],
              "output_intervals": [
                [
                  576.34,
                  577.74
                ]
              ]
            },
            {
              "id": "S050.E_meaning.intent",
              "reason": "后半句实际是Mette的连续追问，delivery_note误判为另一人的揶揄语气。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  576.34,
                  577.76
                ]
              ],
              "output_intervals": [
                [
                  576.34,
                  577.74
                ]
              ]
            },
            {
              "id": "S052.E_meaning.proposition",
              "reason": "源文本为Psyket(精神病/变态)，事件声明篡改为迷路(gick vilse)。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  583.08,
                  585.92
                ]
              ],
              "output_intervals": [
                [
                  582.7,
                  584.83
                ]
              ]
            },
            {
              "id": "S052.E_meaning.intent",
              "reason": "源句强调心理变态者(psyko)，delivery_note误判为普通背景解释。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  583.08,
                  585.92
                ]
              ],
              "output_intervals": [
                [
                  582.7,
                  584.83
                ]
              ]
            },
            {
              "id": "S053.E_meaning.proposition",
              "reason": "源文本提及月经问题，提交瑞典语文本完全无关，命题丢失。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  588.76,
                  592.72
                ]
              ],
              "output_intervals": [
                [
                  588.05,
                  590.23
                ]
              ]
            },
            {
              "id": "S053.E_meaning.intent",
              "reason": "源句为愤怒质问，提交备注却描述为试探性询问，意图不符。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  588.76,
                  592.72
                ]
              ],
              "output_intervals": [
                [
                  588.05,
                  590.23
                ]
              ]
            },
            {
              "id": "S056.E_meaning.proposition",
              "reason": "后半句源文为“如果你还没明白”，提交转录改为“我现在又弄明白了”，核心命题发生反转。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  640.08,
                  644.76
                ]
              ],
              "output_intervals": []
            },
            {
              "id": "S056.E_meaning.intent",
              "reason": "源句带有不耐烦和轻蔑语气，交付说明仅描述重读夜里，未识别出该情绪功能。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  640.08,
                  644.76
                ]
              ],
              "output_intervals": []
            },
            {
              "id": "S013.A_identity.pitch",
              "reason": "源人物为Ida（短发、有纳粹纹身），其原声在62.06-63.84秒表现为高亢且极具爆发力的尖叫；而输出音频错误地使用了Mette的声音，在对应时间段（约59.36-60.50秒）呈现为中低音区平稳的“好耶”，音高区间完全不相容。",
              "lost": 0.15625,
              "source_intervals": [
                [
                  62.06,
                  63.84
                ]
              ],
              "output_intervals": [
                [
                  59.36,
                  60.5
                ]
              ]
            },
            {
              "id": "S013.A_identity.texture",
              "reason": "源人物Ida的原声带有明显的撕裂感和极度兴奋的嘶吼质地（62.06-63.84秒）；输出的中文配音（59.36-60.50秒）音色干净平滑，缺乏源声音那种粗砺和失控的质感，未能保留可辨认的音质特征。",
              "lost": 0.15625,
              "source_intervals": [
                [
                  62.06,
                  63.84
                ]
              ],
              "output_intervals": [
                [
                  59.36,
                  60.5
                ]
              ]
            },
            {
              "id": "S013.A_identity.resonance",
              "reason": "源人物Ida发声时喉部紧张，共鸣集中在头腔与鼻腔的高频区，听感尖锐单薄（62.06-63.84秒）；输出配音（59.36-60.50秒）胸腔共鸣较多，声音厚实圆润，两者共鸣位置与厚薄特征严重不符。",
              "lost": 0.15625,
              "source_intervals": [
                [
                  62.06,
                  63.84
                ]
              ],
              "output_intervals": [
                [
                  59.36,
                  60.5
                ]
              ]
            },
            {
              "id": "S013.A_identity.identity",
              "reason": "存在严重的角色错配（Casting Swap）。源画面中说话者为Ida（短发纹身女），但提交计划明确标注使用Mette的声音进行配音。尽管两人均为年轻女性，但排除语言差异后，该通用女声无法被辨认为特定的Ida本人，属于身份识别失败。",
              "lost": 0.15625,
              "source_intervals": [
                [
                  62.06,
                  63.84
                ]
              ],
              "output_intervals": [
                [
                  59.36,
                  60.5
                ]
              ]
            },
            {
              "id": "S030.A_identity.texture",
              "reason": "丢失了原角色特有的气声和略带沙哑的质感。",
              "lost": 0.15625,
              "source_intervals": [
                [
                  318.44,
                  320.44
                ]
              ],
              "output_intervals": [
                [
                  318.44,
                  320.44
                ]
              ]
            },
            {
              "id": "S030.A_identity.resonance",
              "reason": "共鸣偏亮且单薄，未能还原原角色的厚重感。",
              "lost": 0.15625,
              "source_intervals": [
                [
                  318.44,
                  320.44
                ]
              ],
              "output_intervals": [
                [
                  318.44,
                  320.44
                ]
              ]
            },
            {
              "id": "S030.A_identity.identity",
              "reason": "合成音色过于平滑，缺乏原角色低沉随意的特质。",
              "lost": 0.15625,
              "source_intervals": [
                [
                  318.44,
                  320.44
                ]
              ],
              "output_intervals": [
                [
                  318.44,
                  320.44
                ]
              ]
            },
            {
              "id": "S053.A_identity.pitch",
              "reason": "源声为尖锐且带有攻击性的年轻女声，成片输出为平稳试探的中音区女声，音高区间不匹配",
              "lost": 0.15625,
              "source_intervals": [
                [
                  586.36,
                  595.12
                ]
              ],
              "output_intervals": [
                [
                  586.36,
                  595.12
                ]
              ]
            },
            {
              "id": "S053.A_identity.texture",
              "reason": "源声明亮且带有明显的急躁与沙哑感，成片输出平滑清晰无此音质特征",
              "lost": 0.15625,
              "source_intervals": [
                [
                  586.36,
                  595.12
                ]
              ],
              "output_intervals": [
                [
                  586.36,
                  595.12
                ]
              ]
            },
            {
              "id": "S053.A_identity.resonance",
              "reason": "源声共鸣靠前、单薄且具有穿透力，成片输出共鸣靠后、厚实且温和",
              "lost": 0.15625,
              "source_intervals": [
                [
                  586.36,
                  595.12
                ]
              ],
              "output_intervals": [
                [
                  586.36,
                  595.12
                ]
              ]
            },
            {
              "id": "S053.A_identity.identity",
              "reason": "源声表现出强烈的不耐烦与粗鲁情绪，成片输出语气平静试探，无法辨认为同一人物或同一状态下的声音",
              "lost": 0.15625,
              "source_intervals": [
                [
                  586.36,
                  595.12
                ]
              ],
              "output_intervals": [
                [
                  586.36,
                  595.12
                ]
              ]
            },
            {
              "id": "S019.A_identity.1.resonance",
              "reason": "共鸣位置靠前且单薄，缺乏源角色特有的喉部松弛与胸腔厚重感。",
              "lost": 0.15625,
              "source_intervals": [
                [
                  117.22,
                  118.8
                ]
              ],
              "output_intervals": [
                [
                  116.58,
                  118.53
                ]
              ]
            },
            {
              "id": "S019.A_identity.1.identity",
              "reason": "中文声音过于年轻圆润，缺乏源角色老年女性的沧桑感，非同一人。",
              "lost": 0.15625,
              "source_intervals": [
                [
                  117.22,
                  118.8
                ]
              ],
              "output_intervals": [
                [
                  116.58,
                  118.53
                ]
              ]
            },
            {
              "id": "S041.A_identity.pitch",
              "reason": "配音为中高音区，原角色为低沉微弱的老年嗓音。",
              "lost": 0.15625,
              "source_intervals": [
                [
                  468.44,
                  471.44
                ]
              ],
              "output_intervals": [
                [
                  465.85,
                  470.07
                ]
              ]
            },
            {
              "id": "S041.A_identity.texture",
              "reason": "音质平滑清晰，丢失了原角色的沙哑与苍老质感。",
              "lost": 0.15625,
              "source_intervals": [
                [
                  468.44,
                  471.44
                ]
              ],
              "output_intervals": [
                [
                  465.85,
                  470.07
                ]
              ]
            },
            {
              "id": "S041.A_identity.resonance",
              "reason": "共鸣偏亮且实，缺乏原角色特有的虚弱气流感。",
              "lost": 0.15625,
              "source_intervals": [
                [
                  468.44,
                  471.44
                ]
              ],
              "output_intervals": [
                [
                  465.85,
                  470.07
                ]
              ]
            },
            {
              "id": "S041.A_identity.identity",
              "reason": "使用了埃尔茜音色，与原角色梅尔塔明显不符。",
              "lost": 0.15625,
              "source_intervals": [
                [
                  468.44,
                  471.44
                ]
              ],
              "output_intervals": [
                [
                  465.85,
                  470.07
                ]
              ]
            },
            {
              "id": "S042.A_identity.1.pitch",
              "reason": "输出音高偏高，不符合源老年女性的低沉音色。",
              "lost": 0.15625,
              "source_intervals": [
                [
                  481.48,
                  483.2
                ]
              ],
              "output_intervals": [
                [
                  481.02,
                  483.61
                ]
              ]
            },
            {
              "id": "S042.A_identity.1.texture",
              "reason": "丢失了源声的沙哑和气声特征，质感不符。",
              "lost": 0.15625,
              "source_intervals": [
                [
                  481.48,
                  483.2
                ]
              ],
              "output_intervals": [
                [
                  481.02,
                  483.61
                ]
              ]
            },
            {
              "id": "S042.A_identity.1.resonance",
              "reason": "缺乏老年人特有的虚弱共鸣感，声音过于清亮。",
              "lost": 0.15625,
              "source_intervals": [
                [
                  481.48,
                  483.2
                ]
              ],
              "output_intervals": [
                [
                  481.02,
                  483.61
                ]
              ]
            },
            {
              "id": "S042.A_identity.1.identity",
              "reason": "源角色为老年女性Marta，输出使用了年轻女性Elsie的声音。",
              "lost": 0.15625,
              "source_intervals": [
                [
                  481.48,
                  483.2
                ]
              ],
              "output_intervals": [
                [
                  481.02,
                  483.61
                ]
              ]
            },
            {
              "id": "S042.A_identity.2.pitch",
              "reason": "音高依然过高，与源人物年龄特征严重冲突。",
              "lost": 0.15625,
              "source_intervals": [
                [
                  483.2,
                  485.72
                ]
              ],
              "output_intervals": [
                [
                  483.96,
                  485.54
                ]
              ]
            },
            {
              "id": "S042.A_identity.2.texture",
              "reason": "声音平滑无杂质，缺失源角色的苍老纹理。",
              "lost": 0.15625,
              "source_intervals": [
                [
                  483.2,
                  485.72
                ]
              ],
              "output_intervals": [
                [
                  483.96,
                  485.54
                ]
              ]
            },
            {
              "id": "S042.A_identity.2.resonance",
              "reason": "共鸣位置靠前且年轻，完全不像老年卧床者。",
              "lost": 0.15625,
              "source_intervals": [
                [
                  483.2,
                  485.72
                ]
              ],
              "output_intervals": [
                [
                  483.96,
                  485.54
                ]
              ]
            },
            {
              "id": "S042.A_identity.2.identity",
              "reason": "第二句仍错误使用了Elsie的年轻女声代替Marta。",
              "lost": 0.15625,
              "source_intervals": [
                [
                  483.2,
                  485.72
                ]
              ],
              "output_intervals": [
                [
                  483.96,
                  485.54
                ]
              ]
            },
            {
              "id": "S004.T_meaning.proposition",
              "reason": "中文译文“得等上十年。”虽译出了时长，但因截断导致失去了源句中“然后...”的叙事推进感。",
              "lost": 0.049632352941176475,
              "source_intervals": [
                [
                  8.96,
                  10.64
                ]
              ],
              "output_intervals": [
                [
                  7.98,
                  9.66
                ]
              ]
            },
            {
              "id": "S004.T_meaning.scope",
              "reason": "源句是一个长复合句的前半部分，提交文本将其孤立处理，破坏了原有的条件与结果的范围联系。",
              "lost": 0.049632352941176475,
              "source_intervals": [
                [
                  8.96,
                  10.64
                ]
              ],
              "output_intervals": [
                [
                  7.98,
                  9.66
                ]
              ]
            },
            {
              "id": "S013.T_meaning.proposition",
              "reason": "中文译文“好耶！”仅对应Ja!，完全遗漏了Fan!的含义。",
              "lost": 0.049632352941176475,
              "source_intervals": [
                [
                  62.06,
                  63.84
                ]
              ],
              "output_intervals": [
                [
                  60.49,
                  61.65
                ]
              ]
            },
            {
              "id": "S014.T_meaning.proposition",
              "reason": "中文译文碎片化，无法还原源句连贯的情绪宣泄过程。",
              "lost": 0.049632352941176475,
              "source_intervals": [
                [
                  67.4,
                  69.4
                ]
              ],
              "output_intervals": [
                [
                  65.04,
                  66.28
                ],
                [
                  67.9,
                  68.92
                ],
                [
                  69.35,
                  70.14
                ]
              ]
            },
            {
              "id": "S019.T_meaning.proposition",
              "reason": "译文遗漏了“hedrad”（荣幸），导致反问句丢失了二选一的核心逻辑。",
              "lost": 0.049632352941176475,
              "source_intervals": [
                [
                  116.92,
                  123.32
                ]
              ],
              "output_intervals": [
                [
                  116.58,
                  123.17
                ]
              ]
            },
            {
              "id": "S019.T_meaning.scope",
              "reason": "译文未完整覆盖原句范围，缺失了选择连词后的后半部分选项内容。",
              "lost": 0.049632352941176475,
              "source_intervals": [
                [
                  116.92,
                  123.32
                ]
              ],
              "output_intervals": [
                [
                  116.58,
                  123.17
                ]
              ]
            },
            {
              "id": "S023.T_meaning.proposition",
              "reason": "源句“我是干净的”被译为“又来”，完全丢失核心语义。",
              "lost": 0.049632352941176475,
              "source_intervals": [
                [
                  145.72,
                  149.68
                ]
              ],
              "output_intervals": [
                [
                  145.03,
                  150.26
                ]
              ]
            },
            {
              "id": "S023.T_meaning.scope",
              "reason": "源否定词Nej保留，但后续肯定陈述Jag är ren缺失无对应。",
              "lost": 0.049632352941176475,
              "source_intervals": [
                [
                  145.72,
                  149.68
                ]
              ],
              "output_intervals": [
                [
                  145.03,
                  150.26
                ]
              ]
            },
            {
              "id": "S032.T_meaning.proposition",
              "reason": "将“我也没怎么睡”错译为“根本没睡”，改变了睡眠程度的核心命题。",
              "lost": 0.049632352941176475,
              "source_intervals": [
                [
                  345.2,
                  348.32
                ]
              ],
              "output_intervals": [
                [
                  344.73,
                  348.26
                ]
              ]
            },
            {
              "id": "S032.T_meaning.scope",
              "reason": "把部分否定“不多”夸大为完全否定“根本”，否定的作用范围被错误扩大。",
              "lost": 0.049632352941176475,
              "source_intervals": [
                [
                  345.2,
                  348.32
                ]
              ],
              "output_intervals": [
                [
                  344.73,
                  348.26
                ]
              ]
            },
            {
              "id": "S033.T_meaning.proposition",
              "reason": "中文译文未能保留源事件核心命题，将“摔到头”错译为“走散”。",
              "lost": 0.049632352941176475,
              "source_intervals": [
                [
                  360.04,
                  365.12
                ]
              ],
              "output_intervals": [
                [
                  361.95,
                  363.61
                ]
              ]
            },
            {
              "id": "S033.T_meaning.scope",
              "reason": "源句“Blev du tappad i golvet”意为被摔在地上，译文误作“走散了”，语义完全改变",
              "lost": 0.049632352941176475,
              "source_intervals": [
                [
                  357.64,
                  367.52
                ]
              ],
              "output_intervals": [
                [
                  357.64,
                  367.52
                ]
              ]
            },
            {
              "id": "S034.T_meaning.proposition",
              "reason": "中文译文把表示了然的“我猜到了”译成“我不知道”，核心命题错误。",
              "lost": 0.049632352941176475,
              "source_intervals": [
                [
                  365.6,
                  369.44
                ]
              ],
              "output_intervals": []
            },
            {
              "id": "S034.T_meaning.scope",
              "reason": "译文未能保留源句中确认猜测的范围，导致语义指向发生根本改变。",
              "lost": 0.049632352941176475,
              "source_intervals": [
                [
                  365.6,
                  369.44
                ]
              ],
              "output_intervals": []
            },
            {
              "id": "S050.T_meaning.proposition",
              "reason": "后半句中文译文丢失了原句“发生了什么有趣的事”的核心疑问命题。",
              "lost": 0.049632352941176475,
              "source_intervals": [
                [
                  576.34,
                  577.76
                ]
              ],
              "output_intervals": [
                [
                  576.34,
                  577.74
                ]
              ]
            },
            {
              "id": "S052.T_meaning.proposition",
              "reason": "源句指代精神病，译文误译为迷路，核心命题完全改变。",
              "lost": 0.049632352941176475,
              "source_intervals": [
                [
                  583.08,
                  585.92
                ]
              ],
              "output_intervals": [
                [
                  582.7,
                  584.83
                ]
              ]
            },
            {
              "id": "S052.T_meaning.scope",
              "reason": "将名词“精神病患者”替换为动作“迷路”，改变了原意范围。",
              "lost": 0.049632352941176475,
              "source_intervals": [
                [
                  583.08,
                  585.92
                ]
              ],
              "output_intervals": [
                [
                  582.7,
                  584.83
                ]
              ]
            },
            {
              "id": "S053.T_meaning.proposition",
              "reason": "中文译文对应的是另一句话的内容，与原句核心命题毫无关联。",
              "lost": 0.049632352941176475,
              "source_intervals": [
                [
                  588.76,
                  592.72
                ]
              ],
              "output_intervals": [
                [
                  588.05,
                  590.23
                ]
              ]
            },
            {
              "id": "S053.T_meaning.scope",
              "reason": "原句包含两个反问分句，译文仅保留一个陈述问句，范围缩小。",
              "lost": 0.049632352941176475,
              "source_intervals": [
                [
                  588.76,
                  592.72
                ]
              ],
              "output_intervals": [
                [
                  588.05,
                  590.23
                ]
              ]
            },
            {
              "id": "S056.T_meaning.proposition",
              "reason": "中文译文将“如果你还没明白”错译为“我现在又弄明白了”，改变了原句的条件关系和主语指向。",
              "lost": 0.049632352941176475,
              "source_intervals": [
                [
                  640.08,
                  644.76
                ]
              ],
              "output_intervals": []
            },
            {
              "id": "S056.T_meaning.scope",
              "reason": "源句中的条件限定“om du inte har fattat det än”在译文中丢失或被错误替换为自我陈述。",
              "lost": 0.049632352941176475,
              "source_intervals": [
                [
                  640.08,
                  644.76
                ]
              ],
              "output_intervals": []
            },
            {
              "id": "H03.T_meaning.relation",
              "reason": "S020将护工的台词错配给老人，导致人物关系与语义逻辑混乱。",
              "lost": 0.049632352941176475,
              "source_intervals": [
                [
                  124.6,
                  127.4
                ]
              ],
              "output_intervals": [
                [
                  124.31,
                  127.05
                ]
              ]
            },
            {
              "id": "H06.T_meaning.relation",
              "reason": "译文将气味台词错配给埃尔茜，破坏了原片角色归属逻辑。",
              "lost": 0.049632352941176475,
              "source_intervals": [
                [
                  487.84,
                  490.92
                ],
                [
                  506.88,
                  508.8
                ]
              ],
              "output_intervals": [
                [
                  488.67,
                  490.84
                ],
                [
                  506.19,
                  508.1
                ]
              ]
            },
            {
              "id": "H07.T_meaning.relation",
              "reason": "译文将Ida的粗鲁质问篡改为Mette试探提及哈尔德，态度完全反转。",
              "lost": 0.049632352941176475,
              "source_intervals": [
                [
                  588.76,
                  592.72
                ]
              ],
              "output_intervals": [
                [
                  588.05,
                  590.23
                ]
              ]
            },
            {
              "id": "S023.A_identity.2.pitch",
              "reason": "音调过于清亮平滑，远高于原声激动时的高亢频率。",
              "lost": 0.11160714285714286,
              "source_intervals": [
                [
                  147.0,
                  149.68
                ]
              ],
              "output_intervals": [
                [
                  147.65,
                  150.26
                ]
              ]
            },
            {
              "id": "S023.A_identity.2.texture",
              "reason": "源角色声音沙哑激动，中文配音音色清亮平滑，完全丢失了原有的粗糙气声特征。",
              "lost": 0.11160714285714286,
              "source_intervals": [
                [
                  147.0,
                  149.68
                ]
              ],
              "output_intervals": [
                [
                  147.65,
                  150.26
                ]
              ]
            },
            {
              "id": "S023.A_identity.2.resonance",
              "reason": "胸腔共鸣不足，听起来像普通成年女性而非老人。",
              "lost": 0.11160714285714286,
              "source_intervals": [
                [
                  147.0,
                  149.68
                ]
              ],
              "output_intervals": [
                [
                  147.65,
                  150.26
                ]
              ]
            },
            {
              "id": "S023.A_identity.2.identity",
              "reason": "使用了完全不同的女声，缺乏老年角色的沙哑特征。",
              "lost": 0.11160714285714286,
              "source_intervals": [
                [
                  147.0,
                  149.68
                ]
              ],
              "output_intervals": [
                [
                  147.65,
                  150.26
                ]
              ]
            },
            {
              "id": "S039.A_identity.texture",
              "reason": "源为清晰年轻女声，输出却带明显气声与沙哑质感。",
              "lost": 0.11160714285714286,
              "source_intervals": [
                [
                  459.2,
                  461.44
                ]
              ],
              "output_intervals": [
                [
                  458.34,
                  460.58
                ]
              ]
            },
            {
              "id": "S040.A_identity.pitch",
              "reason": "源角色为年长女性，成片配音音色年轻且音高偏高，与源人物不符",
              "lost": 0.11160714285714286,
              "source_intervals": [
                [
                  459.6,
                  467.52
                ]
              ],
              "output_intervals": [
                [
                  459.6,
                  467.52
                ]
              ]
            },
            {
              "id": "S040.A_identity.texture",
              "reason": "中文声音干净无杂质，丢失了源角色明显的撕裂声带质感。",
              "lost": 0.11160714285714286,
              "source_intervals": [
                [
                  462.0,
                  465.12
                ]
              ],
              "output_intervals": [
                [
                  461.62,
                  464.17
                ]
              ]
            },
            {
              "id": "S040.A_identity.resonance",
              "reason": "中文共鸣靠前单薄，缺失源角色喉部紧张带来的厚重压迫感。",
              "lost": 0.11160714285714286,
              "source_intervals": [
                [
                  462.0,
                  465.12
                ]
              ],
              "output_intervals": [
                [
                  461.62,
                  464.17
                ]
              ]
            },
            {
              "id": "S040.A_identity.identity",
              "reason": "中文音色平滑明亮，缺乏源角色特有的沙哑与苍老感。",
              "lost": 0.11160714285714286,
              "source_intervals": [
                [
                  462.0,
                  465.12
                ]
              ],
              "output_intervals": [
                [
                  461.62,
                  464.17
                ]
              ]
            },
            {
              "id": "S045.A_identity.texture",
              "reason": "输出声音干净平滑，完全丢失了源角色显著的沙哑和气声特征。",
              "lost": 0.11160714285714286,
              "source_intervals": [
                [
                  497.6,
                  501.84
                ]
              ],
              "output_intervals": [
                [
                  497.32,
                  501.12
                ]
              ]
            },
            {
              "id": "S045.A_identity.resonance",
              "reason": "输出共鸣明亮单薄，缺失源角色因年龄产生的喉部松弛感和厚重感。",
              "lost": 0.11160714285714286,
              "source_intervals": [
                [
                  497.6,
                  501.84
                ]
              ],
              "output_intervals": [
                [
                  497.32,
                  501.12
                ]
              ]
            },
            {
              "id": "S045.A_identity.identity",
              "reason": "输出为通用年轻女声TTS，缺乏源角色Elsie特有的苍老沙哑质感，无法辨认为同一人物。",
              "lost": 0.11160714285714286,
              "source_intervals": [
                [
                  497.6,
                  501.84
                ]
              ],
              "output_intervals": [
                [
                  497.32,
                  501.12
                ]
              ]
            },
            {
              "id": "S049.A_identity.texture",
              "reason": "丢失了原角色明显的声带摩擦与气声特征，音质差异过大。",
              "lost": 0.11160714285714286,
              "source_intervals": [
                [
                  528.9,
                  531.02
                ]
              ],
              "output_intervals": [
                [
                  527.8,
                  530.38
                ]
              ]
            },
            {
              "id": "S049.A_identity.resonance",
              "reason": "共鸣位置偏前且单薄，未能体现原角色深沉厚重的胸腔共鸣。",
              "lost": 0.11160714285714286,
              "source_intervals": [
                [
                  528.9,
                  531.02
                ]
              ],
              "output_intervals": [
                [
                  527.8,
                  530.38
                ]
              ]
            },
            {
              "id": "S049.A_identity.identity",
              "reason": "合成音色过于平滑年轻，缺乏原角色特有的苍老沙哑质感。",
              "lost": 0.11160714285714286,
              "source_intervals": [
                [
                  528.9,
                  531.02
                ]
              ],
              "output_intervals": [
                [
                  527.8,
                  530.38
                ]
              ]
            },
            {
              "id": "S060.A_identity.2.pitch",
              "reason": "音高偏高且缺乏老年女性特有的低沉感，不兼容原角色。",
              "lost": 0.11160714285714286,
              "source_intervals": [
                [
                  698.0,
                  701.4
                ]
              ],
              "output_intervals": [
                [
                  699.13,
                  701.64
                ]
              ]
            },
            {
              "id": "S060.A_identity.2.texture",
              "reason": "丢失了原角色明显的vocal fry（气泡音）和疲惫质感。",
              "lost": 0.11160714285714286,
              "source_intervals": [
                [
                  698.0,
                  701.4
                ]
              ],
              "output_intervals": [
                [
                  699.13,
                  701.64
                ]
              ]
            },
            {
              "id": "S060.A_identity.2.resonance",
              "reason": "共鸣位置过于靠前，缺少原角色喉部的厚重感。",
              "lost": 0.11160714285714286,
              "source_intervals": [
                [
                  698.0,
                  701.4
                ]
              ],
              "output_intervals": [
                [
                  699.13,
                  701.64
                ]
              ]
            },
            {
              "id": "S060.A_identity.2.identity",
              "reason": "使用了不同演员的声音（marta），与原角色Elsie不符。",
              "lost": 0.11160714285714286,
              "source_intervals": [
                [
                  698.0,
                  701.4
                ]
              ],
              "output_intervals": [
                [
                  699.13,
                  701.64
                ]
              ]
            },
            {
              "id": "S061.A_identity.2.pitch",
              "reason": "中文音高偏高且清晰，未体现源低沉含糊的极疲倦状态。",
              "lost": 0.11160714285714286,
              "source_intervals": [
                [
                  703.5,
                  706.8
                ]
              ],
              "output_intervals": [
                [
                  704.52,
                  705.9
                ]
              ]
            },
            {
              "id": "S061.A_identity.2.texture",
              "reason": "中文过于干净平滑，完全丢失了源明显的 vocal fry 和沙哑质感。",
              "lost": 0.11160714285714286,
              "source_intervals": [
                [
                  703.5,
                  706.8
                ]
              ],
              "output_intervals": [
                [
                  704.52,
                  705.9
                ]
              ]
            },
            {
              "id": "S061.A_identity.2.resonance",
              "reason": "中文共鸣正常，缺乏源声音因虚弱产生的喉部挤压感。",
              "lost": 0.11160714285714286,
              "source_intervals": [
                [
                  703.5,
                  706.8
                ]
              ],
              "output_intervals": [
                [
                  704.52,
                  705.9
                ]
              ]
            },
            {
              "id": "S061.A_identity.2.identity",
              "reason": "中文为普通女声，缺失源老妇人沙哑疲惫的音色，非同一人。",
              "lost": 0.11160714285714286,
              "source_intervals": [
                [
                  703.5,
                  706.8
                ]
              ],
              "output_intervals": [
                [
                  704.52,
                  705.9
                ]
              ]
            },
            {
              "id": "S001.E_events.occurrence",
              "reason": "源片段在指定时间窗口内无实际语音发生，属于空占位符。提交却将其记录为一次独立的发声事件并错误关联了另一处的台词内容，导致凭空捏造了不存在的源事件。",
              "lost": 0.03225806451612903,
              "source_intervals": [
                [
                  0.2,
                  1.88
                ]
              ],
              "output_intervals": []
            },
            {
              "id": "S001.E_events.window",
              "reason": "指定的时间窗口内仅有环境音和背景音乐，无任何说话人发声或屏幕动作事件。提交的窗口试图覆盖一个并不存在的语音事件，且其声称的内容实际发生在更晚的时间段。",
              "lost": 0.03225806451612903,
              "source_intervals": [
                [
                  0.2,
                  1.88
                ]
              ],
              "output_intervals": []
            },
            {
              "id": "S002.E_events.window",
              "reason": "提交窗口(1.06-3.3)早于源发声起点(约2.0)，存在明显时间错置。",
              "lost": 0.03225806451612903,
              "source_intervals": [
                [
                  2.04,
                  5.24
                ]
              ],
              "output_intervals": [
                [
                  1.06,
                  3.3
                ]
              ]
            },
            {
              "id": "S003.E_events.window",
              "reason": "提交的时间段(5.83-7.42)整体前移，未能对准源实际的发声窗口。",
              "lost": 0.03225806451612903,
              "source_intervals": [
                [
                  6.52,
                  8.48
                ]
              ],
              "output_intervals": [
                [
                  5.83,
                  7.42
                ]
              ]
            },
            {
              "id": "S004.E_events.window",
              "reason": "前半部分译文(7.98-9.66)早于源语音启动点(8.96)，造成时序混乱。",
              "lost": 0.03225806451612903,
              "source_intervals": [
                [
                  8.96,
                  10.64
                ]
              ],
              "output_intervals": [
                [
                  7.98,
                  9.66
                ]
              ]
            },
            {
              "id": "S010.E_events.occurrence",
              "reason": "源事件被拆分为两个子事件，导致原意丢失。",
              "lost": 0.03225806451612903,
              "source_intervals": [
                [
                  34.76,
                  37.08
                ]
              ],
              "output_intervals": [
                [
                  35.12,
                  36.19
                ],
                [
                  36.97,
                  38.45
                ]
              ]
            },
            {
              "id": "S010.E_events.window",
              "reason": "提交窗口未能覆盖实际源发声区间，存在明显截断。",
              "lost": 0.03225806451612903,
              "source_intervals": [
                [
                  34.76,
                  37.08
                ]
              ],
              "output_intervals": [
                [
                  35.12,
                  36.19
                ],
                [
                  36.97,
                  38.45
                ]
              ]
            },
            {
              "id": "S013.E_events.occurrence",
              "reason": "源事件包含Fan!和Ja!两句，提交仅记录Ja!，漏掉Fan!。",
              "lost": 0.03225806451612903,
              "source_intervals": [
                [
                  62.06,
                  63.84
                ]
              ],
              "output_intervals": [
                [
                  60.49,
                  61.65
                ]
              ]
            },
            {
              "id": "S013.E_events.window",
              "reason": "提交的事件窗口(60.49-61.65)完全未覆盖实际源发声区间(62.06-63.84)，存在明显的时序错置。",
              "lost": 0.03225806451612903,
              "source_intervals": [
                [
                  62.06,
                  63.84
                ]
              ],
              "output_intervals": [
                [
                  60.49,
                  61.65
                ]
              ]
            },
            {
              "id": "S014.E_events.occurrence",
              "reason": "源事件Jävla... ja, ja, ja!被拆分并错误归属给不同说话人，且部分文本丢失。",
              "lost": 0.03225806451612903,
              "source_intervals": [
                [
                  67.4,
                  69.4
                ]
              ],
              "output_intervals": [
                [
                  65.04,
                  66.28
                ],
                [
                  67.9,
                  68.92
                ],
                [
                  69.35,
                  70.14
                ]
              ]
            },
            {
              "id": "S014.E_events.window",
              "reason": "提交的事件窗口未能完整覆盖源发声时段，存在错位和遗漏。",
              "lost": 0.03225806451612903,
              "source_intervals": [
                [
                  67.4,
                  69.4
                ]
              ],
              "output_intervals": [
                [
                  65.04,
                  66.28
                ],
                [
                  67.9,
                  68.92
                ],
                [
                  69.35,
                  70.14
                ]
              ]
            }
          ],
          "pending": 0,
          "wer": {
            "reference_words": 421,
            "submitted_words": 425,
            "edit_distance": 159,
            "wer": 0.37767220902612825,
            "score": 0.6223277909738718
          },
          "score_lower_bound": 42.5579,
          "score_upper_bound": 42.5579,
          "voice_review": {
            "clips": [
              {
                "role": "Mette",
                "time": "6.52 秒",
                "source": "variant-results/case-40/sol/voice-review/mette-0-source.m4a",
                "output": "variant-results/case-40/sol/voice-review/mette-0-answer.m4a",
                "verdict": "no"
              },
              {
                "role": "Mette",
                "time": "708.80 秒",
                "source": "variant-results/case-40/sol/voice-review/mette-3-source.m4a",
                "output": "variant-results/case-40/sol/voice-review/mette-3-answer.m4a",
                "verdict": "no"
              },
              {
                "role": "Ida",
                "time": "62.06 秒",
                "source": "variant-results/case-40/sol/voice-review/ida-0-source.m4a",
                "output": "variant-results/case-40/sol/voice-review/ida-0-answer.m4a",
                "verdict": "no"
              },
              {
                "role": "Ida",
                "time": "588.76 秒",
                "source": "variant-results/case-40/sol/voice-review/ida-3-source.m4a",
                "output": "variant-results/case-40/sol/voice-review/ida-3-answer.m4a",
                "verdict": "no"
              }
            ]
          },
          "adjudication_summary": {
            "original_pending": 141,
            "majority_yes": 52,
            "majority_no": 89,
            "majority_3_lost_points": 4.823759849406197,
            "majority_3_lost_coefficient": 0.023655913978494623,
            "invalid_original_response_zero_lost_points": 0,
            "invalid_original_response_zero_lost_coefficient": 0,
            "invalid_new_response_zero_lost_points": 0,
            "invalid_new_response_zero_lost_coefficient": 0
          },
          "adjudication_method": "141条待判项三轮独立视听评审、多数票定案。哈尔德误标的原声样本剔除，使用同一场景两段确认对白复核。",
          "checklist_total": 1836,
          "checklist_resolved": 1836
        },
        "notes": "瑞典语听写 WER 37.8%。141 条待判项全部复评，52 条通过、89 条不通过。跨段稳定 6.25/15，原人物音色 13.5929/25。连续性台账仍有一处时间窗待核。"
      },
      "luna": {
        "state": "complete",
        "actions": 174,
        "milestones": [
          {
            "id": "item_18",
            "type": "command_execution",
            "exit_code": 0,
            "status": "completed",
            "tools": [
              "ffmpeg"
            ],
            "title": "校验电影和手机混音"
          },
          {
            "id": "item_19",
            "type": "command_execution",
            "exit_code": 0,
            "status": "completed",
            "tools": [
              "python3",
              "faster_whisper",
              "clone_voice"
            ],
            "title": "离线识别瑞典语对白"
          },
          {
            "id": "item_19",
            "type": "command_execution",
            "exit_code": 0,
            "status": "completed",
            "tools": [
              "python3",
              "faster_whisper",
              "clone_voice"
            ],
            "title": "试配并调整角色音色"
          },
          {
            "id": "item_22",
            "type": "command_execution",
            "exit_code": 0,
            "status": "completed",
            "tools": [
              "ffmpeg"
            ],
            "title": "抽帧核对角色与对白"
          },
          {
            "id": "item_51",
            "type": "command_execution",
            "exit_code": 0,
            "status": "completed",
            "tools": [
              "piper",
              "python3",
              "ffprobe"
            ],
            "title": "生成逐句普通话配音"
          },
          {
            "id": "item_71",
            "type": "command_execution",
            "exit_code": 0,
            "status": "completed",
            "tools": [
              "python3"
            ],
            "title": "编排译配计划与连续性记录"
          },
          {
            "id": "item_77",
            "type": "file_change",
            "status": "completed",
            "tools": [],
            "title": "生成或验证离线重建"
          },
          {
            "id": "item_110",
            "type": "command_execution",
            "exit_code": 0,
            "status": "completed",
            "tools": [
              "python3",
              "piper"
            ],
            "title": "渲染并检查成片"
          },
          {
            "id": "item_115",
            "type": "command_execution",
            "exit_code": 0,
            "status": "completed",
            "tools": [
              "python3"
            ],
            "title": "制作中瑞双语字幕"
          }
        ],
        "files": [
          {
            "name": "README.md",
            "path": "README.md",
            "url": "variant-results/case-40/luna/README.md",
            "kind": "document",
            "bytes": 2245
          },
          {
            "name": "transcript_sv.txt",
            "path": "transcript_sv.txt",
            "url": "variant-results/case-40/luna/transcript_sv.txt",
            "kind": "document",
            "bytes": 3420
          },
          {
            "name": "transcript_zh.txt",
            "path": "transcript_zh.txt",
            "url": "variant-results/case-40/luna/transcript_zh.txt",
            "kind": "document",
            "bytes": 3458
          },
          {
            "name": "subtitles_sv.srt",
            "path": "subtitles_sv.srt",
            "url": "variant-results/case-40/luna/subtitles_sv.srt",
            "kind": "document",
            "bytes": 5007
          },
          {
            "name": "subtitles_zh.srt",
            "path": "subtitles_zh.srt",
            "url": "variant-results/case-40/luna/subtitles_zh.srt",
            "kind": "document",
            "bytes": 5016
          },
          {
            "name": "bilingual.ass",
            "path": "bilingual.ass",
            "url": "variant-results/case-40/luna/bilingual.ass",
            "kind": "document",
            "bytes": 13471
          },
          {
            "name": "speakers.json",
            "path": "speakers.json",
            "url": "variant-results/case-40/luna/speakers.json",
            "kind": "document",
            "bytes": 731
          },
          {
            "name": "translation_plan.json",
            "path": "translation_plan.json",
            "url": "variant-results/case-40/luna/translation_plan.json",
            "kind": "document",
            "bytes": 35196
          },
          {
            "name": "continuity_ledger.json",
            "path": "continuity_ledger.json",
            "url": "variant-results/case-40/luna/continuity_ledger.json",
            "kind": "document",
            "bytes": 6618
          },
          {
            "name": "voice_provenance.json",
            "path": "voice_provenance.json",
            "url": "variant-results/case-40/luna/voice_provenance.json",
            "kind": "document",
            "bytes": 889
          },
          {
            "name": "rebuild.json",
            "path": "rebuild.json",
            "url": "variant-results/case-40/luna/rebuild.json",
            "kind": "document",
            "bytes": 168
          },
          {
            "name": "mobile_mix.m4a",
            "path": "mobile_mix.m4a",
            "url": "variant-results/case-40/luna/mobile_mix.m4a",
            "kind": "audio",
            "bytes": 8863108,
            "meta": {
              "duration": 720.0,
              "width": null,
              "height": null,
              "fps": "0/0",
              "sampleRate": "48000"
            }
          }
        ],
        "video": {
          "name": "dub_zh.mp4",
          "path": "dub_zh.mp4",
          "url": "variant-results/case-40/luna/dub_zh.mp4",
          "kind": "video",
          "bytes": 39161165,
          "meta": {
            "duration": 720.0,
            "width": 800,
            "height": 450,
            "fps": "25/1",
            "sampleRate": null
          }
        },
        "scoring": {
          "rows": [
            {
              "score": 0.0,
              "maximum": 8.0,
              "lower": 0.0,
              "upper": 0.0,
              "id": "E_words",
              "label": "瑞典语词序列准确性"
            },
            {
              "score": null,
              "maximum": 4.0,
              "lower": 2.322580645161291,
              "upper": 2.6129032258064524,
              "id": "E_events",
              "label": "源事件覆盖与粗定位"
            },
            {
              "score": null,
              "maximum": 3.0,
              "lower": 1.2162162162162178,
              "upper": 1.8851351351351378,
              "id": "E_roles",
              "label": "源说话人/声音实例归属"
            },
            {
              "score": null,
              "maximum": 5.0,
              "lower": 1.6733870967741946,
              "upper": 2.399193548387099,
              "id": "E_meaning",
              "label": "源语义与关键语气识别"
            },
            {
              "score": null,
              "maximum": 4.5,
              "lower": 1.422794117647058,
              "upper": 2.001838235294118,
              "id": "T_meaning",
              "label": "中文意义准确完整"
            },
            {
              "score": null,
              "maximum": 3.0,
              "lower": 2.419354838709673,
              "upper": 2.8306451612903176,
              "id": "T_natural",
              "label": "中文自然度"
            },
            {
              "score": null,
              "maximum": 1.5,
              "lower": 1.0403225806451606,
              "upper": 1.3064516129032244,
              "id": "T_terms",
              "label": "术语和称呼一致"
            },
            {
              "score": null,
              "maximum": 1.0,
              "lower": 0.5483870967741937,
              "upper": 0.6451612903225808,
              "id": "T_style",
              "label": "语体与语用功能"
            },
            {
              "score": null,
              "maximum": 25,
              "lower": 0.31906906906906896,
              "upper": 5.618196321321324,
              "id": "A_identity",
              "label": "原人物音色与身份保持"
            },
            {
              "score": null,
              "maximum": 15,
              "lower": 1.25,
              "upper": 10.0,
              "id": "A_stable",
              "label": "同人物跨段声音一致性"
            },
            {
              "score": null,
              "maximum": 15,
              "lower": 1.451612903225807,
              "upper": 3.145161290322579,
              "id": "A_prosody",
              "label": "情绪语气与表演保持"
            },
            {
              "score": null,
              "maximum": 10,
              "lower": 4.816176470588234,
              "upper": 5.477941176470584,
              "id": "A_content",
              "label": "实际中文内容忠实度"
            },
            {
              "score": null,
              "maximum": 5,
              "lower": 3.758064516129034,
              "upper": 3.951612903225811,
              "id": "A_quality",
              "label": "自然度清晰度与双版本混音"
            },
            {
              "score": 0.5999999999999999,
              "maximum": 0.6,
              "lower": 0.5999999999999999,
              "upper": 0.5999999999999999,
              "id": "V_frames",
              "label": "原画面内容与顺序"
            },
            {
              "score": 0.2,
              "maximum": 0.2,
              "lower": 0.2,
              "upper": 0.2,
              "id": "V_timeline",
              "label": "时间线完整性"
            },
            {
              "score": null,
              "maximum": 0.2,
              "lower": 0.10860215053763457,
              "upper": 0.16774193548387106,
              "id": "V_display",
              "label": "声画时机与字幕呈现"
            }
          ],
          "groups": {
            "E": {
              "maximum": 20,
              "lower": 5.212183958151703,
              "upper": 6.897231909328689,
              "id": "E",
              "label": "E"
            },
            "T": {
              "maximum": 10,
              "lower": 5.430858633776086,
              "upper": 6.784096299810241,
              "id": "T",
              "label": "T"
            },
            "A": {
              "maximum": 70,
              "lower": 11.594922959012143,
              "upper": 28.1929116913403,
              "id": "A",
              "label": "A"
            },
            "V": {
              "maximum": 1,
              "lower": 0.9086021505376345,
              "upper": 0.967741935483871,
              "id": "V",
              "label": "V"
            }
          },
          "coefficient": null,
          "gates": {
            "source_event_accounting": {
              "pass": false,
              "evidence": {
                "accounted": 1,
                "required": 62,
                "invalid_events": [
                  "E001",
                  "E002",
                  "E003",
                  "E004",
                  "E005",
                  "E006",
                  "E007",
                  "E008",
                  "E009",
                  "E010",
                  "E011",
                  "E012",
                  "E013",
                  "E014",
                  "E015",
                  "E016",
                  "E017",
                  "E018",
                  "E019",
                  "E020",
                  "E021",
                  "E022",
                  "E023",
                  "E024",
                  "E025",
                  "E026",
                  "E027",
                  "E028",
                  "E029",
                  "E030",
                  "E031",
                  "E032",
                  "E033",
                  "E034",
                  "E035",
                  "E036",
                  "E037",
                  "E038",
                  "E039",
                  "E040",
                  "E041",
                  "E042",
                  "E043",
                  "E044",
                  "E045",
                  "E046",
                  "E047",
                  "E048",
                  "E049",
                  "E050",
                  "E051",
                  "E052",
                  "E053",
                  "E054",
                  "E055",
                  "E056",
                  "E057",
                  "E058",
                  "E059",
                  "E060",
                  "E061",
                  "E062",
                  "E063",
                  "E064",
                  "E065",
                  "E066",
                  "E067",
                  "E068",
                  "E069",
                  "E070",
                  "E071",
                  "E072",
                  "E073",
                  "E074",
                  "E075",
                  "E077",
                  "E078",
                  "E079",
                  "E080",
                  "E081",
                  "E082",
                  "E083",
                  "E084",
                  "E085"
                ],
                "unsplit_mixed_references": []
              }
            },
            "role_voice_inside_plan": {
              "pass": false,
              "evidence": {
                "outside_fraction_by_role": {
                  "METTE": 0.19221122112211164,
                  "HARALD": 0.002631578947367802,
                  "ELSIE": 0.12327044025157029,
                  "MARTA": 0.3026196928635996
                },
                "maximum": 0.03
              }
            },
            "continuity_ledger": {
              "pass": null,
              "evidence": {
                "reason": "字段、事件索引覆盖、最低证据数等公开结构要求均满足。旧失败仅来自每个S都须与私有字幕粗时间窗相交；题面未明确这一精确验收条件，且源时间标注未经校准。因此保留诊断、待源证据核验，不作确定硬门槛失败。跨段语义仍由冻结H类QA评审。",
                "explicit_structural_contract_passed": true,
                "structural_issues": [],
                "private_subtitle_window_diagnostic": [
                  {
                    "challenge_id": "C01",
                    "source_ids_without_private_subtitle_window_overlap": [
                      "S004",
                      "S009"
                    ],
                    "submitted_evidence_intervals": [
                      [
                        11.16,
                        13.44
                      ],
                      [
                        16.28,
                        17.8
                      ],
                      [
                        25.82,
                        28.24
                      ],
                      [
                        37.06,
                        41.84
                      ]
                    ]
                  },
                  {
                    "challenge_id": "C02",
                    "source_ids_without_private_subtitle_window_overlap": [
                      "S013",
                      "S014"
                    ],
                    "submitted_evidence_intervals": [
                      [
                        45.88,
                        46.44
                      ]
                    ]
                  },
                  {
                    "challenge_id": "C03",
                    "source_ids_without_private_subtitle_window_overlap": [
                      "S016"
                    ],
                    "submitted_evidence_intervals": [
                      [
                        102.26,
                        110.46
                      ],
                      [
                        116.02,
                        119.78
                      ],
                      [
                        144.92,
                        147.86
                      ]
                    ]
                  },
                  {
                    "challenge_id": "C05",
                    "source_ids_without_private_subtitle_window_overlap": [
                      "S035"
                    ],
                    "submitted_evidence_intervals": [
                      [
                        340.08,
                        348.14
                      ],
                      [
                        364.38,
                        368.82
                      ]
                    ]
                  }
                ],
                "original_automatic_gate": {
                  "pass": false,
                  "evidence": {
                    "passed": false,
                    "valid_records": 4,
                    "expected_records": 8,
                    "issues": [
                      "C01",
                      "C02",
                      "C03",
                      "C05"
                    ]
                  }
                }
              }
            },
            "subtitle_layout": {
              "pass": false,
              "evidence": {
                "compliant": 162,
                "total": 171
              }
            },
            "offline_rebuild": {
              "pass": false,
              "evidence": {
                "exit": 0,
                "output_present": true,
                "video_mae": 0.0,
                "audio_correlation": 0.0892025250030563
              }
            },
            "critical_S004.A_content.critical": {
              "pass": false,
              "evidence": {
                "id": "S004.A_content.critical",
                "answer": "no",
                "reason": "源句包含“十年”与“一晚开花后死亡”，中文仅译出前半部分，后半关键信息缺失。",
                "source_intervals": [
                  [
                    8.96,
                    10.64
                  ]
                ],
                "output_intervals": [
                  [
                    8.18,
                    9.54
                  ]
                ],
                "votes": [
                  {
                    "id": "S004.A_content.critical",
                    "answer": "no",
                    "reason": "源句包含“十年”与“一晚开花后死亡”，中文仅译出前半部分，后半关键信息缺失。",
                    "source_intervals": [
                      [
                        8.96,
                        10.64
                      ]
                    ],
                    "output_intervals": [
                      [
                        8.18,
                        9.54
                      ]
                    ]
                  },
                  {
                    "id": "S004.A_content.critical",
                    "answer": "no",
                    "reason": "源句含“十年”与“一晚”，中文仅译出“要等十年”，漏掉后半句关键信息。",
                    "source_intervals": [
                      [
                        8.96,
                        10.64
                      ]
                    ],
                    "output_intervals": [
                      [
                        8.18,
                        9.54
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S008.A_content.critical": {
              "pass": false,
              "evidence": {
                "id": "S008.A_content.critical",
                "answer": "no",
                "reason": "源为疑问句，译文变陈述且人称由你改为他，语义完全反转。",
                "source_intervals": [
                  [
                    25.96,
                    29.28
                  ]
                ],
                "output_intervals": [
                  [
                    25.82,
                    28.24
                  ]
                ],
                "votes": [
                  {
                    "id": "S008.A_content.critical",
                    "answer": "no",
                    "reason": "源为疑问句，译文变陈述且人称由你改为他，语义完全反转。",
                    "source_intervals": [
                      [
                        25.96,
                        29.28
                      ]
                    ],
                    "output_intervals": [
                      [
                        25.82,
                        28.24
                      ]
                    ]
                  },
                  {
                    "id": "S008.A_content.critical",
                    "answer": "no",
                    "reason": "源为疑问句，译文变陈述句且将第二人称改第三人称，语义反转。",
                    "source_intervals": [
                      [
                        25.96,
                        29.28
                      ]
                    ],
                    "output_intervals": [
                      [
                        25.71,
                        29.53
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S009.A_content.critical": {
              "pass": false,
              "evidence": {
                "id": "S009.A_content.critical",
                "answer": "no",
                "reason": "源句意为“差不多二十四”，中文错译为“最早种下”，擅自补全错误信息。",
                "source_intervals": [
                  [
                    30.92,
                    34.16
                  ]
                ],
                "output_intervals": [
                  [
                    30.36,
                    33.1
                  ]
                ],
                "votes": [
                  {
                    "id": "S009.A_content.critical",
                    "answer": "no",
                    "reason": "源句意为“差不多二十四”，中文错译为“最早种下”，擅自补全错误信息。",
                    "source_intervals": [
                      [
                        30.92,
                        34.16
                      ]
                    ],
                    "output_intervals": [
                      [
                        30.36,
                        33.1
                      ]
                    ]
                  },
                  {
                    "id": "S009.A_content.critical",
                    "answer": "no",
                    "reason": "实际发音将“不同植物”错读为“最早种下”，语义被篡改。",
                    "source_intervals": [
                      [
                        30.92,
                        34.16
                      ]
                    ],
                    "output_intervals": [
                      [
                        30.36,
                        33.1
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S012.A_content.critical": {
              "pass": false,
              "evidence": {
                "id": "S012.A_content.critical",
                "answer": "no",
                "reason": "源句“我不这么觉得”被篡改为反问“你真这么觉得”，语义完全反转。",
                "source_intervals": [
                  [
                    46.2,
                    47.96
                  ]
                ],
                "output_intervals": [
                  [
                    45.88,
                    46.44
                  ]
                ],
                "votes": [
                  {
                    "id": "S012.A_content.critical",
                    "answer": "no",
                    "reason": "源句“我不这么觉得”被篡改为反问“你真这么觉得”，语义完全反转。",
                    "source_intervals": [
                      [
                        46.2,
                        47.96
                      ]
                    ],
                    "output_intervals": [
                      [
                        45.88,
                        46.44
                      ]
                    ]
                  },
                  {
                    "id": "S012.A_content.critical",
                    "answer": "no",
                    "reason": "源句为“我不这么觉得”，译文误作反问“你真这么觉得？”，语义完全反转。",
                    "source_intervals": [
                      [
                        44.16,
                        47.96
                      ]
                    ],
                    "output_intervals": [
                      [
                        44.08,
                        46.44
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S012.V_display.burned": {
              "pass": false,
              "evidence": {
                "id": "S012.V_display.burned",
                "answer": "no",
                "reason": "影院版画面只显示你真这么觉得，缺少对应瑞典语字幕",
                "source_intervals": [
                  [
                    46.553,
                    46.554
                  ]
                ],
                "output_intervals": [
                  [
                    46.553,
                    46.554
                  ]
                ],
                "votes": [
                  {
                    "id": "S012.V_display.burned",
                    "answer": "no",
                    "reason": "影院版画面只显示你真这么觉得，缺少对应瑞典语字幕",
                    "source_intervals": [
                      [
                        46.553,
                        46.554
                      ]
                    ],
                    "output_intervals": [
                      [
                        46.553,
                        46.554
                      ]
                    ]
                  },
                  {
                    "id": "S012.V_display.burned",
                    "answer": "pending",
                    "reason": "Judge transport/format/evidence failure: Expecting ',' delimiter: line 1 column 273 (char 272)",
                    "source_intervals": [],
                    "output_intervals": []
                  },
                  {
                    "id": "S012.V_display.burned",
                    "answer": "no",
                    "reason": "影院帧只显示你真这么觉得，画面中缺少对应瑞文字幕",
                    "source_intervals": [
                      [
                        46.2,
                        46.553
                      ]
                    ],
                    "output_intervals": [
                      [
                        46.2,
                        46.553
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S014.A_content.critical": {
              "pass": false,
              "evidence": {
                "id": "S014.A_content.critical",
                "answer": "no",
                "reason": "源句为肯定语气“ja”，提交译为否定“不要”，语义完全反转。",
                "source_intervals": [
                  [
                    67.4,
                    69.4
                  ]
                ],
                "output_intervals": [
                  [
                    71.22,
                    74.02
                  ]
                ],
                "votes": [
                  {
                    "id": "S014.A_content.critical",
                    "answer": "no",
                    "reason": "源句为肯定语气“ja”，提交译为否定“不要”，语义完全反转。",
                    "source_intervals": [
                      [
                        67.4,
                        69.4
                      ]
                    ],
                    "output_intervals": [
                      [
                        71.22,
                        74.02
                      ]
                    ]
                  },
                  {
                    "id": "S014.A_content.critical",
                    "answer": "no",
                    "reason": "源句为肯定语气“Jävla... ja”，被错译为否定含义“不要”。",
                    "source_intervals": [
                      [
                        67.4,
                        69.4
                      ]
                    ],
                    "output_intervals": [
                      [
                        71.22,
                        74.02
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S016.A_content.spoken": {
              "pass": false,
              "evidence": {
                "id": "S016.A_content.spoken",
                "answer": "no",
                "reason": "中文音频实际说出的是“记住”和“说话”，并未包含源句的核心意思（问候与呼唤名字）。",
                "source_intervals": [
                  [
                    92.06,
                    93.891
                  ]
                ],
                "output_intervals": [
                  [
                    90.82,
                    94.94
                  ]
                ],
                "votes": [
                  {
                    "id": "S016.A_content.spoken",
                    "answer": "no",
                    "reason": "中文音频实际说出的是“记住”和“说话”，并未包含源句的核心意思（问候与呼唤名字）。",
                    "source_intervals": [
                      [
                        92.06,
                        93.891
                      ]
                    ],
                    "output_intervals": [
                      [
                        90.82,
                        94.94
                      ]
                    ]
                  },
                  {
                    "id": "S016.A_content.spoken",
                    "answer": "no",
                    "reason": "音频中实际发出的是错误的中文内容，未包含源句的核心意思（问候）。",
                    "source_intervals": [
                      [
                        92.06,
                        93.89
                      ]
                    ],
                    "output_intervals": [
                      [
                        91.51,
                        94.97
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S016.A_content.critical": {
              "pass": false,
              "evidence": {
                "id": "S016.A_content.critical",
                "answer": "no",
                "reason": "源句为“早安！玛尔塔”，提交内容却译为“记住”和“说话”，完全丢失了原意。",
                "source_intervals": [
                  [
                    92.06,
                    93.891
                  ]
                ],
                "output_intervals": [
                  [
                    90.82,
                    94.94
                  ]
                ],
                "votes": [
                  {
                    "id": "S016.A_content.critical",
                    "answer": "no",
                    "reason": "源句为“早安！玛尔塔”，提交内容却译为“记住”和“说话”，完全丢失了原意。",
                    "source_intervals": [
                      [
                        92.06,
                        93.891
                      ]
                    ],
                    "output_intervals": [
                      [
                        90.82,
                        94.94
                      ]
                    ]
                  },
                  {
                    "id": "S016.A_content.critical",
                    "answer": "no",
                    "reason": "源句为问候语“早安！玛尔塔”，中文却译为指令“记住”和“说话”，语义完全错误。",
                    "source_intervals": [
                      [
                        92.06,
                        93.89
                      ]
                    ],
                    "output_intervals": [
                      [
                        91.51,
                        94.97
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S017.V_display.burned": {
              "pass": false,
              "evidence": {
                "id": "S017.V_display.burned",
                "answer": "no",
                "reason": "影院版问候段的护工侧脸采样帧未显示中瑞字幕",
                "source_intervals": [
                  [
                    106.367,
                    106.368
                  ]
                ],
                "output_intervals": [
                  [
                    106.367,
                    106.368
                  ]
                ],
                "votes": [
                  {
                    "id": "S017.V_display.burned",
                    "answer": "no",
                    "reason": "影院版问候段的护工侧脸采样帧未显示中瑞字幕",
                    "source_intervals": [
                      [
                        106.367,
                        106.368
                      ]
                    ],
                    "output_intervals": [
                      [
                        106.367,
                        106.368
                      ]
                    ]
                  },
                  {
                    "id": "S017.V_display.burned",
                    "answer": "pending",
                    "reason": "影院抽帧未见字幕，两次问候的字幕呈现均无法核对",
                    "source_intervals": [],
                    "output_intervals": []
                  },
                  {
                    "id": "S017.V_display.burned",
                    "answer": "no",
                    "reason": "影院版在问候字幕参考时段的采样帧缺少中瑞两行字幕",
                    "source_intervals": [
                      [
                        106.367,
                        106.368
                      ]
                    ],
                    "output_intervals": [
                      [
                        106.367,
                        106.368
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S019.A_content.spoken": {
              "pass": false,
              "evidence": {
                "id": "S019.A_content.spoken",
                "answer": "no",
                "reason": "源角色的核心反问内容未被配音演绎，仅有前半句对话，属于实质性遗漏。",
                "source_intervals": [
                  [
                    117.22,
                    123.32
                  ]
                ],
                "output_intervals": [
                  [
                    116.02,
                    119.78
                  ]
                ],
                "votes": [
                  {
                    "id": "S019.A_content.spoken",
                    "answer": "no",
                    "reason": "源角色的核心反问内容未被配音演绎，仅有前半句对话，属于实质性遗漏。",
                    "source_intervals": [
                      [
                        117.22,
                        123.32
                      ]
                    ],
                    "output_intervals": [
                      [
                        116.02,
                        119.78
                      ]
                    ]
                  },
                  {
                    "id": "S019.A_content.spoken",
                    "answer": "no",
                    "reason": "仅听到前半句翻译，核心反问未实际发声",
                    "source_intervals": [
                      [
                        119.3,
                        123.32
                      ]
                    ],
                    "output_intervals": [
                      [
                        119.0,
                        119.78
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S019.A_content.critical": {
              "pass": false,
              "evidence": {
                "id": "S019.A_content.critical",
                "answer": "no",
                "reason": "严重漏译：源句后半部分“我该感到害怕还是荣幸？”未在音频中出现，导致信息缺失。",
                "source_intervals": [
                  [
                    117.22,
                    123.32
                  ]
                ],
                "output_intervals": [
                  [
                    116.02,
                    119.78
                  ]
                ],
                "votes": [
                  {
                    "id": "S019.A_content.critical",
                    "answer": "no",
                    "reason": "严重漏译：源句后半部分“我该感到害怕还是荣幸？”未在音频中出现，导致信息缺失。",
                    "source_intervals": [
                      [
                        117.22,
                        123.32
                      ]
                    ],
                    "output_intervals": [
                      [
                        116.02,
                        119.78
                      ]
                    ]
                  },
                  {
                    "id": "S019.A_content.critical",
                    "answer": "no",
                    "reason": "源句后半部分反问内容在输出中完全缺失",
                    "source_intervals": [
                      [
                        119.3,
                        123.32
                      ]
                    ],
                    "output_intervals": [
                      [
                        119.0,
                        119.78
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S019.V_display.burned": {
              "pass": false,
              "evidence": {
                "id": "S019.V_display.burned",
                "answer": "no",
                "reason": "影院版护工微笑回应的采样帧未显示中瑞字幕",
                "source_intervals": [
                  [
                    120.247,
                    120.248
                  ]
                ],
                "output_intervals": [
                  [
                    120.247,
                    120.248
                  ]
                ],
                "votes": [
                  {
                    "id": "S019.V_display.burned",
                    "answer": "no",
                    "reason": "影院版护工微笑回应的采样帧未显示中瑞字幕",
                    "source_intervals": [
                      [
                        120.247,
                        120.248
                      ]
                    ],
                    "output_intervals": [
                      [
                        120.247,
                        120.248
                      ]
                    ]
                  },
                  {
                    "id": "S019.V_display.burned",
                    "answer": "pending",
                    "reason": "影院在护工微笑处的抽帧无字幕，未采到两轮对白的字幕",
                    "source_intervals": [],
                    "output_intervals": []
                  },
                  {
                    "id": "S019.V_display.burned",
                    "answer": "no",
                    "reason": "影院版在梦境对话字幕参考时段的采样帧缺少中瑞两行字幕",
                    "source_intervals": [
                      [
                        120.247,
                        120.248
                      ]
                    ],
                    "output_intervals": [
                      [
                        120.247,
                        120.248
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S023.A_content.spoken": {
              "pass": false,
              "evidence": {
                "id": "S023.A_content.spoken",
                "answer": "no",
                "reason": "老年女性的拒绝理由（我很干净）未在音频中实际播出。",
                "source_intervals": [
                  [
                    145.72,
                    149.68
                  ]
                ],
                "output_intervals": [
                  [
                    144.92,
                    150.0
                  ]
                ],
                "votes": [
                  {
                    "id": "S023.A_content.spoken",
                    "answer": "no",
                    "reason": "老年女性的拒绝理由（我很干净）未在音频中实际播出。",
                    "source_intervals": [
                      [
                        145.72,
                        149.68
                      ]
                    ],
                    "output_intervals": [
                      [
                        144.92,
                        150.0
                      ]
                    ]
                  },
                  {
                    "id": "S023.A_content.spoken",
                    "answer": "no",
                    "reason": "关键台词未被配音，仅有短促的拒绝和无关感叹。",
                    "source_intervals": [
                      [
                        145.72,
                        149.68
                      ]
                    ],
                    "output_intervals": [
                      [
                        144.92,
                        150.0
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S023.A_content.critical": {
              "pass": false,
              "evidence": {
                "id": "S023.A_content.critical",
                "answer": "no",
                "reason": "严重漏译：源句包含“我很干净”，输出完全缺失该关键信息。",
                "source_intervals": [
                  [
                    145.72,
                    149.68
                  ]
                ],
                "output_intervals": [
                  [
                    144.92,
                    150.0
                  ]
                ],
                "votes": [
                  {
                    "id": "S023.A_content.critical",
                    "answer": "no",
                    "reason": "严重漏译：源句包含“我很干净”，输出完全缺失该关键信息。",
                    "source_intervals": [
                      [
                        145.72,
                        149.68
                      ]
                    ],
                    "output_intervals": [
                      [
                        144.92,
                        150.0
                      ]
                    ]
                  },
                  {
                    "id": "S023.A_content.critical",
                    "answer": "no",
                    "reason": "缺失“我很干净”的核心回应，导致对话逻辑断裂。",
                    "source_intervals": [
                      [
                        145.72,
                        149.68
                      ]
                    ],
                    "output_intervals": [
                      [
                        144.92,
                        150.0
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S024.A_content.critical": {
              "pass": false,
              "evidence": {
                "id": "S024.A_content.critical",
                "answer": "no",
                "reason": "漏译了后半段条件承诺内容，导致语义不完整。",
                "source_intervals": [
                  [
                    246.88,
                    249.76
                  ]
                ],
                "output_intervals": [
                  [
                    246.82,
                    254.52
                  ]
                ],
                "votes": [
                  {
                    "id": "S024.A_content.critical",
                    "answer": "no",
                    "reason": "漏译了后半段条件承诺内容，导致语义不完整。",
                    "source_intervals": [
                      [
                        246.88,
                        249.76
                      ]
                    ],
                    "output_intervals": [
                      [
                        246.82,
                        254.52
                      ]
                    ]
                  },
                  {
                    "id": "S024.A_content.critical",
                    "answer": "yes",
                    "reason": "实际配音完整保留了否定、关系及条件，未反转或擅自补全信息。",
                    "source_intervals": [
                      [
                        246.88,
                        249.76
                      ]
                    ],
                    "output_intervals": [
                      [
                        246.82,
                        254.52
                      ]
                    ]
                  },
                  {
                    "id": "S024.A_content.critical",
                    "answer": "no",
                    "reason": "实际音频只读了前半句指责，漏读后半句条件承诺内容。",
                    "source_intervals": [
                      [
                        246.88,
                        249.76
                      ]
                    ],
                    "output_intervals": [
                      [
                        246.82,
                        254.52
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S028.V_display.burned": {
              "pass": false,
              "evidence": {
                "id": "S028.V_display.burned",
                "answer": "no",
                "reason": "影院版在该句对应的两帧中均未显示中文或瑞典语字幕",
                "source_intervals": [
                  [
                    270.5,
                    272.0
                  ]
                ],
                "output_intervals": [
                  [
                    270.5,
                    272.0
                  ]
                ],
                "votes": [
                  {
                    "id": "S028.V_display.burned",
                    "answer": "no",
                    "reason": "影院版在该句对应的两帧中均未显示中文或瑞典语字幕",
                    "source_intervals": [
                      [
                        270.5,
                        272.0
                      ]
                    ],
                    "output_intervals": [
                      [
                        270.5,
                        272.0
                      ]
                    ]
                  },
                  {
                    "id": "S028.V_display.burned",
                    "answer": "no",
                    "reason": "影院版在该句时段内的两帧均未显示中文或瑞典语字幕",
                    "source_intervals": [
                      [
                        270.5,
                        272.0
                      ]
                    ],
                    "output_intervals": [
                      [
                        270.5,
                        272.0
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S030.A_quality.mobile": {
              "pass": false,
              "evidence": {
                "id": "S030.A_quality.mobile",
                "answer": "no",
                "reason": "手机单声道版同样使用老年男声配年轻女角，性别年龄完全不符。",
                "source_intervals": [
                  [
                    318.44,
                    320.44
                  ]
                ],
                "output_intervals": [
                  [
                    317.42,
                    318.82
                  ]
                ],
                "votes": [
                  {
                    "id": "S030.A_quality.mobile",
                    "answer": "no",
                    "reason": "手机单声道版同样使用老年男声配年轻女角，性别年龄完全不符。",
                    "source_intervals": [
                      [
                        318.44,
                        320.44
                      ]
                    ],
                    "output_intervals": [
                      [
                        317.42,
                        318.82
                      ]
                    ]
                  },
                  {
                    "id": "S030.A_quality.mobile",
                    "answer": "no",
                    "reason": "手机版同样存在“哪儿”读音含混问题，短句清晰度受损。",
                    "source_intervals": [
                      [
                        318.44,
                        320.44
                      ]
                    ],
                    "output_intervals": [
                      [
                        317.42,
                        318.82
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S031.A_content.spoken": {
              "pass": false,
              "evidence": {
                "id": "S031.A_content.spoken",
                "answer": "no",
                "reason": "核心意思虽已发声，但因翻译错误导致传达的信息与源意完全相反。",
                "source_intervals": [
                  [
                    340.24,
                    345.78
                  ]
                ],
                "output_intervals": [
                  [
                    340.08,
                    345.64
                  ]
                ],
                "votes": [
                  {
                    "id": "S031.A_content.spoken",
                    "answer": "no",
                    "reason": "核心意思虽已发声，但因翻译错误导致传达的信息与源意完全相反。",
                    "source_intervals": [
                      [
                        340.24,
                        345.78
                      ]
                    ],
                    "output_intervals": [
                      [
                        340.08,
                        345.64
                      ]
                    ]
                  },
                  {
                    "id": "S031.A_content.spoken",
                    "answer": "no",
                    "reason": "园丁台词被错误翻译并配音为关于进食的内容，核心信息缺失。",
                    "source_intervals": [
                      [
                        340.24,
                        345.78
                      ]
                    ],
                    "output_intervals": [
                      [
                        340.08,
                        345.64
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S031.A_content.critical": {
              "pass": false,
              "evidence": {
                "id": "S031.A_content.critical",
                "answer": "no",
                "reason": "源句“没怎么睡”被错译为“吃得不多”，语义发生根本性反转错误。",
                "source_intervals": [
                  [
                    340.24,
                    345.78
                  ]
                ],
                "output_intervals": [
                  [
                    340.08,
                    345.64
                  ]
                ],
                "votes": [
                  {
                    "id": "S031.A_content.critical",
                    "answer": "no",
                    "reason": "源句“没怎么睡”被错译为“吃得不多”，语义发生根本性反转错误。",
                    "source_intervals": [
                      [
                        340.24,
                        345.78
                      ]
                    ],
                    "output_intervals": [
                      [
                        340.08,
                        345.64
                      ]
                    ]
                  },
                  {
                    "id": "S031.A_content.critical",
                    "answer": "no",
                    "reason": "源句意为“没怎么睡”，译文错译为“吃得不多”，语义完全反转。",
                    "source_intervals": [
                      [
                        340.24,
                        345.78
                      ]
                    ],
                    "output_intervals": [
                      [
                        340.08,
                        345.64
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S032.A_content.spoken": {
              "pass": false,
              "evidence": {
                "id": "S032.A_content.spoken",
                "answer": "no",
                "reason": "核心意思错译导致信息失真，且Mette的回应也变成无关内容。",
                "source_intervals": [
                  [
                    345.2,
                    348.32
                  ]
                ],
                "output_intervals": [
                  [
                    344.76,
                    348.14
                  ]
                ],
                "votes": [
                  {
                    "id": "S032.A_content.spoken",
                    "answer": "yes",
                    "reason": "核心意思已实际发声，虽翻译错误但非仅停留在文本。",
                    "source_intervals": [
                      [
                        345.2,
                        348.32
                      ]
                    ],
                    "output_intervals": [
                      [
                        344.76,
                        348.14
                      ]
                    ]
                  },
                  {
                    "id": "S032.A_content.spoken",
                    "answer": "no",
                    "reason": "核心意思错译导致信息失真，且Mette的回应也变成无关内容。",
                    "source_intervals": [
                      [
                        345.2,
                        348.32
                      ]
                    ],
                    "output_intervals": [
                      [
                        344.76,
                        348.14
                      ]
                    ]
                  },
                  {
                    "id": "S032.A_content.spoken",
                    "answer": "no",
                    "reason": "核心意思缺失：园丁的回答被译错，导致关键信息不可听。",
                    "source_intervals": [
                      [
                        345.2,
                        348.32
                      ]
                    ],
                    "output_intervals": [
                      [
                        344.76,
                        348.14
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S032.A_content.critical": {
              "pass": false,
              "evidence": {
                "id": "S032.A_content.critical",
                "answer": "no",
                "reason": "源意“没怎么睡”被错译为“吃得不多”，语义严重反转。",
                "source_intervals": [
                  [
                    345.2,
                    348.32
                  ]
                ],
                "output_intervals": [
                  [
                    344.76,
                    348.14
                  ]
                ],
                "votes": [
                  {
                    "id": "S032.A_content.critical",
                    "answer": "no",
                    "reason": "源意“没怎么睡”被错译为“吃得不多”，语义严重反转。",
                    "source_intervals": [
                      [
                        345.2,
                        348.32
                      ]
                    ],
                    "output_intervals": [
                      [
                        344.76,
                        348.14
                      ]
                    ]
                  },
                  {
                    "id": "S032.A_content.critical",
                    "answer": "no",
                    "reason": "语义严重错误：源意“没怎么睡”被译为“吃得不多”，逻辑不通。",
                    "source_intervals": [
                      [
                        345.2,
                        346.8
                      ]
                    ],
                    "output_intervals": [
                      [
                        344.76,
                        345.64
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S032.A_quality.mobile": {
              "pass": false,
              "evidence": {
                "id": "S032.A_quality.mobile",
                "answer": "no",
                "reason": "手机版同样存在严重译文错误（把sleep译成eat），短句不可正确理解。",
                "source_intervals": [
                  [
                    345.2,
                    348.32
                  ]
                ],
                "output_intervals": [
                  [
                    344.76,
                    348.14
                  ]
                ],
                "votes": [
                  {
                    "id": "S032.A_quality.mobile",
                    "answer": "no",
                    "reason": "手机版同样存在严重译文错误（把sleep译成eat），短句不可正确理解。",
                    "source_intervals": [
                      [
                        345.2,
                        348.32
                      ]
                    ],
                    "output_intervals": [
                      [
                        344.76,
                        348.14
                      ]
                    ]
                  },
                  {
                    "id": "S032.A_quality.mobile",
                    "answer": "yes",
                    "reason": "手机单声道版保留完整中文及必要音效短句依然可懂。",
                    "source_intervals": [
                      [
                        345.2,
                        348.32
                      ]
                    ],
                    "output_intervals": [
                      [
                        344.76,
                        348.14
                      ]
                    ]
                  },
                  {
                    "id": "S032.A_quality.mobile",
                    "answer": "no",
                    "reason": "手机版同样存在严重误译，且未保留必要环境音效。",
                    "source_intervals": [
                      [
                        345.2,
                        348.32
                      ]
                    ],
                    "output_intervals": [
                      [
                        345.2,
                        348.32
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S033.A_content.spoken": {
              "pass": false,
              "evidence": {
                "id": "S033.A_content.spoken",
                "answer": "no",
                "reason": "对应时间段内无任何中文语音发声，核心意思未能实际可听",
                "source_intervals": [
                  [
                    360.04,
                    365.12
                  ]
                ],
                "output_intervals": [
                  [
                    358.04,
                    364.38
                  ]
                ],
                "votes": [
                  {
                    "id": "S033.A_content.spoken",
                    "answer": "no",
                    "reason": "对应时间段内无任何中文语音发声，核心意思未能实际可听",
                    "source_intervals": [
                      [
                        360.04,
                        365.12
                      ]
                    ],
                    "output_intervals": [
                      [
                        358.04,
                        364.38
                      ]
                    ]
                  },
                  {
                    "id": "S033.A_content.spoken",
                    "answer": "no",
                    "reason": "对应时间段内无中文语音发声，核心意思不可听。",
                    "source_intervals": [
                      [
                        360.04,
                        365.12
                      ]
                    ],
                    "output_intervals": [
                      [
                        360.04,
                        365.12
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S033.A_content.critical": {
              "pass": false,
              "evidence": {
                "id": "S033.A_content.critical",
                "answer": "no",
                "reason": "源句Mette的调侃台词在输出中完全缺失，未保留任何语义内容",
                "source_intervals": [
                  [
                    360.04,
                    365.12
                  ]
                ],
                "output_intervals": [
                  [
                    358.04,
                    364.38
                  ]
                ],
                "votes": [
                  {
                    "id": "S033.A_content.critical",
                    "answer": "no",
                    "reason": "源句Mette的调侃台词在输出中完全缺失，未保留任何语义内容",
                    "source_intervals": [
                      [
                        360.04,
                        365.12
                      ]
                    ],
                    "output_intervals": [
                      [
                        358.04,
                        364.38
                      ]
                    ]
                  },
                  {
                    "id": "S033.A_content.critical",
                    "answer": "no",
                    "reason": "源句Mette的两句调侃台词在输出中完全缺失，未保留任何语义内容。",
                    "source_intervals": [
                      [
                        360.04,
                        365.12
                      ]
                    ],
                    "output_intervals": [
                      [
                        360.04,
                        365.12
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S033.A_quality.mobile": {
              "pass": false,
              "evidence": {
                "id": "S033.A_quality.mobile",
                "answer": "no",
                "reason": "手机单声道版同样缺失该段源句的中文配音",
                "source_intervals": [
                  [
                    360.04,
                    365.12
                  ]
                ],
                "output_intervals": [
                  [
                    360.04,
                    365.12
                  ]
                ],
                "votes": [
                  {
                    "id": "S033.A_quality.mobile",
                    "answer": "no",
                    "reason": "手机单声道版同样缺失该段源句的中文配音",
                    "source_intervals": [
                      [
                        360.04,
                        365.12
                      ]
                    ],
                    "output_intervals": [
                      [
                        360.04,
                        365.12
                      ]
                    ]
                  },
                  {
                    "id": "S033.A_quality.mobile",
                    "answer": "no",
                    "reason": "手机单声道版同样存在严重错配，将Mette台词配给园丁且内容错误，无法理解原意。",
                    "source_intervals": [
                      [
                        360.04,
                        365.12
                      ]
                    ],
                    "output_intervals": [
                      [
                        364.38,
                        365.48
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S033.V_display.burned": {
              "pass": false,
              "evidence": {
                "id": "S033.V_display.burned",
                "answer": "no",
                "reason": "影院版胡须男子反应镜头的抽帧未见中文或瑞典语字幕",
                "source_intervals": [
                  [
                    360.04,
                    363.127
                  ]
                ],
                "output_intervals": [
                  [
                    360.04,
                    363.127
                  ]
                ],
                "votes": [
                  {
                    "id": "S033.V_display.burned",
                    "answer": "pending",
                    "reason": "Judge transport/format/evidence failure: {\"S033.V_display.burned\": \"Invalid time interval\", \"S033.V_display.safe_area\": \"Invalid time interval\", \"S036.V_display.safe_area\": \"Invalid time interval\"}",
                    "source_intervals": [],
                    "output_intervals": []
                  },
                  {
                    "id": "S033.V_display.burned",
                    "answer": "no",
                    "reason": "影院版胡须男子反应镜头的抽帧未见中文或瑞典语字幕",
                    "source_intervals": [
                      [
                        360.04,
                        363.127
                      ]
                    ],
                    "output_intervals": [
                      [
                        360.04,
                        363.127
                      ]
                    ]
                  },
                  {
                    "id": "S033.V_display.burned",
                    "answer": "no",
                    "reason": "大胡子男子的反应镜头中，影院版未显示中瑞字幕",
                    "source_intervals": [
                      [
                        360.04,
                        363.127
                      ]
                    ],
                    "output_intervals": [
                      [
                        360.04,
                        363.127
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S034.A_content.critical": {
              "pass": false,
              "evidence": {
                "id": "S034.A_content.critical",
                "answer": "no",
                "reason": "将“我猜是这样”错译为“我不知道”，语义发生根本反转",
                "source_intervals": [
                  [
                    367.0,
                    369.44
                  ]
                ],
                "output_intervals": [
                  [
                    365.96,
                    366.68
                  ]
                ],
                "votes": [
                  {
                    "id": "S034.A_content.critical",
                    "answer": "no",
                    "reason": "将“我猜是这样”错译为“我不知道”，语义发生根本反转",
                    "source_intervals": [
                      [
                        367.0,
                        369.44
                      ]
                    ],
                    "output_intervals": [
                      [
                        365.96,
                        366.68
                      ]
                    ]
                  },
                  {
                    "id": "S034.A_content.critical",
                    "answer": "no",
                    "reason": "源句“Ja, jag misstänkte det”被译为“我不知道”，语义反转；后续问答也出现张冠李戴。",
                    "source_intervals": [
                      [
                        365.6,
                        369.44
                      ]
                    ],
                    "output_intervals": [
                      [
                        365.96,
                        370.32
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S035.A_content.spoken": {
              "pass": false,
              "evidence": {
                "id": "S035.A_content.spoken",
                "answer": "no",
                "reason": "虽然发出了声音，但内容是错误的“我挨了一脚”，未能传达源句真实含义。",
                "source_intervals": [
                  [
                    369.6,
                    372.84
                  ]
                ],
                "output_intervals": [
                  [
                    369.6,
                    372.84
                  ]
                ],
                "votes": [
                  {
                    "id": "S035.A_content.spoken",
                    "answer": "no",
                    "reason": "虽然发出了声音，但内容是错误的“我挨了一脚”，未能传达源句真实含义。",
                    "source_intervals": [
                      [
                        369.6,
                        372.84
                      ]
                    ],
                    "output_intervals": [
                      [
                        369.6,
                        372.84
                      ]
                    ]
                  },
                  {
                    "id": "S035.A_content.spoken",
                    "answer": "no",
                    "reason": "源中应发声的核心意思未完整可听，实际输出变成了不相关的短句“我挨了一脚”。",
                    "source_intervals": [
                      [
                        369.6,
                        372.84
                      ]
                    ],
                    "output_intervals": [
                      [
                        369.3,
                        370.32
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S035.A_content.critical": {
              "pass": false,
              "evidence": {
                "id": "S035.A_content.critical",
                "answer": "no",
                "reason": "源意“谁在森林里发现你”，译文错译为“我挨了一脚”，核心语义完全错误。",
                "source_intervals": [
                  [
                    369.6,
                    372.84
                  ]
                ],
                "output_intervals": [
                  [
                    369.6,
                    372.84
                  ]
                ],
                "votes": [
                  {
                    "id": "S035.A_content.critical",
                    "answer": "no",
                    "reason": "源意“谁在森林里发现你”，译文错译为“我挨了一脚”，核心语义完全错误。",
                    "source_intervals": [
                      [
                        369.6,
                        372.84
                      ]
                    ],
                    "output_intervals": [
                      [
                        369.6,
                        372.84
                      ]
                    ]
                  },
                  {
                    "id": "S035.A_content.critical",
                    "answer": "no",
                    "reason": "源句为Mette询问对方在森林被谁发现，中文却由另一角色回答“我挨了一脚”，语义完全反转且擅自补全。",
                    "source_intervals": [
                      [
                        369.6,
                        372.84
                      ]
                    ],
                    "output_intervals": [
                      [
                        369.3,
                        370.32
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S037.A_quality.mobile": {
              "pass": false,
              "evidence": {
                "id": "S037.A_quality.mobile",
                "answer": "no",
                "reason": "手机版同样存在误译问题，且单声道下合成音更显突兀难懂。",
                "source_intervals": [
                  [
                    417.8,
                    421.32
                  ]
                ],
                "output_intervals": [
                  [
                    418.0,
                    420.8
                  ]
                ],
                "votes": [
                  {
                    "id": "S037.A_quality.mobile",
                    "answer": "no",
                    "reason": "手机版同样存在误译问题，且单声道下合成音更显突兀难懂。",
                    "source_intervals": [
                      [
                        417.8,
                        421.32
                      ]
                    ],
                    "output_intervals": [
                      [
                        418.0,
                        420.8
                      ]
                    ]
                  },
                  {
                    "id": "S037.A_quality.mobile",
                    "answer": "yes",
                    "reason": "手机版保留了相同的错误翻译，但音频清晰度与完整版保持一致。",
                    "source_intervals": [
                      [
                        417.8,
                        421.32
                      ]
                    ],
                    "output_intervals": [
                      [
                        418.0,
                        420.8
                      ]
                    ]
                  },
                  {
                    "id": "S037.A_quality.mobile",
                    "answer": "no",
                    "reason": "手机版虽清晰但内容错误，将演讲误读为数字，导致关键信息不可懂且偏离原意。",
                    "source_intervals": [
                      [
                        417.8,
                        421.32
                      ]
                    ],
                    "output_intervals": [
                      [
                        418.0,
                        420.8
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S042.A_content.critical": {
              "pass": false,
              "evidence": {
                "id": "S042.A_content.critical",
                "answer": "no",
                "reason": "将“vibrera”译为“往下”，丢失震动语义并擅自补全。",
                "source_intervals": [
                  [
                    481.48,
                    485.72
                  ]
                ],
                "output_intervals": [
                  [
                    481.48,
                    485.72
                  ]
                ],
                "votes": [
                  {
                    "id": "S042.A_content.critical",
                    "answer": "no",
                    "reason": "将“vibrera”译为“往下”，丢失震动语义并擅自补全。",
                    "source_intervals": [
                      [
                        481.48,
                        485.72
                      ]
                    ],
                    "output_intervals": [
                      [
                        481.48,
                        485.72
                      ]
                    ]
                  },
                  {
                    "id": "S042.A_content.critical",
                    "answer": "no",
                    "reason": "将“vibrera”错译为“往下”，改变了原意状态。",
                    "source_intervals": [
                      [
                        481.48,
                        485.72
                      ]
                    ],
                    "output_intervals": [
                      [
                        481.48,
                        485.72
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S043.A_content.critical": {
              "pass": false,
              "evidence": {
                "id": "S043.A_content.critical",
                "answer": "no",
                "reason": "译文擅自增加“还有别的东西”，源句仅表达有臭味，属于过度补全。",
                "source_intervals": [
                  [
                    486.4,
                    490.92
                  ]
                ],
                "output_intervals": [
                  [
                    486.4,
                    490.6
                  ]
                ],
                "votes": [
                  {
                    "id": "S043.A_content.critical",
                    "answer": "no",
                    "reason": "译文擅自增加“还有别的东西”，源句仅表达有臭味，属于过度补全。",
                    "source_intervals": [
                      [
                        486.4,
                        490.92
                      ]
                    ],
                    "output_intervals": [
                      [
                        486.4,
                        490.6
                      ]
                    ]
                  },
                  {
                    "id": "S043.A_content.critical",
                    "answer": "no",
                    "reason": "译文擅自添加“还有别的东西”，源句仅指有臭味，属于过度翻译/幻觉。",
                    "source_intervals": [
                      [
                        486.4,
                        490.92
                      ]
                    ],
                    "output_intervals": [
                      [
                        486.4,
                        490.6
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S044.A_content.critical": {
              "pass": false,
              "evidence": {
                "id": "S044.A_content.critical",
                "answer": "no",
                "reason": "译文丢失了源句中明确的人名称呼Elsie，属于擅自删减关键信息。",
                "source_intervals": [
                  [
                    492.78,
                    494.3
                  ]
                ],
                "output_intervals": [
                  [
                    492.5,
                    493.86
                  ]
                ],
                "votes": [
                  {
                    "id": "S044.A_content.critical",
                    "answer": "no",
                    "reason": "译文丢失了源句中明确的人名称呼Elsie，属于擅自删减关键信息。",
                    "source_intervals": [
                      [
                        492.78,
                        494.3
                      ]
                    ],
                    "output_intervals": [
                      [
                        492.5,
                        493.86
                      ]
                    ]
                  },
                  {
                    "id": "S044.A_content.critical",
                    "answer": "no",
                    "reason": "源句包含否定词inte和人名Elsie，译文丢失了这些关键信息。",
                    "source_intervals": [
                      [
                        492.48,
                        495.28
                      ]
                    ],
                    "output_intervals": [
                      [
                        492.5,
                        493.86
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S050.A_content.critical": {
              "pass": false,
              "evidence": {
                "id": "S050.A_content.critical",
                "answer": "no",
                "reason": "将源句“Mycket på gång?”错译为“有多少？”，丢失了“事情多不多”的核心语义。",
                "source_intervals": [
                  [
                    574.36,
                    577.76
                  ]
                ],
                "output_intervals": [
                  [
                    573.64,
                    574.9
                  ]
                ],
                "votes": [
                  {
                    "id": "S050.A_content.critical",
                    "answer": "no",
                    "reason": "将源句“Mycket på gång?”错译为“有多少？”，丢失了“事情多不多”的核心语义。",
                    "source_intervals": [
                      [
                        574.36,
                        577.76
                      ]
                    ],
                    "output_intervals": [
                      [
                        573.64,
                        574.9
                      ]
                    ]
                  },
                  {
                    "id": "S050.A_content.critical",
                    "answer": "yes",
                    "reason": "中文准确传达了源句关于事情进展和有趣事件的询问内容。",
                    "source_intervals": [
                      [
                        574.36,
                        577.76
                      ]
                    ],
                    "output_intervals": [
                      [
                        573.64,
                        577.66
                      ]
                    ]
                  },
                  {
                    "id": "S050.A_content.critical",
                    "answer": "no",
                    "reason": "源句为两个独立问句，译文将其拆分并遗漏了第一句的主语信息。",
                    "source_intervals": [
                      [
                        574.36,
                        577.76
                      ]
                    ],
                    "output_intervals": [
                      [
                        573.64,
                        577.66
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S051.A_content.critical": {
              "pass": false,
              "evidence": {
                "id": "S051.A_content.critical",
                "answer": "no",
                "reason": "源句提及特定人名Harald，译文擅自补全为“他已经”，丢失关键信息并改变语义。",
                "source_intervals": [
                  [
                    580.2,
                    582.0
                  ]
                ],
                "output_intervals": [
                  [
                    580.06,
                    582.52
                  ]
                ],
                "votes": [
                  {
                    "id": "S051.A_content.critical",
                    "answer": "no",
                    "reason": "源句提及特定人名Harald，译文擅自补全为“他已经”，丢失关键信息并改变语义。",
                    "source_intervals": [
                      [
                        580.2,
                        582.0
                      ]
                    ],
                    "output_intervals": [
                      [
                        580.06,
                        582.52
                      ]
                    ]
                  },
                  {
                    "id": "S051.A_content.critical",
                    "answer": "no",
                    "reason": "源句提及人名Harald，译文擅自改为“他已经”，丢失关键信息并产生歧义。",
                    "source_intervals": [
                      [
                        580.2,
                        582.0
                      ]
                    ],
                    "output_intervals": [
                      [
                        580.06,
                        582.52
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S052.A_content.critical": {
              "pass": false,
              "evidence": {
                "id": "S052.A_content.critical",
                "answer": "no",
                "reason": "译文将“墓地里的精神病患者”错译为“去过很多次墓园”，核心语义完全反转。",
                "source_intervals": [
                  [
                    583.08,
                    585.92
                  ]
                ],
                "output_intervals": [
                  [
                    582.52,
                    584.58
                  ]
                ],
                "votes": [
                  {
                    "id": "S052.A_content.critical",
                    "answer": "no",
                    "reason": "译文将“墓地里的精神病患者”错译为“去过很多次墓园”，核心语义完全反转。",
                    "source_intervals": [
                      [
                        583.08,
                        585.92
                      ]
                    ],
                    "output_intervals": [
                      [
                        582.52,
                        584.58
                      ]
                    ]
                  },
                  {
                    "id": "S052.A_content.critical",
                    "answer": "no",
                    "reason": "源句提及“精神病”，译文改为“去过很多次”，擅自补全且丢失核心信息。",
                    "source_intervals": [
                      [
                        583.08,
                        585.92
                      ]
                    ],
                    "output_intervals": [
                      [
                        582.52,
                        584.58
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S053.A_content.critical": {
              "pass": false,
              "evidence": {
                "id": "S053.A_content.critical",
                "answer": "no",
                "reason": "漏译“来月经了吗”，擅自补全“你们这些人”改变语义",
                "source_intervals": [
                  [
                    588.76,
                    592.72
                  ]
                ],
                "output_intervals": [
                  [
                    588.38,
                    590.12
                  ]
                ],
                "votes": [
                  {
                    "id": "S053.A_content.critical",
                    "answer": "no",
                    "reason": "漏译“来月经了吗”，擅自补全“你们这些人”改变语义",
                    "source_intervals": [
                      [
                        588.76,
                        592.72
                      ]
                    ],
                    "output_intervals": [
                      [
                        588.38,
                        590.12
                      ]
                    ]
                  },
                  {
                    "id": "S053.A_content.critical",
                    "answer": "no",
                    "reason": "源句包含“Har du mens eller?”（你来月经了吗？），译文擅自将其替换为“到底怎么回事”，丢失了具体的侮辱性内容。",
                    "source_intervals": [
                      [
                        588.76,
                        592.72
                      ]
                    ],
                    "output_intervals": [
                      [
                        588.38,
                        590.12
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S054.A_content.critical": {
              "pass": false,
              "evidence": {
                "id": "S054.A_content.critical",
                "answer": "no",
                "reason": "源句含明确否定指令 skit i honom，输出改为管它呢谁在乎丢失了针对特定对象的排斥态度。",
                "source_intervals": [
                  [
                    596.32,
                    599.68
                  ]
                ],
                "output_intervals": [
                  [
                    596.72,
                    597.98
                  ]
                ],
                "votes": [
                  {
                    "id": "S054.A_content.critical",
                    "answer": "no",
                    "reason": "源句含明确否定指令 skit i honom，输出改为管它呢谁在乎丢失了针对特定对象的排斥态度。",
                    "source_intervals": [
                      [
                        596.32,
                        599.68
                      ]
                    ],
                    "output_intervals": [
                      [
                        596.72,
                        597.98
                      ]
                    ]
                  },
                  {
                    "id": "S054.A_content.critical",
                    "answer": "yes",
                    "reason": "中文“管它呢谁在乎”准确对应了源句的否定与不在乎态度。",
                    "source_intervals": [
                      [
                        596.32,
                        599.68
                      ]
                    ],
                    "output_intervals": [
                      [
                        596.72,
                        597.98
                      ]
                    ]
                  },
                  {
                    "id": "S054.A_content.critical",
                    "answer": "no",
                    "reason": "将源句针对特定男性的指代擅自泛化为“谁在乎”，改变了语义范围。",
                    "source_intervals": [
                      [
                        596.32,
                        599.68
                      ]
                    ],
                    "output_intervals": [
                      [
                        596.72,
                        597.98
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S056.V_display.burned": {
              "pass": false,
              "evidence": {
                "id": "S056.V_display.burned",
                "answer": "no",
                "reason": "影院版在翻找纸张的两个采样帧仅显示瑞典语，缺少中文字幕",
                "source_intervals": [
                  [
                    641.18,
                    642.68
                  ]
                ],
                "output_intervals": [
                  [
                    641.18,
                    642.68
                  ]
                ],
                "votes": [
                  {
                    "id": "S056.V_display.burned",
                    "answer": "no",
                    "reason": "影院版在翻找纸张的两个采样帧仅显示瑞典语，缺少中文字幕",
                    "source_intervals": [
                      [
                        641.18,
                        642.68
                      ]
                    ],
                    "output_intervals": [
                      [
                        641.18,
                        642.68
                      ]
                    ]
                  },
                  {
                    "id": "S056.V_display.burned",
                    "answer": "no",
                    "reason": "影院版只显示瑞典语残句，缺少中文，瑞典语也缺夜间措辞",
                    "source_intervals": [
                      [
                        641.18,
                        642.68
                      ]
                    ],
                    "output_intervals": [
                      [
                        641.18,
                        642.68
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S059.A_quality.mobile": {
              "pass": false,
              "evidence": {
                "id": "S059.A_quality.mobile",
                "answer": "no",
                "reason": "手机版本同样缺失该段落的中文人声，导致内容不可懂。",
                "source_intervals": [
                  [
                    693.08,
                    695.72
                  ]
                ],
                "output_intervals": [
                  [
                    693.08,
                    695.72
                  ]
                ],
                "votes": [
                  {
                    "id": "S059.A_quality.mobile",
                    "answer": "no",
                    "reason": "手机版本同样缺失该段落的中文人声，导致内容不可懂。",
                    "source_intervals": [
                      [
                        693.08,
                        695.72
                      ]
                    ],
                    "output_intervals": [
                      [
                        693.08,
                        695.72
                      ]
                    ]
                  },
                  {
                    "id": "S059.A_quality.mobile",
                    "answer": "no",
                    "reason": "手机版同样在该时段处于静音状态，未能提供可懂的中文短句。",
                    "source_intervals": [
                      [
                        693.08,
                        695.72
                      ]
                    ],
                    "output_intervals": [
                      [
                        693.08,
                        695.72
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_S059.V_display.burned": {
              "pass": false,
              "evidence": {
                "id": "S059.V_display.burned",
                "answer": "no",
                "reason": "影院版卧床人物特写全帧未见中文或瑞文字幕",
                "source_intervals": [
                  [
                    694.5,
                    694.51
                  ]
                ],
                "output_intervals": [
                  [
                    694.5,
                    694.51
                  ]
                ],
                "votes": [
                  {
                    "id": "S059.V_display.burned",
                    "answer": "no",
                    "reason": "影院版卧床人物特写全帧未见中文或瑞文字幕",
                    "source_intervals": [
                      [
                        694.5,
                        694.51
                      ]
                    ],
                    "output_intervals": [
                      [
                        694.5,
                        694.51
                      ]
                    ]
                  },
                  {
                    "id": "S059.V_display.burned",
                    "answer": "no",
                    "reason": "影院帧在老妇卧床近景中漏烧该段中文和瑞文字幕",
                    "source_intervals": [
                      [
                        693.08,
                        694.5
                      ]
                    ],
                    "output_intervals": [
                      [
                        693.08,
                        694.5
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_role.Gardener.A_stable.distinct": {
              "pass": false,
              "evidence": {
                "id": "role.Gardener.A_stable.distinct",
                "answer": "no",
                "reason": "源声园丁低沉沙哑，输出却用同一女声TTS配音，完全丧失角色音色特征。",
                "source_intervals": [
                  [
                    1.32,
                    3.48
                  ]
                ],
                "output_intervals": [
                  [
                    1.24,
                    3.28
                  ]
                ],
                "votes": [
                  {
                    "id": "role.Gardener.A_stable.distinct",
                    "answer": "no",
                    "reason": "源声园丁低沉沙哑，输出却用同一女声TTS配音，完全丧失角色音色特征。",
                    "source_intervals": [
                      [
                        1.32,
                        3.48
                      ]
                    ],
                    "output_intervals": [
                      [
                        1.24,
                        3.28
                      ]
                    ]
                  },
                  {
                    "id": "role.Gardener.A_stable.distinct",
                    "answer": "yes",
                    "reason": "源音频中园丁为低沉沙哑男声，与女声明显不同。",
                    "source_intervals": [
                      [
                        1.32,
                        3.48
                      ]
                    ],
                    "output_intervals": [
                      [
                        0.0,
                        4.48
                      ]
                    ]
                  },
                  {
                    "id": "role.Gardener.A_stable.distinct",
                    "answer": "no",
                    "reason": "源声园丁音色沙哑低沉，输出全为同一平直女声TTS，未保留原角色特征。",
                    "source_intervals": [
                      [
                        1.32,
                        3.48
                      ]
                    ],
                    "output_intervals": [
                      [
                        1.24,
                        3.28
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_role.Elsie.A_stable.distinct": {
              "pass": false,
              "evidence": {
                "id": "role.Elsie.A_stable.distinct",
                "answer": "no",
                "reason": "源声为沙哑老年女，输出全角色共用同一年轻TTS音色。",
                "source_intervals": [
                  [
                    147.0,
                    149.68
                  ]
                ],
                "output_intervals": [
                  [
                    147.56,
                    147.86
                  ]
                ],
                "votes": [
                  {
                    "id": "role.Elsie.A_stable.distinct",
                    "answer": "no",
                    "reason": "源声为沙哑老年女，输出全角色共用同一年轻TTS音色。",
                    "source_intervals": [
                      [
                        147.0,
                        149.68
                      ]
                    ],
                    "output_intervals": [
                      [
                        147.56,
                        147.86
                      ]
                    ]
                  },
                  {
                    "id": "role.Elsie.A_stable.distinct",
                    "answer": "no",
                    "reason": "源声为沙哑老年女，输出却用年轻女TTS且角色错配。",
                    "source_intervals": [
                      [
                        147.0,
                        149.68
                      ]
                    ],
                    "output_intervals": [
                      [
                        147.56,
                        147.86
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_role.Harald.A_stable.distinct": {
              "pass": false,
              "evidence": {
                "id": "role.Harald.A_stable.distinct",
                "answer": "no",
                "reason": "源音频S036为老年男声，提交却分配给梅特女声，导致角色混淆。",
                "source_intervals": [
                  [
                    382.79,
                    386.21
                  ]
                ],
                "output_intervals": [
                  [
                    382.79,
                    386.21
                  ]
                ],
                "votes": [
                  {
                    "id": "role.Harald.A_stable.distinct",
                    "answer": "no",
                    "reason": "源音频S036为老年男声，提交却分配给梅特女声，导致角色混淆。",
                    "source_intervals": [
                      [
                        382.79,
                        386.21
                      ]
                    ],
                    "output_intervals": [
                      [
                        382.79,
                        386.21
                      ]
                    ]
                  },
                  {
                    "id": "role.Harald.A_stable.distinct",
                    "answer": "no",
                    "reason": "源音为老年男声，输出却用年轻女声TTS配音，性别完全相反无法区分。",
                    "source_intervals": [
                      [
                        260.14,
                        264.76
                      ]
                    ],
                    "output_intervals": [
                      [
                        259.89,
                        265.01
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_H01.T_meaning.relation": {
              "pass": false,
              "evidence": {
                "id": "H01.T_meaning.relation",
                "answer": "no",
                "reason": "译文将“你等了十年”错译为“他没有等十年”，改变了原意。",
                "source_intervals": [
                  [
                    25.96,
                    29.28
                  ]
                ],
                "output_intervals": [
                  [
                    25.82,
                    28.24
                  ]
                ],
                "votes": [
                  {
                    "id": "H01.T_meaning.relation",
                    "answer": "no",
                    "reason": "译文将“你等了十年”错译为“他没有等十年”，改变了原意。",
                    "source_intervals": [
                      [
                        25.96,
                        29.28
                      ]
                    ],
                    "output_intervals": [
                      [
                        25.82,
                        28.24
                      ]
                    ]
                  },
                  {
                    "id": "H01.T_meaning.relation",
                    "answer": "no",
                    "reason": "译文将“你等了十年吗”错译为“他真的没等”，改变了原意。",
                    "source_intervals": [
                      [
                        25.96,
                        29.28
                      ]
                    ],
                    "output_intervals": [
                      [
                        25.82,
                        28.24
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_H02.T_meaning.relation": {
              "pass": false,
              "evidence": {
                "id": "H02.T_meaning.relation",
                "answer": "no",
                "reason": "S013中Ida的台词被错译为Mette的“谢谢你来”，且丢失了S014中的回应内容。",
                "source_intervals": [
                  [
                    61.76,
                    63.84
                  ],
                  [
                    67.4,
                    69.4
                  ]
                ],
                "output_intervals": [
                  [
                    54.86,
                    56.38
                  ],
                  [
                    61.96,
                    63.36
                  ]
                ],
                "votes": [
                  {
                    "id": "H02.T_meaning.relation",
                    "answer": "no",
                    "reason": "S013中Ida的台词被错译为Mette的“谢谢你来”，且丢失了S014中的回应内容。",
                    "source_intervals": [
                      [
                        61.76,
                        63.84
                      ],
                      [
                        67.4,
                        69.4
                      ]
                    ],
                    "output_intervals": [
                      [
                        54.86,
                        56.38
                      ],
                      [
                        61.96,
                        63.36
                      ]
                    ]
                  },
                  {
                    "id": "H02.T_meaning.relation",
                    "answer": "no",
                    "reason": "将园丁的陈述改为反问，且转场后未保留反复出现的肯定回应。",
                    "source_intervals": [
                      [
                        46.2,
                        47.96
                      ],
                      [
                        62.06,
                        63.84
                      ]
                    ],
                    "output_intervals": [
                      [
                        45.88,
                        46.44
                      ],
                      [
                        61.96,
                        63.36
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_H02.A_content.relation": {
              "pass": false,
              "evidence": {
                "id": "H02.A_content.relation",
                "answer": "no",
                "reason": "源音频中Ida与Mette的不同女声，在输出中被统一为同一TTS音色，未保留角色声音区别。",
                "source_intervals": [
                  [
                    61.76,
                    63.84
                  ],
                  [
                    67.4,
                    69.4
                  ]
                ],
                "output_intervals": [
                  [
                    54.86,
                    56.38
                  ],
                  [
                    61.96,
                    63.36
                  ]
                ],
                "votes": [
                  {
                    "id": "H02.A_content.relation",
                    "answer": "no",
                    "reason": "源音频中Ida与Mette的不同女声，在输出中被统一为同一TTS音色，未保留角色声音区别。",
                    "source_intervals": [
                      [
                        61.76,
                        63.84
                      ],
                      [
                        67.4,
                        69.4
                      ]
                    ],
                    "output_intervals": [
                      [
                        54.86,
                        56.38
                      ],
                      [
                        61.96,
                        63.36
                      ]
                    ]
                  },
                  {
                    "id": "H02.A_content.relation",
                    "answer": "no",
                    "reason": "园丁台词被替换为女声反问，后续场景缺失原声中连续的肯定呼喊。",
                    "source_intervals": [
                      [
                        46.2,
                        47.96
                      ],
                      [
                        62.06,
                        63.84
                      ]
                    ],
                    "output_intervals": [
                      [
                        45.88,
                        46.44
                      ],
                      [
                        61.96,
                        63.36
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_H03.T_meaning.relation": {
              "pass": false,
              "evidence": {
                "id": "H03.T_meaning.relation",
                "answer": "no",
                "reason": "梦话归属错给护工，老人拒绝洗澡时语气平淡无激动感。",
                "source_intervals": [
                  [
                    116.92,
                    123.32
                  ],
                  [
                    145.72,
                    149.68
                  ]
                ],
                "output_intervals": [
                  [
                    116.02,
                    117.98
                  ],
                  [
                    147.56,
                    147.86
                  ]
                ],
                "votes": [
                  {
                    "id": "H03.T_meaning.relation",
                    "answer": "no",
                    "reason": "梦话归属错给护工，老人拒绝洗澡时语气平淡无激动感。",
                    "source_intervals": [
                      [
                        116.92,
                        123.32
                      ],
                      [
                        145.72,
                        149.68
                      ]
                    ],
                    "output_intervals": [
                      [
                        116.02,
                        117.98
                      ],
                      [
                        147.56,
                        147.86
                      ]
                    ]
                  },
                  {
                    "id": "H03.T_meaning.relation",
                    "answer": "no",
                    "reason": "提交文本将梦中话语错归给梅特，且未翻译出老人的拒绝。",
                    "source_intervals": [
                      [
                        116.92,
                        123.32
                      ],
                      [
                        145.72,
                        149.68
                      ]
                    ],
                    "output_intervals": [
                      [
                        116.02,
                        119.78
                      ],
                      [
                        144.92,
                        150.0
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_H03.A_content.relation": {
              "pass": false,
              "evidence": {
                "id": "H03.A_content.relation",
                "answer": "no",
                "reason": "原声为老人说梦见你，输出却由年轻女声说出该句。",
                "source_intervals": [
                  [
                    116.92,
                    123.32
                  ]
                ],
                "output_intervals": [
                  [
                    116.02,
                    117.98
                  ]
                ],
                "votes": [
                  {
                    "id": "H03.A_content.relation",
                    "answer": "no",
                    "reason": "原声为老人说梦见你，输出却由年轻女声说出该句。",
                    "source_intervals": [
                      [
                        116.92,
                        123.32
                      ]
                    ],
                    "output_intervals": [
                      [
                        116.02,
                        117.98
                      ]
                    ]
                  },
                  {
                    "id": "H03.A_content.relation",
                    "answer": "no",
                    "reason": "输出音频中梦话由年轻女声说出，老人拒绝时仅出现短促男声和惊呼。",
                    "source_intervals": [
                      [
                        116.92,
                        123.32
                      ],
                      [
                        145.72,
                        149.68
                      ]
                    ],
                    "output_intervals": [
                      [
                        116.02,
                        119.78
                      ],
                      [
                        144.92,
                        150.0
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_H05.T_meaning.relation": {
              "pass": false,
              "evidence": {
                "id": "H05.T_meaning.relation",
                "answer": "no",
                "reason": "译文将睡眠误译为进食，且遗漏了关于父母的核心对话。",
                "source_intervals": [
                  [
                    340.24,
                    348.32
                  ],
                  [
                    360.04,
                    372.84
                  ]
                ],
                "output_intervals": [
                  [
                    340.08,
                    348.14
                  ],
                  [
                    364.38,
                    370.32
                  ]
                ],
                "votes": [
                  {
                    "id": "H05.T_meaning.relation",
                    "answer": "no",
                    "reason": "译文将睡眠误译为进食，且遗漏了关于父母的核心对话。",
                    "source_intervals": [
                      [
                        340.24,
                        348.32
                      ],
                      [
                        360.04,
                        372.84
                      ]
                    ],
                    "output_intervals": [
                      [
                        340.08,
                        348.14
                      ],
                      [
                        364.38,
                        370.32
                      ]
                    ]
                  },
                  {
                    "id": "H05.T_meaning.relation",
                    "answer": "no",
                    "reason": "将睡眠问答错译为饮食，且把园丁台词错配给女性角色。",
                    "source_intervals": [
                      [
                        340.24,
                        348.32
                      ]
                    ],
                    "output_intervals": [
                      [
                        340.24,
                        348.32
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_H05.A_content.relation": {
              "pass": false,
              "evidence": {
                "id": "H05.A_content.relation",
                "answer": "no",
                "reason": "音频缺失关键台词，且将睡眠话题错误替换为进食内容。",
                "source_intervals": [
                  [
                    340.24,
                    348.32
                  ],
                  [
                    360.04,
                    372.84
                  ]
                ],
                "output_intervals": [
                  [
                    340.08,
                    348.14
                  ],
                  [
                    364.38,
                    370.32
                  ]
                ],
                "votes": [
                  {
                    "id": "H05.A_content.relation",
                    "answer": "no",
                    "reason": "音频缺失关键台词，且将睡眠话题错误替换为进食内容。",
                    "source_intervals": [
                      [
                        340.24,
                        348.32
                      ],
                      [
                        360.04,
                        372.84
                      ]
                    ],
                    "output_intervals": [
                      [
                        340.08,
                        348.14
                      ],
                      [
                        364.38,
                        370.32
                      ]
                    ]
                  },
                  {
                    "id": "H05.A_content.relation",
                    "answer": "no",
                    "reason": "将关于睡眠的回答错译为饮食，且遗漏了调侃对方古怪的关键台词。",
                    "source_intervals": [
                      [
                        340.24,
                        372.84
                      ]
                    ],
                    "output_intervals": [
                      [
                        340.24,
                        372.84
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_H06.T_meaning.relation": {
              "pass": false,
              "evidence": {
                "id": "H06.T_meaning.relation",
                "answer": "no",
                "reason": "S042原为老年女性要求震动，译文错归给年轻护工；S044原为年轻女称呼老者，译文错归给老者。",
                "source_intervals": [
                  [
                    481.48,
                    485.72
                  ]
                ],
                "output_intervals": [
                  [
                    481.22,
                    485.42
                  ]
                ],
                "votes": [
                  {
                    "id": "H06.T_meaning.relation",
                    "answer": "no",
                    "reason": "S042原为老年女性要求震动，译文错归给年轻护工；S044原为年轻女称呼老者，译文错归给老者。",
                    "source_intervals": [
                      [
                        481.48,
                        485.72
                      ]
                    ],
                    "output_intervals": [
                      [
                        481.22,
                        485.42
                      ]
                    ]
                  },
                  {
                    "id": "H06.T_meaning.relation",
                    "answer": "no",
                    "reason": "S042原为Marta，译文错归给Mette；且S045、S046角色归属也发生互换错误。",
                    "source_intervals": [
                      [
                        481.48,
                        485.72
                      ],
                      [
                        497.6,
                        502.44
                      ],
                      [
                        506.88,
                        508.8
                      ]
                    ],
                    "output_intervals": [
                      [
                        481.22,
                        485.42
                      ],
                      [
                        497.38,
                        500.98
                      ],
                      [
                        506.4,
                        507.78
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_H06.A_content.relation": {
              "pass": false,
              "evidence": {
                "id": "H06.A_content.relation",
                "answer": "no",
                "reason": "源片S042与S044由不同年龄音色发声，输出却将两者均替换为同一年轻TTS音色，角色归属完全错误。",
                "source_intervals": [
                  [
                    481.48,
                    485.72
                  ]
                ],
                "output_intervals": [
                  [
                    481.22,
                    485.42
                  ]
                ],
                "votes": [
                  {
                    "id": "H06.A_content.relation",
                    "answer": "no",
                    "reason": "源片S042与S044由不同年龄音色发声，输出却将两者均替换为同一年轻TTS音色，角色归属完全错误。",
                    "source_intervals": [
                      [
                        481.48,
                        485.72
                      ]
                    ],
                    "output_intervals": [
                      [
                        481.22,
                        485.42
                      ]
                    ]
                  },
                  {
                    "id": "H06.A_content.relation",
                    "answer": "no",
                    "reason": "音频中各句均由同一年轻女声说出，未区分老年与年轻角色的音色差异，导致角色归属完全混乱。",
                    "source_intervals": [
                      [
                        481.48,
                        485.72
                      ],
                      [
                        497.6,
                        502.44
                      ],
                      [
                        506.88,
                        508.8
                      ]
                    ],
                    "output_intervals": [
                      [
                        481.22,
                        485.42
                      ],
                      [
                        497.38,
                        500.98
                      ],
                      [
                        506.4,
                        507.78
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_H07.T_meaning.relation": {
              "pass": false,
              "evidence": {
                "id": "H07.T_meaning.relation",
                "answer": "no",
                "reason": "译文将提及哈尔德的台词错译为去墓园，丢失了人物指代与态度。",
                "source_intervals": [
                  [
                    580.2,
                    585.92
                  ]
                ],
                "output_intervals": [
                  [
                    580.06,
                    584.58
                  ]
                ],
                "votes": [
                  {
                    "id": "H07.T_meaning.relation",
                    "answer": "no",
                    "reason": "译文将提及哈尔德的台词错译为去墓园，丢失了人物指代与态度。",
                    "source_intervals": [
                      [
                        580.2,
                        585.92
                      ]
                    ],
                    "output_intervals": [
                      [
                        580.06,
                        584.58
                      ]
                    ]
                  },
                  {
                    "id": "H07.T_meaning.relation",
                    "answer": "no",
                    "reason": "译文将“Harald”错译为“他”，丢失了关键人名指代。",
                    "source_intervals": [
                      [
                        580.2,
                        582.0
                      ]
                    ],
                    "output_intervals": [
                      [
                        580.06,
                        582.52
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_H07.A_content.relation": {
              "pass": false,
              "evidence": {
                "id": "H07.A_content.relation",
                "answer": "no",
                "reason": "配音未读出哈尔德的名字，且错误地加入了关于墓园的无关内容。",
                "source_intervals": [
                  [
                    580.2,
                    585.92
                  ]
                ],
                "output_intervals": [
                  [
                    580.06,
                    584.58
                  ]
                ],
                "votes": [
                  {
                    "id": "H07.A_content.relation",
                    "answer": "no",
                    "reason": "配音未读出哈尔德的名字，且错误地加入了关于墓园的无关内容。",
                    "source_intervals": [
                      [
                        580.2,
                        585.92
                      ]
                    ],
                    "output_intervals": [
                      [
                        580.06,
                        584.58
                      ]
                    ]
                  },
                  {
                    "id": "H07.A_content.relation",
                    "answer": "no",
                    "reason": "配音未读出“Harald”，仅说“他已经”，与源音频内容不符。",
                    "source_intervals": [
                      [
                        580.2,
                        582.0
                      ]
                    ],
                    "output_intervals": [
                      [
                        580.06,
                        582.52
                      ]
                    ]
                  }
                ]
              }
            }
          },
          "losses": [
            {
              "id": "role.Gardener.A_stable.stable",
              "reason": "输出将园丁替换为无沙哑感的平稳TTS，音色特征与源音频不一致。",
              "lost": 1.25,
              "source_intervals": [
                [
                  1.32,
                  3.48
                ]
              ],
              "output_intervals": [
                [
                  1.24,
                  3.28
                ]
              ]
            },
            {
              "id": "role.Gardener.A_stable.distinct",
              "reason": "源声园丁低沉沙哑，输出却用同一女声TTS配音，完全丧失角色音色特征。",
              "lost": 1.25,
              "source_intervals": [
                [
                  1.32,
                  3.48
                ]
              ],
              "output_intervals": [
                [
                  1.24,
                  3.28
                ]
              ]
            },
            {
              "id": "role.Elsie.A_stable.distinct",
              "reason": "源声为沙哑老年女，输出全角色共用同一年轻TTS音色。",
              "lost": 1.25,
              "source_intervals": [
                [
                  147.0,
                  149.68
                ]
              ],
              "output_intervals": [
                [
                  147.56,
                  147.86
                ]
              ]
            },
            {
              "id": "role.Harald.A_stable.distinct",
              "reason": "源音频S036为老年男声，提交却分配给梅特女声，导致角色混淆。",
              "lost": 1.25,
              "source_intervals": [
                [
                  382.79,
                  386.21
                ]
              ],
              "output_intervals": [
                [
                  382.79,
                  386.21
                ]
              ]
            },
            {
              "id": "S056.A_identity.pitch",
              "reason": "中文TTS为平稳女声，与源沙哑颤抖的老年男声音高不符",
              "lost": 0.390625,
              "source_intervals": [
                [
                  640.08,
                  644.76
                ]
              ],
              "output_intervals": [
                [
                  639.83,
                  645.01
                ]
              ]
            },
            {
              "id": "S056.A_identity.texture",
              "reason": "源有明显气声和沙哑质感，中文输出干净平滑完全丢失该特征",
              "lost": 0.390625,
              "source_intervals": [
                [
                  640.08,
                  644.76
                ]
              ],
              "output_intervals": [
                [
                  639.83,
                  645.01
                ]
              ]
            },
            {
              "id": "S056.A_identity.resonance",
              "reason": "中文缺乏源老年男性的胸腔共鸣与沉重感，音色单薄不相容",
              "lost": 0.390625,
              "source_intervals": [
                [
                  640.08,
                  644.76
                ]
              ],
              "output_intervals": [
                [
                  639.83,
                  645.01
                ]
              ]
            },
            {
              "id": "S027.A_identity.pitch",
              "reason": "合成音高偏高且平稳，未体现老年男性低沉的基频特征。",
              "lost": 0.2604166666666667,
              "source_intervals": [
                [
                  259.84,
                  264.76
                ]
              ],
              "output_intervals": [
                [
                  259.1,
                  265.14
                ]
              ]
            },
            {
              "id": "S027.A_identity.texture",
              "reason": "完全丢失了原声中明显的沙哑颗粒感和气声特质。",
              "lost": 0.2604166666666667,
              "source_intervals": [
                [
                  259.84,
                  264.76
                ]
              ],
              "output_intervals": [
                [
                  259.1,
                  265.14
                ]
              ]
            },
            {
              "id": "S027.A_identity.resonance",
              "reason": "声音单薄缺乏胸腔共鸣，与原角色浑厚的质感不符。",
              "lost": 0.2604166666666667,
              "source_intervals": [
                [
                  259.84,
                  264.76
                ]
              ],
              "output_intervals": [
                [
                  259.1,
                  265.14
                ]
              ]
            },
            {
              "id": "S027.A_identity.identity",
              "reason": "输出为通用TTS，缺乏原角色特有的苍老音色与辨识度。",
              "lost": 0.2604166666666667,
              "source_intervals": [
                [
                  259.84,
                  264.76
                ]
              ],
              "output_intervals": [
                [
                  259.1,
                  265.14
                ]
              ]
            },
            {
              "id": "S028.A_identity.pitch",
              "reason": "源为老年男性低沉嗓音，输出却使用明显偏高的女性TTS音色，音高区间完全不相容。",
              "lost": 0.2604166666666667,
              "source_intervals": [
                [
                  269.4,
                  272.4
                ]
              ],
              "output_intervals": [
                [
                  269.18,
                  270.38
                ]
              ]
            },
            {
              "id": "S028.A_identity.texture",
              "reason": "源带有明显的沙哑和颗粒感，输出则是平滑干净的标准女声，未保留任何可辨识的音质特征。",
              "lost": 0.2604166666666667,
              "source_intervals": [
                [
                  269.4,
                  272.4
                ]
              ],
              "output_intervals": [
                [
                  269.18,
                  270.38
                ]
              ]
            },
            {
              "id": "S028.A_identity.resonance",
              "reason": "源具有苍老男性的胸腔共鸣与厚重感，输出为单薄的女性合成器共鸣，缺乏应有的重量。",
              "lost": 0.2604166666666667,
              "source_intervals": [
                [
                  269.4,
                  272.4
                ]
              ],
              "output_intervals": [
                [
                  269.18,
                  270.38
                ]
              ]
            },
            {
              "id": "S028.A_identity.identity",
              "reason": "源声为低沉沙哑的老年男声，输出为平滑清晰的TTS女声（huayan），音色特征完全不同。",
              "lost": 0.2604166666666667,
              "source_intervals": [
                [
                  269.4,
                  271.5
                ]
              ],
              "output_intervals": [
                [
                  269.18,
                  270.38
                ]
              ]
            },
            {
              "id": "S036.A_identity.pitch",
              "reason": "输出音调偏高属年轻女声，与源低沉男声音域不符。",
              "lost": 0.2604166666666667,
              "source_intervals": [
                [
                  383.04,
                  385.96
                ]
              ],
              "output_intervals": [
                [
                  381.74,
                  383.24
                ]
              ]
            },
            {
              "id": "S036.A_identity.texture",
              "reason": "输出音色平滑干净，完全缺失源角色明显的沙哑质感。",
              "lost": 0.2604166666666667,
              "source_intervals": [
                [
                  383.04,
                  385.96
                ]
              ],
              "output_intervals": [
                [
                  381.74,
                  383.24
                ]
              ]
            },
            {
              "id": "S036.A_identity.resonance",
              "reason": "输出共鸣单薄清亮，缺乏源角色的厚重胸腔共鸣特征。",
              "lost": 0.2604166666666667,
              "source_intervals": [
                [
                  383.04,
                  385.96
                ]
              ],
              "output_intervals": [
                [
                  381.74,
                  383.24
                ]
              ]
            },
            {
              "id": "S036.A_identity.identity",
              "reason": "源角色Harald为老年男性，输出使用年轻女性Mette的声音。",
              "lost": 0.2604166666666667,
              "source_intervals": [
                [
                  383.04,
                  385.96
                ]
              ],
              "output_intervals": [
                [
                  381.74,
                  383.24
                ]
              ]
            },
            {
              "id": "S004.A_prosody.intent",
              "reason": "源语气沉重充满敬畏，输出平淡陈述，缺失情感色彩和意图传达。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  8.96,
                  10.64
                ]
              ],
              "output_intervals": [
                [
                  8.18,
                  9.54
                ]
              ]
            },
            {
              "id": "S004.A_prosody.delivery",
              "reason": "语速均匀机械，完全缺失源句中自然的思考停顿和犹豫节奏。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  8.96,
                  10.64
                ]
              ],
              "output_intervals": [
                [
                  8.18,
                  9.54
                ]
              ]
            },
            {
              "id": "S005.A_prosody.delivery",
              "reason": "源语音有明显的思考停顿和节奏变化，译文处理得过于平滑机械，缺失表演结构。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  11.44,
                  14.44
                ]
              ],
              "output_intervals": [
                [
                  11.16,
                  13.44
                ]
              ]
            },
            {
              "id": "S008.A_prosody.intent",
              "reason": "原声是震惊质问，TTS是平淡陈述，情绪功能完全丢失。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  25.96,
                  29.28
                ]
              ],
              "output_intervals": [
                [
                  25.82,
                  28.24
                ]
              ]
            },
            {
              "id": "S008.A_prosody.delivery",
              "reason": "原声语速快带惊讶停顿，TTS节奏均匀死板，无表演结构。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  25.96,
                  29.28
                ]
              ],
              "output_intervals": [
                [
                  25.82,
                  28.24
                ]
              ]
            },
            {
              "id": "S009.A_prosody.intent",
              "reason": "源句语气平稳陈述事实，中文配音语调起伏较大带有解释意味，情绪不符。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  30.92,
                  34.16
                ]
              ],
              "output_intervals": [
                [
                  30.36,
                  33.1
                ]
              ]
            },
            {
              "id": "S012.A_prosody.intent",
              "reason": "源表达不认同的冷静态度，输出误读为好奇询问意图相反。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  44.16,
                  47.96
                ]
              ],
              "output_intervals": [
                [
                  44.08,
                  46.44
                ]
              ]
            },
            {
              "id": "S012.A_prosody.delivery",
              "reason": "源第二句平淡坚定陈述，输出变为上扬疑问语调结构破坏。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  44.16,
                  47.96
                ]
              ],
              "output_intervals": [
                [
                  44.08,
                  46.44
                ]
              ]
            },
            {
              "id": "S014.A_prosody.intent",
              "reason": "语气平淡冷漠，完全丧失了源角色极度兴奋、狂喜的情绪感染力。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  67.4,
                  69.4
                ]
              ],
              "output_intervals": [
                [
                  71.22,
                  74.02
                ]
              ]
            },
            {
              "id": "S014.A_prosody.delivery",
              "reason": "节奏均匀刻板，未能复现源句中因情绪高涨导致的急促重复与停顿结构。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  67.4,
                  69.4
                ]
              ],
              "output_intervals": [
                [
                  71.22,
                  74.02
                ]
              ]
            },
            {
              "id": "S016.A_prosody.intent",
              "reason": "源意图是亲切的问候与唤醒，输出变成了生硬的命令式语气，情绪功能完全错误。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  92.06,
                  93.891
                ]
              ],
              "output_intervals": [
                [
                  90.82,
                  94.94
                ]
              ]
            },
            {
              "id": "S016.A_prosody.delivery",
              "reason": "源句是轻柔的唤醒语调，有自然的停顿和情感起伏；输出节奏机械均匀，毫无情感波动。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  92.06,
                  93.891
                ]
              ],
              "output_intervals": [
                [
                  90.82,
                  94.94
                ]
              ]
            },
            {
              "id": "S019.A_prosody.intent",
              "reason": "源语气幽默戏谑，中文平淡机械，未能传达关键的情绪功能和互动意图。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  116.92,
                  123.32
                ]
              ],
              "output_intervals": [
                [
                  116.02,
                  119.78
                ]
              ]
            },
            {
              "id": "S019.A_prosody.delivery",
              "reason": "源句包含完整反问“我该感到害怕还是荣幸”，中文仅译出“是吗？”，严重缺失表演结构和语义内容。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  116.92,
                  123.32
                ]
              ],
              "output_intervals": [
                [
                  116.02,
                  119.78
                ]
              ]
            },
            {
              "id": "S023.A_prosody.intent",
              "reason": "源拒绝语气激烈抗拒，中文仅平铺直叙未传达愤怒或激动情绪。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  145.72,
                  149.68
                ]
              ],
              "output_intervals": [
                [
                  144.92,
                  149.08
                ]
              ]
            },
            {
              "id": "S023.A_prosody.delivery",
              "reason": "源句有强烈情绪起伏与停顿，中文配音平淡机械无表演结构。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  145.72,
                  149.68
                ]
              ],
              "output_intervals": [
                [
                  144.92,
                  149.08
                ]
              ]
            },
            {
              "id": "S024.A_prosody.intent",
              "reason": "语调平淡缺乏起伏，未能传达出原角色直接同情的态度。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  246.88,
                  249.76
                ]
              ],
              "output_intervals": [
                [
                  246.82,
                  254.52
                ]
              ]
            },
            {
              "id": "S024.A_prosody.delivery",
              "reason": "语速均匀单调，完全缺失原句中明显的停顿和重音强调。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  246.88,
                  249.76
                ]
              ],
              "output_intervals": [
                [
                  246.82,
                  254.52
                ]
              ]
            },
            {
              "id": "S025.A_prosody.intent",
              "reason": "未能传达出源句中直言不讳且带有同情的复杂语气。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  250.64,
                  254.2
                ]
              ],
              "output_intervals": [
                [
                  246.82,
                  254.52
                ]
              ]
            },
            {
              "id": "S025.A_prosody.delivery",
              "reason": "抹除了源句中强调“混蛋”时的明显停顿和重音处理。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  250.64,
                  254.2
                ]
              ],
              "output_intervals": [
                [
                  246.82,
                  254.52
                ]
              ]
            },
            {
              "id": "S026.A_prosody.intent",
              "reason": "未能传达出关切与承诺的语气，情感色彩过于冷淡。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  255.72,
                  259.44
                ]
              ],
              "output_intervals": [
                [
                  255.38,
                  258.24
                ]
              ]
            },
            {
              "id": "S026.A_prosody.delivery",
              "reason": "语调平直机械，完全缺失原句的情感重音与停顿设计。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  255.72,
                  259.44
                ]
              ],
              "output_intervals": [
                [
                  255.38,
                  258.24
                ]
              ]
            },
            {
              "id": "S027.A_prosody.intent",
              "reason": "语调平淡客观，未能传达出原角色苦涩与认命的情绪色彩。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  259.84,
                  264.76
                ]
              ],
              "output_intervals": [
                [
                  259.1,
                  265.14
                ]
              ]
            },
            {
              "id": "S027.A_prosody.delivery",
              "reason": "语速均匀机械，缺失原句中表现无奈的长停顿与叹息感。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  259.84,
                  264.76
                ]
              ],
              "output_intervals": [
                [
                  259.1,
                  265.14
                ]
              ]
            },
            {
              "id": "S028.A_prosody.intent",
              "reason": "源语气充满无奈与宿命感的沉重叹息，输出语调平淡客观，丢失了关键的情绪功能。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  269.4,
                  272.4
                ]
              ],
              "output_intervals": [
                [
                  269.15,
                  272.65
                ]
              ]
            },
            {
              "id": "S028.A_prosody.delivery",
              "reason": "源句语速缓慢且伴有沉重的停顿，输出节奏均匀机械，未复现原表演的迟疑与强调结构。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  269.4,
                  272.4
                ]
              ],
              "output_intervals": [
                [
                  269.15,
                  272.65
                ]
              ]
            },
            {
              "id": "S031.A_prosody.intent",
              "reason": "源句带好奇调侃，中文为平直陈述语调，丢失情绪功能。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  340.24,
                  344.28
                ]
              ],
              "output_intervals": [
                [
                  340.08,
                  344.14
                ]
              ]
            },
            {
              "id": "S031.A_prosody.delivery",
              "reason": "源句有停顿与调侃语气，中文TTS节奏机械且无自然停顿。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  340.24,
                  344.28
                ]
              ],
              "output_intervals": [
                [
                  340.08,
                  344.14
                ]
              ]
            },
            {
              "id": "S032.A_prosody.intent",
              "reason": "源意是“我也没怎么睡”，中文错译为“我从来不吃”，语义反转导致关键意图彻底丧失。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  345.2,
                  348.32
                ]
              ],
              "output_intervals": [
                [
                  344.76,
                  348.14
                ]
              ]
            },
            {
              "id": "S032.A_prosody.delivery",
              "reason": "源句含随意附和的语气起伏，中文输出呈均匀死板的机械节拍，丢失表演结构。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  345.2,
                  348.32
                ]
              ],
              "output_intervals": [
                [
                  344.76,
                  348.14
                ]
              ]
            },
            {
              "id": "S033.A_prosody.intent",
              "reason": "因缺乏实际发声，源句的挑衅语气和情绪功能完全丢失",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  360.04,
                  365.12
                ]
              ],
              "output_intervals": [
                [
                  358.04,
                  364.38
                ]
              ]
            },
            {
              "id": "S033.A_prosody.delivery",
              "reason": "该时段无中文语音输出，无法体现源句的停顿与反问结构",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  360.04,
                  365.12
                ]
              ],
              "output_intervals": [
                [
                  358.04,
                  364.38
                ]
              ]
            },
            {
              "id": "S034.A_prosody.intent",
              "reason": "源句男声平静女声得意，输出两句均为尖锐机械童声，完全丢失原有情绪对比。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  365.6,
                  369.44
                ]
              ],
              "output_intervals": [
                [
                  365.6,
                  369.44
                ]
              ]
            },
            {
              "id": "S034.A_prosody.delivery",
              "reason": "未能还原源句中那种略带得意和了然的语气起伏",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  365.6,
                  369.44
                ]
              ],
              "output_intervals": [
                [
                  364.38,
                  368.82
                ]
              ]
            },
            {
              "id": "S035.A_prosody.intent",
              "reason": "源句意图是询问身世，译文变成陈述受伤事实，语气功能完全背离。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  369.6,
                  372.84
                ]
              ],
              "output_intervals": [
                [
                  369.6,
                  372.84
                ]
              ]
            },
            {
              "id": "S035.A_prosody.delivery",
              "reason": "源句带有好奇追问的语气停顿，译文因内容错误导致节奏断裂且不自然。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  369.6,
                  372.84
                ]
              ],
              "output_intervals": [
                [
                  369.6,
                  372.84
                ]
              ]
            },
            {
              "id": "S042.A_prosody.intent",
              "reason": "源语气微弱带恳求，中配声音年轻且平淡，完全丢失了原角色的情绪功能。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  481.48,
                  485.72
                ]
              ],
              "output_intervals": [
                [
                  481.22,
                  485.42
                ]
              ]
            },
            {
              "id": "S042.A_prosody.delivery",
              "reason": "源为老年女性虚弱恳求，中配为年轻女声且语调平稳机械，未保留表演结构。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  481.48,
                  485.72
                ]
              ],
              "output_intervals": [
                [
                  481.22,
                  485.42
                ]
              ]
            },
            {
              "id": "S043.A_prosody.intent",
              "reason": "源后半句带有明显的厌恶/嫌弃情绪，中文语调平淡客观未传达此意图。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  486.4,
                  490.92
                ]
              ],
              "output_intervals": [
                [
                  486.4,
                  490.6
                ]
              ]
            },
            {
              "id": "S043.A_prosody.delivery",
              "reason": "源句间有明显停顿和凑近闻的动作节奏，中文连读过快丢失表演结构。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  486.4,
                  490.92
                ]
              ],
              "output_intervals": [
                [
                  486.4,
                  490.6
                ]
              ]
            },
            {
              "id": "S046.A_prosody.intent",
              "reason": "源句带有明显的厌恶与质问语气，中文配音语调平直机械，未传达任何情绪功能。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  506.88,
                  509.72
                ]
              ],
              "output_intervals": [
                [
                  506.88,
                  509.72
                ]
              ]
            },
            {
              "id": "S046.A_prosody.delivery",
              "reason": "源为年轻女声嫌弃追问，中文却由苍老女声平淡念出，表演结构完全丢失。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  506.88,
                  509.72
                ]
              ],
              "output_intervals": [
                [
                  506.88,
                  509.72
                ]
              ]
            },
            {
              "id": "S051.A_prosody.intent",
              "reason": "语气平淡，未传达出源句中提起某人时的随意感或潜在情绪。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  580.2,
                  582.0
                ]
              ],
              "output_intervals": [
                [
                  580.06,
                  582.52
                ]
              ]
            },
            {
              "id": "S051.A_prosody.delivery",
              "reason": "未能保留源句中自然的犹豫和被打断的表演结构，语调平直。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  580.2,
                  582.0
                ]
              ],
              "output_intervals": [
                [
                  580.06,
                  582.52
                ]
              ]
            },
            {
              "id": "S052.A_prosody.intent",
              "reason": "语气平淡陈述，未能传达源句解释性的急切情绪功能。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  583.08,
                  585.92
                ]
              ],
              "output_intervals": [
                [
                  582.52,
                  584.58
                ]
              ]
            },
            {
              "id": "S052.A_prosody.delivery",
              "reason": "语调机械平直，未体现源句中强调“当然”的重音结构。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  583.08,
                  585.92
                ]
              ],
              "output_intervals": [
                [
                  582.52,
                  584.58
                ]
              ]
            },
            {
              "id": "S053.A_prosody.intent",
              "reason": "语气平淡机械，完全缺失源角色的不耐烦与攻击性",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  588.76,
                  592.72
                ]
              ],
              "output_intervals": [
                [
                  588.38,
                  590.12
                ]
              ]
            },
            {
              "id": "S053.A_prosody.delivery",
              "reason": "未保留源句两个独立问句间的停顿结构",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  588.76,
                  592.72
                ]
              ],
              "output_intervals": [
                [
                  588.38,
                  590.12
                ]
              ]
            },
            {
              "id": "S054.A_prosody.intent",
              "reason": "源句意图是无奈地劝慰对方放下，中文配音呈现出烦躁和突兀的命令感，关键情绪功能发生反转。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  596.32,
                  599.68
                ]
              ],
              "output_intervals": [
                [
                  596.72,
                  598.22
                ]
              ]
            },
            {
              "id": "S054.A_prosody.delivery",
              "reason": "源句为连贯短句，译文拆成三段并加多余停顿，破坏原有节奏。",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  596.32,
                  599.68
                ]
              ],
              "output_intervals": [
                [
                  595.7,
                  598.22
                ]
              ]
            },
            {
              "id": "S056.A_prosody.intent",
              "reason": "源含轻蔑不耐烦情绪，中文语调平淡客观未能传达原意功能",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  640.08,
                  644.76
                ]
              ],
              "output_intervals": [
                [
                  639.83,
                  645.01
                ]
              ]
            },
            {
              "id": "S056.A_prosody.delivery",
              "reason": "源语速缓慢且有喘息停顿，中文节奏均匀机械无表演结构保留",
              "lost": 0.1814516129032258,
              "source_intervals": [
                [
                  640.08,
                  644.76
                ]
              ],
              "output_intervals": [
                [
                  639.83,
                  645.01
                ]
              ]
            },
            {
              "id": "S004.A_content.critical",
              "reason": "源句包含“十年”与“一晚开花后死亡”，中文仅译出前半部分，后半关键信息缺失。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  8.96,
                  10.64
                ]
              ],
              "output_intervals": [
                [
                  8.18,
                  9.54
                ]
              ]
            },
            {
              "id": "S008.A_content.critical",
              "reason": "源为疑问句，译文变陈述且人称由你改为他，语义完全反转。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  25.96,
                  29.28
                ]
              ],
              "output_intervals": [
                [
                  25.82,
                  28.24
                ]
              ]
            },
            {
              "id": "S009.A_content.critical",
              "reason": "源句意为“差不多二十四”，中文错译为“最早种下”，擅自补全错误信息。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  30.92,
                  34.16
                ]
              ],
              "output_intervals": [
                [
                  30.36,
                  33.1
                ]
              ]
            },
            {
              "id": "S012.A_content.critical",
              "reason": "源句“我不这么觉得”被篡改为反问“你真这么觉得”，语义完全反转。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  46.2,
                  47.96
                ]
              ],
              "output_intervals": [
                [
                  45.88,
                  46.44
                ]
              ]
            },
            {
              "id": "S014.A_content.critical",
              "reason": "源句为肯定语气“ja”，提交译为否定“不要”，语义完全反转。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  67.4,
                  69.4
                ]
              ],
              "output_intervals": [
                [
                  71.22,
                  74.02
                ]
              ]
            },
            {
              "id": "S016.A_content.spoken",
              "reason": "中文音频实际说出的是“记住”和“说话”，并未包含源句的核心意思（问候与呼唤名字）。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  92.06,
                  93.891
                ]
              ],
              "output_intervals": [
                [
                  90.82,
                  94.94
                ]
              ]
            },
            {
              "id": "S016.A_content.critical",
              "reason": "源句为“早安！玛尔塔”，提交内容却译为“记住”和“说话”，完全丢失了原意。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  92.06,
                  93.891
                ]
              ],
              "output_intervals": [
                [
                  90.82,
                  94.94
                ]
              ]
            },
            {
              "id": "S019.A_content.spoken",
              "reason": "源角色的核心反问内容未被配音演绎，仅有前半句对话，属于实质性遗漏。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  117.22,
                  123.32
                ]
              ],
              "output_intervals": [
                [
                  116.02,
                  119.78
                ]
              ]
            },
            {
              "id": "S019.A_content.critical",
              "reason": "严重漏译：源句后半部分“我该感到害怕还是荣幸？”未在音频中出现，导致信息缺失。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  117.22,
                  123.32
                ]
              ],
              "output_intervals": [
                [
                  116.02,
                  119.78
                ]
              ]
            },
            {
              "id": "S023.A_content.spoken",
              "reason": "老年女性的拒绝理由（我很干净）未在音频中实际播出。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  145.72,
                  149.68
                ]
              ],
              "output_intervals": [
                [
                  144.92,
                  150.0
                ]
              ]
            },
            {
              "id": "S023.A_content.critical",
              "reason": "严重漏译：源句包含“我很干净”，输出完全缺失该关键信息。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  145.72,
                  149.68
                ]
              ],
              "output_intervals": [
                [
                  144.92,
                  150.0
                ]
              ]
            },
            {
              "id": "S024.A_content.critical",
              "reason": "漏译了后半段条件承诺内容，导致语义不完整。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  246.88,
                  249.76
                ]
              ],
              "output_intervals": [
                [
                  246.82,
                  254.52
                ]
              ]
            },
            {
              "id": "S031.A_content.spoken",
              "reason": "核心意思虽已发声，但因翻译错误导致传达的信息与源意完全相反。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  340.24,
                  345.78
                ]
              ],
              "output_intervals": [
                [
                  340.08,
                  345.64
                ]
              ]
            },
            {
              "id": "S031.A_content.critical",
              "reason": "源句“没怎么睡”被错译为“吃得不多”，语义发生根本性反转错误。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  340.24,
                  345.78
                ]
              ],
              "output_intervals": [
                [
                  340.08,
                  345.64
                ]
              ]
            },
            {
              "id": "S032.A_content.spoken",
              "reason": "核心意思错译导致信息失真，且Mette的回应也变成无关内容。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  345.2,
                  348.32
                ]
              ],
              "output_intervals": [
                [
                  344.76,
                  348.14
                ]
              ]
            },
            {
              "id": "S032.A_content.critical",
              "reason": "源意“没怎么睡”被错译为“吃得不多”，语义严重反转。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  345.2,
                  348.32
                ]
              ],
              "output_intervals": [
                [
                  344.76,
                  348.14
                ]
              ]
            },
            {
              "id": "S033.A_content.spoken",
              "reason": "对应时间段内无任何中文语音发声，核心意思未能实际可听",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  360.04,
                  365.12
                ]
              ],
              "output_intervals": [
                [
                  358.04,
                  364.38
                ]
              ]
            },
            {
              "id": "S033.A_content.critical",
              "reason": "源句Mette的调侃台词在输出中完全缺失，未保留任何语义内容",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  360.04,
                  365.12
                ]
              ],
              "output_intervals": [
                [
                  358.04,
                  364.38
                ]
              ]
            },
            {
              "id": "S034.A_content.critical",
              "reason": "将“我猜是这样”错译为“我不知道”，语义发生根本反转",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  367.0,
                  369.44
                ]
              ],
              "output_intervals": [
                [
                  365.96,
                  366.68
                ]
              ]
            },
            {
              "id": "S035.A_content.spoken",
              "reason": "虽然发出了声音，但内容是错误的“我挨了一脚”，未能传达源句真实含义。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  369.6,
                  372.84
                ]
              ],
              "output_intervals": [
                [
                  369.6,
                  372.84
                ]
              ]
            },
            {
              "id": "S035.A_content.critical",
              "reason": "源意“谁在森林里发现你”，译文错译为“我挨了一脚”，核心语义完全错误。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  369.6,
                  372.84
                ]
              ],
              "output_intervals": [
                [
                  369.6,
                  372.84
                ]
              ]
            },
            {
              "id": "S042.A_content.critical",
              "reason": "将“vibrera”译为“往下”，丢失震动语义并擅自补全。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  481.48,
                  485.72
                ]
              ],
              "output_intervals": [
                [
                  481.48,
                  485.72
                ]
              ]
            },
            {
              "id": "S043.A_content.critical",
              "reason": "译文擅自增加“还有别的东西”，源句仅表达有臭味，属于过度补全。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  486.4,
                  490.92
                ]
              ],
              "output_intervals": [
                [
                  486.4,
                  490.6
                ]
              ]
            },
            {
              "id": "S044.A_content.critical",
              "reason": "译文丢失了源句中明确的人名称呼Elsie，属于擅自删减关键信息。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  492.78,
                  494.3
                ]
              ],
              "output_intervals": [
                [
                  492.5,
                  493.86
                ]
              ]
            },
            {
              "id": "S050.A_content.critical",
              "reason": "将源句“Mycket på gång?”错译为“有多少？”，丢失了“事情多不多”的核心语义。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  574.36,
                  577.76
                ]
              ],
              "output_intervals": [
                [
                  573.64,
                  574.9
                ]
              ]
            },
            {
              "id": "S051.A_content.critical",
              "reason": "源句提及特定人名Harald，译文擅自补全为“他已经”，丢失关键信息并改变语义。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  580.2,
                  582.0
                ]
              ],
              "output_intervals": [
                [
                  580.06,
                  582.52
                ]
              ]
            },
            {
              "id": "S052.A_content.critical",
              "reason": "译文将“墓地里的精神病患者”错译为“去过很多次墓园”，核心语义完全反转。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  583.08,
                  585.92
                ]
              ],
              "output_intervals": [
                [
                  582.52,
                  584.58
                ]
              ]
            },
            {
              "id": "S053.A_content.critical",
              "reason": "漏译“来月经了吗”，擅自补全“你们这些人”改变语义",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  588.76,
                  592.72
                ]
              ],
              "output_intervals": [
                [
                  588.38,
                  590.12
                ]
              ]
            },
            {
              "id": "S054.A_content.critical",
              "reason": "源句含明确否定指令 skit i honom，输出改为管它呢谁在乎丢失了针对特定对象的排斥态度。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  596.32,
                  599.68
                ]
              ],
              "output_intervals": [
                [
                  596.72,
                  597.98
                ]
              ]
            },
            {
              "id": "H02.A_content.relation",
              "reason": "源音频中Ida与Mette的不同女声，在输出中被统一为同一TTS音色，未保留角色声音区别。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  61.76,
                  63.84
                ],
                [
                  67.4,
                  69.4
                ]
              ],
              "output_intervals": [
                [
                  54.86,
                  56.38
                ],
                [
                  61.96,
                  63.36
                ]
              ]
            },
            {
              "id": "H03.A_content.relation",
              "reason": "原声为老人说梦见你，输出却由年轻女声说出该句。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  116.92,
                  123.32
                ]
              ],
              "output_intervals": [
                [
                  116.02,
                  117.98
                ]
              ]
            },
            {
              "id": "H05.A_content.relation",
              "reason": "音频缺失关键台词，且将睡眠话题错误替换为进食内容。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  340.24,
                  348.32
                ],
                [
                  360.04,
                  372.84
                ]
              ],
              "output_intervals": [
                [
                  340.08,
                  348.14
                ],
                [
                  364.38,
                  370.32
                ]
              ]
            },
            {
              "id": "H06.A_content.relation",
              "reason": "源片S042与S044由不同年龄音色发声，输出却将两者均替换为同一年轻TTS音色，角色归属完全错误。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  481.48,
                  485.72
                ]
              ],
              "output_intervals": [
                [
                  481.22,
                  485.42
                ]
              ]
            },
            {
              "id": "H07.A_content.relation",
              "reason": "配音未读出哈尔德的名字，且错误地加入了关于墓园的无关内容。",
              "lost": 0.11029411764705883,
              "source_intervals": [
                [
                  580.2,
                  585.92
                ]
              ],
              "output_intervals": [
                [
                  580.06,
                  584.58
                ]
              ]
            },
            {
              "id": "S004.E_meaning.proposition",
              "reason": "提交事件仅包含前半句“要等十年”，遗漏了后半句关于开花和死亡的核心命题。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  8.96,
                  12.64
                ]
              ],
              "output_intervals": []
            },
            {
              "id": "S008.E_meaning.proposition",
              "reason": "源文本转录错误，将肯定疑问句记成了否定陈述句。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  25.96,
                  29.28
                ]
              ],
              "output_intervals": [
                [
                  25.82,
                  28.24
                ]
              ]
            },
            {
              "id": "S008.E_meaning.intent",
              "reason": "源句为惊讶反问，delivery_note误判为纠正数字。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  25.96,
                  29.28
                ]
              ],
              "output_intervals": [
                [
                  25.82,
                  28.24
                ]
              ]
            },
            {
              "id": "S009.E_meaning.proposition",
              "reason": "瑞典语转录将fast(但是)错录为först(首先)，改变逻辑关系。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  30.92,
                  34.16
                ]
              ],
              "output_intervals": [
                [
                  30.36,
                  33.1
                ]
              ]
            },
            {
              "id": "S009.E_meaning.intent",
              "reason": "delivery_note误判为词句不清，实为平稳陈述事实。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  30.92,
                  34.16
                ]
              ],
              "output_intervals": [
                [
                  30.36,
                  33.1
                ]
              ]
            },
            {
              "id": "S012.E_meaning.proposition",
              "reason": "瑞典语转录严重失真，将“Tycker inte jag”（我不这么认为）错录为问句。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  44.16,
                  47.96
                ]
              ],
              "output_intervals": [
                [
                  45.88,
                  46.44
                ]
              ]
            },
            {
              "id": "S012.E_meaning.intent",
              "reason": "delivery_note标注为反问，但源语境中园丁是在平静地否定对方的悲伤观点。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  44.16,
                  47.96
                ]
              ],
              "output_intervals": [
                [
                  45.88,
                  46.44
                ]
              ]
            },
            {
              "id": "S014.E_meaning.proposition",
              "reason": "源事件为“该死...是，是，是！”，提交却记作“天哪！”丢失了肯定与咒骂语义。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  67.4,
                  69.4
                ]
              ],
              "output_intervals": []
            },
            {
              "id": "S014.E_meaning.intent",
              "reason": "delivery_note“惊呼”与实际源句中连续快速重复的高昂兴奋语气不符。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  67.4,
                  69.4
                ]
              ],
              "output_intervals": [
                [
                  61.96,
                  63.36
                ]
              ]
            },
            {
              "id": "S016.E_meaning.proposition",
              "reason": "瑞典语转录文本与实际音频不符，遗漏了核心的问候语和人名信息。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  91.76,
                  94.72
                ]
              ],
              "output_intervals": [
                [
                  90.82,
                  92.72
                ]
              ]
            },
            {
              "id": "S016.E_meaning.intent",
              "reason": "源句是轻柔的晨间问候并呼唤名字，并非单纯的轻声提醒记忆事项。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  91.76,
                  94.72
                ]
              ],
              "output_intervals": [
                [
                  90.82,
                  92.72
                ]
              ]
            },
            {
              "id": "S019.E_meaning.proposition",
              "reason": "瑞典语文本缺失了关键的时间状语“i natt”（昨晚/今夜）。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  117.22,
                  118.8
                ]
              ],
              "output_intervals": []
            },
            {
              "id": "S023.E_meaning.proposition",
              "reason": "提交转录漏掉了老人强调自己干净的后续话语“Jag är ren!”，核心信息缺失。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  145.72,
                  149.68
                ]
              ],
              "output_intervals": [
                [
                  144.92,
                  146.46
                ],
                [
                  147.56,
                  147.86
                ]
              ]
            },
            {
              "id": "S023.E_meaning.intent",
              "reason": "源句中老人的拒绝极其大声、沙哑且激动，提交仅标注为平淡的“短促拒绝”。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  145.72,
                  149.68
                ]
              ],
              "output_intervals": [
                [
                  144.92,
                  146.46
                ],
                [
                  147.56,
                  147.86
                ]
              ]
            },
            {
              "id": "S024.E_meaning.proposition",
              "reason": "源文本将hitta误写为hit，且提交声明截断了后半句。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  246.88,
                  249.76
                ]
              ],
              "output_intervals": [
                [
                  246.82,
                  254.52
                ]
              ]
            },
            {
              "id": "S031.E_meaning.proposition",
              "reason": "提交声称源文为“planta eller natten”，实际发音是“hela natten”，篡改了原意。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  340.24,
                  344.28
                ]
              ],
              "output_intervals": []
            },
            {
              "id": "S032.E_meaning.proposition",
              "reason": "瑞典语转录将sover（睡）错写成äter（吃），核心命题发生根本性改变。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  345.2,
                  348.32
                ]
              ],
              "output_intervals": [
                [
                  344.76,
                  345.64
                ]
              ]
            },
            {
              "id": "S032.E_meaning.intent",
              "reason": "源意是回答睡眠少，提交误读为饮食少，delivery_note与实际意图不符。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  345.2,
                  348.32
                ]
              ],
              "output_intervals": [
                [
                  344.76,
                  345.64
                ]
              ]
            },
            {
              "id": "S034.E_meaning.proposition",
              "reason": "源事件包含园丁否认与Mette回应，提交却将两句话分别错配给不同角色并篡改语义。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  365.6,
                  369.44
                ]
              ],
              "output_intervals": [
                [
                  364.38,
                  368.82
                ]
              ]
            },
            {
              "id": "S034.E_meaning.intent",
              "reason": "将园丁平静的陈述误标为Mette的“克制地纠正”，完全偏离原意与角色。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  365.6,
                  366.8
                ]
              ],
              "output_intervals": [
                [
                  364.38,
                  365.48
                ]
              ]
            },
            {
              "id": "S035.E_meaning.proposition",
              "reason": "提交计划中完全没有保留S035的核心命题，相关文本被篡改为毫无关联的内容。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  369.6,
                  372.84
                ]
              ],
              "output_intervals": []
            },
            {
              "id": "S035.E_meaning.intent",
              "reason": "delivery_note标注为“追问身世”，符合源语境，但因整体事件对齐错误，该意图归属于错误的文本片段。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  369.6,
                  372.84
                ]
              ],
              "output_intervals": [
                [
                  367.54,
                  368.82
                ]
              ]
            },
            {
              "id": "S042.E_meaning.proposition",
              "reason": "源文本vibrera mer被误转为liberera ner，改变核心语义。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  481.48,
                  485.72
                ]
              ],
              "output_intervals": [
                [
                  481.22,
                  485.42
                ]
              ]
            },
            {
              "id": "S042.E_meaning.intent",
              "reason": "源意图是要求增强振动感，交付注仅泛称谈论物件不清。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  481.48,
                  485.72
                ]
              ],
              "output_intervals": [
                [
                  481.22,
                  485.42
                ]
              ]
            },
            {
              "id": "S044.E_meaning.intent",
              "reason": "源句是直接的疑问确认，并非“半开玩笑”，且发音清晰而非词句不清。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  492.78,
                  494.3
                ]
              ],
              "output_intervals": []
            },
            {
              "id": "S050.E_meaning.proposition",
              "reason": "源句核心命题是询问是否有有趣的事发生，而译文仅表达数量疑问，丢失关键信息。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  574.36,
                  577.76
                ]
              ],
              "output_intervals": [
                [
                  573.64,
                  574.9
                ],
                [
                  576.66,
                  577.66
                ]
              ]
            },
            {
              "id": "S051.E_meaning.proposition",
              "reason": "源句提及Harald，提交文本改为“他已经”，丢失了核心人物信息。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  580.2,
                  582.0
                ]
              ],
              "output_intervals": [
                [
                  580.06,
                  582.52
                ]
              ]
            },
            {
              "id": "S052.E_meaning.proposition",
              "reason": "源句意为“当然是墓园里的那个疯子”，提交转录误听为“我去过很多次墓园”。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  583.08,
                  585.92
                ]
              ],
              "output_intervals": [
                [
                  582.52,
                  584.58
                ]
              ]
            },
            {
              "id": "S052.E_meaning.intent",
              "reason": "源句带有强调和解释口吻，delivery_note仅描述为“平静补充”，不够准确。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  583.08,
                  585.92
                ]
              ],
              "output_intervals": [
                [
                  582.52,
                  584.58
                ]
              ]
            },
            {
              "id": "S053.E_meaning.proposition",
              "reason": "事件文本遗漏了关于月经的核心命题内容。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  588.76,
                  592.72
                ]
              ],
              "output_intervals": [
                [
                  588.38,
                  590.12
                ]
              ]
            },
            {
              "id": "S053.E_meaning.intent",
              "reason": "delivery_note称原声词句不清，实际发音清晰且情绪明确，描述与事实不符。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  588.76,
                  592.72
                ]
              ],
              "output_intervals": [
                [
                  588.38,
                  590.12
                ]
              ]
            },
            {
              "id": "S054.E_meaning.proposition",
              "reason": "源文本为“Men skit i honom nu.”，提交将其错误拆分并遗漏了代词“honom”。",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  596.32,
                  599.68
                ]
              ],
              "output_intervals": [
                [
                  595.7,
                  596.18
                ],
                [
                  596.72,
                  597.98
                ],
                [
                  597.98,
                  598.22
                ]
              ]
            },
            {
              "id": "S056.E_meaning.intent",
              "reason": "源句带不耐烦与轻蔑语气，交付说明仅写专注说明未体现情绪",
              "lost": 0.060483870967741944,
              "source_intervals": [
                [
                  640.08,
                  644.76
                ]
              ],
              "output_intervals": []
            },
            {
              "id": "S030.A_identity.pitch",
              "reason": "源音调较高属女性，输出音调低沉属男性，音高区间严重不匹配。",
              "lost": 0.15625,
              "source_intervals": [
                [
                  318.44,
                  320.44
                ]
              ],
              "output_intervals": [
                [
                  317.42,
                  318.82
                ]
              ]
            },
            {
              "id": "S030.A_identity.texture",
              "reason": "源声音自然柔和，输出呈现典型的Piper TTS颗粒感与僵硬质地。",
              "lost": 0.15625,
              "source_intervals": [
                [
                  318.44,
                  320.44
                ]
              ],
              "output_intervals": [
                [
                  317.42,
                  318.82
                ]
              ]
            },
            {
              "id": "S030.A_identity.resonance",
              "reason": "源共鸣清亮偏前，输出厚重且带有明显的机械合成感，特征不相容。",
              "lost": 0.15625,
              "source_intervals": [
                [
                  318.44,
                  320.44
                ]
              ],
              "output_intervals": [
                [
                  317.42,
                  318.82
                ]
              ]
            },
            {
              "id": "S030.A_identity.identity",
              "reason": "源为年轻女声，输出使用老年男声TTS，音色与角色完全不符。",
              "lost": 0.15625,
              "source_intervals": [
                [
                  318.44,
                  320.44
                ]
              ],
              "output_intervals": [
                [
                  317.42,
                  318.82
                ]
              ]
            },
            {
              "id": "S031.A_identity.1.pitch",
              "reason": "TTS固定音高曲线平滑单调，缺乏源角色自然的音调变化和情感重音。",
              "lost": 0.15625,
              "source_intervals": [
                [
                  340.24,
                  344.28
                ]
              ],
              "output_intervals": [
                [
                  340.08,
                  344.14
                ]
              ]
            },
            {
              "id": "S031.A_identity.1.texture",
              "reason": "音质干净无杂质，丢失了源角色可能具备的气声、沙哑或特定呼吸纹理。",
              "lost": 0.15625,
              "source_intervals": [
                [
                  340.24,
                  344.28
                ]
              ],
              "output_intervals": [
                [
                  340.08,
                  344.14
                ]
              ]
            },
            {
              "id": "S031.A_identity.1.resonance",
              "reason": "声音共鸣特征为典型电子合成质感，缺失源真人嗓音的胸腔/头腔共振。",
              "lost": 0.15625,
              "source_intervals": [
                [
                  340.24,
                  344.28
                ]
              ],
              "output_intervals": [
                [
                  340.08,
                  344.14
                ]
              ]
            },
            {
              "id": "S031.A_identity.1.identity",
              "reason": "源角色Ida为年轻女性，输出却使用通用女声TTS，非同一演员音色。",
              "lost": 0.15625,
              "source_intervals": [
                [
                  340.24,
                  344.28
                ]
              ],
              "output_intervals": [
                [
                  340.08,
                  344.14
                ]
              ]
            },
            {
              "id": "S047.A_identity.identity",
              "reason": "输出使用通用TTS合成音，缺乏原角色特有的音色特征，无法辨认为同一人物。",
              "lost": 0.15625,
              "source_intervals": [
                [
                  519.52,
                  521.2
                ]
              ],
              "output_intervals": [
                [
                  519.0,
                  519.86
                ]
              ]
            },
            {
              "id": "S053.A_identity.pitch",
              "reason": "TTS音高平稳，缺乏源角色愤怒时的高亢起伏",
              "lost": 0.15625,
              "source_intervals": [
                [
                  588.76,
                  592.72
                ]
              ],
              "output_intervals": [
                [
                  588.38,
                  590.12
                ]
              ]
            },
            {
              "id": "S053.A_identity.texture",
              "reason": "TTS音质光滑，丢失源角色激动时的沙哑质感",
              "lost": 0.15625,
              "source_intervals": [
                [
                  588.76,
                  592.72
                ]
              ],
              "output_intervals": [
                [
                  588.38,
                  590.12
                ]
              ]
            },
            {
              "id": "S053.A_identity.resonance",
              "reason": "TTS共鸣单薄，与源角色饱满的胸腔共鸣不符",
              "lost": 0.15625,
              "source_intervals": [
                [
                  588.76,
                  592.72
                ]
              ],
              "output_intervals": [
                [
                  588.38,
                  590.12
                ]
              ]
            },
            {
              "id": "S053.A_identity.identity",
              "reason": "使用通用TTS音色，无法辨认为同一人物Ida",
              "lost": 0.15625,
              "source_intervals": [
                [
                  588.76,
                  592.72
                ]
              ],
              "output_intervals": [
                [
                  588.38,
                  590.12
                ]
              ]
            },
            {
              "id": "S017.A_identity.1.pitch",
              "reason": "原声音高低沉，输出音高明显偏高不符。",
              "lost": 0.15625,
              "source_intervals": [
                [
                  103.94,
                  104.7
                ]
              ],
              "output_intervals": [
                [
                  102.26,
                  103.48
                ]
              ]
            },
            {
              "id": "S017.A_identity.1.texture",
              "reason": "完全丢失原声明显的沙哑和气声质感。",
              "lost": 0.15625,
              "source_intervals": [
                [
                  103.94,
                  104.7
                ]
              ],
              "output_intervals": [
                [
                  102.26,
                  103.48
                ]
              ]
            },
            {
              "id": "S017.A_identity.1.resonance",
              "reason": "原声胸腔共鸣弱且干瘪，输出圆润饱满不符。",
              "lost": 0.15625,
              "source_intervals": [
                [
                  103.94,
                  104.7
                ]
              ],
              "output_intervals": [
                [
                  102.26,
                  103.48
                ]
              ]
            },
            {
              "id": "S017.A_identity.1.identity",
              "reason": "原声为虚弱沙哑老妇，输出为清脆年轻TTS音色。",
              "lost": 0.15625,
              "source_intervals": [
                [
                  103.94,
                  104.7
                ]
              ],
              "output_intervals": [
                [
                  102.26,
                  103.48
                ]
              ]
            },
            {
              "id": "S019.A_identity.1.pitch",
              "reason": "源角色音调低沉苍老，中文配音音调偏高清脆，两者音高区间完全不兼容。",
              "lost": 0.15625,
              "source_intervals": [
                [
                  117.22,
                  118.8
                ]
              ],
              "output_intervals": [
                [
                  116.02,
                  117.98
                ]
              ]
            },
            {
              "id": "S019.A_identity.1.texture",
              "reason": "源角色带有明显的沙哑和气声质感，中文配音平滑干净，丢失了关键的音质纹理。",
              "lost": 0.15625,
              "source_intervals": [
                [
                  117.22,
                  118.8
                ]
              ],
              "output_intervals": [
                [
                  116.02,
                  117.98
                ]
              ]
            },
            {
              "id": "S019.A_identity.1.resonance",
              "reason": "源角色声音虚弱单薄，中文配音共鸣饱满有力，未能还原老人的生理声学特征。",
              "lost": 0.15625,
              "source_intervals": [
                [
                  117.22,
                  118.8
                ]
              ],
              "output_intervals": [
                [
                  116.02,
                  117.98
                ]
              ]
            },
            {
              "id": "S019.A_identity.1.identity",
              "reason": "源角色（Marta）为老年女性，中文却使用了年轻女性（Mette）的声音进行配音，身份错乱。",
              "lost": 0.15625,
              "source_intervals": [
                [
                  117.22,
                  118.8
                ]
              ],
              "output_intervals": [
                [
                  116.02,
                  117.98
                ]
              ]
            },
            {
              "id": "S041.A_identity.pitch",
              "reason": "配音音调偏高且平稳，不符合老年虚弱角色的音域。",
              "lost": 0.15625,
              "source_intervals": [
                [
                  468.44,
                  471.44
                ]
              ],
              "output_intervals": [
                [
                  468.44,
                  471.44
                ]
              ]
            }
          ],
          "pending": 237,
          "wer": {
            "reference_words": 421,
            "submitted_words": 736,
            "edit_distance": 506,
            "wer": 1.2019002375296912,
            "score": 0
          },
          "score_lower_bound": 5.3393,
          "score_upper_bound": 17.775,
          "voice_review": {
            "clips": [
              {
                "role": "Mette",
                "time": "487.84 秒",
                "source": "variant-results/case-40/luna/voice-review/mette-2-source.m4a",
                "output": "variant-results/case-40/luna/voice-review/mette-2-answer.m4a",
                "verdict": "pending"
              },
              {
                "role": "Mette",
                "time": "708.80 秒",
                "source": "variant-results/case-40/luna/voice-review/mette-3-source.m4a",
                "output": "variant-results/case-40/luna/voice-review/mette-3-answer.m4a",
                "verdict": "pending"
              },
              {
                "role": "Ida",
                "time": "318.44 秒",
                "source": "variant-results/case-40/luna/voice-review/ida-1-source.m4a",
                "output": "variant-results/case-40/luna/voice-review/ida-1-answer.m4a",
                "verdict": "pending"
              },
              {
                "role": "Ida",
                "time": "340.24 秒",
                "source": "variant-results/case-40/luna/voice-review/ida-2-source.m4a",
                "output": "variant-results/case-40/luna/voice-review/ida-2-answer.m4a",
                "verdict": "pending"
              }
            ]
          }
        },
        "notes": "瑞典语听写 WER 120.2%。已确认未通过 59 项验收检查。听觉裁判对照同角色的分轨复核跨段音色。"
      }
    },
    "result_status": "Sol 评分完成，Luna 仍保留评分区间。"
  },
  "46": {
    "task": "# 第14题 / Case46：《Sprite Fright》· 中文口述影像\n\n为 input/source.mp4 制作中文口述影像，让能听见原声、但看不见画面的观众跟上重要的视觉信息。请实际生成可听看的成片，不要只写方案。本轮按公开 SCORING.md 最终乘积公式评分；不提供私有参考或旁白参考答案。\n\n## 输入\n- source.mp4：选定公开片段的剧情部分，81 秒，1280×536，24 fps，1944 帧。正片 02:04–03:25 的连续片段。保留题包画面及时间轴。\n- original.wav：从本题主视频解码的48kHz立体声PCM原声。\n- reference_zh.srt：辅助中文字幕草稿，详见 SUBTITLE_NOTES.md。不得把字幕边界当对白边界，也不得认为没有字幕就没有对白。\n- glossary.json：译名与用语表，不包含视觉身份答案。\n- tools/tts.py：本地TTS接口；player.html：可独立关闭旁白的播放器模板。\n\n## 委托要求\n1. 自行分析实际原声，找出对白间的空隙，再结合画面决定哪些信息值得讲。不给可用窗口。需要区分原声能表达的信息与必须靠旁白补充的信息。\n2. 优先帮助观众跟上主体、关键动作、物件变化及因果。不要为了说全所有细节而塞满空隙；对白或明显音效已充分表达的信息可以不说。\n3. 不要说错主体、虚构心理或提前透露尚未在画面中揭示的信息。不确定人物姓名可用清楚且一致的外观指代。\n4. 旁白不得覆盖对白。中文措辞应短而自然，建议约3—4.5汉字/秒；必须实际合成并检查时长，不能只用字数估时。不得异常加速或截断词尾。\n5. 不得暂停、变速、删镜头、补黑场或修改画面。字幕外挂，不得烧录旁白字幕或遮住原画面。保留全部原声；旁白出现时对原声做-6dB压低，可用50—100ms平滑起落防止爆音，结束后恢复。不得借压低原声来覆盖对白；注意关键音效保护。\n6. 输出的base_track.wav为未加旁白、未局部压低的原声基轨；ducked_base_track.wav为按旁白安排压低的原声；ad_track.wav为全长旁白轨；mix.wav=ducked_base_track.wav+ad_track.wav。关闭旁白时播放base，开启时播放ducked_base+ad，画面与进度不变。四条轨从0开始、全长一致，48kHz立体声PCM。可统一降低整体增益以防削波，但须在README声明，保持旁白期间原声相对基轨低6dB。建议真峰值≤-1dBTP。\n\n## 必交文件\n- accessible.mp4：H.264/AAC，原画面与帧数不变，内置真实旁白混音。\n- ad.vtt：中文旁白稿及实际安排时间；所有时间为主片相对时间。\n- cues/：每条实际使用的配音WAV；不能静音占位，不可只交在线TTS链接。\n- base_track.wav、ducked_base_track.wav、ad_track.wav、mix.wav。\n- ad_plan.json：每条id/start/end/text/wav/visual_source_interval/knowledge_time，说明对应什么画面、信息最早何时可知；与VTT、配音实际时长一致。\n- self_check.json：逐条报告实际配音长度、自己判断的对白重叠风险、是否重复原声、未完成或不确定之处。可附省略重要事件的理由。自查不等于正式评测。\n- player_config.json、player.html：播放器可真实开关旁白。\n- rebuild.json、rebuild.py（或其他离线脚本）、README.md：可用输入与提交的配音素材离线重建成片；不得仅复制成片、联网或重新调用TTS。\n结构见 submission_schema.json。无需制作旧题的selection_audit.json，不要求达到固定事件数量。\n\n## 执行条件\n限时60分钟，含模型调用、分析、合成、渲染和自检；提前完成即冻结，到时终止全部子进程并保留当时文件。禁止子代理。输入只读；交付放/workspace/submission，临时文件放/workspace/scratch。\n模型为gpt-6-luna，推理high，使用Codex harness。当前接口不支持原生音频输入；可用离线ASR、波形/频谱分析、视频抽帧及本地媒体工具，不可调用其他在线模型替代。工具的实际使用与局限须在README如实说明。\n评分协议见SCORING.md；禁止寻找私有参考、历史答卷或评分器。\n",
    "credit": "Sprite Fright © Blender Foundation | studio.blender.org，片段 02:04–03:25。使用 Creative Commons Attribution 4.0 的公开发行视频。裁切，缩放至 1280×536，自成片解码 48 kHz 立体声原声。原片 https://commons.wikimedia.org/wiki/File:Sprite_Fright_-_Blender_Open_Movie-full_movie.webm 。获取副本 https://archive.org/details/sprite-fright-blender-open-movie_202406 。",
    "files": [
      {
        "name": "SCORING.md",
        "path": "SCORING.md",
        "url": "variant-results/case-46/candidate/SCORING.md",
        "kind": "document",
        "bytes": 3487,
        "text": "# Sprite Fright：最终评分方案\n\n最终分 = 视觉理解分 V × 口述影像有效交付系数 C，再执行已确认失败的硬门槛封顶。满分100分。\n\n## 视觉理解分 V\n\n| 指标 | 满分 | 评价内容 |\n|---|---:|---|\n| 关键视觉事实 | 45 | 人物、动作、主体位置与关键可见事件是否准确，有无重要遗漏或编造 |\n| 主体位置、行动与揭示关系 | 35 | 观察者、精灵及其位置和动作变化是否连续、清楚、正确 |\n| 信息揭示时机 | 5 | 是否提前透露尚未出现的关键视觉信息 |\n| 描述及时性 | 15 | 重要信息是否在听众仍能用于理解当前事件的时间内说出 |\n| 合计 | 100 | |\n\n## 口述影像有效交付系数 C\n\n| 构成小项 | 内部满分 | 评价内容 |\n|---|---:|---|\n| 对白避让 | 5 | 旁白是否合理避开原片对白 |\n| 对白可懂度 | 10 | 加入旁白后原对白是否仍可听清 |\n| 关键音效保护 | 10 | 理解剧情所需的音效是否受到遮蔽 |\n| 混音数值规格 | 5 | 响度、峰值等是否符合要求 |\n| 指代与信息效率 | 5 | 人物指代是否清楚、表达是否简洁有效 |\n| 实际语音自然度与可懂度 | 5 | 实际配音是否自然、清晰、易理解 |\n| 交付一致性与可重建性 | 15 | 文件、文本、时间轴和输出是否一致，能否独立重建 |\n| 原声保留与旁白开关 | 10 | 原声是否保留，旁白是否可独立开关 |\n| 合计 Q | 65 | C = Q ÷ 65，取值0至1 |\n\n## 分数构成算法\n\n1. 沿用独立裁判及程序检查已有的逐项得分率 r（0至1），不改变事实匹配、裁决、题干或冻结答卷。\n2. 每项得分 = 本版该项满分 × r。\n3. V = 45×r事实 + 35×r状态 + 5×r揭示 + 15×r及时性。\n4. Q = 5×r避让 + 10×r对白可懂度 + 10×r音效 + 5×r混音 + 5×r指代 + 5×r语音 + 15×r交付 + 10×r原声开关。\n5. C = Q÷65。最终分 S = min(V×C, 已确认失败门槛的最低封顶分)；无失败门槛时上限100。\n\n有效交付八项只汇总为一个系数，不额外加分，也不逐项连乘。某小项零分只减少该系数，不自动使整题归零。若V=0或Q=0，最终分为0。\n\n中间计算保留精度，结果文件保留四位小数，页面显示两位。通过判断依据未舍入结果。达到85分、各项目已评且所有门槛pass才通过。unknown不等于pass或fail，不据此封顶。\n\n待评项不视为已完成或直接判零，使用固定分母分别计算V、Q的上下界，再计算乘积区间。存在待评项时不生成确定总分。\n\n## 硬门槛与判分边界\n\n- 无有效成片或无真实旁白：确认失败时最高20分。\n- 暂停、变速、删镜头或插黑场绕过固定时间轴：确认失败时最高20分。\n- 关键主体位置或行动关系说反并导致错误理解，或提前泄露关键视觉揭示：有明确证据时最高59分。\n- 实际声音证明关键对白或音效被严重掩蔽并影响理解：确认失败时最高59分。\n\n事实项评价准确性与重要覆盖，状态项评价关系链，及时性评价有证据的播报延迟，揭示时机评价提前泄露。遗漏不自动等于迟到或提前泄露。同一错误不得重复施加无依据陈述扣分；对不同维度的独立影响必须分别说明。\n\n无固定旁白数量，不要求描述所有细节；保留既有替代覆盖、证据不确定性和声音窗口规则。评价实际交付声音，计划与自查不能替代成片证据。\n"
      },
      {
        "name": "TASK.md",
        "path": "TASK.md",
        "url": "variant-results/case-46/candidate/TASK.md",
        "kind": "document",
        "bytes": 4180,
        "text": "# 第14题 / Case46：《Sprite Fright》· 中文口述影像\n\n为 input/source.mp4 制作中文口述影像，让能听见原声、但看不见画面的观众跟上重要的视觉信息。请实际生成可听看的成片，不要只写方案。本轮按公开 SCORING.md 最终乘积公式评分；不提供私有参考或旁白参考答案。\n\n## 输入\n- source.mp4：选定公开片段的剧情部分，81 秒，1280×536，24 fps，1944 帧。正片 02:04–03:25 的连续片段。保留题包画面及时间轴。\n- original.wav：从本题主视频解码的48kHz立体声PCM原声。\n- reference_zh.srt：辅助中文字幕草稿，详见 SUBTITLE_NOTES.md。不得把字幕边界当对白边界，也不得认为没有字幕就没有对白。\n- glossary.json：译名与用语表，不包含视觉身份答案。\n- tools/tts.py：本地TTS接口；player.html：可独立关闭旁白的播放器模板。\n\n## 委托要求\n1. 自行分析实际原声，找出对白间的空隙，再结合画面决定哪些信息值得讲。不给可用窗口。需要区分原声能表达的信息与必须靠旁白补充的信息。\n2. 优先帮助观众跟上主体、关键动作、物件变化及因果。不要为了说全所有细节而塞满空隙；对白或明显音效已充分表达的信息可以不说。\n3. 不要说错主体、虚构心理或提前透露尚未在画面中揭示的信息。不确定人物姓名可用清楚且一致的外观指代。\n4. 旁白不得覆盖对白。中文措辞应短而自然，建议约3—4.5汉字/秒；必须实际合成并检查时长，不能只用字数估时。不得异常加速或截断词尾。\n5. 不得暂停、变速、删镜头、补黑场或修改画面。字幕外挂，不得烧录旁白字幕或遮住原画面。保留全部原声；旁白出现时对原声做-6dB压低，可用50—100ms平滑起落防止爆音，结束后恢复。不得借压低原声来覆盖对白；注意关键音效保护。\n6. 输出的base_track.wav为未加旁白、未局部压低的原声基轨；ducked_base_track.wav为按旁白安排压低的原声；ad_track.wav为全长旁白轨；mix.wav=ducked_base_track.wav+ad_track.wav。关闭旁白时播放base，开启时播放ducked_base+ad，画面与进度不变。四条轨从0开始、全长一致，48kHz立体声PCM。可统一降低整体增益以防削波，但须在README声明，保持旁白期间原声相对基轨低6dB。建议真峰值≤-1dBTP。\n\n## 必交文件\n- accessible.mp4：H.264/AAC，原画面与帧数不变，内置真实旁白混音。\n- ad.vtt：中文旁白稿及实际安排时间；所有时间为主片相对时间。\n- cues/：每条实际使用的配音WAV；不能静音占位，不可只交在线TTS链接。\n- base_track.wav、ducked_base_track.wav、ad_track.wav、mix.wav。\n- ad_plan.json：每条id/start/end/text/wav/visual_source_interval/knowledge_time，说明对应什么画面、信息最早何时可知；与VTT、配音实际时长一致。\n- self_check.json：逐条报告实际配音长度、自己判断的对白重叠风险、是否重复原声、未完成或不确定之处。可附省略重要事件的理由。自查不等于正式评测。\n- player_config.json、player.html：播放器可真实开关旁白。\n- rebuild.json、rebuild.py（或其他离线脚本）、README.md：可用输入与提交的配音素材离线重建成片；不得仅复制成片、联网或重新调用TTS。\n结构见 submission_schema.json。无需制作旧题的selection_audit.json，不要求达到固定事件数量。\n\n## 执行条件\n限时60分钟，含模型调用、分析、合成、渲染和自检；提前完成即冻结，到时终止全部子进程并保留当时文件。禁止子代理。输入只读；交付放/workspace/submission，临时文件放/workspace/scratch。\n模型为gpt-6-luna，推理high，使用Codex harness。当前接口不支持原生音频输入；可用离线ASR、波形/频谱分析、视频抽帧及本地媒体工具，不可调用其他在线模型替代。工具的实际使用与局限须在README如实说明。\n评分协议见SCORING.md；禁止寻找私有参考、历史答卷或评分器。\n"
      },
      {
        "name": "SOURCES.md",
        "path": "input/SOURCES.md",
        "url": "variant-results/case-46/candidate/input/SOURCES.md",
        "kind": "document",
        "bytes": 404,
        "text": "Sprite Fright © Blender Foundation | studio.blender.org，片段 02:04–03:25。使用 Creative Commons Attribution 4.0 的公开发行视频。裁切，缩放至 1280×536，自成片解码 48 kHz 立体声原声。原片 https://commons.wikimedia.org/wiki/File:Sprite_Fright_-_Blender_Open_Movie-full_movie.webm 。获取副本 https://archive.org/details/sprite-fright-blender-open-movie_202406 。\n"
      },
      {
        "name": "SUBTITLE_NOTES.md",
        "path": "input/SUBTITLE_NOTES.md",
        "url": "variant-results/case-46/candidate/input/SUBTITLE_NOTES.md",
        "kind": "document",
        "bytes": 157,
        "text": "辅助中文字幕依据对应英文字幕整理。窗内无字幕时仍可能有非语言人声、动作声、环境声和配乐。以实际原声为准。\n"
      },
      {
        "name": "glossary.json",
        "path": "input/glossary.json",
        "url": "variant-results/case-46/candidate/input/glossary.json",
        "kind": "document",
        "bytes": 220,
        "text": "{\n  \"characters\": {\n    \"Ellie\": \"艾莉\",\n    \"Rex\": \"雷克斯\",\n    \"Victoria\": \"维多利亚\",\n    \"Phil\": \"菲尔\"\n  },\n  \"terms\": {\n    \"sprite\": \"精灵\"\n  },\n  \"note\": \"可用准确、连贯的外观指代。\"\n}\n"
      },
      {
        "name": "original.m4a",
        "path": "input/original.m4a",
        "url": "variant-results/case-46/candidate/input/original.m4a",
        "kind": "audio",
        "bytes": 1167588,
        "meta": {
          "duration": 81.014,
          "width": null,
          "height": null,
          "fps": "0/0",
          "sampleRate": "48000"
        }
      },
      {
        "name": "reference_zh.srt",
        "path": "input/reference_zh.srt",
        "url": "variant-results/case-46/candidate/input/reference_zh.srt",
        "kind": "document",
        "bytes": 855,
        "text": "1\n00:00:32,333 --> 00:00:35,208\n太不可思议了，这是个新物种。\n\n2\n00:00:35,208 --> 00:00:37,875\n那些到底是什么东西？\n\n3\n00:00:37,875 --> 00:00:40,542\n像是地精和蘑菇生出来的。\n\n4\n00:00:53,375 --> 00:00:55,583\n它们真可爱。\n\n5\n00:00:55,583 --> 00:00:58,000\n对，可爱极了。\n\n6\n00:00:58,000 --> 00:01:01,625\n抓一只肯定能赚大钱。\n\n7\n00:01:01,625 --> 00:01:02,958\n我们会出名的！\n\n8\n00:01:02,958 --> 00:01:04,292\n还能上音乐电视台。\n\n9\n00:01:04,292 --> 00:01:05,875\n不知道吃起来是什么味道。\n\n10\n00:01:05,875 --> 00:01:08,500\n我们不该打扰它们的栖息地。\n\n11\n00:01:08,500 --> 00:01:11,917\n对，对，当然。\n\n12\n00:01:11,917 --> 00:01:13,500\n你们好。\n\n13\n00:01:13,500 --> 00:01:15,000\n欢迎你们，朋友。\n\n14\n00:01:15,000 --> 00:01:17,208\n我这就下来。\n"
      },
      {
        "name": "source.mp4",
        "path": "input/source.mp4",
        "url": "variant-results/case-46/candidate/input/source.mp4",
        "kind": "video",
        "bytes": 7303632,
        "meta": {
          "duration": 81.013991,
          "width": 1280,
          "height": 536,
          "fps": "24/1",
          "sampleRate": null
        }
      },
      {
        "name": "input_manifest.json",
        "path": "input_manifest.json",
        "url": "variant-results/case-46/candidate/input_manifest.json",
        "kind": "document",
        "bytes": 1697,
        "text": "[\n  {\n    \"file\": \"SCORING.md\",\n    \"bytes\": 3487,\n    \"sha256\": \"1b622db5f3cbc3e343e0b8fb4c903dbac9140cc561830430752806cd863239d8\"\n  },\n  {\n    \"file\": \"TASK.md\",\n    \"bytes\": 4180,\n    \"sha256\": \"603a7c6708992438d24eb09f4685c056dad5e52c64dbaf99b1f76b055b2ba673\"\n  },\n  {\n    \"file\": \"input/SOURCES.md\",\n    \"bytes\": 404,\n    \"sha256\": \"bb55d2a7f803374e10b25dbb673d106f3cceae3def41bae296e60f607d159291\"\n  },\n  {\n    \"file\": \"input/SUBTITLE_NOTES.md\",\n    \"bytes\": 157,\n    \"sha256\": \"54a4e982f267ae4b01b16ed7d328ecfa7e7d02395ffc686253b7ef6cc08623df\"\n  },\n  {\n    \"file\": \"input/glossary.json\",\n    \"bytes\": 220,\n    \"sha256\": \"9e47016a755db333fd1ecb5d60a0f3f01eb4c138c24c780f86f11d8beea87617\"\n  },\n  {\n    \"file\": \"input/original.wav\",\n    \"bytes\": 15554962,\n    \"sha256\": \"2ff8488378ca38769583daceddd1a1c89aa0bbd4c492dba566b06781cf009bbe\"\n  },\n  {\n    \"file\": \"input/reference_zh.srt\",\n    \"bytes\": 855,\n    \"sha256\": \"a07dc9da28832c0f17a4ba340ea92382f582128f961898007636f6842ac566c4\"\n  },\n  {\n    \"file\": \"input/source.mp4\",\n    \"bytes\": 19697948,\n    \"sha256\": \"6a41624c265d9e449a77069e3b48d8edf61ef2fa346e07f7c42e3c043c526b4e\"\n  },\n  {\n    \"file\": \"player.html\",\n    \"bytes\": 3124,\n    \"sha256\": \"c4bf83c2ab2cd335476d0ae2135f46389f963996be43257ff84ada8d6541b78f\"\n  },\n  {\n    \"file\": \"submission_schema.json\",\n    \"bytes\": 1687,\n    \"sha256\": \"0ed41c6529c992bf9f18b19f20ed008913dd78b3d44cae2d3014f8b18498fa0c\"\n  },\n  {\n    \"file\": \"tools/media.py\",\n    \"bytes\": 3278,\n    \"sha256\": \"edbb9610c99d37a0f9a3187a06e65c97eb6680bde42ee14c165e864265b46423\"\n  },\n  {\n    \"file\": \"tools/tts.py\",\n    \"bytes\": 1922,\n    \"sha256\": \"3b23c39b9d52b6459291580f087e72fb9d3bfdd301e198b9dd3733674ee005fc\"\n  }\n]\n"
      },
      {
        "name": "player.html",
        "path": "player.html",
        "url": "variant-results/case-46/candidate/player.html",
        "kind": "document",
        "bytes": 3124,
        "text": "<!doctype html><meta charset=\"utf-8\"><title>OmniALE 描述轨播放器</title>\n<style>body{font:16px system-ui;background:#142034;color:#edf3fc;max-width:1100px;margin:28px auto;padding:0 20px}video{width:100%;background:black}button,select,input{margin:8px;padding:10px}#status{white-space:pre-wrap;color:#b8d7f8}</style>\n<h1>课程 / 口述影像播放器</h1><p>选择整个交付文件夹。播放器忽略成片内置音轨，分别播放 原声、压低原声和旁白三条轨，开关旁白时原声恢复，以实现真实开关。</p>\n<input id=\"folder\" type=\"file\" webkitdirectory multiple><video id=\"v\" controls muted></video><audio id=\"base\"></audio><audio id=\"ad\"></audio><audio id=\"duck\"></audio>\n<button id=\"toggle\">描述：开启</button><select id=\"chapters\"><option>阶段导航</option></select><pre id=\"status\"></pre>\n<script>\nconst v=document.querySelector('#v'),base=document.querySelector('#base'),ad=document.querySelector('#ad'),duck=document.querySelector('#duck'),status=document.querySelector('#status');let enabled=true,urls=[];\nfunction sync(){for(const a of [base,duck,ad]){if(Math.abs(a.currentTime-v.currentTime)>.1)a.currentTime=v.currentTime;a.playbackRate=v.playbackRate;}ad.muted=!enabled;duck.muted=!enabled;base.muted=enabled;}\nv.addEventListener('play',()=>{sync();base.play().catch(e=>status.textContent=e.message);duck.play().catch(e=>status.textContent=e.message);ad.play().catch(e=>status.textContent=e.message)});\nv.addEventListener('pause',()=>{base.pause();duck.pause();ad.pause()});v.addEventListener('seeking',sync);v.addEventListener('ratechange',sync);v.addEventListener('timeupdate',sync);v.addEventListener('ended',()=>{base.pause();duck.pause();ad.pause()});\ndocument.querySelector('#toggle').onclick=()=>{enabled=!enabled;ad.muted=!enabled;duck.muted=!enabled;base.muted=enabled;document.querySelector('#toggle').textContent='描述：'+(enabled?'开启':'关闭');};\ndocument.querySelector('#folder').onchange=async e=>{try{v.pause();urls.forEach(URL.revokeObjectURL);urls=[];let files=[...e.target.files];const get=n=>files.find(f=>f.webkitRelativePath.split('/').slice(1).join('/')===n);let cfgFile=get('player_config.json');if(!cfgFile)throw Error('缺少 player_config.json');let cfg=JSON.parse(await cfgFile.text());for(let [element,name] of [[v,cfg.tracks.video],[base,cfg.tracks.base],[duck,cfg.tracks.ducked_base],[ad,cfg.tracks.description]]){let f=get(name);if(!f)throw Error('缺少 '+name);let url=URL.createObjectURL(f);urls.push(url);element.src=url;}let nav=document.querySelector('#chapters');nav.innerHTML='<option value=\"\">阶段导航</option>';let ch=get('chapters.json');if(ch){let obj=JSON.parse(await ch.text());for(let c of obj.chapters){let opt=document.createElement('option');opt.value=c.output_time;opt.textContent=c.title||('源时间 '+c.source_time+' 秒');nav.append(opt)}}nav.onchange=()=>{if(nav.value!==''){v.currentTime=Number(nav.value);sync();}};sync();status.textContent='已加载。描述开关不改变视频时间轴，关闭后恢复未压低原声。';}catch(err){status.textContent=err.message}};\n</script>\n"
      },
      {
        "name": "submission_schema.json",
        "path": "submission_schema.json",
        "url": "variant-results/case-46/candidate/submission_schema.json",
        "kind": "document",
        "bytes": 1687,
        "text": "{\n  \"version\": \"case46-trial-v1-unscored\",\n  \"required_files\": [\n    \"accessible.mp4\",\n    \"ad.vtt\",\n    \"base_track.wav\",\n    \"ducked_base_track.wav\",\n    \"ad_track.wav\",\n    \"mix.wav\",\n    \"ad_plan.json\",\n    \"self_check.json\",\n    \"player_config.json\",\n    \"player.html\",\n    \"rebuild.json\",\n    \"README.md\"\n  ],\n  \"ad_plan.json\": {\n    \"cues\": [\n      {\n        \"id\": \"AD01\",\n        \"start\": \"number seconds\",\n        \"end\": \"number seconds\",\n        \"text\": \"actual Chinese narration\",\n        \"wav\": \"cues/AD01.wav\",\n        \"visual_source_interval\": [\n          \"start\",\n          \"end\"\n        ],\n        \"knowledge_time\": \"earliest evidence time\"\n      }\n    ]\n  },\n  \"player_config.json\": {\n    \"tracks\": {\n      \"video\": \"accessible.mp4\",\n      \"base\": \"base_track.wav\",\n      \"ducked_base\": \"ducked_base_track.wav\",\n      \"description\": \"ad_track.wav\"\n    },\n    \"subtitles\": \"ad.vtt\",\n    \"pause_policy\": \"fixed_timeline\",\n    \"duration\": 81,\n    \"sample_rate\": 48000,\n    \"duck_db\": -6,\n    \"global_gain_db\": 0\n  },\n  \"rebuild.json\": {\n    \"argv\": [\n      \"{python}\",\n      \"{submission}/rebuild.py\",\n      \"--input\",\n      \"{input}\",\n      \"--submission\",\n      \"{submission}\",\n      \"--output\",\n      \"{output}\"\n    ]\n  },\n  \"placeholders\": {\n    \"{input}\": \"directory containing source.mp4 and original.wav\",\n    \"{submission}\": \"submission directory\",\n    \"{output}\": \"output directory; put rebuilt accessible.mp4 inside\",\n    \"{python}\": \"python3 interpreter\"\n  },\n  \"self_check.json\": {\n    \"cues\": \"array of cue id, actual_audio_duration, dialogue_overlap_risk, redundant_audio_risk, notes\",\n    \"unfinished\": \"array of limitations\"\n  },\n  \"scoring\": \"SCORING.md\"\n}"
      },
      {
        "name": "media.py",
        "path": "tools/media.py",
        "url": "variant-results/case-46/candidate/tools/media.py",
        "kind": "document",
        "bytes": 3278,
        "text": "from pathlib import Path\nimport subprocess,json,hashlib,re\nimport numpy as np\nROOT=Path(__file__).resolve().parents[1]\ndef run(args,**kw):\n p=subprocess.run([str(a) for a in args],stdout=subprocess.PIPE,stderr=subprocess.PIPE,**kw)\n if p.returncode:raise RuntimeError(p.stderr.decode('utf8',errors='replace')[-5000:])\n return p.stdout\ndef ff(*args):return run(['ffmpeg','-hide_banner','-loglevel','error','-y',*args])\ndef probe(path):return json.loads(run(['ffprobe','-v','error','-show_format','-show_streams','-of','json',path]))\ndef sha(path):\n h=hashlib.sha256()\n with Path(path).open('rb') as f:\n  while b:=f.read(1048576):h.update(b)\n return h.hexdigest()\ndef write_json(p,data):\n p=Path(p);p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf8')\ndef audio(path,sr=16000):return np.frombuffer(ff('-i',path,'-map','0:a:0','-ac','1','-ar',str(sr),'-f','f32le','pipe:1'),dtype='<f4').copy()\ndef frames(path,full=False):\n filt='scale=32:24' if full else 'crop=iw:trunc(ih*0.68/2)*2:0:0,scale=32:24'\n b=ff('-i',path,'-an','-vf',filt,'-pix_fmt','gray','-f','rawvideo','pipe:1')\n return np.frombuffer(b,dtype=np.uint8).reshape(-1,24,32)\ndef stamp(t):\n ms=round(t*1000);h,ms=divmod(ms,3600000);m,ms=divmod(ms,60000);s,ms=divmod(ms,1000)\n return f'{h:02}:{m:02}:{s:02}.{ms:03}'\ndef secs(s):\n h,m,v=s.strip().replace(',','.').split(':');return int(h)*3600+int(m)*60+float(v)\ndef read_cues(path):\n text=Path(path).read_text(encoding='utf-8-sig',errors='replace').replace('\\r','')\n cues=[]\n if Path(path).suffix.lower()=='.ass':\n  for line in text.splitlines():\n   if line.startswith('Dialogue:'):\n    a=line[len('Dialogue:'):].strip().split(',',9)\n    if len(a)!=10:raise ValueError('Malformed ASS Dialogue')\n    body=re.sub(r'\\{[^}]*\\}','',a[9]).replace('\\\\N','\\n').replace('\\\\n','\\n')\n    cues.append({'start':secs(a[1]),'end':secs(a[2]),'text':body,'speaker':a[4].strip(),'style':a[3]})\n else:\n  lines=text.splitlines()\n  for i,line in enumerate(lines):\n   if '-->' not in line:continue\n   a,b=line.split('-->');body=[]\n   for value in lines[i+1:]:\n    if not value.strip():break\n    body.append(value)\n   cue={'start':secs(a.strip()),'end':secs(b.strip().split()[0]),'text':'\\n'.join(body)}\n   if Path(path).suffix.lower()=='.srt':\n    number=lines[i-1].strip() if i else ''\n    if not number.isdigit():raise ValueError('SRT requires numeric cue IDs')\n    cue['cue_id']=number\n   cues.append(cue)\n for i,c in enumerate(cues):\n  if not (0<=c['start']<c['end']) or not c['text'].strip():raise ValueError(f'Invalid cue {i}')\n if Path(path).suffix.lower()=='.srt' and len({c['cue_id'] for c in cues})!=len(cues):raise ValueError('Duplicate SRT cue ID')\n return cues\ndef write_cues(path,cues):\n vtt=Path(path).suffix=='.vtt';lines=['WEBVTT',''] if vtt else []\n for i,c in enumerate(cues,1):\n  a,b=stamp(c['start']),stamp(c['end'])\n  if not vtt:a,b=a.replace('.',','),b.replace('.',',')\n  lines.extend([str(i),f'{a} --> {b}',c['text'],''])\n Path(path).write_text('\\n'.join(lines),encoding='utf8')\ndef manifest(directory):\n return [{'file':str(p.relative_to(directory)).replace('\\\\','/'),'bytes':p.stat().st_size,'sha256':sha(p)} for p in sorted(Path(directory).rglob('*')) if p.is_file() and p.name!='input_manifest.json']\n"
      },
      {
        "name": "tts.py",
        "path": "tools/tts.py",
        "url": "variant-results/case-46/candidate/tools/tts.py",
        "kind": "document",
        "bytes": 1922,
        "text": "\"\"\"Optional local Windows TTS for solvers; no target-answer text is supplied.\nUsage: python tts.py --text-file UTF8.txt --voice V01 --output output.wav\n\"\"\"\nfrom pathlib import Path\nimport argparse,json,subprocess,tempfile\nfrom media import ROOT,ff,write_json\nVOICES={\n 'V01':('Microsoft Huihui Desktop',0,1.0),\n 'V02':('Microsoft Kangkang',0,1.0),\n 'V03':('Microsoft Yaoyao',0,1.0),\n 'V04':('Microsoft Huihui Desktop',0,.90),\n 'V05':('Microsoft Kangkang',0,.88),\n 'V06':('Microsoft Yaoyao',0,1.10),\n 'V07':('Microsoft Huihui Desktop',1,1.08),\n 'V08':('Microsoft Kangkang',1,1.10),\n}\ndef synth(text,voice,output,english=False):\n output=Path(output).resolve();output.parent.mkdir(parents=True,exist_ok=True)\n base,rate,pitch=('Microsoft Zira Desktop',0,1.0) if english else VOICES[voice]\n cache=output.parent/'_tts_tmp';cache.mkdir(exist_ok=True)\n with tempfile.TemporaryDirectory(dir=cache) as tmp:\n  tmp=Path(tmp);job=tmp/'job.json';wav=tmp/'voice.wav'\n  write_json(job,{'text':text,'voice':base,'rate':rate,'output':str(wav)})\n  ps=tmp/'voice.ps1';ps.write_text('''Add-Type -AssemblyName System.Speech\n$j=Get-Content -LiteralPath $args[0] -Raw -Encoding UTF8 | ConvertFrom-Json\n$s=New-Object System.Speech.Synthesis.SpeechSynthesizer\n$s.SelectVoice($j.voice);$s.Rate=$j.rate;$s.SetOutputToWaveFile($j.output);$s.Speak($j.text);$s.Dispose()\n''',encoding='utf-8-sig')\n  subprocess.run(['powershell','-NoProfile','-ExecutionPolicy','Bypass','-File',str(ps),str(job)],check=True,capture_output=True)\n  ff('-i',wav,'-af',f'aresample=48000,asetrate={round(48000*pitch)},aresample=48000,atempo={1/pitch}', '-c:a','pcm_s16le',output)\n return output\nif __name__=='__main__':\n p=argparse.ArgumentParser();p.add_argument('--text-file',required=True);p.add_argument('--voice',choices=VOICES,default='V01');p.add_argument('--output',required=True);a=p.parse_args();synth(Path(a.text_file).read_text(encoding='utf8'),a.voice,a.output)\n"
      }
    ],
    "models": {
      "sol": {
        "video": {
          "name": "accessible.mp4",
          "path": "accessible.mp4",
          "url": "variant-results/case-46/sol/accessible.mp4",
          "kind": "video",
          "bytes": 7297168,
          "meta": {
            "duration": 81.002,
            "width": 1280,
            "height": 536,
            "fps": "24/1",
            "sampleRate": null
          }
        },
        "files": [
          {
            "name": "README.md",
            "path": "README.md",
            "url": "variant-results/case-46/sol/README.md",
            "kind": "document",
            "bytes": 3195
          },
          {
            "name": "ad.vtt",
            "path": "ad.vtt",
            "url": "variant-results/case-46/sol/ad.vtt",
            "kind": "document",
            "bytes": 1064
          },
          {
            "name": "ad_plan.json",
            "path": "ad_plan.json",
            "url": "variant-results/case-46/sol/ad_plan.json",
            "kind": "document",
            "bytes": 5584
          },
          {
            "name": "self_check.json",
            "path": "self_check.json",
            "url": "variant-results/case-46/sol/self_check.json",
            "kind": "document",
            "bytes": 6476
          },
          {
            "name": "player_config.json",
            "path": "player_config.json",
            "url": "variant-results/case-46/sol/player_config.json",
            "kind": "document",
            "bytes": 307
          },
          {
            "name": "rebuild.json",
            "path": "rebuild.json",
            "url": "variant-results/case-46/sol/rebuild.json",
            "kind": "document",
            "bytes": 152
          },
          {
            "name": "ad_track.m4a",
            "path": "ad_track.m4a",
            "url": "variant-results/case-46/sol/ad_track.m4a",
            "kind": "audio",
            "bytes": 500245,
            "meta": {
              "duration": 81.0,
              "width": null,
              "height": null,
              "fps": "0/0",
              "sampleRate": "48000"
            }
          },
          {
            "name": "base_track.m4a",
            "path": "base_track.m4a",
            "url": "variant-results/case-46/sol/base_track.m4a",
            "kind": "audio",
            "bytes": 1166759,
            "meta": {
              "duration": 81.0,
              "width": null,
              "height": null,
              "fps": "0/0",
              "sampleRate": "48000"
            }
          }
        ],
        "milestones": [
          {
            "id": "item_9",
            "type": "command_execution",
            "exit_code": 1,
            "status": "failed",
            "tools": [
              "faster_whisper",
              "python3"
            ]
          },
          {
            "id": "item_23",
            "type": "command_execution",
            "exit_code": 0,
            "status": "completed",
            "tools": [
              "piper",
              "python3"
            ]
          },
          {
            "id": "item_28",
            "type": "command_execution",
            "exit_code": 0,
            "status": "completed",
            "tools": [
              "ffmpeg"
            ]
          },
          {
            "id": "item_31",
            "type": "command_execution",
            "exit_code": 0,
            "status": "completed",
            "tools": [
              "ffmpeg",
              "python3",
              "rebuild.py"
            ]
          },
          {
            "id": "item_35",
            "type": "command_execution",
            "exit_code": 0,
            "status": "completed"
          },
          {
            "id": "item_40",
            "type": "command_execution",
            "exit_code": 1,
            "status": "failed",
            "tools": [
              "ffmpeg",
              "ffprobe",
              "python3",
              "rebuild.py"
            ]
          }
        ],
        "scoring": {
          "rows": [
            {
              "id": "facts",
              "label": "关键视觉事实",
              "score": 30.000059999999998,
              "maximum": 45,
              "group": "core",
              "evidence": "加权事实匹配，替代组只计一次；详见逐事实表。"
            },
            {
              "id": "tracking",
              "label": "主体位置、行动与揭示关系",
              "score": 26.833333333333332,
              "maximum": 35,
              "group": "core",
              "evidence": "帐篷旁的观察者与小精灵起身跑开得3/3。三只精灵入灌木、女孩伏低跟进并探头得3/3。由探头接到整片群落得2.5/3，树下全景与灌木另一侧的空间关系主要靠句序建立。四名同伴到场得1/2，共同观看缺失。瓢虫段得0.5/2，刷背交代了精灵与虫的互动，队形和经过路线缺失。树洞到仰望的交接得1.5/2，交代了谁从哪里出来以及一个人的反应，洞口先向众人招呼的环节缺失。"
            },
            {
              "id": "reveal",
              "label": "信息揭示时机",
              "score": 5.0,
              "maximum": 5,
              "group": "core",
              "evidence": "可定位的关键揭示均在相应画面信息可知后出现。开头先称红蘑菇，绿色肢体显露后才称小精灵。群落等到女孩探头、全景出现以后才揭示，树洞段的身份和翻出动作也已有画面依据。"
            },
            {
              "id": "useful",
              "label": "描述及时性",
              "score": 12.5,
              "maximum": 15,
              "group": "core",
              "evidence": "绿肢体、跑开、进入灌木、探头和发现群落都在听众仍需跟进时交代。AD09回补拿本子和同伴走近时，画面已经转到瓢虫。AD14贴近翻出动作，白胡子身份和树洞位置直到这句才被旁白定位，比首次在洞口露面晚约三秒半。评分依据是这两处可见的转场时差。"
            },
            {
              "id": "dialogue",
              "label": "对白避让",
              "score": 3.9583333333333335,
              "maximum": 5,
              "group": "delivery",
              "evidence": "评审1: 原片中存在多处对白/人声与旁白重叠的情况。在0-8秒区间，拟声词和惊叹词（Ugh/Huh/Whoa）与旁白发生中等程度的时间碰撞，虽未完全掩蔽但造成听觉焦点分散；在9-27秒区间，儿童合唱歌曲作为主要背景音被密集旁白覆盖，形成强烈竞争，导致歌词不可闻；在30-60秒区间，英文长句对白与旁白重叠，听感拥挤。整体表现为少量至中度的争抢，符合4-5分锚点特征。；评审2: 旁白与原片对白/音效存在少量重叠（如21-29秒与儿童歌曲，77-81秒与撞击声），但旁白音量略高或独立播放，未造成严重的听觉争抢，易于跟随。"
            },
            {
              "id": "intelligibility",
              "label": "对白可懂度",
              "score": 9.375,
              "maximum": 10,
              "group": "delivery",
              "evidence": "评审1: 尽管存在对白争抢，但核心信息的理解损失较小。旁白本身清晰度极高（如0-8s, 9-27s段落均标注为清晰或非常高）。对于原片对白，虽然在30-60s段落因重叠导致“听感拥挤”，但记录明确指出“无严重理解损失”、“整体仍可辨识”。仅在9-27s的歌曲段落，由于是音乐性质而非叙事性对白，其内容丢失对剧情理解的实质性影响有限，且旁白提供了替代信息。因此属于轻微费力但无实质词句损失的范畴。；评审2: 原片关键对白（如30-60秒的英文对话）在成片中清晰可辨；新增旁白发音标准、语速平稳，无实质词句损失。虽背景环境音减弱导致氛围感稍差，但不影响对白内容的理解。"
            },
            {
              "id": "effects",
              "label": "关键音效保护",
              "score": 7.5,
              "maximum": 10,
              "group": "delivery",
              "evidence": "评审1: 大部分关键环境音效（如脚步声、咀嚼声）保留良好或被音乐衬托得突出。但在特定动作场景中存在明显损失：在77-81秒区间，原片中沉重的撞击声、闷响和挣扎的咕哝声被旁白完全掩盖，无法听到，这属于关键动作提示音的损失。此外，0-1.5秒的踩碎干树叶声也被部分掩盖。鉴于有一个明确的严重掩蔽事件影响了动作感知，分数降至4-5档的下限附近。；评审2: 关键动作音效（如液体声、鸟叫、后期撞击声）保留完整且易辨。但在30-48秒区间，为了突出旁白，背景合唱音乐和环境音效（树叶摩擦声）被大幅压低甚至几乎不可闻，导致部分非关键但重要的氛围音效变弱，符合‘轻微变弱仍易辨’至‘部分难辨’之间的过渡状态，鉴于主要叙事性音效仍在，给予中等偏上分数。"
            },
            {
              "id": "mix",
              "label": "混音数值规格",
              "score": 5.0,
              "maximum": 5,
              "group": "delivery",
              "evidence": "checks.audio: 1 sum + 1 duck + 1 peak + 1 format/length"
            },
            {
              "id": "wording",
              "label": "指代与信息效率",
              "score": 4.583333333333333,
              "maximum": 5,
              "group": "delivery",
              "evidence": "短句用「蘑菇帽下」「从人脚边」「从叶下」迅速交代相对位置。「小精灵」接「它」，再用「女孩」切回观察者，下一句的「她」有清楚的先行词。「树下」的方位较宽，和灌木另一侧的关系要靠相邻句子补足。"
            },
            {
              "id": "speech",
              "label": "实际语音自然度与可懂度",
              "score": 4.6875,
              "maximum": 5,
              "group": "delivery",
              "evidence": "评审1: 所有记录的旁白片段（Narration）均被评价为“清晰”、“平稳”、“清晰度极高”或“非常清晰”。韵律自然，无合成感或断句问题的负面描述。即使在与其他音频元素重叠的情况下，旁白本身的语音质量保持最高标准。；评审2: 旁白发音标准、清晰，无明显失真或吞字。但听审记录指出其‘缺乏情感起伏，与画面中欢快的场景不匹配’，存在一定的合成感和韵律平淡问题，未达到完全自然的真人配音水准，故扣除一定分数。"
            },
            {
              "id": "delivery",
              "label": "交付一致性与可重建性",
              "score": 15.0,
              "maximum": 15,
              "group": "delivery",
              "evidence": "2 required files + 2 cue/VTT timing/text + 2 actual cue/ad consistency + 1 picture preservation + 3 independent rebuild"
            },
            {
              "id": "switch",
              "label": "原声保留与旁白开关",
              "score": 10.0,
              "maximum": 10,
              "group": "delivery",
              "evidence": "1 point original preservation; 1 point reserved for actual browser toggle test"
            }
          ],
          "core": 74.33339333333333,
          "delivery": 60.104166666666664,
          "delivery_max": 65,
          "coefficient": 0.9246794871794871,
          "raw": 68.73456402777776,
          "cap": 100,
          "gates": [
            {
              "id": "timeline_bypass",
              "status": "pass",
              "cap": 20
            },
            {
              "id": "invalid_media",
              "status": "pass",
              "cap": 20,
              "reason": "独立ASR提供了实际存在旁白的证据。画面数据支持原帧序列和片长得到保留。"
            },
            {
              "id": "critical_fact",
              "status": "pass",
              "cap": 59,
              "reason": "可核对的实际旁白保留了主要观察者、移动对象和揭示顺序。后段的关系省略按事实覆盖和行动追踪计分。"
            },
            {
              "id": "critical_masking",
              "status": "pass",
              "cap": 59,
              "reason": "评审1: 虽然记录了severe_masking=true的事件（9-27s的音乐歌词丢失，77-81s的动作音效丢失），但根据Gate定义，“只在原声可辨且成片关键对白/音效被严重掩蔽并影响理解时fail”。\n1. 9-27s为歌曲《It's a small world》，属于氛围音乐/歌唱，并非推动剧情的关键对白，其歌词不可闻不影响对画面情节（小精灵活动）的理解。\n2. 77-81s的音效损失确实存在，但该时段原片无对白，仅有动作音效。旁白描述了动作结果（翻出树洞、仰头望），观众通过视觉和旁白即可理解发生了什么，音效的缺失并未导致“关键对白”无法理解或剧情逻辑断裂。\n3. 其他重叠区域均未达到“严重影响理解”的程度。因此不触发Fail。；评审2: 虽然30-48秒背景音效减弱，但原片关键对白（英文对话）和成片旁白均未被严重掩蔽，听众仍能轻松获取核心语义信息，未发生因掩蔽导致的理解失败。"
            }
          ],
          "findings": [
            "确认事实原权重覆盖为8/12，折合16.67/25。unsupported deduction为0。",
            "帐篷边的红蘑菇起身、三只精灵钻进灌木、女孩伏低跟进并发现整片红帽群落，构成连续的观察和移动链。未见提前揭示。",
            "主要缺口在同伴到场后的共同视线、瓢虫段的队形和动线，以及白胡子精灵先在洞口向众人招呼的交接。",
            "AD15的持罐和仰望有画面支持。「控官」近似「空罐」，罐内状态无法确认，记为不确定。"
          ]
        },
        "actions": 63
      },
      "luna": {
        "video": {
          "name": "accessible.mp4",
          "path": "accessible.mp4",
          "url": "variant-results/case-46/luna/accessible.mp4",
          "kind": "video",
          "bytes": 7296781,
          "meta": {
            "duration": 81.002,
            "width": 1280,
            "height": 536,
            "fps": "24/1",
            "sampleRate": null
          }
        },
        "files": [
          {
            "name": "README.md",
            "path": "README.md",
            "url": "variant-results/case-46/luna/README.md",
            "kind": "document",
            "bytes": 2428
          },
          {
            "name": "ad.vtt",
            "path": "ad.vtt",
            "url": "variant-results/case-46/luna/ad.vtt",
            "kind": "document",
            "bytes": 729
          },
          {
            "name": "ad_plan.json",
            "path": "ad_plan.json",
            "url": "variant-results/case-46/luna/ad_plan.json",
            "kind": "document",
            "bytes": 2401
          },
          {
            "name": "self_check.json",
            "path": "self_check.json",
            "url": "variant-results/case-46/luna/self_check.json",
            "kind": "document",
            "bytes": 3790
          },
          {
            "name": "player_config.json",
            "path": "player_config.json",
            "url": "variant-results/case-46/luna/player_config.json",
            "kind": "document",
            "bytes": 310
          },
          {
            "name": "rebuild.json",
            "path": "rebuild.json",
            "url": "variant-results/case-46/luna/rebuild.json",
            "kind": "document",
            "bytes": 168
          },
          {
            "name": "ad_track.m4a",
            "path": "ad_track.m4a",
            "url": "variant-results/case-46/luna/ad_track.m4a",
            "kind": "audio",
            "bytes": 403162,
            "meta": {
              "duration": 81.0,
              "width": null,
              "height": null,
              "fps": "0/0",
              "sampleRate": "48000"
            }
          },
          {
            "name": "base_track.m4a",
            "path": "base_track.m4a",
            "url": "variant-results/case-46/luna/base_track.m4a",
            "kind": "audio",
            "bytes": 1167185,
            "meta": {
              "duration": 81.0,
              "width": null,
              "height": null,
              "fps": "0/0",
              "sampleRate": "48000"
            }
          }
        ],
        "milestones": [
          {
            "id": "item_10",
            "type": "command_execution",
            "exit_code": 0,
            "status": "completed",
            "tools": [
              "ffmpeg"
            ]
          },
          {
            "id": "item_17",
            "type": "command_execution",
            "exit_code": 0,
            "status": "completed",
            "tools": [
              "ffmpeg"
            ]
          },
          {
            "id": "item_31",
            "type": "command_execution",
            "exit_code": 0,
            "status": "completed",
            "tools": [
              "piper",
              "python3"
            ]
          },
          {
            "id": "item_38",
            "type": "command_execution",
            "exit_code": 0,
            "status": "completed",
            "tools": [
              "piper",
              "python3"
            ]
          },
          {
            "id": "item_48",
            "type": "command_execution",
            "exit_code": 0,
            "status": "completed",
            "tools": [
              "python3",
              "rebuild.py"
            ]
          },
          {
            "id": "item_57",
            "type": "command_execution",
            "exit_code": 0,
            "status": "completed",
            "tools": [
              "python3",
              "rebuild.py"
            ]
          }
        ],
        "scoring": {
          "rows": [
            {
              "id": "facts",
              "label": "关键视觉事实",
              "score": 31.95,
              "maximum": 45,
              "group": "core",
              "evidence": "加权事实匹配，替代组只计一次；详见逐事实表。"
            },
            {
              "id": "tracking",
              "label": "主体位置、行动与揭示关系",
              "score": 21.0,
              "maximum": 35,
              "group": "core",
              "evidence": "从帐篷到草地，旁白能维持同一女孩和她追随的红帽对象，少了绿身露出这一辨认线索。女孩伏低后怎样穿过树丛、怎样从叶间看见空地没有串起来。同行者到场交代清楚，与女孩会合并共同观察的关系只传达了一部分。三个精灵与过路瓢虫的位置关系明确。结尾定位到树洞，缺少众人把注意力转向高处及洞口精灵向他们招呼的交接。"
            },
            {
              "id": "reveal",
              "label": "信息揭示时机",
              "score": 3.125,
              "maximum": 5,
              "group": "core",
              "evidence": "最明显的提前揭示出现在「蹦开」，它在红帽仍静止时先交代了自行离开。AD03提前把女孩的注视交代为实际跟随，AD05提前说出伏低动作。AD06说到群体规模时全景已经出现，AD10的树洞信息也在画面可知之后说出。"
            },
            {
              "id": "useful",
              "label": "描述及时性",
              "score": 11.25,
              "maximum": 15,
              "group": "core",
              "evidence": "帐篷定位、群体空地和蓝黑色大虫都在相应场景内得到交代。露营者到场紧接上一镜，仍能接回女孩的场景。瓢虫的经过关系到下一种昆虫入画后才说清，容易挂到下一镜。树洞位置在精灵已开始翻落时才说出，仍有定位作用，但错过了观众需要把注意力转向洞口的时刻。"
            },
            {
              "id": "dialogue",
              "label": "对白避让",
              "score": 4.166666666666667,
              "maximum": 5,
              "group": "delivery",
              "evidence": "评审1: 存在多处旁白与原声对白/音乐的重叠。在30-60秒区间，长达近6秒的中文旁白完全压过了原片标志性的合唱旋律（Righty righty yum），造成严重的听觉争抢；此外，开头及结尾处也有轻微的语气词重叠。虽然大部分核心剧情对白（如露营者对话）清晰可辨，但音乐段落的严重掩蔽拉低了整体评分。；评审2: 整体对白争抢轻微，大部分英文原声在旁白间隙清晰可辨。但在31.5-32.5秒处，中文旁白与英文对白'It's incredible! A new species!'发生重叠，导致该句对白略显模糊，存在少量短重叠但总体易跟随，未造成严重掩蔽。"
            },
            {
              "id": "intelligibility",
              "label": "对白可懂度",
              "score": 9.375,
              "maximum": 10,
              "group": "delivery",
              "evidence": "评审1: 所有关键剧情对白（包括英文角色对话和中文旁白）均清晰易懂，无实质性词句损失。虽然在部分时间段（如30-60s）背景合唱被旁白掩盖，但这属于氛围音乐而非需要理解的关键信息，未影响对剧情逻辑的理解。开头的叹气等非语义发声被覆盖也不构成理解障碍。；评审2: 相比原声，成片中的关键对白基本全部易懂。虽然在31.5-32.5秒处因旁白叠加导致个别单词可能受掩盖，产生轻微理解费力，但核心信息'A new species'仍可推断。其余时段（如60-79秒）对白清晰度极高，无实质性词句损失。"
            },
            {
              "id": "effects",
              "label": "关键音效保护",
              "score": 7.5,
              "maximum": 10,
              "group": "delivery",
              "evidence": "评审1: 关键的物理音效（如76-81秒的坠落撞击声、树叶摩擦声）以及早期的环境音（叹气）得到较好保留。然而，在30-60秒区间，作为重要听觉标识的背景合唱及其伴随的行进节奏感被旁白严重削弱甚至掩盖，导致该段落的声音设计完整性受损。根据规则，音乐变轻本身不扣分，但此处是关键的氛围音效段落被‘严重’遮盖，故酌情扣分至中等水平。；评审2: 大部分环境音和提示音（如鸟叫、脚步、欢呼声）得到保留且易于辨识。但在79.5-81.0秒的关键动作节点，沉重的落地撞击声（thudding impacts）和角色呻吟声被音量较大的中文旁白部分掩盖，导致细节丢失，虽仍能听到声音轮廓，但关键音效受损，属于轻微变弱仍易辨到多个关键声音难辨之间的过渡状态，偏向于重要音效受影响。"
            },
            {
              "id": "mix",
              "label": "混音数值规格",
              "score": 5.0,
              "maximum": 5,
              "group": "delivery",
              "evidence": "checks.audio: 1 sum + 1 duck + 1 peak + 1 format/length"
            },
            {
              "id": "wording",
              "label": "指代与信息效率",
              "score": 4.166666666666667,
              "maximum": 5,
              "group": "delivery",
              "evidence": "句子简短，「女孩」有稳定指向，「跟着它」能回接前句的小蘑菇。「并排」和「从前面经过」用少量词说清了相对位置。「红点蘑菇」容易让人把斑点理解为红色，降低了追踪标签的准确性。「也来到」的地点说清了，与谁会合仍含糊。"
            },
            {
              "id": "speech",
              "label": "实际语音自然度与可懂度",
              "score": 5.0,
              "maximum": 5,
              "group": "delivery",
              "evidence": "评审1: 中文旁白发音清晰，语速适中，韵律自然，无明显合成感或断句错误。在整个听审过程中，旁白的语音质量保持稳定，能够很好地传达叙事内容。；评审2: 新增的中文女声旁白发音标准，语速适中，韵律自然，与画面节奏匹配良好。在整个观察窗口内，旁白本身没有明显的合成感、断句错误或生硬之处，听觉质量高。"
            },
            {
              "id": "delivery",
              "label": "交付一致性与可重建性",
              "score": 15.0,
              "maximum": 15,
              "group": "delivery",
              "evidence": "2 required files + 2 cue/VTT timing/text + 2 actual cue/ad consistency + 1 picture preservation + 3 independent rebuild"
            },
            {
              "id": "switch",
              "label": "原声保留与旁白开关",
              "score": 10.0,
              "maximum": 10,
              "group": "delivery",
              "evidence": "1 point original preservation; 1 point reserved for actual browser toggle test"
            }
          ],
          "core": 67.325,
          "delivery": 60.208333333333336,
          "delivery_max": 65,
          "coefficient": 0.9262820512820513,
          "raw": 62.36193910256411,
          "cap": 59,
          "gates": [
            {
              "id": "timeline_bypass",
              "status": "pass",
              "cap": 20
            },
            {
              "id": "invalid_media",
              "status": "pass",
              "cap": 20,
              "reason": "独立逐句转录支持实际旁白存在。画面核验支持片长与帧序完整。"
            },
            {
              "id": "critical_fact",
              "status": "fail",
              "cap": 59,
              "reason": "「蹦开」把首次自行离开说成已经发生。只凭旁白跟进的观众会在女孩仍观察原地红帽时，以为它已经跳走。这改变了先观察、再发现红帽是会移动的小家伙的顺序。错位跨越数秒及一个反应镜头，超出抽帧和词级边界的不确定范围。"
            },
            {
              "id": "critical_masking",
              "status": "pass",
              "cap": 59,
              "reason": "评审1: 尽管在30-60秒区间存在旁白对背景合唱的严重掩盖，但该部分内容主要为氛围音乐和非剧情关键的对白（主要是歌唱）。核心的剧情推进对白（如30-42秒的角色对话、51-60秒的反应对话）均未受到掩蔽，听众仍能完整获取故事信息。因此，未达到‘影响理解’的Fail标准。；评审2: 虽然79.5-81.0秒处的撞击音效受到旁白一定程度的掩盖，以及31.5-32.5秒的对白有轻微重叠，但均未达到'严重掩蔽并影响理解'的程度。观众仍能通过上下文和残留音频线索识别出主要情节（新物种发现、精灵落地），不存在关键对白或音效完全无法辨认的情况。"
            }
          ],
          "findings": [
            "六项确认事实的加权覆盖为9/12，折合18.75/25。白脸误述单独扣1分，扣除后为17.75/25。",
            "叙事缺口集中在观察视点的转移。女孩跟随什么、空地上有什么都能听明白，她如何穿过树丛并发现空地、同伴怎样加入观察仍须推断。",
            "开场说到「蹦开」时，红帽仍在原位。空地的群体规模在全景出现后说清，瓢虫与树洞的说明则错过了各自首次入画的时机。",
            "「走出营地」的确切边界、多个红帽汇合后最初那一只的连续路径以及树洞精灵是否触地均保留不确定。"
          ]
        },
        "actions": 58
      }
    }
  },
  "31": {
    "task": "# 第12题 / Case31：四人会议字幕对轴·正式困难版\n\n看完所附 Aegisub 教程，把 `input/source.mp4` 制作为准确、可读的英文多人字幕。文字已完整提供，不要求翻译。困难在于真实重叠、短附和、重复和自我修正、数值与否定，以及在镜头切换中保持声源身份。允许使用本地脚本和对齐模型。\n\n## 输入\n\n- `source.mp4`: EasyCom Session 2, three reordered English conversation excerpts, 150.20 seconds at 25 fps. The wearable viewpoint moves with one of the four speakers. Voice identity comes from the four independent references. `original.wav` contains the actual video audio.\n- `transcript.txt`：完整逐词稿，文本组Uxxx的排列经过固定随机打乱，**编号和出现顺序均不代表时间或人物**。文本组是检索单位，不是必须采用的字幕分句。保留重复、口头词和未完成词；可改标点、大小写，但不得润色成与原声不同的句子。\n- `speakers.json`及4组头像/声音：A/B/C/D是本题身份，不是原始语料库ID；以声音参考辨认人物。参考来自目标片段之外，可能含自然附和。\n- `edit_boundaries.json`：公开拼接边界；不能让一个字幕事件跨越边界。段内时轴连续，段与段之间无语义连续性保证。\n- `tutorial.mp4`和本地手册：依据官方文档制作的5分钟讲解，包含波形图，不是软件操作实录。\n\n## 交付\n\n交 `interview.ass`、`interview.srt`、实际烧录的 `preview.mp4`、`alignment.json`、`rebuild.json`、README和离线重建脚本。完整JSON格式见 `submission_schema.json`。\n\nASS的Name字段填A/B/C/D，画面上也显示身份标签。每人的事件独立对轴；同时发言在不同固定位置显示，不得重叠遮字。字幕必须放在底部32%区域（576高画面约y=392—575），顶部68%保留原画面以供完整性检测；建议四个固定角色槽、约20px字号并合理短分句，最多每人两行，必要时用完整底部宽度。SRT每行用 `A: ...` 等前缀，按所有事件边界分割成无重叠时间单元；仍持续显示的文本可跨相邻单元保持，不视为重复说话。ASS/SRT须在相同时间显示相同角色的相同词；技术切片不能改变实际可见寿命。允许拆分、合并同一角色相邻文本组。\n\n真实重复与格式延续必须区分：同一角色再次说出与上一条完全相同的独立短句/回应时，ASS须保留两个独立事件，不能合成一次持续显示；SRT须在对应ASS边界显式开始新cue，即使文字完全相同。只有因其他角色进出而产生的持续文本技术切片才按同一次发言计算，评分器结合ASS重复事件边界核验。单个字幕内原本连续重复的词仍逐词保留。SRT cue数字编号可以不连续，但不得重复；alignment引用实际编号，不是文件内第几个cue。\n\n常规字幕0.4—6秒；自然极短回应可短于0.4秒，但仍须可读。英文每行≤42字符，每位说话人最多2行，读速≤24字符/秒；同时发言最多4名角色，字号和分区应适配原尺寸。可在自然停顿适当延展显示，但需同时满足时间误差及镜头拼接约束。\n\n`alignment.json.events` 为实际字幕事件映射：每项含 `utterance_ids`（涉及的U编号）、`speaker_id`、`start`、`end`、`ass_event_ids`、`srt_cue_ids`。ASS事件从1顺序编号，SRT使用文件cue编号，全部以字符串写入。一组稿件可对应多个事件；不得用映射JSON代替实际字幕。每个源文本组必须被映射覆盖。\n\n视频原尺寸、帧率、时长及声音不变，字幕为唯一画面新增内容。48kHz音轨；不得删词、压低别人的声音、去掉重叠、补配音、改变音速或拼接。成片可由脚本生成，不考鼠标操作。\n\n## 评分合同\n\n总分 = （内容得分 ÷ 65）×（交付得分 ÷ 35）× 100。内容项为时间对齐 30、说话人归属 15、重叠对白 10、文字准确度 10。交付项为格式 10、预览与字幕一致性 10、离线重建 5、烧录字幕可读性 10。交付得分除以 35 得到质量系数。总分达到 80 且全部硬门槛通过即通过验收。精确配置见 `rules.json`。\n\n硬门槛：两格式按角色token总体召回≥97%、精确≥99%，每角色召回≥95%；标注重叠词对保留≥90%，按官方重叠词对持续时间加权的同时显示召回≥85%（两cue仅碰一下不能通过）；时间质量≥0.75；格式合规比例≥95%；两格式时间语义等价≥98%；映射有效/覆盖≥98%。时间质量按真实字幕覆盖词的首尾边界：≤150ms满分，150—500ms线性降分，超过500ms零分；允许多种合理分句，不要求与私有标注唯一对应。原声归一化相关系数≥0.98，画面内容不得替换。\n\n真实视听Judge必须核验：烧录字幕确实对应提交文件；否定和数值约束未反转；短回应、重复、自我修正未被删除；身份与提供声音参考一致；重叠时可以同时读到各人内容。Judge使用原片、实际成片/声音和私有标注，而不是只读提交JSON。两次独立评分，分歧第三次仲裁；模型仍无法确定或官方标注与声音有争议时进入pending，不将不确定性强判为失败。缺真实音视频API时总分为空，不用文本模型伪造视听分数。\n\n`rebuild.json.argv` 使用 `{python}`、`{input}`、`{submission}`、`{output}`。评分器移走已有主视频后执行重建；脚本应从原输入与字幕生成到 `{output}`。不得只复制预先渲染的视频，不能运行时联网或付费调用。依赖和版本须写明，所有新文件和临时文件在D盘。\n\n## 公开真值与考试边界\n\nEasyCom publishes recordings and participant-tagged utterance transcripts. The reordered timeline and anonymous identities are local to this task. Use only the supplied candidate package in the offline test.\n\n建议统一120分钟、8核CPU/32GB RAM、可选24GB GPU和30GB D盘空间；任何预算更改需事先告知。官方人工作词标注不是零误差逐音素认证；本包未生成正式正确字幕或参考成片，也未通过solver难度校准。来源和许可见 `CREDITS.md`，仅在本地构建，不冒称已获公开再分发全部附件的许可。\n",
    "credit": "EasyCom, Main / Session 2, Meta Reality Labs Research, CC BY-NC 4.0. Reordered and resized three clips; participant photos and utterance transcripts from the official release. https://github.com/facebookresearch/EasyComDataset",
    "files": [
      {
        "name": "CREDITS.md",
        "path": "CREDITS.md",
        "url": "variant-results/case-31/candidate/CREDITS.md",
        "kind": "document",
        "bytes": 227,
        "text": "EasyCom, Main / Session 2, Meta Reality Labs Research, CC BY-NC 4.0. Reordered and resized three clips; participant photos and utterance transcripts from the official release. https://github.com/facebookresearch/EasyComDataset\n"
      },
      {
        "name": "README.md",
        "path": "README.md",
        "url": "variant-results/case-31/candidate/README.md",
        "kind": "document",
        "bytes": 170,
        "text": "先读TASK.md，再读rules.json和submission_schema.json。这里只含题目输入，没有参考解答。评分器由主办方保管，考生不要访问父目录。\n"
      },
      {
        "name": "TASK.md",
        "path": "TASK.md",
        "url": "variant-results/case-31/candidate/TASK.md",
        "kind": "document",
        "bytes": 6336,
        "text": "# 第12题 / Case31：四人会议字幕对轴·正式困难版\n\n看完所附 Aegisub 教程，把 `input/source.mp4` 制作为准确、可读的英文多人字幕。文字已完整提供，不要求翻译。困难在于真实重叠、短附和、重复和自我修正、数值与否定，以及在镜头切换中保持声源身份。允许使用本地脚本和对齐模型。\n\n## 输入\n\n- `source.mp4`: EasyCom Session 2, three reordered English conversation excerpts, 150.20 seconds at 25 fps. The wearable viewpoint moves with one of the four speakers. Voice identity comes from the four independent references. `original.wav` contains the actual video audio.\n- `transcript.txt`：完整逐词稿，文本组Uxxx的排列经过固定随机打乱，**编号和出现顺序均不代表时间或人物**。文本组是检索单位，不是必须采用的字幕分句。保留重复、口头词和未完成词；可改标点、大小写，但不得润色成与原声不同的句子。\n- `speakers.json`及4组头像/声音：A/B/C/D是本题身份，不是原始语料库ID；以声音参考辨认人物。参考来自目标片段之外，可能含自然附和。\n- `edit_boundaries.json`：公开拼接边界；不能让一个字幕事件跨越边界。段内时轴连续，段与段之间无语义连续性保证。\n- `tutorial.mp4`和本地手册：依据官方文档制作的5分钟讲解，包含波形图，不是软件操作实录。\n\n## 交付\n\n交 `interview.ass`、`interview.srt`、实际烧录的 `preview.mp4`、`alignment.json`、`rebuild.json`、README和离线重建脚本。完整JSON格式见 `submission_schema.json`。\n\nASS的Name字段填A/B/C/D，画面上也显示身份标签。每人的事件独立对轴；同时发言在不同固定位置显示，不得重叠遮字。字幕必须放在底部32%区域（576高画面约y=392—575），顶部68%保留原画面以供完整性检测；建议四个固定角色槽、约20px字号并合理短分句，最多每人两行，必要时用完整底部宽度。SRT每行用 `A: ...` 等前缀，按所有事件边界分割成无重叠时间单元；仍持续显示的文本可跨相邻单元保持，不视为重复说话。ASS/SRT须在相同时间显示相同角色的相同词；技术切片不能改变实际可见寿命。允许拆分、合并同一角色相邻文本组。\n\n真实重复与格式延续必须区分：同一角色再次说出与上一条完全相同的独立短句/回应时，ASS须保留两个独立事件，不能合成一次持续显示；SRT须在对应ASS边界显式开始新cue，即使文字完全相同。只有因其他角色进出而产生的持续文本技术切片才按同一次发言计算，评分器结合ASS重复事件边界核验。单个字幕内原本连续重复的词仍逐词保留。SRT cue数字编号可以不连续，但不得重复；alignment引用实际编号，不是文件内第几个cue。\n\n常规字幕0.4—6秒；自然极短回应可短于0.4秒，但仍须可读。英文每行≤42字符，每位说话人最多2行，读速≤24字符/秒；同时发言最多4名角色，字号和分区应适配原尺寸。可在自然停顿适当延展显示，但需同时满足时间误差及镜头拼接约束。\n\n`alignment.json.events` 为实际字幕事件映射：每项含 `utterance_ids`（涉及的U编号）、`speaker_id`、`start`、`end`、`ass_event_ids`、`srt_cue_ids`。ASS事件从1顺序编号，SRT使用文件cue编号，全部以字符串写入。一组稿件可对应多个事件；不得用映射JSON代替实际字幕。每个源文本组必须被映射覆盖。\n\n视频原尺寸、帧率、时长及声音不变，字幕为唯一画面新增内容。48kHz音轨；不得删词、压低别人的声音、去掉重叠、补配音、改变音速或拼接。成片可由脚本生成，不考鼠标操作。\n\n## 评分合同\n\n总分 = （内容得分 ÷ 65）×（交付得分 ÷ 35）× 100。内容项为时间对齐 30、说话人归属 15、重叠对白 10、文字准确度 10。交付项为格式 10、预览与字幕一致性 10、离线重建 5、烧录字幕可读性 10。交付得分除以 35 得到质量系数。总分达到 80 且全部硬门槛通过即通过验收。精确配置见 `rules.json`。\n\n硬门槛：两格式按角色token总体召回≥97%、精确≥99%，每角色召回≥95%；标注重叠词对保留≥90%，按官方重叠词对持续时间加权的同时显示召回≥85%（两cue仅碰一下不能通过）；时间质量≥0.75；格式合规比例≥95%；两格式时间语义等价≥98%；映射有效/覆盖≥98%。时间质量按真实字幕覆盖词的首尾边界：≤150ms满分，150—500ms线性降分，超过500ms零分；允许多种合理分句，不要求与私有标注唯一对应。原声归一化相关系数≥0.98，画面内容不得替换。\n\n真实视听Judge必须核验：烧录字幕确实对应提交文件；否定和数值约束未反转；短回应、重复、自我修正未被删除；身份与提供声音参考一致；重叠时可以同时读到各人内容。Judge使用原片、实际成片/声音和私有标注，而不是只读提交JSON。两次独立评分，分歧第三次仲裁；模型仍无法确定或官方标注与声音有争议时进入pending，不将不确定性强判为失败。缺真实音视频API时总分为空，不用文本模型伪造视听分数。\n\n`rebuild.json.argv` 使用 `{python}`、`{input}`、`{submission}`、`{output}`。评分器移走已有主视频后执行重建；脚本应从原输入与字幕生成到 `{output}`。不得只复制预先渲染的视频，不能运行时联网或付费调用。依赖和版本须写明，所有新文件和临时文件在D盘。\n\n## 公开真值与考试边界\n\nEasyCom publishes recordings and participant-tagged utterance transcripts. The reordered timeline and anonymous identities are local to this task. Use only the supplied candidate package in the offline test.\n\n建议统一120分钟、8核CPU/32GB RAM、可选24GB GPU和30GB D盘空间；任何预算更改需事先告知。官方人工作词标注不是零误差逐音素认证；本包未生成正式正确字幕或参考成片，也未通过solver难度校准。来源和许可见 `CREDITS.md`，仅在本地构建，不冒称已获公开再分发全部附件的许可。\n"
      },
      {
        "name": "aegisub_manual.html",
        "path": "input/aegisub_manual.html",
        "url": "variant-results/case-31/candidate/input/aegisub_manual.html",
        "kind": "document",
        "bytes": 38306
      },
      {
        "name": "edit_boundaries.json",
        "path": "input/edit_boundaries.json",
        "url": "variant-results/case-31/candidate/input/edit_boundaries.json",
        "kind": "document",
        "bytes": 124,
        "text": "{\n  \"duration\": 150.2,\n  \"block_starts\": [\n    0,\n    50.0,\n    93.8\n  ],\n  \"note\": \"Three authentic reordered excerpts.\"\n}\n"
      },
      {
        "name": "original.m4a",
        "path": "input/original.m4a",
        "url": "variant-results/case-31/candidate/input/original.m4a",
        "kind": "audio",
        "bytes": 2147962,
        "meta": {
          "duration": 150.293,
          "width": null,
          "height": null,
          "fps": "0/0",
          "sampleRate": "48000"
        }
      },
      {
        "name": "source.mp4",
        "path": "input/source.mp4",
        "url": "variant-results/case-31/candidate/input/source.mp4",
        "kind": "video",
        "bytes": 16554866,
        "meta": {
          "duration": 150.24,
          "width": 1256,
          "height": 640,
          "fps": "25/1",
          "sampleRate": null
        }
      },
      {
        "name": "speaker_A.jpg",
        "path": "input/speaker_A.jpg",
        "url": "variant-results/case-31/candidate/input/speaker_A.jpg",
        "kind": "image",
        "bytes": 10050
      },
      {
        "name": "speaker_A.m4a",
        "path": "input/speaker_A.m4a",
        "url": "variant-results/case-31/candidate/input/speaker_A.m4a",
        "kind": "audio",
        "bytes": 28549,
        "meta": {
          "duration": 4.0,
          "width": null,
          "height": null,
          "fps": "0/0",
          "sampleRate": "16000"
        }
      },
      {
        "name": "speaker_B.jpg",
        "path": "input/speaker_B.jpg",
        "url": "variant-results/case-31/candidate/input/speaker_B.jpg",
        "kind": "image",
        "bytes": 9741
      },
      {
        "name": "speaker_B.m4a",
        "path": "input/speaker_B.m4a",
        "url": "variant-results/case-31/candidate/input/speaker_B.m4a",
        "kind": "audio",
        "bytes": 29163,
        "meta": {
          "duration": 4.0,
          "width": null,
          "height": null,
          "fps": "0/0",
          "sampleRate": "16000"
        }
      },
      {
        "name": "speaker_C.jpg",
        "path": "input/speaker_C.jpg",
        "url": "variant-results/case-31/candidate/input/speaker_C.jpg",
        "kind": "image",
        "bytes": 9092
      },
      {
        "name": "speaker_C.m4a",
        "path": "input/speaker_C.m4a",
        "url": "variant-results/case-31/candidate/input/speaker_C.m4a",
        "kind": "audio",
        "bytes": 27929,
        "meta": {
          "duration": 4.0,
          "width": null,
          "height": null,
          "fps": "0/0",
          "sampleRate": "16000"
        }
      },
      {
        "name": "speaker_D.jpg",
        "path": "input/speaker_D.jpg",
        "url": "variant-results/case-31/candidate/input/speaker_D.jpg",
        "kind": "image",
        "bytes": 4785
      },
      {
        "name": "speaker_D.m4a",
        "path": "input/speaker_D.m4a",
        "url": "variant-results/case-31/candidate/input/speaker_D.m4a",
        "kind": "audio",
        "bytes": 30160,
        "meta": {
          "duration": 4.0,
          "width": null,
          "height": null,
          "fps": "0/0",
          "sampleRate": "16000"
        }
      },
      {
        "name": "speakers.json",
        "path": "input/speakers.json",
        "url": "variant-results/case-31/candidate/input/speakers.json",
        "kind": "document",
        "bytes": 787,
        "text": "[\n  {\n    \"speaker_id\": \"D\",\n    \"face\": \"speaker_D.jpg\",\n    \"voice\": \"speaker_D.wav\",\n    \"reference_note\": \"Match this separate reference voice. Image is the official participant headshot.\"\n  },\n  {\n    \"speaker_id\": \"A\",\n    \"face\": \"speaker_A.jpg\",\n    \"voice\": \"speaker_A.wav\",\n    \"reference_note\": \"Match this separate reference voice. Image is the official participant headshot.\"\n  },\n  {\n    \"speaker_id\": \"C\",\n    \"face\": \"speaker_C.jpg\",\n    \"voice\": \"speaker_C.wav\",\n    \"reference_note\": \"Match this separate reference voice. Image is the official participant headshot.\"\n  },\n  {\n    \"speaker_id\": \"B\",\n    \"face\": \"speaker_B.jpg\",\n    \"voice\": \"speaker_B.wav\",\n    \"reference_note\": \"Match this separate reference voice. Image is the official participant headshot.\"\n  }\n]\n"
      },
      {
        "name": "transcript.txt",
        "path": "input/transcript.txt",
        "url": "variant-results/case-31/candidate/input/transcript.txt",
        "kind": "document",
        "bytes": 2607,
        "text": "U001 Charlie Nice to meet you\nU002 So are you like working in this we weather as well\nU003 Yeah\nU004 Just one Oh You can only ask one guard one question so you can't even ask both guards You can only ask one guard\nU005 Wouldn't it wouldn't we just turn the switches on\nU006 which switch\nU007 What grade are you teaching\nU008 That's a hard one\nU009 Oh I don't know I just the construction worker you'd have to ask my boss\nU010 Which ones what\nU011 The left and right\nU012 Which door Oh Yeah I guess it does Cause it doesn't have to be It doesn't have to be a yes or no question It could just be a any yeah like and\nU013 I mean I'm building this building It's a lot of setbacks and y 'know security precautions but it's been fine Sort of\nU014 Yeah\nU015 Which switch was what Depending on where there switches are located on the wall on the left and right and where the bulbs are It's kind of where you'd have to figure it out from there But a lot of houses in this area the wiring is wonky so those switches might go anywhere\nU016 I think I would switch two down and middle one up and see which bulb is lit in the room and then figure it out from there Which one lights in the attic when you have the middle switch up and the left and right switch down cause it could be a center light bulb And that would\nU017 Yeah Is it lead certified\nU018 Oh wow What kind of construction\nU019 Was like\nU020 Yeah\nU021 Oh Wonderful\nU022 Ah\nU023 I'm a schoolteacher\nU024 Ah and then what about the the two that aren't turned on\nU025 Oh no way I work with kids too\nU026 You could ask which door feels hot\nU027 Yeah Thomas how bout you What do you do\nU028 Harry nice to meet you\nU029 Oh I teach kindergarten Yes It's great that it's summertime Finally get a break from those crazy monsters\nU030 Harry\nU031 Yeah What do y 'all do\nU032 I'm Thomas\nU033 It could turn on the garbage *exposal\nU034 Yeah wha how would you know\nU035 Oh\nU036 Cause you have to ask if one's heaven or hell\nU037 Yeah That aren't turned on\nU038 There's our construction expert\nU039 It does make a difference cause it's easier to read body language on people\nU040 Do they look exactly the same\nU041 Yeah Y you have one question each or just one question total Just one\nU042 Wow It the\nU043 I'm a construction worker\nU044 Oh okay Ah dang Good idea Yeah\nU045 Oh okay Very cool I'm a pediatric physician\nU046 Would that make a difference\nU047 Alright\nU048 Yep\nU049 Yeah I guess yeah Are those doors Surely there's other things that are coming out of those doors other than just the name\nU050 Nice to meet you\nU051 Kindergarten Alright\nU052 Pediatric\nU053 Yes\n"
      },
      {
        "name": "tutorial.mp4",
        "path": "input/tutorial.mp4",
        "url": "variant-results/case-31/candidate/input/tutorial.mp4",
        "kind": "video",
        "bytes": 2179359,
        "meta": {
          "duration": 300.04644,
          "width": 1280,
          "height": 720,
          "fps": "25/1",
          "sampleRate": null
        }
      },
      {
        "name": "input_manifest.json",
        "path": "input_manifest.json",
        "url": "variant-results/case-31/candidate/input_manifest.json",
        "kind": "document",
        "bytes": 3148,
        "text": "[\n  {\n    \"file\": \"CREDITS.md\",\n    \"bytes\": 227,\n    \"sha256\": \"8ff0f77d94987a7cd606d32f1b2f564cd95f9123c0817fedb0f7c3e7ace28608\"\n  },\n  {\n    \"file\": \"README.md\",\n    \"bytes\": 170,\n    \"sha256\": \"d4db3e23240c61f64f9742abfd0441c8ef44cf2d8efa4609a0ac9287982dd3ac\"\n  },\n  {\n    \"file\": \"TASK.md\",\n    \"bytes\": 6336,\n    \"sha256\": \"35fe4c0944325402cf6de439bdebebbb98119d39c82f4446d6fe1b09bc1ed0a9\"\n  },\n  {\n    \"file\": \"input/aegisub_manual.html\",\n    \"bytes\": 38306,\n    \"sha256\": \"9a011fa10207c7f96954bb542ad3f3a6a5427a5e126ac211733ae02830423daf\"\n  },\n  {\n    \"file\": \"input/edit_boundaries.json\",\n    \"bytes\": 124,\n    \"sha256\": \"508b933b636b4829f4f65d112fd482f7ebe96a3241537c81931024118eef0bad\"\n  },\n  {\n    \"file\": \"input/original.wav\",\n    \"bytes\": 28856398,\n    \"sha256\": \"953625282988b7cfaac10a3486262037dd865b28cd9cd62e7f2e2ee6574d268a\"\n  },\n  {\n    \"file\": \"input/source.mp4\",\n    \"bytes\": 76771582,\n    \"sha256\": \"3bfd5d66aedd3fad66f2b6b8bb509cfb60f3579a6135eafc4fa664e5cba9bcfe\"\n  },\n  {\n    \"file\": \"input/speaker_A.jpg\",\n    \"bytes\": 10050,\n    \"sha256\": \"6b4f44b401ee839643d392651de6e5669d534a107567c509d3025da336585481\"\n  },\n  {\n    \"file\": \"input/speaker_A.wav\",\n    \"bytes\": 128078,\n    \"sha256\": \"f048cd7e293e19eda0c49ea5360cab0ebc66e9102e76b17aa2447d2cc8408892\"\n  },\n  {\n    \"file\": \"input/speaker_B.jpg\",\n    \"bytes\": 9741,\n    \"sha256\": \"cb9714fa790991c40e31e03368ce70e935a74a04c338ef96d17eccfb4d2a644c\"\n  },\n  {\n    \"file\": \"input/speaker_B.wav\",\n    \"bytes\": 128078,\n    \"sha256\": \"f1a970a2f5e4d2ce764de10cfa857d4132574527807a856c2301cedf1801396d\"\n  },\n  {\n    \"file\": \"input/speaker_C.jpg\",\n    \"bytes\": 9092,\n    \"sha256\": \"d4ff57de1e2acedfbd92eb1543726561074ff14daa0c08079008d0752c1eb555\"\n  },\n  {\n    \"file\": \"input/speaker_C.wav\",\n    \"bytes\": 128078,\n    \"sha256\": \"20c9093c71f90f1ed3f28cf805d67ff13e4411edeb2d3943bc2501956cec0f10\"\n  },\n  {\n    \"file\": \"input/speaker_D.jpg\",\n    \"bytes\": 4785,\n    \"sha256\": \"62099c921be11cbfbadb8dfd73e892f9e21fad7f5c1c7c1ba08acf31d24176aa\"\n  },\n  {\n    \"file\": \"input/speaker_D.wav\",\n    \"bytes\": 128078,\n    \"sha256\": \"2bf4f72948e6bd9c326f5b2fc3a0ae27df1539dee1eff50ea8c05bc4196058ce\"\n  },\n  {\n    \"file\": \"input/speakers.json\",\n    \"bytes\": 787,\n    \"sha256\": \"31758d3159ed8529b3bf838c9beea823f5b5533b659acccf948183f8f9245fe6\"\n  },\n  {\n    \"file\": \"input/transcript.txt\",\n    \"bytes\": 2607,\n    \"sha256\": \"7e068804c025854d2c9b7a7736c818a1f497618b2e7ede97a850a75b56dc9de0\"\n  },\n  {\n    \"file\": \"input/tutorial.mp4\",\n    \"bytes\": 2179359,\n    \"sha256\": \"7dff1b88fbed5d6252d3955ce3cdf4053cb3eb093ec2b0d161e53abc488c938d\"\n  },\n  {\n    \"file\": \"rules.json\",\n    \"bytes\": 2426,\n    \"sha256\": \"0814af4dfcb4a3806c158486842bba01a88f21bcffe454ad69b0e74ccf353784\"\n  },\n  {\n    \"file\": \"submission_schema.json\",\n    \"bytes\": 1886,\n    \"sha256\": \"45c08788640f69485e7d4fd9cac4e185d04db93edae1c110f962df2caeca4d7a\"\n  },\n  {\n    \"file\": \"tools/media.py\",\n    \"bytes\": 3278,\n    \"sha256\": \"edbb9610c99d37a0f9a3187a06e65c97eb6680bde42ee14c165e864265b46423\"\n  },\n  {\n    \"file\": \"tools/tts.py\",\n    \"bytes\": 1922,\n    \"sha256\": \"3b23c39b9d52b6459291580f087e72fb9d3bfdd301e198b9dd3733674ee005fc\"\n  }\n]\n"
      },
      {
        "name": "rules.json",
        "path": "rules.json",
        "url": "variant-results/case-31/candidate/rules.json",
        "kind": "document",
        "bytes": 2426,
        "text": "{\n  \"main_output\": \"preview.mp4\",\n  \"required_files\": [\n    \"preview.mp4\",\n    \"interview.ass\",\n    \"interview.srt\",\n    \"alignment.json\",\n    \"rebuild.json\",\n    \"README.md\"\n  ],\n  \"auto_weights\": {\n    \"timing\": 30,\n    \"speakers\": 15,\n    \"overlap\": 10,\n    \"text\": 10,\n    \"format\": 10,\n    \"consistency\": 10,\n    \"rebuild\": 5\n  },\n  \"judge_weights\": {\n    \"readability\": 10\n  },\n  \"fact_weight\": 0,\n  \"judge_criteria\": {\n    \"readability\": \"Watch actual burned subtitle preview while hearing source: speakers, overlapping layout, corrections and reading are clear. Compare rendered content to submitted subtitle events.\"\n  },\n  \"judge_gates\": {\n    \"critical_content\": \"Use private critical_units and speaker/word references plus actual audiovisual input. No reversal or omission of negation, numerical constraints, repeated repairs or speaker identity. Do not mark official annotation disputes as candidate failure.\",\n    \"actual_preview\": \"Output really displays submitted subtitles, not missing/wrong text or labels.\",\n    \"source_audio\": \"Original dialogue and other speakers preserved, no muting/cuts.\"\n  },\n  \"case_number\": 12,\n  \"original_case_id\": 31,\n  \"version\": \"2.0-hard\",\n  \"task_summary\": \"真实四人会议困难字幕对轴：三段重排、随机角色身份、无序逐字稿；保留重叠、修正、否定与数字并交付等价双格式和烧录预览。\",\n  \"passing_score\": 80,\n  \"scoring_status\": \"experimental_source_grounded\",\n  \"rebuild_timeout\": 600,\n  \"hard_thresholds\": {\n    \"token_recall\": 0.97,\n    \"token_precision\": 0.99,\n    \"overlap\": 0.9,\n    \"overlap_duration_recall\": 0.85,\n    \"min_speaker_recall\": 0.95,\n    \"timing_score\": 0.75,\n    \"format_fraction\": 0.95,\n    \"format_equivalence\": 0.98\n  },\n  \"repeat_contract\": \"Distinct repeated identical utterances require separate ASS events and explicit SRT cues at the same boundary. Cross-speaker technical continuation slices are deduplicated using ASS repetition boundaries. SRT numeric IDs may be nonconsecutive but must be unique.\",\n  \"score_aggregation\": {\n    \"formula\": \"(content_score / 65) * (delivery_score / 35) * 100\",\n    \"content\": {\n      \"items\": [\n        \"overlap\",\n        \"speakers\",\n        \"text\",\n        \"timing\"\n      ],\n      \"maximum\": 65\n    },\n    \"delivery\": {\n      \"items\": [\n        \"consistency\",\n        \"format\",\n        \"readability\",\n        \"rebuild\"\n      ],\n      \"maximum\": 35\n    }\n  }\n}\n"
      },
      {
        "name": "submission_schema.json",
        "path": "submission_schema.json",
        "url": "variant-results/case-31/candidate/submission_schema.json",
        "kind": "document",
        "bytes": 1886,
        "text": "{\n  \"$schema\": \"https://json-schema.org/draft/2020-12/schema\",\n  \"file_schemas\": {\n    \"alignment.json\": {\n      \"type\": \"object\",\n      \"properties\": {\n        \"events\": {\n          \"type\": \"array\",\n          \"minItems\": 1,\n          \"items\": {\n            \"type\": \"object\",\n            \"properties\": {\n              \"utterance_ids\": {\n                \"type\": \"array\",\n                \"items\": {\n                  \"type\": \"string\"\n                }\n              },\n              \"speaker_id\": {\n                \"enum\": [\n                  \"A\",\n                  \"B\",\n                  \"C\",\n                  \"D\"\n                ]\n              },\n              \"start\": {\n                \"type\": \"number\"\n              },\n              \"end\": {\n                \"type\": \"number\"\n              },\n              \"ass_event_ids\": {\n                \"type\": \"array\",\n                \"items\": {\n                  \"type\": \"string\"\n                }\n              },\n              \"srt_cue_ids\": {\n                \"type\": \"array\",\n                \"items\": {\n                  \"type\": \"string\"\n                }\n              }\n            },\n            \"required\": [\n              \"utterance_ids\",\n              \"speaker_id\",\n              \"start\",\n              \"end\",\n              \"ass_event_ids\",\n              \"srt_cue_ids\"\n            ],\n            \"additionalProperties\": true\n          }\n        }\n      },\n      \"required\": [\n        \"events\"\n      ],\n      \"additionalProperties\": true\n    },\n    \"rebuild.json\": {\n      \"type\": \"object\",\n      \"properties\": {\n        \"argv\": {\n          \"type\": \"array\",\n          \"minItems\": 1,\n          \"items\": {\n            \"type\": \"string\"\n          }\n        }\n      },\n      \"required\": [\n        \"argv\"\n      ],\n      \"additionalProperties\": true\n    }\n  }\n}"
      },
      {
        "name": "media.py",
        "path": "tools/media.py",
        "url": "variant-results/case-31/candidate/tools/media.py",
        "kind": "document",
        "bytes": 3278,
        "text": "from pathlib import Path\nimport subprocess,json,hashlib,re\nimport numpy as np\nROOT=Path(__file__).resolve().parents[1]\ndef run(args,**kw):\n p=subprocess.run([str(a) for a in args],stdout=subprocess.PIPE,stderr=subprocess.PIPE,**kw)\n if p.returncode:raise RuntimeError(p.stderr.decode('utf8',errors='replace')[-5000:])\n return p.stdout\ndef ff(*args):return run(['ffmpeg','-hide_banner','-loglevel','error','-y',*args])\ndef probe(path):return json.loads(run(['ffprobe','-v','error','-show_format','-show_streams','-of','json',path]))\ndef sha(path):\n h=hashlib.sha256()\n with Path(path).open('rb') as f:\n  while b:=f.read(1048576):h.update(b)\n return h.hexdigest()\ndef write_json(p,data):\n p=Path(p);p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf8')\ndef audio(path,sr=16000):return np.frombuffer(ff('-i',path,'-map','0:a:0','-ac','1','-ar',str(sr),'-f','f32le','pipe:1'),dtype='<f4').copy()\ndef frames(path,full=False):\n filt='scale=32:24' if full else 'crop=iw:trunc(ih*0.68/2)*2:0:0,scale=32:24'\n b=ff('-i',path,'-an','-vf',filt,'-pix_fmt','gray','-f','rawvideo','pipe:1')\n return np.frombuffer(b,dtype=np.uint8).reshape(-1,24,32)\ndef stamp(t):\n ms=round(t*1000);h,ms=divmod(ms,3600000);m,ms=divmod(ms,60000);s,ms=divmod(ms,1000)\n return f'{h:02}:{m:02}:{s:02}.{ms:03}'\ndef secs(s):\n h,m,v=s.strip().replace(',','.').split(':');return int(h)*3600+int(m)*60+float(v)\ndef read_cues(path):\n text=Path(path).read_text(encoding='utf-8-sig',errors='replace').replace('\\r','')\n cues=[]\n if Path(path).suffix.lower()=='.ass':\n  for line in text.splitlines():\n   if line.startswith('Dialogue:'):\n    a=line[len('Dialogue:'):].strip().split(',',9)\n    if len(a)!=10:raise ValueError('Malformed ASS Dialogue')\n    body=re.sub(r'\\{[^}]*\\}','',a[9]).replace('\\\\N','\\n').replace('\\\\n','\\n')\n    cues.append({'start':secs(a[1]),'end':secs(a[2]),'text':body,'speaker':a[4].strip(),'style':a[3]})\n else:\n  lines=text.splitlines()\n  for i,line in enumerate(lines):\n   if '-->' not in line:continue\n   a,b=line.split('-->');body=[]\n   for value in lines[i+1:]:\n    if not value.strip():break\n    body.append(value)\n   cue={'start':secs(a.strip()),'end':secs(b.strip().split()[0]),'text':'\\n'.join(body)}\n   if Path(path).suffix.lower()=='.srt':\n    number=lines[i-1].strip() if i else ''\n    if not number.isdigit():raise ValueError('SRT requires numeric cue IDs')\n    cue['cue_id']=number\n   cues.append(cue)\n for i,c in enumerate(cues):\n  if not (0<=c['start']<c['end']) or not c['text'].strip():raise ValueError(f'Invalid cue {i}')\n if Path(path).suffix.lower()=='.srt' and len({c['cue_id'] for c in cues})!=len(cues):raise ValueError('Duplicate SRT cue ID')\n return cues\ndef write_cues(path,cues):\n vtt=Path(path).suffix=='.vtt';lines=['WEBVTT',''] if vtt else []\n for i,c in enumerate(cues,1):\n  a,b=stamp(c['start']),stamp(c['end'])\n  if not vtt:a,b=a.replace('.',','),b.replace('.',',')\n  lines.extend([str(i),f'{a} --> {b}',c['text'],''])\n Path(path).write_text('\\n'.join(lines),encoding='utf8')\ndef manifest(directory):\n return [{'file':str(p.relative_to(directory)).replace('\\\\','/'),'bytes':p.stat().st_size,'sha256':sha(p)} for p in sorted(Path(directory).rglob('*')) if p.is_file() and p.name!='input_manifest.json']\n"
      },
      {
        "name": "tts.py",
        "path": "tools/tts.py",
        "url": "variant-results/case-31/candidate/tools/tts.py",
        "kind": "document",
        "bytes": 1922,
        "text": "\"\"\"Optional local Windows TTS for solvers; no target-answer text is supplied.\nUsage: python tts.py --text-file UTF8.txt --voice V01 --output output.wav\n\"\"\"\nfrom pathlib import Path\nimport argparse,json,subprocess,tempfile\nfrom media import ROOT,ff,write_json\nVOICES={\n 'V01':('Microsoft Huihui Desktop',0,1.0),\n 'V02':('Microsoft Kangkang',0,1.0),\n 'V03':('Microsoft Yaoyao',0,1.0),\n 'V04':('Microsoft Huihui Desktop',0,.90),\n 'V05':('Microsoft Kangkang',0,.88),\n 'V06':('Microsoft Yaoyao',0,1.10),\n 'V07':('Microsoft Huihui Desktop',1,1.08),\n 'V08':('Microsoft Kangkang',1,1.10),\n}\ndef synth(text,voice,output,english=False):\n output=Path(output).resolve();output.parent.mkdir(parents=True,exist_ok=True)\n base,rate,pitch=('Microsoft Zira Desktop',0,1.0) if english else VOICES[voice]\n cache=output.parent/'_tts_tmp';cache.mkdir(exist_ok=True)\n with tempfile.TemporaryDirectory(dir=cache) as tmp:\n  tmp=Path(tmp);job=tmp/'job.json';wav=tmp/'voice.wav'\n  write_json(job,{'text':text,'voice':base,'rate':rate,'output':str(wav)})\n  ps=tmp/'voice.ps1';ps.write_text('''Add-Type -AssemblyName System.Speech\n$j=Get-Content -LiteralPath $args[0] -Raw -Encoding UTF8 | ConvertFrom-Json\n$s=New-Object System.Speech.Synthesis.SpeechSynthesizer\n$s.SelectVoice($j.voice);$s.Rate=$j.rate;$s.SetOutputToWaveFile($j.output);$s.Speak($j.text);$s.Dispose()\n''',encoding='utf-8-sig')\n  subprocess.run(['powershell','-NoProfile','-ExecutionPolicy','Bypass','-File',str(ps),str(job)],check=True,capture_output=True)\n  ff('-i',wav,'-af',f'aresample=48000,asetrate={round(48000*pitch)},aresample=48000,atempo={1/pitch}', '-c:a','pcm_s16le',output)\n return output\nif __name__=='__main__':\n p=argparse.ArgumentParser();p.add_argument('--text-file',required=True);p.add_argument('--voice',choices=VOICES,default='V01');p.add_argument('--output',required=True);a=p.parse_args();synth(Path(a.text_file).read_text(encoding='utf8'),a.voice,a.output)\n"
      }
    ],
    "models": {
      "sol": {
        "video": {
          "name": "preview.mp4",
          "path": "preview.mp4",
          "url": "variant-results/case-31/sol/preview.mp4",
          "kind": "video",
          "bytes": 16555673,
          "meta": {
            "duration": 150.24,
            "width": 1256,
            "height": 640,
            "fps": "25/1",
            "sampleRate": null
          }
        },
        "files": [
          {
            "name": "README.md",
            "path": "README.md",
            "url": "variant-results/case-31/sol/README.md",
            "kind": "document",
            "bytes": 1729
          },
          {
            "name": "alignment.json",
            "path": "alignment.json",
            "url": "variant-results/case-31/sol/alignment.json",
            "kind": "document",
            "bytes": 19229
          },
          {
            "name": "interview.srt",
            "path": "interview.srt",
            "url": "variant-results/case-31/sol/interview.srt",
            "kind": "document",
            "bytes": 7354
          },
          {
            "name": "interview.ass",
            "path": "interview.ass",
            "url": "variant-results/case-31/sol/interview.ass",
            "kind": "document",
            "bytes": 11940
          },
          {
            "name": "rebuild.py",
            "path": "rebuild.py",
            "url": "variant-results/case-31/sol/rebuild.py",
            "kind": "document",
            "bytes": 2032
          },
          {
            "name": "rebuild.json",
            "path": "rebuild.json",
            "url": "variant-results/case-31/sol/rebuild.json",
            "kind": "document",
            "bytes": 117
          }
        ],
        "milestones": [
          {
            "id": "item_7",
            "type": "command_execution",
            "exit_code": 0,
            "status": "completed",
            "tools": [
              "python3"
            ],
            "title": "识别原声和定位发言"
          },
          {
            "id": "item_9",
            "type": "command_execution",
            "exit_code": 1,
            "status": "failed",
            "tools": [
              "faster_whisper",
              "python3"
            ],
            "title": "核对说话人与字幕对轴"
          },
          {
            "id": "item_45",
            "type": "command_execution",
            "exit_code": 0,
            "status": "completed",
            "tools": [
              "FFmpeg",
              "ffmpeg",
              "python3",
              "rebuild.py"
            ],
            "title": "生成或检查 ASS 和 SRT 字幕"
          },
          {
            "id": "item_57",
            "type": "command_execution",
            "exit_code": 0,
            "status": "completed",
            "tools": [
              "ffmpeg",
              "python3"
            ],
            "title": "渲染或检查烧录视频"
          },
          {
            "id": "item_58",
            "type": "command_execution",
            "exit_code": 0,
            "status": "completed",
            "tools": [
              "rebuild.py"
            ],
            "title": "执行或检查离线重建"
          }
        ],
        "scoring": {
          "rows": [
            {
              "id": "timing",
              "score": 17.6131,
              "maximum": 30,
              "group": "content"
            },
            {
              "id": "speakers",
              "score": 14.1953,
              "maximum": 15,
              "group": "content"
            },
            {
              "id": "overlap",
              "score": 4.8214,
              "maximum": 10,
              "group": "content"
            },
            {
              "id": "text",
              "score": 9.4839,
              "maximum": 10,
              "group": "content"
            },
            {
              "id": "format",
              "score": 10,
              "maximum": 10,
              "group": "delivery"
            },
            {
              "id": "consistency",
              "score": 7.7358,
              "maximum": 10,
              "group": "delivery"
            },
            {
              "id": "rebuild",
              "score": 5,
              "maximum": 5,
              "group": "delivery"
            },
            {
              "id": "readability",
              "score": 7.2504,
              "maximum": 10,
              "group": "delivery"
            }
          ],
          "gates": [
            "text_and_speakers",
            "overlap_content",
            "per_speaker_recall",
            "overlap_duration",
            "timing_floor",
            "alignment_records",
            "actual_preview@0"
          ],
          "pending": 0,
          "formula": "(content_score / 65) * (delivery_score / 35) * 100",
          "score": 60.781,
          "groups": {
            "content": {
              "score": 46.1137,
              "maximum": 65
            },
            "delivery": {
              "score": 29.9862,
              "maximum": 35,
              "coefficient": 0.8567485714285714
            }
          }
        },
        "actions": 70,
        "notes": "离线重建通过。重叠对白得 4.8214 / 10，时间对齐得 17.6131 / 30。"
      },
      "luna": {
        "video": {
          "name": "preview.mp4",
          "path": "preview.mp4",
          "url": "variant-results/case-31/luna/preview.mp4",
          "kind": "video",
          "bytes": 16565145,
          "meta": {
            "duration": 150.24,
            "width": 1256,
            "height": 640,
            "fps": "25/1",
            "sampleRate": null
          }
        },
        "files": [
          {
            "name": "README.md",
            "path": "README.md",
            "url": "variant-results/case-31/luna/README.md",
            "kind": "document",
            "bytes": 1294
          },
          {
            "name": "alignment.json",
            "path": "alignment.json",
            "url": "variant-results/case-31/luna/alignment.json",
            "kind": "document",
            "bytes": 21577
          },
          {
            "name": "interview.srt",
            "path": "interview.srt",
            "url": "variant-results/case-31/luna/interview.srt",
            "kind": "document",
            "bytes": 7002
          },
          {
            "name": "interview.ass",
            "path": "interview.ass",
            "url": "variant-results/case-31/luna/interview.ass",
            "kind": "document",
            "bytes": 13422
          },
          {
            "name": "rebuild.py",
            "path": "rebuild.py",
            "url": "variant-results/case-31/luna/rebuild.py",
            "kind": "document",
            "bytes": 1695
          },
          {
            "name": "rebuild.json",
            "path": "rebuild.json",
            "url": "variant-results/case-31/luna/rebuild.json",
            "kind": "document",
            "bytes": 179
          }
        ],
        "milestones": [
          {
            "id": "item_18",
            "type": "command_execution",
            "exit_code": 0,
            "status": "completed",
            "tools": [
              "faster_whisper",
              "python3"
            ],
            "title": "识别原声和定位发言"
          },
          {
            "id": "item_63",
            "type": "command_execution",
            "exit_code": 1,
            "status": "failed",
            "tools": [
              "faster_whisper",
              "python3"
            ],
            "title": "核对说话人与字幕对轴"
          },
          {
            "id": "item_79",
            "type": "command_execution",
            "exit_code": 0,
            "status": "completed",
            "tools": [
              "python3"
            ],
            "title": "生成或检查 ASS 和 SRT 字幕"
          },
          {
            "id": "item_80",
            "type": "command_execution",
            "exit_code": 0,
            "status": "completed",
            "tools": [
              "ffmpeg"
            ],
            "title": "渲染或检查烧录视频"
          },
          {
            "id": "item_91",
            "type": "command_execution",
            "exit_code": 0,
            "status": "completed",
            "tools": [
              "python3",
              "rebuild.py"
            ],
            "title": "执行或检查离线重建"
          }
        ],
        "scoring": {
          "rows": [
            {
              "id": "timing",
              "score": 10.8586,
              "maximum": 30,
              "group": "content"
            },
            {
              "id": "speakers",
              "score": 9.6245,
              "maximum": 15,
              "group": "content"
            },
            {
              "id": "overlap",
              "score": 0,
              "maximum": 10,
              "group": "content"
            },
            {
              "id": "text",
              "score": 6.3147,
              "maximum": 10,
              "group": "content"
            },
            {
              "id": "format",
              "score": 9.7468,
              "maximum": 10,
              "group": "delivery"
            },
            {
              "id": "consistency",
              "score": 3.2075,
              "maximum": 10,
              "group": "delivery"
            },
            {
              "id": "rebuild",
              "score": 5,
              "maximum": 5,
              "group": "delivery"
            },
            {
              "id": "readability",
              "score": 5.0009,
              "maximum": 10,
              "group": "delivery"
            }
          ],
          "gates": [
            "text_and_speakers",
            "overlap_content",
            "per_speaker_recall",
            "overlap_duration",
            "timing_floor",
            "ass_srt_equivalence",
            "alignment_records",
            "critical_content@0",
            "actual_preview@30",
            "critical_content@60",
            "critical_content@90"
          ],
          "pending": 0,
          "formula": "(content_score / 65) * (delivery_score / 35) * 100",
          "score": 27.04,
          "groups": {
            "content": {
              "score": 26.7978,
              "maximum": 65
            },
            "delivery": {
              "score": 22.9552,
              "maximum": 35,
              "coefficient": 0.6558628571428572
            }
          }
        },
        "actions": 118,
        "notes": "离线重建通过。重叠对白得 0 / 10，ASS 与 SRT 一致性未达门槛。"
      }
    }
  }
};
