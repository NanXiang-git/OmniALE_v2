import json,os,re,math
S=json.load(open('stage3.json')); EV=S['EV']
# split events whose lines are too long (>38 chars text => >41 with prefix)
LIMT=38; new=[]
for x in EV:
    if max(len(l) for l in x['lines'])<=LIMT: new.append(x); continue
    toks=x['txt'].split(); h=(len(toks)+1)//2
    a,b=toks[:h],toks[h:]
    if not b: new.append(x); continue
    tot=sum(len(t)+1 for t in toks)
    pa=sum(len(t)+1 for t in a)
    m=x['s']+(x['e']-x['s'])*pa/tot
    for k,(pp,ss,ee) in enumerate([(a,x['s'],m),(b,m,x['e'])]):
        t=' '.join(pp); nl=len(t)+3
        l1=' '.join(pp[:h2]) if False else None
        # wrap into <=2 lines
        best=None
        for i in range(1,len(pp)):
            u=' '.join(pp[:i]); v=' '.join(pp[i:])
            if max(len(u),len(v))<=LIMT and (best is None or abs(len(u)-len(v))<best[0]): best=(abs(len(u)-len(v)),[u,v])
        ys=[t] if nl<=LIMT else (best[1] if best else [t[:LIMT],t[LIMT:]])
        new.append(dict(x,txt=t,lines=ys,s=round(ss,2),e=round(ee,2),pi=k,np=2))
EV=new
CUTS=[0,93.52,170.76]; DUR=259.48
for x in EV:
    x['s']=round(x['s'],2); x['e']=round(x['e'],2)
# re-space same-speaker collisions inside the surrounding free window
EV.sort(key=lambda x:(x['s'],x['e']))
for spk in 'ABCD':
    es=sorted([x for x in EV if x['spk']==spk],key=lambda x:(x['s'],x['e']))
    i=0
    while i<len(es):
        j=i
        while j+1<len(es) and es[j+1]['s']<es[j]['e']-0.001: j+=1
        if j>i:
            grp=es[i:j+1]; n=len(grp)
            lo=es[i-1]['e']+0.05 if i>0 else 0.06
            hi=es[j+1]['s']-0.05 if j+1<len(es) else DUR-0.06
            if hi-lo < n*0.42:
                need=n*0.42
                lo2=lo-(need-(hi-lo)); 
                if lo2<0.06: lo=0.06; hi=lo+need
                else: lo=lo2
                hi=max(hi,lo+need)
            step=min((hi-lo)/n,2.0); d=max(0.36,min(step-0.04,6.0))
            for k,x in enumerate(grp):
                st=lo+k*step
                x['s']=round(st,2); x['e']=round(min(st+d,hi),2)
        i=j+1

# enforce min duration + reading speed by extending into free space (same speaker, same block)
def blk(t):
    k=0
    for c in CUTS:
        if t>=c: k+=1
    return (CUTS[k-1] if k>0 else 0.0, CUTS[k] if k<len(CUTS) else DUR)
for _ in range(3):
    viol=[x for x in EV if (sum(len(l) for l in x['lines'])+3*len(x['lines']))/max(0.02,x['e']-x['s'])>23.0 or x['e']-x['s']<0.40]
    if not viol: break
    for spk in 'ABCD':
        es=sorted([x for x in EV if x['spk']==spk],key=lambda x:x['s'])
        for k,x in enumerate(es):
            nch=sum(len(l) for l in x['lines'])+3*len(x['lines'])
            need=max(0.40,nch/23.0)
            d=x['e']-x['s']
            if d>=need-0.005: continue
            lo,hi=blk(x['s']); hi=min(hi,DUR-0.05); lo=max(lo,0.05)
            nxt=es[k+1]['s'] if k+1<len(es) else hi
            prv=es[k-1]['e'] if k>0 else lo
            room_e=max(0.0,min(nxt-0.05,hi)-x['e']); room_s=max(0.0,x['s']-max(prv+0.05,lo))
            take=min(room_e,(need-d)*0.6); x['e']=round(x['e']+take,2)
            rest=need-d-take
            if rest>0: take2=min(room_s,rest); x['s']=round(x['s']-take2,2)
    EV.sort(key=lambda x:(x['s'],x['spk']))
