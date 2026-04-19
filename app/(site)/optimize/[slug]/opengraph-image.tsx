import { ogSize, ogContentType, renderOg } from "@/lib/og";
import { benefits, type BenefitSlug } from "@/lib/benefits";

export const alt = "Optimize — StackItUp";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const b = benefits[slug as BenefitSlug];
  if (!b) {
    return renderOg({
      eyebrow: "Optimize",
      title: "StackItUp",
      accent: "primary",
    });
  }
  return renderOg({
    eyebrow: `Optimize · ${b.title}`,
    title: b.title,
    tagline: b.tagline,
    emoji: b.emoji,
    accent: "accent",
    footer: `stackitup · /optimize/${b.slug}`,
  });
}
