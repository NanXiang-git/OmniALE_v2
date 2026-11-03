"""Loopback-only static server, with media range requests and explicit public file allowlist."""
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit
import argparse
import json
import mimetypes
import re
import webbrowser

BASE = Path(__file__).resolve().parent
ROOT = BASE.parent
DIST = BASE / 'dist'
ALLOWED = set(json.loads((BASE / 'allowed-files.json').read_text(encoding='utf-8')))
if (BASE / 'allowed-results.json').exists():
    ALLOWED.update(json.loads((BASE / 'allowed-results.json').read_text(encoding='utf-8')))
mimetypes.add_type('text/javascript', '.js')
mimetypes.add_type('video/mp4', '.mp4')
mimetypes.add_type('audio/wav', '.wav')

class Handler(BaseHTTPRequestHandler):
    def do_HEAD(self):
        self.send_file(head=True)

    def do_GET(self):
        self.send_file()

    def send_file(self, head=False):
        raw = unquote(urlsplit(self.path).path)
        if raw in ('/', '/index.html'):
            self.send_response(302)
            self.send_header('Location', '/case_dashboard/dist/index.html')
            self.end_headers()
            return
        relative = raw.lstrip('/')
        target = (ROOT / relative).resolve()
        static = target.is_relative_to(DIST.resolve())
        public = relative in ALLOWED and target.is_relative_to(ROOT.resolve())
        if not (static or public) or not target.is_file():
            self.send_error(404)
            return
        total = target.stat().st_size
        start, end, partial = 0, total-1, False
        value = self.headers.get('Range')
        if value:
            match = re.fullmatch(r'bytes=(\d*)-(\d*)', value)
            if not match or not any(match.groups()):
                self.send_error(416)
                return
            a, b = match.groups()
            if a:
                start = int(a)
                end = min(int(b), total-1) if b else total-1
            else:
                start = max(0, total-int(b))
            if start > end or start >= total:
                self.send_response(416)
                self.send_header('Content-Range', f'bytes */{total}')
                self.end_headers()
                return
            partial = True
        self.send_response(206 if partial else 200)
        mime = mimetypes.guess_type(target.name)[0] or 'application/octet-stream'
        self.send_header('Content-Type', mime + ('; charset=utf-8' if mime.startswith('text/') else ''))
        self.send_header('Content-Length', str(max(0, end-start+1)))
        self.send_header('Accept-Ranges', 'bytes')
        self.send_header('Cache-Control', 'no-cache')
        self.send_header('X-Content-Type-Options', 'nosniff')
        if partial:
            self.send_header('Content-Range', f'bytes {start}-{end}/{total}')
        self.end_headers()
        if head:
            return
        try:
            with target.open('rb') as stream:
                stream.seek(start)
                remaining = end-start+1
                while remaining > 0:
                    data = stream.read(min(256*1024, remaining))
                    if not data:
                        break
                    self.wfile.write(data)
                    remaining -= len(data)
        except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError):
            pass

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type=int, default=8765)
    parser.add_argument('--open', action='store_true')
    args = parser.parse_args()
    server = ThreadingHTTPServer(('127.0.0.1', args.port), Handler)
    url = f'http://127.0.0.1:{args.port}/case_dashboard/dist/index.html'
    print(f'Local: {url}', flush=True)
    if args.open:
        webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.server_close()
