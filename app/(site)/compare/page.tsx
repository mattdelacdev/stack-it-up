import Link from "next/link";
import type { Metadata } from "next";
import { comparePairs } from "@/lib/compare";
import { fetchSupplementList } from "@/lib/supplements";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Supplement Comparisons — Head-to-Head",
  description:
    "Creatine vs whey, magnesium vs melatonin, ashwagandha vs magnesium, and more. Side-by-side supplement comparisons with a clear verdict.",
  alternates: { canonical: "/compare" },
  openGraph: {
    type: "website",
    title: "Supplement Comparisons — Head-to-Head",
    description: "Head-to-head supplement comparisons with a clear verdict on each.",
    url: "/compare",
    siteName: SITE_NAME,
  },
};

export default async function CompareIndexPage() {
  const all = await fetchSupplementList();
  const byId = new Map(all.map((s) => [s.id, s]));

  const ld = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Supplement Comparisons",
    url: absoluteUrl("/compare"),
    hasPart: comparePairs.map((p) => ({
      "@type": "Article",
      name: p.question,
      url: absoluteUrl(`/compare/${p.slug}`),
    })),
  };

  return (
    <div className="relative overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="pointer-events-none absolute inset-0 retro-grid opacity-30" aria-hidden />
      <main className="relative z-10 mx-auto max-w-5xl px-6 py-12 sm:py-16">
        <p className="font-display text-accent text-xs sm:text-sm uppercase tracking-[0.3em] mb-3">
          Head-to-head
        </p>
        <h1 className="font-display text-5xl sm:text-7xl text-text leading-[0.95]">
          Supplement comparisons
        </h1>
        <p className="mt-4 max-w-2xl text-lg sm:text-xl text-text/80">
          The common &quot;A vs B&quot; questions, answered. One verdict per page — plus who should pick
          which, and when to take both.
        </p>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2">
          {comparePairs.map((p) => {
            const a = byId.get(p.a);
            const b = byId.get(p.b);
            return (
              <li key={p.slug}>
                <Link
                  href={`/compare/${p.slug}`}
                  className="card-retro block h-full hover:-translate-y-1 transition-transform"
                >
                  <p className="font-display text-xs uppercase tracking-[0.2em] text-accent mb-2">
                    {a?.name ?? p.a} <span className="text-text/50">vs</span> {b?.name ?? p.b}
                  </p>
                  <h2 className="font-display text-lg sm:text-xl text-primary leading-snug">
                    {p.question}
                  </h2>
                  <p className="mt-3 text-sm text-text/75 leading-[1.6] line-clamp-2">
                    {p.verdict}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
