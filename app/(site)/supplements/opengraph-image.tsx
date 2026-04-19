import { ogSize, ogContentType, renderOg } from "@/lib/og";

export const alt = "StackItUp — Supplement Library";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return renderOg({
    eyebrow: "Supplement library",
    title: "Dose. Timing. Why.",
    tagline: "Every supplement in the StackItUp database — with the science in plain English.",
    emoji: "💊",
    accent: "secondary",
    footer: "stackitup · /supplements",
  });
}
