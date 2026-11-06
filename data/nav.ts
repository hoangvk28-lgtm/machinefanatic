export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
}

export const mainNav: NavItem[] = [
  { label: "Power Tools", href: "/categories/power-tools" },
  { label: "Outdoor Power", href: "/categories/outdoor-power" },
  { label: "Shop & Garage", href: "/categories/shop-garage" },
  { label: "Kitchen Machines", href: "/categories/kitchen-machines" },
  { label: "Home Machines", href: "/categories/home-machines" },
  { label: "How We Rate", href: "/how-we-review" },
];

export const footerNav = {
  categories: [
    { label: "Power Tools", href: "/categories/power-tools" },
    { label: "Outdoor Power", href: "/categories/outdoor-power" },
    { label: "Shop & Garage", href: "/categories/shop-garage" },
    { label: "Kitchen Machines", href: "/categories/kitchen-machines" },
    { label: "Home Machines", href: "/categories/home-machines" },
  ],
  company: [
    { label: "How We Rate", href: "/how-we-review" },
    { label: "About", href: "/about-us" },
    { label: "Compare Machines", href: "/compare" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
    { label: "Terms of Use", href: "/terms-of-use" },
  ],
};
