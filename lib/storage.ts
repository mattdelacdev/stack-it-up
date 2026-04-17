import type { QuizAnswers } from "./supplements";

const KEY = "stackitup:answers";

export function saveAnswers(a: QuizAnswers) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(KEY, JSON.stringify(a));
}

export function loadAnswers(): QuizAnswers | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as QuizAnswers;
  } catch {
    return null;
  }
}

export function clearAnswers() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(KEY);
}
