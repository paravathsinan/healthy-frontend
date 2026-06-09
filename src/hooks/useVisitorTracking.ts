"use client";

import { useEffect, useRef } from "react";

const VISITOR_ID_KEY = "dn_visitor_id";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
/** Send elapsed time to the backend every 30s while the tab is visible */
const HEARTBEAT_MS = 30_000;

function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function postVisit(payload: { visitor_id: string; session_seconds: number }, useBeacon = false) {
  const body = JSON.stringify(payload);

  if (useBeacon && navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon(`${API_URL}/api/v1/track-visit/`, blob);
    return;
  }

  fetch(`${API_URL}/api/v1/track-visit/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: useBeacon,
  }).catch(() => {});
}

/**
 * Tracks unique visitors and real on-site time via periodic heartbeats.
 * Heartbeats every 30s while the tab is visible accumulate accurate session time.
 */
export function useVisitorTracking() {
  const visitorIdRef = useRef<string>("");
  const lastReportRef = useRef<number>(Date.now());

  useEffect(() => {
    if (typeof window === "undefined") return;

    let visitorId = localStorage.getItem(VISITOR_ID_KEY);
    if (!visitorId) {
      visitorId = generateUUID();
      localStorage.setItem(VISITOR_ID_KEY, visitorId);
    }
    visitorIdRef.current = visitorId;

    /** Report seconds elapsed since the last heartbeat/unload ping */
    const reportElapsed = (useBeacon = false) => {
      const elapsed = Math.floor((Date.now() - lastReportRef.current) / 1000);
      if (elapsed < 1) return;

      lastReportRef.current = Date.now();
      postVisit({ visitor_id: visitorIdRef.current, session_seconds: elapsed }, useBeacon);
    };

    // Register visitor and refresh last_seen on each page load
    postVisit({ visitor_id: visitorIdRef.current, session_seconds: 0 });
    lastReportRef.current = Date.now();

    // Periodic heartbeat — captures real time while user browses (even on one page)
    const heartbeat = setInterval(() => {
      if (document.visibilityState === "visible") {
        reportElapsed(false);
      }
    }, HEARTBEAT_MS);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        reportElapsed(true);
      } else {
        lastReportRef.current = Date.now();
      }
    };

    const handlePageHide = () => reportElapsed(true);

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      clearInterval(heartbeat);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      reportElapsed(true);
    };
  }, []);
}
