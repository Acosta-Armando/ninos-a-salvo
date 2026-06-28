"use client";
import { Shield } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ReencontradoConfirmDialogProps {
  open: boolean;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

/**
 * Confirmación antes de quitar un registro del tablero.
 * La app no autoriza entregas; solo actualiza el aviso público.
 */
export function ReencontradoConfirmDialog({
  open,
  loading,
  onCancel,
  onConfirm,
}: ReencontradoConfirmDialogProps) {
  const [confirmed, setConfirmed] = useState(false);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      onClick={() => {
        if (!loading) {
          setConfirmed(false);
          onCancel();
        }
      }}
    >
      <div
        role="alertdialog"
        aria-labelledby="reencontrado-title"
        aria-describedby="reencontrado-desc"
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border bg-card p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-amber-500/15 text-amber-600">
          <Shield className="size-5" aria-hidden />
        </div>
        <h2 id="reencontrado-title" className="text-lg font-semibold">
          Quitar del tablero
        </h2>
        <div
          id="reencontrado-desc"
          className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground"
        >
          <p>
            Usa esta opción solo si el niño, niña o adolescente{" "}
            <strong className="text-foreground">ya no está bajo tu resguardo</strong>{" "}
            y los organismos competentes se hicieron cargo del caso.
          </p>
          <p>
            Esta plataforma <strong className="text-foreground">no entrega ni autoriza
            entregas</strong>. No debes entregar a nadie por haber visto una ficha en internet.
            El reencuentro y la custodia corresponden a Defensa Civil, autoridades locales u
            otras instituciones habilitadas.
          </p>
        </div>
        <div className="mt-4 flex items-start gap-3 rounded-lg border bg-muted/40 p-3">
          <Checkbox
            id="reencontrado-confirm"
            checked={confirmed}
            disabled={loading}
            onCheckedChange={(v) => setConfirmed(v === true)}
          />
          <Label
            htmlFor="reencontrado-confirm"
            className="cursor-pointer text-sm leading-snug font-normal"
          >
            Confirmo que el menor ya no está en mi resguardo y quiero quitar este aviso del
            tablero. Entiendo que la app no realiza ni valida entregas.
          </Label>
        </div>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row-reverse">
          <Button
            type="button"
            disabled={!confirmed || loading}
            onClick={onConfirm}
          >
            {loading ? "Guardando…" : "Confirmar"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={() => {
              setConfirmed(false);
              onCancel();
            }}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}
