"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative overflow-hidden min-h-[70vh]">
      <div className="pointer-events-none absolute inset-0 retro-grid opacity-30" aria-hidden />

      <main id="main" className="relative z-10">
        <section className="mx-auto max-w-6xl px-6 pt-10 pb-20 sm:pt-16 sm:pb-28 lg:pt-24 lg:pb-36">
          <div className="max-w-4xl">
            <p className="font-display text-accent text-sm sm:text-base uppercase tracking-[0.3em] mb-5">
              Stack overflow
            </p>
            <h1 className="font-display text-5xl leading-[0.95] sm:text-7xl lg:text-8xl">
              <span className="text-gradient">Something</span>
              <br />
              <span className="text-text">broke the</span>
              <br />
              <span className="text-accent">routine.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg sm:text-xl text-text/80 leading-relaxed">
              A server error occurred while loading this page. Try reloading — if it
              keeps happening, head back home and we&apos;ll regroup.
            </p>
            {error.digest && (
              <p className="mt-4 font-mono text-sm text-text/50">
                Ref: {error.digest}
              </p>
            )}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <button type="button" onClick={reset} className="btn-primary">
                Reload →
              </button>
              <Link
                href="/"
                className="font-display text-sm sm:text-base uppercase tracking-wider text-text/70 hover:text-accent transition-colors underline underline-offset-8 decoration-2 decoration-primary/50 hover:decoration-accent px-2 py-3"
              >
                Back to home
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
