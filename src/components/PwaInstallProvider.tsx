'use client'
import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from 'react'

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface PwaInstallContextValue {
  /** La app ya corre como PWA instalada. */
  installed: boolean
  /** El navegador expuso beforeinstallprompt; el botón puede abrir el diálogo nativo. */
  canPromptInstall: boolean
  /** Cliente hidratado (evita parpadeos en SSR). */
  ready: boolean
  install: () => Promise<boolean>
}

const PwaInstallContext = createContext<PwaInstallContextValue | null>(null)

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

function subscribeStandalone(onStoreChange: () => void) {
  const mq = window.matchMedia('(display-mode: standalone)')
  mq.addEventListener('change', onStoreChange)
  return () => mq.removeEventListener('change', onStoreChange)
}

function useIsStandalone(): boolean {
  return useSyncExternalStore(subscribeStandalone, isStandalone, () => false)
}

function useIsClient(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}

/** Proveedor único: captura beforeinstallprompt una sola vez en toda la app. */
export function PwaInstallProvider({ children }: { children: React.ReactNode }) {
  const standalone = useIsStandalone()
  const ready = useIsClient()
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [justInstalled, setJustInstalled] = useState(false)

  const installed = standalone || justInstalled

  useEffect(() => {
    if (installed) return

    if ('serviceWorker' in navigator) {
      void navigator.serviceWorker.register('/sw.js').catch(() => {})
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [installed])

  const install = useCallback(async () => {
    if (!deferredPrompt) return false

    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    setDeferredPrompt(null)

    if (outcome === 'accepted') {
      setJustInstalled(true)
      return true
    }

    return false
  }, [deferredPrompt])

  const value = useMemo(
    () => ({
      installed,
      canPromptInstall: Boolean(deferredPrompt),
      ready,
      install
    }),
    [installed, deferredPrompt, ready, install]
  )

  return <PwaInstallContext.Provider value={value}>{children}</PwaInstallContext.Provider>
}

export function usePwaInstall(): PwaInstallContextValue {
  const ctx = useContext(PwaInstallContext)
  if (!ctx) {
    throw new Error('usePwaInstall debe usarse dentro de PwaInstallProvider')
  }
  return ctx
}
