"""Optional local Windows TTS for solvers; no target-answer text is supplied.
Usage: python tts.py --text-file UTF8.txt --voice V01 --output output.wav
"""
from pathlib import Path
import argparse,json,subprocess,tempfile
from media import ROOT,ff,write_json
VOICES={
 'V01':('Microsoft Huihui Desktop',0,1.0),
 'V02':('Microsoft Kangkang',0,1.0),
 'V03':('Microsoft Yaoyao',0,1.0),
 'V04':('Microsoft Huihui Desktop',0,.90),
 'V05':('Microsoft Kangkang',0,.88),
 'V06':('Microsoft Yaoyao',0,1.10),
 'V07':('Microsoft Huihui Desktop',1,1.08),
 'V08':('Microsoft Kangkang',1,1.10),
}
def synth(text,voice,output,english=False):
 output=Path(output).resolve();output.parent.mkdir(parents=True,exist_ok=True)
 base,rate,pitch=('Microsoft Zira Desktop',0,1.0) if english else VOICES[voice]
 cache=output.parent/'_tts_tmp';cache.mkdir(exist_ok=True)
 with tempfile.TemporaryDirectory(dir=cache) as tmp:
  tmp=Path(tmp);job=tmp/'job.json';wav=tmp/'voice.wav'
  write_json(job,{'text':text,'voice':base,'rate':rate,'output':str(wav)})
  ps=tmp/'voice.ps1';ps.write_text('''Add-Type -AssemblyName System.Speech
$j=Get-Content -LiteralPath $args[0] -Raw -Encoding UTF8 | ConvertFrom-Json
$s=New-Object System.Speech.Synthesis.SpeechSynthesizer
$s.SelectVoice($j.voice);$s.Rate=$j.rate;$s.SetOutputToWaveFile($j.output);$s.Speak($j.text);$s.Dispose()
''',encoding='utf-8-sig')
  subprocess.run(['powershell','-NoProfile','-ExecutionPolicy','Bypass','-File',str(ps),str(job)],check=True,capture_output=True)
  ff('-i',wav,'-af',f'aresample=48000,asetrate={round(48000*pitch)},aresample=48000,atempo={1/pitch}', '-c:a','pcm_s16le',output)
 return output
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--text-file',required=True);p.add_argument('--voice',choices=VOICES,default='V01');p.add_argument('--output',required=True);a=p.parse_args();synth(Path(a.text_file).read_text(encoding='utf8'),a.voice,a.output)
