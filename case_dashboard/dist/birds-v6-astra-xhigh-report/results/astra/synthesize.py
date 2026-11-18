"""Generate ONLY self-authored Mandarin text via Edge neural TTS through HTTP proxy.
Run: python3 synthesize.py narration_plan.json
No source media is opened by this script or sent to the TTS service.
"""
import asyncio, hashlib, json, os, sys, time
from pathlib import Path
import edge_tts
from audit import record, run

VOICE='zh-CN-XiaoxiaoNeural'
RATE='-5%'
OUT=Path('/workspace/scratch/tts')

async def generate(item):
    stem=OUT/item['id']; mp3=stem.with_suffix('.mp3')
    signature=hashlib.sha256((VOICE+RATE+item['text']).encode()).hexdigest()
    meta=stem.with_suffix('.json')
    if meta.exists() and json.loads(meta.read_text()).get('signature')==signature:
        print(item['id'],'cached',flush=True);return
    started=time.time(); boundaries=[]
    try:
        speech=edge_tts.Communicate(item['text'],voice=VOICE,rate=RATE,
            boundary='WordBoundary',proxy=os.environ['HTTPS_PROXY'],
            connect_timeout=20,receive_timeout=60)
        with mp3.open('wb') as f:
            async for chunk in speech.stream():
                if chunk['type']=='audio':f.write(chunk['data'])
                elif chunk['type'] in ('WordBoundary','SentenceBoundary'):
                    boundaries.append(chunk)
        meta.write_text(json.dumps(dict(signature=signature,voice=VOICE,rate=RATE,
            text=item['text'],boundaries=boundaries),ensure_ascii=False,indent=2))
        run('Decode synthesized utterance '+item['id'],['ffmpeg','-v','error','-y',
            '-i',str(mp3),'-ar','48000','-ac','1','-c:a','pcm_s16le',str(stem.with_suffix('.wav'))])
        record('speech_generation',item['id'],started,text=item['text'],voice=VOICE,
            rate=RATE,proxy_environment='HTTPS_PROXY',bytes=mp3.stat().st_size,
            sha256=hashlib.sha256(mp3.read_bytes()).hexdigest(),
            note='Only authored text submitted; no reference or source media transmitted. No post-synthesis time stretching.')
        print(item['id'],'generated',flush=True)
    except Exception as exc:
        record('speech_generation_failure',item['id'],started,error=str(exc))
        raise

async def main():
    OUT.mkdir(parents=True,exist_ok=True)
    plan=json.loads(Path(sys.argv[1]).read_text())
    for item in plan:
        await generate(item)

if __name__=='__main__':asyncio.run(main())
