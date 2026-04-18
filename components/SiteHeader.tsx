"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { benefitList } from "@/lib/benefits";
import SupplementSearch from "./SupplementSearch";
import ThemeToggle from "./ThemeToggle";

export default function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(false);
  const desktopRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMobileOpen(false);
    setDesktopOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (desktopRef.current && !desktopRef.current.contains(e.target as Node)) {
        setDesktopOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setDesktopOpen(false);
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-primary/30 bg-bg/80 backdrop-blur-md supports-[backdrop-filter]:bg-bg/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-display text-lg text-primary tracking-widest hover:text-accent transition-colors sm:text-2xl"
        >
          STACK<span className="text-accent">·</span>IT<span className="text-accent">·</span>UP
        </Link>

        <nav className="hidden lg:flex items-center gap-2">
          <div className="relative" ref={desktopRef}>
            <button
              type="button"
              aria-expanded={desktopOpen}
              aria-haspopup="true"
              onClick={() => setDesktopOpen((v) => !v)}
              className="font-display text-xs uppercase tracking-wider text-text/80 hover:text-accent transition-colors px-3 py-2 inline-flex items-center gap-1.5"
            >
              Optimize
              <span
                aria-hidden
                className={`text-accent transition-transform ${desktopOpen ? "rotate-180" : ""}`}
              >
                ▾
              </span>
            </button>
            {desktopOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-72 border-2 border-primary/40 bg-bg-deep/95 backdrop-blur-md shadow-xl"
              >
                <ul className="py-2">
                  {benefitList.map((b) => (
                    <li key={b.slug}>
                      <Link
                        role="menuitem"
                        href={`/optimize/${b.slug}`}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-primary/10 group"
                      >
                        <span className="text-2xl leading-none" aria-hidden>
                          {b.emoji}
                        </span>
                        <span>
                          <span className="block font-display text-sm text-accent group-hover:text-primary transition-colors">
                            {b.title}
                          </span>
                          <span className="block text-xs text-text/60 mt-0.5">
                            {b.tagline}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <Link
            href="/supplements"
            className="font-display text-xs uppercase tracking-wider text-text/80 hover:text-accent transition-colors px-3 py-2"
          >
            Supplements
          </Link>

          <Link
            href="/#how"
            className="font-display text-xs uppercase tracking-wider text-text/80 hover:text-accent transition-colors px-3 py-2"
          >
            How it works
          </Link>

          <Link
            href="/#newsletter"
            className="font-display text-xs uppercase tracking-wider text-text/80 hover:text-accent transition-colors px-3 py-2"
          >
            Newsletter
          </Link>

          <ThemeToggle />

          <Link
            href="/quiz"
            className="inline-flex items-center justify-center h-10 px-4 border-2 border-primary font-display text-xs uppercase tracking-wider text-primary hover:bg-primary hover:text-bg transition-colors"
          >
            Start Quiz
          </Link>

          <SupplementSearch />
        </nav>

        <div className="lg:hidden flex items-center gap-2">
          <SupplementSearch />
          <ThemeToggle />

        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileOpen((v) => !v)}
          className="inline-flex items-center justify-center w-10 h-10 border-2 border-primary/50 text-accent hover:bg-primary/10 transition-colors"
        >
          <span className="sr-only">Toggle menu</span>
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
            {mobileOpen ? (
              <path
                d="M4 4l12 12M16 4L4 16"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="square"
              />
            ) : (
              <path
                d="M3 6h14M3 10h14M3 14h14"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="square"
              />
            )}
          </svg>
        </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          id="mobile-nav"
          className="lg:hidden border-t-2 border-primary/30 bg-bg-deep/95 backdrop-blur-md animate-fade-in-down origin-top"
        >
          <div className="mx-auto max-w-6xl px-6 py-4">
            <p className="font-display text-xs uppercase tracking-[0.2em] text-text/50 mb-3">
              Optimize
            </p>
            <ul className="grid grid-cols-1 gap-1 mb-5">
              {benefitList.map((b) => (
                <li key={b.slug}>
                  <Link
                    href={`/optimize/${b.slug}`}
                    className="flex items-center gap-3 px-3 py-3 border-l-4 border-accent/50 bg-bg/40 hover:bg-primary/10"
                  >
                    <span className="text-2xl leading-none" aria-hidden>
                      {b.emoji}
                    </span>
                    <span>
                      <span className="block font-display text-sm text-accent">
                        {b.title}
                      </span>
                      <span className="block text-xs text-text/60 mt-0.5">
                        {b.tagline}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-2">
              <Link
                href="/supplements"
                className="font-display text-sm uppercase tracking-wider text-text/80 hover:text-accent px-3 py-2"
              >
                Supplements
              </Link>
              <Link
                href="/#how"
                className="font-display text-sm uppercase tracking-wider text-text/80 hover:text-accent px-3 py-2"
              >
                How it works
              </Link>
              <Link
                href="/#newsletter"
                className="font-display text-sm uppercase tracking-wider text-text/80 hover:text-accent px-3 py-2"
              >
                Newsletter
              </Link>
              <Link href="/quiz" className="btn-primary !text-sm !px-5 !py-3 text-center">
                Start the Quiz →
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
