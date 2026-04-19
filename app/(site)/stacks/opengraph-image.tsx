import { ogSize, ogContentType, renderOg } from "@/lib/og";

export const alt = "Featured Supplement Stacks — StackItUp";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    eyebrow: "Featured stacks",
    title: "Stacks for every goal",
    tagline:
      "Science-backed supplement routines for sleep, focus, fitness, stress, energy, immunity, gut, and longevity.",
    accent: "accent",
    footer: "stackitup · /stacks",
  });
}
