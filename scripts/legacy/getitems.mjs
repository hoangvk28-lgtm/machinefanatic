import { readFileSync, writeFileSync } from "fs";
for (const l of readFileSync("/home/admin1/Downloads/AGENT/projects/BestFindsReviews/.env.local", "utf-8").split(/\r?\n/)) { const e = l.indexOf("="); if (e > 0 && !l.startsWith("#")) process.env[l.slice(0, e).trim()] ??= l.slice(e + 1).trim(); }
const [out, ...asins] = process.argv.slice(2);
const tok = await (await fetch("https://api.amazon.com/auth/o2/token", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ grant_type: "client_credentials", client_id: process.env.AMAZON_PAAPI_ACCESS_KEY, client_secret: process.env.AMAZON_PAAPI_SECRET_KEY, scope: "creatorsapi::default" }) })).json();
const r = await fetch("https://creatorsapi.amazon/catalog/v1/getItems", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok.access_token}`, "x-marketplace": "www.amazon.com" }, body: JSON.stringify({ itemIds: asins, itemIdType: "ASIN", marketplace: "www.amazon.com", partnerTag: "worthrated-20", resources: ["images.primary.large", "itemInfo.title", "itemInfo.features", "itemInfo.byLineInfo"] }) });
const d = await r.json();
const items = (d.itemsResult?.items || []).map((i) => ({ asin: i.asin, title: i.itemInfo?.title?.displayValue, imageUrl: i.images?.primary?.large?.url, amazonUrl: `https://www.amazon.com/dp/${i.asin}?tag=machinefanatic-20`, features: i.itemInfo?.features?.displayValues || [] }));
writeFileSync(out, JSON.stringify(items, null, 1)); console.log(out, items.length, d.errors ? JSON.stringify(d.errors).slice(0, 200) : "");
