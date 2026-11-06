import Link from "next/link";
import { DealForm } from "@/components/admin/DealForm";
import { createDealAction } from "@/app/admin/deal-actions";

export default function NewDealPage() {
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
        <span className="text-sm text-ink font-medium">New Deal</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-ink">New Deal</h1>
        <p className="text-sm text-ink-secondary mt-1">
          Link a product and configure how it appears on the deals page and homepage.
        </p>
      </div>

      <DealForm action={createDealAction} />
    </div>
  );
}
