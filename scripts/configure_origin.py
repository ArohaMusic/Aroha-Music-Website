from pathlib import Path
from urllib.parse import urlparse
import sys,re,hashlib,base64
if len(sys.argv)!=2:raise SystemExit("Usage: python3 scripts/configure_origin.py https://your-domain.example")
origin=sys.argv[1].rstrip('/')
url=urlparse(origin)
if url.scheme!='https' or not url.netloc or url.path or url.query or url.fragment:raise SystemExit('Use an HTTPS origin without a path, query or fragment.')
root=Path(__file__).resolve().parents[1]/'dist'
home=(root/'index.html').read_text()
old=re.search(r'<link rel="canonical" href="(https://[^/]+)/">',home).group(1)
for p in root.rglob('*'):
    if p.suffix in ('.html','.xml','.txt','.webmanifest'):p.write_text(p.read_text().replace(old,origin))
text=(root/'index.html').read_text();schema=re.search(r'<script type="application/ld\+json">(.*?)</script>',text,re.S).group(1)
digest=base64.b64encode(hashlib.sha256(schema.encode()).digest()).decode()
p=root/'_headers';p.write_text(re.sub(r"sha256-[A-Za-z0-9+/=]+",'sha256-'+digest,p.read_text()))
print('Updated canonical, social, structured-data, sitemap and robots origins to '+origin)
