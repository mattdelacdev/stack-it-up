import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  fetchFeaturedStack,
  fetchFeaturedStacks,
  type FeaturedStackItem,
  type HeroAccent,
} from "@/lib/featured-stacks";
import type { Supplement } from "@/lib/supplements";
import { SITE_NAME } from "@/lib/site";

const ACCENT_TEXT: Record<HeroAccent, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  accent: "text-accent",
};

const ACCENT_BORDER: Record<HeroAccent, string> = {
  primary: "border-primary",
  secondary: "border-secondary",
  accent: "border-accent",
};

const TAG_META: Record<Supplement["tag"], { label: string; className: string }> = {
  core: { label: "CORE", className: "bg-accent text-bg" },
  goal: { label: "GOAL", className: "bg-primary text-bg" },
  lifestyle: { label: "LIFESTYLE", className: "bg-secondary text-bg" },
};

const TIMING_META: Record<
  Supplement["timing"],
  { label: string; emoji: string; accent: string }
> = {
  morning: { label: "Morning", emoji: "☀️", accent: "text-accent" },
  afternoon: { label: "Afternoon", emoji: "🌤️", accent: "text-secondary" },
  evening: { label: "Evening", emoji: "🌙", accent: "text-primary" },
  anytime: { label: "Anytime", emoji: "⏰", accent: "text-text" },
};

const TIMING_ORDER: Supplement["timing"][] = ["morning", "afternoon", "evening", "anytime"];

export async function generateStaticParams() {
  const stacks = await fetchFeaturedStacks();
  return stacks.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const stack = await fetchFeaturedStack(slug);
  if (!stack) return { title: "Stack not found" };
  const title = stack.name;
  const description = stack.tagline;
  const url = `/stacks/${stack.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: `${stack.name} — ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: `${stack.name} — ${SITE_NAME}`,
      description,
    },
  };
}

function groupByTiming(items: FeaturedStackItem[]) {
  const groups = new Map<Supplement["timing"], FeaturedStackItem[]>();
  for (const i of items) {
    const list = groups.get(i.timing) ?? [];
    list.push(i);
    groups.set(i.timing, list);
  }
  return TIMING_ORDER
    .filter((t) => groups.has(t))
    .map((t) => ({ timing: t, items: groups.get(t)!.sort((a, b) => a.position - b.position) }));
}

