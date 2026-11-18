"""Proxy-only, redirect-checked independent reference retrieval; no media upload."""
import hashlib, re, sys, time
from html.parser import HTMLParser
from urllib.parse import urlparse, urljoin
from pathlib import Path
import requests
from audit import record

DENY=['macaulaylibrary.org','birds.cornell.edu','ebird.org','dearkitty1.wordpress.com','youtube.com','youtu.be','googlevideo.com','ytimg.com','wikimedia.org','wikipedia.org','wikidata.org','wikimediafoundation.org','picryl.com','getarchive.net','archive.org','fws.gov','nanxiang-git.github.io']
def allowed(u):
    p=urlparse(u); h=(p.hostname or '').lower()
    return p.scheme in ('http','https') and not any(h==d or h.endswith('.'+d) for d in DENY) and not ('xeno-canto.org' in h and '238544' in u) and not ('flickr.com' in h and '7245581374' in u)

class Text(HTMLParser):
    def __init__(self): super().__init__(); self.skip=0; self.lines=[]
    def handle_starttag(self,t,a):
        if t in ('script','style'):self.skip+=1
        if t in ('p','h1','h2','h3','li','br'):self.lines.append('\n')
    def handle_endtag(self,t):
        if t in ('script','style'):self.skip=max(0,self.skip-1)
    def handle_data(self,d):
        if not self.skip:self.lines.append(d)

def fetch(url, name):
    started=time.time(); initial=url
    try:
        for _ in range(7):
            if not allowed(url):raise ValueError('Prohibited URL; abandoned before request')
            r=requests.get(url,timeout=25,allow_redirects=False)
            record('network_response',name,time.time(),url=url,status=r.status_code,sha256=hashlib.sha256(r.content).hexdigest())
            if r.is_redirect:
                url=urljoin(url,r.headers['Location']);continue
            break
        base=Path('/workspace/scratch')/name
        base.with_suffix('.html').write_bytes(r.content)
        parser=Text();parser.feed(r.text)
        txt=re.sub(r'[ \t\r\f\v]+',' ',''.join(parser.lines));txt=re.sub(r'\n\s*\n+','\n',txt)
        base.with_suffix('.txt').write_text(txt)
        record('network',name,started,url=initial,final_url=url,status=r.status_code,bytes=len(r.content),note='Only fetched document; no linked images, audio, frames or scripts fetched.')
        print(name,r.status_code,txt[:18000])
        return r
    except Exception as exc:
        record('network_failure',name,started,url=initial,error=str(exc),action='Abandoned this request; no bypass attempted.')
        print(name,type(exc).__name__,str(exc))

if __name__=='__main__':fetch(sys.argv[1],sys.argv[2])
