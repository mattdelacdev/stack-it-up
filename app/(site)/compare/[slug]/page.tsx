import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { comparePairs, getComparePair } from "@/lib/compare";
import { fetchSupplementList, type Supplement } from "@/lib/supplements";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export function generateStaticParams() {
  return comparePairs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pair = getComparePair(slug);
  if (!pair) return {};
  const title = pair.question;
  const description = `${pair.verdict} ${pair.summary}`.slice(0, 160);
  const url = `/compare/${pair.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "article", title, description, url, siteName: SITE_NAME },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pair = getComparePair(slug);
  if (!pair) notFound();

  const all = await fetchSupplementList();
  const byId = new Map(all.map((s) => [s.id, s]));
  const a = byId.get(pair.a);
  const b = byId.get(pair.b);
  if (!a || !b) notFound();

  const related = comparePairs.filter((p) => p.slug !== pair.slug).slice(0, 6);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Compare", item: absoluteUrl("/compare") },
      { "@type": "ListItem", position: 3, name: `${a.name} vs ${b.name}`, item: absoluteUrl(`/compare/${pair.slug}`) },
    ],
  };

  const faqLd = pair.faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: pair.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  return (
    <div className="relative overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {faqLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      )}
      <div className="pointer-events-none absolute inset-0 retro-grid opacity-30" aria-hidden />

      <main className="relative z-10">
        <section className="mx-auto max-w-4xl px-6 pt-10 pb-12 sm:pt-16">
          <nav
            aria-label="Breadcrumb"
            className="font-display text-xs sm:text-sm uppercase tracking-wider text-text/60"
          >
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/" className="hover:text-accent">Home</Link></li>
              <li aria-hidden>/</li>
              <li><Link href="/compare" className="hover:text-accent">Compare</Link></li>
              <li aria-hidden>/</li>
              <li className="text-text/80">{a.name} vs {b.name}</li>
            </ol>
          </nav>

          <p className="mt-6 font-display text-accent text-xs sm:text-sm uppercase tracking-[0.3em] mb-3">
            Head-to-head
          </p>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl text-text leading-[0.95]">
            {a.name} <span className="text-primary">vs</span> {b.name}
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-text/85 leading-[1.6]">
            {pair.question}
          </p>

          <div className="mt-8 card-retro !border-accent">
            <p className="font-display text-accent text-xs uppercase tracking-[0.3em] mb-2">
              The verdict
            </p>
            <p className="font-display text-xl sm:text-2xl text-text leading-snug">
              {pair.verdict}
            </p>
            <p className="mt-4 text-text/80 leading-[1.7]">{pair.summary}</p>
          </div>
        </section>

        <section className="relative border-y-4 border-primary/30 bg-bg-deep/40 py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-6">
            <Reveal>
              <h2 className="font-display text-3xl sm:text-4xl mb-10 text-text">
                Side by <span className="text-primary">side</span>
              </h2>
            </Reveal>

            <div className="grid gap-6 md:grid-cols-2">
              <SupplementCard s={a} copy={pair.pickA} accent="primary" />
              <SupplementCard s={b} copy={pair.pickB} accent="secondary" />
            </div>

            {pair.bothWhen && (
              <div className="mt-8 card-retro !border-accent">
                <p className="font-display text-accent text-xs uppercase tracking-[0.3em] mb-2">
                  Or take both
                </p>
                <p className="text-text/85 leading-[1.7]">{pair.bothWhen}</p>
              </div>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
          <Reveal>
            <h2 className="font-display text-3xl sm:text-4xl mb-8 text-text">
              At a <span className="text-secondary">glance</span>
            </h2>
          </Reveal>

          <div className="overflow-x-auto card-retro !p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-primary/30">
                  <th className="text-left p-4 font-display text-xs uppercase tracking-widest text-text/60"></th>
                  <th className="text-left p-4 font-display text-sm text-primary">{a.name}</th>
                  <th className="text-left p-4 font-display text-sm text-secondary">{b.name}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/20">
                <Row label="Typical dose" left={a.dose} right={b.dose} />
                <Row label="Best timing" left={a.timing} right={b.timing} capitalize />
                <Row label="Why" left={a.why} right={b.why} />
                <Row
                  label="Tag"
                  left={a.tag}
                  right={b.tag}
                  capitalize
                />
              </tbody>
            </table>
          </div>
        </section>

        {pair.faq && pair.faq.length > 0 && (
          <section className="mx-auto max-w-3xl px-6 pb-16">
            <Reveal>
              <h2 className="font-display text-3xl sm:text-4xl mb-8 text-text">
                Common <span className="text-accent">questions</span>
              </h2>
            </Reveal>
            <ul className="space-y-3">
              {pair.faq.map((f, i) => (
                <Reveal as="li" key={f.q} delay={i * 60}>
                  <details className="group card-retro !p-0 hover:border-text/20">
                    <summary className="cursor-pointer list-none p-5 sm:p-6 flex items-start justify-between gap-4">
                      <span className="font-display text-base sm:text-lg text-text leading-snug">{f.q}</span>
                      <span className="font-display text-2xl text-accent leading-none mt-0.5 transition-transform group-open:rotate-45" aria-hidden>+</span>
                    </summary>
                    <p className="px-5 sm:px-6 pb-5 sm:pb-6 -mt-1 text-text/75 leading-[1.75]">{f.a}</p>
                  </details>
                </Reveal>
              ))}
            </ul>
          </section>
        )}

        <section className="mx-auto max-w-4xl px-6 pb-16 text-center">
          <Reveal className="card-retro !p-8 sm:!p-12 !border-accent">
            <h2 className="font-display text-3xl sm:text-4xl text-text">
              Not sure which <span className="text-accent">you</span> need?
            </h2>
            <p className="mt-4 text-text/75 leading-relaxed">
              The quiz picks for you. Six questions, 60 seconds, tailored stack.
            </p>
            <Link href="/quiz" className="btn-primary mt-8">Start the Quiz →</Link>
          </Reveal>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-20">
          <h2 className="font-display text-xl sm:text-2xl text-text mb-6">
            More <span className="text-primary">comparisons</span>
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/compare/${r.slug}`}
                  className="card-retro block h-full hover:-translate-y-1"
                >
                  <span className="font-display text-base sm:text-lg text-accent">
                    {r.question}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

