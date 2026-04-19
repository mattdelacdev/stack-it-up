import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  fetchSupplementById,
  fetchSupplementList,
  youtubeEmbedId,
  type Supplement,
} from "@/lib/supplements";
import { fetchViewerState } from "@/lib/stacks";
import { fetchStacksForSupplement, type HeroAccent } from "@/lib/featured-stacks";
import { DualDose, hasDoseConversion } from "@/lib/dose";
import InlineDoseToggle from "@/components/InlineDoseToggle";
import ShareBar from "@/components/ShareBar";
import { toggleFavorite, toggleStack } from "./actions";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

const STACK_ACCENT_TEXT: Record<HeroAccent, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  accent: "text-accent",
};

const STACK_ACCENT_BORDER: Record<HeroAccent, string> = {
  primary: "hover:border-primary",
  secondary: "hover:border-secondary",
  accent: "hover:border-accent",
};

const TAG_META: Record<Supplement["tag"], { label: string; className: string }> = {
  core: { label: "CORE", className: "bg-accent text-bg" },
  goal: { label: "GOAL", className: "bg-primary text-bg" },
  lifestyle: { label: "LIFESTYLE", className: "bg-secondary text-bg" },
};

const TIMING_META: Record<Supplement["timing"], { label: string; emoji: string }> = {
  morning: { label: "Morning", emoji: "☀️" },
  afternoon: { label: "Afternoon", emoji: "🌤️" },
  evening: { label: "Evening", emoji: "🌙" },
  anytime: { label: "Anytime", emoji: "⏰" },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const s = await fetchSupplementById(id);
  if (!s) return {};
  const title = `${s.name} — Benefits, Dose, Timing & Side Effects`;
  const description = s.content?.mechanism
    ? `${s.why} ${s.content.mechanism}`.slice(0, 160)
    : s.why;
  const url = `/supplements/${s.id}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
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

export default async function SupplementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [supplement, all, viewer, inStacks] = await Promise.all([
    fetchSupplementById(id),
    fetchSupplementList(),
    fetchViewerState(id),
    fetchStacksForSupplement(id).catch(() => []),
  ]);
  if (!supplement) notFound();

  const tag = TAG_META[supplement.tag];
  const timing = TIMING_META[supplement.timing];
  const c = supplement.content ?? {};
  const videoId = youtubeEmbedId(supplement.video_url);
  const byId = new Map(all.map((s) => [s.id, s]));
  const stacksWith = (c.stacksWith ?? [])
    .map((sid) => byId.get(sid))
    .filter((s): s is Supplement => Boolean(s));
  const avoidWith = (c.avoidWith ?? [])
    .map((sid) => byId.get(sid))
    .filter((s): s is Supplement => Boolean(s));
  const others = all
    .filter(
      (s) => s.id !== supplement.id && !c.stacksWith?.includes(s.id),
    )
    .slice(0, 6);

  const url = absoluteUrl(`/supplements/${supplement.id}`);

  const supplementLd = {
    "@context": "https://schema.org",
    "@type": "DietarySupplement",
    name: supplement.name,
    description: supplement.why,
    recommendedIntake: {
      "@type": "RecommendedDoseSchedule",
      doseValue: supplement.dose,
      doseUnit: "serving",
      frequency: timing.label,
    },
    url,
    brand: { "@type": "Brand", name: SITE_NAME },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Supplements", item: absoluteUrl("/supplements") },
      { "@type": "ListItem", position: 3, name: supplement.name, item: url },
    ],
  };

  const faqLd =
    c.faq && c.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: c.faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  return (
    <div className="relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(supplementLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      <div className="pointer-events-none absolute inset-0 retro-grid opacity-30" aria-hidden />

      <main className="relative z-10">
        <section className="mx-auto max-w-4xl px-6 pt-10 pb-10 sm:pt-16">
          <nav
            aria-label="Breadcrumb"
            className="font-display text-xs sm:text-sm uppercase tracking-wider text-text/60"
          >
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-accent">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/supplements" className="hover:text-accent">
                  Supplements
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-text/80">{supplement.name}</li>
            </ol>
          </nav>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span
              className={`font-display text-[11px] tracking-widest px-2 py-1 ${tag.className}`}
            >
              {tag.label}
            </span>
            <span className="font-display text-xs uppercase tracking-widest text-text/60">
              <span aria-hidden>{timing.emoji}</span> {timing.label}
            </span>
          </div>

          <h1 className="mt-4 font-display text-5xl sm:text-7xl text-text leading-[0.95]">
            {supplement.name}
          </h1>
          <p className="mt-6 max-w-2xl text-lg sm:text-xl text-text/85 leading-[1.65]">
            {supplement.why}
          </p>

          <dl className="mt-10 grid gap-5 sm:grid-cols-3 max-w-3xl">
            <div className="card-retro">
              <div className="flex items-start justify-between gap-2">
                <dt className="font-display text-accent text-xs uppercase tracking-wider">
                  Typical dose
                </dt>
                {hasDoseConversion(supplement) && (
                  <InlineDoseToggle nativeUnit={supplement.dose_unit ?? ""} />
                )}
              </div>
              <dd className="mt-2 text-text/85 text-lg"><DualDose s={supplement} /></dd>
            </div>
            <div className="card-retro">
              <dt className="font-display text-secondary text-xs uppercase tracking-wider">
                When to take
              </dt>
              <dd className="mt-2 text-text/85 text-lg">{timing.label}</dd>
            </div>
            {c.onset && (
              <div className="card-retro">
                <dt className="font-display text-primary text-xs uppercase tracking-wider">
                  Onset
                </dt>
                <dd className="mt-2 text-text/85 text-lg">{c.onset}</dd>
              </div>
            )}
          </dl>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link href="/quiz" className="btn-primary">
              Build your stack →
            </Link>
            {viewer.userId ? (
              <>
                <form action={toggleFavorite}>
                  <input type="hidden" name="supplement_id" value={supplement.id} />
                  <input
                    type="hidden"
                    name="is_favorite"
                    value={viewer.isFavorite ? "1" : "0"}
                  />
                  <button
                    type="submit"
                    className={
                      viewer.isFavorite
                        ? "border-4 border-accent bg-accent/20 px-4 py-2 font-display text-xs tracking-[0.2em] text-accent shadow-retro"
                        : "border-4 border-primary/60 px-4 py-2 font-display text-xs tracking-[0.2em] text-text hover:border-accent hover:text-accent"
                    }
                    aria-pressed={viewer.isFavorite}
                  >
                    <span aria-hidden>{viewer.isFavorite ? "★" : "☆"}</span>{" "}
                    {viewer.isFavorite ? "FAVORITED" : "FAVORITE"}
                  </button>
                </form>
                <form action={toggleStack}>
                  <input type="hidden" name="supplement_id" value={supplement.id} />
                  <input type="hidden" name="kind" value="morning" />
                  <input
                    type="hidden"
                    name="in_stack"
                    value={viewer.inMorning ? "1" : "0"}
                  />
                  <button
                    type="submit"
                    className={
                      viewer.inMorning
                        ? "border-4 border-secondary bg-secondary/20 px-4 py-2 font-display text-xs tracking-[0.2em] text-secondary shadow-retro"
                        : "border-4 border-primary/60 px-4 py-2 font-display text-xs tracking-[0.2em] text-text hover:border-secondary hover:text-secondary"
                    }
                    aria-pressed={viewer.inMorning}
                  >
                    <span aria-hidden>☀️</span>{" "}
                    {viewer.inMorning ? "IN MORNING" : "ADD TO MORNING"}
                  </button>
                </form>
                <form action={toggleStack}>
                  <input type="hidden" name="supplement_id" value={supplement.id} />
                  <input type="hidden" name="kind" value="evening" />
                  <input
                    type="hidden"
                    name="in_stack"
                    value={viewer.inEvening ? "1" : "0"}
                  />
                  <button
                    type="submit"
                    className={
                      viewer.inEvening
                        ? "border-4 border-primary bg-primary/20 px-4 py-2 font-display text-xs tracking-[0.2em] text-primary shadow-retro"
                        : "border-4 border-primary/60 px-4 py-2 font-display text-xs tracking-[0.2em] text-text hover:border-primary hover:text-primary"
                    }
                    aria-pressed={viewer.inEvening}
                  >
                    <span aria-hidden>🌙</span>{" "}
                    {viewer.inEvening ? "IN EVENING" : "ADD TO EVENING"}
                  </button>
                </form>
              </>
            ) : (
              <Link
                href={`/login?next=/supplements/${supplement.id}`}
                className="border-4 border-primary/60 px-4 py-2 font-display text-xs tracking-[0.2em] text-text hover:border-accent hover:text-accent"
              >
                SIGN IN TO SAVE
              </Link>
            )}
          </div>

          <div className="mt-8">
            <ShareBar
              url={url}
              title={`${supplement.name} — ${supplement.why.slice(0, 80)}`}
              description={supplement.why}
            />
          </div>
        </section>

        {c.benefits && c.benefits.length > 0 && (
          <Section eyebrow="What it does" title="Benefits" accent="accent">
            <ul className="grid gap-3 sm:grid-cols-2 max-w-3xl">
              {c.benefits.map((b) => (
                <li key={b} className="flex gap-3 text-text/85 leading-[1.6]">
                  <span aria-hidden className="text-accent font-display mt-1">
                    ▸
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {c.mechanism && (
          <Section eyebrow="The science" title="How it works" accent="secondary">
            <p className="max-w-3xl text-text/85 text-lg leading-[1.7]">
              {c.mechanism}
            </p>
          </Section>
        )}

        {videoId && (
          <Section eyebrow="Watch" title="Video review" accent="primary">
            <div className="max-w-3xl">
              <div className="relative w-full border-4 border-primary/60 shadow-retro" style={{ aspectRatio: "16 / 9" }}>
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                  title={`${supplement.name} video review`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            </div>
          </Section>
        )}

        {(c.doseNotes || c.timingNotes) && (
          <Section eyebrow="Getting it right" title="Dose & timing" accent="primary">
            <div className="grid gap-6 md:grid-cols-2 max-w-3xl">
              {c.doseNotes && (
                <div>
                  <h3 className="font-display text-accent text-xs uppercase tracking-widest mb-3">
                    Dose guidance
                  </h3>
                  <p className="text-text/85 leading-[1.65]">{c.doseNotes}</p>
                </div>
              )}
              {c.timingNotes && (
                <div>
                  <h3 className="font-display text-secondary text-xs uppercase tracking-widest mb-3">
                    Best time to take
                  </h3>
                  <p className="text-text/85 leading-[1.65]">{c.timingNotes}</p>
                </div>
              )}
            </div>
          </Section>
        )}

        {((c.goodFor && c.goodFor.length > 0) ||
          (c.avoidIf && c.avoidIf.length > 0)) && (
          <Section
            eyebrow="Is it for you?"
            title="Who should (and shouldn't) take it"
            accent="accent"
          >
            <div className="grid gap-6 md:grid-cols-2 max-w-3xl">
              {c.goodFor && c.goodFor.length > 0 && (
                <div>
                  <h3 className="font-display text-secondary text-xs uppercase tracking-widest mb-3">
                    Good for
                  </h3>
                  <ul className="space-y-2">
                    {c.goodFor.map((g) => (
                      <li key={g} className="flex gap-2 text-text/85">
                        <span aria-hidden className="text-secondary">
                          ✓
                        </span>
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {c.avoidIf && c.avoidIf.length > 0 && (
                <div>
                  <h3 className="font-display text-primary text-xs uppercase tracking-widest mb-3">
                    Skip or ask a doctor if
                  </h3>
                  <ul className="space-y-2">
                    {c.avoidIf.map((a) => (
                      <li key={a} className="flex gap-2 text-text/85">
                        <span aria-hidden className="text-primary">
                          ✗
                        </span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Section>
        )}

        {c.sideEffects && c.sideEffects.length > 0 && (
          <Section
            eyebrow="Know before you start"
            title="Side effects & safety"
            accent="primary"
          >
            <ul className="grid gap-3 sm:grid-cols-2 max-w-3xl">
              {c.sideEffects.map((s) => (
                <li key={s} className="flex gap-3 text-text/85 leading-[1.6]">
                  <span aria-hidden className="text-primary font-display mt-1">
                    !
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {c.forms && c.forms.length > 0 && (
          <Section
            eyebrow="Shopping guide"
            title="Forms & what to look for"
            accent="secondary"
          >
            <ul className="grid gap-4 sm:grid-cols-2 max-w-3xl">
              {c.forms.map((f) => (
                <li key={f.name} className="card-retro">
                  <div className="font-display text-accent text-sm tracking-wider">
                    {f.name}
                  </div>
                  {f.note && (
                    <p className="mt-2 text-text/80 text-sm leading-[1.55]">
                      {f.note}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {(stacksWith.length > 0 || avoidWith.length > 0) && (
          <Section
            eyebrow="Combining"
            title="Stacks well with / avoid pairing"
            accent="accent"
          >
            <div className="grid gap-6 md:grid-cols-2 max-w-3xl">
              {stacksWith.length > 0 && (
                <div>
                  <h3 className="font-display text-secondary text-xs uppercase tracking-widest mb-3">
                    Stacks well with
                  </h3>
                  <ul className="space-y-2">
                    {stacksWith.map((s) => (
                      <li key={s.id}>
                        <Link
                          href={`/supplements/${s.id}`}
                          className="text-accent hover:text-secondary font-display text-sm tracking-wider"
                        >
                          → {s.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {avoidWith.length > 0 && (
                <div>
                  <h3 className="font-display text-primary text-xs uppercase tracking-widest mb-3">
                    Avoid pairing with
                  </h3>
                  <ul className="space-y-2">
                    {avoidWith.map((s) => (
                      <li key={s.id}>
                        <Link
                          href={`/supplements/${s.id}`}
                          className="text-primary hover:text-accent font-display text-sm tracking-wider"
                        >
                          ✗ {s.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Section>
        )}

        {c.faq && c.faq.length > 0 && (
          <Section eyebrow="Common questions" title="FAQ" accent="secondary">
            <div className="max-w-3xl space-y-4">
              {c.faq.map((f) => (
                <details key={f.q} className="card-retro group">
                  <summary className="cursor-pointer font-display text-text text-base sm:text-lg tracking-wide list-none flex items-center justify-between gap-4">
                    <span>{f.q}</span>
                    <span
                      aria-hidden
                      className="text-accent font-display transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-4 text-text/85 leading-[1.65]">{f.a}</p>
                </details>
              ))}
            </div>
          </Section>
        )}

        {c.sources && c.sources.length > 0 && (
          <Section
            eyebrow="References"
            title="Sources & further reading"
            accent="primary"
          >
            <ul className="max-w-3xl space-y-2">
              {c.sources.map((s) => (
                <li key={s.url} className="text-text/75 text-sm">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-secondary underline-offset-4 hover:underline"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </Section>
        )}

        <section className="mx-auto max-w-4xl px-6 pb-10">
          <p className="text-xs sm:text-sm text-text/50 leading-relaxed">
            Educational only, not medical advice. Check with a clinician before
            starting anything new, especially if you&apos;re on medication or pregnant.
          </p>
        </section>

        {others.length > 0 && (
          <section className="mx-auto max-w-6xl px-6 pb-20">
            <h2 className="font-display text-xl sm:text-2xl text-text mb-6">
              Other <span className="text-primary">supplements</span>
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/supplements/${s.id}`}
                    className="card-retro flex items-center justify-between gap-3 hover:-translate-y-1"
                  >
                    <span className="font-display text-base sm:text-lg text-accent">
                      {s.name}
                    </span>
                    <span
                      className={`font-display text-[10px] tracking-widest px-2 py-1 ${TAG_META[s.tag].className}`}
                    >
                      {TAG_META[s.tag].label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {inStacks.length > 0 && (
          <section className="mx-auto max-w-6xl px-6 py-16 border-t-4 border-primary/20">
            <p className="font-display text-accent text-xs sm:text-sm uppercase tracking-[0.3em] mb-3">
              Appears in
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-text">
              Featured <span className="text-gradient">stacks</span> with {supplement.name}
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {inStacks.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/stacks/${s.slug}`}
                    className={`card-retro block h-full transition-transform hover:-translate-y-1 ${STACK_ACCENT_BORDER[s.hero_accent]}`}
                  >
                    <div className="flex items-start gap-3">
                      {s.emoji && (
                        <span className="text-3xl leading-none" aria-hidden>
                          {s.emoji}
                        </span>
                      )}
                      <h3 className={`font-display text-lg ${STACK_ACCENT_TEXT[s.hero_accent]}`}>
                        {s.name}
                      </h3>
                    </div>
                    <p className="mt-3 text-sm text-text/75 leading-[1.6]">{s.tagline}</p>
                    <span className="mt-4 block font-display text-xs uppercase tracking-wider text-primary/80">
                      See the stack →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}

function Section({
  eyebrow,
  title,
  accent,
  children,
}: {
  eyebrow: string;
  title: string;
  accent: "primary" | "secondary" | "accent";
  children: React.ReactNode;
}) {
  const accentClass =
    accent === "primary"
      ? "text-primary"
      : accent === "secondary"
        ? "text-secondary"
        : "text-accent";
  return (
    <section className="mx-auto max-w-4xl px-6 py-10 border-t-4 border-primary/20">
      <p
        className={`font-display text-xs uppercase tracking-[0.3em] ${accentClass} mb-3`}
      >
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl sm:text-4xl text-text mb-6 leading-[1.05]">
        {title}
      </h2>
      {children}
    </section>
  );
}
