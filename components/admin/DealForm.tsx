"use client";

import { useActionState, useState } from "react";
import type { DealFormState } from "@/app/admin/deal-actions";
import type { StoredDeal } from "@/lib/deals-store";
import { inputClass, selectClass, textareaClass } from "@/components/admin/AdminFormField";
import { MediaSelector } from "@/components/admin/MediaSelector";

const LABEL_OPTIONS = [
  "Budget-friendly pick",
  "Worth checking",
  "Top-rated",
  "Editor's choice",
  "Best value",
  "Popular choice",
];

const SECTION_OPTIONS = [
  { value: "general", label: "General" },
  { value: "lighting", label: "Lighting" },
  { value: "ergonomics", label: "Ergonomics" },
  { value: "monitors", label: "Monitors" },
  { value: "accessories", label: "Accessories" },
  { value: "storage", label: "Storage" },
  { value: "dorm", label: "Dorm" },
  { value: "home-office", label: "Home Office" },
];

const PLACEMENT_OPTIONS = [
  { value: "deals", label: "Deals page" },
  { value: "homepage", label: "Homepage" },
  { value: "category", label: "Category page" },
  { value: "guide", label: "Guide page" },
];

interface Props {
  action: (prev: DealFormState, formData: FormData) => Promise<DealFormState>;
  initialData?: StoredDeal;
}

