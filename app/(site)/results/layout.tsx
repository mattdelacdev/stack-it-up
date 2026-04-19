import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Personalized Supplement Stack",
  description:
    "Your custom supplement routine — organized by time of day — based on your goals, diet, activity, sleep, and sun exposure.",
  robots: { index: false, follow: false },
};

export default function ResultsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
