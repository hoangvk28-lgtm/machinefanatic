import type { LegacyArticleModule } from "@/components/guide/LegacyArticlePage";

const article: LegacyArticleModule = {
  slug: "what-does-a-lathe-do",
  title: "What Does a Lathe Do? Operations, Parts and How to Choose One",
  metaTitle: "What Does a Lathe Do? Operations and Parts",
  metaDescription:
    "A lathe spins a workpiece while a fixed tool shapes it. See the main turning operations, lathe parts, wood vs metal vs CNC, and how to pick a first machine.",
  kicker: "Explainer",
  heroImage: {
    src: "/images/articles/center-lathe.webp",
    alt: "Hwacheon centre lathe with chuck guard and digital readout in a machine shop",
  },
  lastUpdated: "2026-11-06",
  readTime: "18 min",
  quickAnswer:
    "A lathe holds a workpiece and spins it around a horizontal axis while a stationary cutting tool is fed into it, removing material to make something round: shafts, bowls, pens, pulleys, threaded parts and bored holes. Metal lathes feed the tool mechanically for precision; wood lathes use hand-held gouges against a tool rest. The same basic layout (headstock, bed, tailstock, tool support) scales from a benchtop hobby machine to a CNC turning centre.",
  html: `
<p>Nearly every round thing in a machine, from an axle to a bolt to a table leg, was probably shaped on a lathe or a descendant of one. The lathe is one of the oldest machine tools, and one of the few that can make copies of itself in principle, because the parts it produces include the screws, spindles and handwheels that machines are built from. This article explains what a lathe does in practical terms, how the machine is laid out, what the common operations are, how wood, metal and CNC lathes differ, and how to pick a first machine without overbuying.</p>

<h2 id="what-it-does">The core idea: spin the work, hold the tool still</h2>

<p>Most machine tools move a cutter against a stationary workpiece. A lathe reverses that arrangement. The workpiece is clamped at one end (or both) and rotated at a controlled speed, and a cutting tool is pushed into it along a controlled path. As the material rotates past the tool, the tool shaves off a thin layer, and the part becomes smaller in diameter, or takes on a profile, or gets a hole, groove or thread cut into it.</p>

<p>Because the rotation is continuous, the result is always a surface of revolution: cylinders, cones, spheres, grooves and threads, all sharing a common axis. That is why lathes are associated with round parts. Square or irregular shapes are possible with extra fixtures, but the machine's natural output is a body that is symmetrical around the spindle axis.</p>

<figure>
<img src="/images/articles/center-lathe.webp" alt="Centre lathe with 460 mm swing, chuck guard, digital readout and toolholder on the carriage" width="1400" height="1080" loading="lazy" />
<figcaption>A centre lathe with a chuck guard, digital readout and quick-change toolholder. This is the layout most metal lathes follow.</figcaption>
</figure>

<h2 id="parts">Parts of a lathe</h2>

<p>Different models name things slightly differently, but all lathes share the same anatomy. Knowing it lets you read a spec sheet.</p>

<h3>Headstock and spindle</h3>
<p>The headstock sits at the left end and houses the motor drive and the spindle, the rotating shaft that carries the chuck or faceplate. The spindle has a bore through the middle on metal lathes, so you can pass long bar stock through it. Spindle bearings determine how accurately the work runs true. Taper standards (such as the MT1 spindle and tailstock taper listed on the WEN LA3421) define which accessories fit.</p>

<h3>Chuck or faceplate</h3>
<p>The chuck grips the workpiece. A three-jaw self-centering chuck (as on the VEVOR 7x14 metal lathe, which lists a 4 inch three-jaw chuck) centers round stock automatically. A four-jaw independent chuck adjusts each jaw for square or off-center work. Wood lathes often use a faceplate, a screw chuck or a scroll chuck for bowls, and a drive spur for work held between centers.</p>

<h3>Bed and ways</h3>
<p>The bed is the rigid beam the machine is built on, with precisely ground ways along its top. The carriage and tailstock slide on the ways. Cast iron is the traditional material because it damps vibration; the VEVOR 12x18 wood lathe lists a cast iron body for this reason. A heavier bed generally gives a smoother finish, which is why serious machines weigh so much.</p>

<h3>Tailstock</h3>
<p>The tailstock sits opposite the headstock and slides along the bed. It supports the free end of long work with a live or dead center, or holds a drill chuck for drilling holes along the axis. On the JET 12 x 21 the listing mentions an Acme thread in the tailstock, which improves quill movement.</p>

<h3>Carriage, cross slide and compound rest (metal lathes)</h3>
<p>On a metal lathe, the carriage travels along the bed. Mounted on it, the cross slide moves the tool toward and away from the work, and the compound rest on top lets you angle the tool for tapers. The tool post at the top holds the cutter. The VEVOR 7x14 lists a 4-way tool post that holds four standard turning tools at once, which saves time changing tools.</p>

<h3>Tool rest (wood lathes)</h3>
<p>A wood lathe has no carriage. Instead, a tool rest (sometimes called a banjo when mounted on its base) supports the turner's gouge near the work. The user guides the tool by hand, using the rest as a fulcrum.</p>

<h3>Feed and thread mechanisms (metal lathes)</h3>
<p>A lead screw and feed rod, driven from the spindle through a gearbox, move the carriage at set rates. This is what lets a lathe cut threads at an exact pitch and finish surfaces at a consistent feed rate.</p>

<h3>Speed control</h3>
<p>Speed matters because the correct surface speed depends on material and diameter. Older lathes use stepped pulleys; the JET 12 x 21 lists three belt ranges of 60 to 900, 110 to 1,800 and 220 to 3,600 RPM. Modern benchtop machines such as the WEN LA3421 (750 to 3,200 RPM) and VEVOR 12x18 (150 to 3,800 RPM) use electronic variable speed, so you can change it while the work spins.</p>

<h2 id="operations">What a lathe does: the main operations</h2>

<h3>Turning</h3>
<p>Turning reduces the outside diameter of the work. The tool moves parallel to the axis (straight turning) or at an angle (taper turning). A rough cut removes bulk material quickly, and a finish cut with a light feed leaves a smooth surface.</p>

<h3>Facing</h3>
<p>Facing machines the end of the work flat and square to the axis. The tool moves across the face from the outside toward the center. It is usually the first step on a bar, to create a clean reference end.</p>

<h3>Drilling and center drilling</h3>
<p>A drill chuck in the tailstock feeds a drill bit into the end of the spinning work. A center drill makes a small conical starter hole that guides a larger drill and gives the tailstock center something to bear against.</p>

<figure>
<img src="/images/articles/lathe-center-drilling.webp" alt="Tailstock-mounted drill bit center drilling a workpiece held in a lathe chuck" width="1400" height="788" loading="lazy" />
<figcaption>Center drilling with a tailstock-mounted bit. The hole is concentric with the spindle axis because the work spins around that axis.</figcaption>
</figure>

<h3>Boring</h3>
<p>Boring enlarges an existing hole using a single-point tool on a boring bar. It produces an accurate internal diameter, concentric with the outside, which a drill cannot guarantee.</p>

<h3>Parting off</h3>
<p>A thin parting tool plunges radially to cut the finished piece from the bar stock. It needs rigidity and low overhang, because a parting tool is prone to chatter.</p>

<h3>Grooving</h3>
<p>A shaped tool cuts a groove into the surface, for o-rings, snap rings or decoration.</p>

<h3>Threading</h3>
<p>Using the lead screw to move the carriage at a fixed rate per revolution, a threading tool cuts external or internal threads. This is a defining capability of a metal lathe.</p>

<h3>Knurling</h3>
<p>A knurling tool presses a diamond or straight pattern into the surface to create a grip, as on tool handles and thumbscrews.</p>

<h3>Tapping and reaming</h3>
<p>Taps cut internal threads, and reamers finish a drilled hole to a precise size, both held by the tailstock.</p>

<h3>Sanding, polishing and finishing</h3>
<p>A lathe makes finishing simple. The work spins at a steady rate, so you can sand or polish a wood or metal part evenly. Woodturners apply finish while the piece is still spinning.</p>

<figure>
<img src="/images/articles/lathe-in-action.webp" alt="Lathe turning a chunk of aluminum into a bottle opener" width="1050" height="1400" loading="lazy" />
<figcaption>A lathe in action making a bottle opener from a chunk of aluminum. Metal chips curl off the tool as the stock turns.</figcaption>
</figure>

<h2 id="wood-vs-metal">Wood lathe vs metal lathe</h2>

<p>The two machines share an architecture, but they are built for different tooling and different expectations.</p>

<table>
<thead>
<tr><th>Feature</th><th>Wood lathe</th><th>Metal lathe</th></tr>
</thead>
<tbody>
<tr><td>Tool control</td><td>Hand-held gouges and scrapers on a tool rest</td><td>Fixed cutter on a carriage with leadscrew feed</td></tr>
<tr><td>Typical speeds</td><td>Hundreds to a few thousand RPM, variable</td><td>Wide range, set to suit material and diameter</td></tr>
<tr><td>Accuracy</td><td>Set by the turner's skill</td><td>Set by the machine, down to very small tolerances</td></tr>
<tr><td>Threads</td><td>Not by machine, usually by chasing or jigs</td><td>Cut with the leadscrew</td></tr>
<tr><td>Weight and rigidity</td><td>Lighter, tolerant of vibration</td><td>Heavier and stiffer</td></tr>
<tr><td>Materials</td><td>Wood and, with care, plastics and resin</td><td>Metal, plastics, and wood if you accept the mess</td></tr>
<tr><td>Learning curve</td><td>Technique with tools</td><td>Machine setup and measurement</td></tr>
</tbody>
</table>

<h3>Can a metal lathe turn wood, and vice versa?</h3>
<p>A metal lathe can turn wood, but it is slower, not ideal for hand-tool work, and shavings can foul the ways. A wood lathe should not be used for metal. Its lighter structure and hand-guided tooling cannot hold the cutting forces or tolerances that metal needs.</p>

<h3>Speed and cutting differences</h3>
<p>Wood turning relies on sharp tools and a good presentation angle, and large bowls need slow speeds for safety. Metal turning is more about getting surface speed, feed and depth of cut right so the tool cuts instead of rubbing. Cast iron beds and rigid headstocks matter more on metal lathes because the cutting forces are higher.</p>

<figure>
<img src="/images/articles/wood-bowl-turning.webp" alt="Turner shaping the outside of a wooden bowl on a modern wood lathe" width="1400" height="1000" loading="lazy" />
<figcaption>Turning the outside of a wooden bowl. The turner holds the gouge against the tool rest and shapes the form by hand.</figcaption>
</figure>

<h2 id="cnc">CNC lathes</h2>

<p>A CNC lathe replaces the handwheels with motors and a controller. The operator loads a program that tells the tool where to move and how fast, and the machine repeats the same part many times with consistent results. Advanced machines add live tooling for milling, sub-spindles for finishing the other end and automatic tool turrets.</p>

<ul>
<li><strong>Repeatability.</strong> Once the program is proven, the thousandth part matches the first.</li>
<li><strong>Complex profiles.</strong> Contours that are hard to cut by hand, such as curves and multi-step shafts, are straightforward.</li>
<li><strong>Setup cost.</strong> A CNC lathe takes programming skills and tooling knowledge. For a single part, a manual lathe is often quicker.</li>
</ul>

<p>Some entry-level machines are marketed with the word CNC in the name but are manual lathes with a digital readout. The VEVOR 7x14 listing, for example, mentions a digital display of spindle speed and calls it a CNC mini lathe, but its listed features describe manual controls, a hand-operated tool post and a tailstock. Read the spec carefully so you know whether you are buying a computer-controlled machine or a manual one with a readout.</p>

<h2 id="makes">What you can make on a lathe</h2>

<p>The list is longer than most people expect.</p>

<ul>
<li><strong>Wood:</strong> bowls, pens, spindles, chair and table legs, candlesticks, handles, chess pieces, cups and boxes.</li>
<li><strong>Metal:</strong> shafts, pins, bushings, spacers, pulleys, threaded fasteners, custom knobs, brass fittings and engine parts.</li>
<li><strong>Plastics and resin:</strong> bearings, rollers, pen blanks and decorative parts.</li>
<li><strong>Repairs and restoration:</strong> replacement bushings, shafts and fittings for older machinery where parts are not sold anymore.</li>
<li><strong>Prototypes and tooling:</strong> fixtures, jigs and test parts.</li>
</ul>

<p>For hobbyists, the lathe is also one of the more rewarding machines because a finished piece appears quickly. A wooden pen takes an evening, and a small bowl takes an afternoon.</p>

<figure>
<img src="/images/articles/metal-lathe-workshop.webp" alt="Metal lathe in a school workshop with chuck, carriage and tool post" width="1400" height="1050" loading="lazy" />
<figcaption>A metal lathe in a school workshop. Many people first meet a lathe in a training environment like this.</figcaption>
</figure>

<h2 id="sizes">How lathes are sized: swing and distance between centers</h2>

<p>Two numbers describe the capacity of nearly every lathe.</p>

<ul>
<li><strong>Swing over bed.</strong> The largest diameter that can rotate over the bed. A 12 inch swing means you can turn a 12 inch bowl blank, and on a wood lathe it also sets the maximum diameter for spindle work.</li>
<li><strong>Distance between centers.</strong> The longest length you can mount between headstock and tailstock. A 21 inch distance fits a table leg, while a 13 inch distance suits pens and small spindles.</li>
</ul>

<p>The lathes in our shortlist show how sizes cluster:</p>

<table>
<thead>
<tr><th>Model</th><th>Type</th><th>Swing x distance</th><th>Speed range</th><th>Motor</th></tr>
</thead>
<tbody>
<tr><td>WEN LA3421</td><td>Mini wood</td><td>8 inch x 13 inch</td><td>750 to 3,200 RPM</td><td>3.2 amp, soft start</td></tr>
<tr><td>VEVOR 12 x 18 wood lathe</td><td>Midi wood</td><td>12 inch x 18 inch</td><td>150 to 3,800 RPM</td><td>1 HP brushless DC</td></tr>
<tr><td>JET JWL-1221VS</td><td>Midi wood</td><td>12 inch x 21 inch</td><td>60 to 3,600 RPM in three ranges</td><td>1 HP</td></tr>
<tr><td>VEVOR 7 x 14 metal lathe</td><td>Mini metal</td><td>7.09 inch x 13.78 inch</td><td>50 to 2,500 RPM (title says 2,250)</td><td>550 W</td></tr>
</tbody>
</table>

<p>Note that the VEVOR metal lathe's title and feature text disagree on top speed (2,250 vs 2,500 RPM), so check the manual on the unit you buy.</p>

<h2 id="choosing">Choosing a first lathe</h2>

<h3>Start with the material</h3>
<p>If you want to make pens, bowls and spindles, you want a wood lathe. If you want to make shafts, bushings and threaded parts, you want a metal lathe. Trying to cover both with one machine usually leaves you with a compromised tool for each. If metal is the goal, be realistic about the learning curve and the tooling cost, because cutters, chucks, measuring tools and lubricants add up.</p>

<h3>Match capacity to ambition</h3>
<p>Buy a machine one size larger than your first project. A small 8 x 13 machine like the WEN LA3421 is fine for pens, small bowls and chess pieces, but you will hit its limits on a large bowl. A 12 inch swing, as on the VEVOR 12x18 and the JET 12 x 21, opens up bowl turning and longer spindle work.</p>

<h3>Prefer variable speed</h3>
<p>Variable speed is a major convenience on a wood lathe because you need to start slowly on rough blanks and speed up as the piece gets balanced. The WEN, VEVOR and JET all provide a way to change speed, with the JET using belt ranges and the others using electronic control.</p>

<h3>Weight and stability</h3>
<p>Vibration spoils cuts. A cast iron bed and a heavy base help. The VEVOR wood lathe lists a cast iron body, and many turners fill benches or stands with sand to add mass. Benchtop machines should be bolted to a solid bench.</p>

<h3>Spindle and accessory compatibility</h3>
<p>Check the spindle thread and taper. Standard threads and tapers (the WEN lists an MT1 spindle and tailstock taper) mean a wide range of chucks, centers and accessories fit. Odd threads limit your options.</p>

<h3>Features that help</h3>
<ul>
<li>Spindle lock for changing chucks (listed on the JET).</li>
<li>Indexing positions for flutes and decorative work (24 positions on the JET).</li>
<li>Reverse rotation for sanding (the JET lists smooth forward to reverse).</li>
<li>Two tool rests of different lengths (the WEN includes two).</li>
<li>Soft start motor to reduce shock (listed on the WEN).</li>
</ul>

<h3>Budget for the extras</h3>
<p>The lathe is not the only purchase. Plan for a set of turning tools, a chuck, a sharpening setup, a face shield and dust control. A cheap lathe with good tools beats an expensive lathe with poor ones.</p>

<h2 id="picks">Lathes worth comparing</h2>

<p>We evaluated these four machines from their published specifications and owner feedback. This is a spec-based comparison, not a performance test.</p>

<h3>WEN LA3421: the small starter</h3>
<p>The WEN LA3421 is an 8 inch by 13 inch benchtop wood lathe with a 3.2 amp soft-start motor, speeds from 750 to 3,200 RPM, a 2.3 inch faceplate, MT1 spindle and tailstock tapers, two tool rests and a two-year warranty. It is aimed at pens, cups, small bowls and chess pieces. The compact size suits a small workshop or a shared garage, but it tops out at small projects.</p>

<!--product:wen-la3421-->

<h3>VEVOR 12x18 wood lathe: the capable midi</h3>
<p>The VEVOR wood lathe offers a 12 by 18 inch work area, a 1 HP brushless DC motor, a variable range of 150 to 3,800 RPM and a cast iron body with metal handwheels. A brushless motor means no brush replacement and a quiet drive. The listing says it includes an accessory kit to get you started. It suits beginners who want bowl capacity without paying for a premium machine.</p>

<!--product:vevor-wood-lathe-->

<h3>JET JWL-1221VS: the established midi</h3>
<p>The JET 12 x 21 offers a 1 HP motor, three belt-selected ranges (60 to 900, 110 to 1,800 and 220 to 3,600 RPM), a ratchet-style belt tension system, a spindle lock, 24 indexing positions, a larger digital readout and a smooth transition between forward and reverse. The 21 inch distance between centers gives more spindle length than the VEVOR. It is the choice for someone who plans to turn for years and wants an established brand with good accessory support.</p>

<!--product:jet-jwl-1221vs-->

<h3>VEVOR 7x14 metal lathe: the entry into machining</h3>
<p>The VEVOR 7 x 14 is a benchtop metal lathe with a 550 W motor, 7.09 inch swing, 13.78 inch between centers, a 4 inch three-jaw chuck, a 4-way tool post, metal gears instead of nylon and a digital speed display. It is a way to learn threading, facing and boring on a small scale. Machines in this class often need setup, adjustment and tooling upgrades, so treat it as a project machine as well as a tool. Despite the CNC wording in the title, the listed features describe manual operation.</p>

<!--product:vevor-metal-lathe-->

<h2 id="safety">Lathe safety</h2>

<p>A lathe is not forgiving of loose clothing or inattention. A spinning chuck can catch a sleeve, a cuff or hair before you can react.</p>

<ul>
<li>Remove jewelry, tie back long hair and avoid loose sleeves and gloves.</li>
<li>Wear eye protection, and a full face shield for wood turning, especially bowls.</li>
<li>Never leave the chuck key in the chuck.</li>
<li>Check that the work is mounted securely and rotate it by hand before starting.</li>
<li>Start at a low speed and increase gradually, particularly for rough blanks.</li>
<li>Keep the tool rest close to the work and adjust it only with the machine stopped.</li>
<li>Do not use a rag on a spinning part, and do not reach over the work.</li>
<li>Use dust extraction and a respirator when sanding wood.</li>
</ul>

<div class="mf-callout"><strong>Tip:</strong> Stand to the side of the line of the work when you start a new blank. If a blank cracks or comes off, it exits along that line.</div>

<h2 id="maintenance">Maintenance and ownership</h2>

<p>Wood lathes are simple. Keep the bed clean and waxed, check belts and bearings, and sharpen your tools. Metal lathes need more attention: oil the ways and gears, clean chips from the carriage, adjust gibs to remove play, and keep measuring instruments in good condition. On any lathe, vibration points to something loose or an unbalanced blank. For small shop work with other tools, our <a href="/categories/shop-garage">shop and garage category</a> lists other machines that pair well with a lathe, and our <a href="/categories/power-tools">power tools category</a> covers saws and handheld tools.</p>

<p>If you cut your own blanks, a plunge saw or circular saw is useful for breaking down boards before turning. See <a href="/what-is-a-plunge-saw">what a plunge saw is</a> and our <a href="/best-cordless-circular-saw">cordless circular saw comparison</a> for those tools.</p>

<h2 id="faq">Frequently Asked Questions</h2>

<h3>What is the main purpose of a lathe?</h3>
<p>To shape a workpiece by rotating it against a cutting tool. That produces round parts, including shafts, bowls, threaded components and bored holes, with a surface that is concentric with the spindle axis.</p>

<h3>Is a wood lathe the same as a metal lathe?</h3>
<p>No. They share the headstock, bed and tailstock layout, but a wood lathe is lighter and designed for hand-held tools on a tool rest, while a metal lathe is heavier and stiffer, with a carriage and lead screw to feed the tool precisely. Metal needs the rigidity and controlled feed of a metal lathe.</p>

<h3>Can I cut threads on a lathe?</h3>
<p>On a metal lathe, yes. The lead screw drives the carriage at a fixed rate per revolution, which lets a threading tool cut a precise pitch. Wood lathes generally do not cut threads this way.</p>

<h3>What size lathe should a beginner buy?</h3>
<p>For wood, a midi lathe with a 12 inch swing, such as the VEVOR 12x18 or the JET 12 x 21, covers bowls and spindles. If you only want pens and small items, a mini lathe like the WEN LA3421 is enough. For metal, a 7 x 14 benchtop lathe is a common entry point, with the understanding that it handles small work.</p>

<h3>What is the difference between a CNC lathe and a manual lathe?</h3>
<p>A manual lathe is controlled by the operator with handwheels and levers, while a CNC lathe follows a programmed path with motorized axes. CNC suits repeated production and complex shapes, while manual suits one-off parts, repairs and learning.</p>

<h3>Is a lathe dangerous?</h3>
<p>Any rotating machine can be, mainly through entanglement and flying workpieces. The risks are manageable with safe habits: no loose clothing, proper eye and face protection, secure work holding and sensible speeds.</p>

<h3>Do I need special tools to start?</h3>
<p>Yes. A wood lathe needs gouges, a parting tool and scrapers, plus a way to sharpen them. A metal lathe needs cutting tools, a chuck, centers and measuring instruments such as calipers and micrometers.</p>

<h2 id="verdict">Bottom line</h2>

<p>A lathe turns a spinning workpiece into something round, by holding a cutting tool still and feeding it into the material. That single idea covers a huge range of operations, from turning and facing to boring, threading and parting. Choose a wood lathe if you want to make bowls, pens and spindles, and a metal lathe if you want to make fitted, threaded or precision parts.</p>

<p>For a first wood lathe, the WEN LA3421 suits small work, the VEVOR 12x18 offers value in the midi class, and the JET 12 x 21 is the long-term pick. For a first metal lathe, the VEVOR 7 x 14 is an entry route, with the caveat that tooling and tuning are part of the ownership cost. Buy for your next three projects, not your first one, and add the safety gear before the machine arrives.</p>
`,
  products: [
    {
      id: "wen-la3421",
      name: "WEN LA3421 Mini Benchtop Wood Lathe, 8 x 13 Inch",
      imageUrl: "https://m.media-amazon.com/images/I/41DmQ3EcxmL._SL500_.jpg",
      amazonUrl: "https://www.amazon.com/dp/B0B6YDYVZD?tag=machinefanatic-20",
      label: "Best small starter",
      why: "An 8 inch swing, 13 inch between centers and 750 to 3,200 RPM variable speed. Includes two tool rests and a two-year warranty.",
    },
    {
      id: "vevor-wood-lathe",
      name: "VEVOR 12 x 18 Inch Wood Lathe, 1 HP Brushless",
      imageUrl: "https://m.media-amazon.com/images/I/41GFZdyjcwL._SL500_.jpg",
      amazonUrl: "https://www.amazon.com/dp/B0FH45FQDB?tag=machinefanatic-20",
      label: "Best value midi",
      why: "A 1 HP brushless DC motor, 150 to 3,800 RPM and a cast iron body with a 12 inch swing for bowls and spindles.",
    },
    {
      id: "jet-jwl-1221vs",
      name: "JET JWL-1221VS 12 x 21 Inch Variable-Speed Wood Lathe",
      imageUrl: "https://m.media-amazon.com/images/I/41QJOS0lOQL._SL500_.jpg",
      amazonUrl: "https://www.amazon.com/dp/B00BGBVJCU?tag=machinefanatic-20",
      label: "Best long-term wood lathe",
      why: "Three belt ranges from 60 to 3,600 RPM, a spindle lock, 24 indexing positions and 21 inches between centers from an established brand.",
    },
    {
      id: "vevor-metal-lathe",
      name: "VEVOR 7 x 14 Inch Benchtop Metal Lathe, 550W",
      imageUrl: "https://m.media-amazon.com/images/I/417uXoYfwYL._SL500_.jpg",
      amazonUrl: "https://www.amazon.com/dp/B09FDVMYXS?tag=machinefanatic-20",
      label: "Best entry metal lathe",
      why: "A 550 W benchtop machine with a 4 inch three-jaw chuck, 4-way tool post and digital speed display. Operation is manual despite the CNC wording.",
    },
  ],
  imageCredits: [
    {
      image: "Hwacheon centre lathe",
      author: "Glenn McKechnie",
      license: "CC BY-SA 3.0",
      source: "https://commons.wikimedia.org/wiki/File:HwacheonCentreLathe_460x1000.jpg",
    },
    {
      image: "Metal lathe in a school workshop",
      author: "Oleg Bor",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Metal_lathe._School_workshop.jpg",
    },
    {
      image: "Turning the outside of a wooden bowl",
      author: "Grwoodturning",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Bowl_turning.jpg",
    },
    {
      image: "Lathe in action making a bottle opener",
      author: "Andrew Magill from Boulder, USA",
      license: "CC BY 2.0",
      source: "https://commons.wikimedia.org/wiki/File:Lathe_in_action.jpg",
    },
    {
      image: "Lathe center drilling",
      author: "David English",
      license: "CC BY-SA 4.0",
      source: "https://commons.wikimedia.org/wiki/File:Lathe_Center_Drilling.jpg",
    },
  ],
  relatedLinks: [
    { title: "What is a plunge saw?", href: "/what-is-a-plunge-saw" },
    { title: "Best cordless circular saws", href: "/best-cordless-circular-saw" },
    { title: "Shop and garage category", href: "/categories/shop-garage" },
    { title: "How we review", href: "/how-we-review" },
  ],
};

export default article;
