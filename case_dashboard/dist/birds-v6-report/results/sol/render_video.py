#!/usr/bin/env python3
"""Create an ASS rendering equivalent to subtitles.srt, then encode all source frames."""
import json,subprocess,sys
from pathlib import Path
R=Path('/workspace/submission');S=Path('/workspace/scratch')
subs=json.loads((R/'subtitle_timing.json').read_text())
def stamp(t):
 cs=round(t*100);h,cs=divmod(cs,360000);m,cs=divmod(cs,6000);s,cs=divmod(cs,100);return f'{h}:{m:02}:{s:02}.{cs:02}'
header='''[Script Info]
ScriptType: v4.00+
PlayResX: 1280
PlayResY: 720
WrapStyle: 2
ScaledBorderAndShadow: yes
YCbCr Matrix: TV.709

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Noto Sans SC,46,&H00FAFAFA,&H000000FF,&H00101010,&H88000000,0,0,0,0,100,100,0,0,1,2.2,0.8,2,42,42,25,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
'''
lines=[]
for sub in subs:
 text=sub['text'].replace('\n',r'\N')
 lines.append(f"Dialogue: 0,{stamp(sub['start'])},{stamp(sub['end'])},Default,,0,0,0,,{text}\n")
(R/'subtitles.ass').write_text(header+''.join(lines),encoding='utf-8')
fonts=S/'fonts';fonts.mkdir(exist_ok=True)
if not (fonts/'NotoSansSC.ttf').exists():__import__('shutil').copy2(S/'NotoSansSC.ttf',fonts/'NotoSansSC.ttf')
vf=f'ass={R}/subtitles.ass:fontsdir={fonts}'
if '--preview' in sys.argv:
 for t in [5.5,13.0,52,80.5,106.5,141.2,163.5,174.0]:
  subprocess.run(['ffmpeg','-v','error','-y','-i','/candidate/birds_source.mp4','-ss',str(t),'-vf',vf,'-frames:v','1',str(S/f'preview_{t}.jpg')],check=True)
else:
 cmd=['ffmpeg','-hide_banner','-y','-i','/candidate/birds_source.mp4','-i',str(S/'mixed.wav'),'-map','0:v:0','-map','1:a:0','-vf',vf,'-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-r','30','-fps_mode','cfr','-frames:v','5565','-c:a','aac','-b:a','192k','-ar','48000','-t','185.5','-movflags','+faststart',str(R/'final.mp4')]
 (R/'render_command.json').write_text(json.dumps(cmd,indent=2))
 subprocess.run(cmd,check=True)
