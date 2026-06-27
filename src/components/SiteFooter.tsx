import Link from "next/link";
import { GitBranch, Mail, UserPlus } from "lucide-react";
import { PwaInstallBanner } from "@/components/PwaInstallBanner";
import { SITE } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t bg-muted/30">
      <div className="mx-auto max-w-6xl space-y-10 px-4 py-10">
        <PwaInstallBanner />

        {/* Colaborar */}
        <section className="grid gap-8 sm:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <UserPlus className="size-5" />
              <h2 className="text-lg font-semibold">¿Deseas colaborar?</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Este proyecto es humanitario y de código abierto. Puedes reportar
              errores, proponer mejoras, traducir contenido o ayudar con el
              despliegue en puntos de resguardo.
            </p>
            <a
              href={SITE.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <GitBranch className="size-4" />
              Ver repositorio en GitHub
            </a>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Contacto</h3>
            <p className="text-sm text-muted-foreground">
              ¿Tienes dudas técnicas, quieres coordinar un despliegue o
              colaborar directamente? Escríbeme:
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-muted-foreground">Desarrollador: </span>
                <span className="font-medium">{SITE.author}</span>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="inline-flex items-center gap-2 font-medium text-primary hover:underline"
                >
                  <Mail className="size-4" />
                  {SITE.email}
                </a>
              </li>
              <li>
                <a
                  href={SITE.githubProfileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-medium text-primary hover:underline"
                >
                  <GitBranch className="size-4" />
                  @{SITE.githubProfileUrl.split("/").pop()}
                </a>
              </li>
            </ul>
          </div>
        </section>

        <div className="border-t pt-6 text-center text-xs text-muted-foreground">
          <p>
            © {year} {SITE.name} — Proyecto humanitario para el reencuentro
            familiar en Venezuela.
          </p>
          <p className="mt-1">
            <Link href="/" className="hover:text-foreground hover:underline">
              Inicio
            </Link>
            {" · "}
            <Link href="/tablero" className="hover:text-foreground hover:underline">
              Tablero
            </Link>
            {" · "}
            <Link href="/registro" className="hover:text-foreground hover:underline">
              Registrar
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
