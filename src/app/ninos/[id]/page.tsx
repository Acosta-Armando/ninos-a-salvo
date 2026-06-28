import Image from "next/image";
import { Phone, Shield } from "lucide-react";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { EntregaSeguraNotice } from "@/components/shared/EntregaSeguraNotice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatEdadEstimada } from "@/lib/edad";
import { resolveImageSrc } from "@/lib/storageUrl";
import { getPublicChildById } from "@/services";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata() {
  return { title: "Ficha — Niños a Salvo" };
}

export default async function NinoDetailPage({ params }: PageProps) {
  const { id } = await params;

  const child = await getPublicChildById(id);
  if (!child) notFound();

  const isReencontrado = child.status === "Reencontrado";
  const esFallecido = child.estado_vital === "Fallecido";
  const backHref = esFallecido ? "/fallecidos" : "/tablero";

  return (
    <div className="min-h-full bg-background">
      <AppHeader
        title="Ficha pública"
        subtitle={esFallecido ? "Registro de identificación" : "En punto de resguardo"}
        backHref={backHref}
        backLabel={esFallecido ? "← Fallecidos" : "← Tablero"}
      />

      <main className="mx-auto max-w-2xl space-y-6 px-4 py-6">
        {isReencontrado ? (
          <Card className="border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950/40">
            <CardHeader>
              <CardTitle className="text-green-800 dark:text-green-200">
                Reencuentro familiar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <dl className="space-y-2 rounded-lg border bg-card p-4">
                <div>
                  <dt className="text-muted-foreground">Retirado por</dt>
                  <dd className="text-lg font-semibold">
                    {child.retiro_fullname}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Cédula</dt>
                  <dd>{child.retiro_cedula}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Parentesco</dt>
                  <dd>{child.retiro_parentesco}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Teléfono</dt>
                  <dd>
                    <a
                      href={`tel:${child.retiro_telefono}`}
                      className="text-primary hover:underline"
                    >
                      {child.retiro_telefono}
                    </a>
                  </dd>
                </div>
              </dl>
              {(child.retiro_foto_cedula_url ||
                child.retiro_foto_persona_url ||
                child.retiro_foto_parentesco_url) && (
                <div className="grid gap-3 sm:grid-cols-3">
                  {child.retiro_foto_cedula_url ? (
                    <div>
                      <p className="mb-1 text-xs text-muted-foreground">Cédula</p>
                      <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
                        <Image
                          src={resolveImageSrc(child.retiro_foto_cedula_url)}
                          alt="Cédula de quien retira"
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                    </div>
                  ) : null}
                  {child.retiro_foto_persona_url ? (
                    <div>
                      <p className="mb-1 text-xs text-muted-foreground">Persona</p>
                      <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
                        <Image
                          src={resolveImageSrc(child.retiro_foto_persona_url)}
                          alt="Persona que retira"
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                    </div>
                  ) : null}
                  {child.retiro_foto_parentesco_url ? (
                    <div>
                      <p className="mb-1 text-xs text-muted-foreground">Parentesco</p>
                      <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
                        <Image
                          src={resolveImageSrc(child.retiro_foto_parentesco_url)}
                          alt="Documento de parentesco"
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </CardContent>
          </Card>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>Descripción</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-lg font-semibold">
              {formatEdadEstimada(child.edad_estimada, child.edad_anios)}
            </p>
            {child.rasgos_particulares ? (
              <p className="text-sm leading-relaxed">
                <span className="font-medium">Rasgos: </span>
                {child.rasgos_particulares}
              </p>
            ) : null}
            <div className="flex gap-2 rounded-lg border border-amber-200/80 bg-amber-50/80 p-3 text-xs leading-relaxed text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
              <Shield className="mt-0.5 size-4 shrink-0" aria-hidden />
              <p>
                Por protección de niños, niñas y adolescentes (LOPNNA), no publicamos fotografías en
                internet. Para verificar identidad, llama o acude al punto de
                resguardo.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ubicación de resguardo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Estado y municipio</p>
              <p className="text-lg font-semibold text-primary">
                {child.ciudad}, {child.estado}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Punto de resguardo</p>
              <p className="font-medium">{child.estado_resguardo}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Descripción del sitio
              </p>
              <p>{child.detalles_ubicacion}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base">Solicitar información</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Persona que registró o tiene al niño, niña o adolescente en resguardo:
            </p>
            <p className="font-medium">{child.informante_nombre}</p>
            <Button asChild size="lg" className="w-full gap-2">
              <a href={`tel:${child.informante_telefono}`}>
                <Phone className="size-4" />
                Llamar {child.informante_telefono}
              </a>
            </Button>
            {!esFallecido && !isReencontrado ? (
              <p className="border-t py-3 text-xs leading-relaxed text-muted-foreground">
                Este contacto sirve para ubicar al niño, niña o adolescente y coordinar un posible
                reencuentro. No solicites ni autorices la entrega sin
                verificar familiar directo y sin el respaldo de una organización
                u órgano público.
              </p>
            ) : null}
          </CardContent>
        </Card>

        {!esFallecido && !isReencontrado ? <EntregaSeguraNotice /> : null}
      </main>
    </div>
  );
}
