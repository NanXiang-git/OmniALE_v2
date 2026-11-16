"""Add an audit notice without altering historical task, answers or scores."""
from pathlib import Path
import json,hashlib
ROOT=Path(__file__).resolve().parent.parent
NOTICE={
  'version':'V4','affected_model':'gpt-6.1-sol','reference_url':'https://xeno-canto.org/238544',
  'finding':'Downloaded reference XC238544 matches chapter 1 original audio.',
  'matched_seconds':14.315750,'absolute_correlation':0.980946,
  'interpretation':'Historical score and answer are retained, but this is not a source-clean recognition result. This does not establish intent or quantify the causal effect.',
  'followup':'V5 retained; V6 reruns Sol after speech WebSocket compatibility repair, preserving exact source filtering and independent references.'}
def main():
    (ROOT/'case_birds/omni_task_v5/reports/contamination_notice.json').write_text(json.dumps(NOTICE,ensure_ascii=False,indent=2),encoding='utf8')
    for dist in [ROOT/'case_dashboard/dist',ROOT/'github_publish/OmniALE_birds/case_dashboard/dist']:
        p=dist/'birds-v4-report/reports/index.html'
        if not p.exists():continue
        text=p.read_bytes().decode('utf8')
        if 'id="source-contamination-notice"' not in text:
            banner='<aside id="source-contamination-notice" style="margin:20px;padding:20px;border:2px solid #a13c35;background:#fff5e8;color:#40251e"><strong>审计补充：V4 Sol 已确认接触同源素材。</strong> 下载的 XC238544 与第一章原声匹配约14.32秒（绝对相关系数0.980946）。本页历史答卷及分数保留，但不能视为无泄漏识别成绩。<a href="../../birds-v6-report/reports/index.html">查看 V6 Sol 修复重跑及访问核验</a>。</aside>'
            assert '<body>' in text
            text=text.replace('<body>','<body>'+banner,1)
            p.write_bytes(text.encode('utf8'))
        text=text.replace('href="../../birds-v5-report/reports/index.html">查看精确拦截后的 V5 Sol 重跑及访问核验','href="../../birds-v6-report/reports/index.html">查看 V6 Sol 修复重跑及访问核验')
        p.write_bytes(text.encode('utf8'))
        manifest=p.parents[1]/'publication-manifest.json'
        if manifest.exists():
            m=json.loads(manifest.read_text(encoding='utf8'))
            for row in m['files']:
                if row['path']=='reports/index.html':
                    row['deployed_sha256']=hashlib.sha256(p.read_bytes()).hexdigest();row['deployed_bytes']=p.stat().st_size
            m['audit_notice']='Confirmed XC238544 source exposure, added with V5. Original score and answers unchanged.'
            manifest.write_text(json.dumps(m,ensure_ascii=False,indent=2),encoding='utf8')
    print('V4_CONTAMINATION_NOTICES_ADDED')
if __name__=='__main__':main()
