// Usage: node scripts/clone/mark.mjs <done|skip|todo> <slug> [slug...]   (skip = off-topic, record why in docs/clone-log.md)
import { readFileSync, writeFileSync } from "fs";
const [status, ...slugs] = process.argv.slice(2);
const IDX = "scripts/clone/source-index.json"; const rows = JSON.parse(readFileSync(IDX, "utf-8"));
for (const s of slugs) { const r = rows.find((x) => x.slug === s); if (r) { r.status = status; console.log(s, "->", status); } else console.log("not found", s); }
writeFileSync(IDX, JSON.stringify(rows, null, 1));
