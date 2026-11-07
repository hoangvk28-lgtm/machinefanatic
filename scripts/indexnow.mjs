// Submit URLs to IndexNow (Bing, Yandex, Seznam, Naver share submissions).
// Usage: node scripts/indexnow.mjs <slug-or-path> [...]   (a bare slug becomes /guide/<slug>)
//        node scripts/indexnow.mjs --diff <base-ref>      (new/changed guides between base-ref and HEAD)
// Key file: public/<INDEXNOW_KEY>.txt must be live on the site before pinging.
import { execSync } from "child_process";
const KEY = process.env.INDEXNOW_KEY || "d4d21af91d9048bd900e17e51b51947c";
const HOST = "www.machinefanatic.com";
let args = process.argv.slice(2);
if (args[0] === "--diff") {
  const out = execSync(`git diff --name-only --diff-filter=AM ${args[1]} HEAD -- data/guides data/legacy`, { encoding: "utf-8" });
  args = out.split("\n").filter(Boolean).map((f) => (f.startsWith("data/legacy/") ? "/" : "") + f.replace(/^data\/(guides|legacy)\//, "").replace(/\.ts$/, ""));
}
const urls = [...new Set(args.map((a) => (a.startsWith("http") ? a : a.startsWith("/") ? `https://${HOST}${a}` : `https://${HOST}/guide/${a}`)))];
if (!urls.length) { console.log("No URLs to submit."); process.exit(0); }
for (let i = 0; i < urls.length; i += 10000) {
  const r = await fetch("https://www.bing.com/indexnow", { method: "POST", headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls.slice(i, i + 10000) }) });
  console.log(`Bing IndexNow: HTTP ${r.status} for ${urls.slice(i, i + 10000).length} URLs`, r.status >= 300 ? await r.text() : "");
}
