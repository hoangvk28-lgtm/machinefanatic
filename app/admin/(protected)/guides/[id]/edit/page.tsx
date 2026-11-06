import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { GuideForm } from "@/components/admin/GuideForm";
import { updateGuideAction } from "@/app/admin/guide-actions";
import { getGuideById } from "@/lib/guides-store";
import { getAllProducts, type StoredProduct } from "@/lib/products-store";
import { isSupabaseConfigured } from "@/lib/supabase/server";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditGuidePage({ params }: PageProps) {
  const { id } = await params;

  let guide;
  let products: StoredProduct[] = [];

  try {
    guide = await getGuideById(id);
    if (isSupabaseConfigured()) {
      try {
        products = await getAllProducts();
      } catch {
        /* ignore */
      }
    }
  } catch (e) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
        <p className="text-sm font-semibold text-amber-800 mb-1">Supabase not configured</p>
        <p className="text-xs text-amber-700 font-mono whitespace-pre-wrap">{(e as Error).message}</p>
      </div>
    );
  }

  if (!guide) notFound();

  const action = updateGuideAction.bind(null, id);

  return (
    <>
      <AdminPageHeader title="Edit Guide" description={guide.title} />
      <GuideForm action={action} guide={guide} mode="edit" products={products} />
    </>
  );
}
