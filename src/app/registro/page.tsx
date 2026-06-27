import { AppHeader } from "@/components/AppHeader";
import { RegistroForm } from "@/components/RegistroForm";
import { SyncProvider } from "@/components/SyncProvider";

export const metadata = {
  title: "Registrar niño — Niños a Salvo",
  description: "Registro offline-first de niños en puntos de resguardo",
};

export default function RegistroPage() {
  return (
    <div className="min-h-full bg-background">
      <AppHeader
        title="Registrar niño"
        subtitle="Guarda el registro aunque no haya internet"
        backHref="/"
        backLabel="← Inicio"
      />
      <main className="mx-auto max-w-2xl px-4 py-6">
        <SyncProvider>
          <RegistroForm />
        </SyncProvider>
      </main>
    </div>
  );
}
