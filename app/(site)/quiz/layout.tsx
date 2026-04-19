import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Take the Supplement Quiz",
  description:
    "Answer six quick questions about your goals, activity, diet, sleep, and sun exposure to generate a personalized supplement stack in under a minute.",
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return children;
}
