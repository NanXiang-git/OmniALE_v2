#!/usr/bin/env python3
"""Write SRT and matching ASS from the shared frozen cue table."""
from pathlib import Path
import json,argparse

def stamp(t,ass=False):
 base=100 if ass else 1000;n=round(t*base);h,n=divmod(n,3600*base);m,n=divmod(n,60*base);s,n=divmod(n,base)
 return f'{h}:{m:02}:{s:02}.{n:02}' if ass else f'{h:02}:{m:02}:{s:02},{n:03}'
def write(p):
 q=json.load(open(p/'assets/subtitle_cues.json'))
 for lang in ['zh','en']:
  s=[]
  for i,c in enumerate(q,1):s.extend([str(i),stamp(c['start'])+' --> '+stamp(c['end']),c[lang],''])
  (p/f'subtitles_{lang}.srt').write_text('\n'.join(s),encoding='utf8')
 header=(p/'bilingual.ass').read_text().split('[Events]')[0]+'[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n'
 for c in q:
  for lang in ['zh','en']:
   text=c[lang].replace('\n',r'\N')
   if c['screen']:
    y=392 if lang=='zh' else 420;text=r'{\an2\pos(640,'+str(y)+r')\fs'+('25' if lang=='zh' else '20')+'}'+text
   header+=f"Dialogue: {1 if c['screen'] else 0},{stamp(c['start'],True)},{stamp(c['end'],True)},{lang.upper()},{c['speaker']},0,0,0,,{text}\n"
 (p/'bilingual.ass').write_text(header,encoding='utf8')
if __name__=='__main__':
 a=argparse.ArgumentParser();a.add_argument('--submission',type=Path,default=Path(__file__).resolve().parent);args=a.parse_args();write(args.submission)
