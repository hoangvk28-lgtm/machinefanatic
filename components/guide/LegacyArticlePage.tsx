import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { RichContent } from "@/components/ui/RichContent";
import { getDefaultAuthor } from "@/data/authors";
import { SITE_URL } from "@/lib/seo";

// Restored root-level articles (old machinefanatic.com URLs with backlinks).
// data/legacy/<slug>.ts exports this shape; html may contain <!--product:ID-->
// markers that render as inline product cards.

export interface LegacyProduct {
  id: string;
  name: string;
  imageUrl: string;
  amazonUrl: string;
  label: string;
  why: string;
}

export interface LegacyArticleModule {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  kicker: string;
  heroImage: { src: string; alt: string };
  lastUpdated: string;
  readTime: string;
  quickAnswer?: string;
  html: string;
  products?: LegacyProduct[];
  imageCredits?: { image: string; author: string; license: string; source: string }[];
  relatedLinks?: { title: string; href: string }[];
}

const PRODUCT_MARKER = /<!--product:([a-z0-9-]+)-->/g;

function ProductCard({ p }: { p: LegacyProduct }) {
  return (
    <aside className="not-prose my-8 flex flex-col sm:flex-row gap-5 items-center rounded-card border border-border bg-surface p-5 shadow-card">
      <a href={p.amazonUrl} target="_blank" rel="noopener noreferrer sponsored" className="w-36 h-36 shrink-0 bg-white rounded-lg flex items-center justify-center">
        <Image src={p.imageUrl} alt={p.name} width={144} height={144} className="max-h-36 w-auto object-contain" unoptimized />
      </a>
      <div className="min-w-0">
        <p className="mf-spec uppercase text-cta mb-1">{p.label}</p>
        <p className="font-display font-semibold text-ink text-lg leading-snug mb-1.5">{p.name}</p>
        <p className="text-sm text-ink-secondary leading-relaxed mb-3">{p.why}</p>
        <a href={p.amazonUrl} target="_blank" rel="noopener noreferrer sponsored" className="inline-flex items-center px-4 py-2 rounded-btn text-sm font-semibold text-white bg-cta hover:bg-cta-dark">
          Check price on Amazon
        </a>
      </div>
    </aside>
  );
}

