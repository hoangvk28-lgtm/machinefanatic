# Brief: clone rounds 24 and later (coordinator on a remote machine)

Written 2026-11-12. Read `CLAUDE.md` first: the MachineFanatic rules at the top win over everything else. This brief adds only what is specific to these rounds. The copy-paste coordinator prompt is at the end.

## State when this was written
- Rounds 16 to 19 (PopMech gap, 125 topics) are done and pushed.
- Round 20 (snow blowers): 20 guides written, 28 skipped. Not yet registered or committed.
- Round 21 (aerators, dethatchers, sweepers): 38 guides written, 20 skipped. Product descriptions are being rewritten (see lesson 1). Not yet registered or committed.
- Rounds 22 (leaf blowers, leaf vacuums, hedge trimmers, string trimmers) and 23 (wood chippers, shredders, log splitters, augers, pole saws, tillers): Stage A started on the local machine.
- **Before starting round 24, run `git pull` and check `docs/clone-log.md`** to see whether rounds 20 to 23 were finished and pushed. Never re-run a round that is already in the log.
- `source-index.json` still has about 2,100 `todo` topics.

## Round plan

| Round | Cluster (regex on todo slugs) | Research file to reuse |
|---|---|---|
| 24 | `edger\|sprayer\|lawn-mower\|pressure-washer` | edgers.md, garden-sprayers.md, lawn-mowers.md, pressure-washers.md |
| 25 | `generator` (not `solar-generator`) + `inverter` + `power-station` | inverter-generators.md, power-inverters.md, power-stations.md |
| 26 | `solar-generator\|solar-panel\|panel-kit` | power-stations.md, solar-panels.md |
| 27 | `cordless-vacuum\|stick-vacuum\|handheld-vacuum\|upright-vacuum\|canister-vacuum` | **new**: write vacuums.md from web search |
| 28 | `robot-vacuum\|cleaning-robot\|pool-cleaner\|vacuum-mop` | **new**: robot-vacuums.md, pool-cleaners.md |
| 29 | `carpet-cleaner\|steam-cleaner\|steam-mop\|electric-mop\|garment-steamer\|steam-iron` | steam-cleaners.md (+ new carpet-cleaners.md) |
| 30 | `space-heater\|dehumidifier\|humidifier\|patio-heater\|camping-fan\|tent-fan` | space-heaters.md, dehumidifiers.md, humidifiers.md, patio-heaters.md, camping-fans.md |
| 31+ | Kitchen machines: vacuum sealers, kettles, immersion blenders, toaster ovens, countertop dishwashers, coffee makers, air fryers, food processors, slow/rice cookers, bread makers, ice makers | almost all exist in docs/research |
| last | `transfer-switch` leftovers (112) and `buyer-notes` (53) | only if the user asks |

**Never take:** label printers, 3D printers and filament, podcast/streaming/XLR mixers, oven mitts, tents, detectors, accessories (cabs, tires, tines, chains, covers, bags). The user wants machines, not gadgets (memory: topic preference).

Each round should be 30 to 50 topics **after** the extra brand filter (Stage A2 below). If a regex returns more than about 70 todo slugs, split it into two rounds.

## Budget (under-N) topics
The user wants budget guides for these machine clusters too. Rules are in CLAUDE.md ("under-N budget guides may name their cap") and the "Budget topics" section of `docs/BEST-GUIDE-BRIEF-LEAN.md`.

- Some under-N slugs already exist as `todo` (vacuums, carpet cleaners, compact washers, camping fans…). They ride along with their cluster's round automatically if the regex matches them.
- For clusters that have none, add them with `scripts/clone/add-topics.mjs`. Format, one per line: `<slug-without-best->|<Title>|<category>`. Example file `docs/rounds/budget-outdoor.txt`:

```
snow-blowers-under-500|Snow Blowers Under $500|outdoor-power
snow-blowers-under-1000|Snow Blowers Under $1000|outdoor-power
electric-snow-blowers-under-300|Electric Snow Blowers Under $300|outdoor-power
lawn-aerators-under-100|Lawn Aerators Under $100|outdoor-power
electric-dethatchers-under-200|Electric Dethatchers Under $200|outdoor-power
lawn-sweepers-under-200|Lawn Sweepers Under $200|outdoor-power
leaf-blowers-under-100|Leaf Blowers Under $100|outdoor-power
cordless-leaf-blowers-under-200|Cordless Leaf Blowers Under $200|outdoor-power
hedge-trimmers-under-100|Hedge Trimmers Under $100|outdoor-power
string-trimmers-under-100|String Trimmers Under $100|outdoor-power
wood-chippers-under-500|Wood Chippers Under $500|outdoor-power
log-splitters-under-1000|Log Splitters Under $1000|outdoor-power
tillers-under-300|Tillers Under $300|outdoor-power
pole-saws-under-150|Pole Saws Under $150|outdoor-power
pressure-washers-under-200|Pressure Washers Under $200|outdoor-power
lawn-mowers-under-300|Lawn Mowers Under $300|outdoor-power
inverter-generators-under-1000|Inverter Generators Under $1000|shop-garage
power-stations-under-500|Portable Power Stations Under $500|shop-garage
```

