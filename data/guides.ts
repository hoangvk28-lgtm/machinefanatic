// ─── Types ───────────────────────────────────────────────────────────────────

export interface GuideSection {
  heading: string;
  body: string;
}

export interface GuideFaq {
  question: string;
  answer: string;
}

export interface GuideBuyingCriterion {
  criterion: string;
  content: string; // use \n to separate bullet points within a cell
}

export interface Guide {
  title: string;
  slug: string;
  categorySlug: string;
  subcategorySlug: string;
  description: string;
  mainKeyword: string;
  subKeywords: string[];
  heroImage: string;
  thumbnailImage?: string;
  lastUpdated: string;
  author: string;
  readTime: string;
  recommendedProductIds: string[];
  sections: GuideSection[];
  faq: GuideFaq[];
  relatedGuideSlugs: string[];
  buyingCriteria?: GuideBuyingCriterion[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────
// New guides are appended here by scripts/register-new-guides.mjs (see the
// generate-guide-page.mjs + data/guides/<slug>.ts pipeline documented in
// CLAUDE.md). This array starts empty for a fresh site.

export const guides: Guide[] = [
  {
    title: "Best 50 Pint Dehumidifiers (2026)",
    slug: "best-50-pint-dehumidifiers",
    categorySlug: "home-machines",
    subcategorySlug: "",
    description: "Six 50 pint dehumidifiers compared by how they actually pull water: rating test conditions, drainage, pumps, noise and coil build, for damp basements.",
    mainKeyword: "50 pint dehumidifier",
    subKeywords: ["50 pint dehumidifier","50 pint dehumidifier guide","best 50 pint dehumidifier"],
    heroImage: "https://m.media-amazon.com/images/I/31m6sBV6kuL._SL500_.jpg",
    lastUpdated: "2026-11-06",
    author: "James Miller",
    readTime: "15 min",
    recommendedProductIds: [],
    sections: [],
    faq: [],
    relatedGuideSlugs: [],
    buyingCriteria: [],
  },
  {
    title: "Best Blenders for Crushing Ice (2026)",
    slug: "best-blenders-for-crushing-ice",
    categorySlug: "kitchen-machines",
    subcategorySlug: "",
    description: "Six ice-crushing blenders compared on rated vs peak watts, blade stack design, pitcher shape and ownership, plus when a shaved-ice machine is the better tool.",
    mainKeyword: "blender for crushing ice",
    subKeywords: ["blender for crushing ice","blender for crushing ice guide","best blender for crushing ice"],
    heroImage: "https://m.media-amazon.com/images/I/41DtVBcR1eL._SL500_.jpg",
    lastUpdated: "2026-11-06",
    author: "James Miller",
    readTime: "15 min",
    recommendedProductIds: [],
    sections: [],
    faq: [],
    relatedGuideSlugs: [],
    buyingCriteria: [],
  },
  {
    title: "Best Electric Pressure Washers (2026)",
    slug: "best-electric-pressure-washers",
    categorySlug: "outdoor-power",
    subcategorySlug: "",
    description: "Five electric pressure washers compared by rated PSI, real GPM, pump type and ownership costs, so you can pick the right one for your deck, car or driveway.",
    mainKeyword: "electric pressure washer",
    subKeywords: ["electric pressure washer","electric pressure washer guide","best electric pressure washer"],
    heroImage: "https://m.media-amazon.com/images/I/41GHbRpQtKL._SL500_.jpg",
    lastUpdated: "2026-11-06",
    author: "James Miller",
    readTime: "14 min",
    recommendedProductIds: [],
    sections: [],
    faq: [],
    relatedGuideSlugs: [],
    buyingCriteria: [],
  },
  {
    title: "Best 4000 Watt Generators (2026)",
    slug: "best-4000-watt-generators",
    categorySlug: "shop-garage",
    subcategorySlug: "",
    description: "Six 4000 watt generators compared on running watts, dual fuel output, noise, THD and runtime, so you can size one correctly for RV trips and home backup.",
    mainKeyword: "4000 watt generator",
    subKeywords: ["4000 watt generator","4000 watt generator guide","best 4000 watt generator"],
    heroImage: "https://m.media-amazon.com/images/I/41zlMnJ0QvL._SL500_.jpg",
    lastUpdated: "2026-11-06",
    author: "James Miller",
    readTime: "15 min",
    recommendedProductIds: [],
    sections: [],
    faq: [],
    relatedGuideSlugs: [],
    buyingCriteria: [],
  },
  {
    title: "Best Cordless Chainsaws (2026)",
    slug: "best-cordless-chainsaws",
    categorySlug: "outdoor-power",
    subcategorySlug: "",
    description: "Six cordless chainsaws compared on bar length, battery energy, chain speed and safety features, so you can pick one for storm cleanup, pruning or firewood.",
    mainKeyword: "cordless chainsaw",
    subKeywords: ["cordless chainsaw","cordless chainsaw guide","best cordless chainsaw"],
    heroImage: "https://m.media-amazon.com/images/I/41XdtGpsbsL._SL500_.jpg",
    lastUpdated: "2026-11-06",
    author: "James Miller",
    readTime: "14 min",
    recommendedProductIds: [],
    sections: [],
    faq: [],
    relatedGuideSlugs: [],
    buyingCriteria: [],
  },
];
