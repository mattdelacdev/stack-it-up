"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase/browser";

interface Feedback {
  id: string;
  user_id: string | null;
  email: string | null;
  message: string;
  page: string | null;
  user_agent: string | null;
  created_at: string | null;
}

export default function FeedbackAdmin() {
  const [rows, setRows] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  async function load() {
    setLoading(true);
    const { data, error } = await getSupabase()
      .from("feedback")
      .select("id, user_id, email, message, page, user_agent, created_at")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setRows((data ?? []) as Feedback[]);
  }

  useEffect(() => {
    load();
  }, []);

  async function onDelete(id: string) {
    if (!confirm("Delete this feedback?")) return;
    const { error } = await getSupabase().from("feedback").delete().eq("id", id);
    if (error) {
      alert(error.message);
      return;
    }
    load();
  }

  const q = query.trim().toLowerCase();
  const filtered = rows.filter((r) => {
    if (!q) return true;
    return (
      r.message.toLowerCase().includes(q) ||
      (r.email ?? "").toLowerCase().includes(q) ||
      (r.page ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <section>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl sm:text-3xl text-text">
          <span className="text-gradient">FEEDBACK</span>
        </h1>
        <span className="font-display text-xs tracking-[0.2em] text-text/60">
          {filtered.length} / {rows.length}
        </span>
      </div>

      {error && <p className="mt-4 text-accent">Error: {error}</p>}
      {loading && <p className="mt-4 text-text/60">Loading…</p>}

      {!loading && rows.length === 0 && (
        <p className="mt-6 text-text/60">No feedback yet.</p>
      )}

      {rows.length > 0 && (
        <>
          <div className="mt-6">
            <input
              type="search"
              placeholder="Search message, email, page…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border-2 border-primary/40 bg-bg/60 px-3 py-2 font-body text-text focus:outline-none focus:border-accent"
            />
          </div>
          <ul className="mt-6 space-y-4">
            {filtered.map((r) => (
              <li
                key={r.id}
                className="border-4 border-primary/40 bg-bg-deep/40 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 font-display text-xs tracking-[0.2em] text-text/60">
                  <span>
                    {r.created_at
                      ? new Date(r.created_at).toLocaleString()
                      : "—"}
                  </span>
                  <button
                    onClick={() => onDelete(r.id)}
                    className="text-primary hover:text-accent"
                  >
                    DELETE
                  </button>
                </div>
                <p className="mt-3 whitespace-pre-wrap font-body text-text">
                  {r.message}
                </p>
                <dl className="mt-4 grid gap-1 font-body text-sm text-text/70 sm:grid-cols-[120px_1fr]">
                  <dt className="font-display text-xs tracking-[0.2em] text-text/50">
                    EMAIL
                  </dt>
                  <dd>
                    {r.email ? (
                      <a
                        href={`mailto:${r.email}`}
                        className="text-secondary hover:text-accent"
                      >
                        {r.email}
                      </a>
                    ) : (
                      <span className="text-text/40">—</span>
                    )}
                  </dd>
                  <dt className="font-display text-xs tracking-[0.2em] text-text/50">
                    PAGE
                  </dt>
                  <dd className="truncate">
                    {r.page ?? <span className="text-text/40">—</span>}
                  </dd>
                  <dt className="font-display text-xs tracking-[0.2em] text-text/50">
                    USER
                  </dt>
                  <dd className="truncate font-mono text-xs">
                    {r.user_id ?? (
                      <span className="text-text/40 font-body">
                        anonymous
                      </span>
                    )}
                  </dd>
                </dl>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="text-center text-text/60">No matches.</li>
            )}
          </ul>
        </>
      )}
    </section>
  );
}
