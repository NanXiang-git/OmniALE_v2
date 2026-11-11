"""Build a synchronized three-source review copy after answer sealing."""
from pathlib import Path
import sys,json,hashlib,subprocess
import cv2,numpy as np
ROOT=Path(__file__).resolve().parents[1]
RUN=ROOT/'runs_case26_v3_gpt61sol_high_60m/run_20261111'
OUT=ROOT/'case_dashboard/dist/case26-v3-report/result-media'

def main():
    freeze=json.loads((RUN/'sealed/case_26/freeze.json').read_text())
    submission=RUN/'sealed/case_26/submission'
    for entry in freeze['submission_manifest']:
        p=submission/entry['path']
        with p.open('rb') as f:assert hashlib.file_digest(f,'sha256').hexdigest()==entry['sha256']
    manifest=json.loads((submission/'submission.json').read_text())
    master=submission/manifest['files']['master']
    paths=[ROOT/'case26_v3/case_26/evaluator/truth/target.mkv',ROOT/'case26_v3/case_26/candidate/input/damaged.mkv',master]
    OUT.mkdir(parents=True,exist_ok=True)
    video=OUT/'clean-damaged-sol.mp4'
    if not video.exists():
        cmd=['ffmpeg','-v','error','-y']
        for p in paths:cmd+=['-i',str(p)]
        cmd+=['-filter_complex','[0:v][1:v][2:v]hstack=inputs=3[v]','-map','[v]','-an','-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p','-threads','2','-movflags','+faststart',str(video)]
        subprocess.run(cmd,check=True)
    cv2.setNumThreads(1)
    caps=[cv2.VideoCapture(str(p),cv2.CAP_FFMPEG,[cv2.CAP_PROP_N_THREADS,1]) for p in paths]
    for frame in [40,96,192,336,456,552,612]:
        frames=[]
        for cap in caps:
            cap.set(cv2.CAP_PROP_POS_FRAMES,frame);ok,im=cap.read();assert ok;frames.append(im)
        cv2.imwrite(str(OUT/f'frame_{frame:03}.png'),np.hstack(frames))
    for cap in caps:cap.release()
    (OUT/'provenance.json').write_text(json.dumps({'order':['clean_reference','damaged_v3','sealed_sol_master'],'fps':24,'frames':624,'source_submission_manifest_sha256':freeze['submission_manifest_sha256'],'video':'H.264 review copy; PNGs are direct lossless decoded frames'},indent=2))
    print('Three-source review media complete',video.stat().st_size)
if __name__=='__main__':main()
