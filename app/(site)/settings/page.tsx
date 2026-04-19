import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  getCurrentProfile,
  getServerSupabase,
  resolveAvatarUrl,
} from "@/lib/supabase/server";
import Link from "next/link";
import AvatarUploader from "./AvatarUploader";
import StackManager from "./StackManager";
import ManageBillingButton from "@/components/ManageBillingButton";
import UpgradeButton from "@/components/UpgradeButton";
import { fetchUserStacks } from "@/lib/stacks";
import { stripe } from "@/lib/stripe";
import { getServiceSupabase } from "@/lib/supabase/service";

export const metadata = {
  title: "Account Settings",
  description:
    "Manage your StackItUp profile: update your name, username, bio, avatar, social links, and public profile visibility.",
  robots: { index: false, follow: false },
};

const RESERVED = new Set([
  "admin","api","account","auth","login","logout","signup","signout",
  "quiz","results","optimize","supplements","u","me","profile","settings",
  "about","help","support","privacy","terms","www","root","system","null",
]);

function normalizeSocial(value: string | null, platform: "instagram" | "tiktok" | "twitter" | "youtube"): string | null {
  if (!value) return null;
  const v = value.trim().replace(/^@/, "");
  if (!v) return null;
  // Accept full URLs or handles; store normalized handle/url.
  if (/^https?:\/\//i.test(v)) return v;
  return v;
}

function normalizeWebsite(value: string | null): string | null {
  if (!value) return null;
  const v = value.trim();
  if (!v) return null;
  if (!/^https?:\/\//i.test(v)) return `https://${v}`;
  return v;
}

async function updateProfile(formData: FormData) {
  "use server";
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/settings");

  const first_name = (formData.get("first_name") as string | null)?.trim() || null;
  const last_name = (formData.get("last_name") as string | null)?.trim() || null;
  const email = (formData.get("email") as string | null)?.trim() || "";
  const usernameRaw = (formData.get("username") as string | null)?.trim().toLowerCase() || null;
  const bio = (formData.get("bio") as string | null)?.trim() || null;
  const website = normalizeWebsite(formData.get("website") as string | null);
  const instagram = normalizeSocial(formData.get("instagram") as string | null, "instagram");
  const tiktok = normalizeSocial(formData.get("tiktok") as string | null, "tiktok");
  const twitter = normalizeSocial(formData.get("twitter") as string | null, "twitter");
  const youtube = normalizeSocial(formData.get("youtube") as string | null, "youtube");
  const location = (formData.get("location") as string | null)?.trim() || null;
  const is_public = formData.get("is_public") === "on";

  let username: string | null = null;
  if (usernameRaw) {
    if (!/^[a-z0-9_]{3,30}$/.test(usernameRaw)) {
      redirect("/settings?error=username_format");
    }
    if (RESERVED.has(usernameRaw)) {
      redirect("/settings?error=username_reserved");
    }
    username = usernameRaw;
  }

  if (bio && bio.length > 280) {
    redirect("/settings?error=bio_length");
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      first_name,
      last_name,
      username,
      bio,
      website,
      instagram,
      tiktok,
      twitter,
      youtube,
      location,
      is_public,
    })
    .eq("id", user.id);
  if (profileError) {
    if (profileError.code === "23505") redirect("/settings?error=username_taken");
    throw new Error(profileError.message);
  }

  let emailNotice = "";
  if (email && email !== user.email) {
    const { error: emailError } = await supabase.auth.updateUser({ email });
    if (emailError) throw new Error(emailError.message);
    emailNotice = "&emailPending=1";
  }

  revalidatePath("/settings");
  if (username) revalidatePath(`/u/${username}`);
  redirect(`/settings?saved=1${emailNotice}`);
}

const ERRORS: Record<string, string> = {
  username_format: "Username must be 3–30 chars, a–z, 0–9, or underscore.",
  username_taken: "That username is already taken.",
  username_reserved: "That username is reserved.",
  bio_length: "Bio must be 280 characters or fewer.",
};

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{
    saved?: string;
    emailPending?: string;
    error?: string;
    upgraded?: string;
    session_id?: string;
  }>;
}) {
  let { profile, user } = await getCurrentProfile();
  if (!user) redirect("/login?next=/settings");

  const { saved, emailPending, error, upgraded, session_id } =
    await searchParams;

  // Fallback: if the webhook hasn't run yet (or isn't configured), verify
  // the Stripe checkout session and flip tier here on the success redirect.
  if (session_id && profile?.tier !== "pro") {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      const matchesUser =
        session.client_reference_id === user.id &&
        (session.payment_status === "paid" ||
          session.status === "complete");
      if (matchesUser) {
        const customerId =
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id;
        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;
        const service = getServiceSupabase();
        await service
          .from("profiles")
          .update({
            tier: "pro",
            stripe_customer_id: customerId ?? null,
            stripe_subscription_id: subscriptionId ?? null,
          })
          .eq("id", user.id);
        if (profile) {
          profile = { ...profile, tier: "pro" };
        }
      }
    } catch (e) {
      console.error("Failed to verify Stripe session:", e);
    }
  }

  const avatar = resolveAvatarUrl(profile);
  const stacks = await fetchUserStacks(user.id);
  const errorMsg = error ? ERRORS[error] ?? "Something went wrong." : null;

  return (
    <main className="min-h-screen bg-bg text-text px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl sm:text-4xl">
          <span className="text-gradient">SETTINGS</span>
        </h1>
        <p className="mt-3 text-text/70">
          Your public profile at{" "}
          {profile?.username ? (
            <a
              className="text-secondary hover:text-accent underline"
              href={`/u/${profile.username}`}
            >
              /u/{profile.username}
            </a>
          ) : (
            <span className="text-text/50">
              /u/(pick a username below to publish)
            </span>
          )}
          .
        </p>

        {upgraded && (
          <div className="mt-6 border-2 border-accent/60 bg-accent/10 px-4 py-3 text-sm text-text">
            ⚡ Welcome to Pro! Your subscription is active — 5 expert chats per day.
          </div>
        )}
        {saved && (
          <div className="mt-6 border-2 border-secondary/60 bg-secondary/10 px-4 py-3 text-sm text-text">
            Saved.
            {emailPending &&
              " Check your inbox to confirm the new email address."}
          </div>
        )}
        {errorMsg && (
          <div className="mt-6 border-2 border-primary/60 bg-primary/10 px-4 py-3 text-sm text-text">
            {errorMsg}
          </div>
        )}

        <div
          className={`mt-6 card-retro ${
            profile?.tier === "pro" ? "border-accent" : ""
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-display text-[10px] uppercase tracking-[0.3em] text-text/60">
                Your plan
              </p>
              <p className="mt-1 font-display text-2xl">
                {profile?.tier === "pro" ? (
                  <span className="text-accent">PRO ⚡</span>
                ) : (
                  <span className="text-primary">FREE</span>
                )}
              </p>
              <p className="mt-1 text-sm text-text/70">
                {profile?.tier === "pro"
                  ? "5 expert chats per day. Thanks for supporting StackItUp."
                  : "1 expert chat per day. Upgrade for 5× more and early access."}
              </p>
            </div>
            {profile?.tier === "pro" ? (
              <ManageBillingButton />
            ) : (
              <UpgradeButton signedIn label="Upgrade to Pro" className="btn-accent" />
            )}
          </div>
        </div>

        <div className="mt-6 card-retro">
          <AvatarUploader
            userId={user.id}
            initialUrl={avatar}
            googleUrl={profile?.avatar_url ?? null}
            uploadedPath={profile?.avatar_uploaded_path ?? null}
          />
        </div>

        <form action={updateProfile} className="mt-6 grid gap-4 card-retro">
          <div className="grid gap-4 sm:grid-cols-2">
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
          </div>
          <Field label="Username">
            <div className="flex items-center gap-2">
              <span className="font-mono text-text/50">/u/</span>
              <input
                type="text"
                name="username"
                defaultValue={profile?.username ?? ""}
                placeholder="your_handle"
                pattern="[a-z0-9_]{3,30}"
                className={inputCls}
              />
            </div>
            <p className="mt-1 text-xs text-text/50">
              3–30 characters: lowercase letters, numbers, underscores.
            </p>
          </Field>
          <Field label="Bio">
            <textarea
              name="bio"
              rows={3}
              maxLength={280}
              defaultValue={profile?.bio ?? ""}
              placeholder="Two sentences about you and what you stack."
              className={inputCls}
            />
            <p className="mt-1 text-xs text-text/50">Up to 280 characters.</p>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Website">
              <input
                type="url"
                name="website"
                defaultValue={profile?.website ?? ""}
                placeholder="https://example.com"
                className={inputCls}
              />
            </Field>
            <Field label="Location">
              <input
                type="text"
                name="location"
                defaultValue={profile?.location ?? ""}
                placeholder="Los Angeles, CA"
                className={inputCls}
              />
            </Field>
          </div>
          <fieldset className="grid gap-4 sm:grid-cols-2 border-2 border-primary/20 p-4">
            <legend className="px-2 font-display text-xs tracking-[0.2em] text-text/70">
              SOCIALS
            </legend>
            <Field label="Instagram">
              <input
                type="text"
                name="instagram"
                defaultValue={profile?.instagram ?? ""}
                placeholder="@handle"
                className={inputCls}
              />
            </Field>
            <Field label="TikTok">
              <input
                type="text"
                name="tiktok"
                defaultValue={profile?.tiktok ?? ""}
                placeholder="@handle"
                className={inputCls}
              />
            </Field>
            <Field label="Twitter / X">
              <input
                type="text"
                name="twitter"
                defaultValue={profile?.twitter ?? ""}
                placeholder="@handle"
                className={inputCls}
              />
            </Field>
            <Field label="YouTube">
              <input
                type="text"
                name="youtube"
                defaultValue={profile?.youtube ?? ""}
                placeholder="@channel or URL"
                className={inputCls}
              />
            </Field>
          </fieldset>
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
          <label className="flex items-center gap-3 border-2 border-primary/20 px-4 py-3">
            <input
              type="checkbox"
              name="is_public"
              defaultChecked={profile?.is_public ?? true}
              className="h-4 w-4 accent-primary"
            />
            <span className="font-display text-xs tracking-[0.2em] text-text/80">
              PUBLIC PROFILE
            </span>
            <span className="text-xs text-text/50">
              Anyone with your link can view it.
            </span>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button type="submit" className="btn-primary">
              Save
            </button>
          </div>
        </form>

        <StackManager stacks={stacks} />
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
