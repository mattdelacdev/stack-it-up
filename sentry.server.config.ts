import * as Sentry from "@sentry/nextjs";

if (process.env.NODE_ENV !== "test") {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0.1,
    enabled: process.env.NODE_ENV === "production",
  });
}
