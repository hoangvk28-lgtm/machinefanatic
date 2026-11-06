import Link from "next/link";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { ArchiveDealButton } from "@/components/admin/ArchiveDealButton";
import { getAllDeals } from "@/lib/deals-store";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminDealsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; section?: string }>;
}) {
  const { q = "", status = "", section = "" } = await searchParams;

  let deals: Awaited<ReturnType<typeof getAllDeals>> = [];
  let configError = false;

  if (!isSupabaseConfigured()) {
    configError = true;
  } else {
    try {
      deals = await getAllDeals();
    } catch (e) {
      configError = true;
      console.error(e);
    }
  }

  const filtered = deals.filter((d) => {
    if (q && !d.title.toLowerCase().includes(q.toLowerCase()) && !d.slug.includes(q.toLowerCase())) return false;
    if (status && d.status !== status) return false;
    if (section && d.section !== section) return false;
    return true;
  });

  const sections = [...new Set(deals.map((d) => d.section))].sort();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Deals</h1>
          <p className="text-sm text-ink-secondary mt-0.5">{deals.length} total</p>
        </div>
        <Link prefetch={false}
          href="/admin/deals/new"
          className="px-4 py-2 bg-brand text-white rounded-md text-sm font-medium hover:bg-brand-dark transition-colors"
        >
          + New Deal
        </Link>
      </div>

      {configError && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
          Supabase is not configured. Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code>SUPABASE_SERVICE_ROLE_KEY</code> to your environment variables.
        </div>
      )}

      <form method="GET" className="flex gap-3 flex-wrap">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search title or slug…"
          className="flex-1 min-w-48 px-3 py-2 text-sm border border-border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
        <select
          name="status"
          defaultValue={status}
          className="px-3 py-2 text-sm border border-border rounded-md bg-white focus:outline-none"
        >
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          name="section"
          defaultValue={section}
          className="px-3 py-2 text-sm border border-border rounded-md bg-white focus:outline-none"
        >
          <option value="">All sections</option>
          {sections.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-ink text-white text-sm rounded-md hover:bg-ink/80 transition-colors"
        >
          Filter
        </button>
        {(q || status || section) && (
          <Link prefetch={false}
            href="/admin/deals"
            className="px-4 py-2 border border-border text-ink-secondary text-sm rounded-md hover:bg-surface transition-colors"
          >
            Clear
          </Link>
        )}
      </form>

      <AdminCard>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            {deals.length === 0 ? (
              <>
                <p className="text-sm font-semibold text-ink-secondary">No deals yet.</p>
                <Link prefetch={false} href="/admin/deals/new" className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand-dark transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                  Add Deal
                </Link>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-ink-secondary">No deals match your filters.</p>
                <Link prefetch={false} href="/admin/deals" className="mt-2 text-xs text-brand hover:underline">Clear filters</Link>
              </>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold text-ink-muted uppercase tracking-wide">
                  <th className="pb-3 pr-4">Title</th>
                  <th className="pb-3 pr-4">Label</th>
                  <th className="pb-3 pr-4">Section</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Featured</th>
                  <th className="pb-3 pr-4">Order</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((deal) => (
                  <tr key={deal.id} className="hover:bg-surface/50 transition-colors">
                    <td className="py-3 pr-4">
                      <div className="font-medium text-ink leading-snug">{deal.title}</div>
                      <div className="text-xs text-ink-muted mt-0.5">{deal.slug}</div>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-xs text-ink-secondary">{deal.label}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-xs text-ink-secondary capitalize">{deal.section}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <AdminStatusBadge status={deal.status as "active" | "inactive" | "draft"} />
                    </td>
                    <td className="py-3 pr-4">
                      {deal.featured ? (
                        <span className="text-xs font-medium text-brand">✓ Featured</span>
                      ) : (
                        <span className="text-xs text-ink-muted">-</span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-ink-secondary">{deal.displayOrder}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <a
                          href="/deals"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-ink-muted hover:text-brand transition-colors"
                          title="View public deals page"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                          </svg>
                        </a>
                        <Link prefetch={false}
                          href={`/admin/deals/${deal.id}/edit`}
                          className="px-3 py-1.5 text-sm rounded-md border border-border text-ink-secondary hover:bg-surface transition-colors"
                        >
                          Edit
                        </Link>
                        <ArchiveDealButton id={deal.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </div>
  );
}
