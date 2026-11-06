"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import {
  createGuide,
  updateGuide,
  archiveGuide,
  isGuideSlugUnique,
} from "@/lib/guides-store";
import type { StoredGuide, GuideProductPick } from "@/lib/guides-store";
import type { GuideSection, GuideFaq } from "@/data/guides";
import { requireAdminSession } from "@/lib/admin-auth";

export interface GuideFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseLines(value: string): string[] {
  return value.split("\n").map((s) => s.trim()).filter(Boolean);
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function parseSections(formData: FormData): GuideSection[] {
  const sections: GuideSection[] = [];
  let i = 0;
  while (true) {
    const body = (formData.get(`section_body_${i}`) as string | null)?.trim();
    if (body === undefined) break;
    if (body) sections.push({ heading: "", body });
    i++;
    if (i > 50) break;
  }
  return sections;
}

function parseFaq(formData: FormData): GuideFaq[] {
  const faq: GuideFaq[] = [];
  let i = 0;
  while (true) {
    const question = (formData.get(`faq_question_${i}`) as string | null)?.trim();
    const answer = (formData.get(`faq_answer_${i}`) as string | null)?.trim();
    if (question === undefined && answer === undefined) break;
    if (question || answer) faq.push({ question: question ?? "", answer: answer ?? "" });
    i++;
    if (i > 50) break;
  }
  return faq;
}

function parseFormData(formData: FormData): Omit<StoredGuide, "id"> & { id?: string } {
  const title = (formData.get("title") as string | null)?.trim() ?? "";
  const rawSlug = (formData.get("slug") as string | null)?.trim() ?? "";
  const slug = rawSlug || slugify(title);

  return {
    title,
    slug,
    categorySlug: (formData.get("categorySlug") as string | null)?.trim() ?? "",
    subcategorySlug: (formData.get("subcategorySlug") as string | null)?.trim() ?? "",
    description: (formData.get("description") as string | null)?.trim() ?? "",
    heroImage: (formData.get("heroImage") as string | null)?.trim() ?? "",
    heroImageAlt: (formData.get("heroImageAlt") as string | null)?.trim() ?? "",
    thumbnailImage: (formData.get("thumbnailImage") as string | null)?.trim() ?? "",
    metaTitle: (formData.get("metaTitle") as string | null)?.trim() ?? "",
    metaDescription: (formData.get("metaDescription") as string | null)?.trim() ?? "",
    mainKeyword: (formData.get("mainKeyword") as string | null)?.trim() ?? "",
    subKeywords: parseLines((formData.get("subKeywords") as string) ?? ""),
    intro: (formData.get("intro") as string | null)?.trim() ?? "",
    recommendedProductIds: parseLines((formData.get("recommendedProductIds") as string) ?? ""),
    relatedGuideSlugs: parseLines((formData.get("relatedGuideSlugs") as string) ?? ""),
    author: (formData.get("author") as string | null)?.trim() ?? "MachineFanatic Editorial Team",
    readTime: (formData.get("readTime") as string | null)?.trim() ?? "",
    lastUpdated: new Date().toISOString().split("T")[0],
    sections: parseSections(formData),
    faq: parseFaq(formData),
    status: ((formData.get("status") as string | null)?.trim() ?? "draft") as StoredGuide["status"],
    productPicks: parseProductPicks(formData),
  };
}

function parseProductPicks(formData: FormData): GuideProductPick[] {
  const raw = (formData.get("product_picks_json") as string | null)?.trim();
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as GuideProductPick[]) : [];
  } catch {
    return [];
  }
}

const PROHIBITED_PHRASES = ["we tested", "we tried", "in our lab", "hands-on", "we measured"];

