# Brief: PopMech gap rounds 16 and 17 (coordinator on a remote machine)

Written 2026-11-12. Read `CLAUDE.md` first (the MachineFanatic rules at the top win over everything else). This brief adds only what is specific to these rounds.

## Why these topics
In November 2026 we compared popularmechanics.com's Home & DIY menu with our guide list. Round 15 (commit `7bc8a96`) covered priority 1 (shop & garage: wet-dry vacs, air compressors, welders, floor jacks, nailers, bench machines). What is still missing:

| Round | Clusters | Topics |
|---|---|---|
| 16 | Smokers (15), pizza ovens (13) | 28 |
| 17 | Pellet/gas/charcoal/electric grills, griddles (32) | 32 |
| 18 | Sump/well/pool pumps (13), window/portable/mini-split AC (15), tankless water heaters (7) | 35 |
| 19 | Air purifiers (15), espresso machines and grinders (15) | 30 |

125 topics in total. Each cluster gets the main topic plus variants by type, size (BTU, inches, HP, burners), brand, use case and budget (under-N, see the CLAUDE.md rule). Exact slugs are in `docs/rounds/popmech-gap-topics.txt`, one `## ROUND` block per round. Do not take gadget topics (thermostats, locks, cameras, doorbells, smoke detectors, WiFi, TVs): the user wants machines.

Expect prefilter to drop 10% to 25% of the brand, size and under-N topics. That is normal: never write a guide with fewer than 4 real matching machines. Each round is sized like round 15 (about 30 to 40 topics): 2 Sonnet writer agents with roughly 15 to 20 slugs each, split by cluster. Run the rounds one at a time, in order (16 first: highest-ticket products).

## Step 0: setup on the remote machine
```bash
git pull
git config user.name >/dev/null || echo "NO GIT IDENTITY: ask the user before committing"
```
`.env.local` must hold the Amazon Creators API keys. Print their length, never the value: a short fixed length means a redacted Vercel secret.

## Step 1: Stage A (zero AI tokens)
Split the topic file per round first (example for round 16):
```bash
awk '/^## ROUND 16/{f=1;next} /^## ROUND/{f=0} f' docs/rounds/popmech-gap-topics.txt > docs/rounds/r16.txt
node scripts/clone/add-topics.mjs docs/rounds/r16.txt scripts/clone/work/round16.txt
SLUGS_FILE=scripts/clone/work/round16.txt node scripts/clone/next-batch.mjs 40
for s in $(cat scripts/clone/work/round16.txt); do node scripts/clone/compact.mjs $s; done
node scripts/clone/prefilter.mjs --inprogress
```
Then print per-slug item counts from each `.compact.json` and look at them (CLAUDE.md checklist item 2). Remove any slug with fewer than 4 usable machines from the round list and run `node scripts/clone/mark.mjs skip <slug>`.

Known traps for these clusters:
- **Grills and smokers:** the search returns covers, grates, thermometers, pellets, wood chips and tool sets. Phrase-level junk terms (for example "grill cover", "smoker pellets", "wood chips") go in `scripts/clone/junk.mjs`, never single words like "cover". Test each new term against a real machine title first (rule 4).
- **Pizza ovens:** watch for pizza stones, peels and oven covers. "Electric pizza ovens" also brings back countertop toaster ovens, which do not count.
- **Mini-splits:** many listings are line-set kits or brackets. You need at least 4 real units.
- **Espresso:** milk frothers, tampers and knock boxes are accessories, not machines.
- **Air purifiers:** never junk the bare word "filter". A "True HEPA Filter" title is a real purifier (rule 4).

## Step 2: research before writing (do not skip this time)
Round 15 writers skipped web search and wrote research files from memory. For these clusters, specs such as BTU/SEER2, GPH at head height, cooking temperature range and bar pressure must come from real sources. So:
- The coordinator, or the first writer slug in each cluster, runs 2 to 4 WebSearch queries per cluster ("how to choose", "vs", common buyer mistakes, safety). Save the results to `docs/research/<cluster>.md`: smokers.md, grills.md, pizza-ovens.md, sump-pumps.md, air-conditioners.md (reuse rv-air-conditioners.md only for general knowledge), tankless-water-heaters.md, espresso-machines.md, air-purifiers.md (already exists, reuse it).
- Write the writer prompt so it says "if docs/research/<cluster>.md is missing, do the web searches first; never write research from memory".

## Step 3: writer agents
Sonnet only, 2 agents, each given its full list up front, grouped by cluster. Use the round 15 prompt below and change only the slug lists:

```
You are writer agent <A|B> for the MachineFanatic project. Repo root: <path>. ALWAYS cd to the repo root before running any node script.
Read ONLY docs/BEST-GUIDE-BRIEF-LEAN.md. Follow it exactly.
Your slugs, grouped by cluster (research file in brackets):
Cluster <name> (docs/research/<file>.md): <slug>, <slug>, ...
For each slug: read scripts/clone/work/<slug>.compact.json (never .input.json), write the spec in ONE Write, run node scripts/clone/selfcheck.mjs <slug> and fix by Edit, then finish per the lean brief (scripts/clone/finish.mjs <slug> must print "built | audit ok").
Research: if the cluster research file is missing, run 2-4 web searches first; never write research from memory. Give each sibling guide its own angle; no copy-paste skeletons.
For size/type slugs (offset, vertical, wood-fired, battery-backup, ...), every product must actually be that type.
If a slug has fewer than 4 distinct on-topic machines, append "<slug>: reason" to scripts/clone/skip-<a|b>.txt (the 40% candidate quota is never a skip reason).
Do NOT run register scripts, mark.mjs, npm run build or git, and do not edit shared files.
Final report: one line per slug, done or skipped: reason.
```

## Step 4: coordinator finish
```bash
S=$(tr -d '\r' < scripts/clone/work/round16.txt | tr '\n' ' ')   # minus skipped slugs
for s in $S; do node scripts/register-dynamic-guide.mjs $s; done
node scripts/register-new-guides.mjs $S
node scripts/clone/mark.mjs done $S
node scripts/audit-guides.mjs $S
grep -l '【' $(for s in $S; do echo data/guides/$s.ts; done)          # must print nothing
for s in $S; do grep -oE '[A-Z][^.!?"]{30,}[.!?]' data/guides/$s.ts | sort | uniq -c | awk '$1>=3' | head -1; done   # repeated sentences, must print nothing
npx tsc --noEmit
NODE_OPTIONS=--max-old-space-size=6144 npx next build > build.log 2>&1; grep -E "Compiled successfully|Finished TypeScript|Error" build.log
```
Add a line to `docs/clone-log.md`, commit only `data/`, `docs/` and `scripts/clone/source-index.json` (never other files you did not touch), show the user a few local links, and push to `main` only after the user approves.

## Lessons from round 15 (remote machine edition)
- **`npm run dev` can crash with OOM right after a build** (RAM is used up). Use `npx next start -p 3000` with the production build you just made: it is lighter and it is exactly what goes live.
- **No git identity on a new machine:** ask the user rather than inventing one.
- **Sonnet writers often pad up to just over 3,000 words.** Spot-check 2 or 3 guides per round for padding (repeated ideas phrased differently), not only for repeated exact sentences.
- **IndexNow:** the Vercel postbuild pings changed URLs on its own. To ping manually: `node scripts/indexnow.mjs <slug...>`.