export default async function FeaturedStackPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [stack, others] = await Promise.all([
    fetchFeaturedStack(slug),
    fetchFeaturedStacks(),
  ]);
  if (!stack) notFound();

  const grouped = groupByTiming(stack.items);
  const related = others.filter((o) => o.slug !== stack.slug).slice(0, 3);

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 retro-grid opacity-30" aria-hidden />

      <main className="relative z-10">
        <section className="mx-auto max-w-4xl px-6 pt-10 pb-16 sm:pt-16 sm:pb-20">
          <Link
            href="/stacks"
            className="font-display text-xs sm:text-sm uppercase tracking-wider text-text/60 hover:text-accent transition-colors"
          >
            ← All featured stacks
          </Link>

          <div className="mt-8 flex items-start gap-5 sm:gap-7">
            {stack.emoji && (
              <span className="text-6xl sm:text-7xl leading-none" aria-hidden>
                {stack.emoji}
              </span>
            )}
            <div>
              <p className="font-display text-accent text-xs sm:text-sm uppercase tracking-[0.3em] mb-3">
                Featured stack
              </p>
              <h1 className="font-display text-5xl sm:text-7xl leading-[0.95]">
                <span className={ACCENT_TEXT[stack.hero_accent]}>{stack.name}</span>
              </h1>
              <p className="mt-4 text-lg sm:text-xl text-text/85 max-w-2xl leading-[1.5]">
                {stack.tagline}
              </p>
            </div>
          </div>

          <div className="mt-10 space-y-5 max-w-2xl">
            <p className="text-base sm:text-lg text-text/85 leading-[1.75]">{stack.intro}</p>
            {stack.body.map((p, i) => (
              <p key={i} className="text-base sm:text-lg text-text/80 leading-[1.75]">
                {p}
              </p>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link href="/quiz" className="btn-primary">
              Personalize your stack →
            </Link>
            <Link
              href="/stacks"
              className="border-4 border-primary/60 px-4 py-2 font-display text-xs tracking-[0.2em] text-text hover:border-accent hover:text-accent"
            >
              BROWSE MORE STACKS
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 pb-20">
          <h2 className="font-display text-3xl sm:text-5xl text-text">
            The <span className="text-gradient">stack</span>
          </h2>
          <p className="mt-3 text-text/70 text-base sm:text-lg max-w-2xl">
            Grouped by time of day. Tap any supplement for dose details and the science behind it.
          </p>

          <div className="mt-10 space-y-10">
            {grouped.map((group) => {
              const meta = TIMING_META[group.timing];
              return (
                <div key={group.timing}>
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl" aria-hidden>
                      {meta.emoji}
                    </span>
                    <h3
                      className={`font-display text-xl sm:text-2xl uppercase tracking-[0.2em] ${meta.accent}`}
                    >
                      {meta.label}
                    </h3>
                  </div>
                  <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                    {group.items.map((s) => {
                      const tag = TAG_META[s.tag];
                      return (
                        <li key={s.id}>
                          <Link
                            href={`/supplements/${s.id}`}
                            className="card-retro block h-full hover:-translate-y-1 transition-transform"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <h4 className="font-display text-xl text-primary">{s.name}</h4>
                              <span
                                className={`font-display text-[10px] tracking-widest px-2 py-1 ${tag.className}`}
                              >
                                {tag.label}
                              </span>
                            </div>
                            {s.note && (
                              <p className="mt-3 text-sm text-accent/90 font-mono">{s.note}</p>
                            )}
                            <p className="mt-3 text-sm text-text/75 leading-[1.65] line-clamp-3">
                              {s.why}
                            </p>
                            <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
                              <div>
                                <dt className="font-display text-text/50 uppercase tracking-widest">
                                  Dose
                                </dt>
                                <dd className="mt-1 text-text/85">{s.dose}</dd>
                              </div>
                              <div>
                                <dt className="font-display text-text/50 uppercase tracking-widest">
                                  Timing
                                </dt>
                                <dd className="mt-1 text-text/85">
                                  {TIMING_META[s.timing].label}
                                </dd>
                              </div>
                            </dl>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {stack.faq.length > 0 && (
          <section className="mx-auto max-w-3xl px-6 pb-20">
            <h2 className="font-display text-3xl sm:text-5xl text-text">
              <span className="text-gradient">FAQ</span>
            </h2>
            <ul className="mt-8 space-y-5">
              {stack.faq.map((f, i) => (
                <li
                  key={i}
                  className={`card-retro border-l-4 ${ACCENT_BORDER[stack.hero_accent]}`}
                >
                  <p className="font-display text-base sm:text-lg text-text">{f.q}</p>
                  <p className="mt-3 text-text/80 leading-[1.7]">{f.a}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {related.length > 0 && (
          <section className="mx-auto max-w-6xl px-6 pb-24">
            <h2 className="font-display text-2xl sm:text-3xl text-text">
              More <span className="text-gradient">stacks</span>
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/stacks/${r.slug}`}
                    className="card-retro block h-full hover:-translate-y-1 transition-transform"
                  >
                    <div className="flex items-center gap-3">
                      {r.emoji && (
                        <span className="text-3xl leading-none" aria-hidden>
                          {r.emoji}
                        </span>
                      )}
                      <h3 className={`font-display text-lg ${ACCENT_TEXT[r.hero_accent]}`}>
                        {r.name}
                      </h3>
                    </div>
                    <p className="mt-3 text-sm text-text/75 leading-[1.6]">{r.tagline}</p>
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
