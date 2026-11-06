"use client";

import { useActionState } from "react";
import { updateAffiliateSettingsAction } from "@/app/admin/settings-actions";
import { inputClass, textareaClass } from "@/components/admin/AdminFormField";
import type { AffiliateSettings } from "@/lib/site-settings-store";

export function AffiliateSettingsForm({ initial }: { initial: AffiliateSettings }) {
  const [state, formAction, isPending] = useActionState(updateAffiliateSettingsAction, {});

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      {state.error && <Alert type="error">{state.error}</Alert>}
      {state.success && <Alert type="success">Affiliate settings saved.</Alert>}

      <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
        <strong>Reminder:</strong> Do not claim fake discounts, fake pricing, or urgency. All disclosure text must be honest and accurate.
      </div>

      <Section title="Affiliate Disclosure Text">
        <div>
          <label className="block text-sm font-medium text-ink-secondary mb-1">Short disclosure (header/footer strip)</label>
          <input name="disclosureShort" defaultValue={initial.disclosureShort} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-secondary mb-1">Banner disclosure (shown in page banners)</label>
          <textarea name="disclosureBannerText" defaultValue={initial.disclosureBannerText} rows={3} className={textareaClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-secondary mb-1">Full disclosure (affiliate disclosure page)</label>
          <textarea name="disclosureFull" defaultValue={initial.disclosureFull} rows={5} className={textareaClass} />
        </div>
      </Section>

      <Section title="Amazon Associates">
        <div>
          <label className="block text-sm font-medium text-ink-secondary mb-1">Amazon Associates tag</label>
          <input name="amazonTag" defaultValue={initial.amazonTag} className={inputClass} placeholder="yoursite-20" />
          <p className="text-xs text-ink-muted mt-1">This tag is appended to all Amazon product URLs. Change only when your tag changes.</p>
        </div>
      </Section>

      <button type="submit" disabled={isPending} className="px-6 py-2.5 bg-brand text-white rounded-md font-medium text-sm hover:bg-brand-dark disabled:opacity-50 transition-colors">
        {isPending ? "Saving…" : "Save Affiliate Settings"}
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
