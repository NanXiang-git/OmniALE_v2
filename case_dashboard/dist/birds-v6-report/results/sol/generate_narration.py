#!/usr/bin/env python3
"""Generate original Mandarin narration with edge-tts, using ONLY authored text.
No input video/audio is transmitted. All network uses the environment HTTP proxy.
Run: PYTHONPATH=/workspace/site-packages python3 generate_narration.py
"""
import asyncio,json,os,subprocess,time,hashlib
from pathlib import Path
import edge_tts
ROOT=Path('/workspace/submission');CACHE=Path('/workspace/scratch/tts');CACHE.mkdir(parents=True,exist_ok=True)
VOICE='zh-CN-XiaoxiaoNeural';RATE='-8%'
async def main():
 plan=json.loads((ROOT/'narration_plan.json').read_text())
 semaphore=asyncio.Semaphore(3)
 async def generate(item):
  async with semaphore:
   ident=item['id'];p=CACHE/f'{ident}.mp3';timing=CACHE/f'{ident}.json'
   key=hashlib.sha256((VOICE+RATE+item['text']).encode()).hexdigest()
   old=json.loads(timing.read_text()) if timing.exists() else {}
   if not p.exists() or old.get('cache_key')!=key:
    for attempt in range(3):
     try:
      comm=edge_tts.Communicate(item['text'],voice=VOICE,rate=RATE,volume='+0%',pitch='+0Hz',boundary='WordBoundary',proxy=os.environ.get('HTTPS_PROXY') or os.environ.get('HTTP_PROXY'),connect_timeout=30,receive_timeout=120)
      events=[]
      with p.open('wb') as f:
       async for chunk in comm.stream():
        if chunk['type']=='audio':f.write(chunk['data'])
        else:events.append(chunk)
      timing.write_text(json.dumps({'voice':VOICE,'rate':RATE,'cache_key':key,'text':item['text'],'events':events},ensure_ascii=False,indent=2))
      break
     except Exception:
      if attempt==2:raise
      await asyncio.sleep(2)
   wav=CACHE/f'{ident}.wav'
   subprocess.run(['ffmpeg','-v','error','-y','-i',str(p),'-ac','1','-ar','48000','-c:a','pcm_s16le',str(wav)],check=True)
   dur=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(wav)]).decode())
   item.update(duration=dur,end=round(item['start']+dur,6),audio_file=str(wav),word_timing_file=str(timing))
   item['fits']=item['end']<=item['latest_end']
   print(ident,'duration',round(dur,3),'end',round(item['end'],3),'fits',item['fits'],flush=True)
  return item
 result=await asyncio.gather(*(generate(x) for x in plan))
 (ROOT/'narration_timing.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
 if not all(x['fits'] for x in result):raise RuntimeError('One or more utterances exceeds its slot. Revise text/schedule; do not time-stretch.')
if __name__=='__main__':asyncio.run(main())
