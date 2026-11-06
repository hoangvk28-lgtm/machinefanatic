import json,re,time,urllib.request,urllib.parse,os,io
from PIL import Image
UA={'User-Agent':'MachineFanaticImageResearch/1.0 (editorial; contact via site)'}
PICK={
'plunge-saw-in-use-1':'0x-tauchkreis-1.jpg','plunge-saw-in-use-2':'0x-tauchkreis-2.jpg','plunge-saw-in-use-3':'0x-tauchkreis-3.jpg',
'circular-saw-filler-panel':'Circular Saw Ready to Cut a Filler Panel.jpg',
'center-lathe':'HwacheonCentreLathe 460x1000.jpg','metal-lathe-workshop':'Metal lathe. School workshop.jpg',
'wood-bowl-turning':'Bowl turning.jpg','lathe-in-action':'Lathe in action.jpg','lathe-center-drilling':'Lathe Center Drilling.jpg',
'taig-benchtop-lathe':'Taig metal lathe, Drill press and Workbench.jpg',
'dewalt-reciprocating-saw':'DeWalt Reciprocating Saw (5073128275).jpg','milwaukee-reciprocating-saw':'Milwaukee Reciprocating Saw.jpg',
'sliding-compound-miter-saw':'Compound sliding miter saw 3 (51633919636).jpg','miter-saw-workshop':'MiterSaw.jpg',
'circular-saw-in-use':'DeWalt circular saw in use.jpg','circular-saw-woodworking':'Circular saw woodworking.JPG',
}
os.makedirs('../../public/images/articles',exist_ok=True)
man=json.load(open('images.json')) if os.path.exists('images.json') else {}
strip=lambda s:re.sub('<[^>]+>','',s or '').strip()
for key,title in PICK.items():
  if key in man: continue
  u='https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode({'action':'query','format':'json','titles':'File:'+title,'prop':'imageinfo','iiprop':'url|extmetadata','iiurlwidth':1400})
  for attempt in range(4):
    try:
      d=json.load(urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=30)); break
    except Exception as e: print('retry',key,e); time.sleep(15)
  p=list(d['query']['pages'].values())[0]; ii=p['imageinfo'][0]; m=ii['extmetadata']
  time.sleep(4)
  for attempt in range(4):
    try:
      raw=urllib.request.urlopen(urllib.request.Request(ii['thumburl'],headers=UA),timeout=60).read(); break
    except Exception as e: print('retry img',key,e); time.sleep(20)
  im=Image.open(io.BytesIO(raw)).convert('RGB'); im.thumbnail((1400,1400))
  out=f'../../public/images/articles/{key}.webp'; im.save(out,'WEBP',quality=80)
  man[key]={'file':f'/images/articles/{key}.webp','w':im.size[0],'h':im.size[1],'title':title,'license':strip(m.get('LicenseShortName',{}).get('value')),'artist':strip(m.get('Artist',{}).get('value')),'source':ii['descriptionurl'],'desc':strip(m.get('ImageDescription',{}).get('value'))[:200]}
  json.dump(man,open('images.json','w'),indent=1)
  print('ok',key,im.size,man[key]['license'],man[key]['artist'][:40]); time.sleep(4)
