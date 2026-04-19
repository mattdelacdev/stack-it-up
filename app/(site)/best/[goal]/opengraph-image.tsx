import { ogSize, ogContentType, renderOg } from "@/lib/og";
import { bestGoals, type BestGoalSlug } from "@/lib/best";

export const alt = "Best supplements — StackItUp";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({
  params,
}: {
  params: Promise<{ goal: string }>;
}) {
  const { goal } = await params;
  const g = bestGoals[goal as BestGoalSlug];
  if (!g) {
    return renderOg({
      eyebrow: "Best by goal",
      title: "Not found",
      accent: "primary",
      footer: "stackitup · /best",
    });
  }
  return renderOg({
    eyebrow: "Best by goal",
    title: g.h1.replace(/^Best supplements for\s+/i, ""),
    tagline: g.tagline,
    emoji: g.emoji,
    accent: "accent",
    footer: `stackitup · /best/${g.slug}`,
  });
}
