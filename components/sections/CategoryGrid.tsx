import Link from "next/link";
import { categories } from "@/data/categories";
import { guides } from "@/data/guides";
import { SectionHeader } from "./SectionHeader";
import { amazonSearchLinks } from "@/lib/amazon-links";

const iconMap: Record<string, React.ReactNode> = {
  Kitchen: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7.5h16M4 7.5c0-1.657 3.582-3 8-3s8 1.343 8 3M4 7.5v9c0 1.657 3.582 3 8 3s8-1.343 8-3v-9M12 12v4.5" />
    </svg>
  ),
  Cleaning: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 3 6 12l4 4-9 5 5-9 4 4 9-9-4-4Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 3.5 20.5 9.5" />
    </svg>
  ),
  Tech: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <rect x="7" y="2.5" width="10" height="19" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 18.5h2" />
    </svg>
  ),
  Garden: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c0-6 4-8 4-13a4 4 0 0 0-8 0c0 5 4 7 4 13Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 13c-3-1-5-3-5-6" />
    </svg>
  ),
};

export function CategoryGrid() {
  return (
    <section className="py-14">
      <SectionHeader
        eyebrow="Browse by Topic"
        title="What would you like to make easier?"
        description="Four focused areas covering everyday products that matter most."
        href="/categories"
        hrefLabel="All categories"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const guideCount = guides.filter((g) => g.categorySlug === cat.slug).length;
          const subcategoryCount = cat.subcategories?.length ?? 0;

          return (
            <div
              key={cat.slug}
              className="group flex flex-col gap-3 p-5 bg-white rounded-card border border-border border-t-4 border-t-transparent min-w-0 hover:shadow-card-hover hover:border-transparent hover:translate-y-[-2px] transition-all"
              style={{ borderTopColor: cat.color }}
            >
              <Link prefetch={false} href={`/categories/${cat.slug}`} className="flex flex-col gap-3 focus-ring rounded-lg">
                {/* Icon */}
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-lg text-white transition-transform group-hover:scale-110"
                  style={{ backgroundColor: cat.color }}
                  aria-hidden="true"
                >
                  {iconMap[cat.icon]}
                </div>

                {/* Name + description */}
                <div>
                  <h3 className="font-bold text-ink group-hover:text-brand transition-colors text-sm leading-snug">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-ink-secondary mt-1 leading-relaxed line-clamp-2">
                    {cat.shortDescription}
                  </p>
                </div>

                {/* Guide count */}
                <div className="flex items-center gap-1 text-xs text-ink-muted">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                  </svg>
                  {guideCount} {guideCount === 1 ? "guide" : "guides"}
                </div>
              </Link>

              {/* Amazon CTA — sibling of the Link, not nested inside it (avoids invalid <a> inside <a>) */}
              {amazonSearchLinks[cat.slug] && (
                <a
                  href={amazonSearchLinks[cat.slug]}
                  target="_blank"
                  rel="nofollow sponsored noopener noreferrer"
                  className="mt-auto flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all hover:opacity-80"
                  style={{ background: cat.color + "15", color: cat.color, border: `1px solid ${cat.color}30` }}
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.26 18.36C9.18 20.34 4.76 21.38 1 20.16c-.38-.13-.33-.44.08-.35 3.47.67 7.77-.07 10.6-1.82.47-.27.87.17.58.37zm1.06-1.17c-.43-.56-2.85-.27-3.94-.13-.33.04-.38-.25-.08-.46 1.93-1.36 5.1-.97 5.47-.51.37.46-.1 3.63-1.91 5.14-.28.23-.54.11-.42-.2.41-.98 1.32-3.28.88-3.84z"/><path d="M16.93 3.3c-.96-1.23-1.88-2.26-1.88-4.56 0-.59-.37-1.09-.96-1.09-.47 0-.79.28-.95.68-.29.72-.11 1.65.26 2.46.43.96 1.12 1.85 1.62 2.67.48.79.73 1.55.73 2.37 0 1.28-.5 2.1-1.34 2.86-.28.25-.06.62.27.47 1.87-.85 2.97-2.45 2.25-5.86zm-2.88 6.07c-.08 0-.16-.01-.23-.02-1.04-.15-2.09-.57-2.96-1.22-.65-.48-1.2-1.1-1.54-1.82-.31-.66-.45-1.42-.26-2.13.19-.7.71-1.28 1.43-1.53.26-.09.53-.14.8-.14 1.14 0 2.18.63 2.78 1.64.44.73.58 1.59.39 2.41-.19.82-.7 1.49-1.41 1.81z"/>
                  </svg>
                  Shop {cat.name} on Amazon
                </a>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
