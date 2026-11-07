// Shared accessory/part detector for compact.mjs and prefilter.mjs (keep them in sync by importing this).
// Phrase-based on purpose: single words like "filter", "oil" or "cover" appear in real machine titles
// ("True HEPA Filter", "Oil-Free Air Fryer"), so only accessory phrasing counts as junk.
const PHRASES = [
  /\breplacement\b/, /\bspare\b/, /\bblades? (set|for|kit)\b/, /\b(filters?|bags?|belts?|covers?|liners?|baskets?|carafes?|jars?|blades?) (for|compatible)\b/,
  /\bcompatible with\b/, /\bfits? (models?|for)\b/, /\bkit for\b/, /\battachment\b/, /\badapter\b/, /\baccessor(y|ies)\b/,
  /\btools? kit\b/, /\bencl(osure|osures)\b/, /\bfilament\b/, /\b3d (printing )?pen\b/, /\bspool\b/, /\bline refill\b/,
  /\bshear (pins?|bolts?)\b/, /\brecoil\b/, /\bstarter (rope|assembly)\b/, /\bwheel kit\b/, /\bnozzle tips?\b/, /\bhose only\b/,
  /\b(bar|engine|chain) oil\b/, /\b\d+w-?\d+\b/, /\bchain only\b/, /\bparts?\b(?! per)/, /\bdrill bit\b/, /\bbit for\b/, /\bhand auger\b/,
  /\bonline store\b/, /\bstorefront\b/, /\bmanual (pump|push)\b/,
];
// Accessory words only count when they lead the title (e.g. "Replacement Filter ...", "Snow Blower Cover ...").
const LEADING = /^(\S+\s+){0,3}(covers?|filters?|bags?|mats?|cases?|sleeves?)\b/i;
export function isJunk(title = "") {
  const t = title.toLowerCase();
  return PHRASES.some((re) => re.test(t)) || LEADING.test(title);
}
