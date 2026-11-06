// Usage: node scripts/search-sample-items.mjs <raw.json> "<query>" — appends new items
import { readFileSync, writeFileSync } from "fs";
for (const l of readFileSync("/home/admin1/Downloads/AGENT/projects/BestFindsReviews/.env.local", "utf-8").split(/\r?\n/)) { const e = l.indexOf("="); if (e > 0 && !l.startsWith("#")) process.env[l.slice(0, e).trim()] ??= l.slice(e + 1).trim(); }
const [file, q] = process.argv.slice(2);
const data = JSON.parse(readFileSync(file, "utf-8"));
const tok = await (await fetch("https://api.amazon.com/auth/o2/token", { method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ grant_type: "client_credentials", client_id: process.env.AMAZON_PAAPI_ACCESS_KEY, client_secret: process.env.AMAZON_PAAPI_SECRET_KEY, scope: "creatorsapi::default" }) })).json();
const r = await fetch("https://creatorsapi.amazon/catalog/v1/searchItems", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok.access_token}`, "x-marketplace": "www.amazon.com" },
  body: JSON.stringify({ keywords: q, marketplace: "www.amazon.com", partnerTag: "worthrated-20", itemCount: 10, resources: ["images.primary.large", "itemInfo.title", "itemInfo.features", "itemInfo.byLineInfo", "offersV2.listings.price"] }) });
const d = await r.json();
const have = new Set(data.items.map((i) => i.asin));
data.candidates = (d.searchResult?.items || []).filter((i) => !have.has(i.asin) && i.images?.primary?.large?.url).map((i) => ({ asin: i.asin, title: i.itemInfo?.title?.displayValue, brand: i.itemInfo?.byLineInfo?.brand?.displayValue || "", price: i.offersV2?.listings?.[0]?.price?.money?.displayAmount || "", img: i.images.primary.large.url, features: i.itemInfo?.features?.displayValues || [] }));
writeFileSync(file, JSON.stringify(data, null, 1));
data.candidates.forEach((c, k) => console.log(k, c.asin, c.price, (c.title || "").slice(0, 110)));
