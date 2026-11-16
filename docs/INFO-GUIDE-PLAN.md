# MachineFanatic: Info Guide Program, Plan (100 articles)

Written 2026-11-16. Read with `docs/INFO-GUIDE-BRIEF-V2.md` (the execution brief).

## 1. What the project looks like today

| Thing | State |
|---|---|
| Best guides in `data/guides/` | 1,237 |
| Info / explainer articles in `data/legacy/` | 5 (`what-is-a-plunge-saw`, `what-does-a-lathe-do`, `best-cordless-circular-saw`, `dewalt-780-vs-festool-kapex`, `ryobi-p516-vs-p517`) |
| Renderer | `components/guide/LegacyArticlePage.tsx`, type `LegacyArticleModule` |
| Route | `app/(site)/[legacySlug]/page.tsx`, `dynamicParams = false` |
| Registry | `data/legacy-registry.ts` (literal imports only) |
| Sitemap | `app/sitemap.ts` line 87 already maps `legacySlugs` at priority 0.8 |
| Existing brief | `docs/INFO-GUIDE-BRIEF.md` (v1), written, never executed |

So the pipeline exists and works. Nothing has been produced through it.

## 2. The three problems with v1 of the brief

**2.1 The topic list does not match the money pages.** v1 spends its first two rounds (40 of 100 articles) on hand power tools: track saws, miter saws, jigsaws, impact drivers, routers, sanders. The site's actual best-guide inventory is almost the opposite:

| Cluster | Best guides | v1 info articles | Share of guides | Share of v1 info |
|---|---|---|---|---|
| Solar panels and RV solar | 126 | 0 | 10% | 0% |
| Generators, inverters, power stations | 230 | 7 | 19% | 7% |
| Lawn and garden OPE | 250+ | 20 | 20% | 20% |
| Dehumidifiers, air purifiers, humidifiers | 126 | 6 | 10% | 6% |
| Space heaters and cooling | 43 | 0 | 3% | 0% |
| 3D printers | 21 | 0 | 2% | 0% |
| Hand power tools (saws, drills, grinders, sanders) | ~90, mostly pole saws | 40 | 7% | 40% |
| Sewing machines and juicers | 0 | 5 | 0% | 5% |

Five v1 articles (sewing machines, juicers) have no best guide anywhere on the site to support. Forty support the thinnest cluster on it. That is the single thing to fix.

**2.2 Nothing links back.** v1 gives info articles a list of allowed outbound targets, but no best guide on the site ever links *to* an info article. A supporting article only earns its keep when the money page it supports links to it and receives a link in return. That needs a mechanism, not good intentions, across 1,237 files.

**2.3 No verification step and no hub.** With 1,237 slugs, "link only to pages that exist" cannot be eyeballed. And there is no index page, so 100 new root-level URLs would be orphans except for the sitemap.

## 3. The plan

**Phase 0, zero AI tokens (do before any writer agent).**
1. `node scripts/info/topics.mjs` prints the 100 topics with their mapped best-guide hub slugs and fails on any mapped slug that is not in `data/guides/`.
2. `node scripts/info/check-links.mjs <slug...>` validates every `href` in a written article against the real registries (`data/guides.ts`, `data/legacy-registry.ts`, categories, static pages). Run it per article before the round is delivered.
3. `node scripts/info/link-back.mjs <info-slug>` reads the article's mapped hub list and appends the info article to each of those guides' `relatedLinks`/related block, so the money pages link down into the explainer. Coordinator runs it, never a writer.

**Phase 1 to 5, one round of 20 articles each,** ordered by the value of the cluster it supports:

| Round | Cluster | Articles | Supports |
|---|---|---|---|
| 1 | Power: generators, inverters, power stations | 18 + 2 solar-adjacent | 230 guides |
| 2 | Solar and RV electrical | 15 + 5 RV water/heat | 126 guides |
| 3 | Lawn and garden OPE part 1: mowers, trimmers, blowers, small engines | 20 | ~160 guides |
| 4 | Lawn and garden OPE part 2 plus pressure washers and snow | 20 | ~110 guides |
| 5 | Indoor air, kitchen, home, 3D printing, shop | 20 | ~250 guides |

**Agents:** 1 or 2 Sonnet writer agents per round, each taking its whole list of 10 or 20 slugs in one continuous run (CLAUDE.md rule, 2026-11-07). Research once per cluster into `docs/research/info-<cluster>.md` and reuse it for every article in the round.

**Budget:** info articles are 2,500 to 4,000 words with real research, so expect roughly 25k to 35k AI tokens each, higher than a best guide. Research-once-per-cluster is what keeps the second through twentieth article in a round cheap.

**Hub page:** add `app/(site)/learn/page.tsx` listing all info articles grouped by cluster, linked from `mainNav` and `footerNav.company`. Build it in round 1 so later rounds only add rows.

**Review gate:** each round is delivered on a branch `info-round-N` for the owner's approval before the next round starts. No pushes to `main` from a writer agent.

## 4. Why this shape pays

Each info article does three jobs at once: it ranks for a question keyword the best guides cannot target, it absorbs that traffic and pushes it into the matching best guide with a commercial-intent link, and it gives the cluster a topical-authority anchor that 40 near-identical "best X under $N" pages cannot provide on their own. The reallocation in Section 2.1 is what makes those three jobs land on the clusters that actually carry the site.
