#!/usr/bin/env node
// Post-build step for Cloudflare Pages (runs after `next build` with output: "export").
// Copies cloudflare/redirects.txt -> out/_redirects and cloudflare/headers.txt -> out/_headers.
// The non-www -> www 301 is a Cloudflare Redirect Rule (_redirects cannot match on host).
import { copyFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "out");
if (!existsSync(OUT)) {
  console.error("out/ not found. Run `next build` first.");
  process.exit(1);
}
copyFileSync(path.join(ROOT, "cloudflare", "redirects.txt"), path.join(OUT, "_redirects"));
copyFileSync(path.join(ROOT, "cloudflare", "headers.txt"), path.join(OUT, "_headers"));
console.log("_redirects and _headers written.");
