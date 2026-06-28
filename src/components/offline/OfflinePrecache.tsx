"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { OFFLINE_ROUTES } from "@/lib/offlineRoutes";

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return null;

  const registration = await navigator.serviceWorker.register("/sw.js", {
    updateViaCache: "none",
  });
  await registration.update();
  await navigator.serviceWorker.ready;

  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: "PRECACHE_OFFLINE_ROUTES" });
  } else {
    registration.addEventListener("controllerchange", () => {
      navigator.serviceWorker.controller?.postMessage({
        type: "PRECACHE_OFFLINE_ROUTES",
      });
    }, { once: true });
  }

  return registration;
}

/** Al iniciar (con red), precarga / y /registro en caché del service worker. */
export function OfflinePrecache() {
  const router = useRouter();

  useEffect(() => {
    void registerServiceWorker();

    const warmOfflineRoutes = () => {
      if (!navigator.onLine) return;

      for (const route of OFFLINE_ROUTES) {
        router.prefetch(route);
        void fetch(route, { credentials: "same-origin" }).catch(() => {});
      }

      navigator.serviceWorker.controller?.postMessage({
        type: "PRECACHE_OFFLINE_ROUTES",
      });
    };

    warmOfflineRoutes();
    window.addEventListener("online", warmOfflineRoutes);

    return () => window.removeEventListener("online", warmOfflineRoutes);
  }, [router]);

  return null;
}
