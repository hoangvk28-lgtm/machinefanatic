import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { AffiliateDisclosureBar } from "@/components/affiliate/AffiliateDisclosureBar";
import { ComparePageClient } from "@/components/compare/ComparePageClient";
import { buildMetadata } from "@/lib/seo";
import { categories } from "@/data/categories";
import { getPublicProducts } from "@/lib/public-products";

export const revalidate = 604800;

export const metadata: Metadata = buildMetadata({
  title: "Compare Products Side-by-Side",
  description:
    "Compare Worth Ratings, specs, and prices for every product we've evaluated. Filter by category, sort by ease of use, value, or overall score.",
  path: "/compare",
});

export default async function ComparePage() {
  const products = await getPublicProducts();

  return (
    <Container className="py-14">
      {/* Page header */}
      <div className="mb-8 max-w-2xl">
        <span className="text-xs font-bold uppercase tracking-widest text-brand">Compare</span>
        <h1 className="text-4xl font-bold text-ink mt-2 mb-3 tracking-tight">
          Compare Products
        </h1>
        <p className="text-ink-secondary leading-relaxed text-lg">
          {products.length > 0
            ? `All ${products.length} products we've evaluated, scored on a 1-10 Worth Rating scale. Filter by category and sort by the metric that matters most to you.`
            : "Our first comparisons are in research right now, check back soon."}
        </p>
      </div>

      {/* Jump links */}
      {products.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-8 text-sm">
          <a href="#table" className="text-brand font-medium hover:text-brand-dark transition-colors">
            ↓ Comparison table
          </a>
          <span className="text-border">·</span>
          <a href="#cards" className="text-brand font-medium hover:text-brand-dark transition-colors">
            ↓ Product cards
          </a>
          <span className="text-border">·</span>
          <a href="/how-we-review" className="text-ink-muted hover:text-brand transition-colors">
            How we score →
          </a>
        </div>
      )}

      <AffiliateDisclosureBar variant="banner" className="mb-8" />

      {/* Interactive client component */}
      <ComparePageClient products={products} categories={categories} />

      {/* Score explanation */}
      <div className="mt-12 p-6 bg-white rounded-card border border-border max-w-2xl">
        <h2 className="font-bold text-ink mb-2 text-base">About These Scores</h2>
        <p className="text-sm text-ink-secondary leading-relaxed mb-3">
          All scores are on a 1-10 scale based on our evaluation methodology. Scores reflect how well each product performs for small-space use - not general use. A score of 9.0+ indicates best-in-class for this use case.
        </p>
        <a
          href="/how-we-review"
          className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
        >
          Full methodology →
        </a>
      </div>
    </Container>
  );
}

