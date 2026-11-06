# MachineFanatic restored-article brief

You are restoring old machinefanatic.com URLs that still have backlinks. The original text is lost, so you write a brand-new, authoritative long-form article on exactly the topic the URL promises. Work dir: `/home/admin1/Downloads/AGENT/projects/machinefanatic`.

## Step 1: competitor research (required, do it properly)
For your keyword, run 4 to 6 WebSearch queries (the exact keyword, plus "vs", "review", "specs", "how it works", "problems" style variants). For the top 3 to 5 ranking pages, use WebFetch (or the web-fetch tool you have) to read them. Note: headings they cover, specs they cite, questions they answer, and what they get wrong or skip. Your article must cover everything useful they cover **and** add at least 3 genuinely useful angles none of them cover well. Verify every model spec against a manufacturer page or several consistent sources. If sources disagree, say so or leave the figure out. Never fabricate specs, prices or test results. Do not copy any competitor sentence; write everything fresh.

## Step 2: write the article module
Write `data/legacy/<slug>.ts`:

```ts
import type { LegacyArticleModule } from "@/components/guide/LegacyArticlePage";
const article: LegacyArticleModule = {
  slug: "<slug>",
  title: "...",            // H1, natural, includes the keyword. (2026) only if it is a "best" roundup.
  metaTitle: "...",        // <= 48 chars, no "| MachineFanatic"
  metaDescription: "...",  // 120 to 160 chars
  kicker: "Comparison" | "Explainer" | "Buying guide",
  heroImage: { src: "/images/articles/<file>.webp", alt: "descriptive alt" },
  lastUpdated: "2026-11-06",
  readTime: "16 min",
  quickAnswer: "3 to 4 sentence direct answer to the search intent.",
  html: `...`,
  products: [ { id: "kebab-id", name: "clean model name", imageUrl, amazonUrl, label: "Best for ...", why: "2 sentences" } ],
  imageCredits: [ { image: "short description", author, license, source } ],  // one per Commons photo you used
  relatedLinks: [ { title, href } ],
};
export default article;
```
(Use `export default` AND nothing else exported.)

### html rules
- 3,000 to 4,500 words of real substance. Sections as `<h2 id="kebab-id">`, subsections `<h3>`. Use `<p>`, `<ul>`, `<ol>`, `<table>` (with `<thead>`), `<strong>`, `<div class="mf-callout">` for one or two key tips.
- Include at least one comparison/spec `<table>`.
- Include a FAQ near the end: `<h2 id="faq">Frequently Asked Questions</h2>` then `<h3>` questions with `<p>` answers (5 to 7). No FAQ schema.
- End with a clear verdict/bottom-line section.
- Product cards: place `<!--product:ID-->` on its own between paragraphs where a product is discussed. IDs must match `products[]`.
- **Images:** real photos only. Use 3 to 6 photos from your assigned list as `<figure><img src="/images/articles/<file>.webp" alt="specific descriptive alt" width="W" height="H" loading="lazy" /><figcaption>What the photo shows</figcaption></figure>`. **Never put a source/credit/author in the caption.** Credits go only in `imageCredits[]` (rendered at the end). Product photos come through product cards (Amazon), not `<img>` tags. Do not use any image not in your list.
- **Internal links:** 4 to 8 natural, contextual links in the body with descriptive anchor text, ONLY to these existing URLs:
  `/what-is-a-plunge-saw`, `/best-cordless-circular-saw`, `/dewalt-780-vs-festool-kapex`, `/ryobi-p516-vs-p517`, `/what-does-a-lathe-do`, `/guide/best-cordless-chainsaws`, `/guide/best-electric-pressure-washers`, `/guide/best-4000-watt-generators`, `/categories/power-tools`, `/categories/shop-garage`, `/categories/outdoor-power`, `/how-we-review`, `/author/james-miller`.
  Link only where it genuinely helps the reader (e.g. a plunge saw article mentioning circular saws links to `/best-cordless-circular-saw`). Never link the article to itself. `relatedLinks`: 3 to 4 of the same list.
- No outbound links in the body except none (keep it clean).

### Voice and compliance (hard rules)
- Expert machine-specialist voice: mechanism first, spec decoding, ownership reality, confident verdicts. No hype words, no filler.
- NEVER em dash (—) or en dash (–) anywhere, including inside the html. Use commas, colons, periods, parentheses.
- NEVER prices or dollar figures. NEVER Amazon star ratings or review counts.
- NEVER "we tested", "we tried", "hands-on", "in our lab", "we measured". Use "we evaluated", "we compared", "based on the spec sheet", "owner feedback".
- Discontinued models (e.g. Ryobi P516/P517): say plainly they are discontinued/older and point to the current equivalents in `products[]`.
- Escape backticks and `${` inside the template literal.

## Step 3: register and verify
1. Add to `data/legacy-registry.ts` inside the object: `"<slug>": () => import("./legacy/<slug>"),` (literal string, never a template).
2. `npx tsc --noEmit` must pass.
3. `curl -s -A 'Mozilla/5.0 Chrome/130' -o /dev/null -w '%{http_code}' localhost:3100/<slug>` must be 200 (dev server already running on 3100).
4. `grep -c '[—–]' data/legacy/<slug>.ts` = 0; no `$` followed by a digit; no "tested".
5. Word count: `sed 's/<[^>]*>//g' data/legacy/<slug>.ts | wc -w` should be 3,000+.

Report: files written, word counts, metaTitle/metaDescription lengths, competitor URLs you studied, the unique angles you added, and any spec you could not verify.
