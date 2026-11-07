// One command after a writer saves its spec: fill product data, selfcheck, build, audit.
// Usage: node scripts/clone/finish.mjs <slug>
// Writers only need each product's "id" (ASIN); amazonUrl, imageUrl, rank, price and heroImage are
// filled from scripts/clone/work/<slug>.compact.json (or .input.json). Prints one short result block.
import { readFileSync, writeFileSync, existsSync } from "fs";
import { execFileSync } from "child_process";
const slug = process.argv[2];
if (!slug) { console.error("Usage: node scripts/clone/finish.mjs <slug>"); process.exit(1); }
const W = "scripts/clone/work", specPath = `${W}/${slug}.spec.json`;
const spec = JSON.parse(readFileSync(specPath, "utf-8"));
const pool = new Map();
for (const f of [`${W}/${slug}.input.json`, `${W}/${slug}.compact.json`]) {
  if (!existsSync(f)) continue;
  const d = JSON.parse(readFileSync(f, "utf-8"));
  for (const i of [...(d.picks || []), ...(d.candidates || []), ...(d.items || [])]) if (i.asin) pool.set(i.asin, { ...pool.get(i.asin), ...i });
}
const missing = [];
(spec.products || []).forEach((p, idx) => {
  const src = pool.get(p.id);
  if (!src) { missing.push(p.id); return; }
  p.rank = idx + 1;
  p.amazonUrl ||= src.amazonUrl;
  p.imageUrl ||= src.imageUrl;
  p.price = "";
});
if (spec.products?.[0]?.imageUrl) spec.heroImage = spec.products[0].imageUrl;
spec.guideSlug ||= slug;
spec.relatedGuides ||= [];
writeFileSync(specPath, JSON.stringify(spec, null, 1));
if (missing.length) { console.log(`FIX ${slug}\n  - product id not in input data: ${missing.join(", ")}`); process.exit(1); }
const run = (args) => { try { return { ok: true, out: execFileSync("node", args, { encoding: "utf-8" }) }; } catch (e) { return { ok: false, out: `${e.stdout || ""}${e.stderr || ""}` }; } };
const sc = run(["scripts/clone/selfcheck.mjs", slug]);
if (!sc.ok) { console.log(sc.out.trim()); process.exit(1); }
const b = run(["scripts/build-guide.mjs", specPath]);
if (!b.ok) { console.log(`FIX ${slug}: build failed\n${b.out.trim().split("\n").slice(-5).join("\n")}`); process.exit(1); }
const a = run(["scripts/audit-guides.mjs", slug]);
console.log(a.ok ? `${sc.out.trim()}  | built | audit ok` : a.out.trim());
process.exit(a.ok ? 0 : 1);
