import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Use - MachineFanatic",
  description:
    "Terms of use for machinefanatic.com, including acceptable use, affiliate relationships, content accuracy, and limitation of liability.",
  path: "/terms-of-use",
});

export default function TermsOfUsePage() {
  return (
    <Container narrow className="py-14">
      <header className="mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-brand">Legal</span>
        <h1 className="mt-2 mb-3 tracking-tight">Terms of Use</h1>
        <p className="text-sm text-ink-muted">Last updated: August 2026</p>
      </header>

      <div className="space-y-10 text-sm text-ink-secondary leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-ink mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing or using machinefanatic.com (&ldquo;MachineFanatic,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;the site&rdquo;), you agree to these Terms of Use. If you do not agree, please do not use the site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink mb-3">2. Content Is Informational, Not Advice</h2>
          <p>
            MachineFanatic publishes independent buying guides and product comparisons for general informational purposes. Content on this site is not professional, medical, or purchasing advice tailored to your individual situation. Always verify current specifications, pricing, and availability directly with the retailer or manufacturer before purchasing.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink mb-3">3. Affiliate Relationships</h2>
          <p>
            MachineFanatic participates in affiliate programs, including the Amazon Services LLC Associates Program. We may earn a commission on qualifying purchases made through links on this site, at no additional cost to you. See our{" "}
            <Link prefetch={false} href="/affiliate-disclosure" className="text-brand hover:text-brand-dark underline underline-offset-2 font-medium transition-colors">Affiliate Disclosure</Link>{" "}
            for details.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink mb-3">4. No Guarantee of Accuracy</h2>
          <p>
            We research products carefully using published specifications, manufacturer documentation, and patterns in verified buyer feedback. Product details, prices, and availability change frequently and are controlled by third-party retailers and manufacturers, not by MachineFanatic. We do not guarantee that information on this site is complete, current, or error-free.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink mb-3">5. Third-Party Links</h2>
          <p>
            This site contains links to third-party retailers, including Amazon. We are not responsible for the content, policies, or practices of any third-party site. Your purchase and any dispute related to a purchase is between you and the retailer.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink mb-3">6. Intellectual Property</h2>
          <p>
            Text, graphics, and the MachineFanatic name and logo on this site are owned by MachineFanatic unless otherwise noted, and may not be reproduced without permission. Product names, logos, and trademarks mentioned on this site belong to their respective owners.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink mb-3">7. Limitation of Liability</h2>
          <p>
            MachineFanatic is provided &ldquo;as is&rdquo; without warranties of any kind. To the fullest extent permitted by law, MachineFanatic is not liable for any damages arising from your use of this site or reliance on its content, including purchase decisions made based on our guides.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink mb-3">8. Changes to These Terms</h2>
          <p>
            We may update these Terms of Use from time to time. Continued use of the site after changes are posted constitutes acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-ink mb-3">9. Contact</h2>
          <p>
            Questions about these terms can be sent through our{" "}
            <Link prefetch={false} href="/contact" className="text-brand hover:text-brand-dark underline underline-offset-2 font-medium transition-colors">Contact page</Link>.
          </p>
        </section>
      </div>
    </Container>
  );
}
