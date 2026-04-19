export type BestGoalSlug =
  | "sleep"
  | "energy"
  | "focus"
  | "muscle"
  | "stress"
  | "immunity"
  | "joints"
  | "gut"
  | "testosterone"
  | "skin"
  | "longevity"
  | "weight-loss";

export interface BestPick {
  id: string;
  blurb: string;
}

export interface BestGoal {
  slug: BestGoalSlug;
  title: string;
  h1: string;
  emoji: string;
  tagline: string;
  intro: string[];
  picks: BestPick[];
  considerations: string[];
  faq: { q: string; a: string }[];
}

export const bestGoals: Record<BestGoalSlug, BestGoal> = {
  sleep: {
    slug: "sleep",
    emoji: "🌙",
    title: "Best Supplements for Sleep",
    h1: "Best supplements for sleep",
    tagline: "Fall asleep faster, stay asleep deeper — without the morning fog.",
    intro: [
      "Most people reach for melatonin. It's not usually the right first move. The supplements that actually move sleep metrics are the ones that calm your nervous system before bed — not the ones that hammer a single hormone.",
      "Start with magnesium. Add apigenin or glycine if you race thoughts at bedtime. Keep melatonin in reserve for jet lag or shift work, at a low dose.",
    ],
    picks: [
      { id: "mag", blurb: "Best overall. 200–400 mg magnesium glycinate activates GABA and relaxes muscle tone about an hour before bed." },
      { id: "ash", blurb: "Best for racing-mind sleep. Lowers cortisol so you actually wind down instead of lying awake replaying the day." },
      { id: "mel", blurb: "Best for jet lag or shift work only. Use 0.3–0.5 mg — not 5–10 mg. More melatonin makes sleep worse, not better." },
    ],
    considerations: [
      "Caffeine has a 5–8 hour half-life — afternoon coffee shows up as 2 a.m. wake-ups.",
      "Alcohol fragments REM; sleep feels shorter even at the same hours.",
      "Supplements can't out-optimize a bright screen at 11 p.m. Fix the inputs first.",
    ],
    faq: [
      { q: "Is magnesium or melatonin better for sleep?", a: "For most people, magnesium glycinate — it addresses the wind-down problem. Melatonin addresses the timing problem, which is a much smaller group (jet lag, shift work, circadian disorders)." },
      { q: "How long before I notice better sleep?", a: "Magnesium and glycine often work the first night. Deeper architectural changes (more time in deep and REM) take 2–3 weeks." },
      { q: "Can I take all three at once?", a: "Magnesium + ashwagandha is a common, well-tolerated combo. Add melatonin only if you have a specific timing problem." },
    ],
  },
  energy: {
    slug: "energy",
    emoji: "⚡",
    title: "Best Supplements for Energy",
    h1: "Best supplements for energy",
    tagline: "Steady, all-day energy — without another espresso.",
    intro: [
      "Chasing energy with more stimulants is a losing game. The supplements that actually raise your daily ceiling are the boring ones: B-vitamins, creatine, and a smarter caffeine protocol.",
      "If you wake up tired and hit a 3 p.m. wall, start with B-complex and creatine. Add caffeine + L-theanine for the morning push.",
    ],
    picks: [
      { id: "caff-lth", blurb: "Best for focused energy. 100 mg caffeine + 200 mg L-theanine is the stack with the most evidence for clean focus without jitters." },
      { id: "b", blurb: "Best for deficiency-driven fatigue. B-vitamins are cofactors for turning food into ATP — low B is common in vegetarians, vegans, and heavy drinkers." },
      { id: "creatine", blurb: "Underrated for energy. Replenishes ATP in brain and muscle cells — especially if you sleep poorly or train hard." },
    ],
    considerations: [
      "Iron deficiency mimics low energy. If you're female, vegan, or a heavy endurance trainer, get tested before supplementing.",
      "Caffeine past 2 p.m. wrecks the sleep that drives tomorrow's energy.",
      "Chronic fatigue isn't a supplement problem. Check thyroid, iron, B12, and sleep apnea first.",
    ],
    faq: [
      { q: "Will these replace my morning coffee?", a: "No, and they shouldn't. The goal is steadier energy alongside sensible caffeine — not another stimulant on top." },
      { q: "How fast do they work?", a: "Caffeine + L-theanine same day. B-complex takes 1–2 weeks if you're low. Creatine takes 2–4 weeks to fully saturate." },
    ],
  },
  focus: {
    slug: "focus",
    emoji: "🎯",
    title: "Best Supplements for Focus",
    h1: "Best supplements for focus and concentration",
    tagline: "Deep-work focus without the racing-heart side effects.",
    intro: [
      "Focus supplements aren't about cranking dopamine harder. They're about reducing the friction — noise, distraction, mental fatigue — so the work you were going to do anyway happens.",
      "The short list with real evidence is shorter than the supplement aisle suggests. Caffeine + L-theanine, omega-3s, and creatine all have randomized data on focus or working memory.",
    ],
    picks: [
      { id: "caff-lth", blurb: "Best combo for deep work. L-theanine takes the edge off caffeine without dulling the alertness." },
      { id: "omega3", blurb: "Best long-term pick. EPA/DHA support membrane fluidity in neurons — the effect compounds over months." },
      { id: "creatine", blurb: "Surprisingly strong for cognition under load. Helps when you're sleep-deprived or grinding a hard deadline." },
    ],
    considerations: [
      "If you're chronically fried, fix sleep before you stack nootropics — nothing beats a full night's rest for focus.",
      "Avoid 'proprietary blend' nootropic powders. Dose-per-ingredient is almost always too low to do anything.",
    ],
    faq: [
      { q: "Is L-theanine enough on its own?", a: "It works, but pairs better with caffeine. Alone it's mildly calming; with caffeine it's focus without the edge." },
      { q: "What about racetams or prescription nootropics?", a: "Out of scope here. We stick to things with strong safety data and over-the-counter availability." },
    ],
  },
  muscle: {
    slug: "muscle",
    emoji: "💪",
    title: "Best Supplements for Muscle Growth",
    h1: "Best supplements for muscle growth and recovery",
    tagline: "Build and recover faster — from the only three things that actually work.",
    intro: [
      "Most of the muscle-building supplement industry is noise. Three things matter: enough protein, creatine, and recovering well. Everything else is rounding error.",
      "If you can only buy three things, these are the three.",
    ],
    picks: [
      { id: "creatine", blurb: "The single most-studied performance supplement, period. 5 g daily, forever." },
      { id: "whey", blurb: "Protein is non-negotiable. Powder is convenience, not magic — hit ~0.7 g/lb daily, from anywhere." },
      { id: "omega3", blurb: "Blunts training-induced inflammation so you come back fresher for the next session." },
    ],
    considerations: [
      "No amount of supplement stacking compensates for under-eating protein or skipping sleep.",
      "Skip BCAAs if you're already hitting your protein target — they're redundant.",
      "Pre-workouts are mostly caffeine + beta-alanine tingles. Coffee is cheaper and works fine.",
    ],
    faq: [
      { q: "Do I need to load creatine?", a: "No. 5 g/day saturates fully in 3–4 weeks with zero GI issues." },
      { q: "Whey or plant protein?", a: "Both work. Whey has a slightly better leucine profile; plant blends close the gap at 30–40 g per serving." },
    ],
  },
  stress: {
    slug: "stress",
    emoji: "🧘",
    title: "Best Supplements for Stress",
    h1: "Best supplements for stress and anxiety",
    tagline: "Lower the baseline — without sedation.",
    intro: [
      "Stress supplements don't remove the stressor. What they can do is lower your baseline cortisol so the same workload doesn't feel like a five-alarm fire.",
      "Two ingredients have solid randomized data: ashwagandha and magnesium. Most of the rest is folklore.",
    ],
    picks: [
      { id: "ash", blurb: "Best evidence for cortisol reduction. KSM-66 or Sensoril extract, 300–600 mg daily for 4–8 weeks." },
      { id: "mag", blurb: "Low magnesium correlates with anxiety. Glycinate is the gentle, non-laxative form that also helps sleep." },
      { id: "omega3", blurb: "Higher-dose EPA has modest but real effects on mood and anxiety in multiple trials." },
    ],
    considerations: [
      "If anxiety is impairing daily life, talk to a clinician. Supplements are adjuncts, not treatment.",
      "Ashwagandha can lower thyroid medication effect — check with your doctor if you're on levothyroxine.",
    ],
    faq: [
      { q: "How long until ashwagandha kicks in?", a: "Most trials show measurable cortisol and perceived-stress drops by weeks 4–8." },
      { q: "Can I cycle ashwagandha?", a: "Some people do 8 weeks on / 2 off to avoid adaptation. Not mandatory — evidence is mixed." },
    ],
  },
  immunity: {
    slug: "immunity",
    emoji: "🛡️",
    title: "Best Supplements for Immunity",
    h1: "Best supplements for immune support",
    tagline: "Fewer sick days, year-round — starting with the deficiencies everyone has.",
    intro: [
      "Immune support isn't built the day you feel a tickle. It's built quietly over months, mostly by fixing the two deficiencies nearly everyone has: vitamin D and zinc.",
      "Then a probiotic to support the 70% of your immune system that lives in your gut.",
    ],
    picks: [
      { id: "vitd", blurb: "Single highest-impact pick. Most adults run low, especially in winter. 2,000–5,000 IU daily with K2." },
      { id: "zinc", blurb: "Critical for immune cell development. 15–25 mg daily; take with food to avoid nausea." },
      { id: "vitc", blurb: "Modest effect on cold duration. 1–2 g at the first sign of illness, not a daily megadose." },
      { id: "prob", blurb: "Multi-strain probiotic supports gut barrier and the immune tissue that lives there." },
    ],
    considerations: [
      "Megadosing vitamin C past 2 g/day just gives you GI upset — more isn't better.",
      "If you take zinc long-term, add 1–2 mg copper to prevent deficiency.",
    ],
    faq: [
      { q: "Does elderberry actually help?", a: "Modest evidence for shortening cold/flu duration if started within 48 hours. Not a daily staple." },
      { q: "How fast does vitamin D raise blood levels?", a: "6–8 weeks. The real endpoint is fewer sick days across a full season." },
    ],
  },
  joints: {
    slug: "joints",
    emoji: "🦴",
    title: "Best Supplements for Joint Health",
    h1: "Best supplements for joint health and mobility",
    tagline: "Move well, longer — with the ingredients with the most trials behind them.",
    intro: [
      "Joint supplements are a crowded, noisy aisle. Three picks have enough evidence to take seriously: collagen peptides, glucosamine/chondroitin, and omega-3.",
      "Expect modest, cumulative effects — weeks to months — not dramatic overnight relief.",
    ],
    picks: [
      { id: "col", blurb: "Hydrolyzed collagen (10–15 g) with vitamin C boosts tendon and cartilage synthesis in training trials." },
      { id: "gluco", blurb: "Glucosamine + chondroitin has decades of data on osteoarthritis pain and function." },
      { id: "omega3", blurb: "EPA/DHA lower joint inflammation — the closest supplement equivalent to ibuprofen, without the GI risk." },
    ],
    considerations: [
      "Strength training protects joints better than any supplement. Don't skip it.",
      "Weight loss (even 5–10%) does more for knee pain than any stack.",
    ],
    faq: [
      { q: "How long before collagen helps?", a: "Tendon/cartilage markers shift in weeks; symptomatic change in 2–3 months." },
      { q: "Does glucosamine really work?", a: "The highest-quality trials show small-to-modest pain reduction in knee OA. Not a cure — a useful adjunct." },
    ],
  },
  gut: {
    slug: "gut",
    emoji: "🌿",
    title: "Best Supplements for Gut Health",
    h1: "Best supplements for gut health and digestion",
    tagline: "Feed the microbiome — fiber first, then strains.",
    intro: [
      "Most people skip to probiotics. The bigger lever is fiber — prebiotic fiber is what your good bacteria actually eat.",
      "Start with psyllium. Add a multi-strain probiotic if you've been on recent antibiotics or have chronic issues.",
    ],
    picks: [
      { id: "fiber", blurb: "Psyllium husk — 5–10 g daily. Feeds gut bacteria, normalizes stool, lowers cholesterol." },
      { id: "prob", blurb: "Multi-strain, 10–50 billion CFU. Strain matters more than count — look for Lactobacillus + Bifidobacterium blends." },
      { id: "omega3", blurb: "Anti-inflammatory support for gut lining, especially useful with IBS or IBD." },
    ],
    considerations: [
      "Start fiber low and ramp — too much too fast causes bloating.",
      "A diverse diet (30+ plants/week) outperforms any probiotic for microbiome diversity.",
    ],
    faq: [
      { q: "Probiotic or prebiotic first?", a: "Prebiotic (fiber). It feeds what's already there — often more effective than dropping in new strains." },
      { q: "Do I need a fancy probiotic?", a: "Usually no. A well-known multi-strain formula at 10+ billion CFU is plenty for most people." },
    ],
  },
  testosterone: {
    slug: "testosterone",
    emoji: "⚔️",
    title: "Best Supplements for Testosterone",
    h1: "Best supplements for testosterone support",
    tagline: "Fill the deficiencies that tank T — not the scammy 'boosters.'",
    intro: [
      "Most 'T-boosters' do nothing. The supplements that actually move testosterone in trials are the ones that fix a specific deficiency: zinc, vitamin D, and (indirectly) stress via ashwagandha.",
      "If your T is low, the biggest levers are weight, sleep, and strength training. Supplements are rounding error by comparison.",
    ],
    picks: [
      { id: "vitd", blurb: "Men with low vitamin D see testosterone rise back to normal range once levels are restored." },
      { id: "zinc", blurb: "Zinc deficiency directly lowers testosterone. Fix the deficiency, not the symptom." },
      { id: "ash", blurb: "Ashwagandha modestly raises testosterone in stressed men — the mechanism is cortisol reduction." },
      { id: "creatine", blurb: "Not a T-booster, but raises DHT slightly and pairs well with the strength training that actually moves T." },
    ],
    considerations: [
      "Body fat is the single biggest lever — adipose tissue converts testosterone to estrogen.",
      "If labs show clinically low T, talk to a doctor. Supplements can't replace TRT when it's clinically indicated.",
    ],
    faq: [
      { q: "Do tribulus or fenugreek work?", a: "Tribulus does not raise testosterone in quality trials. Fenugreek has weak, mixed evidence." },
      { q: "How long until zinc or vitamin D move testosterone?", a: "6–12 weeks once deficiency is corrected. No effect if you weren't deficient to begin with." },
    ],
  },
  skin: {
    slug: "skin",
    emoji: "✨",
    title: "Best Supplements for Skin",
    h1: "Best supplements for skin health",
    tagline: "Skin from the inside — what actually has data.",
    intro: [
      "Most 'beauty-from-within' marketing is marketing. Three ingredients have real randomized data on skin outcomes: collagen peptides, omega-3, and vitamin C.",
      "Topicals (retinoid, SPF) still outperform any supplement for skin. Think additive, not replacement.",
    ],
    picks: [
      { id: "col", blurb: "Hydrolyzed collagen improves skin elasticity and hydration in multiple trials — 10 g daily, 8+ weeks." },
      { id: "omega3", blurb: "EPA/DHA lower inflammation and support skin barrier function — helpful for eczema, acne, rosacea." },
      { id: "vitc", blurb: "Cofactor for collagen synthesis. Pair with collagen peptides for compounded effect." },
    ],
    considerations: [
      "SPF daily does more than any supplement for long-term skin quality.",
      "Hydration and sleep show up on your face faster than any capsule.",
    ],
    faq: [
      { q: "How long until collagen shows results?", a: "Measurable elasticity/hydration changes in 8–12 weeks of consistent use." },
      { q: "Is biotin worth it?", a: "Only if you're deficient (rare). Otherwise no change to hair/skin/nails and can skew lab tests." },
    ],
  },
  longevity: {
    slug: "longevity",
    emoji: "🧬",
    title: "Best Supplements for Longevity",
    h1: "Best supplements for longevity",
    tagline: "The boring, well-studied picks — not the biohacker of the month.",
    intro: [
      "Longevity supplements get hype-cycled relentlessly. The picks with the longest safety record and broadest cardiometabolic evidence are, frankly, boring.",
      "Omega-3s, vitamin D, creatine, and magnesium. Anything newer should be considered experimental.",
    ],
    picks: [
      { id: "omega3", blurb: "Higher omega-3 index is associated with lower all-cause mortality in large cohort studies." },
      { id: "vitd", blurb: "Low vitamin D correlates with a long list of poor outcomes. Fixing deficiency is a no-brainer." },
      { id: "creatine", blurb: "Maintains muscle and cognition with age — the single best hedge against sarcopenia after 50." },
      { id: "mag", blurb: "Most adults are low. Linked to cardiovascular, metabolic, and sleep outcomes." },
    ],
    considerations: [
      "VO2 max, strength, and sleep quality are better longevity predictors than any supplement. Train accordingly.",
      "Be skeptical of anything marketed as 'anti-aging' with a paywall and a $200/month price tag.",
    ],
    faq: [
      { q: "What about NMN, resveratrol, rapamycin?", a: "Interesting, under-researched in humans, and often expensive. Not on this list until the evidence catches up." },
    ],
  },
  "weight-loss": {
    slug: "weight-loss",
    emoji: "⚖️",
    title: "Best Supplements for Weight Loss",
    h1: "Best supplements for weight loss",
    tagline: "There's no magic pill — but a few picks make the fundamentals easier.",
    intro: [
      "No supplement replaces a calorie deficit. What some can do is support the fundamentals: protein intake, satiety, energy, and muscle preservation while cutting.",
      "Protein and fiber are the two picks most worth the money. Everything else is optimization at best.",
    ],
    picks: [
      { id: "whey", blurb: "Protein is the #1 satiety macro. Hitting ~1g/lb of goal weight preserves muscle and kills hunger." },
      { id: "fiber", blurb: "Psyllium slows digestion and blunts appetite — cheap, evidence-backed, underrated." },
      { id: "caff-lth", blurb: "Caffeine mildly raises energy expenditure and suppresses appetite. L-theanine takes the jittery edge off." },
      { id: "creatine", blurb: "Preserves strength and muscle while in a deficit — critical if you want to keep the muscle under the fat." },
    ],
    considerations: [
      "Strength train while cutting. Weight loss without resistance training is 25–30% muscle.",
      "Skip fat-burner blends. They're caffeine + stimulants with lawsuits attached.",
    ],
    faq: [
      { q: "What about berberine or GLP-1 agonists?", a: "GLP-1s (Ozempic, Wegovy) work — but they're prescription. Berberine has modest metabolic effects; not a weight-loss drug." },
    ],
  },
};

export const bestGoalList = Object.values(bestGoals);
