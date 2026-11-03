"""Local range-capable player server; no submission scripts are served."""
from pathlib import Path
from http.server import ThreadingHTTPServer,BaseHTTPRequestHandler
from urllib.parse import urlsplit,unquote
import mimetypes,argparse,re
class Handler(BaseHTTPRequestHandler):
 def log_message(self,*args):pass
 def do_GET(self):self.respond(False)
 def do_HEAD(self):self.respond(True)
 def respond(self,head):
  path=unquote(urlsplit(self.path).path).lstrip('/') or 'player.html'
  root=self.server.submission if path.startswith('submission/') else self.server.candidate
  rel=path[len('submission/'):] if path.startswith('submission/') else path
  p=(root/rel).resolve()
  if not p.is_relative_to(root) or not p.is_file() or p.suffix.lower() not in {'.html','.js','.css','.json','.mp4','.wav','.vtt','.png','.jpg'} or (root==self.server.submission and p.suffix.lower() in {'.html','.js','.css'}):self.send_error(404);return
  size=p.stat().st_size;a=0;b=size-1;partial=False
  if self.headers.get('Range'):
   m=re.fullmatch(r'bytes=(\d+)-(\d*)',self.headers['Range'])
   if not m:self.send_error(416);return
   a=int(m[1]);b=min(b,int(m[2])) if m[2] else b
   if a>b:self.send_error(416);return
   partial=True
  self.send_response(206 if partial else 200);self.send_header('Content-Type',mimetypes.guess_type(p)[0] or 'application/octet-stream');self.send_header('Accept-Ranges','bytes');self.send_header('Content-Length',str(b-a+1));self.send_header('Cache-Control','no-store')
  if partial:self.send_header('Content-Range',f'bytes {a}-{b}/{size}')
  self.end_headers()
  if head:return
  try:
   with p.open('rb') as f:
    f.seek(a);left=b-a+1
    while left:
     data=f.read(min(65536,left))
     if not data:break
     self.wfile.write(data);left-=len(data)
  except (BrokenPipeError,ConnectionResetError,ConnectionAbortedError):pass
def server(candidate,submission,port=0):
 s=ThreadingHTTPServer(('127.0.0.1',port),Handler);s.candidate=Path(candidate).resolve();s.submission=Path(submission).resolve();return s
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--submission',required=True);p.add_argument('--candidate',default=str(Path(__file__).resolve().parents[1]));p.add_argument('--port',type=int,default=8765);a=p.parse_args();s=server(a.candidate,a.submission,a.port);print(f'Open http://127.0.0.1:{s.server_port}/player.html',flush=True);s.serve_forever()
