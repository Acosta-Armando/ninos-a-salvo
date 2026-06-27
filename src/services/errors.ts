/**
 * Errores de dominio del módulo de niños.
 * Las rutas API los traducen a códigos HTTP.
 */
export class ChildNotFoundError extends Error {
  constructor(id?: string) {
    super(id ? `Niño no encontrado: ${id}` : "Niño no encontrado");
    this.name = "ChildNotFoundError";
  }
}

export class ChildAlreadyDeliveredError extends Error {
  constructor() {
    super("Este niño ya fue entregado");
    this.name = "ChildAlreadyDeliveredError";
  }
}

export class InvalidChildPayloadError extends Error {
  constructor(message = "Campos obligatorios incompletos") {
    super(message);
    this.name = "InvalidChildPayloadError";
  }
}

export class InvalidRetiroPayloadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidRetiroPayloadError";
  }
}
