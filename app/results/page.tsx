"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { clearAnswers, loadAnswers } from "@/lib/storage";
import {
  buildStack,
  groupByTiming,
  type QuizAnswers,
  type Supplement,
} from "@/lib/supplements";

const TIMING_META: Record<
  Supplement["timing"],
  { label: string; emoji: string; accent: string }
> = {
  morning: { label: "Morning", emoji: "☀️", accent: "text-accent" },
  afternoon: { label: "Afternoon", emoji: "🌤️", accent: "text-secondary" },
  evening: { label: "Evening", emoji: "🌙", accent: "text-primary" },
  anytime: { label: "Anytime", emoji: "⏰", accent: "text-text" },
};

const TAG_META: Record<Supplement["tag"], { label: string; className: string }> = {
  core: {
    label: "CORE",
    className: "bg-accent text-bg",
  },
  goal: {
    label: "GOAL",
    className: "bg-primary text-bg",
  },
  lifestyle: {
    label: "LIFESTYLE",
    className: "bg-secondary text-bg",
  },
};

export default function ResultsPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<QuizAnswers | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const a = loadAnswers();
    if (!a) {
      router.replace("/quiz");
      return;
    }
    setAnswers(a);
    setReady(true);
  }, [router]);

  const stack = useMemo(() => (answers ? buildStack(answers) : []), [answers]);
  const grouped = useMemo(() => groupByTiming(stack), [stack]);

  function retake() {
    clearAnswers();
    router.push("/quiz");
  }

  if (!ready || !answers) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-mono text-accent text-xl animate-pulse">
          &gt; computing_stack...
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 retro-grid opacity-20" aria-hidden />

      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Link
          href="/"
          className="font-display text-lg text-primary tracking-widest hover:text-accent transition-colors sm:text-xl"
        >
          STACK<span className="text-accent">·</span>IT<span className="text-accent">·</span>UP
        </Link>
        <button
          onClick={retake}
          className="font-display text-xs sm:text-sm uppercase tracking-wider text-text/70 hover:text-accent transition-colors py-2"
        >
          ↻ Retake
        </button>
      </header>

      <main id="main" className="relative z-10 mx-auto max-w-5xl px-6 pb-24">
        <section className="mb-12 sm:mb-16">
          <p className="font-mono text-accent text-lg sm:text-xl mb-3">
            &gt; stack.generate() === &quot;ok&quot;
          </p>
          <h1 className="font-display text-4xl sm:text-6xl leading-tight">
            <span className="text-gradient">Your stack</span>
            <span className="text-text">, {stack.length} items.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-text/70 text-base sm:text-lg">
            Based on your answers — screenshot it, tweak it, or retake the quiz anytime.
            Check with your doctor before starting anything new.
          </p>
        </section>

        <section className="mb-12 card-retro !p-6 sm:!p-8 !border-primary">
          <h2 className="font-display text-xl sm:text-2xl text-primary mb-4">Your profile</h2>
          <dl className="grid gap-x-6 gap-y-3 grid-cols-1 sm:grid-cols-2 text-sm sm:text-base">
            <ProfileRow label="Goals" value={answers.goals.join(", ") || "—"} />
            <ProfileRow label="Activity" value={answers.activity} />
            <ProfileRow label="Diet" value={answers.diet} />
            <ProfileRow label="Sleep" value={answers.sleepQuality} />
            <ProfileRow label="Sun" value={answers.sun} />
            <ProfileRow label="Age" value={answers.ageGroup.replace("to", "–").replace("under", "<").replace("over", ">")} />
          </dl>
        </section>

        <div className="space-y-10 sm:space-y-14">
          {(Object.keys(grouped) as Supplement["timing"][])
            .filter((t) => grouped[t].length > 0)
            .map((timing) => {
              const meta = TIMING_META[timing];
              return (
                <section key={timing}>
                  <h2 className="font-display text-2xl sm:text-3xl mb-5 flex items-center gap-3">
                    <span aria-hidden className="text-3xl sm:text-4xl">{meta.emoji}</span>
                    <span className={meta.accent}>{meta.label}</span>
                    <span className="text-text/40 font-mono text-base">
                      {grouped[timing].length}
                    </span>
                  </h2>
                  <ul className="grid gap-4 sm:grid-cols-2">
                    {grouped[timing].map((s) => {
                      const tag = TAG_META[s.tag];
                      return (
                        <li key={s.id} className="card-retro hover:-translate-y-1">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="font-display text-lg sm:text-xl text-text leading-tight">
                              {s.name}
                            </h3>
                            <span
                              className={`font-display text-[10px] px-2 py-1 tracking-widest ${tag.className}`}
                            >
                              {tag.label}
                            </span>
                          </div>
                          <p className="mt-2 font-mono text-accent text-lg">{s.dose}</p>
                          <p className="mt-3 text-sm sm:text-base text-text/70 leading-relaxed">
                            {s.why}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}
        </div>

        <section className="mt-16 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-t-4 border-primary/30 pt-10">
          <p className="text-text/60 text-sm max-w-md">
            <span className="text-accent font-bold">Heads up:</span> this is educational
            only, not medical advice. Supplements can interact with meds and conditions.
          </p>
          <div className="flex flex-wrap gap-3">
            <button onClick={retake} className="btn-ghost">
              ↻ Retake Quiz
            </button>
            <Link href="/" className="btn-accent">
              Home
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-3 border-b border-text/10 pb-2 capitalize">
      <dt className="font-display text-xs sm:text-sm uppercase tracking-widest text-text/50 min-w-[80px]">
        {label}
      </dt>
      <dd className="text-text">{value}</dd>
    </div>
  );
}
