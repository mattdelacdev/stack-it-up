import Link from "next/link";
import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const paid = session_id
    ? (await stripe.checkout.sessions.retrieve(session_id)).payment_status === "paid"
    : false;

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 retro-grid opacity-30" aria-hidden />
      <main className="relative z-10 mx-auto max-w-2xl px-6 py-20 text-center">
        {paid ? (
          <>
            <p className="font-display text-accent text-xs sm:text-sm uppercase tracking-[0.3em] mb-3">
              Payment received
            </p>
            <h1 className="font-display text-5xl sm:text-6xl text-text leading-[0.95]">
              Thanks — your guide is ready.
            </h1>
            <p className="mt-6 text-lg text-text/80">
              Click below to download your PDF. Keep this link — it works for this session only.
            </p>
            <a
              href={`/api/download?session_id=${session_id}`}
              className="btn-primary mt-10 inline-block"
            >
              Download PDF
            </a>
          </>
        ) : (
          <>
            <h1 className="font-display text-4xl text-text">Payment not confirmed</h1>
            <p className="mt-4 text-text/80">
              We couldn&apos;t verify your purchase. If you were charged, email matt@delac.io.
            </p>
            <Link href="/supplements" className="btn-secondary mt-8 inline-block">
              Back to supplements
            </Link>
          </>
        )}
      </main>
    </div>
  );
}
