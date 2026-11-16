# Info guide program: session handoff

Updated 2026-11-16, at the end of the session that shipped rounds 1 and 2 (37 articles). Read this plus `docs/INFO-GUIDE-PLAN.md` and `docs/INFO-GUIDE-BRIEF-V2.md` before touching anything.

## 1. Where things stand

**37 info articles are live in production.** Rounds 1 and 2 are committed and pushed to `main`, and IndexNow has been pinged.

| Thing | State |
|---|---|
| Articles written | 37, all in `data/legacy/*.ts` |
| Registered in `data/legacy-registry.ts` | yes, all 37, literal imports |
| Photos in `public/images/articles/` | 72 webp files, all real Commons photos |
| Reverse links from best guides | done, 97 links across about 57 files in `data/guides/` |
| `npx tsc --noEmit` | clean |
| `npx next build` | `Compiled successfully` and `Finished TypeScript` |
| `node scripts/info/check-links.mjs <all 37>` | PASS on all 37 |
| Committed and pushed | yes, `12c6077` (round 1) and `07f921a` (round 2), pushed as `e920996` |
| IndexNow | pinged, `HTTP 200 for 42 URLs` |

### Round 1, 20 slugs (generators, power stations, inverters, RV power)

`running-watts-vs-starting-watts`, `what-size-generator-to-run-a-house`, `inverter-generator-vs-conventional-generator`, `how-to-size-a-generator-by-wattage`, `dual-fuel-generator-pros-and-cons`, `tri-fuel-and-propane-generator-explained`, `generator-carbon-monoxide-safety`, `how-to-safely-connect-a-generator-to-a-house`, `generator-thd-and-sensitive-electronics`, `how-long-will-a-generator-run-on-a-tank`, `portable-power-station-vs-generator`, `what-is-lifepo4-and-why-it-matters`, `power-station-watt-hours-explained`, `pure-sine-wave-vs-modified-sine-wave`, `how-to-size-an-inverter-for-your-loads`, `12v-vs-24v-vs-48v-systems`, `generator-break-in-and-maintenance-schedule`, `how-to-store-a-generator-off-season`, `solar-generator-vs-gas-generator`, `what-is-a-30-amp-vs-50-amp-rv-hookup`

### Round 2, 17 slugs delivered of 20 (solar, batteries, RV systems)

`monocrystalline-vs-polycrystalline-solar-panels`, `how-many-solar-panels-do-i-need`, `solar-panel-watts-vs-actual-output`, `pwm-vs-mppt-charge-controller`, `how-to-size-a-solar-charge-controller`, `series-vs-parallel-solar-wiring`, `flexible-vs-rigid-solar-panels`, `portable-and-foldable-solar-panels-explained`, `how-to-size-an-rv-solar-system`, `rv-solar-panel-mounting-and-wiring-basics`, `solar-panel-angle-and-shading-losses`, `what-is-bifacial-solar`, `agm-vs-lithium-deep-cycle-batteries`, `solar-panel-degradation-and-warranties`, `how-to-wire-a-solar-panel-to-a-battery`, `rv-water-pump-pressure-and-gpm-explained`, `rv-air-conditioner-btu-and-power-draw`

**Three round 2 topics were never delivered by the writer** and are still owed: `solar-battery-depth-of-discharge-explained`, `tankless-vs-tank-rv-water-heater`, `boondocking-power-budget-worksheet`. `agm-vs-lithium-deep-cycle-batteries` originally linked to the first of these; that link was repointed to `/what-is-lifepo4-and-why-it-matters`. **If the depth of discharge article is ever written, consider pointing that link back.**

## 2. The immediate next step

Two things are queued, in either order:

1. **The `/learn` hub page** at `app/(site)/learn/page.tsx`, listing all info articles by cluster and linked from `data/nav.ts`. Without it the 37 articles are reachable only through the sitemap and the reverse links. Every `<Link>` in it needs `prefetch={false}`. `check-links.mjs` already treats `/learn` as a valid target.
2. **Round 3**, 20 topics covering mowers, trimmers, blowers and small engines, supporting about 160 best guides. The prompt has not been written yet; model it on `handoff/chatgpt-info-round-1/PROMPT-ROUND-2.txt`.

## 3. The pipeline, in order

Everything lives in `scripts/info/`. All of it is zero AI tokens.

