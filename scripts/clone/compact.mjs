// Shrinks a work input to the minimum a writer needs, to save AI tokens.
// Writes scripts/clone/work/<slug>.compact.json: drops accessories/parts and same-title duplicates,
// strips 【】 labels, keeps max 18 items, 3 features each cut to ~120 chars, drops price text except a tier rank.
// Usage: node scripts/clone/compact.mjs <slug> [slug ...]   (or --all for every input without a spec)
import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import { isJunk } from "./junk.mjs";
const W = "scripts/clone/work";
let slugs = process.argv.slice(2);
if (slugs[0] === "--all") slugs = readdirSync(W).filter((f) => f.endsWith(".input.json")).map((f) => f.replace(".input.json", "")).filter((s) => !existsSync(`${W}/${s}.spec.json`));
const clean = (s) => (s || "").replace(/【[^】]*】?/g, " ").replace(/\[[^\]]*\]/g, " ").replace(/\s+/g, " ").trim();
const cut = (s, n) => (s.length <= n ? s : s.slice(0, s.lastIndexOf(" ", n)) + "...");
const num = (p) => parseFloat(String(p).replace(/[^\d.]/g, "")) || null;
for (const slug of slugs) {
  const d = JSON.parse(readFileSync(`${W}/${slug}.input.json`, "utf-8"));
  const seen = new Set();
  const conv = (src) => (i) => {
    const t = clean(i.title);
    const key = t.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 45);
    if (isJunk(t) || seen.has(key)) return null;
    seen.add(key);
    return { src, asin: i.asin, brand: i.brand, title: cut(t, 120), imageUrl: i.imageUrl, amazonUrl: i.amazonUrl, _p: num(i.price_internal_only),
      features: (i.features || []).map(clean).filter((f) => f.length > 20).slice(0, 3).map((f) => cut(f, 120)) };
  };
  const capFirst = +(slug.match(/-under-(\d+)$/)?.[1] || 0);
  const all = [...d.picks.map(conv("pick")), ...d.candidates.map(conv("candidate"))].filter(Boolean);
  // For "under-N" topics keep in-budget items first so the 18-item cut never drops them.
  if (capFirst) all.sort((a, b) => (b._p !== null && b._p <= capFirst) - (a._p !== null && a._p <= capFirst));
  const items = all.slice(0, 18);
  const priced = items.filter((i) => i._p).sort((a, b) => a._p - b._p);
  const cap = +(slug.match(/-under-(\d+)$/)?.[1] || 0);
  for (const i of items) { if (cap) i.underCap = i._p ? i._p <= cap : "unknown"; i.priceTier = i._p ? `${priced.indexOf(i) + 1}/${priced.length} (1 = cheapest)` : "unknown"; delete i._p; }
  const out = { guideSlug: d.guideSlug, categorySlug: d.categorySlug, mainKeyword: d.mainKeyword, items };
  writeFileSync(`${W}/${slug}.compact.json`, JSON.stringify(out));
  console.log(slug, `${items.length} items,`, JSON.stringify(out).length, "chars (was", JSON.stringify(d).length + ")");
}
