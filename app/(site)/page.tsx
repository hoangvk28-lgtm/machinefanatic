import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { categories } from "@/data/categories";
import { getPublicGuides } from "@/lib/public-guides";
import { RATING_CRITERIA } from "@/lib/brand";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 604800;

export const metadata: Metadata = buildMetadata({
  title: "Expert Machine and Power Tool Buying Guides",
  description:
    "Spec-driven buying guides for power tools, outdoor power equipment, shop machines and kitchen machines. We compare motors, output, build and upkeep.",
  path: "/",
});

const CATEGORY_SPECS: Record<string, string[]> = {
  "power-tools": ["Torque", "RPM", "Battery Ah"],
  "outdoor-power": ["cc / Volts", "Cut width", "CFM / MPH"],
  "shop-garage": ["CFM @ 90 PSI", "Duty cycle", "Running watts"],
  "kitchen-machines": ["Bar pressure", "Motor watts", "Capacity"],
  "home-machines": ["Suction Pa", "Pints / day", "CADR"],
};

export default async function HomePage() {
  const guides = await getPublicGuides();
  const latest = [...guides].sort((a, b) => (b.lastUpdated ?? "").localeCompare(a.lastUpdated ?? "")).slice(0, 6);
  const countFor = (slug: string) => guides.filter((g) => g.categorySlug === slug).length;

  return (
    <>
      {/* Hero */}
      <section className="relative bg-brand text-ink-inverse overflow-hidden">
        <div className="absolute inset-0 mf-grid-bg" aria-hidden="true" />
        <div className="absolute -right-32 -top-32 w-[28rem] h-[28rem] rounded-full bg-cta/20 blur-3xl" aria-hidden="true" />
        <Container className="relative py-16 md:py-24 grid lg:grid-cols-[1.3fr_1fr] gap-12 items-center">
          <div>
            <p className="mf-spec uppercase text-cta mb-4">Expert machine buying guides</p>
            <h1 className="text-white leading-[1.05] mb-5">
              Buy the right machine <span className="text-cta">the first time.</span>
            </h1>
            <p className="text-lg text-white/70 max-w-xl mb-8">
              We read the spec sheets, decode the ratings and compare motors, output and build quality, so you know exactly what you are paying for before you buy.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link prefetch={false} href="/guide/all" className="inline-flex items-center gap-2 px-5 py-3 rounded-btn bg-cta hover:bg-cta-dark text-white font-semibold transition-colors">
                Browse buying guides <span aria-hidden="true">→</span>
              </Link>
              <Link prefetch={false} href="/how-we-review" className="inline-flex items-center px-5 py-3 rounded-btn border border-white/25 hover:bg-white/10 text-white font-semibold transition-colors">
                How we rate machines
              </Link>
            </div>
          </div>
          <div className="rounded-card border border-white/15 bg-white/[0.04] backdrop-blur p-6">
            <p className="mf-spec uppercase text-white/50 mb-4">Machine Score weighting</p>
            <ul className="space-y-3">
              {RATING_CRITERIA.map((c) => (
                <li key={c.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/85">{c.label}</span>
                    <span className="mf-spec text-cta">{c.weight}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10">
                    <div className="h-1.5 rounded-full bg-cta" style={{ width: `${c.weight * 3.33}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <Container>
        {/* Categories */}
        <section className="py-14">
          <p className="mf-spec uppercase text-cta mb-2">Categories</p>
          <h2 className="mb-8">Pick your machine category</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {categories.map((c) => (
              <Link prefetch={false} key={c.slug} href={`/categories/${c.slug}`} className="group rounded-card bg-surface border border-border p-5 hover:border-cta hover:shadow-card-hover transition-all">
                <div className="flex items-center justify-between mb-6">
                  <span className="mf-spec text-ink-muted">{String(countFor(c.slug)).padStart(3, "0")} guides</span>
                  <span className="text-cta transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                </div>
                <h3 className="text-lg mb-2">{c.name}</h3>
                <p className="text-sm text-ink-secondary mb-4">{c.shortDescription}</p>
                <div className="flex flex-wrap gap-1.5">
                  {(CATEGORY_SPECS[c.slug] ?? []).map((s) => (
                    <span key={s} className="mf-spec px-2 py-0.5 rounded bg-bg border border-border text-ink-secondary">{s}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Latest guides */}
        {latest.length > 0 && (
          <section className="pb-16">
            <div className="flex items-end justify-between mb-8 gap-4">
              <div>
                <p className="mf-spec uppercase text-cta mb-2">Fresh off the bench</p>
                <h2>Latest buying guides</h2>
              </div>
              <Link prefetch={false} href="/guide/all" className="text-sm font-semibold text-cta hover:text-cta-dark">View all →</Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latest.map((g) => (
                <Link prefetch={false} key={g.slug} href={`/guide/${g.slug}`} className="group rounded-card bg-surface border border-border overflow-hidden hover:shadow-card-hover transition-all">
                  <div className="relative h-48 bg-white border-b border-border">
                    {g.heroImage && (
                      <Image src={g.heroImage} alt={g.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-contain p-6 group-hover:scale-105 transition-transform" />
                    )}
                  </div>
                  <div className="p-5">
                    <p className="mf-spec uppercase text-ink-muted mb-2">{categories.find((c) => c.slug === g.categorySlug)?.name} · {g.readTime}</p>
                    <h3 className="text-lg leading-snug group-hover:text-cta transition-colors">{g.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </Container>

      {/* Methodology band */}
      <section className="bg-surface border-y border-border">
        <Container className="py-16 grid md:grid-cols-3 gap-8">
          {[
            ["01", "We decode the spec sheet", "Rated torque, CFM at 90 PSI, running versus starting watts, bar pressure. We explain which numbers matter and which are marketing."],
            ["02", "We compare like with like", "Every pick is measured against the others in the same roundup, so you see the real tradeoffs between models, not isolated praise."],
            ["03", "We think about year five", "Brushless versus brushed motors, serviceable parts, battery platforms and warranty terms decide what a machine really costs to own."],
          ].map(([n, t, d]) => (
            <div key={n}>
              <span className="mf-spec text-cta">{n}</span>
              <h3 className="mt-2 mb-2">{t}</h3>
              <p className="text-ink-secondary">{d}</p>
            </div>
          ))}
        </Container>
      </section>
    </>
  );
}
