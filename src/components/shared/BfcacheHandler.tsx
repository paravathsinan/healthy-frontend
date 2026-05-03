"use client";

import { useEffect } from "react";

export function BfcacheHandler() {
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        // Force a reload if the page was restored from bfcache
        // to ensure all client-side states and hydration are clean
        window.location.reload();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  return null;
}
