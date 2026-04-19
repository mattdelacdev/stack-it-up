import Link from "next/link";
import { benefitList } from "@/lib/benefits";
import { bestGoalList } from "@/lib/best";
import { comparePairs } from "@/lib/compare";

export default function SiteFooter() {
  const topBest = bestGoalList.slice(0, 8);
  const topCompare = comparePairs.slice(0, 8);
  return (
    <footer className="relative z-10 border-t-4 border-primary/30 bg-bg-deep/40 mt-auto">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="font-display text-xl text-primary tracking-widest hover:text-accent transition-colors"
            >
              STACK<span className="text-accent">·</span>IT<span className="text-accent">·</span>UP
            </Link>
            <p className="mt-4 text-sm text-text/60 leading-relaxed max-w-xs">
              A no-BS, science-backed supplement stack — personalized in 60 seconds.
            </p>
            <Link href="/quiz" className="btn-ghost !px-4 !py-2 !text-xs mt-6 inline-flex">
              Start Quiz →
            </Link>
          </div>

          <div>
            <p className="font-display text-xs uppercase tracking-[0.2em] text-accent mb-4">
              Optimize
            </p>
            <ul className="space-y-2.5">
              {benefitList.map((b) => (
                <li key={b.slug}>
                  <Link
                    href={`/optimize/${b.slug}`}
                    className="text-sm text-text/75 hover:text-accent transition-colors inline-flex items-center gap-2"
                  >
                    <span aria-hidden>{b.emoji}</span>
                    {b.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-display text-xs uppercase tracking-[0.2em] text-accent mb-4">
              Best for
            </p>
            <ul className="space-y-2.5">
              {topBest.map((g) => (
                <li key={g.slug}>
                  <Link
                    href={`/best/${g.slug}`}
                    className="text-sm text-text/75 hover:text-accent transition-colors inline-flex items-center gap-2"
                  >
                    <span aria-hidden>{g.emoji}</span>
                    {g.title.replace(/^Best Supplements for /i, "")}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/best"
                  className="text-xs text-accent hover:text-primary font-display uppercase tracking-wider"
                >
                  See all →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-display text-xs uppercase tracking-[0.2em] text-accent mb-4">
              Compare
            </p>
            <ul className="space-y-2.5">
              {topCompare.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/compare/${p.slug}`}
                    className="text-sm text-text/75 hover:text-accent transition-colors"
                  >
                    {p.slug.replace(/-vs-/g, " vs ").replace(/-/g, " ")}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/compare"
                  className="text-xs text-accent hover:text-primary font-display uppercase tracking-wider"
                >
                  See all →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-display text-xs uppercase tracking-[0.2em] text-secondary mb-4">
              Explore
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-text/75 hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#how" className="text-text/75 hover:text-accent transition-colors">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/#optimize" className="text-text/75 hover:text-accent transition-colors">
                  Benefits
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="text-text/75 hover:text-accent transition-colors">
                  Take the Quiz
                </Link>
              </li>
              <li>
                <Link href="/#newsletter" className="text-text/75 hover:text-accent transition-colors">
                  Newsletter
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-display text-xs uppercase tracking-[0.2em] text-primary mb-4">
              The fine print
            </p>
            <p className="text-xs text-text/60 leading-relaxed">
              Educational only. Not medical advice. Talk to a qualified professional before
              starting any new supplement — especially if you&apos;re pregnant, nursing, or on
              medication.
            </p>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs">
              <Link
                href="/pricing"
                className="text-text/75 hover:text-accent transition-colors underline"
              >
                Pricing
              </Link>
              <Link
                href="/terms"
                className="text-text/75 hover:text-accent transition-colors underline"
              >
                Terms
              </Link>
              <Link
                href="/refund"
                className="text-text/75 hover:text-accent transition-colors underline"
              >
                Refunds
              </Link>
              <Link
                href="/privacy"
                className="text-text/75 hover:text-accent transition-colors underline"
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t-2 border-primary/20 flex flex-col sm:flex-row justify-between gap-3 text-xs text-text/50">
          <p>© {new Date().getFullYear()} StackItUp. All rights reserved.</p>
          <p className="font-mono text-accent">v1.0.0</p>
        </div>
      </div>
    </footer>
  );
}
