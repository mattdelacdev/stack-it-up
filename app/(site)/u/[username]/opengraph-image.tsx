import { ogSize, ogContentType, renderOg } from "@/lib/og";
import { getServerSupabase } from "@/lib/supabase/server";

export const alt = "StackItUp profile";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await getServerSupabase();
  const { data } = await supabase
    .from("profiles")
    .select("username, first_name, last_name, bio, location")
    .eq("username", username.toLowerCase())
    .eq("is_public", true)
    .maybeSingle();

  if (!data) {
    return renderOg({
      eyebrow: "Profile",
      title: "Not found",
      accent: "primary",
      footer: "stackitup",
    });
  }

  const name =
    [data.first_name, data.last_name].filter(Boolean).join(" ") ||
    `@${data.username}`;

  return renderOg({
    eyebrow: data.location ? `Profile · ${data.location}` : "Profile",
    title: name,
    tagline: data.bio ?? `See @${data.username}'s personalized supplement stack on StackItUp.`,
    emoji: "👤",
    accent: "secondary",
    footer: `stackitup · /u/${data.username}`,
  });
}
