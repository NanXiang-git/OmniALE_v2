#!/usr/bin/env python3
"""Microsoft Edge public neural TTS via websocket-client, with explicit environment proxy.
Only locally authored narration text is sent. No source video or audio is uploaded.
Protocol parameters follow installed edge-tts 7.3.1. No private credentials.
"""
import os,time,hashlib,uuid,json,datetime,urllib.parse,html,pathlib
import websocket
TOKEN='6A5AA1D4EAFF4E9FB37E23D68491D6F4'
VERSION='143.0.3650.75'
VOICE='zh-CN-XiaoxiaoNeural'
def synthesize(text,out,voice=VOICE,rate='-4%'):
 proxy=urllib.parse.urlparse(os.environ.get('HTTPS_PROXY') or os.environ['HTTP_PROXY'])
 ticks=time.time()+11644473600;ticks-=ticks%300;ticks*=1e7
 from edge_token import DRM
 gec=DRM.generate_sec_ms_gec()
 url=f'wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken={TOKEN}&ConnectionId={uuid.uuid4().hex}&Sec-MS-GEC={gec}&Sec-MS-GEC-Version=2-{VERSION}'
 now=datetime.datetime.now(datetime.timezone.utc).strftime('%a %b %d %Y %H:%M:%S GMT+0000 (Coordinated Universal Time)')
 ws=websocket.create_connection(url,timeout=60,http_proxy_host=proxy.hostname,http_proxy_port=proxy.port,proxy_type='http',origin='chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold',header={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0','Pragma':'no-cache','Cache-Control':'no-cache','Cookie':f'muid={uuid.uuid4().hex.upper()};'})
 cfg={'context':{'synthesis':{'audio':{'metadataoptions':{'sentenceBoundaryEnabled':'false','wordBoundaryEnabled':'true'},'outputFormat':'audio-24khz-48kbitrate-mono-mp3'}}}}
 ws.send(f'X-Timestamp:{now}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n'+json.dumps(cfg)+'\r\n')
 ssml=f'<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="zh-CN"><voice name="{voice}"><prosody pitch="+0Hz" rate="{rate}" volume="+0%">{html.escape(text)}</prosody></voice></speak>'
 ws.send(f'X-RequestId:{uuid.uuid4().hex}\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:{now}Z\r\nPath:ssml\r\n\r\n{ssml}')
 data=bytearray();metadata=[]
 try:
  while True:
   op,msg=ws.recv_data()
   if op==2:
    n=int.from_bytes(msg[:2],'big');data.extend(msg[n+2:])
   elif op==1:
    if isinstance(msg,bytes):msg=msg.decode()
    if 'Path:audio.metadata' in msg:metadata.append(json.loads(msg.split('\r\n\r\n',1)[1]))
    if 'Path:turn.end' in msg:break
   elif op==8:break
 finally:ws.close()
 if len(data)<1000:raise RuntimeError(f'No usable speech audio: {len(data)} bytes')
 pathlib.Path(out).write_bytes(data)
 pathlib.Path(str(out)+'.json').write_text(json.dumps({'voice':voice,'rate':rate,'text':text,'metadata':metadata},ensure_ascii=False,indent=2))
 return len(data)
if __name__=='__main__':
 import argparse
 p=argparse.ArgumentParser();p.add_argument('--text');p.add_argument('--out');p.add_argument('--voice',default=VOICE);p.add_argument('--rate',default='-4%');a=p.parse_args();print(synthesize(a.text,a.out,a.voice,a.rate))
