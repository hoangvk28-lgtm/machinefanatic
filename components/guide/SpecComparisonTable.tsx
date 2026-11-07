import Image from "next/image";

interface Row {
  id: string;
  badge: string;
  name: string;
  imageUrl: string;
  specList?: { label: string; value: string }[];
}

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");

/**
 * Side-by-side spec table built from each product's specList.
 * Columns = spec labels shared by at least half of the products (max 5), in first-seen order.
 * Renders nothing when products don't share enough specs to compare.
 */
export function specComparisonColumns(products: Row[]) {
  const counts = new Map<string, { label: string; n: number }>();
  for (const p of products) {
    const seen = new Set<string>();
    for (const s of p.specList ?? []) {
      const k = norm(s.label);
      if (seen.has(k)) continue;
      seen.add(k);
      const c = counts.get(k);
      if (c) c.n++;
      else counts.set(k, { label: s.label, n: 1 });
    }
  }
  const min = Math.max(2, Math.ceil(products.length / 2));
  const cols = [...counts.entries()].filter(([, c]) => c.n >= min).slice(0, 5);
  return cols.length >= 2 ? cols : [];
}

export function SpecComparisonTable({ products }: { products: Row[] }) {
  const cols = specComparisonColumns(products);
  if (!cols.length) return null;

  const value = (p: Row, key: string) => p.specList?.find((s) => norm(s.label) === key)?.value ?? "n/a";

  return (
    <section id="compare-specs" className="mb-12 scroll-mt-24">
      <p className="mf-spec uppercase text-cta mb-1.5">Side by side</p>
      <h2 className="text-2xl sm:text-3xl tracking-tight mb-4">Spec comparison</h2>
      <div className="rounded-card border border-border bg-surface shadow-card overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="bg-brand text-white text-left">
              <th scope="col" className="px-4 py-3 font-semibold">Machine</th>
              {cols.map(([k, c]) => (
                <th key={k} scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((p) => (
              <tr key={p.id} className="align-top hover:bg-bg/60">
                <th scope="row" className="px-4 py-3 text-left font-normal">
                  <a href={`#${p.id}`} className="group flex items-center gap-3 min-w-[200px]">
                    <span className="shrink-0 w-12 h-12 rounded bg-white border border-border flex items-center justify-center overflow-hidden">
                      <Image src={p.imageUrl} alt={p.name} width={48} height={48} className="object-contain w-full h-full p-0.5" unoptimized />
                    </span>
                    <span className="leading-snug">
                      <span className="block mf-spec uppercase text-cta">{p.badge}</span>
                      <span className="block font-semibold text-ink group-hover:text-cta transition-colors">{p.name}</span>
                    </span>
                  </a>
                </th>
                {cols.map(([k]) => (
                  <td key={k} className="px-4 py-3 mf-spec text-ink">{value(p, k)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
