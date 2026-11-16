import type { LegacyArticleModule } from "@/components/guide/LegacyArticlePage";

const article: LegacyArticleModule = {
  slug: "3d-printer-bed-leveling-explained",
  title: "3D printer bed leveling explained: manual, automatic and probe types",
  metaTitle: "3D Printer Bed Leveling Explained",
  metaDescription: "A good first layer depends on a consistent nozzle to bed gap. Learn manual leveling, automatic bed leveling, probe types and how to fix a poor first layer.",
  kicker: "How to",
  heroImage: { src: "/images/articles/printer-3d-at-event.webp", alt: "3D printer building a blue object on a lit print bed" },
  lastUpdated: "2026-11-16",
  readTime: "14 min",
  quickAnswer: "Bed leveling sets a consistent gap between the nozzle and the print surface across the whole bed, so the first layer sticks evenly. Manual leveling uses knobs and a feeler gauge, while automatic leveling uses a probe to measure the bed and compensate. Even with automatic leveling, you still need the correct nozzle height at the start.",
  html: `<h2 id="the-first-layer-failure">The first layer failure</h2>
<p>Ten hours into a large print, the corner lifts, the part peels from the bed and the nozzle drags a ribbon of spaghetti through the air. The cause is almost always set in the first few seconds of the job, when the first layer went down with an uneven gap between nozzle and bed.</p>
<p>That is why experienced users say that every print is decided by its first layer, and why leveling gets so much attention. It is a mechanical task, simple once you understand what it is trying to achieve.</p>

<h2 id="what-leveling-means">What leveling actually means</h2>
<p>Leveling is a slightly misleading word. The goal is not to make the bed perfectly horizontal in the room, as with a spirit level. The goal is for the bed to be parallel to the plane the nozzle travels in, so the gap between them is the same everywhere.</p>
<p>If the bed is tilted relative to that plane, the nozzle is too close in one corner and too far in the opposite one. Where it is too close, the plastic is squashed or the nozzle scrapes. Where it is too far, the first layer does not press into the bed and does not stick.</p>

<h2 id="why-the-gap-matters">Why the gap matters so much</h2>
<p>The first layer is laid down by squishing a ribbon of molten plastic onto the surface. A correct gap, usually a small fraction of a millimeter, presses the plastic into the textured surface and gives it a wide, flat, firm bond. This adhesion holds the part through the entire print, resisting the forces from cooling and shrinking that try to lift corners.</p>
<figure><img src="/images/articles/printer-3d-hotend.webp" alt="3D printer nozzle extruding purple filament onto a part in progress" width="1400" height="778" loading="lazy" /><figcaption>The gap between nozzle and bed on the first layer decides whether the line is squashed onto the surface or laid loosely on it.</figcaption></figure>
<p>The gap interacts with the first layer height and the nozzle diameter set in the slicer, as covered in our <a href="/fdm-3d-printer-nozzle-and-layer-height">nozzle and layer height article</a>. Choose a first layer thicker than the rest, and the process becomes more forgiving of small errors in the bed.</p>

<h2 id="manual-leveling">Manual leveling</h2>
<p>Many printers have a bed that sits on adjustable supports, often thumbwheels or screws at the corners. You move the nozzle to each corner, adjust the support until the gap is right, and repeat until all corners agree. Adjusting one corner changes the others, so you go around several times.</p>
<p>Users judge the gap with a piece of paper or a feeler gauge. The nozzle should just grip the paper, giving slight drag when you slide it. This is a feel-based method, and it works well once you have developed a sense of the right resistance.</p>
<ol>
<li>Heat the bed and nozzle to printing temperature, because parts expand when hot.</li>
<li>Home the printer and move the nozzle to the first corner.</li>
<li>Slide a sheet of paper under the nozzle and adjust until you feel a light drag.</li>
<li>Repeat at each corner and the center.</li>
<li>Go around again, because each adjustment affects the others.</li>
<li>Run a test print of a wide, flat pattern and check the result.</li>
</ol>
<p>Manual leveling is cheap and reliable when the bed is flat. Its weakness is drift. Vibration and thermal cycles slowly loosen the settings, so you need to recheck regularly.</p>

<h2 id="bed-flatness">The bed itself may not be flat</h2>
<p>Leveling assumes the bed is a flat plane. Real beds warp slightly with heat and manufacturing tolerances, and a large bed is more likely to have a small bow. A bed that is not flat cannot be perfectly leveled by adjusting corners alone, and you end up with a gap that is correct in some areas and wrong in others.</p>
<p>This is why bigger printers lean on automatic leveling. A large bed has more area for a bow to appear, and the compensation helps. You can see this in the larger models covered in the <a href="/guide/best-400mm-3d-printers">best 400mm 3D printers guide</a>, where automatic compensation is common.</p>

<h2 id="automatic-leveling">Automatic bed leveling</h2>
<p>Automatic bed leveling, often called ABL, uses a probe to measure the distance to the bed at a grid of points. The firmware builds a map of the surface, and as the nozzle moves it adjusts its height to follow the map. Rather than physically leveling the bed, the printer compensates for tilt and warp in software.</p>
<figure><img src="/images/articles/printer-3d-in-progress.webp" alt="Print head of a 3D printer moving above a part being built" width="1400" height="1800" loading="lazy" /><figcaption>Automatic levelling measures the bed and compensates in software. It does not make a warped bed flat.</figcaption></figure>
<p>The advantage is convenience and accuracy on a bed that is not perfectly flat. The disadvantage is that the compensation has limits. A large tilt or a warped bed still benefits from a mechanical adjustment, and the probe must be reliable and accurate.</p>
<div class="mf-callout"><strong>Important:</strong> automatic leveling measures and compensates. It does not set the correct nozzle height by itself. You still need the right offset, often called the Z offset, so the first layer has the correct gap.</div>

<h2 id="probe-types">Types of probes</h2>
<table>
<thead><tr><th>Probe type</th><th>How it senses</th><th>Strengths</th><th>Limits</th></tr></thead>
<tbody>
<tr><td>Mechanical switch</td><td>A pin or arm triggers a switch on contact</td><td>Works on any surface, simple</td><td>Moving parts, can wear</td></tr>
<tr><td>Inductive</td><td>Detects metal through a magnetic field</td><td>No contact, quick</td><td>Needs a metal bed, readings can vary with temperature</td></tr>
<tr><td>Capacitive</td><td>Senses changes in electric field near a surface</td><td>Works on more materials</td><td>Can be affected by temperature and humidity</td></tr>
<tr><td>Strain or load sensing</td><td>Detects the nozzle touching the bed through force</td><td>Measures with the actual nozzle</td><td>More complex, depends on the design</td></tr>
<tr><td>Optical</td><td>Light reflection from the bed</td><td>No contact</td><td>Surface color and finish can affect it</td></tr>
</tbody>
</table>
<p>No type is universally best. Printer makers pick one that fits their bed, hot end and price. When you compare machines in the <a href="/guide/best-3d-printers">best 3D printers guide</a>, notice how the leveling is implemented and whether the manufacturer describes how it deals with a warm bed.</p>

<h2 id="z-offset">Z offset and the first layer squish</h2>
<p>After the probe maps the bed, you set the Z offset, which adjusts the gap between the nozzle and the bed at the probe's reference point. This number decides the squish of the first layer. Too high and the plastic does not press into the bed. Too low and the nozzle scrapes, the plastic is squeezed thin and the flow can block.</p>
<p>Adjust it in small steps while a first layer prints, watching the line. You want lines that are slightly flattened and fused together, with no gaps and no ridges. Save the value in the printer, and recheck after you change the build surface or the nozzle.</p>

<h2 id="reading-the-first-layer">Reading the first layer</h2>
<ul>
<li><strong>Gaps between lines or rounded, stringy lines:</strong> the nozzle is too high. Lower it a little.</li>
<li><strong>Translucent, scraped or wavy lines with rough edges:</strong> the nozzle is too low. Raise it a little.</li>
<li><strong>Smooth, flat, fused lines:</strong> the gap is about right.</li>
<li><strong>One side good and the other poor:</strong> the bed is tilted or warped, so level or remap.</li>
</ul>
<p>A test print of a thin square across the bed shows you the whole surface at once. Many users print a first layer test after every nozzle or surface change.</p>

<h2 id="heat-and-expansion">Level at temperature</h2>
<p>Metal expands as it heats, and a bed and gantry at printing temperature differ from cold. Leveling when cold and printing when hot can produce a gap that is off by enough to matter. Most guidance is to level with the bed and nozzle at working temperature, or to use a printer that performs the measurement hot automatically.</p>
<p>Take care when working near a hot nozzle and bed, and use the correct procedures from your manual to avoid burns.</p>

<h2 id="build-surfaces">The surface on top of the bed</h2>
<p>Different build surfaces affect adhesion and the right gap. A textured sheet grips plastic strongly, a smooth glass plate gives a shiny underside, and a flexible spring steel plate lets you flex the part off. Each has a slightly different ideal squish, and each wears over time.</p>
<figure><img src="/images/articles/printer-3d-at-event.webp" alt="3D printer building a blue object on a lit print bed" width="1400" height="1050" loading="lazy" /><figcaption>The surface itself is part of the system. Changing it changes the offset you spent time setting.</figcaption></figure>
<p>Keep the surface clean, because oils from fingers reduce adhesion even with a perfect gap. Wipe it with the cleaner the maker recommends, and replace a worn sheet.</p>

<h2 id="maintenance">Keeping a level bed level</h2>
<ul>
<li>Check that the bed and gantry are tight and the leveling screws are not loose.</li>
<li>Inspect the springs under the bed, which weaken with use.</li>
<li>Clean the nozzle so a blob of old plastic does not change the real height.</li>
<li>Recalibrate after moving the printer or changing the surface.</li>
<li>Check the probe for dirt or damage if the map begins to drift.</li>
</ul>

<h2 id="mesh-and-probing-density">Bed meshes and how many points to probe</h2>
<p>An automatic system probes a grid of points and builds a mesh, a height map of the bed. A denser grid captures more detail about the surface, but it takes longer to measure. A small grid is quick and fine for a bed that is flat and just slightly tilted. A bed with a pronounced bow or localized dips benefits from more points.</p>
<p>Think of the mesh as a contour map. The firmware interpolates between the measured points, assuming the surface changes smoothly. If the bed has a sharp bump between two probe points, the map will not see it. That is why a physically flat bed beats any amount of software compensation, and why heavy warping is worth fixing rather than hiding.</p>
<table>
<thead><tr><th>Bed condition</th><th>Reasonable approach</th></tr></thead>
<tbody>
<tr><td>Flat and slightly tilted</td><td>Small probe grid, or manual leveling</td></tr>
<tr><td>Gently bowed when hot</td><td>Mesh at working temperature, medium grid</td></tr>
<tr><td>Warped with local dips</td><td>Replace or flatten the bed, then mesh</td></tr>
<tr><td>Very large bed</td><td>Denser grid and a stiff bed</td></tr>
</tbody>
</table>

<h2 id="gantry-and-frame-issues">When the problem is the frame</h2>
<p>Sometimes the leveling fails because the machine itself is not square. A gantry that sags on one side, a loose belt or a wobbling frame changes the gap as the nozzle moves, and no amount of bed adjustment fixes it. Check that the frame is rigid, the rails are clean, and the carriage rides smoothly without play.</p>
<p>Place the printer on a solid, level table, and avoid a surface that flexes when the bed moves. On printers with a moving bed, the weight of a heavy print can change the bed's behavior slightly, so a stiff mount matters. If your first layer is good at the front and poor at the back, and releveling does not help, look for a mechanical cause.</p>

<h2 id="common-leveling-mistakes">Common mistakes</h2>
<ul>
<li>Leveling while the bed is cold and printing while it is hot.</li>
<li>Setting the gap too tight, so the nozzle scrapes and the plastic cannot flow.</li>
<li>Ignoring a dirty nozzle or a blob of old plastic that changes the real height.</li>
<li>Skipping the Z offset after changing the build surface.</li>
<li>Assuming automatic leveling removes the need for any physical adjustment.</li>
<li>Adjusting only one corner and not going around again.</li>
</ul>
<p>Most of these are habits, and building a short routine solves them. Heat up, clean the nozzle, wipe the bed, home, level or mesh, set the offset with a test line and then start the print. Each step takes seconds and saves hours of failed prints.</p>

<h2 id="when-to-expect-better-leveling">What to look for when buying a printer</h2>
<p>If you do not want to think about this much, choose a printer with a reliable automatic leveling system, a rigid frame and a flat bed. Look for a printer that probes with the nozzle or measures at temperature, and has a clear process for setting the offset. Check owner feedback about how often relevel is needed after a few weeks.</p>
<p>The <a href="/guide/best-300mm-3d-printers">best 300mm 3D printers guide</a> compares mid-sized machines on features like these, and it is useful if you want a printer that holds its calibration with little attention.</p>

<h2 id="first-layer-settings">Slicer settings that help the first layer</h2>
<p>Leveling is the mechanical half of a good first layer. The slicer settings are the other half. Printing the first layer slowly gives the plastic time to bond. A slightly higher temperature on the first layer improves adhesion. A wider first layer line width presses the plastic onto the bed more firmly. Cooling fans are usually off for the first layer or two.</p>
<ul>
<li>Slow the first layer speed so the plastic can grip.</li>
<li>Use a first layer thicker than the rest, which tolerates small bed errors.</li>
<li>Add a brim or a skirt to improve adhesion on small footprints.</li>
<li>Keep the fan off until the part is anchored.</li>
</ul>
<p>With these settings, a bed that is slightly imperfect still gives a good first layer. Without them, even a carefully leveled bed can struggle on tricky materials.</p>

<h2 id="a-routine-before-each-print">A short routine before each print</h2>
<ol>
<li>Wipe the build surface with the cleaner the manufacturer recommends.</li>
<li>Check the nozzle for a blob or a strand of old filament and clear it.</li>
<li>Heat the bed and nozzle and let the temperatures settle.</li>
<li>Run the automatic leveling routine if your printer has one, or confirm the manual level.</li>
<li>Watch the first few lines of the first layer and adjust the offset if needed.</li>
</ol>
<p>Those five steps take a few minutes, and they catch nearly every problem that would otherwise show up as a failed print hours later.</p>

<h2 id="material-and-bed-temperature">Bed temperature and material</h2>
<p>Each filament has a preferred bed temperature. Too cool and the part does not stick. Too hot and the bottom layers soften and squash, creating a rough edge known as elephant foot. Warping, where corners lift as the part cools, comes from uneven contraction, and it is reduced by a heated bed, an enclosure and good adhesion.</p>
<p>Follow the filament maker's guidance for bed temperature, and let the bed reach a steady temperature before starting. A bed that is still heating while the print begins can change the nozzle gap during the first layer.</p>

<h2 id="faq">Frequently Asked Questions</h2>
<h3>Do I need to level my bed before every print?</h3>
<p>Not usually. A stable printer holds its level for many prints, and automatic leveling can compensate at the start of each job. Recheck after transport, a nozzle change or when first layers start to fail.</p>
<h3>Is automatic bed leveling better than manual?</h3>
<p>It is more convenient and handles a warped bed better, but it still needs a correct Z offset and a reliable probe. A well-built manual setup on a flat bed can be just as reliable.</p>
<h3>What is the Z offset?</h3>
<p>It is the adjustment to the nozzle height relative to the probe's reference point. It sets the gap between the nozzle and the bed, which decides how well the first layer sticks.</p>
<h3>Why does my print stick in one corner but not the other?</h3>
<p>The bed is probably tilted or warped relative to the nozzle's path. Level the bed more carefully, or use a bed mesh to compensate.</p>
<h3>Should I level the bed hot or cold?</h3>
<p>Level at working temperature when you can, since heat expands the parts and changes the gap. Some printers measure automatically while hot.</p>
<h3>Can a dirty bed cause leveling problems?</h3>
<p>Dirt and oil do not change the gap, but they reduce adhesion, so a perfectly leveled bed can still fail. Clean the surface regularly.</p>

<h3>How do I know my bed has warped?</h3>
<p>Lay a straightedge across the cold bed and look for light under it, or run a bed mesh and look at the height map. A bed that is bowed or dished shows a clear pattern in the map. Mild warp can be compensated in software, while a severe bow is better corrected by replacing or flattening the plate.</p>

<h2 id="bottom-line">Bottom line</h2>
<p>Bed leveling is about a consistent gap between nozzle and bed, because the first layer decides whether a print survives. Manual leveling is simple and reliable on a flat bed, while automatic leveling maps the surface and compensates, especially on large beds. Either way, set the Z offset carefully, level at working temperature, keep the surface clean and read the first layer. A reliable first layer is worth more than any fancy setting that follows.</p>`,
  products: [],
  imageCredits: [
    {"image":"printer-3d-at-event.webp","author":"Tobias Klenze","license":"CC BY-SA 4.0","source":"https://commons.wikimedia.org/wiki/File:3D_printer_at_35c3_01.jpg"},
    {"image":"printer-3d-hotend.webp","author":"Jonathan Juursema","license":"CC BY-SA 3.0","source":"https://commons.wikimedia.org/wiki/File:Felix_3D_Printer_-_Printing_Head.JPG"},
    {"image":"printer-3d-in-progress.webp","author":"Pavlo Sadivnychyi","license":"CC BY-SA 4.0","source":"https://commons.wikimedia.org/wiki/File:3D_printing_in_progress.jpg"},
  ],
  relatedLinks: [
    {"title":"Best 3D Printers","href":"/guide/best-3d-printers"},
    {"title":"Best 400mm 3D Printers","href":"/guide/best-400mm-3d-printers"},
    {"title":"FDM 3D Printer Nozzle and Layer Height","href":"/fdm-3d-printer-nozzle-and-layer-height"},
  ],
};

export default article;