# (final clamp removed: extension already respects free space; re-add only if overlaps appear)
# relocate events that cannot satisfy the reading-speed rule inside their local window
def need_of(x): return max(0.40,(sum(len(l) for l in x['lines'])+3*len(x['lines']))/23.0)
for _ in range(4):
    moved=False
    for spk in 'ABCD':
        es=sorted([x for x in EV if x['spk']==spk],key=lambda x:x['s'])
        for x in es:
            nd=need_of(x); lo,hi=blk(x['s']); lo=max(lo+0.06,0.06); hi=min(hi-0.06,DUR-0.06)
            occ=sorted([(y['s'],y['e']) for y in es if y is not x and y['e']>lo and y['s']<hi])
            free=[];cur=lo
            for a,b in occ:
                if a-cur>=nd: free.append((cur,a))
                cur=max(cur,b+0.0)
            if hi-cur>=nd: free.append((cur,hi))
            if free:
                best=None
                for a,b in free:
                    st=min(max(x['s'],a+0.02),b-nd-0.01); st=max(st,a+0.01)
                    cost=abs(st-x['s'])
                    if best is None or cost<best[0]: best=(cost,st)
                if best and (best[1]!=x['s'] or (x['e']-x['s'])<nd-0.01):
                    st=best[1]
                    if (x['e']-x['s'])<nd-0.01:
                        x['s']=round(st,2); x['e']=round(min(st+nd,b-0.01),2); moved=True
            else:
                # no free window: shift this event later past the cluster tail if room before next block cut
                tail=occ[-1][1]+0.06 if occ else None
                if tail is not None and hi-tail>=nd:
                    x['s']=round(tail,2); x['e']=round(tail+nd,2); moved=True
    if not moved: break

EV.sort(key=lambda x:(x['s'],x['spk']))
for i,x in enumerate(EV,1): x['aid']=i
def ts(t,ms=True):
    t=max(0.0,t); h=int(t//3600); m=int(t%3600//60); s=t%60
    return ('%d:%02d:%05.2f'%(h,m,s)) if not ms else '%02d:%02d:%06.3f'%(h,m,s)
MARGIN={'A':3,'B':48,'C':93,'D':138}
hdr="""[Script Info]
ScriptType: v4.00+
PlayResX: 704
PlayResY: 576
WrapStyle: 0
ScaledBorderAndShadow: yes
Collisions: Preserve

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
"""
for spk in 'ABCD':
    hdr+="Style: %s,Microsoft YaHei,18,&H00FFFFFF,&H000000FF,&H00000000,&HA0000000,0,0,0,0,100,100,0,0,1,1.5,0.8,2,14,14,%d,1\n"%(spk,MARGIN[spk])
hdr+="\n[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n"
lines=[hdr.rstrip()]
for x in EV:
    txt='\\N'.join('%s: %s'%(x['spk'],l) if i==0 else l for i,l in enumerate(x['lines']))
    lines.append('Dialogue: 0,%s,%s,%s,%s,0,0,0,,%s'%(ts(x['s'],False),ts(x['e'],False),x['spk'],x['spk'],txt))
os.makedirs('/workspace/submission',exist_ok=True)
open('/workspace/submission/interview.ass','w',encoding='utf-8').write('\n'.join(lines)+'\n')
# SRT by boundary slicing
bnd=sorted(set([x['s'] for x in EV]+[x['e'] for x in EV]))
units=[(bnd[i],bnd[i+1]) for i in range(len(bnd)-1) if bnd[i+1]-bnd[i]>=0.02]
cues=[]
for u0,u1 in units:
    vis=[x for x in EV if x['s']<=u0+0.005 and x['e']>=u1-0.005]
    if not vis: continue
    out=[]
    for spk in 'ABCD':
        for x in [y for y in vis if y['spk']==spk]:
            out+=['%s: %s'%(spk,l) for l in x['lines']]
    cues.append({'id':len(cues)+1,'s':u0,'e':u1,'lines':out})
mg=[]
for c in cues:
    if mg and mg[-1]['lines']==c['lines'] and abs(mg[-1]['e']-c['s'])<0.02: mg[-1]['e']=c['e']
    else: mg.append(dict(c))
for k,c in enumerate(mg,1): c['id']=k
cues=mg
sl=[]
for c in cues:
    sl.append(str(c['id'])); sl.append('%s --> %s'%(ts(c['s']),ts(c['e']).replace('.',','))); sl+=c['lines']; sl.append('')
open('/workspace/submission/interview.srt','w',encoding='utf-8').write('\n'.join(sl)+'\n')
for x in EV:
    x['cids']=[c['id'] for c in cues if c['s']>=x['s']-0.005 and c['e']<=x['e']+0.005]
    if not x['cids']: x['cids']=[c['id'] for c in cues if c['s']<x['e'] and c['e']>x['s']]
evs=[]
for x in EV:
    evs.append({'utterance_ids':[x['uid']],'speaker_id':x['spk'],'start':x['s'],'end':x['e'],
                'ass_event_ids':[str(x['aid'])],'srt_cue_ids':[str(c) for c in x['cids']]})
json.dump({'events':evs},open('/workspace/submission/alignment.json','w'),indent=1,ensure_ascii=False)
json.dump({'EV':EV,'cues':cues},open('stage4.json','w'))
u=set(x['uid'] for x in EV)
print('events',len(EV),'cues',len(cues),'uids',len(u),'maxline',max(max(len(l) for l in x['lines'])+3 for x in EV),
 'mindur',round(min(x['e']-x['s'] for x in EV),2),'maxdur',round(max(x['e']-x['s'] for x in EV),2),
 'cross',[ (x['aid'],x['s'],x['e']) for x in EV if any(c>x['s'] and c<x['e'] for c in CUTS)])
