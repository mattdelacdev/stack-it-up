export const metadata = {
  title: "Privacy Policy",
  description:
    "How StackItUp collects, uses, and protects your data when you take the quiz, sign in, or subscribe to the newsletter.",
};

const updated = "April 19, 2026";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-bg text-text px-6 py-20">
      <article className="mx-auto max-w-3xl">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-accent">
          The fine print
        </p>
        <h1 className="mt-3 font-display text-3xl sm:text-4xl">
          <span className="text-gradient">PRIVACY POLICY</span>
        </h1>
        <p className="mt-3 text-sm text-text/60 font-mono">Last updated: {updated}</p>

        <div className="mt-10 space-y-8 text-text/80 leading-relaxed">
          <section>
            <h2 className="font-display text-xl text-primary mb-3">Overview</h2>
            <p>
              StackItUp (&ldquo;we&rdquo;, &ldquo;us&rdquo;) helps you generate a personalized
              supplement stack. This policy explains what we collect, why, and the choices you
              have. We try to collect as little as possible.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-primary mb-3">What we collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-accent">Quiz answers.</strong> Stored in your
                browser&rsquo;s local storage. We don&rsquo;t send them to our servers unless you
                sign in and save a stack to your account.
              </li>
              <li>
                <strong className="text-accent">Account info.</strong> If you sign in with Google,
                we receive your name, email, avatar, and Google user ID via Supabase Auth.
              </li>
              <li>
                <strong className="text-accent">Profile data.</strong> Anything you add on your
                settings page (username, bio, public profile fields).
              </li>
              <li>
                <strong className="text-accent">Newsletter email.</strong> If you subscribe, we
                store your email to send occasional updates.
              </li>
              <li>
                <strong className="text-accent">Analytics.</strong> We use Umami for privacy-
                friendly, cookie-less page analytics (pages viewed, referrer, rough region). No
                personal identifiers are collected.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-primary mb-3">How we use it</h2>
            <p>
              To generate your stack, render your account pages, send the newsletter if you
              opted in, and understand which parts of the site are useful. We don&rsquo;t sell
              your data and we don&rsquo;t run third-party advertising.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-primary mb-3">Who we share with</h2>
            <p>
              Service providers that make the site work: Supabase (auth, database, storage),
              Vercel (hosting), Google (OAuth sign-in), Stripe (payments — card details are
              handled directly by Stripe and never touch our servers), and Umami (analytics).
              Each only gets what they need to do their job.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-primary mb-3">Your choices</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Clear your browser storage to wipe quiz answers on your device.</li>
              <li>Unsubscribe from the newsletter via the link in any email.</li>
              <li>
                Delete your account or request your data by emailing{" "}
                <a
                  href="mailto:matt@delac.io"
                  className="text-secondary hover:text-accent underline"
                >
                  matt@delac.io
                </a>
                .
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-primary mb-3">Not medical advice</h2>
            <p>
              StackItUp is educational. Nothing here is medical advice. Talk to a qualified
              professional before starting any new supplement — especially if you&rsquo;re
              pregnant, nursing, or on medication.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-primary mb-3">Contact</h2>
            <p>
              Questions?{" "}
              <a
                href="mailto:matt@delac.io"
                className="text-secondary hover:text-accent underline"
              >
                matt@delac.io
              </a>
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
