"use client";

import { useTransition } from "react";
import { archiveDealAction } from "@/app/admin/deal-actions";

export function ArchiveDealButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm("Archive this deal? It will no longer appear on the site.")) return;
    startTransition(() => archiveDealAction(id));
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="px-3 py-1.5 text-sm rounded-md border border-amber-300 text-amber-700 hover:bg-amber-50 disabled:opacity-50 transition-colors"
    >
      {isPending ? "Archiving…" : "Archive"}
    </button>
  );
}
