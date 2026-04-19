import Link from "next/link";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import HeroStack from "@/components/HeroStack";
import { benefitList } from "@/lib/benefits";
import { fetchFeaturedStacks, type HeroAccent } from "@/lib/featured-stacks";

const STACK_ACCENT_TEXT: Record<HeroAccent, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  accent: "text-accent",
};

const STACK_ACCENT_BORDER: Record<HeroAccent, string> = {
  primary: "hover:border-primary",
  secondary: "hover:border-secondary",
  accent: "hover:border-accent",
};

export const metadata: Metadata = {
  title: "Build Your Personalized Supplement Stack",
  description:
    "Answer six quick questions and get a no-BS, science-backed supplement routine built around your goals, diet, activity, and sleep.",
};

const steps = [
  {
    n: "01",
    title: "Answer",
    copy: "Six quick questions about your goals, lifestyle, and sleep.",
  },
  {
    n: "02",
    title: "Stack",
    copy: "We generate a science-backed routine tailored to you.",
  },
  {
    n: "03",
    title: "Take",
    copy: "A clean, time-of-day schedule you can actually follow.",
  },
];

const features = benefitList.map((b) => ({
  slug: b.slug,
  emoji: b.emoji,
  title: b.title,
  copy: b.tagline,
}));

export default async function Home() {
  const featuredStacks = await fetchFeaturedStacks();
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 retro-grid opacity-30" aria-hidden />

      <main id="main" className="relative z-10">
        <section className="mx-auto max-w-6xl px-6 pt-10 pb-20 sm:pt-16 sm:pb-28 lg:pt-24 lg:pb-36">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-10 lg:items-center">
            <div>
              <p className="font-display text-accent text-sm sm:text-base uppercase tracking-[0.3em] mb-5">
                Personalized in 60 seconds
              </p>
              <h1 className="font-display text-5xl leading-[0.95] sm:text-7xl lg:text-8xl">
                <span className="text-gradient">Build your</span>
                <br />
                <span className="text-text">supplement</span>
                <br />
                <span className="text-accent">stack.</span>
              </h1>
              <p className="mt-8 max-w-2xl text-lg sm:text-xl text-text/80 leading-relaxed">
                Answer six quick questions. Get a personalized, no-BS supplement
                routine backed by the boring, reliable science.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link href="/quiz" className="btn-primary">
                  Start the Quiz →
                </Link>
                <Link
                  href="#how"
                  className="font-display text-sm sm:text-base uppercase tracking-wider text-text/70 hover:text-accent transition-colors underline underline-offset-8 decoration-2 decoration-primary/50 hover:decoration-accent px-2 py-3"
                >
                  How it works
                </Link>
              </div>
            </div>
            <div className="hidden lg:block lg:order-last">
              <HeroStack />
            </div>
          </div>
        </section>

        <section id="how" className="relative border-y-4 border-primary/30 bg-bg-deep/50 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal as="div">
              <h2 className="font-display text-3xl sm:text-5xl mb-12 sm:mb-16 text-text">
                How it <span className="text-primary">works</span>
              </h2>
            </Reveal>
            <ol className="grid gap-6 sm:grid-cols-3 sm:gap-8">
              {steps.map((s, i) => (
                <Reveal as="li" key={s.n} delay={i * 120} className="card-retro group">
                  <p className="font-display text-5xl text-primary/60 group-hover:text-accent transition-colors">
                    {s.n}
                  </p>
                  <h3 className="mt-4 font-display text-2xl text-text">{s.title}</h3>
                  <p className="mt-3 text-text/70 leading-relaxed">{s.copy}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        <section id="optimize" className="mx-auto max-w-6xl px-6 py-16 sm:py-24 scroll-mt-24">
          <Reveal>
            <h2 className="font-display text-3xl sm:text-5xl mb-4 text-text">
              What you can <span className="text-secondary">optimize</span>
            </h2>
            <p className="mb-12 text-text/70 sm:text-lg">
              Tap any benefit to learn more — then build your stack.
            </p>
          </Reveal>
          <ul className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <Reveal as="li" key={f.title} delay={i * 100}>
                <Link
                  href={`/optimize/${f.slug}`}
                  aria-label={`Learn more about ${f.title}`}
                  className="card-retro group flex h-full flex-col items-start hover:-translate-y-1"
                >
                  <span className="text-4xl sm:text-5xl" aria-hidden>{f.emoji}</span>
                  <h3 className="mt-4 font-display text-base sm:text-xl text-accent break-words hyphens-auto">{f.title}</h3>
                  <p className="mt-2 text-sm sm:text-base text-text/70">{f.copy}</p>
                  <span className="mt-4 font-display text-xs uppercase tracking-wider text-primary/80 group-hover:text-accent transition-colors">
                    Learn more →
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </section>

        <section
          id="stacks"
          className="relative border-y-4 border-primary/30 bg-bg-deep/50 py-16 sm:py-24 scroll-mt-24"
        >
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <p className="font-display text-accent text-xs sm:text-sm uppercase tracking-[0.3em] mb-3">
                Featured stacks
              </p>
              <h2 className="font-display text-3xl sm:text-5xl text-text max-w-3xl">
                Already know your goal?{" "}
                <span className="text-gradient">Start with a stack.</span>
              </h2>
              <p className="mt-4 max-w-2xl text-text/70 sm:text-lg">
                Curated, science-backed routines for the goals we get asked about most. Skip
                the quiz and jump straight in.
              </p>
            </Reveal>

            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featuredStacks.map((s, i) => (
                <Reveal as="li" key={s.slug} delay={i * 80}>
                  <Link
                    href={`/stacks/${s.slug}`}
                    className={`card-retro group flex h-full flex-col hover:-translate-y-1 transition-transform ${STACK_ACCENT_BORDER[s.hero_accent]}`}
                  >
                    <div className="flex items-start gap-3">
                      {s.emoji && (
                        <span className="text-4xl leading-none" aria-hidden>
                          {s.emoji}
                        </span>
                      )}
                      <h3
                        className={`font-display text-lg sm:text-xl ${STACK_ACCENT_TEXT[s.hero_accent]}`}
                      >
                        {s.name}
                      </h3>
                    </div>
                    <p className="mt-3 text-sm text-text/75 leading-[1.6] flex-1">
                      {s.tagline}
                    </p>
                    <span className="mt-4 font-display text-xs uppercase tracking-wider text-primary/80 group-hover:text-accent transition-colors">
                      See the stack →
                    </span>
                  </Link>
                </Reveal>
              ))}
            </ul>

            <div className="mt-10">
              <Link
                href="/stacks"
                className="font-display text-sm uppercase tracking-[0.2em] text-text/70 hover:text-accent transition-colors underline underline-offset-8 decoration-2 decoration-primary/50 hover:decoration-accent"
              >
                Browse all stacks →
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-20 sm:py-28 text-center">
          <Reveal className="card-retro !p-8 sm:!p-12 !border-accent">
            <h2 className="font-display text-3xl sm:text-4xl text-text">
              Ready in <span className="text-accent">under a minute.</span>
            </h2>
            <p className="mt-4 text-text/70">
              No accounts. No upsells. Just a clean stack you can screenshot.
            </p>
            <Link href="/quiz" className="btn-primary mt-8">
              Let&apos;s go →
            </Link>
          </Reveal>
        </section>
      </main>

    </div>
  );
}
