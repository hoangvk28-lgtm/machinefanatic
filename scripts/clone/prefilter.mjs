// Zero-AI-token viability check, run BEFORE handing topics to writer agents.
// For each slug it reads the spec constraint from the slug (size/voltage/tonnage/PSI/gallons or brand),
// counts input items whose title really matches it, tops up with targeted Amazon searches when short,
// and marks hopeless topics "skip" (with a reason in docs/clone-log.md) so no agent ever pays to read them.
// Usage: node scripts/clone/prefilter.mjs <slug> [...]   |   --inprogress (every inprogress topic without a spec)
import { readFileSync, writeFileSync, existsSync, appendFileSync } from "fs";
import { execFileSync } from "child_process";
import { isJunk } from "./junk.mjs";
const W = "scripts/clone/work", IDX = "scripts/clone/source-index.json";
const rows = JSON.parse(readFileSync(IDX, "utf-8"));
const DRY = process.argv.includes("--dry");
let slugs = process.argv.slice(2).filter((a) => a !== "--dry");
if (slugs[0] === "--inprogress") slugs = rows.filter((r) => r.status === "inprogress" && !existsSync(`${W}/${r.slug}.spec.json`)).map((r) => r.slug);
const MIN = 4;
const UNIT = {
  inch: (n) => new RegExp(`(?<![\\d.])\\b${n}(\\s?-?\\s?(inch|in\\b)|"|''|”)`, "i"),
  v: (n) => new RegExp(`(?<![\\d.])\\b${n}\\s?-?\\s?(v\\b|volt)`, "i"),
  ton: (n) => new RegExp(`(?<![\\d.])\\b${n}\\s?-?\\s?(ton|t\\b)`, "i"),
  psi: (n) => new RegExp(`(?<![\\d.])\\b${n.replace(/(\d)(?=(\d{3})+$)/g, "$1,?")}\\s?(max\\s)?psi`, "i"),
  gallon: (n) => new RegExp(`\\b${n}\\s?-?\\s?(gallon|gal\\b)`, "i"),
  // Amazon writes BTU with a thousands comma ("5,000 BTU"), so the comma is optional here.
  btu: (n) => new RegExp(`(?<![\\d.])\\b${n.replace(/(\d)(?=(\d{3})+$)/g, "$1,?")}\\s?-?\\s?btu`, "i"),
};
// Head noun of the machine, e.g. "log-splitters" -> /splitter/, "lawn-edgers" -> /edger/.
function nounRe(slug) {
  const w = slug.replace(/-(for|with|under|that|to)-.*$/, "").split("-").pop().replace(/(ies)$/, "y").replace(/(ches|shes|xes)$/, (m) => m.slice(0, -2)).replace(/s$/, "");
  return new RegExp(w.slice(0, Math.max(4, w.length - 1)), "i");
}
function constraint(slug, items) {
  const m = slug.match(/^best-(\d+(?:-\d)?)-?(inch|v|ton|psi|gallon|btu)\b/);
  if (m) { const n = m[1].replace("-", "\\.?"); return { label: `${m[1].replace("-", ".")} ${m[2]}`, test: (t) => UNIT[m[2]](n).test(t) }; }
  const first = slug.replace(/^best-/, "").split("-")[0];
  const brands = new Set(items.map((i) => (i.brand || "").toLowerCase().replace(/[^a-z]/g, "")));
  if ([...brands].some((b) => b && b.startsWith(first.replace(/[^a-z]/g, "")))) {
    const re = new RegExp(`\\b${first.replace(/-/g, "[- ]?")}`, "i");
    // Brands often carry an apostrophe in the listing title ("De'Longhi", "De’Longhi"): compare without it.
    const noApos = (s) => String(s || "").replace(/['‘’ʼ]/g, "");
    return { label: `brand ${first}`, test: (t, i) => re.test(noApos(t)) || re.test(noApos(i.brand)) };
  }
  return null; // generic topic (e.g. all-wheel-drive): leave the judgement to the writer
}
const count = (slug) => {
  const d = JSON.parse(readFileSync(`${W}/${slug}.input.json`, "utf-8"));
  const items = [...d.picks, ...d.candidates];
  const spec = constraint(slug, items);
  // "under-300" topics: only items whose live Amazon price is at or below the cap count.
  const cap = +(slug.match(/-under-(\d+)$/)?.[1] || 0);
  if (!spec && !cap) return { c: null, n: Infinity, kw: d.mainKeyword };
  const price = (i) => parseFloat(String(i.price_internal_only || "").replace(/[^\d.]/g, "")) || null;
  const c = {
    label: [spec?.label, cap && `price <= ${cap}`].filter(Boolean).join(" + "),
    test: (t, i) => (!spec || spec.test(t, i)) && (!cap || (price(i) !== null && price(i) <= cap)),
    cap,
  };
  const seen = new Set();
  const ok = items.filter((i) => {
    const t = i.title || ""; const key = t.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 28);
    if (isJunk(t) || seen.has(key) || !c.test(t, i) || !nounRe(slug).test(t)) return false;
    seen.add(key); return true;
  });
  return { c, n: ok.length, kw: d.mainKeyword };
};
const skipped = [];
for (const slug of slugs) {
  let r = count(slug);
  if (r.c && r.n < MIN) {
    const kw = r.kw.replace(/^best\s+/i, "").replace(/\s*under\s*\$?\d+.*$/i, "");
    const extra = r.c.cap ? [`${kw} budget`, `cheap ${kw}`, `${kw} under ${r.c.cap} dollars`] : [kw, `${kw} kit`, `${kw} cordless OR gas`];
    execFileSync("node", ["scripts/clone/search.mjs", slug, ...extra], { stdio: "ignore" });
    r = count(slug);
  }
  // Battery voltage is often missing from titles (EGO lists models by CFM), so voltage topics only get a warning.
  const soft = !!r.c && r.c.label.endsWith(" v");
  const verdict = !r.c ? "generic, writer decides" : r.n >= MIN ? "ok" : soft ? "CHECK (voltage, writer decides)" : "SKIP";
  console.log(`${verdict.padEnd(32)} ${slug}${r.c ? ` (${r.n} items match ${r.c.label})` : ""}`);
  if (verdict === "SKIP") skipped.push([slug, `prefilter: only ${r.n} distinct items match ${r.c.label} after extra searches`]);
}
if (skipped.length && !DRY) {
  for (const [s] of skipped) { const row = rows.find((x) => x.slug === s); if (row) row.status = "skip"; }
  writeFileSync(IDX, JSON.stringify(rows, null, 1));
  appendFileSync("docs/clone-log.md", `\n### Prefilter skips (${new Date().toISOString().slice(0, 10)})\n| Skipped slug | Reason |\n|---|---|\n${skipped.map(([s, r]) => `| ${s} | ${r} |`).join("\n")}\n`);
}
