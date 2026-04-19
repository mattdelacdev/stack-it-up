import { getSupabase } from "./supabase/browser";
import type { Supplement } from "./supplements";

export type HeroAccent = "primary" | "secondary" | "accent";

export interface FeaturedStackFaq {
  q: string;
  a: string;
}

export interface FeaturedStackSummary {
  slug: string;
  name: string;
  tagline: string;
  emoji: string | null;
  hero_accent: HeroAccent;
  sort_order: number;
}

export interface FeaturedStackItem extends Supplement {
  position: number;
  note: string | null;
}

export interface FeaturedStack extends FeaturedStackSummary {
  intro: string;
  body: string[];
  faq: FeaturedStackFaq[];
  items: FeaturedStackItem[];
}

export async function fetchFeaturedStacks(): Promise<FeaturedStackSummary[]> {
  const { data, error } = await getSupabase()
    .from("featured_stacks")
    .select("slug, name, tagline, emoji, hero_accent, sort_order")
    .eq("is_published", true)
    .order("sort_order");
  if (error) throw error;
  return (data ?? []) as FeaturedStackSummary[];
}

export async function fetchFeaturedStack(slug: string): Promise<FeaturedStack | null> {
  const supabase = getSupabase();
  const [{ data: stack, error: stackErr }, { data: items, error: itemsErr }] =
    await Promise.all([
      supabase
        .from("featured_stacks")
        .select("slug, name, tagline, emoji, hero_accent, intro, body, faq, sort_order")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle(),
      supabase
        .from("featured_stack_items")
        .select(
          "position, note, supplements(id, name, dose, timing, why, tag)",
        )
        .eq("stack_slug", slug)
        .order("position"),
    ]);
  if (stackErr) throw stackErr;
  if (itemsErr) throw itemsErr;
  if (!stack) return null;

  const mapped: FeaturedStackItem[] = (items ?? [])
    .map((row) => {
      const s = row.supplements as unknown as Supplement | null;
      if (!s) return null;
      return {
        ...s,
        position: row.position as number,
        note: (row.note as string | null) ?? null,
      };
    })
    .filter((x): x is FeaturedStackItem => x !== null);

  return {
    ...(stack as Omit<FeaturedStack, "items">),
    items: mapped,
  };
}
