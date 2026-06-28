import { Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EntregaSeguraNoticeProps {
  className?: string
}

/**
 * Aviso humanitario: la app no coordina entregas; los organismos competentes son responsables.
 */
export function EntregaSeguraNotice({ className }: EntregaSeguraNoticeProps) {
  return (
    <aside
      role='note'
      aria-label='Aviso: sin entregas de menores por esta plataforma'
      className={cn(
        'rounded-xl border border-amber-300/70 bg-amber-50 p-4 text-amber-950 dark:border-amber-800/50 dark:bg-amber-950/40 dark:text-amber-50',
        className
      )}
    >
      <div className='flex gap-3 sm:items-start'>
        <Shield className='mt-0.5 size-5 shrink-0 text-amber-700 dark:text-amber-300' aria-hidden />
        <div className='space-y-1 text-sm leading-snug'>
          <p className='font-semibold text-amber-900 dark:text-amber-100'>
            No entregues menores por esta plataforma
          </p>
          <p className='text-amber-950/90 dark:text-amber-50/90'>
            Niños a Salvo no promueve ni autoriza entregas. No debes entregar a un niño, niña o
            adolescente a quien llegue por internet o por teléfono. El reencuentro y la custodia son
            responsabilidad de organismos competentes —Defensa Civil, Protección Civil, autoridades
            locales u organizaciones acreditadas—. Usa la app solo para ubicar y contactar el punto
            de resguardo.
          </p>
        </div>
      </div>
    </aside>
  )
}
