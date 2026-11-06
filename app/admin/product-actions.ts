"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  isSlugUnique,
  isAsinUnique,
  getAllProducts,
} from "@/lib/products-store";
import type { StoredProduct } from "@/lib/products-store";
import { requireAdminSession } from "@/lib/admin-auth";

export interface ProductFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function parseLines(value: string): string[] {
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseSpecs(value: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const line of value.split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      const val = line.slice(colonIdx + 1).trim();
      if (key && val) result[key] = val;
    }
  }
  return result;
}

function parseScore(value: string | null): number {
  const n = parseFloat(value ?? "0");
  if (isNaN(n)) return 0;
  return Math.min(10, Math.max(0, n));
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseFormData(formData: FormData): Omit<StoredProduct, "id"> & { id?: string } {
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const rawSlug = (formData.get("slug") as string | null)?.trim() ?? "";
  const slug = rawSlug || slugify(name);

  return {
    name,
    slug,
    categorySlug: (formData.get("categorySlug") as string | null)?.trim() ?? "",
    subcategorySlug: (formData.get("subcategorySlug") as string | null)?.trim() ?? "",
    badge: (formData.get("badge") as string | null)?.trim() || undefined,
    amazonUrl: (formData.get("amazonUrl") as string | null)?.trim() ?? "",
    image: (formData.get("image") as string | null)?.trim() ?? "",
    priceRange: (formData.get("priceRange") as string | null)?.trim() ?? "",
    shortDescription: (formData.get("shortDescription") as string | null)?.trim() ?? "",
    reviewSummary: (formData.get("reviewSummary") as string | null)?.trim() ?? "",
    bestFor: parseLines((formData.get("bestFor") as string) ?? ""),
    notIdealFor: parseLines((formData.get("notIdealFor") as string) ?? ""),
    pros: parseLines((formData.get("pros") as string) ?? ""),
    cons: parseLines((formData.get("cons") as string) ?? ""),
    alternatives: parseLines((formData.get("alternatives") as string) ?? ""),
    relatedGuideSlugs: parseLines((formData.get("relatedGuideSlugs") as string) ?? ""),
    specs: parseSpecs((formData.get("specs") as string) ?? ""),
    scores: {
      overall: parseScore(formData.get("score_overall") as string),
      smallSpaceFit: parseScore(formData.get("score_smallSpaceFit") as string),
      buildQuality: parseScore(formData.get("score_buildQuality") as string),
      easeOfUse: parseScore(formData.get("score_easeOfUse") as string),
      valueForMoney: parseScore(formData.get("score_valueForMoney") as string),
      buyerFeedback: parseScore(formData.get("score_buyerFeedback") as string),
    },
    asin: (formData.get("asin") as string | null)?.trim() || undefined,
    priceLabel: ((formData.get("priceLabel") as string | null)?.trim() || undefined) as StoredProduct["priceLabel"],
    useCase: (formData.get("useCase") as string | null)?.trim() || undefined,
    sourceNotes: (formData.get("sourceNotes") as string | null)?.trim() || undefined,
    status: (["draft", "verified", "published"].includes(formData.get("status") as string)
      ? formData.get("status")
      : "draft") as StoredProduct["status"],
    lastUpdated: new Date().toISOString().split("T")[0],
  };
}

// ── Duplicate detection ───────────────────────────────────────────────────────

function normalizeProductName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
}

async function checkDuplicates(
  data: ReturnType<typeof parseFormData>,
  excludeId?: string
): Promise<Record<string, string>> {
  const warnings: Record<string, string> = {};

  // 1. ASIN collision
  if (data.asin) {
    try {
      const asinOk = await isAsinUnique(data.asin, excludeId);
      if (!asinOk) warnings.asin = `Another active product already uses ASIN ${data.asin}.`;
    } catch { /* non-fatal */ }
  }

  // 2. Normalized name collision
  try {
    const all = await getAllProducts();
    const normalizedNew = normalizeProductName(data.name);
    const conflict = all.find(
      (p) => p.id !== excludeId && normalizeProductName(p.name) === normalizedNew
    );
    if (conflict) {
      warnings.name = `A product with a very similar name already exists: "${conflict.name}" (${conflict.slug}).`;
    }
  } catch { /* non-fatal */ }

  return warnings;
}

