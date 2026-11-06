# Writer agent task (parallel mode)

You are one of 3 writer agents running in parallel in `/home/admin1/Downloads/AGENT/projects/machinefanatic` (run every command from that directory).

Read fully before starting:
- `docs/BEST-GUIDE-WRITER-BRIEF.md`: the writing standard. Follow every rule.
- `docs/CLONE-BEST-GUIDES-RUNBOOK.md`: steps 1 to 4 and 7 of the agent prompt.
- The "MachineFanatic rule" sections at the top of `CLAUDE.md`.
- `data/guides/best-50-pint-dehumidifiers.ts`: the quality bar.

For each slug assigned to you, in order:
1. Read `scripts/clone/work/<slug>.input.json`. Do the topic check. If the topic is not a machine or power tool, or still has fewer than 4 on-topic products after searching (`node scripts/clone/search.mjs <slug> "<query>"`), append one line `<slug>: <reason>` to `scripts/clone/skip-<your-agent-letter>.txt` and move on.
2. Research: run 1 or 2 web searches per **product type**, not per guide. If several of your slugs share a type (e.g. three vacuum sealer guides), research once and reuse the findings, adapting them to each guide's angle. Topics were pre-screened as real machines, so only skip one if the products are truly off-topic.
3. Build a 5 to 6 product lineup. At least 2 products, or 40% of the lineup, must come from `candidates`. Drop accessories, parts, wrong categories and duplicate listings.
4. Write `scripts/clone/work/<slug>.spec.json` per the brief, with `relatedGuides: []`.
5. Run `node scripts/build-guide.mjs scripts/clone/work/<slug>.spec.json`.
6. Run `node scripts/audit-guides.mjs <slug>`. Fix and rebuild until it prints `ok`.

**Do NOT run** `register-dynamic-guide.mjs`, `register-new-guides.mjs` or `mark.mjs`, and do not edit `data/guides.ts`, `data/dynamic-guides-registry.ts`, `source-index.json` or any other shared file. The coordinator registers everything. Do not run `npm run build` or `git` commands.

Keep each guide at the full depth of the brief. Work through all your slugs without stopping to ask questions. Final report: one line per slug with `done` or `skipped: reason`, the number of products kept and how many came from candidates.
