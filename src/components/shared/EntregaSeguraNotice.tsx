import { Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EntregaSeguraNoticeProps {
  className?: string
}

/**
 * Aviso humanitario: no entregar a NNA sin verificar parentesco ni sin respaldo institucional.
 */
export function EntregaSeguraNotice({ className }: EntregaSeguraNoticeProps) {
  return (
    <aside
      role='note'
      aria-label='Aviso sobre entrega segura de niños, niñas y adolescentes'
      className={cn(
        'rounded-xl border border-amber-300/70 bg-amber-50 p-4 text-amber-950 dark:border-amber-800/50 dark:bg-amber-950/40 dark:text-amber-50',
        className
      )}
    >
      <div className='flex gap-3 sm:items-start'>
        <Shield className='mt-0.5 size-5 shrink-0 text-amber-700 dark:text-amber-300' aria-hidden />
        <div className='space-y-1 text-sm leading-snug'>
          <p className='font-semibold text-amber-900 dark:text-amber-100'>
            Entrega solo con familiar directo y respaldo institucional
          </p>
          <p className='text-amber-950/90 dark:text-amber-50/90'>
            Por el bien del niño, niña o adolescente, no debe entregarse a nadie sin confirmar con calma que es familiar
            directo (padre, madre o tutor legítimo) y con documentos que lo acrediten. El reencuentro debe coordinarse
            con una organización humanitaria o un órgano público —como Defensa Civil, Protección Civil o autoridades
            locales— para cuidar al niño, niña o adolescente y evitar entregas a personas que no corresponden.
          </p>
        </div>
      </div>
    </aside>
  )
}
