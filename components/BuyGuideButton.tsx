"use client";

import { useState } from "react";

export function BuyGuideButton() {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="btn-accent disabled:opacity-60"
    >
      {loading ? "Redirecting…" : "Buy the PDF Guide — $9"}
    </button>
  );
}
