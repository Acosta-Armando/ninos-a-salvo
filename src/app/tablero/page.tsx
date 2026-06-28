import { TableroPageContent } from "@/components/tablero/TableroPageContent";
import type { TableroSearchParams } from "@/types/tablero";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tablero — Niños a Salvo",
  description: "Niños, niñas y adolescentes en resguardo buscando a su familia",
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
      title="Tablero"
      subtitle="Niños, niñas y adolescentes con vida en puntos de resguardo"
      emptyMessage="No hay registros que coincidan con tu búsqueda."
    />
  );
}
