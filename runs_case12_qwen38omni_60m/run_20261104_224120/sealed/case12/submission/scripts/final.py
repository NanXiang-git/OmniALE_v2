import json,re,os,math,sys,collections
src=open('/workspace/scratch/gen.py').read().split("# ---------- speakers")[0]
src=src.replace("print('stream items","#print('stream items")
exec(src)
# ================= speakers: trust qwen local letters + targeted cross-clip fixes ==========
def glob(it): return it['sp']
FIX={'U016':'A','U017':'A','U014':'A','U058':'A','U093':'C','U031':'C','U097':'C','U086':'C',
     'U068':'C','U030':'C','U008':'C','U071':'C','U094':'C','U078':'C'}
for uid in order:
    a=A[uid]; vs=collections.Counter()
    for x in a['ii']:
        it=STREAM[x]
        if it['sp']: vs[glob(it)]+=max(0.08,it['e']-it['s'])
    a['spk']=vs.most_common(1)[0][0] if vs else None
placed=[u for u in order if A[u]['e']>0]
for uid in order:
    a=A[uid]
    if a['spk'] is None:
        cand=[it for it in STREAM if it['sp'] and it['src']=='w']
        t=(a['s']+a['e'])/2 if a['e'] else None
        if t is None:
            # unplaced: attach to most token-similar placed group
            gk=set(G[uid]['k']); best=None
            for v in placed:
                ov=len(gk&set(G[v]['k']))
                if ov and (best is None or ov>best[0]): best=(ov,v)
            ref=A[best[1]] if best else A[placed[0]]
            a['s'],a['e'],a['spk']=ref['s'],min(ref['s']+0.45,ref['e']+0.45),(ref['spk'] or 'A')
            a['fallback']=True
        else:
            near=sorted(cand,key=lambda it:abs((it['s']+it['e'])/2-t))[:3]
            a['spk']=collections.Counter(glob(it) for it in near).most_common(1)[0][0]
    if uid in FIX: a['spk']=FIX[uid]
    a['spk']=a['spk'] if a['spk'] in 'ABCD' else 'A'
# ================= events ==========================================
LIM=41; SLOT={'A':3,'B':48,'C':93,'D':138}; FS=18
def chunk_toks(toks):
    parts=[];cur=[]
    for t in toks:
        trial=cur+[t]
        if len(' '.join(trial))>2*(LIM-3) and cur: parts.append(cur);cur=[t]
        else: cur=trial
    if cur: parts.append(cur)
    return parts
def wrap2(part):
    txt=' '.join(part)
    if len(txt)+3<=LIM: return [txt]
    best=None
    for i in range(1,len(part)):
        a=' '.join(part[:i]); b=' '.join(part[i:])
        if len(a)+3<=LIM and len(b)+3<=LIM:
            sc=abs(len(a)-len(b))
            if best is None or sc<best[0]: best=(sc,[a,b])
    if best: return best[1]
    out=[];cur=''
    for w in part:
        if len(cur)+len(w)+1+3>LIM and cur: out.append(cur);cur=w
        else: cur=(cur+' '+w).strip()
    out.append(cur)
    while len(out)>2:
        out[-2]=out[-2]+' '+out[-1]; out.pop()
        if max(len(x) for x in out[:1])>LIM-3: break
    return out
EV=[]
for uid in sorted(order,key=lambda u:(A[u]['s'],A[u]['e'])):
    a=A[uid]; toks=G[uid]['raw'].split(); s=a['s']; e=max(a['e'],s+0.2)
    tot=sum(len(x)+1 for x in toks); acc=0
    parts=chunk_toks(toks)
    for pi,part in enumerate(parts):
        pl=sum(len(x)+1 for x in part)
        cs=s+(e-s)*acc/tot; ce=s+(e-s)*(acc+pl)/tot
        acc+=pl
        EV.append({'uid':uid,'spk':a['spk'],'s':cs,'e':ce,'lines':wrap2(part),'np':len(parts),'pi':pi,
                   'txt':' '.join(part)})
# per-speaker sequencing + constraints
EV.sort(key=lambda x:(x['s'],x['e']))
for spk in 'ABCD':
    es=[x for x in EV if x['spk']==spk]; es.sort(key=lambda x:x['s'])
    for i,x in enumerate(es):
        if i+1<len(es) and x['e']>es[i+1]['s']-0.02: x['e']=max(x['s']+0.30,es[i+1]['s']-0.02)
for x in EV:
    nch=sum(len(l) for l in x['lines'])+3*len(x['lines'])
    x['e']=max(x['e'],x['s']+max(0.40,nch/23.0))          # min dur + reading speed
    x['e']=min(x['e'],x['s']+6.0)
    # clamp to block
    for k in range(len(CUTS)-1):
        if CUTS[k]-0.05<=x['s']<CUTS[k+1]:
            x['s']=max(x['s'],CUTS[k]+0.03); x['e']=min(x['e'],CUTS[k+1]-0.04); break
    if x['e']<x['s']+0.30: x['e']=x['s']+0.30
    for k in range(len(CUTS)-1):
        if x['s']<CUTS[k+1]<=x['e']: x['e']=CUTS[k+1]-0.04
    x['s']=max(0.0,x['s']); x['e']=min(BND['duration']-0.03,x['e'])
EV.sort(key=lambda x:(x['s'],x['spk']))
for i,x in enumerate(EV,1): x['aid']=i
# ================= SRT slicing =====================================
bnd=sorted(set([round(x['s'],3) for x in EV]+[round(x['e'],3) for x in EV]))
units=[(bnd[i],bnd[i+1]) for i in range(len(bnd)-1) if bnd[i+1]-bnd[i]>0.004]
cues=[]
for u0,u1 in units:
    vis=[x for x in EV if x['s']<=u0+0.001 and x['e']>=u1-0.001]
    if not vis: continue
    seen={}
    for x in sorted(vis,key=lambda y:y['spk']):
        seen.setdefault(x['spk'],[]).append(x)
    lines=[]
    for spk in 'ABCD':
        if spk in seen:
            for x in seen[spk]:
                lines+= ['%s: %s'%(spk,l) for l in x['lines']]
    cues.append({'id':len(cues)+1,'s':u0,'e':u1,'lines':lines})
for x in EV:
    x['cids']=[c['id'] for c in cues if c['s']>=x['s']-0.002 and c['e']<=x['e']+0.002]
    if not x['cids']:
        x['cids']=[c['id'] for c in cues if c['s']<x['e'] and c['e']>x['s']]
json.dump({'EV':EV,'cues':cues,'A':{u:{k:A[u][k] for k in ('s','e','spk','cov')} for u in order}},open('stage3.json','w'),indent=1)
print('events',len(EV),'cues',len(cues),'maxline',max(max(len(l) for l in x['lines'])+3 for x in EV),
      'nl',max(len(x['lines']) for x in EV),'dur',round(min(x['e']-x['s'] for x in EV),2),round(max(x['e']-x['s'] for x in EV),2))
for x in EV[:8]: print('  %d %s %.2f-%.2f %s'%(x['aid'],x['spk'],x['s'],x['e'],' | '.join(x['lines'])))
