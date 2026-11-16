import type { LegacyArticleModule } from "@/components/guide/LegacyArticlePage";

const article: LegacyArticleModule = {
  slug: "cfm-vs-psi-explained",
  title: "CFM vs PSI explained: what each number means on an air compressor",
  metaTitle: "CFM vs PSI Explained for Air Compressors",
  metaDescription: "PSI is pressure, CFM is volume of air delivered. Learn why CFM at a stated PSI is the number that matters and how to match your tools and compressor.",
  kicker: "Explainer",
  heroImage: { src: "/images/articles/compressor-sealey-tank.webp", alt: "Portable air compressor with a horizontal tank, wheels and a pressure gauge" },
  lastUpdated: "2026-11-16",
  readTime: "13 min",
  quickAnswer: "PSI measures air pressure, how hard the air pushes. CFM measures the volume of air flowing per minute. A tool needs a certain CFM at a certain PSI, and a compressor delivers a lower CFM as the pressure rises. Always compare the compressor's CFM at the tool's working PSI, not the maximum PSI on the box.",
  html: `<h2 id="two-numbers-two-jobs">Two numbers, two different jobs</h2>
<p>Air compressor listings throw a pair of numbers at you: a big PSI figure and a smaller CFM figure. Many buyers treat them as the same idea, a general measure of power, and pick whichever machine has the larger digits. That habit leads to a compressor that reaches an impressive pressure and still cannot run the tool in your hand.</p>
<p>The two numbers describe two separate physical things. Once you see them separately, the way to read a compressor spec becomes straightforward.</p>

<h2 id="what-psi-is">What PSI measures</h2>
<p>PSI stands for pounds per square inch. It is a measure of pressure: how much force the compressed air exerts on each square inch of surface. A higher PSI means the air is squeezed harder and pushes with more force.</p>
<p>For a compressor, the PSI rating is usually the maximum pressure the pump can build in the tank. A tool, in turn, has a working pressure at which it is designed to run. Many common air tools are designed around a similar working pressure, so a compressor that can reach and hold it is usually adequate on the pressure side.</p>
<p>Think of PSI as how hard the air pushes. A very high number is rarely needed for ordinary tools, and a compressor that only exceeds what the tool needs by a wide margin does not add capability for that tool.</p>

<h2 id="what-cfm-is">What CFM measures</h2>
<p>CFM stands for cubic feet per minute. It measures the volume of air that moves, how much the compressor delivers or the tool consumes in one minute. It is the flow rate.</p>
<p>A pump moves a given amount of air each minute. A tool consumes air at a rate that depends on what it does. When the supply of air meets or exceeds the tool's consumption, the tool runs smoothly. When the tool consumes more than the pump can supply, the tank pressure falls and the tool slows or stops until the pump catches up.</p>
<p>If PSI is how hard the air pushes, CFM is how much air there is to push with. A tool needs enough of both.</p>

<h2 id="the-garden-hose-analogy">The garden hose analogy</h2>
<p>Picture a garden hose. Pressure is how forcefully the water leaves the nozzle when you partly close it. Flow is how many gallons per minute come out when you open it. A narrow trickle at high pressure can sting your hand, but it will not fill a bucket quickly. A wide stream at lower pressure fills the bucket fast.</p>
<p>A tool that sands, grinds or sprays is a thirsty bucket. It needs a lot of flow, even if it does not need extreme pressure. A tool that drives a nail is a small cup, needing a puff at the right pressure but little total volume. This is why the two tool categories behave so differently on the same compressor.</p>

<h2 id="why-cfm-drops-with-psi">Why CFM falls as PSI rises</h2>
<p>A compressor's pump moves a fixed amount of air per stroke, and higher pressure takes more work for each stroke. As the target pressure goes up, the pump's real delivery in standard terms goes down, because it takes more strokes to reach the pressure and the pump leaks slightly against it.</p>
<p>That is why a CFM figure must always come with a pressure. A pump might deliver a certain volume at a lower pressure and noticeably less at a higher one. A manufacturer who quotes the larger figure at the lower pressure makes the machine look stronger than it is for a tool that works at the higher pressure.</p>
<div class="mf-callout"><strong>Rule:</strong> never compare a compressor's CFM with a tool's CFM unless both are stated at the same PSI.</div>

<h2 id="reading-a-spec-sheet">Reading a compressor spec sheet</h2>
<table>
<thead><tr><th>Spec</th><th>What it tells you</th><th>What to check</th></tr></thead>
<tbody>
<tr><td>Maximum PSI</td><td>The highest tank pressure the pump can reach</td><td>Whether it exceeds your tool's working pressure</td></tr>
<tr><td>CFM at a stated PSI</td><td>Air the pump delivers at that pressure</td><td>That the PSI matches your tool's working pressure</td></tr>
<tr><td>Tank size</td><td>Stored air for bursts</td><td>Match to tool demand pattern</td></tr>
<tr><td>Horsepower</td><td>Motor rating, often exaggerated</td><td>Less useful than delivered CFM</td></tr>
<tr><td>Duty cycle</td><td>How long it can run without resting</td><td>For continuous work</td></tr>
</tbody>
</table>
<p>Horsepower deserves a caution. Peak horsepower claims on small compressors are often not a good indicator of real output, and delivered CFM at pressure is a far better measure.</p>

<h2 id="matching-the-tool">Matching a tool to a compressor</h2>
<ol>
<li>Find the tool's air consumption in CFM and its working pressure in PSI.</li>
<li>Find the compressor's delivered CFM at that same pressure.</li>
<li>Check that the compressor's CFM exceeds the tool's need, ideally with a margin, since fittings, hoses and wear reduce what arrives at the tool.</li>
<li>Check that the compressor can reach and hold the tool's PSI.</li>
<li>Look at the tank and duty cycle for how the tool will be used.</li>
</ol>
<p>Our guide to <a href="/what-size-air-compressor-do-i-need">sizing an air compressor</a> walks through this process and the difference between intermittent and continuous tools.</p>

<h2 id="intermittent-vs-continuous">Why intermittent tools forgive a low CFM</h2>
<p>A nailer or a tire inflator uses air in short bursts, with idle time in between. During the idle time, the pump refills the tank. So the average consumption is far lower than the instant draw, and a compressor with modest CFM can serve it if the tank covers the burst.</p>
<p>A sander or a paint sprayer draws air for as long as you hold the trigger. There is no idle time, so the pump must supply the whole demand. For these tools, the compressor's CFM at working pressure must meet or exceed the tool's consumption, and the tank is only a short buffer.</p>

<h2 id="tank-and-pressure">How the tank interacts with pressure</h2>
<p>The tank stores air at high pressure, and the regulator on the compressor lowers it to the working pressure for the tool. A higher tank pressure stores more air per gallon, and that gives a bigger buffer. Many compressors fill the tank to a maximum pressure and then release air at a lower regulated pressure to the tool.</p>
<figure><img src="/images/articles/compressor-sealey-tank.webp" alt="Pressure gauges and regulator on a portable air compressor" width="1400" height="931" loading="lazy" /><figcaption>Two gauges are usual: one reads the tank, one reads what the regulator is sending to the tool.</figcaption></figure>
<p>If the tool's working pressure is lower than the tank pressure, the stored air lasts longer in terms of tool use. If the tool wants a pressure close to the tank maximum, the buffer is small. This is part of why a six gallon tank is a flexible middle size, as covered in our <a href="/guide/best-6-gallon-air-compressors">best 6 gallon air compressors guide</a>.</p>

<h2 id="altitude-and-conditions">Standard and real conditions</h2>
<p>CFM ratings are often given in standard terms, referring to a defined air condition, or as a measured delivery at the pump. Different manufacturers use different bases, which is another reason to look for a figure stated at a specific pressure and, ideally, described as delivered air.</p>
<p>Real conditions also matter. A high altitude, a hot garage and a worn pump all reduce what the compressor delivers. Treat the spec sheet as a best case and keep a margin in your selection.</p>

<h2 id="hoses-and-regulators">Hoses, regulators and leaks</h2>
<p>The CFM that reaches your tool is lower than what the pump delivers, because of restrictions along the path. A long, narrow hose creates a pressure drop. Small quick couplers and worn fittings restrict flow, and leaks bleed air before it reaches the tool.</p>
<ul>
<li>Use a hose diameter suited to the tool's demand.</li>
<li>Keep the hose length reasonable.</li>
<li>Fix leaks promptly, because a hissing fitting is wasted pump output.</li>
<li>Set the regulator to the tool's working pressure, not higher.</li>
</ul>
<p>A tidy set-up delivers more of the compressor's capability to the tool, often more than a bigger compressor would.</p>

<h2 id="common-misreadings">Common misreadings</h2>
<ul>
<li>Choosing by maximum PSI, when most tools run at a similar working pressure.</li>
<li>Comparing CFM figures stated at different pressures.</li>
<li>Believing a big tank makes a weak pump strong.</li>
<li>Trusting a peak horsepower claim.</li>
<li>Ignoring the duty cycle for long jobs.</li>
</ul>
<p>When you browse the <a href="/guide/best-air-compressors">best air compressors guide</a>, look at the delivered CFM at a stated pressure for each model and compare it with your tool list.</p>

<h2 id="a-worked-comparison">A worked comparison, with illustrative numbers</h2>
<p>These figures are illustrative, to show the reasoning, and are not ratings of any product. Imagine a tool that needs a certain flow at its working pressure. Compressor A lists a higher maximum pressure and a larger flow figure, but the flow is quoted at a much lower pressure. Compressor B lists a lower maximum pressure and a smaller flow figure, quoted at the tool's working pressure.</p>
<p>A shopper comparing only the headline digits picks A. A shopper who puts both flows at the same pressure may find that B delivers more air where the tool actually works. The reason is that A's pump loses delivery as pressure climbs, and the figure it advertises came from an easier condition. The only fair comparison is flow at the same pressure.</p>
<p>When a listing gives a single flow figure with no pressure, assume the favorable condition. When it gives two figures at two pressures, use the one that matches your tool. If you can only find one, the number is not complete enough to size anything on.</p>

<h2 id="regulators-and-working-pressure">Regulators and the working pressure you set</h2>
<p>The tank holds air at a higher pressure than most tools use, and a regulator lowers it to the pressure you set for the tool. Turn the regulator to the working pressure printed on the tool, and never above its maximum. Running a tool at too high a pressure can damage it and creates a hazard, while too low a pressure makes it weak.</p>
<p>The regulator also affects how long the tank lasts. A tool set to a moderate working pressure draws the tank down from its maximum toward the working pressure, and the air stored above the working pressure is the usable buffer. A tool that needs a pressure close to the tank's maximum gets very little buffer, so the pump must supply most of the air directly.</p>
<table>
<thead><tr><th>Setting</th><th>Effect</th></tr></thead>
<tbody>
<tr><td>Regulator at the tool's rated pressure</td><td>Correct tool performance and safe operation</td></tr>
<tr><td>Regulator too low</td><td>Weak tool, slow work, may look like a small compressor</td></tr>
<tr><td>Regulator too high</td><td>Risk to the tool and to you, faster air use</td></tr>
<tr><td>Tank at maximum, tool needs a pressure close to it</td><td>Little buffer, pump must keep up</td></tr>
</tbody>
</table>

<h2 id="symptoms-and-diagnosis">Reading the symptoms</h2>
<p>Many compressor complaints trace back to the two numbers. A tool that starts strong and fades after a few seconds is starved of flow, because it uses air faster than the pump supplies it. A tool that never reaches full power even from a full tank may be set to too low a pressure, or may be restricted by a narrow hose or a leak.</p>
<ul>
<li>Strong at first, then weak: not enough CFM for continuous use.</li>
<li>Weak from the start: check the regulator, hose size and leaks.</li>
<li>Compressor runs constantly: undersized for the tool or leaking air.</li>
<li>Pressure never reaches maximum: worn pump, leak or a faulty check valve.</li>
</ul>
<p>Spraying soapy water on fittings finds leaks, because bubbles form where air escapes. Fixing leaks is the cheapest way to get more from a compressor.</p>
<div class="mf-callout"><strong>Safety:</strong> never exceed the maximum pressure printed on a tool, a hose or a tank, and drain the tank after use. Follow the manual for your equipment.</div>

<h2 id="noise-and-quiet-models">Do quiet compressors change the numbers?</h2>
<p>Quiet compressors use slower, larger pumps or enclosures, and they usually deliver a modest CFM for their size. The same two-number logic applies. A quiet model that delivers enough CFM at your tool's pressure is perfectly adequate, and one that does not will struggle with a demanding tool, however quiet it is. The <a href="/guide/best-quiet-air-compressors">best quiet air compressors guide</a> lists models with their delivered airflow so you can compare.</p>

<h2 id="how-to-check-a-claim">How to sanity check a seller's claim</h2>
<p>Be wary of a small, inexpensive compressor with a huge advertised horsepower and a big flow figure with no pressure attached. Physics limits what a small motor and pump can deliver. A claim that looks too generous for the size and weight of the machine usually describes a peak or a favorable condition and not what you will see in sustained use.</p>
<ul>
<li>Look for the flow figure with its pressure, and prefer the one at the higher pressure.</li>
<li>Compare the figure with other models of similar size and motor current.</li>
<li>Check the motor's current draw, which limits what a plug-in unit can really deliver.</li>
<li>Read owner feedback about running a particular tool on that model.</li>
</ul>

<h2 id="units-and-conversions">Units you may meet</h2>
<p>Pressure and flow appear in several units, depending on the market. Pressure may be given in PSI, bar or kilopascals, and flow in CFM, liters per minute or cubic meters per hour. When you compare products from different sources, convert them to the same units before you compare.</p>
<table>
<thead><tr><th>Quantity</th><th>Common units</th><th>Note</th></tr></thead>
<tbody>
<tr><td>Pressure</td><td>PSI, bar, kPa</td><td>Bar and kPa are common outside North America</td></tr>
<tr><td>Flow</td><td>CFM, liters per minute, cubic meters per hour</td><td>CFM is typical on North American listings</td></tr>
<tr><td>Standard flow</td><td>SCFM</td><td>Flow expressed at a defined reference condition</td></tr>
</tbody>
</table>
<p>SCFM stands for standard cubic feet per minute, a flow adjusted to a reference air condition so that comparisons are fair. If a listing gives SCFM and another gives plain CFM, check what condition each refers to, because the numbers may not match.</p>

<h2 id="faq">Frequently Asked Questions</h2>
<h3>Which is more important, CFM or PSI?</h3>
<p>For most buyers, CFM at the tool's working pressure is more important, because most common tools work at a similar pressure that nearly every compressor can reach. CFM decides whether the tool gets enough air.</p>
<h3>What does CFM at 90 PSI mean?</h3>
<p>It is the volume of air the compressor delivers per minute when running at that pressure. It is a common reference point, and it is how you compare the compressor with a tool that needs air at the same pressure.</p>
<h3>Why is the CFM lower at higher PSI?</h3>
<p>The pump works harder against higher pressure, so it delivers less air per minute. That is why a CFM figure only makes sense with its pressure stated.</p>
<h3>Can I run a tool that needs more CFM than my compressor makes?</h3>
<p>You can for short bursts, using the tank's stored air, but continuous use will drain the tank and slow the tool. For long runs, you need a compressor that meets the tool's CFM.</p>
<h3>Does a higher PSI compressor deliver more air?</h3>
<p>Not necessarily. A higher pressure can store more air in the tank, but the pump's delivery depends on its design. Check the CFM.</p>
<h3>Does tank size change CFM?</h3>
<p>No. The tank stores air, and it does not change the pump's output. It only affects how long a burst of high demand can be sustained.</p>

<h3>Can I add a second tank to get more airflow?</h3>
<p>A second tank adds stored air, which lengthens a burst of use, but it does not raise the pump's delivered flow. If the tool needs more flow than the pump supplies, the added tank only delays the point where pressure drops. A stronger pump is the real fix for continuous tools.</p>

<h2 id="bottom-line">Bottom line</h2>
<p>PSI is how hard the air pushes, and CFM is how much air arrives. A tool needs a certain CFM at a certain PSI, and a compressor's delivery falls as pressure rises. Compare CFM at the tool's working pressure, ignore peak horsepower claims and keep a margin for hoses and wear. Do that and the numbers on the box tell you whether a machine fits your tools instead of leaving you with an impressive but unusable figure.</p>`,
  products: [],
  imageCredits: [
    {"image":"compressor-sealey-tank.webp","author":"Chris Sampson","license":"CC BY 2.0","source":"https://commons.wikimedia.org/wiki/File:Sealey_SA5020_50_Litre_Compressor.jpg"},
  ],
  relatedLinks: [
    {"title":"Best Air Compressors","href":"/guide/best-air-compressors"},
    {"title":"Best 6 Gallon Air Compressors","href":"/guide/best-6-gallon-air-compressors"},
    {"title":"What Size Air Compressor Do I Need","href":"/what-size-air-compressor-do-i-need"},
  ],
};

export default article;
