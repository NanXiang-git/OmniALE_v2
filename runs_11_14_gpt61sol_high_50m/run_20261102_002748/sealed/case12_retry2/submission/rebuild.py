#!/usr/bin/env python3
"""Burn the submitted ASS onto the original video, entirely offline."""
import argparse,pathlib,subprocess,os

def main():
 p=argparse.ArgumentParser();p.add_argument('--input',required=True);p.add_argument('--submission',required=True);p.add_argument('--output',required=True);a=p.parse_args()
 src=pathlib.Path(a.input).resolve();sub=pathlib.Path(a.submission).resolve();out=pathlib.Path(a.output).resolve()
 if src.is_dir():
  candidates=[src/'source.mp4',src/'input'/'source.mp4'];src=next((x for x in candidates if x.is_file()),candidates[0])
 if not src.is_file():raise SystemExit(f'Missing original input: {src}')
 out.parent.mkdir(parents=True,exist_ok=True)
 # Relative paths avoid ffmpeg filter escaping of host paths. All temporary
 # files are kept in the supplied output directory on the D-backed workspace.
 env=os.environ.copy();env['TMPDIR']=str(out.parent)
 # The filter expression is fixed text; paths are passed as argv entries.
 # Running in the submission directory makes this portable to relocated inputs.
 cmd=['ffmpeg','-hide_banner','-y','-i',str(src),'-map','0:v:0','-map','0:a:0',
      '-vf','ass=interview.ass:fontsdir=assets','-c:v','libx264','-preset','veryfast',
      '-crf','0','-pix_fmt','yuv420p','-threads','4','-c:a','copy',
      '-map_metadata','0','-movflags','+faststart',str(out)]
 subprocess.run(cmd,cwd=sub,env=env,check=True)
if __name__=='__main__':main()
