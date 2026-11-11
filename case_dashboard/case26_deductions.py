"""Readable deductions derived from the frozen score and verified visual assessment."""
import html

def render(score, judge, prefix=''):
    if score.get('formal_total') is None:return ''
    esc=html.escape
    metrics=score['metrics']
    descriptions=[
        ('judge','motion_evidence','真实动作保留',15,'主要动作正确，但手指边界融合、袖口拖散，快速移动时有局部滞后。'),
        ('judge','restoration_quality','实际修复质量',15,'噪声显著减少，但暗袖色斑仍在，纹理与小器件细节变软，部分残影未消除。'),
        ('automatic','lighting','设计光变（自动）',10,f'局部灯光误差 {metrics["light_maximum_frame_tile_mae"]:.6f}；满分锚点 ≤0.003，硬门槛 ≤0.025。通过门槛但未达到满分。'),
        ('judge','lighting_intent','灯光意图（视觉）',10,'暖扫光与冷暗节奏保留，但暖高光偏淡、局部对比变平，冷暗段部分区域偏沉。'),
        ('automatic','motion_detail','运动细节（自动）',15,f'运动区平均绝对误差 {metrics["motion_mae"]:.6f}（满分 ≤0.012）；边缘相对误差 {metrics["gradient_relative_error"]:.6f}（满分 ≤0.10）。两项均通过硬门槛，但离参考细节仍有差距。'),
    ]
    rows=[];loss=0
    for group,key,label,maximum,reason in descriptions:
        points=score[group+'_scores'][key];lost=maximum-points;loss+=lost
        rows.append(f'<tr><th scope="row">{label}</th><td>{points:.4f} / {maximum}</td><td><strong>−{lost:.4f}</strong></td><td>{esc(reason)}</td></tr>')
    assert abs(loss-(100-score['formal_total']))<0.0001
    windows=[
        ('8.00–8.96 秒','快速伸手：边缘拖散',8,192,['motion_evidence','restoration_quality'],'看手指之间的空隙、袖口和前臂外轮廓。修复结果比参考更宽、更软，并带额外残影；参考原有的自然运动模糊不算错误。'),
        ('13.00–14.96 秒','暗袖绿紫色斑与纹理涂抹',13,336,['restoration_quality','lighting_intent'],'看右侧衣袖的绿紫色块，以及布料纹理。密集噪点减少了，但色块与局部涂抹仍在，且部分斑块随帧变化。'),
        ('16.21–16.75 秒','指尖轻微滞后',16.208333,None,['motion_evidence','restoration_quality'],'看移动指尖与参考是否同时到达相同位置；16.67–16.71 秒附近，输出指尖偏右并带宽软边。瓶标、小元件和细线也有细节损失。'),
        ('19.00–19.96 秒','冷暗段：指间与袖褶混浊',19,456,['motion_evidence','restoration_quality','lighting_intent'],'看手指间暗隙、手背边界、袖口细褶和暗部层次。接触关系保持，但细节含混，部分区域偏暗、偏沉。'),
        ('23.00–23.46 秒','回撤动作：软暗边与残留颗粒',23,552,['motion_evidence','restoration_quality'],'看快速回撤的手和袖口。修复画面仍有较厚软暗边、颗粒化过渡和指间分隔损失。'),
        ('4.00–10.00 秒','暖光保留，但亮部层次减弱',7.5,192,['lighting_intent'],'看台面的暖黄光、面板粉红亮带和圆盘反光。位置和节奏保留，但局部高光偏淡，光色边界与对比更平。'),
    ]
    cards=[]
    for times,title,start,frame,criteria,description in windows:
        video=f'{prefix}index.html?review={start}#answer-comparison'
        links=f'<a href="{video}" target="_blank" rel="noopener">定位三栏视频至 {start:.2f} 秒 ↗</a>'
        if frame is not None:links+=f' · <a href="{prefix}result-media/frame_{frame:03}.png" target="_blank" rel="noopener">{frame/24:.2f} 秒无损静帧 ↗</a>'
        sources=[]
        for criterion in criteria:
            evidence=judge['items'][criterion]['evidence']
            # The full original assessment stays linked; display exact records matching this interval.
            candidates=[e for e in evidence if any(token in e['source_time'] for token in ({8:['8.000'],13:['13.000','12.000','14.500'],16.208333:['16.208','16.625'],19:['19.000'],23:['23.000'],7.5:['4.000','7.500']}[start]))]
            for e in candidates:sources.append('<li>'+esc(e['source_time']+'：'+e['reason'])+'</li>')
        cards.append(f'<article class="deduction-card"><p class="deduction-time">{times}</p><h3>{title}</h3><p>{description}</p><p>{links}</p><details><summary>查看对应评审证据</summary><ul>'+''.join(sources)+'</ul></details></article>')
    return f'''<section class="case26-deductions" id="answer-deductions" aria-label="模型答卷错误与扣分点">
<h2>模型答卷：具体哪里做得不好？</h2>
<p><strong>共扣 {100-score['formal_total']:.4f} 分，最终 {score['formal_total']:.4f} / 100。</strong>主要问题是残留拖影、衣袖色斑、细节软化和局部灯光偏差。硬门槛全部通过，但总分未到 80 分。</p>
<div style="overflow-x:auto"><table class="grade-table"><thead><tr><th>扣分项</th><th>得分 / 满分</th><th>扣分</th><th>为什么扣分</th></tr></thead><tbody>{''.join(rows)}</tbody></table></div>
<p>未扣分：交付格式、修订层重放、分段修复改善、时间连续性、正常保护段。96 个保护帧逐像素未改。</p>
<p>下面的时间段用于定位问题，<strong>不是按片段额外扣分</strong>；同一缺陷可能支撑不同评分项，分数只按上表汇总。左：无损参考；中：受损输入；右：Sol 修复。建议先正常播放，再暂停或慢放检查。</p>
<div class="deduction-grid">{''.join(cards)}</div>
<p><a href="{prefix}score.json" target="_blank">完整评分指标 ↗</a> · <a href="{prefix}judge-evidence/visual-final.json" target="_blank">已核实视觉评分原文 ↗</a></p>
</section>'''

STYLE='''.case26-deductions{margin:24px 0;padding:24px;border:1px solid #58606b;border-radius:14px}.case26-deductions .grade-table{width:100%;border-collapse:collapse;min-width:650px}.case26-deductions th,.case26-deductions td{padding:12px;text-align:left;border-bottom:1px solid #68717c;vertical-align:top}.case26-deductions td:nth-child(2),.case26-deductions td:nth-child(3){white-space:nowrap}.deduction-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:16px;margin:20px 0}.deduction-card{padding:18px;border:1px solid #68717c;border-radius:10px}.deduction-card h3{margin:8px 0;font-size:18px}.deduction-card p,.deduction-card li{line-height:1.7}.deduction-time{font-weight:700}.case26-deductions a{text-decoration:underline}.case26-deductions details{margin-top:14px}.case26-deductions summary{cursor:pointer}'''
