import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Cloudflare Pages: the whole site is prerendered to static HTML in out/. No ISR, proxy,
  // route handlers or next.config headers/redirects; see docs/cloudflare-pages.md and cloudflare/.
  output: "export",
  outputFileTracingRoot: path.join(__dirname),
  turbopack: { root: path.join(__dirname) },
  experimental: {
    // Keep local builds within workstation memory while prerendering ~2,500+ guides.
    cpus: 2,
    staticGenerationMaxConcurrency: 2,
  },
  images: {
    // Vercel Hobby plan's free Image Optimization quota (5,000 transformations/month)
    // is shared across every project on the account and is already exhausted, which
    // makes every next/image request 402 in production. Serve images unoptimized
    // (no on-the-fly resize/reformat) until the plan is upgraded or the quota resets.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
    ],
  },
};

export default nextConfig;
