import Link from "next/link";
import { notFound } from "next/navigation";
import {
  fetchSupplementById,
  fetchSupplementList,
  type Supplement,
} from "@/lib/supplements";

const TAG_META: Record<Supplement["tag"], { label: string; className: string }> = {
  core: { label: "CORE", className: "bg-accent text-bg" },
  goal: { label: "GOAL", className: "bg-primary text-bg" },
  lifestyle: { label: "LIFESTYLE", className: "bg-secondary text-bg" },
};

const TIMING_META: Record<Supplement["timing"], { label: string; emoji: string }> = {
  morning: { label: "Morning", emoji: "☀️" },
  afternoon: { label: "Afternoon", emoji: "🌤️" },
  evening: { label: "Evening", emoji: "🌙" },
  anytime: { label: "Anytime", emoji: "⏰" },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const s = await fetchSupplementById(id);
  if (!s) return {};
  return {
    title: `${s.name} — StackItUp`,
    description: s.why,
  };
}

export default async function SupplementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [supplement, all] = await Promise.all([
    fetchSupplementById(id),
    fetchSupplementList(),
  ]);
  if (!supplement) notFound();

  const tag = TAG_META[supplement.tag];
  const timing = TIMING_META[supplement.timing];
  const others = all.filter((s) => s.id !== supplement.id).slice(0, 6);

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 retro-grid opacity-30" aria-hidden />

      <main className="relative z-10">
        <section className="mx-auto max-w-4xl px-6 pt-10 pb-16 sm:pt-16 sm:pb-20">
          <Link
            href="/supplements"
            className="font-display text-xs sm:text-sm uppercase tracking-wider text-text/60 hover:text-accent transition-colors"
          >
            ← Back to supplements
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span
              className={`font-display text-[11px] tracking-widest px-2 py-1 ${tag.className}`}
            >
              {tag.label}
            </span>
            <span className="font-display text-xs uppercase tracking-widest text-text/60">
              <span aria-hidden>{timing.emoji}</span> {timing.label}
            </span>
          </div>

          <h1 className="mt-4 font-display text-5xl sm:text-7xl text-text leading-[0.95]">
            {supplement.name}
          </h1>
          <p className="mt-6 max-w-2xl text-lg sm:text-xl text-text/85 leading-[1.65]">
            {supplement.why}
          </p>

          <dl className="mt-10 grid gap-5 sm:grid-cols-2 max-w-2xl">
            <div className="card-retro">
              <dt className="font-display text-accent text-xs uppercase tracking-wider">
                Typical dose
              </dt>
              <dd className="mt-2 text-text/85 text-lg">{supplement.dose}</dd>
            </div>
            <div className="card-retro">
              <dt className="font-display text-secondary text-xs uppercase tracking-wider">
                When to take
              </dt>
              <dd className="mt-2 text-text/85 text-lg">{timing.label}</dd>
            </div>
          </dl>

          <div className="mt-10">
            <Link href="/quiz" className="btn-primary">
              Build your stack →
            </Link>
          </div>

          <p className="mt-8 text-xs sm:text-sm text-text/50 leading-relaxed max-w-2xl">
            Educational only, not medical advice. Check with a clinician before starting anything
            new, especially if you&apos;re on medication or pregnant.
          </p>
        </section>

        {others.length > 0 && (
          <section className="mx-auto max-w-6xl px-6 pb-20">
            <h2 className="font-display text-xl sm:text-2xl text-text mb-6">
              Other <span className="text-primary">supplements</span>
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/supplements/${s.id}`}
                    className="card-retro flex items-center justify-between gap-3 hover:-translate-y-1"
                  >
                    <span className="font-display text-base sm:text-lg text-accent">
                      {s.name}
                    </span>
                    <span
                      className={`font-display text-[10px] tracking-widest px-2 py-1 ${TAG_META[s.tag].className}`}
                    >
                      {TAG_META[s.tag].label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
