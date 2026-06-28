import { AppHeader } from "@/components/layout/AppHeader";
import { RegistroForm } from "@/components/registro/RegistroForm";

export const metadata = {
  title: "Registrar — Niños a Salvo",
  description: "Registro offline-first de niños, niñas y adolescentes en puntos de resguardo",
};

export default function RegistroPage() {
  return (
    <div className="min-h-full bg-background">
      <AppHeader
        title="Registrar"
        subtitle="Guarda el registro aunque no haya internet"
        backHref="/"
        backLabel="← Inicio"
      />
      <main className="mx-auto max-w-2xl px-4 py-6">
        <RegistroForm />
      </main>
    </div>
  );
}
