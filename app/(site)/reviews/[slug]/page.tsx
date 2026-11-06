import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ScoreBar } from "@/components/ui/ScoreBar";
import { Badge } from "@/components/ui/Badge";
import { CTAButton } from "@/components/ui/CTAButton";
import { AffiliateDisclosureBar } from "@/components/affiliate/AffiliateDisclosureBar";
import {
  getGuidesForProduct,
  getGuideBySlug,
} from "@/lib/helpers";
import { products } from "@/data/products";
import { getPublicProducts, getPublicProductBySlug, getPublicProductSlugs } from "@/lib/public-products";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import { formatDate, scoreToColor, scoreToLabel } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = false;

// ─── Static generation ────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const slugs = await getPublicProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublicProductBySlug(slug);
  if (!product) return {};

  const productImage = product.image && product.image.startsWith("http") ? product.image : undefined;
  // Truncate product name to keep title under 60 chars total (with " Review | MachineFanatic" = 20 chars)
  const truncatedName = product.name.length > 40 ? product.name.slice(0, 37) + "..." : product.name;
  return buildMetadata({
    title: `${truncatedName} Review`,
    description: product.reviewSummary,
    path: `/reviews/${slug}`,
    image: productImage,
    type: "article",
  });
}

// ─── Score dimension config ───────────────────────────────────────────────────

