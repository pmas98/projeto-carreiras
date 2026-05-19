"use client";

import { useEffect, Suspense } from "react";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { usePathname, useSearchParams } from "next/navigation";
import { initPostHog, isPostHogEnabled } from "@/lib/posthog";

// Safe dynamic PageView tracker for Next.js App Router client-side routing
function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && typeof window !== "undefined") {
      let url = window.origin + pathname;
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      
      if (isPostHogEnabled) {
        try {
          posthog.capture("$pageview", {
            $current_url: url,
          });
        } catch (e) {
          console.error("[PostHog] Pageview capture error:", e);
        }
      } else {
        // Fallback console log for pageview tracking in dev mode
        if (process.env.NODE_ENV === "development") {
          console.log(
            `%c[Telemetry 🚀]%c Pageview captured: %c${pathname}`,
            "color: #10b981; font-weight: bold; background: #064e3b; padding: 2px 6px; border-radius: 4px;",
            "color: #60a5fa;",
            "color: #a78bfa; font-weight: bold;"
          );
        }
      }
    }
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  useEffect(() => {
    initPostHog();
  }, []);

  // If PostHog key is defined, use the official Provider wrapper, otherwise just render kids (safe bypass)
  if (isPostHogEnabled) {
    return (
      <PHProvider client={posthog}>
        <Suspense fallback={null}>
          <PostHogPageView />
        </Suspense>
        {children}
      </PHProvider>
    );
  }

  // Fallback: render without SDK wrapper but keep our SPA Pageview logger active for dev testing
  return (
    <>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </>
  );
}
