# MachineFanatic Info Guide Brief (for the writer)

You are writing long-form informational articles for **MachineFanatic** (https://www.machinefanatic.com), an independent affiliate site about machines: generators, solar and RV power, outdoor power equipment, shop machines, kitchen and home machines.

The site already has 1,237 "Best X" product roundups. Your articles are **supporting content**: they rank for question keywords the roundups cannot target ("running watts vs starting watts"), and they push that reader into the matching roundup with a contextual link. That hand-off is the whole point, so the internal links in Section 5 are not decoration.

Deliver the 10 articles listed in `02-TOPICS.md`. One article per response is fine. Work through them in order.

---

## 1. Process per article

1. **Competitor research.** Search the primary keyword plus 3 to 5 variants ("how it works", "vs", "explained", "calculator", "mistakes", "safety"). Read the top 3 to 5 ranking pages. Note the headings they use, the specs and numbers they cite, the questions they answer, and what they get wrong or skip.
2. **Cover everything useful they cover, plus at least 3 angles none of them handle well.** List those 3 angles in your delivery report.
3. **Verify every figure** against a manufacturer page or a standards body (OSHA, NFPA, NEC, ANSI, UL, EPA, DOE, Energy Star). If sources disagree, say so in the text or drop the figure. Never invent a spec, statistic, standard or test result.
4. **Write the article** as a TypeScript file (Section 3).
5. **Pick 4 to 5 real photos** (Section 4) and fill the image manifest.
6. **Run the self-check** (Section 7) before you hand the article over.

---

## 2. Voice

Write as an **experienced machine specialist**: a small-engine mechanic, solar installer, licensed electrician or tool-room lead explaining something to a smart friend.

- **Mechanism first.** Explain *why*: why an induction motor draws a starting surge several times its running current, why a compressor dehumidifier stalls in a cold garage, why inverter output is safe for a laptop.
- **Decode the specs.** Separate rated from peak. Explain the test condition behind every number. Call out marketing figures plainly.
- **Ownership reality.** Maintenance intervals, wear parts, failure modes, safety, what the machine costs in time to keep running.
- **Concrete thresholds, not vibes.** "A 15 amp, 120 volt household circuit supplies about 1,800 watts continuous, and code practice loads it to 80 percent, so plan on roughly 1,440."
- **Confident verdicts.** Tell the reader what to do.
- **Short paragraphs**, 2 to 4 sentences. Use a table wherever a comparison exists.
- **Banned words:** amazing, game-changer, must-have, top-notch, elevate, seamless, unleash, "in today's world", "look no further", "when it comes to".

### Hard rules. Any one of these breaks the article and it comes back for a rewrite.
1. **No em dash (—) and no en dash (–) anywhere in the file**, including inside the HTML and inside metadata. Use commas, colons, periods or parentheses. This is checked by script.
2. **No prices and no dollar figures at all.** Not "$500", not "around 500 dollars". Say "entry-level", "mid tier", "premium", "the cheaper of the two".
3. **No star ratings and no review counts.** Not "4.6 stars", not "over 3,000 reviews".
4. **Never claim hands-on testing.** Banned: "we tested", "we tried", "hands-on", "in our lab", "we measured". Allowed: "we evaluated", "we compared", "the spec sheet shows", "owner feedback reports", "manufacturer data puts".
5. **No copied or closely paraphrased competitor sentences.** Write everything fresh.
6. **No fabricated facts.** If you are not sure, leave it out.
7. **Safety content must be conservative and correct.** For electrical, fuel, carbon monoxide, battery or blade safety, follow manufacturer manuals and OSHA/NFPA/NEC guidance, and tell the reader to follow their own machine's manual. Never describe a backfeed or suicide-cord style generator connection as acceptable.
8. **No shared sentence skeleton between articles.** Two articles in this batch must not open the same way or share a sentence shape with the nouns swapped. Vary the framing: pain point, myth correction, question, direct comparison, a failure that happens in the field.

---

## 3. Output format

One **HTML** file per article, named `<slug>.html`, in a single code block. No TypeScript, no JSON, no Markdown headings. The file is a meta block followed by the article body, and nothing else:

```html
<!--meta
slug: running-watts-vs-starting-watts
title: Running Watts vs Starting Watts, Explained
metaTitle: Running Watts vs Starting Watts
metaDescription: What running and starting watts actually mean, how to add up a real load list, and why a motor surge decides the generator size you need.
kicker: Explainer
readTime: 14 min
lastUpdated: 2026-11-16
hero: running-watts-starting-watts-hero.webp | Portable generator control panel showing outlets and a circuit breaker
quickAnswer: Three to four sentences that answer the search query directly, with the key number in them.
related: Best Inverter Generators | /guide/best-inverter-generators ; Best 30 Amp Generators | /guide/best-30-amp-generators ; Generator Carbon Monoxide Safety | /generator-carbon-monoxide-safety
-->
<h2 id="what-the-two-numbers-mean">What the two numbers mean</h2>
<p>...</p>
```

The meta block rules:

- One `key: value` per line. Do not reorder, rename or omit a key. Do not quote the values.
- `hero` is `filename.webp | alt text`, separated by a pipe. The alt text describes what is actually visible in the photo.
- `related` is 3 to 4 entries of `Title | /url`, separated by semicolons. **At least 2 must be `/guide/...` URLs from this topic's list in `02-TOPICS.md`.**
- No image credits in the meta block. They come from the image manifest, Section 4.

Everything after `-->` is the article body. It starts at an `<h2>` and ends with the bottom-line section. Write the HTML plainly: no escaping, no entity encoding beyond what HTML genuinely needs (`&amp;`, `&lt;`), and nothing wrapping the body.

| Key | Rule |
|---|---|
| `slug` | Exactly as given in `02-TOPICS.md`. Do not change it. |
| `title` | The H1. Natural, contains the keyword. No year. |
| `metaTitle` | **48 characters or fewer.** The site appends " \| MachineFanatic". Count the characters, do not estimate. |
| `metaDescription` | **120 to 160 characters.** Count them. One tight sentence on what the reader learns. |
| `kicker` | One of: `Explainer`, `Comparison`, `How-to`, `Troubleshooting`. |
| `readTime` | Honest, e.g. `14 min` for about 3,000 words. |
| `lastUpdated` | `2026-11-16`. |
| `hero` | A landscape photo, filename then pipe then alt text. |
| `quickAnswer` | 3 to 4 sentences answering the query head on. Plain text, no HTML. |
| `related` | 3 to 4 `Title | /url` entries, at least 2 of them `/guide/...` from this topic's list. |

### 3.1 The HTML body

- **2,500 to 4,000 words of body text.** Depth comes from mechanism, numbers, comparisons and procedure. Do not pad with restatement.
- Sections are `<h2 id="kebab-id">`. The page builds its table of contents from these, so **every H2 needs a unique id**. Subsections are `<h3>` with no id.
- Allowed tags only: `<p> <ul> <ol> <li> <strong> <em> <table> <thead> <tbody> <tr> <th> <td> <figure> <img> <figcaption> <a> <div class="mf-callout">`. No inline `style`. No `class` on `<a>`. No `<h1>`, the site renders the title. No `<html>`, `<head>` or `<body>` wrapper.
- **Required in every article:**
  - At least one comparison or spec `<table>`, two is better where the data supports it.
  - One or two `<div class="mf-callout">` blocks holding a genuine key tip, not a summary.
  - A safety section wherever the topic touches electricity, fuel, exhaust, batteries or moving blades.
  - `<h2 id="faq">Frequently Asked Questions</h2>` followed by 5 to 7 `<h3>` questions, each answered in a 2 to 4 sentence `<p>`.
  - `<h2 id="bottom-line">Bottom line</h2>` last, with a real verdict, not a recap.
  - 4 to 5 `<figure>` image blocks spread through the body, hero not counted.
- No links to anything outside machinefanatic.com in the body.
- No table of contents, no byline, no "last updated" line and no image credits inside the body. The site renders all four.

## 4. Images: 4 to 5 real photos per article

- Every image must be a **real, authentic photograph** of the actual machine, part or procedure the surrounding text discusses. A photo of a generator control panel next to a paragraph about control panels. Not a stand-in.
- **Not allowed:** AI-generated images, 3D renders, drawings, diagrams, infographics, clip art, screenshots, logos, anything with a watermark.
- **Sources:** reputable, openly licensed photo sources. Wikimedia Commons first, then Flickr Commons, Unsplash, Pexels, or a government or utility photo library (USDA, DOE, NREL, FEMA, national labs). Prefer CC0, public domain, CC BY or CC BY-SA. Credit goes at the end of the article, so the source just has to be a real, reachable page you actually looked at.
- **Do not invent an image URL, and do not construct one.** Every URL in the manifest must be a page you genuinely opened. Guessed `upload.wikimedia.org/wikipedia/commons/7/7d/...` paths are the most common failure here: that hash cannot be derived from a filename, so an invented one is always a dead link.
  - For **Wikimedia Commons**, give the **File page URL**, not the direct file URL: `https://commons.wikimedia.org/wiki/File:Portable_electrical_generator_angle.jpg`. The download step resolves it to the real file on its own.
  - For **Flickr, Unsplash or Pexels**, give the photo page URL in both the direct and source columns.
  - For a **government or lab photo library**, give the page the photo sits on.
  - A missing photo is better than a dead link. Every URL gets fetched, and a 404 sends the article back.
- **Markup in the body:**
  ```html
  <figure><img src="/images/articles/<kebab-name>.webp" alt="specific description of what is visible" width="1200" height="800" loading="lazy" /><figcaption>What the photo shows, and why it matters here.</figcaption></figure>
  ```
  Use `width="1400"` and a height matching the photo's real aspect ratio. The exact numbers are corrected on our side during the download step, so an honest ratio is enough.
- **Never put a credit, author, license or source inside a `<figcaption>`.** The caption describes the scene. All credit goes in `imageCredits`, which the site renders once as an "Image credits" block at the end of the article.
- **Image manifest.** After each article's code block, add this table so the files can be downloaded and converted:

  | filename | image or file page URL | source page URL | author | license | via |
  |---|---|---|---|---|---|
  | running-watts-starting-watts-hero.webp | https://commons.wikimedia.org/wiki/File:Portable_electrical_generator_angle.jpg | https://commons.wikimedia.org/wiki/File:Portable_electrical_generator_angle.jpg | Uploader name | CC BY-SA 3.0 | Wikimedia Commons |

  Filenames are kebab-case, descriptive, end in `.webp`, and match the `src` paths in the article exactly.

---

## 5. Internal links. This is why the article exists.

Each topic in `02-TOPICS.md` comes with a **verified list of real URLs on the site**. Those are the only `/guide/...` URLs you may use for that article. They exist; nothing else is guaranteed to.

- **4 to 8 contextual internal links in the body.** Natural descriptive anchor text, never "click here" and never a bare URL.
- **At least 2 body links must go to that topic's `/guide/...` roundups**, placed in the paragraph where that buying decision actually comes up, not dumped in the closing section. An article with no `/guide/` link fails the check.
- You may also link: the sibling info articles in this same batch of 10 (their URLs are the slug at the site root, e.g. `/generator-carbon-monoxide-safety`), the category pages, and `/how-we-review`.
- **Never link to a URL that is not in the allowed list for that topic or in the shared list at the top of `02-TOPICS.md`.** Never link an article to itself.
- Spread the links through the body. Two links in one paragraph and nothing for the next thousand words reads like an afterthought.

---

## 6. What not to include

- No product cards, no Amazon links, no ASINs.
- No FAQ schema, no JSON-LD. The site handles structured data.
- No author byline in the body. The site adds it.
- No table of contents in the body. The site builds it from the H2 ids.
- No TypeScript, no JSON, no Markdown. HTML plus the meta block, nothing else.

---

## 7. Self-check before you hand over each article

Count, do not estimate, the first two:

- [ ] `metaTitle` is 48 characters or fewer.
- [ ] `metaDescription` is between 120 and 160 characters.
- [ ] Body text is 2,500 to 4,000 words.
- [ ] Zero em dashes and zero en dashes in the whole file, meta block included. Search for both characters.
- [ ] Zero dollar signs and zero price figures.
- [ ] Zero star ratings and review counts.
- [ ] Zero "we tested", "we tried", "hands-on", "in our lab", "we measured".
- [ ] Every H2 has an id, and no id repeats.
- [ ] `<h2 id="faq">` exists with 5 to 7 questions; `<h2 id="bottom-line">` is the last section.
- [ ] 4 to 5 `<figure>` blocks in the body, plus the hero, each with a real photo in the manifest.
- [ ] No credit text inside any `<figcaption>`; every photo appears once in `imageCredits`.
- [ ] 4 to 8 internal links, at least 2 of them `/guide/...` from this topic's allowed list, none to a URL outside the allowed lists, none to itself.
- [ ] Every number in the article traces to a source you actually read.
- [ ] No sentence in this article could be pasted into another article in the batch unchanged.

## 8. Delivery report per article

After the code block and the image manifest, add four short lines:

- **Competitors studied:** the URLs you read.
- **3 unique angles added:** what you cover that they do not.
- **Could not verify:** anything you wanted to state but dropped.
- **Counts:** metaTitle chars, metaDescription chars, body word count, internal link count.
