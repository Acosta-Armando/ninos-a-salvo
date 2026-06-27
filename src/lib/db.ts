import Dexie, { type Table } from "dexie";
import type { LocalChild } from "./types";

/**
 * Base de datos local (IndexedDB) para registro offline.
 * Solo se usa en /registro; el tablero siempre lee del servidor.
 */
export class NinosDB extends Dexie {
  children!: Table<LocalChild, string>;

  constructor() {
    super("ninos-a-salvo");
    // v1: esquema inicial
    this.version(1).stores({
      children:
        "id, sync_status, status, created_at, fullname, edad_estimada, estado_resguardo",
    });
    // v3: índices para estado_vital, edad y ubicación
    this.version(3).stores({
      children:
        "id, sync_status, status, estado_vital, created_at, edad_anios, estado, ciudad, estado_resguardo",
    });
  }
}

export const localDb = new NinosDB();
