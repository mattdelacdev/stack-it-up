export interface ComparePair {
  slug: string;
  a: string;
  b: string;
  question: string;
  verdict: string;
  summary: string;
  pickA: { title: string; copy: string };
  pickB: { title: string; copy: string };
  bothWhen?: string;
  faq?: { q: string; a: string }[];
}

export const comparePairs: ComparePair[] = [
  {
    slug: "creatine-vs-whey",
    a: "creatine",
    b: "whey",
    question: "Creatine vs protein powder: which should you take first?",
    verdict: "Protein first, creatine second — but most people should take both.",
    summary:
      "Protein solves a real nutritional gap (most people under-eat it). Creatine is the single most-studied performance supplement, but it only matters if the protein foundation is already there.",
    pickA: {
      title: "Pick creatine if…",
      copy: "You already hit ~0.7 g/lb of protein from food. You want strength, power, and a small cognitive edge. 5 g/day, forever.",
    },
    pickB: {
      title: "Pick protein if…",
      copy: "You're chronically under 100 g/day of protein, or you train and can't eat enough whole-food protein. Powder is convenience, not magic.",
    },
    bothWhen:
      "Most lifters should run both. They solve different problems — protein is a macronutrient, creatine is a performance enhancer.",
    faq: [
      { q: "Should I mix them together?", a: "Sure. Post-workout shake with 25–40 g protein + 5 g creatine is fine. Creatine isn't time-sensitive." },
      { q: "Will creatine make me gain weight?", a: "1–3 lbs of water weight in the first few weeks. It's intramuscular — the point." },
    ],
  },
  {
    slug: "magnesium-vs-melatonin",
    a: "mag",
    b: "mel",
    question: "Magnesium vs melatonin for sleep: which works better?",
    verdict: "Magnesium for most people. Melatonin only for timing problems.",
    summary:
      "These solve different problems. Magnesium calms a wired nervous system so you can wind down. Melatonin shifts your circadian clock — useful for jet lag, shift work, and true phase disorders, not for regular insomnia.",
    pickA: {
      title: "Pick magnesium if…",
      copy: "You can't wind down, your mind races, you wake up tense. Start with 200–400 mg glycinate 30–60 min before bed.",
    },
    pickB: {
      title: "Pick melatonin if…",
      copy: "You're jet-lagged, on a weird shift, or have a true circadian phase disorder. Use 0.3–0.5 mg — big doses make sleep worse.",
    },
    faq: [
      { q: "Can I take both?", a: "Yes, and they don't interact. Use melatonin only when you need it; magnesium can be nightly." },
      { q: "Why is low-dose melatonin better?", a: "Higher doses (5–10 mg) overshoot physiological levels and cause next-day grogginess without better sleep." },
    ],
  },
  {
    slug: "ashwagandha-vs-magnesium",
    a: "ash",
    b: "mag",
    question: "Ashwagandha vs magnesium: which for stress?",
    verdict: "Ashwagandha for cortisol; magnesium for muscle tension and sleep.",
    summary:
      "Both reduce stress, but through different mechanisms. Ashwagandha lowers cortisol over weeks. Magnesium calms the neuromuscular system tonight.",
    pickA: {
      title: "Pick ashwagandha if…",
      copy: "Your stress is chronic and daily — racing heart, tight jaw, can't switch off. 300–600 mg KSM-66, 4–8 weeks to full effect.",
    },
    pickB: {
      title: "Pick magnesium if…",
      copy: "You're clenched and can't sleep. Glycinate at night is the near-instant muscle relaxant + sleep aid combo.",
    },
    bothWhen: "Excellent combo — ashwagandha 600 mg/day + magnesium glycinate at bedtime covers both cortisol and wind-down.",
    faq: [
      { q: "Can I stack them?", a: "Yes. They work on separate systems and are commonly combined in sleep/stress stacks." },
    ],
  },
  {
    slug: "collagen-vs-whey",
    a: "col",
    b: "whey",
    question: "Collagen vs whey protein: are they interchangeable?",
    verdict: "No. They do different jobs.",
    summary:
      "Whey is a complete protein for muscle growth. Collagen is missing tryptophan — it's not useful for muscle building. Collagen's lane is skin, tendon, and joint support.",
    pickA: {
      title: "Pick collagen if…",
      copy: "Your goal is skin, joint, or tendon health. 10–15 g/day with vitamin C, for 8+ weeks.",
    },
    pickB: {
      title: "Pick whey if…",
      copy: "Your goal is muscle protein synthesis. Complete amino profile, high leucine — the muscle-building standard.",
    },
    bothWhen: "They don't compete. Many people take whey for muscle and collagen for connective tissue.",
    faq: [
      { q: "Can collagen replace my protein shake?", a: "No. It doesn't have the full amino profile needed for muscle growth — use it alongside, not instead of, complete protein." },
    ],
  },
  {
    slug: "vitamin-d-vs-vitamin-c",
    a: "vitd",
    b: "vitc",
    question: "Vitamin D vs vitamin C: which matters more for immunity?",
    verdict: "Vitamin D — for most people, by a wide margin.",
    summary:
      "Most adults are low in vitamin D. Few are low in vitamin C. Fixing vitamin D deficiency has the bigger payoff for immune function, mood, and bone health.",
    pickA: {
      title: "Pick vitamin D if…",
      copy: "You live north of 37°N latitude, work indoors, or rarely get sun on bare skin. 2,000–5,000 IU daily with K2 and fat." ,
    },
    pickB: {
      title: "Pick vitamin C if…",
      copy: "You're about to get sick or already feel it coming on. 1–2 g at the first sign. Not a daily megadose." ,
    },
    bothWhen: "Daily vitamin D + situational vitamin C is the simple, evidence-backed stack.",
    faq: [
      { q: "Can I take too much vitamin D?", a: "Yes, but it takes 10,000+ IU daily for months. Standard 2–5k IU is well inside the safety margin." },
    ],
  },
  {
    slug: "zinc-vs-vitamin-c",
    a: "zinc",
    b: "vitc",
    question: "Zinc vs vitamin C for colds: which wins?",
    verdict: "Zinc — slightly — if you start it within 24 hours of symptoms.",
    summary:
      "Both have modest evidence for shortening cold duration. Zinc lozenges have the stronger effect size when started early. Vitamin C works more for prevention in people under physical stress (endurance athletes).",
    pickA: {
      title: "Pick zinc if…",
      copy: "You caught something and want to shorten it. Lozenges, 15–25 mg every few hours for 1–2 days at onset.",
    },
    pickB: {
      title: "Pick vitamin C if…",
      copy: "You're a heavy endurance trainer or frequently stressed. 500 mg–1 g daily for prevention." ,
    },
    bothWhen: "When you feel a cold coming on: zinc lozenges + 1 g vitamin C twice daily for 48 hours.",
  },
  {
    slug: "probiotic-vs-fiber",
    a: "prob",
    b: "fiber",
    question: "Probiotic vs prebiotic fiber: which for gut health?",
    verdict: "Fiber first. Most people don't need a probiotic if fiber and diet diversity are handled.",
    summary:
      "Fiber is what your existing gut bacteria eat. Probiotic strains often don't colonize long-term — they pass through. Feeding the microbes you already have usually beats adding new ones.",
    pickA: {
      title: "Pick probiotic if…",
      copy: "You're just off antibiotics, traveling in high-risk food regions, or managing IBS/IBD under a clinician's guidance.",
    },
    pickB: {
      title: "Pick fiber if…",
      copy: "You're under 25 g/day of fiber (most adults are). Psyllium 5–10 g/day moves the needle on digestion, cholesterol, and microbiome diversity.",
    },
    faq: [
      { q: "Should I take a probiotic daily forever?", a: "Probably not. Most benefits in trials are short-term, strain-specific, and condition-specific." },
    ],
  },
  {
    slug: "creatine-vs-ashwagandha",
    a: "creatine",
    b: "ash",
    question: "Creatine vs ashwagandha: different goals, different picks.",
    verdict: "Creatine for performance. Ashwagandha for stress. No overlap.",
    summary:
      "These aren't competing — they solve different problems. Creatine is for strength, power, and cognition under load. Ashwagandha is for cortisol, perceived stress, and sleep-onset anxiety.",
    pickA: {
      title: "Pick creatine if…",
      copy: "You lift, train hard, or want a small cognitive edge. 5 g/day, daily, forever.",
    },
    pickB: {
      title: "Pick ashwagandha if…",
      copy: "You're chronically stressed and it's eating your sleep. 300–600 mg KSM-66 for 4–8 weeks.",
    },
    bothWhen: "No conflict stacking them. Common combo for athletes with high-stress jobs.",
  },
  {
    slug: "omega3-vs-vitamin-d",
    a: "omega3",
    b: "vitd",
    question: "Omega-3 vs vitamin D: if I can only take one?",
    verdict: "Vitamin D — if deficiency is likely (most people).",
    summary:
      "Both have excellent all-cause mortality data. Vitamin D deficiency is more common and easier to screen via a simple blood test. Omega-3 is additive on top, especially for heart and brain.",
    pickA: {
      title: "Pick omega-3 if…",
      copy: "You eat fatty fish less than twice a week. Target 2–3 g combined EPA + DHA daily." ,
    },
    pickB: {
      title: "Pick vitamin D if…",
      copy: "You live indoors, in a northern latitude, or tested low. 2,000–5,000 IU daily with K2.",
    },
    bothWhen: "The two highest-ROI 'core' supplements for most adults. Take both if budget allows.",
  },
  {
    slug: "glucosamine-vs-collagen",
    a: "gluco",
    b: "col",
    question: "Glucosamine vs collagen for joints: which?",
    verdict: "Collagen for tendon/skin/active athletes. Glucosamine for established joint pain.",
    summary:
      "Collagen peptides have better evidence in healthy active adults for tendon and cartilage support. Glucosamine + chondroitin has more data in people with diagnosed osteoarthritis.",
    pickA: {
      title: "Pick glucosamine if…",
      copy: "You have diagnosed or suspected osteoarthritis — knee or hip pain on movement. 1,500 mg glucosamine + 1,200 mg chondroitin.",
    },
    pickB: {
      title: "Pick collagen if…",
      copy: "You train hard and want tendon/cartilage resilience. 10–15 g + vitamin C, 30–60 minutes before activity.",
    },
    bothWhen: "No interaction — combine freely if both targets apply.",
  },
  {
    slug: "b-complex-vs-b12",
    a: "b",
    b: "b12",
    question: "B-complex vs B12: which should vegans take?",
    verdict: "Both, but B12 is non-negotiable.",
    summary:
      "B12 is virtually absent in plant foods — vegans must supplement it. B-complex covers a wider panel (B1–B9) plus B12, useful if diet variety is low.",
    pickA: {
      title: "Pick B-complex if…",
      copy: "You want broad coverage of all B-vitamins, not just B12. Good for heavy drinkers, stressed people, and vegetarians with mixed diets.",
    },
    pickB: {
      title: "Pick B12 if…",
      copy: "You eat plant-based and already get other Bs from a varied diet. Methylcobalamin, 250–500 mcg daily.",
    },
    faq: [
      { q: "Does B-complex replace B12 for vegans?", a: "Only if the blend contains an adequate B12 dose (typically yes, but always check the label)." },
    ],
  },
  {
    slug: "collagen-vs-omega3",
    a: "col",
    b: "omega3",
    question: "Collagen vs omega-3 for skin: which works better?",
    verdict: "Collagen for structure and elasticity. Omega-3 for inflammation and barrier.",
    summary:
      "These target different skin problems. Collagen peptides rebuild dermal structure and elasticity over 8–12 weeks. Omega-3 calms the inflammation behind eczema, acne, and rosacea flares. Neither replaces SPF or a retinoid.",
    pickA: {
      title: "Pick collagen if…",
      copy: "Your concern is elasticity, fine lines, or a loss of skin bounce. 10 g hydrolyzed peptides with vitamin C, daily, for 8+ weeks.",
    },
    pickB: {
      title: "Pick omega-3 if…",
      copy: "Your concern is redness, flares, or barrier dysfunction — eczema, acne, rosacea. 2–3 g combined EPA + DHA daily.",
    },
    bothWhen:
      "They solve different problems. Many skin stacks run both — collagen for structure, omega-3 for the inflammation underneath.",
    faq: [
      { q: "Which works faster?", a: "Omega-3 shifts inflammation markers in 2–4 weeks. Collagen changes elasticity in 8–12 weeks. Different timelines, different endpoints." },
      { q: "Do I still need sunscreen?", a: "Yes. UV damage destroys collagen faster than any supplement can build it. SPF is the non-negotiable foundation." },
    ],
  },
  {
    slug: "collagen-vs-creatine",
    a: "col",
    b: "creatine",
    question: "Collagen vs creatine: do I need both?",
    verdict: "Yes, if budget allows — they solve different problems.",
    summary:
      "Creatine is for muscle power, strength, and cognition. Collagen is for skin, tendon, and joint tissue. They do not compete — the only overlap is that both support training recovery, from opposite directions.",
    pickA: {
      title: "Pick collagen if…",
      copy: "You care about skin aging, joint stiffness, or tendon resilience. 10–15 g hydrolyzed peptides with vitamin C.",
    },
    pickB: {
      title: "Pick creatine if…",
      copy: "You lift, sprint, or want the best-evidenced cognitive edge supplement on the market. 5 g monohydrate daily.",
    },
    bothWhen:
      "Common athlete stack — creatine for the muscle, collagen for the connective tissue that holds it all together. No interaction, take them together in one shake.",
    faq: [
      { q: "Can I mix them in one drink?", a: "Yes. Neither is pH- or time-sensitive. Creatine + collagen + vitamin C in water or coffee is a clean daily dose." },
      { q: "Which has more trials behind it?", a: "Creatine — by a wide margin. It is one of the most-studied supplements ever. Collagen's evidence base is newer but has grown substantially since 2015." },
    ],
  },
  {
    slug: "caffeine-ltheanine-vs-ashwagandha",
    a: "caff-lth",
    b: "ash",
    question: "Caffeine + L-theanine vs ashwagandha: focus or calm?",
    verdict: "Different tools for different moments.",
    summary:
      "Caffeine + L-theanine is acute — take it, work for 3 hours. Ashwagandha is chronic — take it daily, lower your baseline stress over weeks.",
    pickA: {
      title: "Pick caffeine + L-theanine if…",
      copy: "You need focused output right now. 100 mg caffeine + 200 mg L-theanine in the morning or pre-deep-work." ,
    },
    pickB: {
      title: "Pick ashwagandha if…",
      copy: "Your baseline cortisol is too high — it's why you can't focus in the first place. 300–600 mg KSM-66 daily." ,
    },
    bothWhen: "Compatible. Many deep-work stacks use both: ashwagandha nightly, caffeine+L-theanine for work blocks.",
  },
];

export function getComparePair(slug: string): ComparePair | undefined {
  return comparePairs.find((p) => p.slug === slug);
}
