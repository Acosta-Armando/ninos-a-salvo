import { z } from "zod";
import { parseEdadRegistro } from "@/lib/edad";

/** Letras (incl. acentos), espacios, apóstrofo y guión; sin dígitos. */
export const NAME_PATTERN = /^[\p{L}\s'.-]+$/u;

export function stripNameInput(value: string): string {
  return value.replace(/\d/g, "");
}

export function stripDigitsInput(value: string): string {
  return value.replace(/\D/g, "");
}

const optionalPersonName = z
  .string()
  .transform((v) => v.trim())
  .refine((v) => v === "" || !/\d/.test(v), "No uses números en el nombre")
  .refine(
    (v) => v === "" || NAME_PATTERN.test(v),
    "Solo letras, espacios y guiones",
  );

const requiredPersonName = z
  .string()
  .trim()
  .min(1, "Ingresa el nombre")
  .refine((v) => !/\d/.test(v), "No uses números en el nombre")
  .refine(
    (v) => NAME_PATTERN.test(v),
    "Solo letras, espacios y guiones",
  );

const phoneField = z
  .string()
  .trim()
  .min(1, "Ingresa un teléfono")
  .refine((v) => {
    const digits = v.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 11;
  }, "Usa un teléfono venezolano válido (10 u 11 dígitos)");

export const registroFormSchema = z
  .object({
    estadoVital: z.enum(["ConVida", "Fallecido"]),
    datosDesconocidos: z.boolean(),
    fullname: z.string(),
    edadInput: z.string(),
    nombre_padre: optionalPersonName,
    nombre_madre: optionalPersonName,
    nombre_familiar_buscado: optionalPersonName,
    rasgos_particulares: z
      .string()
      .trim()
      .min(1, "Describe los rasgos visibles"),
    estado: z.string().min(1, "Selecciona el estado"),
    ciudad: z.string().min(1, "Selecciona el municipio"),
    estado_resguardo: z
      .string()
      .trim()
      .min(1, "Indica el punto de resguardo"),
    detalles_ubicacion: z
      .string()
      .trim()
      .min(1, "Describe cómo llegar al sitio"),
    informante_nombre: requiredPersonName,
    informante_telefono: phoneField,
  })
  .superRefine((data, ctx) => {
    if (!data.datosDesconocidos) {
      const name = data.fullname.trim();
      if (!name) {
        ctx.addIssue({
          code: "custom",
          path: ["fullname"],
          message:
            data.estadoVital === "Fallecido"
              ? "Ingresa el nombre o marca que no se conocen los datos"
              : "Ingresa el nombre o marca datos desconocidos",
        });
      } else if (/\d/.test(name)) {
        ctx.addIssue({
          code: "custom",
          path: ["fullname"],
          message: "No uses números en el nombre",
        });
      } else if (!NAME_PATTERN.test(name)) {
        ctx.addIssue({
          code: "custom",
          path: ["fullname"],
          message: "Solo letras, espacios y guiones",
        });
      }
    }

    const edadRaw = data.edadInput.trim();
    if (!edadRaw) {
      ctx.addIssue({
        code: "custom",
        path: ["edadInput"],
        message: "Ingresa la edad estimada",
      });
      return;
    }

    const edad = parseEdadRegistro(edadRaw);
    if (!edad.ok) {
      ctx.addIssue({
        code: "custom",
        path: ["edadInput"],
        message: edad.message,
      });
    }
  });

export type RegistroFormValues = z.infer<typeof registroFormSchema>;

export type RegistroFormInput = z.input<typeof registroFormSchema>;
