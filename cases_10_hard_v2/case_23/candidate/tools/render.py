from pathlib import Path
import sys,argparse,subprocess,tempfile,cv2
from common import *
def render(sub,source,teacher):
 sub=Path(sub).resolve();source=Path(source).resolve();teacher=Path(teacher).resolve();project(sub,source,teacher)
 ps,cs,mapped,desc,mix=assemble(sub,loadwav(teacher));writewav(sub/'teacher_mapped.wav',mapped);writewav(sub/'description.wav',desc);(sub/'description.vtt').write_text(vtt(cs),encoding='utf-8')
 indices=frame_map(ps);cap=cv2.VideoCapture(str(source));last=-1;frame=None
 with tempfile.TemporaryDirectory(prefix='case23_render_',dir=sub.parent) as temp:
  audio=Path(temp)/'mix.wav';writewav(audio,mix)
  p=subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pixel_format','bgr24','-video_size',f'{WIDTH}x{HEIGHT}','-framerate',str(FPS),'-i','-','-i',str(audio),'-i',str(sub/'description.vtt'),'-map','0:v:0','-map','1:a:0','-map','2:s:0','-map_metadata','-1','-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-c:s','mov_text','-metadata:s:s:0','language=zho','-movflags','+faststart',str(sub/'accessible.mp4')],stdin=subprocess.PIPE)
  try:
   for idx in indices:
    if idx!=last:
     if idx!=last+1:raise ValueError('Unexpected frame sequence')
     ok,frame=cap.read()
     if not ok:raise ValueError('Source video ended early')
     last=idx
    p.stdin.write(frame.tobytes())
  finally:p.stdin.close();cap.release()
  if p.wait()!=0:raise RuntimeError('FFmpeg failed')
 print(f'Rendered {len(indices)} frames / {len(mix)/SR:.2f}s; no candidate decisions were generated.')
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--submission',required=True);p.add_argument('--source',default=str(Path(__file__).resolve().parents[1]/'input/lesson_v2.mp4'));p.add_argument('--teacher',default=str(Path(__file__).resolve().parents[1]/'input/teacher.wav'));a=p.parse_args();render(a.submission,a.source,a.teacher)

