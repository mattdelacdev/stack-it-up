import { ogSize, ogContentType, renderOg } from "@/lib/og";

export const alt = "StackItUp — Best supplements by goal";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return renderOg({
    eyebrow: "Best by goal",
    title: "The picks that work.",
    tagline: "Sleep, focus, muscle, stress, immunity — the supplements with the data to back them.",
    emoji: "🏆",
    accent: "accent",
    footer: "stackitup · /best",
  });
}
