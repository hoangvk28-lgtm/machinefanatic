import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SeedClient } from "./SeedClient";
import { products as staticProducts } from "@/data/products";
import { guides as staticGuides } from "@/data/guides";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function getDbCounts() {
  if (!isSupabaseConfigured()) return { products: 0, guides: 0 };
  try {
    const db = createAdminClient();
    const [{ count: pc }, { count: gc }] = await Promise.all([
      db.from("products").select("*", { count: "exact", head: true }),
      db.from("guides").select("*", { count: "exact", head: true }),
    ]);
    return { products: pc ?? 0, guides: gc ?? 0 };
  } catch {
    return { products: 0, guides: 0 };
  }
}

export default async function SeedPage() {
  const db = await getDbCounts();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Import Static Content"
        description="Seed the built-in products and guides into Supabase so you can edit them in the admin panel."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Products card */}
        <div className="bg-white rounded-xl border border-border p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-ink">Products</h2>
              <p className="text-xs text-ink-muted">{staticProducts.length} static · {db.products} in DB</p>
            </div>
          </div>
          <p className="text-sm text-ink-secondary">
            Import all <strong>{staticProducts.length} products</strong> (desk lamps, laptop stands, storage,
            organizers, chargers…) into Supabase. Already-existing slugs will be skipped.
          </p>
          <SeedClient type="products" staticCount={staticProducts.length} dbCount={db.products as number} />
        </div>

        {/* Guides card */}
        <div className="bg-white rounded-xl border border-border p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-ink">Buying Guides</h2>
              <p className="text-xs text-ink-muted">{staticGuides.length} static · {db.guides} in DB</p>
            </div>
          </div>
          <p className="text-sm text-ink-secondary">
            Import all <strong>{staticGuides.length} buying guides</strong> (desk lamps, monitor stands, shower
            caddies, power essentials…) into Supabase. Already-existing slugs will be skipped.
          </p>
          <SeedClient type="guides" staticCount={staticGuides.length} dbCount={db.guides as number} />
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
        <strong>Lưu ý:</strong> Chỉ cần chạy 1 lần. Sau khi import, bạn có thể chỉnh sửa từng sản phẩm/bài viết
        trong <a href="/admin/products" className="underline font-medium">Products</a> và{" "}
        <a href="/admin/guides" className="underline font-medium">Guides</a>. Các thay đổi trong DB sẽ
        override nội dung static tương ứng.
      </div>
    </div>
  );
}
