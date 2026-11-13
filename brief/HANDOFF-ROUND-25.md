# Handoff: clone round 25 in progress (written 2026-11-13)

## State (updated when the session was paused, 2026-11-13)
- **Round 24 is finished and committed locally as `86ba039`, NOT pushed.** 48 guides
  (edgers, garden sprayers, lawn mowers, pressure washers). The user had not approved
  the push. Ask before pushing.
- **Round 25 is half done: 29 of 52 guides are built and all 29 pass `selfcheck.mjs`.**
  The clean list is `scripts/clone/work/round25.built-clean.txt`.
  The 23 still missing are listed in `scripts/clone/work/round25.remaining.txt`.
- The two writer agents that were producing these belonged to the paused session and
  are gone. **Re-spawn writers only for the 23 remaining slugs.** Do not re-write the
  29 that are done.
- Neither `scripts/clone/skip-a.txt` nor `skip-b.txt` has any round-25 entry yet, so no
  round-25 slug has been judged unviable by a writer.
- Round 25 cluster: portable and inverter generators. Research file reused:
  `docs/research/inverter-generators.md` (no web searches needed).
- Topics added this round with `add-topics.mjs` from `docs/rounds/budget-power.txt`:
  best-inverter-generators-under-500, best-inverter-generators-under-1000,
  best-dual-fuel-generators-under-1000. All 3 passed prefilter and are still unwritten.
- Round 25 skips already marked: best-7500-watt-inverter-generator and
  best-9000-watt-inverter-generator (prefilter, 2 matching items each);
  best-generator-for-50-amp-rv and best-generators-for-sump-pumps (Stage A2, only 3
  real on-topic machines each).
- Stage A and Stage A2 are fully done for round 25. **Do not re-run `next-batch.mjs`,
  `compact.mjs` or `prefilter.mjs`** for this round; every `.compact.json` already
  exists in `scripts/clone/work/`.

## How to resume
1. `cd /home/admin1/Downloads/AGENT/projects/machinefanatic` and check which of the 52
   already have `data/guides/<slug>.ts`:
   `for s in $(cat scripts/clone/work/round25.ok.txt); do [ -f data/guides/$s.ts ] || echo "TODO $s"; done`
2. For any slug still missing, spawn a Sonnet writer with the round-25 writer prompt
   (the writer prompt in `brief/NEXT-ROUNDS-BRIEF.md`, plus the data-contamination
   notes below). Never spawn an Opus writer.
3. Then run the Finish steps from `brief/NEXT-ROUNDS-BRIEF.md` over the slugs that have
   data files, minus anything in `scripts/clone/skip-a.txt` / `skip-b.txt`.

## Data contamination notes for round 25 (these cost tokens if rediscovered)
- Prefilter has **no `watt` unit rule**, so `best-NNNN-watt-*` slugs matched any title
  merely containing that number. Every product in a wattage slug must really be that
  wattage class; DC-to-AC inverters ("BELTTT 3000W Pure Sine Wave Inverter") and
  battery power stations are not generators.
- The 30-amp and 50-amp slugs are full of generator **cords and power inlet boxes**.
- Battery power stations and solar generators (Jackery, BLUETTI, Anker, EcoFlow,
  Goal Zero) appear throughout and belong to rounds 26 and later, not here.
- best-generators-for-food-trucks contains actual food trucks for sale, an ozone
  generator, warning signs and gas struts. best-generators-for-hurricane-season
  contains a novel and a hoodie. best-generators-for-refrigerators-and-freezers is
  mostly fridges. best-generators-for-well-pumps is mostly pumps and transfer switches.

## Quality gate that matters most (lessons from rounds 21 and 24)
Writers must not build a generator or share sentence pools. Round 24 shipped with a
real defect the coordinator had to fix by hand: repeated per-product closing
maintenance lines and repeated 4-word description openings. Run **both** Finish
duplicate checks and treat any 4-word description opening appearing more than 5 times
across the round as a failure to fix before shipping:
```bash
S=$(cat scripts/clone/work/round25.ok.txt | tr '\n' ' ')
for s in $S; do grep -oE '[A-Z][^.!?"]{40,}[.!?]' data/guides/$s.ts | sort -u; done | sort | uniq -c | awk '$1>=3' | sort -rn | head -20
for s in $S; do grep -oE 'description: "[^"]+"' data/guides/$s.ts | grep -oE '[A-Z][^.!?]{20,}[.!?]' | sed -E 's/^(([^ ]+ ){4}).*/\1/'; done | sort | uniq -c | sort -rn | head
```
Fix by rewriting the sentence in **both** `data/guides/<slug>.ts` and
`scripts/clone/work/<slug>.spec.json`, so a later rebuild does not undo it.

## Housekeeping already done (do not redo)
149 slugs from rounds 20 to 23 were stuck at status `inprogress` although those rounds
are finished; this crashed `prefilter.mjs --inprogress`. The 58 with a built guide file
were set to `done` and the other 91 to `skip`. List:
`scripts/clone/work/r20-23-cleanup-skips.txt`.

## After round 25
Round 25b: the inverters and power stations left over from the same regex, about 44
slugs (`car-power-inverters`, `rv-inverter*`, `camping-inverters`, `power-station*`,
`lifepo4-power-stations`, `power-stations-under-300/500/750`). Research files
`docs/research/power-inverters.md` and `docs/research/power-stations.md` both exist.
Then round 26 (solar) per `brief/NEXT-ROUNDS-BRIEF.md`.
`transfer-switch` (248 todo slugs) and `buyer-notes` stay deferred to last, per the brief.
