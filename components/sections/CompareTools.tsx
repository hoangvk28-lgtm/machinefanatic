import Link from "next/link";
import { categories } from "@/data/categories";

const iconMap: Record<string, React.ReactNode> = {
  "kitchen-machines": (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7.5h16M4 7.5c0-1.657 3.582-3 8-3s8 1.343 8 3M4 7.5v9c0 1.657 3.582 3 8 3s8-1.343 8-3v-9M12 12v4.5" />
    </svg>
  ),
  "home-machines": (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 3 6 12l4 4-9 5 5-9 4 4 9-9-4-4Z" />
    </svg>
  ),
  "shop-garage": (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <rect x="7" y="2.5" width="10" height="19" rx="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  "outdoor-power": (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c0-6 4-8 4-13a4 4 0 0 0-8 0c0 5 4 7 4 13Z" />
    </svg>
  ),
};

export function CompareTools() {
  return (
    <section className="py-14 border-t border-border">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand">Compare</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-ink mt-2 tracking-tight">
            Side-by-Side Comparisons
          </h2>
          <p className="text-ink-secondary mt-2 leading-relaxed max-w-2xl">
            Every comparison uses the same Machine Score criteria, ease of use, controls, setup, and value, so results stay comparable across categories.
          </p>
        </div>
        <Link prefetch={false}
          href="/compare"
          className="text-sm font-semibold text-brand hover:text-brand-dark transition-colors shrink-0 flex items-center gap-1"
        >
          Full comparison page
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {categories.map((cat) => (
          <div
            key={cat.slug}
            className="relative flex flex-col gap-4 p-5 rounded-card border bg-bg border-border opacity-70"
          >
            {/* Icon */}
            <div className="w-11 h-11 rounded-lg flex items-center justify-center bg-border text-ink-muted">
              {iconMap[cat.slug]}
            </div>

            {/* Tag */}
            <span className="self-start text-xs font-semibold px-2.5 py-0.5 rounded-badge bg-bg text-ink-muted border border-border">
              Coming soon
            </span>

            <div className="flex-1">
              <h3 className="font-bold text-ink text-sm mb-2">Compare {cat.name}</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">{cat.shortDescription}</p>
            </div>

            <span className="mt-auto text-sm text-ink-muted font-medium">Comparisons in research</span>
          </div>
        ))}
      </div>
    </section>
  );
}
