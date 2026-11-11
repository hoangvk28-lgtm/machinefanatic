// Adds new "todo" topics to source-index.json from a plain text file and writes a round slug list.
// Topic file format, one per line: <slug-without-best->|<Title Without Best/Year>|<category>
//   e.g.  pellet-grills|Pellet Grills|kitchen-machines
// Lines starting with # are ignored. Skips slugs already in source-index.json or data/guides/.
// Usage: node scripts/clone/add-topics.mjs <topics.txt> <round-list-out.txt>
import { readFileSync, writeFileSync, existsSync } from "fs";
const [inFile, outFile] = process.argv.slice(2);
if (!inFile || !outFile) { console.error("usage: add-topics.mjs <topics.txt> <round-list-out.txt>"); process.exit(1); }
const IDX = "scripts/clone/source-index.json";
const rows = JSON.parse(readFileSync(IDX, "utf-8"));
const have = new Map(rows.map((r) => [r.slug, r]));
const list = [];
for (const line of readFileSync(inFile, "utf-8").split(/\r?\n/)) {
  if (!line.trim() || line.startsWith("#")) continue;
  const [key, title, category] = line.split("|").map((s) => s.trim());
  const slug = "best-" + key;
  if (existsSync(`data/guides/${slug}.ts`)) { console.log("exists (guide)", slug); continue; }
  const old = have.get(slug);
  if (old) { console.log(`in index (${old.status})`, slug); if (old.status === "todo") list.push(slug); continue; }
  rows.push({ slug, title: `Best ${title} (2026)`, mainKeyword: title.toLowerCase().replace("$", ""), category, source: "popmech-gap", asins: [], status: "todo" });
  list.push(slug);
}
writeFileSync(IDX, JSON.stringify(rows, null, 1));
writeFileSync(outFile, list.join("\n"));
console.log(list.length, "slugs ->", outFile);
