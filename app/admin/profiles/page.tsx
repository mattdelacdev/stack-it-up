"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase/browser";

interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: "user" | "admin";
  tier: "free" | "pro";
  created_at: string | null;
}

export default function ProfilesAdmin() {
  const [rows, setRows] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Profile | null>(null);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [tierFilter, setTierFilter] = useState("");

  async function load() {
    setLoading(true);
    const { data, error } = await getSupabase()
      .from("profiles")
      .select("id, email, first_name, last_name, role, tier, created_at")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setRows((data ?? []) as Profile[]);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSave(p: Profile) {
    const { error } = await getSupabase()
      .from("profiles")
      .update({
        first_name: p.first_name,
        last_name: p.last_name,
        role: p.role,
        tier: p.tier,
      })
      .eq("id", p.id);
    if (error) {
      alert(error.message);
      return;
    }
    setEditing(null);
    load();
  }

  const q = query.trim().toLowerCase();
  const filtered = rows.filter((r) => {
    if (roleFilter && r.role !== roleFilter) return false;
    if (tierFilter && r.tier !== tierFilter) return false;
    if (!q) return true;
    return (
      r.email.toLowerCase().includes(q) ||
      (r.first_name ?? "").toLowerCase().includes(q) ||
      (r.last_name ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <section>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl sm:text-3xl text-text">
          <span className="text-gradient">PROFILES</span>
        </h1>
      </div>

      {error && <p className="mt-4 text-accent">Error: {error}</p>}
      {loading && <p className="mt-4 text-text/60">Loading…</p>}

      {!loading && rows.length === 0 && (
        <p className="mt-6 text-text/60">No profiles yet.</p>
      )}

      {rows.length > 0 && (
        <>
          <div className="mt-6 flex flex-wrap gap-3">
            <input
              type="search"
              placeholder="Search email, name…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={`${inputCls} flex-1 min-w-[200px]`}
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className={inputCls + " max-w-[200px]"}
            >
              <option value="">All roles</option>
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className={inputCls + " max-w-[200px]"}
            >
              <option value="">All tiers</option>
              <option value="free">free</option>
              <option value="pro">pro</option>
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
                  <th className="px-4 py-3 text-left">FIRST</th>
                  <th className="px-4 py-3 text-left">LAST</th>
                  <th className="px-4 py-3 text-left">ROLE</th>
                  <th className="px-4 py-3 text-left">TIER</th>
                  <th className="px-4 py-3 text-left">CREATED</th>
                  <th className="px-4 py-3 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-text/60">
                      No matches.
                    </td>
                  </tr>
                )}
                {filtered.map((r) => (
                  <tr key={r.id} className="border-t-2 border-primary/20">
                    <td className="px-4 py-3">{r.email}</td>
                    <td className="px-4 py-3">{r.first_name ?? "—"}</td>
                    <td className="px-4 py-3">{r.last_name ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          r.role === "admin"
                            ? "font-display text-xs tracking-[0.2em] text-accent"
                            : "font-display text-xs tracking-[0.2em] text-text/70"
                        }
                      >
                        {r.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          r.tier === "pro"
                            ? "font-display text-xs tracking-[0.2em] text-accent"
                            : "font-display text-xs tracking-[0.2em] text-text/70"
                        }
                      >
                        {(r.tier ?? "free").toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text/60">
                      {r.created_at
                        ? new Date(r.created_at).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        className="font-display text-xs tracking-[0.2em] text-secondary hover:text-accent"
                        onClick={() => setEditing(r)}
                      >
                        EDIT
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {editing && (
        <ProfileModal
          value={editing}
          onCancel={() => setEditing(null)}
          onSave={onSave}
        />
      )}
    </section>
  );
}

function ProfileModal({
  value,
  onCancel,
  onSave,
}: {
  value: Profile;
  onCancel: () => void;
  onSave: (p: Profile) => void;
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
        <h2 className="font-display text-lg text-text">Edit profile</h2>
        <p className="mt-1 font-body text-xs text-text/60">{draft.email}</p>
        <div className="mt-4 grid gap-3">
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
          <Field label="Last name">
            <input
              type="text"
              value={draft.last_name ?? ""}
              onChange={(e) =>
                setDraft({ ...draft, last_name: e.target.value })
              }
              className={inputCls}
            />
          </Field>
          <Field label="Role">
            <select
              value={draft.role}
              onChange={(e) =>
                setDraft({ ...draft, role: e.target.value as Profile["role"] })
              }
              className={inputCls}
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </Field>
          <Field label="Tier">
            <select
              value={draft.tier}
              onChange={(e) =>
                setDraft({ ...draft, tier: e.target.value as Profile["tier"] })
              }
              className={inputCls}
            >
              <option value="free">free</option>
              <option value="pro">pro</option>
            </select>
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
