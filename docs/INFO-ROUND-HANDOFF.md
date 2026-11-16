# Info guide program: session handoff

Written 2026-11-16, at the end of the session that produced the first 20 info articles. Read this plus `docs/INFO-GUIDE-PLAN.md` and `docs/INFO-GUIDE-BRIEF-V2.md` before touching anything.

## 1. Where things stand

**20 info articles are finished, built, registered and verified, but NOT committed.** The working tree is dirty. Nothing has been pushed and no branch has been created.

| Thing | State |
|---|---|
| Articles written | 20, all in `data/legacy/*.ts` |
| Registered in `data/legacy-registry.ts` | yes, all 20, literal imports |
| Photos in `public/images/articles/` | 30 new webp files, all real Commons photos |
| Reverse links from best guides | done, 80 links across about 40 files in `data/guides/` |
| `npx tsc --noEmit` | clean |
| `npx next build` | `Compiled successfully` and `Finished TypeScript` |
| `node scripts/info/check-links.mjs <all 20>` | PASS on all 20 |
| Committed | **no** |
| Reviewed by the owner on localhost | partially, batch 1 links were given, batch 2 links were given |

### The 20 slugs, in delivery order

Batch 1, generators: `running-watts-vs-starting-watts`, `what-size-generator-to-run-a-house`, `inverter-generator-vs-conventional-generator`, `how-to-size-a-generator-by-wattage`, `dual-fuel-generator-pros-and-cons`, `tri-fuel-and-propane-generator-explained`, `generator-carbon-monoxide-safety`, `how-to-safely-connect-a-generator-to-a-house`, `generator-thd-and-sensitive-electronics`, `how-long-will-a-generator-run-on-a-tank`

Batch 2, power stations, inverters and RV power: `portable-power-station-vs-generator`, `what-is-lifepo4-and-why-it-matters`, `power-station-watt-hours-explained`, `pure-sine-wave-vs-modified-sine-wave`, `how-to-size-an-inverter-for-your-loads`, `12v-vs-24v-vs-48v-systems`, `generator-break-in-and-maintenance-schedule`, `how-to-store-a-generator-off-season`, `solar-generator-vs-gas-generator`, `what-is-a-30-amp-vs-50-amp-rv-hookup`

These two batches together complete round 1 of `docs/info-topics.tsv`.

## 2. The immediate next step

The owner has not yet said whether to commit to a branch or straight to `main`. **Ask before committing, and never push without being told to.** When told:

```bash
git checkout -b info-round-1      # if a branch is wanted
git add data/legacy data/legacy-registry.ts data/guides public/images/articles \
        components/guide/LegacyArticlePage.tsx docs scripts/info handoff
git commit    # message below
```

Suggested message:

```
Info round 1: 20 generator and portable power explainer articles

20 long-form info articles at root level, each 2,500 to 3,300 words with
4 to 5 real Commons photographs, registered in data/legacy-registry.ts.
80 reverse links added from the matching best guides.
Adds scripts/info/ pipeline: topics, build-article, fetch-images,
check-links, link-back.
```

