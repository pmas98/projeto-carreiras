import posthog from "posthog-js";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

// Check if we are running in the browser and have a valid key
export const isPostHogEnabled = typeof window !== "undefined" && !!POSTHOG_KEY;

// Elegant custom styling for console fallback logs in development
const logFallback = (event: string, properties?: Record<string, any>) => {
  if (typeof window !== "undefined") {
    // Only show styled console logs in development or if PostHog is disabled (development testing)
    if (process.env.NODE_ENV === "development" || !isPostHogEnabled) {
      console.log(
        `%c[Telemetry 🚀]%c Event captured: %c${event}`,
        "color: #10b981; font-weight: bold; background: #064e3b; padding: 2px 6px; border-radius: 4px;",
        "color: #60a5fa;",
        "color: #f43f5e; font-weight: bold;",
        properties
      );
    }
  }
};

/**
 * Initializes PostHog safely in browser environment
 */
export const initPostHog = () => {
  if (typeof window === "undefined") return;

  if (isPostHogEnabled) {
    try {
      posthog.init(POSTHOG_KEY!, {
        api_host: POSTHOG_HOST,
        person_profiles: "identified_only",
        capture_pageview: false, // Handled manually by PostHogPageView
        persistence: "localStorage",
        loaded: () => {
          if (process.env.NODE_ENV === "development") {
            console.log("[PostHog] Initialized successfully.");
          }
        },
      });
    } catch (e) {
      console.error("[PostHog] Initialization error:", e);
    }
  } else {
    console.warn(
      "[PostHog] Environment variable NEXT_PUBLIC_POSTHOG_KEY is not defined. Running in console fallback telemetry mode."
    );
  }
};

/**
 * Safely captures a telemetry event, falling back to styled console logs in development
 */
export const captureEvent = (event: string, properties?: Record<string, any>) => {
  logFallback(event, properties);
  
  if (isPostHogEnabled) {
    try {
      posthog.capture(event, properties);
    } catch (error) {
      console.error("[PostHog] Failed to capture event:", error);
    }
  }
};
