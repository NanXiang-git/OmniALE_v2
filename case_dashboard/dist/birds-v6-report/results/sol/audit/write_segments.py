import json
from pathlib import Path
R=Path('/workspace/submission')
plan=json.loads((R/'narration_timing.json').read_text())
chapters=json.loads(Path('/candidate/chapters.json').read_text())['segments']
def e(a,b,d):return {'start':a,'end':b,'description':d}
def source(u,s):return {'url':u,'supports':s}
info=[
 {'chinese_name':'宽尾树莺','english_name':"Cetti's Warbler",'scientific_name':'Cettia cetti','confidence':88,
  'visual_evidence':[e(1,3,'近距离侧面可见暖棕褐色上体、灰褐色喉胸、浅色喉部与淡眼弧；细喙、短圆的收拢翅及较长的宽尾。'),e(11,16,'眼前个体由人的手指托持，画面主要是静态的形态展示；未见可供核验发声同步的开口动作。')],
  'audio_evidence':[e(0.8,4.1,'采样声谱见约2—3千赫的短声单元间歇重复，夹有宽频成分。只能说明原音轨含重复短叫，不能据静态近景逐声归属。'),e(18.2,25.0,'声谱出现较高频、约5—7千赫的重复声单元，与前面的低频短声结构不同。未将这种频率变化解释为画面中个体正在换一种叫法。')],
  'original_sound_windows':[{'start':0.2,'end':4.2},{'start':18.0,'end':25.0},{'start':42.4,'end':45.8}],
  'sources':[source('https://www.oiseaux.net/birds/cetti.s.warbler.html','独立物种条目：中文名“宽尾树莺”、暖棕上体、灰色喉胸、短初级飞羽突出、宽尾及叫声多样；用于形态核对。'),source('https://www.rspb.org.uk/birds-and-wildlife/cettis-warbler','短翅、圆尾、隐蔽活动及爆发式鸣唱是该种特征；仅作一般鉴别资料，未把鸣唱行为强加给静态画面。'),source('https://xeno-canto.org/161967/download','成功下载另一份独立的宽尾树莺报警声参考；仅手工查看声谱，了解其快速重复声结构，不用于原素材匹配或混音。')],
  'identification_notes':'主要依赖画面形态；原音轨有多种声单元，无法保证均来自画面中的个体。'},
 {'chinese_name':'新疆歌鸲（夜莺，暂定）','english_name':'Common Nightingale (tentative)','scientific_name':'Luscinia megarhynchos','confidence':83,
  'visual_evidence':[e(47,52,'画面是浓密灌丛和交错枝条，未取得可清楚辨别鸟体羽色的视野。'),e(63,68,'镜头仍朝向同一片灌丛，无法核验具体个体的张嘴或运动，未推断其性别、巢位或受惊原因。')],
  'audio_evidence':[e(52.0,59.0,'采样声谱约3千赫附近出现形状相近的短音单元，约每半秒至一秒重复，起部较宽、后部收窄；与独立夜莺报警叫声参考的短、重复结构相符。'),e(65.3,67.0,'重复短声再次出现；画外还存在较高的细窄声线，不能保证全部属于同一种鸟。称“更像警戒叫”为声音类型推断，不表示观察到了威胁或报警原因。')],
  'original_sound_windows':[{'start':46.3,'end':49.6},{'start':56.5,'end':61.5},{'start':70.1,'end':72.5}],
  'sources':[source('https://www.oiseaux.net/birds/common.nightingale.html','确认Common Nightingale的中文名“新疆歌鸲”、学名及隐蔽于浓密植被的习性；条目提供独立叫声分类。'),source('https://xeno-canto.org/138170/download','成功下载Fernand Deroussen的独立夜莺报警叫声参考，手工比较短声句的包络与频率轮廓；未做音频指纹或来源追溯。'),source('https://www.rspb.org.uk/birds-and-wildlife/nightingale','物种体色与复杂鸣唱的一般资料，辅助区分短促叫声和完整鸣唱，不作为本段可见羽色的证据。')],
  'identification_notes':'单一暂定识别已在实际旁白中明确说明；鸟体不可见，声音归属和功能的判断有局限。'},
 {'chinese_name':'桤木纹霸鹟','english_name':'Alder Flycatcher','scientific_name':'Empidonax alnorum','confidence':96,
  'visual_evidence':[e(73.8,80.0,'枝上小型霸鹟，灰橄榄色头背、浅白喉、淡色腹部、两条浅色翼斑，淡眼圈不很醒目，下喙较浅。'),e(76.35,77.15,'逐帧可见由平视转为仰头、喙略开，随后低头；与附近短促声句时间相邻。'),e(93.5,94.7,'仍在同一枝条上，短暂抬头开喙；未见飞出捕虫，故旁白没有宣称已经捕获昆虫。')],
  'audio_evidence':[e(76.65,77.22,'声谱为短促的较宽频起音、随后较强的弯曲音节，尾部快速下降；画面仰头开喙提供发声归属的支持。'),e(88.6,89.6,'相似结构的沙哑短声句再次出现。与独立桤木纹霸鹟参考声谱及其fee-bee-o声型文字描述相符；同时参考柳纹霸鹟及林霸鹟资料避免仅靠相似羽色确定种。')],
  'original_sound_windows':[{'start':73.1,'end':77.4},{'start':86.5,'end':90.4}],
  'sources':[source('https://www.audubon.org/field-guide/bird/alder-flycatcher','灰绿上体、白喉、淡眼圈，大嘴；与柳纹霸鹟外观近似，声音尤其重要；典型声句为带沙哑音的fee-bee-o。'),source('https://www.audubon.org/field-guide/bird/willow-flycatcher','柳纹霸鹟外形相似，典型fitz-bew声句用于排除仅凭外形武断识别。'),source('https://www.oiseaux.net/birds/alder.flycatcher.html','学名和中文别名核对：桤木/赤杨对应Alder；该条目也列出独立参考录音。'),source('https://xeno-canto.org/13755/download','成功下载Andrew Spencer的独立桤木纹霸鹟鸣唱参考，手工比较声句形状与下降尾音，不作原片声源匹配。')],
  'identification_notes':'形态和声谱相互支持；发声时的抬头张喙也可见。中文“桤木纹霸鹟”作为单一物种名实际念出。'},
 {'chinese_name':'长嘴沼泽鹪鹩（暂定）','english_name':'Marsh Wren (tentative)','scientific_name':'Cistothorus palustris','confidence':74,
  'visual_evidence':[e(101.1,105.0,'水生植物密集，镜头移动并明显失焦；没有足够清楚的鸟体羽色证据。'),e(107.2,119.2,'仅有茎叶间模糊、被遮的局部轮廓；无法可靠确认眉纹、背部纹路或具体身体动作，旁白已保守说明。')],
  'audio_evidence':[e(101.3,104.5,'声谱有约2—6千赫的多种短音，部分窄带、部分较宽，反复起落。'),e(110.0,116.5,'短音与密集颤动、较宽频的声簇交替，符合沼泽鹪鹩类液态短音接急促颤声的声型；与一份独立Marsh Wren参考手工比较，但因无直接听音且视野差，保留暂定。')],
  'original_sound_windows':[{'start':101.1,'end':104.6},{'start':109.1,'end':111.6},{'start':120.7,'end':123.6}],
  'sources':[source('https://www.audubon.org/field-guide/bird/marsh-wren','沼泽密植被环境、隐蔽活动及液态音转机械颤声的声型；不能据资料宣称画面已显示翘尾或造巢。'),source('https://www.oiseaux.net/birds/marsh.wren.html','核对中文名“长嘴沼泽鹪鹩”、英文名及拉丁名，取得独立参考录音目录。'),source('https://xeno-canto.org/14862/download','成功下载Andrew Spencer的独立Marsh Wren鸣唱参考，查看短音和颤音声簇的声谱结构；未用于混音。')],
  'identification_notes':'受失焦和遮挡限制，主要依据声音结构与植被环境作单一暂定判断；实际旁白中有“暂按”限定，不枚举候选。'},
 {'chinese_name':'黑脚信天翁','english_name':'Black-footed Albatross','scientific_name':'Phoebastria nigripes','confidence':99,
  'visual_evidence':[e(124.8,133.5,'雏鸟通体褐色绒羽，深色钩形喙，张嘴并伸长颈部；不能只靠绒羽区分所有信天翁雏鸟，需结合后面成鸟。'),e(138.5,146.8,'同场成鸟通体深褐色，嘴基周围较浅；与旁边雏鸟接近，雏鸟将嘴伸向成鸟。'),e(148.0,155.5,'成鸟俯头，双方喙部紧密接触，呈亲鸟反刍喂食常见姿势；未能看清具体食物或转移的量，旁白没有凭空指认食物种类。')],
  'audio_evidence':[e(132.3,137.9,'原声有较低的谐波声段及较高的细窄音线，局部伴有短促脉冲；附近有多只鸟，无法把所有背景声都归给雏鸟。'),e(141.0,146.5,'声谱仍见不同音高的短声，画中成鸟与雏鸟互动；此处未宣称某一种叫声必然导致喂食，也未配造鸟叫。')],
  'original_sound_windows':[{'start':124.3,'end':126.9},{'start':132.3,'end':137.9},{'start':156.0,'end':158.2}],
  'sources':[source('https://www.audubon.org/field-guide/bird/black-footed-albatross','成鸟深褐色、嘴基有白色、嘴足深色；双亲以反刍方式喂养雏鸟。用于形态与喂食姿势解释。')],
  'identification_notes':'种的确定主要由同场成鸟的全深褐羽色及浅嘴基支持；未仅凭雏鸟绒羽给种名。'},
 {'chinese_name':'黑背信天翁','english_name':'Laysan Albatross','scientific_name':'Phoebastria immutabilis','confidence':99,
  'visual_evidence':[e(159.0,166.5,'白色头颈和腹部、黑褐色背与上翼，眼周有深色区域；前景两只成鸟相对。'),e(168.5,179.5,'相向的个体先后摆头、低头、将喙靠近或相触，动作反复，符合该种展示动作。'),e(180.5,184.8,'一只伸颈张嘴，另一只调整朝向；群落内还有其他个体，不据此判断性别或断定已组成繁殖配对。')],
  'audio_evidence':[e(168.0,171.5,'声谱可见谐波密集的有声段与短促脉冲段交替，邻近画面有伸颈张喙及近距离喙部互动；支持鸣声和喙击声的类型判断。'),e(180.5,184.8,'有声段与急促脉冲仍出现；背景也有其他鸟，不能将每个声响严格指派给前景某一个体。')],
  'original_sound_windows':[{'start':158.8,'end':161.5},{'start':168.0,'end':171.5}],
  'sources':[source('https://animaldiversity.org/accounts/Phoebastria_immutabilis/','背翼黑褐色、与全深色黑脚信天翁的区别；复杂求偶展示含触喙、摆姿势、朝天伸喙和鸣叫，交流兼具视觉、触觉和声音。')],
  'identification_notes':'黑白羽色和眼周暗色特征清楚；将相互配合的姿态解释为求偶展示，不推断个体性别。'}
]
for ch,inf in zip(chapters,info):
 inf.update(ch)
 if ch['segment']==6:
  inf['provided_chapter_end']=ch['end'];inf['end']=185.5
 inf['narration']=[{'start':x['start'],'end':x['end'],'text':x['text']} for x in plan if x['segment']==ch['segment']]
