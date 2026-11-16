import type { LegacyArticleModule } from "@/components/guide/LegacyArticlePage";

const article: LegacyArticleModule = {
  slug: "generator-thd-and-sensitive-electronics",
  title: "Generator THD and Sensitive Electronics",
  metaTitle: "Generator THD Explained",
  metaDescription: "Understand generator total harmonic distortion, voltage and frequency quality, sensitive loads, AVR limits, inverter output, and protection options.",
  kicker: "Explainer",
  heroImage: { src: "/images/articles/gen-inverter-enclosed.webp", alt: "Compact 2300 watt inverter generator in a closed plastic shell standing on pavement" },
  lastUpdated: "2026-11-24",
  readTime: "17 min",
  quickAnswer: "Total harmonic distortion measures how much a generator's voltage waveform differs from its fundamental sine wave. Lower THD generally gives sensitive electronics an easier input, and many inverter generators specify less than 3 percent. THD is only one part of power quality, so voltage regulation, frequency stability, transients, grounding, and the connected device's own limits also matter.",
  html: `<h2 id="what-thd-measures">What THD measures</h2>
<p>A perfect alternating voltage follows a smooth sine wave at the fundamental frequency. Real generator output contains smaller waveform components at multiples of that frequency. Total harmonic distortion expresses the combined harmonic content relative to the fundamental as a percentage.</p>
<p>On a 60 hertz system, the third harmonic occurs at 180 hertz, the fifth at 300 hertz, and higher orders continue at integer multiples. These components add to the fundamental and reshape the voltage delivered to equipment.</p>
<p>A low percentage means the waveform remains close to its fundamental sine shape. A higher percentage means more harmonic content. The number does not by itself describe every spike, sag, frequency change, or interruption.</p>
<table><thead><tr><th>Power quality factor</th><th>What it describes</th><th>What THD does not tell you</th></tr></thead><tbody><tr><td>Total harmonic distortion</td><td>Harmonic content relative to the fundamental</td><td>Exact voltage, frequency, or interruption duration</td></tr><tr><td>Voltage regulation</td><td>How closely output stays near nominal voltage</td><td>Waveform harmonic content</td></tr><tr><td>Frequency stability</td><td>How closely output stays near 60 hertz</td><td>Voltage waveform shape</td></tr><tr><td>Transient response</td><td>Behavior when load changes suddenly</td><td>Long term steady state quality</td></tr><tr><td>Surge event</td><td>Short overvoltage or current event</td><td>Continuous waveform distortion</td></tr></tbody></table>
<figure><img src="/images/articles/oscilloscope-sine-wave.webp" alt="Clean green sine wave trace on an oscilloscope screen with the voltage and time scales shown" width="1333" height="1076" loading="lazy" /><figcaption>A clean sine wave on an oscilloscope. Distortion is measured as how far a real waveform departs from this shape.</figcaption></figure>

<h2 id="voltage-thd-versus-current-thd">Voltage THD versus current THD</h2>
<p>Generator discussions often say only “THD,” but voltage distortion and current distortion are different measurements. Voltage THD describes the source waveform available at the outlet. Current THD describes the non sinusoidal current drawn by a connected load.</p>
<p>Electronic power supplies, LED drivers, variable speed motor controls, and battery chargers can draw current in pulses. That distorted current flows through generator impedance and can distort voltage further. The generator and load influence one another.</p>
<p>A generator can show acceptable voltage THD with a simple resistive test load and perform differently with a group of nonlinear electronic loads. Test condition and load percentage belong beside any published THD number.</p>
<p>Consumer product pages rarely state measurement bandwidth, harmonic order, instrument accuracy, or load type. Treat a published maximum from a reputable manufacturer as useful, but do not infer laboratory detail that is not provided.</p>

<h2 id="how-inverter-generators-control-the-waveform">How inverter generators control the waveform</h2>
<p>An inverter generator rectifies alternator output to direct current, then uses electronic switches to synthesize alternating current. Feedback control sets voltage and frequency independently of exact engine speed. This architecture can maintain a low distortion waveform across a useful load range.</p>
<p>Generac specifies less than 3 percent THD for certain inverter generator models and describes that output as suitable for sensitive electronics. Other manufacturers publish similar model specific limits. Verify the exact specification rather than assuming every enclosed generator meets the same value.</p>
<p>Inverter electronics do not eliminate all problems. Overload, overheating, component failure, poor grounding, damaged cords, and incompatible equipment can still cause shutdown or malfunction. The inverter must also handle the connected load's starting and inrush current.</p>
<p>Our <a href="/inverter-generator-vs-conventional-generator">inverter versus conventional generator comparison</a> explains the full conversion path. In this article, the key benefit is that electronic synthesis gives the manufacturer direct control over outlet waveform and frequency.</p>
<figure><img src="/images/articles/oscilloscope-distorted-waveform.webp" alt="Analogue oscilloscope displaying an irregular green trace across its screen" width="1400" height="783" loading="lazy" /><figcaption>An analogue oscilloscope showing an irregular trace. This is what distortion looks like before any number is attached to it.</figcaption></figure>

<h2 id="what-an-avr-can-and-cannot-do">What an AVR can and cannot do</h2>
<p>An automatic voltage regulator adjusts alternator excitation to keep output voltage near its target as load changes. A good AVR improves voltage stability and helps the generator respond to varying demand.</p>
<p>Voltage regulation is not the same as waveform reconstruction. An AVR does not automatically reduce every harmonic to inverter generator levels. Alternator winding design, magnetic saturation, engine speed, load shape, and regulator design all influence distortion.</p>
<p>Some conventional generators publish low THD output through careful alternator and regulator design. Others provide no figure. “AVR equipped” should therefore not be read as proof of a particular THD percentage.</p>
<p>A generator can hold 120 volts while its waveform remains distorted. It can also have low harmonic distortion but experience a temporary voltage dip when a large compressor starts. The specification needs more than one number.</p>
<div class="mf-callout"><p><strong>AVR is not an inverter:</strong> an AVR controls voltage by adjusting excitation. An inverter rebuilds the alternating waveform electronically.</p></div>

<h2 id="which-devices-are-sensitive">Which devices are sensitive?</h2>
<p>“Sensitive electronics” is a broad label. Computers, network equipment, audio systems, televisions, medical devices, battery chargers, furnace control boards, variable speed appliances, and uninterruptible power supplies can all respond differently to distorted or unstable input.</p>
<p>Modern switch mode power supplies often accept a wide voltage range and convert incoming power internally. Some tolerate imperfect generator output well. Others shut down, restart, run hot, produce noise, or refuse to charge when the waveform or frequency falls outside their design.</p>
<p>Motors can also be affected. Harmonic voltage can produce additional heating, vibration, and torque pulsation. Electronic motor drives may reject input or report faults. A device does not need a computer screen to depend on power quality.</p>
<p>Simple resistance heaters and incandescent lamps are generally less concerned with waveform shape, although voltage still controls heat and brightness. They can consume substantial continuous power and cause voltage drop that affects other equipment.</p>
<table><thead><tr><th>Load</th><th>Possible response to poor generator power</th><th>What to check</th></tr></thead><tbody><tr><td>Laptop or computer supply</td><td>Restart, refusal to charge, excess heating</td><td>Input range and manufacturer guidance</td></tr><tr><td>UPS</td><td>Rejects generator input and remains on battery</td><td>Accepted voltage, frequency, and generator mode</td></tr><tr><td>Furnace control</td><td>Lockout, ignition fault, blower control issue</td><td>Equipment requirements and grounding polarity</td></tr><tr><td>Medical device</td><td>Alarm, shutdown, inaccurate operation</td><td>Manufacturer approved backup source</td></tr><tr><td>Variable speed appliance</td><td>Drive fault or abnormal sound</td><td>Power quality specification</td></tr><tr><td>Resistance heater</td><td>Usually operates, but can depress generator voltage</td><td>Continuous wattage and circuit capacity</td></tr></tbody></table>

<h2 id="there-is-no-universal-safe-percentage">There is no universal safe percentage</h2>
<p>Many articles repeat that less than 5 or 6 percent THD is safe for electronics. That can be a useful shopping target, but it is not a guarantee for every device or operating condition. Equipment manufacturers define their own acceptable input.</p>
<p>A generator specifying less than 3 percent provides a clearer margin for electronics than a model with no published THD data. The number should still be checked across relevant load conditions when the manufacturer provides that detail.</p>
<p>Medical equipment deserves direct confirmation. Contact the device manufacturer and ask whether the proposed generator or inverter output is approved. Consider a battery backup that prevents interruption during generator startup, refueling, or failure.</p>
<p>For general electronics and home loads, the <a href="/guide/best-inverter-generators">inverter generator guide</a> emphasizes models with documented output specifications. Documentation is more valuable than an undefined “clean power” badge.</p>

<h2 id="why-a-ups-may-reject-generator-power">Why a UPS may reject generator power</h2>
<p>An uninterruptible power supply monitors input before transferring its load from battery to line power. If voltage or frequency falls outside its acceptance window, it can remain on battery even though the generator is running.</p>
<p>Rapid frequency variation, voltage dips during motor starts, distorted waveform zero crossings, or poor neutral and grounding arrangements can trigger rejection. The UPS may repeatedly transfer between battery and line, which is stressful for connected equipment and the battery.</p>
<p>Some UPS units provide a generator sensitivity setting that widens accepted input limits. Use it only according to the UPS manufacturer because a wider window trades selectivity for compatibility. It does not repair the source waveform.</p>
<p>An online double conversion UPS rebuilds output continuously, but it still has input limits and capacity constraints. Do not assume any UPS will make an unsuitable generator safe for every load.</p>
<figure><img src="/images/articles/uninterruptible-power-supply.webp" alt="Tower uninterruptible power supply standing on a tiled floor" width="1152" height="2048" loading="lazy" /><figcaption>A tower uninterruptible power supply. Its transfer logic watches the incoming waveform, and generator power outside its window gets rejected.</figcaption></figure>

<h2 id="surge-protectors-do-not-fix-thd">Surge protectors do not fix THD</h2>
<p>A basic surge protector clamps certain short overvoltage events. It does not continuously reshape a distorted sine wave, regulate frequency, or support voltage through a motor start.</p>
<p>A line conditioner can address selected voltage or noise problems, but product capabilities vary. Some use transformers, filters, or voltage correction while leaving harmonic distortion largely unchanged. Read measured performance rather than relying on the word “conditioner.”</p>
<p>An inverter charger or online UPS may rebuild output for loads within its rating, but it introduces conversion capacity, battery, grounding, and charging considerations. A protection accessory cannot compensate for an undersized generator.</p>
<p>The best solution is usually to select a generator with documented output suitable for the load. Add protective equipment only for a defined function.</p>

<h2 id="load-changes-can-be-worse-than-steady-thd">Load changes can be worse than steady THD</h2>
<p>A published THD figure may be measured after the generator has stabilized. Real equipment switches on and off. A compressor start can pull voltage down, slow the engine, shift frequency, and momentarily distort the waveform.</p>
<p>A generator with low steady state THD can still be undersized for a motor. Conversely, a large conventional generator may start the motor easily while providing less refined steady output for electronics. Both capacity and power quality must fit.</p>
<p>Separate large motor circuits from critical electronics where practical. Start motors before connecting delicate loads, and avoid operating near generator capacity. Automatic loads can still cycle later, so startup sequencing is not complete protection.</p>
<p>Check <a href="/running-watts-vs-starting-watts">running watts versus starting watts</a> when electronics share a generator with pumps, refrigeration, or air conditioning. A voltage dip may reflect insufficient surge capacity rather than harmonic distortion alone.</p>

<h2 id="how-to-evaluate-a-generator-specification">How to evaluate a generator specification</h2>
<ol><li>Find a numeric maximum THD specification for the exact model.</li><li>Check whether the value applies across the full load range or at one condition.</li><li>Confirm voltage regulation and frequency specification.</li><li>Check running and starting capacity for the complete load group.</li><li>Verify neutral bonding, grounding, outlets, and intended connection.</li><li>Read the connected equipment's input requirements.</li><li>Ask the manufacturer when medical, safety, or critical process equipment is involved.</li></ol>
<p>If no THD figure is published, do not invent one from generator category. Ask the manufacturer or select a model with transparent documentation. A conventional generator can have good output, but that conclusion needs evidence.</p>
<p>For compact electronics and quiet environments, compare the <a href="/guide/best-quiet-inverter-generator">quiet inverter generator options</a>. Noise and THD are separate specifications even though inverter machines often perform well on both.</p>

<h2 id="measurement-limitations">Measurement limitations</h2>
<p>A basic multimeter may show voltage and frequency but cannot fully characterize harmonic distortion or fast transients. Some true RMS meters report THD, while a power quality analyzer provides more detailed harmonic and event data.</p>
<p>Measurement must be performed safely with equipment rated for the circuit. Generator outlets can deliver lethal current. Probing energized panels or exposed conductors belongs to qualified personnel.</p>
<p>Record load type, load percentage, fuel, economy mode, voltage, frequency, and test location with any result. A number without conditions is difficult to reproduce or compare.</p>
<p>Do not use one no load reading to declare a generator safe for electronics. The source should be evaluated with representative loads and transitions when critical compatibility must be proven.</p>
<figure><img src="/images/articles/clamp-meter-voltage.webp" alt="Clamp meter with its probes in a wall socket reading a voltage on the display" width="1400" height="2023" loading="lazy" /><figcaption>A clamp meter reading voltage at a socket. It confirms the voltage, and says nothing at all about the shape of the waveform behind it.</figcaption></figure>

<h2 id="electrical-and-operating-safety">Electrical and operating safety</h2>
<p>Low THD does not make a generator electrically harmless. Use correctly rated cords, dry connections, intact grounding conductors, and approved transfer equipment for building connections. Never backfeed through a receptacle.</p>
<p>Operate combustion generators outdoors at least 20 feet from buildings with exhaust directed away from openings. Inverter models produce carbon monoxide just like conventional models.</p>
<p>Do not open an inverter enclosure or probe internal high voltage circuits unless qualified and following service procedures. Direct current bus capacitors can retain hazardous energy after shutdown.</p>
<div class="mf-callout"><p><strong>Clean power is not safe placement:</strong> a generator can produce an excellent waveform and lethal exhaust at the same time.</p></div>

<h2 id="a-compatibility-troubleshooting-sequence">A compatibility troubleshooting sequence</h2>
<p>If an electronic load refuses generator power, disconnect other loads and begin with the equipment manuals. Confirm that generator voltage, frequency, and grounding indication are normal. Do not repeatedly reconnect an expensive device while the generator is hunting or showing overload.</p>
<p>Test a simple known load, such as an appropriate lamp, to confirm that the outlet is energized. If simple loads work but the electronic device fails, compare the device input range with the generator specification. A qualified technician can then measure voltage, frequency, THD, and transient behavior.</p>
<p>Watch what happens when motors cycle. A computer restarting at the exact moment a refrigerator or pump starts points toward voltage sag or transient response rather than steady THD alone. Separating the motor temporarily can help identify the relationship without proving the final system safe.</p>
<p>Check cords and connections for length, conductor size, heat, looseness, and damage. Voltage lost in a cord can push an otherwise acceptable source below the device input limit. Do not defeat grounding pins or reverse conductors to make equipment operate.</p>
<p>If a UPS rejects the source, review its event log and sensitivity settings with the manufacturer instructions. Do not widen the acceptance window until the actual generator output has been evaluated. A protection device that refuses power may be reporting a genuine condition.</p>
<p>For critical equipment, document the final working configuration and have the equipment manufacturer approve it. Compatibility observed for a few minutes does not establish long term thermal or safety performance.</p>
<p>Repeat the evaluation after changing the generator, UPS, charger, extension cord, transfer equipment, or major motor load. A system is a chain, and replacing one component can alter grounding, voltage drop, inrush response, or harmonic interaction.</p>
<p>Keep event logs when the equipment provides them. Time stamps showing low voltage, out of range frequency, or repeated battery transfer can direct troubleshooting toward a specific source condition instead of blaming THD for every symptom.</p>
<p>Also repeat the check at the highest normal load. A generator that looks stable with one laptop may behave differently when refrigeration, chargers, lighting, and a blower operate together. Record the complete load state with the result.</p>

<h2 id="faq">Frequently Asked Questions</h2>
<h3>What THD is safe for electronics?</h3>
<p>There is no universal percentage for every device. Less than 3 percent is a common inverter specification and provides a useful target, but the equipment manufacturer's input requirements control.</p>
<h3>Can high THD damage a laptop?</h3>
<p>Poor input can cause heating, malfunction, shutdown, or reduced life in some power supplies. Actual risk depends on distortion, voltage, frequency, duration, load, and the laptop charger's design.</p>
<h3>Does an AVR reduce THD?</h3>
<p>An AVR primarily regulates voltage by controlling alternator excitation. It may contribute to overall performance, but AVR presence alone does not prove low harmonic distortion.</p>
<h3>Will a surge protector clean generator power?</h3>
<p>No. A basic surge protector addresses certain short overvoltage events. It does not rebuild the waveform or regulate frequency.</p>
<h3>Why will my UPS not accept generator power?</h3>
<p>The UPS may see voltage, frequency, waveform, or grounding outside its acceptance window. Motor starts and generator hunting can also cause repeated transfer to battery.</p>
<h3>Are all inverter generators under 3 percent THD?</h3>
<p>No. Many publish low distortion output, but the exact limit is model specific. Check the manufacturer specification.</p>
<h3>Can I measure THD with a normal multimeter?</h3>
<p>Most basic meters cannot. Use a suitable true RMS meter with THD capability or a power quality analyzer, operated by someone qualified for the electrical exposure.</p>

<h2 id="bottom-line">Bottom line</h2>
<p>THD is a useful measure of waveform distortion, not a complete verdict on generator power. Choose documented low distortion output for sensitive equipment, then verify voltage, frequency, transient response, starting capacity, grounding, and the device's own limits. An inverter generator is usually the clearest consumer option, but its exact specification still matters.</p>`,
  products: [],
  imageCredits: [
    {"image":"gen-inverter-enclosed.webp","author":"Famartin","license":"CC BY-SA 4.0","source":"https://commons.wikimedia.org/wiki/File:Black_Diamond_2300_Watt_Inverter_Generator.jpg","via":"Wikimedia Commons"},
    {"image":"oscilloscope-distorted-waveform.webp","author":"Holger Ellgaard","license":"CC BY-SA 4.0","source":"https://commons.wikimedia.org/wiki/File:Esselte_oscilloscope.jpg","via":"Wikimedia Commons"},
    {"image":"uninterruptible-power-supply.webp","author":"Tahir mq","license":"CC BY-SA 4.0","source":"https://commons.wikimedia.org/wiki/File:Uninterruptible_power_supply.jpg","via":"Wikimedia Commons"},
    {"image":"oscilloscope-sine-wave.webp","author":"Pittigrilli","license":"CC BY-SA 4.0","source":"https://commons.wikimedia.org/wiki/File:Sine_wave_10_kHz_displayed_on_analog_oscilloscope.jpg","via":"Wikimedia Commons"},
    {"image":"clamp-meter-voltage.webp","author":"Benjaminpvera","license":"CC BY-SA 4.0","source":"https://commons.wikimedia.org/wiki/File:AC_Clamp_Meter_measuring_voltage.jpg","via":"Wikimedia Commons"},
  ],
  relatedLinks: [
    {"title":"Best Inverter Generator","href":"/guide/best-inverter-generator"},
    {"title":"Best Inverter Generators","href":"/guide/best-inverter-generators"},
    {"title":"Best Quiet Inverter Generator","href":"/guide/best-quiet-inverter-generator"},
    {"title":"Inverter vs Conventional Generator","href":"/inverter-generator-vs-conventional-generator"},
  ],
};

export default article;
