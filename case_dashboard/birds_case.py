"""Refresh the unified birds case from the already published, frozen reports."""
from pathlib import Path
import json

BASE = Path(__file__).resolve().parent
DIST = BASE / 'dist'


def build():
    folder = DIST / 'birds-case'
    folder.mkdir(exist_ok=True)
    latest = DIST / 'birds-v6-astra-xhigh-report'
    files = []
    for p in sorted((latest / 'candidate').iterdir()):
        if not p.is_file():
            continue
        video = p.suffix == '.mp4'
        files.append(dict(name=p.name, path=p.name, url=p.relative_to(DIST).as_posix(),
                          bytes=p.stat().st_size, kind='video' if video else 'document',
                          text=None if video else p.read_text(encoding='utf8'),
                          meta={'duration': 185.466667} if video else {}))
    variant_files = []
    for version in ['v3', 'v4', 'v5', 'v6', 'v6-luna-xhigh']:
        p = DIST / f'birds-{version}-report/candidate/TASK.md'
        variant_files.append(dict(name=f'{version}-TASK.md', path=f'versions/{version}/TASK.md',
                                  url=p.relative_to(DIST).as_posix(), bytes=p.stat().st_size,
                                  kind='document', text=p.read_text(encoding='utf8')))
    payload = dict(files=files, variantFiles=variant_files, task=(latest / 'candidate/TASK.md').read_text(encoding='utf8'),
                   comparison=json.loads((latest / 'comparison.json').read_text(encoding='utf8')))
    payload['comparison'].pop('luna_timed', None)
    (folder / 'data.js').write_text('window.OMNIALE_BIRDS_CASE = ' + json.dumps(payload, ensure_ascii=False).replace('<', '\\u003c') + ';\n', encoding='utf8')
    index = DIST / 'index.html'
    text = index.read_text(encoding='utf8')
    if 'birds-case/integration.js' not in text:
        text = text.replace('<script defer src="case26-current/data.js">', '<script defer src="birds-case/data.js"></script>\n  <script defer src="birds-case/integration.js"></script>\n  <script defer src="case26-current/data.js">')
        text = text.replace('</head>', '  <link rel="stylesheet" href="birds-case/styles.css">\n</head>')
        index.write_text(text, encoding='utf8')
    print('Unified birds case refreshed')


if __name__ == '__main__':
    build()
