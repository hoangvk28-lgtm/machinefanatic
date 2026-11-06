"use client";

import { useTransition } from "react";
import { archiveGuideAction } from "@/app/admin/guide-actions";

export function ArchiveGuideButton({ id, title }: { id: string; title: string }) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm(`Archive "${title}"? It will be hidden from all lists.`)) return;
    startTransition(async () => {
      await archiveGuideAction(id);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      title="Archive guide"
      className="text-xs text-gray-300 hover:text-amber-600 disabled:opacity-50 transition-colors cursor-pointer"
    >
      {pending ? (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
        </svg>
      )}
    </button>
  );
}
