#!/usr/bin/env node
// Zero AI tokens. Coordinator step: append an info article to the relatedGuides of each
// best guide its topic row maps to, so money pages link down into the explainer.
// Usage: node scripts/info/link-back.mjs <info-slug> [--dry]
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";

const slug = process.argv[2];
const dry = process.argv.includes("--dry");
if (!slug) { console.error("usage: node scripts/info/link-back.mjs <info-slug> [--dry]"); process.exit(1); }

const guides = readdirSync("data/guides").filter(f => f.endsWith(".ts")).map(f => f.slice(0, -3));
const row = readFileSync("docs/info-topics.tsv", "utf8").trim().split("\n").slice(1)
  .map(l => l.split("\t")).find(c => c[0] === slug);
if (!row) { console.error(`${slug} is not in docs/info-topics.tsv`); process.exit(1); }

const file = `data/legacy/${slug}.ts`;
if (!existsSync(file)) { console.error(`${file} does not exist yet`); process.exit(1); }
const title = readFileSync(file, "utf8").match(/\btitle:\s*"((?:[^"\\]|\\.)*)"/)?.[1];
if (!title) { console.error(`no title found in ${file}`); process.exit(1); }

const hubs = [...new Set(row[4].split("|").flatMap(p => guides.filter(g => g.includes(p))))]
  .sort((a, b) => a.length - b.length || a.localeCompare(b)).slice(0, 4);

for (const hub of hubs) {
  const path = `data/guides/${hub}.ts`;
  let src = readFileSync(path, "utf8");
  if (src.includes(`"/${slug}"`)) { console.log(`skip  ${hub} (already linked)`); continue; }
  const m = src.match(/export const relatedGuides: \{ title: string; href: string \}\[\] = \[/);
  if (!m) { console.log(`skip  ${hub} (no relatedGuides export)`); continue; }
  const at = m.index + m[0].length;
  src = src.slice(0, at) + `\n  { title: ${JSON.stringify(title)}, href: ${JSON.stringify("/" + slug)} },` + src.slice(at);
  if (!dry) writeFileSync(path, src);
  console.log(`${dry ? "would link" : "linked"}  ${hub} -> /${slug}`);
}
