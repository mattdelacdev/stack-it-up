export type BenefitSlug = "energy" | "sleep" | "performance" | "immunity";

export type Staple = {
  name: string;
  mechanism: string;
  dose: string;
  timing: string;
};

export type Benefit = {
  slug: BenefitSlug;
  emoji: string;
  title: string;
  tagline: string;
  intro: string[];
  signs: string[];
  highlights: { title: string; copy: string }[];
  staples: Staple[];
  faq: { q: string; a: string }[];
};

export const benefits: Record<BenefitSlug, Benefit> = {
  energy: {
    slug: "energy",
    emoji: "⚡",
    title: "Energy",
    tagline: "Smooth focus without the jitters.",
    intro: [
      "Steady energy isn't about stacking stimulants. It's about giving your mitochondria, blood sugar, and nervous system what they need to run all day.",
      "The right basics smooth out the spikes — no 3pm crash, no doom-scrolling at your desk because your brain quit on you.",
    ],
    signs: [
      "You hit a wall mid-afternoon, every day",
      "Caffeine works, but the comedown is brutal",
      "Brain fog after meals, especially carb-heavy ones",
      "You wake up tired even after a full night's sleep",
    ],
    highlights: [
      { title: "Mitochondrial fuel", copy: "B-vitamins and CoQ10 help your cells turn food into usable ATP." },
      { title: "Calm focus", copy: "L-theanine pairs with caffeine to take the edge off without dulling alertness." },
      { title: "Stable blood sugar", copy: "Magnesium and chromium help avoid the spike-and-crash cycle." },
    ],
    staples: [
      {
        name: "B-Complex",
        mechanism: "Cofactors for converting food into cellular energy (ATP).",
        dose: "1 capsule (B-50 or B-100 blend)",
        timing: "Morning, with food",
      },
      {
        name: "L-Theanine",
        mechanism: "Boosts alpha brain waves — calm, focused alertness without sedation.",
        dose: "100–200 mg",
        timing: "With your morning coffee",
      },
      {
        name: "Creatine Monohydrate",
        mechanism: "Replenishes ATP in muscle and brain cells under load.",
        dose: "5 g daily",
        timing: "Any time, consistency matters more than timing",
      },
    ],
    faq: [
      {
        q: "Is this safe to take with my medications?",
        a: "Most basics are well-tolerated, but always check with your doctor or pharmacist — especially if you take blood thinners, blood pressure meds, or anything affecting the liver.",
      },
      {
        q: "How long until I notice a difference?",
        a: "L-theanine works the same day. B-vitamins typically take 1–2 weeks if you were deficient. Creatine takes 2–4 weeks to fully saturate.",
      },
      {
        q: "Do I need to cycle off?",
        a: "No. These aren't stimulants — they support normal physiology. Cycling off isn't necessary unless your doctor advises it.",
      },
      {
        q: "Will this replace my coffee?",
        a: "No, and it shouldn't. The goal is steadier energy alongside sane caffeine use — not stacking more stimulants on top.",
      },
    ],
  },
  sleep: {
    slug: "sleep",
    emoji: "🌙",
    title: "Sleep",
    tagline: "Wind down and wake up rested.",
    intro: [
      "Better sleep isn't just more hours — it's deeper, more restorative cycles. The right stack helps you fall asleep faster, stay asleep, and actually feel it the next morning.",
      "Forget 10mg melatonin gummies. The basics here are the boring, well-studied ones that quiet the nervous system without leaving you groggy.",
    ],
    signs: [
      "It takes you 30+ minutes to fall asleep most nights",
      "You wake up at 3am and can't get back down",
      "You sleep 8 hours and still feel unrested",
      "Your mind races the moment your head hits the pillow",
    ],
    highlights: [
      { title: "Wind down faster", copy: "Magnesium glycinate and glycine quiet the nervous system." },
      { title: "Deeper sleep", copy: "Apigenin and L-theanine support time spent in deep and REM stages." },
      { title: "No grogginess", copy: "Low-dose, well-timed melatonin beats the 10mg gummies — every time." },
    ],
    staples: [
      {
        name: "Magnesium Glycinate",
        mechanism: "Activates GABA receptors and relaxes muscles — most people are deficient.",
        dose: "200–400 mg",
        timing: "30–60 min before bed",
      },
      {
        name: "Glycine",
        mechanism: "Lowers core body temperature, a key signal for sleep onset.",
        dose: "3 g",
        timing: "30 min before bed",
      },
      {
        name: "Apigenin",
        mechanism: "Flavonoid from chamomile that gently activates calming receptors.",
        dose: "50 mg",
        timing: "30–60 min before bed",
      },
    ],
    faq: [
      {
        q: "Is this safe with melatonin or sleep meds?",
        a: "These are generally compatible with low-dose melatonin, but check with your doctor before stacking with prescription sleep aids.",
      },
      {
        q: "How long until I notice a difference?",
        a: "Magnesium and glycine often work the first night. Sleep quality compounds — give the full stack 2–3 weeks for the deeper changes.",
      },
      {
        q: "Will I be groggy in the morning?",
        a: "These aren't sedatives. They support your natural wind-down — no morning hangover the way a high-dose melatonin can leave.",
      },
      {
        q: "Should I take melatonin too?",
        a: "Only if you genuinely need it (jet lag, shift work). Start at 0.3–0.5 mg, not 5–10 mg. More isn't better — it's worse.",
      },
    ],
  },
  performance: {
    slug: "performance",
    emoji: "💪",
    title: "Performance",
    tagline: "Build, recover, repeat.",
    intro: [
      "Whether you're lifting, running, or just trying to feel strong, the right stack supports the work you're already doing — better output during, faster recovery after.",
      "No pre-workout pixie dust, no proprietary blends. Just the handful of ingredients with decades of evidence behind them.",
    ],
    signs: [
      "You're plateauing despite consistent training",
      "Recovery between sessions feels slower than it should",
      "You're hitting your protein target inconsistently",
      "Late workouts leave you sore for days",
    ],
    highlights: [
      { title: "Strength & power", copy: "Creatine is the most studied performance supplement, period." },
      { title: "Faster recovery", copy: "Protein, omega-3s, and tart cherry help muscles bounce back." },
      { title: "Endurance", copy: "Beta-alanine and electrolytes push back the burn on longer efforts." },
    ],
    staples: [
      {
        name: "Creatine Monohydrate",
        mechanism: "Increases phosphocreatine stores — more reps, more power, faster recovery.",
        dose: "5 g daily",
        timing: "Any time of day, every day",
      },
      {
        name: "Whey or Plant Protein",
        mechanism: "Provides leucine and full amino acid profile for muscle protein synthesis.",
        dose: "20–40 g per serving, to hit ~0.7 g/lb daily",
        timing: "Post-workout or to fill protein gaps",
      },
      {
        name: "Omega-3 (EPA/DHA)",
        mechanism: "Reduces inflammation and supports recovery from heavy training.",
        dose: "2–3 g combined EPA + DHA",
        timing: "With a meal containing fat",
      },
    ],
    faq: [
      {
        q: "Will creatine make me bloated or cause hair loss?",
        a: "Initial water retention is intramuscular (the point). The hair-loss claim comes from a single small study that's never been replicated.",
      },
      {
        q: "How long until I notice a difference?",
        a: "Creatine: 2–4 weeks to saturate. Protein and omega-3s: weeks to months as recovery and body comp shift.",
      },
      {
        q: "Do I need a pre-workout?",
        a: "Probably not. Caffeine + creatine + adequate protein outperforms most $50 tubs of mystery powder.",
      },
      {
        q: "Should I cycle creatine?",
        a: "No. Continuous daily use is the protocol with the most evidence. No loading phase needed either — just 5 g/day.",
      },
    ],
  },
  immunity: {
    slug: "immunity",
    emoji: "🛡️",
    title: "Immunity",
    tagline: "Stay resilient year-round.",
    intro: [
      "A strong immune system isn't built the day you get sick — it's built quietly over months. These are the boring, reliable basics that keep you in the fight.",
      "No mega-doses, no fad mushrooms. Just the deficiencies almost everyone has, and a few targeted picks for when things get rough.",
    ],
    signs: [
      "You catch every bug going around the office",
      "Colds linger for 2+ weeks instead of clearing",
      "You rarely get sunlight on bare skin",
      "You feel run-down during seasonal changes",
    ],
    highlights: [
      { title: "Fill the gaps", copy: "Most people are low in Vitamin D and zinc — easy wins." },
      { title: "Gut = immunity", copy: "Roughly 70% of your immune system lives in your gut. Feed it well." },
      { title: "Recovery support", copy: "Vitamin C and elderberry can shorten the rough days when you do get hit." },
    ],
    staples: [
      {
        name: "Vitamin D3 + K2",
        mechanism: "D3 regulates immune cell activity; K2 directs calcium where it belongs.",
        dose: "2,000–5,000 IU D3 + 100 mcg K2",
        timing: "Morning, with a meal containing fat",
      },
      {
        name: "Zinc",
        mechanism: "Critical for immune cell development and signaling — easy to come up short.",
        dose: "15–25 mg (with copper if long-term)",
        timing: "With food, not on an empty stomach",
      },
      {
        name: "Probiotic",
        mechanism: "Supports gut barrier and the immune cells that live there.",
        dose: "10–50 billion CFU, multi-strain",
        timing: "Daily, with or without food",
      },
    ],
    faq: [
      {
        q: "Should I megadose Vitamin C when I feel a cold coming?",
        a: "1–2 g/day can modestly shorten symptoms. Megadoses (10+ g) mostly give you GI upset.",
      },
      {
        q: "How long until I notice a difference?",
        a: "Vitamin D takes 6–8 weeks to raise blood levels. The real test is fewer sick days over a season — months, not weeks.",
      },
      {
        q: "Can I just get this from food?",
        a: "Zinc and Vitamin C, yes. Vitamin D is hard to get from diet alone unless you eat fatty fish daily.",
      },
      {
        q: "Is elderberry actually worth it?",
        a: "Decent evidence for shortening cold/flu duration if started early. Not a daily staple — a 'when you feel it coming on' tool.",
      },
    ],
  },
};

export const benefitList = Object.values(benefits);
