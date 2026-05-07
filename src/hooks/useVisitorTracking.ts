"use client";

import { useEffect, useRef } from "react";

const VISITOR_ID_KEY = "dn_visitor_id";
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
 * 2. POSTs to /api/v1/track-visit/ with the UUID to register the visitor.
 *    - First visit → creates a new BrowserVisitor row (counted as +1).
 *    - Return visits → row already exists, just updates last_seen.
 * 3. Tracks how long the user actually spends on the site using a session
 *    start timestamp. When the page is hidden or unloaded, it sends the
 *    elapsed seconds to the backend via session_seconds, which are added
 *    to that visitor's total_time_seconds cumulative counter.
 */
export function useVisitorTracking() {
  const sessionStartRef = useRef<number>(Date.now());

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Get or generate the persistent visitor UUID for this browser
    let visitorId = localStorage.getItem(VISITOR_ID_KEY);
    if (!visitorId) {
      visitorId = generateUUID();
      localStorage.setItem(VISITOR_ID_KEY, visitorId);
    }

    const currentVisitorId = visitorId;

    // Ping the backend on every page load so last_seen stays accurate.
    // The backend uses get_or_create — it only counts this browser as a
    // new visitor once (created=True), but updates last_seen every time.
    fetch(`${API_URL}/api/v1/track-visit/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitor_id: currentVisitorId, session_seconds: 0 }),
    }).catch(() => {
      // Network error — silent fail, retry on next page load
    });

    /**
     * Sends the elapsed session seconds to the backend.
     * Uses sendBeacon for reliability during page unload.
     */
    const sendSessionTime = () => {
      const elapsed = Math.floor((Date.now() - sessionStartRef.current) / 1000);
      if (elapsed < 2) return; // Ignore sub-2s blips

      const payload = JSON.stringify({
        visitor_id: currentVisitorId,
        session_seconds: elapsed,
      });

      // sendBeacon is fire-and-forget, survives page close
      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon(`${API_URL}/api/v1/track-visit/`, blob);
      } else {
        // Fallback for browsers without sendBeacon
        fetch(`${API_URL}/api/v1/track-visit/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    };

    // Send time when tab becomes hidden (switching apps, minimising, changing tabs)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        sendSessionTime();
      } else {
        // Tab became visible again — reset the session start clock
        sessionStartRef.current = Date.now();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      // Also send when the component unmounts (navigation within SPA)
      sendSessionTime();
    };
  }, []);
}
