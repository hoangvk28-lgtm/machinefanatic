"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import {
  createDeal,
  updateDeal,
  archiveDeal,
  isDealSlugUnique,
} from "@/lib/deals-store";
import type { StoredDeal } from "@/lib/deals-store";
import { requireAdminSession } from "@/lib/admin-auth";

export interface DealFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function parseFormData(formData: FormData): Omit<StoredDeal, "id" | "createdAt" | "updatedAt"> {
  const title = (formData.get("title") as string | null)?.trim() ?? "";
  const rawSlug = (formData.get("slug") as string | null)?.trim() ?? "";
  const slug = rawSlug || slugify(title);

  return {
    title,
    slug,
    label: (formData.get("label") as string | null)?.trim() ?? "Worth checking",
    description: (formData.get("description") as string | null)?.trim() ?? "",
    section: (formData.get("section") as string | null)?.trim() ?? "general",
    placement: (formData.get("placement") as string | null)?.trim() ?? "deals",
    productId: (formData.get("productId") as string | null)?.trim() ?? "",
    productSlug: (formData.get("productSlug") as string | null)?.trim() ?? "",
    amazonUrlOverride: (formData.get("amazonUrlOverride") as string | null)?.trim() ?? "",
    ctaText: (formData.get("ctaText") as string | null)?.trim() || "Check current price",
    priceRangeOverride: (formData.get("priceRangeOverride") as string | null)?.trim() ?? "",
    imageOverride: (formData.get("imageOverride") as string | null)?.trim() ?? "",
    imageAlt: (formData.get("imageAlt") as string | null)?.trim() ?? "",
    featured: formData.get("featured") === "true",
    displayOrder: parseInt((formData.get("displayOrder") as string | null)?.trim() ?? "0", 10) || 0,
    status: ((formData.get("status") as string | null)?.trim() ?? "draft") as StoredDeal["status"],
    archived: false,
    startsAt: (formData.get("startsAt") as string | null)?.trim() ?? "",
    endsAt: (formData.get("endsAt") as string | null)?.trim() ?? "",
  };
}

function validateFields(data: ReturnType<typeof parseFormData>): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.title) errors.title = "Title is required.";
  if (!data.slug) errors.slug = "Slug is required.";
  if (data.slug && !/^[a-z0-9-]+$/.test(data.slug))
    errors.slug = "Slug must be lowercase letters, numbers, and hyphens only.";
  if (!data.label) errors.label = "Label is required.";
  return errors;
}

function revalidateAll(id?: string) {
  revalidatePath("/admin/deals");
  if (id) revalidatePath(`/admin/deals/${id}/edit`);
  revalidatePath("/deals");
  revalidatePath("/", "layout");
  revalidatePath("/categories", "layout");
}

export async function createDealAction(
  _prev: DealFormState,
  formData: FormData
): Promise<DealFormState> {
  if (!(await requireAdminSession())) return { error: "Unauthorized." };
  const data = parseFormData(formData);
  const fieldErrors = validateFields(data);

  try {
    if (data.slug && !(await isDealSlugUnique(data.slug)))
      fieldErrors.slug = "A deal with this slug already exists.";
  } catch (e) {
    return { error: (e as Error).message };
  }

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const id = nanoid();
  const now = new Date().toISOString();
  try {
    await createDeal({ ...data, id, createdAt: now, updatedAt: now } as StoredDeal);
  } catch (e) {
    return { error: (e as Error).message };
  }

  revalidateAll();
  redirect("/admin/deals");
}

export async function updateDealAction(
  id: string,
  _prev: DealFormState,
  formData: FormData
): Promise<DealFormState> {
  if (!(await requireAdminSession())) return { error: "Unauthorized." };
  const data = parseFormData(formData);
  const fieldErrors = validateFields(data);

  try {
    if (data.slug && !(await isDealSlugUnique(data.slug, id)))
      fieldErrors.slug = "A deal with this slug already exists.";
  } catch (e) {
    return { error: (e as Error).message };
  }

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  try {
    await updateDeal(id, data);
  } catch (e) {
    return { error: (e as Error).message };
  }

  revalidateAll(id);
  redirect("/admin/deals");
}

export async function archiveDealAction(id: string): Promise<void> {
  if (!(await requireAdminSession())) return;
  await archiveDeal(id);
  revalidateAll();
  redirect("/admin/deals");
}
