import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { AffiliateDisclosureBar } from "@/components/affiliate/AffiliateDisclosureBar";
import { ComparePageClient } from "@/components/compare/ComparePageClient";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import { categories } from "@/data/categories";
import { getCategoryBySlug } from "@/lib/helpers";
import { getPublicProductsForCategoryHub } from "@/lib/public-products";

export const revalidate = false;

// ─── Static params ────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return categories.map((cat) => ({ categorySlug: cat.slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) return {};

  return buildMetadata({
    title: `Compare ${category.name} Products`,
    description: `Side-by-side score comparison for all ${category.name.toLowerCase()} products we've evaluated. Filter, sort, and find the best pick for your space.`,
    path: `/compare/${categorySlug}`,
  });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CategoryComparePage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) notFound();

  const categoryProducts = await getPublicProductsForCategoryHub(category);

  // JSON-LD breadcrumb
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Compare", item: `${SITE_URL}/compare` },
      { "@type": "ListItem", position: 3, name: category.name, item: `${SITE_URL}/compare/${category.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Container className="py-14">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-ink-muted mb-6">
          <Link prefetch={false} href="/compare" className="hover:text-brand transition-colors">Compare</Link>
          <span>›</span>
          <span className="text-ink font-medium">{category.name}</span>
        </nav>

        {/* Page header */}
        <div className="mb-8 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-brand">Compare</span>
          <h1 className="text-4xl font-bold text-ink mt-2 mb-3 tracking-tight">
            Compare {category.name} Products
          </h1>
          <p className="text-ink-secondary leading-relaxed text-lg">
            {categoryProducts.length} products evaluated for {category.shortDescription.toLowerCase()} Sort by score, value, or small-space fit to find your best match.
          </p>
        </div>

        {/* Category nav */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link prefetch={false}
            href="/compare"
            className="px-3 py-1.5 rounded-full text-sm font-medium bg-white text-ink-secondary border border-border hover:border-brand hover:text-brand transition-colors"
          >
            All Products
          </Link>
          {categories.map((cat) => (
            <Link prefetch={false}
              key={cat.slug}
              href={`/compare/${cat.slug}`}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                cat.slug === categorySlug
                  ? "bg-brand text-white border-brand"
                  : "bg-white text-ink-secondary border-border hover:border-brand hover:text-brand"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Jump links */}
        <div className="flex flex-wrap gap-3 mb-8 text-sm">
          <a href="#table" className="text-brand font-medium hover:text-brand-dark transition-colors">
            ↓ Comparison table
          </a>
          <span className="text-border">·</span>
          <a href="#cards" className="text-brand font-medium hover:text-brand-dark transition-colors">
            ↓ Product cards
          </a>
          <span className="text-border">·</span>
          <Link prefetch={false} href={`/categories/${category.slug}`} className="text-ink-muted hover:text-brand transition-colors">
            {category.name} hub →
          </Link>
        </div>

        <AffiliateDisclosureBar variant="banner" className="mb-8" />

        {/* Interactive comparison — category pre-filtered */}
        <ComparePageClient
          products={categoryProducts}
          categories={categories}
          lockedCategorySlug={category.slug}
        />

        {/* Score explanation */}
        <div className="mt-12 p-6 bg-white rounded-card border border-border max-w-2xl">
          <h2 className="font-bold text-ink mb-2 text-base">About These Scores</h2>
          <p className="text-sm text-ink-secondary leading-relaxed mb-3">
            All scores are on a 1-10 scale and reflect small-space use specifically. A score of 9.0+ indicates best-in-class for this use case.
          </p>
          <a
            href="/how-we-review"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
          >
            Full methodology →
          </a>
        </div>
      </Container>
    </>
  );
}
