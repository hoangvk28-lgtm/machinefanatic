import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import { categories } from "@/data/categories";

export const metadata: Metadata = buildMetadata({
  title: "About MachineFanatic",
  description:
    "MachineFanatic publishes spec-driven buying guides for power tools, outdoor power, shop, kitchen and home machines. Here is who we are and how we work.",
  path: "/about-us",
});

const principles = [
  ["Specs before slogans", "Every guide starts from the rated figures: torque, CFM at 90 PSI, running watts, bar pressure, DOE pints. We explain what each number means and which ones manufacturers inflate."],
  ["Mechanism over marketing", "We explain how a machine works, brushless versus brushed motors, inverter versus conventional alternators, compressor versus desiccant dehumidifiers, so you can judge any model, not just the ones we list."],
  ["Ownership, not unboxing", "A machine is a multi-year purchase. We weigh maintenance, parts availability, battery platforms and warranty terms as heavily as day-one performance."],
  ["No paid rankings", "Brands cannot buy a position on MachineFanatic. Affiliate commissions fund the site and never change the order of our picks."],
];

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About MachineFanatic",
  url: `${SITE_URL}/about-us`,
  publisher: { "@type": "Organization", name: "MachineFanatic", url: SITE_URL },
};

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <section className="bg-brand text-ink-inverse relative overflow-hidden">
        <div className="absolute inset-0 mf-grid-bg" aria-hidden="true" />
        <Container className="relative py-16 max-w-4xl">
          <p className="mf-spec uppercase text-cta mb-3">About us</p>
          <h1 className="text-white mb-4">We are machine people.</h1>
          <p className="text-lg text-white/70 max-w-2xl">
            MachineFanatic is an independent buying guide site for anyone who wants to understand a machine before paying for it: homeowners, DIYers, makers, small-shop owners and serious home cooks.
          </p>
        </Container>
      </section>
      <Container className="py-14 max-w-4xl">
        <section className="mb-14 space-y-4 text-[17px] text-ink-secondary leading-relaxed">
          <p>
            Most product roundups stop at a feature list. We think that is where the useful part begins. A pressure washer box says 3000 PSI, but the number that decides how fast you clean a driveway is flow. A generator says 4000 watts, but that is a surge figure, and your furnace blower cares about running watts. We write guides that make those differences obvious.
          </p>
          <p>
            MachineFanatic is not a store. We do not sell, stock or ship anything. When you click a product link you go to a retailer, usually Amazon, and we may earn a small commission at no extra cost to you. That commission is how the site is funded, and it never decides which machine we recommend.
          </p>
        </section>
        <section className="mb-14">
          <h2 className="mb-6">How we work</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {principles.map(([t, d], i) => (
              <div key={t} className="rounded-card border border-border bg-surface p-5">
                <span className="mf-spec text-cta">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-lg mt-1 mb-2">{t}</h3>
                <p className="text-sm text-ink-secondary leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="mb-14 rounded-card border border-border bg-surface p-6">
          <h2 className="text-2xl mb-3">What we do not claim</h2>
          <p className="text-ink-secondary leading-relaxed">
            Our guides are edited by <Link prefetch={false} href="/author/james-miller" className="font-semibold text-cta">James Miller</Link>, our Lead Machine Editor. We evaluate machines from manufacturer specifications, technical documentation, owner feedback patterns and comparison against competing models. We do not claim to have hands-on tested every product we write about, and our Machine Score is an editorial assessment, not a lab measurement.
          </p>
        </section>
        <section>
          <h2 className="text-2xl mb-4">What we cover</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link prefetch={false} key={c.slug} href={`/categories/${c.slug}`} className="px-4 py-2 rounded-btn border border-border bg-surface hover:border-cta hover:text-cta text-sm font-semibold">
                {c.name}
              </Link>
            ))}
            <Link prefetch={false} href="/how-we-review" className="px-4 py-2 rounded-btn bg-cta text-white text-sm font-semibold hover:bg-cta-dark">How we rate machines →</Link>
          </div>
        </section>
      </Container>
    </>
  );
}
