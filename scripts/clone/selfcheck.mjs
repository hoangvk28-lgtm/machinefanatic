// Fast pre-build check of a spec JSON so writers fix everything in one pass.
// Usage: node scripts/clone/selfcheck.mjs <slug>
import { readFileSync } from "fs";
const slug = process.argv[2];
const s = JSON.parse(readFileSync(`scripts/clone/work/${slug}.spec.json`, "utf-8"));
const raw = JSON.stringify(s);
const errs = [];
const words = [];
(function walk(x) { if (typeof x === "string") { if (!/^https?:/.test(x)) words.push(...x.split(/\s+/).filter(Boolean)); } else if (x && typeof x === "object") Object.values(x).forEach(walk); })(s);
const sentences = (t) => (t.replace(/\d\.\d/g, "0").match(/[.!?](\s|$)/g) || []).length;
if (/[—–]/.test(raw)) errs.push("em/en dash");
const cap = slug.match(/-under-(\d+)$/)?.[1];
const capFree = cap ? raw.split(`$${cap}`).join("").split(`$${Number(cap).toLocaleString("en-US")}`).join("") : raw;
if (/\$\d/.test(capFree)) errs.push("dollar price (only the slug's cap is allowed)");
if (/we tested|hands-on|we tried|in our lab|we measured|tested/i.test(raw)) errs.push("testing claim");
if (/【|\[\s*[A-Z]/.test(raw.replace(/"\[|\]"/g, ""))) errs.push("bracket text");
if (/\b\d(\.\d)?\s*(out of 5\s*)?stars?\b|\breviews? on amazon|\d[\d,]* (ratings|reviews)\b/i.test(raw)) errs.push("rating/review count");
if ((s.metaTitle || "").length > 48) errs.push(`metaTitle ${s.metaTitle.length} > 48`);
const md = (s.metaDescription || "").length; if (md < 120 || md > 160) errs.push(`metaDescription ${md} not 120-160`);
if (!/\(2026\)$/.test(s.guideTitle || "")) errs.push("guideTitle must end (2026)");
if ((s.introParagraphs || []).length !== 2) errs.push("introParagraphs must be exactly 2");
const intro = (s.introParagraphs || []).join(" ");
for (const p of s.products || []) {
  const b = p.name.split(/\s+/)[0].replace(/[^A-Za-z]/g, "");
  if (b.length > 2 && new RegExp(`\\b${b}\\b`, "i").test(intro)) errs.push(`intro names brand ${b}`);
  const paras = (p.description || "").split("\n\n");
  if (paras.length !== 3) errs.push(`${p.id}: description needs 3 paragraphs`);
  const n = sentences(p.description || ""); if (n < 7 || n > 9) errs.push(`${p.id}: ${n} sentences (want 7-8)`);
  if ((p.pros || []).length !== 4) errs.push(`${p.id}: needs 4 pros`);
  if ((p.cons || []).length < 2) errs.push(`${p.id}: needs 2-3 cons`);
  for (const c of p.specs || []) if (c.length > 24) errs.push(`${p.id}: chip "${c}" > 24 chars`);
}
const np = (s.products || []).length; if (np < 4 || np > 7) errs.push(`${np} products (want 5-7)`);
for (const [k, n] of [["buyingCriteria", 6], ["specDecoder", 5], ["howWeEvaluated", 5], ["howToChoose", 6], ["faq", 6]]) if ((s[k] || []).length !== n) errs.push(`${k} needs ${n} entries`);
const wc = words.length; if (wc < 2800 || wc > 3300) errs.push(`word count ${wc} (want 2,900 to 3,100)`);
console.log(errs.length ? `FIX ${slug} (${wc} words)\n  - ${errs.join("\n  - ")}` : `ok  ${slug} (${wc} words)`);
process.exit(errs.length ? 1 : 0);
