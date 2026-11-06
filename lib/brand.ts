// ─── Central brand configuration ──────────────────────────────────────────────
export const BRAND_NAME = "MachineFanatic";
export const BRAND_TAGLINE = "Machines, rated by people who read the spec sheet.";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://www.machinefanatic.com";

export const SITE_DESCRIPTION =
  "Expert buying guides for power tools, outdoor power equipment, shop machines and kitchen machines. MachineFanatic compares motors, output, build and upkeep.";

export const CONTACT_EMAIL = "hello@machinefanatic.com";
export const SOCIAL_LINKS: { platform: string; url: string }[] = [];

// TODO: confirm the real Associates tag for machinefanatic.com before launch.
export const AMAZON_ASSOCIATE_TAG = "machinefanatic-20";

export const AUDIENCE_DESCRIPTION =
  "Homeowners, DIYers, makers and serious home cooks who want to understand what a machine actually does before buying it.";

export const CONTENT_PILLARS = [
  { label: "Power Tools", slug: "power-tools" },
  { label: "Outdoor Power", slug: "outdoor-power" },
  { label: "Shop & Garage", slug: "shop-garage" },
  { label: "Kitchen Machines", slug: "kitchen-machines" },
  { label: "Home Machines", slug: "home-machines" },
] as const;

// ─── MachineFanatic Machine Score methodology ───────────────────────────────
export const RATING_CRITERIA = [
  { label: "Performance and Output", weight: 30 },
  { label: "Build Quality and Durability", weight: 20 },
  { label: "Ergonomics and Control", weight: 15 },
  { label: "Maintenance and Serviceability", weight: 15 },
  { label: "Safety Features", weight: 10 },
  { label: "Value for Money", weight: 10 },
] as const;

export const DISCLOSURE_SHORT =
  "MachineFanatic is reader-supported. When you buy through links on our site, we may earn an affiliate commission at no additional cost to you.";

export const DISCLOSURE_FULL =
  "MachineFanatic participates in affiliate programs, including the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. When you click a product link and make a purchase, we may earn a small commission at no additional cost to you. Our recommendations are based on published specifications, manufacturer documentation and patterns in verified buyer feedback. Our editorial opinions are independent and are never influenced by affiliate relationships.";
