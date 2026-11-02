"""Restore large original files from public GitHub Releases; no credentials needed."""
from pathlib import Path
from urllib.request import urlopen
import hashlib
import json
import time

ROOT = Path(__file__).resolve().parent

def sha256(path):
    h = hashlib.sha256()
    with path.open('rb') as stream:
        for block in iter(lambda: stream.read(4*1024*1024), b''):
            h.update(block)
    return h.hexdigest()

def main():
    rows = json.loads((ROOT / 'asset-manifest.json').read_text(encoding='utf-8'))
    large = [r for r in rows if r['storage'] == 'release']
    for i, row in enumerate(large, 1):
        target = ROOT / row['path']
        if target.exists() and target.stat().st_size == row['bytes'] and sha256(target) == row['sha256']:
            print(f'[{i}/{len(large)}] verified {row["path"]}')
            continue
        target.parent.mkdir(parents=True, exist_ok=True)
        temp = target.with_name(target.name + '.partial')
        for attempt in range(3):
            try:
                with urlopen(row['url'], timeout=120) as response, temp.open('wb') as output:
                    while block := response.read(4*1024*1024):
                        output.write(block)
                assert temp.stat().st_size == row['bytes'], 'size mismatch'
                assert sha256(temp) == row['sha256'], 'SHA256 mismatch'
                temp.replace(target)
                break
            except Exception:
                if attempt == 2:
                    raise
                time.sleep(3)
        print(f'[{i}/{len(large)}] downloaded {row["path"]}', flush=True)
    for name in ('data.js', 'results.js'):
        path = ROOT / 'case_dashboard' / 'dist' / name
        text = path.read_text(encoding='utf-8')
        for row in large:
            text = text.replace(row['url'], '../../' + row['path'])
        path.write_text(text, encoding='utf-8')
    print('Originals restored and verified. Run: python case_dashboard/serve.py --open')

if __name__ == '__main__':
    main()
