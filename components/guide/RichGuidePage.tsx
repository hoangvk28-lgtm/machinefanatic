import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { AtAGlance } from "@/components/product/AtAGlance";
import { SITE_URL } from "@/lib/seo";
import { getDefaultAuthor } from "@/data/authors";

// ─── Shared shape of a data/guides/<slug>.ts module ────────────────────────────
// Mirrors the template baked per-guide by scripts/generate-guide-page.mjs.
// Any data/guides/<slug>.ts file already matches this shape structurally.

export interface RichGuideProduct {
  id: string;
  rank: number;
  badge: string;
  name: string;
  amazonUrl: string;
  imageUrl: string;
  price?: string;
  ctaLabel?: string;
  shortCtaLabel?: string;
  specs: string[];
  specList?: { label: string; value: string }[];
  description: string;
  bestFor: string;
  pros: string[];
  cons: string[];
}

export interface RichHowToChooseSection {
  subheading: string;
  intro?: string;
  table?: { headers: string[]; rows: string[][] };
  cards?: { label: string; text: string }[];
  note?: string;
}

export interface RichGuideModule {
  guideTitle: string;
  metaTitle: string;
  metaDescription: string;
  lastUpdated: string;
  readTime: string;
  heroImage: string;
  products: RichGuideProduct[];
  buyingCriteria: { criterion: string; explanation: string }[];
  howWeEvaluated: { title: string; description: string }[];
  howToChoose: RichHowToChooseSection[];
  faq: { q: string; a: string }[];
  relatedGuides: { title: string; href: string }[];
  mainKeyword?: string;
  introParagraphs?: string[];
  expertTake?: string;
  specDecoder?: { spec: string; meaning: string; watchFor: string }[];
  maintenance?: { task: string; interval: string; why: string }[];
}

function toBreadcrumbTitle(guideTitle: string) {
  return guideTitle.replace(/^\d+\s+/, "").replace(/\s+in\s+2026$/i, "");
}

function toAmazonSearchQuery(mainKeyword: string | undefined, slug: string) {
  const kw = mainKeyword || slug.replace(/^best-/, "").replace(/-/g, " ");
  return kw.replace(/\s+/g, "+");
}

function singularize(words: string) {
  if (/ies$/i.test(words)) return words.replace(/ies$/i, "y");
  if (/(ches|shes|xes|sses)$/i.test(words)) return words.replace(/es$/i, "");
  if (/s$/i.test(words) && !/ss$/i.test(words)) return words.replace(/s$/i, "");
  return words;
}

// Singularizes the head noun only: "Blenders for Crushing Ice" -> "Blender for Crushing Ice".
function toProductNounSingular(breadcrumbTitle: string) {
  const words = breadcrumbTitle.replace(/^Best\s+/i, "").trim();
  const m = words.match(/^(.*?)(\s+(?:for|with|under|without|in|on|that)\s+.*)$/i);
  return m ? singularize(m[1]) + m[2] : singularize(words);
}

const AMAZON_ICON = (
  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.26 18.36C9.18 20.34 4.76 21.38 1 20.16c-.38-.13-.33-.44.08-.35 3.47.67 7.77-.07 10.6-1.82.47-.27.87.17.58.37zm1.06-1.17c-.43-.56-2.85-.27-3.94-.13-.33.04-.38-.25-.08-.46 1.93-1.36 5.1-.97 5.47-.51.37.46-.1 3.63-1.91 5.14-.28.23-.54.11-.42-.2.41-.98 1.32-3.28.88-3.84z" />
  </svg>
);

function BuyButton({ href, label, compact = false }: { href: string; label: string; compact?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`inline-flex items-center justify-center gap-2 rounded-btn font-semibold text-white bg-cta hover:bg-cta-dark transition-colors ${compact ? "px-3 py-2 text-xs" : "px-5 py-3 text-sm"}`}
    >
      {AMAZON_ICON}
      {label}
    </a>
  );
}

function SectionTitle({ kicker, title, sub, id }: { kicker: string; title: string; sub?: string; id?: string }) {
  return (
    <div className="mb-6" id={id}>
      <p className="mf-spec uppercase text-cta mb-1.5">{kicker}</p>
      <h2 className="text-2xl sm:text-3xl tracking-tight">{title}</h2>
      {sub && <p className="text-sm text-ink-secondary mt-2 max-w-2xl">{sub}</p>}
    </div>
  );
}

