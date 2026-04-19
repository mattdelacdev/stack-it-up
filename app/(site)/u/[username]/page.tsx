import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getServerSupabase, resolveAvatarUrl } from "@/lib/supabase/server";
import { fetchUserStacks } from "@/lib/stacks";
import type { Supplement } from "@/lib/supplements";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

type PublicProfile = {
  id: string;
  username: string;
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  website: string | null;
  avatar_url: string | null;
  avatar_uploaded_path: string | null;
  instagram: string | null;
  tiktok: string | null;
  twitter: string | null;
  youtube: string | null;
  location: string | null;
};

async function loadProfile(username: string): Promise<PublicProfile | null> {
  const supabase = await getServerSupabase();
  const { data } = await supabase
    .from("profiles")
    .select(
      "id, username, first_name, last_name, bio, website, avatar_url, avatar_uploaded_path, instagram, tiktok, twitter, youtube, location",
    )
    .eq("username", username.toLowerCase())
    .eq("is_public", true)
    .maybeSingle();
  return (data as PublicProfile) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const profile = await loadProfile(username);
  if (!profile)
    return {
      title: "Profile Not Found",
      description: "This StackItUp profile doesn't exist or is private.",
      robots: { index: false, follow: false },
    };
  const name =
    [profile.first_name, profile.last_name].filter(Boolean).join(" ") ||
    `@${profile.username}`;
  const title = `${name} (@${profile.username})`;
  const description =
    profile.bio ??
    `See ${name}'s personalized supplement stack, favorites, and routine on StackItUp.`;
  const url = `/u/${profile.username}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "profile",
      title,
      description,
      url,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await loadProfile(username);
  if (!profile) notFound();

  const fullName = [profile.first_name, profile.last_name]
    .filter(Boolean)
    .join(" ");
  const avatar = resolveAvatarUrl(profile);
  const stacks = await fetchUserStacks(profile.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: fullName || `@${profile.username}`,
      alternateName: `@${profile.username}`,
      description: profile.bio ?? undefined,
      image: avatar ?? undefined,
      url: absoluteUrl(`/u/${profile.username}`),
      sameAs: [
        profile.website,
        profile.instagram,
        profile.tiktok,
        profile.twitter,
        profile.youtube,
      ].filter(Boolean),
    },
  };

  return (
    <main className="min-h-screen bg-bg text-text px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-2xl">
        <div className="card-retro">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
            <div className="h-28 w-28 shrink-0 overflow-hidden border-4 border-primary shadow-retro bg-bg-deep">
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatar}
                  alt={fullName || profile.username}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-display text-4xl text-text/50">
                  {(profile.first_name?.[0] ?? profile.username[0]).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              {fullName && (
                <h1 className="font-display text-3xl sm:text-4xl">
                  <span className="text-gradient">{fullName.toUpperCase()}</span>
                </h1>
              )}
              <p className="mt-1 font-mono text-text/60">@{profile.username}</p>
              {profile.location && (
                <p className="mt-1 text-sm text-text/60">
                  <span aria-hidden>📍 </span>
                  {profile.location}
                </p>
              )}
              {profile.bio && (
                <p className="mt-4 font-body text-text/90 whitespace-pre-wrap">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>

          <SocialLinks profile={profile} />
        </div>

        {stacks.morning.length > 0 && (
          <StackSection title="Morning Stack" emoji="☀️" items={stacks.morning} accent="secondary" />
        )}
        {stacks.evening.length > 0 && (
          <StackSection title="Evening Stack" emoji="🌙" items={stacks.evening} accent="primary" />
        )}
        {stacks.favorites.length > 0 && (
          <FavoritesSection items={stacks.favorites} />
        )}
      </div>
    </main>
  );
}

function StackSection({
  title,
  emoji,
  items,
  accent,
}: {
  title: string;
  emoji: string;
  items: Supplement[];
  accent: "primary" | "secondary";
}) {
  const accentClass = accent === "primary" ? "text-primary" : "text-secondary";
  return (
    <section className="mt-8 card-retro">
      <h2 className={`font-display text-xl sm:text-2xl tracking-[0.15em] ${accentClass}`}>
        <span aria-hidden>{emoji}</span> {title.toUpperCase()}
      </h2>
      <ol className="mt-4 divide-y divide-primary/20">
        {items.map((s) => (
          <li key={s.id} className="flex items-center justify-between gap-3 py-3">
            <Link
              href={`/supplements/${s.id}`}
              className="font-display text-base sm:text-lg text-accent hover:text-primary"
            >
              {s.name}
            </Link>
            <span className="font-mono text-xs text-text/60">{s.dose}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function FavoritesSection({ items }: { items: Supplement[] }) {
  return (
    <section className="mt-8 card-retro">
      <h2 className="font-display text-xl sm:text-2xl tracking-[0.15em] text-accent">
        <span aria-hidden>★</span> FAVORITES
      </h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {items.map((s) => (
          <li key={s.id}>
            <Link
              href={`/supplements/${s.id}`}
              className="inline-block border-2 border-primary/60 px-3 py-1 font-display text-sm text-text hover:border-accent hover:text-accent"
            >
              {s.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SocialLinks({ profile }: { profile: PublicProfile }) {
  const links: { label: string; href: string }[] = [];
  if (profile.website) {
    links.push({ label: "WEBSITE", href: profile.website });
  }
  if (profile.instagram) {
    links.push({
      label: "INSTAGRAM",
      href: profile.instagram.startsWith("http")
        ? profile.instagram
        : `https://instagram.com/${profile.instagram.replace(/^@/, "")}`,
    });
  }
  if (profile.tiktok) {
    links.push({
      label: "TIKTOK",
      href: profile.tiktok.startsWith("http")
        ? profile.tiktok
        : `https://tiktok.com/@${profile.tiktok.replace(/^@/, "")}`,
    });
  }
  if (profile.twitter) {
    links.push({
      label: "TWITTER",
      href: profile.twitter.startsWith("http")
        ? profile.twitter
        : `https://x.com/${profile.twitter.replace(/^@/, "")}`,
    });
  }
  if (profile.youtube) {
    links.push({
      label: "YOUTUBE",
      href: profile.youtube.startsWith("http")
        ? profile.youtube
        : `https://youtube.com/${profile.youtube.startsWith("@") ? profile.youtube : `@${profile.youtube}`}`,
    });
  }
  if (links.length === 0) return null;

  return (
    <div className="mt-8 flex flex-wrap gap-3">
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer me"
          className="border-2 border-primary/60 px-4 py-2 font-display text-xs tracking-[0.2em] text-text/80 hover:border-accent hover:text-accent transition-colors"
        >
          {l.label}
        </a>
      ))}
    </div>
  );
}
