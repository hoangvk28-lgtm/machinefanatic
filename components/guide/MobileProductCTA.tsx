"use client";

import { useEffect, useState } from "react";

interface Item {
  id: string;
  name: string;
  amazonUrl: string;
}

/**
 * Mobile-only bar pinned to the bottom of the screen while the reader is inside the
 * detailed reviews: shows the product currently on screen with a "Check price" button.
 */
export function MobileProductCTA({ items }: { items: Item[] }) {
  const [current, setCurrent] = useState<Item | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e);
    if (!els.length) return;
    const onScroll = () => {
      const probe = window.innerHeight * 0.4;
      let hit: Item | null = null;
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.top <= probe && r.bottom >= probe) {
          hit = items.find((i) => i.id === el.id) ?? null;
          break;
        }
      }
      setCurrent(hit);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  if (dismissed || !current) return null;

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 px-3" style={{ paddingBottom: "max(env(safe-area-inset-bottom), 10px)" }}>
      <div className="flex items-center gap-3 rounded-xl bg-brand/95 backdrop-blur-sm px-4 py-2.5 shadow-xl border border-white/10">
        <p className="flex-1 min-w-0 text-sm font-semibold text-white truncate">{current.name}</p>
        <a
          href={current.amazonUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="shrink-0 rounded-btn bg-cta hover:bg-cta-dark px-3 py-2 text-xs font-bold text-white"
        >
          Check price
        </a>
        <button onClick={() => setDismissed(true)} className="shrink-0 text-white/50 hover:text-white text-lg leading-none" aria-label="Dismiss">
          ×
        </button>
      </div>
    </div>
  );
}
