import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { RichContent } from "@/components/ui/RichContent";
import { AffiliateDisclosureBar } from "@/components/affiliate/AffiliateDisclosureBar";
import { SITE_URL } from "@/lib/seo";

// ─── Informational guide served via the dynamic registry ───
// data/guides/<slug>.ts exports kind = "info" plus pre-sanitised article HTML.
// [slug]/page.tsx renders these through this component instead of RichGuidePage.
//
// Optional commerce layer (all fields optional so older info guides still render):
// - quickAnswer: short direct answer shown above the article
// - products: picks reused from existing best-X guides; html may contain
//   <!--product:ID--> markers, which are replaced by an inline product card
// - shopGuides: "Ready to buy?" links to the matching best-X roundups

export interface InfoGuideProduct {
  id: string;
  name: string;
  imageUrl: string;
  amazonUrl: string;
  label: string;
  why: string;
  guideHref?: string;
  guideTitle?: string;
}

export interface InfoGuideModule {
  kind: "info";
  guideSlug: string;
  guideTitle: string;
  metaTitle: string;
  metaDescription: string;
  heroImage: string;
  lastUpdated: string;
  readTime: string;
  html: string;
  relatedGuides: { title: string; href: string }[];
  quickAnswer?: string;
  products?: InfoGuideProduct[];
  shopGuides?: { title: string; href: string; blurb: string }[];
}

const PRODUCT_MARKER = /<!--product:([a-z0-9-]+)-->/g;

function InlineProductCard({ product }: { product: InfoGuideProduct }) {
  return (
    <aside className="my-8 flex gap-4 items-center p-4 rounded-2xl border border-border bg-surface">
      <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-xl bg-white border border-border overflow-hidden">
        <Image src={product.imageUrl} alt={product.name} width={112} height={112} className="w-full h-full object-contain p-1" unoptimized />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold uppercase tracking-widest text-brand mb-1">{product.label}</p>
        <p className="font-bold text-ink text-sm leading-snug mb-1 line-clamp-2">{product.name}</p>
        <p className="text-sm text-ink-secondary leading-relaxed mb-3">{product.why}</p>
        <div className="flex flex-wrap items-center gap-3">
          <a href={product.amazonUrl} target="_blank" rel="noopener noreferrer sponsored" className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold text-white" style={{ backgroundColor: "#FF9900" }}>
            Check price on Amazon
          </a>
          {product.guideHref && (
            <Link prefetch={false} href={product.guideHref} className="text-xs font-semibold text-brand hover:underline">
              {product.guideTitle ?? "See the full comparison"}
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}

export function InfoGuidePage({ slug, guide }: { slug: string; guide: InfoGuideModule }) {
  const { guideTitle, metaDescription, lastUpdated, readTime, html, relatedGuides } = guide;
  const products = guide.products ?? [];
  const shopGuides = guide.shopGuides ?? [];
  const byId = new Map(products.map((p) => [p.id, p]));

  // Split article HTML on product markers: even indexes are HTML, odd are product ids.
  const parts = html.split(PRODUCT_MARKER);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guideTitle,
    description: metaDescription,
    datePublished: lastUpdated,
    dateModified: lastUpdated,
    author: { "@type": "Person", name: "Jamie Cole", url: `${SITE_URL}/author/jamie-cole` },
    publisher: { "@type": "Organization", name: "MachineFanatic", url: SITE_URL },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/guide/${slug}` },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE_URL}/guide` },
      { "@type": "ListItem", position: 3, name: guideTitle, item: `${SITE_URL}/guide/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Container className="py-12 max-w-3xl">
        <nav className="flex items-center gap-1.5 text-xs text-ink-muted mb-6">
          <Link prefetch={false} href="/" className="hover:text-brand transition-colors">Home</Link>
          <span>/</span>
          <Link prefetch={false} href="/guide" className="hover:text-brand transition-colors">Guides</Link>
          <span>/</span>
          <span className="text-ink">{guideTitle}</span>
        </nav>

        <header className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-brand">Guide</span>
            <span className="text-ink-muted">&middot;</span>
            <span className="text-xs text-ink-muted">{readTime} read</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-ink leading-tight tracking-tight mb-4">{guideTitle}</h1>
          <p className="text-lg text-ink-secondary leading-relaxed">{metaDescription}</p>
          <p className="text-xs text-ink-muted mt-4">
            By{" "}
            <Link prefetch={false} href="/author/jamie-cole" className="hover:text-brand">Jamie Cole</Link>
            {" "}&middot; Updated {lastUpdated}
          </p>
        </header>

        {products.length > 0 && <AffiliateDisclosureBar className="mb-6" />}

        {guide.quickAnswer && (
          <div className="mb-8 p-5 rounded-2xl border-l-4 border-brand bg-brand-light">
            <p className="text-xs font-bold uppercase tracking-widest text-brand mb-2">Quick answer</p>
            <p className="text-ink leading-relaxed">{guide.quickAnswer}</p>
          </div>
        )}

        <article className="mb-12">
          {parts.map((part, i) => {
            if (i % 2 === 1) {
              const product = byId.get(part);
              return product ? <InlineProductCard key={`p-${i}`} product={product} /> : null;
            }
            return part.trim() ? <RichContent key={`h-${i}`} html={part} /> : null;
          })}
        </article>

        {shopGuides.length > 0 && (
          <section className="mb-12 p-6 rounded-2xl bg-ink text-white">
            <h2 className="text-xl font-bold mb-1 tracking-tight">Ready to buy?</h2>
            <p className="text-sm text-white/70 mb-4">Compare our top-rated picks side by side.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {shopGuides.map((g) => (
                <Link prefetch={false} key={g.href} href={g.href} className="p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                  <p className="font-bold text-sm mb-1">{g.title}</p>
                  <p className="text-xs text-white/70 leading-relaxed">{g.blurb}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {products.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-ink mb-4 tracking-tight">Products Mentioned in This Guide</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {products.map((p) => (
                <div key={p.id} className="flex flex-col p-3 rounded-xl border border-border bg-white">
                  <div className="h-28 mb-2 flex items-center justify-center">
                    <Image src={p.imageUrl} alt={p.name} width={140} height={112} className="max-h-28 w-auto object-contain" unoptimized />
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-brand mb-1">{p.label}</p>
                  <p className="text-xs font-semibold text-ink leading-snug line-clamp-2 mb-3 flex-1">{p.name}</p>
                  <a href={p.amazonUrl} target="_blank" rel="noopener noreferrer sponsored" className="text-center px-3 py-2 rounded-lg text-xs font-bold text-white" style={{ backgroundColor: "#FF9900" }}>
                    Check price
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

        {relatedGuides.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-ink mb-4 tracking-tight">Related Guides</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {relatedGuides.map((g) => (
                <Link prefetch={false} key={g.href} href={g.href} className="p-4 rounded-xl border border-border bg-white hover:border-brand transition-colors">
                  <p className="font-bold text-ink text-sm">{g.title}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </Container>
    </>
  );
}
