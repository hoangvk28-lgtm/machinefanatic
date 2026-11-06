// ─── Types ───────────────────────────────────────────────────────────────────

export interface ProductScore {
  overall: number;       // 1-10  weighted aggregate
  smallSpaceFit: number; // how well it works in a tight/dorm space
  buildQuality: number;  // materials, finish, sturdiness
  easeOfUse: number;     // setup time, daily usability
  valueForMoney: number; // price vs. performance vs. competition
  buyerFeedback: number; // derived from verified Amazon review patterns
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categorySlug: string;
  subcategorySlug: string;
  image: string;
  amazonUrl: string;
  priceRange: string;   // display string, e.g. "$25-$30"
  badge?: string;       // single primary editorial badge
  shortDescription: string;
  bestFor: string[];
  notIdealFor: string[];
  specs: Record<string, string>;
  pros: string[];
  cons: string[];
  scores: ProductScore;
  reviewSummary: string;
  alternatives: string[];      // sibling product IDs
  relatedGuideSlugs: string[]; // guides that feature this product
  // Product Library fields (Phase 2)
  asin?: string;           // Amazon ASIN (auto-builds amazonUrl if set)
  priceLabel?: "Budget" | "Mid-range" | "Premium" | "Check Amazon";
  useCase?: string;        // one-line use-case summary for editors
  sourceNotes?: string;    // internal verification notes, not rendered publicly
}

// ─── Data ─────────────────────────────────────────────────────────────────────
// Empty for a fresh site. Most guides on this pipeline (data/guides/<slug>.ts +
// scripts/generate-guide-page.mjs) carry their own products[] inline and don't
// need entries here — this file is the legacy static fallback array, kept only
// for guides built via the older Supabase-backed component pipeline.

export const products: Product[] = [];
