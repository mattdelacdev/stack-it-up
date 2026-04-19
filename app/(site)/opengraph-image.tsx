import { ogSize, ogContentType, renderOg } from "@/lib/og";

export const alt = "StackItUp — Build Your Personalized Supplement Stack";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return renderOg({
    eyebrow: "Personalized supplements",
    title: "Build your stack",
    tagline: "A 60-second quiz, then a science-backed routine tailored to you.",
    accent: "primary",
    footer: "stackitup · start the quiz",
  });
}
