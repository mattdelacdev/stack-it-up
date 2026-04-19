import Link from "next/link";
import type { Metadata } from "next";
import { fetchFeaturedStacks, type HeroAccent } from "@/lib/featured-stacks";
import { SITE_NAME } from "@/lib/site";

const title = "Featured Supplement Stacks";
const description =
  "Curated, science-backed supplement stacks for sleep, focus, fitness, stress, energy, immunity, gut health, and longevity. Pick the goal — get the routine.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/stacks" },
  openGraph: {
    type: "website",
    title: `${title} — ${SITE_NAME}`,
    description,
    url: "/stacks",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} — ${SITE_NAME}`,
    description,
  },
};

const ACCENT_BORDER: Record<HeroAccent, string> = {
  primary: "hover:border-primary",
  secondary: "hover:border-secondary",
  accent: "hover:border-accent",
};

const ACCENT_TEXT: Record<HeroAccent, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  accent: "text-accent",
};

export default async function StacksIndexPage() {
  const stacks = await fetchFeaturedStacks();

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 retro-grid opacity-30" aria-hidden />
      <main className="relative z-10 mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <p className="font-display text-accent text-xs sm:text-sm uppercase tracking-[0.3em] mb-3">
          Featured stacks
        </p>
        <h1 className="font-display text-5xl sm:text-7xl leading-[0.95]">
          <span className="text-gradient">Science-backed</span>
          <br />
          <span className="text-text">stacks for every goal.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg sm:text-xl text-text/80 leading-relaxed">
          Curated routines for the goals we get asked about most. Each one is built on
          boring, well-studied compounds — no hype, no fillers.
        </p>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stacks.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/stacks/${s.slug}`}
                className={`card-retro block h-full transition-transform hover:-translate-y-1 ${ACCENT_BORDER[s.hero_accent]}`}
              >
                <div className="flex items-start gap-3">
                  {s.emoji && (
                    <span className="text-4xl leading-none" aria-hidden>
                      {s.emoji}
                    </span>
                  )}
                  <div>
                    <h2 className={`font-display text-xl sm:text-2xl ${ACCENT_TEXT[s.hero_accent]}`}>
                      {s.name}
                    </h2>
                  </div>
                </div>
                <p className="mt-4 text-sm text-text/80 leading-[1.65]">{s.tagline}</p>
                <p className="mt-5 font-display text-xs tracking-[0.3em] text-text/60">
                  See the stack →
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
