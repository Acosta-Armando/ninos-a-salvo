"use client";

import { useEffect } from "react";
import { triggerSync } from "@/lib/sync";

export function SyncProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleOnline = () => {
      void triggerSync();
    };

    window.addEventListener("online", handleOnline);

    if (navigator.onLine) {
      void triggerSync();
    }

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return <>{children}</>;
}
