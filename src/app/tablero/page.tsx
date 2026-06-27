import { TableroPageContent } from "@/components/TableroPageContent";
import type { TableroSearchParams } from "@/lib/tablero";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tablero — Niños a Salvo",
  description: "Niños en resguardo buscando a su familia",
};

interface PageProps {
  searchParams: Promise<TableroSearchParams>;
}

export default async function TableroPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <TableroPageContent
      estadoVital="ConVida"
      basePath="/tablero"
      params={params}
      title="Tablero de niños"
      subtitle="Niños con vida en puntos de resguardo"
      emptyMessage="No hay niños que coincidan con tu búsqueda."
    />
  );
}
