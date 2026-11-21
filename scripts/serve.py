from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import os
os.chdir(Path(__file__).resolve().parents[1] / "dist")
class Handler(SimpleHTTPRequestHandler):
    def send_error(self, code, message=None, explain=None):
        if code == 404:
            content = Path("404.html").read_bytes()
            self.send_response(404)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(content)))
            self.end_headers()
            if self.command != "HEAD": self.wfile.write(content)
        else: super().send_error(code, message, explain)
print("Local: http://127.0.0.1:4173", flush=True)
ThreadingHTTPServer(("127.0.0.1", 4173), Handler).serve_forever()