Remember the attribution line the session reminder specifies for commits.

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
```

After step 3, trim each article's `imageCredits` down to the photos that article actually uses. `build-article.mjs` writes the whole manifest, which is too much.

## 4. What is queued next

`docs/info-topics.tsv` holds all 100 topics. Round 1 is done. Rounds 2 to 5 remain:

| Round | Cluster | Topics | Best guides supported |
|---|---|---|---|
| 2 | solar, batteries, RV systems | 20 | about 126 |
| 3 | mowers, trimmers, blowers, small engines | 20 | about 160 |
| 4 | pressure washers, snow, chainsaws, chippers, tillers | 20 | about 110 |
| 5 | indoor air, kitchen, home, 3D printing, shop | 20 | about 250 |

**The round 2 prompt is already written**, at `handoff/chatgpt-info-round-1/PROMPT-ROUND-2.txt`. It is ready to paste into the existing ChatGPT conversation. It includes the 20 slugs with verified hub URLs, an overlap map so the 20 articles do not repeat each other, three researched content gaps for the cluster, and the Commons category trees to search.

Also still unbuilt from the plan: the `/learn` hub page at `app/(site)/learn/page.tsx`, listing all info articles by cluster and linked from `data/nav.ts`. Without it the articles are reachable only through the sitemap and the reverse links. Every `<Link>` in it needs `prefetch={false}`.

## 5. Hard-won gotchas. Do not rediscover these.

**Wikimedia rate limits aggressively, and the block is per IP and lasts a while.** A burst of image downloads gets every later request a 429, including from `commons.wikimedia.org/wiki/Special:FilePath/`. Two things help: pace at 3 seconds or more between requests, and use `https://api.wikimedia.org/core/v1/commons/file/File:<name>` to resolve the real file URL, since that host is separate from the API that gets throttled first. When blocked, the only fix is waiting. Run the downloads as a background job with a long retry loop rather than sitting in the foreground.

**`curl` cannot reach the dev server.** `proxy.ts` blocks a list of scraper user agents that includes `curl/`, so every request returns 403. Pass a browser user agent:
`curl -A "Mozilla/5.0 (X11; Linux x86_64) Chrome/131.0 Safari/537.36" http://localhost:3000/<slug>`
This is not a bug and should not be changed.

**ChatGPT's recurring failures on this task**, all seen in batch 1 or 2:

- It reuses one photo under many filenames and writes a different invented caption for each. In batch 1, 51 filenames pointed at 18 photos, and the captions described scenes the photos did not contain. Every photo must be opened and described from what is in the frame.
- It constructs `upload.wikimedia.org/wikipedia/commons/7/7d/...` URLs. That hash cannot be derived from a filename, so an invented one always 404s. Demand the Commons File page URL instead.
- It writes to the exact bottom of the word range and then reports a higher number than the file contains.
- It dropped the figures entirely in batch 2, delivering heroes in the meta block and no `<figure>` in the body, with no manifest at all.
- Batch 1's ten articles all opened with a definition section followed by a mechanism section. It needs to be told explicitly to vary the opening.

**Photo rejections that are easy to miss:** a photo of machines on a shop shelf with price tags legible in frame violates the site's no-price rule; a photo with German or English callout labels drawn on it is a diagram, not a photograph; a laboratory or industrial setting is usually wrong for a consumer article even when the hardware is technically correct. All three were caught only by looking at the images.

**Look at every photo before using it.** Download, build a contact sheet with ffmpeg, and read it. Three photos were rejected this way that passed every automated check.

**`check-links.mjs` counts the `html` field, not the whole file.** It was briefly miscalibrated to count the whole TypeScript source, which failed articles that actually met the brief. The current threshold is 2,500 to 4,000 body words.

## 6. Documents in play

| File | What it is |
|---|---|
| `docs/INFO-GUIDE-PLAN.md` | Why the program exists and how the 100 topics were allocated |
| `docs/INFO-GUIDE-BRIEF-V2.md` | The execution brief, superseding v1 |
| `docs/info-topics.tsv` | All 100 topics with hub patterns, the source of truth |
| `docs/INFO-GUIDE-BRIEF.md` | v1, superseded, kept for reference only |
| `handoff/chatgpt-info-round-1/` | The writer handoff pack: prompt, brief, topics, example article |
| `handoff/chatgpt-info-round-1/PROMPT-ROUND-2.txt` | Ready to paste for the next 20 |
| `docs/GUIDE-SECTION-PHOTOS.md` | Separate project: real photos for the editorial sections of the best guides |
| `docs/PHOTO-SOURCING-KEYWORDS.md` | Separate project: model keyword list for owner photos |
| `docs/photo-permissions.csv` | Permission log for photos that need asking |

The last three belong to a different piece of work the owner started: sourcing real photographs for the editorial sections of the 1,237 best guides. That work needs a renderer change first, described at the end of `docs/GUIDE-SECTION-PHOTOS.md`, and has not been started.
