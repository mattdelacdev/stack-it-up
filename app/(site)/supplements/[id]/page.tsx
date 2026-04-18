import Link from "next/link";
import { notFound } from "next/navigation";
import {
  fetchSupplementById,
  fetchSupplementList,
  type Supplement,
} from "@/lib/supplements";
import { fetchViewerState } from "@/lib/stacks";
import { toggleFavorite, toggleStack } from "./actions";

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
  const [supplement, all, viewer] = await Promise.all([
    fetchSupplementById(id),
    fetchSupplementList(),
    fetchViewerState(id),
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

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link href="/quiz" className="btn-primary">
              Build your stack →
            </Link>
            {viewer.userId ? (
              <>
                <form action={toggleFavorite}>
                  <input type="hidden" name="supplement_id" value={supplement.id} />
                  <input type="hidden" name="is_favorite" value={viewer.isFavorite ? "1" : "0"} />
                  <button
                    type="submit"
                    className={
                      viewer.isFavorite
                        ? "border-4 border-accent bg-accent/20 px-4 py-2 font-display text-xs tracking-[0.2em] text-accent shadow-retro"
                        : "border-4 border-primary/60 px-4 py-2 font-display text-xs tracking-[0.2em] text-text hover:border-accent hover:text-accent"
                    }
                    aria-pressed={viewer.isFavorite}
                  >
                    <span aria-hidden>{viewer.isFavorite ? "★" : "☆"}</span>{" "}
                    {viewer.isFavorite ? "FAVORITED" : "FAVORITE"}
                  </button>
                </form>
                <form action={toggleStack}>
                  <input type="hidden" name="supplement_id" value={supplement.id} />
                  <input type="hidden" name="kind" value="morning" />
                  <input type="hidden" name="in_stack" value={viewer.inMorning ? "1" : "0"} />
                  <button
                    type="submit"
                    className={
                      viewer.inMorning
                        ? "border-4 border-secondary bg-secondary/20 px-4 py-2 font-display text-xs tracking-[0.2em] text-secondary shadow-retro"
                        : "border-4 border-primary/60 px-4 py-2 font-display text-xs tracking-[0.2em] text-text hover:border-secondary hover:text-secondary"
                    }
                    aria-pressed={viewer.inMorning}
                  >
                    <span aria-hidden>☀️</span>{" "}
                    {viewer.inMorning ? "IN MORNING" : "ADD TO MORNING"}
                  </button>
                </form>
                <form action={toggleStack}>
                  <input type="hidden" name="supplement_id" value={supplement.id} />
                  <input type="hidden" name="kind" value="evening" />
                  <input type="hidden" name="in_stack" value={viewer.inEvening ? "1" : "0"} />
                  <button
                    type="submit"
                    className={
                      viewer.inEvening
                        ? "border-4 border-primary bg-primary/20 px-4 py-2 font-display text-xs tracking-[0.2em] text-primary shadow-retro"
                        : "border-4 border-primary/60 px-4 py-2 font-display text-xs tracking-[0.2em] text-text hover:border-primary hover:text-primary"
                    }
                    aria-pressed={viewer.inEvening}
                  >
                    <span aria-hidden>🌙</span>{" "}
                    {viewer.inEvening ? "IN EVENING" : "ADD TO EVENING"}
                  </button>
                </form>
              </>
            ) : (
              <Link
                href={`/login?next=/supplements/${supplement.id}`}
                className="border-4 border-primary/60 px-4 py-2 font-display text-xs tracking-[0.2em] text-text hover:border-accent hover:text-accent"
              >
                SIGN IN TO SAVE
              </Link>
            )}
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