const SCORE_DIMS = [
  {
    key: "smallSpaceFit" as const,
    label: "Small-Space Fit",
    icon: "🏠",
    note: "How well it works in tight, dorm-sized, or apartment use",
  },
  {
    key: "buildQuality" as const,
    label: "Build Quality",
    icon: "🔧",
    note: "Materials, finish, and construction durability",
  },
  {
    key: "easeOfUse" as const,
    label: "Ease of Use",
    icon: "✋",
    note: "Setup time and day-to-day usability",
  },
  {
    key: "valueForMoney" as const,
    label: "Value for Money",
    icon: "💰",
    note: "Price-to-performance vs. competing products",
  },
  {
    key: "buyerFeedback" as const,
    label: "Buyer Feedback",
    icon: "💬",
    note: "Patterns from verified Amazon reviews",
  },
] as const;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProductReviewPage({ params }: Props) {
  const { slug } = await params;

  // Fetch all products in one call; derive alternatives from the same set
  const allProducts = await getPublicProducts();
  const product = allProducts.find((p) => p.slug === slug);
  if (!product) notFound();

  const alternatives = product.alternatives
    .map((id) => allProducts.find((p) => p.id === id))
    .filter((p): p is (typeof allProducts)[number] => p !== undefined);
  const featuredInGuides = getGuidesForProduct(product.id);

  // Resolve related guide objects for richer display
  const relatedGuides = product.relatedGuideSlugs
    .map((s) => getGuideBySlug(s))
    .filter(Boolean);

  const lastUpdated = formatDate(
    featuredInGuides.length > 0 ? featuredInGuides[0].lastUpdated : "2026-01-01"
  );

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Reviews", item: `${SITE_URL}/reviews` },
      { "@type": "ListItem", position: 3, name: product.name, item: `${SITE_URL}/reviews/${slug}` },
    ],
  };

  const productImage = product.image?.startsWith("http")
    ? product.image
    : product.image
    ? `${SITE_URL}${product.image}`
    : undefined;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${product.name} Review`,
    description: product.shortDescription,
    url: `${SITE_URL}/reviews/${product.slug}`,
    datePublished: featuredInGuides[0]?.lastUpdated ?? "2026-01-01",
    dateModified: featuredInGuides[0]?.lastUpdated ?? "2026-01-01",
    author: {
      "@type": "Person",
      name: "Jamie Cole",
      url: `${SITE_URL}/author/jamie-cole`,
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
    ...(productImage && { image: productImage }),
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    url: `${SITE_URL}/reviews/${product.slug}`,
    ...(productImage && { image: productImage }),
    review: {
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: product.scores.overall.toFixed(1),
        bestRating: "10",
        worstRating: "1",
      },
      author: {
        "@type": "Person",
        name: "Jamie Cole",
        url: `${SITE_URL}/author/jamie-cole`,
      },
      datePublished: featuredInGuides[0]?.lastUpdated ?? "2026-01-01",
    },
  };

  // Size-related specs for the Space Check callout
  const spaceSpecs = Object.entries(product.specs).filter(([key]) =>
    /size|dimension|width|height|depth|length|base|footprint|clamp|weight|mount|arm/i.test(key)
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />

      <Container className="py-10">

        {/* ── 1. Breadcrumbs ─────────────────────────────────────────── */}
        <Breadcrumbs
          crumbs={[
            { label: "Reviews", href: "/reviews" },
            { label: product.subcategorySlug.replace(/-/g, " "), href: `/categories/${product.categorySlug}` },
            { label: product.name },
          ]}
        />

        {/* ── 2. Product review header ───────────────────────────────── */}
        <div className="mt-6 mb-8 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">

          {/* Left: product info */}
          <div>
            {/* Category + badge row */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Link prefetch={false}
                href={`/categories/${product.categorySlug}`}
                className="text-xs font-bold uppercase tracking-widest text-brand hover:text-brand-dark transition-colors"
              >
                {product.subcategorySlug.replace(/-/g, " ")}
              </Link>
              {product.badge && (
                <>
                  <span className="text-border" aria-hidden="true">·</span>
                  <Badge>{product.badge}</Badge>
                </>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-3 tracking-tight leading-tight">
              {product.name}
            </h1>

            <p className="text-lg text-ink-secondary leading-relaxed mb-4 max-w-2xl">
              {product.shortDescription}
            </p>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted mb-6">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                <Link prefetch={false} href="/author/jamie-cole" className="font-medium text-ink hover:text-brand transition-colors">
                  Jamie Cole
                </Link>
              </span>
              <span aria-hidden="true">·</span>
              <span>Research updated {lastUpdated}</span>
              <span aria-hidden="true">·</span>
              <span>Based on specs &amp; verified buyer feedback</span>
            </div>

            {/* Product image */}
            {product.image && product.image.startsWith("http") ? (
              <div className="relative w-full max-w-md h-56 rounded-card border border-border overflow-hidden bg-bg mb-2">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 448px"
                  className="object-contain p-4"
                  priority
                  unoptimized
                />
              </div>
            ) : (
              <div
                className="w-full max-w-md h-52 rounded-card border border-border flex items-center justify-center mb-2 overflow-hidden"
                style={{ background: "linear-gradient(135deg, #f1f5f9 0%, #eff6ff 100%)" }}
                aria-label={`${product.name}, product image not yet available`}
                role="img"
              >
                <div className="flex flex-col items-center gap-2 opacity-30">
                  <svg className="w-12 h-12 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                  <span className="text-xs text-ink-muted">Image coming soon</span>
                </div>
              </div>
            )}
            <p className="text-xs text-ink-muted mb-0">
              {product.name}, {product.subcategorySlug.replace(/-/g, " ")}
            </p>
          </div>

          {/* Right: sticky buy panel */}
          <aside>
            <div className="p-5 bg-white rounded-card border border-border sticky top-20 flex flex-col gap-4">

              {/* Overall score */}
              <div className="flex items-center gap-4 pb-4 border-b border-border">
                <div className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-bg border border-border shrink-0">
                  <span className={`text-2xl font-bold tabular-nums leading-none ${scoreToColor(product.scores.overall)}`}>
                    {product.scores.overall.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-ink-muted mt-0.5">/ 10</span>
                </div>
                <div>
                  <p className="font-bold text-ink text-sm">{scoreToLabel(product.scores.overall)}</p>
                  <p className="text-xs text-ink-muted leading-snug mt-0.5">Overall score for<br />small-space use</p>
                </div>
              </div>

              {/* Price + CTA */}
              <div>
                <p className="text-2xl font-bold text-ink mb-1">{product.priceRange}</p>
                <CTAButton href={product.amazonUrl} size="lg" fullWidth>
                  Check Price on Amazon
                </CTAButton>
              </div>

              <AffiliateDisclosureBar />

              {/* Score bars */}
              <div className="pt-3 border-t border-border flex flex-col gap-2.5">
                {SCORE_DIMS.map((dim) => (
                  <ScoreBar
                    key={dim.key}
                    label={dim.label}
                    score={product.scores[dim.key]}
                    compact
                  />
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* ── 2b. Space Check callout ───────────────────────────────────── */}
        {spaceSpecs.length > 0 && (
          <div className="mb-8 max-w-3xl p-4 rounded-card border border-brand-muted bg-brand-light/30">
            <p className="text-xs font-bold uppercase tracking-wide text-brand mb-3">Space Check</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {spaceSpecs.map(([key, val]) => (
                <div key={key} className="flex items-baseline gap-1.5">
                  <span className="text-xs font-semibold text-ink">{key}:</span>
                  <span className="text-xs text-ink-secondary">{val}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-ink-muted mt-3">
              Verify dimensions against your specific desk before purchasing.
            </p>
          </div>
        )}

        {/* ── 3. Full scorecard — horizontal strip ──────────────────────── */}
        <section className="mb-10 max-w-3xl" aria-label="Score breakdown">
          <h2 className="text-lg font-bold text-ink mb-4 tracking-tight">Score Breakdown</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Overall first */}
            <div className="col-span-2 sm:col-span-3 lg:col-span-1 flex flex-col items-center justify-center p-4 bg-brand-light rounded-card border border-brand-muted">
              <span className={`text-3xl font-bold tabular-nums ${scoreToColor(product.scores.overall)}`}>
                {product.scores.overall.toFixed(1)}
              </span>
              <span className="text-xs font-semibold text-brand mt-1 text-center">Overall</span>
              <span className="text-[10px] text-ink-muted text-center mt-0.5">{scoreToLabel(product.scores.overall)}</span>
            </div>

            {SCORE_DIMS.map((dim) => (
              <div
                key={dim.key}
                className="flex flex-col items-center justify-center p-3 bg-white rounded-card border border-border"
                title={dim.note}
              >
                <span className={`text-xl font-bold tabular-nums ${scoreToColor(product.scores[dim.key])}`}>
                  {product.scores[dim.key].toFixed(1)}
                </span>
                <span className="text-[10px] font-semibold text-ink-secondary mt-1 text-center leading-tight">
                  {dim.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3b. Methodology accordion ─────────────────────────────────── */}
        <section className="mb-10 max-w-3xl">
          <details className="group rounded-card border border-border overflow-hidden">
            <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer select-none list-none bg-white hover:bg-bg/50 transition-colors">
              <span className="text-sm font-semibold text-ink">How we scored this product</span>
              <svg className="w-4 h-4 shrink-0 text-ink-muted transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
              </svg>
            </summary>
            <div className="border-t border-border divide-y divide-border">
              {SCORE_DIMS.map((dim) => (
                <div key={dim.key} className="flex items-start gap-4 px-5 py-4 bg-white">
                  <span aria-hidden="true" className="text-base mt-0.5 shrink-0">{dim.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-semibold text-ink">{dim.label}</span>
                      <span className={`text-sm font-bold tabular-nums shrink-0 ${scoreToColor(product.scores[dim.key])}`}>
                        {product.scores[dim.key].toFixed(1)}/10
                      </span>
                    </div>
                    <p className="text-xs text-ink-secondary leading-relaxed">{dim.note}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 bg-bg border-t border-border text-xs text-ink-muted">
              Scores reflect small-space use specifically, not general product quality.{" "}
              <Link prefetch={false} href="/how-we-review" className="text-brand hover:underline">Full methodology →</Link>
            </div>
          </details>
        </section>

        {/* ── 4. Quick verdict ─────────────────────────────────────────── */}
        <section className="mb-10 max-w-3xl" aria-label="Our verdict">
          <h2 className="text-lg font-bold text-ink mb-3 tracking-tight">Our Verdict</h2>
          <div className="p-5 bg-white rounded-card border border-border">
            <div className="flex items-start gap-3 mb-4">
              <svg className="w-5 h-5 text-cta shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
              </svg>
              <p className="text-sm text-ink-secondary leading-relaxed">{product.reviewSummary}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
              <div>
                <p className="text-xs font-bold text-cta-dark uppercase tracking-wide mb-2">Good for…</p>
                <ul className="flex flex-col gap-1.5">
                  {product.bestFor.slice(0, 3).map((item) => (
                    <li key={item} className="flex gap-2">
                      <svg className="w-3.5 h-3.5 text-cta shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      <span className="text-xs text-ink-secondary">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold text-ink-secondary uppercase tracking-wide mb-2">Not ideal for…</p>
                <ul className="flex flex-col gap-1.5">
                  {product.notIdealFor.map((item) => (
                    <li key={item} className="flex gap-2">
                      <svg className="w-3.5 h-3.5 text-score-mid shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                      <span className="text-xs text-ink-secondary">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. Specs table ────────────────────────────────────────────── */}
        <section className="mb-10 max-w-3xl" aria-label="Specifications">
          <h2 className="text-xl font-bold text-ink mb-4 tracking-tight">Specifications</h2>
          <div className="overflow-x-auto rounded-card border border-border">
            <table className="w-full text-sm" style={{ minWidth: "340px" }}>
              <tbody>
                {Object.entries(product.specs).map(([key, value], i) => (
                  <tr
                    key={key}
                    className={`border-b border-border last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-bg/50"}`}
                  >
                    <td className="px-5 py-3 font-semibold text-ink w-40 text-sm align-top whitespace-nowrap">{key}</td>
                    <td className="px-5 py-3 text-ink-secondary text-sm">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── 6. Pros & Cons ───────────────────────────────────────────── */}
        <section className="mb-10 max-w-3xl" aria-label="Pros and cons">
          <h2 className="text-xl font-bold text-ink mb-4 tracking-tight">Pros & Cons</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="p-5 bg-white rounded-card border border-border">
              <p className="text-xs font-bold text-cta uppercase tracking-widest mb-4">Pros</p>
              <ul className="flex flex-col gap-2.5">
                {product.pros.map((pro) => (
                  <li key={pro} className="flex gap-2.5">
                    <svg className="w-4 h-4 text-cta shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span className="text-sm text-ink-secondary">{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-5 bg-white rounded-card border border-border">
              <p className="text-xs font-bold text-score-mid uppercase tracking-widest mb-4">Cons</p>
              <ul className="flex flex-col gap-2.5">
                {product.cons.map((con) => (
                  <li key={con} className="flex gap-2.5">
                    <svg className="w-4 h-4 text-score-mid shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                    <span className="text-sm text-ink-secondary">{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── 7 & 8. Best For / Not Ideal For (full lists) ─────────────── */}
        <section className="mb-10 max-w-3xl" aria-label="Who this product is best for">
          <h2 className="text-xl font-bold text-ink mb-4 tracking-tight">Who It&apos;s For</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="p-5 bg-cta-light rounded-card border border-cta/20">
              <p className="text-xs font-bold text-cta-dark uppercase tracking-widest mb-4">Best For</p>
              <ul className="flex flex-col gap-3">
                {product.bestFor.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <svg className="w-4 h-4 text-cta shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span className="text-sm text-ink-secondary">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-5 bg-bg rounded-card border border-border">
              <p className="text-xs font-bold text-ink-secondary uppercase tracking-widest mb-4">Not Ideal For</p>
              <ul className="flex flex-col gap-3">
                {product.notIdealFor.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <svg className="w-4 h-4 text-score-mid shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                    <span className="text-sm text-ink-secondary">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── 9. Detailed evaluation (one card per score dimension) ──────── */}
        <section className="mb-12 max-w-3xl" aria-label="Detailed evaluation">
          <h2 className="text-xl font-bold text-ink mb-2 tracking-tight">Detailed Evaluation</h2>
          <p className="text-sm text-ink-secondary mb-6 leading-relaxed max-w-2xl">
            Each dimension scored 1-10 for small-space use specifically. Scores are based on
            product specifications and verified buyer feedback patterns, not hands-on lab testing.
          </p>

          <div className="flex flex-col gap-4">
            {SCORE_DIMS.map((dim, dimIdx) => {
              const score = product.scores[dim.key];
              // Assign pros/cons contextually: rotate through arrays to avoid duplication
              const relatedPros = product.pros.filter((_, i) =>
                i % SCORE_DIMS.length === dimIdx
              );
              const relatedCons = product.cons.filter((_, i) =>
                i % SCORE_DIMS.length === dimIdx
              );

              return (
                <div key={dim.key} className="bg-white rounded-card border border-border overflow-hidden">
                  {/* Dimension header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-bg/50">
                    <div className="flex items-center gap-3">
                      <span aria-hidden="true" className="text-lg">{dim.icon}</span>
                      <div>
                        <p className="font-bold text-ink text-sm">{dim.label}</p>
                        <p className="text-xs text-ink-muted">{dim.note}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-2xl font-bold tabular-nums ${scoreToColor(score)}`}>
                        {score.toFixed(1)}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-ink-muted">/ 10</span>
                        <span className={`text-[10px] font-semibold ${scoreToColor(score)}`}>
                          {scoreToLabel(score)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Score bar */}
                  <div className="px-5 pt-4 pb-2">
                    <ScoreBar label={dim.label} score={score} showLabel />
                  </div>

                  {/* Contextual bullets */}
                  {(relatedPros.length > 0 || relatedCons.length > 0) && (
                    <div className="px-5 pb-4 pt-2 flex flex-col gap-2">
                      {relatedPros.map((pro) => (
                        <div key={pro} className="flex gap-2">
                          <svg className="w-3.5 h-3.5 text-cta shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                          </svg>
                          <span className="text-xs text-ink-secondary">{pro}</span>
                        </div>
                      ))}
                      {relatedCons.map((con) => (
                        <div key={con} className="flex gap-2">
                          <svg className="w-3.5 h-3.5 text-score-mid shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                          </svg>
                          <span className="text-xs text-ink-secondary">{con}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 10. Alternatives ─────────────────────────────────────────── */}
        {alternatives.length > 0 && (
          <section className="mb-10 max-w-3xl" aria-label="Alternative products">
            <h2 className="text-xl font-bold text-ink mb-2 tracking-tight">Alternatives to Consider</h2>
            <p className="text-sm text-ink-secondary mb-4 leading-relaxed">
              If this product isn&apos;t the right fit, these are our other picks in the same subcategory.
            </p>
            <div className="flex flex-col gap-3">
              {alternatives.map((alt) => (
                <Link prefetch={false}
                  key={alt.id}
                  href={`/reviews/${alt.slug}`}
                  className="group flex items-start gap-4 p-4 bg-white rounded-card border border-border hover:border-brand/30 hover:shadow-card transition-all"
                >
                  {/* Score badge */}
                  <div className="shrink-0 flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-bg border border-border">
                    <span className={`text-base font-bold tabular-nums leading-none ${scoreToColor(alt.scores.overall)}`}>
                      {alt.scores.overall.toFixed(1)}
                    </span>
                    <span className="text-[9px] text-ink-muted mt-0.5">/ 10</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      {alt.badge && <Badge>{alt.badge}</Badge>}
                      <p className="font-semibold text-ink text-sm group-hover:text-brand transition-colors leading-snug">
                        {alt.name}
                      </p>
                    </div>
                    <p className="text-xs text-ink-secondary leading-relaxed line-clamp-2">
                      {alt.shortDescription}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="font-bold text-ink text-sm">{alt.priceRange}</p>
                    <p className="text-xs text-brand mt-1 group-hover:text-brand-dark transition-colors">
                      Full review →
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── 11. Compare section ──────────────────────────────────────── */}
        <section className="mb-10 max-w-3xl">
          <div className="flex items-start gap-4 p-5 bg-white rounded-card border border-border">
            <div className="shrink-0 w-10 h-10 rounded-lg bg-brand-light flex items-center justify-center">
              <svg className="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-bold text-ink text-sm mb-1">
                Compare {product.subcategorySlug.replace(/-/g, " ")} side-by-side
              </p>
              <p className="text-xs text-ink-secondary leading-relaxed mb-3">
                See all {product.subcategorySlug.replace(/-/g, " ")} products we evaluated in a
                single table, scores, prices, and best-for cases compared directly.
              </p>
              <Link prefetch={false}
                href="/compare"
                className="text-sm font-semibold text-brand hover:text-brand-dark transition-colors flex items-center gap-1"
              >
                Go to comparison page →
              </Link>
            </div>
          </div>
        </section>

        {/* ── 12. Related buying guides ────────────────────────────────── */}
        {relatedGuides.length > 0 && (
          <section className="mb-10 max-w-3xl" aria-label="Related buying guides">
            <h2 className="text-xl font-bold text-ink mb-4 tracking-tight">Related Buying Guides</h2>
            <div className="flex flex-col gap-3">
              {relatedGuides.map((guide) => (
                guide && (
                  <Link prefetch={false}
                    key={guide.slug}
                    href={`/guide/${guide.slug}`}
                    className="group flex items-center justify-between p-4 bg-white rounded-lg border border-border hover:border-brand/30 hover:shadow-card transition-all"
                  >
                    <div>
                      <span className="text-xs font-semibold text-brand uppercase tracking-wide block mb-0.5">
                        {guide.subcategorySlug.replace(/-/g, " ")}
                      </span>
                      <p className="text-sm font-semibold text-ink group-hover:text-brand transition-colors leading-snug">
                        {guide.title}
                      </p>
                      <p className="text-xs text-ink-muted mt-0.5">
                        {guide.readTime} · {guide.recommendedProductIds.length} picks evaluated
                      </p>
                    </div>
                    <svg className="w-4 h-4 text-ink-muted group-hover:text-brand group-hover:translate-x-0.5 transition-all shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
                    </svg>
                  </Link>
                )
              ))}
            </div>
          </section>
        )}

        {/* ── 13. Affiliate disclosure near bottom CTA ─────────────────── */}
        <AffiliateDisclosureBar variant="banner" className="mb-5 max-w-3xl" />

        {/* ── Bottom CTA strip ──────────────────────────────────────────── */}
        <section
          className="max-w-3xl p-6 rounded-card border border-brand-muted flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)" }}
          aria-label="Buy this product"
        >
          <div>
            <p className="font-bold text-ink text-base">{product.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm font-bold text-ink">{product.priceRange}</span>
              <span className="text-border" aria-hidden="true">·</span>
              <span className={`text-sm font-bold ${scoreToColor(product.scores.overall)}`}>
                {product.scores.overall.toFixed(1)} / 10
              </span>
            </div>
          </div>
          <CTAButton href={product.amazonUrl} size="lg">
            Check Price on Amazon
          </CTAButton>
        </section>

        {/* Bottom evaluation note */}
        <p className="text-xs text-ink-muted mt-4 max-w-3xl leading-relaxed">
          Scores are based on product specifications and verified buyer feedback. We do not claim
          hands-on testing.{" "}
          <Link prefetch={false} href="/how-we-review" className="text-brand hover:text-brand-dark transition-colors">
            Read our methodology →
          </Link>
        </p>

      </Container>
    </>
  );
}
