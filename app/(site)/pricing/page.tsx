import Link from "next/link";
import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";
import { getCurrentProfile } from "@/lib/supabase/server";

const title = "Pricing";
const description =
  "Start free. Go Pro for 5× daily expert chats, priority access, and more.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/pricing" },
  openGraph: {
    type: "website",
    title: `${title} — ${SITE_NAME}`,
    description,
    url: "/pricing",
    siteName: SITE_NAME,
  },
};

type Plan = {
  name: string;
  price: string;
  cadence: string;
  tagline: string;
  accent: "primary" | "accent";
  features: string[];
  cta: { label: string; href: string };
  highlight?: boolean;
  disabled?: boolean;
};

export default async function PricingPage() {
  const { user, profile } = await getCurrentProfile();
  const currentTier: "free" | "pro" =
    profile?.tier === "pro" ? "pro" : "free";

  const plans: Plan[] = [
    {
      name: "Free",
      price: "$0",
      cadence: "forever",
      tagline: "Get a personalized stack and dip your toes in.",
      accent: "primary",
      features: [
        "Full 6-question quiz + personalized stack",
        "Browse the entire supplement library",
        "Popular stacks & benefit guides",
        "1 expert chat question per day",
      ],
      cta: user
        ? currentTier === "free"
          ? { label: "Current plan", href: "#" }
          : { label: "Downgrade", href: "/settings" }
        : { label: "Start free", href: "/login" },
      disabled: Boolean(user) && currentTier === "free",
    },
    {
      name: "Pro",
      price: "$9",
      cadence: "/ month",
      tagline: "Unlock the expert. Ask more, learn faster.",
      accent: "accent",
      highlight: true,
      features: [
        "Everything in Free",
        "5 expert chat questions per day",
        "Priority on new stacks & guides",
        "Save & sync stacks across devices",
        "Early access to new features",
      ],
      cta:
        currentTier === "pro"
          ? { label: "You're Pro ⚡", href: "#" }
          : { label: "Upgrade to Pro", href: "#" },
      disabled: currentTier === "pro",
    },
  ];

  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 retro-grid opacity-30"
        aria-hidden
      />
      <main className="relative z-10 mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <p className="font-display text-accent text-xs sm:text-sm uppercase tracking-[0.3em] mb-3">
          Pricing
        </p>
        <h1 className="font-display text-5xl sm:text-7xl leading-[0.95]">
          <span className="text-gradient">Simple plans.</span>
          <br />
          <span className="text-text">Serious gains.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg sm:text-xl text-text/80 leading-relaxed">
          Start free and upgrade when you want more time with the expert. No
          hidden fees, cancel anytime.
        </p>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2">
          {plans.map((plan) => (
            <li key={plan.name}>
              <div
                className={`card-retro h-full flex flex-col ${
                  plan.highlight
                    ? "border-accent ring-2 ring-accent/40"
                    : ""
                }`}
              >
                <div className="flex items-baseline justify-between">
                  <h2
                    className={`font-display text-2xl sm:text-3xl ${
                      plan.accent === "accent"
                        ? "text-accent"
                        : "text-primary"
                    }`}
                  >
                    {plan.name}
                  </h2>
                  {plan.highlight && (
                    <span className="font-display text-[10px] uppercase tracking-[0.2em] border-2 border-accent text-accent px-2 py-1">
                      Most popular
                    </span>
                  )}
                </div>

                <div className="mt-5 flex items-end gap-1">
                  <span className="font-display text-5xl sm:text-6xl text-text">
                    {plan.price}
                  </span>
                  <span className="font-mono text-sm text-text/60 mb-2">
                    {plan.cadence}
                  </span>
                </div>

                <p className="mt-3 text-text/80">{plan.tagline}</p>

                <ul className="mt-6 space-y-2.5 flex-1">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex gap-3 text-text/90 leading-snug"
                    >
                      <span
                        aria-hidden
                        className={`mt-1 inline-block h-2 w-2 flex-none ${
                          plan.accent === "accent"
                            ? "bg-accent"
                            : "bg-primary"
                        }`}
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  {plan.disabled ? (
                    <span className="inline-flex items-center justify-center w-full h-12 border-2 border-text/20 font-display text-xs uppercase tracking-wider text-text/50">
                      {plan.cta.label}
                    </span>
                  ) : (
                    <Link
                      href={plan.cta.href}
                      className={
                        plan.highlight
                          ? "btn-accent w-full text-center"
                          : "btn-primary w-full text-center"
                      }
                    >
                      {plan.cta.label}
                    </Link>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>

        <section className="mt-16 border-t-2 border-primary/20 pt-10">
          <h2 className="font-display text-2xl sm:text-3xl text-text">
            Frequently asked
          </h2>
          <dl className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="font-display text-accent uppercase tracking-wider text-sm">
                Can I cancel anytime?
              </dt>
              <dd className="mt-2 text-text/80">
                Yes. Pro renews monthly — cancel whenever and you keep access
                until the end of the billing period.
              </dd>
            </div>
            <div>
              <dt className="font-display text-accent uppercase tracking-wider text-sm">
                What counts as an expert chat?
              </dt>
              <dd className="mt-2 text-text/80">
                Each question you send to the chatbot counts as one. Free
                users get 1 per day, Pro users get 5 per day.
              </dd>
            </div>
            <div>
              <dt className="font-display text-accent uppercase tracking-wider text-sm">
                Do I need an account for Free?
              </dt>
              <dd className="mt-2 text-text/80">
                No — the quiz and library are open to everyone. Sign in to
                save your stack and chat with the expert.
              </dd>
            </div>
            <div>
              <dt className="font-display text-accent uppercase tracking-wider text-sm">
                Is Stripe checkout live?
              </dt>
              <dd className="mt-2 text-text/80">
                Not yet — this page is a preview. Payment integration is on
                the way.
              </dd>
            </div>
          </dl>
        </section>
      </main>
    </div>
  );
}
