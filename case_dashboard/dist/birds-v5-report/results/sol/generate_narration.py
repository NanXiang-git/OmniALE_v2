#!/usr/bin/env python3
"""Regenerate the authored Chinese utterances. Requires HTTP(S)_PROXY.
Only narration text is transmitted; the source film is never opened here.
"""
import json,pathlib,subprocess,concurrent.futures,sys,shutil
from synthesize_narration import synthesize
ROOT=pathlib.Path('/workspace');OUT=ROOT/'submission';SCR=ROOT/'scratch';SCR.mkdir(exist_ok=True)
plan=json.load(open(OUT/'narration_plan.json'))
def one(i):
 v=plan[i];v['file']=str(SCR/f'narr_{i:02d}.mp3')
 if '--cached' in sys.argv:
  shutil.copyfile(OUT/'speech_sources'/f'narr_{i:02d}.mp3',v['file'])
  shutil.copyfile(OUT/'speech_metadata'/f'narr_{i:02d}.mp3.json',v['file']+'.json')
 else:
  synthesize(v['text'],v['file'])
 v['duration']=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',v['file']]))
 print(i,v['duration'],flush=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as ex:list(ex.map(one,range(len(plan))))
json.dump(plan,open(SCR/'narration_generated.json','w'),ensure_ascii=False,indent=2)
