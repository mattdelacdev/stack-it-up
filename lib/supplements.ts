export type Goal =
  | "energy"
  | "sleep"
  | "focus"
  | "muscle"
  | "immunity"
  | "stress"
  | "joints"
  | "gut";

export type ActivityLevel = "sedentary" | "light" | "moderate" | "heavy";
export type DietType = "omnivore" | "vegetarian" | "vegan" | "keto";
export type SunExposure = "low" | "medium" | "high";

export interface QuizAnswers {
  goals: Goal[];
  activity: ActivityLevel;
  diet: DietType;
  sun: SunExposure;
  sleepQuality: "poor" | "okay" | "good";
  ageGroup: "under30" | "30to50" | "over50";
}

export interface Supplement {
  id: string;
  name: string;
  dose: string;
  timing: "morning" | "afternoon" | "evening" | "anytime";
  why: string;
  tag: "core" | "goal" | "lifestyle";
}

const S = {
  multivitamin: {
    id: "multi",
    name: "Multivitamin",
    dose: "1 capsule",
    timing: "morning",
    why: "Covers baseline micronutrient gaps from day-to-day eating.",
    tag: "core",
  },
  omega3: {
    id: "omega3",
    name: "Omega-3 (EPA/DHA)",
    dose: "1–2 g",
    timing: "morning",
    why: "Supports heart, brain, and joint health.",
    tag: "core",
  },
  vitaminD: {
    id: "vitd",
    name: "Vitamin D3 + K2",
    dose: "2000–4000 IU",
    timing: "morning",
    why: "Critical when sun exposure is limited; supports mood and bones.",
    tag: "lifestyle",
  },
  magnesium: {
    id: "mag",
    name: "Magnesium Glycinate",
    dose: "300–400 mg",
    timing: "evening",
    why: "Calms the nervous system and supports deeper sleep.",
    tag: "goal",
  },
  melatonin: {
    id: "mel",
    name: "Melatonin",
    dose: "0.3–1 mg",
    timing: "evening",
    why: "Small dose helps nudge your sleep cycle without grogginess.",
    tag: "goal",
  },
  caffeineLTheanine: {
    id: "caff-lth",
    name: "Caffeine + L-Theanine",
    dose: "100 mg + 200 mg",
    timing: "morning",
    why: "Smoother energy and focus without the jitters.",
    tag: "goal",
  },
  creatine: {
    id: "creatine",
    name: "Creatine Monohydrate",
    dose: "5 g",
    timing: "anytime",
    why: "Most-researched performance supplement — strength, power, and cognition.",
    tag: "goal",
  },
  whey: {
    id: "whey",
    name: "Protein Powder",
    dose: "25–30 g",
    timing: "afternoon",
    why: "Helps you hit daily protein targets for recovery and muscle growth.",
    tag: "goal",
  },
  ashwagandha: {
    id: "ash",
    name: "Ashwagandha (KSM-66)",
    dose: "600 mg",
    timing: "evening",
    why: "Adaptogen shown to reduce cortisol and perceived stress.",
    tag: "goal",
  },
  zinc: {
    id: "zinc",
    name: "Zinc",
    dose: "15 mg",
    timing: "morning",
    why: "Supports immune cells, wound healing, and testosterone.",
    tag: "goal",
  },
  vitaminC: {
    id: "vitc",
    name: "Vitamin C",
    dose: "500 mg",
    timing: "morning",
    why: "Antioxidant support and immune resilience.",
    tag: "goal",
  },
  bComplex: {
    id: "b",
    name: "B-Complex",
    dose: "1 capsule",
    timing: "morning",
    why: "Essential when skipping animal products — energy and nerve function.",
    tag: "lifestyle",
  },
  b12: {
    id: "b12",
    name: "Vitamin B12 (Methylcobalamin)",
    dose: "500 mcg",
    timing: "morning",
    why: "B12 is virtually absent in plant foods — non-negotiable for vegans.",
    tag: "lifestyle",
  },
  iron: {
    id: "iron",
    name: "Iron Bisglycinate",
    dose: "18 mg",
    timing: "afternoon",
    why: "Plant-based diets often run low on bioavailable iron.",
    tag: "lifestyle",
  },
  collagen: {
    id: "col",
    name: "Collagen Peptides",
    dose: "10 g",
    timing: "morning",
    why: "Supports connective tissue, joints, and skin.",
    tag: "goal",
  },
  glucosamine: {
    id: "gluco",
    name: "Glucosamine + Chondroitin",
    dose: "1500 mg",
    timing: "afternoon",
    why: "Well-studied for joint comfort and cartilage support.",
    tag: "goal",
  },
  probiotic: {
    id: "prob",
    name: "Probiotic (Multi-strain)",
    dose: "10–30 B CFU",
    timing: "morning",
    why: "Supports a diverse gut microbiome.",
    tag: "goal",
  },
  fiber: {
    id: "fiber",
    name: "Psyllium Husk",
    dose: "5 g",
    timing: "evening",
    why: "Prebiotic fiber feeds good gut bacteria and aids digestion.",
    tag: "goal",
  },
  electrolytes: {
    id: "elec",
    name: "Electrolytes (Na/K/Mg)",
    dose: "1 scoop",
    timing: "afternoon",
    why: "Keto and heavy training deplete sodium and potassium quickly.",
    tag: "lifestyle",
  },
} as const satisfies Record<string, Supplement>;

export function buildStack(a: QuizAnswers): Supplement[] {
  const picks = new Map<string, Supplement>();
  const add = (s: Supplement) => picks.set(s.id, s);

  add(S.multivitamin);
  add(S.omega3);

  if (a.sun !== "high") add(S.vitaminD);

  if (a.goals.includes("sleep") || a.sleepQuality === "poor") {
    add(S.magnesium);
    if (a.sleepQuality === "poor") add(S.melatonin);
  }

  if (a.goals.includes("focus")) add(S.caffeineLTheanine);

  if (a.goals.includes("energy") && !a.goals.includes("focus")) {
    add(S.caffeineLTheanine);
  }

  if (a.goals.includes("muscle") || a.activity === "heavy") {
    add(S.creatine);
    add(S.whey);
  }

  if (a.goals.includes("stress")) {
    add(S.ashwagandha);
    add(S.magnesium);
  }

  if (a.goals.includes("immunity")) {
    add(S.zinc);
    add(S.vitaminC);
  }

  if (a.goals.includes("joints") || a.ageGroup === "over50") {
    add(S.collagen);
    add(S.glucosamine);
  }

  if (a.goals.includes("gut")) {
    add(S.probiotic);
    add(S.fiber);
  }

  if (a.diet === "vegan") {
    add(S.b12);
    add(S.iron);
    add(S.bComplex);
  } else if (a.diet === "vegetarian") {
    add(S.b12);
    add(S.iron);
  } else if (a.diet === "keto") {
    add(S.electrolytes);
    add(S.fiber);
  }

  if (a.activity === "heavy") add(S.electrolytes);

  return Array.from(picks.values()).sort((a, b) => {
    const order = { core: 0, goal: 1, lifestyle: 2 } as const;
    return order[a.tag] - order[b.tag];
  });
}

export function groupByTiming(stack: Supplement[]) {
  const groups: Record<Supplement["timing"], Supplement[]> = {
    morning: [],
    afternoon: [],
    evening: [],
    anytime: [],
  };
  for (const s of stack) groups[s.timing].push(s);
  return groups;
}
