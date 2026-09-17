from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,urljoin
import xml.etree.ElementTree as ET
import json,sys
root=Path(__file__).resolve().parents[1];dist=root/'dist'
(root/'artifacts/site-review-2026-09-17').mkdir(parents=True,exist_ok=True)
class Page(HTMLParser):
 def __init__(self):super().__init__();self.title='';self.intitle=False;self.meta={};self.canonical=[];self.h1=0;self.links=[];self.jsons=[];self.inscript=False;self.buf=''
 def handle_starttag(self,t,a):
  d=dict(a)
  if t=='title':self.intitle=True
  if t=='h1':self.h1+=1
  if t=='meta':self.meta.setdefault(d.get('name',d.get('property','')),[]).append(d.get('content',''))
  if t=='link' and d.get('rel')=='canonical':self.canonical.append(d.get('href'))
  if t=='a' and d.get('href'):self.links.append(d['href'])
  if t=='script' and d.get('type')=='application/ld+json':self.inscript=True;self.buf=''
 def handle_endtag(self,t):
  if t=='title':self.intitle=False
  if t=='script' and self.inscript:self.jsons.append(json.loads(self.buf));self.inscript=False
 def handle_data(self,d):
  if self.intitle:self.title+=d
  if self.inscript:self.buf+=d
pages={};errors=[];report=[]
for p in dist.rglob('*.html'):
 path='/'+str(p.relative_to(dist));path=path[:-10] if path.endswith('index.html') else path
 try:q=Page();q.feed(p.read_text());pages[path]=q
 except Exception as e:errors.append(f'{path}: {e}')
urls=[x.text for x in ET.parse(dist/'sitemap.xml').findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
seen_titles=set();seen_descriptions=set()
for url in urls:
 path=urlsplit(url).path;p=pages.get(path)
 if not p:errors.append(f'Sitemap destination missing: {url}');continue
 desc=p.meta.get('description',[''])[0];robots=','.join(p.meta.get('robots',[]))
 checks={'canonical':p.canonical==[url],'heading':p.h1==1,'title':bool(p.title.strip()) and p.title not in seen_titles,'description':bool(desc.strip()) and desc not in seen_descriptions,'indexable':'noindex' not in robots,'structured_data':bool(p.jsons)}
 seen_titles.add(p.title);seen_descriptions.add(desc)
 for name,ok in checks.items():
  if not ok:errors.append(f'{path}: {name}')
 report.append({'url':url,'title':p.title,'description':desc,'checks':checks})
visited=set();queue=['/']
while queue:
 path=queue.pop()
 if path in visited:continue
 visited.add(path)
 if path not in pages:continue
 for link in pages[path].links:
  u=urlsplit(urljoin('https://willchai.com'+path,link))
  if u.netloc=='willchai.com' and u.path in pages and u.path not in visited:queue.append(u.path)
for url in urls:
 if urlsplit(url).path not in visited:errors.append(f'Unlinked indexable page: {url}')
if len(urls)!=len(set(urls)):errors.append('Duplicate sitemap URL')
if '/blog/' in [urlsplit(u).path for u in urls]:errors.append('Empty Blog entered sitemap')
if (dist/'blog/what-i-learned-running-for-msu-office/index.html').exists():errors.append('Private draft in production output')
for p in ['/projects/conspirasea/','/projects/searing-stories/']:
 if 'https://willchai.com'+p in urls:errors.append('Retired route entered sitemap')
for line in (dist/'_redirects').read_text().splitlines():
 if not line.strip() or line.startswith('#'):continue
 old,new,status=line.split()
 if old==new:errors.append(f'Redirect loop: {old}')
 if not new.startswith('http'):
  target=urlsplit(new).path;f=dist/target.lstrip('/')
  if not f.is_file() and not (f/'index.html').is_file():errors.append(f'Missing redirect target: {new}')
(root/'artifacts/site-review-2026-09-17/seo-page-audit.json').write_text(json.dumps({'pages':report,'errors':errors},indent=2))
print(f'Checked {len(urls)} indexable pages, JSON data, sitemap, redirect destinations and private draft exclusion.')
if errors:print('\n'.join(errors));sys.exit(1)
print('SEO checks passed.')
