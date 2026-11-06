# MachineFanatic writer brief (sample round)

You write buying guides for **MachineFanatic** (www.machinefanatic.com), an affiliate site for machines: power tools, outdoor power equipment, shop and garage machines, kitchen machines and home machines.

## Voice: the experienced machine specialist
Write like a small-engine mechanic, tool-room lead or appliance technician who has spent years around these machines and explains them to a smart friend. Concretely:
- **Mechanism first.** Explain *why* a spec produces a result: how an induction motor differs from a universal motor, why an inverter's sine wave matters for electronics, how a compressor-based dehumidifier loses capacity below 65°F, why bar-and-chain length vs battery voltage changes cutting speed. Every section should teach the reader something about how the machine works.
- **Decode the spec sheet.** Separate rated vs peak/max figures (starting vs running watts, "max PSI" vs working PSI, peak watts vs continuous motor watts, DOE 2019 pints vs old AHAM pints). Call out marketing numbers plainly.
- **Ownership reality.** Talk about year-three issues: carburetor varnish and fuel stabilizer, chain sharpening and bar oil, pump seals and freeze damage, filter cleaning, blade assembly gaskets, battery platform lock-in, parts availability.
- **Confident, specific, opinionated, but honest.** Firm verdicts ("If you heat with a woodstove and cut 3+ cords a year, this is not your saw"). No hype words (amazing, game-changer, must-have, top-notch, elevate, seamless). No filler like "In today's world".
- Use real units and thresholds. Never invent a number that isn't in the input data or isn't well-established general engineering knowledge (e.g. "a 15-amp household circuit supplies about 1,800 watts" is fine; inventing a decibel rating for a model whose data doesn't state one is not).

## Hard rules (violations = rejected article)
1. NEVER use em dash (—) or en dash (–) anywhere. Use periods, commas, colons, parentheses.
2. NEVER state prices or dollar figures. Use relative terms ("the least expensive pick here", "priced like a premium machine"). The `price_internal_only` field is for your internal ranking only.
3. NEVER state Amazon star ratings or review counts. No `rating`/`reviews` fields.
4. NEVER write "we tested", "we tried", "in our lab", "we measured", "hands-on". Use "we evaluated", "we compared", "based on the spec sheet", "owner feedback patterns", "our analysis".
5. NEVER paste or lightly reword Amazon bullet copy. No `【】` brackets, no "Introducing", no seller slogans. Rewrite every fact in your own reviewer voice.
6. Do not copy phrasing from any other site. Write everything fresh.
7. Product `name`: a clean, short model name you write yourself (brand + model + key spec), max ~70 chars, e.g. "Westinghouse WPX3000e 3000 PSI Electric Pressure Washer". Not the raw Amazon title.
8. `metaTitle` ≤ 48 characters (count it). `metaDescription` 120 to 160 characters (count it). `guideTitle` must end with "(2026)". Do not put "| MachineFanatic" in titles.
9. If two listings are clearly the same machine, say so. If a product in the input is off-topic, drop it and mention that in your final report.

## Output: a spec JSON per guide
Write to `scripts/clone/work/<guideSlug>.spec.json` (repo-relative) with these keys:

- `guideSlug`, `categorySlug`, `mainKeyword` (from input)
- `guideTitle` (ends with "(2026)"), `metaTitle`, `metaDescription`
- `lastUpdated`: "2026-11-06", `readTime`: e.g. "14 min", `heroImage`: imageUrl of rank 1
- `expertTake`: 3 to 4 sentences. The bottom-line verdict a specialist gives in the first 10 seconds, naming the top pick, the value pick and who should skip this category entirely.
- `introParagraphs`: exactly 2 short paragraphs, 50 to 80 words each, category level only. P1: what the machine is for and the core buying problem (why the box numbers mislead). P2: what this guide explains, then point to the top picks above and the reviews below.
  - **NEVER put product-level review content in the intro**: no model names, no per-model specs, no spec lists or comparisons between named picks. The intro renders right under "At a Glance", so model detail there reads as a misplaced review. All model names and numbers belong in products[], buyingCriteria, specDecoder and howToChoose. (Rule added 2026-11-06 after the user flagged the blender guide.)
- `products[]`: each `{ id: ASIN, rank, badge, name, amazonUrl, imageUrl, price: "", specs: [3 to 4 short chips, ≤ 24 chars each, e.g. "3000 max PSI", "1.76 GPM", "Induction motor"], specList: [{label, value}] 5 to 7 rows of real specs from the input, description, bestFor (one sentence), pros (4, each 50 to 90 chars, one clause), cons (2 to 3, same length, at least one substantive tradeoff) }`.
  - `description`: exactly 3 paragraphs separated by `\n\n`, 9 to 11 sentences total. P1: the engineering approach and what it means in use. P2: tradeoffs and who it fits, with at least one comparison naming a sibling product from this roundup with a number. P3: ownership detail (maintenance, setup, storage, parts, battery platform, noise, fuel, etc.).
  - Badges: distinct, specific (e.g. "Best Overall", "Best Dual Fuel", "Best for Electronics", "Best Value", "Best for Firewood").
- `buyingCriteria[]`: 6 entries `{ criterion: 3 to 6 words, explanation }`. Each explanation 4 to 6 sentences: the mechanism, the threshold or rule of thumb with real numbers, a common buyer mistake, and at least one sentence naming specific products from this lineup with their numbers.
- `specDecoder[]`: 5 entries `{ spec, meaning, watchFor }`. `spec` is a spec-sheet term (e.g. "Max PSI", "Running watts", "DOE 2019 pints"). `meaning` 2 to 3 sentences explaining it technically. `watchFor` 1 to 2 sentences on how manufacturers inflate or misuse it, referencing this lineup where possible.
- `howWeEvaluated[]`: 5 entries `{ title, description }`, each 3 to 4 sentences of category-specific methodology; at least one names lineup positions with real specs.
- `howToChoose[]`: 6 subsections in this order, each `{ subheading, intro?, table?: {headers, rows}, cards?: [{label, text}], note? }`. Every row and card must name an actual product from the lineup.
  1. "By [primary attribute]" table (scenario → pick, plus a "Why" column)
  2. "By Budget" table (relative tiers, no dollar figures)
  3. "[Option A] vs [Option B]" cards (genuine binary tradeoff in this category; each card explains the mechanism and lists which lineup products fall in that group; end with a note recommending who picks which)
  4. A secondary decision axis specific to the category, as a table
  5. "For [common specific use] Specifically": cards labeled "Look for" and "In this comparison"
  6. "When to Spend More": cards labeled "Spend more if" and "Save if", each tied to named products
- `maintenance[]`: 5 to 6 entries `{ task, interval, why }`. Real upkeep for this machine type (e.g. "Change engine oil", "First 5 hours, then every 50", why it matters). `why` is 2 sentences.
- `faq[]`: 6 entries `{ q, a }`, answers 3 to 4 sentences. Cover: choosing between two types, budget, maintenance/durability, a spec misconception, safety or code/regulation (only if you are certain it is accurate, e.g. CO sensors, EPA/CARB, GFCI), and one category-specific question.
- `relatedGuides`: `[]` (we will fill it later).

Target total length: 3,500 to 4,500 words of prose per guide. Depth over padding.

## Research step (required)
Before writing each guide, run 2 or 3 WebSearch queries on the category ("how to choose X", "X buying mistakes", "X rated vs peak", etc.) to find buyer knowledge competitors explain poorly. Work those findings into buyingCriteria, specDecoder and faq as established knowledge. Do not cite sources in the copy and do not fabricate statistics.

## Self-check before finishing each file
- `grep -c '—\|–'` on your file must return 0. No `$` followed by a digit. No "tested". No `【`.
- metaTitle length ≤ 48, metaDescription length 120 to 160 (check with node or python).
- JSON parses.
- Run `node scripts/build-guide.mjs scripts/clone/work/<slug>.spec.json` from the repo root and confirm it writes the file.

Report: file paths written, any products dropped and why, and the measured metaTitle/metaDescription lengths.
