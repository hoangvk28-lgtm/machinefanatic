import Link from "next/link";
import { getAllGuides, type StoredGuide } from "@/lib/guides-store";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { categories } from "@/data/categories";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { ArchiveGuideButton } from "@/components/admin/ArchiveGuideButton";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    status?: string;
    missing?: string;
  }>;
}

export default async function AdminGuidesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = params.q?.toLowerCase() ?? "";
  const filterCategory = params.category ?? "";
  const filterStatus = params.status ?? "";
  const filterMissing = params.missing ?? "";

  let guides: StoredGuide[] = [];
  let configError: string | null = null;

  if (!isSupabaseConfigured()) {
    configError = "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are not set.";
  } else {
    try {
      guides = await getAllGuides();
    } catch (e) {
      configError = (e as Error).message;
    }
  }

  const totalAll = guides.length;

  if (q) guides = guides.filter((g) => g.title.toLowerCase().includes(q));
  if (filterCategory) guides = guides.filter((g) => g.categorySlug === filterCategory);
  if (filterStatus) guides = guides.filter((g) => g.status === filterStatus);
  if (filterMissing === "hero") guides = guides.filter((g) => !g.heroImage);
  if (filterMissing === "meta") guides = guides.filter((g) => !g.metaDescription);

  return (
    <>
      <AdminPageHeader
        title="Buying Guides"
        description={configError ? "Supabase not configured" : `${guides.length} guides`}
        action={
          !configError ? (
            <Link prefetch={false}
              href="/admin/guides/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Guide
            </Link>
          ) : undefined
        }
      />

      {configError && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 mb-6">
          <p className="text-sm font-semibold text-amber-800 mb-1">Supabase not configured</p>
          <p className="text-xs text-amber-700 leading-relaxed font-mono whitespace-pre-wrap">{configError}</p>
          <p className="text-xs text-amber-700 mt-3">
            Run <code className="bg-amber-100 px-1 rounded">npm run seed:guides</code> after configuring Supabase.
          </p>
        </div>
      )}

      {!configError && (
        <>
          {/* Filters */}
          <form method="GET" className="flex flex-wrap items-end gap-3 mb-5">
            <div className="flex-1 min-w-[180px]">
              <input
                name="q"
                type="search"
                defaultValue={q}
                placeholder="Search by title…"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select name="category" defaultValue={filterCategory} className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All categories</option>
              {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
            <select name="status" defaultValue={filterStatus} className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <select name="missing" defaultValue={filterMissing} className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All guides</option>
              <option value="hero">Missing hero image</option>
              <option value="meta">Missing meta description</option>
            </select>
            <button type="submit" className="px-4 py-2 text-sm font-semibold bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors">
              Search
            </button>
            {(q || filterCategory || filterStatus || filterMissing) && (
              <Link prefetch={false} href="/admin/guides" className="px-3 py-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
                Clear
              </Link>
            )}
          </form>

          {/* Table */}
          {guides.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 rounded-xl border-2 border-dashed border-gray-200">
              {totalAll === 0 ? (
                <>
                  <p className="text-sm font-semibold text-gray-500">No guides yet.</p>
                  <Link prefetch={false} href="/admin/guides/new" className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    Add Guide
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-gray-500">No guides match your filters.</p>
                  <Link prefetch={false} href="/admin/guides" className="mt-2 text-xs text-blue-600 hover:underline">Clear filters</Link>
                </>
              )}
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Guide</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Category</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Picks</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Assets</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden xl:table-cell">Updated</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {guides.map((guide) => {
                    const hasHero = Boolean(guide.heroImage);
                    const hasMeta = Boolean(guide.metaDescription);
                    return (
                      <tr key={guide.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3.5">
                          <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-1">{guide.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5 font-mono">/guide/{guide.slug}</p>
                        </td>
                        <td className="px-4 py-3.5 hidden md:table-cell">
                          <p className="text-xs text-gray-600 capitalize">{guide.categorySlug.replace(/-/g, " ")}</p>
                          <p className="text-xs text-gray-400 mt-0.5 capitalize">{guide.subcategorySlug.replace(/-/g, " ")}</p>
                        </td>
                        <td className="px-4 py-3.5 text-center hidden sm:table-cell">
                          <span className="text-sm font-semibold text-gray-700">{guide.recommendedProductIds.length}</span>
                        </td>
                        <td className="px-4 py-3.5 hidden lg:table-cell">
                          <div className="flex items-center justify-center gap-1.5">
                            <span title={hasHero ? "Has hero image" : "Missing hero image"} className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${hasHero ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                              {hasHero ? "✓ IMG" : "✗ IMG"}
                            </span>
                            <span title={hasMeta ? "Has meta description" : "Missing meta description"} className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${hasMeta ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                              {hasMeta ? "✓ SEO" : "✗ SEO"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 hidden sm:table-cell">
                          <AdminStatusBadge status={guide.status} />
                        </td>
                        <td className="px-4 py-3.5 hidden xl:table-cell">
                          <span className="text-xs text-gray-500">{guide.lastUpdated}</span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={`/guide/${guide.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-gray-400 hover:text-blue-600 transition-colors"
                              title="View public page"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                            </a>
                            <Link prefetch={false}
                              href={`/admin/guides/${guide.id}/edit`}
                              className="text-xs text-gray-400 hover:text-blue-600 transition-colors"
                              title="Edit guide"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                              </svg>
                            </Link>
                            <ArchiveGuideButton id={guide.id} title={guide.title} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </>
  );
}
