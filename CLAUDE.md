# WorthRated — CLAUDE.md

@AGENTS.md

---

## MachineFanatic rule: best-guide length standard (changed 2026-11-06, per explicit user instruction: first 2,500 to 3,000, then raised to 3,300 to 3,800)
Best guides target **3,300 to 3,800 words**, with 5 to 6 products and 3-paragraph "About this pick" descriptions (8 to 9 sentences). This overrides the inherited WorthRated rules below that ask for 3 paragraphs, 8 to 10 sentences, 5 to 7 FAQ entries and so on. `docs/BEST-GUIDE-WRITER-BRIEF.md` holds the exact per-section counts. The user cut the length to reduce cost. Specific numbers and named comparisons are still required; cut repetition, not substance.

---

## MachineFanatic rule: article images must be real photos (added 2026-11-06, per explicit user instruction)
- Every illustration inside an article must be a **real, authentic photograph** of the actual machine, tool or process. No AI-generated images, no renders, clip art, diagrams posing as photos or stock illustrations. Use real product photos from the Amazon Creators API (served from `m.media-amazon.com`, not downloaded) or real photos from Wikimedia Commons with a reuse-compatible license (CC0, public domain, CC BY, CC BY-SA), downloaded to `public/images/articles/` as webp.
- **Do NOT put a source or credit line under each image.** Captions may describe what the photo shows, never who took it. If a license requires attribution (CC BY / CC BY-SA), credit it **once, at the end of the article** in the "Image credits" block (`imageCredits[]` in the article module).
- Eyeball every downloaded photo (contact sheet) before using it: it must show the right machine type. Drop anything off-topic (e.g. a sawmill when the topic is a handheld circular saw).

## MachineFanatic rule: writer agents run on Sonnet only (added 2026-11-07, per explicit user instruction)
- Every subagent spawned for this project (guide writers, researchers, any helper) must use `model: "sonnet"`. Never spawn an Opus agent unless the user gives a new explicit order to do so. Reason: token cost.
- This overrides the runbook's default agent choice. **Default: 1 or 2 Sonnet writer agents, each writing its whole batch in one continuous run** (user's proven method; a long run reuses its prompt cache, while every new agent pays startup again). Never suggest or spawn more agents to "test" or "compare": that only adds cost (user instruction 2026-11-07).

