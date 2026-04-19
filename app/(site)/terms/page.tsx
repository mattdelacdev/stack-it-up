import Link from "next/link";

export const metadata = {
  title: "Terms of Service",
  description:
    "The rules for using StackItUp, including the Pro subscription, acceptable use, and our liability limits.",
  alternates: { canonical: "/terms" },
};

const updated = "April 19, 2026";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-bg text-text px-6 py-20">
      <article className="mx-auto max-w-3xl">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-accent">
          The fine print
        </p>
        <h1 className="mt-3 font-display text-3xl sm:text-4xl">
          <span className="text-gradient">TERMS OF SERVICE</span>
        </h1>
        <p className="mt-3 text-sm text-text/60 font-mono">
          Last updated: {updated}
        </p>

        <div className="mt-10 space-y-8 text-text/80 leading-relaxed">
          <section>
            <h2 className="font-display text-xl text-primary mb-3">
              1. Agreement
            </h2>
            <p>
              By accessing or using StackItUp (&ldquo;the Service&rdquo;,
              &ldquo;we&rdquo;, &ldquo;us&rdquo;), you agree to these Terms.
              If you don&rsquo;t agree, don&rsquo;t use the Service.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-primary mb-3">
              2. Not medical advice
            </h2>
            <p>
              StackItUp is educational. Nothing on the Service — quiz results,
              stacks, supplement pages, chatbot answers — is medical advice,
              diagnosis, or treatment. Talk to a qualified professional before
              starting any supplement, especially if you&rsquo;re pregnant,
              nursing, under 18, managing a condition, or taking medication.
              You use the Service at your own risk.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-primary mb-3">
              3. Accounts
            </h2>
            <p>
              Sign-in is via Google OAuth. You&rsquo;re responsible for
              activity on your account. Provide accurate information and keep
              it current. We may suspend or delete accounts that violate these
              Terms or applicable law.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-primary mb-3">
              4. Pro subscription
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Pro is billed monthly at the price shown on{" "}
                <Link
                  href="/pricing"
                  className="text-secondary hover:text-accent underline"
                >
                  /pricing
                </Link>
                . Payment is processed by Stripe.
              </li>
              <li>
                Your subscription renews automatically each month until you
                cancel. You authorize us (via Stripe) to charge your payment
                method on each renewal.
              </li>
              <li>
                You can cancel anytime from your{" "}
                <Link
                  href="/settings"
                  className="text-secondary hover:text-accent underline"
                >
                  settings
                </Link>
                . Cancellation takes effect at the end of the current billing
                period — you keep Pro access until then.
              </li>
              <li>
                We may change Pro pricing or features. If we raise the price,
                we&rsquo;ll notify you by email before the next renewal so you
                can cancel if you don&rsquo;t want to continue.
              </li>
              <li>
                Failure to pay (expired card, chargeback, etc.) may downgrade
                your account to Free.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-primary mb-3">
              5. Refunds
            </h2>
            <p>
              See our{" "}
              <Link
                href="/refund"
                className="text-secondary hover:text-accent underline"
              >
                Refund Policy
              </Link>{" "}
              for how refunds work on Pro subscriptions and one-time
              purchases.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-primary mb-3">
              6. Acceptable use
            </h2>
            <p>Don&rsquo;t:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Reverse-engineer, scrape, or resell the Service.</li>
              <li>
                Abuse the AI endpoints (the rate limits are there for a
                reason).
              </li>
              <li>
                Upload unlawful, harmful, or infringing content to your public
                profile.
              </li>
              <li>
                Use the Service to make decisions about medical treatment for
                yourself or others.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-primary mb-3">
              7. Intellectual property
            </h2>
            <p>
              The Service, including copy, design, and code, belongs to
              StackItUp. You keep ownership of content you submit (quiz
              answers, profile, avatar) and grant us a non-exclusive license
              to host and display it as needed to run the Service.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-primary mb-3">
              8. Termination
            </h2>
            <p>
              You can close your account anytime by contacting us. We may
              suspend or terminate access for violations of these Terms or if
              we can&rsquo;t continue providing the Service. On termination,
              Pro benefits end and any unused portion of a billing period is
              not refunded except as required by law or our{" "}
              <Link
                href="/refund"
                className="text-secondary hover:text-accent underline"
              >
                Refund Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-primary mb-3">
              9. Disclaimer
            </h2>
            <p>
              The Service is provided &ldquo;as is&rdquo; without warranties
              of any kind. We don&rsquo;t warrant that the Service will be
              uninterrupted, error-free, or fit for a particular purpose.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-primary mb-3">
              10. Limitation of liability
            </h2>
            <p>
              To the maximum extent permitted by law, StackItUp is not liable
              for indirect, incidental, special, or consequential damages, or
              for lost profits or data. Our total liability for any claim is
              capped at the amount you paid us in the 12 months before the
              claim arose (or $10 if you haven&rsquo;t paid us).
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-primary mb-3">
              11. Changes
            </h2>
            <p>
              We may update these Terms. Material changes will be announced
              by updating the date at the top of this page. Continued use
              after a change means you accept the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-primary mb-3">
              12. Contact
            </h2>
            <p>
              Questions? Email{" "}
              <a
                href="mailto:hello@stackitup.app"
                className="text-secondary hover:text-accent underline"
              >
                hello@stackitup.app
              </a>
              .
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
