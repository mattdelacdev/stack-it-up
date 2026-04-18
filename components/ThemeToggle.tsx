"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial =
      (document.documentElement.dataset.theme as Theme | undefined) ?? "dark";
    setTheme(initial);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  const label = mounted
    ? `Switch to ${theme === "dark" ? "light" : "dark"} theme`
    : "Toggle theme";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="inline-flex items-center justify-center w-10 h-10 border-2 border-primary/50 text-accent hover:bg-primary/10 transition-colors"
    >
      <span aria-hidden className="text-lg leading-none">
        {mounted ? (theme === "dark" ? "☀" : "☾") : "☾"}
      </span>
    </button>
  );
}
