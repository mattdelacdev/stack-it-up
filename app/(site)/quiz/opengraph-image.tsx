import { ogSize, ogContentType, renderOg } from "@/lib/og";

export const alt = "StackItUp Quiz — Six questions to your stack";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return renderOg({
    eyebrow: "60-second quiz",
    title: "Six questions",
    tagline: "Goals, diet, sleep, sun. Your personalized stack on the other side.",
    emoji: "🧪",
    accent: "secondary",
    footer: "stackitup · /quiz",
  });
}
