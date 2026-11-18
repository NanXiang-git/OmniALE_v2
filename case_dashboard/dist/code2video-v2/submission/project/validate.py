#!/usr/bin/env python3
"""Decode outputs and record format, mapped-pose and cursor measurements.

This is evidence, not an automatic visual-fidelity score. Optional reference
frames are used only in labeled documentation contact sheets.
"""
import argparse
import csv
import hashlib
import json
from pathlib import Path
import subprocess
import cv2
import numpy as np
from PIL import Image,ImageDraw,ImageFont


ROOT=Path(__file__).resolve().parent.parent


def decode(filename):
    cap=cv2.VideoCapture(str(filename));frames=[]
    while True:
        ok,a=cap.read()
        if not ok:break
        frames.append(a)
    cap.release()
    return frames


def probe(filename):
    a=json.loads(subprocess.check_output(['ffprobe','-v','error','-select_streams','v:0','-count_frames','-show_entries','stream=codec_name,pix_fmt,width,height,r_frame_rate,nb_read_frames,duration','-of','json',str(filename)]))['streams'][0]
    a['sha256']=hashlib.sha256(filename.read_bytes()).hexdigest()
    return a


def cursor(a,which):
    b,g,r=cv2.split(a)
    yy,xx=np.indices(b.shape)
    if which=='blue':
        m=(r<29)&(g>90)&(g<166)&(b>215)&(yy>550)&(yy<680)&(xx>500)&(xx<1160)
    elif which=='green':
        m=(r>110)&(r<191)&(g>185)&(b<100)&(yy>140)&(yy<365)&(xx>600)&(xx<850)
    else:
        m=(r>225)&(g>85)&(g<185)&(b<55)&(yy>690)&(yy<1030)&(xx>600)&(xx<1000)
    count,_,stats,_=cv2.connectedComponentsWithStats(m.astype('uint8'))
    can=[]
    for x,y,w,h,area in stats[1:]:
        if 180<area<1900 and 25<w<70 and 25<h<70:can.append((int(area),int(x),int(y),int(w),int(h)))
    if not can:return None
    area,x,y,w,h=max(can)
    return {'tip_proxy':[x-3,y-3],'bbox':[x,y,w,h],'area_px':area}


