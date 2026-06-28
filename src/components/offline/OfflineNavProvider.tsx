"use client";
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { requiresConnection } from "@/lib/offlineRoutes";

interface OfflineNavContextValue {
  showOfflinePrompt: () => void;
  guardNavigation: (href: string) => boolean;
}

const OfflineNavContext = createContext<OfflineNavContextValue | null>(null);

export function OfflineNavProvider({ children }: { children: ReactNode }) {
  const online = useOnlineStatus();
  const [open, setOpen] = useState(false);

  const showOfflinePrompt = useCallback(() => setOpen(true), []);

  const guardNavigation = useCallback(
    (href: string) => {
      if (!requiresConnection(href) || online) return true;
      setOpen(true);
      return false;
    },
    [online],
  );

  return (
    <OfflineNavContext.Provider value={{ showOfflinePrompt, guardNavigation }}>
      {children}
      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <div
            role="alertdialog"
            aria-labelledby="offline-dialog-title"
            aria-describedby="offline-dialog-desc"
            className="w-full max-w-sm rounded-xl border bg-card p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-amber-500/15 text-amber-600">
              <WifiOff className="size-5" />
            </div>
            <h2 id="offline-dialog-title" className="text-lg font-semibold">
              Sin conexión a internet
            </h2>
            <p id="offline-dialog-desc" className="mt-2 text-sm text-muted-foreground">
              Para acceder a esta sección debes reconectar a internet. Mientras
              tanto puedes usar el inicio y el registro en modo offline.
            </p>
            <Button className="mt-5 w-full" onClick={() => setOpen(false)}>
              Entendido
            </Button>
          </div>
        </div>
      ) : null}
    </OfflineNavContext.Provider>
  );
}

export function useOfflineNav(): OfflineNavContextValue {
  const ctx = useContext(OfflineNavContext);
  if (!ctx) {
    throw new Error("useOfflineNav debe usarse dentro de OfflineNavProvider");
  }
  return ctx;
}
