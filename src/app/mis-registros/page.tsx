import { AppHeader } from "@/components/layout/AppHeader";
import { MisRegistrosContent } from "@/components/mis-registros/MisRegistrosContent";

export const metadata = {
  title: "Mis registros — Niños a Salvo",
  description:
    "Registros creados en este dispositivo. Gestiona avisos en el tablero.",
};

export default function MisRegistrosPage() {
  return (
    <div className="min-h-full bg-background">
      <AppHeader
        title="Mis registros"
        subtitle="Creados en este dispositivo"
        backHref="/"
        backLabel="← Inicio"
      />
      <main className="mx-auto max-w-2xl px-4 py-6">
        <MisRegistrosContent />
      </main>
    </div>
  );
}