function ProductSection({ product }: { product: RichGuideProduct }) {
  return (
    <section id={product.id} className="mb-12 scroll-mt-24">
      <article className="rounded-card border border-border bg-surface overflow-hidden shadow-card">
        <header className="flex items-center gap-4 px-5 py-4 bg-brand text-white">
          <span className="font-display text-3xl font-bold text-cta leading-none tabular-nums">{String(product.rank).padStart(2, "0")}</span>
          <div className="min-w-0">
            <p className="mf-spec uppercase text-white/60">{product.badge}</p>
            <h3 className="text-lg sm:text-xl text-white leading-snug break-words">{product.name}</h3>
          </div>
        </header>

        <div className="grid md:grid-cols-[260px_1fr]">
          <div className="p-5 border-b md:border-b-0 md:border-r border-border flex flex-col gap-4">
            <a href={product.amazonUrl} target="_blank" rel="noopener noreferrer sponsored" className="flex items-center justify-center h-56 rounded-lg bg-white">
              <Image src={product.imageUrl} alt={product.name} width={240} height={220} className="object-contain w-full h-full" unoptimized />
            </a>
            <div className="flex flex-wrap gap-1.5">
              {product.specs.map((spec, i) => (
                <span key={i} className="mf-spec px-2 py-1 rounded bg-bg border border-border text-ink">{spec}</span>
              ))}
            </div>
            <BuyButton href={product.amazonUrl} label={product.ctaLabel ?? "Check price on Amazon"} />
          </div>

          <div className="p-5 sm:p-6">
            <div className="mb-4 rounded-lg bg-cta-light border border-cta/20 px-4 py-3 text-sm text-ink">
              <span className="font-semibold">Best for:</span> {product.bestFor}
            </div>
            <div className="space-y-3 mb-5">
              {product.description.split("\n\n").map((para, i) => (
                <p key={i} className="text-[15px] text-ink-secondary leading-relaxed">{para}</p>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-lg border border-green-200 bg-green-50/60 p-4">
                <p className="mf-spec uppercase text-green-700 mb-2">What works</p>
                <ul className="space-y-1.5">
                  {product.pros.map((pro, i) => (
                    <li key={i} className="flex gap-2 text-sm text-ink"><span className="text-green-700 font-bold" aria-hidden="true">+</span>{pro}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-4">
                <p className="mf-spec uppercase text-amber-700 mb-2">Watch out for</p>
                <ul className="space-y-1.5">
                  {product.cons.map((con, i) => (
                    <li key={i} className="flex gap-2 text-sm text-ink"><span className="text-amber-700 font-bold" aria-hidden="true">&minus;</span>{con}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {product.specList && product.specList.length > 0 && (
          <div className="border-t border-border bg-bg/60">
            <p className="mf-spec uppercase text-ink-muted px-5 pt-4">Spec sheet</p>
            <dl className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 px-5 pb-4 pt-2">
              {product.specList.map((spec, i) => (
                <div key={i} className="flex justify-between gap-3 py-2 border-b border-dashed border-border-dark/60 text-sm">
                  <dt className="text-ink-secondary">{spec.label}</dt>
                  <dd className="mf-spec text-ink text-right">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </article>
    </section>
  );
}

export function RichGuidePage({ slug, guide }: { slug: string; guide: RichGuideModule }) {
  const {
    guideTitle, metaDescription, lastUpdated, readTime, heroImage, products, buyingCriteria,
    howWeEvaluated, howToChoose, faq, relatedGuides, mainKeyword, introParagraphs,
    expertTake, specDecoder = [], maintenance = [],
  } = guide;

  const author = getDefaultAuthor();
  const breadcrumbTitle = toBreadcrumbTitle(guideTitle).replace(/\s*\(2026\)$/, "");
  const amazonQuery = toAmazonSearchQuery(mainKeyword, slug);
  const productNoun = toProductNounSingular(breadcrumbTitle);
  const productNounPlural = breadcrumbTitle.replace(/^Best\s+/i, "").trim();
  const intro = introParagraphs && introParagraphs.length > 0
    ? introParagraphs
    : [`This guide covers the top picks for ${mainKeyword || guideTitle.toLowerCase()}, compared on published specs and design.`];

  const toc = [
    { id: "top-picks", label: "Top picks" },
    { id: "buying-criteria", label: "What to look for", show: buyingCriteria.length > 0 },
    { id: "reviews", label: "Detailed reviews" },
    { id: "spec-decoder", label: "Spec sheet decoder", show: specDecoder.length > 0 },
    { id: "how-we-evaluated", label: "How we evaluated", show: howWeEvaluated.length > 0 },
    { id: "how-to-choose", label: "How to choose", show: howToChoose.length > 0 },
    { id: "maintenance", label: "Maintenance schedule", show: maintenance.length > 0 },
    { id: "faq", label: "FAQ", show: faq.length > 0 },
  ].filter((t) => t.show !== false);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guideTitle,
    description: metaDescription,
    datePublished: lastUpdated,
    dateModified: lastUpdated,
    author: { "@type": "Person", name: author.name, jobTitle: author.role, url: `${SITE_URL}/author/${author.slug}`, image: `${SITE_URL}${author.avatarUrl}` },
    publisher: { "@type": "Organization", name: "MachineFanatic", url: SITE_URL },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/guide/${slug}` },
    image: heroImage,
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Buying Guides", item: `${SITE_URL}/guide` },
      { "@type": "ListItem", position: 3, name: breadcrumbTitle, item: `${SITE_URL}/guide/${slug}` },
    ],
  };
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: guideTitle,
    numberOfItems: products.length,
    itemListElement: products.map((p) => ({ "@type": "ListItem", position: p.rank, name: p.name, url: `${SITE_URL}/guide/${slug}#${p.id}` })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      {/* Header band */}
      <section className="relative bg-brand text-ink-inverse overflow-hidden">
        <div className="absolute inset-0 mf-grid-bg" aria-hidden="true" />
        <Container className="relative py-10 sm:py-14">
          <nav className="flex flex-wrap items-center gap-1.5 text-xs text-white/50 mb-6" aria-label="Breadcrumb">
            <Link prefetch={false} href="/" className="!text-white/70 hover:!text-white">Home</Link><span>/</span>
            <Link prefetch={false} href="/guide" className="!text-white/70 hover:!text-white">Buying Guides</Link><span>/</span>
            <span className="text-white/80">{breadcrumbTitle}</span>
          </nav>
          <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-center">
            <div>
              <p className="mf-spec uppercase text-cta mb-3">Buying guide · {readTime} read · Updated {lastUpdated}</p>
              <h1 className="text-white text-3xl sm:text-5xl leading-[1.08] tracking-tight mb-4">{guideTitle}</h1>
              <p className="text-lg text-white/70 max-w-2xl">{metaDescription}</p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-6">
                <Link prefetch={false} href={`/author/${author.slug}`} className="group flex items-center gap-3">
                  <span className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-cta shrink-0">
                    <Image src={author.avatarUrl!} alt={author.name} fill sizes="44px" className="object-cover" />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-sm font-semibold !text-white group-hover:!text-cta">By {author.name}</span>
                    <span className="block mf-spec text-white/55">{author.role}</span>
                  </span>
                </Link>
                <span className="mf-spec text-white/60">{products.length} machines compared</span>
                <span className="mf-spec text-white/60">Spec-sheet verified</span>
              </div>
            </div>
            <div className="rounded-card bg-white p-4 h-64 flex items-center justify-center">
              <Image src={heroImage} alt={breadcrumbTitle} width={420} height={260} className="w-full h-full object-contain" priority unoptimized />
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-10">

        <div className="grid lg:grid-cols-[minmax(0,1fr)_240px] gap-10">
          <div className="min-w-0">
            {expertTake && (
              <aside className="mb-10 rounded-card border-l-4 border-cta bg-surface p-6 shadow-card">
                <p className="mf-spec uppercase text-cta mb-2">Expert&apos;s take</p>
                <p className="text-[17px] leading-relaxed text-ink">{expertTake}</p>
              </aside>
            )}

            <section id="top-picks" className="mb-12 scroll-mt-24">
              <SectionTitle kicker="At a glance" title="Our top picks" />
              <AtAGlance
                items={products.map((product, i) => ({
                  rank: i + 1,
                  badge: product.badge,
                  name: product.name,
                  imageUrl: product.imageUrl,
                  affiliateUrl: product.amazonUrl,
                  pros: product.pros.map((text) => ({ text })),
                  cons: product.cons.map((text) => ({ text, severity: "minor" as const })),
                  anchorId: product.id,
                }))}
              />
            </section>

            <section className="mb-12 space-y-4 text-[17px] text-ink-secondary leading-relaxed">
              {intro.map((p, i) => <p key={i}>{p}</p>)}
            </section>

            {buyingCriteria.length > 0 && (
              <section id="buying-criteria" className="mb-14 scroll-mt-24">
                <SectionTitle kicker="Before you buy" title={`${buyingCriteria.length} Criteria to Look For Before Buying ${/^[aeiou]/i.test(productNoun) ? "an" : "a"} ${productNoun}`} />
                <ol className="space-y-4">
                  {buyingCriteria.map((item, i) => (
                    <li key={i} className="rounded-card border border-border bg-surface p-5 flex gap-4">
                      <span className="mf-spec shrink-0 w-8 h-8 rounded bg-brand text-cta flex items-center justify-center">{String(i + 1).padStart(2, "0")}</span>
                      <div>
                        <h3 className="text-lg mb-1.5">{item.criterion}</h3>
                        {item.explanation.split("\n\n").map((para, j) => (
                          <p key={j} className={`text-[15px] text-ink-secondary leading-relaxed ${j > 0 ? "mt-2" : ""}`}>{para}</p>
                        ))}
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            <div id="reviews" className="scroll-mt-24">
              <SectionTitle kicker="Detailed reviews" title={`The ${products.length} best ${productNounPlural.toLowerCase()}, explained`} />
              {products.map((product) => <ProductSection key={product.id} product={product} />)}
            </div>

            {specDecoder.length > 0 && (
              <section id="spec-decoder" className="mb-14 scroll-mt-24">
                <SectionTitle kicker="Spec sheet decoder" title="What the numbers on the box really mean" sub="The specs manufacturers lead with, translated into what they tell you about real-world performance." />
                <div className="rounded-card border border-border overflow-hidden bg-surface divide-y divide-border">
                  {specDecoder.map((d, i) => (
                    <div key={i} className="grid md:grid-cols-[180px_1fr] gap-3 p-5">
                      <p className="mf-spec text-sm text-ink font-semibold">{d.spec}</p>
                      <div>
                        <p className="text-[15px] text-ink-secondary leading-relaxed">{d.meaning}</p>
                        <p className="mt-2 text-sm text-ink"><span className="mf-spec uppercase text-amber-700 mr-1">Watch for</span>{d.watchFor}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {howWeEvaluated.length > 0 && (
              <section id="how-we-evaluated" className="mb-14 scroll-mt-24">
                <SectionTitle kicker="Methodology" title={`How We Evaluated These ${productNounPlural}`} />
                <div className="grid sm:grid-cols-2 gap-4">
                  {howWeEvaluated.map((item, i) => (
                    <div key={i} className="rounded-card border border-border bg-surface p-5">
                      <h3 className="text-base mb-1.5">{item.title}</h3>
                      <p className="text-sm text-ink-secondary leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {howToChoose.length > 0 && (
              <section id="how-to-choose" className="mb-14 scroll-mt-24">
                <SectionTitle kicker="Decision guide" title={`How to Choose the Right ${productNounPlural}`} />
                <div className="space-y-10">
                  {howToChoose.map((sub, i) => (
                    <div key={i}>
                      <h3 className="text-xl mb-3">{sub.subheading}</h3>
                      {sub.intro && <p className="text-[15px] text-ink-secondary leading-relaxed mb-4">{sub.intro}</p>}
                      {sub.table && (
                        <div className="overflow-x-auto rounded-card border border-border mb-3 bg-surface">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-brand text-white">
                                {sub.table.headers.map((h, hi) => <th key={hi} className="text-left px-4 py-3 font-semibold mf-spec uppercase">{h}</th>)}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {sub.table.rows.map((row, ri) => (
                                <tr key={ri} className="hover:bg-cta-light/40">
                                  {row.map((cell, ci) => <td key={ci} className={`px-4 py-3 align-top ${ci === 0 ? "text-ink font-medium" : "text-ink-secondary"}`}>{cell}</td>)}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                      {sub.cards && (
                        <div className="grid sm:grid-cols-2 gap-4 mb-3">
                          {sub.cards.map((c, ci) => (
                            <div key={ci} className="rounded-card border border-border bg-surface p-5 border-t-4 border-t-cta">
                              <p className="font-display font-semibold text-ink mb-1.5">{c.label}</p>
                              <p className="text-sm text-ink-secondary leading-relaxed">{c.text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      {sub.note && <p className="text-sm text-ink bg-accent-light/60 border border-accent/30 rounded-lg px-4 py-3">{sub.note}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {maintenance.length > 0 && (
              <section id="maintenance" className="mb-14 scroll-mt-24">
                <SectionTitle kicker="Ownership" title="Maintenance schedule" sub="The upkeep that decides whether this machine lasts two seasons or ten." />
                <div className="overflow-x-auto rounded-card border border-border bg-surface">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-brand text-white">
                        <th className="text-left px-4 py-3 mf-spec uppercase">Task</th>
                        <th className="text-left px-4 py-3 mf-spec uppercase">Interval</th>
                        <th className="text-left px-4 py-3 mf-spec uppercase">Why it matters</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {maintenance.map((m, i) => (
                        <tr key={i}>
                          <td className="px-4 py-3 align-top font-medium text-ink">{m.task}</td>
                          <td className="px-4 py-3 align-top mf-spec text-cta whitespace-nowrap">{m.interval}</td>
                          <td className="px-4 py-3 align-top text-ink-secondary">{m.why}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {faq.length > 0 && (
              <section id="faq" className="mb-14 scroll-mt-24">
                <SectionTitle kicker="FAQ" title="Frequently Asked Questions" />
                <div className="space-y-3">
                  {faq.map((item, i) => (
                    <details key={i} className="group rounded-card border border-border bg-surface open:shadow-card" open={i === 0}>
                      <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-5 py-4 font-display font-semibold text-ink">
                        {item.q}
                        <span className="text-cta text-xl leading-none transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                      </summary>
                      <p className="px-5 pb-5 text-[15px] text-ink-secondary leading-relaxed">{item.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            <section className="mb-14 rounded-card bg-brand text-ink-inverse p-6 sm:p-8">
              <p className="mf-spec uppercase text-cta mb-2">Bottom line</p>
              <h2 className="text-white text-2xl mb-5">The short version</h2>
              <ul className="space-y-3">
                {products.map((p) => (
                  <li key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3 last:border-0">
                    <div>
                      <p className="mf-spec uppercase text-white/50">{p.badge}</p>
                      <a href={`#${p.id}`} className="text-white font-semibold hover:text-cta">{p.name}</a>
                    </div>
                    <BuyButton href={p.amazonUrl} label={p.shortCtaLabel ?? "Check price"} compact />
                  </li>
                ))}
              </ul>
              <a href={`https://www.amazon.com/s?k=${amazonQuery}&tag=machinefanatic-20`} target="_blank" rel="noopener noreferrer sponsored" className="inline-block mt-6 text-sm text-white/70 hover:text-white underline underline-offset-4">
                Browse more {productNounPlural.toLowerCase()} on Amazon &rarr;
              </a>
            </section>

            <section className="mb-14 rounded-card border border-border bg-surface p-6 flex flex-col sm:flex-row gap-5">
              <Link prefetch={false} href={`/author/${author.slug}`} className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-cta/30 shrink-0">
                <Image src={author.avatarUrl!} alt={`${author.name}, ${author.role}`} fill sizes="96px" className="object-cover" />
              </Link>
              <div>
                <p className="mf-spec uppercase text-cta mb-1">About the author</p>
                <Link prefetch={false} href={`/author/${author.slug}`} className="font-display text-xl font-semibold !text-ink hover:!text-cta">{author.name}</Link>
                <p className="text-sm text-ink-muted mb-2">{author.role}, MachineFanatic</p>
                <p className="text-[15px] text-ink-secondary leading-relaxed">{author.bio}</p>
                <Link prefetch={false} href={`/author/${author.slug}`} className="inline-block mt-3 text-sm font-semibold text-cta hover:text-cta-dark">More from {author.name.split(" ")[0]} →</Link>
              </div>
            </section>

            {relatedGuides.length > 0 && (
              <section>
                <SectionTitle kicker="Keep reading" title="Related guides" />
                <div className="grid sm:grid-cols-2 gap-3">
                  {relatedGuides.map((g) => (
                    <Link prefetch={false} key={g.href} href={g.href} className="flex items-center justify-between gap-3 p-4 rounded-card border border-border bg-surface hover:border-cta transition-colors group">
                      <span className="font-semibold text-ink text-sm group-hover:text-cta">{g.title}</span>
                      <span className="text-cta" aria-hidden="true">&rarr;</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sticky sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-4">
              <nav className="rounded-card border border-border bg-surface p-4" aria-label="On this page">
                <p className="mf-spec uppercase text-ink-muted mb-3">On this page</p>
                <ul className="space-y-1">
                  {toc.map((t) => (
                    <li key={t.id}><a href={`#${t.id}`} className="block text-sm text-ink-secondary hover:text-cta py-1">{t.label}</a></li>
                  ))}
                </ul>
              </nav>
              {products[0] && (
                <div className="rounded-card border border-border bg-surface p-4">
                  <p className="mf-spec uppercase text-cta mb-2">Top pick</p>
                  <div className="h-32 flex items-center justify-center mb-3">
                    <Image src={products[0].imageUrl} alt={products[0].name} width={160} height={128} className="h-full w-auto object-contain" unoptimized />
                  </div>
                  <p className="text-sm font-semibold text-ink mb-3 leading-snug">{products[0].name}</p>
                  <BuyButton href={products[0].amazonUrl} label="Check price" compact />
                </div>
              )}
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
