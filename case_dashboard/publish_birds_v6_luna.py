"""Update only the bird report and its entry in an isolated existing-repo worktree."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor,as_completed
import hashlib,json,shutil,subprocess,sys,time
import requests
from publish_github import credentials

BASE=Path(__file__).resolve().parent
ROOT=BASE.parent
LOCAL=BASE/'dist/birds-v6-luna-report'
CHECKOUT=ROOT/'github_publish/OmniALE_birds'
DIST=CHECKOUT/'case_dashboard/dist'
OUT=DIST/'birds-v6-luna-report'
API='https://api.github.com/repos/NanXiang-git/OmniALE_v2'
TAG='birds-v6-luna-assets-20261117'

def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2),encoding='utf8')
def main():
    token=credentials()
    def client():
        s=requests.Session();s.trust_env=False;s.headers.update({'Authorization':'Bearer '+token,'Accept':'application/vnd.github+json'});return s
    s=client();r=s.get(API+'/releases/tags/'+TAG,timeout=45)
    if r.status_code==404:
        r=s.post(API+'/releases',json={'tag_name':TAG,'target_commitish':'main','name':'Birds V6 Luna · same-condition autonomous narration','body':'Independent GPT-6 Luna / high / Codex run with a 60-minute cap, using V6 Sol task, scoring, software and proxy configuration; user-provided Luna credentials and a fresh workspace. Autonomous narration and scoring preserved; V4 has confirmed source exposure. Original inputs and sealed answers; web video previews are for browsing only. See dashboard manifest for checksums.','draft':False},timeout=45)
    r.raise_for_status();release=r.json()
    r=s.get(API+f'/releases/{release["id"]}/assets?per_page=100',timeout=45);r.raise_for_status();existing={x['name']:x for x in r.json()}
    manifest=json.loads((LOCAL/'publication-manifest.json').read_text(encoding='utf8'))
    previous=json.loads((DIST/'birds-v6-report/publication-manifest.json').read_text(encoding='utf8'))
    reusable={x['sha256']:x for x in previous['files'] if x.get('storage')=='release'}
    big=[x for x in manifest['files'] if x['bytes']>5_000_000]
    def upload(row):
        old=reusable.get(row['sha256'])
        if old and old['bytes']==row['bytes']:
            print('REUSE_VERIFIED_ORIGINAL',row['path'],flush=True)
            return row['path'],old['url']
        name=row['sha256'][:20]+'-'+Path(row['path']).name
        if name in existing:
            a=existing[name];assert a['state']=='uploaded' and a['size']==row['bytes']
            if a.get('digest') not in (None,'sha256:'+row['sha256']):
                response=client().delete(API+f'/releases/assets/{a["id"]}',timeout=45);response.raise_for_status()
                del existing[name]
        if name not in existing:
            print('UPLOAD',row['path'],row['bytes'],flush=True)
            c=client()
            data=(LOCAL/row['path']).read_bytes()
            assert hashlib.sha256(data).hexdigest()==row['sha256']
            response=c.post(release['upload_url'].split('{')[0],params={'name':name},data=data,headers={'Content-Type':'application/octet-stream','Content-Length':str(row['bytes'])},timeout=(45,240))
            response.raise_for_status();a=response.json()
        assert a.get('digest') in (None,'sha256:'+row['sha256'])
        print('VERIFIED',row['path'],flush=True)
        return row['path'],a['browser_download_url']
    originals={}
    with ThreadPoolExecutor(max_workers=3) as pool:
        for f in as_completed([pool.submit(upload,row) for row in big]):
            rel,url=f.result();originals[rel]=url
    OUT.mkdir(parents=True,exist_ok=True)
    for p in LOCAL.rglob('*'):
        if not p.is_file():continue
        rel=p.relative_to(LOCAL).as_posix()
        if rel in originals:continue
        dst=OUT/rel;dst.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(p,dst)
    previews={}
    def preview(row):
        rel='web-media/'+row['sha256'][:20]+'.mp4';dst=OUT/rel;dst.parent.mkdir(exist_ok=True)
        old=reusable.get(row['sha256'])
        if not dst.exists() and old and old.get('preview'):
            shutil.copy2(DIST/'birds-v6-report'/old['preview'],dst)
        if not dst.exists():subprocess.run(['ffmpeg','-v','error','-y','-i',str(LOCAL/row['path']),'-vf','scale=960:-2','-c:v','libx264','-preset','fast','-crf','28','-maxrate','900k','-bufsize','1800k','-c:a','aac','-b:a','96k','-threads','2','-movflags','+faststart',str(dst)],check=True)
        return row['path'],'../'+rel
    with ThreadPoolExecutor(max_workers=3) as pool:
        for f in as_completed([pool.submit(preview,row) for row in big if row['path'].endswith('.mp4')]):
            rel,url=f.result();previews[rel]=url
    p=OUT/'reports/index.html';text=p.read_text(encoding='utf8')
    helpers='const ORIGINAL_URLS='+json.dumps(originals)+';const MEDIA_URLS='+json.dumps({**originals,**previews})+';const assetKey=u=>new URL(u,"https://export/reports/index.html").pathname.slice(1);const downloadUrl=u=>ORIGINAL_URLS[assetKey(u)]||u;const mediaUrl=u=>MEDIA_URLS[assetKey(u)]||u;\n'
    text=text.replace('const $=s=>',helpers+'const $=s=>')
    text=text.replace('href="${esc(url)}"','href="${esc(downloadUrl(url))}"').replace('src="${esc(src)}"','src="${esc(mediaUrl(src))}"')
    text=text.replace('location.hash=tab}',"document.querySelectorAll('#content audio').forEach(n=>n.setAttribute('src',mediaUrl(n.getAttribute('src'))));location.hash=tab}")
    text=text.replace('<main>','<main><p class="muted">在线播放视频是压缩浏览副本，不能用于重新判分；原始文件保持不变，保存在同仓库 Releases。<a href="../publication-manifest.json">原件哈希与下载清单</a></p>')
    p.write_bytes(text.encode('utf8'))
    for row in manifest['files']:
        row['storage']='release' if row['path'] in originals else 'repository'
        if row['path'] in originals:row['url']=originals[row['path']]
        if row['path'] in previews:row['preview']=previews[row['path']].removeprefix('../')
    manifest['release']=release['html_url'];manifest['previews_only_for_browsing']=True
    for row in manifest['files']:
        deployed=OUT/row['path']
        if deployed.is_file():
            row['deployed_sha256']=hashlib.sha256(deployed.read_bytes()).hexdigest()
            row['deployed_bytes']=deployed.stat().st_size
    write(OUT/'publication-manifest.json',manifest)
    shutil.copy2(LOCAL/'comparison.json',OUT/'comparison.json')
    # Apply only our small integration changes, preserving existing hosted mappings.
    p=DIST/'index.html';text=p.read_text(encoding='utf8')
    if 'birds-v6-luna-report/integration.js' not in text:text=text.replace('<script defer src="app.js">','<script defer src="birds-v6-luna-report/integration.js"></script>\n  <script defer src="app.js">')
    p.write_bytes(text.encode('utf8'))
    for name in ['birds_v6_luna_report.py','publish_birds_v6_luna.py']:shutil.copy2(BASE/name,CHECKOUT/'case_dashboard'/name)
    qa=CHECKOUT/'case_dashboard/qa';qa.mkdir(exist_ok=True);shutil.copy2(BASE/'qa/birds-v6-luna-integration.cjs',qa/'birds-v6-luna-integration.cjs')
    summary=json.loads((LOCAL/'reports/SUMMARY.json').read_text(encoding='utf8'))
    write(CHECKOUT/'birds-v6-luna-publication.json',{'release':release['html_url'],'original_files':len(manifest['files']),'release_files':len(originals),'previews':len(previews),'scope':'Luna evidence and a second result under the existing V6 task; all Sol answers, scores and prior experiments preserved.','scores':{k:v['score'] for k,v in summary.items()}})
    print('READY',release['html_url'],flush=True)
if __name__=='__main__':main()