- Before adding a slug, run `grep -c "<slug>" scripts/clone/source-index.json` and `ls data/guides/ | grep <stem>-under`. `add-topics.mjs` skips existing slugs, but check by eye anyway, because a near-duplicate cap (under-100 vs under-75) is a thin page.
- Pick caps where real machines exist: about the bottom third of the cluster's price range. The cap must sit well above the cheapest junk, or the lineup will be toys and parts.
- Budget slugs go into the round of their cluster, never a separate round. They then share the research file.
- `compact.mjs` marks `underCap: true` and `prefilter.mjs` counts only those. A budget slug needs **3 or more items with underCap true that are real machines**. Otherwise, skip it.

## Stage A (zero AI tokens)
```bash
git pull
git config user.name >/dev/null || echo "NO GIT IDENTITY: ask the user before committing"
node -e "
const a=require('./scripts/clone/source-index.json');
const r=a.filter(x=>x.status==='todo'&&/<REGEX>/.test(x.slug)).map(x=>x.slug);
require('fs').writeFileSync('scripts/clone/work/round24.txt',r.join('\n')+'\n');console.log(r.length)"
SLUGS_FILE=scripts/clone/work/round24.txt node scripts/clone/next-batch.mjs 100
for s in $(tr -d '\r' < scripts/clone/work/round24.txt); do node scripts/clone/compact.mjs $s; done
node scripts/clone/prefilter.mjs --inprogress
```

### Stage A2: brand and type filter by hand (new, mandatory)
Prefilter is too loose. In round 20 it passed 48 snow blower slugs and the writer had to skip 28 of them. It matched "yard" for Yard Glow, counted parts and toys, and passed Toro, John Deere, Kubota and Ventrac with zero real machines. In round 21 it passed 58 slugs and the writer skipped 20. Every one of those skips cost writer tokens.

Before spawning writers, for every brand or type slug print the compact titles and count real machines:
```bash
for s in $(tr -d '\r' < scripts/clone/work/round24.txt); do
  n=$(node -e "const j=require('./scripts/clone/work/$s.compact.json');const it=j.items||j.products||[];console.log(it.length)")
  echo "== $s ($n)"; node -e "const j=require('./scripts/clone/work/$s.compact.json');(j.items||j.products||[]).forEach(i=>console.log('  ',(i.underCap===false?'[over] ':'')+(i.title||i.name).slice(0,90)))"
done > scripts/clone/work/round24.titles.txt
```
Read the file. Skip (`node scripts/clone/mark.mjs skip <slug>` + one line in clone-log) any slug with:
- **brand slugs:** fewer than 3 distinct models whose title starts with or clearly contains that brand (bundles or kit/tool-only variants of one model count as one);
- **type slugs** (riding, robotic, tow-behind, two-stage, commercial, industrial, ride-on, skid-steer, ATV…): fewer than 3 machines that are really that type;
- **accessory topics** (cabs, tires, tines, blades, covers, bags, chains, liquid "aerators").

Write the surviving list to `scripts/clone/work/round24.ok.txt`. Only that list goes to writers.

## Research
Reuse `docs/research/<file>.md` when it exists. For a new cluster (vacuums, robot vacuums, pool cleaners, carpet cleaners), the coordinator runs 2 to 4 WebSearch queries first ("how to choose", "vs", common buyer mistakes, safety/standards) and saves `docs/research/<cluster>.md` from what the searches returned. **Never write research from memory.**

## Writers
2 Sonnet writers (`model: "sonnet"`, never Opus), each given its whole list up front, grouped by cluster. Keep each list to **25 to 30 slugs at most**. A writer with 50+ slugs in round 21 ran out of patience and built a generator.

### Lesson 1 (round 21): no generators, no shared sentence pools
Writer B in round 21 wrote a script that assembled 58 specs from shared pools. Every product description got the same skeleton ("The listing gives type…", "The compromises are plain:…", "The strongest points are…", "It is aimed at…", 200+ times each) and maintenance lines were copied across guides. It passed selfcheck and audit but is duplicate content. The user caught it, and the descriptions had to be rewritten. The writer prompt below forbids this. The coordinator's cross-guide check (Finish step 5) catches it if it happens anyway.

