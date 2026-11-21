from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse, unquote
import json, re, sys
root = Path(__file__).resolve().parents[1] / "dist"
errors=[];pages={}
class Page(HTMLParser):
    def __init__(self):
        super().__init__();self.ids=[];self.links=[];self.h1=0;self.title=False;self.description=False;self.lang=False
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if "id" in a:self.ids.append(a["id"])
        if tag == "h1":self.h1+=1
        if tag == "title":self.title=True
        if tag == "html":self.lang=a.get("lang")=="en"
        if tag == "meta" and a.get("name")=="description":self.description=bool(a.get("content"))
        for name in ("href","src"):
            if a.get(name):self.links.append(a[name])
for path in root.rglob("*.html"):
    page=Page();text=path.read_text();page.feed(text);pages[path]=page
    if page.h1!=1:errors.append(f"{path.name}: expected one h1")
    if len(page.ids)!=len(set(page.ids)):errors.append(f"{path.name}: duplicate IDs")
    if not page.title or not page.lang:errors.append(f"{path.name}: title/language missing")
    if path.name!='404.html' and not page.description:errors.append(f"{path.name}: description missing")
    for schema in re.findall(r'<script type="application/ld\+json">(.*?)</script>',text,re.S):
        try:json.loads(schema)
        except ValueError:errors.append(f"{path.name}: invalid JSON-LD")
    if "PLACEHOLDER" in text or "TODO" in text:errors.append(f"{path.name}: unfinished content")
for path,page in pages.items():
    for link in page.links:
        url=urlparse(link)
        if url.scheme or url.netloc:continue
        target=(root / unquote(url.path.lstrip('/'))) if url.path.startswith('/') else (path.parent / unquote(url.path))
        if not url.path:target=path
        if target.is_dir():target=target/'index.html'
        if not target.exists():errors.append(f"{path.relative_to(root)}: missing {link}")
        elif url.fragment and target in pages and url.fragment not in pages[target].ids:errors.append(f"{path.name}: missing anchor {link}")
manifest=json.loads((root/'site.webmanifest').read_text());assert manifest['name']=='Aroha Music'
assert 'Sitemap:' in (root/'robots.txt').read_text()
assert 'youtube-music-alternative' in (root/'sitemap.xml').read_text()
assert 'sha256-PLACEHOLDER' not in (root/'_headers').read_text()
if errors:print('\n'.join(errors));sys.exit(1)
print(f"PASS: {len(pages)} HTML pages, every local asset/link/anchor, JSON-LD, sitemap, robots and web manifest.")
initial_files=['index.html','styles.css','app.js','assets/jakarta-regular.ttf','assets/jakarta-bold.ttf','assets/screenshots/discover-540.webp','assets/screenshots/player-540.webp','assets/icon.svg']
initial=sum((root/x).stat().st_size for x in initial_files)
assert 'without the ads.' in (root/'index.html').read_text()
assert '<audio' not in (root/'index.html').read_text()
assert 'Illustrative app-inspired' not in (root/'index.html').read_text()
for name in ['discover','player','library','glimpses']:
    assert (root/f'assets/screenshots/{name}-540.webp').exists()
    assert (root/f'assets/screenshots/{name}-1080.webp').exists()
print(f"Initial page assets: {initial/1024:.0f} KiB uncompressed. Gallery screenshots are lazy-loaded. No audio or stock-photo downloads.")
