import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { createProductAction } from "@/app/admin/product-actions";

export default function NewProductPage() {
  return (
    <>
      <AdminPageHeader
        title="Add Product"
        description="Create a new product listing for the affiliate site"
      />
      <ProductForm action={createProductAction} mode="create" />
    </>
  );
}
