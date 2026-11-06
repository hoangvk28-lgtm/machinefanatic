"use client";

import { useState } from "react";
import Image from "next/image";

interface AtAGlanceItem {
  rank: number;
  badge?: string;
  name: string;
  brand?: string;
  imageUrl: string;
  affiliateUrl: string;
  pros: { text: string }[];
  cons: { text: string; severity?: "minor" | "major" }[];
  anchorId: string; // scrolls to the matching detailed review section below
}

interface AtAGlanceProps {
  items: AtAGlanceItem[];
}

function AtAGlanceRow({ item }: { item: AtAGlanceItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border last:border-0">
      <div className="flex items-center gap-4 py-4 px-1">
        <div className="shrink-0 w-16 h-16 rounded-lg bg-bg border border-border overflow-hidden flex items-center justify-center">
          <Image
            src={item.imageUrl}
            alt={item.name}
            width={64}
            height={64}
            className="object-contain w-full h-full p-1"
            unoptimized
          />
        </div>

        <div className="flex-1 min-w-0">
          {item.badge && (
            <a
              href={`#${item.anchorId}`}
              className="text-xs font-bold text-brand hover:text-brand-dark transition-colors leading-tight block mb-0.5"
            >
              {item.badge}
            </a>
          )}
          <p className="text-sm font-semibold text-ink leading-snug line-clamp-2">{item.name}</p>
          <a
            href={`#${item.anchorId}`}
            className="text-[11px] text-ink-muted hover:text-brand transition-colors mt-0.5 inline-block"
          >
            ↓ See why we picked it
          </a>
        </div>

        <a
          href={item.affiliateUrl}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          className="shrink-0 px-4 py-2 rounded-lg text-xs font-bold text-white transition-all hover:opacity-90 whitespace-nowrap"
          style={{ background: "#FF9900" }}
        >
          Check price
        </a>
      </div>

      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-center gap-1.5 py-2 text-[11px] font-bold uppercase tracking-widest text-ink-muted hover:text-ink transition-colors border-t border-dashed border-border"
      >
        {`${open ? "Hide" : "Show"} Pros & Cons`}
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="grid grid-cols-2 gap-4 px-4 pb-4 pt-3 bg-bg animate-in fade-in slide-in-from-top-1 duration-150">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-cta mb-2">Pros</p>
            <ul className="space-y-1.5">
              {item.pros.map((pro, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-ink">
                  <span className="mt-0.5 w-3.5 h-3.5 rounded-full bg-cta-light text-cta flex items-center justify-center shrink-0 font-bold text-[9px]">
                    +
                  </span>
                  {pro.text}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-accent-dark mb-2">Cons</p>
            <ul className="space-y-1.5">
              {item.cons.map((con, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-ink">
                  <span
                    className="mt-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 font-bold text-[9px]"
                    style={{
                      background: con.severity === "major" ? "#fee2e2" : "#fef9c3",
                      color: con.severity === "major" ? "#dc2626" : "#d97706",
                    }}
                  >
                    &minus;
                  </span>
                  {con.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export function AtAGlance({ items }: AtAGlanceProps) {
  return (
    <div className="my-8 rounded-2xl border border-border bg-white shadow-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border bg-brand flex items-center gap-2">
        <svg className="w-4 h-4 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
        </svg>
        <h2 className="text-sm font-bold text-white uppercase tracking-widest">At a Glance</h2>
      </div>

      <div className="px-4">
        {items.map((item) => (
          <AtAGlanceRow key={item.rank} item={item} />
        ))}
      </div>
    </div>
  );
}

export type { AtAGlanceItem };
