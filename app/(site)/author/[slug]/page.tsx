import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { getAuthorBySlug, authors } from "@/data/authors";
import { categories } from "@/data/categories";
import { getPublicGuides } from "@/lib/public-guides";
import { buildMetadata, SITE_URL } from "@/lib/seo";

export const revalidate = 604800;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return authors.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) return {};
  return buildMetadata({
    title: `${author.name}, ${author.role}`,
    description: author.bio.length > 160 ? author.bio.slice(0, author.bio.lastIndexOf(" ", 157)) + "." : author.bio,
    path: `/author/${slug}`,
    image: author.avatarUrl,
  });
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) notFound();

  const allGuides = await getPublicGuides();
  const authorGuides = allGuides
    .filter((g) => g.author?.toLowerCase() === author.name.toLowerCase())
    .sort((a, b) => (b.lastUpdated ?? "").localeCompare(a.lastUpdated ?? ""));
  const byCategory = categories
    .map((c) => ({ c, n: authorGuides.filter((g) => g.categorySlug === c.slug).length }))
    .filter((x) => x.n > 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      "@id": `${SITE_URL}/author/${slug}#person`,
      name: author.name,
      jobTitle: author.role,
      description: author.bio,
      url: `${SITE_URL}/author/${slug}`,
      ...(author.avatarUrl ? { image: `${SITE_URL}${author.avatarUrl}` } : {}),
      knowsAbout: author.expertise,
      worksFor: { "@type": "Organization", name: "MachineFanatic", url: SITE_URL },
      ...(author.social.length ? { sameAs: author.social.map((s) => s.url) } : {}),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative bg-brand text-ink-inverse overflow-hidden">
        <div className="absolute inset-0 mf-grid-bg" aria-hidden="true" />
        <Container className="relative py-12 sm:py-16">
          <nav className="flex items-center gap-1.5 text-xs text-white/50 mb-8" aria-label="Breadcrumb">
            <Link prefetch={false} href="/" className="!text-white/70 hover:!text-white">Home</Link><span>/</span>
            <span className="text-white/80">Authors</span><span>/</span>
            <span className="text-white/80">{author.name}</span>
          </nav>
          <div className="grid md:grid-cols-[auto_1fr] gap-8 items-center">
            {author.avatarUrl && (
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden ring-4 ring-cta shadow-2xl">
                <Image src={author.avatarUrl} alt={`${author.name}, ${author.role} at MachineFanatic`} fill sizes="192px" className="object-cover" priority />
              </div>
            )}
            <div>
              <p className="mf-spec uppercase text-cta mb-2">{author.role} · MachineFanatic</p>
              <h1 className="text-white mb-4">{author.name}</h1>
              <p className="text-lg text-white/75 max-w-2xl">{author.bio}</p>
              <div className="flex flex-wrap gap-x-8 gap-y-2 mt-6">
                <div><p className="font-display text-3xl text-white">{authorGuides.length}</p><p className="mf-spec uppercase text-white/50">Guides edited</p></div>
                <div><p className="font-display text-3xl text-white">{byCategory.length}</p><p className="mf-spec uppercase text-white/50">Categories</p></div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-12">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-10">
          <div className="min-w-0">
            <section className="mb-12">
              <p className="mf-spec uppercase text-cta mb-2">About</p>
              <h2 className="text-2xl sm:text-3xl mb-5">How {author.name.split(" ")[0]} works</h2>
              <div className="space-y-4 text-[17px] text-ink-secondary leading-relaxed">
                {author.longBio.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </section>

            {author.coverUrl && (
              <figure className="mb-12 rounded-card overflow-hidden border border-border">
                <Image src={author.coverUrl} alt={`${author.name} at a milling machine`} width={1200} height={800} className="w-full h-auto" sizes="(max-width: 1024px) 100vw, 800px" />
              </figure>
            )}

            <section className="mb-12 grid sm:grid-cols-2 gap-4">
              <div className="rounded-card border border-border bg-surface p-5">
                <h3 className="text-lg mb-2">Editorial process</h3>
                <p className="text-sm text-ink-secondary leading-relaxed">{author.editorial.process}</p>
                <Link prefetch={false} href="/how-we-review" className="inline-block mt-3 text-sm font-semibold text-cta hover:text-cta-dark">How we rate machines →</Link>
              </div>
              <div className="rounded-card border border-border bg-surface p-5">
                <h3 className="text-lg mb-2">Independence</h3>
                <p className="text-sm text-ink-secondary leading-relaxed">{author.editorial.independence}</p>
                <Link prefetch={false} href="/affiliate-disclosure" className="inline-block mt-3 text-sm font-semibold text-cta hover:text-cta-dark">Affiliate disclosure →</Link>
              </div>
            </section>

            {authorGuides.length > 0 && (
              <section>
                <p className="mf-spec uppercase text-cta mb-2">Latest work</p>
                <h2 className="text-2xl sm:text-3xl mb-6">Guides by {author.name}</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {authorGuides.map((g) => (
                    <Link prefetch={false} key={g.slug} href={`/guide/${g.slug}`} className="group flex gap-4 rounded-card border border-border bg-surface p-4 hover:border-cta hover:shadow-card-hover transition-all">
                      <div className="relative w-20 h-20 shrink-0 bg-white rounded-lg">
                        {g.heroImage && <Image src={g.heroImage} alt={g.title} fill sizes="80px" className="object-contain p-1.5" />}
                      </div>
                      <div className="min-w-0">
                        <p className="mf-spec uppercase text-ink-muted mb-1">{categories.find((c) => c.slug === g.categorySlug)?.name}</p>
                        <p className="font-display font-semibold text-ink leading-snug group-hover:text-cta">{g.title}</p>
                        <p className="text-xs text-ink-muted mt-1">Updated {g.lastUpdated}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-4">
            <div className="rounded-card border border-border bg-surface p-5">
              <p className="mf-spec uppercase text-ink-muted mb-3">At a glance</p>
              <dl className="space-y-3">
                {author.focus.map((f) => (
                  <div key={f.label}>
                    <dt className="mf-spec uppercase text-cta">{f.label}</dt>
                    <dd className="text-sm text-ink">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="rounded-card border border-border bg-surface p-5">
              <p className="mf-spec uppercase text-ink-muted mb-3">Areas of focus</p>
              <div className="flex flex-wrap gap-2">
                {author.expertise.map((e) => (
                  <span key={e} className="text-xs px-2.5 py-1 rounded bg-bg border border-border text-ink">{e}</span>
                ))}
              </div>
            </div>
            {byCategory.length > 0 && (
              <div className="rounded-card border border-border bg-surface p-5">
                <p className="mf-spec uppercase text-ink-muted mb-3">Coverage</p>
                <ul className="space-y-2">
                  {byCategory.map(({ c, n }) => (
                    <li key={c.slug}>
                      <Link prefetch={false} href={`/categories/${c.slug}`} className="flex justify-between text-sm text-ink hover:text-cta">
                        <span>{c.name}</span><span className="mf-spec text-ink-muted">{n}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </Container>
    </>
  );
}
