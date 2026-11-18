// Zero-AI-token near-duplicate check: candidate slugs vs the slugs already published in data/guides.ts.
// MANDATORY before Stage A of every round and before any add-topics.mjs call (CLAUDE.md rule, 2026-11-14).
// Usage: node scripts/clone/neardup.mjs <list.txt> [...]      (one slug per line; also accepts bare slugs)
import { readFileSync, existsSync } from "fs";

// Digit+unit forms must be split so "50a" and "50-amp" collide (round 44 shipped
// best-50a-generator-transfer-switch as a duplicate of best-50-amp-... because they did not).
const UNIT = { a: "amp", amp: "amp", kw: "kw", w: "watt", watt: "watt", v: "volt", volt: "volt", qt: "quart", quart: "quart", gal: "gallon", gallon: "gallon", in: "inch", inch: "inch", mm: "mm", cfm: "cfm", psi: "psi", btu: "btu", ton: "ton" };
const STOP = new Set(["for", "with", "and", "the", "a", "of", "in", "to", "your"]);

export function norm(slug) {
  return slug
    .replace(/^best-/, "")
    .replace(/([0-9]+(?:\.[0-9]+)?)\s*-?\s*([a-z]+)\b/g, (m, n, u) => (UNIT[u] ? `${n}-${UNIT[u]}` : m))
    .split("-")
    .map((w) => w.replace(/(es|s)$/, ""))
    .filter((w) => w && !STOP.has(w))
    .sort()
    .join(" ");
}

const published = [...new Set((readFileSync("data/guides.ts", "utf-8").match(/"best-[a-z0-9-]+"/g) || []).map((s) => s.slice(1, -1)))];
const byKey = {};
for (const s of published) byKey[norm(s)] = s;

const slugs = process.argv.slice(2).flatMap((a) => (existsSync(a) ? readFileSync(a, "utf-8").split(/\r?\n/) : [a])).map((s) => s.trim()).filter(Boolean);
let dups = 0;
for (const s of slugs) {
  const hit = byKey[norm(s)];
  if (hit && hit !== s) { console.log(`DUP ${s} = ${hit}`); dups++; }
}
console.error(`checked ${slugs.length} slugs against ${published.length} published, ${dups} near-duplicates`);
process.exit(dups ? 1 : 0);
