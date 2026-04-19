import { ogSize, ogContentType, renderOg } from "@/lib/og";

export const alt = "Your StackItUp Results";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return renderOg({
    eyebrow: "Your results",
    title: "Your stack",
    tagline: "A clean, science-backed routine — dose, timing, and the why behind each pick.",
    emoji: "✨",
    accent: "accent",
    footer: "stackitup · /results",
  });
}
