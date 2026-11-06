import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googletagmanager.com *.google-analytics.com *.clarity.ms; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' *.google-analytics.com *.supabase.co *.clarity.ms; style-src 'self' 'unsafe-inline'; frame-ancestors 'self';" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // non-www → www (301 permanent — tells Google which is canonical)
      // TODO: confirm final domain, this must match NEXT_PUBLIC_SITE_URL
      {
        source: "/:path*",
        has: [{ type: "host", value: "machinefanatic.com" }],
        destination: "https://www.machinefanatic.com/:path*",
        permanent: true,
      },
      {
        source: "/about",
        destination: "/about-us", // TODO: confirm real about-page slug
        permanent: true,
      },
      // Fix 404: /author listing page → about page
      {
        source: "/author",
        destination: "/about-us", // TODO: confirm real about-page slug
        permanent: true,
      },
    ];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
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
