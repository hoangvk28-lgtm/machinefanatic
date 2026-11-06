import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/server";

export interface DashboardStats {
  products: {
    total: number;
    published: number;
    draft: number;
    archived: number;
    missingImage: number;
    missingAmazonUrl: number;
  };
  guides: {
    total: number;
    published: number;
    draft: number;
    archived: number;
    missingHeroImage: number;
    missingMetaDescription: number;
    missingProducts: number;
  };
  deals: {
    total: number;
    active: number;
    draft: number;
    inactive: number;
    featured: number;
    missingProduct: number;
  };
  media: {
    total: number;
    missingAltText: number;
  };
  settings: {
    homepageConfigured: boolean;
    affiliateConfigured: boolean;
    footerConfigured: boolean;
  };
}

export interface RecentItem {
  id: string;
  title: string;
  slug: string;
  status: string;
  updatedAt: string;
  type: "product" | "guide" | "deal" | "media";
}

export interface DashboardData {
  stats: DashboardStats;
  recentActivity: RecentItem[];
  healthWarnings: HealthWarning[];
  isLive: boolean;
}

export interface HealthWarning {
  id: string;
  severity: "error" | "warning" | "info";
  title: string;
  description: string;
  actionHref: string;
  actionLabel: string;
  count: number;
}

const FALLBACK: DashboardData = {
  stats: {
    products: { total: 0, published: 0, draft: 0, archived: 0, missingImage: 0, missingAmazonUrl: 0 },
    guides: { total: 0, published: 0, draft: 0, archived: 0, missingHeroImage: 0, missingMetaDescription: 0, missingProducts: 0 },
    deals: { total: 0, active: 0, draft: 0, inactive: 0, featured: 0, missingProduct: 0 },
    media: { total: 0, missingAltText: 0 },
    settings: { homepageConfigured: false, affiliateConfigured: false, footerConfigured: false },
  },
  recentActivity: [],
  healthWarnings: [],
  isLive: false,
};

