"use client";
import { useEffect, useState } from "react";
import { localDb } from "@/lib/db";

/** Cantidad de registros creados en este dispositivo (Dexie). */
export function useLocalChildCount(): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let active = true;

    const refresh = async () => {
      const n = await localDb.children.count();
      if (active) setCount(n);
    };

    void refresh();

    const onChange = () => {
      void refresh();
    };

    window.addEventListener("online", onChange);
    window.addEventListener("focus", onChange);

    return () => {
      active = false;
      window.removeEventListener("online", onChange);
      window.removeEventListener("focus", onChange);
    };
  }, []);

  return count;
}
