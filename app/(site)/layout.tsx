import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/seo";

const siteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon`,
      },
      // No confirmed live social accounts yet — add here once real profiles exist.
      sameAs: [],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-full bg-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
      />
      <Header />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
