import { guides } from "@/data/guides";

// Machine-type key of a guide slug: drops "best-", size/voltage/rating tokens and the
// "for ..." tail, then keeps the last two words, e.g.
// best-40v-cordless-hedge-trimmers -> "hedge-trimmers", best-21-inch-snow-blowers -> "snow-blowers".
function machineKey(slug: string) {
  const words = slug
    .replace(/^best-/, "")
    .replace(/-(for|with|under|that|to)-.*$/, "")
    .split("-")
    .filter((w) => !/^\d/.test(w) && !/^(inch|ton|psi|gallon|stroke|point|v|cc|pint|watt|amp)s?$/.test(w));
  return words.slice(-2).join("-");
}

function sizeOf(slug: string) {
  const m = slug.match(/^best-(\d+(?:\.\d+)?)/);
  return m ? parseFloat(m[1]) : null;
}

/**
 * Picks related guides automatically: same machine type first (closest size first),
 * then same head noun, then same category. Used when a guide module has no hand-set relatedGuides.
 */
export function getRelatedGuides(slug: string, limit = 6): { title: string; href: string }[] {
  const self = guides.find((g) => g.slug === slug);
  const key = machineKey(slug);
  const noun = key.split("-").pop();
  const size = sizeOf(slug);
  return guides
    .filter((g) => g.slug !== slug)
    .map((g) => {
      const k = machineKey(g.slug);
      let score = 0;
      if (k === key) score += 10;
      else if (k.split("-").pop() === noun) score += 5;
      if (self && g.categorySlug === self.categorySlug) score += 1;
      const s = sizeOf(g.slug);
      const dist = size !== null && s !== null ? Math.abs(s - size) / Math.max(s, size) : 1;
      return { g, score, dist };
    })
    .filter((x) => x.score >= 5)
    .sort((a, b) => b.score - a.score || a.dist - b.dist)
    .slice(0, limit)
    .map(({ g }) => ({ title: g.title, href: `/guide/${g.slug}` }));
}
