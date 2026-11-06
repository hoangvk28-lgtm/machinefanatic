"use client";

import { useActionState, useState, useRef } from "react";
import Link from "next/link";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminFormField, inputClass, selectClass, textareaClass } from "@/components/admin/AdminFormField";
import { MediaSelector } from "@/components/admin/MediaSelector";
import { categories } from "@/data/categories";
import type { StoredProduct } from "@/lib/products-store";
import type { ProductFormState } from "@/app/admin/product-actions";
import { buildAmazonUrl } from "@/lib/affiliate";

const BADGES = [
  "Best Overall",
  "Best Budget",
  "Best for Small Desks",
  "Best for Dorm Rooms",
  "Best Value",
  "Upgrade Pick",
  "Also Great",
];

const SCORE_FIELDS: { key: string; label: string }[] = [
  { key: "overall", label: "Overall" },
  { key: "smallSpaceFit", label: "Small-Space Fit" },
  { key: "buildQuality", label: "Build Quality" },
  { key: "easeOfUse", label: "Ease of Use" },
  { key: "valueForMoney", label: "Value for Money" },
  { key: "buyerFeedback", label: "Buyer Feedback" },
];

interface ProductFormProps {
  action: (prev: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  product?: StoredProduct;
  mode: "create" | "edit";
}

function specsToText(specs: Record<string, string>): string {
  return Object.entries(specs)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function ProductForm({ action, product, mode }: ProductFormProps) {
  const [state, formAction, pending] = useActionState(action, {});
  const nameRef = useRef<HTMLInputElement>(null);
  const slugRef = useRef<HTMLInputElement>(null);
  const slugManuallyEdited = useRef(false);
  const [imageUrl, setImageUrl] = useState(product?.image ?? "");
  const amazonUrlRef = useRef<HTMLInputElement>(null);
  const [asin, setAsin] = useState(product?.asin ?? "");

  function handleAsinChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.trim();
    setAsin(val);
    if (val && amazonUrlRef.current && !amazonUrlRef.current.value) {
      amazonUrlRef.current.value = buildAmazonUrl(val);
    }
  }

  // category → subcategory dependency
  const defaultCategory = product?.categorySlug ?? "";
  const categoryObj = categories.find((c) => c.slug === defaultCategory);
  const defaultSubcategories = categoryObj?.subcategories ?? [];

  // We handle subcategory options via a hidden select - use uncontrolled with key trick
  // For simplicity, just render all subcategory options statically from selected category
  // The user must re-select subcategory when they change category in create mode.

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!slugManuallyEdited.current && slugRef.current) {
      slugRef.current.value = slugify(e.target.value);
    }
  }

  function handleSlugFocus() {
    slugManuallyEdited.current = true;
  }

  const fe = state.fieldErrors ?? {};

  // Derive subcategories from category selection - controlled via a simple approach:
  // We use a form element with a data attribute trick. For full interactivity we'd
  // need more React state, but this keeps the form server-action-first.
  // The category select triggers a page-level re-render via URL param if needed.
  // For now: show all known subcategories as a flat list (user picks correct one).
  const allSubcategories = Array.from(
    new Set(categories.flatMap((c) => c.subcategories))
  ).sort();

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state.error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
          <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          <p className="text-sm text-red-700 font-medium">{state.error}</p>
        </div>
      )}
      {fe.duplicateWarning && (
        <div className="flex items-start gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
          <span className="text-amber-500 shrink-0 mt-0.5">⚠</span>
          <p className="text-sm text-amber-800">{fe.duplicateWarning}</p>
        </div>
      )}

      {/* ── 1. Basic Info ──────────────────────────────────────────────────── */}
      <AdminCard>
        <h2 className="text-sm font-bold text-gray-900 mb-4">Basic Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminFormField label="Product Name" htmlFor="name" required error={fe.name}>
            <input
              ref={nameRef}
              id="name"
              name="name"
              type="text"
              required
              defaultValue={product?.name ?? ""}
              onChange={handleNameChange}
              placeholder="e.g. Compact LED Desk Lamp with USB Port"
              className={inputClass}
            />
          </AdminFormField>

          <AdminFormField label="Slug" htmlFor="slug" required hint="URL-safe identifier. Auto-generated from name." error={fe.slug}>
            <input
              ref={slugRef}
              id="slug"
              name="slug"
              type="text"
              required
              defaultValue={product?.slug ?? ""}
              onFocus={handleSlugFocus}
              placeholder="compact-led-desk-lamp"
              className={inputClass}
            />
          </AdminFormField>

          <AdminFormField label="Category" htmlFor="categorySlug" required error={fe.categorySlug}>
            <select
              id="categorySlug"
              name="categorySlug"
              defaultValue={product?.categorySlug ?? ""}
              className={selectClass}
            >
              <option value="">- Select category -</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </AdminFormField>

          <AdminFormField label="Subcategory" htmlFor="subcategorySlug" required hint="Pick the subcategory that matches the product type." error={fe.subcategorySlug}>
            <select
              id="subcategorySlug"
              name="subcategorySlug"
              defaultValue={product?.subcategorySlug ?? ""}
              className={selectClass}
            >
              <option value="">- Select subcategory -</option>
              {allSubcategories.map((s) => (
                <option key={s} value={s}>{s.replace(/-/g, " ")}</option>
              ))}
            </select>
          </AdminFormField>

          <AdminFormField label="Badge" htmlFor="badge" hint="Optional editorial badge shown on cards.">
            <select
              id="badge"
              name="badge"
              defaultValue={product?.badge ?? ""}
              className={selectClass}
            >
              <option value="">- No badge -</option>
              {BADGES.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </AdminFormField>

          <AdminFormField label="Status" htmlFor="status">
            <select
              id="status"
              name="status"
              defaultValue={product?.status ?? "draft"}
              className={selectClass}
            >
              <option value="draft">Draft</option>
              <option value="verified">Verified</option>
              <option value="published">Published</option>
            </select>
          </AdminFormField>
        </div>
      </AdminCard>

      {/* ── 2. Affiliate & Pricing ─────────────────────────────────────────── */}
      <AdminCard>
        <h2 className="text-sm font-bold text-gray-900 mb-4">Affiliate & Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminFormField label="ASIN" htmlFor="asin" hint="10-char Amazon product ID. Auto-fills affiliate URL if URL is empty." error={fe.asin}>
            <input
              id="asin"
              name="asin"
              type="text"
              value={asin}
              onChange={handleAsinChange}
              placeholder="B0CT2NQ7WG"
              className={inputClass}
            />
          </AdminFormField>

          <AdminFormField
            label="Amazon Affiliate URL"
            htmlFor="amazonUrl"
            hint="Auto-fills from ASIN. Edit to override."
            error={fe.amazonUrl}
          >
            <input
              ref={amazonUrlRef}
              id="amazonUrl"
              name="amazonUrl"
              type="url"
              defaultValue={product?.amazonUrl ?? ""}
              placeholder="https://www.amazon.com/dp/XXXXXXXXXX?tag=machinefanatic-20"
              className={inputClass}
            />
          </AdminFormField>

          <AdminFormField label="Price Range" htmlFor="priceRange" hint='Display string e.g. "$25-$30". Required for published products.' error={fe.priceRange}>
            <input
              id="priceRange"
              name="priceRange"
              type="text"
              defaultValue={product?.priceRange ?? ""}
              placeholder="$25-$30"
              className={inputClass}
            />
          </AdminFormField>

          <AdminFormField label="Price Label" htmlFor="priceLabel" hint="Tier label shown in guide picks and product cards.">
            <select
              id="priceLabel"
              name="priceLabel"
              defaultValue={product?.priceLabel ?? ""}
              className={selectClass}
            >
              <option value="">- Select tier -</option>
              <option value="Budget">Budget</option>
              <option value="Mid-range">Mid-range</option>
              <option value="Premium">Premium</option>
              <option value="Check Amazon">Check Amazon</option>
            </select>
          </AdminFormField>
        </div>

        {!product?.amazonUrl && mode === "edit" && (
          <p className="mt-3 text-xs text-amber-600 font-medium">⚠ No Amazon URL set, this product won&apos;t have a buy button on the public site.</p>
        )}
      </AdminCard>

      {/* ── 3. Images ─────────────────────────────────────────────────────── */}
      <AdminCard>
        <h2 className="text-sm font-bold text-gray-900 mb-4">Images</h2>
        <div className="space-y-3">
          <AdminFormField label="Image URL" htmlFor="image" hint='Paste a URL or choose from the Media Library. Leave blank to use category illustration.'>
            <input
              id="image"
              name="image"
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://... or /images/products/my-product.jpg"
              className={inputClass}
            />
          </AdminFormField>
          <MediaSelector
            folder="products"
            onSelect={(url) => setImageUrl(url)}
          />
          {imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="Preview" className="h-20 w-20 object-cover rounded-lg border border-border mt-1" />
          )}
        </div>
      </AdminCard>

      {/* ── 4. Descriptions ───────────────────────────────────────────────── */}
      <AdminCard>
        <h2 className="text-sm font-bold text-gray-900 mb-4">Descriptions</h2>
        <div className="flex flex-col gap-4">
          <AdminFormField label="Short Description" htmlFor="shortDescription" hint="1-2 sentences shown in cards and search results.">
            <textarea
              id="shortDescription"
              name="shortDescription"
              defaultValue={product?.shortDescription ?? ""}
              placeholder="One sentence that captures the product's key benefit."
              className={`${textareaClass} min-h-[60px]`}
            />
          </AdminFormField>

          <AdminFormField label="Review Summary" htmlFor="reviewSummary" hint="2-4 sentence editorial summary shown on the review page.">
            <textarea
              id="reviewSummary"
              name="reviewSummary"
              defaultValue={product?.reviewSummary ?? ""}
              placeholder="Comprehensive summary of performance, trade-offs, and who it's best for."
              className={`${textareaClass} min-h-[100px]`}
            />
          </AdminFormField>
        </div>
      </AdminCard>

      {/* ── 5. Use Cases ─────────────────────────────────────────────────── */}
      <AdminCard>
        <h2 className="text-sm font-bold text-gray-900 mb-4">Use Cases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminFormField label="Best For" htmlFor="bestFor" hint="One item per line.">
            <textarea
              id="bestFor"
              name="bestFor"
              defaultValue={(product?.bestFor ?? []).join("\n")}
              placeholder={"Students who need portable storage\nSmall desks under 48 inches"}
              className={textareaClass}
            />
          </AdminFormField>

          <AdminFormField label="Not Ideal For" htmlFor="notIdealFor" hint="One item per line.">
            <textarea
              id="notIdealFor"
              name="notIdealFor"
              defaultValue={(product?.notIdealFor ?? []).join("\n")}
              placeholder={"Users who need heavy-duty storage\nDesks over 60 inches"}
              className={textareaClass}
            />
          </AdminFormField>
        </div>
      </AdminCard>

      {/* ── 6. Pros & Cons ────────────────────────────────────────────────── */}
      <AdminCard>
        <h2 className="text-sm font-bold text-gray-900 mb-4">Pros & Cons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminFormField label="Pros" htmlFor="pros" hint="One item per line.">
            <textarea
              id="pros"
              name="pros"
              defaultValue={(product?.pros ?? []).join("\n")}
              placeholder={"Adjustable height\nFolds flat for storage"}
              className={textareaClass}
            />
          </AdminFormField>

          <AdminFormField label="Cons" htmlFor="cons" hint="One item per line.">
            <textarea
              id="cons"
              name="cons"
              defaultValue={(product?.cons ?? []).join("\n")}
              placeholder={"No cable management\nFixed width"}
              className={textareaClass}
            />
          </AdminFormField>
        </div>
      </AdminCard>

      {/* ── 7. Specs ──────────────────────────────────────────────────────── */}
      <AdminCard>
        <h2 className="text-sm font-bold text-gray-900 mb-1">Specs</h2>
        <p className="text-xs text-gray-500 mb-4">One spec per line in <code className="bg-gray-100 px-1 rounded">Key: Value</code> format.</p>
        <textarea
          id="specs"
          name="specs"
          defaultValue={specsToText(product?.specs ?? {})}
          placeholder={"Material: Aluminum alloy\nMax Load: 22 lbs\nFolded Thickness: Under 1 inch"}
          className={`${textareaClass} min-h-[120px] font-mono text-xs`}
        />
      </AdminCard>

      {/* ── 8. Scores ─────────────────────────────────────────────────────── */}
      <AdminCard>
        <h2 className="text-sm font-bold text-gray-900 mb-4">Scores <span className="font-normal text-gray-400">(0-10)</span></h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {SCORE_FIELDS.map(({ key, label }) => (
            <AdminFormField
              key={key}
              label={label}
              htmlFor={`score_${key}`}
              error={fe[`score_${key}`]}
            >
              <input
                id={`score_${key}`}
                name={`score_${key}`}
                type="number"
                step="0.1"
                min="0"
                max="10"
                defaultValue={
                  product?.scores[key as keyof typeof product.scores] ?? ""
                }
                placeholder="e.g. 8.5"
                className={inputClass}
              />
            </AdminFormField>
          ))}
        </div>
      </AdminCard>

      {/* ── 9. Source & Internal Notes ───────────────────────────────────── */}
      <AdminCard>
        <h2 className="text-sm font-bold text-gray-900 mb-1">Source & Internal Notes</h2>
        <p className="text-xs text-gray-500 mb-4">Not rendered publicly, for editor reference only.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminFormField label="Use Case" htmlFor="useCase" hint="One-line description, e.g. &quot;Home office charging, travel&quot;.">
            <input
              id="useCase"
              name="useCase"
              type="text"
              defaultValue={product?.useCase ?? ""}
              placeholder="Home office charging, travel"
              className={inputClass}
            />
          </AdminFormField>

          <AdminFormField label="Source / Verification Notes" htmlFor="sourceNotes" hint="Internal notes on where specs were sourced or verification status.">
            <textarea
              id="sourceNotes"
              name="sourceNotes"
              defaultValue={product?.sourceNotes ?? ""}
              placeholder="Specs verified against Amazon listing 2026-06. ASIN confirmed live."
              className={`${textareaClass} min-h-[60px]`}
            />
          </AdminFormField>
        </div>
      </AdminCard>

      {/* ── 10. Internal Links & Status ───────────────────────────────────── */}
      <AdminCard>
        <h2 className="text-sm font-bold text-gray-900 mb-4">Internal Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminFormField label="Related Guide Slugs" htmlFor="relatedGuideSlugs" hint="One guide slug per line.">
            <textarea
              id="relatedGuideSlugs"
              name="relatedGuideSlugs"
              defaultValue={(product?.relatedGuideSlugs ?? []).join("\n")}
              placeholder={"desk-lamps-small-desks\nlaptop-stands-small-desks"}
              className={textareaClass}
            />
          </AdminFormField>

          <AdminFormField label="Alternative Product IDs" htmlFor="alternatives" hint="One product ID per line.">
            <textarea
              id="alternatives"
              name="alternatives"
              defaultValue={(product?.alternatives ?? []).join("\n")}
              placeholder={"wide-angle-study-lamp\ncompact-led-lamp-usb"}
              className={textareaClass}
            />
          </AdminFormField>
        </div>
      </AdminCard>

      {/* ── Submit ────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 py-2">
        <Link prefetch={false}
          href="/admin/products"
          className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
        >
          ← Cancel
        </Link>
        <div className="flex items-center gap-3">
          {Object.keys(fe).length > 0 && (
            <p className="text-xs text-red-600 font-medium">
              Please fix {Object.keys(fe).length} error{Object.keys(fe).length > 1 ? "s" : ""} above.
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            {pending ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving…
              </>
            ) : mode === "create" ? (
              "Create Product"
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
