import type { ComponentType, ReactNode } from "react";
import Link from "next/link";
import {
  BookOpen,
  CameraOff,
  CloudUpload,
  List,
  ListChecks,
  Search,
  Shield,
  Smartphone,
  UserPlus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const sections = [
  { id: "que-es", label: "Qué es esta plataforma" },
  { id: "sin-conexion", label: "Sin conexión e instalación" },
  { id: "registrar", label: "Cómo registrar" },
  { id: "sincronizar", label: "Sincronización de datos" },
  { id: "tablero", label: "Buscar en el tablero" },
  { id: "fallecidos", label: "Registros de fallecidos" },
  { id: "sin-fotos", label: "Por qué no hay fotografías" },
  { id: "entrega-segura", label: "Por qué no se entregan por la app" },
  { id: "mis-registros", label: "Mis registros en este dispositivo" },
  { id: "privacidad", label: "Privacidad de los nombres" },
] as const;

function HelpSection({
  id,
  icon: Icon,
  title,
  children,
}: {
  id: string;
  icon: ComponentType<{ className?: string }>;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-4" aria-hidden />
            </div>
            <CardTitle className="text-lg leading-snug">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          {children}
        </CardContent>
      </Card>
    </section>
  );
}

export function AyudaContent() {
  return (
    <div className="space-y-8">
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex gap-3 pt-6 text-sm leading-relaxed">
          <BookOpen className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
          <p>
            Esta guía explica cómo usar <strong className="text-foreground">Niños a Salvo</strong>{" "}
            en puntos de resguardo y cómo buscar a un familiar. Puedes leerla sin
            conexión una vez que la hayas abierto con internet o con la app
            instalada.
          </p>
        </CardContent>
      </Card>

      <nav aria-label="Contenido de la guía">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <List className="size-4" aria-hidden />
              Contenido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal space-y-1.5 pl-5 text-sm">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-primary hover:underline"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </nav>

      <HelpSection id="que-es" icon={BookOpen} title="Qué es esta plataforma">
        <p>
          Niños a Salvo es una herramienta humanitaria para el{" "}
          <strong className="text-foreground">reencuentro familiar</strong> de
          niños, niñas y adolescentes tras emergencias en Venezuela.
        </p>
        <p>
          No requiere cuenta ni contraseña. Los rescatistas y personas en
          resguardo pueden <strong className="text-foreground">registrar</strong>{" "}
          a quien tengan a su cuidado; las familias pueden{" "}
          <strong className="text-foreground">buscar</strong> en el tablero por
          zona, edad o nombre (la búsqueda es privada y no muestra nombres en
          público).
        </p>
      </HelpSection>

      <HelpSection id="sin-conexion" icon={Smartphone} title="Sin conexión e instalación">
        <p>
          Para <strong className="text-foreground">registrar sin internet</strong>{" "}
          debes instalar la app en tu celular o tablet desde la pantalla de
          inicio. En el navegador, sin instalar, el registro offline puede no
          funcionar de forma fiable.
        </p>
        <p>
          Con la app instalada puedes hacer registros en campo aunque no haya
          señal. Los datos quedan guardados en tu dispositivo y, al volver a
          tener conexión, se suben automáticamente al servidor.
        </p>
        <p>
          Sin conexión también puedes consultar esta guía y la página de inicio.
          El tablero, la lista de fallecidos y las fichas públicas{" "}
          <strong className="text-foreground">requieren internet</strong>.
        </p>
      </HelpSection>

      <HelpSection id="registrar" icon={UserPlus} title="Cómo registrar">
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Entra a{" "}
            <Link href="/registro" className="text-primary hover:underline">
              Registrar
            </Link>
            .
          </li>
          <li>
            Elige la <strong className="text-foreground">condición</strong>:
            con vida (busca reencuentro) o fallecido (identificación familiar).
          </li>
          <li>
            Indica edad en años (usa <strong className="text-foreground">0</strong>{" "}
            si tiene menos de un año), rasgos visibles, nombres si se conocen y
            datos de familiares buscados.
          </li>
          <li>
            Si no se conocen los datos, marca la opción correspondiente: se
            generará un código temporal para la identificación.
          </li>
          <li>
            Completa ubicación: estado, municipio, nombre del punto de resguardo
            y una descripción clara de cómo llegar (sin GPS).
          </li>
          <li>
            Deja tu nombre y teléfono como informante para que las familias
            puedan contactarte.
          </li>
        </ol>
        <p>
          No se piden fotografías de menores. La identificación en público se
          hace con rasgos, edad y contacto al resguardo.
        </p>
      </HelpSection>

      <HelpSection id="sincronizar" icon={CloudUpload} title="Sincronización de datos">
        <p>
          Cada registro se guarda primero en tu dispositivo. Si no hay internet
          en ese momento, verás una confirmación local y el registro quedará
          pendiente de subir.
        </p>
        <p>
          Al recuperar la señal, la app envía los registros pendientes al
          servidor de forma automática. Una barra superior te avisará si aún
          hay registros sin sincronizar.
        </p>
        <p>
          Hasta que se sincronicen, no aparecerán en el tablero para las
          familias. Por eso conviene conectarte cuando sea posible.
        </p>
      </HelpSection>

      <HelpSection id="tablero" icon={Search} title="Buscar en el tablero">
        <p>
          El tablero muestra a niños, niñas y adolescentes{" "}
          <strong className="text-foreground">con vida</strong> que están en
          búsqueda de su familia. Necesitas conexión a internet para verlo.
        </p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Filtra por estado, municipio, rango de edad o nombre.</li>
          <li>
            En las tarjetas verás edad, rasgos, ubicación del resguardo y
            teléfono del informante — nunca el nombre del menor ni de sus
            familiares.
          </li>
          <li>
            Toca una tarjeta para abrir la ficha pública con más detalle y el
            botón para llamar.
          </li>
        </ol>
        <p>
          Si reconoces a alguien, llama al número de contacto o acude al punto
          de resguardo para verificar con calma antes de cualquier reencuentro.
        </p>
      </HelpSection>

      <HelpSection id="fallecidos" icon={BookOpen} title="Registros de fallecidos">
        <p>
          Si localizas a un niño, niña o adolescente fallecido, regístralo
          marcando la condición <strong className="text-foreground">Fallecido</strong>.
          Aparecerá en la lista de fallecidos para que su familia pueda
          identificarlo con dignidad.
        </p>
        <p>
          Tampoco se publican fotografías. Se usan rasgos, edad y ubicación
          donde se encuentra el cuerpo o el registro.
        </p>
      </HelpSection>

      <HelpSection id="sin-fotos" icon={CameraOff} title="Por qué no hay fotografías">
        <p>
          Por la <strong className="text-foreground">LOPNNA</strong> (Ley
          Orgánica para la Protección de Niños, Niñas y Adolescentes) y por
          buenas prácticas de protección en emergencias,{" "}
          <strong className="text-foreground">no se suben ni publican fotos</strong>{" "}
          de menores en esta plataforma.
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Evita que imágenes de menores circulen en internet sin control.</li>
          <li>Reduce riesgos de explotación, suplantación o uso indebido.</li>
          <li>
            La identificación se hace con descripción detallada de rasgos,
            edad, ropa y señas visibles, más el contacto directo al resguardo.
          </li>
        </ul>
        <p>
          Las familias pueden llamar o acudir al punto indicado para confirmar
          si se trata de su familiar.
        </p>
      </HelpSection>

      <HelpSection id="entrega-segura" icon={Shield} title="Por qué no se entregan por la app">
        <p>
          Esta plataforma <strong className="text-foreground">no coordina entregas</strong>{" "}
          de menores a través de un botón ni entrega automática a quien los
          busca. Eso sería peligroso: podría facilitar secuestros o entregas a
          personas sin parentesco real.
        </p>
        <p>
          El reencuentro debe hacerse con{" "}
          <strong className="text-foreground">verificación de identidad</strong>{" "}
          (documentos, parentesco) y, de ser posible, con el respaldo de una
          organización humanitaria o un órgano público — Defensa Civil,
          Protección Civil o autoridades locales.
        </p>
        <p>
          Por el bien del niño, niña o adolescente, no debe entregarse a nadie
          sin confirmar con calma que es familiar directo o tutor legítimo. La
          app sirve para <strong className="text-foreground">ubicar</strong> y{" "}
          <strong className="text-foreground">contactar</strong>, no para
          autorizar la entrega por sí sola.
        </p>
        <p>
          Cuando un menor ya no está en tu resguardo tras un reencuentro seguro,
          puedes quitar el aviso del tablero desde{" "}
          <Link href="/mis-registros" className="text-primary hover:underline">
            Mis registros
          </Link>{" "}
          (solo en el dispositivo donde registraste).
        </p>
      </HelpSection>

      <HelpSection
        id="mis-registros"
        icon={ListChecks}
        title="Mis registros en este dispositivo"
      >
        <p>
          Si registraste desde este celular o tablet, verás el enlace{" "}
          <strong className="text-foreground">Mis registros</strong> en el
          inicio. Ahí aparecen solo los avisos creados en este aparato.
        </p>
        <p>
          Para registros con vida aún en búsqueda, puedes usar{" "}
          <strong className="text-foreground">Ya no está en mi resguardo</strong>{" "}
          después de confirmar que el reencuentro fue seguro. Eso los saca del
          tablero público; no sustituye la verificación en persona ni el respaldo
          de una autoridad u organización.
        </p>
        <p>
          Si no hay internet al cerrar, el cambio queda guardado y se sube al
          recuperar señal.
        </p>
      </HelpSection>

      <HelpSection id="privacidad" icon={Shield} title="Privacidad de los nombres">
        <p>
          Los nombres del menor y de sus familiares se guardan de forma interna
          (cifrada) para facilitar la búsqueda, pero{" "}
          <strong className="text-foreground">nunca se muestran</strong> en las
          tarjetas del tablero ni en las fichas públicas.
        </p>
        <p>
          Quien busca puede escribir un nombre en el filtro; el sistema encuentra
          coincidencias sin revelar esos datos en pantalla. En público solo se
          ven rasgos, edad, ubicación y teléfono de contacto.
        </p>
      </HelpSection>
    </div>
  );
}
