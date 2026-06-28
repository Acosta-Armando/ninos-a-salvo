/**
 * Errores de dominio del módulo de niños.
 * Las rutas API los traducen a códigos HTTP.
 */
export class ChildNotFoundError extends Error {
  constructor(id?: string) {
    super(id ? `Registro no encontrado: ${id}` : "Registro no encontrado");
    this.name = "ChildNotFoundError";
  }
}

export class ChildAlreadyDeliveredError extends Error {
  constructor() {
    super("Este registro ya fue entregado a su familia");
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
