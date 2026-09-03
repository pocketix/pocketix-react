import posthog from "posthog-js";

const POSTHOG_KEY = "phc_Rnee6Qq5vgXvJ5NCh2ls9RIFvWgpO83bjuUb53yvss2";
const POSTHOG_HOST = "https://posthog.pocketix.org";

let consented = false;
let initialized = false;

/**
 * Called by PocketixEditor whenever the end user's consent status is known
 * (settings.analytics.enabled AND the consent modal has been agreed to).
 * posthog.init() only ever runs once consent is actually granted - never as
 * an import-time side effect.
 */
function setAnalyticsConsent(value: boolean): void {
  consented = value;

  if (consented && !initialized) {
    initialized = true;
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      person_profiles: "always",
      autocapture: true
    });
  }
}

/** No-ops unless setAnalyticsConsent(true) has been called. */
function captureAnalyticsEvent(event: string, properties?: Record<string, unknown>): void {
  if (!consented) {
    return;
  }

  posthog.capture(event, properties);
}

export { setAnalyticsConsent, captureAnalyticsEvent };
