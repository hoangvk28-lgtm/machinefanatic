import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ProductPick } from "@/components/product/ProductPick";
import { AtAGlance } from "@/components/product/AtAGlance";
import { GuideRecommendationBox } from "@/components/product/GuideRecommendationBox";
import { GuideComparisonTable } from "@/components/product/GuideComparisonTable";
import { AffiliateDisclosureBar } from "@/components/affiliate/AffiliateDisclosureBar";
import { Badge } from "@/components/ui/Badge";
import { RichContent } from "@/components/ui/RichContent";
import { TableOfContents } from "@/components/ui/TableOfContents";
import { processGuideContent } from "@/lib/toc";
import { MobileStickyPicksCTA } from "@/components/sections/MobileStickyPicksCTA";
import { getPublicGuideBySlug, getPublicGuideSlugs, getRelatedPublicGuides, getPublicGuides } from "@/lib/public-guides";
import type { GuideProductPick } from "@/lib/public-guides";
import { getPublicProducts } from "@/lib/public-products";
import { buildMetadata } from "@/lib/seo";
import { formatDate, scoreToColor } from "@/lib/utils";
import { SITE_URL } from "@/lib/seo";
import { amazonSearchLinks } from "@/lib/amazon-links";
import { categories, getCategoryBySlug } from "@/data/categories";
import { authorToSlug, getAuthorByName } from "@/data/authors";
import { dynamicGuideSlugs, dynamicGuideLoaders } from "@/data/dynamic-guides-registry";
import { RichGuidePage, type RichGuideModule } from "@/components/guide/RichGuidePage";
import { InfoGuidePage, type InfoGuideModule } from "@/components/guide/InfoGuidePage";

export const revalidate = 604800;

type Props = { params: Promise<{ slug: string }> };

// ─── Static generation ────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const [guideSlugs] = await Promise.all([getPublicGuideSlugs()]);
  const categorySlugs = categories.map((c) => c.slug);
  // dynamicGuideSlugs (4000+ rich data-file guides) are intentionally NOT prerendered:
  // they render on first request and are ISR-cached from then on. Prerendering them
  // put ~5000 HTML pages (~3GB) into every deployment, blowing through Vercel Hobby's
  // Deployment Storage and ISR Writes quotas on each push.
  const all = [...new Set([...guideSlugs, ...categorySlugs])].filter(
    (slug) => !dynamicGuideSlugs.includes(slug)
  );
  return all.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // Rich static-data-backed guide, served dynamically (no literal route dir)
  if (dynamicGuideSlugs.includes(slug)) {
    const mod = (await dynamicGuideLoaders[slug]()) as unknown as RichGuideModule;
    return buildMetadata({
      title: mod.metaTitle,
      description: mod.metaDescription,
      path: `/guide/${slug}`,
      image: mod.heroImage,
      type: "article",
    });
  }

  // Category listing page metadata
  const category = getCategoryBySlug(slug);
  if (category) {
    return buildMetadata({
      title: `${category.name} Buying Guides`,
      description: category.description,
      path: `/guide/${slug}`,
    });
  }

  const guide = await getPublicGuideBySlug(slug);
  if (!guide) return {};

  // Use hero image as OG image — supports both Supabase (http) and local (/images) paths
  const heroImage = guide.heroImage?.startsWith("http")
    ? guide.heroImage
    : guide.heroImage?.startsWith("/")
    ? `${SITE_URL}${guide.heroImage}`
    : undefined;

  const base = buildMetadata({
    title: guide.metaTitle ?? guide.title,
    description: guide.metaDescription ?? guide.description,
    path: `/guide/${slug}`,
    image: heroImage,
    type: "article",
  });

  return {
    ...base,
    keywords: [guide.mainKeyword, ...guide.subKeywords],
    openGraph: {
      ...(base.openGraph as object),
      type: "article",
      publishedTime: guide.lastUpdated,
      modifiedTime: guide.lastUpdated,
      authors: [guide.author],
      section: guide.subcategorySlug.replace(/-/g, " "),
    },
  };
}

// ─── Scoring criteria for "How We Picked" ────────────────────────────────────

