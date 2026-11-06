const TAG = "machinefanatic-20";

export const amazonSearchLinks: Record<string, string> = {
  "kitchen-machines":  `https://www.amazon.com/s?k=easy+to+use+kitchen+appliances+for+seniors&tag=${TAG}`,
  "home-machines": `https://www.amazon.com/s?k=lightweight+vacuum+for+seniors&tag=${TAG}`,
  "shop-garage":   `https://www.amazon.com/s?k=simple+easy+to+use+phone+for+seniors&tag=${TAG}`,
  "outdoor-power":   `https://www.amazon.com/s?k=lightweight+garden+tools+for+seniors&tag=${TAG}`,
};

export const heroChipLinks = [
  { label: "Kitchen Machines",  href: amazonSearchLinks["kitchen-machines"] },
  { label: "Home Machines", href: amazonSearchLinks["home-machines"] },
  { label: "Shop & Garage",   href: amazonSearchLinks["shop-garage"] },
  { label: "Outdoor Power", href: amazonSearchLinks["outdoor-power"] },
];
