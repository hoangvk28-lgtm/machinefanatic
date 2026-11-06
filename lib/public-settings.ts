import { isSupabaseConfigured } from "@/lib/supabase/server";
import type {
  HomepageSettings,
  GlobalSettings,
  AffiliateSettings,
  FooterSettings,
} from "@/lib/site-settings-store";

// ── Defaults - match current hardcoded website copy ──────────────────────────

export const DEFAULT_HOMEPAGE_SETTINGS: HomepageSettings = {
  hero: {
    eyebrow: "EXPERT MACHINE BUYING GUIDES",
    headline: "Buy the right machine the first time.",
    headlineAccent: "",
    subtitle:
      "We read the spec sheets, decode the ratings and compare motors, output and build so you can buy with confidence.",
    primaryCtaText: "Browse Buying Guides",
    primaryCtaHref: "/categories",
    secondaryCtaText: "How We Rate",
    secondaryCtaHref: "/how-we-review",
    searchPlaceholder: "Search drills, mowers, compressors, espresso machines…",
    badgeText: "Independent editorial picks - not sponsored or paid placement.",
    heroImageUrl: "",
    heroImageAlt: "",
    featuredProductSlugs: [],
  },
  trustBar: {
    items: [
      { number: "Performance", unit: "30%", label: "Rated output, not marketing claims", description: "Torque, CFM, watts, PSI and the figures that decide real work." },
      { number: "Build", unit: "20%", label: "Durability and materials", description: "Motor type, housings, gearboxes and warranty backing." },
      { number: "Control", unit: "15%", label: "Ergonomics and handling", description: "Weight, balance, vibration and control layout." },
      { number: "Upkeep", unit: "35%", label: "Maintenance, safety and value", description: "Serviceability, safety features and cost over the machine's life." },
    ],
  },
  featuredGuideSlug: "",
  sections: {
    guides: {
      title: "Latest machine buying guides",
      description: "Spec-driven comparisons of motors, output, build quality and upkeep.",
      limit: 6,
    },
    deals: {
      title: "Budget-Friendly Picks",
      description: "Well-priced products worth checking, curated by value score.",
    },
    categories: {
      title: "Pick your machine category",
      description: "Five workshops of coverage, from cordless tools to kitchen machines.",
    },
  },
  newsletter: {
    enabled: true,
    eyebrow: "Stay Updated",
    title: "Get new machine guides in your inbox.",
    description:
      "New guides, updated picks, and practical buying tips - no spam, no sponsored content, no fluff.",
    inputPlaceholder: "you@example.com",
    buttonText: "Notify me",
    disclaimer: "No account required. Unsubscribe anytime. We'll never share your email.",
  },
};

export const DEFAULT_GLOBAL_SETTINGS: GlobalSettings = {
  siteName: "MachineFanatic",
  siteTagline: "Machines, rated by people who read the spec sheet.",
  header: {
    logoText: "MachineFanatic",
    showDealsButton: true,
    dealsButtonText: "Today's Deals",
  },
};

export const DEFAULT_AFFILIATE_SETTINGS: AffiliateSettings = {
  disclosureShort:
    "MachineFanatic is reader-supported. When you buy through links on our site, we may earn an affiliate commission at no additional cost to you.",
  disclosureFull:
    "MachineFanatic participates in affiliate programs, including the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. When you click a product link and make a purchase, we may earn a small commission at no additional cost to you. Our recommendations are based on published specifications, manufacturer documentation, and patterns in verified buyer feedback, our editorial opinions are independent and are never influenced by affiliate relationships.",
  disclosureBannerText:
    "We may earn a commission when you buy through Amazon links. Our recommendations are based on published specs, manufacturer documentation, and clear comparison criteria.",
  amazonTag: "machinefanatic-20",
};

export const DEFAULT_FOOTER_SETTINGS: FooterSettings = {
  description:
    "Independent, spec-driven buying guides for power tools, outdoor power equipment, shop machines and kitchen machines. No sponsored rankings.",
  copyrightText: "MachineFanatic. All rights reserved.",
  showAffiliateDisclosure: true,
};

// ── Public helpers with fallback ──────────────────────────────────────────────

async function safeFetch<T>(fetcher: () => Promise<T | null>, fallback: T): Promise<T> {
  if (!isSupabaseConfigured()) return fallback;
  try {
    const result = await fetcher();
    return result ?? fallback;
  } catch (e) {
    console.warn("[public-settings] Supabase error:", (e as Error).message);
    return fallback;
  }
}

export async function getPublicHomepageSettings(): Promise<HomepageSettings> {
  const { getHomepageSettings } = await import("@/lib/site-settings-store");
  return safeFetch(getHomepageSettings, DEFAULT_HOMEPAGE_SETTINGS);
}

export async function getPublicGlobalSettings(): Promise<GlobalSettings> {
  const { getGlobalSettings } = await import("@/lib/site-settings-store");
  return safeFetch(getGlobalSettings, DEFAULT_GLOBAL_SETTINGS);
}

export async function getPublicAffiliateSettings(): Promise<AffiliateSettings> {
  const { getAffiliateSettings } = await import("@/lib/site-settings-store");
  return safeFetch(getAffiliateSettings, DEFAULT_AFFILIATE_SETTINGS);
}

export async function getPublicFooterSettings(): Promise<FooterSettings> {
  const { getFooterSettings } = await import("@/lib/site-settings-store");
  return safeFetch(getFooterSettings, DEFAULT_FOOTER_SETTINGS);
}
