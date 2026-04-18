"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSupabase } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

async function revalidateProfileFor(userId: string) {
  const supabase = await getServerSupabase();
  const { data } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", userId)
    .maybeSingle();
  if (data?.username) revalidatePath(`/u/${data.username}`);
}

export async function toggleFavorite(formData: FormData) {
  const supplementId = String(formData.get("supplement_id") ?? "");
  const isFav = formData.get("is_favorite") === "1";
  if (!supplementId) return;
  const { supabase, user } = await requireUser();

  if (isFav) {
    const { error } = await supabase
      .from("profile_favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("supplement_id", supplementId);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from("profile_favorites")
      .insert({ user_id: user.id, supplement_id: supplementId });
    if (error && error.code !== "23505") throw new Error(error.message);
  }

  revalidatePath(`/supplements/${supplementId}`);
  revalidatePath("/settings");
  await revalidateProfileFor(user.id);
}

export async function toggleStack(formData: FormData) {
  const supplementId = String(formData.get("supplement_id") ?? "");
  const kind = String(formData.get("kind") ?? "");
  const inStack = formData.get("in_stack") === "1";
  if (!supplementId || (kind !== "morning" && kind !== "evening")) return;
  const { supabase, user } = await requireUser();

  if (inStack) {
    const { error } = await supabase
      .from("profile_stacks")
      .delete()
      .eq("user_id", user.id)
      .eq("kind", kind)
      .eq("supplement_id", supplementId);
    if (error) throw new Error(error.message);
  } else {
    const { data: maxRow } = await supabase
      .from("profile_stacks")
      .select("position")
      .eq("user_id", user.id)
      .eq("kind", kind)
      .order("position", { ascending: false })
      .limit(1)
      .maybeSingle();
    const nextPosition = ((maxRow?.position as number | undefined) ?? -1) + 1;
    const { error } = await supabase
      .from("profile_stacks")
      .insert({
        user_id: user.id,
        kind,
        supplement_id: supplementId,
        position: nextPosition,
      });
    if (error && error.code !== "23505") throw new Error(error.message);
  }

  revalidatePath(`/supplements/${supplementId}`);
  revalidatePath("/settings");
  await revalidateProfileFor(user.id);
}

export async function removeFromStack(formData: FormData) {
  const supplementId = String(formData.get("supplement_id") ?? "");
  const kind = String(formData.get("kind") ?? "");
  if (!supplementId || (kind !== "morning" && kind !== "evening")) return;
  const { supabase, user } = await requireUser();

  const { error } = await supabase
    .from("profile_stacks")
    .delete()
    .eq("user_id", user.id)
    .eq("kind", kind)
    .eq("supplement_id", supplementId);
  if (error) throw new Error(error.message);

  revalidatePath("/settings");
  await revalidateProfileFor(user.id);
}

export async function removeFavorite(formData: FormData) {
  const supplementId = String(formData.get("supplement_id") ?? "");
  if (!supplementId) return;
  const { supabase, user } = await requireUser();

  const { error } = await supabase
    .from("profile_favorites")
    .delete()
    .eq("user_id", user.id)
    .eq("supplement_id", supplementId);
  if (error) throw new Error(error.message);

  revalidatePath("/settings");
  await revalidateProfileFor(user.id);
}

export async function moveStackItem(formData: FormData) {
  const supplementId = String(formData.get("supplement_id") ?? "");
  const kind = String(formData.get("kind") ?? "");
  const direction = String(formData.get("direction") ?? "");
  if (!supplementId || (kind !== "morning" && kind !== "evening")) return;
  if (direction !== "up" && direction !== "down") return;
  const { supabase, user } = await requireUser();

  const { data: rows, error } = await supabase
    .from("profile_stacks")
    .select("supplement_id, position")
    .eq("user_id", user.id)
    .eq("kind", kind)
    .order("position", { ascending: true });
  if (error) throw new Error(error.message);

  const list = (rows ?? []) as { supplement_id: string; position: number }[];
  const idx = list.findIndex((r) => r.supplement_id === supplementId);
  if (idx === -1) return;
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= list.length) return;

  const a = list[idx];
  const b = list[swapIdx];
  // Two-step swap to avoid colliding on the composite unique key via position.
  // position is not unique, so we can set both directly.
  const { error: e1 } = await supabase
    .from("profile_stacks")
    .update({ position: b.position })
    .eq("user_id", user.id)
    .eq("kind", kind)
    .eq("supplement_id", a.supplement_id);
  if (e1) throw new Error(e1.message);
  const { error: e2 } = await supabase
    .from("profile_stacks")
    .update({ position: a.position })
    .eq("user_id", user.id)
    .eq("kind", kind)
    .eq("supplement_id", b.supplement_id);
  if (e2) throw new Error(e2.message);

  revalidatePath("/settings");
  await revalidateProfileFor(user.id);
}
