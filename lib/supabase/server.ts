import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { cache } from "react";

export async function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase env vars missing: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component; middleware handles session refresh.
        }
      },
    },
  });
}

export const getCurrentProfile = cache(async () => {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, profile: null };
  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "id, email, first_name, last_name, role, tier, username, bio, website, avatar_url, avatar_uploaded_path, instagram, tiktok, twitter, youtube, location, is_public",
    )
    .eq("id", user.id)
    .maybeSingle();
  return { user, profile };
});

export function resolveAvatarUrl(
  profile: {
    avatar_url?: string | null;
    avatar_uploaded_path?: string | null;
  } | null,
): string | null {
  if (!profile) return null;
  if (profile.avatar_uploaded_path) {
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (base) {
      return `${base}/storage/v1/object/public/avatars/${profile.avatar_uploaded_path}`;
    }
  }
  return profile.avatar_url ?? null;
}
