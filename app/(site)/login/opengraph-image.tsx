import { ogSize, ogContentType, renderOg } from "@/lib/og";

export const alt = "Sign in to StackItUp";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return renderOg({
    eyebrow: "Sign in",
    title: "Save your stack",
    tagline: "Sign in with Google to save your routine, favorites, and profile.",
    emoji: "🔐",
    accent: "primary",
    footer: "stackitup · /login",
  });
}
