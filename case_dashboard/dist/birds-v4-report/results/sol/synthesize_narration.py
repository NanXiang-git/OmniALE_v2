#!/usr/bin/env python3
"""Synthesize only self-authored Mandarin narration through configured HTTP proxy.
No source video or source audio is transmitted. No recognition model is used.
"""
import asyncio,json,os,subprocess,pathlib,time
import edge_tts
BASE=pathlib.Path('/workspace/submission');CACHE=pathlib.Path('/workspace/scratch/tts');CACHE.mkdir(exist_ok=True)
VOICE='zh-CN-XiaoxiaoNeural';RATE='-5%'
async def synth(item,sem):
 async with sem:
  p=CACHE/(item['id']+'.mp3');meta=CACHE/(item['id']+'_boundary.json')
  if not p.exists() or p.stat().st_size==0:
   for attempt in range(3):
    boundaries=[]
    try:
     c=edge_tts.Communicate(item['text'],voice=VOICE,rate=RATE,pitch='+0Hz',volume='+0%',boundary='WordBoundary',proxy=os.environ.get('HTTPS_PROXY') or os.environ.get('HTTP_PROXY'))
     with p.open('wb') as f:
      async for chunk in c.stream():
       if chunk['type']=='audio':f.write(chunk['data'])
       elif chunk['type'] in ('WordBoundary','SentenceBoundary'):boundaries.append(chunk)
     meta.write_text(json.dumps(boundaries,ensure_ascii=False,indent=2));break
    except Exception:
     p.unlink(missing_ok=True)
     if attempt==2:raise
     await asyncio.sleep(1)
  wav=CACHE/(item['id']+'.wav')
  subprocess.run(['ffmpeg','-v','error','-y','-i',str(p),'-ac','1','-ar','48000','-c:a','pcm_s16le',str(wav)],check=True)
  print('SYNTHESIZED',item['id'],flush=True)
async def main():
 plan=json.loads((BASE/'narration_plan.json').read_text());sem=asyncio.Semaphore(3)
 await asyncio.gather(*(synth(i,sem) for i in plan))
 (BASE/'tts_implementation.json').write_text(json.dumps({'package':'edge-tts','version':edge_tts.__version__,'voice':VOICE,'rate':RATE,'pitch':'+0Hz','proxy_env':'HTTPS_PROXY / HTTP_PROXY','sent_data':'Only self-authored narration text in narration_plan.json; no source media uploaded','time_unix':time.time()},ensure_ascii=False,indent=2))
if __name__=='__main__':asyncio.run(main())
