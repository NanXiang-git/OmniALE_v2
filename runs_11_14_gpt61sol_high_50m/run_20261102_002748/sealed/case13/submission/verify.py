#!/usr/bin/env python3
"""Measure public delivery contracts; this does not assign subjective scores."""
import argparse,json,io,re,subprocess,concurrent.futures,hashlib,time
from pathlib import Path
import numpy as np,soundfile as sf

def read(p):return sf.read(io.BytesIO(Path(p).read_bytes()),dtype='float32',always_2d=True)
def probe(p):return json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(p)]))
def meter(p):
 r=subprocess.run(['ffmpeg','-hide_banner','-nostats','-i',str(p),'-af','loudnorm=I=-16:TP=-1:LRA=11:print_format=json','-f','null','-'],capture_output=True,check=True)
 m=re.findall(r'\{[^{}]*"input_i"[^{}]*\}',r.stderr.decode());j=json.loads(m[-1]);return {'integrated_lufs':float(j['input_i']),'true_peak_dbtp':float(j['input_tp']),'lra_lu':float(j['input_lra'])}
def verify(inp,sub,work):
 work.mkdir(exist_ok=True,parents=True);t=time.monotonic();r={'technical_checks_only':True,'subjective_judge_run':False,'checks':{},'media':{},'warnings':[]};c=r['checks']
 schema_path=Path('/candidate/submission_schema.json')
 if schema_path.exists():
  import jsonschema
  for name,schema in json.load(open(schema_path))['file_schemas'].items():jsonschema.validate(json.load(open(sub/name)),schema)
  c['json_schema']=True
 sp=json.load(open(sub/'speakers.json'))['speakers'];ev=json.load(open(sub/'translation_plan.json'))['events'];cfg=json.load(open(sub/'mix_config.json'))
 c['source_ids_covered']=sorted({v for e in ev for v in e['source_ids']})==[f'S{i:03}' for i in range(1,74)]
 keys={(x['speaker_id'],x['instance'],x['voice_id']) for x in sp}
 c['speaker_references']=all(e['type']=='screen_text' or (e['speaker_id'],e['speaker_instance'],e['voice_id']) in keys for e in ev)
 c['screen_text_unvoiced']=all(e['speaker_id']==e['speaker_instance']==e['voice_id']=='' and not e.get('raw_asset') for e in ev if e['type']=='screen_text')
 me,sr=read(inp/'music_effects.wav');fx,sf_sr=read(sub/'effects_track.wav');expect=me*10**(cfg['effects_gain_db']/20)
 r['effects_relative_waveform_error']=float(np.sqrt(np.sum((expect-fx).astype('float64')**2)/np.sum(expect.astype('float64')**2)))
 c['effects_formula']=r['effects_relative_waveform_error']<=.02 and me.shape==fx.shape and sr==sf_sr==48000
 del me,expect
 total=fx;activities=[]
 for s in sp:
  x,sr=read(sub/s['wav']);info=sf.info(sub/s['wav']);r['media'][s['wav']]={'samplerate':sr,'channels':info.channels,'samples':info.frames,'subtype':info.subtype};assert x.shape==total.shape
  total+=x;act=np.max(np.abs(x),axis=1)>.0005;mask=np.zeros(len(act),dtype=bool)
  for e in ev:
   if e.get('track')==s['wav']:mask[round(e['start']*sr):round(e['end']*sr)]=True
  n=int(np.sum(act));inside=int(np.sum(act&mask));activities.append({'wav':s['wav'],'active_samples':n,'fraction_inside_planned_events':inside/max(n,1)})
 r['role_activity']=activities;c['role_activity_inside_plan']=all(v['fraction_inside_planned_events']>=.97 for v in activities)
 mix,sr=read(sub/'mix.wav');r['sum_relative_waveform_error']=float(np.sqrt(np.sum((mix-total).astype('float64')**2)/np.sum(total.astype('float64')**2)));c['stem_sum']=r['sum_relative_waveform_error']<=.02
 del total,mix
 for name in ['mix.wav','effects_track.wav','mobile_mix.wav']:
  info=sf.info(sub/name);r['media'][name]={'samplerate':info.samplerate,'channels':info.channels,'samples':info.frames,'subtype':info.subtype}
 c['audio_formats']=all(v['samplerate']==48000 and v['samples']==25200000 and v['channels']==(1 if k=='mobile_mix.wav' else 2) for k,v in r['media'].items())
 g=cfg['mobile']['gain_db'];f=f'pan=mono|c0=0.5*c0+0.5*c1,volume={g}dB,alimiter=limit=0.7943282347:attack=5:release=50:level=0:latency=1'
 ref=work/'mobile_reference.wav';subprocess.run(['ffmpeg','-v','error','-y','-i',str(sub/'mix.wav'),'-af',f,'-ar','48000','-c:a','pcm_s24le',str(ref)],check=True)
 x,sr=read(ref);y,_=read(sub/'mobile_mix.wav');r['mobile_reference_relative_error']=float(np.linalg.norm(x-y)/max(np.linalg.norm(x),1e-10));c['mobile_formula']=r['mobile_reference_relative_error']<=.02 and x.shape==y.shape
 del x,y
 names=['mix.wav','mobile_mix.wav','dub_zh.mp4']
 with concurrent.futures.ThreadPoolExecutor(max_workers=3) as ex:
  vals=list(ex.map(lambda n:meter(sub/n),names))
 r['loudness']=dict(zip(names,vals))
 for n in ['mix.wav','dub_zh.mp4']:
  m=r['loudness'][n];c[n+'_loudness']=-17<=m['integrated_lufs']<=-15;c[n+'_true_peak']=m['true_peak_dbtp']<=-1
 m=r['loudness']['mobile_mix.wav'];c['mobile_loudness']=-19<=m['integrated_lufs']<=-17;c['mobile_true_peak']=m['true_peak_dbtp']<=-2
 v=probe(sub/'dub_zh.mp4');vs=next(x for x in v['streams'] if x['codec_type']=='video');r['video']={k:vs[k] for k in ['width','height','r_frame_rate','duration','nb_frames']};c['video_format']=vs['width']==1280 and vs['height']==534 and vs['r_frame_rate']=='24/1' and vs['nb_frames']=='12600' and float(vs['duration'])==525
 # Subtitle cue tables use exactly the same visible intervals and Unicode text.
 cues=json.load(open(sub/'assets/subtitle_cues.json'));subtitle_issues=[]
 for q in cues:
  d=q['end']-q['start']
  for lang,limit in [('zh',18),('en',42)]:
   ls=q[lang].splitlines()
   if len(ls)>2 or any(len(re.sub(r'\s','',l))>limit for l in ls) or not .399<=d<=7.001:subtitle_issues.append(q['event_id']+lang)
  if len(re.sub(r'\s','',q['zh']))/d>10.001:subtitle_issues.append(q['event_id']+'cps')
 r['subtitle_issues']=subtitle_issues;c['subtitle_reading_limits']=not subtitle_issues
 boundaries=sorted({q[k] for q in cues for k in ['start','end']});overlaps=[]
 for a,b in zip(boundaries,boundaries[1:]):
  active=[q for q in cues if q['start']<(a+b)/2<q['end']]
  for lang in ['zh','en']:
   lines=sum(len(q[lang].splitlines()) for q in active)
   if lines>2:overlaps.append({'start':a,'end':b,'language':lang,'lines':lines})
 r['simultaneous_subtitle_line_violations']=overlaps;c['burned_simultaneous_line_limits']=not overlaps
 r['elapsed_seconds']=time.monotonic()-t;r['all_measured_checks_pass']=all(c.values());(sub/'validation_report.json').write_text(json.dumps(r,ensure_ascii=False,indent=2));print(json.dumps(r,ensure_ascii=False,indent=2))
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--input',type=Path,required=True);p.add_argument('--submission',type=Path,default=Path(__file__).resolve().parent);p.add_argument('--work',type=Path,required=True);a=p.parse_args();verify(a.input,a.submission,a.work)
