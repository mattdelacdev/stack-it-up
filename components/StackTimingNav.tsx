"use client";

import { useEffect, useState } from "react";

type Section = { id: string; label: string; emoji: string; accent: string };

export default function StackTimingNav({ sections }: { sections: Section[] }) {
  const [active, setActive] = useState<string | null>(sections[0]?.id ?? null);

  useEffect(() => {
    if (sections.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );
    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [sections]);

  if (sections.length < 2) return null;

  return (
    <nav
      aria-label="Jump to time of day"
      className="sticky top-2 z-30 mt-6 -mx-2 overflow-x-auto px-2"
    >
      <ul className="inline-flex items-center gap-2 border-4 border-primary/40 bg-bg-deep/90 backdrop-blur px-2 py-2 shadow-retro">
        {sections.map((s) => {
          const isActive = active === s.id;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={`inline-flex items-center gap-2 px-3 py-1.5 font-display text-[11px] sm:text-xs uppercase tracking-[0.2em] transition-colors ${
                  isActive
                    ? `${s.accent} border-b-2 border-current`
                    : "text-text/60 hover:text-accent"
                }`}
              >
                <span aria-hidden>{s.emoji}</span>
                <span>{s.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
