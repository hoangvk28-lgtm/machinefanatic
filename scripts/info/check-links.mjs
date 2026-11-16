#!/usr/bin/env node
// Zero AI tokens. Validates every internal href in an info article against real routes.
// Usage: node scripts/info/check-links.mjs <slug> [slug...]
import { readFileSync, readdirSync, existsSync } from "node:fs";

const guides = new Set(readdirSync("data/guides").filter(f => f.endsWith(".ts")).map(f => "/guide/" + f.slice(0, -3)));
const legacy = new Set([...readFileSync("data/legacy-registry.ts", "utf8").matchAll(/"([a-z0-9-]+)":/g)].map(m => "/" + m[1]));
const cats = new Set([...readFileSync("data/categories.ts", "utf8").matchAll(/slug: "([a-z-]+)"/g)].map(m => "/categories/" + m[1]));
const statics = new Set(["/how-we-review", "/about-us", "/contact", "/affiliate-disclosure", "/privacy-policy",
  "/terms-of-use", "/compare", "/deals", "/learn", "/author/james-miller", "/guide"]);

let fail = 0;
for (const slug of process.argv.slice(2)) {
  const file = `data/legacy/${slug}.ts`;
  if (!existsSync(file)) { console.log(`FAIL ${slug}: file missing`); fail++; continue; }
  const src = readFileSync(file, "utf8");
  const hrefs = [...src.matchAll(/href="(\/[^"#]*)"/g)].map(m => m[1]);
  const imgs = [...src.matchAll(/src="(\/images\/[^"]+)"/g)].map(m => m[1]);
  const issues = [];
  for (const h of new Set(hrefs)) {
    if (h === "/" + slug) issues.push(`self link ${h}`);
    else if (!guides.has(h) && !legacy.has(h) && !cats.has(h) && !statics.has(h)) issues.push(`dead link ${h}`);
  }
  for (const i of new Set(imgs)) if (!existsSync("public" + i)) issues.push(`missing image ${i}`);
  const internal = new Set(hrefs.filter(h => h !== "/" + slug));
  if (internal.size < 4) issues.push(`only ${internal.size} internal links, need 4 to 8`);
  if (![...internal].some(h => guides.has(h))) issues.push("no link to any /guide/ best guide");
  if (/[–—]/.test(src)) issues.push("contains en or em dash");
  if (/\$\d/.test(src)) issues.push("contains a dollar figure");
  if (/we tested|hands-on|we tried|in our lab|we measured/i.test(src)) issues.push("testing claim");
  const mt = src.match(/metaTitle:\s*"((?:[^"\\]|\\.)*)"/)?.[1];
  const md = src.match(/metaDescription:\s*"((?:[^"\\]|\\.)*)"/)?.[1];
  if (!mt || mt.length > 48) issues.push(`metaTitle ${mt ? mt.length : "?"} chars, max 48`);
  if (!md || md.length < 120 || md.length > 160) issues.push(`metaDescription ${md ? md.length : "?"} chars, need 120 to 160`);
  const ids = [...src.matchAll(/<h2 id="([a-z0-9-]+)"/g)].map(m => m[1]);
  if (new Set(ids).size !== ids.length) issues.push("duplicate h2 id");
  if (!ids.includes("faq")) issues.push('missing <h2 id="faq">');
  if (!ids.includes("bottom-line")) issues.push('missing <h2 id="bottom-line">');
  const htmlField = src.match(/html: `([\s\S]*?)`,\n  products:/);
  const words = (htmlField ? htmlField[1] : src).replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
  if (words < 2500 || words > 4000) issues.push(`body ${words} words, target 2,500 to 4,000`);
  if (!legacy.has("/" + slug)) issues.push("not registered in data/legacy-registry.ts");
  if (issues.length) { fail++; console.log(`FAIL ${slug}\n  - ${issues.join("\n  - ")}`); }
  else console.log(`PASS ${slug}  (${words} words, ${internal.size} internal links)`);
}
process.exit(fail ? 1 : 0);
