import { getSupabase } from "./supabase/browser";

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
  extras?: string;
}

export interface SupplementForm {
  name: string;
  note?: string;
}

export interface SupplementFaq {
  q: string;
  a: string;
}

export interface SupplementSource {
  title: string;
  url: string;
}

export interface SupplementContent {
  benefits?: string[];
  mechanism?: string;
  onset?: string;
  doseNotes?: string;
  timingNotes?: string;
  goodFor?: string[];
  avoidIf?: string[];
  sideEffects?: string[];
  forms?: SupplementForm[];
  stacksWith?: string[];
  avoidWith?: string[];
  faq?: SupplementFaq[];
  sources?: SupplementSource[];
}

export interface Supplement {
  id: string;
  name: string;
  dose: string;
  dose_low?: number | null;
  dose_high?: number | null;
  dose_unit?: string | null;
  timing: "morning" | "afternoon" | "evening" | "anytime";
  why: string;
  tag: "core" | "goal" | "lifestyle";
  content?: SupplementContent;
}

const SELECT_COLS = "id, name, dose, dose_low, dose_high, dose_unit, timing, why, tag, content";
const SELECT_COLS_LIST = "id, name, dose, dose_low, dose_high, dose_unit, timing, why, tag";

export async function fetchSupplements(): Promise<Record<string, Supplement>> {
  const { data, error } = await getSupabase()
    .from("supplements")
    .select(SELECT_COLS_LIST);
  if (error) throw error;
  return Object.fromEntries((data ?? []).map((s) => [s.id, s as Supplement]));
}

export async function fetchSupplementList(): Promise<Supplement[]> {
  const { data, error } = await getSupabase()
    .from("supplements")
    .select(SELECT_COLS_LIST)
    .order("tag")
    .order("name");
  if (error) throw error;
  return (data ?? []) as Supplement[];
}

export async function fetchSupplementById(id: string): Promise<Supplement | null> {
  const { data, error } = await getSupabase()
    .from("supplements")
    .select(SELECT_COLS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as Supplement) ?? null;
}

export function buildStack(
  a: QuizAnswers,
  supplements: Record<string, Supplement>,
): Supplement[] {
  const picks = new Map<string, Supplement>();
  const add = (id: string) => {
    const s = supplements[id];
    if (s) picks.set(id, s);
  };

  add("multi");
  add("omega3");

  if (a.sun !== "high") add("vitd");

  if (a.goals.includes("sleep") || a.sleepQuality === "poor") {
    add("mag");
    if (a.sleepQuality === "poor") add("mel");
  }

  if (a.goals.includes("focus")) add("caff-lth");

  if (a.goals.includes("energy") && !a.goals.includes("focus")) {
    add("caff-lth");
  }

  if (a.goals.includes("muscle") || a.activity === "heavy") {
    add("creatine");
    add("whey");
  }

  if (a.goals.includes("stress")) {
    add("ash");
    add("mag");
  }

  if (a.goals.includes("immunity")) {
    add("zinc");
    add("vitc");
  }

  if (a.goals.includes("joints") || a.ageGroup === "over50") {
    add("col");
    add("gluco");
  }

  if (a.goals.includes("gut")) {
    add("prob");
    add("fiber");
  }

  if (a.diet === "vegan") {
    add("b12");
    add("iron");
    add("b");
  } else if (a.diet === "vegetarian") {
    add("b12");
    add("iron");
  } else if (a.diet === "keto") {
    add("elec");
    add("fiber");
  }

  if (a.activity === "heavy") add("elec");

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
