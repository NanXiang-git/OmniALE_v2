param([Parameter(Mandatory=$true)][string]$TextFile,[Parameter(Mandatory=$true)][string]$Output,[ValidateRange(-1,3)][int]$Rate=0)
$ErrorActionPreference='Stop'
$dest=[IO.Path]::GetFullPath($Output)
if(-not $dest.StartsWith('D:\omniALE\',[StringComparison]::OrdinalIgnoreCase)){throw 'Output must be under D:\omniALE'}
$folder=[IO.Path]::GetDirectoryName($dest);New-Item -ItemType Directory -Force $folder | Out-Null
$raw=Join-Path $folder ([IO.Path]::GetRandomFileName()+'.wav')
Add-Type -AssemblyName System.Speech
$voice=New-Object System.Speech.Synthesis.SpeechSynthesizer
try{$voice.SelectVoice('Microsoft Huihui Desktop');$voice.Rate=$Rate;$voice.SetOutputToWaveFile($raw);$voice.Speak([IO.File]::ReadAllText([IO.Path]::GetFullPath($TextFile),[Text.Encoding]::UTF8))}finally{$voice.Dispose()}
try{& ffmpeg -v error -y -i $raw -ar 48000 -ac 1 -af 'volume=0.65' -c:a pcm_s16le $dest;if($LASTEXITCODE -ne 0){throw 'FFmpeg resampling failed'}}finally{Remove-Item -LiteralPath $raw}