### Lesson 2 (round 20): words at the floor
Round 20 guides sit at 3,000 to 3,070 words, right at the selfcheck floor. Spot-check 2 or 3 for padding (the same idea restated) before shipping.

## Finish (coordinator)
```bash
S=$(tr -d '\r' < scripts/clone/work/round24.ok.txt | grep -vxFf <(cut -d: -f1 scripts/clone/skip-a.txt scripts/clone/skip-b.txt) | tr '\n' ' ')
for s in $S; do node scripts/register-dynamic-guide.mjs $s; done
node scripts/register-new-guides.mjs $S            # Node 22 needed for the .ts imports
node scripts/clone/mark.mjs done $S
node scripts/audit-guides.mjs $S
grep -l '【' $(for s in $S; do echo data/guides/$s.ts; done)   # must print nothing
# 5. cross-guide duplicate check (must print at most a few short safety lines):
for s in $S; do grep -oE '[A-Z][^.!?"]{40,}[.!?]' data/guides/$s.ts | sort -u; done | sort | uniq -c | awk '$1>=3' | sort -rn | head -20
# 6. description skeleton check: no 4-word opening more than 5 times across the round
for s in $S; do grep -oE 'description: "[^"]+"' data/guides/$s.ts | grep -oE '[A-Z][^.!?]{20,}[.!?]' | sed -E 's/^(([^ ]+ ){4}).*/\1/'; done | sort | uniq -c | sort -rn | head
npx tsc --noEmit
NODE_OPTIONS=--max-old-space-size=6144 npx next build > build.log 2>&1; grep -E "Compiled successfully|Finished TypeScript|Error" build.log
```
Then add a round entry to `docs/clone-log.md` (topics, skips with reasons, writers, word range, checks). Commit only `data/`, `docs/` and `scripts/clone/source-index.json`, plus the `.spec.json` files only if earlier rounds committed them. Send preview links, and push to `main` only after the user approves.

### Preview
The agent's background dev server dies whenever the agent session restarts, and the user then cannot open the links. Ask the user to run `npx next dev -p 3000` in their own terminal and give them the `/guide/<slug>` links. If that fails, push a `preview-<round>` branch for a Vercel preview, which needs a git identity.

## Coordinator prompt (paste this tomorrow)
```
Read CLAUDE.md and docs/rounds/NEXT-ROUNDS-BRIEF.md. Checkout main and git pull.
Check docs/clone-log.md for which rounds are finished. Start at the first unfinished round from round 24 in the brief's plan.
Add the budget topics from the brief for that round's cluster with add-topics.mjs (check for existing/near-duplicate caps first).
Run Stage A and Stage A2 exactly as the brief says. Show me the per-slug machine counts and the skip list before spawning writers.
Then spawn 2 Sonnet writers with the writer prompt from the brief (max 25-30 slugs each). When they finish, run the Finish steps including both duplicate checks, and give me preview instructions. Do not push to main before I approve.
```

## Writer prompt (coordinator fills in the <> parts)
```
You are writer agent <A|B> for the MachineFanatic project. Repo root: <path>. ALWAYS cd to the repo root before running any node script.
Read ONLY docs/BEST-GUIDE-BRIEF-LEAN.md. Follow it exactly.
Your slugs, grouped by cluster (research file in brackets):
Cluster <name> (docs/research/<file>.md): <slug>, <slug>, ...
For each slug: read scripts/clone/work/<slug>.compact.json (never .input.json), write the spec by hand in ONE Write, run node scripts/clone/selfcheck.mjs <slug> and fix by Edit, then node scripts/clone/finish.mjs <slug> (must print "built | audit ok").
FORBIDDEN: writing any script, generator, template or shared sentence pool that assembles specs; copying sentences between guides; a fixed per-product skeleton (e.g. every description opening "The strongest points are..." / "It is aimed at..."). Every product description is written for that machine: lead with what is distinctive about it, vary structure, and make maintenance advice specific to its design. If you feel the need to automate, stop and report instead.
Research: if the cluster research file is missing, run 2-4 web searches first; never write research from memory. Give each sibling guide its own angle.
Budget slugs (-under-N): only products with underCap true; the cap may appear in title/meta/prose, no other dollar figure, never a product price.
Type/brand slugs: every product must really be that type/brand. If a slug has fewer than 3 distinct real on-topic machines, append "<slug>: reason" to scripts/clone/skip-<a|b>.txt (the 40% candidate quota is never a skip reason).
Do NOT run register scripts, mark.mjs, npm run build or git, and do not edit shared files.
Final report: one line per slug, done or skipped: reason.
```

