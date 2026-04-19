import { ogSize, ogContentType, renderOg } from "@/lib/og";
import { fetchSupplementById } from "@/lib/supplements";

export const alt = "Supplement — StackItUp";
export const size = ogSize;
export const contentType = ogContentType;

const TAG_LABEL = { core: "Core", goal: "Goal", lifestyle: "Lifestyle" } as const;
const TIMING_EMOJI = {
  morning: "☀️",
  afternoon: "🌤️",
  evening: "🌙",
  anytime: "⏰",
} as const;

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const s = await fetchSupplementById(id);
  if (!s) {
    return renderOg({
      eyebrow: "Supplement",
      title: "Not found",
      accent: "primary",
      footer: "stackitup · /supplements",
    });
  }
  return renderOg({
    eyebrow: `${TAG_LABEL[s.tag]} · ${s.dose}`,
    title: s.name,
    tagline: s.why,
    emoji: TIMING_EMOJI[s.timing],
    accent: s.tag === "core" ? "accent" : s.tag === "goal" ? "primary" : "secondary",
    footer: `stackitup · /supplements/${s.id}`,
  });
}
