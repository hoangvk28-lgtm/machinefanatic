import Link from "next/link";
import { RATING_CRITERIA } from "@/lib/brand";

const descriptions: Record<string, string> = {
  "Ease of Use": "How straightforward the product is to operate day-to-day, without a learning curve.",
  "Controls and Readability": "Clear labeling, legible displays, and buttons that are easy to find by touch or sight.",
  "Weight and Handling": "How comfortable the product is to lift, carry, and maneuver during normal use.",
  "Setup Difficulty": "How much work it takes to get the product running out of the box.",
  "Cleaning and Maintenance": "How much ongoing upkeep the product demands to keep working well.",
  "Reliability and Warranty": "Build quality signals and the manufacturer's warranty coverage.",
  "Value for Money": "Price weighed against durability, features, and long-term use.",
};

export function HowWeReviewTeaser() {
  return (
    <section className="py-14 border-t border-border bg-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 items-start">
          {/* Left copy */}
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand">
              Our Methodology
            </span>
            <h2 className="mt-3 mb-5 tracking-tight">
              A clearer way to compare products
            </h2>
            <p className="text-ink-secondary leading-relaxed mb-4 max-w-lg">
              Every guide compares products against the same seven criteria, weighted and combined into a single Worth Rating. We research published specifications, manufacturer documentation, and patterns in verified buyer feedback rather than claiming to have tested every unit ourselves.
            </p>
            <p className="text-ink-secondary leading-relaxed mb-6 max-w-lg">
              We don&apos;t accept payment for placement or scores. Our affiliate income depends on recommending products people are actually happy with, so honest evaluation is in our direct interest.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link prefetch={false}
                href="/how-we-review"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-border rounded-btn text-sm font-semibold text-ink hover:border-brand hover:text-brand transition-all"
              >
                See Our Rating Method
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right criteria list */}
          <div className="flex flex-col gap-2.5">
            {RATING_CRITERIA.map((item, i) => (
              <div
                key={item.label}
                className="flex items-start gap-4 p-4 bg-white rounded-lg border border-border hover:border-border-dark transition-colors group"
              >
                {/* Weight pill — alternates navy/teal, never amber (amber is reserved for badges) */}
                <div
                  className="shrink-0 mt-0.5 px-2.5 py-1 rounded-full text-xs font-bold text-white min-w-[3rem] text-center"
                  style={{ backgroundColor: i % 2 === 0 ? "#17324D" : "#2F7D78" }}
                >
                  {item.weight}%
                </div>
                <div>
                  <p className="font-semibold text-ink text-sm mb-0.5">{item.label}</p>
                  <p className="text-xs text-ink-secondary leading-relaxed">{descriptions[item.label]}</p>
                </div>
              </div>
            ))}

            {/* Total bar */}
            <div className="flex items-center gap-4 px-4 py-2.5 rounded-lg bg-brand-light border border-brand-muted mt-1">
              <div className="shrink-0 px-2.5 py-1 rounded-full text-xs font-bold text-white bg-brand min-w-[3rem] text-center">
                100%
              </div>
              <p className="text-xs font-semibold text-brand">
                = Worth Rating (1-10 scale)
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