export async function getDashboardData(): Promise<DashboardData> {
  if (!isSupabaseConfigured()) return FALLBACK;

  try {
    const supabase = createAdminClient();

    const [
      { data: allProducts },
      { data: allGuides },
      { data: allDeals },
      { data: allMedia },
      { data: allSettings },
    ] = await Promise.all([
      supabase.from("products").select("id,slug,name,status,archived,image,amazon_url,updated_at").order("updated_at", { ascending: false }),
      supabase.from("guides").select("id,slug,title,status,archived,hero_image,meta_description,recommended_product_ids,updated_at").order("updated_at", { ascending: false }),
      supabase.from("deals").select("id,slug,title,status,archived,featured,product_id,product_slug,amazon_url_override,updated_at").order("updated_at", { ascending: false }),
      supabase.from("media_assets").select("id,filename,url,alt_text,archived,created_at").order("created_at", { ascending: false }),
      supabase.from("site_settings").select("key"),
    ]);

    const products = (allProducts ?? []).filter((p) => !p.archived);
    const guides = (allGuides ?? []).filter((g) => !g.archived);
    const deals = (allDeals ?? []).filter((d) => !d.archived);
    const media = (allMedia ?? []).filter((m) => !m.archived);
    const settingKeys = new Set((allSettings ?? []).map((s: { key: string }) => s.key));

    // Product stats
    const prodStats = {
      total: products.length,
      published: products.filter((p) => p.status === "published").length,
      draft: products.filter((p) => p.status === "draft").length,
      archived: (allProducts ?? []).filter((p) => p.archived).length,
      missingImage: products.filter((p) => !p.image).length,
      missingAmazonUrl: products.filter((p) => !p.amazon_url || !String(p.amazon_url).includes("amazon.com")).length,
    };

    // Guide stats
    const guideStats = {
      total: guides.length,
      published: guides.filter((g) => g.status === "published").length,
      draft: guides.filter((g) => g.status === "draft").length,
      archived: (allGuides ?? []).filter((g) => g.archived).length,
      missingHeroImage: guides.filter((g) => !g.hero_image).length,
      missingMetaDescription: guides.filter((g) => !g.meta_description).length,
      missingProducts: guides.filter((g) => {
        const ids = g.recommended_product_ids;
        return !ids || (Array.isArray(ids) && ids.length === 0);
      }).length,
    };

    // Deal stats
    const dealStats = {
      total: deals.length,
      active: deals.filter((d) => d.status === "active").length,
      draft: deals.filter((d) => d.status === "draft").length,
      inactive: deals.filter((d) => d.status === "inactive").length,
      featured: deals.filter((d) => d.featured).length,
      missingProduct: deals.filter((d) => d.status === "active" && !d.product_slug && !d.amazon_url_override).length,
    };

    // Media stats
    const mediaStats = {
      total: media.length,
      missingAltText: media.filter((m) => !m.alt_text).length,
    };

    // Settings
    const settingsStats = {
      homepageConfigured: settingKeys.has("homepage"),
      affiliateConfigured: settingKeys.has("affiliate"),
      footerConfigured: settingKeys.has("footer"),
    };

    // Recent activity (last 5 across all types)
    const recentActivity: RecentItem[] = [
      ...products.slice(0, 5).map((p) => ({
        id: p.id,
        title: p.name,
        slug: p.slug,
        status: p.status,
        updatedAt: p.updated_at,
        type: "product" as const,
      })),
      ...guides.slice(0, 5).map((g) => ({
        id: g.id,
        title: g.title,
        slug: g.slug,
        status: g.status,
        updatedAt: g.updated_at,
        type: "guide" as const,
      })),
      ...deals.slice(0, 3).map((d) => ({
        id: d.id,
        title: d.title,
        slug: d.slug,
        status: d.status,
        updatedAt: d.updated_at,
        type: "deal" as const,
      })),
      ...media.slice(0, 3).map((m) => ({
        id: m.id,
        title: m.filename,
        slug: "",
        status: "active",
        updatedAt: m.created_at,
        type: "media" as const,
      })),
    ]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 8);

    // Health warnings
    const healthWarnings: HealthWarning[] = [];

    if (prodStats.missingAmazonUrl > 0) {
      healthWarnings.push({
        id: "prod-amazon",
        severity: "error",
        title: "Products missing Amazon URL",
        description: `${prodStats.missingAmazonUrl} product${prodStats.missingAmazonUrl > 1 ? "s are" : " is"} missing a valid Amazon affiliate URL. These products cannot link to Amazon.`,
        actionHref: "/admin/products",
        actionLabel: "Fix in Products",
        count: prodStats.missingAmazonUrl,
      });
    }
    if (prodStats.missingImage > 0) {
      healthWarnings.push({
        id: "prod-image",
        severity: "warning",
        title: "Products missing image",
        description: `${prodStats.missingImage} product${prodStats.missingImage > 1 ? "s are" : " is"} missing an image URL. Category illustrations will be shown as fallback.`,
        actionHref: "/admin/products",
        actionLabel: "Fix in Products",
        count: prodStats.missingImage,
      });
    }
    if (guideStats.missingHeroImage > 0) {
      healthWarnings.push({
        id: "guide-hero",
        severity: "warning",
        title: "Guides missing hero image",
        description: `${guideStats.missingHeroImage} guide${guideStats.missingHeroImage > 1 ? "s are" : " is"} missing a hero image.`,
        actionHref: "/admin/guides",
        actionLabel: "Fix in Guides",
        count: guideStats.missingHeroImage,
      });
    }
    if (guideStats.missingMetaDescription > 0) {
      healthWarnings.push({
        id: "guide-meta",
        severity: "warning",
        title: "Guides missing SEO meta description",
        description: `${guideStats.missingMetaDescription} guide${guideStats.missingMetaDescription > 1 ? "s are" : " is"} missing a meta description. This hurts search engine visibility.`,
        actionHref: "/admin/guides",
        actionLabel: "Fix in Guides",
        count: guideStats.missingMetaDescription,
      });
    }
    if (dealStats.missingProduct > 0) {
      healthWarnings.push({
        id: "deal-product",
        severity: "warning",
        title: "Active deals missing product link",
        description: `${dealStats.missingProduct} active deal${dealStats.missingProduct > 1 ? "s have" : " has"} no linked product and no Amazon URL override. These deals cannot link anywhere.`,
        actionHref: "/admin/deals",
        actionLabel: "Fix in Deals",
        count: dealStats.missingProduct,
      });
    }
    if (mediaStats.missingAltText > 0) {
      healthWarnings.push({
        id: "media-alt",
        severity: "info",
        title: "Media assets missing alt text",
        description: `${mediaStats.missingAltText} image${mediaStats.missingAltText > 1 ? "s are" : " is"} missing alt text. This affects accessibility and SEO.`,
        actionHref: "/admin/media",
        actionLabel: "Fix in Media",
        count: mediaStats.missingAltText,
      });
    }
    if (!settingsStats.homepageConfigured) {
      healthWarnings.push({
        id: "settings-hp",
        severity: "info",
        title: "Homepage settings not configured",
        description: "Run npm run seed:settings or save settings from the admin to populate homepage CMS data.",
        actionHref: "/admin/settings",
        actionLabel: "Configure Settings",
        count: 0,
      });
    }

    return {
      stats: {
        products: prodStats,
        guides: guideStats,
        deals: dealStats,
        media: mediaStats,
        settings: settingsStats,
      },
      recentActivity,
      healthWarnings,
      isLive: true,
    };
  } catch (e) {
    console.error("[admin-dashboard] Error fetching stats:", (e as Error).message);
    return { ...FALLBACK, isLive: false };
  }
}
