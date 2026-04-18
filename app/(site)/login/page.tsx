import { redirect } from "next/navigation";
import { getServerSupabase } from "@/lib/supabase/server";
import { headers } from "next/headers";

export const metadata = { title: "Log in — StackItUp" };

async function signInWithGoogle(formData: FormData) {
  "use server";
  const next = (formData.get("next") as string) || "/";
  const supabase = await getServerSupabase();
  const hdrs = await headers();
  const origin = hdrs.get("origin") ?? `https://${hdrs.get("host")}`;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });
  if (error) throw new Error(error.message);
  if (data.url) redirect(data.url);
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next = "/" } = await searchParams;
  return (
    <main className="min-h-screen flex items-center justify-center bg-bg text-text px-6">
      <div className="card-retro !max-w-md w-full text-center">
        <h1 className="font-display text-2xl sm:text-3xl">
          <span className="text-gradient">LOG IN</span>
        </h1>
        <p className="mt-3 text-text/70">
          Sign in with Google to manage your account.
        </p>
        <form action={signInWithGoogle} className="mt-6">
          <input type="hidden" name="next" value={next} />
          <button type="submit" className="btn-primary w-full">
            Continue with Google →
          </button>
        </form>
      </div>
    </main>
  );
}
