// Shared accessory/part detector for compact.mjs and prefilter.mjs (keep them in sync by importing this).
// Phrase-based on purpose: single words like "filter", "oil" or "cover" appear in real machine titles
// ("True HEPA Filter", "Oil-Free Air Fryer"), so only accessory phrasing counts as junk.
const PHRASES = [
  /\breplacement\b/, /\bspare\b/, /\bblades? (set|for|kit)\b/, /\b(filters?|bags?|belts?|covers?|liners?|baskets?|carafes?|jars?|blades?) (for|compatible)\b/,
  /\bfits? (models?|for)\b/, /\bkit for\b/, /\battachment\b/, /\baccessor(y|ies)\b/,
  /\btools? kit\b/, /\bencl(osure|osures)\b/, /\bfilament\b/, /\b3d (printing )?pen\b/, /\bspool\b/, /\bline refill\b/,
  /\bshear (pins?|bolts?)\b/, /\brecoil\b/, /\bstarter (rope|assembly)\b/, /\bwheel kit\b/, /\bnozzle tips?\b/, /\bhose only\b/,
  /\b(bar|engine|chain) oil\b/, /\b\d+w-?\d+\b/, /\bchain only\b/, /\bparts?\b(?! per)/, /\bdrill bit\b/, /\bbit for\b/, /\bhand auger\b/,
  /\bonline store\b/, /\bstorefront\b/, /\bmanual (pump|push)\b/,
  // grills, smokers, griddles, pizza ovens (popmech gap rounds 16 and 17)
  /\b(grill|smoker|griddle|bbq|barbecue|oven) covers?\b/, /\bcovers? for (grill|smoker|griddle)/,
  /\bwood (chips?|chunks?)\b/, /\bpellets? for (smoker|grill)\b/, /\bcharcoal briquettes?\b/, /\blump charcoal\b/,
  /\b(wood|hardwood|bbq|grilling|smoking|smoker|apple|hickory|mesquite|cherry|oak|competition) pellets?\b(?!\s+(grill|smoker|stove))/,
  /\bgriddle stands?\b/, /\bgrill tables?\b/, /\bhinged lids?\b/, /\blids? for\b/, /\b(griddle|grill) pans?\b/,
  /\bstove ?tops?\b/, /\bgriddle plate\b/, /\bsmoker tubes?\b/, /\bsmoke generators?\b/, /\bcookbook\b/, /\bgaskets?\b/, /\bsmok(e|ing) infusers?\b/,
  /\bsmoking gun\b/, /\bcocktail smoker\b/, /\bblend pellets?\b/, /\bpellets?,? \d+ ?-? ?(lb|pound)\b/,
  /\bpizza (stones?|peels?|cutters?|screens?)\b/, /\bmeat thermometers?\b/, /\bgrill thermometers?\b/,
  /\bgrill (grates?|brush(es)?|mats?|baskets?|lights?|gloves?|racks?|tools?|presses?|scrapers?)\b/,
  /\bgriddle (press|scrapers?|spatulas?|tool kit)\b/, /\bheat (plates?|tents?|deflectors?)\b/,
  /\bdrip (pans?|trays?)\b/, /\brotisserie kit\b/, /\bsmoker box\b/, /\bgrill(ing)? (mat|mats|apron)\b/,
  /\bbbq (tools?|utensils?|gloves?|mats?) (set|kit)\b/, /\bskewers?\b/, /\bbasting brush\b/,
  /\bburner (tubes?|replacement)\b/, /\bigniter kit\b/, /\bpropane (tank|hose|regulator|adapter)\b/,
];
// Accessory words only count when they lead the title (e.g. "Replacement Filter ...", "Snow Blower Cover ...").
const LEADING = /^(\S+\s+){0,3}(covers?|filters?|bags?|mats?|cases?|sleeves?)\b/i;
// Soft terms that are accessory phrasing in most categories but normal wording on a real machine:
// car power inverters are sold as "DC 12V to 110V Car Plug Adapter Outlet" and "Compatible with Tesla",
// so these two only count as junk when the title is not itself an inverter or power station.
const SOFT = [/\badapter\b/, /\bcompatible with\b/];
const MACHINE = /\b(inverters?|power stations?)\b/;
export function isJunk(title = "") {
  const t = title.toLowerCase();
  if (PHRASES.some((re) => re.test(t)) || LEADING.test(title)) return true;
  return !MACHINE.test(t) && SOFT.some((re) => re.test(t));
}
