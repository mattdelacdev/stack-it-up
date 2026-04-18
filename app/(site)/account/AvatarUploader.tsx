"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase/browser";

export default function AvatarUploader({
  userId,
  initialUrl,
  googleUrl,
  uploadedPath,
}: {
  userId: string;
  initialUrl: string | null;
  googleUrl: string | null;
  uploadedPath: string | null;
}) {
  const router = useRouter();
  const [url, setUrl] = useState(initialUrl);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(file: File) {
    setError(null);
    if (file.size > 5 * 1024 * 1024) {
      setError("Max 5MB.");
      return;
    }
    if (!/^image\/(png|jpe?g|webp|gif)$/.test(file.type)) {
      setError("Use PNG, JPG, WEBP, or GIF.");
      return;
    }
    setBusy(true);
    const supabase = getSupabase();
    const ext = file.name.split(".").pop()?.toLowerCase() || "png";
    const path = `${userId}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, cacheControl: "3600" });
    if (upErr) {
      setBusy(false);
      setError(upErr.message);
      return;
    }
    const { error: dbErr } = await supabase
      .from("profiles")
      .update({ avatar_uploaded_path: path })
      .eq("id", userId);
    if (dbErr) {
      setBusy(false);
      setError(dbErr.message);
      return;
    }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    setUrl(data.publicUrl);
    setBusy(false);
    router.refresh();
  }

  async function revertToGoogle() {
    setBusy(true);
    setError(null);
    const supabase = getSupabase();
    if (uploadedPath) {
      await supabase.storage.from("avatars").remove([uploadedPath]);
    }
    const { error: dbErr } = await supabase
      .from("profiles")
      .update({ avatar_uploaded_path: null })
      .eq("id", userId);
    setBusy(false);
    if (dbErr) {
      setError(dbErr.message);
      return;
    }
    setUrl(googleUrl);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-5">
      <div className="h-20 w-20 shrink-0 overflow-hidden border-4 border-primary/60 bg-bg-deep">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt="Your avatar"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-2xl text-text/50">
            ?
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="font-display text-xs tracking-[0.2em] text-text/70">
          AVATAR
        </div>
        <div className="mt-2 flex flex-wrap gap-3">
          <label className="btn-secondary cursor-pointer">
            {busy ? "Uploading…" : "Upload"}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              disabled={busy}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onFile(f);
                e.target.value = "";
              }}
            />
          </label>
          {uploadedPath && googleUrl && (
            <button
              type="button"
              onClick={revertToGoogle}
              disabled={busy}
              className="font-display text-xs tracking-[0.2em] text-text/70 hover:text-accent"
            >
              USE GOOGLE PHOTO
            </button>
          )}
        </div>
        {error && <p className="mt-2 text-xs text-accent">{error}</p>}
        <p className="mt-2 text-xs text-text/50">
          PNG, JPG, WEBP, or GIF. Max 5MB.
        </p>
      </div>
    </div>
  );
}
