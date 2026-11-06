"use client";

import { useActionState, useState } from "react";
import { updateHomepageSettingsAction } from "@/app/admin/settings-actions";
import { inputClass, selectClass, textareaClass } from "@/components/admin/AdminFormField";
import { MediaSelector } from "@/components/admin/MediaSelector";
import type { HomepageSettings } from "@/lib/site-settings-store";

interface Props {
  initial: HomepageSettings;
  availableGuides: Array<{ slug: string; title: string }>;
}

export function HomepageSettingsForm({ initial, availableGuides }: Props) {
  const [state, formAction, isPending] = useActionState(updateHomepageSettingsAction, {});
  const [heroImageUrl, setHeroImageUrl] = useState(initial.hero.heroImageUrl ?? "");
  const [heroImageAlt, setHeroImageAlt] = useState(initial.hero.heroImageAlt ?? "");

  const h = initial.hero;
  const n = initial.newsletter;
  const trust = initial.trustBar.items;

  return (
    <form action={formAction} className="space-y-8">
      {state.error && <Alert type="error">{state.error}</Alert>}
      {state.success && <Alert type="success">Homepage settings saved.</Alert>}

      {/* ── Hero ── */}
      <Section title="Hero Section">
        <Field label="Eyebrow text" name="hero.eyebrow" defaultValue={h.eyebrow} />
        <Field label="Headline (first part)" name="hero.headline" defaultValue={h.headline} hint="e.g. 'Smart Amazon Buying'" />
        <Field label="Headline accent (gradient part)" name="hero.headlineAccent" defaultValue={h.headlineAccent} hint="e.g. 'for Small Spaces'" />
        <Textarea label="Subtitle" name="hero.subtitle" defaultValue={h.subtitle} rows={2} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Primary CTA text" name="hero.primaryCtaText" defaultValue={h.primaryCtaText} />
          <Field label="Primary CTA link" name="hero.primaryCtaHref" defaultValue={h.primaryCtaHref} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Secondary CTA text" name="hero.secondaryCtaText" defaultValue={h.secondaryCtaText} />
          <Field label="Secondary CTA link" name="hero.secondaryCtaHref" defaultValue={h.secondaryCtaHref} />
        </div>
        <Field label="Search placeholder text" name="hero.searchPlaceholder" defaultValue={h.searchPlaceholder} />
        <Field label="Badge text (below CTAs)" name="hero.badgeText" defaultValue={h.badgeText} />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-ink-secondary">Hero Image URL</label>
          <input name="hero.heroImageUrl" value={heroImageUrl} onChange={(e) => setHeroImageUrl(e.target.value)} className={inputClass} placeholder="Leave blank to use the gradient background" />
          <Field label="Hero Image Alt Text" name="hero.heroImageAlt" value={heroImageAlt} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHeroImageAlt(e.target.value)} />
          <MediaSelector folder="homepage" onSelect={(url, alt) => { setHeroImageUrl(url); if (alt) setHeroImageAlt(alt); }} />
          {heroImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={heroImageUrl} alt="Preview" className="h-16 w-auto rounded border border-border" />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-secondary mb-1">Top Picks product slugs (one per line)</label>
          <textarea
            name="hero.featuredProductSlugs"
            defaultValue={h.featuredProductSlugs.join("\n")}
            className={textareaClass}
            rows={4}
            placeholder="e.g.&#10;lumiy-lightblade-1500s&#10;amazon-basics-laptop-stand"
          />
          <p className="text-xs text-ink-muted mt-1">These populate the &quot;Top Picks&quot; card in the hero. Leave blank to use highest-scored products automatically.</p>
        </div>
      </Section>

      {/* ── Trust bar ── */}
      <Section title="Trust Stats Bar">
        {trust.map((item, i) => (
          <div key={i} className="grid grid-cols-2 gap-3 pb-3 border-b border-border last:border-0">
            <div>
              <p className="text-xs font-bold text-ink mb-1">{item.number} {item.unit}</p>
              <Field label="Label" name={`trust.${i}.label`} defaultValue={item.label} />
            </div>
            <Textarea label="Description" name={`trust.${i}.description`} defaultValue={item.description} rows={2} />
          </div>
        ))}
        <p className="text-xs text-ink-muted">The numbers/units are fixed (14 products, 6 guides, 5 criteria, 1-10 scale). Edit label and description text here.</p>
      </Section>

      {/* ── Featured guide ── */}
      <Section title="Featured Guide">
        <div>
          <label className="block text-sm font-medium text-ink-secondary mb-1">Featured guide slug</label>
          {availableGuides.length > 0 ? (
            <select name="featuredGuideSlug" defaultValue={initial.featuredGuideSlug} className={selectClass}>
              <option value="">- None -</option>
              {availableGuides.map((g) => (
                <option key={g.slug} value={g.slug}>{g.title} ({g.slug})</option>
              ))}
            </select>
          ) : (
            <input name="featuredGuideSlug" defaultValue={initial.featuredGuideSlug} className={inputClass} placeholder="e.g. desk-lamps-small-desks" />
          )}
          <p className="text-xs text-ink-muted mt-1">The editorial card shown below the hero and affiliate disclosure.</p>
        </div>
      </Section>

      {/* ── Section titles ── */}
      <Section title="Section Titles &amp; Descriptions">
        <div className="space-y-4">
          <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide">Guides section</p>
          <Field label="Title" name="sections.guides.title" defaultValue={initial.sections.guides.title} />
          <Textarea label="Description" name="sections.guides.description" defaultValue={initial.sections.guides.description} rows={2} />
          <Field label="Guides to show (number)" name="sections.guides.limit" defaultValue={String(initial.sections.guides.limit)} />
        </div>
        <div className="space-y-4 pt-4 border-t border-border">
          <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide">Deals section</p>
          <Field label="Title" name="sections.deals.title" defaultValue={initial.sections.deals.title} />
          <Textarea label="Description" name="sections.deals.description" defaultValue={initial.sections.deals.description} rows={2} />
        </div>
        <div className="space-y-4 pt-4 border-t border-border">
          <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide">Categories section</p>
          <Field label="Title" name="sections.categories.title" defaultValue={initial.sections.categories.title} />
          <Textarea label="Description" name="sections.categories.description" defaultValue={initial.sections.categories.description} rows={2} />
        </div>
      </Section>

      {/* ── Newsletter ── */}
      <Section title="Newsletter CTA">
        <div className="flex items-center gap-3">
          <input type="hidden" name="newsletter.enabled" value="false" />
          <input id="nl-enabled" type="checkbox" name="newsletter.enabled" value="true" defaultChecked={n.enabled} className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand" />
          <label htmlFor="nl-enabled" className="text-sm font-medium text-ink-secondary">Show newsletter section</label>
        </div>
        <Field label="Eyebrow" name="newsletter.eyebrow" defaultValue={n.eyebrow} />
        <Field label="Title" name="newsletter.title" defaultValue={n.title} />
        <Textarea label="Description" name="newsletter.description" defaultValue={n.description} rows={2} />
        <Field label="Input placeholder" name="newsletter.inputPlaceholder" defaultValue={n.inputPlaceholder} />
        <Field label="Button text" name="newsletter.buttonText" defaultValue={n.buttonText} />
        <Field label="Disclaimer text" name="newsletter.disclaimer" defaultValue={n.disclaimer} />
      </Section>

      <SaveButton isPending={isPending} />
    </form>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-card border border-border p-6 space-y-4">
      <h3 className="font-semibold text-ink text-sm border-b border-border pb-2">{title}</h3>
      {children}
    </div>
  );
}

