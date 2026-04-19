"use client";

import { useEffect, useState } from "react";

type Pref = "native" | "si";

export default function DoseUnitToggle() {
  const [pref, setPref] = useState<Pref>("native");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial =
      (document.documentElement.dataset.dosePref as Pref | undefined) ?? "native";
    setPref(initial);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Pref = pref === "native" ? "si" : "native";
    setPref(next);
    document.documentElement.dataset.dosePref = next;
    try {
      localStorage.setItem("dosePref", next);
    } catch {}
  };

  const label = mounted
    ? pref === "si"
      ? "Showing SI units. Switch to native units"
      : "Showing native units. Switch to SI (mcg/mg)"
    : "Toggle dose units";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="inline-flex items-center justify-center h-10 min-w-10 px-2 border-2 border-primary/50 text-accent hover:bg-primary/10 transition-colors font-display text-[10px] tracking-[0.15em]"
    >
      {mounted ? (pref === "si" ? "SI" : "IU") : "IU"}
    </button>
  );
}
