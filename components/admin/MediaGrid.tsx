"use client";

import { useState, useTransition } from "react";
import type { MediaAsset } from "@/lib/media-store";
import { archiveMediaAction } from "@/app/admin/media-actions";

interface Props {
  assets: MediaAsset[];
  selectable?: boolean;
  onSelect?: (asset: MediaAsset) => void;
}

export function MediaGrid({ assets, selectable = false, onSelect }: Props) {
  const [preview, setPreview] = useState<MediaAsset | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function copyUrl(asset: MediaAsset) {
    navigator.clipboard.writeText(asset.url).then(() => {
      setCopiedId(asset.id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  }

  function archive(asset: MediaAsset) {
    if (!window.confirm(`Archive "${asset.filename}"? It won't be deleted from storage, just hidden from the library.`)) return;
    startTransition(() => archiveMediaAction(asset.id));
  }

  if (assets.length === 0) {
    return (
      <p className="text-sm text-ink-muted text-center py-12">
        No images found. Upload your first image using the form above.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className={`group relative bg-white rounded-lg border border-border overflow-hidden flex flex-col ${selectable ? "cursor-pointer hover:border-brand hover:shadow-md transition-all" : ""}`}
            onClick={selectable ? () => onSelect?.(asset) : undefined}
          >
            {/* Thumbnail */}
            <div className="aspect-square bg-surface flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset.url}
                alt={asset.altText || asset.filename}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Info */}
            <div className="p-2 flex-1 flex flex-col gap-1">
              <p className="text-xs font-medium text-ink leading-tight truncate" title={asset.title || asset.filename}>
                {asset.title || asset.filename}
              </p>
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-[10px] text-ink-muted bg-surface rounded px-1 py-0.5">{asset.folder}</span>
                {asset.usageType && (
                  <span className="text-[10px] text-ink-muted bg-surface rounded px-1 py-0.5">{asset.usageType}</span>
                )}
              </div>
              {!asset.altText && (
                <span className="text-[10px] text-amber-600 font-medium">No alt text</span>
              )}
            </div>

            {/* Actions overlay (non-selectable mode) */}
            {!selectable && (
              <div className="absolute inset-0 bg-ink/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                <button
                  onClick={(e) => { e.stopPropagation(); setPreview(asset); }}
                  className="w-full px-2 py-1.5 bg-white text-ink text-xs font-medium rounded hover:bg-surface transition-colors"
                >
                  Preview
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); copyUrl(asset); }}
                  className="w-full px-2 py-1.5 bg-white text-ink text-xs font-medium rounded hover:bg-surface transition-colors"
                >
                  {copiedId === asset.id ? "Copied!" : "Copy URL"}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); archive(asset); }}
                  disabled={isPending}
                  className="w-full px-2 py-1.5 bg-amber-50 text-amber-700 text-xs font-medium rounded hover:bg-amber-100 transition-colors disabled:opacity-50"
                >
                  Archive
                </button>
              </div>
            )}

            {/* Selectable checkmark indicator */}
            {selectable && (
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white border-2 border-brand opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <svg className="w-3 h-3 text-brand" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Preview modal */}
      {preview && (
        <div
          className="fixed inset-0 bg-ink/70 z-50 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-surface flex items-center justify-center p-4 max-h-96 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview.url}
                alt={preview.altText || preview.filename}
                className="max-h-80 max-w-full object-contain"
              />
            </div>
            <div className="p-4 space-y-2">
              <p className="font-semibold text-ink">{preview.title || preview.filename}</p>
              <p className="text-xs text-ink-secondary break-all">{preview.url}</p>
              {preview.altText && <p className="text-xs text-ink-muted">Alt: {preview.altText}</p>}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => copyUrl(preview)}
                  className="px-3 py-1.5 bg-brand text-white text-sm rounded-md hover:bg-brand-dark transition-colors"
                >
                  {copiedId === preview.id ? "Copied!" : "Copy URL"}
                </button>
                <button
                  onClick={() => setPreview(null)}
                  className="px-3 py-1.5 border border-border text-ink-secondary text-sm rounded-md hover:bg-surface transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
