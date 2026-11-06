import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";
import { categories } from "@/data/categories";
import { getPublicGuidesByCategory } from "@/lib/public-guides";
import { getPublicProductsForCategoryHub } from "@/lib/public-products";

export const revalidate = 604800;

export const metadata: Metadata = buildMetadata({
  title: "All Categories | MachineFanatic",
  description:
    "Browse all MachineFanatic categories: Power Tools, Outdoor Power, Shop & Garage, Kitchen Machines and Home Machines. Find the right machine buying guide.",
  path: "/categories",
});

const CATEGORY_ICONS: Record<string, string> = {
  "power-tools": "🛠️",
  "outdoor-power": "🌲",
  "shop-garage": "🔧",
  "kitchen-machines": "🔪",
  "home-machines": "🏠",
};

export default async function CategoriesPage() {
  const categoryStats = await Promise.all(
    categories.map(async (cat) => {
      const [guides, products] = await Promise.all([
        getPublicGuidesByCategory(cat.slug),
        getPublicProductsForCategoryHub(cat),
      ]);
      return { slug: cat.slug, guideCount: guides.length, productCount: products.length };
    })
  );
  const statsBySlug = new Map(categoryStats.map((s) => [s.slug, s]));

  return (
    <Container className="py-12">
      <Breadcrumbs
        crumbs={[{ label: "Categories", href: "/categories" }]}
      />

      <div className="mt-6 mb-10 max-w-2xl">
        <h1 className="text-4xl font-bold text-ink tracking-tight mb-3">All Categories</h1>
        <p className="text-ink-secondary leading-relaxed text-lg">
          Browse buying guides by category. Each one compares products on ease of use, setup, controls, and long-term value.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const stats = statsBySlug.get(cat.slug);
          const icon = CATEGORY_ICONS[cat.slug] ?? "📋";
          return (
            <Link prefetch={false}
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="group flex flex-col gap-4 p-6 bg-white rounded-card border border-border hover:border-brand/40 hover:shadow-card-hover transition-all"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: `${cat.color}18` }}
                >
                  {icon}
                </div>
                <div>
                  <h2 className="font-bold text-ink text-base group-hover:text-brand transition-colors">
                    {cat.name}
                  </h2>
                </div>
              </div>

              <p className="text-sm text-ink-secondary leading-relaxed flex-1">
                {cat.shortDescription}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-xs text-ink-muted">
                  {stats?.guideCount ?? 0} {stats?.guideCount === 1 ? "guide" : "guides"}
                  {stats && stats.productCount > 0 ? ` · ${stats.productCount} products` : ""}
                </span>
                <span className="text-xs font-semibold text-brand group-hover:text-brand-dark transition-colors">
                  Browse &rarr;
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </Container>
  );
}
