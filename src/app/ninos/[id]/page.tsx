import Image from "next/image";
import { Phone } from "lucide-react";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { RetiroForm } from "@/components/RetiroForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPublicChildById } from "@/services";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata() {
  return { title: "Ficha del niño — Niños a Salvo" };
}

export default async function NinoDetailPage({ params }: PageProps) {
  const { id } = await params;

  const child = await getPublicChildById(id);
  if (!child) notFound();

  const isReencontrado = child.status === "Reencontrado";
  const esFallecido = child.estado_vital === "Fallecido";
  const fotoSrc = child.foto_url ?? "/favicon.ico";
  const backHref = esFallecido ? "/fallecidos" : "/tablero";

  return (
    <div className="min-h-full bg-background">
      <AppHeader
        title="Ficha del niño"
        subtitle={esFallecido ? "Registro de identificación" : "En punto de resguardo"}
        backHref={backHref}
        backLabel={esFallecido ? "← Fallecidos" : "← Tablero"}
      />

      <main className="mx-auto max-w-2xl space-y-6 px-4 py-6">
        {isReencontrado ? (
          <Card className="border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950/40">
            <CardHeader>
              <CardTitle className="text-green-800 dark:text-green-200">
                Niño entregado a su familia
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
                          src={child.retiro_foto_cedula_url}
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
                          src={child.retiro_foto_persona_url}
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
                          src={child.retiro_foto_parentesco_url}
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

        <Card className="overflow-hidden pt-0">
          <div className="relative aspect-[4/3] w-full bg-muted">
            <Image
              src={fotoSrc}
              alt="Niño en resguardo"
              fill
              sizes="(max-width: 768px) 100vw, 672px"
              className="object-cover"
              priority
            />
          </div>
          <CardContent className="space-y-3 pt-4">
            <p className="text-lg font-semibold">{child.edad_estimada}</p>
            {child.rasgos_particulares && (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Rasgos: </span>
                {child.rasgos_particulares}
              </p>
            )}
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
              Persona que registró o tiene al niño en resguardo:
            </p>
            <p className="font-medium">{child.informante_nombre}</p>
            <Button asChild size="lg" className="w-full gap-2">
              <a href={`tel:${child.informante_telefono}`}>
                <Phone className="size-4" />
                Llamar {child.informante_telefono}
              </a>
            </Button>
          </CardContent>
        </Card>

        {!isReencontrado && !esFallecido && (
          <Card>
            <CardHeader>
              <CardTitle>Registrar retiro</CardTitle>
            </CardHeader>
            <CardContent>
              <RetiroForm childId={child.id} />
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
