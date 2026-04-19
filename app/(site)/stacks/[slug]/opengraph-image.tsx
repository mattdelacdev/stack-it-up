import { ogSize, ogContentType, renderOg } from "@/lib/og";
import { fetchFeaturedStack, type HeroAccent } from "@/lib/featured-stacks";

export const alt = "Featured Stack — StackItUp";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const stack = await fetchFeaturedStack(slug);
  if (!stack) {
    return renderOg({
      eyebrow: "Featured stack",
      title: "Not found",
      accent: "primary",
      footer: "stackitup · /stacks",
    });
  }
  const accent: HeroAccent = stack.hero_accent ?? "primary";
  return renderOg({
    eyebrow: "Featured stack",
    title: stack.name,
    tagline: stack.tagline,
    emoji: stack.emoji ?? undefined,
    accent,
    footer: `stackitup · /stacks/${stack.slug}`,
  });
}
