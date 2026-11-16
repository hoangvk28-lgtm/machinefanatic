# MachineFanatic: Info Guide Execution Brief, v2 (100 articles, 5 rounds of 20)

Supersedes `docs/INFO-GUIDE-BRIEF.md` (v1). Read `docs/INFO-GUIDE-PLAN.md` first for why the topic list changed.

You are writing informational ("info") guides for **MachineFanatic** (https://www.machinefanatic.com), an affiliate site about machines. Repo: Next.js 16 + TypeScript. Their job is to rank for question keywords the "best X" guides cannot target, and to feed that traffic into the matching best guides.

## 0. Role split

| Who | Does |
|---|---|
| Coordinator (you, Opus) | `git pull`, run `scripts/info/topics.mjs`, assign lists, then after delivery: `check-links.mjs`, `link-back.mjs`, registry, hub page, `tsc`, build, branch, commit |
| Writer agents | **Sonnet only** (CLAUDE.md rule, 2026-11-07). 1 or 2 per round, each given its whole list up front and writing it in one continuous run. Never spawn a third to "compare". |

Writers read **only**: this brief, `components/guide/LegacyArticlePage.tsx`, `data/legacy/what-does-a-lathe-do.ts`, `data/legacy/what-is-a-plunge-saw.ts`, and the round's `docs/research/info-<cluster>.md`. Not CLAUDE.md, not the runbook, not the best-guide briefs.

Every writer prompt must say: **cd to the repo root before any node script.**

## 1. Per-round workflow

**Coordinator, before any agent (zero AI tokens):**
```bash
git pull
node scripts/info/topics.mjs <round>     # must print "0 failing"
```
That prints one line per topic: `round | cluster | slug | keyword | mapped best-guide hubs`. The hubs are resolved live from `data/guides/`, so they are guaranteed to exist. Paste each writer's slice into its prompt, hubs included.

**Writer, once per round (not per article):** one research pass for the whole cluster into `docs/research/info-<cluster>.md`. Search the cluster's shared sub-topics, open the top 3 to 5 ranking pages for the biggest 4 or 5 keywords in the round, and record: headings covered, specs and numbers cited, questions answered, what they get wrong or skip. Every later article in the round reuses this file with no new searching unless its specific topic is not covered.

**Writer, per article:**
1. Pull the angles for this slug out of the cluster research. The article must cover everything useful the competitors cover **plus at least 3 angles none of them handle well.**
2. Verify every technical figure against manufacturer pages or a standards body (OSHA, ANSI, UL, NEC, NFPA, EPA, DOE, Energy Star). If sources disagree, say so or drop the figure. **Never invent** a spec, statistic, standard or test result.
3. Write `data/legacy/<slug>.ts` in one `Write` call (Section 3).
4. Pick photos (Section 4).
5. Run the self-check in Section 7 and fix by `Edit` before moving on.

**Coordinator, after delivery:**
```bash
node scripts/info/check-links.mjs <slug...>      # must print PASS for all 20
node scripts/info/link-back.mjs <slug>           # one call per slug, adds the reverse link
npx tsc --noEmit
NODE_OPTIONS=--max-old-space-size=6144 npx next build   # grep for "Compiled successfully" and "Finished TypeScript"
```
Then commit to a branch `info-round-N`. **Do not push to `main` and do not deploy.** The owner approves each round before the next starts.

## 2. Voice and editorial standard

Write as an **experienced machine specialist** (a tool-room lead, small-engine mechanic, solar installer or appliance technician) explaining things to a smart friend.

- **Mechanism first.** Explain why things work: why a compressor's CFM drops as PSI rises, why an MPPT controller harvests more than PWM in cold sun, why starting watts spike on an induction motor.
- **Decode the specs.** Separate rated from peak. Explain the test condition behind the number. Call out marketing figures plainly.
- **Ownership reality.** Maintenance, wear parts, failure modes, safety, what the machine costs in time to keep running.
- **Concrete thresholds.** "A 15 amp household circuit supplies about 1,800 watts continuous." "Below 0 degrees Fahrenheit a compressor dehumidifier is the wrong machine."
- **Confident verdicts.** Tell the reader what to do.
- **Short paragraphs**, 2 to 4 sentences. Tables wherever a comparison exists.
- **Banned words:** amazing, game-changer, must-have, top-notch, elevate, seamless, unleash, "in today's world", "look no further".

### Hard rules (any violation rejects the article)
1. **No em dash or en dash anywhere**, including inside the HTML. Use commas, colons, periods, parentheses.
2. **No prices or dollar figures.** Use "entry-level", "premium", "the cheaper option".
3. **No Amazon star ratings or review counts**, in prose or structured data.
4. **Never claim hands-on testing.** Not "we tested", "we tried", "hands-on", "in our lab", "we measured". Use "we evaluated", "we compared", "the spec sheet shows", "owner feedback reports".
5. **No copied or closely paraphrased competitor sentences.** Write everything fresh.
6. **No fabricated facts.** Unsure, leave it out.
7. **Safety content conservative and accurate.** For electrical, fuel, carbon monoxide, battery or blade safety, follow the manual and OSHA/NFPA/NEC guidance, and tell the reader to follow their own machine's manual.
8. **No template skeleton across the round.** Two articles in the same cluster must not share a sentence shape with the nouns swapped. Vary the opening framing: pain point, myth correction, question, direct comparison, failure story.

## 3. File format

`data/legacy/<slug>.ts`, matching the `LegacyArticleModule` interface in `components/guide/LegacyArticlePage.tsx`:

```ts
import type { LegacyArticleModule } from "@/components/guide/LegacyArticlePage";

const article: LegacyArticleModule = {
  slug: "<slug>",
  title: "...",
  metaTitle: "...",
  metaDescription: "...",
  kicker: "Explainer",
  heroImage: { src: "/images/articles/<file>.webp", alt: "..." },
  lastUpdated: "2026-11-__",
  readTime: "14 min",
  quickAnswer: "...",
  html: `...`,
  products: [],
  imageCredits: [],
  relatedLinks: [],
};

export default article;
```
`export default article;` only. Inside the `html` template literal, escape any backtick or `${`.

| Field | Rule |
|---|---|
| `slug` | Exactly as in `docs/info-topics.tsv`. |
| `title` | H1. Natural, includes the keyword. No year unless the topic is time-bound. |
| `metaTitle` | **48 characters or fewer** (the site appends " \| MachineFanatic"). Count it in node. |
| `metaDescription` | **120 to 160 characters.** Count it in node. One tight sentence on what the reader learns. |
| `kicker` | "Explainer", "Comparison", "How-to" or "Troubleshooting". |
| `heroImage` | Real landscape photo (Section 4). `alt` describes what is visible. |
| `quickAnswer` | 3 to 4 sentences answering the search query directly, with the key number in it. |
| `html` | Body, Section 3.1. |
| `products` | `[]` unless Section 6 applies. |
| `imageCredits` | One `{ image, author, license, source }` per CC or PD photo used. |
| `relatedLinks` | 3 to 4 `{ title, href }`. **At least 2 must be `/guide/<best-guide>` hubs from this topic's mapped list.** |

### 3.1 HTML body rules
- **2,500 to 4,000 words of body text.** Depth from mechanism, numbers, comparisons and steps, never padding.
- Sections are `<h2 id="kebab-id">`; the page builds its table of contents from them, so every H2 needs a unique id. Subsections `<h3>`.
- Allowed tags: `<p> <ul> <ol> <li> <strong> <em> <table><thead><tbody> <figure> <img> <figcaption> <a> <div class="mf-callout">`. No inline styles, no `class` on `<a>`.
- **Required:** at least one comparison or spec `<table>`; one or two `<div class="mf-callout">` tips; a safety section where relevant; `<h2 id="faq">Frequently Asked Questions</h2>` with 5 to 7 `<h3>` questions each answered in 2 to 4 sentences (**no FAQ schema**); a closing `<h2 id="bottom-line">Bottom line</h2>` with a real verdict.
- 3 to 5 `<figure>` blocks in the body.
- No external links in the body.

## 4. Images: real photos only

- Every image is a **real, authentic photograph** of the machine, part or process discussed. **Not allowed:** AI-generated images, renders, illustrations, clip art, infographics, screenshots, logos, watermarked stock.
- Source: Wikimedia Commons. Licenses CC0, public domain, CC BY, CC BY-SA only. **No NC or ND.**
- Download, convert to `.webp`, max 1400 px on the long side, quality about 80, save as `public/images/articles/<descriptive-kebab-name>.webp`. Reuse an existing file in that folder only if it genuinely fits.
```html
<figure><img src="/images/articles/<file>.webp" alt="specific description of what is visible" width="W" height="H" loading="lazy" /><figcaption>What the photo shows</figcaption></figure>
```
Use the real pixel dimensions of the webp.
- **Never put a credit, author or source in a `<figcaption>`.** Caption describes the scene only. Credit every CC or PD photo **once** in `imageCredits`.
- **Eyeball every photo before using it.** It must show the right machine type: no sawmill for a circular saw, no roof array for a portable panel. Drop anything off-topic or low quality.

## 5. Internal linking, the point of the program

Each topic row in `docs/info-topics.tsv` maps to up to 4 real best guides (`scripts/info/topics.mjs` resolves and prints them). Those are this article's **hubs**.

- **4 to 8 contextual internal links in the body**, natural descriptive anchor text, placed where they genuinely help.
- **At least 2 body links must go to the article's mapped `/guide/` hubs**, in the section where that buying decision actually comes up, not dumped in the last paragraph. `check-links.mjs` fails an article with no `/guide/` link.
- Also link: sibling info articles in the same round or an earlier round, the cluster's `/categories/<slug>` page, `/how-we-review` where methodology is relevant.
- **Never link** to a URL that will not exist by the end of the round, and never link an article to itself. Current info articles available as targets: `/what-is-a-plunge-saw`, `/what-does-a-lathe-do`, `/best-cordless-circular-saw`, `/dewalt-780-vs-festool-kapex`, `/ryobi-p516-vs-p517`.
- **The reverse link is the coordinator's job, not the writer's.** `node scripts/info/link-back.mjs <slug>` appends the article to each mapped hub's `relatedGuides` export. Run it once per slug after the files exist.
- **Registration:** one literal line per article in `data/legacy-registry.ts`:
  ```ts
  "<slug>": () => import("./legacy/<slug>"),
  ```
  Literal string path, never a template literal or variable (CLAUDE.md heap-OOM rule). Articles serve at the site root and `app/sitemap.ts` picks up `legacySlugs` automatically.
- **Hub page:** round 1 also adds `app/(site)/learn/page.tsx`, an index of all info articles grouped by cluster, linked from `mainNav` and `footerNav.company` in `data/nav.ts`. Every `<Link>` needs `prefetch={false}`. Later rounds only add rows.

## 6. Products (optional)

Info guides are educational. 0 to 4 product cards, only for a product that **already exists in the repo**: copy its `imageUrl` and `amazonUrl` verbatim from a `data/guides/*.ts` or `data/legacy/*.ts` file. The `amazonUrl` must contain `tag=machinefanatic-20`. **Never invent an ASIN, image URL or affiliate link.** Place `<!--product:ID-->` on its own line between paragraphs, `ID` matching `products[].id`. Each card's `why` is 2 sentences in reviewer voice.

## 7. Self-check, run per article before moving on

```bash
node scripts/info/check-links.mjs <slug>    # must print PASS
```
That one command covers: dead and self links, missing images, link count, at least one `/guide/` link, dashes, dollar figures, testing claims, `metaTitle` and `metaDescription` lengths, duplicate H2 ids, the FAQ and bottom-line sections, word count, and registry presence. Fix by `Edit` and re-run until it passes.

Then eyeball what a script cannot judge:
- [ ] No sentence could be pasted into a different article in this round unchanged.
- [ ] Every number in the article traces to a source you actually read.
- [ ] No credit text in any `<figcaption>`; every CC or PD photo listed in `imageCredits`.
- [ ] The two hub links sit where the buying decision comes up.
- [ ] `npm run dev`, open `http://localhost:3000/<slug>`: it renders, images load, the table of contents works.

## 8. Rounds and topics

The full list with keywords, clusters and hub patterns is `docs/info-topics.tsv` (100 rows). `node scripts/info/topics.mjs <round>` is the authoritative, slug-verified view. Allocation follows the site's actual best-guide inventory, not generic tool-blog topics:

| Round | Cluster id | Theme | Best guides supported |
|---|---|---|---|
| 1 | `power` | Generators, inverters, power stations, wattage and CO safety | ~230 |
| 2 | `solar` | Solar panels, charge controllers, batteries, RV electrical | ~126 |
| 3 | `ope-1` | Mowers, trimmers, blowers, small engines and fuel | ~160 |
| 4 | `ope-2` | Pressure washers, snow blowers, chainsaws, chippers, tillers, aerators | ~110 |
| 5 | `indoor` | Dehumidifiers, air purifiers, humidifiers, heaters, vacuums, compressors, 3D printers | ~250 |

Round order is by cluster value. Do not reorder without the owner's say.

## 9. Definition of done, per round

- [ ] 20 files in `data/legacy/`, each registered in `data/legacy-registry.ts`.
- [ ] `node scripts/info/check-links.mjs` prints PASS for all 20.
- [ ] `node scripts/info/link-back.mjs` run for all 20; the mapped best guides now link down to the explainers.
- [ ] Every new photo in `public/images/articles/`: real, on-topic, CC0/PD/CC BY/CC BY-SA, credited only in `imageCredits`.
- [ ] `npx tsc --noEmit` clean; build output contains `Compiled successfully` and `Finished TypeScript`.
- [ ] Zero dashes, prices, rating numbers, testing claims.
- [ ] `/learn` hub lists the new articles (round 1 builds it).
- [ ] Report table attached: one row per article with slug, word count, metaTitle length, metaDescription length, competitor URLs studied, the 3 unique angles added, hubs linked, anything unverifiable.
- [ ] Delivered on branch `info-round-N`. Not pushed to `main`, not deployed.
