"use client";

import { useActionState } from "react";
import { updateFooterSettingsAction } from "@/app/admin/settings-actions";
import { inputClass, textareaClass } from "@/components/admin/AdminFormField";
import type { FooterSettings } from "@/lib/site-settings-store";

export function FooterSettingsForm({ initial }: { initial: FooterSettings }) {
  const [state, formAction, isPending] = useActionState(updateFooterSettingsAction, {});

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      {state.error && <Alert type="error">{state.error}</Alert>}
      {state.success && <Alert type="success">Footer settings saved.</Alert>}

      <div className="bg-white rounded-card border border-border p-6 space-y-4">
        <h3 className="font-semibold text-ink text-sm border-b border-border pb-2">Footer Content</h3>

        <div>
          <label className="block text-sm font-medium text-ink-secondary mb-1">Brand description</label>
          <textarea name="description" defaultValue={initial.description} rows={3} className={textareaClass} />
          <p className="text-xs text-ink-muted mt-1">Shown in the footer brand column, below the logo.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-secondary mb-1">Copyright text</label>
          <input name="copyrightText" defaultValue={initial.copyrightText} className={inputClass} placeholder="MachineFanatic. All rights reserved." />
          <p className="text-xs text-ink-muted mt-1">The year is automatically prepended (e.g. &quot;© 2025&quot;).</p>
        </div>

        <div className="flex items-center gap-3">
          <input type="hidden" name="showAffiliateDisclosure" value="false" />
          <input id="show-disclosure" type="checkbox" name="showAffiliateDisclosure" value="true" defaultChecked={initial.showAffiliateDisclosure} className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand" />
          <label htmlFor="show-disclosure" className="text-sm font-medium text-ink-secondary">Show affiliate disclosure strip in footer</label>
        </div>
      </div>

      <button type="submit" disabled={isPending} className="px-6 py-2.5 bg-brand text-white rounded-md font-medium text-sm hover:bg-brand-dark disabled:opacity-50 transition-colors">
        {isPending ? "Saving…" : "Save Footer Settings"}
      </button>
    </form>
  );
}

function Alert({ type, children }: { type: "error" | "success"; children: React.ReactNode }) {
  return (
    <div className={`rounded-lg p-4 text-sm ${type === "error" ? "bg-red-50 border border-red-200 text-red-700" : "bg-green-50 border border-green-200 text-green-700"}`}>
      {children}
    </div>
  );
}
