#!/usr/bin/env node
// Turns a ChatGPT-delivered .html file (meta block + body) into data/legacy/<slug>.ts.
// Usage: node scripts/info/build-article.mjs <file.html> [images.tsv]
// The writer never touches TypeScript, so backticks, ${, quotes and the type import
// cannot be broken by hand.
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const [src, manifest] = process.argv.slice(2);
if (!src) { console.error("usage: node scripts/info/build-article.mjs <file.html> [images.tsv]"); process.exit(1); }
const raw = readFileSync(src, "utf8");

const m = raw.match(/<!--\s*meta([\s\S]*?)-->/);
if (!m) { console.error("no <!--meta ... --> block found at the top of the file"); process.exit(1); }
const meta = {};
for (const line of m[1].split("\n")) {
  const k = line.match(/^\s*([a-zA-Z]+)\s*:\s*(.*)$/);
  if (k) meta[k[1]] = k[2].trim();
}
const body = raw.slice(m.index + m[0].length).trim();

const need = ["slug", "title", "metaTitle", "metaDescription", "kicker", "readTime", "hero", "quickAnswer"];
const missing = need.filter(k => !meta[k]);
if (missing.length) { console.error("meta block is missing: " + missing.join(", ")); process.exit(1); }

const [heroFile, ...heroAlt] = meta.hero.split("|").map(s => s.trim());
const related = (meta.related || "").split(";").map(s => s.trim()).filter(Boolean).map(pair => {
  const [title, href] = pair.split("|").map(x => x.trim());
  return { title, href };
});

let credits = [];
if (manifest && existsSync(manifest)) {
  credits = readFileSync(manifest, "utf8").trim().split("\n")
    .map(l => l.replace(/^\s*\|/, "").replace(/\|\s*$/, "").split(/\t|\s*\|\s*/).map(s => s.trim()))
    .filter(c => c[0] && c[0].endsWith(".webp") && c[3])
    .map(([image, , source, author, license, via]) => ({ image, author, license: license || "", source, ...(via ? { via } : {}) }));
}

const esc = s => s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
const j = v => JSON.stringify(v);

const out = `import type { LegacyArticleModule } from "@/components/guide/LegacyArticlePage";

const article: LegacyArticleModule = {
  slug: ${j(meta.slug)},
  title: ${j(meta.title)},
  metaTitle: ${j(meta.metaTitle)},
  metaDescription: ${j(meta.metaDescription)},
  kicker: ${j(meta.kicker)},
  heroImage: { src: ${j("/images/articles/" + heroFile)}, alt: ${j(heroAlt.join("|").trim())} },
  lastUpdated: ${j(meta.lastUpdated || new Date().toISOString().slice(0, 10))},
  readTime: ${j(meta.readTime)},
  quickAnswer: ${j(meta.quickAnswer)},
  html: \`${esc(body)}\`,
  products: [],
  imageCredits: ${credits.length ? "[\n" + credits.map(c => "    " + j(c) + ",").join("\n") + "\n  ]" : "[]"},
  relatedLinks: ${related.length ? "[\n" + related.map(r => "    " + j(r) + ",").join("\n") + "\n  ]" : "[]"},
};

export default article;
`;

const dest = `data/legacy/${meta.slug}.ts`;
writeFileSync(dest, out);
const words = body.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
console.log(`wrote ${dest}`);
console.log(`  body ${words} words | metaTitle ${meta.metaTitle.length} chars | metaDescription ${meta.metaDescription.length} chars`);
console.log(`  ${credits.length} image credits | ${related.length} related links`);
console.log(`\nnext: add to data/legacy-registry.ts  ->  ${j(meta.slug)}: () => import("./legacy/${meta.slug}"),`);
