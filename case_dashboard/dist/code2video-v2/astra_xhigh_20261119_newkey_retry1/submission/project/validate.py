"""Offline delivery checks and review sheets; optional reference is used ONLY here.
/usr/bin/python3 -m project.validate --reference /candidate/input/reference.mp4
"""
import argparse,csv,json,subprocess,hashlib,math
from pathlib import Path
from concurrent.futures import ProcessPoolExecutor
import numpy as np
import cv2
from PIL import Image,ImageDraw
from .scene import render_frame,frame_state,source_time
from .graphics import surface,stroke,array
from .geometry import LEFT_TEXT,RIGHT_TEXT,TOP_BAND
ROOT=Path(__file__).resolve().parents[1]

def probe(p):
    r=json.loads(subprocess.check_output(['ffprobe','-v','error','-count_frames','-show_streams','-show_format','-of','json',str(p)]))
    s=r['streams'][0]
    return {k:s.get(k) for k in ['codec_name','width','height','pix_fmt','r_frame_rate','nb_read_frames','duration']}|{'stream_count':len(r['streams'])}

def frames(p):
    c=cv2.VideoCapture(str(p));out=[]
    while True:
        ok,bgr=c.read()
        if not ok:break
        out.append(cv2.cvtColor(bgr,cv2.COLOR_BGR2RGB))
    c.release();return out

def blue_tip(im):
    r,g,b=im[:,:,0],im[:,:,1],im[:,:,2]
    mask=((r<52)&(g>55)&(g<178)&(b>178)).astype(np.uint8)
    n,lab,stats,cents=cv2.connectedComponentsWithStats(mask)
    found=[]
    for st,cent in zip(stats[1:],cents[1:]):
        x,y,w,h,a=map(int,st)
        if 500<x<1170 and 540<y<680 and 35<w<72 and 35<h<72 and 500<a<1500:found.append((x,y,w,h,a,*cent))
    return found[0] if len(found)==1 else None

def control_job(args):
    i,c=args;return i,blue_tip(render_frame(i/24,'revision',c))

def contact(rows,out,cols=4,w=400,h=225):
    n=math.ceil(len(rows)/cols);im=Image.new('RGB',(cols*w,n*(h+29)),'#e8e8e8');d=ImageDraw.Draw(im)
    for j,(pic,label) in enumerate(rows):
        x=j%cols*w;y=j//cols*(h+29)
        im.paste(Image.fromarray(pic).resize((w,h),Image.Resampling.LANCZOS),(x,y+29));d.text((x+8,y+8),label,fill='#222222')
    im.save(out,quality=94)

