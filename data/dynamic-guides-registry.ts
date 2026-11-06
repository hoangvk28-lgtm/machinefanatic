// ─── Registry of guides served via app/(site)/guide/[slug]/page.tsx ──────────
// Every slug listed here has a rich data/guides/<slug>.ts file (the same
// shape used by the static per-slug pipeline) but does NOT get its own
// literal app/(site)/guide/<slug>/page.tsx route generated. Instead
// [slug]/page.tsx looks up the slug in dynamicGuideLoaders and renders it via
// <RichGuidePage>. This keeps new guides at full content depth (products[],
// buyingCriteria[], howWeEvaluated[], howToChoose[]) without adding a new
// compiled route per guide, which is what was driving up build time as the
// site grew past ~900 static routes.
//
// IMPORTANT: each entry MUST be a literal, statically-analyzable import()
// call (e.g. () => import("./guides/exact-slug")) — never a template-literal
// expression built from a variable. An expression-based dynamic import
// (import(`./guides/${slug}`)) forces the bundler to treat the entire
// data/guides/ directory (900+ files) as a glob of candidates, which was
// measured to exhaust the build's heap (~2GB) during `next build`'s
// TypeScript pass. Explicit per-slug entries avoid that entirely.
//
// Appended to by scripts/register-dynamic-guide.mjs — do not hand-edit,
// other than the comment above if the mechanism changes.
export const dynamicGuideLoaders: Record<string, () => Promise<Record<string, unknown>>> = {
  "best-50-pint-dehumidifiers": () => import("./guides/best-50-pint-dehumidifiers"),
  "best-blenders-for-crushing-ice": () => import("./guides/best-blenders-for-crushing-ice"),
  "best-electric-pressure-washers": () => import("./guides/best-electric-pressure-washers"),
  "best-4000-watt-generators": () => import("./guides/best-4000-watt-generators"),
  "best-cordless-chainsaws": () => import("./guides/best-cordless-chainsaws"),
};

export const dynamicGuideSlugs: string[] = Object.keys(dynamicGuideLoaders);
