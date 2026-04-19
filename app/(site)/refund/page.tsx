import Link from "next/link";

export const metadata = {
  title: "Refund Policy",
  description:
    "How refunds and cancellations work for StackItUp Pro subscriptions and one-time purchases.",
  alternates: { canonical: "/refund" },
};

const updated = "April 19, 2026";

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-bg text-text px-6 py-20">
      <article className="mx-auto max-w-3xl">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-accent">
          The fine print
        </p>
        <h1 className="mt-3 font-display text-3xl sm:text-4xl">
          <span className="text-gradient">REFUND POLICY</span>
        </h1>
        <p className="mt-3 text-sm text-text/60 font-mono">
          Last updated: {updated}
        </p>

        <div className="mt-10 space-y-8 text-text/80 leading-relaxed">
          <section>
            <h2 className="font-display text-xl text-primary mb-3">
              Pro subscription
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-accent">Cancel anytime.</strong> You
                can cancel from your{" "}
                <Link
                  href="/settings"
                  className="text-secondary hover:text-accent underline"
                >
                  settings
                </Link>
                . Cancellation stops future renewals — you keep Pro access
                until the end of your current billing period.
              </li>
              <li>
                <strong className="text-accent">
                  7-day refund window.
                </strong>{" "}
                If you&rsquo;re unhappy with Pro within 7 days of your first
                payment, email us for a full refund of that first month.
              </li>
              <li>
                <strong className="text-accent">Renewal charges.</strong> We
                don&rsquo;t automatically refund renewal charges after the
                7-day window. If you forgot to cancel, email us within 14 days
                of the renewal and we&rsquo;ll review on a case-by-case basis.
              </li>
              <li>
                <strong className="text-accent">No partial refunds</strong>{" "}
                for unused days in a billing period after the 7-day window.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-primary mb-3">
              One-time purchases
            </h2>
            <p>
              Digital products (like the downloadable guide) are refundable
              within 7 days of purchase if you haven&rsquo;t downloaded the
              file. Once the file has been downloaded, sales are final.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-primary mb-3">
              How to request a refund
            </h2>
            <p>
              Email{" "}
              <a
                href="mailto:hello@stackitup.app"
                className="text-secondary hover:text-accent underline"
              >
                hello@stackitup.app
              </a>{" "}
              from the address on your account. Include the approximate date
              of purchase and the reason. We&rsquo;ll reply within 3 business
              days. Approved refunds are issued to the original payment
              method via Stripe and typically arrive within 5–10 business
              days, depending on your bank.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-primary mb-3">
              Statutory rights
            </h2>
            <p>
              Nothing here limits statutory rights you may have under your
              local consumer-protection laws (for example, the EU
              right-of-withdrawal rules). If local law gives you a stronger
              refund right than this policy, that law controls.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-primary mb-3">
              Chargebacks
            </h2>
            <p>
              Please contact us before filing a chargeback — we can almost
              always resolve issues faster than your bank can. Chargebacks
              filed without contacting us may result in account suspension.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
