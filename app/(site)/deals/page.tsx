import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { DealsProductCard } from "@/components/product/DealsProductCard";
import { AffiliateDisclosureBar } from "@/components/affiliate/AffiliateDisclosureBar";
import { buildMetadata } from "@/lib/seo";
import { getPublicProducts } from "@/lib/public-products";
import { getPublicDeals } from "@/lib/public-deals";
import { getFeaturedPublicGuides } from "@/lib/public-guides";
import { amazonSearchLinks } from "@/lib/amazon-links";

const exploreChips = [
  { label: "Kitchen Machines", key: "kitchen-machines" },
  { label: "Home Machines", key: "home-machines" },
  { label: "Shop & Garage", key: "shop-garage" },
  { label: "Outdoor Power", key: "outdoor-power" },
];

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Amazon Finds - Budget-Friendly Easy-to-Use Picks",
  description:
    "Budget-friendly Amazon products for easy kitchen, easy cleaning, simple tech, and garden & yard. Curated for value, scored on real criteria, not sponsored placement.",
  path: "/deals",
});

// ─── Price parsing helper ───────────────────────────────────────────────────────
// priceRange format: "$10–$14"  →  lower bound as number
function lowerPrice(priceRange: string): number {
  const match = priceRange.match(/\$(\d+)/);
  return match ? parseInt(match[1], 10) : 999;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function DealsPage() {
  const [products, dbDeals, featuredGuides] = await Promise.all([
    getPublicProducts(),
    getPublicDeals(),
    getFeaturedPublicGuides(6),
  ]);

  // Top value picks: valueForMoney >= 9.3, sorted by that score
  const topValuePicks = [...products]
    .filter((p) => p.scores.valueForMoney >= 9.3)
    .sort((a, b) => b.scores.valueForMoney - a.scores.valueForMoney);

  // Budget under ~$30: lower price bound < 30, sorted by overall
  const budgetPicks = [...products]
    .filter((p) => lowerPrice(p.priceRange) < 30)
    .sort((a, b) => b.scores.overall - a.scores.overall);

  // Kitchen Machines finds
  const kitchenPicks = [...products]
    .filter((p) => p.categorySlug === "kitchen-machines")
    .sort((a, b) => b.scores.overall - a.scores.overall);

  // Home Machines finds
  const cleaningPicks = [...products]
    .filter((p) => p.categorySlug === "home-machines")
    .sort((a, b) => b.scores.overall - a.scores.overall);

  // Outdoor Power finds
  const gardenPicks = [...products]
    .filter((p) => p.categorySlug === "outdoor-power")
    .sort((a, b) => b.scores.overall - a.scores.overall);

  // Deals from DB: only active deals that have a linked product; fallback to topValuePicks
  const dealProducts = dbDeals.length > 0
    ? dbDeals.filter((d) => d.product).map((d) => d.product!)
    : topValuePicks.slice(0, 4);
  return (
    <>
      <Container className="py-14">
        {/* ── Page header ── */}
        <div className="max-w-2xl mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-brand">Amazon Picks</span>
          <h1 className="text-4xl font-bold text-ink mt-2 mb-3 tracking-tight">
            Machine Deals Worth a Look
          </h1>
          <p className="text-ink-secondary leading-relaxed text-lg">
            Budget-friendly picks for easy kitchen, easy cleaning, simple tech, and garden &amp; yard - curated by value score, not sponsored rank. All prices are approximate ranges; check Amazon for current pricing.
          </p>
        </div>

        {/* Disclosure */}
        <div className="mb-8 p-4 bg-bg rounded-lg border border-border text-sm text-ink-muted leading-relaxed">
          <strong className="text-ink">Affiliate disclosure:</strong> We may earn a commission when you buy through our Amazon links at no extra cost to you. Prices and availability change on Amazon - always check the current listing before purchasing. We do not receive payment for product placement.
        </div>

        {/* Jump nav */}
        <div className="flex flex-wrap gap-2 mb-10">
          {[
            { href: "#featured-deals", label: "Editor's picks" },
            { href: "#top-value", label: "Top value" },
            { href: "#budget", label: "Under ~$30" },
            { href: "#kitchen", label: "Easy kitchen" },
            { href: "#cleaning", label: "Easy cleaning" },
            { href: "#garden", label: "Garden & yard" },
            { href: "#guides", label: "Buying guides" },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="px-3.5 py-2 rounded-full border border-border bg-white text-ink-secondary text-sm font-medium hover:border-brand hover:text-brand transition-colors min-h-[2.25rem] inline-flex items-center"
            >
              {label}
            </a>
          ))}
        </div>

        {/* ── Section: Featured Deals (from DB) ── */}
        {dealProducts.length > 0 && (
          <section id="featured-deals" className="mb-16 scroll-mt-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-brand" aria-hidden="true" />
                  <span className="text-xs font-bold uppercase tracking-widest text-brand">Editor&apos;s Picks</span>
                </div>
                <h2 className="text-2xl font-bold text-ink tracking-tight">Current Curated Picks</h2>
                <p className="text-sm text-ink-secondary mt-1 max-w-lg leading-relaxed">
                  Hand-selected products worth checking on Amazon right now - scored and verified, not sponsored.
                </p>
              </div>
              <p className="text-xs text-ink-muted shrink-0">All prices approximate · Check Amazon</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {dealProducts.map((product) => (
                <DealsProductCard key={product.id} product={product} />
              ))}
            </div>
            <p className="mt-3 text-xs text-ink-muted">
              Prices and availability may vary. Always check Amazon for the current price before purchasing.
            </p>
          </section>
        )}

        {/* ── Section: Top value picks ── */}
        <ProductSection
          id="top-value"
          eyebrow="Top Picks"
          heading="Highest Value for Money"
          description="Products that score 9.3 or higher on our value-for-money criteria - these deliver the most capability per dollar among everything we've evaluated."
          products={topValuePicks}
          disclaimer="Value scores reflect our editorial assessment. Check current Amazon pricing before purchasing."
        />

        {/* ── Section: Budget under $30 ── */}
        <ProductSection
          id="budget"
          eyebrow="Budget Finds"
          heading="Worth Checking - Often Under $30"
          description="Picks where the lower end of the typical price range falls under $30. Actual prices vary - these are often available at affordable prices but check Amazon for the current amount."
          products={budgetPicks}
          disclaimer="Price ranges are approximate. Actual Amazon prices fluctuate - always check the listing."
        />

        {/* ── Section: Kitchen Machines finds ── */}
        <ProductSection
          id="kitchen"
          eyebrow="Kitchen Machines"
          heading="Kitchen Machines Finds"
          description="Appliances and gadgets with clear controls and simple daily use - picked for anyone who wants a kitchen tool without a learning curve."
          products={kitchenPicks}
        />

        {/* ── Section: Home Machines ── */}
        <ProductSection
          id="cleaning"
          eyebrow="Home Machines"
          heading="Home Machines Finds"
          description="Lightweight, low-maintenance tools that make cleaning less of a chore, without sacrificing real cleaning power."
          products={cleaningPicks}
        />

        {/* ── Section: Outdoor Power ── */}
        <ProductSection
          id="garden"
          eyebrow="Outdoor Power"
          heading="Outdoor Power Finds"
          description="Comfortable, manageable tools for the garden and yard - picked for good handling and easy setup, not just raw power."
          products={gardenPicks}
        />

        {/* ── Tips box ── */}
        <div className="my-14 p-6 bg-white rounded-card border border-border">
          <h2 className="font-bold text-ink text-lg mb-4">Tips for Getting the Best Price on Amazon</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-ink-secondary leading-relaxed">
            <div>
              <p className="font-semibold text-ink mb-1">Check price history</p>
              <p>Use a free tool like CamelCamelCamel to see whether today&apos;s price is close to the historical low before buying.</p>
            </div>
            <div>
              <p className="font-semibold text-ink mb-1">Look for clippable coupons</p>
              <p>Many products have an optional coupon on the product page - look for a &quot;Save X% with coupon&quot; checkbox before checkout.</p>
            </div>
            <div>
              <p className="font-semibold text-ink mb-1">Prime Day &amp; Seasonal Sales</p>
              <p>Home and outdoor products often see their deepest discounts during Prime Day (July) and end-of-season clearance windows.</p>
            </div>
          </div>
        </div>

        {/* ── Related buying guides ── */}
        <section id="guides">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-brand">Buying Guides</span>
            <h2 className="text-2xl font-bold text-ink mt-1 mb-2 tracking-tight">
              Not Sure What to Buy? Read a Guide First
            </h2>
            <p className="text-sm text-ink-secondary max-w-xl">
              Our buying guides compare every product in a category side-by-side - with use-case advice, a comparison table, and a clear top recommendation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredGuides.map((guide) => (
              <Link prefetch={false}
                key={guide.slug}
                href={`/guide/${guide.slug}`}
                className="group flex flex-col gap-2 p-4 rounded-card border border-border bg-white hover:border-brand/40 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-brand">Guide</span>
                  <span className="text-xs text-ink-muted">{guide.readTime}</span>
                </div>
                <h3 className="font-semibold text-ink text-sm leading-snug group-hover:text-brand transition-colors line-clamp-2">
                  {guide.title}
                </h3>
                <p className="text-xs text-ink-secondary leading-relaxed line-clamp-2 flex-1">
                  {guide.description}
                </p>
                <span className="text-xs font-semibold text-brand group-hover:text-brand-dark transition-colors mt-1">
                  Read guide →
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link prefetch={false}
              href="/guide"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
            >
              View all buying guides →
            </Link>
          </div>
        </section>

        {/* Explore More on Amazon */}
        <section className="mt-14">
          <h2 className="text-lg font-bold text-ink mb-4 tracking-tight">Explore More on Amazon</h2>
          <div className="flex flex-wrap gap-2">
            {exploreChips.map((chip) => (
              <a
                key={chip.key}
                href={amazonSearchLinks[chip.key]}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium bg-white border border-border text-ink-secondary hover:border-brand hover:text-brand hover:bg-brand-light transition-all min-h-[44px]"
              >
                <svg className="w-3.5 h-3.5 shrink-0 opacity-60" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.26 18.36C9.18 20.34 4.76 21.38 1 20.16c-.38-.13-.33-.44.08-.35 3.47.67 7.77-.07 10.6-1.82.47-.27.87.17.58.37zm1.06-1.17c-.43-.56-2.85-.27-3.94-.13-.33.04-.38-.25-.08-.46 1.93-1.36 5.1-.97 5.47-.51.37.46-.1 3.63-1.91 5.14-.28.23-.54.11-.42-.2.41-.98 1.32-3.28.88-3.84z"/>
                </svg>
                {chip.label}
              </a>
            ))}
          </div>
        </section>

        {/* Bottom disclosure */}
        <AffiliateDisclosureBar variant="banner" className="mt-12" />
      </Container>
    </>
  );
}

// ─── Section component ────────────────────────────────────────────────────────

interface ProductSectionProps {
  id: string;
  eyebrow: string;
  heading: string;
  description: string;
  products: ReturnType<typeof Array.prototype.slice>;
  disclaimer?: string;
}

function ProductSection({ id, eyebrow, heading, description, products: sectionProducts, disclaimer }: ProductSectionProps) {
  if (sectionProducts.length === 0) return null;

  return (
    <section id={id} className="mb-16 scroll-mt-6">
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-brand">{eyebrow}</span>
        <h2 className="text-2xl font-bold text-ink mt-1 mb-2 tracking-tight">{heading}</h2>
        <p className="text-sm text-ink-secondary max-w-2xl leading-relaxed">{description}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {sectionProducts.map((product: import("@/data/products").Product) => (
          <DealsProductCard key={product.id} product={product} />
        ))}
      </div>

      {disclaimer && (
        <p className="mt-3 text-xs text-ink-muted italic">{disclaimer}</p>
      )}
    </section>
  );
}

