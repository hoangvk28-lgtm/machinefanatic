"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin-auth";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { products as staticProducts } from "@/data/products";
import { guides as staticGuides } from "@/data/guides";

export async function seedStaticProducts(): Promise<{ inserted: number; skipped: number; error?: string }> {
  if (!(await requireAdminSession())) return { inserted: 0, skipped: 0, error: "Unauthorized." };
  if (!isSupabaseConfigured()) return { inserted: 0, skipped: 0, error: "Supabase not configured." };

  const db = createAdminClient();

  // Get existing slugs to avoid duplicates
  const { data: existing } = await db.from("products").select("slug");
  const existingSlugs = new Set((existing ?? []).map((r: { slug: string }) => r.slug));

  const toInsert = staticProducts
    .filter((p) => !existingSlugs.has(p.slug))
    .map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category_slug: p.categorySlug,
      subcategory_slug: p.subcategorySlug,
      badge: p.badge ?? null,
      short_description: p.shortDescription,
      review_summary: p.reviewSummary,
      amazon_url: p.amazonUrl,
      price_range: p.priceRange,
      image: p.image,
      best_for: p.bestFor,
      not_ideal_for: p.notIdealFor,
      specs: p.specs,
      pros: p.pros,
      cons: p.cons,
      scores: p.scores,
      alternatives: p.alternatives,
      related_guide_slugs: p.relatedGuideSlugs,
      status: "published",
      archived: false,
    }));

  if (toInsert.length === 0) return { inserted: 0, skipped: staticProducts.length };

  const { error } = await db.from("products").insert(toInsert);
  if (error) return { inserted: 0, skipped: existingSlugs.size, error: error.message };

  return { inserted: toInsert.length, skipped: existingSlugs.size };
}

export async function seedStaticGuides(): Promise<{ inserted: number; skipped: number; error?: string }> {
  if (!(await requireAdminSession())) return { inserted: 0, skipped: 0, error: "Unauthorized." };
  if (!isSupabaseConfigured()) return { inserted: 0, skipped: 0, error: "Supabase not configured." };

  const db = createAdminClient();

  const { data: existing } = await db.from("guides").select("slug");
  const existingSlugs = new Set((existing ?? []).map((r: { slug: string }) => r.slug));

  const toInsert = staticGuides
    .filter((g) => !existingSlugs.has(g.slug))
    .map((g) => ({
      id: crypto.randomUUID(),
      title: g.title,
      slug: g.slug,
      category_slug: g.categorySlug,
      subcategory_slug: g.subcategorySlug,
      description: g.description,
      hero_image: g.heroImage,
      hero_image_alt: g.title,
      main_keyword: g.mainKeyword,
      sub_keywords: g.subKeywords,
      recommended_product_ids: g.recommendedProductIds,
      sections: g.sections,
      faq: g.faq,
      related_guide_slugs: g.relatedGuideSlugs,
      author: g.author,
      read_time: g.readTime,
      last_updated: g.lastUpdated,
      status: "published",
      archived: false,
    }));

  if (toInsert.length === 0) return { inserted: 0, skipped: staticGuides.length };

  const { error } = await db.from("guides").insert(toInsert);
  if (error) return { inserted: 0, skipped: existingSlugs.size, error: error.message };

  return { inserted: toInsert.length, skipped: existingSlugs.size };
}

export async function upsertStaticGuides(): Promise<{ updated: number; inserted: number; error?: string }> {
  if (!(await requireAdminSession())) return { updated: 0, inserted: 0, error: "Unauthorized." };
  if (!isSupabaseConfigured()) return { updated: 0, inserted: 0, error: "Supabase not configured." };

  const db = createAdminClient();

  // Fetch existing IDs so we preserve them (avoid breaking any FK references)
  const { data: existing } = await db.from("guides").select("id, slug");
  const existingBySlug = new Map(
    (existing ?? []).map((r: { id: string; slug: string }) => [r.slug, r.id])
  );

  const toUpsert = staticGuides.map((g) => ({
    id: existingBySlug.get(g.slug) ?? crypto.randomUUID(),
    title: g.title,
    slug: g.slug,
    category_slug: g.categorySlug,
    subcategory_slug: g.subcategorySlug,
    description: g.description,
    hero_image: g.heroImage,
    hero_image_alt: g.title,
    main_keyword: g.mainKeyword,
    sub_keywords: g.subKeywords,
    recommended_product_ids: g.recommendedProductIds,
    sections: g.sections,
    faq: g.faq,
    related_guide_slugs: g.relatedGuideSlugs,
    author: g.author,
    read_time: g.readTime,
    last_updated: g.lastUpdated,
    updated_at: new Date().toISOString(),
    status: "published",
    archived: false,
  }));

  const { error } = await db.from("guides").upsert(toUpsert, { onConflict: "slug" });
  if (error) return { updated: 0, inserted: 0, error: error.message };

  // Bust ISR cache for every guide page that was updated
  for (const g of staticGuides) {
    revalidatePath(`/guide/${g.slug}`);
  }
  revalidatePath("/guide");

  const insertedCount = toUpsert.filter((g) => !existingBySlug.has(g.slug)).length;
  return { updated: toUpsert.length - insertedCount, inserted: insertedCount };
}

export async function upsertStaticProducts(): Promise<{ updated: number; inserted: number; error?: string }> {
  if (!(await requireAdminSession())) return { updated: 0, inserted: 0, error: "Unauthorized." };
  if (!isSupabaseConfigured()) return { updated: 0, inserted: 0, error: "Supabase not configured." };

  const db = createAdminClient();

  const { data: existing } = await db.from("products").select("id, slug");
  const existingBySlug = new Map(
    (existing ?? []).map((r: { id: string; slug: string }) => [r.slug, r.id])
  );

  const toUpsert = staticProducts.map((p) => ({
    id: existingBySlug.get(p.slug) ?? p.id,
    name: p.name,
    slug: p.slug,
    category_slug: p.categorySlug,
    subcategory_slug: p.subcategorySlug,
    badge: p.badge ?? null,
    short_description: p.shortDescription,
    review_summary: p.reviewSummary,
    amazon_url: p.amazonUrl,
    price_range: p.priceRange,
    image: p.image,
    best_for: p.bestFor,
    not_ideal_for: p.notIdealFor,
    specs: p.specs,
    pros: p.pros,
    cons: p.cons,
    scores: p.scores,
    alternatives: p.alternatives,
    related_guide_slugs: p.relatedGuideSlugs,
    updated_at: new Date().toISOString(),
    status: "published",
    archived: false,
  }));

  const { error } = await db.from("products").upsert(toUpsert, { onConflict: "slug" });
  if (error) return { updated: 0, inserted: 0, error: error.message };

  // Bust ISR cache for every review page that was updated
  for (const p of staticProducts) {
    revalidatePath(`/reviews/${p.slug}`);
  }
  revalidatePath("/reviews");

  const insertedCount = toUpsert.filter((p) => !existingBySlug.has(p.slug)).length;
  return { updated: toUpsert.length - insertedCount, inserted: insertedCount };
}
