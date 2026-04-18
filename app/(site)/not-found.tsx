import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative overflow-hidden min-h-screen">
      <div className="pointer-events-none absolute inset-0 retro-grid opacity-30" aria-hidden />

      <main className="relative z-10">
        <section className="mx-auto max-w-6xl px-6 pt-10 pb-20 sm:pt-16 sm:pb-28 lg:pt-24 lg:pb-36">
          <div className="max-w-4xl">
            <p className="font-display text-accent text-sm sm:text-base uppercase tracking-[0.3em] mb-5">
              Error 404
            </p>
            <h1 className="font-display text-5xl leading-[0.95] sm:text-7xl lg:text-8xl">
              <span className="text-gradient">Page not</span>
              <br />
              <span className="text-text">in the</span>
              <br />
              <span className="text-accent">stack.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg sm:text-xl text-text/80 leading-relaxed">
              We couldn&apos;t find the page you were looking for. It may have been
              moved, renamed, or never existed in the first place.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href="/" className="btn-primary">
                Back to home →
              </Link>
              <Link
                href="/quiz"
                className="font-display text-sm sm:text-base uppercase tracking-wider text-text/70 hover:text-accent transition-colors underline underline-offset-8 decoration-2 decoration-primary/50 hover:decoration-accent px-2 py-3"
              >
                Start the quiz
              </Link>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
