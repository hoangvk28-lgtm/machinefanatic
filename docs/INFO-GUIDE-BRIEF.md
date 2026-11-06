# MachineFanatic: Info Guide Production Brief (100 articles, 5 rounds of 20)

You are writing informational ("info") guides for **MachineFanatic** (https://www.machinefanatic.com), an independent affiliate site about machines: power tools, outdoor power equipment, shop and garage machines, kitchen machines and home machines. Repo: https://github.com/hoangvk28-lgtm/machinefanatic (Next.js 16, TypeScript).

Read this whole brief before writing anything. Then read these files in the repo:
- `CLAUDE.md` (sections near the top starting "MachineFanatic rule").
- `components/guide/LegacyArticlePage.tsx`: the renderer and the `LegacyArticleModule` type your files must match.
- `data/legacy/what-does-a-lathe-do.ts` and `data/legacy/what-is-a-plunge-saw.ts`: **reference articles. Match or beat their depth, structure and tone.**
- `data/legacy-registry.ts`: where every article is registered.

---

## 1. Workflow per round

Each round = 20 articles from the topic list in Section 8. Do them in order. For **each** article:

1. **Competitor research (mandatory, no shortcuts).**
   - Search the article's keyword plus 3 to 5 variants ("how it works", "vs", "explained", "beginner", "problems", "mistakes").
   - Open and read the **top 3 to 5 ranking pages**.
   - Write down the headings they cover, the specs and numbers they cite, the questions they answer, and what they get wrong or skip.
   - Your article must cover everything useful they cover **plus at least 3 angles none of them handle well.**
2. **Verify facts.**
   - Check technical figures against manufacturer pages, standards bodies (OSHA, ANSI, UL, EPA, DOE, Energy Star) or several consistent sources.
   - If sources disagree, say so or leave the figure out.
   - **Never invent** specs, statistics, standards, test results or quotes.
3. **Write** `data/legacy/<slug>.ts` (format in Section 3).
4. **Pick photos** (rules in Section 4).
5. **Register** the slug in `data/legacy-registry.ts` (Section 5).
6. **Run the QA checklist** (Section 7). Do not move on until it passes.

At the end of each round, deliver:
- The 20 article files, the registry edit and all new images.
- A short report table with one row per article: slug, word count, metaTitle length, metaDescription length, competitor URLs studied, unique angles added, and anything you could not verify.

---

## 2. Voice and editorial standard

Write as an **experienced machine specialist** (a tool-room lead, small-engine mechanic or appliance technician) explaining things to a smart friend.

- **Mechanism first.** Explain *why* things work: how a brushless motor differs from a brushed one, why a compressor's CFM drops as PSI rises, why an inverter generator is safe for electronics.
- **Decode the specs.** Separate rated from peak figures. Explain test conditions. Call out marketing numbers plainly.
- **Ownership reality.** Cover maintenance, wear parts, failure modes, safety and what a machine costs to keep running.
- **Concrete and specific.** Use real units, thresholds and rules of thumb ("a 15 amp household circuit supplies about 1,800 watts").
- **Confident verdicts.** Tell the reader what to do.
- **No hype or filler.** Banned words: amazing, game-changer, must-have, top-notch, elevate, seamless, unleash, "in today's world", "look no further".
- **Short paragraphs.** 2 to 4 sentences each. Use tables wherever a comparison exists.

### Hard rules (any violation = article rejected)
1. **No em dash (—) or en dash (–) anywhere**, including inside HTML. Use commas, colons, periods or parentheses.
2. **No prices or dollar figures.** Use relative terms ("entry-level", "premium").
3. **No Amazon star ratings or review counts.**
4. **Never claim hands-on testing.** Do not write "we tested", "we tried", "hands-on", "in our lab" or "we measured". Use "we evaluated", "we compared", "based on the spec sheet", "owner feedback".
5. **No copied text.** Do not copy or closely paraphrase any competitor sentence. Write everything fresh.
6. **No fabricated facts.** If you are not sure, leave it out.
7. **Safety content must be accurate and conservative.** For electrical, fuel, carbon monoxide or blade safety, follow the manufacturer's manual and OSHA/NFPA guidance, and tell readers to follow their machine's manual.

---

## 3. File format

Create `data/legacy/<slug>.ts`:

```ts
import type { LegacyArticleModule } from "@/components/guide/LegacyArticlePage";

const article: LegacyArticleModule = {
  slug: "<slug>",
  title: "...",
  metaTitle: "...",
  metaDescription: "...",
  kicker: "Explainer",
  heroImage: { src: "/images/articles/<file>.webp", alt: "..." },
  lastUpdated: "YYYY-MM-DD",
  readTime: "14 min",
  quickAnswer: "...",
  html: `...`,
  products: [],
  imageCredits: [],
  relatedLinks: [],
};

export default article;
```

Export only `export default article;`. Inside the `html` template literal, escape any backtick or `${`.

### Fields
| Field | Rule |
|---|---|
| `slug` | Exactly as in Section 8. Lowercase kebab-case. |
| `title` | H1. Natural, includes the keyword. No year unless the topic is time-bound. |
| `metaTitle` | **48 characters or fewer** (the site appends " \| MachineFanatic"). Count it. |
| `metaDescription` | **120 to 160 characters.** Count it. One tight sentence on what the reader learns. |
| `kicker` | "Explainer", "Comparison", "How-to" or "Troubleshooting". |
| `heroImage` | A real photo (Section 4). `alt` describes what is visible. |
| `quickAnswer` | 3 to 4 sentences that directly answer the search query. |
| `html` | The article body (Section 3.1). |
| `products` | Optional, see Section 6. Use `[]` if none. |
| `imageCredits` | One entry per Wikimedia/CC photo used: `{ image, author, license, source }`. |
| `relatedLinks` | 3 to 4 `{ title, href }` entries pointing to existing or same-round articles. |

### 3.1 HTML body rules
- **Length: 2,500 to 4,000 words of body text.** Do not pad. Depth comes from mechanism, numbers, comparisons and practical steps.
- **Structure:**
  - Sections use `<h2 id="kebab-id">`. The page builds its table of contents from these, so every H2 needs a unique `id`.
  - Subsections use `<h3>`.
  - Allowed tags: `<p>`, `<ul>`, `<ol>`, `<li>`, `<strong>`, `<em>`, `<table><thead><tbody>`, `<figure>`, `<img>`, `<figcaption>`, `<a>`, `<div class="mf-callout">`.
  - No inline styles. No `class` attribute on `<a>` tags.
- **Required elements:**
  - At least one comparison or spec `<table>`.
  - One or two `<div class="mf-callout">` key tips.
  - A safety section where relevant.
  - `<h2 id="faq">Frequently Asked Questions</h2>`, followed by 5 to 7 questions as `<h3>`, each answered in a 2 to 4 sentence `<p>`. Do not add FAQ schema.
  - A closing `<h2 id="bottom-line">Bottom line</h2>` with a clear verdict.
- **Images in the body:** 3 to 5 `<figure>` blocks (rules in Section 4).
- **Internal links:** see Section 5.
- **External links:** none in the body.

---

## 4. Images: real photos only (strict)

- **Every image must be a real, authentic photograph** of the actual machine, part or process the text discusses.
- **Not allowed:** AI-generated images, 3D renders, illustrations, clip art, infographics, screenshots, logos or watermarked stock.
- **Source:** Wikimedia Commons (https://commons.wikimedia.org).
  - Allowed licenses: CC0, Public domain, CC BY, CC BY-SA.
  - Not allowed: NC (non-commercial) or ND (no-derivatives) licenses.
- **Processing:**
  - Download the image and convert it to `.webp`, maximum 1400 px on the long side, quality around 80.
  - Save it as `public/images/articles/<descriptive-kebab-name>.webp`.
  - Reuse an existing image in that folder only if it genuinely fits.
- **Markup:**
  ```html
  <figure><img src="/images/articles/<file>.webp" alt="specific description of what is visible" width="W" height="H" loading="lazy" /><figcaption>What the photo shows</figcaption></figure>
  ```
  Use the real pixel dimensions of the webp for `W` and `H`.
- **Credits:**
  - **Never put a credit, author or source in the caption.** The caption describes the scene only.
  - Credit every CC/PD photo **once**, in `imageCredits` (rendered at the end of the article). Use the author name, short license name and Commons file page URL.
- **Check every photo before you use it.** It must show the right machine type: no sawmill for "circular saw", no waterfall for "plunge". Drop anything off-topic or low quality.
- **Hero image:** a landscape photo (wider than tall) that clearly shows the topic.

---

## 5. Internal linking and registration

- **4 to 8 contextual internal links in the body**, using natural, descriptive anchor text (not "click here"). Link only where it genuinely helps the reader.
- **Allowed targets:**
  - Existing pages: `/what-is-a-plunge-saw`, `/best-cordless-circular-saw`, `/dewalt-780-vs-festool-kapex`, `/ryobi-p516-vs-p517`, `/what-does-a-lathe-do`, `/guide/best-cordless-chainsaws`, `/guide/best-electric-pressure-washers`, `/guide/best-4000-watt-generators`, `/guide/best-50-pint-dehumidifiers`, `/guide/best-blenders-for-crushing-ice`, `/categories/power-tools`, `/categories/outdoor-power`, `/categories/shop-garage`, `/categories/kitchen-machines`, `/categories/home-machines`, `/how-we-review`, `/author/james-miller`.
  - Articles from **earlier rounds**.
  - Articles from the **current round**, but only once that article file also exists in this delivery.
- **Never link** to a URL that will not exist at the end of the round, and never link an article to itself.
- **Topic clusters:** each round in Section 8 is grouped by theme. Cross-link siblings in the same cluster, and link back to the cluster's earlier articles.
- **Registration:** add one line per article inside the object in `data/legacy-registry.ts`:
  ```ts
  "<slug>": () => import("./legacy/<slug>"),
  ```
  It must be a literal string path, never a template literal or a variable. Articles are served at the site root (`https://www.machinefanatic.com/<slug>`) and are picked up by the sitemap automatically.

---

## 6. Products (optional)

Info guides are primarily educational. You may add 0 to 4 product cards **only if** the product already exists in the repo:
- Copy its `imageUrl` and `amazonUrl` exactly from `data/guides/*.ts` or `data/legacy/*.ts`.
- The `amazonUrl` must contain `tag=machinefanatic-20`.
- **Never invent an ASIN, image URL or affiliate link.**

Place a card with `<!--product:ID-->` on its own line between paragraphs, where `ID` matches `products[].id`. Each card's `why` field is 2 sentences in reviewer voice.

---

## 7. QA checklist (run on every file before delivering)

Run from the repo root.

```bash
npm ci   # once
npx tsc --noEmit                                       # must print nothing
grep -c '[—–]' data/legacy/<slug>.ts                    # must be 0
grep -cE '\$[0-9]' data/legacy/<slug>.ts                # must be 0
grep -ciE 'we tested|hands-on|we tried|in our lab|we measured' data/legacy/<slug>.ts   # must be 0
sed 's/<[^>]*>//g' data/legacy/<slug>.ts | wc -w        # target 2,800 to 4,600 including fields
npm run dev   # then open http://localhost:3000/<slug> and check it renders, images load, TOC works
```

Also check:
- [ ] `metaTitle.length <= 48` and `120 <= metaDescription.length <= 160` (count with node, not by eye).
- [ ] Every `/images/articles/...` path in the file exists in `public/images/articles/`.
- [ ] Every internal `href` points to an allowed target from Section 5.
- [ ] Every H2 has a unique `id`. The FAQ has 5 to 7 questions. The bottom-line section exists.
- [ ] No credit text inside any `<figcaption>`. Every CC/PD photo is listed in `imageCredits`.
- [ ] No sentence could be pasted into a different article unchanged (no generic filler).
- [ ] Before finishing the round, run `npm run build` and confirm the output contains `Compiled successfully` and `Finished TypeScript`.

---

## 8. Topic list (100 articles)

Slugs are final. Keywords are the primary search target. Each round is one theme cluster plus a few related topics.

### Round 1: Saws and cutting (20)
| # | Slug | Primary keyword |
|---|---|---|
| 1 | what-is-a-track-saw | what is a track saw |
| 2 | track-saw-vs-circular-saw | track saw vs circular saw |
| 3 | what-is-a-reciprocating-saw-used-for | what is a reciprocating saw used for |
| 4 | jigsaw-vs-reciprocating-saw | jigsaw vs reciprocating saw |
| 5 | what-is-a-miter-saw-used-for | what is a miter saw used for |
| 6 | sliding-vs-non-sliding-miter-saw | sliding vs non sliding miter saw |
| 7 | single-bevel-vs-double-bevel-miter-saw | single bevel vs double bevel miter saw |
| 8 | miter-saw-vs-table-saw | miter saw vs table saw |
| 9 | what-is-a-table-saw-riving-knife | what is a riving knife |
| 10 | how-to-prevent-table-saw-kickback | how to prevent table saw kickback |
| 11 | circular-saw-blade-teeth-explained | circular saw blade teeth explained |
| 12 | 6-1-2-vs-7-1-4-circular-saw | 6 1/2 vs 7 1/4 circular saw |
| 13 | worm-drive-vs-sidewinder-circular-saw | worm drive vs sidewinder |
| 14 | what-is-a-band-saw-used-for | what is a band saw used for |
| 15 | band-saw-vs-scroll-saw | band saw vs scroll saw |
| 16 | what-is-an-oscillating-multi-tool | what is an oscillating multi tool |
| 17 | how-to-change-a-circular-saw-blade | how to change a circular saw blade |
| 18 | what-is-a-chop-saw | what is a chop saw |
| 19 | abrasive-chop-saw-vs-cold-saw | abrasive chop saw vs cold saw |
| 20 | how-to-cut-metal-with-a-saw | how to cut metal with a saw |

### Round 2: Drills, drivers, batteries and motors (20)
| # | Slug | Primary keyword |
|---|---|---|
| 21 | impact-driver-vs-drill | impact driver vs drill |
| 22 | hammer-drill-vs-rotary-hammer | hammer drill vs rotary hammer |
| 23 | hammer-drill-vs-regular-drill | hammer drill vs regular drill |
| 24 | impact-wrench-vs-impact-driver | impact wrench vs impact driver |
| 25 | what-is-a-drill-press-used-for | what is a drill press used for |
| 26 | brushless-vs-brushed-motor | brushless vs brushed motor |
| 27 | what-does-amp-hour-mean-on-a-battery | what does amp hour mean on a battery |
| 28 | 18v-vs-20v-max-batteries | 18v vs 20v max |
| 29 | how-to-choose-a-cordless-tool-platform | how to choose a cordless tool platform |
| 30 | how-to-store-lithium-ion-tool-batteries | how to store power tool batteries |
| 31 | what-is-torque-on-a-drill | what is torque on a drill |
| 32 | drill-clutch-settings-explained | drill clutch settings explained |
| 33 | sds-plus-vs-sds-max | sds plus vs sds max |
| 34 | drill-bit-types-explained | types of drill bits |
| 35 | what-is-an-angle-grinder-used-for | what is an angle grinder used for |
| 36 | angle-grinder-disc-types | angle grinder disc types |
| 37 | random-orbital-sander-vs-palm-sander | random orbital sander vs palm sander |
| 38 | belt-sander-vs-orbital-sander | belt sander vs orbital sander |
| 39 | what-is-a-router-tool-used-for | what is a router used for woodworking |
| 40 | plunge-router-vs-fixed-base-router | plunge router vs fixed base router |

### Round 3: Shop and garage machines (20)
| # | Slug | Primary keyword |
|---|---|---|
| 41 | what-size-air-compressor-do-i-need | what size air compressor do i need |
| 42 | cfm-vs-psi-explained | cfm vs psi |
| 43 | oil-free-vs-oil-lubricated-air-compressor | oil free vs oil lubricated compressor |
| 44 | single-stage-vs-two-stage-air-compressor | single stage vs two stage compressor |
| 45 | how-to-drain-an-air-compressor-tank | how to drain air compressor tank |
| 46 | mig-vs-tig-vs-stick-welding | mig vs tig vs stick |
| 47 | welder-duty-cycle-explained | welder duty cycle explained |
| 48 | flux-core-vs-mig-welding | flux core vs mig |
| 49 | what-is-a-plasma-cutter | what is a plasma cutter |
| 50 | running-watts-vs-starting-watts | running watts vs starting watts |
| 51 | inverter-generator-vs-conventional-generator | inverter generator vs regular generator |
| 52 | what-size-generator-to-run-a-house | what size generator to run a house |
| 53 | dual-fuel-generator-pros-and-cons | dual fuel generator pros and cons |
| 54 | portable-power-station-vs-generator | portable power station vs generator |
| 55 | how-to-safely-connect-a-generator-to-a-house | how to connect generator to house safely |
| 56 | generator-carbon-monoxide-safety | generator carbon monoxide safety |
| 57 | what-is-a-bench-grinder-used-for | what is a bench grinder used for |
| 58 | metal-lathe-vs-milling-machine | lathe vs milling machine |
| 59 | what-is-a-cnc-machine | what is a cnc machine |
| 60 | wet-dry-vac-vs-shop-vac | wet dry vac vs shop vac |

### Round 4: Outdoor power equipment (20)
| # | Slug | Primary keyword |
|---|---|---|
| 61 | psi-vs-gpm-pressure-washer | psi vs gpm pressure washer |
| 62 | gas-vs-electric-pressure-washer | gas vs electric pressure washer |
| 63 | pressure-washer-nozzle-colors-explained | pressure washer nozzle colors |
| 64 | how-to-winterize-a-pressure-washer | how to winterize a pressure washer |
| 65 | chainsaw-bar-length-guide | what size chainsaw do i need |
| 66 | how-to-sharpen-a-chainsaw-chain | how to sharpen a chainsaw chain |
| 67 | chainsaw-chain-types-explained | chainsaw chain types |
| 68 | gas-vs-battery-chainsaw | gas vs battery chainsaw |
| 69 | 2-stroke-vs-4-stroke-engine | 2 stroke vs 4 stroke |
| 70 | how-to-mix-2-stroke-fuel | 2 stroke fuel mix ratio |
| 71 | why-small-engines-wont-start | small engine won't start |
| 72 | how-to-clean-a-small-engine-carburetor | how to clean a small engine carburetor |
| 73 | gas-vs-battery-lawn-mower | gas vs battery lawn mower |
| 74 | self-propelled-vs-push-mower | self propelled vs push mower |
| 75 | how-to-sharpen-a-lawn-mower-blade | how to sharpen lawn mower blade |
| 76 | string-trimmer-vs-edger | string trimmer vs edger |
| 77 | leaf-blower-cfm-vs-mph | leaf blower cfm vs mph |
| 78 | single-stage-vs-two-stage-snow-blower | single stage vs two stage snow blower |
| 79 | front-tine-vs-rear-tine-tiller | front tine vs rear tine tiller |
| 80 | how-to-store-outdoor-power-equipment-for-winter | how to store lawn equipment for winter |

### Round 5: Kitchen and home machines (20)
| # | Slug | Primary keyword |
|---|---|---|
| 81 | how-does-an-espresso-machine-work | how does an espresso machine work |
| 82 | espresso-machine-bar-pressure-explained | espresso machine bar pressure |
| 83 | single-boiler-vs-dual-boiler-espresso | single boiler vs dual boiler |
| 84 | how-to-descale-an-espresso-machine | how to descale espresso machine |
| 85 | burr-grinder-vs-blade-grinder | burr vs blade grinder |
| 86 | tilt-head-vs-bowl-lift-stand-mixer | tilt head vs bowl lift mixer |
| 87 | blender-vs-food-processor | blender vs food processor |
| 88 | blender-wattage-explained | blender wattage explained |
| 89 | centrifugal-vs-masticating-juicer | centrifugal vs masticating juicer |
| 90 | how-does-a-dehumidifier-work | how does a dehumidifier work |
| 91 | what-size-dehumidifier-do-i-need | what size dehumidifier do i need |
| 92 | compressor-vs-desiccant-dehumidifier | compressor vs desiccant dehumidifier |
| 93 | what-is-cadr-air-purifier | what is cadr |
| 94 | hepa-vs-true-hepa | hepa vs true hepa |
| 95 | robot-vacuum-suction-pa-explained | robot vacuum suction pa |
| 96 | lidar-vs-camera-robot-vacuum | lidar vs camera robot vacuum |
| 97 | how-does-a-sewing-machine-work | how does a sewing machine work |
| 98 | mechanical-vs-computerized-sewing-machine | mechanical vs computerized sewing machine |
| 99 | serger-vs-sewing-machine | serger vs sewing machine |
| 100 | front-load-vs-top-load-washer | front load vs top load washer |

---

## 9. Definition of done (per round)

- [ ] 20 files in `data/legacy/`, each registered in `data/legacy-registry.ts`.
- [ ] Every new photo is in `public/images/articles/`: real, on-topic, licensed CC0, PD, CC BY or CC BY-SA, and credited only in `imageCredits`.
- [ ] `npx tsc --noEmit` is clean, and `npm run build` shows `Compiled successfully` and `Finished TypeScript`.
- [ ] Zero dashes, prices, rating numbers or testing claims.
- [ ] The report table from Section 1 is attached.
- [ ] **Do not push to `main` and do not deploy.** Deliver the round for review (a branch named `info-round-N` or a patch). The site owner approves each round before the next one starts.
