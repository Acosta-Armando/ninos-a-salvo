import { config } from 'dotenv'
import { resolve } from 'node:path'
import { randomUUID } from 'node:crypto'

config({ path: resolve(process.cwd(), '.env.local') })
config({ path: resolve(process.cwd(), '.env') })

const EDADES = [
  { estimada: '6', anios: 0 },
  { estimada: '2', anios: 2 },
  { estimada: '4', anios: 4 },
  { estimada: '7', anios: 7 },
  { estimada: '9', anios: 9 },
  { estimada: '12', anios: 12 }
]
const RASGOS = [
  'Camiseta roja, pantalón azul, pelo corto oscuro',
  'Vestido amarillo, sandalias blancas, ojos cafés',
  'Sudadera gris con capucha, jeans rotos',
  'Pijama con dibujos de animales, descalzo',
  'Camisa a cuadros verde, gorra negra',
  'Blusa rosada, pelo largo trenzado',
  'Uniforme escolar blanco y azul',
  'Chaqueta naranja, botas de goma'
]
const RESGUARDOS = [
  'Albergue temporal Plaza Bolívar',
  'Escuela Básica Nacional',
  'Iglesia San Juan Bautista',
  'Gimnasio Municipal',
  'Centro de acopio Cruz Roja',
  'Hospital público — área pediátrica',
  'Cancha deportiva techada',
  'Campamento de carpas sector norte'
]
const DETALLES = [
  'Segunda planta, sala de espera junto a enfermería',
  'Aula 3B, entrada por puerta lateral',
  'Carpa azul #12, fila cercana al baño',
  'Fondo del gimnasio, sector familias con niños',
  'Patio central, mesa de registro voluntarios',
  'Pasillo este, habitación con cartel PEDIATRÍA',
  'Gradería sur, manta naranja en el piso',
  'Junto a cocina comunitaria, carpa con cruz roja'
]
const INFORMANTES = [
  { nombre: 'María González', tel: '04141234567' },
  { nombre: 'Carlos Pérez', tel: '04241234568' },
  { nombre: 'Ana Rodríguez', tel: '04161234569' },
  { nombre: 'Luis Herrera', tel: '04261234570' },
  { nombre: 'Carmen Díaz', tel: '04121234571' }
]

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

async function main() {
  const { pickRandomLocation } = await import('../src/data/venezuela')
  const { PrismaPg } = await import('@prisma/adapter-pg')
  const { PrismaClient } = await import('../generated/client')
  const { Pool } = await import('pg')

  const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('Falta DIRECT_URL o DATABASE_URL en .env.local')
  }

  const pool = new Pool({ connectionString })
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) })

  const count = 100
  console.log(`Insertando ${count} registros de prueba sin nombre...`)

  const data = Array.from({ length: count }, () => {
    const { estado, ciudad } = pickRandomLocation()
    const informante = randomFrom(INFORMANTES)

    return {
      id: randomUUID(),
      fullname: null,
      edad_estimada: randomFrom(EDADES).estimada,
      edad_anios: randomFrom(EDADES).anios,
      nombre_padre: Math.random() > 0.7 ? `Padre ref. ${Math.floor(Math.random() * 9000)}` : null,
      nombre_madre: Math.random() > 0.7 ? `Madre ref. ${Math.floor(Math.random() * 9000)}` : null,
      nombre_familiar_buscado: null,
      rasgos_particulares: randomFrom(RASGOS),
      estado,
      ciudad,
      estado_resguardo: randomFrom(RESGUARDOS),
      detalles_ubicacion: randomFrom(DETALLES),
      informante_nombre: informante.nombre,
      informante_telefono: informante.tel,
      status: 'Buscando' as const,
      estado_vital: 'ConVida' as const
    }
  })

  const result = await prisma.child.createMany({ data, skipDuplicates: true })
  console.log(`✓ ${result.count} registros creados`)

  await prisma.$disconnect()
  await pool.end()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
