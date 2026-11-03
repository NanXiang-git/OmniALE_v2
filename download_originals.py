"""Restore large original files from public GitHub Releases; no credentials needed."""
from pathlib import Path
from urllib.request import urlopen
import hashlib
import json
import time
import shutil
import zipfile

ROOT = Path(__file__).resolve().parent

def sha256(path):
    h = hashlib.sha256()
    with path.open('rb') as stream:
        for block in iter(lambda: stream.read(4*1024*1024), b''):
            h.update(block)
    return h.hexdigest()

def main():
    rows = json.loads((ROOT / 'asset-manifest.json').read_text(encoding='utf-8'))
    large = [r for r in rows if r['storage'] == 'release' and r.get('availability', 'uploaded') == 'uploaded']
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
                assert temp.stat().st_size == row.get('assetBytes', row['bytes']), 'size mismatch'
                assert sha256(temp) == row.get('assetSha256', row['sha256']), 'SHA256 mismatch'
                if row.get('archive') == 'zip':
                    extracted = target.with_name(target.name + '.extracted.partial')
                    with zipfile.ZipFile(temp) as archive, archive.open(row['member']) as source, extracted.open('wb') as output:
                        shutil.copyfileobj(source, output, 4*1024*1024)
                    assert extracted.stat().st_size == row['bytes'], 'original size mismatch'
                    assert sha256(extracted) == row['sha256'], 'original SHA256 mismatch'
                    extracted.replace(target)
                    temp.unlink()
                else:
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
    print('Available originals restored and verified. This lightweight edition intentionally omits some large files. Run: python case_dashboard/serve.py --open')

if __name__ == '__main__':
    main()
