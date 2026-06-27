import { TableroPageContent } from "@/components/TableroPageContent";
import type { TableroSearchParams } from "@/lib/tablero";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Fallecidos — Niños a Salvo",
  description: "Registro de niños fallecidos para identificación familiar",
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
      title="Niños fallecidos"
      subtitle="Para que sus familias puedan identificarlos"
      emptyMessage="No hay registros de niños fallecidos con estos filtros."
    />
  );
}
