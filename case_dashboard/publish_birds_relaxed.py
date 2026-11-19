"""Stage and publish only new bird repeats and small unified-entry changes."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import base64,hashlib,json,re,shutil,subprocess,sys,time
import requests
from publish_github import credentials

BASE=Path(__file__).resolve().parent;ROOT=BASE.parent;LOCAL=BASE/'dist/birds-v6-relaxed-report'
WORK=ROOT/'github_publish/birds_relaxed_20261119';STAGE=WORK/'stage';API='https://api.github.com/repos/NanXiang-git/OmniALE_v2'
TAG='birds-v6-sol-relaxed-assets-20261119'
def write(p,v):p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(v,ensure_ascii=False,indent=2),encoding='utf8')
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def client():
    s=requests.Session();s.trust_env=False;s.headers.update({'Authorization':'Bearer '+credentials(),'Accept':'application/vnd.github+json'});return s
def req(s,method,path,**kw):
    for attempt in range(3):
        try:
            r=s.request(method,API+path,timeout=(20,120),**kw);r.raise_for_status();return r.json()
        except (requests.ConnectionError,requests.Timeout):
            if attempt==2:raise
            time.sleep(3)
def stage():
    s=client();base=json.loads((WORK/'base.json').read_text(encoding='utf8'))['head']
    commit=req(s,'GET','/git/commits/'+base);tree=req(s,'GET','/git/trees/'+commit['tree']['sha']+'?recursive=1');assert not tree.get('truncated')
    write(WORK/'base.json',{'head':base,'tree':commit['tree']['sha'],'entries':tree['tree']})
    # Build reviewable previews before publication.
    out=STAGE/'case_dashboard/dist/birds-v6-relaxed-report';out.mkdir(parents=True,exist_ok=True)
    manifest=json.loads((LOCAL/'publication-manifest.json').read_text(encoding='utf8'))
    large=[r for r in manifest['files'] if r['bytes']>5_000_000 and Path(r['path']).suffix in ['.mp4','.wav']]
    for row in manifest['files']:
        if row in large:continue
        dst=out/row['path'];dst.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(LOCAL/row['path'],dst)
    previews={}
    def preview(row):
        rel='web-media/'+row['sha256'][:20]+'.mp4';p=out/rel;p.parent.mkdir(exist_ok=True)
        if not p.exists():subprocess.run(['ffmpeg','-v','error','-y','-i',str(LOCAL/row['path']),'-vf','scale=960:-2','-c:v','libx264','-preset','fast','-crf','28','-maxrate','900k','-bufsize','1800k','-c:a','aac','-b:a','96k','-threads','2','-movflags','+faststart',str(p)],check=True)
        subprocess.run(['ffmpeg','-v','error','-i',str(p),'-f','null','-'],check=True,capture_output=True)
        return row['path'],rel
    with ThreadPoolExecutor(max_workers=2) as pool:
        previews=dict(pool.map(preview,[r for r in large if r['path'].endswith('.mp4')]))
    mappings={}
    for row in large:
        name=row['sha256'][:20]+'-'+Path(row['path']).name
        url=f'https://github.com/NanXiang-git/OmniALE_v2/releases/download/{TAG}/{name}'
        mappings['birds-v6-relaxed-report/'+row['path']]={'url':url,'preview':'birds-v6-relaxed-report/'+previews[row['path']] if row['path'] in previews else url}
        row.update(storage='release',url=url,asset=name)
        if row['path'] in previews:row['preview']=previews[row['path']]
    for row in manifest['files']:row.setdefault('storage','repository')
    write(out/'publication-manifest.json',manifest)
    for n in [1,2]:
        p=out/f'attempt-{n:02d}/reports/index.html';text=p.read_text(encoding='utf8')
        for file in ['final.mp4','narration.wav']:
            key=f'birds-v6-relaxed-report/attempt-{n:02d}/results/sol/{file}';mapping=mappings[key]
            text=text.replace(f'href="../results/sol/{file}"',f'href="{mapping["url"]}"')
            if file.endswith('.mp4'):text=text.replace(f'src="../results/sol/{file}"',f'src="../../{previews[f"attempt-{n:02d}/results/sol/{file}"]}"')
        text=text.replace('<h2 id="film">','<p class="muted">在线播放为压缩浏览副本；下载链接提供封存原件。原始哈希见 <a href="../../publication-manifest.json">发布清单</a>。</p><h2 id="film">')
        p.write_text(text,encoding='utf8')
    # Preserve current hosted mappings and all unrelated entry scripts.
    remote=WORK/'remote/case_dashboard/dist'
    integration=(BASE/'dist/birds-case/integration.js').read_text(encoding='utf8')
    old=(remote/'birds-case/integration.js').read_text(encoding='utf8')
    start=old.index('  const assets =');end=old.index('  const models =',start)
    helper=old[start:end]
    helper=helper.replace('  const media =','  Object.assign(assets, '+json.dumps(mappings)+');\n  const media =') if '  const media =' in helper else helper
    if 'Object.assign(assets' not in helper:helper=helper+'  Object.assign(assets, '+json.dumps(mappings)+');\n'
    integration=integration.replace('  const models =',helper+'  const models =')
    integration=integration.replace('src="${folder}/results/${owner}/final.mp4"','src="${media(`${folder}/results/${owner}/final.mp4`)}"').replace('href="${folder}/results/${owner}/final.mp4"','href="${original(`${folder}/results/${owner}/final.mp4`)}"')
    dest=STAGE/'case_dashboard/dist/birds-case';dest.mkdir(parents=True,exist_ok=True);(dest/'integration.js').write_text(integration,encoding='utf8');shutil.copy2(BASE/'dist/birds-case/styles.css',dest/'styles.css')
    index=(remote/'index.html').read_text(encoding='utf8')
    assert 'birds-case/integration.js' in index
    index=index.replace('<script defer src="birds-case/integration.js">','<script defer src="birds-v6-relaxed-report/integration.js"></script>\n  <script defer src="birds-case/integration.js">')
    (STAGE/'case_dashboard/dist/index.html').write_text(index,encoding='utf8')
    for rel in ['birds_relaxed_report.py','publish_birds_relaxed.py','birds_case.py','qa/birds-case.mjs']:
        p=STAGE/'case_dashboard'/rel;p.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(BASE/rel,p)
    files=[p.relative_to(STAGE).as_posix() for p in STAGE.rglob('*') if p.is_file()]
    write(WORK/'plan.json',{'base':base,'files':files,'assets':mappings,'release_files':large,'previews':previews,'scope':'Two Sol high relaxed-network repeats; preserve previous models, answers, scores and unrelated dashboard content.'})
    print('STAGED',len(files),'FILES',len(large),'ORIGINALS',flush=True)

def publish():
    plan=json.loads((WORK/'plan.json').read_text(encoding='utf8'));base=json.loads((WORK/'base.json').read_text(encoding='utf8'));s=client()
    qa=json.loads((WORK/'qa.json').read_text(encoding='utf8'));assert qa['passed']
    assert all(sha(STAGE/rel)==qa['hashes'][rel] for rel in plan['files']),'Staged files changed after QA'
    assert req(s,'GET','/git/ref/heads/main')['object']['sha']==plan['base'],'Remote advanced; rebase narrow changes before publish'
    r=s.get(API+'/releases/tags/'+TAG,timeout=45)
    if r.status_code==404:release=req(s,'POST','/releases',json={'tag_name':TAG,'target_commitish':plan['base'],'name':'Birds V6 Sol high · relaxed network · two independent repeats','body':'Sealed original videos and narration from two independent gpt-6.1-sol high Codex attempts with no total deadline. Same V6 input and scoring; relaxed general-site restrictions with original-source protection. Scores 25.8611 and 26.9847. All attempts preserved. Browser previews are not scoring originals.','draft':False})
    else:r.raise_for_status();release=r.json()
    existing={x['name']:x for x in req(s,'GET',f'/releases/{release["id"]}/assets?per_page=100')}
    def upload(row):
        name=row['asset'];a=existing.get(name)
        if not a:
            c=client();data=(LOCAL/row['path']).read_bytes();assert hashlib.sha256(data).hexdigest()==row['sha256']
            r=c.post(release['upload_url'].split('{')[0],params={'name':name},data=data,headers={'Content-Type':'application/octet-stream'},timeout=(30,240));r.raise_for_status();a=r.json()
        assert a['size']==row['bytes'] and a['state']=='uploaded';assert a.get('digest') in [None,'sha256:'+row['sha256']]
        print('ORIGINAL_VERIFIED',row['path'],flush=True)
    with ThreadPoolExecutor(max_workers=2) as pool:list(pool.map(upload,plan['release_files']))
    statepath=WORK/'publication.json';state=json.loads(statepath.read_text(encoding='utf8')) if statepath.exists() else {'base':plan['base'],'blobs':{}}
    assert state['base']==plan['base'];entries=[]
    for i,rel in enumerate(plan['files']):
        data=(STAGE/rel).read_bytes();oid=hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()
        if state['blobs'].get(rel)!=oid:
            obj=req(s,'POST','/git/blobs',json={'content':base64.b64encode(data).decode(),'encoding':'base64'});assert obj['sha']==oid;state['blobs'][rel]=oid;write(statepath,state)
        entries.append({'path':rel,'mode':'100644','type':'blob','sha':oid})
        if i%10==0:print('BLOBS',i+1,'/',len(plan['files']),flush=True)
    tree=req(s,'POST','/git/trees',json={'base_tree':base['tree'],'tree':entries})
    commit=req(s,'POST','/git/commits',json={'message':'Add two V6 Sol relaxed-network repeat results and evidence to bird dashboard','tree':tree['sha'],'parents':[plan['base']]})
    assert req(s,'GET','/git/ref/heads/main')['object']['sha']==plan['base'],'Remote advanced before commit; no force push'
    req(s,'PATCH','/git/refs/heads/main',json={'sha':commit['sha'],'force':False})
    state.update(remote_commit=commit['sha'],tree=tree['sha'],release=release['html_url'],published=True);write(statepath,state);print('PUBLISHED',commit['sha'],flush=True)
if __name__=='__main__':
    {'stage':stage,'publish':publish}[sys.argv[1]]()
