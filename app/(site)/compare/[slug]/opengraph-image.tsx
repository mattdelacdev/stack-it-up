import { ogSize, ogContentType, renderOg } from "@/lib/og";
import { getComparePair } from "@/lib/compare";
import { fetchSupplementById } from "@/lib/supplements";

export const alt = "Compare — StackItUp";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pair = getComparePair(slug);
  if (!pair) {
    return renderOg({
      eyebrow: "Head-to-head",
      title: "Not found",
      accent: "primary",
      footer: "stackitup · /compare",
    });
  }
  const [a, b] = await Promise.all([
    fetchSupplementById(pair.a),
    fetchSupplementById(pair.b),
  ]);
  const title = `${a?.name ?? pair.a} vs ${b?.name ?? pair.b}`;
  return renderOg({
    eyebrow: "Head-to-head",
    title,
    tagline: pair.verdict,
    emoji: "⚖️",
    accent: "primary",
    footer: `stackitup · /compare/${pair.slug}`,
  });
}