// Synchronous field validation (no DB calls)
function validateFields(
  data: ReturnType<typeof parseFormData>
): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.name) errors.name = "Product name is required.";
  if (!data.slug) errors.slug = "Slug is required.";
  if (!data.categorySlug) errors.categorySlug = "Category is required.";
  if (!data.subcategorySlug) errors.subcategorySlug = "Subcategory is required.";
  if ((data.status === "published" || data.status === "verified") && !data.priceRange)
    errors.priceRange = "Price range is required for verified/published products.";
  for (const [key, score] of Object.entries(data.scores)) {
    if (score < 0 || score > 10)
      errors[`score_${key}`] = "Scores must be between 0 and 10.";
  }
  return errors;
}

// ── Server Actions ────────────────────────────────────────────────────────────

export async function createProductAction(
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  if (!(await requireAdminSession())) return { error: "Unauthorized." };

  const rawName = (formData.get("name") as string | null)?.trim() ?? "";
  const rawSlug = (formData.get("slug") as string | null)?.trim() || slugify(rawName);
  const id = rawSlug;

  const data = parseFormData(formData);
  const fieldErrors = validateFields(data);

  // Async slug uniqueness check
  try {
    if (data.slug && !(await isSlugUnique(data.slug)))
      fieldErrors.slug = "A product with this slug already exists.";
  } catch (e) {
    return { error: (e as Error).message };
  }

  // Duplicate detection — block on verified/published, warn on draft
  const dupeWarnings = await checkDuplicates(data);
  if (Object.keys(dupeWarnings).length > 0) {
    if (data.status === "draft") {
      fieldErrors.duplicateWarning =
        `Possible duplicate: ${Object.values(dupeWarnings).join(" ")} Save as draft is allowed, resolve before publishing.`;
    } else {
      Object.assign(fieldErrors, dupeWarnings);
    }
  }

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  try {
    await createProduct({ ...data, id } as StoredProduct);
  } catch (e) {
    return { error: (e as Error).message };
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/reviews");
  revalidatePath("/compare");
  revalidatePath("/deals");
  redirect("/admin/products");
}

export async function updateProductAction(
  id: string,
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  if (!(await requireAdminSession())) return { error: "Unauthorized." };

  const data = parseFormData(formData);
  const fieldErrors = validateFields(data);

  // Async slug uniqueness check (exclude self)
  try {
    if (data.slug && !(await isSlugUnique(data.slug, id)))
      fieldErrors.slug = "A product with this slug already exists.";
  } catch (e) {
    return { error: (e as Error).message };
  }

  // Duplicate detection — block on verified/published, warn on draft
  const dupeWarnings = await checkDuplicates(data, id);
  if (Object.keys(dupeWarnings).length > 0) {
    if (data.status === "draft") {
      fieldErrors.duplicateWarning =
        `Possible duplicate: ${Object.values(dupeWarnings).join(" ")} Save as draft is allowed, resolve before publishing.`;
    } else {
      Object.assign(fieldErrors, dupeWarnings);
    }
  }

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  try {
    await updateProduct(id, data);
  } catch (e) {
    return { error: (e as Error).message };
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}/edit`);
  revalidatePath("/");
  revalidatePath("/reviews");
  revalidatePath("/compare");
  revalidatePath("/deals");
  redirect("/admin/products");
}

export async function deleteProductAction(id: string): Promise<void> {
  if (!(await requireAdminSession())) return;
  await deleteProduct(id);
  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/reviews");
  revalidatePath("/compare");
  revalidatePath("/deals");
  redirect("/admin/products");
}
