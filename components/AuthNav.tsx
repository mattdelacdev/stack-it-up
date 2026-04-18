"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type AuthUser = {
  email: string;
  firstName: string | null;
  isAdmin: boolean;
  username: string | null;
} | null;

export default function AuthNav({ user }: { user: AuthUser }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  if (!user) {
    return (
      <Link
        href="/login"
        className="font-display text-xs uppercase tracking-wider text-text/80 hover:text-accent transition-colors px-3 py-2"
      >
        Log in
      </Link>
    );
  }

  const label = user.firstName || user.email.split("@")[0];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className="font-display text-xs uppercase tracking-wider text-text/80 hover:text-accent transition-colors px-3 py-2 inline-flex items-center gap-1.5 max-w-[140px]"
      >
        <span className="truncate">{label}</span>
        <span
          aria-hidden
          className={`text-accent transition-transform ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-48 border-2 border-primary/40 bg-bg-deep/95 backdrop-blur-md shadow-xl"
        >
          <ul className="py-2">
            {user.username && (
              <li>
                <Link
                  role="menuitem"
                  href={`/u/${user.username}`}
                  className="block px-4 py-2 font-display text-xs tracking-[0.2em] text-text/80 hover:bg-primary/10 hover:text-accent"
                >
                  MY PROFILE
                </Link>
              </li>
            )}
            <li>
              <Link
                role="menuitem"
                href="/account"
                className="block px-4 py-2 font-display text-xs tracking-[0.2em] text-text/80 hover:bg-primary/10 hover:text-accent"
              >
                ACCOUNT
              </Link>
            </li>
            {user.isAdmin && (
              <li>
                <Link
                  role="menuitem"
                  href="/admin"
                  className="block px-4 py-2 font-display text-xs tracking-[0.2em] text-text/80 hover:bg-primary/10 hover:text-accent"
                >
                  ADMIN
                </Link>
              </li>
            )}
            <li>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="w-full text-left block px-4 py-2 font-display text-xs tracking-[0.2em] text-primary hover:bg-primary/10 hover:text-accent"
                >
                  LOG OUT
                </button>
              </form>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
