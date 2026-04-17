"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
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
  question: string;
  subtitle: string;
  multi?: boolean;
  options: { value: string; label: string; emoji?: string; hint?: string }[];
};

const STEPS: Step[] = [
  {
    id: "goals",
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
    question: "Which age bracket?",
    subtitle: "Needs shift as you age — joints, recovery, density.",
    options: [
      { value: "under30", label: "Under 30" },
      { value: "30to50", label: "30 – 50" },
      { value: "over50", label: "Over 50" },
    ],
  },
];

const DEFAULTS: QuizAnswers = {
  goals: [],
  activity: "moderate",
  diet: "omnivore",
  sleepQuality: "okay",
  sun: "medium",
  ageGroup: "30to50",
};

export default function QuizPage() {
  const router = useRouter();
  const [stepIdx, setStepIdx] = useState(0);
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
    return String(answers[step.id]) === value;
  }

  function goNext() {
    if (stepIdx < STEPS.length - 1) {
      setStepIdx((i) => i + 1);
    } else {
      saveAnswers(answers);
      router.push("/results");
    }
  }

  function goBack() {
    if (stepIdx > 0) setStepIdx((i) => i - 1);
  }

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 retro-grid opacity-20" aria-hidden />

      <header className="relative z-10 mx-auto flex max-w-4xl items-center justify-between px-6 py-6">
        <Link
          href="/"
          className="font-display text-lg text-primary tracking-widest hover:text-accent transition-colors sm:text-xl"
        >
          STACK<span className="text-accent">·</span>IT<span className="text-accent">·</span>UP
        </Link>
        <span className="font-mono text-lg text-text/70">
          {stepIdx + 1}<span className="text-accent">/</span>{STEPS.length}
        </span>
      </header>

      <main id="main" className="relative z-10 mx-auto max-w-4xl px-6 pb-20">
        <div
          className="h-2 w-full bg-bg-deep border-2 border-primary/40 mb-10 sm:mb-14"
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

        <div key={step.id} className="animate-in fade-in duration-300">
          <p className="font-mono text-accent text-lg sm:text-xl mb-3">
            &gt; question_{String(stepIdx + 1).padStart(2, "0")}
          </p>
          <h1 className="font-display text-3xl sm:text-5xl leading-tight text-text">
            {step.question}
          </h1>
          <p className="mt-3 text-text/70 text-base sm:text-lg">{step.subtitle}</p>

          <fieldset className="mt-8 sm:mt-10">
            <legend className="sr-only">{step.question}</legend>
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
          </fieldset>

          <div className="mt-10 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={goBack}
              disabled={stepIdx === 0}
              className="font-display text-sm uppercase tracking-wider text-text/70 hover:text-accent disabled:opacity-30 disabled:hover:text-text/70 transition-colors py-2"
            >
              ← Back
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
