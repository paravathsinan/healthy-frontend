"use client";

import { useVisitorTracking } from "@/hooks/useVisitorTracking";

/**
 * Thin client component that calls the visitor tracking hook.
 * Placed in the root layout so every page triggers it.
 * The hook itself ensures the API is only called once per browser/device.
 */
export function VisitorTracker() {
  useVisitorTracking();
  return null; // renders nothing
}
