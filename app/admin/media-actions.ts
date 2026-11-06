"use server";

import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { requireAdminSession } from "@/lib/admin-auth";
import {
  createMediaRecord,
  updateMediaRecord,
  archiveMedia,
  deleteMediaFileAndArchiveRecord,
} from "@/lib/media-store";

export interface MediaActionState {
  error?: string;
  fieldErrors?: Record<string, string>;
  asset?: { id: string; url: string; altText: string };
}

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const BUCKET = "affiliate-media";

const FOLDERS = ["products", "guides", "deals", "homepage", "categories", "misc"] as const;
export type MediaFolder = (typeof FOLDERS)[number];

function safeName(original: string): string {
  const ext = original.split(".").pop()?.toLowerCase() ?? "jpg";
  const base = original
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  return `${base}-${nanoid(8)}.${ext}`;
}

export async function uploadMediaAction(
  _prev: MediaActionState,
  formData: FormData
): Promise<MediaActionState> {
  if (!(await requireAdminSession())) return { error: "Unauthorized." };
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY." };
  }

  const file = formData.get("file") as File | null;
  const folder = ((formData.get("folder") as string | null)?.trim() ?? "misc") as MediaFolder;
  const altText = (formData.get("altText") as string | null)?.trim() ?? "";
  const title = (formData.get("title") as string | null)?.trim() ?? "";
  const usageType = (formData.get("usageType") as string | null)?.trim() ?? "";

  const fieldErrors: Record<string, string> = {};
  if (!file || file.size === 0) fieldErrors.file = "Please select a file to upload.";
  else if (!ALLOWED_MIME.has(file.type)) fieldErrors.file = "Only JPEG, PNG, WebP, and GIF images are allowed.";
  else if (file.size > MAX_BYTES) fieldErrors.file = `File is too large. Maximum size is ${MAX_BYTES / 1024 / 1024}MB.`;
  if (!FOLDERS.includes(folder as MediaFolder)) fieldErrors.folder = "Invalid folder.";

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const filename = safeName(file!.name);
  const path = `${folder}/${filename}`;

  const supabase = createAdminClient();

  const arrayBuffer = await file!.arrayBuffer();
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, arrayBuffer, { contentType: file!.type, upsert: false });

  if (uploadError) {
    return { error: `Upload failed: ${uploadError.message}` };
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const url = urlData.publicUrl;

  const id = nanoid();
  let asset;
  try {
    asset = await createMediaRecord({
      id,
      bucket: BUCKET,
      path,
      url,
      filename,
      originalFilename: file!.name,
      mimeType: file!.type,
      sizeBytes: file!.size,
      altText,
      title: title || filename,
      folder,
      usageType,
    });
  } catch (e) {
    // Record creation failed - clean up uploaded file
    await supabase.storage.from(BUCKET).remove([path]);
    return { error: (e as Error).message };
  }

  revalidatePath("/admin/media");
  return { asset: { id: asset.id, url: asset.url, altText: asset.altText } };
}

export async function updateMediaAction(
  id: string,
  _prev: MediaActionState,
  formData: FormData
): Promise<MediaActionState> {
  if (!(await requireAdminSession())) return { error: "Unauthorized." };
  const altText = (formData.get("altText") as string | null)?.trim() ?? "";
  const title = (formData.get("title") as string | null)?.trim() ?? "";
  const folder = (formData.get("folder") as string | null)?.trim() ?? "misc";
  const usageType = (formData.get("usageType") as string | null)?.trim() ?? "";

  try {
    const asset = await updateMediaRecord(id, { altText, title, folder, usageType });
    revalidatePath("/admin/media");
    return { asset: { id: asset.id, url: asset.url, altText: asset.altText } };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function archiveMediaAction(id: string): Promise<void> {
  if (!(await requireAdminSession())) return;
  await archiveMedia(id);
  revalidatePath("/admin/media");
}

export async function deleteMediaAction(id: string): Promise<{ error?: string }> {
  if (!(await requireAdminSession())) return { error: "Unauthorized." };
  try {
    await deleteMediaFileAndArchiveRecord(id);
    revalidatePath("/admin/media");
    return {};
  } catch (e) {
    return { error: (e as Error).message };
  }
}
