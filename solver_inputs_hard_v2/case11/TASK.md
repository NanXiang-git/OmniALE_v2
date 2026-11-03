# 第11题 / Case23 · 正式困难版：双头注意力课程无障碍改版

把旧版音频描述修订为新版180秒课程可用的中文描述，交付真实可听、可开关描述、可导航、可离线重建的成片。听者应能追踪同字不同词元、两个注意力头及其变化，并区分局部结论与最终融合结论。只写脚本或JSON不算完成。

## 输入

`input/source.mp4`为新版，`old_course.mp4`为旧版；二者使用相同教师音轨。`old_ad.wav/vtt`为旧版描述（8条），不是新版答案。提供教师稿/真实语音区间、对象词典、TTS中性试音。新版具体权重、查询和屏蔽状态只出现在实际视频，不另给状态表。图示是根据公开attention资料自主制作的受控教学输入，非下载的原课程录像；教师与旧描述为系统合成声音。数学数据只用于教学，不要求训练模型或推断真实模型机制。

## 必须解决的改版关系

同字对象须能区分，身份不能由屏幕位置推断；每个头独立归一化。分别说明对象/面板布局变化、各头权重关系是否变化、查询切换、局部屏蔽的范围以及融合的结果。对听者不可仅说“左边这个”“上面那个”“她变了”。无需朗读全部数值，但不能省略关系、作用范围和造成的结论变化。描述不能机械重念教师，也不能把尚未发生的状态说成已发生。

## 时间和媒体硬约束

- 源片所有帧按原顺序全帧保留，1280×720、25fps，不裁剪、不倍速、不替换。description.vtt仅作外挂字幕，不得烧录或遮挡图示；程序使用全帧缩略比较核验画面保留。只允许源时间62、96、154秒插入hold，单次≤6秒，合计≤18秒；hold显示锚点前最后一帧，不提前显示下阶段。禁止用额外长停顿规避口述信息组织。
- 保护完整教师语音；新描述侵入保护区间累计≤200ms，并须实际听清。不可删除、压低教师声音隐藏冲突。每条描述WAV的真实发声在VTT区间内，不以尾部静音伪造合规。
- 导航源锚点固定0、30、62、96、126、154秒，准确迁移到输出时间轴。关闭描述只关闭独立AD轨，hold与视频共同时间轴不变。

## 交付合同

`accessible_course.mp4`、`mix.wav`、`base_track.wav`、`ad_track.wav`、`description.vtt`、逐条描述WAV、`description_plan.json`、`timeline.json`、`chapters.json`、`player_config.json`、`revision_audit.json`、`rebuild.json`、README及必要脚本。WAV为48kHz真实PCM。

`description_plan.cues`逐条填唯一id、实际start/end、wav相对路径；description_plan与description.vtt按顺序逐条一一对应，起止时间各自容差≤80ms；VTT和实际音频一致。`timeline.segments`连续覆盖完整源片和输出，kind为source或hold，source项填source_start/end，hold填anchor_source_time，各项填output_start/end。`chapters.chapters`填title、source_time、output_time。详见schema。

`revision_audit.items`对旧VTT第1—8条各列一次：old_cue_id、action（keep/rewrite/delete/merge）、new_cue_ids、reason。除delete外至少引用一个真实description_plan cue id；允许多条旧描述合并到同一新cue。说明修订理由而非只打标签。允许合理重组，无固定标准脚本。审核表不替代实际描述。

`player_config.pause_policy`为fixed_timeline；tracks包含video/base/description。使用附带player.html或等效播放器：视频自身混音静音，分别播放base与AD，避免成片声音重复。`base_track`仅保留迁移后的原教师，hold静音；mix必须等于base与AD逐样本叠加；程序转换为16kHz单声道后检验相对波形误差≤0.02、长度误差<80ms。成片声轨须与mix一致，不得单独调整成片增益。

`rebuild.argv`使用{python}/{input}/{submission}/{output}占位符。重建必须从输入和提交素材生成主成片，不得复制已有成片；不得联网、重新调用付费TTS。依赖及固定版本写在README。

## 测评

100分，≥80且全部硬门槛通过。自动40分：调度10、导航15、文件/音轨一致性5、重建5、旧描述修订映射5。实际音视频LLM Judge60分：动态指代20、可听性10、私有事实30。核心关系遗漏/反转、错对象或错头、错误屏蔽范围、静音占位、篡改源片、错误时间轴、教师不可听均不通过。规则精确定义见rules.json。

Judge读取源片、真实描述/成片以及私有事实，不能仅相信自报JSON。等价表达可接受，不强制复读所有小数；先建立清楚身份后可用自然简称。两次独立判断，分歧第三次仲裁；无法确认标pending。缺少音视频API或未做重建时不输出完整总分。API配置及运行说明由主办方题包提供，考生不接触私有评分材料。

## 执行边界

仅向考生发布candidate目录。允许本地脚本、合法TTS/字幕工具；禁止访问evaluator、authoring、其他题私有标注、题库现成答案。所有新文件/缓存/临时文件在D盘。建议150分钟、8核CPU/32GB RAM、可选24GB GPU、30GB可用工作盘。不得改输入；输出独立submission目录。主办方若改变预算应提前公布。本题尚未经过真实solver或专家校准，不宣称对特定模型不可解。
