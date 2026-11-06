// Picks the next N "todo" topics from source-index.json (optionally one category),
// fetches live Amazon data for the source ASINs (picks) plus fresh keyword-search results (candidates),
// writes scripts/clone/work/<slug>.input.json and marks rows "inprogress".
// Usage: node scripts/clone/next-batch.mjs 20 [category]   (SLUGS_FILE=list.txt to restrict to a curated slug list)
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { token, getItems, search, sleep } from "./env.mjs";
const [n = "20", cat] = process.argv.slice(2);
const IDX = "scripts/clone/source-index.json";
const rows = JSON.parse(readFileSync(IDX, "utf-8"));
const list = process.env.SLUGS_FILE ? new Set(readFileSync(process.env.SLUGS_FILE, "utf-8").split(/\s+/).filter(Boolean)) : null;
const pick = rows.filter((r) => r.status === "todo" && (!cat || r.category === cat) && (!list || list.has(r.slug))).slice(0, +n);
mkdirSync("scripts/clone/work", { recursive: true });
const tok = await token();
for (const r of pick) {
  // Source-guide products (may be discontinued or too few).
  const items = await getItems(tok, r.asins); await sleep(1100);
  // Always pull fresh candidates by keyword so the lineup is not a copy of the source guide.
  const have = new Set(items.map((i) => i.asin));
  const candidates = [];
  for (const q of [r.mainKeyword, `best ${r.mainKeyword}`]) {
    for (const i of await search(tok, q)) if (!have.has(i.asin)) { have.add(i.asin); candidates.push(i); }
    await sleep(1100);
  }
  writeFileSync(`scripts/clone/work/${r.slug}.input.json`, JSON.stringify({ guideSlug: r.slug, categorySlug: r.category, mainKeyword: r.mainKeyword, sourceTitle: r.title, picks: items, candidates }, null, 1));
  r.status = "inprogress"; console.log(r.slug, items.length, "source items,", candidates.length, "fresh candidates");
}
writeFileSync(IDX, JSON.stringify(rows, null, 1));
