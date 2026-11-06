import type { LegacyArticleModule } from "@/components/guide/LegacyArticlePage";

const article: LegacyArticleModule = {
  slug: "ryobi-p516-vs-p517",
  title: "Ryobi P516 vs P517: Which 18V Reciprocating Saw Was Better?",
  metaTitle: "Ryobi P516 vs P517: Differences Explained",
  metaDescription:
    "Ryobi P516 vs P517 compared: speed, stroke, weight, brushless motor, orbital action and blade clamp, plus the current Ryobi 18V saws that replace both.",
  kicker: "Comparison",
  heroImage: {
    src: "/images/articles/dewalt-reciprocating-saw.webp",
    alt: "A cordless reciprocating saw with a long blade lying on a workbench",
  },
  lastUpdated: "2026-11-06",
  readTime: "17 min",
  quickAnswer:
    "The P517 is the better saw on paper: it is brushless, runs up to 3,200 strokes per minute against 2,900 on the P516, and adds an orbital cutting switch and a stay-open blade clamp. Both share the same 1-1/8 inch stroke and the same ONE+ 18V battery platform. Neither is a one-handed compact saw, and both are discontinued, so if you are buying new today you should look at the current Ryobi models listed below instead.",
  html: `
<p>Search for "ryobi p516 vs p517" and you will find a lot of used listings, old forum threads and very little that explains what actually separates the two saws. This article fills that gap. Both are older Ryobi ONE+ 18V reciprocating saws, both are discontinued, and both still turn up in garages, rental fleets and secondhand marketplaces. Which one you own, or are thinking about picking up cheaply, changes how the saw behaves in demolition, pruning and plumbing work more than the model numbers suggest.</p>

<p>We evaluated this comparison from Ryobi's own product pages, the P516 and P517 teardown and repair listings, and published reviews of the P517. Where sources disagreed we say so. Nothing here claims we ran the saws ourselves: it is a spec-sheet and owner-feedback analysis, written to help you choose between two older tools and understand what replaces them.</p>

<h2 id="at-a-glance">The two saws at a glance</h2>
<p>The P516 arrived in late 2016 as the standard brushed ONE+ reciprocating saw. The P517 followed in late 2017 as the brushless upgrade. They share a family resemblance, the same 18V battery pack interface and the same stroke length, but they are different machines inside. The table below summarizes the figures that are consistent across the sources we checked.</p>

<table>
<thead><tr><th>Feature</th><th>Ryobi P516</th><th>Ryobi P517</th></tr></thead>
<tbody>
<tr><td>Introduced</td><td>November 2016</td><td>Late 2017</td></tr>
<tr><td>Motor</td><td>Brushed (the brushless upgrade is the P517's headline change)</td><td>Brushless</td></tr>
<tr><td>No-load speed</td><td>0 to 2,900 SPM</td><td>0 to 3,200 SPM</td></tr>
<tr><td>Stroke length</td><td>1-1/8 in.</td><td>1-1/8 in.</td></tr>
<tr><td>Orbital action</td><td>Not listed</td><td>Yes, with an on/off selector</td></tr>
<tr><td>Blade clamp</td><td>Quick-release latch</td><td>Stay-open clamp for one-handed blade swaps</td></tr>
<tr><td>Anti-vibration handle</td><td>Yes</td><td>Yes (ANTI-VIBE handle with overmold grip)</td></tr>
<tr><td>Bare tool weight</td><td>About 5 lb</td><td>About 5.6 lb per Ryobi (a reviewer cites 5 lb 13 oz)</td></tr>
<tr><td>Battery</td><td>ONE+ 18V</td><td>ONE+ 18V</td></tr>
<tr><td>Status</td><td>Discontinued</td><td>Discontinued</td></tr>
</tbody>
</table>

<p>Two caveats on this table. First, the weight sources disagree slightly for the P517: Ryobi's support page lists 5.6 lb, while one published review quotes 5 lb 13 oz bare. Either way, the P517 is a few ounces heavier than the P516, and the number with a battery attached is what you feel in your hand, about 7 and a half pounds with a 4.0Ah pack according to that review. Second, the P516 listings we found do not call out a motor type outright. The brushless motor is the defining step up in the P517, which is why we describe the P516 as a brushed saw.</p>

<figure><img src="/images/articles/milwaukee-reciprocating-saw.webp" alt="A cordless reciprocating saw with an orange and black body standing upright on a table" width="1050" height="1400" loading="lazy" /><figcaption>A generic cordless reciprocating saw. Both Ryobi models follow the same basic layout: motor and gearbox at the front, pistol grip at the rear, battery underneath.</figcaption></figure>

<h2 id="how-recip-saws-work">How a reciprocating saw works, and why SPM and stroke matter</h2>
<p>A reciprocating saw drives a short, stiff blade back and forth along its own length. Inside the nose, a gearbox turns the motor's rotation into linear motion, and the blade is gripped by a clamp that must hold tight under heavy shock. Two numbers describe the cutting action: strokes per minute (SPM) and stroke length.</p>
<p>SPM is the number of back and forth cycles each minute. More strokes means more teeth passing through the cut, which generally means faster cutting in wood and plastic. Stroke length is how far the blade travels on each cycle. A longer stroke clears chips better and takes a bigger bite per pass, but it also makes the saw buck harder in the hands. Manufacturers pair the two: a long stroke with moderate SPM suits demolition, a short stroke with high SPM suits finer, more controlled cutting.</p>
<p>Both Ryobi saws use a 1-1/8 inch stroke. That is a mid-length stroke, shorter than the 1-1/4 inch used by Ryobi's newest brushless saw and well short of the 1-1/2 inch strokes found on some corded demolition saws. In practice, the only speed difference between our two saws is the SPM ceiling: 2,900 on the P516 versus 3,200 on the P517. That is roughly a ten percent gain, which is real but modest. Where the P517 pulls away is how it holds speed under load, which is a motor question rather than a spec-sheet number.</p>

<h2 id="brushed-vs-brushless">Brushed versus brushless: the real difference</h2>
<p>A brushed motor transfers current to the spinning rotor through carbon brushes that rub against a commutator. This is simple and cheap, but the brushes wear, create friction and heat, and waste some battery energy. A brushless motor replaces the brushes with an electronic controller that switches current in the stator windings, so the rotor is driven magnetically with no sliding contacts.</p>
<p>For a reciprocating saw, the practical effects of going brushless are as follows.</p>
<ul>
<li><strong>Runtime:</strong> less wasted energy means more cuts from the same battery. Reciprocating saws pull a lot of current when the blade binds, so efficiency gains matter here more than in a drill.</li>
<li><strong>Load response:</strong> the electronics can sense load and deliver more current when the blade bogs. A brushed saw tends to slow noticeably in thick lumber or when the blade is pinched.</li>
<li><strong>Heat and lifespan:</strong> no brushes to wear out, and less heat building up in the motor housing. On a tool that vibrates hard and gets used in dusty conditions, that is a durability advantage.</li>
<li><strong>Cost and repair:</strong> the brushless saw was the more expensive model at launch, and its controller board is a part that a brushed saw simply does not have. For most owners this never matters, but it is a consideration if you plan to open the tool for repairs.</li>
</ul>
<p>The upshot: the P517's brushless motor is the main reason to prefer it. If you do occasional light work, the difference may not justify seeking out the newer saw. If you cut for hours at a time, it will.</p>

<h2 id="orbital-action">Orbital action: the feature the P516 lacks</h2>
<p>Orbital action makes the blade move slightly up and forward on the cutting stroke, then pull back clear of the cut on the return stroke. The effect is that each tooth takes a more aggressive bite, so cutting is faster in wood, and the blade is less likely to drag on the return. The trade-off is a rougher cut surface and slightly more vibration, which is why every saw with an orbital setting also gives you a way to turn it off.</p>
<p>The P517 has an orbital selector with an easy on/off switch. Our sources for the P516 do not list orbital action, so treat it as a straight-cutting saw. This is a larger practical difference than the 300 SPM gap. In framing lumber, green wood, pruning and rough demolition, orbital mode noticeably speeds up the cut. In metal pipe, sheet metal and plastic, you leave it off for a smoother, less grabby cut.</p>
<div class="mf-callout"><p><strong>Rule of thumb:</strong> orbital on for wood and rough cuts, orbital off for metal, thin material and anything where finish matters.</p></div>

<h2 id="blade-clamp">Blade clamp and blade changes</h2>
<p>Blade changes are the most frequent interaction you have with a reciprocating saw, and a poor clamp makes the whole tool feel cheap. The P516 has a quick-release latch, which lets you swap blades without a tool, but the sources we found do not describe it in detail. The P517 specifically advertises a stay-open clamp that allows quick, one-handed blade changes.</p>
<p>A stay-open clamp holds the chuck in the released position after you lift the lever, which frees your hand to guide the new blade into the slot. Without it, you hold the lever with one hand and the blade with the other, which is awkward if you are on a ladder or holding the work. For anyone who swaps between wood, metal and pruning blades on one job, this convenience adds up.</p>
<p>Blade compatibility is the same across both: both accept standard universal-shank reciprocating blades, so you are not locked into Ryobi blades on either model.</p>

<h2 id="weight-and-handling">Weight, balance and vibration</h2>
<p>On paper the two saws are close in weight, roughly 5 to 5.6 lb bare. The difference you feel is the battery. A compact 1.5Ah or 2.0Ah pack keeps either saw balanced and light, while a 4.0Ah pack adds noticeable heft toward the rear. One reviewer who ran the P517 one-handed noted that it feels like a lot of weight out at the end of your arm, which is a fair warning: neither of these is a one-handed saw despite what the stay-open clamp implies.</p>
<p>Both saws include an anti-vibration handle with a rubber overmold. This helps in two ways: it reduces hand fatigue over long cuts, and it dampens the chatter that transfers from blade to hand when you hit a nail in a stud. Neither saw is a vibration-free machine, and a brushless motor does not change the mechanical vibration produced by a reciprocating blade. Orbital mode on the P517 slightly increases perceived vibration when it is switched on, so the comfort gain from the handle can be partly offset in aggressive wood cutting.</p>
<figure><img src="/images/articles/dewalt-reciprocating-saw.webp" alt="A cordless reciprocating saw with a long blade lying on a workbench" width="1400" height="937" loading="lazy" /><figcaption>A generic cordless reciprocating saw on a workbench. Balance and battery size decide how tiring one of these is over a long cut.</figcaption></figure>

<h2 id="who-should-pick-which">Who should pick which</h2>
<h3>Pick the P516 if</h3>
<ul>
<li>You already own ONE+ batteries and want the lowest-cost entry to a recip saw for occasional jobs: cutting overgrown branches, trimming PVC, cutting through the odd nail.</li>
<li>You find one at a very low secondhand price and understand it is a brushed, no-orbital tool.</li>
<li>You prioritize lighter weight and are fine with slower, straight-line cutting.</li>
</ul>
<h3>Pick the P517 if</h3>
<ul>
<li>You do repeated cutting: demolition, renovation, pruning or plumbing work where runtime and speed matter.</li>
<li>You want orbital action for fast wood cuts with the option to turn it off for metal.</li>
<li>You change blades often and want the stay-open clamp.</li>
</ul>
<h3>Skip both if</h3>
<p>You need a compact saw for overhead or tight-space work, or you want modern features like an LED light. Both older saws lack a built-in work light in the specs we found, and neither is built for one-handed operation. That is where the current Ryobi lineup below comes in.</p>

<h2 id="discontinued">Both are discontinued: what to know before buying used</h2>
<p>Ryobi has retired both models, so any purchase is secondhand or leftover stock. A few things to check:</p>
<ul>
<li><strong>Battery compatibility:</strong> all ONE+ 18V batteries work with both saws, so a used tool-only unit is easy to power if you already have packs.</li>
<li><strong>Blade clamp condition:</strong> check that the clamp holds a blade tight with no wobble. A worn clamp is the most common fault on any used recip saw.</li>
<li><strong>Shoe and gearbox play:</strong> grip the blade and try to move it side to side with the saw off. A small amount of play is normal, but heavy slop signals a worn gearbox.</li>
<li><strong>Parts availability:</strong> repair guides and parts diagrams exist for both models, and the shoes, brushes (P516) and clamps are common wear parts.</li>
<li><strong>No warranty:</strong> a used saw typically carries no remaining manufacturer warranty, which weakens the value argument for the older tools.</li>
</ul>

<h2 id="current-equivalents">The current Ryobi equivalents</h2>
<p>Ryobi's present 18V reciprocating saw lineup covers the same ground, and in most cases covers it better. These are the models we would look at today.</p>

<h3>The straight replacement for the P516: PCL515</h3>
<p>The standard ONE+ 18V reciprocating saw sold today is the PCL515 family. The tool-only version is listed at 3,400 SPM with a 1 inch stroke length and variable speed. The higher SPM and shorter stroke put it on the finer, faster side of the P516's 2,900 SPM and 1-1/8 inch stroke. The kit version includes a 4.0Ah battery and charger, a wood blade and a quick-release blade lever, and is listed at over 145 cuts per charge.</p>
<!--product:ryobi-pcl515b-->
<!--product:ryobi-pcl515k-->

<h3>The straight replacement for the P517: ONE+ HP brushless Gen II</h3>
<p>The closest spiritual successor to the P517 is the ONE+ HP 18V brushless reciprocating saw, now in its second generation. Ryobi lists a speed range of 0 to 3,200 SPM, the same ceiling as the P517, but with a longer 1-1/4 inch stroke. Features that the P517 lacked include a built-in LED work light, a pivoting non-marring shoe and a rafter hook. It also keeps a tool-free blade release lever and a rubber overmold grip.</p>
<!--product:ryobi-hp-gen2-->

<h3>The compact option the P516 and P517 never offered: PSBRS01B</h3>
<p>If the idea of a one-handed saw appealed to you, the ONE+ HP brushless compact one-handed reciprocating saw is the one that genuinely delivers it. It runs up to 3,000 strokes per minute from a brushless motor, with a rapid blade change system. The compact body is designed for overhead work and tight spaces, such as cutting pipe between joists or trimming inside a wall cavity. Its shorter reach and lower power make it a complement to a full-size recip saw rather than a replacement for demolition work.</p>
<!--product:ryobi-psbrs01b-->

<h2 id="comparison-today">Old versus new: a quick comparison</h2>
<table>
<thead><tr><th>Need</th><th>Old saw</th><th>Current equivalent</th><th>What improves</th></tr></thead>
<tbody>
<tr><td>Budget, occasional use</td><td>P516 (0 to 2,900 SPM, 1-1/8 in.)</td><td>PCL515 (3,400 SPM, 1 in.)</td><td>Faster blade speed, new warranty, kit available with battery</td></tr>
<tr><td>Serious cutting, runtime</td><td>P517 (0 to 3,200 SPM, 1-1/8 in., brushless)</td><td>ONE+ HP Gen II (0 to 3,200 SPM, 1-1/4 in., brushless)</td><td>Longer stroke, LED light, pivoting shoe, rafter hook</td></tr>
<tr><td>Tight spaces, overhead</td><td>None</td><td>PSBRS01B (up to 3,000 SPM, one-handed)</td><td>Genuinely compact one-hand body</td></tr>
</tbody>
</table>

<h2 id="blade-choice">Blade choice matters more than the saw</h2>
<p>A common mistake with either model is blaming the saw for what is really a blade problem. The tooth count and blade length drive cutting speed far more than a 300 SPM difference.</p>
<ul>
<li><strong>Wood and demolition:</strong> coarse teeth (around 5 to 6 teeth per inch) clear chips fast. Use a longer blade for deep cuts and a shorter one for control.</li>
<li><strong>Nail-embedded wood:</strong> a bi-metal demolition blade handles the occasional nail without losing teeth.</li>
<li><strong>Metal pipe and sheet:</strong> fine teeth (14 to 24 per inch) for thin material, switching to fewer teeth for thick steel. Turn orbital off on the P517.</li>
<li><strong>Pruning:</strong> a dedicated pruning blade with wide, aggressive teeth turns either saw into a capable branch cutter.</li>
</ul>
<p>Keep the shoe pressed firmly against the work. A reciprocating saw cut with the shoe floating away from the surface chatters, wears the blade and is the most common cause of a wandering cut.</p>

<h2 id="things-competitors-miss">Three things most comparisons miss</h2>
<h3>1. The P517 is not the one-handed saw</h3>
<p>Because the P517 pairs a stay-open clamp with "one-handed blade changes" in its marketing, some buyers assume it is a compact one-handed saw. It is not. It is a full-size saw with a pistol grip and a forward handle zone, and a reviewer who tried one-handed cutting found it front-heavy. The truly compact Ryobi recip saw is the PSBRS01B, a different product line.</p>
<h3>2. Stroke length is shrinking on the cheap end, growing on the premium end</h3>
<p>The old pair shared a 1-1/8 inch stroke. Today's budget PCL515 has a 1 inch stroke at a higher SPM, while the premium HP Gen II has a 1-1/4 inch stroke. That split matters: the budget saw is quicker but takes smaller bites, the premium saw takes bigger bites per stroke. If you want the old P517 feel back, the HP Gen II is the closer match.</p>
<h3>3. A battery upgrade changes the old saws more than the saw swap does</h3>
<p>If you own a P516 and your problem is short runtime, a larger ONE+ battery may fix it for far less than a new saw. If your problem is that the saw bogs in thick material or runs hot, that is the motor, and brushless is the real answer.</p>

<h2 id="faq">Frequently Asked Questions</h2>
<h3>Is the Ryobi P517 better than the P516?</h3>
<p>On specifications, yes. It has a brushless motor, a higher top speed of 3,200 SPM, an orbital cutting switch and a stay-open blade clamp, while keeping the same 1-1/8 inch stroke. The P516 is the lighter, simpler, cheaper saw. For repeated or heavy cutting the P517 is the better choice.</p>
<h3>Do the P516 and P517 use the same battery?</h3>
<p>Yes. Both are Ryobi ONE+ 18V tools and accept the same family of ONE+ batteries and chargers. A pack that runs one will run the other, and will also work in the current Ryobi saws listed above.</p>
<h3>Is the Ryobi P517 a one-handed reciprocating saw?</h3>
<p>No. The P517 has a stay-open blade clamp that makes changing blades one-handed, but the saw itself is a full-size model that is best used with two hands. For a genuinely compact one-handed saw, look at the current ONE+ HP brushless compact one-handed model.</p>
<h3>Are the Ryobi P516 and P517 still made?</h3>
<p>No. Both are discontinued. You may still find them as secondhand or old-stock tools, but Ryobi now sells newer models, including the PCL515 and the ONE+ HP brushless Gen II.</p>
<h3>What is the stroke length of the Ryobi P516 and P517?</h3>
<p>Both have a 1-1/8 inch stroke. That is the same figure on both spec sheets, so the difference in cutting performance comes from the motor, speed and orbital action rather than from stroke length.</p>
<h3>Which current Ryobi saw replaces the P517?</h3>
<p>The ONE+ HP 18V brushless reciprocating saw (Gen II) is the closest match. It keeps the 3,200 SPM ceiling, lengthens the stroke to 1-1/4 inch, and adds an LED work light, a pivoting shoe and a rafter hook.</p>
<h3>Can I cut metal with these saws?</h3>
<p>Yes, with the correct blade. Use a fine-tooth bi-metal blade for pipe and sheet metal, run the saw at a moderate speed, and on the P517 switch orbital action off to get a cleaner, less grabby cut. For heavier steel work, a corded or higher-output saw is a better tool.</p>

<h2 id="verdict">Bottom line</h2>
<p>If you are choosing strictly between the two old saws, the P517 is the better tool: brushless, faster, with orbital action and a better blade clamp. The P516 only makes sense as a very cheap, light, occasional-use saw. But since both are discontinued, the smarter move for most buyers is to skip the used market and pick a current model: the PCL515 for light budget work, the ONE+ HP Gen II when you want the P517's capability with a better feature set, and the compact one-handed PSBRS01B when space and overhead reach matter more than raw cutting power.</p>
<p>If you are comparing cordless cutting tools more broadly, see our guide to the <a href="/best-cordless-circular-saw">best cordless circular saws</a>, browse more in <a href="/categories/power-tools">power tools</a>, and read how we assess machines on the <a href="/how-we-review">how we review</a> page. If you are weighing bigger shop machines, our <a href="/dewalt-780-vs-festool-kapex">DeWalt DWS780 vs Festool Kapex</a> comparison covers the stationary side. Articles on this site are written by <a href="/author/james-miller">James Miller</a>.</p>
`,
  products: [
    {
      id: "ryobi-pcl515b",
      name: "Ryobi ONE+ 18V Cordless Reciprocating Saw PCL515B (tool only)",
      imageUrl: "https://m.media-amazon.com/images/I/31nQlZ87qRL._SL500_.jpg",
      amazonUrl: "https://www.amazon.com/dp/B0B88R7HWB?tag=machinefanatic-20",
      label: "Closest current match to the P516",
      why: "Listed at 3,400 SPM with a 1 inch stroke and variable speed trigger. Bare tool, so bring your own ONE+ battery.",
    },
    {
      id: "ryobi-pcl515k",
      name: "Ryobi ONE+ 18V Reciprocating Saw Kit with 4.0 Ah Battery and Charger",
      imageUrl: "https://m.media-amazon.com/images/I/31azmJy8FKL._SL500_.jpg",
      amazonUrl: "https://www.amazon.com/dp/B0CJS13541?tag=machinefanatic-20",
      label: "Best for new ONE+ owners",
      why: "Includes the saw, a 4.0 Ah battery, a charger and a wood blade. A tool-free blade release lever is listed.",
    },
    {
      id: "ryobi-hp-gen2",
      name: "Ryobi ONE+ HP 18V Brushless Reciprocating Saw Gen II (tool only)",
      imageUrl: "https://m.media-amazon.com/images/I/31HeGEW89LL._SL500_.jpg",
      amazonUrl: "https://www.amazon.com/dp/B0FP3Z9LFB?tag=machinefanatic-20",
      label: "Best P517 successor",
      why: "Brushless, 0 to 3,200 SPM with a 1-1/4 inch stroke. Adds an LED work light, a pivoting shoe and a rafter hook.",
    },
    {
      id: "ryobi-psbrs01b",
      name: "Ryobi ONE+ HP 18V Brushless Compact One-Handed Reciprocating Saw PSBRS01B (tool only)",
      imageUrl: "https://m.media-amazon.com/images/I/31PbuK6GpQL._SL500_.jpg",
      amazonUrl: "https://www.amazon.com/dp/B08RP9BDLY?tag=machinefanatic-20",
      label: "Best for tight spaces and overhead",
      why: "A genuinely compact one-handed brushless saw rated up to 3,000 strokes per minute. A good second saw next to a full-size model.",
    },
  ],
  imageCredits: [
    {
      image: "Cordless reciprocating saw (hero and workbench photo)",
      author: "Charles & Hudson",
      license: "CC BY-SA 2.0",
      source: "https://commons.wikimedia.org/wiki/File:DeWalt_Reciprocating_Saw_(5073128275).jpg",
    },
    {
      image: "Cordless reciprocating saw standing upright",
      author: "Eunosfire986",
      license: "CC0",
      source: "https://commons.wikimedia.org/wiki/File:Milwaukee_Reciprocating_Saw.jpg",
    },
  ],
  relatedLinks: [
    { title: "Best cordless circular saws", href: "/best-cordless-circular-saw" },
    { title: "DeWalt DWS780 vs Festool Kapex", href: "/dewalt-780-vs-festool-kapex" },
    { title: "Power tools", href: "/categories/power-tools" },
    { title: "How we review", href: "/how-we-review" },
  ],
};

export default article;
