// Registers a slug into data/dynamic-guides-registry.ts as an explicit,
// statically-analyzable dynamic import() loader, instead of generating a
// literal app/(site)/guide/<slug>/page.tsx route. The slug's rich content
// still lives at data/guides/<slug>.ts (built the normal way via
// scripts/build-guide.mjs) — this script just makes app/(site)/guide/[slug]/
// page.tsx aware it should render that file dynamically.
//
// IMPORTANT: entries must stay literal `() => import("./guides/exact-slug")`
// calls, never a template-literal expression built from a variable — an
// expression-based dynamic import forces the bundler to treat the entire
// data/guides/ directory (900+ files) as a glob of candidates, which was
// measured to exhaust the build's heap during `next build`'s TypeScript pass.
//
// Usage: node scripts/register-dynamic-guide.mjs <slug1> <slug2> ...
//
// Full new-guide workflow (as of 2026-08-19):
//   1. node scripts/build-guide.mjs <spec.json>          → writes data/guides/<slug>.ts
//   2. node scripts/register-dynamic-guide.mjs <slug>     → adds to dynamic-guides-registry.ts
//   3. node scripts/register-new-guides.mjs <slug>        → adds to data/guides.ts (sitemap/index)
// Do NOT run scripts/generate-guide-page.mjs for new guides — that creates a
// literal route dir, which is exactly what this pipeline avoids.

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const slugs = process.argv.slice(2);

if (slugs.length === 0) {
  console.error("Usage: node scripts/register-dynamic-guide.mjs <slug1> <slug2> ...");
  process.exit(1);
}

const registryPath = resolve(ROOT, "data/dynamic-guides-registry.ts");
let content = readFileSync(registryPath, "utf-8");

const objMatch = content.match(
  /export const dynamicGuideLoaders: Record<string, \(\) => Promise<Record<string, unknown>>> = \{([\s\S]*?)\n\};/
);
if (!objMatch) {
  console.error("Could not find dynamicGuideLoaders object in data/dynamic-guides-registry.ts");
  process.exit(1);
}

// Parse existing entries: `  "slug": () => import("./guides/slug"),`
const entryRe = /"([^"]+)":\s*\(\)\s*=>\s*import\("\.\/guides\/([^"]+)"\)/g;
const existing = new Map();
let m;
while ((m = entryRe.exec(objMatch[1]))) {
  existing.set(m[1], m[2]);
}

let added = 0;
for (const slug of slugs) {
  const dataPath = resolve(ROOT, "data", "guides", `${slug}.ts`);
  if (!existsSync(dataPath)) {
    console.error(`✗ ${slug}: data/guides/${slug}.ts not found — run build-guide.mjs first, skipping`);
    continue;
  }
  const routeDir = resolve(ROOT, "app", "(site)", "guide", slug);
  if (existsSync(routeDir)) {
    console.error(`✗ ${slug}: a literal route dir already exists at app/(site)/guide/${slug}/ — remove it before registering dynamically, skipping`);
    continue;
  }
  if (existing.has(slug)) {
    console.log(`  ${slug}: already registered`);
    continue;
  }
  existing.set(slug, slug);
  added++;
  console.log(`✓ ${slug}: registered`);
}

const entries = [...existing.entries()]
  .map(([slug, file]) => `  "${slug}": () => import("./guides/${file}"),`)
  .join("\n");
const newObjBody = entries ? `\n${entries}\n` : "\n";

const newContent = content.replace(
  /export const dynamicGuideLoaders: Record<string, \(\) => Promise<Record<string, unknown>>> = \{[\s\S]*?\n\};/,
  `export const dynamicGuideLoaders: Record<string, () => Promise<Record<string, unknown>>> = {${newObjBody}};`
);
writeFileSync(registryPath, newContent, "utf-8");
console.log(`\nRegistered ${added} new slug(s). Total in registry: ${existing.size}`);
