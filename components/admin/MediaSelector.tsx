"use client";

import { useState, useEffect } from "react";
import type { MediaAsset } from "@/lib/media-store";
import { MediaGrid } from "@/components/admin/MediaGrid";

interface Props {
  onSelect: (url: string, altText: string) => void;
  trigger?: React.ReactNode;
  folder?: string;
}

export function MediaSelector({ onSelect, trigger, folder }: Props) {
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [filterFolder, setFilterFolder] = useState(folder ?? "");

  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (filterFolder) params.set("folder", filterFolder);
    fetch(`/api/admin/media?${params}`)
      .then((r) => r.json())
      .then((data) => setAssets(data.assets ?? []))
      .finally(() => setLoading(false));
  }, [open, q, filterFolder]);

  function handleSelect(asset: MediaAsset) {
    onSelect(asset.url, asset.altText);
    setOpen(false);
  }

  const filtered = assets.filter((a) => {
    if (q && !a.filename.toLowerCase().includes(q.toLowerCase()) && !a.title.toLowerCase().includes(q.toLowerCase())) return false;
    if (filterFolder && a.folder !== filterFolder) return false;
    return true;
  });

  return (
    <>
      <div onClick={() => setOpen(true)}>
        {trigger ?? (
          <button
            type="button"
            className="px-3 py-1.5 text-sm border border-brand text-brand rounded-md hover:bg-brand/5 transition-colors"
          >
            Choose from Media Library
          </button>
        )}
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-ink/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-t-2xl sm:rounded-xl shadow-2xl w-full sm:max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-semibold text-ink">Media Library</h2>
              <button onClick={() => setOpen(false)} className="text-ink-muted hover:text-ink">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 px-5 py-3 border-b border-border flex-wrap">
              <input
                type="text"
                placeholder="Search by name or title…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="flex-1 min-w-40 px-3 py-1.5 text-sm border border-border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
              <select
                value={filterFolder}
                onChange={(e) => setFilterFolder(e.target.value)}
                className="px-3 py-1.5 text-sm border border-border rounded-md bg-white focus:outline-none"
              >
                <option value="">All folders</option>
                {["products", "guides", "deals", "homepage", "categories", "misc"].map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-5">
              {loading ? (
                <p className="text-sm text-ink-muted text-center py-12">Loading…</p>
              ) : (
                <MediaGrid assets={filtered} selectable onSelect={handleSelect} />
              )}
            </div>

            <div className="px-5 py-3 border-t border-border text-xs text-ink-muted">
              Click an image to select it. To upload new images, go to the{" "}
              <a href="/admin/media" target="_blank" className="text-brand underline">Media Library</a>.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
