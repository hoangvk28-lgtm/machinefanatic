export interface Category {
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  icon: string;
  color: string;
  subcategories: string[];
}

export const categories: Category[] = [
  {
    slug: "power-tools",
    name: "Power Tools",
    description:
      "Drills, impact drivers, saws, sanders, grinders and routers, compared on motor type, torque, battery platform and the build details that decide whether a tool lasts a decade or a season.",
    shortDescription: "Drills, saws, sanders and the batteries that run them.",
    icon: "Power",
    color: "#E8590C",
    subcategories: [],
  },
  {
    slug: "outdoor-power",
    name: "Outdoor Power",
    description:
      "Mowers, trimmers, blowers, chainsaws, tillers, snow blowers and pressure washers, rated on real output figures, engine or battery design, and what ownership actually costs.",
    shortDescription: "Mowers, blowers, chainsaws, washers and snow machines.",
    icon: "Outdoor",
    color: "#1F2933",
    subcategories: [],
  },
  {
    slug: "shop-garage",
    name: "Shop & Garage",
    description:
      "Air compressors, welders, generators, power stations, bench tools and shop vacuums, explained in terms of duty cycle, CFM, running watts and the numbers that matter in a working garage.",
    shortDescription: "Compressors, welders, generators and bench machines.",
    icon: "Shop",
    color: "#E8590C",
    subcategories: [],
  },
  {
    slug: "kitchen-machines",
    name: "Kitchen Machines",
    description:
      "Espresso machines, stand mixers, blenders, food processors, juicers and countertop appliances, judged on motor power, build materials and how the machine holds up to daily use.",
    shortDescription: "Espresso machines, mixers, blenders and processors.",
    icon: "Kitchen",
    color: "#1F2933",
    subcategories: [],
  },
  {
    slug: "home-machines",
    name: "Home Machines",
    description:
      "Vacuums, robot cleaners, sewing machines, dehumidifiers, air purifiers, washers and the other machines that keep a house running, compared on output, efficiency and upkeep.",
    shortDescription: "Vacuums, sewing machines, air and laundry machines.",
    icon: "Home",
    color: "#E8590C",
    subcategories: [],
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
