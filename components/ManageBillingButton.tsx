"use client";

import { useState } from "react";

export default function ManageBillingButton({
  className = "font-display text-xs uppercase tracking-[0.2em] text-text/70 hover:text-accent",
  label = "Manage →",
}: {
  className?: string;
  label?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.url) {
        throw new Error(data?.error || "Could not open billing portal");
      }
      window.location.href = data.url;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Could not open portal";
      setError(msg);
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className={`${className} disabled:opacity-60`}
      >
        {loading ? "Loading…" : label}
      </button>
      {error && (
        <p className="mt-2 text-xs text-red-400 font-mono">⚠ {error}</p>
      )}
    </>
  );
}
