import Link from "next/link";
import { AdminStatCard, AdminCard } from "@/components/admin/AdminCard";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { getDashboardData } from "@/lib/admin-dashboard-store";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const SEVERITY_STYLES = {
  error: { bg: "bg-red-50 border-red-200", icon: "text-red-500", text: "text-red-800", badge: "bg-red-100 text-red-700", dot: "bg-red-500" },
  warning: { bg: "bg-amber-50 border-amber-200", icon: "text-amber-500", text: "text-amber-800", badge: "bg-amber-100 text-amber-700", dot: "bg-amber-400" },
  info: { bg: "bg-blue-50 border-blue-200", icon: "text-blue-500", text: "text-blue-800", badge: "bg-blue-100 text-blue-700", dot: "bg-blue-400" },
};

const TYPE_STYLES = {
  product: { color: "text-blue-600", bg: "bg-blue-50", label: "Product", previewBase: "/reviews" },
  guide: { color: "text-violet-600", bg: "bg-violet-50", label: "Guide", previewBase: "/guide" },
  deal: { color: "text-amber-600", bg: "bg-amber-50", label: "Deal", previewBase: "/deals" },
  media: { color: "text-cyan-600", bg: "bg-cyan-50", label: "Media", previewBase: "" },
};

export default async function AdminDashboardPage() {
  const { stats, recentActivity, healthWarnings, isLive } = await getDashboardData();
  const now = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Dashboard</h1>
          <p className="text-sm text-ink-secondary mt-0.5">{now}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${isLive ? "bg-green-50 text-green-700" : "bg-surface text-ink-muted"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-green-500" : "bg-gray-400"}`} />
            {isLive ? "Live from Supabase" : "Supabase not connected"}
          </span>
          <a href="/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-brand/10 text-brand hover:bg-brand/20 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
            View site
          </a>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Products" value={stats.products.total} sub={`${stats.products.published} published · ${stats.products.draft} draft`} href="/admin/products" iconBg="bg-blue-50" iconColor="text-blue-600" icon={<BoxIcon />} />
        <StatCard label="Guides" value={stats.guides.total} sub={`${stats.guides.published} published · ${stats.guides.draft} draft`} href="/admin/guides" iconBg="bg-violet-50" iconColor="text-violet-600" icon={<BookIcon />} />
        <StatCard label="Deals" value={stats.deals.total} sub={`${stats.deals.active} active · ${stats.deals.featured} featured`} href="/admin/deals" iconBg="bg-amber-50" iconColor="text-amber-600" icon={<TagIcon />} />
        <StatCard label="Media" value={stats.media.total} sub={`${stats.media.missingAltText} missing alt text`} href="/admin/media" iconBg="bg-cyan-50" iconColor="text-cyan-600" icon={<ImageIcon />} />
      </div>

      {/* ── Quick actions ── */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {[
          { href: "/admin/products/new", label: "Add Product", color: "bg-blue-50 text-blue-700 hover:bg-blue-100" },
          { href: "/admin/guides/new", label: "Add Guide", color: "bg-violet-50 text-violet-700 hover:bg-violet-100" },
          { href: "/admin/deals/new", label: "Add Deal", color: "bg-amber-50 text-amber-700 hover:bg-amber-100" },
          { href: "/admin/media", label: "Upload Media", color: "bg-cyan-50 text-cyan-700 hover:bg-cyan-100" },
          { href: "/admin/settings", label: "Edit Homepage", color: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" },
          { href: "/guide", label: "View Guides", color: "bg-surface text-ink-secondary hover:bg-border", external: true },
        ].map((item) => (
          item.external ? (
            <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center px-3 py-3 rounded-lg text-xs font-semibold text-center transition-colors ${item.color}`}>
              {item.label} ↗
            </a>
          ) : (
            <Link prefetch={false} key={item.href} href={item.href} className={`flex items-center justify-center px-3 py-3 rounded-lg text-xs font-semibold text-center transition-colors ${item.color}`}>
              {item.label}
            </Link>
          )
        ))}
      </div>

      {/* ── Health warnings ── */}
      {healthWarnings.length > 0 && (
        <AdminCard>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-ink uppercase tracking-wide">Content Health</h2>
            <span className="text-xs font-medium text-ink-muted">{healthWarnings.length} issue{healthWarnings.length > 1 ? "s" : ""}</span>
          </div>
          <div className="space-y-3">
            {healthWarnings.map((w) => {
              const s = SEVERITY_STYLES[w.severity];
              return (
                <div key={w.id} className={`flex items-start gap-3 p-3 rounded-lg border ${s.bg}`}>
                  <span className={`mt-0.5 shrink-0 w-2 h-2 rounded-full ${s.dot} mt-1.5`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`text-sm font-semibold ${s.text}`}>{w.title}</p>
                      {w.count > 0 && (
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${s.badge}`}>{w.count}</span>
                      )}
                    </div>
                    <p className={`text-xs mt-0.5 leading-relaxed ${s.text} opacity-80`}>{w.description}</p>
                  </div>
                  <Link prefetch={false} href={w.actionHref} className={`text-xs font-semibold shrink-0 ${s.text} hover:underline`}>
                    {w.actionLabel} →
                  </Link>
                </div>
              );
            })}
          </div>
        </AdminCard>
      )}

      {healthWarnings.length === 0 && isLive && (
        <AdminCard>
          <div className="flex items-center gap-3 py-1">
            <span className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">All content looks healthy</p>
              <p className="text-xs text-ink-muted">No missing images, Amazon URLs, or SEO issues detected.</p>
            </div>
          </div>
        </AdminCard>
      )}

      {/* ── Main content: stats breakdown + recent activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Stats breakdown */}
        <div className="lg:col-span-1 space-y-4">
          <AdminCard>
            <h2 className="text-xs font-bold text-ink-muted uppercase tracking-wide mb-4">Content Breakdown</h2>
            <div className="space-y-3">
              <BreakdownRow label="Products" total={stats.products.total} published={stats.products.published} draft={stats.products.draft} href="/admin/products" />
              <BreakdownRow label="Guides" total={stats.guides.total} published={stats.guides.published} draft={stats.guides.draft} href="/admin/guides" />
              <BreakdownRow label="Deals" total={stats.deals.total} published={stats.deals.active} draft={stats.deals.draft} publishedLabel="active" href="/admin/deals" />
              <BreakdownRow label="Media" total={stats.media.total} href="/admin/media" />
            </div>
          </AdminCard>

          {/* Quick links to public site */}
          <AdminCard>
            <h2 className="text-xs font-bold text-ink-muted uppercase tracking-wide mb-3">Public Pages</h2>
            <div className="space-y-1">
              {[
                { href: "/", label: "Homepage" },
                { href: "/guide", label: "All Guides" },
                { href: "/deals", label: "Deals Page" },
                { href: "/compare", label: "Compare Tool" },
                { href: "/categories/desk-setup", label: "Desk Setup Category" },
              ].map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-2 py-1.5 text-xs text-ink-secondary rounded hover:bg-surface hover:text-brand transition-colors group">
                  {link.label}
                  <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                </a>
              ))}
            </div>
          </AdminCard>
        </div>

        {/* Recent activity */}
        <div className="lg:col-span-2">
          <AdminCard>
            <h2 className="text-xs font-bold text-ink-muted uppercase tracking-wide mb-4">Recent Activity</h2>
            {recentActivity.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-ink-muted">No recent activity.</p>
                {!isLive && (
                  <p className="text-xs text-ink-muted mt-1">Connect Supabase to see live activity.</p>
                )}
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentActivity.map((item) => {
                  const t = TYPE_STYLES[item.type];
                  const editHref = item.type === "media"
                    ? "/admin/media"
                    : item.type === "deal"
                    ? `/admin/deals/${item.id}/edit`
                    : item.type === "guide"
                    ? `/admin/guides/${item.id}/edit`
                    : `/admin/products/${item.id}/edit`;
                  const previewHref = item.slug && t.previewBase
                    ? `${t.previewBase}/${item.slug}`
                    : t.previewBase || null;
                  return (
                    <div key={`${item.type}-${item.id}`} className="flex items-center gap-3 py-3">
                      <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded ${t.bg} ${t.color}`}>
                        {t.label}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink truncate">{item.title}</p>
                        <p className="text-xs text-ink-muted">{item.updatedAt ? formatDate(item.updatedAt) : "-"}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {item.status && item.type !== "media" && (
                          <AdminStatusBadge status={item.status as "published" | "draft" | "active" | "inactive"} />
                        )}
                        <Link prefetch={false} href={editHref} className="text-xs text-ink-muted hover:text-brand transition-colors">Edit</Link>
                        {previewHref && (
                          <a href={previewHref} target="_blank" rel="noopener noreferrer" className="text-xs text-ink-muted hover:text-brand transition-colors">↗</a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </AdminCard>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, href, iconBg, iconColor, icon }: {
  label: string; value: number; sub?: string; href: string; iconBg: string; iconColor: string; icon: React.ReactNode;
}) {
  return (
    <Link prefetch={false} href={href} className="group block">
      <AdminStatCard
        label={label}
        value={value}
        iconBg={iconBg}
        iconColor={iconColor}
        icon={icon}
        trend={sub}
      />
    </Link>
  );
}

function BreakdownRow({ label, total, published, draft, publishedLabel = "published", href }: {
  label: string; total: number; published?: number; draft?: number; publishedLabel?: string; href: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <Link prefetch={false} href={href} className="text-sm font-medium text-ink hover:text-brand transition-colors">{label}</Link>
      <div className="flex items-center gap-3 text-xs text-ink-muted">
        {total > 0 ? (
          <>
            {published !== undefined && <span className="text-green-600 font-medium">{published} {publishedLabel}</span>}
            {draft !== undefined && draft > 0 && <span>{draft} draft</span>}
            {published === undefined && <span>{total} total</span>}
          </>
        ) : (
          <span>None yet</span>
        )}
      </div>
    </div>
  );
}

// Icons
function BoxIcon() {
  return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>;
}
function BookIcon() {
  return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>;
}
function TagIcon() {
  return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" /></svg>;
}
function ImageIcon() {
  return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>;
}
