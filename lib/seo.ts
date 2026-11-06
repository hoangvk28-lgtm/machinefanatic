import type { Metadata } from "next";
import { BRAND_NAME, SITE_URL, SITE_DESCRIPTION } from "@/lib/brand";

const SITE_NAME = BRAND_NAME;
const TWITTER_HANDLE = "@machinefanatic"; // TODO: confirm real handle or remove once account exists

export function buildMetadata({
  title,
  description,
  path = "/",
  image,
  noIndex = false,
  type = "website",
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  type?: "website" | "article";
}): Metadata {
  // Build the display title once, with a brand suffix appended if not already present.
  // Content pages get "| Reviewed by MachineFanatic" when it keeps the title within 60 chars,
  // otherwise the short "| MachineFanatic" so SERP titles are never truncated.
  // Use { absolute } so the root layout template (%s | MachineFanatic) never wraps it again.
  const reviewedSuffix = ` | Reviewed by ${SITE_NAME}`;
  const isContent = /^\/(guide|reviews|compare)\/./.test(path);
  const fullTitle = title.includes(SITE_NAME)
    ? title
    : isContent && title.length + reviewedSuffix.length <= 60
      ? `${title}${reviewedSuffix}`
      : `${title} | ${SITE_NAME}`;
  const canonicalUrl = `${SITE_URL}${path}`;
  // Support absolute Supabase image URLs directly; fall back to default OG image.
  const ogImage = image
    ? image.startsWith("http")
      ? image
      : `${SITE_URL}${image}`
    : `${SITE_URL}/opengraph-image`;

  return {
    title: { absolute: fullTitle },
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }],
      type,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
      site: TWITTER_HANDLE,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          "max-snippet": -1,
          "max-image-preview": "large",
          "max-video-preview": -1,
          googleBot: {
            index: true,
            follow: true,
            "max-snippet": -1,
            "max-image-preview": "large",
            "max-video-preview": -1,
          },
        },
  };
}

export const defaultMetadata: Metadata = buildMetadata({
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  path: "/",
});

export { SITE_NAME, SITE_URL, SITE_DESCRIPTION };
