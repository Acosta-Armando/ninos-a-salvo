"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useTransition } from "react";
import { ESTADOS_NOMBRES, getMunicipios } from "@/data/venezuela";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EDAD_FILTER_OPTIONS,
  type IdentidadFilter,
  type TableroSearchParams,
} from "@/lib/tablero";

interface TableroFiltersProps {
  params: TableroSearchParams;
  basePath: "/tablero" | "/fallecidos";
}

export function TableroFilters({ params, basePath }: TableroFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const identidad = (params.identidad ?? "todos") as IdentidadFilter;
  const estado = params.estado ?? "";
  const municipios = useMemo(
    () => (estado ? getMunicipios(estado) : []),
    [estado],
  );

  const hasFilters = Boolean(
    params.q ||
      (params.identidad && params.identidad !== "todos") ||
      params.estado ||
      params.ciudad ||
      params.edad,
  );

  const apply = (updates: Record<string, string>) => {
    const sp = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) sp.set(key, value);
      else sp.delete(key);
    }
    sp.delete("page");
    startTransition(() => {
      router.push(`${basePath}?${sp.toString()}`);
    });
  };

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="q">Buscar por nombre</Label>
            <Input
              id="q"
              type="search"
              defaultValue={params.q ?? ""}
              placeholder="Nombre del niño, padre, madre o familiar..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  apply({ q: (e.target as HTMLInputElement).value });
                }
              }}
            />
            <p className="text-xs text-muted-foreground">
              Puedes buscar por nombre, pero no se mostrará en las fichas ni en
              las tarjetas.
            </p>
          </div>
          <div className="space-y-2">
            <Label>Edad estimada</Label>
            <Select
              value={params.edad || "all"}
              onValueChange={(v) => apply({ edad: v === "all" ? "" : v })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todas las edades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las edades</SelectItem>
                {EDAD_FILTER_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button
              type="button"
              className="w-full"
              disabled={isPending}
              onClick={() => {
                const q =
                  (document.getElementById("q") as HTMLInputElement)?.value ??
                  "";
                apply({ q });
              }}
            >
              {isPending ? "Buscando..." : "Filtrar"}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Identidad registrada</Label>
            <Select
              value={identidad}
              onValueChange={(v) => apply({ identidad: v })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="con_nombre">Con nombre</SelectItem>
                <SelectItem value="sin_nombre">Sin nombre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Estado</Label>
            <Select
              value={estado || "all"}
              onValueChange={(v) =>
                apply({
                  estado: v === "all" ? "" : v,
                  ciudad: "",
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                {ESTADOS_NOMBRES.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Municipio</Label>
            <Select
              value={params.ciudad || "all"}
              onValueChange={(v) => apply({ ciudad: v === "all" ? "" : v })}
              disabled={!estado}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    estado ? "Todos los municipios" : "Elige un estado primero"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los municipios</SelectItem>
                {municipios.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {hasFilters && (
          <Button variant="link" className="h-auto p-0" asChild>
            <Link href={basePath}>Limpiar filtros</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
