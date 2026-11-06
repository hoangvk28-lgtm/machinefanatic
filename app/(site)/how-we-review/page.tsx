import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { buildMetadata } from "@/lib/seo";
import { RATING_CRITERIA } from "@/lib/brand";

export const metadata: Metadata = buildMetadata({
  title: "How We Rate Machines",
  description:
    "How MachineFanatic evaluates power tools and machines: the Machine Score weighting, the specs we verify, and how we handle affiliate links and corrections.",
  path: "/how-we-review",
});

const detail: Record<string, string> = {
  "Performance and Output": "Rated, not peak, figures: running watts, CFM at a stated PSI, continuous motor watts, working pressure and flow, cutting capacity. We compare each machine against the others in its roundup.",
  "Build Quality and Durability": "Motor type (brushless, induction, universal), housing and frame materials, gearbox and pump design, and the warranty a manufacturer is willing to put behind it.",
  "Ergonomics and Control": "Weight, balance, vibration, noise where it is published, control layout and how easy the machine is to start, adjust and stop safely.",
  "Maintenance and Serviceability": "Filter, oil, chain, blade and seal upkeep, parts availability, battery platform depth and whether a normal owner can service it at home.",
  "Safety Features": "CO shutoff on generators, chain brakes, thermal and low-oil protection, GFCI plugs, auto shutoff and interlocks, judged against what the category should have.",
  "Value for Money": "What the machine delivers relative to the other picks in the same comparison, over its expected service life, not just on day one.",
};

export default function HowWeReviewPage() {
  return (
    <>
      <section className="bg-brand text-ink-inverse relative overflow-hidden">
        <div className="absolute inset-0 mf-grid-bg" aria-hidden="true" />
        <Container className="relative py-16 max-w-4xl">
          <p className="mf-spec uppercase text-cta mb-3">Methodology</p>
          <h1 className="text-white mb-4">How we rate machines</h1>
          <p className="text-lg text-white/70 max-w-2xl">
            Every guide follows the same documented process. Here is what we look at, how much each factor counts, and what our Machine Score does and does not mean.
          </p>
        </Container>
      </section>
      <Container className="py-14 max-w-4xl">
        <h2 className="mb-6">The Machine Score</h2>
        <div className="space-y-4 mb-14">
          {RATING_CRITERIA.map((c) => (
            <div key={c.label} className="rounded-card border border-border bg-surface p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg">{c.label}</h3>
                <span className="mf-spec text-cta text-sm">{c.weight}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-bg mb-3"><div className="h-1.5 rounded-full bg-cta" style={{ width: `${c.weight * 3.33}%` }} /></div>
              <p className="text-sm text-ink-secondary leading-relaxed">{detail[c.label]}</p>
            </div>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-card border border-border bg-surface p-5">
            <h3 className="text-lg mb-2">Our sources</h3>
            <p className="text-sm text-ink-secondary leading-relaxed">Manufacturer spec sheets and manuals, published certifications (EPA, CARB, Energy Star, UL/ETL), owner feedback patterns and side-by-side comparison of competing models.</p>
          </div>
          <div className="rounded-card border border-border bg-surface p-5">
            <h3 className="text-lg mb-2">What it is not</h3>
            <p className="text-sm text-ink-secondary leading-relaxed">The Machine Score is an editorial assessment. We do not claim lab measurements or hands-on testing of every model, and we never publish fake star ratings or prices.</p>
          </div>
          <div className="rounded-card border border-border bg-surface p-5">
            <h3 className="text-lg mb-2">Affiliate independence</h3>
            <p className="text-sm text-ink-secondary leading-relaxed">We earn commissions through Amazon links. Rankings are never sold, and commission rates play no part in which machine we recommend.</p>
          </div>
          <div className="rounded-card border border-border bg-surface p-5">
            <h3 className="text-lg mb-2">Corrections</h3>
            <p className="text-sm text-ink-secondary leading-relaxed">Specs change between model years. If you spot an error, tell us through the contact page and we will verify and update the guide.</p>
          </div>
        </div>
      </Container>
    </>
  );
}
