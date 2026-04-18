import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import { benefits, benefitList, type BenefitSlug } from "@/lib/benefits";

export function generateStaticParams() {
  return benefitList.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const b = benefits[slug as BenefitSlug];
  if (!b) return {};
  return {
    title: `${b.title} — StackItUp`,
    description: b.tagline,
  };
}

export default async function BenefitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const benefit = benefits[slug as BenefitSlug];
  if (!benefit) notFound();

  const others = benefitList.filter((b) => b.slug !== benefit.slug);

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 retro-grid opacity-30" aria-hidden />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link
          href="/"
          className="font-display text-xl text-primary tracking-widest hover:text-accent transition-colors sm:text-2xl"
        >
          STACK<span className="text-accent">·</span>IT<span className="text-accent">·</span>UP
        </Link>
        <Link href="/quiz" className="hidden sm:inline-flex btn-ghost !px-4 !py-2 !text-sm">
          Start Quiz
        </Link>
      </header>

      <main className="relative z-10">
        {/* Hero */}
        <section className="mx-auto max-w-4xl px-6 pt-10 pb-16 sm:pt-16 sm:pb-20">
          <Link
            href="/#optimize"
            className="font-display text-xs sm:text-sm uppercase tracking-wider text-text/60 hover:text-accent transition-colors"
          >
            ← Back to benefits
          </Link>
          <div className="mt-6 flex items-start gap-5 sm:gap-7">
            <span className="text-6xl sm:text-7xl leading-none" aria-hidden>
              {benefit.emoji}
            </span>
            <div>
              <p className="font-display text-accent text-xs sm:text-sm uppercase tracking-[0.3em] mb-3">
                What you can optimize
              </p>
              <h1 className="font-display text-5xl sm:text-7xl text-text leading-[0.95]">
                {benefit.title}
              </h1>
              <p className="mt-4 text-lg sm:text-xl text-text/80">{benefit.tagline}</p>
            </div>
          </div>
          <div className="mt-10 space-y-5 max-w-2xl">
            {benefit.intro.map((p, i) => (
              <p key={i} className="text-base sm:text-lg text-text/80 leading-[1.75]">
                {p}
              </p>
            ))}
          </div>
          <div className="mt-10">
            <Link href="/quiz" className="btn-primary">
              Start your stack →
            </Link>
          </div>
        </section>

        {/* Signs */}
        <section className="relative border-y-4 border-primary/30 bg-bg-deep/50 py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-6">
            <Reveal>
              <p className="font-display text-secondary text-xs sm:text-sm uppercase tracking-[0.3em] mb-3">
                Sound familiar?
              </p>
              <h2 className="font-display text-3xl sm:text-4xl mb-10 text-text">
                Signs you might <span className="text-primary">benefit</span>
              </h2>
            </Reveal>
            <ul className="grid gap-3 sm:gap-4 sm:grid-cols-2">
              {benefit.signs.map((s, i) => (
                <Reveal
                  as="li"
                  key={s}
                  delay={i * 80}
                  className="flex items-start gap-3 border-l-4 border-accent/60 bg-bg-deep/60 px-4 py-3"
                >
                  <span className="font-display text-accent text-lg leading-none mt-0.5" aria-hidden>
                    ✓
                  </span>
                  <span className="text-text/85 leading-relaxed">{s}</span>
                </Reveal>
              ))}
            </ul>
            <p className="mt-8 text-sm text-text/60">
              Two or more? The quiz tailors a stack to you in 60 seconds.
            </p>
          </div>
        </section>

        {/* Highlights */}
        <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <Reveal>
            <h2 className="font-display text-3xl sm:text-4xl mb-10 text-text">
              What we focus <span className="text-primary">on</span>
            </h2>
          </Reveal>
          <ul className="grid gap-6 sm:grid-cols-3">
            {benefit.highlights.map((h, i) => (
              <Reveal as="li" key={h.title} delay={i * 100} className="card-retro">
                <h3 className="font-display text-xl text-accent">{h.title}</h3>
                <p className="mt-3 text-text/80 leading-[1.7]">{h.copy}</p>
              </Reveal>
            ))}
          </ul>
        </section>

        {/* Staples — detailed */}
        <section className="relative border-t-4 border-primary/30 bg-bg-deep/40 py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-6">
            <Reveal>
              <h2 className="font-display text-3xl sm:text-4xl mb-3 text-text">
                Common <span className="text-secondary">staples</span>
              </h2>
              <p className="text-text/70 mb-10 max-w-2xl leading-relaxed">
                The boring, well-studied basics. Here&apos;s what each does, how much, and when.
              </p>
            </Reveal>
            <ul className="space-y-4">
              {benefit.staples.map((s, i) => (
                <Reveal as="li" key={s.name} delay={i * 80} className="card-retro">
                  <h3 className="font-display text-xl sm:text-2xl text-primary">{s.name}</h3>
                  <p className="mt-3 text-text/85 leading-[1.7]">{s.mechanism}</p>
                  <dl className="mt-5 grid gap-4 sm:grid-cols-2 text-sm">
                    <div className="border-l-4 border-accent/70 pl-4">
                      <dt className="font-display text-accent text-xs uppercase tracking-wider">
                        Typical dose
                      </dt>
                      <dd className="mt-1 text-text/80">{s.dose}</dd>
                    </div>
                    <div className="border-l-4 border-secondary/70 pl-4">
                      <dt className="font-display text-secondary text-xs uppercase tracking-wider">
                        When to take
                      </dt>
                      <dd className="mt-1 text-text/80">{s.timing}</dd>
                    </div>
                  </dl>
                </Reveal>
              ))}
            </ul>
            <p className="mt-6 text-xs sm:text-sm text-text/50 leading-relaxed">
              Educational only, not medical advice. Doses are general starting points — your quiz results
              tailor the stack to you.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
          <Reveal>
            <h2 className="font-display text-3xl sm:text-4xl mb-10 text-text">
              Common <span className="text-accent">questions</span>
            </h2>
          </Reveal>
          <ul className="space-y-3">
            {benefit.faq.map((item, i) => (
              <Reveal as="li" key={item.q} delay={i * 60}>
                <details className="group card-retro !p-0 hover:border-text/20">
                  <summary className="cursor-pointer list-none p-5 sm:p-6 flex items-start justify-between gap-4">
                    <span className="font-display text-base sm:text-lg text-text leading-snug">
                      {item.q}
                    </span>
                    <span
                      className="font-display text-2xl text-accent leading-none mt-0.5 transition-transform group-open:rotate-45"
                      aria-hidden
                    >
                      +
                    </span>
                  </summary>
                  <p className="px-5 sm:px-6 pb-5 sm:pb-6 -mt-1 text-text/75 leading-[1.75]">
                    {item.a}
                  </p>
                </details>
              </Reveal>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-4xl px-6 pb-16 text-center">
          <Reveal className="card-retro !p-8 sm:!p-12 !border-accent">
            <h2 className="font-display text-3xl sm:text-4xl text-text">
              Your <span className="text-accent">{benefit.title.toLowerCase()}</span> stack, in 60 seconds.
            </h2>
            <p className="mt-4 text-text/75 leading-relaxed">
              Six quick questions. A clean, personalized routine you can screenshot.
            </p>
            <Link href="/quiz" className="btn-primary mt-8">
              Start the Quiz →
            </Link>
          </Reveal>
        </section>

        {/* Cross-links */}
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <h2 className="font-display text-xl sm:text-2xl text-text mb-6">
            Explore other <span className="text-primary">benefits</span>
          </h2>
          <ul className="grid gap-4 grid-cols-3">
            {others.map((b) => (
              <li key={b.slug}>
                <Link
                  href={`/optimize/${b.slug}`}
                  className="card-retro flex items-center gap-3 hover:-translate-y-1"
                >
                  <span className="text-2xl sm:text-3xl" aria-hidden>{b.emoji}</span>
                  <span className="font-display text-base sm:text-lg text-accent">{b.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="relative z-10 border-t-4 border-primary/30 py-8">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row justify-between gap-4 text-sm text-text/60">
          <p>© {new Date().getFullYear()} StackItUp — educational only, not medical advice.</p>
          <p className="font-mono text-accent">v1.0.0</p>
        </div>
      </footer>
    </div>
  );
}
