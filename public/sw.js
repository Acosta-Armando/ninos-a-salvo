/**
 * Service worker — offline para /, /registro, /ayuda y /mis-registros.
 * El registro guarda datos en IndexedDB (Dexie); la sync a /api/ninos requiere red.
 */
const CACHE_VERSION = 'v8'
const SHELL_CACHE = `ninos-a-salvo-shell-${CACHE_VERSION}`
const RUNTIME_CACHE = `ninos-a-salvo-runtime-${CACHE_VERSION}`

/** Rutas que deben abrirse sin conexión. */
const OFFLINE_PATHS = new Set(['/', '/registro', '/ayuda', '/mis-registros'])

const PRECACHE_URLS = [
  '/',
  '/registro',
  '/ayuda',
  '/mis-registros',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png',
  '/favicon.ico'
]

function normalizePath(pathname) {
  const path = pathname.replace(/\/$/, '')
  return path === '' ? '/' : path
}

function isOfflineRoute(url) {
  return url.origin === self.location.origin && OFFLINE_PATHS.has(normalizePath(url.pathname))
}

function isNextAsset(url) {
  return url.pathname.startsWith('/_next/')
}

function isImmutableAsset(url) {
  return /\.(woff2?|ico|svg|png|jpg|jpeg|webp|json)$/i.test(url.pathname)
}

function isRscRequest(request, url) {
  return (
    request.headers.get('rsc') === '1' ||
    request.headers.get('next-router-prefetch') === '1' ||
    url.searchParams.has('_rsc')
  )
}

function isApiRequest(url) {
  return url.pathname.startsWith('/api/')
}

function shouldHandleOffline(request, url) {
  return isOfflineRoute(url) || isNextAsset(url) || isRscRequest(request, url)
}

// Genera una Request personalizada para guardar el RSC con un identificador único en la caché
function getCacheKey(request, url) {
  if (isRscRequest(request, url)) {
    // Añadimos un sufijo o parámetro virtual para diferenciar el payload RSC del documento HTML
    const rscUrl = new URL(request.url)
    rscUrl.searchParams.set('__next_rsc__', '1')
    return new Request(rscUrl.toString(), { headers: request.headers })
  }
  return request
}

async function cachePut(request, response) {
  if (request.method !== 'GET' || !response || response.status !== 200) return

  const url = new URL(request.url)
  const cacheName = request.mode === 'navigate' || isOfflineRoute(url) ? SHELL_CACHE : RUNTIME_CACHE

  const cache = await caches.open(cacheName)
  const cacheKey = getCacheKey(request, url)
  await cache.put(cacheKey, response.clone())
}

async function findCachedForPath(pathname, isRsc) {
  const path = normalizePath(pathname)

  for (const cacheName of [SHELL_CACHE, RUNTIME_CACHE]) {
    const cache = await caches.open(cacheName)
    const keys = await cache.keys()

    for (const req of keys) {
      const keyUrl = new URL(req.url)
      const matchesPath = normalizePath(keyUrl.pathname) === path
      const hasRscParam = keyUrl.searchParams.has('__next_rsc__')

      if (matchesPath && (isRsc ? hasRscParam : !hasRscParam)) {
        const match = await cache.match(req)
        if (match) return match
      }
    }
  }

  return null
}

async function networkFirstOffline(request) {
  const url = new URL(request.url)
  const isRsc = isRscRequest(request, url)
  const cacheKey = getCacheKey(request, url)

  try {
    const response = await fetch(request)
    await cachePut(request, response)
    return response
  } catch {
    const exact = await caches.match(cacheKey)
    if (exact) return exact

    const byPath = await findCachedForPath(url.pathname, isRsc)
    if (byPath) return byPath

    return new Response('Sin conexión. Visita esta página una vez con internet para guardarla en caché.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    })
  }
}

/** Red primero para chunks de Next: evita JS obsoleto tras despliegues o cambios en dev. */
async function networkFirstNextAsset(request) {
  try {
    const response = await fetch(request)
    await cachePut(request, response)
    return response
  } catch {
    const cached = await caches.match(request)
    if (cached) return cached
    return new Response('', { status: 504 })
  }
}

async function cacheFirstStatic(request) {
  const cached = await caches.match(request)
  if (cached) return cached

  try {
    const response = await fetch(request)
    await cachePut(request, response)
    return response
  } catch {
    return new Response('', { status: 504 })
  }
}

async function precacheOfflineRoutes() {
  const shell = await caches.open(SHELL_CACHE)
  const origin = self.location.origin

  for (const path of OFFLINE_PATHS) {
    try {
      const absoluteUrl = new URL(path, origin).toString()

      const responseHtml = await fetch(absoluteUrl, {
        credentials: 'same-origin',
        cache: 'no-store'
      })
      if (responseHtml.ok) {
        await shell.put(path, responseHtml.clone())
        await shell.put(new Request(path, { method: 'GET' }), responseHtml.clone())
      }

      const rscRequest = new Request(absoluteUrl, {
        headers: { rsc: '1' }
      })
      const responseRsc = await fetch(rscRequest, { cache: 'no-store' })
      if (responseRsc.ok) {
        // Guardamos el RSC usando la URL virtual simulada por getCacheKey
        const virtualRscUrl = new URL(absoluteUrl)
        virtualRscUrl.searchParams.set('__next_rsc__', '1')
        await shell.put(virtualRscUrl.toString(), responseRsc)
      }
    } catch {
      // Error silencioso en fallo de red local durante el proceso
    }
  }

  for (const url of PRECACHE_URLS) {
    try {
      const absoluteUrl = new URL(url, origin).toString()
      const response = await fetch(absoluteUrl, { cache: 'no-store' })
      if (response.ok) {
        const cache = OFFLINE_PATHS.has(normalizePath(new URL(url, origin).pathname))
          ? shell
          : await caches.open(RUNTIME_CACHE)
        await cache.put(url, response.clone())
      }
    } catch {
      // Ignorar fallos individuales de assets estáticos
    }
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      await precacheOfflineRoutes()
      await self.skipWaiting()
    })()
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(
        keys
          .filter((key) => key.startsWith('ninos-a-salvo-') && key !== SHELL_CACHE && key !== RUNTIME_CACHE)
          .map((key) => caches.delete(key))
      )
      await precacheOfflineRoutes()
      await self.clients.claim()
    })()
  )
})

self.addEventListener('message', (event) => {
  if (event.data?.type === 'PRECACHE_OFFLINE_ROUTES') {
    event.waitUntil(precacheOfflineRoutes())
  }
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  if (isApiRequest(url)) return

  // Chunks de Next: red primero para no servir bundles desactualizados (p. ej. lucide-react).
  if (isNextAsset(url)) {
    event.respondWith(networkFirstNextAsset(request))
    return
  }

  if (isImmutableAsset(url)) {
    event.respondWith(cacheFirstStatic(request))
    return
  }

  if (shouldHandleOffline(request, url)) {
    event.respondWith(networkFirstOffline(request))
    return
  }
})
