"""Final Case26 weighting; consumes frozen measurements without rerunning a solver/judge."""
import copy,hashlib,json
AUTO={'restoration':12,'motion_detail':12,'temporal':4,'lighting':8,'protected':4}
JUDGE={'motion_evidence':22.5,'restoration_quality':22.5,'lighting_intent':15}
BASE_AUTO={'restoration':15,'motion_detail':15,'temporal':5,'lighting':10,'protected':5}
BASE_JUDGE={'motion_evidence':15,'restoration_quality':15,'lighting_intent':10}
def rules(original):
    r=copy.deepcopy(original)
    r.update(scoring_version='final-quality-coefficient-1',automatic_weights=AUTO,
        coefficient={'formula':'C=min(C_delivery,C_replay)','delivery':'normalized verified delivery checks, clipped to [0,1]','repair_replay':'normalized verified repair replay checks, clipped to [0,1]','missing_or_unverified':'formal total remains pending; do not assume C=1','hard_failures':'Existing hard/critical failures independently prevent acceptance.'},
        final_formula='S=C*(sum(automatic_quality_points)+sum(visual_quality_points)); automatic 40, visual 60; round only final total to 4 decimals',
        weighting_scope='Final reporting weights applied to frozen measurements and verified judge ratings; solver task and output unchanged.')
    for item in r['judge_items']:item['weight']=JUDGE[item['id']]
    return r
def score(original,original_rules):
    if original.get('scoring_version')=='final-quality-coefficient-1':return copy.deepcopy(original)
    r=copy.deepcopy(original);cfg=rules(original_rules)
    r['evidence_rubric_sha256']=r.pop('rubric_sha256',None)
    r['rubric_sha256']=hashlib.sha256(json.dumps(cfg,ensure_ascii=False,sort_keys=True).encode()).hexdigest()
    r['scoring_version']='final-quality-coefficient-1'
    r['automatic_scores']={k:original['automatic_scores'][k]/BASE_AUTO[k]*v for k,v in AUTO.items()}
    r['judge_scores']={k:original['judge_scores'][k]/BASE_JUDGE[k]*v for k,v in JUDGE.items()}
    d=max(0.,min(1.,original['automatic_scores']['delivery']/5))
    replay=max(0.,min(1.,original['automatic_scores']['repair_replay']/5))
    r['compliance']={'delivery':d,'repair_replay':replay,'coefficient':min(d,replay),'formula':'min(delivery,repair_replay)'}
    r['quality_weights']={'automatic':AUTO,'judge':JUDGE}
    r['quality_subtotal']=sum(r['automatic_scores'].values())+sum(r['judge_scores'].values())
    pending=bool(original.get('pending_automatic') or original.get('pending_judge') or original.get('formal_total') is None)
    r['formal_total']=None if pending else round(r['compliance']['coefficient']*r['quality_subtotal'],4)
    r['verified_subtotal']=round(r['compliance']['coefficient']*r['quality_subtotal'],4)
    r['accepted']=r['formal_total'] is not None and r['formal_total']>=80 and not r['hard_failures'] and not r['critical_failures']
    r['aggregation_note']='Final weights only. Raw metrics, submission binding and verified visual decisions unchanged. Evidence rubric hash preserves the original observation provenance.'
    return r
def formula_html(s):
    c=s['compliance'];a=sum(s['automatic_scores'].values());j=sum(s['judge_scores'].values())
    return f'''<section class="final-score-algorithm"><h3>最终计分算法</h3>
<p><strong>最终分 S = 交付合规系数 C × 修复质量分 Q。</strong>交付完整性与修订层重放只决定系数，不直接加分；正常保护段仍属于修复质量。</p>
<p>C = min(C<sub>交付</sub>, C<sub>重放</sub>)，两项均取 0–1：使用已核实检查结果的归一化完成度。缺失或未核实不得默认满分。本答卷 C = min({c['delivery']:.4f}, {c['repair_replay']:.4f}) = <strong>{c['coefficient']:.4f}</strong>。</p>
<p>Q = 自动质量分（40分）+ 视觉质量分（60分）。各项贡献 = 归一化完成度 × 对应权重；自动指标沿用固定锚点截断到0–1，视觉评审沿用0 / 0.5 / 1档位。不重新判断现有答卷。</p>
<p><code>Q = {a:.6f} + {j:.6f} = {s['quality_subtotal']:.6f}</code><br><code>S = {c['coefficient']:.4f} × {s['quality_subtotal']:.6f} = {s['formal_total']:.4f} / 100</code></p>
<p>仅最终汇总四舍五入至4位小数。通过条件：S ≥ 80，且无硬约束失败、无核心视觉项失败；高分不能抵消这些失败。</p></section>'''
