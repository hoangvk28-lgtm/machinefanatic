// Picks the next N "todo" topics from source-index.json (optionally one category),
// fetches live Amazon data for their ASINs (tops up by search if < 5 usable items),
// writes scripts/clone/work/<slug>.input.json and marks rows "inprogress".
// Usage: node scripts/clone/next-batch.mjs 20 [category]
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { token, getItems, search, sleep } from "./env.mjs";
const [n = "20", cat] = process.argv.slice(2);
const IDX = "scripts/clone/source-index.json";
const rows = JSON.parse(readFileSync(IDX, "utf-8"));
const pick = rows.filter((r) => r.status === "todo" && (!cat || r.category === cat)).slice(0, +n);
mkdirSync("scripts/clone/work", { recursive: true });
const tok = await token();
for (const r of pick) {
  let items = await getItems(tok, r.asins); await sleep(1100);
  if (items.length < 5) { const have = new Set(items.map((i) => i.asin)); for (const i of await search(tok, r.mainKeyword)) if (!have.has(i.asin) && items.length < 8) items.push(i); await sleep(1100); }
  writeFileSync(`scripts/clone/work/${r.slug}.input.json`, JSON.stringify({ guideSlug: r.slug, categorySlug: r.category, mainKeyword: r.mainKeyword, sourceTitle: r.title, picks: items }, null, 1));
  r.status = "inprogress"; console.log(r.slug, items.length, "items");
}
writeFileSync(IDX, JSON.stringify(rows, null, 1));
