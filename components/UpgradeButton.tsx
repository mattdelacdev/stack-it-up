"use client";

import { useState } from "react";

export default function UpgradeButton({
  signedIn,
  className = "btn-accent w-full text-center",
  label = "Upgrade to Pro",
}: {
  signedIn: boolean;
  className?: string;
  label?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    if (!signedIn) {
      window.location.href = "/login?next=/pricing";
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/checkout", { method: "POST" });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.url) {
        throw new Error(data?.error || "Checkout failed");
      }
      window.location.href = data.url;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Checkout failed";
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