const scoringCriteria = [
  {
    label: "Small-Space Fit",
    weight: "25%",
    description:
      "Physical footprint, mounting options, and whether the product works without consuming space you don't have.",
  },
  {
    label: "Build Quality",
    weight: "20%",
    description:
      "Materials, finish durability, and construction quality as indicated by product specs and verified buyer feedback patterns.",
  },
  {
    label: "Ease of Use",
    weight: "20%",
    description:
      "Setup time, daily usability, and how much adjustment the product requires once in place.",
  },
  {
    label: "Value for Money",
    weight: "20%",
    description:
      "Price-to-performance ratio compared to competing products in the same subcategory.",
  },
  {
    label: "Buyer Feedback",
    weight: "15%",
    description:
      "Patterns from verified Amazon reviews, what real buyers praise and complain about most over time.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BuyingGuidePage({ params }: Props) {
  const { slug } = await params;

  // ── Rich static-data-backed guide, served dynamically (no literal route dir) ──
  if (dynamicGuideSlugs.includes(slug)) {
    const mod = (await dynamicGuideLoaders[slug]()) as unknown as RichGuideModule | InfoGuideModule;
    if ("kind" in mod && mod.kind === "info") return <InfoGuidePage slug={slug} guide={mod} />;
    return <RichGuidePage slug={slug} guide={mod as RichGuideModule} />;
  }

  // ── Category listing page ─────────────────────────────────────────────────
  const category = getCategoryBySlug(slug);
  if (category) {
    const allGuides = await getPublicGuides();
    const categoryGuides = allGuides.filter((g) => g.categorySlug === slug);

    return (
      <Container className="py-10">
        <Breadcrumbs crumbs={[{ label: "Buying Guides", href: "/guide" }, { label: category.name }]} />

        <header className="mt-6 mb-10 max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-brand">{category.name}</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-ink mt-2 mb-3 tracking-tight">
            {category.name} Buying Guides
          </h1>
          <p className="text-lg text-ink-secondary leading-relaxed">{category.description}</p>
        </header>

        {categoryGuides.length === 0 ? (
          <div className="py-16 text-center text-ink-muted">
            <p className="text-lg font-medium mb-2">No guides yet in this category.</p>
            <p className="text-sm">Check back soon - we&apos;re working on it.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryGuides.map((guide) => {
              const cover = (guide as { thumbnailImage?: string }).thumbnailImage || guide.heroImage;
              return (
                <Link prefetch={false}
                  key={guide.slug}
                  href={`/guide/${guide.slug}`}
                  className="group flex flex-col bg-white rounded-card border border-border hover:shadow-card-hover hover:border-brand/20 transition-all overflow-hidden"
                >
                  {/* Thumbnail */}
                  <div className="relative w-full h-44 overflow-hidden bg-bg">
                    {(cover?.startsWith("http") || cover?.startsWith("/")) ? (
                      <Image
                        src={cover}
                        alt={guide.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-ink-muted/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                      </div>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="flex flex-col gap-2 p-5 flex-1">
                    <div className="flex items-center gap-2 text-xs text-ink-muted">
                      <span>{guide.readTime} read</span>
                      <span aria-hidden="true">·</span>
                      <span>Updated {formatDate(guide.lastUpdated)}</span>
                    </div>
                    <h3 className="font-bold text-ink group-hover:text-brand transition-colors text-base leading-snug">
                      {guide.title}
                    </h3>
                    <p className="text-sm text-ink-secondary leading-relaxed line-clamp-2 flex-1">
                      {guide.description}
                    </p>
                    <div className="pt-3 mt-auto">
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand group-hover:gap-2.5 transition-all">
                        Read guide
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6"/></svg>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Link back to all guides */}
        <div className="mt-12 pt-8 border-t border-border">
          <Link prefetch={false} href="/guide" className="text-sm font-semibold text-brand hover:text-brand-dark transition-colors flex items-center gap-1">
            ← View all buying guides
          </Link>
        </div>
      </Container>
    );
  }

  // ── Individual guide page ─────────────────────────────────────────────────
  const [guide, allProducts] = await Promise.all([
    getPublicGuideBySlug(slug),
    getPublicProducts(),
  ]);
  if (!guide) notFound();

  // Resolve recommended products from public products list (preserves order)
  const picks = guide.recommendedProductIds
    .map((id) => allProducts.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  const relatedGuides = await getRelatedPublicGuides(guide.relatedGuideSlugs);

  // Alternatives — from first pick's alternatives array, skip products already in picks
  const pickIds = new Set(picks.map((p) => p.id));
  const alternatives = picks.length > 0
    ? (picks[0].alternatives ?? [])
        .map((id) => allProducts.find((p) => p.id === id))
        .filter((p): p is NonNullable<typeof p> => p !== undefined && !pickIds.has(p.id))
    : [];

  // Aggregate bestFor / notIdealFor across all picks for "Who This Is For"
  const whoFor = [...new Set(picks.flatMap((p) => p.bestFor))].slice(0, 6);
  const whoSkip = [...new Set(picks.flatMap((p) => p.notIdealFor))].slice(0, 4);

  // Split guide sections: intro = [0], middle = [1..N-2], methodology = last
  const hasMultipleSections = guide.sections.length > 1;
  const introSection = guide.sections[0];
  const middleSections = hasMultipleSections
    ? guide.sections.slice(1, -1)
    : [];
  const methodologySection = hasMultipleSections
    ? guide.sections[guide.sections.length - 1]
    : null;

  // Build TOC and inject heading IDs in one pass across all sections
  const allSectionsOrdered = [
    ...(introSection ? [introSection] : []),
    ...middleSections,
    ...(methodologySection ? [methodologySection] : []),
  ];
  const { toc, processedBodies } = processGuideContent(allSectionsOrdered);
  const introBody = processedBodies[0] ?? "";
  const middleBodies = processedBodies.slice(1, 1 + middleSections.length);
  const methodologyBody = methodologySection
    ? processedBodies[processedBodies.length - 1]
    : null;

  // JSON-LD schemas
  const guideAuthor = getAuthorByName(guide.author);
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.lastUpdated,
    dateModified: guide.lastUpdated,
    author: guideAuthor?.isPerson
      ? { "@type": "Person", name: guideAuthor.name, url: `${SITE_URL}/author/${guideAuthor.slug}` }
      : { "@type": "Organization", name: guide.author },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/guide/${slug}` },
    ...(guide.heroImage && guide.heroImage.startsWith("http")
      ? { image: guide.heroImage }
      : {}),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Buying Guides", item: `${SITE_URL}/guide` },
      { "@type": "ListItem", position: 3, name: guide.title, item: `${SITE_URL}/guide/${slug}` },
    ],
  };

  // ItemList schema — safe: only name + url, no fake prices/ratings
  const itemListSchema = picks.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `${guide.title}, Top Picks`,
        description: `Products recommended in: ${guide.title}`,
        numberOfItems: picks.length,
        itemListElement: picks.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: p.name,
          url: `${SITE_URL}/reviews/${p.slug}`,
        })),
      }
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {itemListSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      )}

      <Container className="py-10">

        {/* ── 1. Breadcrumbs ──────────────────────────────────────────── */}
        <Breadcrumbs
          crumbs={[
            { label: "Buying Guides", href: "/guide" },
            { label: guide.title },
          ]}
        />

        {/* ── 3. Article header ───────────────────────────────────────── */}
        <header className="mt-6 mb-6 max-w-3xl">
          {/* Category tag */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Link prefetch={false}
              href={`/categories/${guide.categorySlug}`}
              className="text-xs font-bold uppercase tracking-widest text-brand hover:text-brand-dark transition-colors"
            >
              {guide.subcategorySlug.replace(/-/g, " ")}
            </Link>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-4 tracking-tight leading-tight">
            {guide.title}
          </h1>

          <p className="text-lg text-ink-secondary leading-relaxed mb-5">
            {guide.description}
          </p>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-ink-muted pb-5 border-b border-border">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              <Link prefetch={false}
                href={`/author/${authorToSlug(guide.author)}`}
                className="hover:text-ink hover:underline transition-colors"
              >
                {guide.author}
              </Link>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
              Updated {formatDate(guide.lastUpdated)}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              {guide.readTime} read
            </span>
            <span aria-hidden="true">·</span>
            <span>{picks.length} product{picks.length !== 1 ? "s" : ""} evaluated</span>
          </div>
        </header>

        {/* ── Hero image ──────────────────────────────────────────────── */}
        {guide.heroImage && (
          <div className="relative w-full aspect-[16/7] rounded-xl overflow-hidden mb-8 max-w-3xl">
            <Image
              src={guide.heroImage}
              alt={(guide as { heroImageAlt?: string }).heroImageAlt || guide.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
              priority
              unoptimized
            />
          </div>
        )}

        {/* ── 2. Affiliate disclosure ──────────────────────────────────── */}
        <AffiliateDisclosureBar
          variant="banner"
          disclosureText="We may earn a commission when you buy through Amazon links. This guide is based on product specs, buyer feedback, use cases, and comparison criteria, not paid placement."
          className="mb-8 max-w-3xl"
        />

        {/* ── TOC ─────────────────────────────────────────────────────── */}
        {toc.length >= 2 && <TableOfContents items={toc} />}

        {/* ── 4. Quick recommendation box ─────────────────────────────── */}
        {picks.length > 0 && (
          <div id="picks" className="scroll-mt-20">
            <GuideRecommendationBox picks={picks} />
          </div>
        )}

        {/* ── 5. Comparison table ──────────────────────────────────────── */}
        {picks.length > 1 && (
          <GuideComparisonTable products={picks} />
        )}

        {/* ── 6. Intro section ────────────────────────────────────────── */}
        {introSection && (
          <div className="prose max-w-3xl mb-10">
            {introSection.heading && <h2>{introSection.heading}</h2>}
            {introBody.trim().startsWith("<") ? (
              <RichContent html={introBody} />
            ) : (
              introBody.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))
            )}
          </div>
        )}

        {/* ── 6b. Buying criteria table ───────────────────────────────── */}
        {guide.buyingCriteria && guide.buyingCriteria.length > 0 && (
          <section className="mb-10 max-w-3xl" aria-label="Buying criteria">
            <h2 className="text-xl font-bold text-ink mb-1 tracking-tight">
              What to Look For Before You Buy
            </h2>
            <p className="text-sm text-ink-secondary mb-4">
              Key criteria and specific thresholds, so you know exactly what to evaluate before choosing a product.
            </p>
            <div className="rounded-card border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-bg border-b border-border">
                    <th className="text-left px-4 py-3 font-semibold text-ink-secondary text-xs uppercase tracking-wide w-36 md:w-44 shrink-0">
                      Criterion
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-ink-secondary text-xs uppercase tracking-wide">
                      What to Check
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {guide.buyingCriteria.map(({ criterion, content }, i) => {
                    const lines = content.split("\n").filter(Boolean);
                    return (
                      <tr
                        key={criterion}
                        className={`border-b border-border last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-bg/40"}`}
                      >
                        <td className="px-4 py-3 font-semibold text-ink align-top text-sm leading-snug">
                          {criterion}
                        </td>
                        <td className="px-4 py-3 align-top">
                          {lines.length === 1 ? (
                            <span className="text-sm text-ink-secondary leading-relaxed">{lines[0]}</span>
                          ) : (
                            <ul className="space-y-1">
                              {lines.map((line, j) => (
                                <li key={j} className="flex items-start gap-2 text-sm text-ink-secondary leading-relaxed">
                                  <span className="text-brand shrink-0 mt-0.5 font-bold text-xs">›</span>
                                  <span>{line}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── 6c. Inline product picks (DB-stored GuideProductPick) ────── */}
        {(guide as { productPicks?: GuideProductPick[] }).productPicks?.length ? (
          <InlineProductPicks picks={(guide as { productPicks?: GuideProductPick[] }).productPicks!} />
        ) : null}

        {/* ── 7. Detailed product reviews ─────────────────────────────── */}
        {picks.length > 0 && (
          <section className="mb-12" aria-label="Detailed product reviews">
            <h2 className="text-2xl font-bold text-ink mb-2 tracking-tight">
              Our Picks, Full Reviews
            </h2>
            <p className="text-sm text-ink-secondary mb-7 max-w-2xl">
              Every recommended product evaluated in detail, scores, pros and cons, who it&apos;s best for, and full Amazon links.
            </p>
            <div className="flex flex-col gap-6">
              {picks.map((product, i) => (
                <div key={product.id} id={`pick-${product.id}`} className="scroll-mt-20">
                  <ProductPick product={product} rank={i + 1} lastUpdated={formatDate(guide.lastUpdated)} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 9. What to look for (middle guide sections) ──────────────── */}
        {middleSections.length > 0 && (
          <div aria-label="Buying advice sections">
            {middleSections.map((section, i) => {
              const body = middleBodies[i] ?? section.body;
              return (
                <div key={i} className="prose max-w-3xl mb-10">
                  {section.heading && <h2>{section.heading}</h2>}
                  {body.trim().startsWith("<") ? (
                    <RichContent html={body} />
                  ) : (
                    body.split("\n\n").map((para, j) => (
                      <p key={j}>{para}</p>
                    ))
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── 8. How we picked ────────────────────────────────────────── */}
        <section className="mb-12 max-w-3xl" aria-label="How we picked">
          <h2 className="text-2xl font-bold text-ink mb-2 tracking-tight">How We Picked</h2>
          <p className="text-sm text-ink-secondary leading-relaxed mb-6 max-w-2xl">
            Every product in this guide was evaluated across five criteria, weighted for real small-space use.
            We do not claim hands-on lab testing, our evaluation is based on verified buyer feedback patterns,
            published product specifications, and structured comparison criteria.
          </p>

          <div className="flex flex-col gap-3">
            {scoringCriteria.map((criterion) => (
              <div
                key={criterion.label}
                className="flex gap-4 p-4 bg-white rounded-lg border border-border"
              >
                <div className="shrink-0 text-right w-10 pt-0.5">
                  <span className="text-xs font-bold text-brand">{criterion.weight}</span>
                </div>
                <div>
                  <p className="font-semibold text-ink text-sm mb-0.5">{criterion.label}</p>
                  <p className="text-xs text-ink-secondary leading-relaxed">{criterion.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Guide's own methodology section if it exists */}
          {methodologySection && methodologyBody !== null && (
            <div className="prose mt-8">
              {methodologySection.heading && <h3>{methodologySection.heading}</h3>}
              {methodologyBody.trim().startsWith("<") ? (
                <RichContent html={methodologyBody} />
              ) : (
                methodologyBody.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))
              )}
            </div>
          )}

          <div className="mt-5 p-4 bg-bg rounded-lg border border-border">
            <Link prefetch={false}
              href="/how-we-review"
              className="text-sm font-semibold text-brand hover:text-brand-dark transition-colors flex items-center gap-1"
            >
              Read our full evaluation methodology →
            </Link>
          </div>
        </section>

        {/* ── 10 & 11. Who this is for / Who should skip ───────────────── */}
        {(whoFor.length > 0 || whoSkip.length > 0) && (
          <section className="mb-12 max-w-3xl" aria-label="Who this guide is for">
            <h2 className="text-2xl font-bold text-ink mb-6 tracking-tight">
              Who This Guide Is For
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {whoFor.length > 0 && (
                <div className="p-5 bg-cta-light rounded-card border border-cta/20">
                  <h3 className="font-bold text-cta-dark text-sm uppercase tracking-wide mb-4">
                    Good fit if you…
                  </h3>
                  <ul className="flex flex-col gap-2.5">
                    {whoFor.map((item) => (
                      <li key={item} className="flex gap-2.5">
                        <svg className="w-4 h-4 text-cta shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                        <span className="text-sm text-ink-secondary">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {whoSkip.length > 0 && (
                <div className="p-5 bg-bg rounded-card border border-border">
                  <h3 className="font-bold text-ink-secondary text-sm uppercase tracking-wide mb-4">
                    Probably not for you if…
                  </h3>
                  <ul className="flex flex-col gap-2.5">
                    {whoSkip.map((item) => (
                      <li key={item} className="flex gap-2.5">
                        <svg className="w-4 h-4 text-score-mid shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                        <span className="text-sm text-ink-secondary">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── 12. The competition ──────────────────────────────────────── */}
        {alternatives.length > 0 && (
          <section className="mb-12 max-w-3xl" aria-label="Alternative products">
            <h2 className="text-2xl font-bold text-ink mb-2 tracking-tight">
              The Competition
            </h2>
            <p className="text-sm text-ink-secondary leading-relaxed mb-5 max-w-2xl">
              These products were considered but didn&apos;t make our top picks. They may still be worth looking at depending on your specific needs.
            </p>
            <div className="flex flex-col gap-3">
              {alternatives.map((alt) => (
                <Link prefetch={false}
                  key={alt.id}
                  href={`/reviews/${alt.slug}`}
                  className="group flex items-start gap-4 p-4 bg-white rounded-card border border-border hover:border-brand/30 hover:shadow-card transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      {alt.badge && <Badge>{alt.badge}</Badge>}
                      <p className="font-semibold text-ink text-sm group-hover:text-brand transition-colors leading-snug">
                        {alt.name}
                      </p>
                    </div>
                    <p className="text-xs text-ink-secondary leading-relaxed line-clamp-2 mt-1">
                      {alt.shortDescription}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className={`font-bold tabular-nums text-base block ${scoreToColor(alt.scores.overall)}`}>
                      {alt.scores.overall.toFixed(1)}
                    </span>
                    <span className="text-xs text-ink-muted">{alt.priceRange}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── 13. FAQ ─────────────────────────────────────────────────── */}
        {guide.faq.length > 0 && (
          <section className="mb-12 max-w-3xl" aria-label="Frequently asked questions">
            <h2 className="text-2xl font-bold text-ink mb-6 tracking-tight">
              Frequently Asked Questions
            </h2>
            <div className="flex flex-col gap-0 rounded-card border border-border overflow-hidden">
              {guide.faq.map((item, i) => (
                <div
                  key={i}
                  className={`p-5 ${i < guide.faq.length - 1 ? "border-b border-border" : ""} ${i % 2 === 0 ? "bg-white" : "bg-bg/40"}`}
                >
                  <h3 className="font-bold text-ink text-sm mb-2 leading-snug">{item.question}</h3>
                  <p className="text-sm text-ink-secondary leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 14. Related guides ──────────────────────────────────────── */}
        {relatedGuides.length > 0 && (
          <section className="mb-12 max-w-3xl" aria-label="Related buying guides">
            <h2 className="text-xl font-bold text-ink mb-4 tracking-tight">Related Buying Guides</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedGuides.map((related) => (
                <Link prefetch={false}
                  key={related.slug}
                  href={`/guide/${related.slug}`}
                  className="group flex flex-col gap-2 p-4 bg-white rounded-card border border-border hover:border-brand/30 hover:shadow-card transition-all"
                >
                  <span className="text-xs font-semibold text-brand uppercase tracking-wide">
                    {related.subcategorySlug.replace(/-/g, " ")}
                  </span>
                  <p className="font-semibold text-ink group-hover:text-brand transition-colors text-sm leading-snug">
                    {related.title}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-ink-muted">
                    <span>{related.readTime}</span>
                    <span aria-hidden="true">·</span>
                    <span>{related.recommendedProductIds.length} picks</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Browse on Amazon CTA */}
        {(amazonSearchLinks[guide.slug] || amazonSearchLinks[guide.categorySlug]) && (
          <div className="max-w-3xl mb-6 p-4 rounded-xl border border-border bg-bg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-sm text-ink-secondary">
              Want to browse more options? See all related products on Amazon.
            </p>
            <a
              href={amazonSearchLinks[guide.slug] ?? amazonSearchLinks[guide.categorySlug]}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#FF9900] text-white hover:bg-[#e68900] transition-colors whitespace-nowrap"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.26 18.36C9.18 20.34 4.76 21.38 1 20.16c-.38-.13-.33-.44.08-.35 3.47.67 7.77-.07 10.6-1.82.47-.27.87.17.58.37zm1.06-1.17c-.43-.56-2.85-.27-3.94-.13-.33.04-.38-.25-.08-.46 1.93-1.36 5.1-.97 5.47-.51.37.46-.1 3.63-1.91 5.14-.28.23-.54.11-.42-.2.41-.98 1.32-3.28.88-3.84z"/>
              </svg>
              Browse on Amazon
            </a>
          </div>
        )}

        {/* Bottom methodology note */}
        <div className="max-w-3xl p-5 bg-bg rounded-card border border-border mb-6">
          <p className="text-sm text-ink-secondary leading-relaxed">
            <strong className="text-ink">Evaluation note: </strong>
            Products in this guide were assessed on overall score, small-space fit, build quality,
            ease of use, value for money, and buyer feedback from verified Amazon reviews. We do not
            claim hands-on product testing.
          </p>
          <Link prefetch={false}
            href="/how-we-review"
            className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
          >
            Read our full methodology →
          </Link>
        </div>

      </Container>

      {/* ── 15. Sticky mobile CTA ───────────────────────────────────────── */}
      <MobileStickyPicksCTA label="View top picks" targetId="picks" />
    </>
  );
}

// ── Inline product picks (from DB product_picks JSONB column) ─────────────────

function InlineProductPicks({ picks }: { picks: GuideProductPick[] }) {
  return (
    <section className="mb-12" aria-label="Top product picks">
      <h2 className="text-2xl font-bold text-ink mb-2 tracking-tight">Our Top Picks</h2>

      {/* At-a-glance */}
      <AtAGlance
        items={picks.map((pick, i) => ({
          rank: i + 1,
          badge: pick.badge,
          name: pick.name,
          imageUrl: pick.imageUrl,
          affiliateUrl: pick.affiliateUrl,
          pros: pick.pros.map((text) => ({ text })),
          cons: pick.cons.map((text) => ({ text, severity: "minor" as const })),
          anchorId: `inline-pick-${pick.id}`,
        }))}
      />

      {/* Detailed pick cards */}
      <div className="flex flex-col gap-6">
        {picks.map((pick, i) => (
          <div key={pick.id} id={`inline-pick-${pick.id}`} className="scroll-mt-20">
            <InlinePickCard pick={pick} rank={i + 1} />
          </div>
        ))}
      </div>
    </section>
  );
}

function InlinePickCard({ pick, rank }: { pick: GuideProductPick; rank: number }) {
  return (
    <div className="rounded-card border border-border overflow-hidden bg-white">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="sm:w-52 bg-bg flex items-center justify-center p-5 shrink-0">
          {pick.imageUrl ? (
            <div className="relative w-36 h-36">
              <Image
                src={pick.imageUrl}
                alt={pick.name}
                fill
                className="object-contain"
                sizes="144px"
                unoptimized
              />
            </div>
          ) : (
            <div className="w-36 h-36 bg-gray-100 rounded-lg" aria-hidden="true" />
          )}
        </div>

        {/* Details */}
        <div className="flex-1 p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs font-bold text-ink-muted">#{rank}</span>
            {pick.badge && (
              <Badge>{pick.badge}</Badge>
            )}
          </div>

          <h3 className="text-lg font-bold text-ink mb-0.5 leading-snug flex flex-wrap items-center gap-2 min-w-0 break-words">
            {pick.name}
          </h3>
          {pick.brand && <p className="text-sm text-ink-muted mb-2">{pick.brand}</p>}

          {pick.fitScore != null && (
            <p className="text-xs text-ink-muted mb-2">
              Machine Score: <span className={`font-bold text-sm ${scoreToColor(pick.fitScore)}`}>{pick.fitScore.toFixed(1)}/10</span>
            </p>
          )}

          <p className="text-sm text-ink-secondary leading-relaxed mb-3">{pick.summary}</p>

          {pick.whyItWins && (
            <p className="text-sm text-ink-secondary italic border-l-2 border-brand pl-3 mb-3">{pick.whyItWins}</p>
          )}

          <div className="flex flex-wrap gap-4 text-xs text-ink-muted mb-3">
            {pick.bestFor && (
              <span><span className="font-semibold text-ink">Best for:</span> {pick.bestFor}</span>
            )}
            {pick.skipIf && (
              <span><span className="font-semibold text-ink">Skip if:</span> {pick.skipIf}</span>
            )}
          </div>

          {/* Specs */}
          {pick.specs?.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 mb-4 text-xs">
              {pick.specs.map((spec, i) => (
                <div key={i}>
                  <span className="text-ink-muted">{spec.label}: </span>
                  <span className="font-medium text-ink">{spec.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Pros / Cons */}
          {(pick.pros?.length > 0 || pick.cons?.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {pick.pros?.length > 0 && (
                <ul className="space-y-1">
                  {pick.pros.map((p, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-green-700">
                      <span className="font-bold mt-0.5">+</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              )}
              {pick.cons?.length > 0 && (
                <ul className="space-y-1">
                  {pick.cons.map((c, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-red-600">
                      <span className="font-bold mt-0.5">−</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* CTA */}
          {pick.affiliateUrl && (
            <a
              href={pick.affiliateUrl}
              rel="nofollow sponsored noopener noreferrer"
              target="_blank"
              className="inline-flex items-center gap-2 bg-[#FF9900] hover:bg-[#e68900] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              {pick.ctaLabel || "Check price on Amazon"}
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