```bash
# 1. pick topics and resolve their best-guide hubs (must print "0 failing")
node scripts/info/topics.mjs <round>

# 2. after the writer delivers <slug>.html and an image manifest TSV
node scripts/info/fetch-images.mjs <manifest.tsv> --out public/images/articles
#    resolves Commons File pages, downloads, resizes to 1400px, writes webp,
#    prints real width/height and a ready imageCredits array

# 3. build the TypeScript module from the HTML
node scripts/info/build-article.mjs <slug>.html <manifest.tsv>
#    writes data/legacy/<slug>.ts, escapes backticks and ${,
#    fills imageCredits and relatedLinks

# 4. register: add a literal line to data/legacy-registry.ts
#    "<slug>": () => import("./legacy/<slug>"),

# 5. verify
node scripts/info/check-links.mjs <slug...>      # must print PASS

# 6. reverse links from the money pages
node scripts/info/link-back.mjs <slug>

# 7. build
npx tsc --noEmit
NODE_OPTIONS=--max-old-space-size=6144 npx next build
# grep the output for "Compiled successfully" AND "Finished TypeScript"

# 8. ship
git fetch origin && git rebase origin/main   # see the rebase note in section 5
# re-run tsc, check-links and the build AFTER rebasing, then push
node scripts/indexnow.mjs /<slug> /<slug> ...   # a leading slash means a root-level article
```

After step 3, trim each article's `imageCredits` down to the photos that article actually uses. `build-article.mjs` writes the whole manifest, which is too much. Credits are only required for CC BY and CC BY-SA. **Drop CC0 and public domain entries**, since those need no attribution and a shorter credit block reads better.

## 4. What is queued next

`docs/info-topics.tsv` holds all 100 topics. Rounds 1 and 2 are done apart from the three owed topics above.

| Round | Cluster | Topics | Best guides supported | State |
|---|---|---|---|---|
| 1 | generators, power stations, inverters, RV power | 20 | about 90 | shipped |
| 2 | solar, batteries, RV systems | 20 | about 126 | 17 shipped, 3 owed |
| 3 | mowers, trimmers, blowers, small engines | 20 | about 160 | not started, no prompt yet |
| 4 | pressure washers, snow, chainsaws, chippers, tillers | 20 | about 110 | not started |
| 5 | indoor air, kitchen, home, 3D printing, shop | 20 | about 250 | not started |

## 5. Hard-won gotchas. Do not rediscover these.

**Use `Special:FilePath` with a width parameter to download Commons photos, not the API.** This is the single biggest time saver found so far. `https://commons.wikimedia.org/wiki/Special:FilePath/<File name>?width=1400` returns a ready-sized JPEG and kept working through a rate limit window in which both `api.wikimedia.org/core/v1/commons/file/...` and direct `upload.wikimedia.org` requests returned HTTP 429 for over twenty minutes. In the round 2 session, swapping to this route turned a run that was failing every file into nine successful downloads in about a minute. Pace at 5 seconds between requests and keep a retry loop anyway, because the limiter still bites after a few dozen files. When it does, the only fix is waiting, so run downloads as a background job and do other work meanwhile.

**Searching Commons competes with downloading for the same rate limit budget.** Running searches against `commons.wikimedia.org/w/api.php` while a download job is in flight gets both of them throttled. Do all the searching first, write the full manifest, then download.

**Commons search behaves badly with long phrases.** A four or five word query such as `RV motorhome solar panel roof` returns zero results while `motorhome roof` returns useful ones. Prefer two or three word queries, and prefer browsing a category (`list=categorymembers`) over free text search when a relevant category exists.

**Some subjects barely exist on Commons.** RV rooftop air conditioners, RV water pumps and campervan solar installations returned almost nothing usable. Plan for honest substitutes drawn from the same system rather than forcing a wrong photo: a campervan galley tap for a water pump article, a campground pedestal for a shore power article, a battery pack for a runtime article.

**`curl` cannot reach the dev server.** `proxy.ts` blocks a list of scraper user agents that includes `curl/`, so every request returns 403. Pass a browser user agent:
`curl -A "Mozilla/5.0 (X11; Linux x86_64) Chrome/131.0 Safari/537.36" http://localhost:3000/<slug>`
This is not a bug and should not be changed.

