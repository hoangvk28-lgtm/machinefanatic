import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { buildMetadata } from "@/lib/seo";
import { scoreToColor } from "@/lib/utils";
import { getPublicProducts } from "@/lib/public-products";
import { categories } from "@/data/categories";

export const revalidate = 604800;

export const metadata: Metadata = buildMetadata({
  title: "Product Reviews - Easier-to-Use Home Products",
  description:
    "Individual product reviews for easy kitchen, easy cleaning, simple tech, and garden & yard products, scored on ease of use and real ownership value.",
  path: "/reviews",
});

export default async function ReviewsIndexPage() {
  const products = await getPublicProducts();

  // Group products by category for proper heading hierarchy and richer page content
  const productsByCategory = categories.map((cat) => ({
    category: cat,
    products: products.filter((p) => p.categorySlug === cat.slug),
  })).filter((g) => g.products.length > 0);

  const knownSlugs = new Set(categories.map((c) => c.slug));
  const uncategorised = products.filter((p) => !knownSlugs.has(p.categorySlug));

  return (
    <Container className="py-14">
      <div className="mb-10 max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-widest text-brand">Reviews</span>
        <h1 className="text-4xl font-bold text-ink mt-3 mb-4 tracking-tight">All Product Reviews</h1>
        <p className="text-lg text-ink-secondary leading-relaxed">
          Individual evaluations for every product we&apos;ve assessed, with scores, pros and cons, full specs, and direct Amazon links. Organized by category below.
        </p>
      </div>

      <div className="space-y-14">
        {productsByCategory.map(({ category, products: catProducts }) => (
          <section key={category.slug} aria-labelledby={`rev-cat-${category.slug}`}>
            <div className="mb-6">
              <h2 id={`rev-cat-${category.slug}`} className="text-2xl font-bold text-ink tracking-tight mb-2">
                {category.name}
              </h2>
              <p className="text-sm text-ink-secondary max-w-2xl">{category.shortDescription}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {catProducts.map((product) => (
          <div
            key={product.id}
            className="group flex flex-col bg-white rounded-card border border-border hover:shadow-card-hover hover:border-brand/20 transition-all overflow-hidden"
          >
            {/* Thumbnail */}
            <Link prefetch={false} href={`/reviews/${product.slug}`} className="block relative w-full h-44 overflow-hidden bg-bg">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-ink-muted/30">
                  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zm-9 9H7v-2h4v2zm6-4H7v-2h10v2z"/></svg>
                </div>
              )}
              {product.badge && (
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-brand text-white text-[10px] font-bold uppercase tracking-wide rounded-full">
                  {product.badge}
                </span>
              )}
            </Link>

            {/* Top meta bar */}
            <div className="flex items-center justify-between px-5 pt-3 pb-0">
              <span className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">
                {product.subcategorySlug.replace(/-/g, " ")}
              </span>
            </div>

            {/* Main content */}
            <div className="flex flex-col gap-2.5 p-5 flex-1">
              <Link prefetch={false} href={`/reviews/${product.slug}`}>
                <h3 className="font-bold text-ink group-hover:text-brand transition-colors text-base leading-snug">
                  {product.name}
                </h3>
              </Link>

              <p className="text-sm text-ink-secondary leading-relaxed line-clamp-2 flex-1">
                {product.shortDescription}
              </p>

              {/* Key "best for" item */}
              {product.bestFor?.[0] && (
                <div className="flex items-start gap-1.5">
                  <svg className="w-3.5 h-3.5 text-cta shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span className="text-xs text-ink-secondary line-clamp-1">{product.bestFor[0]}</span>
                </div>
              )}

              {/* Score + price + CTA */}
              <div className="pt-3 border-t border-border mt-auto space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-bold tabular-nums ${scoreToColor(product.scores.overall)}`}>
                      {product.scores.overall.toFixed(1)}
                    </span>
                    <span className="text-xs text-ink-muted">/10</span>
                  </div>
                  <span className="font-bold text-ink text-base">{product.priceRange}</span>
                </div>
                <Link prefetch={false}
                  href={`/reviews/${product.slug}`}
                  className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg border border-brand/30 bg-brand-light text-brand text-sm font-semibold hover:bg-brand hover:text-white transition-all"
                >
                  Read review
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ))}
            </div>
          </section>
        ))}

        {uncategorised.length > 0 && (
          <section aria-labelledby="rev-cat-other">
            <h2 id="rev-cat-other" className="text-2xl font-bold text-ink tracking-tight mb-6 sr-only">More Reviews</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {uncategorised.map((product) => (
                <Link prefetch={false} key={product.id} href={`/reviews/${product.slug}`}
                  className="group flex flex-col bg-white rounded-card border border-border hover:shadow-card-hover hover:border-brand/20 transition-all overflow-hidden p-4">
                  <h3 className="font-bold text-ink group-hover:text-brand transition-colors text-sm">{product.name}</h3>
                  <p className="text-xs text-ink-secondary mt-1 line-clamp-2">{product.shortDescription}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </Container>
  );
}


