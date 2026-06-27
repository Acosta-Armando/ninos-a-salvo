"use client";

import { ESTADOS_NOMBRES, getMunicipios } from "@/data/venezuela";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EstadoCiudadSelectProps {
  estado: string;
  ciudad: string;
  onEstadoChange: (estado: string) => void;
  onCiudadChange: (ciudad: string) => void;
  required?: boolean;
  estadoLabel?: string;
  ciudadLabel?: string;
}

export function EstadoCiudadSelect({
  estado,
  ciudad,
  onEstadoChange,
  onCiudadChange,
  required,
  estadoLabel = "Estado",
  ciudadLabel = "Municipio",
}: EstadoCiudadSelectProps) {
  const municipios = estado ? getMunicipios(estado) : [];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label>
          {estadoLabel}
          {required ? " *" : ""}
        </Label>
        <Select
          value={estado || undefined}
          onValueChange={(v) => {
            onEstadoChange(v);
            onCiudadChange("");
          }}
          required={required}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccionar estado" />
          </SelectTrigger>
          <SelectContent>
            {ESTADOS_NOMBRES.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>
          {ciudadLabel}
          {required ? " *" : ""}
        </Label>
        <Select
          value={ciudad || undefined}
          onValueChange={onCiudadChange}
          disabled={!estado}
          required={required}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                estado ? "Seleccionar municipio" : "Primero elige un estado"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {municipios.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