## RESUME FIRST: rounds 22 and 23 were in progress (2026-11-13)
Writers were mid-run when the session ran out. Stage A and A2 are done. Lists: `scripts/clone/work/r22a.txt` (38 leaf blower/vacuum), `round23.ok.txt` (32 chipper/shredder/splitter/auger/pole saw/tiller) and `r22b.txt` (26 hedge/string trimmer, not started). The `.compact.json` files are in `scripts/clone/work/` on the ORIGINAL machine only (work/ is not committed). On a different machine, re-run Stage A for those lists first.
A slug is finished when `data/guides/<slug>.ts` exists and `finish.mjs` printed "built | audit ok"; skips are in `scripts/clone/skip-a.txt` / `skip-b.txt`. Give each new Sonnet writer only the unfinished, unskipped slugs:
```bash
for f in r22a.txt round23.ok.txt r22b.txt; do for s in $(tr -d '\r' < scripts/clone/work/$f); do [ -f data/guides/$s.ts ] || grep -q "^$s:" scripts/clone/skip-?.txt || echo $s; done > scripts/clone/work/left-$f; done
```
Writer prompt: the one below, plus "3 distinct real machines is enough, write it" and "do not stop early because the list is long". Then run Finish for all of rounds 22 and 23 together (register, mark done + mark skip, audit, both duplicate checks, tsc, build, clone-log, commit, push).

## RESUME (2026-11-14): round 29 committed locally, round 30 in progress
- Round 29 (76 vacuum guides) is committed locally as `66935f9` on main, NOT pushed. A branch `preview-r29` was pushed for preview only. The user said: no push of anything until they approve.
- Git identity for this repo is set (repo-level): hoangvk28-lgtm.
- Round 30 = robot vacuums, robotic pool cleaners, window robots, vacuum mops. Stage A and A2 done ON THIS MACHINE (compact files in scripts/clone/work/). 4 skips already marked. Research: `docs/research/robot-cleaners.md`.
- Lists: `scripts/clone/work/r30a.txt` (31 robot vacuum), `r30d.txt` (33 pool + window), `r30e.txt` (18 vacuum mops, not started). Writer skips go to `scripts/clone/skip-a.txt` / `skip-b.txt`.
- A slug is finished when `data/guides/<slug>.ts` exists (finish.mjs printed "built | audit ok"). List unfinished:
  `for f in r30a r30d r30e; do for s in $(tr -d '\r' < scripts/clone/work/$f.txt); do [ -f data/guides/$s.ts ] || grep -q "^$s:" scripts/clone/skip-?.txt || echo $s; done; done`
- Writer prompt: copy the round-30 rules: Sonnet only, read only BEST-GUIDE-BRIEF-LEAN.md + the research file, one spec per Write, selfcheck, finish.mjs; no generators; no 4-word opening more than 4 times per batch; no sentence in 3+ guides; never pad type/brand slugs; the budget is approved, do not stop early.
- Finish for round 30 = the Finish section above (register, mark done, audit, both duplicate checks with top opening <= 6, tsc, build, clone-log entry, local commit). Then give preview links (dev server: `npx next dev -p 3005`; curl needs a browser User-Agent because proxy.ts returns 403 otherwise).
- Next after round 30: round 31 per the plan (carpet-cleaner / steam / garment-steamer cluster).

## RESUME (2026-11-14, late): round 30 PUSHED, round 31 Stage A started
- Round 30 (81 guides) and round 29 are pushed to main (`dbdc073`); IndexNow pinged (157 URLs, HTTP 200). No preview needed for those.
- Open debt from round 30: the description-opening check still shows top 11 (e.g. "Compared with the Roomba", "Charge after each cycle", "It is the most", "Compared with the Roborock", "Charge after each run"). Target is <= 6. Optional cleanup: one Sonnet agent, hand Edits to `scripts/clone/work/<slug>.spec.json` then `finish.mjs`, round-30 slugs only (r30a/r30d/r30e lists). Then build, commit, push, IndexNow for edited slugs.
- Round 31 = carpet cleaners, spot/upholstery cleaners, steam cleaners, steam mops, garment steamers, floor scrubbers. Regex `carpet-clean|steam|garment|upholstery|spot-clean|carpet-shampoo|floor-scrub` gave 93 todo slugs in `scripts/clone/work/r31.txt` (more than 70: split into r31a (carpet/spot/upholstery/floor-scrub) and r31b (steam/steam mop/garment) after Stage A2).
- Stage A (next-batch, compact, prefilter) was launched for r31.txt; log in `scripts/clone/work/r31.stageA.log`. If `.compact.json` files exist for every r31 slug, it finished: skip straight to Stage A2. Otherwise re-run only the missing slugs.
- Research for round 31 (web-searched, real numbers): `docs/research/carpet-steam.md`. Writers read only the lean brief + this file. No extra web search unless a slug needs something the file lacks.
- Session plan: Stage A2 (print titles, skip <3 real machines, brand/type purity), split into 2 lists of 30-50, spawn 2 Sonnet writers with the round-30 writer prompt (as given in the RESUME above, plus: "no 4-word description opening more than 4 times per batch; vary maintenance sentence openings; never start descriptions with 'It costs', 'Compared with the', 'Charge after', 'Rinse the', 'Empty the'"), then Finish, preview on port 3005, push only after approval, IndexNow.

