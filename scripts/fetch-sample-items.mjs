// Fetch live title/features/brand/image for the ASINs used in a source guide.
// Usage: node scripts/fetch-sample-items.mjs <sourceGuide.ts> <out.json>
import { readFileSync, writeFileSync } from "fs";
const envPath = "/home/admin1/Downloads/AGENT/projects/BestFindsReviews/.env.local";
for (const l of readFileSync(envPath, "utf-8").split(/\r?\n/)) { const e = l.indexOf("="); if (e > 0 && !l.startsWith("#")) process.env[l.slice(0, e).trim()] ??= l.slice(e + 1).trim(); }
const [src, out] = process.argv.slice(2);
const txt = readFileSync(src, "utf-8");
const asins = [...new Set([...txt.matchAll(/dp\/(B0[A-Z0-9]{8})/g)].map((m) => m[1]))].slice(0, 10);
const tok = await (await fetch("https://api.amazon.com/auth/o2/token", { method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ grant_type: "client_credentials", client_id: process.env.AMAZON_PAAPI_ACCESS_KEY, client_secret: process.env.AMAZON_PAAPI_SECRET_KEY, scope: "creatorsapi::default" }) })).json();
const r = await fetch("https://creatorsapi.amazon/catalog/v1/getItems", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok.access_token}`, "x-marketplace": "www.amazon.com" },
  body: JSON.stringify({ itemIds: asins, itemIdType: "ASIN", marketplace: "www.amazon.com", partnerTag: "worthrated-20", resources: ["images.primary.large", "itemInfo.title", "itemInfo.features", "itemInfo.byLineInfo", "offersV2.listings.price"] }) });
const d = await r.json();
const items = (d.itemsResult?.items || []).map((i) => ({ asin: i.asin, title: i.itemInfo?.title?.displayValue, brand: i.itemInfo?.byLineInfo?.brand?.displayValue || "", price: i.offersV2?.listings?.[0]?.price?.money?.displayAmount || "", img: i.images?.primary?.large?.url, features: i.itemInfo?.features?.displayValues || [] }));
writeFileSync(out, JSON.stringify({ src, asins, items, errors: d.errors }, null, 1));
console.log(out, asins.length, "asked", items.length, "got", d.errors ? JSON.stringify(d.errors).slice(0, 200) : "");
