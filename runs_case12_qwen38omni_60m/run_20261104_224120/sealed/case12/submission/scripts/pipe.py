import json,re,os,math
from difflib import SequenceMatcher
IN='/candidate/input'
NUM={'0':'zero','1':'one','2':'two','3':'three','4':'four','5':'five','6':'six','7':'seven','8':'eight','9':'nine','10':'ten',
 '12':'twelve','20':'twenty','25':'twenty five','30':'thirty','50':'fifty','1250':'twelve fifty'}
SUB={'recognise':'recognize','recognised':'recognize','kay':'okay','ok':'okay','uhhuh':'mmhmm','cetera':'etc',
 'everyday':'every day','yep':'yeah','yup':'yeah','mmhm':'mmhmm','mhm':'mmhmm','yeahh':'yeah','uh':'uh','um':'um'}
def norm(t):
    t=t.strip().lower().replace('_','')
    t=re.sub(r"[^a-z0-9']","",t)
    if t in NUM: return NUM[t].split()
    t=SUB.get(t,t)
    t=re.sub(r"(ing|ed|ly|es|s)$",lambda m:'' if m.group(0)=='s' else m.group(0),t)
    return t.split() if t else []
def keys(txt):
    out=[]
    for t in txt.split(): out+=norm(t)
    return out
_KSC={}
def ks(a,b):
    key=a+' '+b
    v=_KSC.get(key)
    if v is not None: return v
    v=_ks(a,b); _KSC[key]=v; return v
def _ks(a,b):
    if a==b: return 1.0
    if len(a)>2 and len(b)>2 and (a.startswith(b) or b.startswith(a)): return 0.85
    return 0.65 if SequenceMatcher(None,a,b).ratio()>=0.72 else 0.0
def amatch(ref,hyp):
    sm=SequenceMatcher(None,ref,hyp,autojunk=False); bl=sm.get_matching_blocks()
    pairs=[];ua=set();ub=set()
    for b in bl:
        for i in range(b.size): pairs.append((b.a+i,b.b+i)); ua.add(b.a+i); ub.add(b.b+i)
    for i,r in enumerate(ref):
        if i in ua: continue
        for j,h in enumerate(hyp):
            if j in ub: continue
            if ks(r,h)>=0.65: pairs.append((i,j)); ua.add(i); ub.add(j); break
    return pairs
G={}
order=[]
for line in open(IN+'/transcript.txt',encoding='utf-8'):
    uid,_,txt=line.rstrip('\n').partition(' ')
    if uid: G[uid]={'raw':txt,'k':keys(txt),'id':uid}; order.append(uid)
WSEGS=json.load(open('whisper_full.json'))
WS=[]
for s in WSEGS:
    for w in s['words']:
        kk=norm(w['w'])
        if kk: WS.append({'s':w['s'],'e':w['e'],'k':kk,'sp':None,'src':'w','own':None})
BND=json.load(open(IN+'/edit_boundaries.json')); CUTS=list(BND['block_starts'])+[BND['duration']]
Q=json.load(open('qwen_parsed.json')); CLIPS=json.load(open('clips.json'))
def qarr(i): 
    a=Q.get(str(i),Q.get(i,[]))
    return [{'s':u.get('s',0),'e':u.get('e',0),'sp':u.get('sp'),'t':u.get('t',''),'ov':bool(u.get('ov'))} for u in a]
