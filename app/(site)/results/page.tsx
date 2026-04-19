"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { clearAnswers, loadAnswers } from "@/lib/storage";
import { DualDose } from "@/lib/dose";
import {
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

const LOADING_STAGES = [
  "Reading your answers…",
  "Scanning the supplement catalog…",
  "Consulting the AI expert…",
  "Balancing the stack…",
  "Finalizing recommendations…",
];

export default function ResultsPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<QuizAnswers | null>(null);
  const [stack, setStack] = useState<Supplement[]>([]);
  const [summary, setSummary] = useState<string>("");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const a = loadAnswers();
    if (!a) {
      router.replace("/quiz");
      return;
    }
    setAnswers(a);

    let cancelled = false;
    const started = Date.now();
    const progressTimer = setInterval(() => {
      if (cancelled) return;
      const elapsed = (Date.now() - started) / 1000;
      const pct = Math.min(92, Math.round((1 - Math.exp(-elapsed / 5)) * 100));
      setProgress(pct);
      setStage(Math.min(LOADING_STAGES.length - 1, Math.floor(elapsed / 2)));
    }, 200);

    fetch("/api/stack", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: a }),
    })
      .then(async (res) => {
        if (!res.ok) {
          let msg = "Request failed";
          try {
            const body = await res.json();
            if (body?.error) msg = body.error;
          } catch {}
          throw new Error(msg);
        }
        return res.json() as Promise<{ stack: Supplement[]; summary: string }>;
      })
      .then((data) => {
        if (cancelled) return;
        setStack(data.stack);
        setSummary(data.summary);
        setProgress(100);
        setStage(LOADING_STAGES.length - 1);
        setTimeout(() => !cancelled && setReady(true), 250);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Something went wrong");
        setReady(true);
      })
      .finally(() => clearInterval(progressTimer));

    return () => {
      cancelled = true;
      clearInterval(progressTimer);
    };
  }, [router]);

  const grouped = useMemo(() => groupByTiming(stack), [stack]);

  function retake() {
    clearAnswers();
    router.push("/quiz");
  }

  if (!ready || !answers) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <p className="font-mono text-accent text-lg mb-4">
            &gt; stack.generate(ai)
          </p>
          <div className="h-4 w-full border-2 border-primary/60 bg-bg-deep overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-primary via-accent to-secondary transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-4 font-mono text-sm text-text/70">
            {LOADING_STAGES[stage]}
          </p>
          <p className="mt-1 font-mono text-xs text-text/40">{progress}%</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center card-retro !p-8 !border-primary">
          <p className="text-5xl mb-4" aria-hidden>🧪</p>
          <h1 className="font-display text-2xl text-primary mb-3 uppercase tracking-wider">
            Our AI needs a breather
          </h1>
          <p className="text-text/80 mb-6 leading-relaxed">{error}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="btn-accent"
            >
              ↻ Try Again
            </button>
            <button onClick={retake} className="btn-ghost">
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 retro-grid opacity-20" aria-hidden />

      <div className="relative z-10 mx-auto flex max-w-5xl items-center justify-end px-6 pt-6">
        <button
          onClick={retake}
          className="font-display text-xs sm:text-sm uppercase tracking-wider text-text/70 hover:text-accent transition-colors py-2"
        >
          ↻ Retake
        </button>
      </div>

      <main id="main" className="relative z-10 mx-auto max-w-5xl px-6 pb-24">
        <section className="mb-12 sm:mb-16">
          <p className="font-mono text-accent text-lg sm:text-xl mb-3">
            &gt; stack.generate() === &quot;ok&quot;
          </p>
          <h1 className="font-display text-4xl sm:text-6xl leading-tight">
            <span className="text-gradient">Your stack</span>
            <span className="text-text">, {stack.length} items.</span>
          </h1>
          {summary && (
            <p className="mt-4 max-w-2xl text-text/80 text-base sm:text-lg">
              {summary}
            </p>
          )}
          <p className="mt-3 max-w-2xl text-text/60 text-sm sm:text-base">
            Screenshot it, tweak it, or retake the quiz anytime. Check with your
            doctor before starting anything new.
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
          {answers.extras && answers.extras.trim() && (
            <div className="mt-4 pt-4 border-t border-primary/20">
              <p className="font-display text-xs uppercase tracking-widest text-text/50 mb-2">
                Extra context
              </p>
              <p className="text-text/80 text-sm sm:text-base whitespace-pre-wrap">
                {answers.extras}
              </p>
            </div>
          )}
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
                          <p className="mt-2 font-mono text-accent text-lg"><DualDose s={s} /></p>
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

        <section className="mt-16 card-retro border-accent">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="max-w-xl">
              <p className="font-display text-[10px] uppercase tracking-[0.3em] text-accent">
                ⚡ Got more questions?
              </p>
              <h3 className="mt-2 font-display text-2xl text-text">
                Chat with the Stack Expert.
              </h3>
              <p className="mt-2 text-text/70 text-sm">
                Free gets 1 chat per day. Go Pro for 5 daily chats, saved
                stacks synced across devices, and early access to new stacks.
              </p>
            </div>
            <Link href="/pricing" className="btn-accent">
              See Pro plans →
            </Link>
          </div>
        </section>

        <section className="mt-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-t-4 border-primary/30 pt-10">
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
