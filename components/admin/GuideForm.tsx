"use client";

import { useActionState, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { AdminCard } from "@/components/admin/AdminCard";
import {
  AdminFormField,
  inputClass,
  selectClass,
  textareaClass,
} from "@/components/admin/AdminFormField";
import { MediaSelector } from "@/components/admin/MediaSelector";
import { categories } from "@/data/categories";
import type { StoredGuide, GuideProductPick } from "@/lib/guides-store";
import type { GuideFormState } from "@/app/admin/guide-actions";
import type { StoredProduct } from "@/lib/products-store";

const PRICE_LABELS: GuideProductPick["priceLabel"][] = ["Budget", "Mid-range", "Premium", "Check Amazon"];

const RichTextEditor = dynamic(
  () => import("@/components/admin/RichTextEditor").then((m) => m.RichTextEditor),
  { ssr: false }
);

interface GuideFormProps {
  action: (prev: GuideFormState, formData: FormData) => Promise<GuideFormState>;
  guide?: StoredGuide;
  mode: "create" | "edit";
  products?: StoredProduct[];
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const initialState: GuideFormState = {};

export function GuideForm({ action, guide, mode, products }: GuideFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const fe = state.fieldErrors ?? {};

  // Slug auto-gen
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(mode === "edit");
  const [slugValue, setSlugValue] = useState(guide?.slug ?? "");

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!slugManuallyEdited) {
      setSlugValue(slugify(e.target.value));
    }
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSlugManuallyEdited(true);
    setSlugValue(e.target.value);
  }

  // Repeatable sections with rich text state
  const initSections =
    mode === "edit" && guide && guide.sections.length > 0
      ? guide.sections.map((s) => ({ heading: s.heading, body: s.body }))
      : [{ heading: "", body: "" }];
  const [sections, setSections] = useState<Array<{ heading: string; body: string }>>(initSections);
  const sectionCount = sections.length;

  // Per-section HTML mode toggle
  const [htmlModes, setHtmlModes] = useState<boolean[]>(initSections.map(() => false));
  const [htmlModeKeys, setHtmlModeKeys] = useState<number[]>(initSections.map(() => 0));

  function setSectionBody(i: number, html: string) {
    setSections((prev) => prev.map((s, idx) => idx === i ? { ...s, body: html } : s));
  }

  function toggleHtmlMode(i: number) {
    const isHtml = htmlModes[i];
    setHtmlModes((prev) => { const n = [...prev]; n[i] = !n[i]; return n; });
    // Switching back to Visual: bump key to force Tiptap remount with latest HTML
    if (isHtml) {
      setHtmlModeKeys((prev) => { const n = [...prev]; n[i] = n[i] + 1; return n; });
    }
  }

  function addSection() {
    setSections((prev) => [...prev, { heading: "", body: "" }]);
    setHtmlModes((prev) => [...prev, false]);
    setHtmlModeKeys((prev) => [...prev, 0]);
  }

  function removeSection(i: number) {
    setSections((prev) => prev.filter((_, idx) => idx !== i));
    setHtmlModes((prev) => prev.filter((_, idx) => idx !== i));
    setHtmlModeKeys((prev) => prev.filter((_, idx) => idx !== i));
  }

  // Repeatable FAQ
  const initFaqCount =
    mode === "edit" && guide && guide.faq.length > 0 ? guide.faq.length : 1;
  const [faqCount, setFaqCount] = useState(initFaqCount);
  const [heroImageUrl, setHeroImageUrl] = useState(guide?.heroImage ?? "");
  const [heroImageAlt, setHeroImageAlt] = useState(guide?.heroImageAlt ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState(guide?.thumbnailImage ?? "");

  // Product Picks repeater
  function emptyPick(): GuideProductPick {
    return {
      id: Math.random().toString(36).slice(2),
      badge: "", name: "", brand: "", asin: "", affiliateUrl: "",
      imageUrl: "", priceLabel: "Check Amazon", fitScore: undefined,
      summary: "", whyItWins: "", bestFor: "", skipIf: "",
      specs: [], pros: [], cons: [], ctaLabel: "Check price on Amazon",
    };
  }
  const [picks, setPicks] = useState<GuideProductPick[]>(
    mode === "edit" && guide?.productPicks && guide.productPicks.length > 0
      ? guide.productPicks
      : []
  );
  const [expandedPick, setExpandedPick] = useState<number | null>(picks.length > 0 ? 0 : null);

  function updatePick(i: number, patch: Partial<GuideProductPick>) {
    setPicks((prev) => prev.map((p, idx) => idx === i ? { ...p, ...patch } : p));
  }
  function movePick(i: number, dir: -1 | 1) {
    setPicks((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }
  function removePick(i: number) {
    setPicks((prev) => prev.filter((_, idx) => idx !== i));
    setExpandedPick(null);
  }
  function addPick() {
    setPicks((prev) => [...prev, emptyPick()]);
    setExpandedPick(picks.length);
    addLibrarySearch();
  }
  function onAsinChange(i: number, asin: string) {
    updatePick(i, {
      asin,
      affiliateUrl: asin ? `https://www.amazon.com/dp/${asin.trim()}?tag=machinefanatic-20` : "",
    });
  }

  // Library picker state
  const [librarySearch, setLibrarySearch] = useState<string[]>(picks.map(() => ""));

  function addLibrarySearch() {
    setLibrarySearch((prev) => [...prev, ""]);
  }

  function mapLibraryProductToPick(p: StoredProduct): Partial<GuideProductPick> {
    return {
      productId: p.id,
      name: p.name,
      asin: p.asin,
      affiliateUrl: p.amazonUrl,
      imageUrl: p.image,
      priceLabel: (p.priceLabel as GuideProductPick["priceLabel"]) ?? "Check Amazon",
      fitScore: p.scores?.overall,
      specs: Object.entries(p.specs ?? {}).map(([label, value]) => ({ label, value })),
      pros: [...(p.pros ?? [])],
      cons: [...(p.cons ?? [])],
      bestFor: p.bestFor?.[0] ?? "",
      skipIf: p.notIdealFor?.[0] ?? "",
    };
  }

  function selectLibraryProduct(i: number, productId: string) {
    const product = (products ?? []).find((p) => p.id === productId);
    if (!product) return;
    updatePick(i, mapLibraryProductToPick(product));
    setLibrarySearch((prev) => prev.map((s, idx) => idx === i ? "" : s));
  }

  function clearLibraryLink(i: number) {
    updatePick(i, { productId: undefined });
  }

  const submitButton = (
    <div className="flex items-center gap-3 flex-wrap">
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors"
      >
        {pending && (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {pending ? "Saving…" : "Save Guide"}
      </button>
      {mode === "edit" && guide?.id && (
        <Link prefetch={false}
          href={`/admin/guides/${guide.id}/preview`}
          target="_blank"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
          Preview
        </Link>
      )}
      <Link prefetch={false}
        href="/admin/guides"
        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
      >
        Cancel
      </Link>
    </div>
  );

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {/* Global error */}
      {state.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-semibold text-red-800">{state.error}</p>
        </div>
      )}

      {/* Top submit */}
      {submitButton}

      {/* Section A: Basic Info */}
      <AdminCard>
        <h2 className="text-base font-semibold text-gray-900 mb-4">Basic Info</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminFormField label="Title" htmlFor="title" required error={fe.title}>
            <input
              id="title"
              name="title"
              type="text"
              required
              className={inputClass}
              defaultValue={guide?.title ?? ""}
              onChange={handleTitleChange}
            />
          </AdminFormField>

          <AdminFormField label="Slug" htmlFor="slug" required error={fe.slug}>
            <input
              id="slug"
              name="slug"
              type="text"
              required
              className={inputClass}
              value={slugValue}
              onChange={handleSlugChange}
            />
          </AdminFormField>

          <AdminFormField label="Category" htmlFor="categorySlug" required error={fe.categorySlug}>
            <select
              id="categorySlug"
              name="categorySlug"
              className={selectClass}
              defaultValue={guide?.categorySlug ?? ""}
            >
              <option value="">Select category…</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </AdminFormField>

          <AdminFormField label="Subcategory" htmlFor="subcategorySlug" error={fe.subcategorySlug}>
            <input
              id="subcategorySlug"
              name="subcategorySlug"
              type="text"
              className={inputClass}
              defaultValue={guide?.subcategorySlug ?? ""}
              placeholder="e.g. monitor-stands"
            />
          </AdminFormField>

          <div className="sm:col-span-2">
            <AdminFormField label="Description" htmlFor="description" error={fe.description}>
              <textarea
                id="description"
                name="description"
                rows={3}
                className={textareaClass}
                defaultValue={guide?.description ?? ""}
              />
            </AdminFormField>
          </div>

          <AdminFormField label="Author" htmlFor="author" error={fe.author}>
            <input
              id="author"
              name="author"
              type="text"
              className={inputClass}
              defaultValue={guide?.author ?? "MachineFanatic Editorial Team"}
            />
          </AdminFormField>

          <AdminFormField label="Read Time" htmlFor="readTime" error={fe.readTime}>
            <input
              id="readTime"
              name="readTime"
              type="text"
              className={inputClass}
              defaultValue={guide?.readTime ?? ""}
              placeholder="e.g. 7 min"
            />
          </AdminFormField>

          <AdminFormField label="Status" htmlFor="status" error={fe.status}>
            <select
              id="status"
              name="status"
              className={selectClass}
              defaultValue={guide?.status ?? "draft"}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </AdminFormField>
        </div>
      </AdminCard>

      {/* Section B: SEO */}
      <AdminCard>
        <h2 className="text-base font-semibold text-gray-900 mb-4">SEO</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminFormField label="Meta Title" htmlFor="metaTitle" error={fe.metaTitle}>
            <input
              id="metaTitle"
              name="metaTitle"
              type="text"
              className={inputClass}
              defaultValue={guide?.metaTitle ?? ""}
            />
          </AdminFormField>

          <AdminFormField label="Main Keyword" htmlFor="mainKeyword" error={fe.mainKeyword}>
            <input
              id="mainKeyword"
              name="mainKeyword"
              type="text"
              className={inputClass}
              defaultValue={guide?.mainKeyword ?? ""}
            />
          </AdminFormField>

          <div className="sm:col-span-2">
            <AdminFormField
              label="Meta Description"
              htmlFor="metaDescription"
              hint="Shown in Google results. 150-160 chars recommended."
              error={fe.metaDescription}
            >
              <textarea
                id="metaDescription"
                name="metaDescription"
                rows={2}
                className={textareaClass}
                defaultValue={guide?.metaDescription ?? ""}
              />
            </AdminFormField>
          </div>

          <div className="sm:col-span-2">
            <AdminFormField
              label="Sub Keywords"
              htmlFor="subKeywords"
              hint="One keyword per line."
              error={fe.subKeywords}
            >
              <textarea
                id="subKeywords"
                name="subKeywords"
                rows={3}
                className={textareaClass}
                defaultValue={guide?.subKeywords?.join("\n") ?? ""}
              />
            </AdminFormField>
          </div>
        </div>
      </AdminCard>

      {/* Section C: Hero Image */}
      <AdminCard>
        <h2 className="text-base font-semibold text-gray-900 mb-4">Hero Image</h2>
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AdminFormField label="Hero Image URL" htmlFor="heroImage" error={fe.heroImage}>
              <input
                id="heroImage"
                name="heroImage"
                type="text"
                className={inputClass}
                value={heroImageUrl}
                onChange={(e) => setHeroImageUrl(e.target.value)}
                placeholder="https://…"
              />
            </AdminFormField>

            <AdminFormField label="Hero Image Alt Text" htmlFor="heroImageAlt" error={fe.heroImageAlt}>
              <input
                id="heroImageAlt"
                name="heroImageAlt"
                type="text"
                className={inputClass}
                value={heroImageAlt}
                onChange={(e) => setHeroImageAlt(e.target.value)}
              />
            </AdminFormField>
          </div>
          <MediaSelector
            folder="guides"
            onSelect={(url, alt) => { setHeroImageUrl(url); if (alt) setHeroImageAlt(alt); }}
          />
          {heroImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={heroImageUrl} alt="Preview" className="h-20 w-auto object-cover rounded-lg border border-border mt-1" />
          )}
        </div>
      </AdminCard>

      {/* Section C2: Thumbnail Image */}
      <AdminCard>
        <h2 className="text-base font-semibold text-gray-900 mb-1">Thumbnail Image</h2>
        <p className="text-xs text-gray-500 mb-4">Shown on guide listing cards. If left empty, the Hero Image above will be used instead.</p>
        <div className="space-y-3">
          <AdminFormField label="Thumbnail URL" htmlFor="thumbnailImage" error={fe.thumbnailImage}>
            <input
              id="thumbnailImage"
              name="thumbnailImage"
              type="text"
              className={inputClass}
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="https://… (leave empty to use Hero Image)"
            />
          </AdminFormField>
          <MediaSelector
            folder="guides"
            onSelect={(url) => setThumbnailUrl(url)}
          />
          {thumbnailUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumbnailUrl} alt="Thumbnail preview" className="h-20 w-auto object-cover rounded-lg border border-border mt-1" />
          )}
        </div>
      </AdminCard>

      {/* Section D: Intro */}
      <AdminCard>
        <h2 className="text-base font-semibold text-gray-900 mb-4">Intro</h2>
        <AdminFormField label="Intro Text" htmlFor="intro" error={fe.intro}>
          <textarea
            id="intro"
            name="intro"
            rows={5}
            className={textareaClass}
            defaultValue={guide?.intro ?? ""}
          />
        </AdminFormField>
      </AdminCard>

      {/* Section E: Recommended Products */}
      <AdminCard>
        <h2 className="text-base font-semibold text-gray-900 mb-4">Recommended Products</h2>
        <AdminFormField
          label="Product IDs"
          htmlFor="recommendedProductIds"
          hint="Enter one product ID per line. IDs can be found on the Products page."
          error={fe.recommendedProductIds}
        >
          <textarea
            id="recommendedProductIds"
            name="recommendedProductIds"
            rows={4}
            className={textareaClass}
            defaultValue={guide?.recommendedProductIds?.join("\n") ?? ""}
          />
        </AdminFormField>

        {products && products.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-medium text-gray-500 mb-2">Available products (ID → name):</p>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 max-h-48 overflow-y-auto">
              <ul className="space-y-1">
                {products.map((p) => (
                  <li key={p.id} className="text-xs text-gray-600 font-mono">
                    <span className="text-gray-400">{p.id}</span>
                    <span className="text-gray-300 mx-1">-</span>
                    <span className="font-sans text-gray-700">{p.name}</span>
                    {p.subcategorySlug && (
                      <span className="text-gray-400 ml-1">({p.subcategorySlug})</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </AdminCard>

      {/* Hidden: serialised product picks JSON */}
      <input type="hidden" name="product_picks_json" value={JSON.stringify(picks)} />

      {/* Section E2: Product Picks Repeater */}
      <AdminCard>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-semibold text-gray-900">Product Picks</h2>
          <span className="text-xs text-gray-500">{picks.length} pick{picks.length !== 1 ? "s" : ""}</span>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Inline product picks stored directly in this guide. Enter ASIN to auto-generate affiliate URL.
          Amazon links use <code className="bg-gray-100 px-1 rounded">rel=&quot;nofollow sponsored noopener noreferrer&quot;</code>.
        </p>

        {picks.map((pick, i) => (
          <div key={pick.id} className="rounded-lg border border-gray-200 mb-3 overflow-hidden">
            {/* Accordion header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer"
              onClick={() => setExpandedPick(expandedPick === i ? null : i)}>
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-bold text-gray-400 w-5 text-center">{i + 1}</span>
                <span className="text-sm font-medium text-gray-800 truncate">
                  {pick.name || <span className="text-gray-400 italic">Untitled pick</span>}
                </span>
                {pick.badge && (
                  <span className="hidden sm:inline text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">
                    {pick.badge}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-2">
                <button type="button" onClick={(e) => { e.stopPropagation(); movePick(i, -1); }}
                  disabled={i === 0} className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 transition-colors" title="Move up">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" /></svg>
                </button>
                <button type="button" onClick={(e) => { e.stopPropagation(); movePick(i, 1); }}
                  disabled={i === picks.length - 1} className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 transition-colors" title="Move down">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                </button>
                <button type="button" onClick={(e) => { e.stopPropagation(); removePick(i); }}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors" title="Remove">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                </button>
                <svg className={`w-4 h-4 text-gray-400 transition-transform ml-1 ${expandedPick === i ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
              </div>
            </div>

            {/* Accordion body */}
            {expandedPick === i && (
              <div className="p-4 flex flex-col gap-4">
                {/* Library picker */}
                {(products ?? []).length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 p-3 rounded-lg bg-blue-50 border border-blue-100">
                    {pick.productId ? (
                      <>
                        <span className="text-xs font-semibold text-blue-700">
                          Linked: {(products ?? []).find((p) => p.id === pick.productId)?.name ?? pick.productId}
                        </span>
                        <Link prefetch={false}
                          href={`/admin/products/${pick.productId}/edit`}
                          target="_blank"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Edit in library ↗
                        </Link>
                        <button
                          type="button"
                          onClick={() => clearLibraryLink(i)}
                          className="ml-auto text-xs text-red-500 hover:text-red-700 transition-colors"
                        >
                          Clear link
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="text-xs text-blue-600 font-medium shrink-0">Select from library:</span>
                        <input
                          type="text"
                          value={librarySearch[i] ?? ""}
                          onChange={(e) => setLibrarySearch((prev) => prev.map((s, idx) => idx === i ? e.target.value : s))}
                          placeholder="Search products…"
                          className="flex-1 min-w-[120px] px-2 py-1 text-xs border border-blue-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                        />
                        <select
                          className="flex-1 min-w-[180px] px-2 py-1 text-xs border border-blue-200 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                          value=""
                          onChange={(e) => { if (e.target.value) selectLibraryProduct(i, e.target.value); }}
                        >
                          <option value="">- Pick a product -</option>
                          {(products ?? [])
                            .filter((p) => !librarySearch[i] || p.name.toLowerCase().includes((librarySearch[i] ?? "").toLowerCase()))
                            .map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name} ({p.subcategorySlug})
                              </option>
                            ))}
                        </select>
                      </>
                    )}
                  </div>
                )}

                {/* Row 1: Badge + Name + Brand */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <AdminFormField label="Badge" htmlFor={`pick_badge_${i}`}>
                    <input id={`pick_badge_${i}`} type="text" className={inputClass}
                      value={pick.badge} onChange={(e) => updatePick(i, { badge: e.target.value })}
                      placeholder="Best Overall" />
                  </AdminFormField>
                  <AdminFormField label="Product Name" htmlFor={`pick_name_${i}`} required>
                    <input id={`pick_name_${i}`} type="text" className={inputClass}
                      value={pick.name} onChange={(e) => updatePick(i, { name: e.target.value })}
                      placeholder="Anker Nano 6-in-1" />
                  </AdminFormField>
                  <AdminFormField label="Brand" htmlFor={`pick_brand_${i}`}>
                    <input id={`pick_brand_${i}`} type="text" className={inputClass}
                      value={pick.brand ?? ""} onChange={(e) => updatePick(i, { brand: e.target.value })}
                      placeholder="Anker" />
                  </AdminFormField>
                </div>

                {/* Row 2: ASIN + Affiliate URL */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <AdminFormField label="ASIN" htmlFor={`pick_asin_${i}`}
                    hint="Auto-fills affiliate URL with machinefanatic-20 tag">
                    <input id={`pick_asin_${i}`} type="text" className={inputClass}
                      value={pick.asin ?? ""} onChange={(e) => onAsinChange(i, e.target.value)}
                      placeholder="B0CT2NQ7WG" />
                  </AdminFormField>
                  <AdminFormField label="Affiliate URL" htmlFor={`pick_affiliateUrl_${i}`}
                    hint="Auto-generated from ASIN. Edit to override.">
                    <input id={`pick_affiliateUrl_${i}`} type="url" className={inputClass}
                      value={pick.affiliateUrl} onChange={(e) => updatePick(i, { affiliateUrl: e.target.value })}
                      placeholder="https://www.amazon.com/dp/…?tag=machinefanatic-20" />
                  </AdminFormField>
                </div>

                {/* Row 3: Image + Price Label + Fit Score */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="sm:col-span-2">
                    <AdminFormField label="Image URL" htmlFor={`pick_imageUrl_${i}`}>
                      <div className="flex gap-2 items-start">
                        <input id={`pick_imageUrl_${i}`} type="text" className={inputClass}
                          value={pick.imageUrl} onChange={(e) => updatePick(i, { imageUrl: e.target.value })}
                          placeholder="https://…supabase…/image.webp" />
                        {pick.imageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={pick.imageUrl} alt="" className="h-10 w-10 object-contain rounded border border-gray-200 shrink-0" />
                        )}
                      </div>
                    </AdminFormField>
                    <div className="mt-1">
                      <MediaSelector folder="guides" onSelect={(url) => updatePick(i, { imageUrl: url })} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <AdminFormField label="Price Label" htmlFor={`pick_priceLabel_${i}`}>
                      <select id={`pick_priceLabel_${i}`} className={selectClass}
                        value={pick.priceLabel} onChange={(e) => updatePick(i, { priceLabel: e.target.value as GuideProductPick["priceLabel"] })}>
                        {PRICE_LABELS.map((l) => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </AdminFormField>
                    <AdminFormField label="Machine Score (0-10)" htmlFor={`pick_fitScore_${i}`}
                      hint="Editorial score only, not shown as star rating">
                      <input id={`pick_fitScore_${i}`} type="number" min={0} max={10} step={0.1} className={inputClass}
                        value={pick.fitScore ?? ""} onChange={(e) => updatePick(i, { fitScore: e.target.value ? parseFloat(e.target.value) : undefined })} />
                    </AdminFormField>
                  </div>
                </div>

                {/* Row 4: Summary + Why It Wins */}
                <AdminFormField label="Summary (1-2 sentences)" htmlFor={`pick_summary_${i}`}>
                  <textarea id={`pick_summary_${i}`} rows={2} className={textareaClass}
                    value={pick.summary} onChange={(e) => updatePick(i, { summary: e.target.value })}
                    placeholder="One or two sentences describing why this pick matters." />
                </AdminFormField>

                <AdminFormField label="Why It Wins" htmlFor={`pick_whyItWins_${i}`}>
                  <textarea id={`pick_whyItWins_${i}`} rows={3} className={textareaClass}
                    value={pick.whyItWins} onChange={(e) => updatePick(i, { whyItWins: e.target.value })}
                    placeholder="The key differentiator that justifies this pick." />
                </AdminFormField>

                {/* Row 5: Best For + Skip If + CTA */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <AdminFormField label="Best For" htmlFor={`pick_bestFor_${i}`}>
                    <input id={`pick_bestFor_${i}`} type="text" className={inputClass}
                      value={pick.bestFor ?? ""} onChange={(e) => updatePick(i, { bestFor: e.target.value })}
                      placeholder="Small desks, dorm setups" />
                  </AdminFormField>
                  <AdminFormField label="Skip If" htmlFor={`pick_skipIf_${i}`}>
                    <input id={`pick_skipIf_${i}`} type="text" className={inputClass}
                      value={pick.skipIf ?? ""} onChange={(e) => updatePick(i, { skipIf: e.target.value })}
                      placeholder="You need wireless charging" />
                  </AdminFormField>
                  <AdminFormField label="CTA Label" htmlFor={`pick_ctaLabel_${i}`}>
                    <input id={`pick_ctaLabel_${i}`} type="text" className={inputClass}
                      value={pick.ctaLabel ?? ""} onChange={(e) => updatePick(i, { ctaLabel: e.target.value })}
                      placeholder="Check price on Amazon" />
                  </AdminFormField>
                </div>

                {/* Row 6: Specs + Pros + Cons */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <AdminFormField label="Specs" htmlFor={`pick_specs_${i}`} hint="Format: Label: Value (one per line)">
                    <textarea id={`pick_specs_${i}`} rows={4} className={`${textareaClass} font-mono text-xs`}
                      value={pick.specs.map((s) => `${s.label}: ${s.value}`).join("\n")}
                      onChange={(e) => {
                        const specs = e.target.value.split("\n").map((line) => {
                          const idx = line.indexOf(":");
                          if (idx === -1) return { label: line.trim(), value: "" };
                          return { label: line.slice(0, idx).trim(), value: line.slice(idx + 1).trim() };
                        }).filter((s) => s.label || s.value);
                        updatePick(i, { specs });
                      }}
                      placeholder={"Ports: 4× USB-C\nWeight: 147g"} />
                  </AdminFormField>
                  <AdminFormField label="Pros" htmlFor={`pick_pros_${i}`} hint="One per line">
                    <textarea id={`pick_pros_${i}`} rows={4} className={textareaClass}
                      value={pick.pros.join("\n")}
                      onChange={(e) => updatePick(i, { pros: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
                      placeholder={"50-hour battery\nFolds flat"} />
                  </AdminFormField>
                  <AdminFormField label="Cons" htmlFor={`pick_cons_${i}`} hint="One per line">
                    <textarea id={`pick_cons_${i}`} rows={4} className={textareaClass}
                      value={pick.cons.join("\n")}
                      onChange={(e) => updatePick(i, { cons: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
                      placeholder={"Apple only\nNo USB-C ports"} />
                  </AdminFormField>
                </div>
              </div>
            )}
          </div>
        ))}

        <button type="button" onClick={addPick}
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Product Pick
        </button>
      </AdminCard>

      {/* Section F: Content Sections */}
      <AdminCard>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">Content Sections</h2>
        </div>

        {fe.sections && (
          <p className="text-xs text-red-600 font-medium mb-3">{fe.sections}</p>
        )}

        <div className="flex flex-col gap-4">
          {sections.map((section, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Section {i + 1}
                </span>
                <div className="flex items-center gap-3">
                  {/* Visual / HTML toggle */}
                  <div className="flex items-center rounded-md border border-gray-200 overflow-hidden text-xs font-medium">
                    <button
                      type="button"
                      onClick={() => htmlModes[i] && toggleHtmlMode(i)}
                      className={
                        "px-2.5 py-1 transition-colors " +
                        (!htmlModes[i]
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-500 hover:bg-gray-50")
                      }
                    >
                      Visual
                    </button>
                    <button
                      type="button"
                      onClick={() => !htmlModes[i] && toggleHtmlMode(i)}
                      className={
                        "px-2.5 py-1 transition-colors " +
                        (htmlModes[i]
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-500 hover:bg-gray-50")
                      }
                    >
                      HTML
                    </button>
                  </div>
                  {sectionCount > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSection(i)}
                      className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Hidden input carries HTML value for FormData */}
              <input type="hidden" name={`section_body_${i}`} value={section.body} />

              <AdminFormField label="Body" htmlFor={`section_body_editor_${i}`}>
                {htmlModes[i] ? (
                  <textarea
                    id={`section_body_editor_${i}`}
                    value={section.body}
                    onChange={(e) => setSectionBody(i, e.target.value)}
                    spellCheck={false}
                    className="w-full min-h-[320px] rounded-lg border border-gray-200 bg-gray-50 px-3 py-3 font-mono text-xs text-gray-800 leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="<p>Paste or write HTML here...</p>"
                  />
                ) : (
                  <RichTextEditor
                    key={htmlModeKeys[i]}
                    value={section.body}
                    onChange={(html) => setSectionBody(i, html)}
                    placeholder="Write section content..."
                  />
                )}
              </AdminFormField>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addSection}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Section
        </button>
      </AdminCard>

      {/* Section G: FAQ */}
      <AdminCard>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">FAQ</h2>
        </div>

        {fe.faq && (
          <p className="text-xs text-red-600 font-medium mb-3">{fe.faq}</p>
        )}

        <div className="flex flex-col gap-4">
          {Array.from({ length: faqCount }, (_, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  FAQ {i + 1}
                </span>
                {faqCount > 1 && (
                  <button
                    type="button"
                    onClick={() => setFaqCount((n) => n - 1)}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>

              <AdminFormField label="Question" htmlFor={`faq_question_${i}`}>
                <input
                  id={`faq_question_${i}`}
                  name={`faq_question_${i}`}
                  type="text"
                  className={inputClass}
                  defaultValue={guide?.faq?.[i]?.question ?? ""}
                />
              </AdminFormField>

              <AdminFormField label="Answer" htmlFor={`faq_answer_${i}`}>
                <textarea
                  id={`faq_answer_${i}`}
                  name={`faq_answer_${i}`}
                  rows={3}
                  className={textareaClass}
                  defaultValue={guide?.faq?.[i]?.answer ?? ""}
                />
              </AdminFormField>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setFaqCount((n) => n + 1)}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add FAQ
        </button>
      </AdminCard>

      {/* Section H: Related Guides */}
      <AdminCard>
        <h2 className="text-base font-semibold text-gray-900 mb-4">Related Guides</h2>
        <AdminFormField
          label="Related Guide Slugs"
          htmlFor="relatedGuideSlugs"
          hint="One slug per line."
          error={fe.relatedGuideSlugs}
        >
          <textarea
            id="relatedGuideSlugs"
            name="relatedGuideSlugs"
            rows={3}
            className={textareaClass}
            defaultValue={guide?.relatedGuideSlugs?.join("\n") ?? ""}
          />
        </AdminFormField>
      </AdminCard>

      {/* Bottom submit */}
      {submitButton}
    </form>
  );
}
