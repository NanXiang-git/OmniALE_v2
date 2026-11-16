"""Update only the bird report and its entry in an isolated existing-repo worktree."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor,as_completed
import hashlib,json,shutil,subprocess,sys,time
import requests
from publish_github import credentials

BASE=Path(__file__).resolve().parent
ROOT=BASE.parent
LOCAL=BASE/'dist/birds-v3-report'
CHECKOUT=ROOT/'github_publish/OmniALE_birds'
DIST=CHECKOUT/'case_dashboard/dist'
OUT=DIST/'birds-v3-report'
API='https://api.github.com/repos/NanXiang-git/OmniALE_v2'
TAG='birds-v3-assets-20261116'

def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2),encoding='utf8')
def main():
    token=credentials()
    def client():
        s=requests.Session();s.trust_env=False;s.headers.update({'Authorization':'Bearer '+token,'Accept':'application/vnd.github+json'});return s
    s=client();r=s.get(API+'/releases/tags/'+TAG,timeout=45)
    if r.status_code==404:
        r=s.post(API+'/releases',json={'tag_name':TAG,'target_commitish':'main','name':'Birds V3 · frozen inputs and submissions','body':'Six-clip bird science-video experiment. Original task media, frozen answers, reference and downloadable packages. Checksums are in the dashboard publication manifest. Web previews are for browsing only.','draft':False},timeout=45)
    r.raise_for_status();release=r.json()
    r=s.get(API+f'/releases/{release["id"]}/assets?per_page=100',timeout=45);r.raise_for_status();existing={x['name']:x for x in r.json()}
    manifest=json.loads((LOCAL/'publication-manifest.json').read_text(encoding='utf8'))
    big=[x for x in manifest['files'] if x['bytes']>5_000_000]
    def upload(row):
        name=row['sha256'][:20]+'-'+Path(row['path']).name
        if name in existing:
            a=existing[name];assert a['state']=='uploaded' and a['size']==row['bytes']
        else:
            print('UPLOAD',row['path'],row['bytes'],flush=True)
            c=client()
            with (LOCAL/row['path']).open('rb') as f:
                response=c.post(release['upload_url'].split('{')[0],params={'name':name},data=f,headers={'Content-Type':'application/octet-stream','Content-Length':str(row['bytes'])},timeout=(45,240))
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
    p.write_text(text,encoding='utf8')
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
    p=OUT/'integration.js';text=p.read_text(encoding='utf8')
    old='"url": "birds-v3-report/candidate/birds_source.mp4"'
    new='"url": '+json.dumps(originals['candidate/birds_source.mp4'])+', "preview": '+json.dumps('birds-v3-report/'+previews['candidate/birds_source.mp4'].removeprefix('../'))
    assert old in text;text=text.replace(old,new);p.write_text(text,encoding='utf8')
    # Apply only our small integration changes, preserving existing hosted mappings.
    p=DIST/'index.html';text=p.read_text(encoding='utf8')
    if 'birds-v3-report/integration.js' not in text:text=text.replace('<script defer src="app.js">','<script defer src="birds-v3-report/integration.js"></script>\n  <script defer src="app.js">')
    p.write_text(text,encoding='utf8')
    p=DIST/'app.js';text=p.read_text(encoding='utf8')
    text=text.replace("state.view === 'packages' ? 14 : 48","state.view === 'packages' ? data.cases.length : data.catalogue.length")
    text=text.replace("'在这里浏览 14 道困难版任务，阅读完整题面、查看输入素材与交付要求。<br>每一题，都从真实的画面、声音和制作决策开始。'","`在这里浏览 ${data.cases.length} 道正式任务，阅读完整题面、查看输入素材与交付要求。<br>每一题，都从真实的画面、声音和制作决策开始。`")
    text=text.replace('<strong>14</strong>','<strong>${data.cases.length}</strong>').replace('delivery[c.seq].map','(c.delivery || delivery[c.seq] || []).map')
    text=text.replace("${c.experimentReport ? 'API","${c.resultSummary ? esc(c.resultSummary) : c.experimentReport ? 'API")
    text=text.replace("${c.key==='task-13' ? '新版","${c.resultSummary ? esc(c.resultSummary) : c.key==='task-13' ? '新版")
    text=text.replace("${c.key==='task-13' ? '3组'","${c.resultCount ? c.resultCount+'组' : c.key==='task-13' ? '3组'")
    p.write_text(text,encoding='utf8')
    for name in ['birds_report.py','publish_birds.py']:shutil.copy2(BASE/name,CHECKOUT/'case_dashboard'/name)
    qa=CHECKOUT/'case_dashboard/qa';qa.mkdir(exist_ok=True);shutil.copy2(BASE/'qa/birds-integration.cjs',qa/'birds-integration.cjs')
    write(CHECKOUT/'birds-publication.json',{'release':release['html_url'],'original_files':len(manifest['files']),'release_files':len(originals),'previews':len(previews),'scope':'Birds V3 only. Existing hosted task mappings preserved.','scores':{'sol':23.6521,'luna':25.2222}})
    print('READY',release['html_url'],flush=True)
if __name__=='__main__':main()
