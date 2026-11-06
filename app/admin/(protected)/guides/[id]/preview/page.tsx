import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { AffiliateDisclosureBar } from "@/components/affiliate/AffiliateDisclosureBar";
import { RichContent } from "@/components/ui/RichContent";
import { TableOfContents } from "@/components/ui/TableOfContents";
import { getGuideById } from "@/lib/guides-store";
import type { GuideProductPick } from "@/lib/guides-store";
import { buildMetadata } from "@/lib/seo";
import { scoreToColor } from "@/lib/utils";
import { processGuideContent } from "@/lib/toc";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const guide = await getGuideById(id).catch(() => null);
  return buildMetadata({
    title: guide ? `PREVIEW: ${guide.title}` : "Guide Preview",
    description: "Admin preview, not published.",
    path: `/admin/guides/${id}/preview`,
    noIndex: true,
  });
}

export default async function GuidePreviewPage({ params }: PageProps) {
  const { id } = await params;

  let guide;
  try {
    guide = await getGuideById(id);
  } catch {
    return (
      <div className="p-8 text-red-600 text-sm">Could not load guide, Supabase may not be configured.</div>
    );
  }
  if (!guide) notFound();

  const { toc, processedBodies } = processGuideContent(
    guide.sections.map((s) => ({ heading: s.heading ?? "", body: s.body ?? "" }))
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Preview banner */}
      <div className="bg-amber-400 text-amber-900 text-sm font-semibold text-center px-4 py-2.5 flex items-center justify-center gap-3">
        <span>PREVIEW, This guide is {guide.status === "published" ? "published" : "not published"} (status: {guide.status})</span>
        <Link prefetch={false} href={`/admin/guides/${id}/edit`}
          className="underline text-amber-800 hover:text-amber-950 transition-colors">
          ← Back to Edit
        </Link>
      </div>

      <Container>
        <div className="max-w-3xl mx-auto py-10">
          {/* Header */}
          <div className="mb-6">
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-blue-600 mb-2">
              {guide.categorySlug}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3">{guide.title}</h1>
            <p className="text-gray-600 text-base leading-relaxed">{guide.description}</p>
            <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
              <span>{guide.author}</span>
              <span>·</span>
              <span>{guide.readTime}</span>
              <span>·</span>
              <span>{guide.lastUpdated}</span>
            </div>
          </div>

          {/* Hero image */}
          {guide.heroImage && (
            <div className="relative w-full aspect-[16/7] rounded-xl overflow-hidden mb-6">
              <Image
                src={guide.heroImage}
                alt={guide.heroImageAlt || guide.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          )}

          {/* Affiliate disclosure */}
          <AffiliateDisclosureBar />

          {/* Table of Contents */}
          {toc.length >= 2 && <TableOfContents items={toc} />}

          {/* Intro */}
          {guide.intro && (
            <div className="mb-6 text-gray-700 leading-relaxed">
              <RichContent html={guide.intro} />
            </div>
          )}

          {/* Product Picks (inline) */}
          {guide.productPicks && guide.productPicks.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Our Top Picks</h2>

              {/* At-a-glance table */}
              <div className="rounded-xl border border-gray-200 overflow-hidden mb-8">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Pick</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700 hidden sm:table-cell">Badge</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700 hidden sm:table-cell">Price Tier</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {guide.productPicks.map((pick) => (
                      <tr key={pick.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-900">{pick.name}</td>
                        <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{pick.badge || ", "}</td>
                        <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{pick.priceLabel}</td>
                        <td className="px-4 py-3">
                          {pick.fitScore != null ? (
                            <span className={`font-bold text-sm ${scoreToColor(pick.fitScore)}`}>
                              {pick.fitScore.toFixed(1)}
                            </span>
                          ) : ", "}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Detailed pick cards */}
              {guide.productPicks.map((pick, idx) => (
                <PickCard key={pick.id} pick={pick} rank={idx + 1} />
              ))}
            </div>
          )}

          {/* Content sections */}
          {guide.sections.map((section, idx) => (
            <div key={idx} className="mb-8">
              {section.heading && (
                <h2 className="text-xl font-bold text-gray-900 mb-3">{section.heading}</h2>
              )}
              {section.body && <RichContent html={processedBodies[idx] ?? section.body} />}
            </div>
          ))}

          {/* FAQ */}
          {guide.faq && guide.faq.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold text-gray-900 mb-4">FAQ</h2>
              <div className="flex flex-col gap-4">
                {guide.faq.map((item, idx) => (
                  <div key={idx} className="rounded-lg border border-gray-200 p-4">
                    <p className="font-semibold text-gray-900 mb-1.5">{item.question}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

// ── Pick Card Component ────────────────────────────────────────────────────────

function PickCard({ pick, rank }: { pick: GuideProductPick; rank: number }) {
  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden mb-6">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="sm:w-52 bg-gray-50 flex items-center justify-center p-4 shrink-0">
          {pick.imageUrl ? (
            <div className="relative w-36 h-36">
              <Image
                src={pick.imageUrl}
                alt={pick.name}
                fill
                className="object-contain"
                sizes="144px"
              />
            </div>
          ) : (
            <div className="w-36 h-36 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">No image</div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 p-5">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs font-bold text-gray-400">#{rank}</span>
            {pick.badge && (
              <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                {pick.badge}
              </span>
            )}
            <span className="text-xs text-gray-500">{pick.priceLabel}</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">{pick.name}</h3>
          {pick.brand && <p className="text-sm text-gray-500 mb-2">{pick.brand}</p>}

          {pick.fitScore != null && (
            <div className="mb-2">
              <span className="text-xs text-gray-500">Machine Score: </span>
              <span className={`font-bold ${scoreToColor(pick.fitScore)}`}>{pick.fitScore.toFixed(1)}/10</span>
            </div>
          )}

          <p className="text-sm text-gray-700 leading-relaxed mb-3">{pick.summary}</p>

          {pick.whyItWins && (
            <p className="text-sm text-gray-600 italic mb-3">&ldquo;{pick.whyItWins}&rdquo;</p>
          )}

          <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-4">
            {pick.bestFor && <span><strong>Best for:</strong> {pick.bestFor}</span>}
            {pick.skipIf && <span><strong>Skip if:</strong> {pick.skipIf}</span>}
          </div>

          {/* Specs */}
          {pick.specs && pick.specs.length > 0 && (
            <div className="grid grid-cols-2 gap-1 mb-4">
              {pick.specs.map((spec, i) => (
                <div key={i} className="text-xs">
                  <span className="text-gray-500">{spec.label}: </span>
                  <span className="font-medium text-gray-700">{spec.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Pros / Cons */}
          {(pick.pros?.length > 0 || pick.cons?.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {pick.pros?.length > 0 && (
                <ul className="text-xs text-green-700 space-y-1">
                  {pick.pros.map((p, i) => <li key={i} className="flex gap-1"><span>+</span><span>{p}</span></li>)}
                </ul>
              )}
              {pick.cons?.length > 0 && (
                <ul className="text-xs text-red-600 space-y-1">
                  {pick.cons.map((c, i) => <li key={i} className="flex gap-1"><span>−</span><span>{c}</span></li>)}
                </ul>
              )}
            </div>
          )}

          {/* CTA */}
          {pick.affiliateUrl && (
            <a
              href={pick.affiliateUrl}
              rel="nofollow sponsored noopener noreferrer"
              target="_blank"
              className="inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              {pick.ctaLabel || "Check price on Amazon"}
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
