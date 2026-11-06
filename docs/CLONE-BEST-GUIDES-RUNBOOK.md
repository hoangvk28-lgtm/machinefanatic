# Runbook: cloning "best" guides into MachineFanatic (works on any machine)

Everything needed lives in this repo. You do **not** need the other affiliate projects on the remote machine. The topic list was pre-built from them into `scripts/clone/source-index.json`.

## Files that matter
| File | Purpose |
|---|---|
| `docs/CLONE-BEST-GUIDES-RUNBOOK.md` | This file: setup + round workflow + the prompt to paste |
| `docs/BEST-GUIDE-WRITER-BRIEF.md` | **The writing standard** for every best guide (voice, rules, spec JSON format) |
| `CLAUDE.md` | Site rules (sections starting "MachineFanatic rule" override the inherited WorthRated ones) |
| `scripts/clone/source-index.json` | ~3,000 machine "best" topics from 9 projects, each with `status`: todo / inprogress / done / skip |
| `scripts/clone/next-batch.mjs` | Picks the next N todo topics, pulls live Amazon data, writes `scripts/clone/work/<slug>.input.json` |
| `scripts/clone/search.mjs` | Adds more Amazon search results to a work file: `node scripts/clone/search.mjs <slug> "query" ["query 2"]` |
| `scripts/clone/mark.mjs` | Sets status (done / skip / todo) |
| `scripts/build-guide.mjs` | spec JSON → `data/guides/<slug>.ts` |
| `scripts/register-dynamic-guide.mjs`, `scripts/register-new-guides.mjs` | Register the guide (both are required) |
| `scripts/audit-guides.mjs` | Content audit (dashes, prices, testing claims, intro rule, meta lengths) |

Reference quality bar: `data/guides/best-50-pint-dehumidifiers.ts` and `data/guides/best-4000-watt-generators.ts`.

## One-time setup on the remote machine
```bash
git clone https://github.com/hoangvk28-lgtm/machinefanatic.git
cd machinefanatic
nvm install 22 && nvm use 22      # Node 22+ required (register-new-guides imports .ts files)
npm ci
cp .env.example .env.local        # then paste the REAL values for:
                                  # AMAZON_PAAPI_ACCESS_KEY, AMAZON_PAAPI_SECRET_KEY,
                                  # AMAZON_PAAPI_PARTNER_TAG=worthrated-20, SITE_AMAZON_TAG=machinefanatic-20
```
`.env.local` is git-ignored and must never be committed. If the API errors right after setup, check the key lengths (a short fixed-length value means a redacted Vercel "Secret" was pasted, not the real key).

## Each round (recommended: 20 guides per round, one category at a time)
```bash
git pull
git checkout -b clone-round-N
node scripts/clone/next-batch.mjs 20 outdoor-power     # categories: power-tools | outdoor-power | shop-garage | kitchen-machines | home-machines
```
Then give the AI agent the **prompt below**. When it finishes:
```bash
node scripts/audit-guides.mjs              # must be all "ok"
npx tsc --noEmit                           # must be empty
npm run build 2>&1 | grep -E "Compiled successfully|Finished TypeScript|rror"
npm run dev                                # review 3 or 4 pages at http://localhost:3000/guide/<slug>
git add -A && git commit -m "Clone round N: 20 <category> guides" && git push -u origin clone-round-N
```
Merge to `main` only after the site owner approves the round. Vercel deploys from `main`.

## Prompt to paste into the AI agent (Claude Code, Codex, etc.)
```
You are working in the machinefanatic repo. Read these first, fully:
docs/CLONE-BEST-GUIDES-RUNBOOK.md, docs/BEST-GUIDE-WRITER-BRIEF.md, and the sections of CLAUDE.md that start with "MachineFanatic rule".
Study data/guides/best-50-pint-dehumidifiers.ts as the quality bar.

Task: write one best guide for every scripts/clone/work/*.input.json that has no matching .spec.json yet.
For each input:
1. Topic check: if the topic is not a machine or power tool (e.g. accessories, cookware, furniture, detergents) or still has fewer than 4 on-topic products after you search for more (step 3), do not write it. Run `node scripts/clone/mark.mjs skip <slug>` and record the slug and the reason in docs/clone-log.md.
2. Research the category with 2 or 3 web searches (top-ranking pages, buying mistakes, rated vs peak specs) before writing.
3. Build the lineup (5 to 7 products) from BOTH `picks` (products from the source guide) and `candidates` (fresh Amazon search results). At least 2 products, or 40% of the lineup, must come from `candidates`, so the guide is not a copy of the source. If the input is thin or off-target, fetch more with `node scripts/clone/search.mjs <slug> "<specific query>"`, for example by brand, size, power source or use case. Every product must truly match the guide topic: drop accessories, replacement parts, wrong categories and duplicate listings of the same unit. Prefer well-known brands and complete spec data. Use `price_internal_only` only to order tiers; never print it.
4. Write scripts/clone/work/<slug>.spec.json exactly per docs/BEST-GUIDE-WRITER-BRIEF.md. Use only facts from the input `picks`/`candidates` data plus well-established engineering knowledge. Rewrite everything in your own expert voice and never paste Amazon bullet text. Drop off-topic picks.
5. node scripts/build-guide.mjs scripts/clone/work/<slug>.spec.json
6. node scripts/register-dynamic-guide.mjs <slug> && node scripts/register-new-guides.mjs <slug>
7. node scripts/audit-guides.mjs <slug>. Fix the spec and rebuild until it prints "ok".
8. node scripts/clone/mark.mjs done <slug>
When all are done, run npx tsc --noEmit. Report a table with these columns: slug, products kept, metaTitle length, metaDescription length, skipped and why.
Do not push to main.
```

## Rules that must never regress (enforced by the brief and audit)
- **No product content in the intro.** Two short category-level paragraphs only, with no model names or specs.
- No em or en dashes. No prices. No star ratings or review counts. No "we tested", "hands-on" or similar claims. No `【` brackets or raw Amazon bullets.
- `metaTitle` is 48 characters or fewer. `metaDescription` is 120 to 160 characters. `guideTitle` ends with "(2026)".
- Images: guides use the Amazon API product images (`m.media-amazon.com`). Any extra illustration must be a real photo with credits at the end only (see CLAUDE.md).
- Every internal `<Link>` has `prefetch={false}`. Do not create literal `app/(site)/guide/<slug>/` route folders; the dynamic registry serves guides.
- Writing cost guideline: at most 2 parallel writer agents.

## Slug collisions and duplicates
`source-index.json` already deduplicates topics that exist in several projects (`alsoIn` lists the others). If two topics are near-duplicates (for example `best-gas-pressure-washers` and `best-gas-powered-pressure-washers`), write the stronger one, mark the other `skip` and note "duplicate of X" in `docs/clone-log.md`.
