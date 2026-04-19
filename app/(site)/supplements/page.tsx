import Link from "next/link";
import { fetchSupplementList, type Supplement } from "@/lib/supplements";
import { DualDose } from "@/lib/dose";
import { BuyGuideButton } from "@/components/BuyGuideButton";

export const revalidate = 3600;

export const metadata = {
  title: "Supplement Library",
  description:
    "Browse every supplement in the StackItUp library — with dose, timing, and the science-backed reason each one belongs in a routine.",
};

const TAG_META: Record<Supplement["tag"], { label: string; className: string }> = {
  core: { label: "CORE", className: "bg-accent text-bg" },
  goal: { label: "GOAL", className: "bg-primary text-bg" },
  lifestyle: { label: "LIFESTYLE", className: "bg-secondary text-bg" },
};

const TIMING_LABEL: Record<Supplement["timing"], string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  anytime: "Anytime",
};

export default async function SupplementsPage() {
  const supplements = await fetchSupplementList();

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 retro-grid opacity-30" aria-hidden />
      <main className="relative z-10 mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <p className="font-display text-accent text-xs sm:text-sm uppercase tracking-[0.3em] mb-3">
          The library
        </p>
        <h1 className="font-display text-5xl sm:text-7xl text-text leading-[0.95]">
          Supplements
        </h1>
        <p className="mt-4 max-w-2xl text-lg sm:text-xl text-text/80">
          Every supplement we stack. Each card links to a quick breakdown of dose, timing, and
          why it belongs in a routine.
        </p>

        <div className="mt-10 card-retro flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div>
            <p className="font-display text-accent text-xs uppercase tracking-[0.3em] mb-2">
              The full guide
            </p>
            <h2 className="font-display text-2xl sm:text-3xl text-text">
              StackItUp PDF Guide
            </h2>
            <p className="mt-2 text-sm text-text/75 max-w-md">
              Every supplement, dose, timing, and the science — in one downloadable PDF.
            </p>
          </div>
          <BuyGuideButton />
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {supplements.map((s) => {
            const tag = TAG_META[s.tag];
            return (
              <li key={s.id}>
                <Link
                  href={`/supplements/${s.id}`}
                  className="card-retro block h-full hover:-translate-y-1 transition-transform"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="min-w-0 font-display text-xl sm:text-2xl text-primary break-words">{s.name}</h2>
                    <span
                      className={`shrink-0 font-display text-[10px] tracking-widest px-2 py-1 ${tag.className}`}
                    >
                      {tag.label}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-text/75 leading-[1.65] line-clamp-3">
                    {s.why}
                  </p>
                  <dl className="mt-5 grid grid-cols-2 gap-3 text-xs">
                    <div className="border-l-4 border-accent/70 pl-3">
                      <dt className="font-display text-accent uppercase tracking-wider">Dose</dt>
                      <dd className="mt-1 text-text/80"><DualDose s={s} /></dd>
                    </div>
                    <div className="border-l-4 border-secondary/70 pl-3">
                      <dt className="font-display text-secondary uppercase tracking-wider">When</dt>
                      <dd className="mt-1 text-text/80">{TIMING_LABEL[s.timing]}</dd>
                    </div>
                  </dl>
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="mt-12 text-xs sm:text-sm text-text/50 leading-relaxed max-w-2xl">
          Educational only, not medical advice. Doses are general starting points — take the quiz
          for a stack tailored to you.
        </p>
      </main>
    </div>
  );
}
