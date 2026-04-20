"use client";

import { Bungee, Space_Grotesk } from "next/font/google";
import { useEffect } from "react";
import "./globals.css";

const display = Bungee({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display",
  display: "swap",
});

const body = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-body",
  display: "swap",
});

export default function GlobalError({
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
    <html lang="en" data-theme="dark" className={`${display.variable} ${body.variable}`}>
      <body>
        <div className="relative overflow-hidden min-h-screen">
          <div className="pointer-events-none absolute inset-0 retro-grid opacity-30" aria-hidden />

          <main className="relative z-10">
            <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-36">
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
                  A server error occurred. Reload to try again.
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
                  <a
                    href="/"
                    className="font-display text-sm sm:text-base uppercase tracking-wider text-text/70 hover:text-accent transition-colors underline underline-offset-8 decoration-2 decoration-primary/50 hover:decoration-accent px-2 py-3"
                  >
                    Back to home
                  </a>
                </div>
              </div>
            </section>
          </main>
        </div>
      </body>
    </html>
  );
}
