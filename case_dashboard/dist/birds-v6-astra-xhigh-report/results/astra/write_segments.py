"""Write the evidence report using actual generated-speech timings."""
import json,time
from pathlib import Path
from audit import record

st=time.time();root=Path('/workspace/submission')
chapters=json.load(open('/candidate/chapters.json'))['segments']
actual=json.load(open('/workspace/scratch/actual_narration.json'))

def evidence(a,b,text):return dict(start=a,end=b,description=text)
def source(url,text):return dict(url=url,supports=text)
def windows(*pairs):return [dict(start=a,end=b) for a,b in pairs]

data={
 'audio_analysis_method': '没有原生听音工具，未声称亲耳听过输入或合成语音。实际用 ffmpeg 将原始 AAC 解码为48 kHz双声道PCM，在本地读取全部采样，以 scipy.signal.stft 绘制全章和局部声谱（1024采样Hann窗、128采样步长），结合声峰与逐帧张嘴动作核验。人工查看独立参考录音的声谱辅助排除近似种，不使用识别模型、子代理、反向搜索或音频指纹寻源。声谱可以支持频段、节奏、重复与谐波结构；音色词是基于这些结构的有限解释，不能替代实际听感判断。合成语音仅发送自撰文字，采用 zh-CN-XiaoxiaoNeural；检验了采样、时长、服务返回的字词时间、响度和峰值，但无法直接试听韵律及逐字发音。',
 'timeline': {'source_container_duration':185.504,'output_duration':185.466667,'fps':30,'audio_sample_rate':48000,'note':'原视频按原时间戳完整转换为30fps；保留原有静态画面。没有剪掉、变速或重排章节。'},
 'segments':[]
}

