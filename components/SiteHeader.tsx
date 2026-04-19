"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SupplementSearch from "./SupplementSearch";
import ThemeToggle from "./ThemeToggle";
import AuthNav from "./AuthNav";

type AuthUser = {
  email: string;
  firstName: string | null;
  isAdmin: boolean;
  username: string | null;
} | null;

export default function SiteHeader({ authUser = null }: { authUser?: AuthUser }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMobileOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
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

        <nav className="hidden xl:flex items-center gap-2">
          <Link
            href="/stacks"
            className="font-display text-xs uppercase tracking-wider text-text/80 hover:text-accent transition-colors px-3 py-2"
          >
            Popular Stacks
          </Link>

          <Link
            href="/supplements"
            className="font-display text-xs uppercase tracking-wider text-text/80 hover:text-accent transition-colors px-3 py-2"
          >
            Supplements
          </Link>

          <Link
            href="/pricing"
            className="font-display text-xs uppercase tracking-wider text-text/80 hover:text-accent transition-colors px-3 py-2"
          >
            Pricing
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

          <AuthNav user={authUser} />
        </nav>

        <div className="xl:hidden flex items-center gap-2">
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
          className="xl:hidden border-t-2 border-primary/30 bg-bg-deep/95 backdrop-blur-md animate-fade-in-down origin-top"
        >
          <div className="mx-auto max-w-6xl px-6 py-4">
            <div className="flex flex-col gap-2">
              <Link
                href="/stacks"
                className="font-display text-sm uppercase tracking-wider text-text/80 hover:text-accent px-3 py-2"
              >
                Popular Stacks
              </Link>
              <Link
                href="/supplements"
                className="font-display text-sm uppercase tracking-wider text-text/80 hover:text-accent px-3 py-2"
              >
                Supplements
              </Link>
              <Link
                href="/pricing"
                className="font-display text-sm uppercase tracking-wider text-text/80 hover:text-accent px-3 py-2"
              >
                Pricing
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
              {authUser ? (
                <>
                  <Link
                    href="/settings"
                    className="font-display text-sm uppercase tracking-wider text-text/80 hover:text-accent px-3 py-2"
                  >
                    Settings
                  </Link>
                  {authUser.isAdmin && (
                    <Link
                      href="/admin"
                      className="font-display text-sm uppercase tracking-wider text-text/80 hover:text-accent px-3 py-2"
                    >
                      Admin
                    </Link>
                  )}
                  <form action="/auth/signout" method="post">
                    <button
                      type="submit"
                      className="w-full text-left font-display text-sm uppercase tracking-wider text-primary hover:text-accent px-3 py-2"
                    >
                      Log out
                    </button>
                  </form>
                </>
              ) : (
                <Link
                  href="/login"
                  className="font-display text-sm uppercase tracking-wider text-text/80 hover:text-accent px-3 py-2"
                >
                  Log in
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
