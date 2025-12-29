import * as Sentry from "@sentry/react";

export const initSentry = () => {
  if (typeof window === "undefined") return;
  Sentry.init({
    environment: import.meta.env.MODE || import.meta.env.NODE_ENV,
    dsn: "https://975259541805c22c0f48823bc33e5c7c@o4509525304016896.ingest.de.sentry.io/4509525306245200",
    // Setting this option to true will send default PII data to Sentry.
    // For example, automatic IP address collection on events
    sendDefaultPii: true,
    //   integrations: [Sentry.replayIntegration()],
    // Session Replay
    //   replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    //   replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });
};
