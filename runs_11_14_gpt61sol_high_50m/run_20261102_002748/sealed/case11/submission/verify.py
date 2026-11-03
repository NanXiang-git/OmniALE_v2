#!/usr/bin/env python3
"""Public-contract checks. No private facts, remote services, or subjective grading."""
import argparse,json,subprocess,re
from pathlib import Path
import numpy as np
import soundfile as sf

def decode_audio(p,sr=16000):
    return np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(p),'-map','0:a:0','-ac','1','-ar',str(sr),'-f','f32le','-']),dtype='<f4')
def frames(p):
    raw=subprocess.check_output(['ffmpeg','-v','error','-threads','2','-i',str(p),'-an','-vf','scale=32:24','-pix_fmt','gray','-f','rawvideo','-'])
    return np.frombuffer(raw,dtype=np.uint8).reshape(-1,24,32)
def seconds(s):
    h,m,v=s.split(':');return int(h)*3600+int(m)*60+float(v)
def verify(input_dir,sub):
    root=Path(sub);input_dir=Path(input_dir)
    get=lambda n:json.loads((root/n).read_text(encoding='utf8'))
    plan=get('description_plan.json'); timeline=get('timeline.json');chapters=get('chapters.json');audit=get('revision_audit.json');cfg=get('player_config.json')
    report={'checks':{},'metrics':{}}
    def check(k,v):report['checks'][k]=bool(v);assert v,k
    schema_file=input_dir.parent/'submission_schema.json'
    if schema_file.exists():
        import jsonschema
        for name,schema in json.loads(schema_file.read_text())['file_schemas'].items():jsonschema.validate(get(name),schema)
        check('public_json_schemas',True)
    segments=timeline['segments'];prev_out=0;prev_src=0;hold_total=0
    for s in segments:
        check('continuous_output_segments',s['output_start']==prev_out)
        prev_out=s['output_end']
        if s['kind']=='source':
            check('continuous_source_segments',s['source_start']==prev_src)
            check('source_speed_one',s['source_end']-s['source_start']==s['output_end']-s['output_start'])
            prev_src=s['source_end']
        else:
            check('permitted_holds',s['anchor_source_time'] in [62,96,154] and 0<s['output_end']-s['output_start']<=6)
            hold_total+=s['output_end']-s['output_start']
    check('complete_source_and_hold_budget',prev_src==180 and prev_out==198 and hold_total<=18)
    def mapped(t):return t+sum(s['output_end']-s['output_start'] for s in segments if s['kind']=='hold' and s['anchor_source_time']<=t)
    anchors=[0,30,62,96,126,154]
    check('six_chapter_anchors',[c['source_time'] for c in chapters['chapters']]==anchors)
    check('chapter_output_mapping',all(c['output_time']==mapped(c['source_time']) for c in chapters['chapters']))
    check('fixed_timeline_player',cfg['pause_policy']=='fixed_timeline' and all(k in cfg['tracks'] for k in ['video','base','description']))
    vtt=(root/'description.vtt').read_text();blocks=re.findall(r'([^\n]+)\n(\d\d:\d\d:\d\d\.\d{3}) --> (\d\d:\d\d:\d\d\.\d{3})\n([^\n]+)',vtt)
    check('vtt_count',len(blocks)==len(plan['cues']))
    sample_rate=48000; waves={}
    for name in ['base_track.wav','ad_track.wav','mix.wav']:
        p=root/name;info=sf.info(p);a,sr=sf.read(p,dtype='int16');waves[name]=a
        check('PCM48k_'+name,sr==sample_rate and info.subtype=='PCM_16' and a.ndim==1 and len(a)==198*sample_rate)
    base,ad,mix=[waves[x] for x in ['base_track.wav','ad_track.wav','mix.wav']]
    check('sample_exact_mix',np.array_equal(mix.astype('int32'),base.astype('int32')+ad.astype('int32')))
    expected_ad=np.zeros(len(ad),dtype=np.int32);overlap=0;ids=[]
    teacher=json.loads((input_dir/'teacher_windows.json').read_text())
    windows=[(mapped(w['start']),mapped(w['end'])) for w in teacher]
    for c,b in zip(plan['cues'],blocks):
        ids.append(c['id']);wav,sr=sf.read(root/c['wav'],dtype='int16')
        check('cue_PCM48k_'+c['id'],sr==48000 and sf.info(root/c['wav']).subtype=='PCM_16')
        check('cue_vtt_'+c['id'],c['id']==b[0] and abs(c['start']-seconds(b[1]))<=.00051 and abs(c['end']-seconds(b[2]))<=.00051 and c['text']==b[3])
        check('cue_duration_'+c['id'],abs(c['end']-c['start']-len(wav)/sr)<1/sr)
        check('cue_real_speech_'+c['id'],np.sqrt(np.mean((wav.astype(float)/32768)**2))>.01)
        start=round(c['start']*sr);expected_ad[start:start+len(wav)]+=wav.astype('int32')
        for a,z in windows:overlap+=max(0,min(c['end'],z)-max(c['start'],a))
    check('unique_cue_ids',len(set(ids))==len(ids))
    check('independent_ad_track',np.array_equal(expected_ad,ad.astype('int32')))
    check('teacher_protection',overlap<=.2);report['metrics']['cue_window_teacher_overlap_seconds']=overlap
    raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(input_dir/'source.mp4'),'-map','0:a:0','-ar','48000','-ac','1','-c:a','pcm_s16le','-f','s16le','-'])
    original=np.frombuffer(raw,dtype='<i2')
    base_ok=True
    for s in segments:
        a,z=round(s['output_start']*sr),round(s['output_end']*sr)
        if s['kind']=='hold':base_ok &= not np.any(base[a:z])
        else:base_ok &= np.array_equal(base[a:z],original[round(s['source_start']*sr):round(s['source_end']*sr)])
    check('teacher_unchanged_and_holds_silent',base_ok)
    check('old_cue_audit_coverage',sorted(x['old_cue_id'] for x in audit['items'])==list(range(1,9)))
    check('audit_references',all(x['action']=='delete' or (len(x['new_cue_ids'])>0 and all(i in ids for i in x['new_cue_ids'])) for x in audit['items']))
    rendered=decode_audio(root/'accessible_course.mp4');target=decode_audio(root/'mix.wav');n=min(len(rendered),len(target))
    err=float(np.linalg.norm(rendered[:n]-target[:n])/np.linalg.norm(target[:n]));delta=abs(len(rendered)-len(target))/16000
    report['metrics']['mp4_mix_relative_waveform_error_16k_mono']=err
    report['metrics']['mp4_mix_duration_difference_seconds']=delta
    check('main_audio_matches_mix',err<=.02 and delta<.08)
    source=frames(input_dir/'source.mp4');output=frames(root/'accessible_course.mp4')
    check('source_4500_output_4950_frames',len(source)==4500 and len(output)==4950)
    expected=np.concatenate([source[:1550],np.repeat(source[1549:1550],150,0),source[1550:2400],np.repeat(source[2399:2400],150,0),source[2400:3850],np.repeat(source[3849:3850],150,0),source[3850:]])
    errors=np.mean(np.abs(expected.astype('float32')-output.astype('float32')),axis=(1,2))
    report['metrics']['full_frame_thumbnail_mean_absolute_error']=float(errors.mean())
    report['metrics']['full_frame_thumbnail_max_frame_mean_absolute_error']=float(errors.max())
    check('all_source_frames_and_previous_frame_holds',float(errors.max())<1.0)
    probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(root/'accessible_course.mp4')]))
    video=next(s for s in probe['streams'] if s['codec_type']=='video')
    check('video_geometry_fps_duration',video['width']==1280 and video['height']==720 and video['avg_frame_rate']=='25/1' and abs(float(video['duration'])-198)<.001)
    report['status']='all_public_contract_checks_passed'
    return report
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--input',required=True);p.add_argument('--submission',required=True);p.add_argument('--report',required=True);a=p.parse_args()
    report=verify(a.input,a.submission);Path(a.report).write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report['metrics'],indent=2));print(report['status'])
