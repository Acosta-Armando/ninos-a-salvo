import { AppHeader } from "@/components/layout/AppHeader";
import { AyudaContent } from "@/components/ayuda/AyudaContent";

export const metadata = {
  title: "Ayuda — Niños a Salvo",
  description:
    "Guía de uso: registro, tablero, privacidad, fotografías y protección de menores",
};

export default function AyudaPage() {
  return (
    <div className="min-h-full bg-background">
      <AppHeader
        title="Ayuda"
        subtitle="Cómo usar la plataforma"
        backHref="/"
        backLabel="← Inicio"
      />
      <main className="mx-auto max-w-2xl px-4 py-6">
        <AyudaContent />
      </main>
    </div>
  );
}
