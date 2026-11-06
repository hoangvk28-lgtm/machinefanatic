import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/_next/static/", "/_next/image"],
        disallow: [
          "/admin",
          "/admin/",
          "/api/admin",
          "/api/admin/",
          "/api/",
          "/_next/",
        ],
      },
      // AI crawlers: allow full indexing so content surfaces in AI search results
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "Claude-Web", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
      { userAgent: "Bingbot", allow: "/" },
      // Bytespider (ByteDance) and CCBot (Common Crawl) crawl aggressively
      // without respecting crawl-delay and drive up ISR reads / origin
      // bandwidth without sending real traffic back to the site.
      { userAgent: "Bytespider", disallow: "/" },
      { userAgent: "CCBot", disallow: "/" },
      // SEO-tool and scraper crawlers: no referral traffic, heavy ISR reads.
      ...["PetalBot","AhrefsBot","SemrushBot","MJ12bot","DotBot","BLEXBot","DataForSeoBot","Barkrowler","serpstatbot","Amazonbot","meta-externalagent","ImagesiftBot","Baiduspider","YisouSpider","Sogou"].map((ua) => ({ userAgent: ua, disallow: "/" })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
