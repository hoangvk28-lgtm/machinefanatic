
## Small-engine fuel cluster (writer 2: mix, no-start, carburetor, ethanol, winter storage)
- 2-stroke 50:1 = 128 oz / 50 = 2.56 oz, sold as 2.6 oz per gallon. Husqvarna US/CA pages: 50:1 for products up to 75cc, 2.5 oz per gallon; metric 20 ml per liter. Stihl: 50:1 most models with its own oil, check manual. Older/other-oil ratios (40:1, 32:1) exist; follow the manual.
- Ethanol: B&S and Honda accept up to 10% ethanol (E10), E15 not approved for small engines. EPA pump label warns E15 against lawn mowers, chain saws. Ethanol-free canned fuel is the safe choice for seldom-used equipment.
- Stale fuel: B&S says gasoline goes stale in about 30 days; stabilizer does not restore stale fuel (Honda). Stabilized storage claims differ (B&S up to 24 months, Honda 30 to 90 days), so say manuals differ. Run engine about 2 minutes after stabilizer to circulate. Honda: fill tank with fresh fuel when adding stabilizer.
- Competitor gaps: mechanism of ethanol phase separation and varnish in jets, diagnostic order (spark/fuel/air), 2-stroke vs 4-stroke storage differences, battery mower winter care.
# info-ope-1 research (OPE explainers: voltage tiers, blower noise, trimmer heads, hedge blade gap, 2 vs 4 stroke)
Note: written from the repo's existing cluster research (string-trimmers, hedge-trimmers, leaf-blowers) plus standard published figures. Only conservative, widely published numbers are used in the articles; vendor-specific claims are phrased as "check the spec sheet".

## 40v vs 60v vs 80v
- "Max" voltage is the fully charged peak; nominal voltage is lower (20V max = 18V nominal, 40V max = 36V nominal, 80V max = 72V nominal). Same cell count, different label.
- Voltage is not energy. Watt-hours = volts x amp-hours. Power in watts = volts x amps.
- Higher voltage delivers the same watts at lower current: less heat in cells, connectors and wiring, which is why big mowers and chainsaws sit on higher platforms.
- Competitors mostly say "higher voltage = more power" and stop. Gaps: pack size matters as much as voltage; tool class decides tier; platform lock-in; bare tool traps; weight of packs; some packs are dual voltage (switching).
## Blower noise
- dBA is logarithmic: +3 dB doubles sound energy, about +10 dB sounds twice as loud. Level falls about 6 dB per doubling of distance in open air.
- NIOSH recommended limit: 85 dBA for 8 hours with a 3 dB exchange rate (88 dBA 4h, 91 dBA 2h, 94 dBA 1h, 97 dBA 30 min, 100 dBA 15 min). OSHA workplace limit is 90 dBA 8h with a 5 dB exchange rate.
- Spec sheets quote either level at the operator ear or at 50 feet (some local ordinances cap at 65 dBA at 50 ft; ordinances vary). The two numbers are not comparable.
- Gas blowers are low-frequency and loud at the ear; cordless are quieter but high pitched at turbo. NRR labels overstate real-world protection; plan on roughly half.
- Gaps: ear vs 50 ft, exposure time math, turbo vs mid dial, nozzle, ear protection choice, neighbor distance.
## Trimmer heads
- Bump feed: tap head on the ground; centrifugal release lets a spring-loaded spool advance. Automatic feed: senses a speed change and advances without tapping (design varies). Fixed line: precut pieces or short loaded lengths, no feed.
- Failure modes: fused/melted line, cross-wound line, over-feed waste, worn eyelets, wrong diameter for the machine.
- Gaps: matching line diameter to power, how fused line happens, reload errors, where fixed heads win (rough, brushy, rocky edges).
## Hedge trimmer blade gap
- Tooth gap sets the thickest stem the blades can catch; blade length sets only pass width. Typical homeowner capacity roughly 5/8 to 3/4 inch; heavy pro gas units reach about 1 inch.
- Dual action blades cut on both strokes; strokes per minute and gap work together. Blade brake stops the blades after trigger release.
- Gaps: why thick stems push out instead of cutting, gap vs tooth profile, when to use loppers, blade length vs tip weight.
## 2 vs 4 stroke
- Two-stroke fires every crankshaft turn; four-stroke every second turn. Two-stroke lubricated by oil mixed in fuel (common ratios 50:1 or 40:1, follow the manual; 50:1 = 2.6 fl oz per gallon, 40:1 = 3.2 fl oz). Four-stroke has its own oil sump.
- Two-stroke: lighter, runs at any angle, higher power to weight, louder, higher exhaust smoke. Four-stroke: quieter, cleaner, heavier, needs oil level checks and limited tilt.
- Hybrid systems exist (4-mix style engines still need mixed fuel; true four-stroke trimmers use straight gas).
- Fuel: most small-engine makers specify gasoline with no more than 10 percent ethanol. Gaps: wrong-fuel mistakes in both directions, mixed fuel shelf life, tilting a four-stroke mower.
