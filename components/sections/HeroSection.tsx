import Link from "next/link";
import Image from "next/image";
import { getPublicHomepageSettings } from "@/lib/public-settings";
import type { HomepageSettings } from "@/lib/site-settings-store";
import { HeroSearch } from "@/components/sections/HeroSearch";
import { heroChipLinks } from "@/lib/amazon-links";

interface Props {
  settings?: HomepageSettings;
}

// Shown on the hero rating card whenever there's no real per-product score
// data to display yet — describes the methodology, not a fabricated number.
const WHAT_WE_MEASURE = [
  "Ease of Use",
  "Clear Controls",
  "Simple Setup",
  "Long-Term Value",
];

export async function HeroSection({ settings: propSettings }: Props = {}) {
  const settings = propSettings ?? await getPublicHomepageSettings();
  const hero = settings.hero;

  return (
    <section className="relative overflow-hidden bg-primary" style={{ backgroundColor: "#17324D" }}>
      {/* Hero background image — priority for LCP */}
      <Image
        src="/worthrated-hero-02-kitchen-living.webp"
        alt="An independent, active adult using an easy-to-operate home product in a bright kitchen"
        fill
        priority
        fetchPriority="high"
        className="object-cover object-right"
        sizes="100vw"
      />
      {/* Overlay to keep text readable over the photo */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(115deg, rgba(23,50,77,0.94) 0%, rgba(23,50,77,0.82) 45%, rgba(23,50,77,0.55) 75%, rgba(23,50,77,0.35) 100%)" }} aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-28">
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_380px] gap-10 lg:gap-12 items-start lg:items-center">

          {/* ── Left column ── */}
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <span className="w-6 h-0.5 rounded-full" style={{ background: "#E6A04B" }} aria-hidden="true" />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#E6A04B" }}>
                {hero.eyebrow || "Independent buying guides for easier living"}
              </span>
            </div>

            <h1
              className="font-extrabold leading-[1.08] tracking-tight mb-5"
              style={{ color: "#ffffff" }}
            >
              {hero.headline || "Products that make everyday life simpler."}
              {hero.headlineAccent && (
                <span style={{ color: "#DDEBE5" }}> {hero.headlineAccent}</span>
              )}
            </h1>

            <p className="text-lg leading-relaxed mb-8 max-w-xl" style={{ color: "rgba(247,243,234,0.88)" }}>
              {hero.subtitle ||
                "We compare ease of use, setup, controls and long-term value to help you choose with confidence."}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link prefetch={false}
                href={hero.primaryCtaHref || "/categories"}
                className="inline-flex items-center gap-2 px-6 py-3.5 font-semibold rounded-btn text-sm transition-all"
                style={{ background: "#2F7D78", color: "#ffffff" }}
              >
                {hero.primaryCtaText || "Explore Our Top Picks"}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
                </svg>
              </Link>
              <Link prefetch={false}
                href={hero.secondaryCtaHref || "/how-we-review"}
                className="inline-flex items-center gap-2 px-6 py-3.5 font-semibold rounded-btn text-sm transition-all"
                style={{ background: "rgba(247,243,234,0.12)", color: "#ffffff", border: "1px solid rgba(247,243,234,0.28)" }}
              >
                {hero.secondaryCtaText || "How We Rate"}
              </Link>
            </div>

            <div className="mb-8">
              <HeroSearch placeholder={hero.searchPlaceholder || "Search products, guides, categories…"} />
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs mr-1 shrink-0" style={{ color: "rgba(247,243,234,0.60)" }}>Shop on Amazon:</span>
              {heroChipLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="nofollow sponsored noopener noreferrer"
                  className="text-xs px-3 py-2.5 rounded-badge font-medium transition-all min-h-[44px] flex items-center"
                  style={{ background: "rgba(247,243,234,0.11)", color: "rgba(247,243,234,0.85)", border: "1px solid rgba(247,243,234,0.18)" }}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <p className="text-sm font-medium" style={{ color: "rgba(247,243,234,0.65)" }}>
              Clear criteria · Practical recommendations · Reader-first research
            </p>
          </div>

          {/* ── Right column - Rating card ── */}
          <div className="block w-full lg:w-auto mt-2 lg:mt-0">
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: "rgba(247,243,234,0.10)", border: "1px solid rgba(247,243,234,0.20)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
            >
              <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(247,243,234,0.14)" }}>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(247,243,234,0.95)" }}>
                  What We Measure
                </span>
              </div>

              {WHAT_WE_MEASURE.map((item) => (
                <div key={item} className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(247,243,234,0.08)" }}>
                  <span
                    className="w-6 h-6 rounded-full text-[13px] font-bold flex items-center justify-center shrink-0"
                    style={{ background: "rgba(230,160,75,0.85)", color: "#17324D" }}
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  <p className="text-sm font-semibold leading-snug" style={{ color: "rgba(247,243,234,0.96)" }}>{item}</p>
                </div>
              ))}

              <div className="px-5 py-3.5" style={{ background: "rgba(247,243,234,0.05)" }}>
                <Link prefetch={false} href="/how-we-review" className="text-xs font-semibold flex items-center justify-between group transition-colors" style={{ color: "#DDEBE5" }}>
                  See our full rating method
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
                  </svg>
                </Link>
              </div>
            </div>
            <p className="text-xs mt-3 text-center" style={{ color: "rgba(247,243,234,0.55)" }}>
              Every guide is scored against the same published criteria
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
