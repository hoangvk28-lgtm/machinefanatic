// Adds more Amazon search results to a work file's candidates.
// Usage: node scripts/clone/search.mjs <slug> "<search query>" ["<query 2>" ...]
import { readFileSync, writeFileSync } from "fs";
import { token, search, sleep } from "./env.mjs";
const [slug, ...queries] = process.argv.slice(2);
const f = `scripts/clone/work/${slug}.input.json`;
const d = JSON.parse(readFileSync(f, "utf-8"));
d.candidates ||= [];
const have = new Set([...d.picks, ...d.candidates].map((i) => i.asin));
const tok = await token();
for (const q of queries) {
  let n = 0;
  for (const i of await search(tok, q)) if (!have.has(i.asin)) { have.add(i.asin); d.candidates.push(i); n++; }
  console.log(`"${q}": +${n}`); await sleep(1100);
}
writeFileSync(f, JSON.stringify(d, null, 1));
