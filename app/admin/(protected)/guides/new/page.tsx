import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { GuideForm } from "@/components/admin/GuideForm";
import { createGuideAction } from "@/app/admin/guide-actions";
import { getAllProducts, type StoredProduct } from "@/lib/products-store";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export default async function NewGuidePage() {
  let products: StoredProduct[] = [];
  if (isSupabaseConfigured()) {
    try {
      products = await getAllProducts();
    } catch {
      /* ignore */
    }
  }

  return (
    <>
      <AdminPageHeader title="Add Guide" description="Create a new buying guide" />
      <GuideForm action={createGuideAction} mode="create" products={products} />
    </>
  );
}
