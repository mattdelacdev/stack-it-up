"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase/browser";
import type { Supplement } from "@/lib/supplements";

const TIMINGS: Supplement["timing"][] = [
  "morning",
  "afternoon",
  "evening",
  "anytime",
];
const TAGS: Supplement["tag"][] = ["core", "goal", "lifestyle"];

export default function SupplementsAdmin() {
  const [rows, setRows] = useState<Supplement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<(Supplement & { _isNew?: boolean }) | null>(
    null,
  );
  const [query, setQuery] = useState("");
  const [timingFilter, setTimingFilter] = useState<string>("");
  const [tagFilter, setTagFilter] = useState<string>("");

  async function load() {
    setLoading(true);
    const { data, error } = await getSupabase()
      .from("supplements")
      .select("id, name, dose, timing, why, tag, video_url")
      .order("tag")
      .order("name");
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setRows((data ?? []) as Supplement[]);
  }

  useEffect(() => {
    load();
  }, []);

  async function onDelete(id: string) {
    if (!confirm(`Delete supplement "${id}"?`)) return;
    const { error } = await getSupabase().from("supplements").delete().eq("id", id);
    if (error) {
      alert(error.message);
      return;
    }
    load();
  }

  async function onSave(s: Supplement & { _isNew?: boolean }) {
    const { _isNew, ...payload } = s;
    const { error } = _isNew
      ? await getSupabase().from("supplements").insert(payload)
      : await getSupabase()
          .from("supplements")
          .update(payload)
          .eq("id", payload.id);
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
          <span className="text-gradient">SUPPLEMENTS</span>
        </h1>
        <button
          className="btn-accent"
          onClick={() =>
            setEditing({
              id: "",
              name: "",
              dose: "",
              timing: "anytime",
              why: "",
              tag: "goal",
              video_url: "",
              _isNew: true,
            })
          }
        >
          + New
        </button>
      </div>

      {error && <p className="mt-4 text-accent">Error: {error}</p>}
      {loading && <p className="mt-4 text-text/60">Loading…</p>}

      {!loading && rows.length === 0 && (
        <p className="mt-6 text-text/60">No supplements yet.</p>
      )}

      {rows.length > 0 && (() => {
        const q = query.trim().toLowerCase();
        const filtered = rows.filter((r) => {
          if (timingFilter && r.timing !== timingFilter) return false;
          if (tagFilter && r.tag !== tagFilter) return false;
          if (!q) return true;
          return (
            r.id.toLowerCase().includes(q) ||
            r.name.toLowerCase().includes(q) ||
            r.dose.toLowerCase().includes(q) ||
            r.why.toLowerCase().includes(q)
          );
        });
        return (
        <>
        <div className="mt-6 flex flex-wrap gap-3">
          <input
            type="search"
            placeholder="Search id, name, dose, why…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`${inputCls} flex-1 min-w-[200px]`}
          />
          <select
            value={timingFilter}
            onChange={(e) => setTimingFilter(e.target.value)}
            className={inputCls + " max-w-[180px]"}
          >
            <option value="">All timings</option>
            {TIMINGS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className={inputCls + " max-w-[180px]"}
          >
            <option value="">All tags</option>
            {TAGS.map((t) => (
              <option key={t} value={t}>{t}</option>
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
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">NAME</th>
                <th className="px-4 py-3 text-left">DOSE</th>
                <th className="px-4 py-3 text-left">TIMING</th>
                <th className="px-4 py-3 text-left">TAG</th>
                <th className="px-4 py-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-text/60">
                    No matches.
                  </td>
                </tr>
              )}
              {filtered.map((r) => (
                <tr key={r.id} className="border-t-2 border-primary/20">
                  <td className="px-4 py-3 font-mono text-text/60">{r.id}</td>
                  <td className="px-4 py-3">{r.name}</td>
                  <td className="px-4 py-3">{r.dose}</td>
                  <td className="px-4 py-3">{r.timing}</td>
                  <td className="px-4 py-3">{r.tag}</td>
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
        <SupplementModal
          value={editing}
          onCancel={() => setEditing(null)}
          onSave={onSave}
        />
      )}
    </section>
  );
}

function SupplementModal({
  value,
  onCancel,
  onSave,
}: {
  value: Supplement & { _isNew?: boolean };
  onCancel: () => void;
  onSave: (s: Supplement & { _isNew?: boolean }) => void;
}) {
  const [draft, setDraft] = useState(value);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-deep/80 p-6"
      onClick={onCancel}
    >
      <div
        className="card-retro !max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-lg text-text">
          {value._isNew ? "New supplement" : "Edit supplement"}
        </h2>
        <div className="mt-4 grid gap-3">
          <Field label="ID (slug)">
            <input
              type="text"
              required
              disabled={!value._isNew}
              value={draft.id}
              onChange={(e) => setDraft({ ...draft, id: e.target.value })}
              className={inputCls}
            />
          </Field>
          <Field label="Name">
            <input
              type="text"
              required
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              className={inputCls}
            />
          </Field>
          <Field label="Dose">
            <input
              type="text"
              value={draft.dose}
              onChange={(e) => setDraft({ ...draft, dose: e.target.value })}
              className={inputCls}
            />
          </Field>
          <Field label="Timing">
            <select
              value={draft.timing}
              onChange={(e) =>
                setDraft({ ...draft, timing: e.target.value as Supplement["timing"] })
              }
              className={inputCls}
            >
              {TIMINGS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Tag">
            <select
              value={draft.tag}
              onChange={(e) =>
                setDraft({ ...draft, tag: e.target.value as Supplement["tag"] })
              }
              className={inputCls}
            >
              {TAGS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
          <Field label="YouTube review URL (optional)">
            <input
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              value={draft.video_url ?? ""}
              onChange={(e) =>
                setDraft({ ...draft, video_url: e.target.value || null })
              }
              className={inputCls}
            />
          </Field>
          <Field label="Why">
            <textarea
              rows={4}
              value={draft.why}
              onChange={(e) => setDraft({ ...draft, why: e.target.value })}
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
  "w-full border-2 border-primary/40 bg-bg/60 px-3 py-2 font-body text-text focus:outline-none focus:border-accent disabled:opacity-60";
