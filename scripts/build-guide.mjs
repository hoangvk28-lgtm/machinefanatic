// Assembles a full data/guides/<slug>.ts file from a JSON spec.
// Usage: node scripts/build-guide.mjs <spec.json>
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const specPath = process.argv[2];
const spec = JSON.parse(readFileSync(specPath, "utf-8"));

function esc(s) {
  return String(s ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n");
}

function serializeProduct(p) {
  const fields = [
    `id: "${esc(p.id)}"`,
    `rank: ${p.rank}`,
    `badge: "${esc(p.badge)}"`,
    `name: "${esc(p.name)}"`,
    `amazonUrl: "${esc(p.amazonUrl)}"`,
    `imageUrl: "${esc(p.imageUrl)}"`,
    `price: "${esc(p.price)}"`,
    `ctaLabel: "Check price on Amazon"`,
    `shortCtaLabel: "Check price"`,
    `specs: [${p.specs.map((s) => `"${esc(s)}"`).join(", ")}]`,
    `specList: ${JSON.stringify(p.specList || [])}`,
    `description: "${esc(p.description)}"`,
    `bestFor: "${esc(p.bestFor)}"`,
    `pros: [${p.pros.map((s) => `"${esc(s)}"`).join(", ")}]`,
    `cons: [${p.cons.map((s) => `"${esc(s)}"`).join(", ")}]`,
  ];
  return `  { ${fields.join(", ")} }`;
}

const lines = [];
lines.push(`export const guideSlug = "${esc(spec.guideSlug)}";`);
lines.push(`export const guideTitle = "${esc(spec.guideTitle)}";`);
lines.push(`export const metaTitle = "${esc(spec.metaTitle)}";`);
lines.push(`export const metaDescription = "${esc(spec.metaDescription)}";`);
lines.push(`export const mainKeyword = "${esc(spec.mainKeyword)}";`);
lines.push(`export const categorySlug = "${esc(spec.categorySlug)}";`);
lines.push(`export const lastUpdated = "${esc(spec.lastUpdated)}";`);
lines.push(`export const readTime = "${esc(spec.readTime)}";`);
lines.push(`export const heroImage = "${esc(spec.heroImage)}";`);
lines.push(`export const introParagraphs = [\n${spec.introParagraphs.map((p) => `  "${esc(p)}"`).join(",\n")}\n];`);
lines.push(`export interface GuideProduct { id: string; rank: number; badge: string; name: string; amazonUrl: string; imageUrl: string; price: string; ctaLabel?: string; shortCtaLabel?: string; specs: string[]; specList?: { label: string; value: string }[]; description: string; bestFor: string; pros: string[]; cons: string[]; }`);
lines.push(`export const products: GuideProduct[] = [\n${spec.products.map(serializeProduct).join(",\n")}\n];`);
lines.push(`export const buyingCriteria = ${JSON.stringify(spec.buyingCriteria)};`);
lines.push(`export const howWeEvaluated = ${JSON.stringify(spec.howWeEvaluated)};`);
lines.push(`export interface HowToChooseSection { subheading: string; intro?: string; table?: { headers: string[]; rows: string[][] }; cards?: { label: string; text: string }[]; note?: string; }`);
lines.push(`export const howToChoose: HowToChooseSection[] = ${JSON.stringify(spec.howToChoose)};`);
lines.push(`export const expertTake = "${esc(spec.expertTake || "")}";`);
lines.push(`export const specDecoder: { spec: string; meaning: string; watchFor: string }[] = ${JSON.stringify(spec.specDecoder || [])};`);
lines.push(`export const maintenance: { task: string; interval: string; why: string }[] = ${JSON.stringify(spec.maintenance || [])};`);
lines.push(`export const faq = ${JSON.stringify(spec.faq)};`);
lines.push(`export const relatedGuides: { title: string; href: string }[] = [\n${spec.relatedGuides.map((r) => `  { title: "${esc(r.title)}", href: "${esc(r.href)}" }`).join(",\n")}\n];`);

const outPath = resolve(process.cwd(), `data/guides/${spec.guideSlug}.ts`);
writeFileSync(outPath, lines.join("\n") + "\n");
console.log(`Wrote ${outPath}`);