function Row({
  label,
  left,
  right,
  capitalize,
}: {
  label: string;
  left: string;
  right: string;
  capitalize?: boolean;
}) {
  const cell = `p-4 text-text/85 leading-[1.6] align-top ${capitalize ? "capitalize" : ""}`;
  return (
    <tr>
      <td className="p-4 font-display text-xs uppercase tracking-widest text-text/60 align-top w-36">{label}</td>
      <td className={cell}>{left}</td>
      <td className={cell}>{right}</td>
    </tr>
  );
}

function SupplementCard({
  s,
  copy,
  accent,
}: {
  s: Supplement;
  copy: { title: string; copy: string };
  accent: "primary" | "secondary";
}) {
  const accentClass = accent === "primary" ? "text-primary" : "text-secondary";
  return (
    <div className="card-retro h-full">
      <p className={`font-display text-xs uppercase tracking-[0.3em] ${accentClass} mb-2`}>
        {copy.title}
      </p>
      <Link
        href={`/supplements/${s.id}`}
        className={`font-display text-2xl ${accentClass} hover:text-accent`}
      >
        {s.name}
      </Link>
      <p className="mt-3 text-text/85 leading-[1.65]">{copy.copy}</p>
      <dl className="mt-5 grid grid-cols-2 gap-3 text-xs">
        <div className="border-l-4 border-accent/70 pl-3">
          <dt className="font-display text-accent uppercase tracking-wider">Dose</dt>
          <dd className="mt-1 text-text/80">{s.dose}</dd>
        </div>
        <div className="border-l-4 border-secondary/70 pl-3">
          <dt className="font-display text-secondary uppercase tracking-wider">When</dt>
          <dd className="mt-1 text-text/80 capitalize">{s.timing}</dd>
        </div>
      </dl>
      <Link
        href={`/supplements/${s.id}`}
        className="mt-4 inline-block font-display text-xs uppercase tracking-wider text-accent hover:text-secondary"
      >
        Full breakdown →
      </Link>
    </div>
  );
}
