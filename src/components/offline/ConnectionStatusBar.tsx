"use client";
import { Wifi, WifiOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useIsClient, useOnlineStatus } from "@/hooks/useOnlineStatus";

/** Persiste entre remontajes al cambiar de ruta en el mismo tab. */
let offlineBarActive = false;

function readInitialVisible(): boolean {
  if (typeof window === "undefined") return false;
  if (!navigator.onLine) {
    offlineBarActive = true;
    return true;
  }
  return offlineBarActive;
}

/** Barra superior: solo ante cambio de red; offline permanece visible. */
export function ConnectionStatusBar() {
  const isClient = useIsClient();
  const online = useOnlineStatus();
  const [visible, setVisible] = useState(readInitialVisible);
  const hideTimerRef = useRef<number | null>(null);

  const clearHideTimer = () => {
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  useEffect(() => {
    if (!isClient) return;

    const handleOffline = () => {
      offlineBarActive = true;
      clearHideTimer();
      setVisible(true);
    };

    const handleOnline = () => {
      offlineBarActive = false;
      clearHideTimer();
      setVisible(true);
      hideTimerRef.current = window.setTimeout(() => {
        setVisible(false);
        hideTimerRef.current = null;
      }, 3000);
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      clearHideTimer();
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [isClient]);

  if (!isClient || !visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`sticky top-0 z-50 w-full border-b px-3 py-1.5 text-center text-xs font-medium backdrop-blur-sm ${
        online
          ? "border-green-500/30 bg-green-600/90 text-white"
          : "border-amber-500/40 bg-amber-600/95 text-white"
      }`}
    >
      <span className="inline-flex items-center justify-center gap-1.5">
        {online ? (
          <>
            <Wifi className="size-3.5 shrink-0" />
            Con conexión — modo en línea
          </>
        ) : (
          <>
            <WifiOff className="size-3.5 shrink-0" />
            Sin conexión — modo offline (puedes registrar)
          </>
        )}
      </span>
    </div>
  );
}
