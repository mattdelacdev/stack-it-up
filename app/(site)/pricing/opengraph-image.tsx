import { ogSize, ogContentType, renderOg } from "@/lib/og";

export const alt = "StackItUp — Pricing";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return renderOg({
    eyebrow: "Pricing",
    title: "Go Pro.",
    tagline: "Unlimited optimizations, saved stacks, and priority support.",
    emoji: "✨",
    accent: "accent",
    footer: "stackitup · /pricing",
  });
}
