#!/usr/bin/env node
// Intake step for ChatGPT-delivered articles. Reads an image manifest and writes real webp files.
// Manifest: one line per image, tab or pipe separated:
//   filename.webp <TAB> directImageUrl <TAB> sourcePageUrl <TAB> author <TAB> license <TAB> via
// Usage: node scripts/info/fetch-images.mjs <manifest.tsv> [--out <dir>]
//   default out dir: public/images/articles   (guide section photos: --out public/images/guide-sections)
// Prints the imageCredits[] array to paste into the article, and reports real pixel dimensions.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import sharp from "sharp";

const args = process.argv.slice(2);
const file = args.find(a => !a.startsWith("--"));
const oi = args.indexOf("--out");
const outDir = oi >= 0 ? args[oi + 1] : "public/images/articles";
if (!file) { console.error("usage: node scripts/info/fetch-images.mjs <manifest.tsv> [--out <dir>]"); process.exit(1); }
mkdirSync(outDir, { recursive: true });

const rows = readFileSync(file, "utf8").trim().split("\n")
  .map(l => l.replace(/^\s*\|/, "").replace(/\|\s*$/, "").split(/\t|\s*\|\s*/).map(s => s.trim()))
  .filter(c => c.length >= 2 && c[0].endsWith(".webp") && (/^https?:/.test(c[1]) || /^https?:/.test(c[2] || "")));

const credits = [];
let fail = 0;
function resolve(url, source) {
  // A Commons File: page is far more reliable than a guessed upload.wikimedia hash path,
  // so accept either and let Special:FilePath redirect to the real file.
  for (const u of [url, source]) {
    const m = u && u.match(/commons\.wikimedia\.org\/wiki\/(?:File|Special:FilePath)[:/](.+)$/);
    if (m) return "https://commons.wikimedia.org/wiki/Special:FilePath/" + m[1].split("?")[0];
  }
  return url;
}

for (const [name, rawUrl, source, author, license, via] of rows) {
  const url = resolve(rawUrl, source);
  const out = `${outDir}/${name}`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "info-guide-image-fetch/1.0" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const img = sharp(buf).rotate().resize({ width: 1400, withoutEnlargement: true });
    await img.webp({ quality: 80 }).toFile(out);
    const { width, height } = await sharp(out).metadata();
    console.log(`OK    ${name}  ${width}x${height}   width="${width}" height="${height}"`);
    if (author) credits.push({ image: name, author, license: license || "", source: source || url, ...(via ? { via } : {}) });
  } catch (e) {
    fail++;
    console.log(`FAIL  ${name}  ${e.message}  ${url}`);
  }
}
if (credits.length) {
  console.log("\nimageCredits: [");
  for (const c of credits) console.log("  " + JSON.stringify(c) + ",");
  console.log("],");
}
console.log(`\n${rows.length} images, ${fail} failed`);
process.exit(fail ? 1 : 0);
