"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLocalChildCount } from "@/hooks/useLocalChildCount";

/** Enlace visible solo si este dispositivo creó al menos un registro. */
export function MisRegistrosLink() {
  const count = useLocalChildCount();

  if (count === 0) return null;

  return (
    <Button asChild variant="secondary" size="lg">
      <Link href="/mis-registros">Mis registros ({count})</Link>
    </Button>
  );
}
