"use client";

import { useEffect } from "react";

const VISITOR_ID_KEY = "dn_visitor_id";
const VISITOR_TRACKED_KEY = "dn_visitor_tracked";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/**
 * Generates a RFC-4122 v4 UUID using the browser's crypto API.
 * Falls back to a Math.random-based UUID on older browsers.
 */
function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for Safari < 15.4
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * useVisitorTracking
 *
 * How it works:
 * 1. On first load, generates a UUID and saves it to localStorage (permanent).
 * 2. If the UUID hasn't been sent to the server yet (dn_visitor_tracked = false),
 *    it POSTs to /api/v1/track-visit/ with the UUID.
 * 3. On success, sets dn_visitor_tracked = "true" so it NEVER calls the API again
 *    from this browser — even across page refreshes, tab re-opens, etc.
 *
 * Result: The backend's BrowserVisitor table holds exactly one row per unique
 * browser/device. Count of rows = accurate unique visitor count.
 */
export function useVisitorTracking() {
  useEffect(() => {
    // Only run in the browser (not during SSR)
    if (typeof window === "undefined") return;

    // If already tracked this browser, do nothing
    if (localStorage.getItem(VISITOR_TRACKED_KEY) === "true") return;

    // Get or generate the persistent visitor UUID for this browser
    let visitorId = localStorage.getItem(VISITOR_ID_KEY);
    if (!visitorId) {
      visitorId = generateUUID();
      localStorage.setItem(VISITOR_ID_KEY, visitorId);
    }

    // Fire-and-forget — we don't block anything on this
    fetch(`${API_URL}/api/v1/track-visit/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitor_id: visitorId }),
    })
      .then((res) => {
        if (res.ok || res.status === 200 || res.status === 201) {
          // Mark as permanently tracked in this browser
          localStorage.setItem(VISITOR_TRACKED_KEY, "true");
        }
      })
      .catch(() => {
        // Network error — do NOT set tracked flag so it retries next visit
      });
  }, []);
}
