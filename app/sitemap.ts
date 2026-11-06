import { legacySlugs } from "@/data/legacy-registry";
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { products as staticProducts } from "@/data/products";
import { guides as staticGuides } from "@/data/guides";
import { categories } from "@/data/categories";
import { isSupabaseConfigured } from "@/lib/supabase/server";

// Cache the sitemap for 24h instead of rendering it (and querying Supabase) on every crawl.
export const revalidate = 86400;

// Try to load published slugs from Supabase; merge with static data so no slug is ever missing.
async function getPublishedProductSlugs(): Promise<{ slug: string; updatedAt: string }[]> {
  const staticEntries = staticProducts.map((p) => ({ slug: p.slug, updatedAt: new Date().toISOString() }));

  if (!isSupabaseConfigured()) return staticEntries;

  try {
    const { createAdminClient } = await import("@/lib/supabase/server");
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("products")
      .select("slug,updated_at")
      .eq("status", "published")
      .eq("archived", false)
      .order("updated_at", { ascending: false });
    if (data && data.length > 0) {
      // Merge: Supabase entries take precedence (have real updated_at), static fills the gaps.
      const supabaseSlugs = new Set(data.map((r) => r.slug as string));
      const dbEntries = data.map((r) => ({ slug: r.slug as string, updatedAt: r.updated_at as string }));
      const staticOnly = staticEntries.filter((e) => !supabaseSlugs.has(e.slug));
      return [...dbEntries, ...staticOnly];
    }
  } catch {
    // fall through to static fallback
  }
  return staticEntries;
}

async function getPublishedGuideSlugs(): Promise<{ slug: string; updatedAt: string }[]> {
  // Always start with static guides — these are the source of truth for all published pages.
  const staticEntries = staticGuides.map((g) => ({ slug: g.slug, updatedAt: g.lastUpdated }));

  if (!isSupabaseConfigured()) return staticEntries;

  try {
    const { createAdminClient } = await import("@/lib/supabase/server");
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("guides")
      .select("slug,updated_at")
      .eq("status", "published")
      .eq("archived", false)
      .order("updated_at", { ascending: false });

    if (data && data.length > 0) {
      // Merge: Supabase entries take precedence (have real updated_at), static fills the gaps.
      const supabaseSlugs = new Set(data.map((r) => r.slug as string));
      const dbEntries = data.map((r) => ({ slug: r.slug as string, updatedAt: r.updated_at as string }));
      const staticOnly = staticEntries.filter((e) => !supabaseSlugs.has(e.slug));
      return [...dbEntries, ...staticOnly];
    }
  } catch {
    // fall through to static fallback
  }

  return staticEntries;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  const [productSlugs, guideSlugs] = await Promise.all([
    getPublishedProductSlugs(),
    getPublishedGuideSlugs(),
  ]);

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL,                               lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${SITE_URL}/guide`,                     lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${SITE_URL}/reviews`,                  lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${SITE_URL}/compare`,                  lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${SITE_URL}/categories`,               lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${SITE_URL}/deals`,                    lastModified: now, changeFrequency: "daily",   priority: 0.7 },
    { url: `${SITE_URL}/how-we-review`,            lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    ...legacySlugs.map((s) => ({ url: `${SITE_URL}/${s}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: `${SITE_URL}/author/james-miller`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/about-us`,                 lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`,                  lastModified: now, changeFrequency: "yearly",  priority: 0.4 },
    { url: `${SITE_URL}/affiliate-disclosure`,     lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${SITE_URL}/privacy-policy`,           lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${SITE_URL}/terms-of-use`,             lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
  ];

  // Published buying guide pages (Supabase or static fallback)
  const guidePages: MetadataRoute.Sitemap = guideSlugs.map(({ slug, updatedAt }) => ({
    url: `${SITE_URL}/guide/${slug}`,
    lastModified: updatedAt,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  // Published product review pages (Supabase or static fallback)
  const reviewPages: MetadataRoute.Sitemap = productSlugs.map(({ slug, updatedAt }) => ({
    url: `${SITE_URL}/reviews/${slug}`,
    lastModified: updatedAt,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Category hub pages
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE_URL}/categories/${cat.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Category compare pages
  const comparePages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE_URL}/compare/${cat.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...guidePages,
    ...reviewPages,
    ...categoryPages,
    ...comparePages,
  ];
}
