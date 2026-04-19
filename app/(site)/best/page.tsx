import Link from "next/link";
import type { Metadata } from "next";
import { bestGoalList } from "@/lib/best";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Best Supplements for Every Goal",
  description:
    "Science-backed supplement picks for sleep, energy, focus, muscle, stress, immunity, joints, gut, testosterone, skin, longevity, and weight loss.",
  alternates: { canonical: "/best" },
  openGraph: {
    type: "website",
    title: "Best Supplements for Every Goal",
    description:
      "Science-backed supplement picks for every major goal — no proprietary blends, no hype.",
    url: "/best",
    siteName: SITE_NAME,
  },
};

export default function BestIndexPage() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Best Supplements for Every Goal",
    url: absoluteUrl("/best"),
    hasPart: bestGoalList.map((g) => ({
      "@type": "Article",
      name: g.title,
      url: absoluteUrl(`/best/${g.slug}`),
    })),
  };

  return (
    <div className="relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      <div className="pointer-events-none absolute inset-0 retro-grid opacity-30" aria-hidden />
      <main className="relative z-10 mx-auto max-w-5xl px-6 py-12 sm:py-16">
        <p className="font-display text-accent text-xs sm:text-sm uppercase tracking-[0.3em] mb-3">
          Best supplements for…
        </p>
        <h1 className="font-display text-5xl sm:text-7xl text-text leading-[0.95]">
          Best supplements, by goal
        </h1>
        <p className="mt-4 max-w-2xl text-lg sm:text-xl text-text/80">
          One page per goal. Curated picks, doses, and the science — no proprietary blends, no hype.
        </p>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bestGoalList.map((g) => (
            <li key={g.slug}>
              <Link
                href={`/best/${g.slug}`}
                className="card-retro block h-full hover:-translate-y-1 transition-transform"
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl leading-none" aria-hidden>{g.emoji}</span>
                  <div className="min-w-0">
                    <h2 className="font-display text-lg sm:text-xl text-primary">{g.title}</h2>
                    <p className="mt-2 text-sm text-text/75 leading-[1.6]">{g.tagline}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
