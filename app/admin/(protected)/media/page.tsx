import { getAllMedia, getMediaByFolder, searchMedia } from "@/lib/media-store";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { MediaUploadForm } from "@/components/admin/MediaUploadForm";
import { MediaGrid } from "@/components/admin/MediaGrid";
import { AdminCard } from "@/components/admin/AdminCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

const FOLDERS = ["products", "guides", "deals", "homepage", "categories", "misc"] as const;

export default async function AdminMediaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; folder?: string }>;
}) {
  const { q = "", folder = "" } = await searchParams;

  let assets: Awaited<ReturnType<typeof getAllMedia>> = [];
  let configError = false;

  if (!isSupabaseConfigured()) {
    configError = true;
  } else {
    try {
      if (q) {
        assets = await searchMedia(q);
        if (folder) assets = assets.filter((a) => a.folder === folder);
      } else if (folder) {
        assets = await getMediaByFolder(folder);
      } else {
        assets = await getAllMedia();
      }
    } catch (e) {
      configError = true;
      console.error(e);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Media Library</h1>
        <p className="text-sm text-ink-secondary mt-0.5">{assets.length} image{assets.length !== 1 ? "s" : ""}</p>
      </div>

      {configError && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
          <strong>Supabase not configured.</strong> Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code>SUPABASE_SERVICE_ROLE_KEY</code> env vars, then create the{" "}
          <strong>affiliate-media</strong> storage bucket in Supabase Dashboard → Storage (set to Public).
          Also run migration <code>004_create_media.sql</code>.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* ── Upload panel ── */}
        <div className="lg:col-span-1">
          <AdminCard>
            <h2 className="font-semibold text-ink text-sm mb-4">Upload Image</h2>
            <MediaUploadForm />
          </AdminCard>

          {/* Bucket setup reminder */}
          <AdminCard className="mt-4 text-xs text-ink-muted space-y-1.5">
            <p className="font-semibold text-ink text-xs">Bucket setup</p>
            <p>Bucket name: <code className="bg-surface px-1 rounded">affiliate-media</code></p>
            <p>Set bucket to <strong>Public</strong> in Supabase Dashboard → Storage.</p>
            <p>Folder structure: products/, guides/, deals/, homepage/, categories/, misc/</p>
          </AdminCard>
        </div>

        {/* ── Media grid ── */}
        <div className="lg:col-span-3 space-y-4">
          {/* Filters */}
          <form method="GET" className="flex gap-2 flex-wrap">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search by name, title, alt text…"
              className="flex-1 min-w-48 px-3 py-2 text-sm border border-border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
            <select
              name="folder"
              defaultValue={folder}
              className="px-3 py-2 text-sm border border-border rounded-md bg-white focus:outline-none"
            >
              <option value="">All folders</option>
              {FOLDERS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            <button
              type="submit"
              className="px-4 py-2 bg-ink text-white text-sm rounded-md hover:bg-ink/80 transition-colors"
            >
              Search
            </button>
            {(q || folder) && (
              <Link prefetch={false}
                href="/admin/media"
                className="px-4 py-2 border border-border text-ink-secondary text-sm rounded-md hover:bg-surface transition-colors"
              >
                Clear
              </Link>
            )}
          </form>

          <MediaGrid assets={assets} />
        </div>
      </div>
    </div>
  );
}
