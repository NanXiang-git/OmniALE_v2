import json,re,os,math,sys
sys.path.insert(0,'/workspace/scratch')
exec(open('/workspace/scratch/pipe.py').read().split("# ---- assign groups")[0].replace("print('stream items","#print('stream items"))
S1=json.load(open('stage1.json'))
STREAM=S1['stream']
SK=[];SIP=[]
for j,it in enumerate(STREAM):
    for k in it['k']: SK.append(k);SIP.append(j)
# ---------- group assignment (same as pipe.py) ----------
res={};taken=set()
for uid in sorted(order,key=lambda u:-len(G[u]['k'])):
    gk=G[uid]['k']; n=len(gk); best=None
    for p in range(0,max(1,len(SK)-1)):
        q=min(len(SK),p+n+4)
        pr=amatch(gk,SK[p:q])
        if not pr: continue
        ii=[SIP[p+x[1]] for x in pr]
        rep=len([1 for x in ii if x in taken])/max(1,len(ii))
        pen=0.9*rep
        sc=0.78*len(pr)/n+0.22*len(pr)/(q-p)-pen
        if best is None or sc>best[0]: best=(sc,p,q,pr,ii)
    res[uid]=best
def accept(uid,thr):
    b=res[uid]
    if b is None or b[0]<thr: return None
    sc,p,q,pr,ii=b
    items=[STREAM[x] for x in ii]
    return {'s':min(x['s'] for x in items),'e':max(x['e'] for x in items),'cov':len(pr)/len(G[uid]['k']),
            'ii':ii,'sc':sc}
A={}
for uid in order:
    a=accept(uid,0.30)
    if a is None:
        b=res[uid]
        a={'s':0,'e':0,'cov':0,'ii':[],'sc':b[0] if b else -9}
        if b:
            items=[STREAM[x] for x in b[4]]
            a.update(s=min(x['s'] for x in items),e=max(x['e'] for x in items),ii=b[4],cov=len(b[3])/len(G[uid]['k']))
    A[uid]=a
# ---------- speakers: local letter -> global via probe votes ----------
ANCH=json.load(open('anchors.json'))
PR=[]
for k in range(2):
    arr=json.loads(re.findall(r'\[.*\]',json.load(open('pr%d.json'%k))['text'],re.S)[0]); PR+=[x['sp'] for x in arr]
# stream items carry sp + clip? rebuild clip id from utt alignment: use pseudo clip field; for whisper items store nearest clip by time
def clip_of(t):
    for m in CLIPS:
        if m['a']-0.4<=t<m['b']+0.4: return m['i']
    return CLIPS[-1]['i']
# letter per (clip,local) : gather from stream items by time
import collections
votes=collections.defaultdict(lambda: collections.defaultdict(list))
for an,p in zip(ANCH,PR):
    mid=(an['s']+an['e'])/2
    cand=[it for it in STREAM if it['s']<=mid<=it['e'] and it['sp']]
    if not cand:
        cand=[min(STREAM,key=lambda it:abs((it['s']+it['e'])/2-mid))]
    for it in cand:
        votes[clip_of(mid)][it['sp']].append(p)
GM={}
for ci,cnt in votes.items():
    for L,pc in cnt.items():
        pc=collections.Counter(pc)
        top=pc.most_common(1)[0][0]
        GM[(ci,L)]=top
print('probe votes:',{k:{kk:vv for kk,vv in v.items()} for k,v in votes.items()})
print('global map:',GM)
def glob(it):
    return GM.get((clip_of(it['s']),it['sp']),it['sp'])
for uid in order:
    a=A[uid]; vs=collections.Counter()
    for x in a['ii']:
        it=STREAM[x]
        if it['sp']: vs[glob(it)]+=max(0.08,it['e']-it['s'])
    a['spk']=vs.most_common(1)[0][0] if vs else None
# fallback speaker from nearest timed item
for uid in order:
    if A[uid]['spk']: continue
    t=(A[uid]['s']+A[uid]['e'])/2 if A[uid]['e'] else None
    cand=[it for it in STREAM if it['sp'] and it['src']=='w']
    if t is None:
        A[uid]['spk']='A'; continue
    near=sorted(cand,key=lambda it:abs((it['s']+it['e'])/2-t))[:3]
    vs=collections.Counter(glob(it) for it in near)
    A[uid]['spk']=vs.most_common(1)[0][0]
# ---------- events ----------
LIM=41
def wrap(toks):
    """split token list into <=2 lines each <=LIM chars incl 'X: ' prefix"""
    tl=[len(x)+1 for x in toks]
    def lines(n):
        # balanced split into n lines
        best=None
        if n==1:
            L=sum(tl)-1
            return [L] if L<=LIM else None
        tot=sum(tl)-n
        acc=0;out=[]
        per=tot/n
        cur=[]
        for i,x in enumerate(toks):
            cur.append(x); acc+=tl[i]-1
            left=n-len(out)-1
            if left>0 and acc>=per*(len(out)+1):
                out.append(' '.join(cur)); cur=[]
        if cur: out.append(' '.join(cur))
        while len(out)<n: out.append('')
        return [len(l)+1 for l in out] if all(len(l)+1<=LIM for l in out) and all(out) else None
    for n in (1,2):
        r=lines(n)
        if r: return n
    return None
def chunk_toks(toks):
    parts=[];cur=[]
    for t in toks:
        trial=cur+[t]
        if len(' '.join(trial))+4>LIM*2 and cur:
            parts.append(cur);cur=[t]
        else: cur=trial
    if cur: parts.append(cur)
    # merge tiny tails
    out=[]
    for p in parts:
        if out and sum(len(x) for x in p)<4 and sum(len(x) for x in out[-1])<2*LIM-30:
            out[-1]+=p
        else: out.append(p)
    return out
EV=[]
for uid in sorted(order,key=lambda u:A[u]['s'] if A[u]['e'] else 9e9):
    a=A[uid]; raw=G[uid]['raw']; toks=raw.split()
    s,e=a['s'],max(a['e'],a['s']+0.2)
    if not a['ii']:
        continue
    L=chunk_toks(toks)
    tot=sum(len(x) for x in toks)
    acc=0
    for pi,part in enumerate(L):
        pl=sum(len(x) for x in part)
        cs=s+(e-s)*acc/max(1,tot); ce=s+(e-s)*(acc+pl)/max(1,tot)
        acc+=pl
        txt=' '.join(part)
        nl=wrap(part)
        EV.append({'uid':uid,'spk':a['spk'],'s':cs,'e':ce,'txt':txt,'nl':nl or 2,'part':pi,'np':len(L)})
json.dump({'A':{u:A[u] for u in order},'EV':EV,'GM':{f'{k[0]}|{k[1]}':v for k,v in GM.items()}},open('stage2.json','w'),indent=1)
print('groups placed',sum(1 for u in order if A[u]['e']>0),'events',len(EV))
for u in order:
    a=A[u]
    print('%s %6.2f-%6.2f %s cov%.2f %s'%(u,a['s'],a['e'],a['spk'],a['cov'],G[u]['raw'][:46]))