def main():
    p=argparse.ArgumentParser();p.add_argument('--reference',type=Path);args=p.parse_args()
    dest=ROOT/'validation';dest.mkdir(exist_ok=True)
    config=json.loads((ROOT/'project/revision.json').read_text());var=json.loads((ROOT/'project/variant.json').read_text())
    r=frames(ROOT/'reconstruction.mp4');e=frames(ROOT/'revision.mp4');v=frames(dest/'variant.mp4')
    results={'format':{name:probe(path) for name,path in [('reconstruction',ROOT/'reconstruction.mp4'),('revision',ROOT/'revision.mp4'),('variant',dest/'variant.mp4')]},'decoded_frames':{'reconstruction':len(r),'revision':len(e),'variant':len(v)},'anchor_checks':[]}
    assert len(r)==96 and len(e)==len(v)==144
    for name,d in results['format'].items():
        assert d['codec_name']=='h264' and (d['width'],d['height'])==(1920,1080) and d['pix_fmt']=='yuv420p' and d['r_frame_rate']=='24/1' and d['stream_count']==1
    for ts,to in zip(config['time_map']['source_s'],config['time_map']['output_s']):
        actual=source_time(to,'revision',config);assert abs(actual-ts)<1e-10
        results['anchor_checks'].append({'output_s':to,'expected_source_s':ts,'evaluated_source_s':actual,'source_right_boundary_only':ts==4})
    # Measure the rendered pointer silhouette in a zero-delay control and in
    # the encoded deliverable; ambiguous/occluded samples are explicitly skipped.
    zero=config|{'cursor_delay_s':0}
    indices=list(range(39,80))
    with ProcessPoolExecutor(max_workers=4) as pool:
        baseline=dict(pool.map(control_job,[(i,zero) for i in indices]))
    observations=[]
    for i in range(45,86):
        actual=blue_tip(e[i]);base=baseline.get(i-6)
        if actual and base:
            err=float(np.linalg.norm(np.array(actual[:2])-np.array(base[:2])))
            observations.append({'output_frame':i,'zero_delay_control_frame':i-6,'encoded_tip_xy':actual[:2],'control_tip_xy':base[:2],'tip_error_px':err})
    assert observations and max(o['tip_error_px'] for o in observations)<=3
    results['blue_cursor_pixel_check']={'intended_delay_output_frames':6,'observable_pairs':len(observations),'max_tip_error_px':max(o['tip_error_px'] for o in observations),'observations':observations,'occlusion_note':'Only uniquely identified, unoccluded arrow silhouettes are measured; absence after illustration overlap is not treated as a detection failure.'}
    # Confirm delay edits do not alter anything outside the actual arrow shapes.
    i=52;a=render_frame(i/24,'revision',config);b=render_frame(i/24,'revision',zero)
    diff=np.any(a!=b,axis=2);ys,xs=np.where(diff)
    results['delay_only_pixel_change']={'output_frame':i,'changed_pixels':int(diff.sum()),'change_bounds_xyxy':[int(xs.min()),int(ys.min()),int(xs.max()),int(ys.max())],'non_blue_control_states_identical':all(frame_state(j/24,'revision',config)[n]==frame_state(j/24,'revision',zero)[n] for j in range(144) for n in ['green_cursor','orange_cursor'])}
    # The public variant's text is actually rendered. Other ornaments stay pixel-identical.
    t=4.75;a=render_frame(t,'revision',config);b=render_frame(t,'revision',config|{'path_text':'DESIGN ON'})
    s,c=surface()
    for curve in [LEFT_TEXT,RIGHT_TEXT,TOP_BAND]:stroke(c,curve,'#fff',112)
    mask=array(s)[:,:,3]>0;diff=np.any(a!=b,axis=2)
    outside=int((diff&~mask).sum());assert outside==0 and diff.sum()>5000
    results['text_variant_pixel_check']={'output_s':t,'changed_pixels':int(diff.sum()),'changed_pixels_outside_lettered_arcs':outside,'variant_path_text':'DESIGN ON'}
    # Material edits have no effect once the UI has handed over to illustration.
    b=render_frame(t,'revision',config|{'ui_gradient':var['ui_gradient']})
    assert np.array_equal(a,b)
    results['material_isolation']={'illustration_output_s':t,'changed_pixels_when_only_ui_gradient_changes':int(np.any(a!=b,axis=2).sum())}
    for page in range(6):
        contact([(e[i],f'E {i:03d} | out {i/24:.3f}s | src {source_time(i/24,"revision",config):.3f}s') for i in range(page*24,(page+1)*24)],dest/f'revision_all_frames_{page+1}.jpg',4)
    contact([(e[66],'Revision | default blue-cyan, delay 0.25s'),(v[66],'Variant | violet-gold, delay 0.125s'),(e[114],'Revision | CREATE ON'),(v[114],'Variant | DESIGN ON')],dest/'parameter_variant.jpg',2,800,450)
    if args.reference:
        ref=frames(args.reference);assert len(ref)==96
        for page in range(4):
            rows=[]
            for i in range(page*24,(page+1)*24):rows.extend([(ref[i],f'REFERENCE {i:02d} | {i/24:.3f}s'),(r[i],f'RECONSTRUCTION {i:02d} | {i/24:.3f}s')])
            contact(rows,dest/f'reference_comparison_{page+1}.jpg',4,480,270)
        data=[]
        for i in range(96):
            aa=ref[i];bb=r[i];m1=np.min(aa,axis=2)<240;m2=np.min(bb,axis=2)<240;u=(m1|m2).sum();iou=(m1&m2).sum()/u if u else 1
            data.append({'source_frame':i,'source_s':round(i/24,6),'revision_output_s_for_source_pose':round(float(np.interp(i/24,config['time_map']['source_s'],config['time_map']['output_s'])),6),'rgb_mean_absolute_error':round(float(np.abs(aa.astype(float)-bb).mean()),4),'nonwhite_silhouette_iou':round(float(iou),4),'reference_frame_motion_mae':0 if i==0 else round(float(np.abs(aa.astype(float)-ref[i-1]).mean()),4),'reconstruction_frame_motion_mae':0 if i==0 else round(float(np.abs(bb.astype(float)-r[i-1]).mean()),4)})
        with (dest/'reference_frame_evidence.csv').open('w') as f:
            writer=csv.DictWriter(f,fieldnames=data[0].keys());writer.writeheader();writer.writerows(data)
        results['reference_comparison']={'frames':96,'sheets':[f'reference_comparison_{p+1}.jpg' for p in range(4)],'metrics':'Descriptive pixel and silhouette measures only. They are not an acceptance score.'}
    results['project_sha256']={str(p.relative_to(ROOT)):hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted((ROOT/'project').rglob('*')) if p.is_file() and '__pycache__' not in str(p)}
    (dest/'results.json').write_text(json.dumps(results,indent=2))
    print(json.dumps({k:v for k,v in results.items() if k not in ['project_sha256','blue_cursor_pixel_check']},indent=2))
    print('Measured cursor pairs:',len(observations),'max tip error:',results['blue_cursor_pixel_check']['max_tip_error_px'])
if __name__=='__main__':main()
