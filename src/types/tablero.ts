export const PAGE_SIZE = 20;

export type IdentidadFilter = "todos" | "con_nombre" | "sin_nombre";

export type EdadFilter = "0-2" | "3-5" | "6-8" | "8-10" | "10+";

export const EDAD_FILTER_OPTIONS: { value: EdadFilter; label: string }[] = [
  { value: "0-2", label: "0 a 2 años" },
  { value: "3-5", label: "3 a 5 años" },
  { value: "6-8", label: "6 a 8 años" },
  { value: "8-10", label: "8 a 10 años" },
  { value: "10+", label: "Mayor de 10 años" },
];

export interface TableroSearchParams {
  q?: string;
  page?: string;
  identidad?: string;
  estado?: string;
  ciudad?: string;
  edad?: string;
}