result={
'audio_analysis_method':'没有原生听音工具，未亲耳试听输入、独立参考或合成旁白。实际用ffmpeg解码原声为48 kHz立体声PCM，读取采样、计算峰值和RMS；为观察原声结构，立体声求均值并重采样至16 kHz，用SciPy STFT（512点窗、448点重叠）生成0—7 kHz声谱，另以1024点窗查看局部。人工查看声谱、代表帧、逐帧开喙/抬头动作，并手工比较允许的独立参考声谱。没有使用ASR、鸟声识别模型、其他识别模型、子代理、反向搜图或音视频指纹。声谱能支持重复节奏、音长、频率和宽窄带结构，不能等同主观听感或可靠地逐声判断画外来源。物种及声音功能的不足分别在段内说明。配音用edge-tts 7.3.1的zh-CN-XiaoxiaoNeural生成原创文字；仅发送文字，未上传输入音视频。旁白自然度没有人工听审，采用稳定音色和轻度原生语速设置，并检查波形、时长、峰值和服务返回的词级时间戳。',
'duration':185.5,'timebase':'完整成片秒数；画面30 fps，共5565帧；前五个章界保持所给chapters.json，末尾按完整输入最后一帧延至185.500秒（与输入容器时长差约4毫秒）。',
'segments':info}
(R/'segments.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print('segments.json saved')