function validatePublishFields(data: ReturnType<typeof parseFormData>): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.metaTitle) errors.metaTitle = "Meta title is required before publishing.";
  if (data.metaTitle && data.metaTitle.length > 60) errors.metaTitle = "Meta title must be 60 characters or fewer.";
  if (!data.metaDescription) errors.metaDescription = "Meta description is required before publishing.";
  if (data.metaDescription && data.metaDescription.length < 120)
    errors.metaDescription = "Meta description must be at least 120 characters.";
  if (data.sections.length === 0 && (!data.productPicks || data.productPicks.length === 0))
    errors.sections = "A guide must have at least one content section or one product pick before publishing.";

  // Check for prohibited phrases across all text fields
  const allText = [
    data.intro,
    ...data.sections.map((s) => `${s.heading} ${s.body}`),
    ...data.faq.map((f) => `${f.question} ${f.answer}`),
    ...(data.productPicks ?? []).map((p) => `${p.summary} ${p.whyItWins}`),
  ].join(" ").toLowerCase();

  const found = PROHIBITED_PHRASES.find((phrase) => allText.includes(phrase));
  if (found) errors.content = `Prohibited phrase detected: "${found}". Use "we evaluated", "we researched", or "based on product specs" instead.`;

  return errors;
}

function validateFields(data: ReturnType<typeof parseFormData>): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.title) errors.title = "Title is required.";
  if (!data.slug) errors.slug = "Slug is required.";
  if (data.slug && !/^[a-z0-9-]+$/.test(data.slug)) errors.slug = "Slug must be lowercase letters, numbers, and hyphens only.";
  if (!data.categorySlug) errors.categorySlug = "Category is required.";
  for (const s of data.sections) {
    if (s.body && !s.body.trim()) {
      errors.sections = "Section body cannot be empty whitespace.";
      break;
    }
  }
  for (const f of data.faq) {
    if ((f.question && !f.answer) || (!f.question && f.answer)) {
      errors.faq = "Each FAQ entry needs both a question and answer.";
      break;
    }
  }
  // Extra publish-specific checks
  if (data.status === "published") {
    const publishErrors = validatePublishFields(data);
    Object.assign(errors, publishErrors);
  }
  return errors;
}

function revalidateAll(id?: string, slug?: string, categorySlug?: string) {
  revalidatePath("/admin/guides");
  if (id) revalidatePath(`/admin/guides/${id}/edit`);
  if (id) revalidatePath(`/admin/guides/${id}/preview`);
  revalidatePath("/guide");
  revalidatePath("/");
  if (slug) revalidatePath(`/guide/${slug}`);
  if (categorySlug) revalidatePath(`/categories/${categorySlug}`);
}

// ── Actions ───────────────────────────────────────────────────────────────────

export async function createGuideAction(
  _prev: GuideFormState,
  formData: FormData
): Promise<GuideFormState> {
  if (!(await requireAdminSession())) return { error: "Unauthorized." };
  const data = parseFormData(formData);
  const fieldErrors = validateFields(data);

  try {
    if (data.slug && !(await isGuideSlugUnique(data.slug)))
      fieldErrors.slug = "A guide with this slug already exists.";
  } catch (e) {
    return { error: (e as Error).message };
  }

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const id = nanoid();
  try {
    await createGuide({ ...data, id } as StoredGuide);
  } catch (e) {
    return { error: (e as Error).message };
  }

  revalidateAll(undefined, data.slug, data.categorySlug);
  redirect("/admin/guides");
}

export async function updateGuideAction(
  id: string,
  _prev: GuideFormState,
  formData: FormData
): Promise<GuideFormState> {
  if (!(await requireAdminSession())) return { error: "Unauthorized." };
  const data = parseFormData(formData);
  const fieldErrors = validateFields(data);

  try {
    if (data.slug && !(await isGuideSlugUnique(data.slug, id)))
      fieldErrors.slug = "A guide with this slug already exists.";
  } catch (e) {
    return { error: (e as Error).message };
  }

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  try {
    await updateGuide(id, data);
  } catch (e) {
    return { error: (e as Error).message };
  }

  revalidateAll(id, data.slug, data.categorySlug);
  redirect("/admin/guides");
}

export async function archiveGuideAction(id: string): Promise<void> {
  if (!(await requireAdminSession())) return;
  await archiveGuide(id);
  revalidateAll();
  redirect("/admin/guides");
}
