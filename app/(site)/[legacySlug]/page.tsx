import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { legacyLoaders, legacySlugs } from "@/data/legacy-registry";
import { LegacyArticlePage, type LegacyArticleModule } from "@/components/guide/LegacyArticlePage";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 86400;
export const dynamicParams = false;

type Props = { params: Promise<{ legacySlug: string }> };

export async function generateStaticParams() {
  return legacySlugs.map((legacySlug) => ({ legacySlug }));
}

async function load(slug: string) {
  const loader = legacyLoaders[slug];
  if (!loader) return null;
  const mod = (await loader()) as { default?: LegacyArticleModule };
  return (mod.default ?? mod) as LegacyArticleModule;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { legacySlug } = await params;
  const a = await load(legacySlug);
  if (!a) return {};
  return buildMetadata({ title: a.metaTitle, description: a.metaDescription, path: `/${a.slug}`, image: a.heroImage.src, type: "article" });
}

export default async function LegacyPage({ params }: Props) {
  const { legacySlug } = await params;
  const a = await load(legacySlug);
  if (!a) notFound();
  return <LegacyArticlePage article={a} />;
}
