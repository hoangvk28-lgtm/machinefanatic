// Registers guide data files into the legacy static array (data/guides.ts)
// so they appear in the sitemap and /guide index.
// Usage: node scripts/register-new-guides.mjs <slug1> <slug2> ...
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const slugs = process.argv.slice(2);

if (slugs.length === 0) {
  console.error("Usage: node scripts/register-new-guides.mjs <slug1> <slug2> ...");
  process.exit(1);
}

async function main() {
  const entries = [];
  for (const slug of slugs) {
    const fileUrl = pathToFileURL(resolve(ROOT, `data/guides/${slug}.ts`)).href;
    const mod = await import(fileUrl);
    const kw = mod.mainKeyword || slug.replace(/^best-/, "").replace(/-/g, " ");
    const subKeywords = [kw, `${kw} guide`, `best ${kw}`];
    const entry = `  {
    title: ${JSON.stringify(mod.guideTitle)},
    slug: ${JSON.stringify(mod.guideSlug)},
    categorySlug: ${JSON.stringify(mod.categorySlug || "")},
    subcategorySlug: "",
    description: ${JSON.stringify(mod.metaDescription)},
    mainKeyword: ${JSON.stringify(kw)},
    subKeywords: ${JSON.stringify(subKeywords)},
    heroImage: ${JSON.stringify(mod.heroImage)},
    lastUpdated: ${JSON.stringify(mod.lastUpdated)},
    author: "James Miller",
    readTime: ${JSON.stringify(mod.readTime)},
    recommendedProductIds: [],
    sections: [],
    faq: [],
    relatedGuideSlugs: ${JSON.stringify((mod.relatedGuides || []).map((r) => r.href.replace("/guide/", "")))},
    buyingCriteria: [],
  },`;
    entries.push(entry);
  }

  const guidesPath = resolve(ROOT, "data/guides.ts");
  const content = readFileSync(guidesPath, "utf-8");
  const marker = "\n];";
  const lastIdx = content.lastIndexOf(marker);
  if (lastIdx === -1) throw new Error("Could not find closing marker in guides.ts");
  const newContent = content.slice(0, lastIdx) + "\n" + entries.join("\n") + content.slice(lastIdx);
  writeFileSync(guidesPath, newContent, "utf-8");
  console.log(`Registered ${entries.length} guides into data/guides.ts`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
