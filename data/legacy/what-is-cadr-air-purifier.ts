import type { LegacyArticleModule } from "@/components/guide/LegacyArticlePage";

const article: LegacyArticleModule = {
  slug: "what-is-cadr-air-purifier",
  title: "What is CADR on an air purifier and how to use it",
  metaTitle: "What Is CADR on an Air Purifier?",
  metaDescription: "CADR is the clean air delivery rate, reported for smoke, dust and pollen. Learn what the three numbers mean and how to match them to your room.",
  kicker: "Explainer",
  heroImage: { src: "/images/articles/purifier-levoit-core300.webp", alt: "Cylindrical air purifier standing on a wooden table" },
  lastUpdated: "2026-11-16",
  readTime: "14 min",
  quickAnswer: "CADR stands for clean air delivery rate. It describes how much particle-free air a purifier delivers, tested separately for smoke, dust and pollen, with a higher number meaning faster cleaning of that particle size. It measures particles only, not gases or odors, and it is a lab figure measured on the unit's top fan setting.",
  html: `<h2 id="three-numbers-on-the-box">Three numbers on the box</h2>
<p>Open the packaging of a mid-range air purifier and you will often find three numbers in a row, each with a small label: smoke, dust, pollen. They look like a score for three different filters. They are not. They are three results from a single standardized test, and understanding what they stand for turns a confusing sticker into a useful shortcut.</p>
<p>Most buyers skip the stickers and pick by price or by a "covers up to" room size. That works until two machines claim similar coverage but behave very differently in a real room. CADR is the figure that lets you compare them fairly, if you know its limits.</p>

<h2 id="definition">What CADR actually stands for</h2>
<p>CADR is short for clean air delivery rate. It is a performance measure developed by the Association of Home Appliance Manufacturers, or AHAM, and it is expressed in cubic feet per minute. It answers a specific question: how quickly does this machine remove particles of a defined size from the air of a test room, compared with what would happen if the machine were not there?</p>
<p>That last part is important. The test accounts for natural settling of particles. The reported number reflects what the purifier adds on top of nature, not the total removal. It is a rate of clean air delivered, which is why it is expressed in the same units as airflow.</p>

<h2 id="the-three-particle-types">Smoke, dust and pollen</h2>
<p>The three ratings correspond to three particle size ranges. Smoke represents the smallest particles, dust is in the middle and pollen is the largest of the three.</p>
<figure><img src="/images/articles/purifier-levoit-lvh133.webp" alt="Tall air purifier standing beside an armchair in a living room" width="1400" height="1400" loading="lazy" /><figcaption>The three numbers describe smoke, dust and pollen, which differ enough in size that one figure could not cover them.</figcaption></figure>
<table>
<thead><tr><th>Rating</th><th>Particle size range</th><th>What it stands in for</th></tr></thead>
<tbody>
<tr><td>Smoke</td><td>Smallest</td><td>Tobacco smoke, cooking smoke, fine combustion particles</td></tr>
<tr><td>Dust</td><td>Middle</td><td>Household dust, some pet dander fragments</td></tr>
<tr><td>Pollen</td><td>Largest</td><td>Pollen grains, larger allergens</td></tr>
</tbody>
</table>
<p>Because large particles are easier for a filter to catch, pollen numbers are often the highest on the sticker, and smoke numbers are often the lowest. The gap between them is informative. A machine with strong smoke CADR is handling the small particles well, which is the hardest job.</p>

<h2 id="how-test-works">How the test works</h2>
<p>AHAM tests a purifier in a sealed chamber. A known quantity of one particle type is released, the machine runs on its highest fan setting, and sensors track how fast the concentration falls. The measured decay is compared with the natural decay observed without the machine, and the difference gives the delivery rate.</p>
<p>Two things follow from that setup. First, the number is measured at maximum fan speed, which is also the loudest setting. Second, it is measured in a controlled chamber with steady air, so real rooms, with furniture and drafts, will vary. Treat CADR as a fair comparison between machines, not as a guarantee of the result in your living room.</p>

<h2 id="what-cadr-does-not-measure">What CADR does not measure</h2>
<p>CADR covers particles. It says nothing about gases, volatile organic compounds, odors or smell. A purifier with a very high smoke CADR may still do nothing for the odor of fresh paint or cooking fumes, because those need an adsorbent such as activated carbon. See our guide to <a href="/activated-carbon-and-voc-filtration">carbon filters and VOC removal</a> for that side of the story.</p>
<p>CADR also does not describe filter life, noise, energy use or the quality of the filter seal. A machine can post a strong number when new and lose performance as the filter loads. And it does not measure whether the unit leaks air around the filter, though a leaky design would likely show up as a weaker result.</p>
<div class="mf-callout"><strong>Remember:</strong> CADR is about particles at the maximum fan setting. It is not a measure of odor removal, filter life or quiet operation.</div>

<h2 id="using-the-number-for-room-size">Turning CADR into room coverage</h2>
<p>The most useful application of CADR is matching a machine to a room. A common rule of thumb cited by AHAM links the smoke CADR to the room's floor area for a standard ceiling height: a purifier whose smoke CADR is about two thirds of the floor area in square feet will, in theory, provide enough cleaning for that space. The rule assumes a typical ceiling height, so tall rooms need more.</p>
<p>That rule is a starting point and not a legal standard. The deeper concept, air changes per hour, is covered in <a href="/air-purifier-room-size-and-air-changes">our room size article</a>. There we explain how to convert a CADR into how often a room's air passes through the purifier.</p>

<h2 id="a-simple-illustration">A simple illustration</h2>
<p>The following numbers are illustrative, chosen only to show the arithmetic. Say a room is 200 square feet and you want a purifier whose smoke CADR is around two thirds of that figure, roughly 130 cubic feet per minute. A machine with a smoke CADR well above that has headroom, and one well below it will struggle to keep up.</p>
<p>The same logic applies at any scale. Find your floor area, take about two thirds of it as a smoke CADR target, then add a margin if the ceiling is high, the room is smoky, or someone is sensitive to particles. If you also run the machine at a lower speed for quiet, remember that the lower speed delivers less than the number on the box.</p>

<h2 id="which-of-the-three-to-use">Which of the three numbers matters most</h2>
<p>Use the number that matches your concern, but lean on smoke when you are unsure. Smoke particles are the smallest of the three, so a high smoke rating suggests the machine handles small particles effectively, and that is the hardest case.</p>
<ul>
<li><strong>Wildfire smoke or cooking smoke:</strong> look at the smoke CADR first.</li>
<li><strong>General household dust:</strong> use the dust CADR.</li>
<li><strong>Seasonal pollen:</strong> pollen CADR is usually high on most machines, so it rarely limits your choice.</li>
<li><strong>Pets and allergies:</strong> check dust and smoke, since dander has a range of sizes.</li>
</ul>

<h2 id="unlabeled-cadr">Machines with no CADR on the box</h2>
<p>Not every purifier carries an AHAM-verified CADR. Some manufacturers publish their own airflow figures or use proprietary methods. A listing that quotes "cubic feet per minute" without naming a test is not the same as an AHAM-verified number. Without a standard behind it, a figure cannot be compared across brands.</p>
<p>That does not make an unlabeled product bad. It just means you are comparing a rating with a claim. If you have a choice between a verified CADR and an unexplained number, the verified one gives you firmer ground. When you read a roundup such as the <a href="/guide/best-air-purifiers">best air purifiers guide</a>, check whether the listed figures are verified or manufacturer-stated.</p>

<h2 id="fan-speed-and-noise">Fan speed, noise and real use</h2>
<p>Because CADR is measured at top speed, running a machine at a lower setting reduces its delivery. Most people do exactly that, since the maximum setting is loud. This is a quiet reason that a machine with a bigger CADR is often the better pick: a larger unit running slowly can deliver the same cleaning as a smaller unit running flat out, with less noise.</p>
<figure><img src="/images/articles/purifier-control-panel.webp" alt="Control panel of an air purifier showing its fan speed buttons" width="1400" height="1867" loading="lazy" /><figcaption>The rating belongs to the highest fan speed. Run it quieter and the delivery rate drops with it.</figcaption></figure>
<p>Look at the manufacturer's noise figure at a low or medium setting, and compare it against the CADR you need. A model that can meet your CADR target on a medium setting is more pleasant to live with than one that needs its top speed to cover the room.</p>

<h2 id="filters-and-cadr-decay">Filters, seal and performance over time</h2>
<p>A new filter gives the best result. As it loads with particles, airflow drops, and so does delivery. How fast that happens depends on the filter size, the air you live in and how often the unit runs. If you live with smoke, construction dust or pets, filters load faster.</p>
<p>Check the manufacturer's recommended replacement interval and the cost of replacement filters before you buy. A machine that posts a strong number but needs frequent expensive filters may not be the best value. Our <a href="/guide/best-hepa-air-purifiers">best HEPA air purifiers guide</a> lists models with filter options worth comparing.</p>

<h2 id="common-mistakes">Common mistakes when using CADR</h2>
<ul>
<li>Treating the three numbers as three filters instead of three test results.</li>
<li>Buying on a "covers up to" claim without checking the CADR behind it.</li>
<li>Ignoring ceiling height when matching to room area.</li>
<li>Assuming a high CADR also means odor removal.</li>
<li>Running the machine on low and expecting top-speed performance.</li>
<li>Comparing a verified AHAM number with a self-reported figure as if they were equal.</li>
</ul>

<h2 id="why-particle-size-matters">Why particle size changes the difficulty</h2>
<p>Particles behave differently depending on their size. Large particles such as pollen are heavy enough to settle out of still air on their own and are easy for a filter to intercept because they cannot squeeze through the fiber gaps. Very small particles, including the fine fraction of smoke, drift for hours, follow the airflow and are harder to trap.</p>
<p>Filters capture particles by several mechanisms at once: impact on the fibers, interception as a particle brushes past a fiber, and diffusion, where tiny particles wander randomly until they hit one. Each mechanism works best in a different size range, which is why a filter's weakest point is usually in the middle of the size spectrum. You do not need to memorize the physics, but it explains why three separate scores exist and why a single "removes 99 percent" claim, without a size, tells you very little.</p>

<h2 id="reading-a-spec-sheet">Reading a purifier spec sheet around the number</h2>
<p>CADR is one line among several, and the others change what the number means in daily use.</p>
<table>
<thead><tr><th>Spec</th><th>Why it matters alongside CADR</th></tr></thead>
<tbody>
<tr><td>Noise at each fan speed</td><td>Shows whether you can run the CADR you need without disturbing sleep</td></tr>
<tr><td>Filter type and size</td><td>Larger filter area tends to hold performance longer as it loads</td></tr>
<tr><td>Filter replacement interval</td><td>Determines running cost and how long the rated delivery lasts</td></tr>
<tr><td>Power draw</td><td>A unit running all day adds to the electricity bill</td></tr>
<tr><td>Intake and exhaust layout</td><td>360 degree intake can pull from a whole room, front intake wants a clear wall</td></tr>
<tr><td>Auto mode and sensors</td><td>Can lower speed when air is clean, which saves noise and energy</td></tr>
</tbody>
</table>
<p>Sensors deserve a caution. Built-in particle sensors give a useful trend, but they are not calibrated instruments, and their readings can differ from a separate monitor. Use them as a guide to whether the air is getting better, not as an exact measurement.</p>

<h2 id="smoke-events">When smoke is the real problem</h2>
<p>During a wildfire event or after cooking with a lot of smoke, small particles dominate the air. In those conditions the smoke CADR is the number that predicts how quickly the machine can pull the concentration down. A bigger machine, or two machines, running on a moderate setting will usually beat a small machine screaming at maximum.</p>
<p>It also helps to close windows and doors so the purifier is cleaning the air already inside, not fighting a constant inflow from outside. If you are choosing a purifier mainly for smoke, shortlist models with a high smoke rating and check the noise at a medium setting, since you may run it for many hours.</p>

<h2 id="placement">Placement affects what you get from the number</h2>
<p>A purifier cleans the air it can draw in. If you tuck it behind a couch or in a corner with its intake against a wall, it recirculates a small pocket of air and the rest of the room improves slowly. Leave open space around the machine as the manual suggests and keep intakes clear.</p>
<figure><img src="/images/articles/purifier-in-room.webp" alt="Tall cylindrical air purifier standing beside a window" width="1400" height="1050" loading="lazy" /><figcaption>A machine boxed in by furniture cannot move its rated volume of air, whatever the box claims.</figcaption></figure>
<p>Place it where you spend the most time, such as the bedroom at night, rather than in a hallway. Closing the door of a bedroom purifier room helps it reach a good air quality quickly, since it only has to treat that volume.</p>

<h2 id="how-to-shop-with-cadr">A short shopping routine using CADR</h2>
<ol>
<li>Measure the room's floor area and note an unusually high ceiling.</li>
<li>Take about two thirds of the area as a smoke CADR target, then add a margin for tall rooms or heavy smoke.</li>
<li>Shortlist models that meet that number on a speed you are happy to run.</li>
<li>Check whether the number is AHAM verified or self-reported.</li>
<li>Compare filter replacement cost and interval.</li>
<li>Look for a carbon layer if odors or fumes are also on your list.</li>
</ol>
<p>This routine takes a few minutes and avoids the most common regret, which is buying a machine that is too small for its room or too loud to run at the speed that makes it work.</p>

<h2 id="comparing-two-machines">Comparing two machines fairly</h2>
<p>Suppose two purifiers have similar prices and similar looks. One lists a smoke CADR that is clearly higher than the other. Does that make it the better buy? Only if the other specifications do not undercut it. Check the noise at the speed that delivers the CADR you need, the filter replacement cost, and the size of the filter.</p>
<p>A strong CADR from a small, loud unit that needs filters every few months may be a worse everyday machine than a slightly lower number from a larger, quieter unit with a long filter life. CADR is the first filter in your decision, not the last. Use it to narrow the list, then break ties with the practical details.</p>
<ul>
<li>Narrow by CADR matched to your room.</li>
<li>Break ties on noise at the speed you will use.</li>
<li>Check the cost and interval of replacement filters.</li>
<li>Confirm the warranty and the availability of parts.</li>
</ul>

<h2 id="verified-ratings">Looking for a verified rating</h2>
<p>AHAM runs a verification program, and participating products carry a certification mark with their three numbers on the box or in the listing. When you see that mark, the numbers were produced under the standard procedure and the product was checked against it. Marketplace listings sometimes copy the figures without the mark, so look at the manufacturer's own page for confirmation.</p>
<p>If you cannot find a verified figure, ask whether the manufacturer provides a test report. A company that is proud of its numbers will usually point you to them, and one that is vague deserves caution.</p>

<h2 id="faq">Frequently Asked Questions</h2>
<h3>What is a good CADR for an air purifier?</h3>
<p>It depends on the room. A common rule links the smoke CADR to about two thirds of the floor area in square feet for a standard ceiling. Larger rooms, high ceilings or heavy smoke call for a higher number.</p>
<h3>Is a higher CADR always better?</h3>
<p>Higher means faster delivery at top speed, which gives more headroom. But a very high CADR in a tiny room is wasted, and a loud machine may not be pleasant to run. Match the number to your room.</p>
<h3>Does CADR measure odors or gases?</h3>
<p>No. CADR covers particles only. Odors and gases are handled by adsorbent materials such as activated carbon, and they have no CADR rating.</p>
<h3>Why are the three CADR numbers different?</h3>
<p>They are measured for three particle size ranges. Large pollen particles are easiest to remove, and small smoke particles are hardest, so the numbers usually differ.</p>
<h3>Does CADR change as the filter gets dirty?</h3>
<p>The tested number is for a clean filter. As the filter loads, airflow falls and real delivery declines, which is why scheduled replacement matters.</p>
<h3>Who sets the CADR standard?</h3>
<p>AHAM, the Association of Home Appliance Manufacturers, defines the test and verifies participating products. Not every manufacturer participates, so check for a verified rating.</p>

<h2 id="bottom-line">Bottom line</h2>
<p>CADR is the best common yardstick for comparing how fast purifiers clean particles, with three scores for smoke, dust and pollen. It is a top-speed lab figure and says nothing about gases, so use it to match a machine to your room's size and your main concern, then check noise at the speed you will really use. Pair it with an understanding of air changes, and it becomes a reliable shortcut.</p>`,
  products: [],
  imageCredits: [
    {"image":"purifier-levoit-core300.webp","author":"Marco Verch","license":"CC BY-SA 2.0","source":"https://commons.wikimedia.org/wiki/File:Air_Purifier_(Levoit_Core_300)_(49318249366).jpg"},
    {"image":"purifier-levoit-lvh133.webp","author":"Marco Verch","license":"CC BY-SA 2.0","source":"https://commons.wikimedia.org/wiki/File:Air_Purifier_(Levoit_LV-H133)_(49318571012).jpg"},
    {"image":"purifier-control-panel.webp","author":"Marco Verch","license":"CC BY-SA 2.0","source":"https://commons.wikimedia.org/wiki/File:Air_Purifier_Control_Panel_(Levoit_LV-PUR131S)_(49318415386).jpg"},
    {"image":"purifier-in-room.webp","author":"Your Best Digs","license":"CC BY 2.0","source":"https://commons.wikimedia.org/wiki/File:Air_Purifier_(51260797378).jpg"},
  ],
  relatedLinks: [
    {"title":"Best Air Purifiers","href":"/guide/best-air-purifiers"},
    {"title":"Best HEPA Air Purifiers","href":"/guide/best-hepa-air-purifiers"},
    {"title":"Air Purifier Room Size and Air Changes","href":"/air-purifier-room-size-and-air-changes"},
  ],
};

export default article;
