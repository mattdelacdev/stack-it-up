import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentProfile, getServerSupabase } from "@/lib/supabase/server";

export const metadata = { title: "Account — StackItUp" };

async function updateProfile(formData: FormData) {
  "use server";
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account");

  const first_name = (formData.get("first_name") as string | null)?.trim() || null;
  const last_name = (formData.get("last_name") as string | null)?.trim() || null;
  const email = (formData.get("email") as string | null)?.trim() || "";

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ first_name, last_name })
    .eq("id", user.id);
  if (profileError) throw new Error(profileError.message);

  let emailNotice = "";
  if (email && email !== user.email) {
    const { error: emailError } = await supabase.auth.updateUser({ email });
    if (emailError) throw new Error(emailError.message);
    emailNotice = "&emailPending=1";
  }

  revalidatePath("/account");
  redirect(`/account?saved=1${emailNotice}`);
}

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; emailPending?: string }>;
}) {
  const { profile, user } = await getCurrentProfile();
  if (!user) redirect("/login?next=/account");

  const { saved, emailPending } = await searchParams;

  return (
    <main className="min-h-screen bg-bg text-text px-6 py-16">
      <div className="mx-auto max-w-xl">
        <h1 className="font-display text-3xl sm:text-4xl">
          <span className="text-gradient">ACCOUNT</span>
        </h1>
        <p className="mt-3 text-text/70">
          Update your profile. Changes save immediately.
        </p>

        {saved && (
          <div className="mt-6 border-2 border-secondary/60 bg-secondary/10 px-4 py-3 text-sm text-text">
            Saved.
            {emailPending &&
              " Check your inbox to confirm the new email address."}
          </div>
        )}

        <form action={updateProfile} className="mt-6 grid gap-4 card-retro">
          <Field label="First name">
            <input
              type="text"
              name="first_name"
              defaultValue={profile?.first_name ?? ""}
              className={inputCls}
            />
          </Field>
          <Field label="Last name">
            <input
              type="text"
              name="last_name"
              defaultValue={profile?.last_name ?? ""}
              className={inputCls}
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              name="email"
              required
              defaultValue={user.email ?? ""}
              className={inputCls}
            />
            <p className="mt-1 text-xs text-text/50">
              Changing your email requires confirmation from a link we send you.
            </p>
          </Field>
          <div className="flex justify-end gap-3 pt-2">
            <button type="submit" className="btn-primary">
              Save
            </button>
          </div>
        </form>

        <form action="/auth/signout" method="post" className="mt-4 text-right">
          <button type="submit" className="btn-secondary">
            Log out
          </button>
        </form>
      </div>
    </main>
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
