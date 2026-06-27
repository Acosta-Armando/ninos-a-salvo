import raw from "./venezuela.json";

export interface EstadoData {
  estado: string;
  municipios: string[];
}

export const VENEZUELA_ESTADOS = raw as EstadoData[];

export const ESTADOS_NOMBRES = VENEZUELA_ESTADOS.map((e) => e.estado).sort(
  (a, b) => a.localeCompare(b, "es"),
);

export function getMunicipios(estadoNombre: string): string[] {
  const estado = VENEZUELA_ESTADOS.find((e) => e.estado === estadoNombre);
  return estado?.municipios ?? [];
}

export function pickRandomLocation(): { estado: string; ciudad: string } {
  const estado =
    VENEZUELA_ESTADOS[Math.floor(Math.random() * VENEZUELA_ESTADOS.length)];
  const ciudad =
    estado.municipios[Math.floor(Math.random() * estado.municipios.length)];
  return { estado: estado.estado, ciudad };
}
