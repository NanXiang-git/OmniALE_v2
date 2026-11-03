#!/usr/bin/env python3
"""Export ASS/SRT and their actual ID mapping from subtitle_events.json."""
import json,pathlib,textwrap
ROOT=pathlib.Path(__file__).resolve().parent

def stamp(cs,srt=False):
 h,rem=divmod(int(cs),360000);m,rem=divmod(rem,6000);s,c=divmod(rem,100)
 return f'{h:02}:{m:02}:{s:02},{c*10:03}' if srt else f'{h}:{m:02}:{s:02}.{c:02}'

def lines(e):
 return [e['speaker_id']+': '+x for x in e['lines']]

def main():
 events=json.loads((ROOT/'subtitle_events.json').read_text())['events']
 events.sort(key=lambda e:(e['start'],e['speaker_id'],e['end']))
 for i,e in enumerate(events,1):e['ass_id']=str(i);e['srt_ids']=[];e['sc']=round(e['start']*100);e['ec']=round(e['end']*100)
 header='''[Script Info]
Title: Four-person meeting | supplied reordered source
ScriptType: v4.00+
PlayResX: 704
PlayResY: 576
WrapStyle: 2
ScaledBorderAndShadow: yes
YCbCr Matrix: TV.601

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
'''
 colors={'A':'&H009EEFFF','B':'&H00FFE3AB','C':'&H00E2FFE0','D':'&H00E6C6FF'}
 for s in 'ABCD':header+=f'Style: {s},DejaVu Sans,20,{colors[s]},&H000000FF,&H00101010,&H00101010,0,0,0,0,100,100,0,0,3,2,0,8,16,16,0,1\n'
 header+='\n[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n'
 ass=[]
 for e in events:
  s=e['speaker_id'];y=394+'ABCD'.index(s)*44
  body='\\N'.join(lines(e));body=body.replace('{','(').replace('}',')')
  ass.append(f"Dialogue: 0,{stamp(e['sc'])},{stamp(e['ec'])},{s},{s},0,0,0,,{{\\an8\\pos(352,{y})\\q2}}{body}")
 (ROOT/'interview.ass').write_text(header+'\n'.join(ass)+'\n',encoding='utf-8-sig')
 boundaries=sorted({c for e in events for c in (e['sc'],e['ec'])});srt=[];cue=0
 for a,b in zip(boundaries,boundaries[1:]):
  active=[e for e in events if e['sc']<=a and e['ec']>=b]
  if not active:continue
  cue+=1;active.sort(key=lambda e:e['speaker_id']);body=[]
  for e in active:body.extend(lines(e));e['srt_ids'].append(str(cue))
  srt.append(f"{cue}\n{stamp(a,True)} --> {stamp(b,True)}\n"+'\n'.join(body))
 (ROOT/'interview.srt').write_text('\n\n'.join(srt)+'\n',encoding='utf-8-sig')
 mapping={'events':[dict(utterance_ids=e['utterance_ids'],speaker_id=e['speaker_id'],start=e['sc']/100,end=e['ec']/100,ass_event_ids=[e['ass_id']],srt_cue_ids=e['srt_ids']) for e in events]}
 (ROOT/'alignment.json').write_text(json.dumps(mapping,ensure_ascii=False,indent=2)+'\n')
 print(f'Exported {len(events)} ASS events, {cue} SRT time units.')
if __name__=='__main__':main()
