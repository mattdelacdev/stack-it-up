import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { bestGoals, bestGoalList, type BestGoalSlug } from "@/lib/best";
import { fetchSupplementList, type Supplement } from "@/lib/supplements";
import { SITE_NAME, absoluteUrl } from "@/lib/site";
import ShareBar from "@/components/ShareBar";

export const revalidate = 3600;

export function generateStaticParams() {
  return bestGoalList.map((g) => ({ goal: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ goal: string }>;
}): Promise<Metadata> {
  const { goal } = await params;
  const g = bestGoals[goal as BestGoalSlug];
  if (!g) return {};
  const title = g.title;
  const description = `${g.tagline} ${g.picks.map((p) => p.id).length} picks with dose, timing, and the science behind each one.`;
  const url = `/best/${g.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "article", title, description, url, siteName: SITE_NAME },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function BestGoalPage({
  params,
}: {
  params: Promise<{ goal: string }>;
}) {
  const { goal } = await params;
  const g = bestGoals[goal as BestGoalSlug];
  if (!g) notFound();

  const all = await fetchSupplementList();
  const byId = new Map(all.map((s) => [s.id, s]));
  const picks = g.picks
    .map((p) => ({ sup: byId.get(p.id), blurb: p.blurb }))
    .filter((x): x is { sup: Supplement; blurb: string } => Boolean(x.sup));

  const others = bestGoalList.filter((x) => x.slug !== g.slug).slice(0, 6);

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: g.title,
    itemListElement: picks.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.sup.name,
      url: absoluteUrl(`/supplements/${p.sup.id}`),
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Best", item: absoluteUrl("/best") },
      { "@type": "ListItem", position: 3, name: g.h1, item: absoluteUrl(`/best/${g.slug}`) },
    ],
  };

  const faqLd =
    g.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: g.faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  return (
    <div className="relative overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {faqLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      )}
      <div className="pointer-events-none absolute inset-0 retro-grid opacity-30" aria-hidden />

      <main className="relative z-10">
        <section className="mx-auto max-w-4xl px-6 pt-10 pb-14 sm:pt-16">
          <nav
            aria-label="Breadcrumb"
            className="font-display text-xs sm:text-sm uppercase tracking-wider text-text/60"
          >
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/" className="hover:text-accent">Home</Link></li>
              <li aria-hidden>/</li>
              <li><Link href="/best" className="hover:text-accent">Best</Link></li>
              <li aria-hidden>/</li>
              <li className="text-text/80">{g.title}</li>
            </ol>
          </nav>

          <div className="mt-6 flex flex-col sm:flex-row items-start gap-4 sm:gap-7">
            <span className="text-5xl sm:text-7xl leading-none" aria-hidden>{g.emoji}</span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-accent text-xs sm:text-sm uppercase tracking-[0.3em] mb-3">
                Best picks
              </p>
              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl text-text leading-[0.95] break-words hyphens-auto">
                {g.h1}
              </h1>
              <p className="mt-4 text-lg sm:text-xl text-text/80">{g.tagline}</p>
            </div>
          </div>

          <div className="mt-10 space-y-5 max-w-2xl">
            {g.intro.map((p, i) => (
              <p key={i} className="text-base sm:text-lg text-text/80 leading-[1.75]">{p}</p>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/quiz" className="btn-primary">Build your stack →</Link>
            <ShareBar
              url={absoluteUrl(`/best/${g.slug}`)}
              title={g.h1}
              description={g.tagline}
            />
          </div>
        </section>

        <section className="relative border-y-4 border-primary/30 bg-bg-deep/40 py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-6">
            <Reveal>
              <p className="font-display text-secondary text-xs sm:text-sm uppercase tracking-[0.3em] mb-3">
                The picks
              </p>
              <h2 className="font-display text-3xl sm:text-4xl mb-10 text-text">
                Top <span className="text-primary">{picks.length}</span> for {g.h1.replace(/^Best supplements for /i, "")}
              </h2>
            </Reveal>
            <ol className="space-y-4">
              {picks.map((p, i) => (
                <Reveal as="li" key={p.sup.id} delay={i * 80} className="card-retro">
                  <div className="flex items-start gap-4">
                    <span className="font-display text-3xl sm:text-4xl text-accent leading-none shrink-0">
                      #{i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/supplements/${p.sup.id}`}
                        className="font-display text-xl sm:text-2xl text-primary hover:text-accent"
                      >
                        {p.sup.name}
                      </Link>
                      <p className="mt-2 text-text/85 leading-[1.65]">{p.blurb}</p>
                      <dl className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
                        <div className="border-l-4 border-accent/70 pl-3">
                          <dt className="font-display text-accent text-xs uppercase tracking-wider">Dose</dt>
                          <dd className="mt-1 text-text/80">{p.sup.dose}</dd>
                        </div>
                        <div className="border-l-4 border-secondary/70 pl-3">
                          <dt className="font-display text-secondary text-xs uppercase tracking-wider">When</dt>
                          <dd className="mt-1 text-text/80 capitalize">{p.sup.timing}</dd>
                        </div>
                      </dl>
                      <Link
                        href={`/supplements/${p.sup.id}`}
                        className="mt-4 inline-block font-display text-xs uppercase tracking-wider text-accent hover:text-secondary"
                      >
                        Full breakdown →
                      </Link>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
          <Reveal>
            <h2 className="font-display text-3xl sm:text-4xl mb-8 text-text">
              Before you <span className="text-primary">buy</span>
            </h2>
          </Reveal>
          <ul className="space-y-3">
            {g.considerations.map((c, i) => (
              <Reveal
                as="li"
                key={c}
                delay={i * 60}
                className="flex gap-3 border-l-4 border-accent/60 bg-bg-deep/60 px-4 py-3 text-text/85 leading-relaxed"
              >
                <span className="font-display text-accent mt-0.5" aria-hidden>!</span>
                <span>{c}</span>
              </Reveal>
            ))}
          </ul>
        </section>

        {g.faq.length > 0 && (
          <section className="mx-auto max-w-3xl px-6 pb-16 sm:pb-20">
            <Reveal>
              <h2 className="font-display text-3xl sm:text-4xl mb-8 text-text">
                Common <span className="text-accent">questions</span>
              </h2>
            </Reveal>
            <ul className="space-y-3">
              {g.faq.map((item, i) => (
                <Reveal as="li" key={item.q} delay={i * 60}>
                  <details className="group card-retro !p-0 hover:border-text/20">
                    <summary className="cursor-pointer list-none p-5 sm:p-6 flex items-start justify-between gap-4">
                      <span className="font-display text-base sm:text-lg text-text leading-snug">
                        {item.q}
                      </span>
                      <span
                        className="font-display text-2xl text-accent leading-none mt-0.5 transition-transform group-open:rotate-45"
                        aria-hidden
                      >+</span>
                    </summary>
                    <p className="px-5 sm:px-6 pb-5 sm:pb-6 -mt-1 text-text/75 leading-[1.75]">
                      {item.a}
                    </p>
                  </details>
                </Reveal>
              ))}
            </ul>
          </section>
        )}

        <section className="mx-auto max-w-4xl px-6 pb-16 text-center">
          <Reveal className="card-retro !p-8 sm:!p-12 !border-accent">
            <h2 className="font-display text-3xl sm:text-4xl text-text">
              Your personal <span className="text-accent">stack</span>, in 60 seconds.
            </h2>
            <p className="mt-4 text-text/75 leading-relaxed">
              Six quick questions. A clean, tailored routine you can screenshot.
            </p>
            <Link href="/quiz" className="btn-primary mt-8">Start the Quiz →</Link>
          </Reveal>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-20">
          <h2 className="font-display text-xl sm:text-2xl text-text mb-6">
            Other <span className="text-primary">goals</span>
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/best/${o.slug}`}
                  className="card-retro flex items-center gap-3 hover:-translate-y-1"
                >
                  <span className="text-2xl sm:text-3xl" aria-hidden>{o.emoji}</span>
                  <span className="font-display text-base sm:text-lg text-accent">{o.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
