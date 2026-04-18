"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { fetchSupplementList, type Supplement } from "@/lib/supplements";

export default function SupplementSearch() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Supplement[] | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function ensureLoaded() {
    if (items || loading) return;
    setLoading(true);
    try {
      const list = await fetchSupplementList();
      setItems(list);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      ensureLoaded();
      setTimeout(() => inputRef.current?.focus(), 0);
      document.body.style.overflow = "hidden";
    } else {
      setQuery("");
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const results = useMemo(() => {
    if (!items) return [];
    const q = query.trim().toLowerCase();
    if (!q) return items.slice(0, 10);
    return items
      .filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.why.toLowerCase().includes(q) ||
          s.tag.toLowerCase().includes(q),
      )
      .slice(0, 20);
  }, [items, query]);

  return (
    <>
      <button
        type="button"
        aria-label="Search supplements"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center w-10 h-10 border-2 border-primary/50 text-accent hover:bg-primary/10 transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden>
          <circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <path d="M14 14l4 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
        </svg>
      </button>

      {open && mounted && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search supplements"
          className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-20 sm:pt-28"
        >
          <button
            type="button"
            aria-label="Close search"
            onClick={() => setOpen(false)}
            style={{ boxShadow: "none", outline: "none" }}
            className="absolute inset-0 bg-bg-deep/80 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-xl border-2 border-primary/50 bg-bg-deep shadow-retro">
            <div className="flex items-center gap-3 border-b-2 border-primary/30 px-4 py-3">
              <svg
                width="18"
                height="18"
                viewBox="0 0 20 20"
                className="text-accent shrink-0"
                aria-hidden
              >
                <circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="2.5" />
                <path
                  d="M14 14l4 4"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="square"
                />
              </svg>
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search supplements…"
                style={{ boxShadow: "none", outline: "none" }}
                className="flex-1 bg-transparent font-mono text-sm text-text placeholder:text-text/40"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="font-mono text-[10px] uppercase tracking-widest text-text/50 border border-text/20 px-1.5 py-0.5"
                aria-label="Close"
              >
                Esc
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {loading && !items ? (
                <p className="px-4 py-6 text-sm font-mono text-text/60">Loading…</p>
              ) : results.length === 0 ? (
                <p className="px-4 py-6 text-sm font-mono text-text/60">
                  No supplements match “{query}”.
                </p>
              ) : (
                <ul className="py-2">
                  {results.map((s) => (
                    <li key={s.id}>
                      <Link
                        href={`/supplements/${s.id}`}
                        onClick={() => setOpen(false)}
                        className="flex items-start justify-between gap-3 px-4 py-3 hover:bg-primary/10 group"
                      >
                        <span>
                          <span className="block font-display text-sm text-accent group-hover:text-primary transition-colors">
                            {s.name}
                          </span>
                          <span className="block text-xs text-text/60 mt-0.5 line-clamp-1">
                            {s.why}
                          </span>
                        </span>
                        <span className="font-display text-[9px] tracking-widest text-text/50 mt-1 shrink-0">
                          {s.tag.toUpperCase()}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
