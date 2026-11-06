import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { buildMetadata } from "@/lib/seo";
import { getPublicGuides } from "@/lib/public-guides";
import { categories } from "@/data/categories";

export const revalidate = 604800;

export const metadata: Metadata = buildMetadata({
  title: "All Buying Guides",
  description:
    "Every MachineFanatic buying guide in one place, organized by category: Power Tools, Outdoor Power, Shop & Garage, Kitchen Machines and Home Machines.",
  path: "/guide/all",
});

export default async function AllGuidesPage() {
  const guides = await getPublicGuides();
  const totalGuides = guides.length;

  const guidesByCategory = categories
    .map((cat) => ({
      category: cat,
      guides: guides
        .filter((g) => g.categorySlug === cat.slug)
        .sort((a, b) => a.title.localeCompare(b.title)),
    }))
    .filter((c) => c.guides.length > 0);

  return (
    <Container className="py-14">
      <nav className="flex items-center gap-1.5 text-xs text-ink-muted mb-6">
        <Link prefetch={false} href="/" className="hover:text-brand transition-colors">Home</Link>
        <span>/</span>
        <Link prefetch={false} href="/guide" className="hover:text-brand transition-colors">Buying Guides</Link>
        <span>/</span>
        <span className="text-ink">All Guides</span>
      </nav>

      <div className="mb-10 max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-widest text-brand">Buying Guides</span>
        <h1 className="text-4xl font-bold text-ink mt-3 mb-4 tracking-tight">All Buying Guides</h1>
        <p className="text-lg text-ink-secondary leading-relaxed">
          Every guide we&apos;ve published, {totalGuides} in total, organized by category. Jump to a
          section below or use your browser&apos;s find-on-page to search by product name.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-12">
        {guidesByCategory.map(({ category, guides: catGuides }) => (
          <a
            key={category.slug}
            href={`#${category.slug}`}
            className="text-xs font-medium px-3 py-1.5 rounded-badge bg-white border border-border text-ink-secondary hover:border-brand hover:text-brand transition-all"
          >
            {category.name} ({catGuides.length})
          </a>
        ))}
      </div>

      <div className="space-y-14">
        {guidesByCategory.map(({ category, guides: catGuides }) => (
          <section key={category.slug} id={category.slug} className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white text-xs font-bold"
                style={{ backgroundColor: category.color }}
                aria-hidden="true"
              >
                {category.name.charAt(0)}
              </div>
              <h2 className="text-2xl font-bold text-ink tracking-tight">{category.name}</h2>
              <span className="text-xs text-ink-muted">{catGuides.length} guides</span>
            </div>
            <p className="text-sm text-ink-secondary max-w-2xl mb-6">{category.shortDescription}</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
              {catGuides.map((guide) => (
                <li key={guide.slug}>
                  <Link prefetch={false}
                    href={`/guide/${guide.slug}`}
                    className="text-sm text-ink-secondary hover:text-brand transition-colors leading-relaxed"
                  >
                    {guide.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Container>
  );
}
