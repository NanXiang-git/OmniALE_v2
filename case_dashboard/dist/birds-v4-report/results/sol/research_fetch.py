import requests,json,time,pathlib,urllib.parse
ROOT=pathlib.Path('/workspace/scratch');LOG=ROOT/'network_new.jsonl'
BLOCK=['macaulaylibrary.org','birds.cornell.edu','ebird.org','dearkitty1.wordpress.com','youtube.com','youtu.be','googlevideo.com','ytimg.com','wikimedia.org','wikipedia.org','wikidata.org','wikimediafoundation.org','picryl.com','getarchive.net','archive.org','fws.gov','nanxiang-git.github.io']
def fetch(url,path,purpose):
 orig=url;record={'time_unix':time.time(),'url':orig,'purpose':purpose}
 try:
  for n in range(8):
   host=urllib.parse.urlsplit(url).hostname or ''
   if any(host==b or host.endswith('.'+b) for b in BLOCK):raise ValueError('Blocked domain; not accessed')
   r=requests.get(url,timeout=30,allow_redirects=False)
   if r.is_redirect:url=urllib.parse.urljoin(url,r.headers['Location']);continue
   break
  record.update(status=r.status_code,final_url=url,bytes=len(r.content))
  if path and r.status_code==200:pathlib.Path(path).write_bytes(r.content)
  return r
 except Exception as e:record['error']=str(e);raise
 finally:
  with LOG.open('a') as f:f.write(json.dumps(record,ensure_ascii=False)+'\n')
