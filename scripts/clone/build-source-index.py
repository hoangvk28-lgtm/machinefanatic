# Scans sibling affiliate projects for machine-related "best" guides and writes
# scripts/clone/source-index.json (slug, title, source, ASINs, suggested category).
# Run on a machine that has the source repos checked out next to this one:
#   python3 scripts/clone/build-source-index.py ../
import json,os,re,sys
root=sys.argv[1] if len(sys.argv)>1 else '..'
SOURCES=['BestFindsReviews','DannyCamping','Gardening Is Ezee','HardcastlesRV','primeareviews','smartspace-picks','standbywatts','The Office Journal','workcocoon']
CATS=[
 ('power-tools',r'drill|driver|impact|circular-saw|jigsaw|reciprocating|miter-saw|table-saw|band-saw|scroll-saw|track-saw|sander|grinder|wood-router|plunge-router|trim-router|router-table|nailer|nail-gun|heat-gun|rotary-tool|oscillating|planer|jointer|multi-tool|stapler|glue-gun|soldering|power-tool'),
 ('outdoor-power',r'mower|trimmer|edger|blower|chainsaw|chain-saw|pole-saw|hedge|tiller|cultivator|snow-blower|snowblower|snow-thrower|pressure-washer|power-washer|log-splitter|wood-chipper|chipper|leaf-vac|lawn-sweeper|sprayer|aerator|dethatcher|scarifier|auger|brush-cutter|weed-eater'),
 ('shop-garage',r'compressor|welder|welding|plasma|generator|power-station|inverter|jump-starter|battery-charger|shop-vac|wet-dry-vac|work-light|bench|vise|jack|lathe|drill-press|tire-inflator|air-tool|dust-collector|solar-panel|winch'),
 ('kitchen-machines',r'espresso|coffee-maker|coffee-machine|grinder|blender|mixer|food-processor|juicer|air-fryer|toaster|oven|microwave|kettle|rice-cooker|pressure-cooker|instant-pot|slow-cooker|bread-maker|waffle|griddle|dehydrator|vacuum-sealer|ice-maker|ice-cream|smoker|grill|sous-vide|chopper|dishwasher|soda|popcorn|pasta-maker|meat-slicer|meat-grinder|frother|milk'),
 ('home-machines',r'vacuum|robot|mop|steam-cleaner|carpet-cleaner|dehumidifier|humidifier|air-purifier|purifier|heater|fan|air-conditioner|washer|dryer|washing-machine|sewing|serger|embroidery|steam-iron|clothes-iron|-irons|steamer|water-softener|sump-pump|pump|garment|shredder|printer|label-maker|laminator'),
]
EXCL=r'skillet|cookware|pan-|pans|detergent|soap|cleaning-solution|cooling-pad|laptop|ups-|-ups|wifi|mesh|modem|onu|cable|charger-for|stand|mount|cover|shelf|shelves|organizer|rack|stand-for|holder|cover|bag|case|mat|cart|caddy|hook|basket|bin|tray|curtain|rug|pillow|chair|desk|table(?!-saw)|lamp|light(?!-)|book|cookbook|accessor|attachment|filter|blade-sharpener|replacement|kit-for|-vs-|how-to|what-is|guide-to'
idx={}
for src in SOURCES:
  d=os.path.join(root,src,'data','guides')
  if not os.path.isdir(d): print('missing',src); continue
  for f in sorted(os.listdir(d)):
    slug=re.sub(r'\.(ts|json)$','',f)
    if not slug.startswith('best-') or re.search(EXCL,slug): continue
    cat=next((c for c,rx in CATS if re.search(rx,slug)),None)
    if not cat: continue
    txt=open(os.path.join(d,f),encoding='utf-8',errors='ignore').read()
    asins=list(dict.fromkeys(re.findall(r'(?:dp/|"asin":\s*")(B0[A-Z0-9]{8})',txt,re.I)))
    if len(asins)<3: continue
    m=re.search(r'(?:guideTitle|"title")\s*[=:]\s*"([^"]+)"',txt)
    kw=re.search(r'mainKeyword\s*[=:]\s*"([^"]+)"',txt)
    row={'slug':slug,'title':m.group(1) if m else slug,'mainKeyword':kw.group(1) if kw else slug[5:].replace('-',' '),'category':cat,'source':src,'asins':[a.upper() for a in asins][:10]}
    if slug in idx:  # duplicate topic across projects: keep the one with more ASINs, remember others
      idx[slug].setdefault('alsoIn',[]).append(src)
      if len(row['asins'])>len(idx[slug]['asins']): row['alsoIn']=idx[slug]['alsoIn']; idx[slug]=row
    else: idx[slug]=row
rows=sorted(idx.values(),key=lambda r:(r['category'],r['slug']))
here=os.path.dirname(os.path.abspath(__file__))
existing={f[:-3] for f in os.listdir(os.path.join(here,'..','..','data','guides')) if f.endswith('.ts')}
for r in rows: r['status']='done' if r['slug'] in existing else 'todo'
json.dump(rows,open(os.path.join(here,'source-index.json'),'w'),indent=1)
from collections import Counter
print(len(rows),'topics',Counter(r['category'] for r in rows),Counter(r['status'] for r in rows))
