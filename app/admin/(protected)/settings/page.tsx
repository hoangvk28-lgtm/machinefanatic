import Link from "next/link";
import { HomepageSettingsForm } from "@/components/admin/settings/HomepageSettingsForm";
import { GlobalSettingsForm } from "@/components/admin/settings/GlobalSettingsForm";
import { AffiliateSettingsForm } from "@/components/admin/settings/AffiliateSettingsForm";
import { FooterSettingsForm } from "@/components/admin/settings/FooterSettingsForm";
import {
  DEFAULT_HOMEPAGE_SETTINGS,
  DEFAULT_GLOBAL_SETTINGS,
  DEFAULT_AFFILIATE_SETTINGS,
  DEFAULT_FOOTER_SETTINGS,
} from "@/lib/public-settings";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const TABS = [
  { key: "homepage", label: "Homepage" },
  { key: "global", label: "Global" },
  { key: "affiliate", label: "Affiliate" },
  { key: "footer", label: "Footer" },
] as const;

type Tab = (typeof TABS)[number]["key"];

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab = "homepage" } = await searchParams;
  const activeTab = (TABS.some((t) => t.key === tab) ? tab : "homepage") as Tab;

  let homepageSettings = DEFAULT_HOMEPAGE_SETTINGS;
  let globalSettings = DEFAULT_GLOBAL_SETTINGS;
  let affiliateSettings = DEFAULT_AFFILIATE_SETTINGS;
  let footerSettings = DEFAULT_FOOTER_SETTINGS;
  let configError = false;

  if (!isSupabaseConfigured()) {
    configError = true;
  } else {
    try {
      const {
        getHomepageSettings,
        getGlobalSettings,
        getAffiliateSettings,
        getFooterSettings,
      } = await import("@/lib/site-settings-store");

      const [hp, gl, af, ft] = await Promise.all([
        getHomepageSettings(),
        getGlobalSettings(),
        getAffiliateSettings(),
        getFooterSettings(),
      ]);
      if (hp) homepageSettings = hp;
      if (gl) globalSettings = gl;
      if (af) affiliateSettings = af;
      if (ft) footerSettings = ft;
    } catch (e) {
      configError = true;
      console.error(e);
    }
  }

  // Available guides for the featured guide selector
  let availableGuides: Array<{ slug: string; title: string }> = [];
  if (!configError) {
    try {
      const { getAllGuides } = await import("@/lib/guides-store");
      const guides = await getAllGuides();
      availableGuides = guides
        .filter((g) => g.status === "published")
        .map((g) => ({ slug: g.slug, title: g.title }));
    } catch {
      // Non-critical - falls back to text input
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Site Settings</h1>
        <p className="text-sm text-ink-secondary mt-0.5">Configure homepage content, global text, affiliate disclosure, and footer.</p>
      </div>

      {configError && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
          Supabase not configured - showing default values. Changes will not be persisted until{" "}
          <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>SUPABASE_SERVICE_ROLE_KEY</code> are set and migration{" "}
          <code>005_create_site_settings.sql</code> is run.
        </div>
      )}

      {/* Tab nav */}
      <div className="flex gap-1 border-b border-border">
        {TABS.map((t) => (
          <Link prefetch={false}
            key={t.key}
            href={`/admin/settings?tab=${t.key}`}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === t.key
                ? "border-brand text-brand"
                : "border-transparent text-ink-secondary hover:text-ink"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {/* Tab panels */}
      {activeTab === "homepage" && (
        <HomepageSettingsForm initial={homepageSettings} availableGuides={availableGuides} />
      )}
      {activeTab === "global" && (
        <GlobalSettingsForm initial={globalSettings} />
      )}
      {activeTab === "affiliate" && (
        <AffiliateSettingsForm initial={affiliateSettings} />
      )}
      {activeTab === "footer" && (
        <FooterSettingsForm initial={footerSettings} />
      )}
    </div>
  );
}