# ---- exclusive alignment of qwen utts to whisper positions, per clip
pseudo=[]
for m in CLIPS:
    i=m['i']; idxs=[j for j,w in enumerate(WS) if m['a']-0.35<=w['s']<m['b']+0.35]
    ck=[];pos=[]
    for j in idxs:
        for k in WS[j]['k']: ck.append(k);pos.append(j)
    items=sorted(qarr(i),key=lambda u:u['s'])
    cands=[]
    for ui,u in enumerate(items):
        uk=keys(u['t'])
        if not uk: continue
        n=len(uk); best=None
        for p in range(0,max(1,len(ck)-2)):
            q=min(len(ck),p+n+5)
            pr=amatch(uk,ck[p:q])
            if not pr: continue
            sc=0.8*len(pr)/n+0.2*len(pr)/(q-p)
            if best is None or sc>best[0]: best=(sc,p,q,pr)
        if best: cands.append((best[0]*math.sqrt(n),ui,best[1],best[2],best[3],u,uk))
    cands.sort(key=lambda c:-c[0]); usedpos=set(); usedutt=set()
    info={}
    for sc,ui,p,q,pr,u,uk in cands:
        if any(pos[x] in usedpos for x in range(p,q)): continue
        if ui in usedutt: continue
        usedutt.add(ui)
        for x in range(p,q): usedpos.add(pos[x])
        i0=min(pos[p+x[1]] for x in pr); i1=max(pos[p+x[1]] for x in pr)
        info[ui]=(min(WS[i0]['s'],WS[i1]['s']),max(WS[i0]['e'],WS[i1]['e']),len(pr)/len(uk))
        for x in range(i0,i1+1):
            if WS[x]['sp'] is None: WS[x]['sp']=u['sp']
    for ui,u in enumerate(items):
        if ui in info: u['s0'],u['e0'],u['cov']=info[ui]; u['al']=True
        else: u['al']=False; u['cov']=0
    # interpolate unaligned
    kn=[(ui,u['s0'],u['e0']) for ui,u in enumerate(items) if u['al']]
    un=[ui for ui,u in enumerate(items) if not u['al']]
    for ui in un:
        u=items[ui]
        pv=[k for k in kn if k[0]<ui]; nx=[k for k in kn if k[0]>ui]
        ga=pv[-1][2] if pv else m['a']; gb=nx[0][1] if nx else m['b']
        if gb<ga+0.2: gb=ga+0.2
        peers=sorted([k for k in un if (not pv or k>pv[-1][0]) and (not nx or k<nx[0][0])])
        kk=peers.index(ui)+1; nn=max(1,len(peers)); span=(gb-ga)/nn
        st=ga+span*(kk-0.5); en=min(gb,st+max(0.14,span*0.75))
        u['_t']=(max(m['a'],st),max(en,max(m['a'],st)+0.14))
    for ui,u in enumerate(items):
        if u['al']: continue
        st,en=u['_t']
        pseudo.append({'s':st,'e':en,'k':keys(u['t']),'sp':u['sp'],'src':'q','txt':u['t'],'clip':i})
STREAM=sorted(WS+pseudo,key=lambda x:(x['s'],x['e']))
SK=[]; SIP=[]
for j,it in enumerate(STREAM):
    for k in it['k']: SK.append(k); SIP.append(j)
print('stream items',len(STREAM),'keys',len(SK),'unaligned q utts',len(pseudo))
# ---- assign groups
res={}; taken=set()
for uid in sorted(order,key=lambda u:-len(G[u]['k'])):
    gk=G[uid]['k']; n=len(gk); best=None
    for p in range(0,max(1,len(SK)-1)):
        q=min(len(SK),p+n+4)
        if p+0>=len(SK): break
        pr=amatch(gk,SK[p:q])
        if not pr: continue
        ii=[SIP[p+x[1]] for x in pr]
        pen=0.55*len([1 for x in ii if x in taken])/max(1,len(ii)) if n>=3 else 0.15*len([1 for x in ii if x in taken])/max(1,len(ii))
        sc=0.78*len(pr)/n+0.22*len(pr)/(q-p)-pen
        if best is None or sc>best[0]: best=(sc,p,q,pr,ii)
    res[uid]=best
for uid in order:
    b=res[uid]; gk=G[uid]['k']
    if b is None or b[0]<0.45: res[uid]=None
    else:
        sc,p,q,pr,ii=b
        items=[STREAM[x] for x in ii]
        res[uid]={'s':min(x['s'] for x in items),'e':max(x['e'] for x in items),
                  'cov':len(pr)/len(gk),'items':items,'ii':ii}
        for x in range(p,q):
            if len(gk)>=3: taken.add(SIP[x])
un=[u for u in order if res[u] is None]
print('matched',len(order)-len(un),'unmatched',len(un))
print('unmatched:',[(u,G[u]['raw'][:34]) for u in un])
json.dump({'res':{u:(None if res[u] is None else {'s':res[u]['s'],'e':res[u]['e'],'cov':res[u]['cov'],'sp':[x['sp'] for x in res[u]['items']],'src':[x['src'] for x in res[u]['items']]}) for u in order},
           'stream':[{k:v for k,v in it.items() if k!='own'} for it in STREAM]},open('stage1.json','w'),indent=1)
covs=[res[u]['cov'] for u in order if res[u]]
print('median cov %.2f  low(<0.75): %d'%(sorted(covs)[len(covs)//2],sum(1 for c in covs if c<0.75)))
for u in order[:0]: pass
for u in sorted(order,key=lambda x:-(res[x]['cov'] if res[x] else -1))[:6]:
    r=res[u]; print('  %s %.2f-%.2f cov%.2f | %s'%(u,r['s'],r['e'],r['cov'],G[u]['raw'][:50]))
