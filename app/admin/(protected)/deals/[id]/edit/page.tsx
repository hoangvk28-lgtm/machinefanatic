import { notFound } from "next/navigation";
import Link from "next/link";
import { DealForm } from "@/components/admin/DealForm";
import { updateDealAction } from "@/app/admin/deal-actions";
import { getDealById } from "@/lib/deals-store";

export default async function EditDealPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deal = await getDealById(id);
  if (!deal) notFound();

  const boundAction = updateDealAction.bind(null, id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link prefetch={false}
          href="/admin/deals"
          className="text-sm text-ink-secondary hover:text-ink transition-colors"
        >
          ← Deals
        </Link>
        <span className="text-ink-muted">/</span>
        <span className="text-sm text-ink font-medium">Edit Deal</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-ink">Edit Deal</h1>
        <p className="text-sm text-ink-muted mt-0.5">ID: {id}</p>
      </div>

      <DealForm action={boundAction} initialData={deal} />
    </div>
  );
}
