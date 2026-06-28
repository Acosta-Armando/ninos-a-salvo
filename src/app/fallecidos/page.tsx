import { TableroPageContent } from "@/components/tablero/TableroPageContent";
import type { TableroSearchParams } from "@/types/tablero";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Fallecidos — Niños a Salvo",
  description: "Registro de niños, niñas y adolescentes fallecidos para identificación familiar",
};

interface PageProps {
  searchParams: Promise<TableroSearchParams>;
}

export default async function FallecidosPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <TableroPageContent
      estadoVital="Fallecido"
      basePath="/fallecidos"
      params={params}
      title="Fallecidos"
      subtitle="Para que sus familias puedan identificarlos"
      emptyMessage="No hay registros de fallecidos con estos filtros."
    />
  );
}
