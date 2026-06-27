"use client";
import { useSyncExternalStore } from "react";

function subscribeOnline(onStoreChange: () => void) {
  window.addEventListener("online", onStoreChange);
  window.addEventListener("offline", onStoreChange);
  return () => {
    window.removeEventListener("online", onStoreChange);
    window.removeEventListener("offline", onStoreChange);
  };
}

function getOnlineSnapshot(): boolean {
  return navigator.onLine;
}

export function useOnlineStatus(): boolean {
  return useSyncExternalStore(subscribeOnline, getOnlineSnapshot, () => true);
}

function subscribeClient(onStoreChange: () => void) {
  return () => {};
}

export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribeClient,
    () => true,
    () => false,
  );
}
