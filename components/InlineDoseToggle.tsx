"use client";

import { useEffect, useState } from "react";

type Pref = "native" | "si";

export default function InlineDoseToggle({ nativeUnit }: { nativeUnit: string }) {
  const [pref, setPref] = useState<Pref>("native");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial =
      (document.documentElement.dataset.dosePref as Pref | undefined) ?? "native";
    setPref(initial);
    setMounted(true);

    const observer = new MutationObserver(() => {
      const current =
        (document.documentElement.dataset.dosePref as Pref | undefined) ?? "native";
      setPref(current);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-dose-pref"],
    });
    return () => observer.disconnect();
  }, []);

  const set = (next: Pref) => {
    setPref(next);
    document.documentElement.dataset.dosePref = next;
    try {
      localStorage.setItem("dosePref", next);
    } catch {}
  };

  const nativeLabel = nativeUnit === "IU" ? "IU" : nativeUnit;
  const siLabel = "SI";

  return (
    <div className="inline-flex items-center gap-2">
      <span
        className="font-display text-[9px] uppercase tracking-[0.2em] text-text/50 hidden sm:inline"
        aria-hidden
      >
        Units:
      </span>
      <div
        role="group"
        aria-label="Change dose units"
        className="inline-flex items-center gap-1 border-2 border-primary/40 p-0.5"
      >
        <button
          type="button"
          onClick={() => set("native")}
          aria-pressed={mounted && pref === "native"}
          title={`Show in ${nativeLabel}`}
          className={`px-2 py-1 font-display text-[10px] tracking-[0.15em] uppercase transition-colors ${
            !mounted || pref === "native"
              ? "bg-accent text-bg"
              : "text-text/70 hover:text-accent"
          }`}
        >
          {nativeLabel}
        </button>
        <button
          type="button"
          onClick={() => set("si")}
          aria-pressed={mounted && pref === "si"}
          title="Show in SI units (mg/mcg)"
          className={`px-2 py-1 font-display text-[10px] tracking-[0.15em] uppercase transition-colors ${
            mounted && pref === "si"
              ? "bg-accent text-bg"
              : "text-text/70 hover:text-accent"
          }`}
        >
          {siLabel}
        </button>
      </div>
    </div>
  );
}