export function DealForm({ action, initialData }: Props) {
  const [state, formAction, isPending] = useActionState(action, {});
  const [imageOverride, setImageOverride] = useState(initialData?.imageOverride ?? "");
  const [imageAlt, setImageAlt] = useState(initialData?.imageAlt ?? "");

  const v = (field: string) => initialData?.[field as keyof StoredDeal] ?? "";

  function slugify(s: string) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  return (
    <form action={formAction} className="space-y-8 max-w-3xl">
      {state.error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {state.error}
        </div>
      )}

      {/* ── 1. Basic Info ────────────────────────────────────── */}
      <section className="bg-white rounded-card border border-border p-6 space-y-5">
        <h2 className="font-semibold text-ink text-base">Basic Info</h2>

        <div>
          <label className="block text-sm font-medium text-ink-secondary mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            name="title"
            defaultValue={String(v("title"))}
            className={inputClass}
            placeholder="e.g. BenQ ScreenBar - Best Desk Lamp for Small Desks"
            onChange={(e) => {
              const slugInput = e.currentTarget.form?.elements.namedItem("slug") as HTMLInputElement | null;
              if (slugInput && !slugInput.value) slugInput.placeholder = slugify(e.currentTarget.value);
            }}
          />
          {state.fieldErrors?.title && <p className="text-red-500 text-xs mt-1">{state.fieldErrors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-secondary mb-1">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            name="slug"
            defaultValue={String(v("slug"))}
            className={inputClass}
            placeholder="auto-generated from title"
          />
          {state.fieldErrors?.slug && <p className="text-red-500 text-xs mt-1">{state.fieldErrors.slug}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-secondary mb-1">
            Label <span className="text-red-500">*</span>
          </label>
          <select name="label" defaultValue={String(v("label")) || "Worth checking"} className={selectClass}>
            {LABEL_OPTIONS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          <p className="text-xs text-ink-muted mt-1">Safe wording only - no fake discounts or urgency claims.</p>
          {state.fieldErrors?.label && <p className="text-red-500 text-xs mt-1">{state.fieldErrors.label}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-secondary mb-1">Description</label>
          <textarea
            name="description"
            defaultValue={String(v("description"))}
            className={textareaClass}
            rows={3}
            placeholder="Short description shown on the deals card."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-secondary mb-1">Status</label>
          <select name="status" defaultValue={String(v("status")) || "draft"} className={selectClass}>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </section>

      {/* ── 2. Linked Product ────────────────────────────────── */}
      <section className="bg-white rounded-card border border-border p-6 space-y-5">
        <h2 className="font-semibold text-ink text-base">Linked Product (optional)</h2>
        <p className="text-xs text-ink-muted">
          Link a product to inherit its image, affiliate URL, and price range. Override fields below take precedence.
        </p>

        <div>
          <label className="block text-sm font-medium text-ink-secondary mb-1">Product Slug</label>
          <input
            name="productSlug"
            defaultValue={String(v("productSlug"))}
            className={inputClass}
            placeholder="e.g. lumiy-lightblade-1500s"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-secondary mb-1">Product ID</label>
          <input
            name="productId"
            defaultValue={String(v("productId"))}
            className={inputClass}
            placeholder="e.g. prod_abc123"
          />
        </div>
      </section>

      {/* ── 3. Display ───────────────────────────────────────── */}
      <section className="bg-white rounded-card border border-border p-6 space-y-5">
        <h2 className="font-semibold text-ink text-base">Display</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink-secondary mb-1">Section</label>
            <select name="section" defaultValue={String(v("section")) || "general"} className={selectClass}>
              {SECTION_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-secondary mb-1">Placement</label>
            <select name="placement" defaultValue={String(v("placement")) || "deals"} className={selectClass}>
              {PLACEMENT_OPTIONS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink-secondary mb-1">Display Order</label>
            <input
              name="displayOrder"
              type="number"
              defaultValue={String(v("displayOrder") ?? "0")}
              className={inputClass}
              min={0}
            />
          </div>

          <div className="flex items-center gap-3 pt-6">
            <input
              type="hidden"
              name="featured"
              value="false"
            />
            <input
              id="featured"
              type="checkbox"
              name="featured"
              value="true"
              defaultChecked={Boolean(v("featured"))}
              className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
            />
            <label htmlFor="featured" className="text-sm font-medium text-ink-secondary">
              Featured (shown on homepage)
            </label>
          </div>
        </div>
      </section>

      {/* ── 4. Affiliate ─────────────────────────────────────── */}
      <section className="bg-white rounded-card border border-border p-6 space-y-5">
        <h2 className="font-semibold text-ink text-base">Affiliate</h2>

        <div>
          <label className="block text-sm font-medium text-ink-secondary mb-1">CTA Text</label>
          <input
            name="ctaText"
            defaultValue={String(v("ctaText")) || "Check current price"}
            className={inputClass}
            placeholder="Check current price"
          />
          <p className="text-xs text-ink-muted mt-1">
            Use neutral wording: &ldquo;Check current price&rdquo;, &ldquo;See on Amazon&rdquo;, &ldquo;View on Amazon&rdquo;.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-secondary mb-1">Amazon URL Override</label>
          <input
            name="amazonUrlOverride"
            defaultValue={String(v("amazonUrlOverride"))}
            className={inputClass}
            placeholder="https://www.amazon.com/dp/... (leave blank to use linked product URL)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-secondary mb-1">Price Range Override</label>
          <input
            name="priceRangeOverride"
            defaultValue={String(v("priceRangeOverride"))}
            className={inputClass}
            placeholder="e.g. Under $30 (leave blank to use linked product price range)"
          />
        </div>
      </section>

      {/* ── 5. Image ─────────────────────────────────────────── */}
      <section className="bg-white rounded-card border border-border p-6 space-y-5">
        <h2 className="font-semibold text-ink text-base">Image Override (optional)</h2>

        <div>
          <label className="block text-sm font-medium text-ink-secondary mb-1">Image URL</label>
          <input
            name="imageOverride"
            value={imageOverride}
            onChange={(e) => setImageOverride(e.target.value)}
            className={inputClass}
            placeholder="https://... (leave blank to use linked product image)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-secondary mb-1">Image Alt Text</label>
          <input
            name="imageAlt"
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
            className={inputClass}
            placeholder="Descriptive alt text for the image"
          />
        </div>

        <MediaSelector
          folder="deals"
          onSelect={(url, alt) => { setImageOverride(url); if (alt) setImageAlt(alt); }}
        />
        {imageOverride && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageOverride} alt="Preview" className="h-20 w-20 object-cover rounded-lg border border-border" />
        )}
      </section>

      {/* ── 6. Schedule ──────────────────────────────────────── */}
      <section className="bg-white rounded-card border border-border p-6 space-y-5">
        <h2 className="font-semibold text-ink text-base">Schedule (optional)</h2>
        <p className="text-xs text-ink-muted">
          Leave blank to show the deal indefinitely while status is Active.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink-secondary mb-1">Starts At</label>
            <input
              name="startsAt"
              type="datetime-local"
              defaultValue={String(v("startsAt")).replace("Z", "").slice(0, 16)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-secondary mb-1">Ends At</label>
            <input
              name="endsAt"
              type="datetime-local"
              defaultValue={String(v("endsAt")).replace("Z", "").slice(0, 16)}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 bg-brand text-white rounded-md font-medium text-sm hover:bg-brand-dark disabled:opacity-50 transition-colors"
        >
          {isPending ? "Saving…" : initialData ? "Update Deal" : "Create Deal"}
        </button>
        <a
          href="/admin/deals"
          className="px-6 py-2.5 border border-border text-ink-secondary rounded-md font-medium text-sm hover:bg-surface transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