export function LegacyArticlePage({ article }: { article: LegacyArticleModule }) {
  const author = getDefaultAuthor();
  const products = article.products ?? [];
  const byId = new Map(products.map((p) => [p.id, p]));
  const parts = article.html.split(PRODUCT_MARKER);
  const toc = [...article.html.matchAll(/<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g)].map((m) => ({ id: m[1], label: m[2].replace(/<[^>]+>/g, "") }));
  const url = `${SITE_URL}/${article.slug}`;

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.metaDescription,
      image: `${SITE_URL}${article.heroImage.src}`,
      datePublished: article.lastUpdated,
      dateModified: article.lastUpdated,
      author: { "@type": "Person", name: author.name, jobTitle: author.role, url: `${SITE_URL}/author/${author.slug}` },
      publisher: { "@type": "Organization", name: "MachineFanatic", url: SITE_URL },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: article.title, item: url },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="relative bg-brand text-ink-inverse overflow-hidden">
        <div className="absolute inset-0 mf-grid-bg" aria-hidden="true" />
        <Container className="relative py-10 sm:py-14">
          <nav className="flex flex-wrap items-center gap-1.5 text-xs text-white/50 mb-6" aria-label="Breadcrumb">
            <Link prefetch={false} href="/" className="!text-white/70 hover:!text-white">Home</Link><span>/</span>
            <span className="text-white/80">{article.title}</span>
          </nav>
          <div className="grid lg:grid-cols-[1fr_420px] gap-10 items-center">
            <div>
              <p className="mf-spec uppercase text-cta mb-3">{article.kicker} · {article.readTime} read · Updated {article.lastUpdated}</p>
              <h1 className="text-white text-3xl sm:text-5xl leading-[1.08] tracking-tight mb-4">{article.title}</h1>
              <p className="text-lg text-white/70 max-w-2xl">{article.metaDescription}</p>
              <Link prefetch={false} href={`/author/${author.slug}`} className="group inline-flex items-center gap-3 mt-6">
                <span className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-cta shrink-0">
                  <Image src={author.avatarUrl!} alt={author.name} fill sizes="44px" className="object-cover" />
                </span>
                <span className="leading-tight">
                  <span className="block text-sm font-semibold !text-white group-hover:!text-cta">By {author.name}</span>
                  <span className="block mf-spec text-white/55">{author.role}</span>
                </span>
              </Link>
            </div>
            <div className="relative rounded-card overflow-hidden aspect-[4/3] bg-white">
              <Image src={article.heroImage.src} alt={article.heroImage.alt} fill sizes="(max-width: 1024px) 100vw, 420px" className="object-cover" priority />
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-10">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_240px] gap-10">
          <div className="min-w-0 max-w-3xl">
            {article.quickAnswer && (
              <aside className="mb-10 rounded-card border-l-4 border-cta bg-surface p-6 shadow-card">
                <p className="mf-spec uppercase text-cta mb-2">Quick answer</p>
                <p className="text-[17px] leading-relaxed text-ink">{article.quickAnswer}</p>
              </aside>
            )}

            <article className="mf-article">
              {parts.map((part, i) => {
                if (i % 2 === 1) {
                  const p = byId.get(part);
                  return p ? <ProductCard key={`p-${i}`} p={p} /> : null;
                }
                return part.trim() ? <RichContent key={`h-${i}`} html={part} /> : null;
              })}
            </article>

            <section className="my-14 rounded-card border border-border bg-surface p-6 flex flex-col sm:flex-row gap-5">
              <Link prefetch={false} href={`/author/${author.slug}`} className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-cta/30 shrink-0">
                <Image src={author.avatarUrl!} alt={`${author.name}, ${author.role}`} fill sizes="96px" className="object-cover" />
              </Link>
              <div>
                <p className="mf-spec uppercase text-cta mb-1">About the author</p>
                <Link prefetch={false} href={`/author/${author.slug}`} className="font-display text-xl font-semibold !text-ink hover:!text-cta">{author.name}</Link>
                <p className="text-sm text-ink-muted mb-2">{author.role}, MachineFanatic</p>
                <p className="text-[15px] text-ink-secondary leading-relaxed">{author.bio}</p>
              </div>
            </section>

            {article.relatedLinks && article.relatedLinks.length > 0 && (
              <section className="mb-12">
                <p className="mf-spec uppercase text-cta mb-2">Keep reading</p>
                <h2 className="text-2xl mb-4">Related on MachineFanatic</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {article.relatedLinks.map((g) => (
                    <Link prefetch={false} key={g.href} href={g.href} className="flex items-center justify-between gap-3 p-4 rounded-card border border-border bg-surface hover:border-cta group">
                      <span className="font-semibold text-ink text-sm group-hover:text-cta">{g.title}</span>
                      <span className="text-cta" aria-hidden="true">&rarr;</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {article.imageCredits && article.imageCredits.length > 0 && (
              <section className="border-t border-border pt-6">
                <p className="mf-spec uppercase text-ink-muted mb-2">Image credits</p>
                <ul className="text-xs text-ink-muted space-y-1">
                  {article.imageCredits.map((c) => (
                    <li key={c.image}>
                      {c.image}: {c.author}, <a href={c.source} target="_blank" rel="noopener noreferrer" className="underline hover:text-cta">{c.license}</a>, via Wikimedia Commons
                    </li>
                  ))}
                  {products.length > 0 && <li>Product images: Amazon.</li>}
                </ul>
              </section>
            )}
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-4">
              {toc.length > 0 && (
                <nav className="rounded-card border border-border bg-surface p-4" aria-label="On this page">
                  <p className="mf-spec uppercase text-ink-muted mb-3">On this page</p>
                  <ul className="space-y-1">
                    {toc.map((t) => <li key={t.id}><a href={`#${t.id}`} className="block text-sm text-ink-secondary hover:text-cta py-1">{t.label}</a></li>)}
                  </ul>
                </nav>
              )}
              {products[0] && (
                <div className="rounded-card border border-border bg-surface p-4">
                  <p className="mf-spec uppercase text-cta mb-2">{products[0].label}</p>
                  <div className="h-32 flex items-center justify-center mb-3">
                    <Image src={products[0].imageUrl} alt={products[0].name} width={160} height={128} className="h-full w-auto object-contain" unoptimized />
                  </div>
                  <p className="text-sm font-semibold text-ink mb-3 leading-snug">{products[0].name}</p>
                  <a href={products[0].amazonUrl} target="_blank" rel="noopener noreferrer sponsored" className="inline-flex px-3 py-2 rounded-btn text-xs font-semibold text-white bg-cta hover:bg-cta-dark">Check price</a>
                </div>
              )}
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
