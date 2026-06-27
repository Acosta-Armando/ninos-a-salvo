import Link from 'next/link'
import { Heart, MapPin, Phone, Search, Shield, Users, WifiOff } from 'lucide-react'
import { AppHeader } from '@/components/AppHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata = {
  title: 'Niños a Salvo — Reencuentro familiar',
  description: 'Plataforma humanitaria para el reencuentro de niños tras emergencias en Venezuela'
}

export default function HomePage() {
  return (
    <div className='min-h-full bg-background'>
      <AppHeader />

      <main className='mx-auto max-w-3xl space-y-10 px-4 py-10'>
        <section className='space-y-4 text-center'>
          <div className='mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary'>
            <Heart className='size-8' />
          </div>
          <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>Reencuentro familiar tras la emergencia</h2>
          <p className='text-lg text-muted-foreground'>
            Niños a Salvo conecta a familias con niños en puntos de resguardo después del doblete sísmico en Venezuela.
            Sin registro previo, sin contraseñas: solo ayuda rápida cuando más importa.
          </p>
          <div className='flex flex-col gap-3 pt-2 sm:flex-row sm:justify-center'>
            <Button asChild size='lg'>
              <Link href='/tablero'>Ver tablero de niños</Link>
            </Button>
            <Button asChild size='lg' variant='outline'>
              <Link href='/registro'>Registrar un niño</Link>
            </Button>
          </div>
        </section>

        <section className='grid gap-4 sm:grid-cols-2'>
          <Card>
            <CardHeader>
              <Search className='mb-1 size-5 text-primary' />
              <CardTitle className='text-base'>Buscar a un familiar</CardTitle>
            </CardHeader>
            <CardContent className='text-sm text-muted-foreground'>
              Explora el tablero por ubicación, edad estimada o nombre (la búsqueda es privada; en público solo se
              muestra la foto y el lugar de resguardo). Llama al teléfono del informante en cada ficha.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <WifiOff className='mb-1 size-5 text-primary' />
              <CardTitle className='text-base'>Funciona sin internet</CardTitle>
            </CardHeader>
            <CardContent className='text-sm text-muted-foreground'>
              Los rescatistas pueden registrar niños en campo aunque no haya señal. Los datos se guardan en el
              dispositivo y se sincronizan solos al recuperar conexión.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Shield className='mb-1 size-5 text-primary' />
              <CardTitle className='text-base'>Retiro seguro</CardTitle>
            </CardHeader>
            <CardContent className='text-sm text-muted-foreground'>
              La entrega de un niño exige cédula, parentesco comprobado y foto de quien retira. Una vez entregado, el
              registro queda bloqueado para evitar secuestros.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Users className='mb-1 size-5 text-primary' />
              <CardTitle className='text-base'>Niños sin identificar</CardTitle>
            </CardHeader>
            <CardContent className='text-sm text-muted-foreground'>
              Si el niño no puede hablar, se genera un código temporal y se describen rasgos visibles. El nombre se
              guarda de forma interna pero no se publica en el tablero.
            </CardContent>
          </Card>
        </section>

        <section className='space-y-4'>
          <h3 className='text-xl font-semibold'>¿Cómo usar la plataforma?</h3>
          <ol className='list-decimal space-y-3 pl-5 text-muted-foreground'>
            <li>
              <strong className='text-foreground'>Si tienes un niño en resguardo:</strong> entra a{' '}
              <Link href='/registro' className='text-primary hover:underline'>
                Registrar
              </Link>
              , sube su foto, indica ubicación (estado, municipio y descripción del sitio) y deja tu teléfono para que
              las familias te contacten.
            </li>
            <li>
              <strong className='text-foreground'>Si buscas a un familiar:</strong> revisa el{' '}
              <Link href='/tablero' className='text-primary hover:underline'>
                tablero
              </Link>{' '}
              y filtra por zona o edad. Toca una tarjeta para ver detalles y el número de contacto.
            </li>
            <li>
              <strong className='text-foreground'>Si localizas a un niño fallecido:</strong> regístralo marcando la
              condición correspondiente. Aparecerá en la{' '}
              <Link href='/fallecidos' className='text-primary hover:underline'>
                lista de fallecidos
              </Link>{' '}
              para que su familia pueda identificarlo con dignidad.
            </li>
          </ol>
        </section>

        <section className='rounded-xl border bg-muted/40 p-6'>
          <div className='flex gap-3'>
            <MapPin className='mt-0.5 size-5 shrink-0 text-primary' />
            <div>
              <p className='font-medium'>Ubicación clara, sin coordenadas GPS</p>
              <p className='mt-1 text-sm text-muted-foreground'>
                Usamos estado, municipio y una descripción del sitio (albergue, escuela, carpa) para que cualquier
                persona pueda llegar sin mapas complicados.
              </p>
            </div>
          </div>
          <div className='mt-4 flex gap-3'>
            <Phone className='mt-0.5 size-5 shrink-0 text-primary' />
            <div>
              <p className='font-medium'>Contacto directo</p>
              <p className='mt-1 text-sm text-muted-foreground'>
                Cada registro muestra el teléfono de quien tiene al niño en resguardo. Llama para pedir información o
                coordinar el reencuentro.
              </p>
            </div>
          </div>
        </section>

        <div className='flex flex-col gap-3 pb-8 sm:flex-row'>
          <Button asChild className='flex-1' size='lg'>
            <Link href='/tablero'>Ir al tablero</Link>
          </Button>
          <Button asChild className='flex-1' size='lg' variant='secondary'>
            <Link href='/fallecidos'>Ver fallecidos</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
