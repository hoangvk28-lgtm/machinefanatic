import json,sys,urllib.request,urllib.parse
UA={'User-Agent':'MachineFanaticImageResearch/1.0 (editorial research)'}
def q(params):
    u='https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode(params)
    return json.load(urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=30))
out={}
for term in sys.argv[1:]:
    d=q({'action':'query','format':'json','generator':'search','gsrsearch':f'filetype:bitmap {term}','gsrnamespace':6,'gsrlimit':12,'prop':'imageinfo','iiprop':'url|extmetadata|size','iiurlwidth':1200})
    res=[]
    for p in (d.get('query',{}).get('pages',{}) or {}).values():
        ii=p['imageinfo'][0]; m=ii.get('extmetadata',{})
        g=lambda k:(m.get(k,{}).get('value') or '')
        import re
        strip=lambda s:re.sub('<[^>]+>','',s).strip()
        res.append({'title':p['title'],'thumb':ii.get('thumburl'),'w':ii.get('width'),'h':ii.get('height'),'license':g('LicenseShortName'),'artist':strip(g('Artist'))[:80],'page':ii.get('descriptionurl'),'desc':strip(g('ImageDescription'))[:120]})
    out[term]=res
    for r in res: print(term,'|',r['title'][5:70],'|',r['license'],'|',r['w'],'x',r['h'],'|',r['artist'][:30])
json.dump(out,open('commons.json','w'),indent=1)
