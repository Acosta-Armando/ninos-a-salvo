export interface ChildStatusSnapshot {
  id: string;
  status: "Buscando" | "Reencontrado";
  estado_vital: "ConVida" | "Fallecido";
}

export interface ReencontradoPayload {
  manage_token: string;
}
