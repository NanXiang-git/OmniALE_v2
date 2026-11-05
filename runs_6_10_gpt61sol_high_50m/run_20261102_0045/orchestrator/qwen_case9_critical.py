from qwen_case9_supplement import *
import importlib.util
sys.path.insert(0,str(CASE.parent))
spec=importlib.util.spec_from_file_location('frozen_case18_checks',CASE/'evaluator/deterministic.py');module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
truth=read(CASE/'evaluator/truth/faces.json')['frames'];cap=cv2.VideoCapture(str(SUB/'mask.mkv'));rows=[]
for n,row in enumerate(truth):
 ok,frame=cap.read();assert ok
 met=module.mask_metrics(cv2.cvtColor(frame,cv2.COLOR_BGR2GRAY)>=128,row,(640,704))
 rows.append({'frame':n,'metrics':met})
cap.release();selected=[]
for key,reverse in [('face_coverage',False),('outside_allowed',True)]:
 chosen=[]
 for row in sorted(rows,key=lambda r:r['metrics'][key],reverse=reverse):
  if all(abs(row['frame']-x['frame'])>=125 for x in chosen):chosen.append(row)
  if len(chosen)==4:break
 selected+=chosen
unique={r['frame']:r for r in selected}
for row in unique.values():
 row['images']={}
 for mid,path in MEDIA.items():
  cap=cv2.VideoCapture(str(path));cap.set(cv2.CAP_PROP_POS_FRAMES,row['frame']);ok,frame=cap.read();cap.release();assert ok
  target=OUT/'evidence/critical'/f"{mid}_{row['frame']}.jpg";target.parent.mkdir(exist_ok=True,parents=True);cv2.imwrite(str(target),frame,[cv2.IMWRITE_JPEG_QUALITY,95]);row['images'][mid]=str(target.relative_to(OUT))
save(OUT/'critical_frames.json',{'frames_scanned':len(rows),'selection':'Four lowest face coverage and four largest excessive-mask frames, at least 5 seconds apart per criterion; selection is not a new score.','selected':list(unique.values())})
print(json.dumps({'frames_scanned':len(rows),'selected':[r['frame'] for r in unique.values()]}))
