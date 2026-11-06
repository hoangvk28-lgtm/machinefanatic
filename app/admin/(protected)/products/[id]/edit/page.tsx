import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { updateProductAction } from "@/app/admin/product-actions";
import { getProductById } from "@/lib/products-store";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;

  let product;
  try {
    product = await getProductById(id);
  } catch (e) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
        <p className="text-sm font-semibold text-amber-800 mb-1">Supabase not configured</p>
        <p className="text-xs text-amber-700 font-mono whitespace-pre-wrap">{(e as Error).message}</p>
      </div>
    );
  }

  if (!product) notFound();

  const action = updateProductAction.bind(null, id);

  return (
    <>
      <AdminPageHeader title="Edit Product" description={product.name} />
      <ProductForm action={action} product={product} mode="edit" />
    </>
  );
}
