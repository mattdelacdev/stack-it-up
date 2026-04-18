"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase/browser";

interface Subscriber {
  id: string;
  email: string;
  first_name: string | null;
  source: string | null;
  created_at: string | null;
}

export default function SubscribersAdmin() {
  const [rows, setRows] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Subscriber | null>(null);
  const [query, setQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");

  async function load() {
    setLoading(true);
    const { data, error } = await getSupabase()
      .from("subscribers")
      .select("id, email, first_name, source, created_at")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setRows((data ?? []) as Subscriber[]);
  }

  useEffect(() => {
    load();
  }, []);

  async function onDelete(id: string) {
    if (!confirm("Delete this subscriber?")) return;
    const { error } = await getSupabase().from("subscribers").delete().eq("id", id);
    if (error) {
      alert(error.message);
      return;
    }
    load();
  }

  async function onSave(s: Subscriber) {
    const payload = {
      email: s.email,
      first_name: s.first_name,
      source: s.source,
    };
    const { error } = s.id
      ? await getSupabase().from("subscribers").update(payload).eq("id", s.id)
      : await getSupabase().from("subscribers").insert(payload);
    if (error) {
      alert(error.message);
      return;
    }
    setEditing(null);
    load();
  }

  return (
    <section>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl sm:text-3xl text-text">
          <span className="text-gradient">SUBSCRIBERS</span>
        </h1>
        <button
          className="btn-accent"
          onClick={() =>
            setEditing({
              id: "",
              email: "",
              first_name: "",
              source: "admin",
              created_at: null,
            })
          }
        >
          + New
        </button>
      </div>

      {error && <p className="mt-4 text-accent">Error: {error}</p>}
      {loading && <p className="mt-4 text-text/60">Loading…</p>}

      {!loading && rows.length === 0 && (
        <p className="mt-6 text-text/60">No subscribers yet.</p>
      )}

      {rows.length > 0 && (() => {
        const sources = Array.from(
          new Set(rows.map((r) => r.source).filter(Boolean) as string[]),
        ).sort();
        const q = query.trim().toLowerCase();
        const filtered = rows.filter((r) => {
          if (sourceFilter && r.source !== sourceFilter) return false;
          if (!q) return true;
          return (
            r.email.toLowerCase().includes(q) ||
            (r.first_name ?? "").toLowerCase().includes(q) ||
            (r.source ?? "").toLowerCase().includes(q)
          );
        });
        return (
        <>
        <div className="mt-6 flex flex-wrap gap-3">
          <input
            type="search"
            placeholder="Search email, name, source…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`${inputCls} flex-1 min-w-[200px]`}
          />
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className={inputCls + " max-w-[200px]"}
          >
            <option value="">All sources</option>
            {sources.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <span className="self-center font-display text-xs tracking-[0.2em] text-text/60">
            {filtered.length} / {rows.length}
          </span>
        </div>
        <div className="mt-4 overflow-x-auto border-4 border-primary/40">
          <table className="w-full font-body text-sm">
            <thead className="bg-bg-deep/60 font-display text-xs tracking-[0.2em]">
              <tr>
                <th className="px-4 py-3 text-left">EMAIL</th>
                <th className="px-4 py-3 text-left">FIRST NAME</th>
                <th className="px-4 py-3 text-left">SOURCE</th>
                <th className="px-4 py-3 text-left">CREATED</th>
                <th className="px-4 py-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-text/60">
                    No matches.
                  </td>
                </tr>
              )}
              {filtered.map((r) => (
                <tr key={r.id} className="border-t-2 border-primary/20">
                  <td className="px-4 py-3">{r.email}</td>
                  <td className="px-4 py-3">{r.first_name ?? "—"}</td>
                  <td className="px-4 py-3">{r.source ?? "—"}</td>
                  <td className="px-4 py-3 text-text/60">
                    {r.created_at
                      ? new Date(r.created_at).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      className="mr-2 font-display text-xs tracking-[0.2em] text-secondary hover:text-accent"
                      onClick={() => setEditing(r)}
                    >
                      EDIT
                    </button>
                    <button
                      className="font-display text-xs tracking-[0.2em] text-primary hover:text-accent"
                      onClick={() => onDelete(r.id)}
                    >
                      DELETE
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
        );
      })()}

      {editing && (
        <SubscriberModal
          value={editing}
          onCancel={() => setEditing(null)}
          onSave={onSave}
        />
      )}
    </section>
  );
}

function SubscriberModal({
  value,
  onCancel,
  onSave,
}: {
  value: Subscriber;
  onCancel: () => void;
  onSave: (s: Subscriber) => void;
}) {
  const [draft, setDraft] = useState(value);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-deep/80 p-6"
      onClick={onCancel}
    >
      <div
        className="card-retro !max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-lg text-text">
          {value.id ? "Edit subscriber" : "New subscriber"}
        </h2>
        <div className="mt-4 grid gap-3">
          <Field label="Email">
            <input
              type="email"
              required
              value={draft.email}
              onChange={(e) => setDraft({ ...draft, email: e.target.value })}
              className={inputCls}
            />
          </Field>
          <Field label="First name">
            <input
              type="text"
              value={draft.first_name ?? ""}
              onChange={(e) =>
                setDraft({ ...draft, first_name: e.target.value })
              }
              className={inputCls}
            />
          </Field>
          <Field label="Source">
            <input
              type="text"
              value={draft.source ?? ""}
              onChange={(e) => setDraft({ ...draft, source: e.target.value })}
              className={inputCls}
            />
          </Field>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-primary" onClick={() => onSave(draft)}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="font-display text-xs tracking-[0.2em] text-text/70">
        {label.toUpperCase()}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

const inputCls =
  "w-full border-2 border-primary/40 bg-bg/60 px-3 py-2 font-body text-text focus:outline-none focus:border-accent";
