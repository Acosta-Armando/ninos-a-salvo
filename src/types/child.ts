export type SyncStatus = "pending" | "synced";
export type ChildStatus = "Buscando" | "Reencontrado";
export type EstadoVital = "ConVida" | "Fallecido";
export type CloseStatus = "none" | "pending" | "synced";

export interface LocalChild {
  id: string;
  fullname?: string;
  edad_estimada: string;
  edad_anios: number;
  nombre_padre?: string;
  nombre_madre?: string;
  nombre_familiar_buscado?: string;
  rasgos_particulares?: string;
  estado: string;
  ciudad: string;
  estado_resguardo: string;
  detalles_ubicacion: string;
  informante_nombre: string;
  informante_telefono: string;
  sync_status: SyncStatus;
  status: ChildStatus;
  estado_vital: EstadoVital;
  created_at: Date;
  updated_at?: Date;
  /** Token para cerrar el registro desde este dispositivo. */
  manage_token?: string;
  close_status?: CloseStatus;
  retiro_cedula?: string;
  retiro_fullname?: string;
  retiro_parentesco?: string;
  retiro_telefono?: string;
}

export interface ChildPayload {
  id: string;
  fullname?: string | null;
  edad_estimada: string;
  edad_anios: number;
  nombre_padre?: string | null;
  nombre_madre?: string | null;
  nombre_familiar_buscado?: string | null;
  rasgos_particulares?: string | null;
  estado: string;
  ciudad: string;
  estado_resguardo: string;
  detalles_ubicacion: string;
  informante_nombre: string;
  informante_telefono: string;
  status: ChildStatus;
  estado_vital: EstadoVital;
  created_at: string;
  /** Solo en la primera sincronización desde el dispositivo creador. */
  manage_token?: string;
  retiro_cedula?: string | null;
  retiro_fullname?: string | null;
  retiro_parentesco?: string | null;
  retiro_telefono?: string | null;
  retiro_foto_cedula_url?: string | null;
  retiro_foto_persona_url?: string | null;
  retiro_foto_parentesco_url?: string | null;
}

export interface RetiroPayload {
  retiro_cedula: string;
  retiro_fullname: string;
  retiro_parentesco: string;
  retiro_telefono: string;
  retiro_foto_cedula_url: string;
  retiro_foto_persona_url: string;
  retiro_foto_parentesco_url: string;
}
