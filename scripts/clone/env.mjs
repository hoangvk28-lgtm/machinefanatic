// Loads ./.env.local (repo root) into process.env. Never commit .env.local.
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
const p = resolve(process.cwd(), ".env.local");
if (existsSync(p)) for (const l of readFileSync(p, "utf-8").split(/\r?\n/)) { const e = l.indexOf("="); if (e > 0 && !l.startsWith("#")) process.env[l.slice(0, e).trim()] ??= l.slice(e + 1).trim().replace(/^["']|["']$/g, ""); }
for (const k of ["AMAZON_PAAPI_ACCESS_KEY", "AMAZON_PAAPI_SECRET_KEY"]) {
  const v = process.env[k] || "";
  if (v.length < 16) { console.error(`${k} missing or too short (len ${v.length}). Put real values in .env.local (Vercel "Secret" vars pull as redacted placeholders).`); process.exit(1); }
}
export const PARTNER_TAG = process.env.AMAZON_PARTNER_TAG || process.env.AMAZON_PAAPI_PARTNER_TAG || "worthrated-20"; // tag used for API auth (account owner)
export const SITE_TAG = process.env.SITE_AMAZON_TAG || "machinefanatic-20"; // tag written into affiliate links
export async function token() {
  const r = await fetch("https://api.amazon.com/auth/o2/token", { method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ grant_type: "client_credentials", client_id: process.env.AMAZON_PAAPI_ACCESS_KEY, client_secret: process.env.AMAZON_PAAPI_SECRET_KEY, scope: "creatorsapi::default" }) });
  const j = await r.json(); if (!j.access_token) { console.error("Auth failed", JSON.stringify(j).slice(0, 200)); process.exit(1); } return j.access_token;
}
const RES = ["images.primary.large", "itemInfo.title", "itemInfo.features", "itemInfo.byLineInfo", "offersV2.listings.price"];
const map = (i) => ({ asin: i.asin, title: i.itemInfo?.title?.displayValue, brand: i.itemInfo?.byLineInfo?.brand?.displayValue || "", imageUrl: i.images?.primary?.large?.url, amazonUrl: `https://www.amazon.com/dp/${i.asin}?tag=${SITE_TAG}`, price_internal_only: i.offersV2?.listings?.[0]?.price?.money?.displayAmount || "", features: i.itemInfo?.features?.displayValues || [] });
export async function getItems(tok, asins) {
  const r = await fetch("https://creatorsapi.amazon/catalog/v1/getItems", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok}`, "x-marketplace": "www.amazon.com" },
    body: JSON.stringify({ itemIds: asins.slice(0, 10), itemIdType: "ASIN", marketplace: "www.amazon.com", partnerTag: PARTNER_TAG, resources: RES }) });
  const d = await r.json(); return (d.itemsResult?.items || []).filter((i) => i.images?.primary?.large?.url).map(map);
}
export async function search(tok, q) {
  const r = await fetch("https://creatorsapi.amazon/catalog/v1/searchItems", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok}`, "x-marketplace": "www.amazon.com" },
    body: JSON.stringify({ keywords: q, marketplace: "www.amazon.com", partnerTag: PARTNER_TAG, itemCount: 10, resources: RES }) });
  const d = await r.json(); return (d.searchResult?.items || []).filter((i) => i.images?.primary?.large?.url).map(map);
}
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
