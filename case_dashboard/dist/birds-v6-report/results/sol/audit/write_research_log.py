import json,glob,time,platform,os
from pathlib import Path
S=Path('/workspace/scratch');R=Path('/workspace/submission')
entries=[]
def add(url,status,purpose,outcome,**extra):entries.append(dict(url=url,status=status,purpose=purpose,outcome=outcome,**extra))
# Requests that preceded the structured downloader. Statuses come from actual tool outputs.
add('https://www.google.com/search?q=common+nightingale+thrush+nightingale+identification+rufous+tail',403,'形态候选独立检索','Access denied by source-material policy；放弃，未使用搜索结果。')
add('https://www.audubon.org',200,'连通性HEAD检查','仅确认允许网站可连接，不作物种资料。')
for name in ['nightingale','reed-warbler','cettis-warbler','savis-warbler','grasshopper-warbler','marsh-warbler']:
 add('https://www.rspb.org.uk/birds-and-wildlife/'+name,200,'独立物种资料','已成功读取正文；最终仅引用segments.json列出的相关事实。')
add('https://www.rspb.org.uk/birds-and-wildlife/great-reed-warbler',200,'候选鉴别','HTTP 200但正文是404错误页，未作资料引用。')
for name in ['willow-flycatcher','eastern-wood-pewee','black-footed-albatross','alder-flycatcher','eastern-phoebe','marsh-wren']:
 add('https://www.audubon.org/field-guide/bird/'+name,200,'独立物种鉴别资料','成功读取正文；使用与外观、声型、互动相关事实，未跟随外部受限网站链接。')
add('https://www.audubon.org/field-guide/bird/laysan-albatross',403,'独立物种资料','Access denied by source-material policy；放弃该页面，未访问其媒体或替代地址。')
for name in ['nightingale','cettis-warbler']:
 add('https://www.birdfact.com/birds/'+name,429,'独立物种资料','仅出现Vercel安全验证，未成功阅读物种正文，未引用。')
add('https://www.bto.org/understanding-birds/species-focus/nightingale',404,'独立物种资料','404，未使用。')
add('https://www.birdguides.com/articles/identification/thrush-nightingale-and-nightingale/',403,'独立鉴别资料','Cloudflare验证页，未成功阅读正文，未引用。')
add('https://www.bird-sounds.net/nightingale/',404,'寻找独立物种参考','404，未使用。')
for name in ['nightingale','cettis-warbler']:
 add('https://www.british-birdsongs.uk/'+name+'/',200,'独立物种资料及音频目录','已读物种与音频目录；不使用其识别功能。')
for name in ['Thrush_Nightingale','Common_Nightingale','Cetti%27s_Warbler']:
 add('https://www.birdforum.net/opus/'+name,403,'独立物种资料','Cloudflare验证页，未成功阅读正文，未使用。')
for name in ['Cettia+cetti','Empidonax+alnorum','Cistothorus+palustris']:
 add('https://www.bing.com/search?q='+name+'+%E4%B8%AD%E6%96%87%E5%90%8D',200,'查询中文标准名','返回与鸟类不相关的结果；未引用任何摘要或链接。')
 add('https://avibase.bsc-eoc.org/search.jsp?lang=ZH&searchstr='+name,403,'查询中文标准名','Cloudflare验证页；未读取正文，未引用。')
for name in ['cettis-warbler','thrush-nightingale','great-reed-warbler','alder-flycatcher']:
 add('https://animalia.bio/'+name,403,'独立物种资料','Cloudflare验证页，未读到物种正文，未使用。')
for tail in ['eBook.php?specieID=1317&compareSpecieID=1298','eBook.php']:
 add('https://www.birdid.no/bird/'+tail,200,'查找独立鸟类手册','只返回鸟书导航，无具体候选资料，未作依据；未调用识别模型或测验。')
for name in ['cetti.s.warbler','thrush.nightingale','great.reed.warbler','common.nightingale','alder.flycatcher','marsh.wren','common.reed.warbler']:
 add('https://www.oiseaux.net/birds/'+name+'.html',200,'独立物种正文与参考录音目录','成功读取正文或目录；仅跟随明确选中的允许独立录音，不追溯输入来源，不跟随受限域名链接。')
for name in ['Phoebastria_immutabilis','Luscinia_megarhynchos']:
 add('https://animaldiversity.org/accounts/'+name+'/',200,'独立物种资料','成功读取正文；黑背信天翁外观与求偶动作、夜莺形态等事实核对。')
# Preserve actual machine-readable results, including timeouts and policy denials.
raw_logs={}
for name in ['ref_batch.json','soundpages.json','soundpages2.json','extra_refs.json','reference_download_log.json','reference_download_log2.json','reference_retry_log.json','image_ref_log.json','rspb_audio_log.json','independent_refs_log.json','reed_reference_log.json']:
 p=S/name
 if p.exists():
  data=json.loads(p.read_text());raw_logs[name]=data
  items=data if isinstance(data,list) else [data]
  for item in items:
   if not isinstance(item,dict) or 'url' not in item:continue
   d={k:v for k,v in item.items() if k not in ['text','data']}
   d['purpose']='独立参考资料或录音的实际访问'
   d['outcome']=('成功读取；录音只做人工声谱比较，未混入成片。' if d.get('status')==200 else '失败、超时或被拦截；未作为成功阅读/听过的资料。')
   entries.append(d)
