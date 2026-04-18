import { getServerSupabase } from "./supabase/server";
import type { Supplement } from "./supplements";

export type StackKind = "morning" | "evening";

export interface UserStacks {
  morning: Supplement[];
  evening: Supplement[];
  favorites: Supplement[];
}

const SUPPLEMENT_COLS = "id, name, dose, timing, why, tag";

export async function fetchUserStacks(userId: string): Promise<UserStacks> {
  const supabase = await getServerSupabase();

  const [stacksRes, favsRes] = await Promise.all([
    supabase
      .from("profile_stacks")
      .select(`kind, position, supplement:supplements (${SUPPLEMENT_COLS})`)
      .eq("user_id", userId)
      .order("position", { ascending: true }),
    supabase
      .from("profile_favorites")
      .select(`created_at, supplement:supplements (${SUPPLEMENT_COLS})`)
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
  ]);

  if (stacksRes.error) throw stacksRes.error;
  if (favsRes.error) throw favsRes.error;

  const pickSupplement = (v: unknown): Supplement | null => {
    if (!v) return null;
    const s = Array.isArray(v) ? (v[0] as Supplement | undefined) : (v as Supplement);
    return s ?? null;
  };

  const morning: Supplement[] = [];
  const evening: Supplement[] = [];
  for (const row of (stacksRes.data ?? []) as unknown[]) {
    const r = row as { kind: StackKind; supplement: unknown };
    const s = pickSupplement(r.supplement);
    if (!s) continue;
    if (r.kind === "morning") morning.push(s);
    else evening.push(s);
  }

  const favorites: Supplement[] = ((favsRes.data ?? []) as unknown[])
    .map((row) => pickSupplement((row as { supplement: unknown }).supplement))
    .filter((s): s is Supplement => s !== null);

  return { morning, evening, favorites };
}

export async function fetchViewerState(supplementId: string): Promise<{
  userId: string | null;
  isFavorite: boolean;
  inMorning: boolean;
  inEvening: boolean;
}> {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { userId: null, isFavorite: false, inMorning: false, inEvening: false };
  }

  const [favRes, stackRes] = await Promise.all([
    supabase
      .from("profile_favorites")
      .select("supplement_id")
      .eq("user_id", user.id)
      .eq("supplement_id", supplementId)
      .maybeSingle(),
    supabase
      .from("profile_stacks")
      .select("kind")
      .eq("user_id", user.id)
      .eq("supplement_id", supplementId),
  ]);

  const kinds = new Set((stackRes.data ?? []).map((r) => (r as { kind: StackKind }).kind));
  return {
    userId: user.id,
    isFavorite: !!favRes.data,
    inMorning: kinds.has("morning"),
    inEvening: kinds.has("evening"),
  };
}
