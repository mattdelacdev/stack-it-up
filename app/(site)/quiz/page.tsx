"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { saveAnswers } from "@/lib/storage";
import type {
  ActivityLevel,
  DietType,
  Goal,
  QuizAnswers,
  SunExposure,
} from "@/lib/supplements";

type Step = {
  id: keyof QuizAnswers;
  label: string;
  question: string;
  subtitle: string;
  multi?: boolean;
  kind?: "options" | "text";
  placeholder?: string;
  options: { value: string; label: string; emoji?: string; hint?: string }[];
};

const STEPS: Step[] = [
  {
    id: "goals",
    label: "Goals",
    question: "What do you want to optimize?",
    subtitle: "Pick as many as you want — we'll balance the stack.",
    multi: true,
    options: [
      { value: "energy", label: "Energy", emoji: "⚡" },
      { value: "sleep", label: "Sleep", emoji: "🌙" },
      { value: "focus", label: "Focus", emoji: "🎯" },
      { value: "muscle", label: "Muscle & Strength", emoji: "💪" },
      { value: "immunity", label: "Immunity", emoji: "🛡️" },
      { value: "stress", label: "Stress", emoji: "🧘" },
      { value: "joints", label: "Joints", emoji: "🦴" },
      { value: "gut", label: "Gut Health", emoji: "🌱" },
    ],
  },
  {
    id: "activity",
    label: "Activity",
    question: "How active are you weekly?",
    subtitle: "Training load influences protein and electrolytes.",
    options: [
      { value: "sedentary", label: "Mostly sitting", hint: "Desk life" },
      { value: "light", label: "Light", hint: "1–2x / week" },
      { value: "moderate", label: "Moderate", hint: "3–4x / week" },
      { value: "heavy", label: "Heavy", hint: "5+x / week" },
    ],
  },
  {
    id: "diet",
    label: "Diet",
    question: "How do you eat?",
    subtitle: "Diet style changes your baseline nutrient gaps.",
    options: [
      { value: "omnivore", label: "Omnivore", emoji: "🍖" },
      { value: "vegetarian", label: "Vegetarian", emoji: "🥗" },
      { value: "vegan", label: "Vegan", emoji: "🌿" },
      { value: "keto", label: "Keto / Low-carb", emoji: "🥑" },
    ],
  },
  {
    id: "sleepQuality",
    label: "Sleep",
    question: "How's your sleep lately?",
    subtitle: "Be honest — poor sleep unlocks different recommendations.",
    options: [
      { value: "poor", label: "Rough", emoji: "😴" },
      { value: "okay", label: "Okay", emoji: "😐" },
      { value: "good", label: "Solid", emoji: "😌" },
    ],
  },
  {
    id: "sun",
    label: "Sun",
    question: "How much sun do you get?",
    subtitle: "This drives your vitamin D need.",
    options: [
      { value: "low", label: "Low", hint: "Indoor most days" },
      { value: "medium", label: "Medium", hint: "Some time outside" },
      { value: "high", label: "High", hint: "Outdoor lifestyle" },
    ],
  },
  {
    id: "ageGroup",
    label: "Age",
    question: "Which age bracket?",
    subtitle: "Needs shift as you age — joints, recovery, density.",
    options: [
      { value: "under30", label: "Under 30" },
      { value: "30to50", label: "30 – 50" },
      { value: "over50", label: "Over 50" },
    ],
  },
  {
    id: "extras",
    label: "Extras",
    question: "Anything else we should know?",
    subtitle:
      "Optional. Medical conditions, medications, allergies, budget, specific goals — anything that helps the AI tailor your stack.",
    kind: "text",
    placeholder:
      "e.g. I have mild high blood pressure, take a statin, am trying to get pregnant, want to keep cost under $50/month…",
    options: [],
  },
];

const DEFAULTS: QuizAnswers = {
  goals: [],
  activity: "moderate",
  diet: "omnivore",
  sleepQuality: "okay",
  sun: "medium",
  ageGroup: "30to50",
  extras: "",
};

