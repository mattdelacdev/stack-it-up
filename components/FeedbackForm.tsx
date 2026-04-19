"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { getSupabase } from "@/lib/supabase/browser";

export default function FeedbackForm() {
  const pathname = usePathname();
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = message.trim();
    if (trimmed.length < 3) {
      setError("Please share a bit more detail.");
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("That email doesn't look right.");
      return;
    }
    setError(null);
    setPending(true);
    const supabase = getSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error: dbError } = await supabase.from("feedback").insert({
      message: trimmed,
      email: email.trim() || user?.email || null,
      page: pathname ?? null,
      user_id: user?.id ?? null,
      user_agent:
        typeof navigator !== "undefined" ? navigator.userAgent : null,
    });
    setPending(false);
    if (dbError) {
      setError("Something went wrong. Please try again.");
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="card-retro !border-accent">
        <h2 className="font-display text-2xl text-text">
          Thanks for the <span className="text-accent">feedback</span>.
        </h2>
        <p className="mt-3 text-text/70">
          We read every note. If you left an email we may reach out.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="card-retro grid gap-4">
      <div>
        <label
          htmlFor="fb-message"
          className="font-display text-xs tracking-[0.2em] text-text/70"
        >
          YOUR FEEDBACK
        </label>
        <textarea
          id="fb-message"
          required
          rows={6}
          maxLength={4000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What's working, what's broken, what do you wish we had?"
          className="mt-1 w-full border-2 border-primary/40 bg-bg/60 px-4 py-3 font-body text-text placeholder:text-text/40 focus:outline-none focus:border-accent"
        />
      </div>
      <div>
        <label
          htmlFor="fb-email"
          className="font-display text-xs tracking-[0.2em] text-text/70"
        >
          EMAIL <span className="text-text/40">(optional)</span>
        </label>
        <input
          id="fb-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-1 w-full border-2 border-primary/40 bg-bg/60 px-4 py-3 font-body text-text placeholder:text-text/40 focus:outline-none focus:border-accent"
        />
      </div>
      {error && (
        <p role="alert" className="text-sm text-accent">
          {error}
        </p>
      )}
      <div>
        <button type="submit" className="btn-primary" disabled={pending}>
          {pending ? "Sending…" : "Send feedback →"}
        </button>
      </div>
    </form>
  );
}
