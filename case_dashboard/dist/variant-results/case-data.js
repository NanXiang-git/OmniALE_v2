window.OMNIALE_VARIANT_CASES = {
  "40": {
    "task": "# 第13题 / Case40：原人物声音保留译制 · Checklist v3\n\n将输入的《Cosmos Laundromat: First Cycle》79秒连续英语片段制作成普通话译制成片，并交付同内容的手机单声道音频。必须同时解决重复台词的不同表演、修正与否定范围、声源归属和非语言反应；实际成片、分轨、字幕与工程须相互一致。角色轨真实活动至少97%落在该角色的计划事件内；不可漏报分轨中的发声。只提交策划或翻译文本不算完成。\n\n## 已提供输入\n\n`input/source.mp4`：官方源片02:48—04:07，1280×536、24fps；`original.wav`原混音；`music_effects.wav`从官方音乐、环境与音效 WAV 生成并对齐的无对白 M&E；24个源事件粗检索编号S001—S024（occurrence_catalog.json，不提供英文全文）、术语、人物视觉提示、中性中文声线试音。镜头不是说话人标签；参考字幕可能合并不同表达类型，须听看源片确认。每个S编号代表一次出现，重复文本不得去重。\n\n`input/hard_constraints.json`列明8组必须审计的事件和全部交付参数；它给问题范围，不给中文译文、角色答案或完整配音轴。原始字幕可在网上找到，但不会提供本题分轨、双版本混音、角色归属或合格成片。\n\n## 交付合同\n\n交付 `dub_zh.mp4`、`mix.wav`、`effects_track.wav`、`mobile_mix.wav`、每角色全长WAV、`subtitles_zh.srt`、`subtitles_en.srt`、`bilingual.ass`、`speakers.json`、`translation_plan.json`、`mix_config.json`、`continuity_ledger.json`、离线重建脚本、`rebuild.json`及README。JSON精确结构见 `submission_schema.json`。\n\n- 保留全部画面顺序、尺寸、帧率和79秒长度；不可变速、补帧、删镜头。必须将交付的ZH/EN双语字幕实际烧录到dub_zh.mp4底部32%区域；另交SRT和ASS，只有软字幕或字幕文件不算实际显示。不能用字幕代替应有的普通话声音。\n- 每个角色WAV为48kHz立体声、全长、已应用最终音量的分轨，不得混入其他人物、音乐或源英语。两位实际发声角色，声线听感可辨且稳定。`speakers.instance`区分有源证据支持的年龄/声音实例，不允许每句新增角色规避一致性。\n- `effects_track.wav`必须严格等于输入M&E乘一个全局增益，范围[-12,0]dB，写入mix_config；不得移轴、duck、拼接、替换或局部消音。最终 `mix.wav` 是所有角色轨与effects轨的逐样本和（相对波形误差≤2%，长度差<80ms）；总和后不可另加未交付处理。影院视频和mix分别满足-16±1 LUFS、true peak≤-1dBTP；峰值测量容差0.1dB。角色内可压限、EQ和混响，交出的轨须是已处理的最终轨。\n- `mobile_mix.wav`为48kHz单声道：由0.5×(mix左+mix右)经声明的单一全局增益及峰值限制生成，不改表演、内容和时间；-18±1 LUFS、true peak≤-2dBTP。方法字段固定mono_downmix_gain_limiter，gain_db范围[-12,6]，limiter_ceiling_dbtp=-2。实际单声道必须保留数字、否定、短句和必要音效，不能靠影院版听得清来抵扣。\n- 手机版精确参考滤镜为FFmpeg `pan=mono|c0=0.5*c0+0.5*c1,volume={gain_db}dB,alimiter=limit=0.7943282347:attack=5:release=50:level=0:latency=1`，输出48kHz PCM；可用等价实现，但与该链生成波形的相对误差须≤2%。采样峰值限幅不自动保证true peak合格，须实测并选择合适gain；true peak测量容差0.1dB。\n- 每个plan.events事件列event_id（唯一）、source_ids、type、speaker_id、speaker_instance、voice_id、source_text、zh_text、start/end、visible_speech、delivery_note。speech关联有效角色和实例；screen_text的speaker_id、speaker_instance、voice_id填空字符串；non_speech若含角色叫喊则填对应角色/实例/声音，放入该角色轨，没有角色声源时可留空。S编号可拆成多个类型，但每个编号均须有去向。屏幕文字翻成字幕，不给人物补念；非语言叫喊可以合法重制，或从源片分离保留不含可辨英语单词的叫喊放入角色轨；不得把整句英语作为叫喊混入，不可悄悄删除关键反应。字幕参考粗边界不能作为逐音素嘴型真值。\n- 中文SRT反映实际译制对白与需译屏幕文字，英文SRT反映源意；双语ASS应语义和事件对应。每种语言每cue≤2行，中文≤18非空白Unicode字符/行、≤10字符/秒，英文≤42字符/行；标点计数。常规cue 0.4—7秒，源本身极短感叹允许0.2—0.4秒并注明。屏幕文字可与对白重叠，不能为挤字幕裁掉限定词。双语烧录不得超过每种语言2行，适当字号、清晰对比度，避免遮住必要动作。\n- bilingual.ass使用Style名称ZH、EN分别表示两种语言，Name填speaker_id，screen_text可空；各语言和对应SRT的实际可见时间积分一致率≥98%，不以双方空白刷分。SRT可合理重分句，不要求等于配音事件边界。plan的zh_text/source_text与对应SRT全片文本序列召回与精确率均≥95%，包括屏幕文字；实际声音另由Judge核实。\n- continuity_ledger.decisions对C01—C08各写恰一条：source_ids、event_indices（plan.events零起索引）、source_evidence（源片start/end和观察）、decision、alternative_rejected。证据区间各自start<end，C02至少1处，其他每组至少2处。指出具体制作选择与舍弃方案，不需要长篇剧评，也不能把自述当验收证明。\n\n## 新版声音与转录要求\n\n中文必须尽量保持原人物音色、身份及语气；仅使用性别近似的通用TTS不等于保持原人物声音。跨段稳定与像不像源人物分开计分。允许从本题源片抽取参考，使用合法本地音色转换/克隆工具；必须写 voice_provenance.json，注明每角色实际方法和源参考区间。不得伪称克隆成功。\n\n新增 transcript_en.txt（按实际出现顺序的英文转录，含需翻译的屏幕文字并标明）、transcript_zh.txt（对应中文译文）、source_events.json（原声理解事件，结构见schema），同时保留全部原交付。source_events.events可使用模型自己的分句，每项标source_ids、speaker_id、start/end、source_text、delivery_note。S编号只给粗检索区间，不能直接当配音轴。没有提供完整英文稿，须自行识别。\n\n## 最终评分合同\n\n最终分 = (E + T) × (A ÷ 70) × V × (100 ÷ 30)。E 满分 20，T 满分 10，A 满分 70，V 为 0–1 画面系数。\n- E源内容：词序列准确40%、事件覆盖粗定位20%、说话人/实例归属15%、语义/关键语气理解25%。词序列采用max(0,1−WER)，非全文二值匹配；官方参考争议进入pending。\n- T翻译：意义完整45%、自然度30%、术语称呼15%、语体功能10%。\n- A实际配音：原人物音色 25 分、同人物跨段稳定 15 分、情绪语气表演 15 分、实际内容 10 分、自然清晰和双版本混音 5 分。\n- V画面：原画面顺序内容60%、时间线20%、声画时机及字幕实际显示20%。字幕底部新增内容不作为原画面错误。\n\n所有主观项使用公开rules.json中的逐点Yes/No QA；缺模态、标签冲突记pending。每点两次独立评审，分歧第三次；源/输出均须有时间证据。普通点权重1，事先冻结的关键语义点3。音色和稳定性按源角色宏平均，不让话多的角色掩盖其他角色。跨段复核只计相应检查，不按全片时长再加一半权重。\n\n≥80且关键门槛通过才通过。需保持完整画面、交付可解码及可重建；无关键漏配、整句错角色、否定/关系/状态反转、大片英语双叠、关键音效丢失及手机端角色消失。原有分轨、混音、字幕和审计合同继续检查，检查结果逐项报告。音色数值尚无人工校准阈值，不擅自新增未校准一票否决线；音色失真正常扣对应分。\n\n## 执行边界\n\n本次统一60分钟墙钟硬限时、8核CPU/32GB RAM、可选24GB GPU、30GB工作盘。允许合法TTS及字幕工具，不要求固定GUI；运行工具、合成、渲染均包含在60分钟内。自带TTS的V01—V08是系统声音/音高配置，不是八位真人或演员克隆。重建必须完全离线，依赖与合法声音来源写README；不得只复制已渲染主视频。`rebuild.json`argv支持{python}、{input}、{submission}、{output}，须把新成片写到{output}。\n\n考生仅获candidate目录，禁读evaluator/authoring、其他考生答案或外网现成答案。测试纯视听能力时由主办方断网并隔离文件系统，不能靠文字禁令阻止公开字幕检索。全部新增结果、缓存和临时目录放服务器指定工作目录；只在独立submission目录写入，不改输入。许可和来源见CREDITS.md。\n",
    "credit": "Cosmos Laundromat: First Cycle, Blender Foundation / Blender Studio, CC BY 4.0. Excerpt and dialogue-free mix made from official picture and audio tracks. https://studio.blender.org/projects/cosmos-laundromat/  https://studio.blender.org/projects/cosmos-laundromat/gallery/?asset=1497",
    "files": [
      {
        "name": "CREDITS.md",
        "path": "CREDITS.md",
        "url": "variant-results/case-40/candidate/CREDITS.md",
        "kind": "document",
        "bytes": 285,
        "text": "Cosmos Laundromat: First Cycle, Blender Foundation / Blender Studio, CC BY 4.0. Excerpt and dialogue-free mix made from official picture and audio tracks. https://studio.blender.org/projects/cosmos-laundromat/  https://studio.blender.org/projects/cosmos-laundromat/gallery/?asset=1497\n"
      },
      {
        "name": "README.md",
        "path": "README.md",
        "url": "variant-results/case-40/candidate/README.md",
        "kind": "document",
        "bytes": 190,
        "text": "先读 TASK.md、rules.json 与 submission_schema.json。题包包含原混音、对齐后的无对白底轨、角色素材与声线样例。完整英文稿和评估参考由题方保管。\n"
      },
      {
        "name": "TASK.md",
        "path": "TASK.md",
        "url": "variant-results/case-40/candidate/TASK.md",
        "kind": "document",
        "bytes": 8856,
        "text": "# 第13题 / Case40：原人物声音保留译制 · Checklist v3\n\n将输入的《Cosmos Laundromat: First Cycle》79秒连续英语片段制作成普通话译制成片，并交付同内容的手机单声道音频。必须同时解决重复台词的不同表演、修正与否定范围、声源归属和非语言反应；实际成片、分轨、字幕与工程须相互一致。角色轨真实活动至少97%落在该角色的计划事件内；不可漏报分轨中的发声。只提交策划或翻译文本不算完成。\n\n## 已提供输入\n\n`input/source.mp4`：官方源片02:48—04:07，1280×536、24fps；`original.wav`原混音；`music_effects.wav`从官方音乐、环境与音效 WAV 生成并对齐的无对白 M&E；24个源事件粗检索编号S001—S024（occurrence_catalog.json，不提供英文全文）、术语、人物视觉提示、中性中文声线试音。镜头不是说话人标签；参考字幕可能合并不同表达类型，须听看源片确认。每个S编号代表一次出现，重复文本不得去重。\n\n`input/hard_constraints.json`列明8组必须审计的事件和全部交付参数；它给问题范围，不给中文译文、角色答案或完整配音轴。原始字幕可在网上找到，但不会提供本题分轨、双版本混音、角色归属或合格成片。\n\n## 交付合同\n\n交付 `dub_zh.mp4`、`mix.wav`、`effects_track.wav`、`mobile_mix.wav`、每角色全长WAV、`subtitles_zh.srt`、`subtitles_en.srt`、`bilingual.ass`、`speakers.json`、`translation_plan.json`、`mix_config.json`、`continuity_ledger.json`、离线重建脚本、`rebuild.json`及README。JSON精确结构见 `submission_schema.json`。\n\n- 保留全部画面顺序、尺寸、帧率和79秒长度；不可变速、补帧、删镜头。必须将交付的ZH/EN双语字幕实际烧录到dub_zh.mp4底部32%区域；另交SRT和ASS，只有软字幕或字幕文件不算实际显示。不能用字幕代替应有的普通话声音。\n- 每个角色WAV为48kHz立体声、全长、已应用最终音量的分轨，不得混入其他人物、音乐或源英语。两位实际发声角色，声线听感可辨且稳定。`speakers.instance`区分有源证据支持的年龄/声音实例，不允许每句新增角色规避一致性。\n- `effects_track.wav`必须严格等于输入M&E乘一个全局增益，范围[-12,0]dB，写入mix_config；不得移轴、duck、拼接、替换或局部消音。最终 `mix.wav` 是所有角色轨与effects轨的逐样本和（相对波形误差≤2%，长度差<80ms）；总和后不可另加未交付处理。影院视频和mix分别满足-16±1 LUFS、true peak≤-1dBTP；峰值测量容差0.1dB。角色内可压限、EQ和混响，交出的轨须是已处理的最终轨。\n- `mobile_mix.wav`为48kHz单声道：由0.5×(mix左+mix右)经声明的单一全局增益及峰值限制生成，不改表演、内容和时间；-18±1 LUFS、true peak≤-2dBTP。方法字段固定mono_downmix_gain_limiter，gain_db范围[-12,6]，limiter_ceiling_dbtp=-2。实际单声道必须保留数字、否定、短句和必要音效，不能靠影院版听得清来抵扣。\n- 手机版精确参考滤镜为FFmpeg `pan=mono|c0=0.5*c0+0.5*c1,volume={gain_db}dB,alimiter=limit=0.7943282347:attack=5:release=50:level=0:latency=1`，输出48kHz PCM；可用等价实现，但与该链生成波形的相对误差须≤2%。采样峰值限幅不自动保证true peak合格，须实测并选择合适gain；true peak测量容差0.1dB。\n- 每个plan.events事件列event_id（唯一）、source_ids、type、speaker_id、speaker_instance、voice_id、source_text、zh_text、start/end、visible_speech、delivery_note。speech关联有效角色和实例；screen_text的speaker_id、speaker_instance、voice_id填空字符串；non_speech若含角色叫喊则填对应角色/实例/声音，放入该角色轨，没有角色声源时可留空。S编号可拆成多个类型，但每个编号均须有去向。屏幕文字翻成字幕，不给人物补念；非语言叫喊可以合法重制，或从源片分离保留不含可辨英语单词的叫喊放入角色轨；不得把整句英语作为叫喊混入，不可悄悄删除关键反应。字幕参考粗边界不能作为逐音素嘴型真值。\n- 中文SRT反映实际译制对白与需译屏幕文字，英文SRT反映源意；双语ASS应语义和事件对应。每种语言每cue≤2行，中文≤18非空白Unicode字符/行、≤10字符/秒，英文≤42字符/行；标点计数。常规cue 0.4—7秒，源本身极短感叹允许0.2—0.4秒并注明。屏幕文字可与对白重叠，不能为挤字幕裁掉限定词。双语烧录不得超过每种语言2行，适当字号、清晰对比度，避免遮住必要动作。\n- bilingual.ass使用Style名称ZH、EN分别表示两种语言，Name填speaker_id，screen_text可空；各语言和对应SRT的实际可见时间积分一致率≥98%，不以双方空白刷分。SRT可合理重分句，不要求等于配音事件边界。plan的zh_text/source_text与对应SRT全片文本序列召回与精确率均≥95%，包括屏幕文字；实际声音另由Judge核实。\n- continuity_ledger.decisions对C01—C08各写恰一条：source_ids、event_indices（plan.events零起索引）、source_evidence（源片start/end和观察）、decision、alternative_rejected。证据区间各自start<end，C02至少1处，其他每组至少2处。指出具体制作选择与舍弃方案，不需要长篇剧评，也不能把自述当验收证明。\n\n## 新版声音与转录要求\n\n中文必须尽量保持原人物音色、身份及语气；仅使用性别近似的通用TTS不等于保持原人物声音。跨段稳定与像不像源人物分开计分。允许从本题源片抽取参考，使用合法本地音色转换/克隆工具；必须写 voice_provenance.json，注明每角色实际方法和源参考区间。不得伪称克隆成功。\n\n新增 transcript_en.txt（按实际出现顺序的英文转录，含需翻译的屏幕文字并标明）、transcript_zh.txt（对应中文译文）、source_events.json（原声理解事件，结构见schema），同时保留全部原交付。source_events.events可使用模型自己的分句，每项标source_ids、speaker_id、start/end、source_text、delivery_note。S编号只给粗检索区间，不能直接当配音轴。没有提供完整英文稿，须自行识别。\n\n## 最终评分合同\n\n最终分 = (E + T) × (A ÷ 70) × V × (100 ÷ 30)。E 满分 20，T 满分 10，A 满分 70，V 为 0–1 画面系数。\n- E源内容：词序列准确40%、事件覆盖粗定位20%、说话人/实例归属15%、语义/关键语气理解25%。词序列采用max(0,1−WER)，非全文二值匹配；官方参考争议进入pending。\n- T翻译：意义完整45%、自然度30%、术语称呼15%、语体功能10%。\n- A实际配音：原人物音色 25 分、同人物跨段稳定 15 分、情绪语气表演 15 分、实际内容 10 分、自然清晰和双版本混音 5 分。\n- V画面：原画面顺序内容60%、时间线20%、声画时机及字幕实际显示20%。字幕底部新增内容不作为原画面错误。\n\n所有主观项使用公开rules.json中的逐点Yes/No QA；缺模态、标签冲突记pending。每点两次独立评审，分歧第三次；源/输出均须有时间证据。普通点权重1，事先冻结的关键语义点3。音色和稳定性按源角色宏平均，不让话多的角色掩盖其他角色。跨段复核只计相应检查，不按全片时长再加一半权重。\n\n≥80且关键门槛通过才通过。需保持完整画面、交付可解码及可重建；无关键漏配、整句错角色、否定/关系/状态反转、大片英语双叠、关键音效丢失及手机端角色消失。原有分轨、混音、字幕和审计合同继续检查，检查结果逐项报告。音色数值尚无人工校准阈值，不擅自新增未校准一票否决线；音色失真正常扣对应分。\n\n## 执行边界\n\n本次统一60分钟墙钟硬限时、8核CPU/32GB RAM、可选24GB GPU、30GB工作盘。允许合法TTS及字幕工具，不要求固定GUI；运行工具、合成、渲染均包含在60分钟内。自带TTS的V01—V08是系统声音/音高配置，不是八位真人或演员克隆。重建必须完全离线，依赖与合法声音来源写README；不得只复制已渲染主视频。`rebuild.json`argv支持{python}、{input}、{submission}、{output}，须把新成片写到{output}。\n\n考生仅获candidate目录，禁读evaluator/authoring、其他考生答案或外网现成答案。测试纯视听能力时由主办方断网并隔离文件系统，不能靠文字禁令阻止公开字幕检索。全部新增结果、缓存和临时目录放服务器指定工作目录；只在独立submission目录写入，不改输入。许可和来源见CREDITS.md。\n"
      },
      {
        "name": "hard_constraints.json",
        "path": "input/hard_constraints.json",
        "url": "variant-results/case-40/candidate/input/hard_constraints.json",
        "kind": "document",
        "bytes": 4036,
        "text": "{\n  \"version\": \"2.0-hard\",\n  \"duration\": 79,\n  \"challenges\": [\n    {\n      \"id\": \"C01\",\n      \"source_ids\": [\n        \"S009\",\n        \"S010\",\n        \"S011\",\n        \"S012\"\n      ],\n      \"requirement\": \"分别记录围绕选择与独处的设问、否定及转折，保留作用范围。\",\n      \"minimum_evidence_intervals\": 2\n    },\n    {\n      \"id\": \"C02\",\n      \"source_ids\": [\n        \"S013\",\n        \"S014\"\n      ],\n      \"requirement\": \"核对人名称呼、打断和立即纠正，区分实际说话者。\",\n      \"minimum_evidence_intervals\": 1\n    },\n    {\n      \"id\": \"C03\",\n      \"source_ids\": [\n        \"S004\",\n        \"S005\",\n        \"S006\"\n      ],\n      \"requirement\": \"核对身份信息、反问及反应，保持问答归属和语气。\",\n      \"minimum_evidence_intervals\": 2\n    },\n    {\n      \"id\": \"C04\",\n      \"source_ids\": [\n        \"S015\",\n        \"S016\",\n        \"S017\"\n      ],\n      \"requirement\": \"保留先否定后自述再反向建议的关系。\",\n      \"minimum_evidence_intervals\": 2\n    },\n    {\n      \"id\": \"C05\",\n      \"source_ids\": [\n        \"S018\",\n        \"S019\",\n        \"S020\"\n      ],\n      \"requirement\": \"保留重复拦阻、犹豫及断开的同一句，不替角色补完未说内容。\",\n      \"minimum_evidence_intervals\": 2\n    },\n    {\n      \"id\": \"C06\",\n      \"source_ids\": [\n        \"S021\",\n        \"S022\",\n        \"S023\"\n      ],\n      \"requirement\": \"核对同一时长请求的重复、对方的反讽，以及实际可听的反应。\",\n      \"minimum_evidence_intervals\": 2\n    },\n    {\n      \"id\": \"C07\",\n      \"source_ids\": [\n        \"S007\",\n        \"S008\"\n      ],\n      \"requirement\": \"保留给对方的比喻、相比对象和犹豫，不当作字面身份陈述。\",\n      \"minimum_evidence_intervals\": 2\n    },\n    {\n      \"id\": \"C08\",\n      \"source_ids\": [\n        \"S021\",\n        \"S023\",\n        \"S024\"\n      ],\n      \"requirement\": \"保持所请求的同一时长、问答关系，确认手机版也能听清。\",\n      \"minimum_evidence_intervals\": 2\n    }\n  ],\n  \"audio_contract\": {\n    \"sample_rate\": 48000,\n    \"stereo_tracks\": [\n      \"mix.wav\",\n      \"effects_track.wav\",\n      \"all speaker wav files\"\n    ],\n    \"mono_tracks\": [\n      \"mobile_mix.wav\"\n    ],\n    \"duration_tolerance_seconds\": 0.08,\n    \"effects_gain_db_range\": [\n      -12,\n      0\n    ],\n    \"effects_formula\": \"effects_track = input/music_effects.wav * 10 ** (effects_gain_db / 20); no shifting, ducking, EQ, splicing, time stretching, or replacement\",\n    \"mix_formula\": \"mix.wav = effects_track.wav + sum(all final-gain speaker tracks); no post-sum processing\",\n    \"maximum_relative_waveform_error\": 0.02,\n    \"cinema_integrated_lufs\": [\n      -17,\n      -15\n    ],\n    \"cinema_true_peak_max_dbtp\": -1,\n    \"mobile_integrated_lufs\": [\n      -19,\n      -17\n    ],\n    \"mobile_true_peak_max_dbtp\": -2,\n    \"mobile_formula\": \"0.5*(mix.left+mix.right), followed only by declared global gain and peak limiter; no content edits\",\n    \"mobile_ffmpeg_filter\": \"pan=mono|c0=0.5*c0+0.5*c1,volume={gain_db}dB,alimiter=limit=0.7943282347:attack=5:release=50:level=0:latency=1\"\n  },\n  \"subtitle_contract\": {\n    \"max_lines_per_language\": 2,\n    \"zh_max_chars_per_line\": 18,\n    \"en_max_chars_per_line\": 42,\n    \"max_zh_chars_per_second\": 10,\n    \"regular_min_duration\": 0.4,\n    \"max_duration\": 7,\n    \"screen_text_may_overlap_speech\": true,\n    \"note\": \"Unicode non-whitespace code points; punctuation counts; speech cues must intersect corresponding plan event. Very short original interjections may last 0.2-0.4 s if source duration is similarly short and documented.\",\n    \"burn_in_required\": true,\n    \"burn_in_region\": \"bottom 32 percent of frame; both ZH and EN visible\"\n  },\n  \"reference_policy\": \"S001-S024 identify distinct source occurrences. Preserve meaning, repetition, and source-backed nonverbal vocalizations.\",\n  \"delivery_budget\": {\n    \"suggested_minutes\": 180,\n    \"cpu_cores\": 8,\n    \"ram_gb\": 32,\n    \"optional_gpu_gb\": 24,\n    \"workspace_gb\": 30\n  },\n  \"minimum_roles\": 2\n}\n"
      },
      {
        "name": "identity_Franck.jpg",
        "path": "input/identity_Franck.jpg",
        "url": "variant-results/case-40/candidate/input/identity_Franck.jpg",
        "kind": "image",
        "bytes": 14541
      },
      {
        "name": "identity_Victor.jpg",
        "path": "input/identity_Victor.jpg",
        "url": "variant-results/case-40/candidate/input/identity_Victor.jpg",
        "kind": "image",
        "bytes": 6958
      },
      {
        "name": "music_effects.m4a",
        "path": "input/music_effects.m4a",
        "url": "variant-results/case-40/candidate/input/music_effects.m4a",
        "kind": "audio",
        "bytes": 1127241,
        "meta": {
          "duration": 79.0,
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
        "bytes": 2436,
        "text": "{\n  \"note\": \"粗检索区间，不是精确发声轴。源语、发言角色和事件类别请自行检听。\",\n  \"occurrences\": [\n    {\n      \"source_id\": \"S001\",\n      \"search_window\": [\n        0,\n        10\n      ]\n    },\n    {\n      \"source_id\": \"S002\",\n      \"search_window\": [\n        0,\n        10\n      ]\n    },\n    {\n      \"source_id\": \"S003\",\n      \"search_window\": [\n        0,\n        10\n      ]\n    },\n    {\n      \"source_id\": \"S004\",\n      \"search_window\": [\n        0,\n        20\n      ]\n    },\n    {\n      \"source_id\": \"S005\",\n      \"search_window\": [\n        10,\n        20\n      ]\n    },\n    {\n      \"source_id\": \"S006\",\n      \"search_window\": [\n        10,\n        20\n      ]\n    },\n    {\n      \"source_id\": \"S007\",\n      \"search_window\": [\n        20,\n        30\n      ]\n    },\n    {\n      \"source_id\": \"S008\",\n      \"search_window\": [\n        20,\n        30\n      ]\n    },\n    {\n      \"source_id\": \"S009\",\n      \"search_window\": [\n        30,\n        40\n      ]\n    },\n    {\n      \"source_id\": \"S010\",\n      \"search_window\": [\n        30,\n        40\n      ]\n    },\n    {\n      \"source_id\": \"S011\",\n      \"search_window\": [\n        30,\n        40\n      ]\n    },\n    {\n      \"source_id\": \"S012\",\n      \"search_window\": [\n        40,\n        50\n      ]\n    },\n    {\n      \"source_id\": \"S013\",\n      \"search_window\": [\n        40,\n        60\n      ]\n    },\n    {\n      \"source_id\": \"S014\",\n      \"search_window\": [\n        50,\n        60\n      ]\n    },\n    {\n      \"source_id\": \"S015\",\n      \"search_window\": [\n        50,\n        60\n      ]\n    },\n    {\n      \"source_id\": \"S016\",\n      \"search_window\": [\n        50,\n        60\n      ]\n    },\n    {\n      \"source_id\": \"S017\",\n      \"search_window\": [\n        50,\n        70\n      ]\n    },\n    {\n      \"source_id\": \"S018\",\n      \"search_window\": [\n        60,\n        70\n      ]\n    },\n    {\n      \"source_id\": \"S019\",\n      \"search_window\": [\n        60,\n        70\n      ]\n    },\n    {\n      \"source_id\": \"S020\",\n      \"search_window\": [\n        60,\n        70\n      ]\n    },\n    {\n      \"source_id\": \"S021\",\n      \"search_window\": [\n        60,\n        70\n      ]\n    },\n    {\n      \"source_id\": \"S022\",\n      \"search_window\": [\n        70,\n        79\n      ]\n    },\n    {\n      \"source_id\": \"S023\",\n      \"search_window\": [\n        70,\n        79\n      ]\n    },\n    {\n      \"source_id\": \"S024\",\n      \"search_window\": [\n        70,\n        79\n      ]\n    }\n  ]\n}\n"
      },
      {
        "name": "original.m4a",
        "path": "input/original.m4a",
        "url": "variant-results/case-40/candidate/input/original.m4a",
        "kind": "audio",
        "bytes": 1126887,
        "meta": {
          "duration": 79.017,
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
        "bytes": 7195724,
        "meta": {
          "duration": 79.017007,
          "width": 1280,
          "height": 536,
          "fps": "24/1",
          "sampleRate": null
        }
      },
      {
        "name": "terminology.json",
        "path": "input/terminology.json",
        "url": "variant-results/case-40/candidate/input/terminology.json",
        "kind": "document",
        "bytes": 124,
        "text": "{\n  \"Franck\": \"弗兰克\",\n  \"Victor\": \"维克托\",\n  \"note\": \"片中人物误称应保留，接受自然中文表达。\"\n}\n"
      },
      {
        "name": "V01.m4a",
        "path": "input/voice_samples/V01.m4a",
        "url": "variant-results/case-40/candidate/input/voice_samples/V01.m4a",
        "kind": "audio",
        "bytes": 97058,
        "meta": {
          "duration": 8.04,
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
        "bytes": 97058,
        "meta": {
          "duration": 8.04,
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
        "bytes": 97058,
        "meta": {
          "duration": 8.04,
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
        "bytes": 98986,
        "meta": {
          "duration": 8.042,
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
        "bytes": 98228,
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
        "bytes": 96905,
        "meta": {
          "duration": 8.036,
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
        "bytes": 87733,
        "meta": {
          "duration": 7.225,
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
        "bytes": 88138,
        "meta": {
          "duration": 7.224,
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
        "name": "input_manifest.json",
        "path": "input_manifest.json",
        "url": "variant-results/case-40/candidate/input_manifest.json",
        "kind": "document",
        "bytes": 3546,
        "text": "[\n  {\n    \"file\": \"CREDITS.md\",\n    \"bytes\": 285,\n    \"sha256\": \"67b6f85fe3d03b448c6b27b061ed0f45454a8dc7c8fa06722769059954051c5e\"\n  },\n  {\n    \"file\": \"README.md\",\n    \"bytes\": 190,\n    \"sha256\": \"43fb3b54f22743907c2ca25a92af62d0c50a39002f7515b404e6a27451a5d738\"\n  },\n  {\n    \"file\": \"TASK.md\",\n    \"bytes\": 8856,\n    \"sha256\": \"47eaa3483dc357919422954f96d65247ee5e64c746bcdc1fac74254611090a56\"\n  },\n  {\n    \"file\": \"input/hard_constraints.json\",\n    \"bytes\": 4036,\n    \"sha256\": \"03a7d9df8a41fbafbbadc6b51a8a31cd829ad2143f41a4238a3daca97bd6b3fc\"\n  },\n  {\n    \"file\": \"input/identity_Franck.jpg\",\n    \"bytes\": 14541,\n    \"sha256\": \"76d291aa4fd64ecdc49b4b2e4f412842b036943b7fd658981f0670aaaece9890\"\n  },\n  {\n    \"file\": \"input/identity_Victor.jpg\",\n    \"bytes\": 6958,\n    \"sha256\": \"f3b966058f5cf59f82ce2a2f7aa1f253893af01e106a7ab9043d852aa0f428e0\"\n  },\n  {\n    \"file\": \"input/music_effects.wav\",\n    \"bytes\": 22752044,\n    \"sha256\": \"b9db548b137a97edb54429418bf3a892efd625880304d349421dc073d0fe6fdc\"\n  },\n  {\n    \"file\": \"input/occurrence_catalog.json\",\n    \"bytes\": 2436,\n    \"sha256\": \"4cef8b8095e48329b0cbd50d578450e0885b00a2d21868b723931df77fad9bf7\"\n  },\n  {\n    \"file\": \"input/original.wav\",\n    \"bytes\": 15171442,\n    \"sha256\": \"4cbaf603806177410c3d216d2f0f96bd1ff5c5c96192877d99ee566eae7d7f58\"\n  },\n  {\n    \"file\": \"input/source.mp4\",\n    \"bytes\": 39567999,\n    \"sha256\": \"0f53f154a9eb7f51d8cdf63975ddd7e1533c249eea9d6d466ead130326dcc8eb\"\n  },\n  {\n    \"file\": \"input/terminology.json\",\n    \"bytes\": 124,\n    \"sha256\": \"2630716b9bda54c09b56beb4e2baa15f2a50e5ebbb14450eadaef16d6cc548fd\"\n  },\n  {\n    \"file\": \"input/voice_samples/V01.wav\",\n    \"bytes\": 771934,\n    \"sha256\": \"1b334f9d545e3c1b49d6ad460598d5835d298c99232e0f3a1e27e463c40eb80c\"\n  },\n  {\n    \"file\": \"input/voice_samples/V02.wav\",\n    \"bytes\": 771934,\n    \"sha256\": \"1b334f9d545e3c1b49d6ad460598d5835d298c99232e0f3a1e27e463c40eb80c\"\n  },\n  {\n    \"file\": \"input/voice_samples/V03.wav\",\n    \"bytes\": 771934,\n    \"sha256\": \"1b334f9d545e3c1b49d6ad460598d5835d298c99232e0f3a1e27e463c40eb80c\"\n  },\n  {\n    \"file\": \"input/voice_samples/V04.wav\",\n    \"bytes\": 772136,\n    \"sha256\": \"f269a216a842baa3630c14495c95ceaad1984c810ccf8b57a56e9d8c3ea3787e\"\n  },\n  {\n    \"file\": \"input/voice_samples/V05.wav\",\n    \"bytes\": 772182,\n    \"sha256\": \"78ec36c9ca54ca0ab55a6192208db2638e9936bfe5cdfdf653bcec0119a010a0\"\n  },\n  {\n    \"file\": \"input/voice_samples/V06.wav\",\n    \"bytes\": 771586,\n    \"sha256\": \"a5f943fabaaacea513441c819fbc3ccc551d1322f3dcdbec7841e9ad57338ba8\"\n  },\n  {\n    \"file\": \"input/voice_samples/V07.wav\",\n    \"bytes\": 693698,\n    \"sha256\": \"4503d1cdf2db6656757119b20943200a8a4a69fd5351b54df5f4d3fa9539e2d5\"\n  },\n  {\n    \"file\": \"input/voice_samples/V08.wav\",\n    \"bytes\": 693636,\n    \"sha256\": \"768ccb628adbb08fb32386480cbc85e1837ee1c972c09f92a9f08933676434f5\"\n  },\n  {\n    \"file\": \"input/voice_samples/voices.json\",\n    \"bytes\": 1075,\n    \"sha256\": \"c68c69f2fa9ba3d2f46c3aa2f74e85bf82ff0673603a735dcbc943735925f995\"\n  },\n  {\n    \"file\": \"rules.json\",\n    \"bytes\": 11192,\n    \"sha256\": \"c5cf3c0b46c864c36ad4e2897f67c61a5d82fc2e94941eb5a5f672f5fc6bdae4\"\n  },\n  {\n    \"file\": \"submission_schema.json\",\n    \"bytes\": 8792,\n    \"sha256\": \"139278c4d611334ddc4ad3f1c9f67e4b8b3b8bd2b910f49d8df1fb08a8fd0e2d\"\n  },\n  {\n    \"file\": \"tools/media.py\",\n    \"bytes\": 3278,\n    \"sha256\": \"edbb9610c99d37a0f9a3187a06e65c97eb6680bde42ee14c165e864265b46423\"\n  },\n  {\n    \"file\": \"tools/tts.py\",\n    \"bytes\": 1922,\n    \"sha256\": \"3b23c39b9d52b6459291580f087e72fb9d3bfdd301e198b9dd3733674ee005fc\"\n  }\n]\n"
      },
      {
        "name": "rules.json",
        "path": "rules.json",
        "url": "variant-results/case-40/candidate/rules.json",
        "kind": "document",
        "bytes": 11192,
        "text": "{\n  \"main_output\": \"dub_zh.mp4\",\n  \"required_files\": [\n    \"dub_zh.mp4\",\n    \"mix.wav\",\n    \"subtitles_zh.srt\",\n    \"subtitles_en.srt\",\n    \"bilingual.ass\",\n    \"speakers.json\",\n    \"translation_plan.json\",\n    \"rebuild.json\",\n    \"README.md\",\n    \"effects_track.wav\",\n    \"mobile_mix.wav\",\n    \"mix_config.json\",\n    \"continuity_ledger.json\",\n    \"transcript_en.txt\",\n    \"transcript_zh.txt\",\n    \"source_events.json\",\n    \"voice_provenance.json\"\n  ],\n  \"case_number\": 13,\n  \"original_case_id\": 40,\n  \"version\": \"final-content-times-audio\",\n  \"task_summary\": \"将525秒真实连续电影片段制作成普通话译制成片及手机单声道版，解决8组跨场景语义/声源挑战，交付可逐样本审计的角色轨和音乐音效轨。\",\n  \"passing_score\": 80,\n  \"scoring_status\": \"experimental_source_grounded\",\n  \"rebuild_timeout\": 600,\n  \"score_formula\": \"(E20 + T10) * (A70 / 70) * (0.6*V_frames_rate + 0.2*V_timeline_rate + 0.2*V_display_rate) * (100 / 30)\",\n  \"source_transcript_provided\": false,\n  \"groups\": {\n    \"E\": 20,\n    \"T\": 10,\n    \"A\": 70\n  },\n  \"subcriteria\": {\n    \"E_words\": {\n      \"group\": \"E\",\n      \"within_group_weight\": 0.4,\n      \"maximum\": 8.0,\n      \"label\": \"英文词序列准确性\",\n      \"method\": \"automatic\",\n      \"unit\": \"points\"\n    },\n    \"E_events\": {\n      \"group\": \"E\",\n      \"within_group_weight\": 0.2,\n      \"maximum\": 4.0,\n      \"label\": \"源事件覆盖与粗定位\",\n      \"method\": \"judge\",\n      \"unit\": \"points\"\n    },\n    \"E_roles\": {\n      \"group\": \"E\",\n      \"within_group_weight\": 0.15,\n      \"maximum\": 3.0,\n      \"label\": \"源说话人/声音实例归属\",\n      \"method\": \"judge\",\n      \"unit\": \"points\"\n    },\n    \"E_meaning\": {\n      \"group\": \"E\",\n      \"within_group_weight\": 0.25,\n      \"maximum\": 5.0,\n      \"label\": \"源语义与关键语气识别\",\n      \"method\": \"judge\",\n      \"unit\": \"points\"\n    },\n    \"T_meaning\": {\n      \"group\": \"T\",\n      \"within_group_weight\": 0.45,\n      \"maximum\": 4.5,\n      \"label\": \"中文意义准确完整\",\n      \"method\": \"judge\",\n      \"unit\": \"points\"\n    },\n    \"T_natural\": {\n      \"group\": \"T\",\n      \"within_group_weight\": 0.3,\n      \"maximum\": 3.0,\n      \"label\": \"中文自然度\",\n      \"method\": \"judge\",\n      \"unit\": \"points\"\n    },\n    \"T_terms\": {\n      \"group\": \"T\",\n      \"within_group_weight\": 0.15,\n      \"maximum\": 1.5,\n      \"label\": \"术语和称呼一致\",\n      \"method\": \"judge\",\n      \"unit\": \"points\"\n    },\n    \"T_style\": {\n      \"group\": \"T\",\n      \"within_group_weight\": 0.1,\n      \"maximum\": 1.0,\n      \"label\": \"语体与语用功能\",\n      \"method\": \"judge\",\n      \"unit\": \"points\"\n    },\n    \"A_identity\": {\n      \"group\": \"A\",\n      \"within_group_weight\": 0.35714285714285715,\n      \"maximum\": 25,\n      \"label\": \"原人物音色与身份保持\",\n      \"method\": \"judge\",\n      \"unit\": \"points\"\n    },\n    \"A_stable\": {\n      \"group\": \"A\",\n      \"within_group_weight\": 0.21428571428571427,\n      \"maximum\": 15,\n      \"label\": \"同人物跨段声音一致性\",\n      \"method\": \"judge\",\n      \"unit\": \"points\"\n    },\n    \"A_prosody\": {\n      \"group\": \"A\",\n      \"within_group_weight\": 0.21428571428571427,\n      \"maximum\": 15,\n      \"label\": \"情绪语气与表演保持\",\n      \"method\": \"judge\",\n      \"unit\": \"points\"\n    },\n    \"A_content\": {\n      \"group\": \"A\",\n      \"within_group_weight\": 0.14285714285714285,\n      \"maximum\": 10,\n      \"label\": \"实际中文内容忠实度\",\n      \"method\": \"judge\",\n      \"unit\": \"points\"\n    },\n    \"A_quality\": {\n      \"group\": \"A\",\n      \"within_group_weight\": 0.07142857142857142,\n      \"maximum\": 5,\n      \"label\": \"自然度清晰度与双版本混音\",\n      \"method\": \"judge\",\n      \"unit\": \"points\"\n    },\n    \"V_frames\": {\n      \"group\": \"V\",\n      \"within_group_weight\": 0.6,\n      \"maximum\": 0.6,\n      \"label\": \"原画面内容与顺序\",\n      \"method\": \"automatic\",\n      \"unit\": \"coefficient\"\n    },\n    \"V_timeline\": {\n      \"group\": \"V\",\n      \"within_group_weight\": 0.2,\n      \"maximum\": 0.2,\n      \"label\": \"时间线完整性\",\n      \"method\": \"automatic\",\n      \"unit\": \"coefficient\"\n    },\n    \"V_display\": {\n      \"group\": \"V\",\n      \"within_group_weight\": 0.2,\n      \"maximum\": 0.2,\n      \"label\": \"声画时机与字幕呈现\",\n      \"method\": \"judge\",\n      \"unit\": \"coefficient\"\n    }\n  },\n  \"checklist\": {\n    \"E_events\": [\n      [\n        \"occurrence\",\n        \"这次源事件是否独立记录而未漏掉或与另一次重复出现合并？\"\n      ],\n      [\n        \"window\",\n        \"提交事件窗口是否覆盖实际源发声/屏幕事件，且无明显跨场景错置？\"\n      ]\n    ],\n    \"E_roles\": [\n      [\n        \"source_role\",\n        \"提交的 speaker_id 对应的可见人物/画外声源是否正确？\"\n      ],\n      [\n        \"instance\",\n        \"提交的声音实例区分是否符合实际源人物，而非按每句任意新增身份？\"\n      ]\n    ],\n    \"E_meaning\": [\n      [\n        \"proposition\",\n        \"英文转录及事件声明是否保留本次源事件的核心命题、关系及限定方向？\"\n      ],\n      [\n        \"intent\",\n        \"提交的 delivery_note 是否正确识别源句实际语用/情绪功能？\"\n      ]\n    ],\n    \"T_meaning\": [\n      [\n        \"proposition\",\n        \"中文译文是否保留源事件核心命题及人物关系？\"\n      ],\n      [\n        \"scope\",\n        \"源句中的否定/数字/条件/完成性/自我修正/后置限定是否均保留且作用范围正确？\"\n      ]\n    ],\n    \"T_natural\": [\n      [\n        \"grammar\",\n        \"中文句子语法是否成立且无需读者补修即可理解？\"\n      ],\n      [\n        \"spoken\",\n        \"中文措辞搭配是否适合自然口语且无明显生硬直译？\"\n      ]\n    ],\n    \"T_terms\": [\n      [\n        \"terms\",\n        \"本事件中的术语、专名、称呼是否正确且与其他同一所指相容？\"\n      ]\n    ],\n    \"T_style\": [\n      [\n        \"function\",\n        \"中文文字是否保留源句命令/请求/疑问/讽刺/辩解等实际语用功能？\"\n      ]\n    ],\n    \"A_identity\": [\n      [\n        \"pitch\",\n        \"中文声音的音高区间是否与该源人物相容？\"\n      ],\n      [\n        \"texture\",\n        \"中文声音是否保留源人物可稳定辨认的气声/沙哑/明亮等音质特征？\"\n      ],\n      [\n        \"resonance\",\n        \"中文声音的共鸣、厚薄特征是否与源人物相容？\"\n      ],\n      [\n        \"identity\",\n        \"排除语言差异后中文声音是否仍可辨认为同一人物，而非仅性别相近的通用声音？\"\n      ]\n    ],\n    \"A_stable\": [\n      [\n        \"stable\",\n        \"同一人物/合法声音实例在这些跨段样本中是否保持相同音色身份？\"\n      ],\n      [\n        \"distinct\",\n        \"此人物声音是否仍可与其他实际角色区分，未发生声线交换？\"\n      ]\n    ],\n    \"A_prosody\": [\n      [\n        \"intent\",\n        \"实际中文声音是否保留源句的关键语气/情绪功能？\"\n      ],\n      [\n        \"delivery\",\n        \"实际中文是否保留源句可听的强调、停顿、犹豫、修正或被打断的表演结构（以源实际存在者为准）？\"\n      ]\n    ],\n    \"A_content\": [\n      [\n        \"spoken\",\n        \"源中应发声的中文核心意思是否实际完整可听，而非仅写在译稿/字幕？\"\n      ],\n      [\n        \"critical\",\n        \"实际中文是否保留源句否定、关系、数字、条件和状态，未反转或擅自补全？\"\n      ]\n    ],\n    \"A_quality\": [\n      [\n        \"mandarin\",\n        \"实际配音是否为可懂普通话且无妨碍理解的误读？\"\n      ],\n      [\n        \"natural\",\n        \"实际语音是否自然连贯，无明显机械节奏/不合理停顿？\"\n      ],\n      [\n        \"clean\",\n        \"实际混音是否无妨碍听辨的伪影、削波或英语双叠？\"\n      ],\n      [\n        \"effects\",\n        \"故事必要的源音效是否仍可听且未遮住关键中文？\"\n      ],\n      [\n        \"mobile\",\n        \"实际手机单声道版是否保留同一完整中文及必要音效，数字/否定/短句可懂？\"\n      ]\n    ],\n    \"V_display\": [\n      [\n        \"sync\",\n        \"实际可见嘴部发声/画外事件窗口与中文发声是否可用，无明显错位或拖尾？\"\n      ],\n      [\n        \"burned\",\n        \"中英文字幕是否均实际烧录且对应交付文本？\"\n      ],\n      [\n        \"safe_area\",\n        \"字幕是否位于底部32%且不遮挡必要动作，字号对比度可读？\"\n      ]\n    ]\n  },\n  \"judge_protocol\": {\n    \"answers\": [\n      \"yes\",\n      \"no\",\n      \"pending\"\n    ],\n    \"independent_votes\": 2,\n    \"third_vote_on_disagreement\": true,\n    \"evidence_required\": true,\n    \"critical_weight\": 3,\n    \"ordinary_weight\": 1,\n    \"identity_aggregation\": \"equal source-role macro average\",\n    \"global_review_weight\": \"only cross-scene check items; no double full-duration weighting\",\n    \"no_answer\": \"pending, not zero\"\n  },\n  \"source_reference_policy\": \"Official subtitles are coarse and may conflict with actual audio; label conflicts pending. WER is provisional until source speech transcript reviewed.\",\n  \"voice_minimum_policy\": \"No uncalibrated numeric identity gate. Identity/stability scores reported; entire-role identity swap remains critical gate.\",\n  \"automatic_definitions\": {\n    \"E_words\": \"max(0,1-word Levenshtein distance/reference word count); lowercase, punctuation ignored, screen labels removed, Fourty/40/forty normalized; no semantic paraphrase credit for English transcription\",\n    \"V_frames\": \"fraction of all top68% 32x24 grayscale frames with MAE<12 at corresponding frame index, multiplied by min(1,output_frames/source_frames); threshold>=98% and frame count difference<=1 remains hard gate\",\n    \"V_timeline\": \"max(0,1-abs(output_duration-525)/525); duration within one frame+30ms and original frame sequence remain hard gates\",\n    \"pending\": \"No score substitution or denominator shrinking; report confirmed lower/upper bounds. Formal total withheld while any scored item pending.\"\n  },\n  \"run_conditions\": {\n    \"solver_effort\": \"high\",\n    \"wall_seconds\": 3600,\n    \"maximum_parallel_solvers\": 2,\n    \"maximum_api_requests\": 2,\n    \"local_voice_tool\": \"F5-TTS v1 Base/Vocos CPU, optional; common System.Speech and offline ASR also available\",\n    \"resources\": \"Two solvers share host CPU/disk; GPU not exposed; actual disk space visible; batch inference recommended\"\n  },\n  \"visual_coefficient\": {\n    \"V_frames\": 0.6,\n    \"V_timeline\": 0.2,\n    \"V_display\": 0.2\n  },\n  \"reweighting_policy\": {\n    \"E\": 20,\n    \"T\": 10,\n    \"A\": {\n      \"A_identity\": 25,\n      \"A_stable\": 15,\n      \"A_prosody\": 15,\n      \"A_content\": 10,\n      \"A_quality\": 5\n    },\n    \"V\": {\n      \"V_frames\": 0.6,\n      \"V_timeline\": 0.2,\n      \"V_display\": 0.2\n    },\n    \"pass_score\": 80,\n    \"gate_policy\": \"All existing gates retained. Failed or pending gates do not pass.\",\n    \"formula\": \"(E20 + T10) * (A70 / 70) * V_coefficient * (100 / 30)\",\n    \"scope\": \"Frozen submissions, subcriterion scores, QA answers, reasons and votes unchanged. Content is multiplied by audio and visual coefficients, normalized to 100.\"\n  }\n}\n"
      },
      {
        "name": "submission_schema.json",
        "path": "submission_schema.json",
        "url": "variant-results/case-40/candidate/submission_schema.json",
        "kind": "document",
        "bytes": 8792,
        "text": "{\n  \"$schema\": \"https://json-schema.org/draft/2020-12/schema\",\n  \"file_schemas\": {\n    \"speakers.json\": {\n      \"type\": \"object\",\n      \"properties\": {\n        \"speakers\": {\n          \"type\": \"array\",\n          \"minItems\": 2,\n          \"items\": {\n            \"type\": \"object\",\n            \"properties\": {\n              \"speaker_id\": {\n                \"type\": \"string\"\n              },\n              \"name\": {\n                \"type\": \"string\"\n              },\n              \"voice_id\": {\n                \"type\": \"string\"\n              },\n              \"wav\": {\n                \"type\": \"string\"\n              },\n              \"instance\": {\n                \"type\": \"string\",\n                \"minLength\": 1\n              }\n            },\n            \"required\": [\n              \"speaker_id\",\n              \"name\",\n              \"voice_id\",\n              \"wav\",\n              \"instance\"\n            ],\n            \"additionalProperties\": true\n          }\n        }\n      },\n      \"required\": [\n        \"speakers\"\n      ],\n      \"additionalProperties\": true\n    },\n    \"translation_plan.json\": {\n      \"type\": \"object\",\n      \"properties\": {\n        \"events\": {\n          \"type\": \"array\",\n          \"minItems\": 1,\n          \"items\": {\n            \"type\": \"object\",\n            \"properties\": {\n              \"source_ids\": {\n                \"type\": \"array\",\n                \"minItems\": 1,\n                \"items\": {\n                  \"type\": \"string\"\n                }\n              },\n              \"speaker_id\": {\n                \"type\": \"string\"\n              },\n              \"source_text\": {\n                \"type\": \"string\"\n              },\n              \"zh_text\": {\n                \"type\": \"string\"\n              },\n              \"voice_id\": {\n                \"type\": \"string\"\n              },\n              \"start\": {\n                \"type\": \"number\"\n              },\n              \"end\": {\n                \"type\": \"number\"\n              },\n              \"visible_speech\": {\n                \"type\": \"boolean\"\n              },\n              \"type\": {\n                \"enum\": [\n                  \"speech\",\n                  \"screen_text\",\n                  \"non_speech\"\n                ]\n              },\n              \"event_id\": {\n                \"type\": \"string\",\n                \"minLength\": 1\n              },\n              \"speaker_instance\": {\n                \"type\": \"string\"\n              },\n              \"delivery_note\": {\n                \"type\": \"string\"\n              }\n            },\n            \"required\": [\n              \"source_ids\",\n              \"speaker_id\",\n              \"source_text\",\n              \"zh_text\",\n              \"voice_id\",\n              \"start\",\n              \"end\",\n              \"visible_speech\",\n              \"type\",\n              \"event_id\",\n              \"speaker_instance\",\n              \"delivery_note\"\n            ],\n            \"additionalProperties\": true\n          }\n        }\n      },\n      \"required\": [\n        \"events\"\n      ],\n      \"additionalProperties\": true\n    },\n    \"rebuild.json\": {\n      \"type\": \"object\",\n      \"properties\": {\n        \"argv\": {\n          \"type\": \"array\",\n          \"minItems\": 1,\n          \"items\": {\n            \"type\": \"string\"\n          }\n        }\n      },\n      \"required\": [\n        \"argv\"\n      ],\n      \"additionalProperties\": true\n    },\n    \"mix_config.json\": {\n      \"type\": \"object\",\n      \"required\": [\n        \"effects_gain_db\",\n        \"mobile\"\n      ],\n      \"additionalProperties\": false,\n      \"properties\": {\n        \"effects_gain_db\": {\n          \"type\": \"number\",\n          \"minimum\": -12,\n          \"maximum\": 0\n        },\n        \"mobile\": {\n          \"type\": \"object\",\n          \"required\": [\n            \"method\",\n            \"gain_db\",\n            \"limiter_ceiling_dbtp\"\n          ],\n          \"additionalProperties\": false,\n          \"properties\": {\n            \"method\": {\n              \"const\": \"mono_downmix_gain_limiter\"\n            },\n            \"gain_db\": {\n              \"type\": \"number\",\n              \"minimum\": -12,\n              \"maximum\": 6\n            },\n            \"limiter_ceiling_dbtp\": {\n              \"const\": -2\n            }\n          }\n        }\n      }\n    },\n    \"continuity_ledger.json\": {\n      \"type\": \"object\",\n      \"required\": [\n        \"decisions\"\n      ],\n      \"additionalProperties\": false,\n      \"properties\": {\n        \"decisions\": {\n          \"type\": \"array\",\n          \"minItems\": 8,\n          \"maxItems\": 8,\n          \"items\": {\n            \"type\": \"object\",\n            \"required\": [\n              \"challenge_id\",\n              \"source_ids\",\n              \"event_indices\",\n              \"source_evidence\",\n              \"decision\",\n              \"alternative_rejected\"\n            ],\n            \"additionalProperties\": false,\n            \"properties\": {\n              \"challenge_id\": {\n                \"enum\": [\n                  \"C01\",\n                  \"C02\",\n                  \"C03\",\n                  \"C04\",\n                  \"C05\",\n                  \"C06\",\n                  \"C07\",\n                  \"C08\"\n                ]\n              },\n              \"source_ids\": {\n                \"type\": \"array\",\n                \"minItems\": 1,\n                \"uniqueItems\": true,\n                \"items\": {\n                  \"type\": \"string\",\n                  \"pattern\": \"^S0[0-7][0-9]$\"\n                }\n              },\n              \"event_indices\": {\n                \"type\": \"array\",\n                \"minItems\": 1,\n                \"uniqueItems\": true,\n                \"items\": {\n                  \"type\": \"integer\",\n                  \"minimum\": 0\n                }\n              },\n              \"source_evidence\": {\n                \"type\": \"array\",\n                \"minItems\": 1,\n                \"items\": {\n                  \"type\": \"object\",\n                  \"required\": [\n                    \"start\",\n                    \"end\",\n                    \"observation\"\n                  ],\n                  \"properties\": {\n                    \"start\": {\n                      \"type\": \"number\",\n                      \"minimum\": 0,\n                      \"maximum\": 79\n                    },\n                    \"end\": {\n                      \"type\": \"number\",\n                      \"exclusiveMinimum\": 0,\n                      \"maximum\": 79\n                    },\n                    \"observation\": {\n                      \"type\": \"string\",\n                      \"minLength\": 1\n                    }\n                  },\n                  \"additionalProperties\": false\n                }\n              },\n              \"decision\": {\n                \"type\": \"string\",\n                \"minLength\": 1\n              },\n              \"alternative_rejected\": {\n                \"type\": \"string\",\n                \"minLength\": 1\n              }\n            }\n          }\n        }\n      }\n    },\n    \"source_events.json\": {\n      \"type\": \"object\",\n      \"required\": [\n        \"events\"\n      ],\n      \"properties\": {\n        \"events\": {\n          \"type\": \"array\",\n          \"items\": {\n            \"type\": \"object\",\n            \"required\": [\n              \"source_ids\",\n              \"speaker_id\",\n              \"start\",\n              \"end\",\n              \"source_text\",\n              \"delivery_note\"\n            ],\n            \"properties\": {\n              \"source_ids\": {\n                \"type\": \"array\",\n                \"items\": {\n                  \"type\": \"string\"\n                }\n              },\n              \"speaker_id\": {\n                \"type\": \"string\"\n              },\n              \"start\": {\n                \"type\": \"number\"\n              },\n              \"end\": {\n                \"type\": \"number\"\n              },\n              \"source_text\": {\n                \"type\": \"string\"\n              },\n              \"delivery_note\": {\n                \"type\": \"string\"\n              }\n            }\n          }\n        }\n      }\n    },\n    \"voice_provenance.json\": {\n      \"type\": \"object\",\n      \"required\": [\n        \"voices\"\n      ],\n      \"properties\": {\n        \"voices\": {\n          \"type\": \"array\",\n          \"items\": {\n            \"type\": \"object\",\n            \"required\": [\n              \"speaker_id\",\n              \"method\",\n              \"reference_intervals\"\n            ],\n            \"properties\": {\n              \"speaker_id\": {\n                \"type\": \"string\"\n              },\n              \"method\": {\n                \"type\": \"string\"\n              },\n              \"reference_intervals\": {\n                \"type\": \"array\",\n                \"items\": {\n                  \"type\": \"array\",\n                  \"items\": {\n                    \"type\": \"number\"\n                  },\n                  \"minItems\": 2,\n                  \"maxItems\": 2\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
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
        "video": {
          "name": "dub_zh.mp4",
          "path": "dub_zh.mp4",
          "url": "variant-results/case-40/sol/dub_zh.mp4",
          "kind": "video",
          "bytes": 7194716,
          "meta": {
            "duration": 79.018,
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
            "url": "variant-results/case-40/sol/README.md",
            "kind": "document",
            "bytes": 4188
          },
          {
            "name": "transcript_en.txt",
            "path": "transcript_en.txt",
            "url": "variant-results/case-40/sol/transcript_en.txt",
            "kind": "document",
            "bytes": 696
          },
          {
            "name": "transcript_zh.txt",
            "path": "transcript_zh.txt",
            "url": "variant-results/case-40/sol/transcript_zh.txt",
            "kind": "document",
            "bytes": 730
          },
          {
            "name": "subtitles_en.srt",
            "path": "subtitles_en.srt",
            "url": "variant-results/case-40/sol/subtitles_en.srt",
            "kind": "document",
            "bytes": 1552
          },
          {
            "name": "subtitles_zh.srt",
            "path": "subtitles_zh.srt",
            "url": "variant-results/case-40/sol/subtitles_zh.srt",
            "kind": "document",
            "bytes": 1585
          },
          {
            "name": "translation_plan.json",
            "path": "translation_plan.json",
            "url": "variant-results/case-40/sol/translation_plan.json",
            "kind": "document",
            "bytes": 12867
          },
          {
            "name": "continuity_ledger.json",
            "path": "continuity_ledger.json",
            "url": "variant-results/case-40/sol/continuity_ledger.json",
            "kind": "document",
            "bytes": 8099
          },
          {
            "name": "voice_provenance.json",
            "path": "voice_provenance.json",
            "url": "variant-results/case-40/sol/voice_provenance.json",
            "kind": "document",
            "bytes": 1131
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
            "bytes": 1133173,
            "meta": {
              "duration": 79.0,
              "width": null,
              "height": null,
              "fps": "0/0",
              "sampleRate": "48000"
            }
          }
        ],
        "milestones": [
          {
            "id": "item_14",
            "type": "command_execution",
            "exit_code": 0,
            "status": "completed",
            "tools": [
              "ffmpeg"
            ]
          },
          {
            "id": "item_25",
            "type": "command_execution",
            "exit_code": 47,
            "status": "failed"
          },
          {
            "id": "item_58",
            "type": "command_execution",
            "exit_code": 1,
            "status": "failed",
            "tools": [
              "clone_voice.py",
              "python3"
            ]
          },
          {
            "id": "item_89",
            "type": "command_execution",
            "exit_code": 0,
            "status": "completed",
            "tools": [
              "ffmpeg",
              "ffprobe"
            ]
          },
          {
            "id": "item_152",
            "type": "command_execution",
            "exit_code": 0,
            "status": "completed",
            "tools": [
              "python3",
              "rebuild.py"
            ]
          },
          {
            "id": "item_191",
            "type": "command_execution",
            "exit_code": 0,
            "status": "completed",
            "tools": [
              "python3"
            ]
          }
        ],
        "scoring": {
          "rows": [
            {
              "id": "E_words",
              "label": "英文词序列准确性",
              "score": 7.703703703703704,
              "maximum": 8.0
            },
            {
              "id": "E_events",
              "label": "源事件覆盖与粗定位",
              "score": 3.9999999999999956,
              "maximum": 4.0
            },
            {
              "id": "E_roles",
              "label": "源说话人/声音实例归属",
              "score": 3.0000000000000013,
              "maximum": 3.0
            },
            {
              "id": "E_meaning",
              "label": "源语义与关键语气识别",
              "score": 5.000000000000002,
              "maximum": 5.0
            },
            {
              "id": "T_meaning",
              "label": "中文意义准确完整",
              "score": 4.499999999999999,
              "maximum": 4.5
            },
            {
              "id": "T_natural",
              "label": "中文自然度",
              "score": 3.0000000000000013,
              "maximum": 3.0
            },
            {
              "id": "T_terms",
              "label": "术语和称呼一致",
              "score": 1.4999999999999996,
              "maximum": 1.5
            },
            {
              "id": "T_style",
              "label": "语体与语用功能",
              "score": 1.0,
              "maximum": 1.0
            },
            {
              "id": "A_identity",
              "label": "原人物音色与身份保持",
              "score": 24.999999999999996,
              "maximum": 25
            },
            {
              "id": "A_stable",
              "label": "同人物跨段声音一致性",
              "score": 15.0,
              "maximum": 15
            },
            {
              "id": "A_prosody",
              "label": "情绪语气与表演保持",
              "score": 15.000000000000004,
              "maximum": 15
            },
            {
              "id": "A_content",
              "label": "实际中文内容忠实度",
              "score": 9.791666666666671,
              "maximum": 10
            },
            {
              "id": "A_quality",
              "label": "自然度清晰度与双版本混音",
              "score": 5.000000000000005,
              "maximum": 5
            },
            {
              "id": "V_frames",
              "label": "原画面内容与顺序",
              "score": 0.5999999999999999,
              "maximum": 0.6
            },
            {
              "id": "V_timeline",
              "label": "时间线完整性",
              "score": 0.2,
              "maximum": 0.2
            },
            {
              "id": "V_display",
              "label": "声画时机与字幕呈现",
              "score": 0.18055555555555552,
              "maximum": 0.2
            }
          ],
          "groups": {
            "E": {
              "score": 19.703703703703702,
              "maximum": 20
            },
            "T": {
              "score": 10.0,
              "maximum": 10
            },
            "A": {
              "score": 69.79166666666667,
              "maximum": 70
            }
          },
          "coefficient": 0.9805555555555554,
          "core": 98.7176660787772,
          "gates": {
            "continuity_ledger": {
              "pass": null,
              "evidence": {
                "reason": "字段、事件索引覆盖、最低证据数等公开结构要求均满足。旧失败仅来自每个S都须与私有字幕粗时间窗相交；题面未明确这一精确验收条件，且源时间标注未经校准。因此保留诊断、待源证据核验，不作确定硬门槛失败。跨段语义仍由冻结H类QA评审。",
                "explicit_structural_contract_passed": true,
                "structural_issues": [],
                "private_subtitle_window_diagnostic": [
                  {
                    "challenge_id": "C03",
                    "source_ids_without_private_subtitle_window_overlap": [
                      "S004"
                    ],
                    "submitted_evidence_intervals": [
                      [
                        12.45,
                        15.65
                      ],
                      [
                        16.72,
                        17.27
                      ],
                      [
                        18.7,
                        20.21
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
                      "C03"
                    ]
                  }
                }
              }
            },
            "critical_H07.A_content.relation": {
              "pass": false,
              "evidence": {
                "id": "H07.A_content.relation",
                "answer": "no",
                "reason": "输出音频缺失原片中“you're...”后的明显停顿犹豫，语流过于连贯。",
                "source_intervals": [
                  [
                    25.958,
                    28.75
                  ]
                ],
                "output_intervals": [
                  [
                    25.9,
                    28.73
                  ]
                ],
                "votes": [
                  {
                    "id": "H07.A_content.relation",
                    "answer": "no",
                    "reason": "输出音频缺失原片中“you're...”后的明显停顿犹豫，语流过于连贯。",
                    "source_intervals": [
                      [
                        25.958,
                        28.75
                      ]
                    ],
                    "output_intervals": [
                      [
                        25.9,
                        28.73
                      ]
                    ]
                  },
                  {
                    "id": "H07.A_content.relation",
                    "answer": "no",
                    "reason": "输出音频缺失原片中“you're...”后的明显停顿犹豫。",
                    "source_intervals": [
                      [
                        25.958,
                        28.75
                      ]
                    ],
                    "output_intervals": [
                      [
                        25.9,
                        28.73
                      ]
                    ]
                  }
                ]
              }
            }
          },
          "losses": [
            {
              "id": "H07.A_content.relation",
              "reason": "输出音频缺失原片中“you're...”后的明显停顿犹豫，语流过于连贯。",
              "lost": 0.20833333333333334,
              "source_intervals": [
                [
                  25.958,
                  28.75
                ]
              ],
              "output_intervals": [
                [
                  25.9,
                  28.73
                ]
              ]
            },
            {
              "id": "S006.V_display.safe_area",
              "reason": "短句字幕清晰且避开人物，后句中文字压住羊嘴，遮挡张嘴动作",
              "lost": 0.002777777777777778,
              "source_intervals": [
                [
                  17.1,
                  17.14
                ],
                [
                  18.85,
                  18.89
                ]
              ],
              "output_intervals": [
                [
                  17.1,
                  17.14
                ],
                [
                  18.85,
                  18.89
                ]
              ]
            },
            {
              "id": "S008.V_display.safe_area",
              "reason": "影院版首句中文字幕压住羊嘴，遮挡反应镜头中的嘴部表情",
              "lost": 0.002777777777777778,
              "source_intervals": [
                [
                  26.6,
                  28.6
                ]
              ],
              "output_intervals": [
                [
                  26.6,
                  28.6
                ]
              ]
            },
            {
              "id": "S013.V_display.safe_area",
              "reason": "影院字幕位于底部且清晰，但英文行压住羊张嘴时的上唇边缘",
              "lost": 0.002777777777777778,
              "source_intervals": [
                [
                  49.515,
                  49.516
                ]
              ],
              "output_intervals": [
                [
                  49.515,
                  49.516
                ]
              ]
            },
            {
              "id": "S015.V_display.safe_area",
              "reason": "影院版切回羊脸特写时，底部英文字幕遮住张开的羊嘴。",
              "lost": 0.002777777777777778,
              "source_intervals": [
                [
                  53.1,
                  53.14
                ]
              ],
              "output_intervals": [
                [
                  53.1,
                  53.14
                ]
              ]
            },
            {
              "id": "S016.V_display.safe_area",
              "reason": "影院帧中底部英文第二行叠在羊的张嘴区域，遮住部分嘴形",
              "lost": 0.002777777777777778,
              "source_intervals": [
                [
                  53.515,
                  55.515
                ]
              ],
              "output_intervals": [
                [
                  53.515,
                  55.515
                ]
              ]
            },
            {
              "id": "S017.V_display.safe_area",
              "reason": "切回弗兰克的脸时，底部英文末尾压住了羊嘴右侧轮廓",
              "lost": 0.002777777777777778,
              "source_intervals": [
                [
                  60.6,
                  60.64
                ]
              ],
              "output_intervals": [
                [
                  60.6,
                  60.64
                ]
              ]
            },
            {
              "id": "S018.V_display.safe_area",
              "reason": "影院版四行字幕压住前景抬手手势的拇指根部和掌面",
              "lost": 0.002777777777777778,
              "source_intervals": [
                [
                  61.41,
                  63.542
                ]
              ],
              "output_intervals": [
                [
                  62.1,
                  62.101
                ]
              ]
            }
          ]
        },
        "actions": 191
      },
      "luna": {
        "video": {
          "name": "dub_zh.mp4",
          "path": "dub_zh.mp4",
          "url": "variant-results/case-40/luna/dub_zh.mp4",
          "kind": "video",
          "bytes": 7198574,
          "meta": {
            "duration": 79.018,
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
            "url": "variant-results/case-40/luna/README.md",
            "kind": "document",
            "bytes": 1696
          },
          {
            "name": "transcript_en.txt",
            "path": "transcript_en.txt",
            "url": "variant-results/case-40/luna/transcript_en.txt",
            "kind": "document",
            "bytes": 1045
          },
          {
            "name": "transcript_zh.txt",
            "path": "transcript_zh.txt",
            "url": "variant-results/case-40/luna/transcript_zh.txt",
            "kind": "document",
            "bytes": 1071
          },
          {
            "name": "subtitles_en.srt",
            "path": "subtitles_en.srt",
            "url": "variant-results/case-40/luna/subtitles_en.srt",
            "kind": "document",
            "bytes": 1467
          },
          {
            "name": "subtitles_zh.srt",
            "path": "subtitles_zh.srt",
            "url": "variant-results/case-40/luna/subtitles_zh.srt",
            "kind": "document",
            "bytes": 1494
          },
          {
            "name": "translation_plan.json",
            "path": "translation_plan.json",
            "url": "variant-results/case-40/luna/translation_plan.json",
            "kind": "document",
            "bytes": 11650
          },
          {
            "name": "continuity_ledger.json",
            "path": "continuity_ledger.json",
            "url": "variant-results/case-40/luna/continuity_ledger.json",
            "kind": "document",
            "bytes": 7890
          },
          {
            "name": "voice_provenance.json",
            "path": "voice_provenance.json",
            "url": "variant-results/case-40/luna/voice_provenance.json",
            "kind": "document",
            "bytes": 855
          },
          {
            "name": "rebuild.json",
            "path": "rebuild.json",
            "url": "variant-results/case-40/luna/rebuild.json",
            "kind": "document",
            "bytes": 600
          },
          {
            "name": "mobile_mix.m4a",
            "path": "mobile_mix.m4a",
            "url": "variant-results/case-40/luna/mobile_mix.m4a",
            "kind": "audio",
            "bytes": 1134584,
            "meta": {
              "duration": 79.0,
              "width": null,
              "height": null,
              "fps": "0/0",
              "sampleRate": "48000"
            }
          }
        ],
        "milestones": [
          {
            "id": "item_32",
            "type": "command_execution",
            "exit_code": 0,
            "status": "completed",
            "tools": [
              "ffmpeg"
            ]
          },
          {
            "id": "item_42",
            "type": "command_execution",
            "exit_code": 0,
            "status": "completed",
            "tools": [
              "python3"
            ]
          },
          {
            "id": "item_67",
            "type": "command_execution",
            "exit_code": 0,
            "status": "completed",
            "tools": [
              "clone_voice_lowmem.py",
              "python3"
            ]
          },
          {
            "id": "item_93",
            "type": "command_execution",
            "exit_code": 0,
            "status": "completed",
            "tools": [
              "f5_clone_lowmem.py",
              "rebuild.py"
            ]
          },
          {
            "id": "item_131",
            "type": "command_execution",
            "exit_code": 0,
            "status": "completed",
            "tools": [
              "ffmpeg"
            ]
          },
          {
            "id": "item_140",
            "type": "command_execution",
            "exit_code": 0,
            "status": "completed",
            "tools": [
              "ffmpeg"
            ]
          }
        ],
        "scoring": {
          "rows": [
            {
              "id": "E_words",
              "label": "英文词序列准确性",
              "score": 7.822222222222221,
              "maximum": 8.0
            },
            {
              "id": "E_events",
              "label": "源事件覆盖与粗定位",
              "score": 3.7499999999999964,
              "maximum": 4.0
            },
            {
              "id": "E_roles",
              "label": "源说话人/声音实例归属",
              "score": 2.8125000000000013,
              "maximum": 3.0
            },
            {
              "id": "E_meaning",
              "label": "源语义与关键语气识别",
              "score": 4.625000000000002,
              "maximum": 5.0
            },
            {
              "id": "T_meaning",
              "label": "中文意义准确完整",
              "score": 4.499999999999999,
              "maximum": 4.5
            },
            {
              "id": "T_natural",
              "label": "中文自然度",
              "score": 3.0000000000000013,
              "maximum": 3.0
            },
            {
              "id": "T_terms",
              "label": "术语和称呼一致",
              "score": 1.4999999999999996,
              "maximum": 1.5
            },
            {
              "id": "T_style",
              "label": "语体与语用功能",
              "score": 1.0,
              "maximum": 1.0
            },
            {
              "id": "A_identity",
              "label": "原人物音色与身份保持",
              "score": 24.999999999999996,
              "maximum": 25
            },
            {
              "id": "A_stable",
              "label": "同人物跨段声音一致性",
              "score": 7.5,
              "maximum": 15
            },
            {
              "id": "A_prosody",
              "label": "情绪语气与表演保持",
              "score": 15.000000000000004,
              "maximum": 15
            },
            {
              "id": "A_content",
              "label": "实际中文内容忠实度",
              "score": 9.791666666666671,
              "maximum": 10
            },
            {
              "id": "A_quality",
              "label": "自然度清晰度与双版本混音",
              "score": 5.000000000000005,
              "maximum": 5
            },
            {
              "id": "V_frames",
              "label": "原画面内容与顺序",
              "score": 0.5999999999999999,
              "maximum": 0.6
            },
            {
              "id": "V_timeline",
              "label": "时间线完整性",
              "score": 0.2,
              "maximum": 0.2
            },
            {
              "id": "V_display",
              "label": "声画时机与字幕呈现",
              "score": 0.175,
              "maximum": 0.2
            }
          ],
          "groups": {
            "E": {
              "score": 19.00972222222222,
              "maximum": 20
            },
            "T": {
              "score": 10.0,
              "maximum": 10
            },
            "A": {
              "score": 62.29166666666668,
              "maximum": 70
            }
          },
          "coefficient": 0.9749999999999999,
          "core": 86.0506641313933,
          "gates": {
            "continuity_ledger": {
              "pass": null,
              "evidence": {
                "reason": "字段、事件索引覆盖、最低证据数等公开结构要求均满足。旧失败仅来自每个S都须与私有字幕粗时间窗相交；题面未明确这一精确验收条件，且源时间标注未经校准。因此保留诊断、待源证据核验，不作确定硬门槛失败。跨段语义仍由冻结H类QA评审。",
                "explicit_structural_contract_passed": true,
                "structural_issues": [],
                "private_subtitle_window_diagnostic": [
                  {
                    "challenge_id": "C03",
                    "source_ids_without_private_subtitle_window_overlap": [
                      "S004"
                    ],
                    "submitted_evidence_intervals": [
                      [
                        12.42,
                        15.56
                      ],
                      [
                        16.65,
                        19.88
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
                      "C03"
                    ]
                  }
                }
              }
            },
            "offline_rebuild": {
              "pass": false,
              "evidence": {
                "exit": null,
                "output_present": false
              }
            },
            "critical_H05.A_content.relation": {
              "pass": false,
              "evidence": {
                "id": "H05.A_content.relation",
                "answer": "no",
                "reason": "配音将原片断开的句子合并为“这不是办法”，破坏了犹豫和断开的跨事件关系。",
                "source_intervals": [
                  [
                    61.41,
                    63.542
                  ],
                  [
                    64.0,
                    65.125
                  ],
                  [
                    65.825,
                    66.5
                  ]
                ],
                "output_intervals": [
                  [
                    61.41,
                    63.542
                  ],
                  [
                    64.0,
                    65.125
                  ],
                  [
                    65.825,
                    66.5
                  ]
                ],
                "votes": [
                  {
                    "id": "H05.A_content.relation",
                    "answer": "no",
                    "reason": "配音将原片断开的句子合并为“这不是办法”，破坏了犹豫和断开的跨事件关系。",
                    "source_intervals": [
                      [
                        61.41,
                        63.542
                      ],
                      [
                        64.0,
                        65.125
                      ],
                      [
                        65.825,
                        66.5
                      ]
                    ],
                    "output_intervals": [
                      [
                        61.41,
                        63.542
                      ],
                      [
                        64.0,
                        65.125
                      ],
                      [
                        65.825,
                        66.5
                      ]
                    ]
                  },
                  {
                    "id": "H05.A_content.relation",
                    "answer": "no",
                    "reason": "音频将断开的句子合并为完整句，破坏了原片犹豫和中断的语流关系。",
                    "source_intervals": [
                      [
                        61.41,
                        63.542
                      ],
                      [
                        64.0,
                        65.125
                      ],
                      [
                        65.825,
                        66.5
                      ]
                    ],
                    "output_intervals": [
                      [
                        61.24,
                        63.78
                      ],
                      [
                        63.81,
                        66.27
                      ]
                    ]
                  }
                ]
              }
            },
            "critical_role.Victor.A_stable.distinct": {
              "pass": false,
              "evidence": {
                "id": "role.Victor.A_stable.distinct",
                "answer": "no",
                "reason": "存在明显的声线交换：在76.25-78.708秒，源音频中属于Victor的台词“You would have one more minute...”在输出文件中出现在Franck轨道上，而Victor轨道为数字静音。这导致Victor的声音与其他角色发生了混淆和交换。",
                "source_intervals": [
                  [
                    1.0,
                    3.0
                  ],
                  [
                    37.17,
                    39.75
                  ],
                  [
                    76.25,
                    78.708
                  ]
                ],
                "output_intervals": [
                  [
                    1.0,
                    3.0
                  ],
                  [
                    37.17,
                    39.75
                  ],
                  [
                    76.25,
                    78.708
                  ]
                ],
                "votes": [
                  {
                    "id": "role.Victor.A_stable.distinct",
                    "answer": "no",
                    "reason": "存在明显的声线交换：在76.25-78.708秒，源音频中属于Victor的台词“You would have one more minute...”在输出文件中出现在Franck轨道上，而Victor轨道为数字静音。这导致Victor的声音与其他角色发生了混淆和交换。",
                    "source_intervals": [
                      [
                        1.0,
                        3.0
                      ],
                      [
                        37.17,
                        39.75
                      ],
                      [
                        76.25,
                        78.708
                      ]
                    ],
                    "output_intervals": [
                      [
                        1.0,
                        3.0
                      ],
                      [
                        37.17,
                        39.75
                      ],
                      [
                        76.25,
                        78.708
                      ]
                    ]
                  },
                  {
                    "id": "role.Victor.A_stable.distinct",
                    "answer": "no",
                    "reason": "Role distinction fails due to an exchange error. At interval 76.25-78.708, the source indicates Victor speaking, but the output places his lines on the Franck track while leaving the Victor track silent. Conversely, checking other intervals confirms roles are generally distinct, but this specific swap violates the requirement that roles remain distinct without exchanges.",
                    "source_intervals": [
                      [
                        1,
                        3
                      ],
                      [
                        37.17,
                        39.75
                      ],
                      [
                        76.25,
                        78.708
                      ]
                    ],
                    "output_intervals": [
                      [
                        1,
                        3
                      ],
                      [
                        37.17,
                        39.75
                      ],
                      [
                        76.25,
                        78.708
                      ]
                    ]
                  }
                ]
              }
            }
          },
          "losses": [
            {
              "id": "role.Victor.A_stable.stable",
              "reason": "对比样本发现音色不稳定：在1-3秒和37.17-39.75秒，Victor的输出为低沉、沙哑的男声；但在76.25-78.708秒，对应的台词被错误地分配给了Franck轨道，呈现出完全不同的年轻清亮男声，导致同一角色的声音身份发生断裂。",
              "lost": 3.75,
              "source_intervals": [
                [
                  1.0,
                  3.0
                ],
                [
                  37.17,
                  39.75
                ],
                [
                  76.25,
                  78.708
                ]
              ],
              "output_intervals": [
                [
                  1.0,
                  3.0
                ],
                [
                  37.17,
                  39.75
                ],
                [
                  76.25,
                  78.708
                ]
              ]
            },
            {
              "id": "role.Victor.A_stable.distinct",
              "reason": "存在明显的声线交换：在76.25-78.708秒，源音频中属于Victor的台词“You would have one more minute...”在输出文件中出现在Franck轨道上，而Victor轨道为数字静音。这导致Victor的声音与其他角色发生了混淆和交换。",
              "lost": 3.75,
              "source_intervals": [
                [
                  1.0,
                  3.0
                ],
                [
                  37.17,
                  39.75
                ],
                [
                  76.25,
                  78.708
                ]
              ],
              "output_intervals": [
                [
                  1.0,
                  3.0
                ],
                [
                  37.17,
                  39.75
                ],
                [
                  76.25,
                  78.708
                ]
              ]
            },
            {
              "id": "H05.A_content.relation",
              "reason": "配音将原片断开的句子合并为“这不是办法”，破坏了犹豫和断开的跨事件关系。",
              "lost": 0.20833333333333334,
              "source_intervals": [
                [
                  61.41,
                  63.542
                ],
                [
                  64.0,
                  65.125
                ],
                [
                  65.825,
                  66.5
                ]
              ],
              "output_intervals": [
                [
                  61.41,
                  63.542
                ],
                [
                  64.0,
                  65.125
                ],
                [
                  65.825,
                  66.5
                ]
              ]
            },
            {
              "id": "S004.E_meaning.proposition",
              "reason": "英文转录保留了源命题，但因后续事件映射完全错乱，破坏了整体叙事逻辑。",
              "lost": 0.125,
              "source_intervals": [
                [
                  9.813,
                  11.5
                ]
              ],
              "output_intervals": []
            },
            {
              "id": "S004.E_meaning.intent",
              "reason": "源句是惊讶发现对方真实身份，并非温和劝说；语气急促且带确信感。",
              "lost": 0.125,
              "source_intervals": [
                [
                  9.813,
                  11.5
                ]
              ],
              "output_intervals": [
                [
                  9.46,
                  10.22
                ]
              ]
            },
            {
              "id": "S020.E_meaning.intent",
              "reason": "源句实为请求给一分钟，笔记误判为否定挽回局面。",
              "lost": 0.125,
              "source_intervals": [
                [
                  65.825,
                  66.5
                ]
              ],
              "output_intervals": [
                [
                  63.81,
                  66.27
                ]
              ]
            },
            {
              "id": "S004.E_events.window",
              "reason": "源句为You are Frank，提交却将其错配至下一句羊的台词。",
              "lost": 0.08333333333333333,
              "source_intervals": [
                [
                  9.813,
                  11.5
                ]
              ],
              "output_intervals": []
            },
            {
              "id": "S020.E_events.occurrence",
              "reason": "源事件被合并入前一事件窗口，未作为独立条目单独记录呈现。",
              "lost": 0.08333333333333333,
              "source_intervals": [
                [
                  65.825,
                  66.5
                ]
              ],
              "output_intervals": [
                [
                  63.81,
                  66.27
                ]
              ]
            },
            {
              "id": "S020.E_events.window",
              "reason": "提交窗口将原属不同事件的台词错误合并，导致时间轴错置。",
              "lost": 0.08333333333333333,
              "source_intervals": [
                [
                  63.81,
                  66.5
                ]
              ],
              "output_intervals": [
                [
                  63.81,
                  66.27
                ]
              ]
            },
            {
              "id": "S002.E_roles.source_role",
              "reason": "说话人应为绵羊弗兰克，但提交标记为维克托。",
              "lost": 0.06250000000000001,
              "source_intervals": [
                [
                  4.0,
                  6.0
                ]
              ],
              "output_intervals": [
                [
                  4.34,
                  4.72
                ]
              ]
            },
            {
              "id": "S021.E_roles.source_role",
              "reason": "源画面为黑脸羊说话，提交却标为红发男子维克托。",
              "lost": 0.06250000000000001,
              "source_intervals": [
                [
                  66.583,
                  69.27
                ]
              ],
              "output_intervals": [
                [
                  66.61,
                  69.19
                ]
              ]
            },
            {
              "id": "S023.E_roles.source_role",
              "reason": "源音频中该句由弗兰克说出，提交错误地将其标记为维克托。",
              "lost": 0.06250000000000001,
              "source_intervals": [
                [
                  74.12,
                  76.17
                ]
              ],
              "output_intervals": [
                [
                  72.33,
                  75.41
                ]
              ]
            },
            {
              "id": "S002.V_display.sync",
              "reason": "源画面为维克托张嘴，但输出中文配音却由弗兰克音色说出你好，角色与口型严重不符。",
              "lost": 0.002777777777777778,
              "source_intervals": [
                [
                  4.0,
                  6.0
                ]
              ],
              "output_intervals": [
                [
                  4.34,
                  4.72
                ]
              ]
            },
            {
              "id": "S004.V_display.sync",
              "reason": "源视频该时段为画外音无可见嘴部动作，输出却出现对应中文配音及字幕。",
              "lost": 0.002777777777777778,
              "source_intervals": [
                [
                  9.813,
                  11.5
                ]
              ],
              "output_intervals": [
                [
                  9.46,
                  10.22
                ]
              ]
            },
            {
              "id": "S006.V_display.safe_area",
              "reason": "影院版中文字幕横压在弗兰克张开的嘴上，遮住部分口型",
              "lost": 0.002777777777777778,
              "source_intervals": [
                [
                  18.6,
                  18.64
                ]
              ],
              "output_intervals": [
                [
                  18.6,
                  18.64
                ]
              ]
            },
            {
              "id": "S009.V_display.safe_area",
              "reason": "切到羊脸近景后，底部中文行压住羊嘴，遮挡嘴部表情",
              "lost": 0.002777777777777778,
              "source_intervals": [
                [
                  32.725,
                  32.765
                ]
              ],
              "output_intervals": [
                [
                  32.725,
                  32.765
                ]
              ]
            },
            {
              "id": "S015.V_display.safe_area",
              "reason": "影院版英文字幕虽在底部且清晰，却横压在羊张开的嘴上",
              "lost": 0.002777777777777778,
              "source_intervals": [
                [
                  53.1,
                  53.14
                ]
              ],
              "output_intervals": [
                [
                  53.1,
                  53.14
                ]
              ]
            },
            {
              "id": "S016.V_display.safe_area",
              "reason": "影院帧的英文字幕末行压在羊的唇线上，遮住部分嘴部",
              "lost": 0.002777777777777778,
              "source_intervals": [
                [
                  55.515,
                  55.555
                ]
              ],
              "output_intervals": [
                [
                  55.515,
                  55.555
                ]
              ]
            },
            {
              "id": "S018.V_display.safe_area",
              "reason": "影院字幕压在前景拦阻手势上，遮住部分手指和掌缘",
              "lost": 0.002777777777777778,
              "source_intervals": [
                [
                  62.1,
                  62.14
                ]
              ],
              "output_intervals": [
                [
                  62.1,
                  62.14
                ]
              ]
            },
            {
              "id": "S022.V_display.safe_area",
              "reason": "影院版英文字幕盖住羊嘴上缘，遮挡部分口部动作",
              "lost": 0.002777777777777778,
              "source_intervals": [
                [
                  71.6,
                  71.64
                ]
              ],
              "output_intervals": [
                [
                  71.6,
                  71.64
                ]
              ]
            },
            {
              "id": "S024.V_display.safe_area",
              "reason": "院线版英文首行横跨羊的下口部，遮住部分嘴部轮廓",
              "lost": 0.002777777777777778,
              "source_intervals": [
                [
                  76.683,
                  76.723
                ]
              ],
              "output_intervals": [
                [
                  76.683,
                  76.723
                ]
              ]
            }
          ]
        },
        "actions": 128
      }
    }
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
    "task": "# 第12题 / Case31：四人会议字幕对轴·正式困难版\n\n看完所附 Aegisub 教程，把 `input/source.mp4` 制作为准确、可读的英文多人字幕。文字已完整提供，不要求翻译。困难在于真实重叠、短附和、重复和自我修正、数值与否定，以及在镜头切换中保持声源身份。允许使用本地脚本和对齐模型。\n\n## 输入\n\n- `source.mp4`: EasyCom Session 2, three reordered English conversation excerpts, 150.20 seconds at 25 fps. The wearable viewpoint moves with one of the four speakers. Voice identity comes from the four independent references. `original.wav` contains the actual video audio.\n- `transcript.txt`：完整逐词稿，文本组Uxxx的排列经过固定随机打乱，**编号和出现顺序均不代表时间或人物**。文本组是检索单位，不是必须采用的字幕分句。保留重复、口头词和未完成词；可改标点、大小写，但不得润色成与原声不同的句子。\n- `speakers.json`及4组头像/声音：A/B/C/D是本题身份，不是原始语料库ID；以声音参考辨认人物。参考来自目标片段之外，可能含自然附和。\n- `edit_boundaries.json`：公开拼接边界；不能让一个字幕事件跨越边界。段内时轴连续，段与段之间无语义连续性保证。\n- `tutorial.mp4`和本地手册：依据官方文档制作的5分钟讲解，包含波形图，不是软件操作实录。\n\n## 交付\n\n交 `interview.ass`、`interview.srt`、实际烧录的 `preview.mp4`、`alignment.json`、`rebuild.json`、README和离线重建脚本。完整JSON格式见 `submission_schema.json`。\n\nASS的Name字段填A/B/C/D，画面上也显示身份标签。每人的事件独立对轴；同时发言在不同固定位置显示，不得重叠遮字。字幕必须放在底部32%区域（576高画面约y=392—575），顶部68%保留原画面以供完整性检测；建议四个固定角色槽、约20px字号并合理短分句，最多每人两行，必要时用完整底部宽度。SRT每行用 `A: ...` 等前缀，按所有事件边界分割成无重叠时间单元；仍持续显示的文本可跨相邻单元保持，不视为重复说话。ASS/SRT须在相同时间显示相同角色的相同词；技术切片不能改变实际可见寿命。允许拆分、合并同一角色相邻文本组。\n\n真实重复与格式延续必须区分：同一角色再次说出与上一条完全相同的独立短句/回应时，ASS须保留两个独立事件，不能合成一次持续显示；SRT须在对应ASS边界显式开始新cue，即使文字完全相同。只有因其他角色进出而产生的持续文本技术切片才按同一次发言计算，评分器结合ASS重复事件边界核验。单个字幕内原本连续重复的词仍逐词保留。SRT cue数字编号可以不连续，但不得重复；alignment引用实际编号，不是文件内第几个cue。\n\n常规字幕0.4—6秒；自然极短回应可短于0.4秒，但仍须可读。英文每行≤42字符，每位说话人最多2行，读速≤24字符/秒；同时发言最多4名角色，字号和分区应适配原尺寸。可在自然停顿适当延展显示，但需同时满足时间误差及镜头拼接约束。\n\n`alignment.json.events` 为实际字幕事件映射：每项含 `utterance_ids`（涉及的U编号）、`speaker_id`、`start`、`end`、`ass_event_ids`、`srt_cue_ids`。ASS事件从1顺序编号，SRT使用文件cue编号，全部以字符串写入。一组稿件可对应多个事件；不得用映射JSON代替实际字幕。每个源文本组必须被映射覆盖。\n\n视频原尺寸、帧率、时长及声音不变，字幕为唯一画面新增内容。48kHz音轨；不得删词、压低别人的声音、去掉重叠、补配音、改变音速或拼接。成片可由脚本生成，不考鼠标操作。\n\n## 评分合同\n\n100分，≥80且所有硬门槛通过才通过。自动项：时间30、角色15、重叠10、文本10、格式10、格式/映射一致性10、真实重建5；视听Judge评可读性10。精确配置见 `rules.json`。\n\n硬门槛：两格式按角色token总体召回≥97%、精确≥99%，每角色召回≥95%；标注重叠词对保留≥90%，按官方重叠词对持续时间加权的同时显示召回≥85%（两cue仅碰一下不能通过）；时间质量≥0.75；格式合规比例≥95%；两格式时间语义等价≥98%；映射有效/覆盖≥98%。时间质量按真实字幕覆盖词的首尾边界：≤150ms满分，150—500ms线性降分，超过500ms零分；允许多种合理分句，不要求与私有标注唯一对应。原声归一化相关系数≥0.98，画面内容不得替换。\n\n真实视听Judge必须核验：烧录字幕确实对应提交文件；否定和数值约束未反转；短回应、重复、自我修正未被删除；身份与提供声音参考一致；重叠时可以同时读到各人内容。Judge使用原片、实际成片/声音和私有标注，而不是只读提交JSON。两次独立评分，分歧第三次仲裁；模型仍无法确定或官方标注与声音有争议时进入pending，不将不确定性强判为失败。缺真实音视频API时总分为空，不用文本模型伪造视听分数。\n\n`rebuild.json.argv` 使用 `{python}`、`{input}`、`{submission}`、`{output}`。评分器移走已有主视频后执行重建；脚本应从原输入与字幕生成到 `{output}`。不得只复制预先渲染的视频，不能运行时联网或付费调用。依赖和版本须写明，所有新文件和临时文件在D盘。\n\n## 公开真值与考试边界\n\nEasyCom publishes recordings and participant-tagged utterance transcripts. The reordered timeline and anonymous identities are local to this task. Use only the supplied candidate package in the offline test.\n\n建议统一120分钟、8核CPU/32GB RAM、可选24GB GPU和30GB D盘空间；任何预算更改需事先告知。官方人工作词标注不是零误差逐音素认证；本包未生成正式正确字幕或参考成片，也未通过solver难度校准。来源和许可见 `CREDITS.md`，仅在本地构建，不冒称已获公开再分发全部附件的许可。\n",
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
        "bytes": 6167,
        "text": "# 第12题 / Case31：四人会议字幕对轴·正式困难版\n\n看完所附 Aegisub 教程，把 `input/source.mp4` 制作为准确、可读的英文多人字幕。文字已完整提供，不要求翻译。困难在于真实重叠、短附和、重复和自我修正、数值与否定，以及在镜头切换中保持声源身份。允许使用本地脚本和对齐模型。\n\n## 输入\n\n- `source.mp4`: EasyCom Session 2, three reordered English conversation excerpts, 150.20 seconds at 25 fps. The wearable viewpoint moves with one of the four speakers. Voice identity comes from the four independent references. `original.wav` contains the actual video audio.\n- `transcript.txt`：完整逐词稿，文本组Uxxx的排列经过固定随机打乱，**编号和出现顺序均不代表时间或人物**。文本组是检索单位，不是必须采用的字幕分句。保留重复、口头词和未完成词；可改标点、大小写，但不得润色成与原声不同的句子。\n- `speakers.json`及4组头像/声音：A/B/C/D是本题身份，不是原始语料库ID；以声音参考辨认人物。参考来自目标片段之外，可能含自然附和。\n- `edit_boundaries.json`：公开拼接边界；不能让一个字幕事件跨越边界。段内时轴连续，段与段之间无语义连续性保证。\n- `tutorial.mp4`和本地手册：依据官方文档制作的5分钟讲解，包含波形图，不是软件操作实录。\n\n## 交付\n\n交 `interview.ass`、`interview.srt`、实际烧录的 `preview.mp4`、`alignment.json`、`rebuild.json`、README和离线重建脚本。完整JSON格式见 `submission_schema.json`。\n\nASS的Name字段填A/B/C/D，画面上也显示身份标签。每人的事件独立对轴；同时发言在不同固定位置显示，不得重叠遮字。字幕必须放在底部32%区域（576高画面约y=392—575），顶部68%保留原画面以供完整性检测；建议四个固定角色槽、约20px字号并合理短分句，最多每人两行，必要时用完整底部宽度。SRT每行用 `A: ...` 等前缀，按所有事件边界分割成无重叠时间单元；仍持续显示的文本可跨相邻单元保持，不视为重复说话。ASS/SRT须在相同时间显示相同角色的相同词；技术切片不能改变实际可见寿命。允许拆分、合并同一角色相邻文本组。\n\n真实重复与格式延续必须区分：同一角色再次说出与上一条完全相同的独立短句/回应时，ASS须保留两个独立事件，不能合成一次持续显示；SRT须在对应ASS边界显式开始新cue，即使文字完全相同。只有因其他角色进出而产生的持续文本技术切片才按同一次发言计算，评分器结合ASS重复事件边界核验。单个字幕内原本连续重复的词仍逐词保留。SRT cue数字编号可以不连续，但不得重复；alignment引用实际编号，不是文件内第几个cue。\n\n常规字幕0.4—6秒；自然极短回应可短于0.4秒，但仍须可读。英文每行≤42字符，每位说话人最多2行，读速≤24字符/秒；同时发言最多4名角色，字号和分区应适配原尺寸。可在自然停顿适当延展显示，但需同时满足时间误差及镜头拼接约束。\n\n`alignment.json.events` 为实际字幕事件映射：每项含 `utterance_ids`（涉及的U编号）、`speaker_id`、`start`、`end`、`ass_event_ids`、`srt_cue_ids`。ASS事件从1顺序编号，SRT使用文件cue编号，全部以字符串写入。一组稿件可对应多个事件；不得用映射JSON代替实际字幕。每个源文本组必须被映射覆盖。\n\n视频原尺寸、帧率、时长及声音不变，字幕为唯一画面新增内容。48kHz音轨；不得删词、压低别人的声音、去掉重叠、补配音、改变音速或拼接。成片可由脚本生成，不考鼠标操作。\n\n## 评分合同\n\n100分，≥80且所有硬门槛通过才通过。自动项：时间30、角色15、重叠10、文本10、格式10、格式/映射一致性10、真实重建5；视听Judge评可读性10。精确配置见 `rules.json`。\n\n硬门槛：两格式按角色token总体召回≥97%、精确≥99%，每角色召回≥95%；标注重叠词对保留≥90%，按官方重叠词对持续时间加权的同时显示召回≥85%（两cue仅碰一下不能通过）；时间质量≥0.75；格式合规比例≥95%；两格式时间语义等价≥98%；映射有效/覆盖≥98%。时间质量按真实字幕覆盖词的首尾边界：≤150ms满分，150—500ms线性降分，超过500ms零分；允许多种合理分句，不要求与私有标注唯一对应。原声归一化相关系数≥0.98，画面内容不得替换。\n\n真实视听Judge必须核验：烧录字幕确实对应提交文件；否定和数值约束未反转；短回应、重复、自我修正未被删除；身份与提供声音参考一致；重叠时可以同时读到各人内容。Judge使用原片、实际成片/声音和私有标注，而不是只读提交JSON。两次独立评分，分歧第三次仲裁；模型仍无法确定或官方标注与声音有争议时进入pending，不将不确定性强判为失败。缺真实音视频API时总分为空，不用文本模型伪造视听分数。\n\n`rebuild.json.argv` 使用 `{python}`、`{input}`、`{submission}`、`{output}`。评分器移走已有主视频后执行重建；脚本应从原输入与字幕生成到 `{output}`。不得只复制预先渲染的视频，不能运行时联网或付费调用。依赖和版本须写明，所有新文件和临时文件在D盘。\n\n## 公开真值与考试边界\n\nEasyCom publishes recordings and participant-tagged utterance transcripts. The reordered timeline and anonymous identities are local to this task. Use only the supplied candidate package in the offline test.\n\n建议统一120分钟、8核CPU/32GB RAM、可选24GB GPU和30GB D盘空间；任何预算更改需事先告知。官方人工作词标注不是零误差逐音素认证；本包未生成正式正确字幕或参考成片，也未通过solver难度校准。来源和许可见 `CREDITS.md`，仅在本地构建，不冒称已获公开再分发全部附件的许可。\n"
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
        "text": "[\n  {\n    \"file\": \"CREDITS.md\",\n    \"bytes\": 227,\n    \"sha256\": \"8ff0f77d94987a7cd606d32f1b2f564cd95f9123c0817fedb0f7c3e7ace28608\"\n  },\n  {\n    \"file\": \"README.md\",\n    \"bytes\": 170,\n    \"sha256\": \"d4db3e23240c61f64f9742abfd0441c8ef44cf2d8efa4609a0ac9287982dd3ac\"\n  },\n  {\n    \"file\": \"TASK.md\",\n    \"bytes\": 6167,\n    \"sha256\": \"572f5a3ae0386e2d4f321f73876cf6e42182e25dfe19c8b9b04cb1066114c951\"\n  },\n  {\n    \"file\": \"input/aegisub_manual.html\",\n    \"bytes\": 38306,\n    \"sha256\": \"9a011fa10207c7f96954bb542ad3f3a6a5427a5e126ac211733ae02830423daf\"\n  },\n  {\n    \"file\": \"input/edit_boundaries.json\",\n    \"bytes\": 124,\n    \"sha256\": \"508b933b636b4829f4f65d112fd482f7ebe96a3241537c81931024118eef0bad\"\n  },\n  {\n    \"file\": \"input/original.wav\",\n    \"bytes\": 28856398,\n    \"sha256\": \"953625282988b7cfaac10a3486262037dd865b28cd9cd62e7f2e2ee6574d268a\"\n  },\n  {\n    \"file\": \"input/source.mp4\",\n    \"bytes\": 76771582,\n    \"sha256\": \"3bfd5d66aedd3fad66f2b6b8bb509cfb60f3579a6135eafc4fa664e5cba9bcfe\"\n  },\n  {\n    \"file\": \"input/speaker_A.jpg\",\n    \"bytes\": 10050,\n    \"sha256\": \"6b4f44b401ee839643d392651de6e5669d534a107567c509d3025da336585481\"\n  },\n  {\n    \"file\": \"input/speaker_A.wav\",\n    \"bytes\": 128078,\n    \"sha256\": \"f048cd7e293e19eda0c49ea5360cab0ebc66e9102e76b17aa2447d2cc8408892\"\n  },\n  {\n    \"file\": \"input/speaker_B.jpg\",\n    \"bytes\": 9741,\n    \"sha256\": \"cb9714fa790991c40e31e03368ce70e935a74a04c338ef96d17eccfb4d2a644c\"\n  },\n  {\n    \"file\": \"input/speaker_B.wav\",\n    \"bytes\": 128078,\n    \"sha256\": \"f1a970a2f5e4d2ce764de10cfa857d4132574527807a856c2301cedf1801396d\"\n  },\n  {\n    \"file\": \"input/speaker_C.jpg\",\n    \"bytes\": 9092,\n    \"sha256\": \"d4ff57de1e2acedfbd92eb1543726561074ff14daa0c08079008d0752c1eb555\"\n  },\n  {\n    \"file\": \"input/speaker_C.wav\",\n    \"bytes\": 128078,\n    \"sha256\": \"20c9093c71f90f1ed3f28cf805d67ff13e4411edeb2d3943bc2501956cec0f10\"\n  },\n  {\n    \"file\": \"input/speaker_D.jpg\",\n    \"bytes\": 4785,\n    \"sha256\": \"62099c921be11cbfbadb8dfd73e892f9e21fad7f5c1c7c1ba08acf31d24176aa\"\n  },\n  {\n    \"file\": \"input/speaker_D.wav\",\n    \"bytes\": 128078,\n    \"sha256\": \"2bf4f72948e6bd9c326f5b2fc3a0ae27df1539dee1eff50ea8c05bc4196058ce\"\n  },\n  {\n    \"file\": \"input/speakers.json\",\n    \"bytes\": 787,\n    \"sha256\": \"31758d3159ed8529b3bf838c9beea823f5b5533b659acccf948183f8f9245fe6\"\n  },\n  {\n    \"file\": \"input/transcript.txt\",\n    \"bytes\": 2607,\n    \"sha256\": \"7e068804c025854d2c9b7a7736c818a1f497618b2e7ede97a850a75b56dc9de0\"\n  },\n  {\n    \"file\": \"input/tutorial.mp4\",\n    \"bytes\": 2179359,\n    \"sha256\": \"7dff1b88fbed5d6252d3955ce3cdf4053cb3eb093ec2b0d161e53abc488c938d\"\n  },\n  {\n    \"file\": \"rules.json\",\n    \"bytes\": 2081,\n    \"sha256\": \"6218c914035a86beecf2e9ba4e581ecc11a56e989ff9678fe4b525d598743cef\"\n  },\n  {\n    \"file\": \"submission_schema.json\",\n    \"bytes\": 1886,\n    \"sha256\": \"45c08788640f69485e7d4fd9cac4e185d04db93edae1c110f962df2caeca4d7a\"\n  },\n  {\n    \"file\": \"tools/media.py\",\n    \"bytes\": 3278,\n    \"sha256\": \"edbb9610c99d37a0f9a3187a06e65c97eb6680bde42ee14c165e864265b46423\"\n  },\n  {\n    \"file\": \"tools/tts.py\",\n    \"bytes\": 1922,\n    \"sha256\": \"3b23c39b9d52b6459291580f087e72fb9d3bfdd301e198b9dd3733674ee005fc\"\n  }\n]\n"
      },
      {
        "name": "rules.json",
        "path": "rules.json",
        "url": "variant-results/case-31/candidate/rules.json",
        "kind": "document",
        "bytes": 2081,
        "text": "{\n  \"main_output\": \"preview.mp4\",\n  \"required_files\": [\n    \"preview.mp4\",\n    \"interview.ass\",\n    \"interview.srt\",\n    \"alignment.json\",\n    \"rebuild.json\",\n    \"README.md\"\n  ],\n  \"auto_weights\": {\n    \"timing\": 30,\n    \"speakers\": 15,\n    \"overlap\": 10,\n    \"text\": 10,\n    \"format\": 10,\n    \"consistency\": 10,\n    \"rebuild\": 5\n  },\n  \"judge_weights\": {\n    \"readability\": 10\n  },\n  \"fact_weight\": 0,\n  \"judge_criteria\": {\n    \"readability\": \"Watch actual burned subtitle preview while hearing source: speakers, overlapping layout, corrections and reading are clear. Compare rendered content to submitted subtitle events.\"\n  },\n  \"judge_gates\": {\n    \"critical_content\": \"Use private critical_units and speaker/word references plus actual audiovisual input. No reversal or omission of negation, numerical constraints, repeated repairs or speaker identity. Do not mark official annotation disputes as candidate failure.\",\n    \"actual_preview\": \"Output really displays submitted subtitles, not missing/wrong text or labels.\",\n    \"source_audio\": \"Original dialogue and other speakers preserved, no muting/cuts.\"\n  },\n  \"case_number\": 12,\n  \"original_case_id\": 31,\n  \"version\": \"2.0-hard\",\n  \"task_summary\": \"真实四人会议困难字幕对轴：三段重排、随机角色身份、无序逐字稿；保留重叠、修正、否定与数字并交付等价双格式和烧录预览。\",\n  \"passing_score\": 80,\n  \"scoring_status\": \"experimental_source_grounded\",\n  \"rebuild_timeout\": 600,\n  \"hard_thresholds\": {\n    \"token_recall\": 0.97,\n    \"token_precision\": 0.99,\n    \"overlap\": 0.9,\n    \"overlap_duration_recall\": 0.85,\n    \"min_speaker_recall\": 0.95,\n    \"timing_score\": 0.75,\n    \"format_fraction\": 0.95,\n    \"format_equivalence\": 0.98\n  },\n  \"repeat_contract\": \"Distinct repeated identical utterances require separate ASS events and explicit SRT cues at the same boundary. Cross-speaker technical continuation slices are deduplicated using ASS repetition boundaries. SRT numeric IDs may be nonconsecutive but must be unique.\"\n}"
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
    "models": {},
    "result_status": "素材已更换，新答卷评测中"
  }
};
