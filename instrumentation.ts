export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./lib/bugsnag");
  }
}

export async function onRequestError(err: unknown) {
  const { default: Bugsnag } = await import("./lib/bugsnag");
  if (Bugsnag.isStarted()) Bugsnag.notify(err as Error);
}
