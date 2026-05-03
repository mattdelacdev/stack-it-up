import Bugsnag from "@bugsnag/js";

const apiKey = process.env.NEXT_PUBLIC_BUGSNAG_API_KEY;

if (apiKey && !Bugsnag.isStarted() && process.env.NODE_ENV !== "test") {
  Bugsnag.start({
    apiKey,
    appType: "server",
    releaseStage: process.env.NODE_ENV,
    enabledReleaseStages: ["production"],
  });
}

export default Bugsnag;
