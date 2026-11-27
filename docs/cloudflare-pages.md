# Hosting on Cloudflare Pages

The site is a **static export** (`output: "export"` in `next.config.ts`). `npm run build` prerenders
every page (including all rich data-file guides) to `out/`, then `scripts/prune-export.mjs` drops
Next 16 `__next.*` segment payloads (safe because every Link has `prefetch={false}`) and
`scripts/cf-routing.mjs` copies `cloudflare/redirects.txt` -> `out/_redirects` and
`cloudflare/headers.txt` -> `out/_headers`.

| Vercel feature | Cloudflare replacement |
|---|---|
| ISR (`revalidate`) | None. Every page is built at deploy time; a content change needs a push. |
| `next.config.ts` redirects | `cloudflare/redirects.txt` (Pages `_redirects` syntax, max 2,000 rules) |
| `next.config.ts` headers | `cloudflare/headers.txt` |
| non-www -> www 301 | Cloudflare **Redirect Rule** (below) |
| `proxy.ts` bot blocking | Cloudflare **WAF custom rule** (below) |
| `/admin`, `/api/*`, Supabase admin | Removed (unused template leftovers). `lib/public-*` falls back to static `data/`. |
| Unknown slug | Static `404.html` |

## One-time setup

1. Workers & Pages -> Create -> **Pages** -> Connect to Git -> `machinefanatic` repo.
2. Build command `npm run build`, output directory `out` (not the Next.js preset).
   Env vars: `NODE_VERSION=22`, `NEXT_PUBLIC_SITE_URL=https://www.machinefanatic.com`, plus any
   `NEXT_PUBLIC_*` vars set on Vercel (GA, Clarity, site verification).
3. Custom domains: add `www.machinefanatic.com` and `machinefanatic.com`.
4. Rules -> Redirect Rules: hostname equals `machinefanatic.com` -> dynamic
   `concat("https://www.machinefanatic.com", http.request.uri.path)`, 301, preserve query string.
5. Security -> WAF -> Custom rules -> Block:
   `(http.user_agent contains "Bytespider") or (http.user_agent contains "CCBot") or (http.user_agent contains "AhrefsBot") or (http.user_agent contains "SemrushBot") or (http.user_agent contains "PetalBot") or (http.user_agent contains "MJ12bot")`
6. Once DNS is switched and the site checks out, remove the project from Vercel.