## MachineFanatic rule: token budget for guide writing (added 2026-11-07, per explicit user instruction)
Target 15k to 20k AI tokens per guide (round 1 cost ~36k to 39k per guide). Every writer round must use the lean workflow:
- Writers read ONLY `docs/BEST-GUIDE-BRIEF-LEAN.md` (not CLAUDE.md, the runbook, the full brief or reference guides). Keep the lean brief in sync if the full brief's rules change.
- Writers read `scripts/clone/work/<slug>.compact.json` (made by `node scripts/clone/compact.mjs <slug>` or `--all`), never the raw `.input.json`.
- Research once per machine cluster into `docs/research/<cluster>.md`; later guides in that cluster reuse it with no web search.
- Each writer agent takes its full list of prefiltered slugs (grouped by cluster so research files are reused), Sonnet only, writes each spec in one Write, then `node scripts/clone/selfcheck.mjs <slug>` and fixes by Edit before build/audit.
- Before spawning writers, the coordinator runs `node scripts/clone/prefilter.mjs --inprogress` (zero AI tokens): it skips topics whose slug size/tonnage/PSI/gallons has fewer than 4 matching machines after automatic extra searches. Only hand writers the topics it leaves. Round 2 lost roughly 40k tokens per skipped topic before this step existed.
- **"Stage A" (the user's name for it) = the zero-AI-token data step:** `git pull`, `next-batch.mjs` (Amazon data), `compact.mjs`, `prefilter.mjs`. The user often runs it in their own terminal. If `scripts/clone/work/<slug>.compact.json` files already exist for the round, do not re-run it: go straight to writers.
- Coordinator (not writers) runs registration, mark.mjs, clone-log, tsc, build, commit.

## MachineFanatic rule: "under-N" budget guides may name their cap (added 2026-11-07, per explicit user instruction)
For slugs ending in `-under-N`, the cap `$N` is the search keyword and may appear in guideTitle, metaTitle, metaDescription and prose. No other dollar figure is allowed, and never a product price. Products must be at or below the cap at their live Amazon price (`underCap: true` from `scripts/clone/compact.mjs`; `prefilter.mjs` checks it). `audit-guides.mjs` and `selfcheck.mjs` whitelist only that cap. Rules for writers are in the "Budget topics" section of `docs/BEST-GUIDE-BRIEF-LEAN.md`.

## MachineFanatic rule: clone-round lessons, coordinator checklist (added 2026-11-07, after mistakes in rounds 1 to 3)
Each item below cost the user real tokens or rework once. Follow all of them every round.
1. **`git pull` / `git fetch` before `next-batch.mjs`.** Round 1 picked topics another machine had already written (stale `source-index.json` on a local branch): 4 guides were written twice and the push was rejected.
2. **Never spawn a writer before the zero-token checks pass:** run `compact.mjs`, then `prefilter.mjs`, then **print per-slug counts from the `.compact.json` files** (items, and `underCap: true` for budget slugs) and eyeball them. A topic the writer will see with fewer than 4 usable items must be skipped by the coordinator, not discovered by an agent (that cost about 40k tokens per skipped topic in round 2).
3. **`compact.mjs` and `prefilter.mjs` must judge items identically.** Both import `scripts/clone/junk.mjs`; never give either script its own junk regex again. In round 3 prefilter counted "3D Printer Tools Kit"/enclosures/filament as printers (said 7 items) while compact dropped them (agent saw 0).
4. **Junk detection is phrase-based, never single words.** A bare `filter`/`oil`/`cover` regex silently deleted 8 to 12 real air purifiers per topic ("True HEPA Filter") and kettles/air fryers ("Oil-Free"). When adding a junk term, test it against a real machine title from that category first.
5. **Edit scripts with the Edit tool, not inline `python -c`/`node -e` strings containing backslashes.** That inserted invisible control characters (`\x08` from `\b`) into `prefilter.mjs` and broke its logic silently. After any scripted edit, run `grep -c $'\x08' <file>` (must be 0) and re-run the script.
6. **Writer prompts must say "cd to the repo root before any node script".** `search.mjs` reads `.env.local` from the current directory; one agent ran it elsewhere, got "API key length 0" and skipped viable topics.
7. **The 40% candidate quota is never a skip reason.** If 4+ distinct on-topic machines exist, the guide gets written (round 2 nearly skipped two viable guides over it).
8. **Give each writer its whole list up front** (1 or 2 agents, Sonnet only) instead of spawning many short-lived agents; do not report "tokens per guide" from the agent's raw token total as if it were cost, since that total includes cheap cached reads.
9. **Windows build:** `npm run build` fails because `NODE_OPTIONS=` is POSIX syntax. Use `NODE_OPTIONS=--max-old-space-size=6144 npx next build` from Git Bash and grep for "Compiled successfully" and "Finished TypeScript".
10. **Source guides are padded.** Old projects' guides often fill a "6 ton" or "Ariens" list with near-size or other-brand items, so "the source had 5 products" does not mean the topic is viable here. Trust prefilter and compact counts, not the source count.

## MachineFanatic: restored legacy URLs (added 2026-11-06)
Old machinefanatic.com URLs with backlinks are restored at their **original root path** (e.g. `/what-is-a-plunge-saw`), not under `/guide/`. They render through `app/(site)/[legacySlug]/page.tsx` (`dynamicParams = false`, so only registered slugs resolve) and `components/guide/LegacyArticlePage.tsx`. Each article is `data/legacy/<slug>.ts` and must be added to `data/legacy-registry.ts` with a literal `import("./legacy/<slug>")`. Next strips the old trailing slash with a permanent redirect, which keeps the backlink value. Restored articles must be long-form (3,000+ words), researched against the pages currently ranking top for the keyword, use real photos (rule above), and link internally only to pages that exist, with natural anchor text.

---

## MachineFanatic rule: intro paragraphs carry no product review content (added 2026-11-06)
`introParagraphs` render directly under the At a Glance pick list. They must be category-level framing only: 2 short paragraphs, no model names, no per-model specs, no comparisons between named picks. The user flagged the first sample batch, where the intros were spec dumps of every model, as review content in the wrong place. Model names and numbers belong in `products[]`, `buyingCriteria`, `specDecoder` and `howToChoose`. `node scripts/audit-guides.mjs` fails any guide whose intro names a product brand or contains spec numbers. Run it before every batch ships.

---

## 0. Communication Rules

- **Always address the user as "Cậu"** in every response, without exception. This is the user's signal for whether CLAUDE.md was actually read for this session — if a response doesn't say "Cậu", the user knows CLAUDE.md was missed.
- **Never use em dashes (—) or en dashes (–) anywhere on the live website** — not in hero copy, headings, body text, metadata, or JSON-LD strings. Use a period, comma, colon, or rewrite the sentence instead. This applies to all public-facing text in `app/`, `components/`, `data/`, and `lib/public-settings.ts`. (Em/en dashes are fine in code comments and this file.)
- **Every internal `<Link>` from `next/link` must include `prefetch={false}`, no exceptions.** In August 2026, Vercel ISR Read Units were running ~50x higher than actual GA pageviews because Next.js prefetches every link in viewport by default — Header, Footer, related-guides sections, and card grids across 1,000+ guide pages were each firing background prefetch requests that got billed as ISR reads despite no real pageview happening. All existing `<Link>` tags were fixed site-wide, and the template scripts that generate new guide `page.tsx` files (`scripts/generate-guide-page.mjs` and any similar generator) were updated to always emit `prefetch={false}`. When writing or generating ANY new page/component with a `<Link>`, add `prefetch={false}` by default — do not rely on remembering to add it later at scale.

---

## 0.1 Content Depth Standard (no thin content, ever)

**Passing a syntax/QA checklist is not the same as being publishable.** In August 2026, a batch of 124 guide articles was generated with a templated script (`gen.mjs`/`autoTierContent`) that passed every mechanical check (valid TS, 5+ FAQ, 2+ cons, no dashes, images returning 200) but shipped with genuinely thin editorial content: 1-2 sentence "About this pick" blurbs, one-line buying-criteria explanations, and a single generic card list for "How to Choose." The user caught this only after reviewing live rendered pages, not from any automated check. Do not repeat this.

**The canonical quality bar is the existing "Best Robot Vacuums for Pet Hair" guide.** Before writing or generating guide content, hold every section to this bar:

- **Product descriptions ("About this pick")** — minimum 2-3 full paragraphs per product, not 1-3 short sentences. Ground claims in real, specific data you actually have (named specs, price tier, comparison to sibling products in the same tier, honest "best for" framing). Do NOT invent numbers you don't have (e.g., review counts, star ratings) if the data source didn't return them — richness must come from genuine specificity about real specs and tradeoffs, never fabrication.
- **"Criteria to Look For Before Buying" entries** — each criterion needs a real paragraph (3-4+ sentences) explaining *why* it matters and what to look for, not a one-line label plus a generic "verify this on the listing" filler sentence.
- **"How We Evaluated" entries** — each needs a substantive paragraph (3-4+ sentences) describing actual methodology, not a title plus a six-word description fragment.
- **"How to Choose the Right X"** — must include multiple distinct sub-sections, not a single generic 3-card list with one note. Use this template (drop or rename sub-sections that genuinely don't fit the category, but never collapse back to one card list):
  1. **By [primary attribute]** — table: scenario → recommended pick.
  2. **By Budget** — table: price range → recommended pick.
  3. **[Option A] vs [Option B]** — a genuine binary tradeoff in this category. Each side explains the real mechanism/tradeoff AND lists which specific products in this roundup fall into that group, ending with a one-line recommendation of who should pick which side.
  4. **A secondary decision axis specific to the category** (e.g. self-empty vs manual emptying for robot vacuums, wired vs wireless backhaul for mesh Wi-Fi) — table: preference → recommended pick.
  5. **For [common specific use case] Specifically** (e.g. "For Pet Hair Specifically") — a "Look for" paragraph (what to check and why) plus an "In this comparison" paragraph naming the specific model that satisfies it and why.
  6. **When to Spend More** — two columns, "Spend more if" / "Save if", each with reasoning tied to specific named products, not generic advice.
  - **Every recommendation in every sub-section must name an actual product from the current roundup** (by model name, not just "the top pick") — a "How to Choose" section that never names a product is still thin content even if it's long.
- **FAQ answers** — full explanatory paragraphs, not one-liners.

**Before generating content at scale (any script-driven batch of guides/products), write and eyeball ONE full sample article end-to-end against this bar first** — don't run the same thin template across dozens of articles and only discover the problem after publishing. If a templated approach can't produce this depth without hand-authored per-product prose, don't template it; write it directly instead.

**Never let raw Amazon feature-bullet text reach published prose, even after "mining" it.** In September 2026, a 312-guide batch shipped with literal seller ad copy embedded in descriptions, pros/cons, and spec chips — e.g. `【Compact Size, Big Efficiency】 the upgraded 2025 Waykar dehumidifier features...` and `【smart dehumidifier using ai algorithm: your 24/7 climate sensei】abandon manual humidity tinkering forever`. Root cause: the mining script's label-stripping regex only matched ASCII `LABEL:`/`LABEL -` prefixes; it had no handling for the full-width bracket labels (`【...】`) that many Amazon sellers (especially non-US brands) use instead, so that text — including raw marketing copy following the bracket — passed straight through into "reviewer voice" prose untouched. A second bug: forcing pros/cons and spec chips to hard-truncate at a character cap produced ugly mid-sentence/mid-word fragments (`"...comfortable home by"`, `"...included 3"` — the last one because a decimal like `3.3-ft` has a `.` that a naive sentence-boundary regex misreads as an end-of-sentence period). Fixes now baked into the mining pipeline (`shortPhrase()`/`stripBracketLabels()` in the batch-pipeline scratchpad, see the Appendix runbook):
- Strip `【...】` (and `[...]`) bracket labels wherever they appear in a feature string, not just at the start — handle both the closed case and the case where Amazon's API truncates a feature bullet mid-label with no closing bracket at all (strip from the stray bracket to end of string in that case).
- Reject (don't paste) any fragment that starts with obvious ad-copy phrasing ("Tired of...", "Abandon...", "Introducing...", "Experience...", etc.) after the bracket is stripped — a label removed but ad-copy sentence remaining is still not reviewer voice.
- Sentence-boundary detection for `.`/`;`/`!` must exclude a period inside a decimal number (digit`.`digit) — don't cut `"3.3-ft"` at the `.`.
- Spec chips (short pill/badge text, not paragraph prose) must be rejected outright if they don't fit the cap naturally — never hard-truncate a chip mid-sentence, since a cut-off fragment as a UI pill reads as broken, not just thin.
- **Before shipping any batch sourced from Amazon feature data, grep the built output for `【` and `[` (as literal characters) across all generated `data/guides/*.ts` files — zero hits required.** This is now also part of the Appendix runbook's checklist.

---

## 1. Project Overview

- **Site name:** WorthRated (`SITE_NAME = "WorthRated"`)
- **Tagline:** "We rate products for easier living."
- **Live domain:** `https://www.worthrated.com` (www is canonical; non-www redirects 301)
- **Business model:** Affiliate content site — earns commissions via Amazon affiliate links
- **Amazon Associates tag:** `worthrated-20` — the ONLY tag string that should appear in any `amazon.com` link on this site (see `lib/brand.ts` → `AMAZON_ASSOCIATE_TAG`, `lib/affiliate.ts` → `AMAZON_TAG`, `lib/amazon-links.ts` → `TAG`). Never hardcode a different tag or a placeholder — always import from one of these.
- **Niche:** Everyday home products that are genuinely easy to use, for active/independent adults roughly 55-70 and the adult children researching for them. Four content pillars: Easy Kitchen, Easy Cleaning, Simple Tech, Garden & Yard.
- **Content types:**
  - Buying guides (`/guide/[slug]`) — ranked product picks with scores, FAQs, and editorial sections
  - Product reviews (`/reviews/[slug]`) — individual product pages with full scoring breakdowns
  - Category hubs (`/categories/[slug]`) — top-level category landing pages (easy-kitchen, easy-cleaning, simple-tech, garden-yard)
  - Compare pages (`/compare/[slug]`) — side-by-side category comparisons
  - Deals page (`/deals`) — curated product deals
  - Static editorial pages — `/how-we-review`, `/about-us`, `/affiliate-disclosure`, `/privacy-policy`, `/terms-of-use`, `/contact`
- **Target audience:** Active, independent adults ~55-70 and the family members buying for them — NOT a medical/assisted-living framing.
- **Worth Rating criteria (7, weighted):** Ease of Use 25%, Controls & Readability 20%, Weight & Handling 15%, Setup Difficulty 15%, Cleaning & Maintenance 10%, Reliability & Warranty 10%, Value for Money 5% (see `lib/brand.ts` → `RATING_CRITERIA`)
- **Google Analytics:** `G-J31H6NCTHP` — live
- **Twitter handle:** `@worthrated` — TODO: not a confirmed live account yet

---

## 2. Tech Stack & Architecture

### Framework & Language
- **Next.js:** `16.2.6` — this is NOT the standard Next.js 14/15 you know; read `node_modules/next/dist/docs/` before writing framework code
- **React:** `19.2.4`
- **TypeScript:** `^5` — all source files use `.ts` / `.tsx`
- **Styling:** Tailwind CSS `^4` with `@tailwindcss/postcss` — v4 has breaking changes vs v3
- **Rich text editor:** Tiptap `^3.23.6` (used in admin)

### App Router & File Structure
```
worthrated/
├── app/                        # Next.js App Router root
│   ├── layout.tsx              # Root layout — Inter font, GTM, global metadata
│   ├── globals.css
│   ├── robots.ts               # Dynamic robots.txt
│   ├── sitemap.ts              # Dynamic sitemap (Supabase + static fallback)
│   ├── guide/[slug]/page.tsx   # Buying guide pages (ISR, revalidate=86400)
│   ├── reviews/[slug]/page.tsx # Product review pages
│   ├── categories/[slug]/page.tsx
│   ├── compare/[slug]/page.tsx
│   ├── deals/page.tsx
│   ├── admin/                  # Admin panel (blocked in robots.txt)
│   └── api/                    # API routes (blocked in robots.txt)
├── components/
│   ├── layout/                 # Container, Breadcrumbs, etc.
│   ├── product/                # ProductPick, GuideRecommendationBox, GuideComparisonTable
│   ├── affiliate/              # AffiliateDisclosureBar
│   ├── sections/               # MobileStickyPicksCTA, etc.
│   └── ui/                     # Badge, RichContent, etc.
├── lib/
│   ├── seo.ts                  # buildMetadata(), SITE_URL, SITE_NAME, SITE_DESCRIPTION
│   ├── supabase/server.ts      # createAdminClient(), isSupabaseConfigured()
│   ├── public-guides.ts        # getPublicGuideBySlug(), getPublicGuideSlugs(), etc.
│   ├── public-products.ts      # getPublicProducts()
│   ├── utils.ts                # formatDate(), scoreToColor()
│   └── amazon-links.ts         # amazonSearchLinks map (slug → Amazon search URL)
├── data/
│   ├── products.ts             # Static product seed data
│   ├── guides.ts               # Static guide seed data
│   ├── categories.ts           # categories[], getCategoryBySlug()
│   └── authors.ts              # authorToSlug(), getAuthorByName()
├── scripts/
│   ├── seed-products.ts
│   ├── seed-guides.ts
│   ├── seed-deals.ts
│   └── seed-site-settings.ts
├── public/
│   ├── logo-worthrated.png / .svg / logo-worthrated-official.png
│   ├── icon.webp
│   ├── hero-banner.jpg
│   ├── og-default.png          # Default OG image (1200×630)
│   ├── llms.txt / llms-full.txt
│   └── images/icons/           # Webp icons for homepage stats
├── next.config.ts
├── CLAUDE.md                   # This file
└── AGENTS.md                   # Next.js agent rules (referenced by CLAUDE.md via @AGENTS.md)
```

### Data Sources
- **Supabase:** Primary CMS for published products, guides, and deals. Uses `@supabase/supabase-js ^2.106.1`. Client created via `createAdminClient()` in `lib/supabase/server.ts`.
- **Static data files:** `data/products.ts`, `data/guides.ts`, `data/categories.ts` — used as fallback when Supabase is not configured or returns no results.
- **Sitemap strategy:** Supabase slugs take precedence; static data fills gaps. See `app/sitemap.ts`.

### Authentication
- **Admin login:** `iron-session ^8.0.4` with `SESSION_SECRET` env var
- Admin routes live under `/admin/` — fully blocked from crawlers

### ISR (Incremental Static Regeneration)
- Guide pages: `export const revalidate = 86400` (24 hours)
- `generateStaticParams()` pre-renders all known guide and category slugs at build time

---

## 3. Canonical Domain Rules

- **Canonical domain is always:** `https://www.worthrated.com` (www, no bare `worthrated.com`)
- **Non-www redirect** is handled in `next.config.ts`:
  ```ts
  // Matches host: worthrated.com → redirects to https://www.worthrated.com/:path*
  // permanent: true → HTTP 301
  ```
- **NEXT_PUBLIC_SITE_URL** must be set to `https://www.worthrated.com` in production — `lib/seo.ts` strips trailing slashes: `process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "")`
- **Homepage canonical** should match the final live URL used by the app — do not assume `/` vs no slash without checking
- **Internal page canonicals** should avoid trailing slashes unless the app intentionally uses `trailingSlash: true` in `next.config.ts`
- **All schema, sitemap, and OG URLs** must use the `www.worthrated.com` domain
- **Legacy redirect:** `/about` → `/about-worthrated` (301, in `next.config.ts`)
- All canonical URLs are built via `buildMetadata({ path })` — never construct them manually
- The `alternates.canonical` field is always set in `buildMetadata()`

---

## 4. SEO Metadata Rules

### buildMetadata() — always use this function

Located at `lib/seo.ts`. Required fields:

```ts
buildMetadata({
  title: string,        // Do NOT append "| WorthRated" — the function does it
  description: string,  // Unique per page, 120–160 chars
  path: string,         // e.g. "/guide/best-monitor-stands"
  image?: string,       // Absolute Supabase URL or relative /path — function handles both
  noIndex?: boolean,    // true for admin/draft pages
  type?: "website" | "article",  // "article" for guides and reviews
})
```

### Title Rules
- **Never** manually append `| WorthRated` — `buildMetadata()` appends it automatically
- The root layout uses `template: "%s | WorthRated"` — `buildMetadata()` uses `{ absolute: fullTitle }` to prevent double-suffix
- Guide/review titles should be descriptive: `"Best Monitor Stands for Small Desks"` not just `"Monitor Stands"`
- **Hard character budget — check before writing, not after:** `metaTitle` (the `data/guides/<slug>.ts` export) must be **≤48 characters**, because the site auto-appends `" | WorthRated"` (12 chars) on render, and the combined title must stay **≤60 characters** total or it gets flagged/truncated in search results and SEO tooling. Count the actual string length — `"Best Ryzen Mini PCs, Honestly Reviewed (2026)"` is already 46 chars before the suffix, so anything with a longer product name or an added qualifier will blow the budget. Prefer a plain `"Best X in 2026"` or `"Best X, Reviewed (2026)"` pattern over `"Best X, Honestly Reviewed (2026)"` when the product name itself is long.
- Before finalizing any `metaTitle`, run the actual string length check (`metaTitle.length + 12 <= 60`) — do not eyeball it. This was a recurring, systemic error across a prior 87-guide batch (most titles landed in the 65–80 char range) and must not recur.
- **`guideTitle` (the on-page H1, separate export from `metaTitle`) must include `(2026)` for every guide going forward (added 2026-08-10 per explicit user instruction) — e.g. `"Best Electric Kettles (2026)"` not `"Best Electric Kettles"`.** This is a distinct requirement from the `metaTitle` character-budget rule above — `metaTitle` may drop the year first if it's over budget, but `guideTitle` keeps `(2026)` regardless since it isn't subject to the same 60-char SEO constraint. Check every new guide (single or batch) for this before generating the page — it has been missed on past batches and the user has flagged it as a recurring gap to watch for.

### Description Rules
- Must be unique per page — never reuse the site-level `SITE_DESCRIPTION`
- **Hard character budget: 120–160 characters, no exceptions.** This is not a loose preference — SEO tooling flags anything outside this range as an error. A prior 87-guide batch shipped descriptions averaging 220–260 characters (some over 300) because they packed a full "content-gap" explainer sentence into the meta description instead of writing an actual concise summary; that pattern must not recur.
- Before finalizing any `metaDescription`, run the actual string length check (`120 <= metaDescription.length <= 160`) — do not eyeball it. If the natural sentence runs long, cut it — do not rely on the reader finishing a 250-character sentence in a search snippet that truncates around 155–160 characters anyway.
- For guides: describe what the guide covers and who it helps, in one tight sentence — save the deeper "content-gap" advisory angle for the in-body `introParagraphs` and `buyingCriteria`, not the meta description.
- For products: describe the product, its niche, and key differentiator

### OG Image Rules
- Default fallback: `/og-default.png` (must be 1200×630 px)
- Product/guide hero images: pass the absolute Supabase URL directly — `buildMetadata()` detects `startsWith("http")` and uses it as-is
- Do not use relative paths for OG images on Supabase-hosted content

### noIndex Pages
- All `/admin/**` pages must pass `noIndex: true`
- Draft content (status ≠ "published") must never be indexed
- `/api/**` routes are already blocked via `robots.ts`

---

## 5. Structured Data / Schema Rules

### Allowed Schemas

**Buying Guide pages** (`/guide/[slug]`):
```json
Article, BreadcrumbList, ItemList
```
- `Article`: headline, description, datePublished, dateModified, author (Person or Organization), publisher, mainEntityOfPage, image (only if real Supabase URL)
- `BreadcrumbList`: always 3 levels — Home → Buying Guides → Guide title
- `ItemList`: lists picks by name + URL only — **no prices, no ratings**

**Product Review pages** (`/reviews/[slug]`):
- Use `Article` schema + `BreadcrumbList` by default
- Do **not** add `Product` schema unless the page has verified product data that satisfies Google Product structured data requirements
- Do **not** add `Product` schema with only `name`/`description`/`url` — this can trigger Product rich result errors without fulfilling Google's required fields
- Do **not** add `Review`, `AggregateRating`, `Rating`, `Offer`, fake prices, fake `ratingCount`, or fake `reviewCount`

### Strictly Forbidden
- **`FAQPage` schema** on commercial/affiliate pages — low to no rich-result value for affiliate sites; keep schema conservative
- **`AggregateRating`** with values not sourced from real verified reviews (our scores are editorial, not crowd-sourced)
- **`Review` schema** claiming personal hands-on testing — we do not claim hands-on testing
- **Fake `priceRange` or `price`** in any schema — prices change; only use live affiliate links
- **`Organization` sameAs** with social profiles unless those profiles are actively maintained

### Author Schema
- Determined by `getAuthorByName()` from `data/authors.ts`
- If `author.isPerson === true` → use `"@type": "Person"` with `url: ${SITE_URL}/author/${slug}`
- If not a person → use `"@type": "Organization"`
- Never invent author URLs that don't have a real page

---

## 6. Affiliate Compliance Rules

### Link Attributes
All outbound affiliate links (Amazon, etc.) **must** include:
```html
rel="noopener noreferrer sponsored"
```
For Amazon browse links specifically (see `guide/[slug]/page.tsx`):
```html
rel="noopener noreferrer sponsored"
target="_blank"
```

### Disclosure Requirements
- Every page with affiliate links must show `<AffiliateDisclosureBar>` (from `components/affiliate/AffiliateDisclosureBar.tsx`)
- Required disclosure wording (exact): _"We may earn a commission when you buy through Amazon links. This guide is based on product specs, buyer feedback, use cases, and comparison criteria — not paid placement."_
- Disclosure must appear **above the fold** on buying guide pages — it is placed after the article header, before the picks box
- The `/affiliate-disclosure` page must remain accessible and linked from the footer

### What Is Forbidden
- Do not claim any brand partnership, sponsorship, or "best" designation based on payment
- Do not write "we tested" or "we tried" — use "we evaluated", "we researched", "based on product specs and buyer feedback"
- Do not create fake discount codes or coupon claims
- Do not use Amazon images directly in `<img>` tags unless compliant with Amazon's Product Advertising API terms — use Supabase-hosted images instead

### Allowed Image Domains (next.config.ts)
```
*.supabase.co/storage/v1/object/public/**
images.unsplash.com
images.pexels.com
m.media-amazon.com   ← only for compliant Amazon PA API usage
```

---

## 7. Content & Editorial Rules

### Honesty Policy — Non-Negotiable
- **Never write "we tested", "we tried", "in our lab", "we measured"** — we do not claim hands-on testing
- **Approved language:** "we evaluated", "we researched", "based on verified buyer feedback", "based on product specs", "our analysis"
- All scores are **editorial assessments** based on structured criteria — not measurements

### No Price Display — MANDATORY, added 2026-08-18
Guide articles must **not display product prices anywhere**, structural or in prose. Reason: prices change constantly and a stale number undermines trust; the "Check price on Amazon" CTA button already covers this.
- **Structural/template:** the price badge on product cards, the "Price"/"Price Tier" column in comparison tables, and the price span next to the CTA button must not render. This applies across both guide pipelines — `scripts/generate-guide-page.mjs` (static per-slug pages) and `app/(site)/guide/[slug]/page.tsx` + `GuideComparisonTable`/`GuideRecommendationBox` (legacy DB-backed pipeline).
- **Written content:** do not write sentences that state a specific dollar figure (e.g. "At $89.99, it's positioned as...", "Prices here run from roughly $X to $Y"). Anchor pricing claims instead in relative, evergreen terms if price tier matters to the comparison — e.g. "the most affordable pick here" / "a premium price relative to the budget picks in this comparison" — without naming the number itself.
- The `price` field still exists on `GuideProduct` in `data/guides/<slug>.ts` (kept for potential internal/admin use and the CTA label default) — just don't surface it in generated JSX or reference it in the prose you write.
- `ctaLabel`/`shortCtaLabel` button text ("Check price on Amazon", "Check price") is fine to keep — it's a call to action, not a displayed number.

### New-Guide Workflow — MANDATORY, changed 2026-08-19 (do not use the old generate-guide-page.mjs step for new guides)
As the site grew past ~900 static `app/(site)/guide/<slug>/page.tsx` routes, `next build`'s TypeScript pass started reliably crashing with a JS heap OOM (see "Build Heap / OOM" note below) — adding a 901st, 902nd, etc. literal route file only makes that worse. **Every new guide from now on is served dynamically instead of getting its own route file:**

1. `node scripts/build-guide.mjs <spec.json>` → writes `data/guides/<slug>.ts` exactly as before (same rich content shape: `products[]`, `buyingCriteria[]`, `howWeEvaluated[]`, `howToChoose[]`, etc. — nothing about the spec JSON or content-depth bar changes).
2. `node scripts/register-dynamic-guide.mjs <slug>` → adds an explicit entry to `data/dynamic-guides-registry.ts`'s `dynamicGuideLoaders` map. **Do NOT run `scripts/generate-guide-page.mjs` for a new guide** — that creates the literal route dir this workflow exists to avoid.
3. `node scripts/register-new-guides.mjs <slug>` → adds the slug to `data/guides.ts` as before (still required — this is what the sitemap, category pages, and `/guide` index read from).

`app/(site)/guide/[slug]/page.tsx` checks `dynamicGuideSlugs` first; if the requested slug is registered there, it dynamically imports the matching `data/guides/<slug>.ts` via `dynamicGuideLoaders[slug]()` and renders it through `components/guide/RichGuidePage.tsx` — a shared component that reproduces the exact same JSX `scripts/generate-guide-page.mjs` bakes per-file (AtAGlance, buying criteria, how-we-evaluated, how-to-choose, FAQ, related guides, schema.org scripts), just as one reusable component instead of ~900 duplicated ones. Content depth requirements, the no-price-display rule, and every other guide-content rule in this file apply identically regardless of which pipeline serves the page.

**Critical constraint on `dynamicGuideLoaders` entries:** each one must be a literal, statically-analyzable call — `"slug": () => import("./guides/exact-slug")` — never a template-literal expression built from a variable (`import(\`./guides/${slug}\`)`). An expression-based dynamic import forces the bundler to treat the *entire* `data/guides/` directory (900+ files) as a glob of candidates, which reproducibly re-triggers the exact heap-OOM crash this workflow exists to avoid, even with an otherwise-empty registry. `scripts/register-dynamic-guide.mjs` already writes entries in the correct literal form — don't hand-edit the array into an expression form.

**The existing ~900 guides published before 2026-08-19 are untouched** — they keep their literal `app/(site)/guide/<slug>/page.tsx` routes and are not being migrated retroactively. Only guides created from now on use the dynamic pipeline. If you're editing an *existing* guide, check whether it has a literal route dir before assuming which pipeline applies.

### Build Heap / OOM (added 2026-08-19)
`next build`'s TypeScript pass needs more heap than Node's ~2GB default purely from the ~900 existing static routes, independent of any single change. `package.json`'s `build` script sets `NODE_OPTIONS=--max-old-space-size=6144` to give headroom on Vercel's 8GB build machines — do not remove this. If OOM resurfaces despite this (e.g. after many more guides accumulate), raise the ceiling further before assuming the cause is something else, and re-verify with the exact failure signature: `next build` can crash with `FATAL ERROR: ... JavaScript heap out of memory` and `Next.js build worker exited with code: null and signal: SIGABRT` while a wrapping shell pipeline (e.g. `| tail -80`) still reports **exit code 0** — the pipe's exit code reflects `tail`, not the crashed `next build` process. Always grep the actual build output for `Compiled successfully` **and** `Finished TypeScript` (or an explicit error) before treating a build as genuinely green; do not trust a background task notification's reported exit code alone.

### Required Sections for Buying Guides
Every `/guide/[slug]` page must include (in order). As of the 2026-07-18 template revision (see "Guide Page Template — Page Order & Mandatory Sections" below), the `data/guides/<slug>.ts` + `scripts/generate-guide-page.mjs` pipeline produces:
1. Breadcrumbs
2. Affiliate disclosure bar
3. Article header (title, description, meta row)
4. Hero image
5. **"At a Glance"** — collapsible pick list from `products[]`, rendered via `<AtAGlance>` (see "At a Glance Component" below). **Do not reintroduce a plain HTML comparison table** — this replaced it site-wide 2026-08-18.
6. Intro section
7. **"N Criteria to Look For Before Buying a [Product]"** — card grid, from `buyingCriteria[]`, heading dynamically includes the count and singular product noun, positioned before the reviews
8. Jump nav
9. Detailed product reviews (one section per product)
10. **"How We Evaluated These [Products]"** — methodology card grid, from `howWeEvaluated[]` (mandatory for guides created from 2026-07-18 onward), positioned after the reviews
11. **"How to Choose the Right [Products]"** — deep scenario-based advisory section, from `howToChoose[]` (mandatory for guides created from 2026-07-18 onward), positioned right after "How We Evaluated" and before the FAQ — this is the guide's primary content-gap section
12. FAQ section (if `faq.length > 0`)
13. "Bottom Line" section
14. Amazon browse CTA
15. Related guides

Legacy guides (predating 2026-07-18) built via the Supabase-backed `<GuideRecommendationBox>`/`<GuideComparisonTable>`/`<ProductPick>` component pipeline follow a similar but not identical structure — do not assume the two pipelines are interchangeable; check which pipeline a given guide actually uses (`app/guide/[slug]/page.tsx` dynamic route vs. a static `app/(site)/guide/<slug>/page.tsx` route) before editing.

### Scoring Criteria (Fixed — do not change weights)
| Criterion | Weight |
|---|---|
| Small-Space Fit | 25% |
| Build Quality | 20% |
| Ease of Use | 20% |
| Value for Money | 20% |
| Buyer Feedback | 15% |

### Advisory / Buying Criteria Section — MANDATORY in Every Guide

**This is the primary content-gap differentiator vs competitors. Do not skip it.**

Every buying guide (`/guide/[slug]`) must include a substantive "How to Choose" or "What to Look For" section containing **5 or more advisory headings**. This section must:

- Appear **before or immediately after the product list** — not buried at the bottom
- Contain **specific, actionable criteria** a buyer needs to evaluate — not generic filler
- Cover **tradeoffs competitors never explain** (e.g., "Why a 40dB motor matters for video calls", "Why weight capacity matters even if you're under 200 lbs", "The hidden cost of a narrow belt at 2 mph")
- Each criterion must have a **clear recommendation or rule of thumb** — not just a definition
- Be written from the angle of **"what would trip a first-time buyer"** — surface non-obvious gotchas

**In `data/guides/[slug].ts`:** Populate `buyingCriteria[]` with 5+ entries. Each entry:
```ts
{ criterion: "Short label (3-6 words)", explanation: "2-3 sentence advisory with specific numbers or thresholds." }
```

**In `page.tsx`:** The `buyingCriteria` section renders as a card with heading "How to Choose the Right One" above the product list. Do NOT omit this section if `buyingCriteria.length > 0`.

**Quality bar:** If a competitor article for the same keyword has a buying criteria section, ours must cover at least 2 points theirs does not. If competitors have none, ours becomes the strongest signal for topical authority.

---

### Content-Gap Research Step — MANDATORY, Never Skip (added 2026-07-18)

**Every new guide must include a competitor content-gap research pass before the copy is written.** Skipping this step is the single most common quality failure in this project's guide pipeline — do not skip it to save time or tokens, even under token/time pressure.

**What this means in practice, before drafting `buyingCriteria`, `faq`, or `howWeEvaluated`:**
1. Run a `WebSearch` (or a small batch of searches covering a niche's shared sub-topics, not one search per guide if guides share a parent category — e.g. all "bookshelf" guides can share one research pass) for the guide's `mainKeyword` plus terms like "buying guide", "how to choose", "vs", or a safety/regulatory angle relevant to the product category.
2. Identify genuinely useful buyer knowledge that is either (a) missing from typical top-ranking pages, or (b) present but vague/wrong on competitor pages — measurement pitfalls, material/spec trade-offs, safety standards and their actual scope (do not assume a cited standard/certification applies to this exact product category — verify), common buyer mistakes, or trade-offs competitors gloss over.
3. Write 2-4 new `buyingCriteria` entries and 1-2 new `faq` entries per guide that encode this research as specific, actionable advice with real numbers/thresholds — not generic restatements of the product specs already in the pick descriptions.
4. Cite findings naturally in the copy (state as established buying knowledge, the way the rest of the site's content already reads) — do not write "according to a study" or otherwise expose the research process in the visible copy.
5. Never fabricate a statistic, standard, or regulation. If a claim can't be backed by what the search actually returned, leave it out.

**Efficient execution for multi-guide batches:** research once per shared topic cluster (e.g. 4-6 targeted searches covering the whole niche), then apply the findings selectively per guide — each guide only gets the subset of findings actually relevant to its specific angle. Do not force irrelevant findings into a guide just to check a box.

**This applies going forward to every new guide from 2026-07-18 onward** — both single guides and batch launches. It does not require retrofitting already-published guides unless the user explicitly asks for a retrofit pass.

---

### Guide Page Template — Page Order & Mandatory Sections (added 2026-07-18, corrected 2026-07-18)

As of `scripts/generate-guide-page.mjs`, every generated guide page follows this section order top to bottom — and `components/guide/RichGuidePage.tsx` (the dynamic-pipeline renderer, see "New-Guide Workflow" above) reproduces the same order. **Never hand-write a guide's rendering JSX.** For a genuinely new guide, use the dynamic pipeline (`register-dynamic-guide.mjs`, not `generate-guide-page.mjs`); only run the generator when working on the pre-2026-08-19 static pipeline's existing guides.

**Hero image block (updated 2026-08-04):** the hero is responsive, not one fixed image at all breakpoints.
- **Mobile (below `md`):** a single `heroImg` (from `data/guides/<slug>.ts` → `heroImage`), capped at a fixed height (`h-56 sm:h-64`) with `object-contain` so it never stretches tall regardless of the source photo's aspect ratio.
- **Desktop (`md` and up):** a horizontal row showing every pick's own `imageUrl` from `products[]`, one evenly-spaced column per product (`gridTemplateColumns: repeat(products.length, minmax(0,1fr))`), each in its own fixed-height white card (`h-56`) with `object-contain` so photos of different aspect ratios and backgrounds stay visually even instead of looking mismatched.
- This fills the wide desktop hero area with the actual products being compared instead of one small centered image surrounded by wasted whitespace, while keeping mobile simple since a multi-column row would be cramped on a narrow screen.
- This is defined once in the generator template (`scripts/generate-guide-page.mjs`) and applies automatically to every guide generated from it — do not hand-roll a different hero layout per guide.

```
Breadcrumbs → header → affiliate note → hero image
→ At a Glance (products[], via <AtAGlance>)
→ intro paragraphs
→ "N Criteria to Look For Before Buying a [Product]"  (buyingCriteria[], card grid)
→ jump nav
→ individual product review sections
→ "How We Evaluated These [Products]"  (howWeEvaluated[], methodology card grid)
→ "How to Choose the Right [Products]"  (howToChoose[], deep scenario tables)  ← this is the content-gap section
→ FAQ
→ Bottom Line
→ Amazon browse CTA
→ Related guides
```

**Do not merge "How We Evaluated" and "How to Choose" into one section — they are two separate sections, both positioned after the product reviews, in that order, both before the FAQ.** An earlier revision of this rule mistakenly collapsed them into one; both must render independently.

### At a Glance Component — replaces the old Comparison Table (added 2026-08-18)
`components/product/AtAGlance.tsx` (a pre-existing component inherited from the DeskFinds template fork, unused until 2026-08-18) renders the pick list right after the hero image. It's a collapsible row per product: thumbnail + badge + name + a "Check price" CTA button, with a "Show Pros & Cons" toggle that expands a two-column pros/cons list. No price number is ever displayed (consistent with "No Price Display" above) — the button says "Check price" but shows no figure.

- **`scripts/generate-guide-page.mjs`** wires it for the static per-slug pipeline: `<AtAGlance items={products.map(...)} />`, mapping each `GuideProduct` to `{ rank, badge, name, imageUrl, affiliateUrl: amazonUrl, pros: pros.map(text => ({text})), cons: cons.map(text => ({text, severity: "minor"})), anchorId: product.id }`. `anchorId` must match the `id` on that product's `<ProductSection>` below so "See why we picked it" scrolls correctly.
- **`app/(site)/guide/[slug]/page.tsx`** (legacy DB-backed pipeline) wires it the same way from `GuideProductPick[]`, with `anchorId: \`inline-pick-${pick.id}\`` matching `InlinePickCard`'s section id.
- Every `cons` entry defaults `severity: "minor"` (yellow) — there's no current data source for `"major"` (red); leave as `"minor"` unless a future guide's `data/guides/<slug>.ts` schema adds real severity data.
- Do not hand-roll a plain `<table>` pick list again for any new guide — always use `<AtAGlance>`.

Three exports are involved, and they serve **different purposes at different depths** — do not merge them or treat them as interchangeable:

1. **`buyingCriteria[]`** (existing, unchanged shape) → renders as **"N Criteria to Look For Before Buying a [Product]"**, a 2-column card grid, positioned **before** the product reviews. This is the quick, top-level orientation a buyer needs before reading pick-by-pick detail — short criterion + explanation pairs.
   ```ts
   { criterion: "Short label (3-6 words)", explanation: "2-3 sentence advisory with specific numbers or thresholds." }
   ```

2. **`howWeEvaluated[]`** (required as of 2026-07-18) → renders as **"How We Evaluated These [Products]"**, a 2-column card grid, positioned **right after** the product reviews (before "How to Choose"). 4-5 entries describing the guide-specific scoring methodology — category-specific angles (e.g. Stability, Adjustability, Build quality, Device compatibility, Value for price for a tablet-stand guide), not the generic site-wide "WorthRated Fit Score" weights from the Scoring Criteria table above reused verbatim.
   ```ts
   { title: "Stability", description: "Tested with a standard iPad Pro 11\" and a heavy 13\" Android tablet. Scored on tipping resistance under tapping and drawing load." }
   ```

3. **`howToChoose[]`** (required as of 2026-07-18) → renders as **"How to Choose the Right [Products]"**, positioned **after "How We Evaluated"** and **before** the FAQ. This is the deep, scenario-based advisory section — the guide's primary content-gap / E-E-A-T asset — and should look like a mini reference tool a reader would bookmark, not a restatement of the buying criteria above it.A good template is a "How to Choose" section broken into scenario-based subsections — by use case, by budget threshold, a comparison table, a "when to spend more" table, a warranty quick-reference table. Each entry is one subsection:
   ```ts
   export interface HowToChooseSection {
     subheading: string;              // e.g. "By Sitting Duration", "Chair Height vs Your Height"
     intro?: string;                  // optional 1-2 sentence framing before the table/cards
     table?: { headers: string[]; rows: string[][] };  // scenario -> named pick mapping
     cards?: { label: string; text: string }[];         // alternative to a table for 2-4 item breakdowns
     note?: string;                   // optional closing callout (a practical tip, a caveat)
   }
   export const howToChoose: HowToChooseSection[] = [ /* 4-6 subsections */ ];
   ```
   **The defining trait of a good `howToChoose` table:** every row maps a concrete buyer situation (a measurement, a use case, a budget threshold, a room type) directly to a **named pick from this guide's `products[]`** — not a generic tip. If a row doesn't end in "→ therefore buy [specific product name]" or an equally concrete recommendation, it's not deep enough yet. This is where the mandatory content-gap research (see above) actually gets applied — the research findings should surface as these scenario rows, not as generic prose.

**When editing an EXISTING guide's `buyingCriteria`/`faq` only** (a content-gap retrofit pass on an already-published guide), you do not need to add `howToChoose` or regenerate the page unless the user explicitly asks for a full template upgrade on that guide. But any **newly created** guide from 2026-07-18 onward must include a real `howToChoose[]` (not an empty array) and go through the generator.

---

### Content Depth Bar — MANDATORY, added 2026-08-10 (do not regress)

**Reference standard:** `data/guides/best-shark-robot-vacuums.ts` (hand-written) and the 35-guide microwave batch (`data/guides/best-*-microwaves.ts` etc., built 2026-08-10) are the quality floor for every guide going forward. The user flagged an earlier microwave draft as "thin content, no value" (sơ sài, ko cung cấp giá trị) before this bar was enforced — that failure mode must not recur.

**The core rule: every section must reference real, named products and real numbers pulled from actual data (rating, reviews, wattage/capacity/whatever spec applies to the category) — never generic, product-agnostic advice.** Example of the standard: "the eufy C28 at 15,000Pa" (Shark guide) / "the Panasonic NN-SN76LS ... rated at 1250W while the COMFEE' Countertop Microwave Oven is rated at 700W" (microwave guide). A sentence that could be copy-pasted into any other guide in the same category without changing a word is not deep enough — rewrite it so it only makes sense for this specific lineup. **Price is excluded from this real-data requirement — see "No Price Display" below.**

**Applies to every section, not just `buyingCriteria`:**
- **`introParagraphs`**: name the actual spread across the lineup (spec range) with real product names attached, not just "we compared N models."
- **`buyingCriteria`** — this is the section most likely to go thin. Every one of the 5+ entries must include a real-data-grounded sentence (a fact_pool style approach: wattage/capacity/rating/review-count facts each naming the specific products involved), not just a generic explanation of the criterion. A criterion with only a generic 2-3 sentence definition and no named-product comparison fails this bar.
- **`howWeEvaluated`**: category-specific methodology entries, plus at least one entry that names actual rating/spec positioning across the real lineup (e.g. highest-rated vs. most basic pick by name).
- **`howToChoose`**: every table row must map a concrete buyer situation to a **named pick** from `products[]` — add spec-comparison tables (e.g. "Wattage by Model", "By Budget") whenever the underlying data varies enough to support one, not just the minimum scenario tables.
- **Individual product `description`/`pros`/`cons`**: pull real extracted specs (via title-parsing regex or Creators API `itemInfo`/`offersV2` fields — see `/tmp/microwave/build_guides.py` pattern) and write at least one comparative sentence per product naming a sibling product by name and number (e.g. "at 1250W it heats faster than every other pick here, including the X at 700W"). Do not rely solely on Amazon's own listed features paraphrased.

**`pros`/`cons` bullets specifically must stay short — this is the opposite failure mode from thin `buyingCriteria` (added 2026-08-10):** `description` paragraphs ("About this pick") can and should be multi-sentence prose, but `pros`/`cons` array entries are bullet-list fragments, not paragraphs. Reference standard: the Shark robot vacuum guide's pros read like "Structured row-by-row navigation instead of random bounce patterns" or "AI home mapping supports room-specific cleaning" — one short clause, ~60-90 characters, no repeated product-name label prefix (do not paste a raw Amazon bullet like "User-Friendly Design: The sloped roof design of the PE cover helps prevent rain and snow accumulation, creating more space. Four zippered doors provide..." straight into a pros entry). When deriving pros/cons from Amazon feature bullets programmatically, strip any "Label: " or "Title Case Label - " prefix, take only the first clause/sentence, and hard-cap at roughly 85 characters cut on a word boundary (see `short_phrase()` in `/tmp/gardenbed/build_guides.py` for the reference implementation). Comparative sibling-naming facts belong in the `description` paragraph via `compare_bits`-style sentences, not stuffed into a pros/cons bullet with a full "versus the X at Y" clause.

**Before shipping any new guide or batch, self-check:** pick 3 random sentences from `buyingCriteria` and `howToChoose` — if none of them contain a real product name + a real number, the content is too thin and must be revised before publishing. This check is not optional token-saving; thin content was the exact defect the user called out. Separately, scan a handful of `pros`/`cons` arrays — if any entry reads like a full paragraph or repeats a bolded label, it is too long and must be shortened before publishing.

**Formatting requirement (added 2026-08-10):** in the generated `page.tsx`, the "About this pick" product description paragraphs must render inside a `<div className="space-y-2">` wrapper (in `scripts/generate-guide-page.mjs`) so paragraphs have visible vertical spacing — do not let this regress to unspaced adjacent `<p>` tags.

---

### Content Tone
- Direct, practical, space-conscious — written for people with limited desk/room space
- No marketing superlatives without specific backing ("the best" must be qualified)
- Use "WorthRated" as the brand name — never "Desk Finds" (two words) or "worthrated" (all lowercase)

### "About this pick" Product Description Rules (GuideProduct.description)
- **Always split into 3 paragraphs** using `\n\n` as separator — never write one long block of text, and never stop at 2 paragraphs (reinforced 2026-08-13, per explicit user instruction: "About this pick" content was found too short across a full batch and needed real depth).
- First paragraph: 2-3 sentences covering the main feature or design approach
- Second paragraph: 2-3 sentences covering tradeoffs, use-case fit, or secondary details
- **Third paragraph (new minimum, do not skip): 2-3 sentences of genuine additional depth** — ownership/ practical detail not covered above: assembly or setup reality, maintenance/storage considerations, how it stacks up against a specific named competitor in the same lineup, or a concrete usage scenario. This must be real added information, not a restatement of paragraph 1 or 2 in different words — if you can't find a genuine third angle, dig into the product's actual spec/title data rather than padding with filler.
- **8-10 sentences total per product description** (up from the old 4-6 minimum — the old bar produced descriptions that read as thin). Treat 4-6 sentences as a failure state requiring a rewrite, not an acceptable minimum.
- **Do NOT state specific Amazon review counts or specific star-rating numbers anywhere in `description`, `pros`, or `cons` — no exceptions (reinforced 2026-08-13, per explicit user instruction).** Banned: "it carries a 4.5 rating across 1,665 reviews", "6,851 reviews versus 15,538", any exact number tied to Amazon's rating/review data. **Why:** Amazon Associates / Amazon's own review-display terms restrict republishing or characterizing Amazon's exact star ratings and review counts on third-party sites — doing so risks account-level penalties, not just a style ding. **What's still fine:** qualitative, editorial-voice framing that doesn't cite Amazon's numbers — e.g. "well-reviewed", "a trusted pick among shoppers", "carries a strong track record", "a newer listing worth treating as an early signal" — since that reads as WorthRated's own assessment, not a republished Amazon statistic. This applies going forward, including mid-batch — if a rewrite pipeline's extraction step surfaces rating/review data (e.g. `/tmp/extract_products.mjs`'s output), that data may inform which pick deserves which badge/rank internally, but the written copy must convert it to qualitative language, never restate the number.
- Do NOT use em dash or en dash anywhere in descriptions
- The `description` field is rendered by splitting on `\n\n` — each segment becomes a separate `<p>` tag in the UI

### `faq[]` minimum depth (added 2026-08-13, per explicit user instruction)
- **Every guide's `faq` array must have 5-7 entries, never fewer.** A 3-entry FAQ (the old de facto minimum) reads as thin and was flagged directly by the user across a full batch. Treat 3 or fewer as a failure state.
- Cover a real spread of angles, not 5-7 rephrasings of the same question: at minimum include (1) a core "how do I choose between X and Y" question specific to this guide's category, (2) a price/budget question, (3) a maintenance/durability/ownership question, (4) a common misconception or spec-comparison question (e.g. clarifying two features buyers often conflate), and (5)+ additional category-specific questions pulled from the real gaps surfaced in `buyingCriteria`/`howWeEvaluated` for this guide.
- Each `a` (answer) should be 2-4 genuine sentences, not a one-liner — same "no filler, no restating the question" bar as the product descriptions.
- Same rating/review-number ban applies inside FAQ answers as everywhere else in guide content.

### `GuideProduct.rating` / `GuideProduct.reviews` fields — do not populate or render (added 2026-08-13, per explicit user instruction)
- **Do not add `rating` or `reviews` fields to new `GuideProduct` entries, and do not render them anywhere in a guide page (product-card pill badges or the Comparison Table "Rating" column).** This is separate from and in addition to the prose rule above — that rule covers *written* text in `description`/`pros`/`cons`; this rule covers the *structured* `rating`/`reviews` fields and their UI badges, which is the same underlying Amazon-republishing risk but a different code path. **Why:** republishing Amazon's exact star rating or review count anywhere on the page — not just in prose — risks Amazon Associates penalties. **Current state:** `scripts/generate-guide-page.mjs` was already updated to stop rendering these fields (no rating/reviews pill badges on product cards, no "Rating" column in the Comparison Table) — confirm this is still true before generating any new guide. Older `data/guides/*.ts` files may still have `rating`/`reviews` keys on `GuideProduct` objects (harmless dead data, safe to ignore or strip) but the generator must never render them. **When building a new guide:** omit `rating`/`reviews` entirely from the `GuideProduct` objects, or leave the interface fields optional/unused — never populate them with real Amazon numbers to feed a badge.

---

## 8. Scoring Rules

### Score Label
- The editorial score is called the **"WorthRated Fit Score"** — use this exact label in UI and content
- Scores are on a **0–10 scale** (e.g., `8.4`)
- `scoreToColor()` from `lib/utils.ts` maps score ranges to Tailwind color classes — always use this function for score display, never hardcode colors

### Schema Restrictions
- **Do not** emit `AggregateRating` schema for WorthRated Fit Scores — they are editorial, not crowd-sourced ratings
- If a product has real Amazon review data (count + rating from the PA API), a `Review` or `AggregateRating` schema may be considered — but only with real, sourced values
- Do not invent `ratingCount`, `bestRating`, or `worstRating` values

### Score Display
- Show scores with one decimal place: `alt.scores.overall.toFixed(1)`
- Use `scoreToColor(score)` for the CSS class — do not hardcode color classes on score elements

---

## 9. Image Rules

### Alt Text
- All `<Image>` components must have descriptive `alt` text — never empty string `alt=""` except for purely decorative SVG icons with `aria-hidden="true"`
- Product images: `alt={product.name}` — include product name
- Guide hero images: `alt={guide.title}`
- Logo: `alt="WorthRated logo"`

### File Naming
- Use kebab-case: `best-monitor-stand-review.jpg` not `BestMonitorStand.jpg`
- Product images stored in Supabase Storage — path: `/storage/v1/object/public/**`
- Static public assets in `public/` — referenced as `/filename.ext`

### OG Images
- Required size: **1200 × 630 px**
- Default OG image: `public/og-default.png` — must always exist
- Guide/product OG: pass absolute Supabase URL to `buildMetadata({ image: "https://..." })`

### next/image Usage
- Always use `<Image>` from `next/image` for content images — never raw `<img>` tags for above-the-fold content
- Use `fill` + `sizes` prop for responsive images in card grids:
  ```tsx
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  ```
- Use `priority` prop on hero/LCP images

### Amazon Images
- `m.media-amazon.com` is in `remotePatterns` — only use for PA API compliant image serving
- Do not hotlink Amazon product images outside of PA API terms

---

## 10. URL & Content Architecture

### Route Patterns
| Route | Purpose |
|---|---|
| `/guide` | All buying guides index |
| `/guide/[slug]` | Individual guide OR category listing page |
| `/reviews` | All product reviews index |
| `/reviews/[slug]` | Individual product review page |
| `/categories/[slug]` | Category hub page |
| `/compare` | Compare index |
| `/compare/[slug]` | Category comparison OR VS article |
| `/deals` | Deals/offers page |
| `/author/[slug]` | Author bio page |
| `/admin/**` | Admin panel (no-index, robots blocked) |
| `/api/**` | API routes (robots blocked) |

### Slug Rules
- All slugs are **lowercase kebab-case**: `best-monitor-stands-for-small-desks`
- Guide slugs and category slugs can overlap — `guide/[slug]/page.tsx` checks `getCategoryBySlug(slug)` first; if matched, renders category listing instead of individual guide
- **Never change an existing slug** without adding a 301 redirect in `next.config.ts`

### VS Compare Articles
- Static VS articles live at `/compare/[vs-slug]`
- Existing: `/compare/monitor-stand-vs-monitor-arm` (priority 0.8 in sitemap)
- These are not category-based — they are manually added to the sitemap in `app/sitemap.ts`

### Sitemap Structure
- Generated dynamically in `app/sitemap.ts`
- Static pages, guide pages, review pages, category pages, compare pages, VS pages
- Supabase data takes precedence; static fallback fills gaps
- Sitemap URL: `https://www.worthrated.com/sitemap.xml`

---

## 11. Internal Linking Rules

### Required Links
- Every buying guide must link to at least one related guide via `relatedGuideSlugs`
- Every product pick in a guide links to its full review page at `/reviews/[slug]`
- The "How We Picked" section links to `/how-we-review`
- The affiliate disclosure bar links to `/affiliate-disclosure`
- Category tags in guide headers link to `/categories/[categorySlug]`
- Author bylines link to `/author/[authorSlug]` via `authorToSlug()` from `data/authors.ts`

### Hub Links
- `/guide` index links to all buying guides
- `/categories/[slug]` links to all guides in that category
- Each guide links back to `/guide` via breadcrumbs

### Broken Link Prevention
- Before adding `relatedGuideSlugs` to a guide, verify the target slug exists in `data/guides.ts` or is published in Supabase
- Before adding `recommendedProductIds`, verify the product ID exists in `data/products.ts` or Supabase
- The `alternatives` array on a product uses product IDs — validate they exist before publishing
- Run `npm run build` to catch any `notFound()` calls that indicate broken references

---

## 12. Known SEO Fixes Already Completed

Do not undo these:

- **Non-www → www redirect** added to `next.config.ts` with `permanent: true` (301)
- **`/about` → `/about-worthrated` redirect** added to `next.config.ts` with `permanent: true`
- **Double title suffix bug fixed** — `buildMetadata()` uses `{ absolute: fullTitle }` to prevent `"Title | WorthRated | WorthRated"`
- **`FAQPage` schema removed from commercial pages** — low/no rich-result value for affiliate pages; avoided to keep schema conservative
- **Canonical URLs** always set via `buildMetadata()` `alternates.canonical` field
- **Security headers** set globally in `next.config.ts`: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, HSTS
- **AI crawler allowlist** in `robots.ts` — GPTBot, ClaudeBot, PerplexityBot, etc. are explicitly allowed
- **IndexNow auto-ping on publish (rewired 2026-09-15)** — `scripts/indexnow-postbuild.mjs` runs as `package.json`'s `postbuild` step after every Vercel **production** build (skips local builds and preview deploys). It diffs `HEAD~1` vs `HEAD` and submits only the new/changed guide, category, or core-page URLs to Bing + Yandex via the IndexNow API. This is the **only** IndexNow trigger for this site — do not re-add a second trigger without reading the note below.
  - **Do not reintroduce a daily/scheduled full-URL-list cron.** One used to exist (`app/api/cron/ping-indexnow/route.ts` + a `vercel.json` cron entry, resubmitting every guide/product/category URL every night) and it tripped Bing Webmaster Tools' **"IndexNow is in batch mode"** warning — Bing wants streaming (small submissions as content is actually published), not periodic bulk resubmission of the whole site. Both the route and the cron entry were removed 2026-09-15.
  - **Do not reintroduce `.github/workflows/indexnow.yml`** either — it duplicated the postbuild script's job (both would fire on the same push) and was removed in the same cleanup. If a manual/CI-triggered ping is ever needed again, call `node scripts/indexnow.mjs <slug1> <slug2> ...` (still present, unused by any automation) directly instead of re-adding a workflow.
  - To manually ping specific slugs: `node scripts/indexnow.mjs <slug1> <slug2> ...` or `node scripts/indexnow.mjs --auto` (diffs the last commit).
  - `INDEXNOW_KEY` is already configured (see `scripts/indexnow.mjs`/`scripts/indexnow-postbuild.mjs`) and `public/<key>.txt` must keep existing — do not delete it, or IndexNow submissions will fail verification.
- **`/admin` and `/api/` blocked** in `robots.ts`
- **Supabase + static fallback** in sitemap — site doesn't break if DB is unreachable
- **OG image handling** — `buildMetadata()` correctly handles both absolute Supabase URLs and relative paths
- **`revalidate = 86400`** on guide pages — prevents stale ISR cache issues
- **`generateStaticParams()`** on guide pages — pre-renders all known slugs at build time
- **`ItemList` schema** on guide pages uses only `name` + `url` — no fake prices or ratings
- **Author schema** conditionally uses `Person` vs `Organization` based on `isPerson` flag in `data/authors.ts`
- **Amazon browse CTA** uses `rel="noopener noreferrer sponsored"` and `target="_blank"`

---

## 13. Current SEO Caution Areas

Handle these carefully going forward:

- **Slug changes:** Any existing `/guide/[slug]` or `/reviews/[slug]` URL change requires a 301 redirect in `next.config.ts` — Google has indexed these pages
- **`revalidate` value:** Currently 86400 (24h). Do not lower this without understanding CDN cache costs; do not raise it above 604800 (7 days) for guide pages that update frequently
- **Static vs Supabase data sync:** If a guide is published in Supabase with a slug that differs from `data/guides.ts`, both may appear in the sitemap. Audit `app/sitemap.ts` merge logic before bulk-publishing
- **`m.media-amazon.com` images:** In `remotePatterns` but Amazon ToS restricts image hotlinking outside PA API — verify compliance before using
- **`/compare/[slug]`** dual-purpose route (category compare + VS articles) — ensure new VS articles don't accidentally match a category slug
- **Author pages `/author/[slug]`** — linked from guide bylines; if the route doesn't exist or returns 404, it creates broken internal links. Verify author slugs in `data/authors.ts` match existing pages
- **`llms.txt` and `llms-full.txt`** in `public/` — AI-readable site description files. Keep these updated when site structure or content scope changes significantly

---

## 14. Build, Lint & QA Commands

All commands run from the `worthrated/` directory.

### Development
```bash
npm run dev          # Start Next.js dev server (http://localhost:3000)
```

**Agent-environment note (added 2026-08-10):** the agent's shell and the user's browser are frequently not on the same machine. `curl http://localhost:3000/...` succeeding from the agent's shell does NOT mean the user can open that link — it only proves the dev server itself is healthy. Do not tell the user to open a `localhost` link as the way to review changes before a commit/push.

**Pre-push preview workflow (updated 2026-08-11, per explicit user instruction — "ko lên PR nữa, chỉ show ở local, tôi ok thì lên production luôn"):** when the user wants to review a batch before it goes live, do NOT open a GitHub PR and do NOT wait on a Vercel branch-preview deployment — that round trip (feature branch + PR + ~1-3 min Vercel build) was tried and the user found it too slow. Instead: (1) start/reuse the local dev server (`npm run dev`), checking for and killing any stale process already bound to port 3000 first; (2) give the user direct `http://localhost:3000/guide/<slug>` links to a few representative pages from the batch; (3) wait for the user's explicit approval of what they see locally; (4) once approved, push straight to `main` (no PR). Only fall back to a Vercel preview if the user reports they can't open the localhost link. Only skip review entirely if the user explicitly says to push straight to main without looking first.

**Guide-batch regeneration pitfall (added 2026-08-11):** `scripts/generate-guide-page.mjs` bakes `introParagraphs` and other guide content as static text directly into the generated `app/(site)/guide/<slug>/page.tsx` JSX at generation time — it does NOT read `data/guides/<slug>.ts` dynamically at request time. If a `data/guides/<slug>.ts` file is edited *after* its `page.tsx` was already generated (e.g. fixing templated/duplicate intro copy across a batch), the live page keeps showing the stale baked-in text even after a full dev-server restart and `.next` cache wipe — because the stale text lives in the committed `page.tsx`, not in a cache. Always re-run `node scripts/generate-guide-page.mjs <slug1> <slug2> ...` for every affected slug after editing its data file, before telling the user the fix is visible.

**No single fixed intro template across a guide batch (added 2026-08-11, per user feedback on the 61-guide garden hose/weed puller batch):** when a code-generated batch of guides shares one script (e.g. `build_guides.py`-style pipelines), the `introParagraphs` (and any other prose sections built from the same template) must NOT use one fixed sentence skeleton with only the variables (product names, criteria, prices) swapped in. Reviewing several guides side by side made the repeated skeleton obvious ("X can look similar in a listing photo but differ in ways that matter... Y alone in this lineup spans from...") — this reads as templated/thin content and risks a spam/duplicate-content signal to search engines even though the underlying data is real and unique per guide. Fix: generate each templated prose section from a rotating pool of several distinct phrasings/framings (e.g. pain-point framing, myth-busting framing, question framing, direct-comparison framing), selected per-slug via a deterministic hash so the same guide always gets the same variant but sibling guides in the batch don't repeat the same skeleton. Apply this to every future guide-batch generation script, not just garden hose/weed pullers — check generated output for template repetition across multiple articles before proposing a batch as done.

**Product description/pros/cons must be original review-voice copy, not repackaged Amazon marketing text (added 2026-08-11, per user feedback on the microwave guide batch):** guide-generation pipelines that pull raw `itemInfo.features` from Amazon and drop them near-verbatim into a product's `description`/`pros`/`cons` produce two real problems, both confirmed on `best-1000-watt-microwaves.ts`: (1) the copy reads like Amazon's own marketing bullets ("Smart Sensor Technology for Optimal Cooking: Automatically adjusts cooking time and power based on food humidity, ensuring perfectly cooked meals every time.") instead of an editor's actual assessment, and (2) when the same physical unit is listed multiple times (different ASIN/price/seller) across ranks in the same guide, the raw-feature approach can produce byte-identical description paragraphs for two different picks — a genuine duplicate-content problem, not just a style one. Fix, applied going forward to every "Best X" guide:
- Mine the real feature list per ASIN, but rewrite it in first-person-editor voice with a genuine verdict/tradeoff, not a feature list restated in prettier words. Litmus test: if you swap the product name and the sentence still reads fine, it wasn't written from that product's real features and needs a rewrite.
- When two ranked picks in the same guide are actually the same underlying model (common with multi-listing/reseller Amazon products), say so explicitly ("this is the same unit as the pick above, just listed cheaper") rather than writing two independent-sounding descriptions for one product.
- Do not lean on star rating / review count as the main selling point in the description — those numbers drift over time and reviewing them doesn't tell the reader anything about the product itself. Mention review-base size only as a light, secondary caveat (e.g. "newer listing, shorter track record") and put the word-count budget into real feature/use-case detail instead.
- Same rule applies to `pros`/`cons`: rewrite in the same original voice, not raw Amazon bullets. `cons` should include at least one substantive tradeoff (not just "confirm price before buying" as the only entry).
- Before calling a batch done, sample 3 random product descriptions and ask "does this sentence exist because of a real feature, or because it sounds plausible for any product in this category?" — if the latter, the batch isn't done.

### Production Build
```bash
npm run build        # Full Next.js production build — runs type-check, catches broken routes
npm run start        # Serve production build locally
```

### Linting
```bash
npm run lint         # ESLint (eslint-config-next 16.2.6)
```

### Database Seeding
```bash
npm run seed:products   # npx tsx scripts/seed-products.ts
npm run seed:guides     # npx tsx scripts/seed-guides.ts
npm run seed:deals      # npx tsx scripts/seed-deals.ts
npm run seed:settings   # npx tsx scripts/seed-site-settings.ts
```

Run seed scripts in order: `seed:products` → `seed:guides` → `seed:deals` → `seed:settings` (guides reference product IDs).

### TypeScript Check (no emit)
```bash
npx tsc --noEmit
```

### Pre-commit Gate
Before committing any change that touches routes, metadata, or schema:
1. `npx tsc --noEmit` — zero TypeScript errors
2. `npm run lint` — zero ESLint errors
3. `npm run build` — successful build with no `notFound()` warnings
4. Manually verify the changed page's `<title>` tag does not contain `| WorthRated | WorthRated`
5. Verify canonical URL is correct (`/guide/slug` not `/guide/slug/`)

---

## 15. Deployment & Environment

### Platform
- **Vercel** (inferred from `vercel.svg` in `public/` and standard Next.js deployment)
- The `next.config.ts` domain redirect handles non-www → www at the application layer (works on Vercel)

### Required Environment Variables

| Variable | Purpose | Example |
|---|---|---|
| `ADMIN_EMAIL` | Admin login email | `admin@worthrated.com` |
| `ADMIN_PASSWORD` | Admin login password | (strong password, min 16 chars) |
| `SESSION_SECRET` | iron-session encryption key | min 32 characters |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role JWT | (long JWT string) |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL | `https://www.worthrated.com` |

### Secrets Policy — Critical
- **Never commit `.env.local`** — it contains live Supabase service role keys and admin credentials
- `.env.example` in `worthrated/` is the template — keep it updated but with placeholder values only
- `SUPABASE_SERVICE_ROLE_KEY` has full database access — treat as a root credential
- `SESSION_SECRET` must be at least 32 characters; use a cryptographically random string in production
- Rotate `ADMIN_PASSWORD` before any public launch — the dev default `admin123` must never reach production
- Set all env vars in Vercel dashboard under Project Settings → Environment Variables

### isSupabaseConfigured()
- `lib/supabase/server.ts` exports `isSupabaseConfigured()` — all Supabase calls are gated behind this check
- If env vars are missing, the app silently falls back to static data — it does not crash
- This means a build without Supabase env vars will succeed but serve static data only

### Server Actions
- Max body size: `10mb` (set in `next.config.ts` `experimental.serverActions.bodySizeLimit`)
- Do not increase this without confirming Vercel plan limits

---

## 16. Agent Workflow Rules

### Before Writing Any Code

1. **Read this file (`CLAUDE.md`) first** — understand the project before touching anything
2. **Read `AGENTS.md`** — contains critical Next.js version-specific rules
3. **Read the relevant source file** before editing it — never edit blind
4. **Check `lib/seo.ts`** before adding any metadata — use `buildMetadata()`, never construct metadata objects manually
5. **Check `next.config.ts`** before adding redirects — follow the existing pattern exactly

### Before Touching Routes or Pages
- Verify the slug does not already exist in `data/guides.ts` or `data/categories.ts`
- Check `app/sitemap.ts` to understand how the new page will be indexed
- Confirm `generateStaticParams()` will include the new page if it needs SSG

### Before Adding Schema / JSON-LD
- Re-read Section 5 of this file
- Never add `AggregateRating`, `Review` claiming personal testing, or `FAQPage` on commercial pages

### Before Adding Affiliate Links
- Use `rel="noopener noreferrer sponsored"` — not just `nofollow`
- Verify `<AffiliateDisclosureBar>` is present on the page

### Reporting Format
When completing a task, report:
```
Files changed: [list absolute paths]
SEO impact: [none | low | medium | high — with brief reason]
Redirects added: [none | list]
Schema changes: [none | describe]
Build status: [passed | not verified]
```

### What Agents Must Not Do
- Do not change the canonical domain from `www.worthrated.com` to anything else
- Do not remove the non-www redirect from `next.config.ts`
- Do not add `AggregateRating` schema with editorial scores
- Do not write "we tested" or "we tried" in any content
- Do not remove the `revalidate = 86400` from guide pages without explicit instruction
- Do not commit `.env.local` or any file containing real secrets
- Do not change the Google Analytics ID without explicit confirmation
- Do not rename slugs of published pages without adding a 301 redirect

---

## 17. Recommended Sprint Order

Prioritized next steps based on current architecture:

1. **Author pages** (`/author/[slug]`) — guide bylines link to these; 404s hurt internal linking and E-E-A-T signals. Create author profile pages using `data/authors.ts`.

2. **`llms.txt` / `llms-full.txt` update** — ensure `public/llms.txt` accurately describes current site structure, content categories, and affiliate disclosure. AI crawlers read this.

3. **Category hub content** (`/categories/[slug]`) — add editorial descriptions and featured guide links to each category page. Currently these may be thin.

4. **Compare pages content** (`/compare/[slug]`) — ensure each category compare page has substantive content, not just a product table. Thin compare pages are low-quality signals.

5. **Deals page freshness** (`/deals`) — affiliate deal pages with stale prices are a trust issue. Add a "prices last checked" date and consider a shorter `revalidate` interval.

6. **`og-default.png` audit** — confirm the file exists at `public/og-default.png` at exactly 1200×630 px. Missing default OG image causes social share failures.

7. **Footer internal links audit** — confirm `/affiliate-disclosure`, `/privacy-policy`, `/how-we-review`, and `/contact` are all linked from the footer and that those pages exist and are not 404.

8. **Seed script idempotency** — review `scripts/seed-products.ts` and `scripts/seed-guides.ts` to ensure re-running them does not create duplicate records in Supabase (upsert, not insert).

9. **Static data sync** — periodically reconcile `data/products.ts` and `data/guides.ts` with Supabase — remove products/guides from static files once they are stable in the database.

10. **Performance: LCP images** — audit guide hero images; add `priority` prop to the first `<Image>` on guide pages to improve Core Web Vitals.

---

## 18. Final QA Checklist

Run this checklist before every commit that touches pages, metadata, content, or schema.

### TypeScript & Build
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] `npm run lint` passes with zero errors
- [ ] `npm run build` completes successfully

### Metadata
- [ ] Page `<title>` does not contain `| WorthRated | WorthRated` (double suffix)
- [ ] `description` is unique, 120–160 chars, not the default `SITE_DESCRIPTION`
- [ ] `buildMetadata()` used — no manual `Metadata` object construction
- [ ] Canonical URL matches the page's actual URL, no trailing slash

### Structured Data
- [ ] No `AggregateRating` with editorial/invented values
- [ ] No `FAQPage` schema on pages with affiliate links
- [ ] No `Review` schema claiming personal hands-on testing
- [ ] `ItemList` contains only `name` and `url` — no prices, no ratings
- [ ] Author schema uses `Person` or `Organization` correctly per `data/authors.ts`

### Affiliate & Compliance
- [ ] All outbound affiliate links have `rel="noopener noreferrer sponsored"`
- [ ] `<AffiliateDisclosureBar>` present on every page with affiliate links
- [ ] No "we tested" / "we tried" language in any content
- [ ] No fake discount codes, partnerships, or sponsorship claims

### URLs & Redirects
- [ ] No slug was renamed without a 301 redirect added to `next.config.ts`
- [ ] No trailing slashes on internal `href` values
- [ ] All `relatedGuideSlugs` reference slugs that actually exist
- [ ] All `recommendedProductIds` reference IDs that actually exist

### Images
- [ ] All `<Image>` components have non-empty `alt` text
- [ ] Hero/LCP images have `priority` prop
- [ ] OG image is 1200×630 px or an absolute Supabase URL
- [ ] No raw `<img>` tags for content images

### Security
- [ ] No secrets in staged files (`.env.local`, JWT tokens, passwords)
- [ ] Admin routes have `noIndex: true` in metadata
- [ ] `robots.ts` still blocks `/admin`, `/api/`, `/_next/`

---

## Appendix: Batch Content Pipeline Runbook (adapted from DeskFinds)

This is the standard pipeline for deploying a large batch of new guide articles from a keyword/topic CSV, adapted from the process proven on the DeskFinds (smartspace-picks) project and customized for WorthRated's stricter content-depth and no-price rules above. Follow this checklist whenever a new keyword batch arrives instead of re-deriving the approach from scratch.

### 1. Core philosophy

- **Never hand-write per-article prose for hundreds of rows.** Instead build a small number of reusable **content pools** per product category (criteria explanations, FAQ entries, how-to-choose logic), then have code assemble a unique-enough article per row by deterministically sampling from the pool.
- **"Deterministic per-slug" beats "random."** The same slug must always produce the same selection on every re-run (idempotent builds, reviewable diffs, no silent content drift). Achieve this with a hash of the slug as the seed, never `Math.random()`.
- **Depth must be real, not templated filler.** Every pooled criterion/FAQ entry is written once, by hand, grounded in actual competitor research (WebSearch) for that category, and is *reused* across many articles, but each entry must independently satisfy WorthRated's Content Depth Standard (Section 0.1) on its own, since it will appear verbatim (with product names substituted) in multiple articles.

### 2. Five-layer architecture

1. **Sourcing** — batch PA-API/Creators API calls (`search_generic.mjs` pattern): dedupe all `(primaryKeyword, mainKeyword)` pairs across the whole CSV into one `queries.json`, then run one resumable script that writes incrementally to `search_results.json` (skips already-present queries on re-run), with a fixed delay between calls (900ms) to avoid rate limits.
2. **Content pool** — one `content_templates.mjs` per project, with a `POOLS` object keyed by category slug (e.g. `dehumidifier`, `snowblower`). Each pool has a `criteria[]` array and an `faq[]` array. Every criteria entry is `{ id, criterion, explain: (p0, pMin, pMax, pAlt) => "..." }`, where `explain` is a function, not a static string, so it binds real per-article product names/badges/numbers at build time. This is what makes "real named product + real number" possible at scale instead of one-off.
3. **Mining** — turn real Amazon `itemInfo.features` data into WorthRated-depth prose: 8-10 sentence / 3-paragraph descriptions, ~60-90 character short pros/cons bullets, rewritten in reviewer voice, never raw/truncated Amazon bullets copy-pasted in. Never populate `rating`/`reviews` fields; never state an exact star rating or review count anywhere in prose (WorthRated-specific, stricter than DeskFinds).
4. **Anti-duplicate layer** — before building anything: (a) diff every planned slug against `data/guides.ts`'s existing registry and drop collisions; (b) within the pool-selection step, use a seeded shuffle (`seededShuffle(pool, hashStr(row.slug))`) so neighboring articles in the same category don't draw the same criteria/FAQ entries in the same order; (c) filter obviously off-topic sourced products per category (accessory/wrong-product regex excludes) before they can contaminate a guide's product lineup.
5. **Verify** — `npx tsc --noEmit`, spot-check rendered pages, and run WorthRated's own self-check from Section 0.1: pick 3 random sentences from `buyingCriteria`/`howToChoose` output, if none name a real product + a real number, the content is too thin and the pool entry needs rewriting, not the pipeline.

### 3. Real code patterns (as implemented this batch)

```js
// hash-seed shuffle: deterministic per slug, no Math.random()
function hashStr(s) { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0; return h >>> 0; }
function mixHash(h) { return (h ^ 0x9e3779b9) >>> 0; }
function seededShuffle(arr, seed) {
  const a = [...arr]; let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildCriteria(row, products) {
  const pool = POOLS[row.cat].criteria;
  const shuffled = seededShuffle(pool, hashStr(row.slug));
  const picked = shuffled.slice(0, 6);
  const p0 = products[0];
  const pMin = products.find(p => p.badge === "Best Value") ?? products[1];
  const pMax = products.find(p => p.badge === "Best Premium Pick") ?? products[products.length - 1];
  const pAlt = products[Math.floor(products.length / 2)];
  return picked.map(c => ({ criterion: c.criterion, explanation: c.explain(p0, pMin, pMax, pAlt) }));
}

function buildFaq(row) {
  const pool = POOLS[row.cat].faq;
  const shuffled = seededShuffle(pool, mixHash(hashStr(row.slug)));
  return shuffled.slice(0, Math.max(5, Math.min(7, pool.length)));
}
```

- `PRIORITY_MAP` (per-category, keyed by criterion `id`) can be used to force certain criteria to appear first for a subset of articles (e.g. safety-critical criteria always shown for a "for kids/seniors" variant title) before the seeded shuffle fills the remaining slots: pin the priority ids, then seed-shuffle only the remainder.
- `check_dup`-equivalent: before calling `build-guide.mjs`, diff the planned slug list against `data/guides.ts` in one pass up front (not per-row), and log every collision explicitly rather than silently skipping, since the user needs to see what was dropped and why.

### 4. Why this saves tokens

Writing 18 category pools once (roughly 7-10 criteria + 7 FAQ entries each, hand-grounded in real research) costs a fixed, one-time token budget. Generating 700+ unique articles by re-deriving prose per row would cost roughly 700x that. The pool + seeded-shuffle + `explain()`-function-with-real-product-binding approach gets genuine per-article specificity (a real product name and a real number in every criterion) without paying the per-row authoring cost. The only recurring cost is the sourcing API calls and the final assembly step, both cheap script execution, not model generation.

### 5. Seven real failures hit in the batch immediately preceding this note (avoid repeating)

1. **Wrong-content extraction** — a loose substring match when recovering a large pasted CSV from transcript accidentally grabbed the extraction script's own source instead of the CSV. Fix: match on a long, highly-specific, unlikely-to-collide substring, and always sanity-check line count / structure of the extracted result before trusting it.
2. **Naive CSV parsing on quoted fields** — `split(',')` silently produced garbage column alignment because of commas inside quoted note fields and comma-decimal values. Fix: always use a real character-state-machine CSV parser (tracks quote state, handles escaped quotes) for any pasted CSV with free-text or currency columns, never a naive split.
3. **Vercel "Secret"-type env vars are permanently unrecoverable** — `vercel env pull` returns a literal redacted placeholder string for any var saved as Type=Secret, and this is not a permissions issue, it cannot ever be revealed again by anyone, including the owner. Fix: diagnose by printing lengths of pulled secrets (never the values) as a first check whenever an API call fails with an auth error right after an env pull, since a suspiciously short fixed-length value is the tell.
4. **Silent wrong-value failure via fallback masking** — a script's `env.X || 'fallback'` pattern didn't trigger even though the real intent was "use the fallback if X is broken," because the redacted placeholder is a truthy non-empty string, not falsy/undefined. This caused every API call to silently send a garbage value and return zero results for every query with no thrown error. Fix: for any env var that might be a Vercel-redacted secret, explicitly check its value/length rather than relying on truthy-fallback logic.
5. **Off-topic product contamination** — generic keyword search can return accessories, replacement parts, or wrong-category items alongside the real product. Fix: maintain a category-specific exclude regex (e.g. replacement blade/filter/bag, accessory kit) applied to every sourced item's title before it's allowed into a guide's product lineup, not just a manual eyeball pass.
6. **Content pool exhaustion on shared pools** — if a category pool has too few entries relative to how many articles draw from it, the seeded shuffle starts repeating near-identical criteria/FAQ selections across neighboring articles despite different seeds, since slicing a small pool has limited combinatorics. Fix: budget at least 8-10 criteria entries and 7+ FAQ entries per category pool when the category will produce 15+ articles, not the bare minimum needed to pass the depth checklist once.
7. **Raw Amazon ad copy leaking into "mined" prose** — see the "Never let raw Amazon feature-bullet text reach published prose" callout in Section 0.1 above for the full story (bracket-label sellers, decimal-period false sentence-boundaries, ugly hard-truncated spec chips). Fix already baked into `shortPhrase()`/`stripBracketLabels()`/`buildSpecs()` in the mining step — reuse that logic rather than re-deriving it, and always grep built output for literal `【` / `[` before shipping.

### 6. Checklist for applying this pipeline to a new site or new batch

1. Read the target site's own CLAUDE.md content-depth rules in full; do not assume they match another project's rules (WorthRated's "never show a price" and "never state exact rating/review numbers" rules are stricter than DeskFinds and must shape the mining step differently).
2. Parse the incoming CSV with a real character-state-machine parser; confirm row/column counts look sane before proceeding.
3. Diff every planned slug against the site's existing guide registry in one batch pass; log and drop collisions explicitly.
4. Group rows by product-category cluster; run one WebSearch competitor-research pass per cluster before writing any pool content, never template first and research later.
5. Dedupe all `(primaryKeyword, mainKeyword)` pairs across the batch into a single `queries.json`; run a resumable, incrementally-saving sourcing script with a fixed inter-request delay.
6. If any env var used for the sourcing API returns an auth error, check for a Vercel-redacted placeholder value (by length, never by printing the value) before assuming a credential is genuinely wrong.
7. Write one content pool per category with 8-10+ criteria entries (as `explain()` functions binding real product names/numbers) and 7+ FAQ entries, grounded in the WebSearch research from step 4.
8. Write the deterministic seeded-shuffle assembly layer (`hashStr`/`seededShuffle`/`buildCriteria`/`buildFaq`), plus a category-specific off-topic exclude filter applied to sourced products before they enter any guide's lineup.
9. Assemble each row's full spec JSON and run it through the site's own guide-build script (e.g. `build-guide.mjs`), never hand-roll a different file shape than what the site's existing tooling expects.
10. Verify: `tsc --noEmit`, spot-check rendered pages, run the site's own content-depth self-check (pick 3 random sentences from criteria/how-to-choose output and confirm each names a real product + real number), confirm no site-specific compliance rule (price display, rating numbers, dash usage, etc.) was violated, grep all generated guide files for literal `【` and `[` (zero hits required — see failure #7 above), then register and commit.