details=[
dict(chinese_name='新疆歌鸲（夜莺；暂定）',english_name='Common Nightingale',scientific_name='Luscinia megarhynchos',confidence=76,
 visual_evidence=[
 evidence(0,46.066667,'原画面为基本不变的手持鸟体近照：上体暖棕褐色，下体较浅，喉部灰白；喙细长深色，眼周有细淡环，未见醒目的长眉纹或翼斑，尾羽较长。该组合支持夜莺，但照片色彩及单一角度限制了近似种的排除。'),
 evidence(5.5,38.7,'分时取帧中没有可核实的连续张嘴、觅食或飞行动作；不把配图与原声视为已确认的同一个体。')],
 audio_evidence=[
 evidence(.5,5.1,'约2.5–3 kHz的短音以约半秒量级间隔重复，并有较高谐波；可概括为短哨音。'),
 evidence(18,25,'约6 kHz附近较宽的短声团连续重复，与前面的较低短音结构不同。原声中至少有两类声型，和独立资料所述夜莺哨音与较粗叫声的组合相符；不是对捕捉、警戒原因或个体身份的证明。')],
 original_sound_windows=windows((0,5.8),(18.2,26.6),(32.3,35.7),(41.8,45.9)),
 sources=[source('https://www.rspb.org.uk/birds-and-wildlife/nightingale','夜莺体羽棕褐、下体较浅，尾较宽；隐蔽性强。用于形态辅助判断，没有据此推断拍摄地点。'),source('https://www.oiseaux-birds.com/card-common-nightingale.html','夜莺的细白眼圈、暖棕上体、浅喉及叫声中哨音和粗糙声型的描述；一般资料并不证明本片每声都由同一种鸟发出。')]),
dict(chinese_name='新疆歌鸲（夜莺；暂定）',english_name='Common Nightingale',scientific_name='Luscinia megarhynchos',confidence=65,
 visual_evidence=[evidence(46.066667,72.8,'画面显示密集灌木、叶片和交错细枝。检查47至71秒的多帧后，未获得足以辨认眼圈、尾色或喙形的清晰鸟体，也没有确定的张嘴同步。灌丛环境只能作弱支持。')],
 audio_evidence=[evidence(46.4,49.5,'约3 kHz的重复短音与向上扫频的较快高频音节重叠；不能把叠加声部都指定给一个个体。'),evidence(52,59.5,'较低短哨音呈重复序列，间有高频声段；65至67秒又出现同类声型。结合夜莺叫声的独立描述作单一暂定识别，置信度受缺乏清晰鸟体及无法试听限制。')],
 original_sound_windows=windows((46.3,49.7),(60.7,63.7),(69.1,72.6)),
 sources=[source('https://www.rspb.org.uk/birds-and-wildlife/nightingale','夜莺习于隐蔽的灌丛与林缘，单凭此环境不能确诊。'),source('https://www.oiseaux-birds.com/card-common-nightingale.html','夜莺叫声包括whistled wiiit、wiiit-krrr和较粗声型；用于解释本片重复短音的单一暂定识别，不证明警戒、求偶或任何因果关系。')]),
dict(chinese_name='柳纹霸鹟（暂定）',english_name='Willow Flycatcher',scientific_name='Empidonax traillii',confidence=73,
 visual_evidence=[evidence(76.1,96.3,'小型霸鹟状鸟直立停在裸露斜枝上，上体灰褐偏橄榄，喉胸浅淡，腹部略黄；翅上浅色横斑，下喙较浅，眼圈细而不醒目。形态支持纹霸鹟属，但近似种之间不能仅靠外形可靠区分。'),evidence(76.7,77.45,'76.85秒附近抬头并张嘴，随后闭嘴转头；81.1秒附近也见张嘴。全章主要为停栖与转头，未观察到成功捕虫。')],
 audio_evidence=[evidence(76.85,77.25,'短促宽频声段后有上升再下降的频率轮廓，主要能量约2–5 kHz，与张嘴时间接近。'),evidence(81,81.4,'另一短促声段与张嘴接近，支持正在发声。结合偏弱眼圈及简短鸣句，暂定柳纹霸鹟；与独立柳纹、赤杨纹及绿纹霸鹟参考声谱作过人工比较，但不声称实现可靠听觉确诊。其余细碎声部可能来自背景鸟。')],
 original_sound_windows=windows((72.9,77.7),(89.3,93.7),(98.5,100.6)),
 sources=[source('https://www.audubon.org/field-guide/bird/willow-flycatcher','柳纹霸鹟往往较褐、眼圈较弱，与赤杨纹霸鹟外形很相近，声音对鉴别重要；其fitz-bew/pit-speer鸣句的文字描述。'),source('https://www.bird-sounds.net/willow-flycatcher/','物种名称及独立参考录音链接。'),source('https://www.bird-sounds.net/birdmedia/775/willow-flycatcher-call-song-1391.mp3','实际下载并本地读取，人工检查声谱的短句结构；不把参考声加入最终视频。'),source('https://www.bird-sounds.net/birdmedia/235/alder-flycatcher-call-song-855.mp3','实际读取近似种赤杨纹霸鹟参考声谱作比较；该比较未消除全部不确定性。')]),
dict(chinese_name='长嘴沼泽鹪鹩（暂定）',english_name='Marsh Wren',scientific_name='Cistothorus palustris',confidence=60,
 visual_evidence=[evidence(100.766667,123.966667,'镜头主要由密集芦苇和失焦植物遮挡。逐段取帧未获得可确认的完整鸟体、眉纹或背部条纹；不声称看见攀爬、筑巢或张嘴。')],
 audio_evidence=[evidence(105,112,'声谱中短促上、下扫频与较密集的短时间声纹交错，主要鸟声结构在2–7 kHz；呈短句和快速变化的声段，可谨慎描述为鸣声与颤音。'),evidence(114,122,'后半章仍有相近的短句和宽频声段。结合苇丛环境及独立资料描述的短促、机械颤鸣，作长嘴沼泽鹪鹩的单一暂定识别；无法确认发声个体，不能排除其他苇丛鸣禽。')],
 original_sound_windows=windows((100.9,104.7),(109.6,111.65)),
 sources=[source('https://www.audubon.org/field-guide/bird/marsh-wren','长嘴沼泽鹪鹩生活于湿地植被；鸣唱被描述为咕噜般的短句接机械颤鸣。其眉纹、背纹仅为参考特征，本片未看见，不列为已观察证据。')]),
dict(chinese_name='黑脚信天翁',english_name='Black-footed Albatross',scientific_name='Phoebastria nigripes',confidence=99,
 visual_evidence=[evidence(127,132,'前景幼鸟有蓬松褐色绒羽，可见张嘴。'),evidence(133,145,'一只暗褐色成鸟接近幼鸟，喙粗长且端部弯钩、颜色较深；低头时与幼鸟喙部接触，幼鸟向上伸颈。'),evidence(145,155,'成幼鸟持续靠近并有喙部互动。画面支持很像喂食的互动，但未看清食物通过，旁白保留此限制。')],
 audio_evidence=[evidence(124.5,135.5,'原声有连续高频鸣声：约3–4 kHz的弯曲音带并带较高谐波，以及较短的宽频脉冲。'),evidence(141,151,'谐波性低频段与背景较高频声纹叠加。场景中多只鸟，不能把所有尖细声或短促声音都指定给前景幼鸟，也不声称每次喙部接触都产生可确认的碰击声。')],
 original_sound_windows=windows((124.1,128.7),(133.8,137.7),(142.8,145.7)),
 sources=[source('https://www.audubon.org/field-guide/bird/black-footed-albatross','黑脚信天翁深褐体羽、深色喙与脚、喙基较浅；亲鸟以反刍方式喂幼鸟。后一习性只帮助理解互动，未据此声称片中可见食物。繁殖地有多种鸣叫及喙部声响，不能用该描述替代本片声源归属。')]),
dict(chinese_name='黑背信天翁',english_name='Laysan Albatross',scientific_name='Phoebastria immutabilis',confidence=99,
 visual_evidence=[evidence(158.5,163,'两只白头、白胸腹、深色背翼的大型海鸟相对，眼周有暗色斑，喙较浅且端部弯钩；抬头伸颈时可见张嘴。'),evidence(168,175,'两鸟交替低头、摆头和伸展翅膀，并出现近距离喙部接触。'),evidence(179,184,'再次伸展翅膀、低头并抬头，符合有重复动作组合的求偶展示；没有据此确定性别、配对成功或当日交配。')],
 audio_evidence=[evidence(159.4,162.4,'抬头附近出现有明显谐波的鸣声，并有宽频短促声纹；视听时序支持展示伴随发声。'),evidence(174.5,177.8,'有重复的短促宽频脉冲及较长谐波声段，结合可见喙部快速动作，谨慎归为展示中的鸣叫与喙部碰击声；背景群鸟存在，无法给每个声脉冲逐一指定发声鸟。')],
 original_sound_windows=windows((158.6,162.7),(167.3,169.7),(175.0,177.7),(183.0,185.3)),
 sources=[source('https://www.audubon.org/field-guide/bird/laysan-albatross','黑背信天翁背翼深色、身体大部白色；求偶展示包括低头、摆头、竖喙鸣叫等动作。用于解释片中可见动作组合，不推断拍摄地或个体关系。')])
]

for c,d in zip(chapters,details):
    d={**c,**d}
    d['narration']=[{k:a[k] for k in ('start','end','text')} for a in actual if a['segment']==c['segment']]
    data['segments'].append(d)
(root/'segments.json').write_text(json.dumps(data,ensure_ascii=False,indent=2))
record('documentation','Write segment identifications, evidence, limitations, actual speech timings and sources',st)