# Extra failed audio request recorded in terminal; no alternate copy was sought.
add('https://www.british-birdsongs.uk/birdmedia/858/cettis-warbler-song-3391.mp3','ProxyError RemoteDisconnected','独立Cetti录音','未取得媒体，放弃；未声称听过。')
software=[
 {'action':'pip install edge-tts matplotlib','result':'matplotlib不可用，整个安装失败；后续未使用matplotlib。'},
 {'action':'python3 -m pip install --target /workspace/site-packages edge-tts','result':'成功，edge-tts 7.3.1；依赖版本见requirements-lock.txt。'},
 {'url':'https://raw.githubusercontent.com/notofonts/noto-cjk/main/Sans/OTF/SimplifiedChinese/NotoSansCJKsc-Regular.otf','status':403,'result':'被素材策略拒绝；放弃该URL。'},
 {'url':'https://fonts.gstatic.com/ea/notosanssc/v1/NotoSansSC-Regular.otf','status':404,'result':'旧版字体URL不存在，未使用。'},
 {'url':'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400&display=swap','status':200,'result':'成功读取CSS，随后按CSS字体URL下载。'},
 {'url':'https://fonts.gstatic.com/s/notosanssc/v41/k3kCo84MPvpLmixcA63oeAL7Iqp5IZJF9bmaG9_FnYw.ttf','status':200,'bytes':10540644,'result':'最终字幕使用的Noto Sans SC字体。'},
 {'url':'https://deb.debian.org/debian/pool/main/f/fonts-noto-cjk/fonts-noto-cjk_20220127+repack1-1_all.deb','result':'并行尝试的字体包下载持续过久；取得Google字体后终止该下载，未使用。'},
 {'action':'apt-get update with explicit HTTP/HTTPS proxy','result':'系统无apt源/目录，失败；没有安装任何apt依赖。'},
 {'action':'First RSPB audio URL extraction','result':'最初正则误将页面中多段转义JSON连成一个无效长URL，收到403后停止；修正解析后只请求页面列出的独立XC40233音频原URL并成功。保留此调试说明，不把最初失败算作成功访问。'}
]
log={
 'purpose':'独立完成六段鸟类中文科普视频；审计工具、联网访问、失败及实际使用的识别依据。',
 'network':'requests默认读取HTTP_PROXY/HTTPS_PROXY/ALL_PROXY；pip/curl读取环境变量；edge-tts明确传入环境HTTPS_PROXY。未设置直连或绕过黑名单。网页中的外部受限链接未跟随。',
 'limitations':'没有原生听音工具，未亲耳试听。只读取音频采样、查看声谱，并核对可见动作；未调用任何识别模型或子代理。没有发现并使用输入原素材或历史答案；政策拒绝的资源一律未引用内容。',
 'tts':{'tool':'edge-tts','version':'7.3.1','service':'Microsoft Edge online speech synthesis','voice':'zh-CN-XiaoxiaoNeural','native_rate':'-8%','pitch':'+0Hz','volume':'+0%','boundary':'WordBoundary','transport':'HTTPS/WSS via supplied standard proxy','test_script':'/workspace/scratch/test_tts.py','production_script':'generate_narration.py','payload':'Only independently authored Mandarin text; no input video or original sound uploaded.','credentials':'No host/experiment/commercial keys used.','result':'16 actual speech clips successfully synthesized; exact request text, durations and returned token timestamps retained. No post-synthesis tempo change.'},
 'references':entries,'software_setup':software,
 'reference_policy':'Downloaded reference audio is used only for manual spectrogram inspection. Final mix reads only original.wav and narration.wav. Failed/denied reference media was abandoned, never replaced by a mirror or cache. Ordinary retry once after a read timeout retained the same reference URL; RemoteDisconnected failures were abandoned.',
 'raw_result_files':list(raw_logs),
 'log_scope':'Summarizes actual terminal calls, coalescing repeated reads of the same article. Optional hashes are present only where actually calculated. Source citation facts are limited to successful body reads in segments.json.',
 'created_unix':time.time()}
(R/'research_log.json').write_text(json.dumps(log,ensure_ascii=False,indent=2),encoding='utf-8')
# Retain the original JSON network records for independent checking.
A=R/'audit';A.mkdir(exist_ok=True)
for name,data in raw_logs.items():
 def clean(v):
  if isinstance(v,dict):return {k:clean(x) for k,x in v.items() if k not in ['text','data']}
  if isinstance(v,list):return [clean(x) for x in v]
  return v
 (A/name).write_text(json.dumps(clean(data),ensure_ascii=False,indent=2),encoding='utf-8')
print('research log:',len(entries),'entries')
