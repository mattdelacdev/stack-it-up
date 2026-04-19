"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { fetchSupplementList, type Supplement } from "@/lib/supplements";
import { fetchFeaturedStacks, type FeaturedStackSummary } from "@/lib/featured-stacks";
import { benefitList } from "@/lib/benefits";

type ResultKind = "supplement" | "stack" | "benefit";

type Result = {
  kind: ResultKind;
  id: string;
  href: string;
  title: string;
  subtitle: string;
  badge: string;
};

const KIND_LABEL: Record<ResultKind, string> = {
  supplement: "Supplements",
  stack: "Featured stacks",
  benefit: "Benefits",
};

const KIND_ORDER: ResultKind[] = ["stack", "benefit", "supplement"];

export default function SupplementSearch() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [supplements, setSupplements] = useState<Supplement[] | null>(null);
  const [stacks, setStacks] = useState<FeaturedStackSummary[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function ensureLoaded() {
    if ((supplements && stacks) || loading) return;
    setLoading(true);
    try {
      const [s, st] = await Promise.all([fetchSupplementList(), fetchFeaturedStacks()]);
      setSupplements(s);
      setStacks(st);
    } catch {
      setSupplements(supplements ?? []);
      setStacks(stacks ?? []);
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
      setActiveIdx(0);
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const allResults = useMemo<Result[]>(() => {
    const out: Result[] = [];
    for (const s of stacks ?? []) {
      out.push({
        kind: "stack",
        id: s.slug,
        href: `/stacks/${s.slug}`,
        title: s.name,
        subtitle: s.tagline,
        badge: "STACK",
      });
    }
    for (const b of benefitList) {
      out.push({
        kind: "benefit",
        id: b.slug,
        href: `/optimize/${b.slug}`,
        title: b.title,
        subtitle: b.tagline,
        badge: "OPTIMIZE",
      });
    }
    for (const s of supplements ?? []) {
      out.push({
        kind: "supplement",
        id: s.id,
        href: `/supplements/${s.id}`,
        title: s.name,
        subtitle: s.why,
        badge: s.tag.toUpperCase(),
      });
    }
    return out;
  }, [supplements, stacks]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? allResults.filter(
          (r) =>
            r.title.toLowerCase().includes(q) ||
            r.subtitle.toLowerCase().includes(q) ||
            r.badge.toLowerCase().includes(q),
        )
      : allResults;
    return list.slice(0, 30);
  }, [allResults, query]);

  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  const grouped = useMemo(() => {
    const map = new Map<ResultKind, Result[]>();
    for (const r of filtered) {
      const list = map.get(r.kind) ?? [];
      list.push(r);
      map.set(r.kind, list);
    }
    return KIND_ORDER.filter((k) => map.has(k)).map((k) => ({
      kind: k,
      items: map.get(k)!,
    }));
  }, [filtered]);

  function onInputKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      const chosen = filtered[activeIdx];
      if (chosen) {
        window.location.href = chosen.href;
        setOpen(false);
      }
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label="Search"
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
          aria-label="Search StackItUp"
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
                onKeyDown={onInputKey}
                placeholder="Search stacks, benefits, supplements…"
                style={{ boxShadow: "none", outline: "none" }}
                className="flex-1 bg-transparent font-mono text-sm text-text placeholder:text-text/40"
              />
              <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-widest text-text/40 border border-text/15 px-1.5 py-0.5">
                ⌘K
              </span>
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
              {loading && !supplements ? (
                <p className="px-4 py-6 text-sm font-mono text-text/60">Loading…</p>
              ) : filtered.length === 0 ? (
                <p className="px-4 py-6 text-sm font-mono text-text/60">
                  Nothing matches “{query}”.
                </p>
              ) : (
                <div className="py-2">
                  {grouped.map((group) => (
                    <section key={group.kind} className="mb-2">
                      <p className="px-4 pt-2 pb-1 font-display text-[10px] uppercase tracking-widest text-text/40">
                        {KIND_LABEL[group.kind]}
                      </p>
                      <ul>
                        {group.items.map((r) => {
                          const globalIdx = filtered.indexOf(r);
                          const isActive = globalIdx === activeIdx;
                          return (
                            <li key={`${r.kind}-${r.id}`}>
                              <Link
                                href={r.href}
                                onClick={() => setOpen(false)}
                                onMouseEnter={() => setActiveIdx(globalIdx)}
                                className={`flex items-start justify-between gap-3 px-4 py-2.5 group ${
                                  isActive ? "bg-primary/15" : "hover:bg-primary/10"
                                }`}
                              >
                                <span>
                                  <span
                                    className={`block font-display text-sm transition-colors ${
                                      isActive ? "text-primary" : "text-accent group-hover:text-primary"
                                    }`}
                                  >
                                    {r.title}
                                  </span>
                                  <span className="block text-xs text-text/60 mt-0.5 line-clamp-1">
                                    {r.subtitle}
                                  </span>
                                </span>
                                <span className="font-display text-[9px] tracking-widest text-text/50 mt-1 shrink-0">
                                  {r.badge}
                                </span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </section>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