export default function QuizPage() {
  const router = useRouter();
  const [stepIdx, setStepIdx] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [answers, setAnswers] = useState<QuizAnswers>(DEFAULTS);

  const step = STEPS[stepIdx];
  const progress = useMemo(
    () => Math.round(((stepIdx + 1) / STEPS.length) * 100),
    [stepIdx]
  );

  const canAdvance = useMemo(() => {
    if (step.id === "goals") return answers.goals.length > 0;
    return true;
  }, [step, answers]);

  function selectValue(value: string) {
    if (step.id === "goals") {
      const g = value as Goal;
      setAnswers((prev) => ({
        ...prev,
        goals: prev.goals.includes(g)
          ? prev.goals.filter((x) => x !== g)
          : [...prev.goals, g],
      }));
      return;
    }
    if (step.id === "activity") {
      setAnswers((prev) => ({ ...prev, activity: value as ActivityLevel }));
    } else if (step.id === "diet") {
      setAnswers((prev) => ({ ...prev, diet: value as DietType }));
    } else if (step.id === "sleepQuality") {
      setAnswers((prev) => ({
        ...prev,
        sleepQuality: value as QuizAnswers["sleepQuality"],
      }));
    } else if (step.id === "sun") {
      setAnswers((prev) => ({ ...prev, sun: value as SunExposure }));
    } else if (step.id === "ageGroup") {
      setAnswers((prev) => ({
        ...prev,
        ageGroup: value as QuizAnswers["ageGroup"],
      }));
    }

    if (!step.multi) {
      setTimeout(() => goNext(), 220);
    }
  }

  function isSelected(value: string) {
    if (step.id === "goals") return answers.goals.includes(value as Goal);
    if (step.kind === "text") return false;
    return String(answers[step.id]) === value;
  }

  function goNext() {
    if (stepIdx < STEPS.length - 1) {
      setDirection("forward");
      setStepIdx((i) => i + 1);
    } else {
      saveAnswers(answers);
      router.push("/results");
    }
  }

  function goBack() {
    if (stepIdx > 0) {
      setDirection("back");
      setStepIdx((i) => i - 1);
    } else router.push("/");
  }

  function goToStep(idx: number) {
    if (idx === stepIdx) return;
    // Only allow jumping to steps already completed (or the current one)
    if (idx > stepIdx) return;
    setDirection(idx > stepIdx ? "forward" : "back");
    setStepIdx(idx);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goBack();
      } else if (e.key === "ArrowRight" || e.key === "Enter") {
        if (canAdvance) {
          e.preventDefault();
          goNext();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIdx, canAdvance, answers]);

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 retro-grid opacity-20" aria-hidden />

      <div className="relative z-10 mx-auto flex max-w-4xl items-center justify-between gap-3 px-6 pt-6">
        <span className="font-display text-accent text-xs sm:text-sm uppercase tracking-[0.2em]">
          Step {stepIdx + 1} of {STEPS.length}
          <span className="ml-2 text-text/60">· {step.label}</span>
        </span>
        <span className="font-mono text-sm text-text/60 hidden sm:inline">
          {progress}%
        </span>
      </div>

      <main id="main" className="relative z-10 mx-auto max-w-4xl px-6 pb-20">
        <div
          className="mt-4 h-2 w-full bg-bg-deep border-2 border-primary/40"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Quiz progress"
        >
          <div
            className="h-full bg-gradient-to-r from-primary via-accent to-secondary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <ol className="mt-4 mb-10 sm:mb-14 flex flex-wrap gap-1.5" aria-label="Quiz steps">
          {STEPS.map((s, i) => {
            const isDone = i < stepIdx;
            const isCurrent = i === stepIdx;
            const clickable = i <= stepIdx;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => goToStep(i)}
                  disabled={!clickable}
                  aria-current={isCurrent ? "step" : undefined}
                  className={[
                    "px-2.5 py-1 font-display text-[10px] sm:text-xs uppercase tracking-[0.18em] border-2 transition-colors",
                    isCurrent
                      ? "border-accent text-accent"
                      : isDone
                      ? "border-primary/60 text-text hover:border-accent hover:text-accent cursor-pointer"
                      : "border-text/15 text-text/40 cursor-not-allowed",
                  ].join(" ")}
                >
                  {s.label}
                </button>
              </li>
            );
          })}
        </ol>

        <div
          key={step.id}
          className={
            direction === "forward" ? "quiz-slide-forward" : "quiz-slide-back"
          }
        >
          <p className="font-mono text-accent text-lg sm:text-xl mb-3">
            &gt; question_{String(stepIdx + 1).padStart(2, "0")}
          </p>
          <h1 className="font-display text-3xl sm:text-5xl leading-tight text-text">
            {step.question}
          </h1>
          <p className="mt-3 text-text/70 text-base sm:text-lg">{step.subtitle}</p>

          <fieldset className="mt-8 sm:mt-10">
            <legend className="sr-only">{step.question}</legend>
            {step.kind === "text" ? (
              <div>
                <textarea
                  value={answers.extras ?? ""}
                  onChange={(e) =>
                    setAnswers((prev) => ({ ...prev, extras: e.target.value }))
                  }
                  placeholder={step.placeholder}
                  rows={6}
                  maxLength={1000}
                  className="w-full resize-y border-4 border-text/20 focus:border-accent outline-none bg-bg-deep/60 p-4 sm:p-5 font-body text-base sm:text-lg text-text placeholder:text-text/40"
                />
                <p className="mt-2 font-mono text-xs text-text/50">
                  {(answers.extras ?? "").length} / 1000 · optional
                </p>
              </div>
            ) : (
            <div
              className={
                step.id === "goals"
                  ? "grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                  : "grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2"
              }
            >
              {step.options.map((opt) => {
                const selected = isSelected(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => selectValue(opt.value)}
                    aria-pressed={selected}
                    className={[
                      "text-left border-4 p-4 sm:p-5 font-display text-base sm:text-lg transition-all duration-150 bg-bg-deep/60",
                      "hover:-translate-y-1 hover:shadow-retro-primary",
                      selected
                        ? "border-accent text-accent shadow-retro"
                        : "border-text/20 text-text hover:border-primary",
                    ].join(" ")}
                  >
                    {opt.emoji && (
                      <span className="block text-3xl sm:text-4xl mb-2" aria-hidden>
                        {opt.emoji}
                      </span>
                    )}
                    <span className="block uppercase tracking-wider">{opt.label}</span>
                    {opt.hint && (
                      <span className="mt-1 block text-xs sm:text-sm text-text/60 normal-case font-body tracking-normal">
                        {opt.hint}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            )}
          </fieldset>

          <div className="mt-10 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={goBack}
              className="font-display text-sm uppercase tracking-wider text-text/70 hover:text-accent transition-colors py-2"
            >
              ← {stepIdx === 0 ? "Home" : "Back"}
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={!canAdvance}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-retro"
            >
              {stepIdx === STEPS.length - 1 ? "Generate Stack →" : "Next →"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
