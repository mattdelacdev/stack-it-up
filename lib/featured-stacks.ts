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

export async function fetchStacksForSupplement(
  supplementId: string,
): Promise<FeaturedStackSummary[]> {
  const { data, error } = await getSupabase()
    .from("featured_stack_items")
    .select(
      "position, featured_stacks!inner(slug, name, tagline, emoji, hero_accent, sort_order, is_published)",
    )
    .eq("supplement_id", supplementId)
    .eq("featured_stacks.is_published", true)
    .order("position");
  if (error) throw error;
  const rows = (data ?? []) as unknown as Array<{
    featured_stacks: FeaturedStackSummary & { is_published: boolean };
  }>;
  const seen = new Set<string>();
  const out: FeaturedStackSummary[] = [];
  for (const row of rows) {
    const s = row.featured_stacks;
    if (!s || seen.has(s.slug)) continue;
    seen.add(s.slug);
    out.push({
      slug: s.slug,
      name: s.name,
      tagline: s.tagline,
      emoji: s.emoji,
      hero_accent: s.hero_accent,
      sort_order: s.sort_order,
    });
  }
  return out.sort((a, b) => a.sort_order - b.sort_order);
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
          "position, note, supplements(id, name, dose, dose_low, dose_high, dose_unit, timing, why, tag)",
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
