"use client";

import { useActionState, useEffect, useRef } from "react";
import { uploadMediaAction } from "@/app/admin/media-actions";
import { inputClass, selectClass } from "@/components/admin/AdminFormField";

const FOLDERS = ["products", "guides", "deals", "homepage", "categories", "misc"] as const;
const USAGE_TYPES = ["", "product-hero", "guide-hero", "deal-card", "homepage-banner", "category-thumb", "other"];

interface Props {
  onUploaded?: () => void;
}

export function MediaUploadForm({ onUploaded }: Props) {
  const [state, formAction, isPending] = useActionState(uploadMediaAction, {});
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = [
    useRef<string | null>(null),
    (v: string | null) => { preview.current = v; },
  ];

  useEffect(() => {
    if (state.asset) {
      formRef.current?.reset();
      if (fileRef.current) fileRef.current.value = "";
      onUploaded?.();
    }
  }, [state.asset, onUploaded]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = document.getElementById("upload-preview") as HTMLImageElement | null;
        if (img) img.src = ev.target?.result as string;
        const wrap = document.getElementById("upload-preview-wrap");
        if (wrap) wrap.classList.remove("hidden");
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      {state.error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {state.error}
        </div>
      )}
      {state.asset && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700">
          Uploaded successfully.
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-ink-secondary mb-1">
          Image File <span className="text-red-500">*</span>
        </label>
        <input
          ref={fileRef}
          type="file"
          name="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="block w-full text-sm text-ink-secondary file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-brand/10 file:text-brand hover:file:bg-brand/20 cursor-pointer"
        />
        {state.fieldErrors?.file && (
          <p className="text-red-500 text-xs mt-1">{state.fieldErrors.file}</p>
        )}
        <p className="text-xs text-ink-muted mt-1">JPEG, PNG, WebP, GIF - max 10 MB</p>
      </div>

      <div id="upload-preview-wrap" className="hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img id="upload-preview" src="" alt="Preview" className="h-24 w-24 object-cover rounded-lg border border-border" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-ink-secondary mb-1">Folder</label>
          <select name="folder" defaultValue="misc" className={selectClass}>
            {FOLDERS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-secondary mb-1">Usage Type</label>
          <select name="usageType" defaultValue="" className={selectClass}>
            {USAGE_TYPES.map((u) => (
              <option key={u} value={u}>{u || "- unset -"}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink-secondary mb-1">Alt Text</label>
        <input name="altText" type="text" className={inputClass} placeholder="Describe the image for screen readers" />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink-secondary mb-1">Title</label>
        <input name="title" type="text" className={inputClass} placeholder="Optional display title" />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full px-4 py-2.5 bg-brand text-white rounded-md text-sm font-medium hover:bg-brand-dark disabled:opacity-50 transition-colors"
      >
        {isPending ? "Uploading…" : "Upload Image"}
      </button>
    </form>
  );
}
