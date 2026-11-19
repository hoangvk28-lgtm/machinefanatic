#!/usr/bin/env node
// Zero AI tokens. Resolves each info topic's hub patterns to real best-guide slugs.
// Usage: node scripts/info/topics.mjs [round]
import { readFileSync, readdirSync } from "node:fs";

const guides = readdirSync("data/guides").filter(f => f.endsWith(".ts")).map(f => f.slice(0, -3));
const rows = readFileSync("docs/info-topics.tsv", "utf8").trim().split("\n").slice(1)
  .map(l => l.split("\t")).map(([slug, kw, round, cluster, pats]) => ({ slug, kw, round, cluster, pats: pats.trim().split("|") }));

const want = process.argv[2];
let bad = 0;
for (const r of rows) {
  if (want && r.round !== want) continue;
  const hubs = [...new Set(r.pats.flatMap(p => guides.filter(g => g.includes(p))))]
    .sort((a, b) => a.length - b.length || a.localeCompare(b)).slice(0, 4);
  if (hubs.length < 2) { bad++; console.log(`FAIL  ${r.slug}  patterns [${r.pats.join(", ")}] matched ${hubs.length} guides`); continue; }
  console.log(`r${r.round}\t${r.cluster}\t${r.slug}\t${r.kw}\t${hubs.map(h => "/guide/" + h).join(" ")}`);
}
console.log(`\n${rows.filter(r => !want || r.round === want).length} topics, ${bad} failing`);
process.exit(bad ? 1 : 0);
