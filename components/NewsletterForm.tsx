"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/supabase";

export default function NewsletterForm() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!firstName.trim()) {
      setError("Please enter your first name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);
    setPending(true);
    const { error: dbError } = await getSupabase()
      .from("subscribers")
      .insert({ email, first_name: firstName.trim(), source: "newsletter" });
    setPending(false);
    if (dbError && dbError.code !== "23505") {
      setError("Something went wrong. Please try again.");
      return;
    }
    setSubmitted(true);
  }

  return (
    <section
      id="newsletter"
      className="relative z-10 scroll-mt-24 border-t-4 border-primary/30 bg-bg-deep/40"
    >
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
        <div className="card-retro !border-accent">
          <h2 className="font-display text-2xl sm:text-3xl text-text">
            Join the <span className="text-accent">newsletter</span>
          </h2>
          <p className="mt-3 text-text/70">
            Boring, reliable science in your inbox. No spam, unsubscribe anytime.
          </p>

          {submitted ? (
            <p className="mt-6 font-display text-primary">
              Thanks, {firstName}! You&apos;re on the list.
            </p>
          ) : (
            <form onSubmit={onSubmit} noValidate className="mt-6 grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
              <div>
                <label htmlFor="nl-first-name" className="sr-only">
                  First name
                </label>
                <input
                  id="nl-first-name"
                  name="firstName"
                  type="text"
                  required
                  autoComplete="given-name"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border-2 border-primary/40 bg-bg/60 px-4 py-3 font-body text-text placeholder:text-text/40 focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label htmlFor="nl-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="nl-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-2 border-primary/40 bg-bg/60 px-4 py-3 font-body text-text placeholder:text-text/40 focus:outline-none focus:border-accent"
                />
              </div>
              <button type="submit" className="btn-primary" disabled={pending}>
                {pending ? "Subscribing…" : "Subscribe →"}
              </button>
              {error && (
                <p role="alert" className="sm:col-span-3 text-sm text-accent">
                  {error}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
