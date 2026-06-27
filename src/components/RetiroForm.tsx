"use client";

import { Camera, ImagePlus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { RetiroPayload } from "@/lib/types";
import { uploadRetiroPhoto } from "@/lib/supabaseStorage";

interface RetiroFormProps {
  childId: string;
  onSuccess?: () => void;
}

function RetiroPhotoField({
  label,
  description,
  preview,
  onFile,
}: {
  label: string;
  description: string;
  preview: string | null;
  onFile: (file: File) => void;
}) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-2 rounded-lg border border-border p-3">
      <div>
        <Label>{label}</Label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {preview ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-md bg-muted">
          <Image
            src={preview}
            alt={label}
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleChange}
        />
        <input
          ref={galleryRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => cameraRef.current?.click()}
        >
          <Camera className="size-4" />
          Cámara
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => galleryRef.current?.click()}
        >
          <ImagePlus className="size-4" />
          Galería
        </Button>
      </div>
    </div>
  );
}

export function RetiroForm({ childId, onSuccess }: RetiroFormProps) {
  const router = useRouter();
  const [cedula, setCedula] = useState("");
  const [fullname, setFullname] = useState("");
  const [parentesco, setParentesco] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fotoCedula, setFotoCedula] = useState<File | null>(null);
  const [fotoPersona, setFotoPersona] = useState<File | null>(null);
  const [fotoParentesco, setFotoParentesco] = useState<File | null>(null);
  const [previewCedula, setPreviewCedula] = useState<string | null>(null);
  const [previewPersona, setPreviewPersona] = useState<string | null>(null);
  const [previewParentesco, setPreviewParentesco] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setPhoto = (
    file: File,
    setFile: (f: File) => void,
    setPreview: (url: string) => void,
  ) => {
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!cedula.trim() || !fullname.trim() || !parentesco.trim() || !telefono.trim()) {
      setError("Completa todos los datos de la persona que retira.");
      return;
    }
    if (!fotoCedula || !fotoPersona || !fotoParentesco) {
      setError("Debes adjuntar las tres fotos: cédula, persona y documento de parentesco.");
      return;
    }

    setLoading(true);
    try {
      const [cedulaUrl, personaUrl, parentescoUrl] = await Promise.all([
        uploadRetiroPhoto(childId, fotoCedula, "cedula"),
        uploadRetiroPhoto(childId, fotoPersona, "persona"),
        uploadRetiroPhoto(childId, fotoParentesco, "parentesco"),
      ]);

      const payload: RetiroPayload = {
        retiro_cedula: cedula.trim(),
        retiro_fullname: fullname.trim(),
        retiro_parentesco: parentesco.trim(),
        retiro_telefono: telefono.trim(),
        retiro_foto_cedula_url: cedulaUrl,
        retiro_foto_persona_url: personaUrl,
        retiro_foto_parentesco_url: parentescoUrl,
      };

      const res = await fetch(`/api/ninos/${childId}/retiro`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "No se pudo registrar el retiro.");
      }

      onSuccess?.();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrar retiro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Para retirar al niño se requiere identificación de quien retira y
        documento que acredite el parentesco.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="retiro-cedula">Cédula de quien retira</Label>
          <Input
            id="retiro-cedula"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            placeholder="V-12345678"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="retiro-telefono">Teléfono</Label>
          <Input
            id="retiro-telefono"
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="0414-0000000"
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="retiro-fullname">Nombre completo</Label>
        <Input
          id="retiro-fullname"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="retiro-parentesco">Parentesco con el niño</Label>
        <Input
          id="retiro-parentesco"
          value={parentesco}
          onChange={(e) => setParentesco(e.target.value)}
          placeholder="Madre, padre, tío/a..."
          required
        />
      </div>

      <RetiroPhotoField
        label="Foto de la cédula"
        description="Documento de identidad legible."
        preview={previewCedula}
        onFile={(f) => setPhoto(f, setFotoCedula, setPreviewCedula)}
      />
      <RetiroPhotoField
        label="Foto de la persona que retira"
        description="Rostro visible de quien realiza el retiro."
        preview={previewPersona}
        onFile={(f) => setPhoto(f, setFotoPersona, setPreviewPersona)}
      />
      <RetiroPhotoField
        label="Documento de parentesco"
        description="Acta de nacimiento, partida u otro documento que acredite el vínculo."
        preview={previewParentesco}
        onFile={(f) => setPhoto(f, setFotoParentesco, setPreviewParentesco)}
      />

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Registrando retiro…" : "Confirmar retiro"}
      </Button>
    </form>
  );
}