def sheet(frames,indices,path,label):
    tw,th=384,216;cols=4
    out=Image.new('RGB',(tw*cols,(th+24)*((len(indices)+cols-1)//cols)),'#e5e5e5');d=ImageDraw.Draw(out)
    for i,j in enumerate(indices):
        im=Image.fromarray(cv2.cvtColor(frames[j],cv2.COLOR_BGR2RGB)).resize((tw,th),Image.Resampling.LANCZOS)
        x=i%cols*tw;y=i//cols*(th+24);out.paste(im,(x,y));d.text((x+6,y+th+4),f'{label} frame {j:03d}  {j/24:.3f}s',fill='black')
    out.save(path,quality=94)


def all_sheets(frames,dst,label):
    """Every decoded frame, in labeled 24-frame pages for continuity review."""
    folder=dst/'all_frames';folder.mkdir(exist_ok=True)
    for start in range(0,len(frames),24):
        sheet(frames,list(range(start,min(start+24,len(frames)))),folder/f'{label}_{start//24+1:02d}.jpg',label)


def main():
    p=argparse.ArgumentParser();p.add_argument('--reference',type=Path);args=p.parse_args()
    dst=ROOT/'validation';dst.mkdir(exist_ok=True)
    r=decode(ROOT/'reconstruction.mp4');e=decode(ROOT/'revision.mp4')
    variant=decode(dst/'variant.mp4') if (dst/'variant.mp4').exists() else []
    cfg=json.loads((ROOT/'project/revision.json').read_text());m=cfg['time_map']
    reports={n:probe(f) for n,f in [('reconstruction',ROOT/'reconstruction.mp4'),('revision',ROOT/'revision.mp4')]}
    if variant:reports['variant']=probe(dst/'variant.mp4')
    technical={}
    for name,n in [('reconstruction',96),('revision',144),('variant',144)]:
        if name not in reports:continue
        pp=reports[name]
        technical[name]=pp['codec_name']=='h264' and pp['pix_fmt']=='yuv420p' and pp['width']==1920 and pp['height']==1080 and pp['r_frame_rate']=='24/1' and int(pp['nb_read_frames'])==n
    # Detect cursor geometry in the actual decoded pictures, not just in data.
    obs={}
    for name,frames in [('R',r),('E',e)]:
        obs[name]={}
        for i,a in enumerate(frames):
            if (name=='R' and not 37<=i<=67) or (name=='E' and not 37<=i<=87):continue
            obs[name][i]={c:cursor(a,c) for c in ['blue','green','orange']}
    pairs=[];delay_samples=[];other_errors={'green':[],'orange':[]}
    for f in [40,42,44,46,48,50,52,54,56,58,60,62,64,66]:
        base=int(round(np.interp(f/24,m['source_s'],m['output_s'])*24))
        out=base+6
        row={'R_frame':f,'source_s':f/24,'E_base_frame':base,'E_blue_frame':out,'expected_delay_frames':6}
        for c in ['blue','green','orange']:
            ff=out if c=='blue' else base
            rr=obs['R'].get(f,{}).get(c);ee=obs['E'].get(ff,{}).get(c)
            row[c+'_R']=None if rr is None else rr['tip_proxy']
            row[c+'_E']=None if ee is None else ee['tip_proxy']
            if rr and ee:
                error=float(np.linalg.norm(np.array(rr['tip_proxy'])-ee['tip_proxy']))
                row[c+'_position_error_px']=round(error,3)
                if c!='blue':other_errors[c].append(error)
        rr=obs['R'].get(f,{}).get('blue')
        if rr and 40<=f<=56:
            candidates=[]
            for dd in range(0,10):
                ee=obs['E'].get(base+dd,{}).get('blue')
                if ee:
                    error=np.linalg.norm(np.array(rr['tip_proxy'])-ee['tip_proxy'])
                    candidates.append((float(error),abs(dd-6),dd))
            if candidates:
                best=min(candidates)
                row['measured_best_delay_frames']=best[2];row['best_match_error_px']=round(best[0],3)
                delay_samples.append(best[2])
        pairs.append(row)
    (dst/'cursor_pairs.json').write_text(json.dumps(pairs,indent=2)+'\n')
    cw,ch=540,147
    contact_frames=[40,44,48,52,56,64,66]
    contact=Image.new('RGB',(cw*3,(ch+27)*len(contact_frames)),'#e8e8e8');cd=ImageDraw.Draw(contact)
    for row,f in enumerate(contact_frames):
        base=int(round(np.interp(f/24,m['source_s'],m['output_s'])*24))
        for col,(label,frames,ff) in enumerate([('R pose',r,f),('E base clock',e,base),('E blue +6 frames',e,base+6)]):
            a=frames[ff][520:700,500:1160]
            im=Image.fromarray(cv2.cvtColor(a,cv2.COLOR_BGR2RGB)).resize((cw,ch),Image.Resampling.LANCZOS)
            x=col*cw;y=row*(ch+27);contact.paste(im,(x,y));cd.text((x+5,y+ch+6),f'{label}  frame {ff:03d}  {ff/24:.3f}s',fill='black')
    contact.save(dst/'cursor_delay_contact.jpg',quality=95)
    with (dst/'cursor_observations.csv').open('w',newline='') as out:
        writer=csv.writer(out);writer.writerow(['movie','frame','output_s','cursor','tip_x_proxy','tip_y_proxy','area_px'])
        for name,frames in obs.items():
            for f,values in frames.items():
                for c,val in values.items():
                    if val:writer.writerow([name,f,f/24,c,*val['tip_proxy'],val['area_px']])
    # The rail's left edge/knob contains no revised material or text during UI.
    pose=[]
    for f in range(42,63,2):
        g=int(round(np.interp(f/24,m['source_s'],m['output_s'])*24))
        a=r[f][350:820,520:710];b=e[g][350:820,520:710]
        pose.append({'R_frame':f,'E_frame':g,'left_rail_mean_absolute_RGB_error':round(float(np.mean(np.abs(a.astype(float)-b))),4)})
    indices=[0,2,6,8,10,12,14,16,20,24,28,32,36,40,44,48,52,54,56,60,63,66,69,72,75,78,81,84,87,90,93,95]
    sheet(r,indices,dst/'reconstruction_contact.jpg','R')
    sheet(e,[0,8,16,24,32,40,44,48,52,56,60,64,68,72,76,80,84,88,92,96,100,104,108,112,116,120,124,128,132,136,140,143],dst/'revision_contact.jpg','E')
    all_sheets(r,dst,'R');all_sheets(e,dst,'E')
    if variant:
        sheet(variant,[48,54,60,66,72,78,84,90,96,108,120,143],dst/'variant_contact.jpg','variant')
        # Actual changed pixels for the independent public-parameter variant.
        cv2.imwrite(str(dst/'variant_UI.png'),variant[60]);cv2.imwrite(str(dst/'variant_text.png'),variant[114])
        cv2.imwrite(str(dst/'revision_UI.png'),e[60]);cv2.imwrite(str(dst/'revision_text.png'),e[114])
    variant_metrics=None
    if variant:
        vc=json.loads((ROOT/'project/variant.json').read_text())
        variant_delay=[]
        for f in [42,44,46,48,50,52]:
            base=int(round(np.interp(f/24,m['source_s'],m['output_s'])*24))
            rr=cursor(r[f],'blue');best=[]
            if rr:
                for dd in range(0,7):
                    ee=cursor(variant[base+dd],'blue')
                    if ee:best.append((float(np.linalg.norm(np.array(rr['tip_proxy'])-ee['tip_proxy'])),abs(dd-2.4),dd))
            if best:variant_delay.append({'R_frame':f,'E_base_frame':base,'measured_nearest_output_shift_frames':min(best)[2],'position_error_px':round(min(best)[0],3)})
        variant_metrics={
            'path_text':vc['path_text'],'ui_gradient':vc['ui_gradient'],'cursor_delay_s':vc['cursor_delay_s'],
            'time_map_unchanged':vc['time_map']==m,
            'UI_frame_60_mean_RGB_change':float(np.mean(np.abs(variant[60].astype(float)-e[60]))),
            'lettering_frame_114_mean_RGB_change':float(np.mean(np.abs(variant[114].astype(float)-e[114]))),
            'unchanged_rail_frame_60_mean_RGB_error':float(np.mean(np.abs(variant[60][350:820,520:710].astype(float)-e[60][350:820,520:710]))),
            'nearest_frame_cursor_delay':variant_delay,
            'note':'A 0.10 second delay is 2.4 frames; observations choose the nearest sampled output frame. View paired UI/text images for the actual changed material and lettering.'
        }
    reference_evidence=None
    if args.reference:
        ref=decode(args.reference)
        reference_pairs=[]
        for f in range(40,67,2):
            row={'source_frame':f,'source_s':f/24}
            for c in ['blue','green','orange']:
                rr=cursor(ref[f],c);re=cursor(r[f],c)
                row[c+'_reference']=None if rr is None else rr['tip_proxy']
                row[c+'_R']=None if re is None else re['tip_proxy']
                if rr and re:row[c+'_position_error_px']=round(float(np.linalg.norm(np.array(rr['tip_proxy'])-re['tip_proxy'])),3)
            reference_pairs.append(row)
        reference_evidence={'decoded_frames':len(ref),'cursor_pose_pairs':reference_pairs,'limit':'Only unoccluded colored pointer components are measured; these data do not score style, tube lighting, illustration or phase fidelity.'}
        (dst/'reference_cursor_pairs.json').write_text(json.dumps(reference_pairs,indent=2)+'\n')
        samples=[8,16,24,36,40,44,48,54,60,64,68,72,76,80,84,90,95]
        for page in range(3):
            fs=samples[page*6:(page+1)*6]
            out=Image.new('RGB',(1440,298*len(fs)),'#e8e8e8');d=ImageDraw.Draw(out)
            for row,f in enumerate(fs):
                ef=round(np.interp(f/24,m['source_s'],m['output_s'])*24)
                for col,(name,arr,ff) in enumerate([('REFERENCE',ref,f),('RECONSTRUCTION',r,f),('REVISION',e,ef)]):
                    im=Image.fromarray(cv2.cvtColor(arr[ff],cv2.COLOR_BGR2RGB)).resize((480,270),Image.Resampling.LANCZOS)
                    out.paste(im,(col*480,row*298));d.text((col*480+7,row*298+277),f'{name}  frame {ff:03d}  t={ff/24:.3f}s',fill='black')
            out.save(dst/f'comparison_{page+1}.jpg',quality=95)
    report={
        'format':reports,'format_checks_passed':technical,
        'decoded_frame_counts':{'reconstruction':len(r),'revision':len(e),'variant':len(variant)},
        'public_time_map':m,
        'mapped_pose_evidence':pose,
        'cyan_cursor_delay':{
            'method':'Connected-component position measurements in decoded R/E frames at forward-mapped timestamps. Search output shifts 0–9; slow/static or occluded portions are excluded from delay inference.',
            'measured_best_delay_frames':delay_samples,
            'median_frames':float(np.median(delay_samples)) if delay_samples else None,
            'expected_frames':6,
            'observability_limit':'The final disappearance is partly occluded by illustrated ribbons; it is not certified by color detection alone. See contact sheets and editable layer implementation.'
        },
        'non_delayed_cursor_position_error_px':{c:{'samples':len(a),'max':max(a) if a else None,'mean':float(np.mean(a)) if a else None} for c,a in other_errors.items()},
        'parameter_variant':{'config':'project/variant.json','video':'validation/variant.mp4','observations':variant_metrics},
        'reference_evidence':reference_evidence,
        'not_automatically_verified':['Reference visual fidelity score','Exact original 3D lighting/refraction','Every hand-drawn contour and sub-frame deformation','Formal 85/100 acceptance threshold'],
        'notes':'All output frames decoded. Metrics document format and visible trajectory/mapped-pose evidence; they are not a substitute for the visual rubric.'
    }
    (dst/'report.json').write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps({'formats':technical,'decode_counts':report['decoded_frame_counts'],'cyan_delay':report['cyan_cursor_delay'],'green_orange':report['non_delayed_cursor_position_error_px']},indent=2))


if __name__=='__main__':main()
