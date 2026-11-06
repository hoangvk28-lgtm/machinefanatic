// Content audit for data/guides/*.ts. Usage: node scripts/audit-guides.mjs [slug ...]
// Fails on: product brands/model numbers or spec numbers in introParagraphs, dashes,
// dollar prices, "tested"-type claims, bracket ad copy, metaTitle/metaDescription length.
import { readFileSync, readdirSync } from "fs";
const dir = new URL("../data/guides/", import.meta.url);
const slugs = process.argv.slice(2).length ? process.argv.slice(2) : readdirSync(dir).map((f) => f.replace(/\.ts$/, ""));
let bad = 0;
// First words of product names that are ordinary category words, not brands.
const GENERIC = new Set(["snow", "mini", "smart", "electric", "cordless", "portable", "compact", "commercial", "professional", "heavy", "gas", "battery", "dual", "wet", "dry", "air", "ice", "rice", "coffee", "espresso", "food", "stand", "hand", "robot", "steam", "solar", "power", "inverter", "garden", "wood", "log", "leaf", "pressure", "space", "tower", "upright", "handheld", "countertop", "digital", "automatic", "manual", "the"]);
for (const slug of slugs) {
  const src = readFileSync(new URL(`${slug}.ts`, dir), "utf8");
  const errs = [];
  const get = (name) => { const m = src.match(new RegExp(`export const ${name} = "((?:[^"\\\\]|\\\\.)*)"`)); return m ? JSON.parse(`"${m[1]}"`) : ""; };
  const introM = src.match(/export const introParagraphs = (\[[\s\S]*?\n\]);/);
  const intro = introM ? JSON.parse(introM[1]).join(" ") : "";
  const brands = new Set([...src.matchAll(/name: "([^"]+)"/g)].map((m) => m[1].split(/\s+/)[0].replace(/[^A-Za-z]/g, "")).filter((b) => b.length > 2 && !GENERIC.has(b.toLowerCase())));
  for (const b of brands) if (new RegExp(`\\b${b}\\b`, "i").test(intro)) errs.push(`intro names product brand "${b}"`);
  if (/\b[A-Z]{1,4}-?\d{2,}[A-Z]*\b/.test(intro)) errs.push("intro contains a model number");
  const nums = intro.match(/\b\d[\d,.]*\s*(?:psi|gpm|watts?|w|pints?|oz|inch|in|v|ah|amp|db|dba|cc|rpm|lb)\b/gi) || [];
  if (nums.length > 1) errs.push(`intro has spec numbers: ${nums.slice(0, 4).join(", ")}`);
  if (/[—–]/.test(src)) errs.push("em/en dash");
  if (/\$\d/.test(src)) errs.push("dollar price");
  if (/we tested|hands-on|we tried|in our lab|we measured/i.test(src)) errs.push("testing claim");
  if (/【/.test(src)) errs.push("bracket ad copy");
  const mt = get("metaTitle"), md = get("metaDescription"), gt = get("guideTitle");
  if (mt.length > 48) errs.push(`metaTitle ${mt.length} > 48`);
  if (md.length < 120 || md.length > 160) errs.push(`metaDescription ${md.length} not 120-160`);
  if (!/\(2026\)$/.test(gt)) errs.push("guideTitle missing (2026)");
  if (errs.length) { bad++; console.log(`FAIL ${slug}\n  - ${errs.join("\n  - ")}`); } else console.log(`ok   ${slug}`);
}
process.exit(bad ? 1 : 0);
