import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";
import FeedbackForm from "@/components/FeedbackForm";

const title = "Feedback";
const description =
  "Tell us what's working, what's broken, and what you'd like to see next.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/feedback" },
  openGraph: {
    type: "website",
    title: `${title} — ${SITE_NAME}`,
    description,
    url: "/feedback",
    siteName: SITE_NAME,
  },
};

export default function FeedbackPage() {
  return (
    <section className="relative z-10">
      <div className="mx-auto max-w-2xl px-6 py-16 sm:py-20">
        <p className="font-display text-xs tracking-[0.3em] text-accent">
          WE&apos;RE LISTENING
        </p>
        <h1 className="mt-3 font-display text-3xl sm:text-4xl text-text">
          <span className="text-gradient">Send us feedback</span>
        </h1>
        <p className="mt-4 text-text/70">
          Spotted a bug? Have a supplement you wish we covered? Tell us — it
          lands in our admin inbox.
        </p>
        <div className="mt-8">
          <FeedbackForm />
        </div>
      </div>
    </section>
  );
}
