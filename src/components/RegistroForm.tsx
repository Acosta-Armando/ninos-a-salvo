"use client";
import { Camera, Heart, ImagePlus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { EstadoCiudadSelect } from "@/components/EstadoCiudadSelect";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { localDb } from "@/lib/db";
import { getDisplayName } from "@/lib/displayName";
import { compressImage } from "@/lib/imageCompress";
import { triggerSync } from "@/lib/sync";
import { EDAD_RANGOS_REGISTRO } from "@/lib/tablero";
import type { EstadoVital, LocalChild } from "@/lib/types";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function RegistroForm() {
  const router = useRouter();
  const online = useOnlineStatus();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [datosDesconocidos, setDatosDesconocidos] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fotoBlob, setFotoBlob] = useState<Blob | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [generatedId, setGeneratedId] = useState<string | null>(null);

  const [estadoVital, setEstadoVital] = useState<EstadoVital>("ConVida");
  const esFallecido = estadoVital === "Fallecido";
  const [edadRango, setEdadRango] = useState<string>("");

  const [form, setForm] = useState({
    fullname: "",
    nombre_padre: "",
    nombre_madre: "",
    nombre_familiar_buscado: "",
    rasgos_particulares: "",
    estado: "",
    ciudad: "",
    estado_resguardo: "",
    detalles_ubicacion: "",
    informante_nombre: "",
    informante_telefono: "",
  });

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhoto = useCallback(async (file: File | undefined) => {
    if (!file || esFallecido) return;
    try {
      const compressed = await compressImage(file);
      setFotoBlob(compressed);
      setPreviewUrl(URL.createObjectURL(compressed));
      setError(null);
    } catch {
      setError("No se pudo procesar la foto. Intenta de nuevo.");
    }
  }, [esFallecido]);

  useEffect(() => {
    if (!esFallecido) return;
    setFotoBlob(null);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }, [esFallecido]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      if (!esFallecido && !fotoBlob) {
        throw new Error("Debes agregar una foto del niño");
      }

      if (!form.rasgos_particulares.trim()) {
        throw new Error(
          esFallecido
            ? "Describe los rasgos que puedas observar para ayudar a la identificación"
            : "Describe los rasgos particulares del niño (ropa, altura, etc.)",
        );
      }

      if (!datosDesconocidos && !form.fullname.trim()) {
        throw new Error(
          esFallecido
            ? "Ingresa el nombre del niño o indica que no se conocen sus datos"
            : "Ingresa el nombre del niño o marca datos desconocidos",
        );
      }

      if (!form.estado || !form.ciudad) {
        throw new Error("Selecciona estado y municipio de ubicación");
      }

      if (!edadRango) {
        throw new Error("Selecciona la edad estimada del niño");
      }

      const edadOpt = EDAD_RANGOS_REGISTRO.find((r) => r.value === edadRango);
      if (!edadOpt) {
        throw new Error("Edad estimada no válida");
      }

      const id = crypto.randomUUID();

      let foto_data: ArrayBuffer | undefined;
      let foto_mime: string | undefined;
      if (!esFallecido && fotoBlob) {
        foto_data = await fotoBlob.arrayBuffer();
        foto_mime = fotoBlob.type || "image/jpeg";
      }

      const record: LocalChild = {
        id,
        fullname: datosDesconocidos ? undefined : form.fullname.trim(),
        edad_estimada: edadOpt.label,
        edad_anios: edadOpt.anios,
        nombre_padre: form.nombre_padre.trim() || undefined,
        nombre_madre: form.nombre_madre.trim() || undefined,
        nombre_familiar_buscado:
          form.nombre_familiar_buscado.trim() || undefined,
        rasgos_particulares: form.rasgos_particulares.trim(),
        estado: form.estado,
        ciudad: form.ciudad,
        estado_resguardo: form.estado_resguardo.trim(),
        detalles_ubicacion: form.detalles_ubicacion.trim(),
        foto_data,
        foto_mime,
        informante_nombre: form.informante_nombre.trim(),
        informante_telefono: form.informante_telefono.trim(),
        sync_status: "pending",
        status: "Buscando",
        estado_vital: estadoVital,
        created_at: new Date(),
      };

      await localDb.children.add(record);
      setGeneratedId(id);
      setSuccess(true);

      if (online) {
        queueMicrotask(() => {
          void triggerSync();
        });
      }

      const destino = online
        ? estadoVital === "Fallecido"
          ? "/fallecidos"
          : "/tablero"
        : "/";
      setTimeout(() => router.push(destino), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrar");
    } finally {
      setSaving(false);
    }
  };

  const visualId =
    generatedId && datosDesconocidos
      ? getDisplayName(null, generatedId)
      : null;

  if (success) {
    return (
      <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/40">
        <CardHeader className="text-center">
          <CardTitle className="text-green-800 dark:text-green-200">
            Registro guardado localmente
          </CardTitle>
          {visualId && (
            <CardDescription className="text-green-700 dark:text-green-300">
              {visualId}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="text-center text-sm text-green-600 dark:text-green-400">
          {online
            ? "Guardado en este dispositivo. La foto y los datos se están sincronizando con el servidor."
            : "Sin conexión. El registro y la foto quedaron guardados en este dispositivo y se subirán al recuperar internet."}
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="pt-4 text-sm text-destructive">
            {error}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Condición del niño</CardTitle>
          <CardDescription>
            Indica si el registro es para buscar reencuentro o para identificación
            familiar con dignidad.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={estadoVital}
            onValueChange={(v) => setEstadoVital(v as EstadoVital)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ConVida">Con vida — busca reencuentro</SelectItem>
              <SelectItem value="Fallecido">Fallecido — identificación familiar</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Foto del niño</CardTitle>
          <CardDescription>
            {esFallecido
              ? "En este tipo de registro no se solicitan imágenes."
              : "Usa la cámara o sube una imagen desde tu galería."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {esFallecido ? (
            <div className="flex gap-3 rounded-lg border border-amber-200/80 bg-amber-50/80 p-4 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
              <Heart className="mt-0.5 size-5 shrink-0 text-amber-700 dark:text-amber-300" />
              <p>
                Con cariño te pedimos que no subas fotografías de niños que hayan
                fallecido. Las imágenes pueden ser muy dolorosas para sus familias.
                Con los datos que completes aquí —nombre, edad, rasgos y lugar— será
                suficiente para ayudar a identificarlo con respeto y delicadeza.
              </p>
            </div>
          ) : (
            <>
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => void handlePhoto(e.target.files?.[0])}
              />
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => void handlePhoto(e.target.files?.[0])}
              />

              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="Vista previa"
                  className="aspect-[4/3] w-full rounded-lg border object-cover"
                />
              ) : (
                <div className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/40 text-muted-foreground">
                  <ImagePlus className="size-10 opacity-50" />
                  <p className="text-sm">Aún no hay foto seleccionada</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2"
                  onClick={() => cameraInputRef.current?.click()}
                >
                  <Camera className="size-4" />
                  Cámara
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2"
                  onClick={() => galleryInputRef.current?.click()}
                >
                  <ImagePlus className="size-4" />
                  Galería
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Datos del niño</CardTitle>
          <CardDescription>
            Información para identificar al niño o niña.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {esFallecido ? (
            <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
              <p className="text-sm font-medium">¿Se conocen los datos del niño?</p>
              <div className="flex items-start gap-3">
                <Checkbox
                  id="desconocidos"
                  checked={datosDesconocidos}
                  onCheckedChange={(v) => setDatosDesconocidos(v === true)}
                />
                <div className="space-y-1">
                  <Label htmlFor="desconocidos" className="cursor-pointer">
                    No se conocen sus datos
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Si no tienes nombre ni otros datos, marca esta opción. Se
                    generará un ID para la identificación familiar.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-4">
              <Checkbox
                id="desconocidos"
                checked={datosDesconocidos}
                onCheckedChange={(v) => setDatosDesconocidos(v === true)}
              />
              <div className="space-y-1">
                <Label htmlFor="desconocidos" className="cursor-pointer">
                  El niño no puede hablar / datos desconocidos
                </Label>
                <p className="text-sm text-muted-foreground">
                  Se generará un ID temporal en lugar del nombre.
                </p>
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Nombre del niño" required={!datosDesconocidos}>
              <Input
                value={form.fullname}
                onChange={(e) => updateField("fullname", e.target.value)}
                disabled={datosDesconocidos}
                required={!datosDesconocidos}
                placeholder={
                  datosDesconocidos ? "Se generará automáticamente" : ""
                }
              />
            </FormField>
            <FormField label="Edad estimada" required>
              <Select value={edadRango || undefined} onValueChange={setEdadRango} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar rango de edad" />
                </SelectTrigger>
                <SelectContent>
                  {EDAD_RANGOS_REGISTRO.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <FormField label="Rasgos particulares" required>
            <Textarea
              value={form.rasgos_particulares}
              onChange={(e) =>
                updateField("rasgos_particulares", e.target.value)
              }
              required
              placeholder={
                esFallecido
                  ? "Ropa, contexto del hallazgo, señas visibles que ayuden a la familia..."
                  : "Ropa, altura, color de ojos, señas particulares..."
              }
              rows={3}
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Nombre del padre">
              <Input
                value={form.nombre_padre}
                onChange={(e) => updateField("nombre_padre", e.target.value)}
              />
            </FormField>
            <FormField label="Nombre de la madre">
              <Input
                value={form.nombre_madre}
                onChange={(e) => updateField("nombre_madre", e.target.value)}
              />
            </FormField>
          </div>

          <FormField label="Familiar que busca">
            <Input
              value={form.nombre_familiar_buscado}
              onChange={(e) =>
                updateField("nombre_familiar_buscado", e.target.value)
              }
            />
          </FormField>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ubicación y resguardo</CardTitle>
          <CardDescription>
            Dónde está el niño y cómo llegar al punto de resguardo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <EstadoCiudadSelect
            estado={form.estado}
            ciudad={form.ciudad}
            onEstadoChange={(v) => updateField("estado", v)}
            onCiudadChange={(v) => updateField("ciudad", v)}
            required
            estadoLabel="Estado"
            ciudadLabel="Municipio"
          />

          <FormField label="Nombre del punto de resguardo" required>
            <Input
              value={form.estado_resguardo}
              onChange={(e) => updateField("estado_resguardo", e.target.value)}
              required
              placeholder="Ej: Albergue San José, Escuela Bolívar"
            />
          </FormField>

          <FormField label="Descripción del sitio" required>
            <Textarea
              value={form.detalles_ubicacion}
              onChange={(e) =>
                updateField("detalles_ubicacion", e.target.value)
              }
              required
              placeholder="Piso, sala, referencia visible: carpas azules, entrada norte..."
              rows={3}
            />
          </FormField>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Tu nombre (informante)" required>
              <Input
                value={form.informante_nombre}
                onChange={(e) =>
                  updateField("informante_nombre", e.target.value)
                }
                required
              />
            </FormField>
            <FormField label="Tu teléfono" required>
              <Input
                type="tel"
                value={form.informante_telefono}
                onChange={(e) =>
                  updateField("informante_telefono", e.target.value)
                }
                required
              />
            </FormField>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" size="lg" className="w-full" disabled={saving}>
        {saving ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Guardando...
          </>
        ) : (
          "Registrar niño"
        )}
      </Button>
    </form>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required ? " *" : ""}
      </Label>
      {children}
    </div>
  );
}
