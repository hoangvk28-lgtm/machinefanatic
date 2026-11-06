// Honest methodology highlights — no fabricated product/guide counts.
// (See lib/brand.ts RATING_CRITERIA for the full weighted rubric.)
const stats = [
  {
    label: "Ease of Use",
    weight: "25%",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    description: "The single biggest factor in every score we publish.",
  },
  {
    label: "Controls & Readability",
    weight: "20%",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15M4.5 9h15M4.5 15h15" />
        <rect x="3.75" y="3.75" width="16.5" height="16.5" rx="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    description: "Clear labeling, legible displays, and intuitive layouts.",
  },
  {
    label: "Setup Difficulty",
    weight: "15%",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 12h9.75M10.5 18h9.75M3.75 6h.007v.008H3.75V6Zm0 6h.007v.008H3.75V12Zm0 6h.007v.008H3.75V18Z" />
      </svg>
    ),
    description: "How much work it takes to get a product running.",
  },
  {
    label: "Value for Money",
    weight: "5%",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m3.75-9.75c0-1.036-1.679-1.875-3.75-1.875s-3.75.84-3.75 1.875S10.929 10.125 13 10.125s3.75.84 3.75 1.875-1.679 1.875-3.75 1.875-3.75-.84-3.75-1.875" />
      </svg>
    ),
    description: "Price weighed against durability and long-term use.",
  },
];

export function TrustStats() {
  return (
    <section className="bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-3">
              {/* Icon + weight row */}
              <div className="flex items-center gap-3">
                <div className="shrink-0 w-14 h-14 rounded-xl bg-brand-light flex items-center justify-center text-brand" aria-hidden="true">
                  {stat.icon}
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-2xl font-bold text-ink tabular-nums tracking-tight leading-none whitespace-nowrap">
                    {stat.weight}
                  </span>
                  <span className="text-[11px] font-semibold text-ink-muted leading-none whitespace-nowrap">
                    of overall score
                  </span>
                </div>
              </div>
              {/* Labels */}
              <div>
                <p className="font-semibold text-ink text-xs leading-snug mb-0.5">{stat.label}</p>
                <p className="text-xs text-ink-secondary leading-relaxed hidden sm:block">{stat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
