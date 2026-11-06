"use client";

import { useActionState } from "react";
import { updateGlobalSettingsAction } from "@/app/admin/settings-actions";
import { inputClass } from "@/components/admin/AdminFormField";
import type { GlobalSettings } from "@/lib/site-settings-store";

export function GlobalSettingsForm({ initial }: { initial: GlobalSettings }) {
  const [state, formAction, isPending] = useActionState(updateGlobalSettingsAction, {});

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      {state.error && <Alert type="error">{state.error}</Alert>}
      {state.success && <Alert type="success">Global settings saved.</Alert>}

      <Section title="Site Identity">
        <Field label="Site name" name="siteName" defaultValue={initial.siteName} />
        <Field label="Site tagline" name="siteTagline" defaultValue={initial.siteTagline} hint="Used in page titles and meta descriptions." />
      </Section>

      <Section title="Header">
        <Field label="Logo text" name="header.logoText" defaultValue={initial.header.logoText} hint='Displayed next to the SP icon. Use "SmartSpacePicks" format.' />
        <Field label="Deals button text" name="header.dealsButtonText" defaultValue={initial.header.dealsButtonText} />
        <div className="flex items-center gap-3">
          <input type="hidden" name="header.showDealsButton" value="false" />
          <input id="show-deals" type="checkbox" name="header.showDealsButton" value="true" defaultChecked={initial.header.showDealsButton} className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand" />
          <label htmlFor="show-deals" className="text-sm font-medium text-ink-secondary">Show deals button in header</label>
        </div>
      </Section>

      <button type="submit" disabled={isPending} className="px-6 py-2.5 bg-brand text-white rounded-md font-medium text-sm hover:bg-brand-dark disabled:opacity-50 transition-colors">
        {isPending ? "Saving…" : "Save Global Settings"}
      </button>
    </form>
  );
}

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

function Field({ label, name, defaultValue, hint }: { label: string; name: string; defaultValue?: string; hint?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink-secondary mb-1">{label}</label>
      <input name={name} defaultValue={defaultValue} className={inputClass} />
      {hint && <p className="text-xs text-ink-muted mt-1">{hint}</p>}
    </div>
  );
}