**Never delete `.next/dev` while the dev server is running.** Doing so corrupts the Turbopack cache and every request afterwards returns HTTP 500 with `TurbopackInternalError: Failed to lookup task ids` and a missing `.sst` file. Restarting does not clear it. Stop the server first, then `rm -rf .next`, then start again.

**`git fetch` before pushing, and re-verify after rebasing.** In the round 2 session the remote was 21 commits ahead because another machine had pushed clone rounds 29 to 38. The rebase was clean, but `tsc`, `check-links` and the full build were all re-run on the rebased tree before pushing. Do not skip that re-run just because the rebase reported no conflicts.

**ChatGPT's recurring failures on this task**, all seen across batches 1, 2 and round 2:

- **It dropped the figures entirely in both batch 2 and round 2.** All 17 round 2 files arrived with zero `<figure>` elements, a `hero:` line naming an invented filename, and no image manifest. Expect to source every photo yourself and budget time for it. The hero alt text it writes describes an imagined ideal scene, not any real photo, so it must be rewritten too.
- It reuses one photo under many filenames and writes a different invented caption for each. In batch 1, 51 filenames pointed at 18 photos, and the captions described scenes the photos did not contain.
- It constructs `upload.wikimedia.org/wikipedia/commons/7/7d/...` URLs. That hash cannot be derived from a filename, so an invented one always 404s. Demand the Commons File page URL instead.
- It writes to the exact bottom of the word range and then reports a higher number than the file contains.
- **It links to sibling articles it did not deliver.** Round 2's AGM article linked to `/solar-battery-depth-of-discharge-explained`, one of the three topics it silently skipped. `check-links.mjs` catches this, so always run it before the build.
- Batch 1's ten articles all opened with a definition section followed by a mechanism section. It needs to be told explicitly to vary the opening.

**Photo rejections that are easy to miss.** In round 2, five of 34 downloaded candidates were rejected, and **every one of them passed all automated checks**:

- An illustration rather than a photograph. `Partial shading of a series string of 8 modules.jpg` is a rendered diagram despite a photographic filename and a normal Commons license.
- A photograph with an annotation drawn on it. `MC4-plug damage-13ASD.jpg` has a red arrow overlaid, which makes it a labelled figure, not a plain photo.
- A mislabelled file. `Eco-Camper 125W Flexible Solar Panel.jpg` shows an electronics box, not a flexible panel. **Never trust the filename, only the frame.**
- An industrial or laboratory setting where the article is about consumer gear. A building hydrophore pump is the wrong register for an RV water pump article even though it is genuinely a pump.
- Price tags legible in frame, which violates the site's no-price rule.

**Look at every photo before using it.** Download to a scratch directory, build a labelled contact sheet and read it. The round 2 session used a small sharp script that composites the pool into a grid with filename labels, which makes a batch reviewable in one glance. A plain file listing cannot catch any of the five failures above.

**`check-links.mjs` counts the `html` field, not the whole file.** It was briefly miscalibrated to count the whole TypeScript source, which failed articles that actually met the brief. The current threshold is 2,500 to 4,000 body words.

## 6. Documents in play

| File | What it is |
|---|---|
| `docs/INFO-GUIDE-PLAN.md` | Why the program exists and how the 100 topics were allocated |
| `docs/INFO-GUIDE-BRIEF-V2.md` | The execution brief, superseding v1 |
| `docs/info-topics.tsv` | All 100 topics with hub patterns, the source of truth |
| `docs/INFO-GUIDE-BRIEF.md` | v1, superseded, kept for reference only |
| `handoff/chatgpt-info-round-1/` | The writer handoff pack: prompt, brief, topics, example article |
| `handoff/chatgpt-info-round-1/PROMPT-ROUND-2.txt` | Used for round 2, the model for the round 3 prompt |
| `handoff/MachineFanatic_Round2_Completed_17_HTML/` | Round 2 source HTML, with the figures and heroes added here |
| `docs/GUIDE-SECTION-PHOTOS.md` | Separate project: real photos for the editorial sections of the best guides |
| `docs/PHOTO-SOURCING-KEYWORDS.md` | Separate project: model keyword list for owner photos |
| `docs/photo-permissions.csv` | Permission log for photos that need asking |

The last three belong to a different piece of work the owner started: sourcing real photographs for the editorial sections of the 1,237 best guides. That work needs a renderer change first, described at the end of `docs/GUIDE-SECTION-PHOTOS.md`, and has not been started.