function Alert({ type, children }: { type: "error" | "success"; children: React.ReactNode }) {
  return (
    <div className={`rounded-lg p-4 text-sm ${type === "error" ? "bg-red-50 border border-red-200 text-red-700" : "bg-green-50 border border-green-200 text-green-700"}`}>
      {children}
    </div>
  );
}

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  hint?: string;
}

function Field({ label, hint, ...props }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink-secondary mb-1">{label}</label>
      <input className={inputClass} {...props} />
      {hint && <p className="text-xs text-ink-muted mt-1">{hint}</p>}
    </div>
  );
}

interface TextareaProps {
  label: string;
  name: string;
  defaultValue?: string;
  rows?: number;
}

function Textarea({ label, name, defaultValue, rows = 3 }: TextareaProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink-secondary mb-1">{label}</label>
      <textarea name={name} defaultValue={defaultValue} rows={rows} className={textareaClass} />
    </div>
  );
}

function SaveButton({ isPending }: { isPending: boolean }) {
  return (
    <div className="flex gap-3">
      <button type="submit" disabled={isPending} className="px-6 py-2.5 bg-brand text-white rounded-md font-medium text-sm hover:bg-brand-dark disabled:opacity-50 transition-colors">
        {isPending ? "Saving…" : "Save Homepage Settings"}
      </button>
    </div>
  );
}
