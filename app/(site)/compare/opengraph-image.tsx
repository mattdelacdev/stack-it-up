import { ogSize, ogContentType, renderOg } from "@/lib/og";

export const alt = "StackItUp — Compare supplements";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return renderOg({
    eyebrow: "Head-to-head",
    title: "Compare supplements.",
    tagline: "Clear verdicts on the questions people actually ask — creatine vs whey, ashwagandha vs magnesium, and more.",
    emoji: "⚖️",
    accent: "primary",
    footer: "stackitup · /compare",
  });
}
