import { NextRequest, NextResponse } from "next/server";
import { getAllMedia, getMediaByFolder, searchMedia } from "@/lib/media-store";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { requireAdminSession } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  // Auth check - uses the same session options as all other admin routes
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ assets: [] });
  }

  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() ?? "";
    const folder = searchParams.get("folder")?.trim() ?? "";

    let assets;
    if (q) {
      assets = await searchMedia(q);
      if (folder) assets = assets.filter((a) => a.folder === folder);
    } else if (folder) {
      assets = await getMediaByFolder(folder);
    } else {
      assets = await getAllMedia();
    }

    return NextResponse.json({ assets });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