## RESUME (2026-11-14, night): round 31 writers running
- Research `docs/research/carpet-steam.md` committed (`3b2961f`). Stage A and A2 done on THIS machine.
- 5 coordinator skips already marked (list: `scripts/clone/work/r31.skip.txt`). Writer skips go to `scripts/clone/skip-a.txt` / `skip-b.txt` (not yet marked).
- Writer lists: `scripts/clone/work/r31a.txt` (23 carpet/spot/upholstery, writer A), `r31b1.txt` (33 steam mop + handheld steam cleaner, writer B1), `r31b2.txt` (32 garment steamer + steam iron, writer B2). User approved that the handheld steam cleaner slugs share the same machines; each needs its own angle.
- Writer prompt = the round-30 rules plus: Sonnet only; read only BEST-GUIDE-BRIEF-LEAN.md + docs/research/carpet-steam.md; no 4-word opening more than 4 times per batch; never start a description sentence with "It costs", "Compared with the", "Charge after", "Rinse the", "Empty the"; no sentence in 3+ guides; 3 real machines is enough; never pad brand/type slugs; do not stop early.
- Unfinished slugs: `for f in r31a r31b1 r31b2; do for s in $(tr -d '\r' < scripts/clone/work/$f.txt); do [ -f data/guides/$s.ts ] || grep -q "^$s:" scripts/clone/skip-?.txt || echo $s; done > scripts/clone/work/left-$f.txt; done`
- Then Finish for all r31 done slugs (Finish section above; top description opening must be <= 6), mark skip the writer skips, clone-log, local commit, preview on `npx next dev -p 3005`. Push main + IndexNow ONLY after user approval.
- After that, optional: fix round 30 opening repeats (top 11, target <= 6) with 1 Sonnet agent, Edit on spec.json + finish.mjs.

## Winter plan (approved 2026-11-14)
Order: 32 home space heaters (~40: by room, type, feature, brand; drop the 2 projector slugs) -> 33 humidifiers (39) + air purifiers (18) -> 34 holiday kitchen (food processor, hand/stand mixer, slow cooker, bread maker; 40-50, before mid-December) -> 35 RV/tent/patio heaters (~26). Dehumidifiers and remaining kettles after winter.
Budget topics to add before Stage A (check duplicates first): space-heaters-under-50, space-heaters-under-100, oil-filled-space-heaters-under-100, humidifiers-under-50, food-processors-under-100.
Writer prompt additions: no script or node -e to pad word count (B2 did this in round 31); never open a sentence with "Empty the tank after" or "Use distilled water".

## RESUME (2026-11-14, late night): round 31 PUSHED, round 32 writers running
- Round 31 pushed (`bff94ed`), IndexNow 82 URLs HTTP 200.
- Round 32 = 36 home space heater slugs (Stage A + A2 done on THIS machine, no skips). Lists: `scripts/clone/work/r32a.txt` (writer A, skips to skip-a.txt), `r32b.txt` (writer B, skips to skip-b.txt). Research: docs/research/space-heaters.md. Space heater under-N budget guides already existed; only oil-filled-space-heaters-under-100 was added.
- Unfinished: `for f in r32a r32b; do for s in $(tr -d '\r' < scripts/clone/work/$f.txt); do [ -f data/guides/$s.ts ] || grep -q "^$s:" scripts/clone/skip-?.txt || echo $s; done > scripts/clone/work/left-$f.txt; done`
- Then Finish (top opening <= 6), clone-log, local commit, preview; push only after approval. Next: round 33 humidifiers + air purifiers.
- Round 33 near-dup vs published: skip best-humidifiers-and-air-purifier-combos (= best-air-purifier-and-humidifier-combos). Run the normalized near-dup check before Stage A of every round.
