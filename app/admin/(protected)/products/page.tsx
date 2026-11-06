import Link from "next/link";
import { getAllProducts, type StoredProduct } from "@/lib/products-store";
import { categories } from "@/data/categories";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    status?: string;
    missing?: string;
  }>;
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = params.q?.toLowerCase() ?? "";
  const filterCategory = params.category ?? "";
  const filterStatus = params.status ?? "";
  const filterMissing = params.missing ?? "";

  let allProducts: StoredProduct[] = [];
  let products: StoredProduct[] = [];
  let configError: string | null = null;

  try {
    allProducts = await getAllProducts();
    products = allProducts;
  } catch (e) {
    configError = (e as Error).message;
    allProducts = [];
    products = [];
  }

  const totalAll = products.length;

  // Build duplicate set — ASIN and normalized name collisions
  function normName(n: string) { return n.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim(); }
  const asinCount = new Map<string, number>();
  const nameCount = new Map<string, number>();
  for (const p of allProducts) {
    if (p.asin) asinCount.set(p.asin, (asinCount.get(p.asin) ?? 0) + 1);
    const nn = normName(p.name);
    nameCount.set(nn, (nameCount.get(nn) ?? 0) + 1);
  }
  const duplicateIds = new Set(
    allProducts
      .filter((p) => (p.asin && (asinCount.get(p.asin) ?? 0) > 1) || (nameCount.get(normName(p.name)) ?? 0) > 1)
      .map((p) => p.id)
  );

  // Client-side filtering (all data already loaded)
  if (q) products = products.filter((p) => p.name.toLowerCase().includes(q));
  if (filterCategory) products = products.filter((p) => p.categorySlug === filterCategory);
  if (filterStatus) products = products.filter((p) => (p.status ?? "draft") === filterStatus);
  if (filterMissing === "amazon") products = products.filter((p) => !p.amazonUrl);
  if (filterMissing === "image") products = products.filter((p) => !p.image);
  if (filterMissing === "duplicate") products = products.filter((p) => duplicateIds.has(p.id));

  return (
    <>
      <AdminPageHeader
        title="Products"
        description={configError ? "Supabase not configured" : `${products.length} of ${totalAll} products`}
        action={
          !configError ? (
            <Link prefetch={false}
              href="/admin/products/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Product
            </Link>
          ) : undefined
        }
      />

      {/* ── Supabase config error ───────────────────────────────────────────── */}
      {configError && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 mb-6">
          <p className="text-sm font-semibold text-amber-800 mb-1">Supabase not configured</p>
          <p className="text-xs text-amber-700 leading-relaxed font-mono whitespace-pre-wrap">{configError}</p>
          <p className="text-xs text-amber-700 mt-3 leading-relaxed">
            Once configured, run <code className="bg-amber-100 px-1 rounded">npm run seed:products</code> to seed the database from existing static data.
          </p>
        </div>
      )}

      {!configError && (
        <>
          {/* ── Filters ────────────────────────────────────────────────────────── */}
          <form method="GET" className="flex flex-wrap items-end gap-3 mb-5">
            <div className="flex-1 min-w-[180px]">
              <input
                name="q"
                type="search"
                defaultValue={q}
                placeholder="Search by name…"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              name="category"
              defaultValue={filterCategory}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>

            <select
              name="status"
              defaultValue={filterStatus}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All statuses</option>
              <option value="draft">Draft</option>
              <option value="verified">Verified</option>
              <option value="published">Published</option>
            </select>

            <select
              name="missing"
              defaultValue={filterMissing}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All products</option>
              <option value="amazon">Missing Amazon URL</option>
              <option value="image">Missing image</option>
              <option value="duplicate">Possible duplicates</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors"
            >
              Search
            </button>

            {(q || filterCategory || filterStatus || filterMissing) && (
              <Link prefetch={false}
                href="/admin/products"
                className="px-3 py-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                Clear
              </Link>
            )}
          </form>

          {/* ── Table ──────────────────────────────────────────────────────────── */}
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 rounded-xl border-2 border-dashed border-gray-200">
              {totalAll === 0 ? (
                <>
                  <p className="text-sm font-semibold text-gray-500">No products yet.</p>
                  <Link prefetch={false} href="/admin/products/new" className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    Add Product
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-gray-500">No products match your filters.</p>
                  <Link prefetch={false} href="/admin/products" className="mt-2 text-xs text-blue-600 hover:underline">Clear filters</Link>
                </>
              )}
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Badge</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">ASIN</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Price</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">Score</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Links</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden xl:table-cell">Updated</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => {
                    const hasAmazon = Boolean(product.amazonUrl);
                    const hasImage = Boolean(product.image);
                    return (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                            <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-1">{product.name}</p>
                            {duplicateIds.has(product.id) && (
                              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 whitespace-nowrap">⚠ Duplicate?</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 font-mono">/reviews/{product.slug}</p>
                        </td>
                        <td className="px-4 py-3.5 hidden md:table-cell">
                          <p className="text-xs text-gray-600 capitalize">{product.categorySlug.replace(/-/g, " ")}</p>
                          <p className="text-xs text-gray-400 mt-0.5 capitalize">{product.subcategorySlug.replace(/-/g, " ")}</p>
                        </td>
                        <td className="px-4 py-3.5 hidden lg:table-cell">
                          {product.badge ? (
                            <span className="inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 whitespace-nowrap">
                              {product.badge}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-300">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 hidden lg:table-cell">
                          {product.asin ? (
                            <span className="text-xs font-mono text-gray-600">{product.asin}</span>
                          ) : (
                            <span className="text-xs text-gray-300">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 hidden lg:table-cell">
                          <span className="text-sm font-semibold text-gray-700">{product.priceRange || <span className="text-gray-300">-</span>}</span>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className="text-sm font-bold tabular-nums text-blue-600">{product.scores.overall.toFixed(1)}</span>
                        </td>
                        <td className="px-4 py-3.5 hidden sm:table-cell">
                          <div className="flex items-center justify-center gap-1.5">
                            <span title={hasAmazon ? "Has Amazon URL" : "Missing Amazon URL"} className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${hasAmazon ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                              {hasAmazon ? "✓ AMZ" : "✗ AMZ"}
                            </span>
                            <span title={hasImage ? "Has image" : "Missing image"} className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${hasImage ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                              {hasImage ? "✓ IMG" : "✗ IMG"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 hidden sm:table-cell">
                          <AdminStatusBadge status={product.status ?? "published"} />
                        </td>
                        <td className="px-4 py-3.5 hidden xl:table-cell">
                          <span className="text-xs text-gray-500">{product.lastUpdated ?? "-"}</span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={`/reviews/${product.slug}`}
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
                              href={`/admin/products/${product.id}/edit`}
                              className="text-xs text-gray-400 hover:text-blue-600 transition-colors"
                              title="Edit product"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                              </svg>
                            </Link>
                            <DeleteProductButton id={product.id} name={product.name} />
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
