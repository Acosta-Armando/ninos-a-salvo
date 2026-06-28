"use client";
import { useEffect, useRef, useState } from "react";
import { ConnectionStatusBar } from "@/components/offline/ConnectionStatusBar";
import { PendingSyncBar } from "@/components/offline/PendingSyncBar";

const STATUS_BARS_HEIGHT_VAR = "--status-bars-height";

/** Barras fijas arriba; reserva espacio y expone altura para headers sticky. */
export function OfflineStatusBars() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const next = el.offsetHeight;
      setHeight(next);
      document.documentElement.style.setProperty(
        STATUS_BARS_HEIGHT_VAR,
        `${next}px`,
      );
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);

    return () => {
      observer.disconnect();
      document.documentElement.style.setProperty(STATUS_BARS_HEIGHT_VAR, "0px");
    };
  }, []);

  return (
    <>
      <div ref={containerRef} className="fixed inset-x-0 top-0 z-50">
        <ConnectionStatusBar />
        <PendingSyncBar />
      </div>
      <div className="shrink-0" style={{ height }} aria-hidden />
    </>
  );
}
