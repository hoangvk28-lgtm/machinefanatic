# MachineFanatic best-guide brief (lean, token-saving edition)

Read ONLY this file. Do not open CLAUDE.md, the runbook, the full brief or reference guides (all rules are condensed here).

## Per-slug steps
1. Read `scripts/clone/work/<slug>.compact.json` (never the .input.json; run `node scripts/clone/compact.mjs <slug>` if missing).
2. Topic check: skip if not a powered machine (manual pump gear, drill bits, accessories) or fewer than 3 distinct on-topic machines (3 is enough: write it, user rule 2026-11-12). Size/voltage/tonnage/PSI in the slug must match. At most ONE `node scripts/clone/search.mjs <slug> "<query>"` then rerun compact. Record skips with a reason; do not run mark.mjs. Do this BEFORE any research or web search, using only the compact file.
3. Research: check `docs/research/<cluster>.md` (cluster = machine type, e.g. snow-blowers, hedge-trimmers, leaf-blowers, lawn-mowers, pressure-washers, log-splitters, wood-chippers, garden-augers, sprayers, aerators, string-trimmers, edgers). If it exists, use it and do NOT web search. If not, run 2 WebSearch queries (how to choose, rated vs peak/marketing specs, buying mistakes, ownership), then write that file: 15 to 25 terse bullet facts, no sources, no fabricated stats.
4. Lineup 5 to 7 items (3 or 4 when that is all that really exists); at least 2 (or 40%) with `src: "candidate"` when available. If 3+ distinct on-topic machines exist but candidates cannot meet that quota, write the guide anyway with what exists (never skip a viable topic over the quota). Drop duplicates of the same machine. `priceTier` is for ordering only.
5. Write `scripts/clone/work/<slug>.spec.json` in ONE Write call (shape below). For products you only need `id` (ASIN): leave amazonUrl, imageUrl, rank, price and heroImage out, the next step fills them.
6. `node scripts/clone/finish.mjs <slug>` (fills product data, then selfcheck + build + audit in one go). If it prints FIX lines, correct only those with Edit and rerun it. Done when it ends with "audit ok". Do not register, commit or push.
7. Aim for about 3,000 words; anything from 2,700 to 3,400 passes, so do not spend extra rounds trimming or padding.

## Hard rules
No em/en dashes. No prices or "$". No star ratings or review counts. Never "tested", "hands-on", "we tried", "in our lab", "we measured" (use "we evaluated", "based on the spec sheet", "owner feedback patterns"). Never paste Amazon bullet text or slogans; rewrite every fact. Only facts from the compact data plus well-established engineering knowledge; never invent numbers. No hype words (amazing, game-changer, must-have, elevate, seamless).
Voice: experienced mechanic/technician. Mechanism first, decode rated vs peak/marketing specs, year-three ownership reality, firm honest verdicts.

## Spec JSON (2,900 to 3,100 words total)
```
{ "guideSlug","categorySlug","mainKeyword" (from compact),
  "guideTitle": "Best X (2026)", "metaTitle": "<=48 chars", "metaDescription": "120-160 chars",
  "lastUpdated": "2026-11-07", "readTime": "12 min", "heroImage": "<rank 1 imageUrl>",
  "expertTake": "3 sentences: top pick, value pick, who should skip the category",
  "introParagraphs": ["50-70 words", "50-70 words"],  // category level ONLY: no brands, models or spec numbers
  "products": [{ "id": ASIN, "rank", "badge": "distinct e.g. Best Overall / Best Value / Best for X",
    "name": "Brand Model key-spec, <=70 chars, own wording", "amazonUrl", "imageUrl", "price": "",
    "specs": ["3-4 chips <=24 chars"], "specList": [{"label","value"} x5],
    "description": "3 paragraphs split by \n\n, 7-8 sentences total: P1 engineering approach; P2 tradeoffs + fit, compare a named sibling with a number; P3 ownership (upkeep, storage, parts, battery platform, fuel, noise)",
    "bestFor": "1 sentence", "pros": ["4 x 50-90 chars, one clause"], "cons": ["2-3, same length, one substantive tradeoff"] }],
  "buyingCriteria": [{"criterion":"3-6 words","explanation":"3-4 sentences: mechanism, threshold with real numbers, buyer mistake, named lineup products with numbers"} x6],
  "specDecoder": [{"spec","meaning":"2 sentences","watchFor":"1 sentence, cite lineup"} x5],
  "howWeEvaluated": [{"title","description":"3 sentences, one entry names lineup specs"} x5],
  "howToChoose": [  // 6, in order; every row/card names a lineup product
    {"subheading":"By <primary attribute>","table":{"headers":["Situation","Pick","Why"],"rows":[...]}},
    {"subheading":"By Budget","table":{...relative tiers, no $}},
    {"subheading":"<A> vs <B>","cards":[{"label","text"},{"label","text"}],"note":"who picks which"},
    {"subheading":"<category-specific axis>","table":{...}},
    {"subheading":"For <use> Specifically","cards":[{"label":"Look for","text"},{"label":"In this comparison","text"}]},
    {"subheading":"When to Spend More","cards":[{"label":"Spend more if","text"},{"label":"Save if","text"}]} ],
  "maintenance": [{"task","interval","why":"2 sentences"} x5],
  "faq": [{"q","a":"2-3 sentences"} x6],  // two-type choice, budget, durability, spec myth, safety (only if certain), category-specific
  "relatedGuides": [] }
```
Final report per slug: products kept (from candidates), words, metaTitle/metaDescription length, audit result; skipped slugs with reasons.

## Budget topics ("under-N", "budget", "cheap")
- "under-N" slugs: every product must have `underCap: true` in the compact file (live Amazon price at or below N). Never use an item with `underCap` false or "unknown".
- The cap is the keyword: `$N` may appear in guideTitle, metaTitle, metaDescription and prose (e.g. "Best Air Fryers Under $100 (2026)"). No other dollar figure anywhere, and never a product's own price; use priceTier for relative wording ("the cheapest pick here").
- Sibling caps for the same machine (under-200 / under-300 / under-500) must not be copies: favour items in the upper band of your cap (for under-500, prefer items above the next lower cap) and give each guide its own angle (what the extra budget buys: motor, capacity, build, features). Reuse no more than 2 products from a lower-cap sibling.
- Add a sentence that prices move and the cap reflects listing prices when the guide was updated.
- "budget"/"cheap" slugs: pick from the lower half of priceTier and frame value vs. compromises; no dollar figures at all.

## No padding by repetition (added 2026-11-08)
Never repeat a sentence anywhere in the same guide to reach the word count. Round 9 shipped 13 guides with one sentence pasted 5 times each; the coordinator now rejects any guide with a sentence of 30+ chars appearing 3+ times. If short, add real specifics (named model + number), not filler.
