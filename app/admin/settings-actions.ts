"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin-auth";
import {
  updateHomepageSettings,
  updateGlobalSettings,
  updateAffiliateSettings,
  updateFooterSettings,
  type HomepageSettings,
  type GlobalSettings,
  type AffiliateSettings,
  type FooterSettings,
} from "@/lib/site-settings-store";

export interface SettingsFormState {
  error?: string;
  success?: boolean;
}

function revalidateAll() {
  revalidatePath("/", "layout");
  revalidatePath("/guide", "layout");
  revalidatePath("/deals");
  revalidatePath("/categories", "layout");
  revalidatePath("/admin/settings");
}

// ── Homepage ──────────────────────────────────────────────────────────────────

export async function updateHomepageSettingsAction(
  _prev: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  if (!(await requireAdminSession())) return { error: "Unauthorized." };
  try {
    const value: HomepageSettings = {
      hero: {
        eyebrow: str(formData, "hero.eyebrow"),
        headline: str(formData, "hero.headline"),
        headlineAccent: str(formData, "hero.headlineAccent"),
        subtitle: str(formData, "hero.subtitle"),
        primaryCtaText: str(formData, "hero.primaryCtaText"),
        primaryCtaHref: str(formData, "hero.primaryCtaHref"),
        secondaryCtaText: str(formData, "hero.secondaryCtaText"),
        secondaryCtaHref: str(formData, "hero.secondaryCtaHref"),
        searchPlaceholder: str(formData, "hero.searchPlaceholder"),
        badgeText: str(formData, "hero.badgeText"),
        heroImageUrl: str(formData, "hero.heroImageUrl"),
        heroImageAlt: str(formData, "hero.heroImageAlt"),
        featuredProductSlugs: lines(formData, "hero.featuredProductSlugs"),
      },
      trustBar: {
        items: [
          { number: "14", unit: "products", label: str(formData, "trust.0.label"), description: str(formData, "trust.0.description") },
          { number: "6", unit: "buying guides", label: str(formData, "trust.1.label"), description: str(formData, "trust.1.description") },
          { number: "5", unit: "scoring criteria", label: str(formData, "trust.2.label"), description: str(formData, "trust.2.description") },
          { number: "1-10", unit: "score scale", label: str(formData, "trust.3.label"), description: str(formData, "trust.3.description") },
        ],
      },
      featuredGuideSlug: str(formData, "featuredGuideSlug"),
      sections: {
        guides: {
          title: str(formData, "sections.guides.title"),
          description: str(formData, "sections.guides.description"),
          limit: parseInt(str(formData, "sections.guides.limit") || "6", 10),
        },
        deals: {
          title: str(formData, "sections.deals.title"),
          description: str(formData, "sections.deals.description"),
        },
        categories: {
          title: str(formData, "sections.categories.title"),
          description: str(formData, "sections.categories.description"),
        },
      },
      newsletter: {
        enabled: formData.get("newsletter.enabled") === "true",
        eyebrow: str(formData, "newsletter.eyebrow"),
        title: str(formData, "newsletter.title"),
        description: str(formData, "newsletter.description"),
        inputPlaceholder: str(formData, "newsletter.inputPlaceholder"),
        buttonText: str(formData, "newsletter.buttonText"),
        disclaimer: str(formData, "newsletter.disclaimer"),
      },
    };
    await updateHomepageSettings(value);
    revalidateAll();
    return { success: true };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

// ── Global ────────────────────────────────────────────────────────────────────

export async function updateGlobalSettingsAction(
  _prev: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  if (!(await requireAdminSession())) return { error: "Unauthorized." };
  try {
    const value: GlobalSettings = {
      siteName: str(formData, "siteName"),
      siteTagline: str(formData, "siteTagline"),
      header: {
        logoText: str(formData, "header.logoText"),
        showDealsButton: formData.get("header.showDealsButton") === "true",
        dealsButtonText: str(formData, "header.dealsButtonText"),
      },
    };
    await updateGlobalSettings(value);
    revalidateAll();
    return { success: true };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

// ── Affiliate ─────────────────────────────────────────────────────────────────

export async function updateAffiliateSettingsAction(
  _prev: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  if (!(await requireAdminSession())) return { error: "Unauthorized." };
  try {
    const value: AffiliateSettings = {
      disclosureShort: str(formData, "disclosureShort"),
      disclosureFull: str(formData, "disclosureFull"),
      disclosureBannerText: str(formData, "disclosureBannerText"),
      amazonTag: str(formData, "amazonTag"),
    };
    await updateAffiliateSettings(value);
    revalidateAll();
    return { success: true };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

// ── Footer ────────────────────────────────────────────────────────────────────

export async function updateFooterSettingsAction(
  _prev: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  if (!(await requireAdminSession())) return { error: "Unauthorized." };
  try {
    const value: FooterSettings = {
      description: str(formData, "description"),
      copyrightText: str(formData, "copyrightText"),
      showAffiliateDisclosure: formData.get("showAffiliateDisclosure") === "true",
    };
    await updateFooterSettings(value);
    revalidateAll();
    return { success: true };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function str(formData: FormData, key: string): string {
  return ((formData.get(key) as string | null)?.trim()) ?? "";
}

function lines(formData: FormData, key: string): string[] {
  return str(formData, key).split("\n").map((s) => s.trim()).filter(Boolean);
}
