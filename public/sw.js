/**
 * Service worker — offline para / y /registro.
 * El registro guarda datos en IndexedDB (Dexie); la sync a /api/ninos requiere red.
 */
const CACHE_VERSION = "v2";
const SHELL_CACHE = `ninos-a-salvo-shell-${CACHE_VERSION}`;
const RUNTIME_CACHE = `ninos-a-salvo-runtime-${CACHE_VERSION}`;

/** Rutas que deben abrirse sin conexión. */
const OFFLINE_PATHS = new Set(["/", "/registro"]);

const PRECACHE_URLS = [
  "/",
  "/registro",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png",
  "/favicon.ico",
];

function normalizePath(pathname) {
  const path = pathname.replace(/\/$/, "");
  return path === "" ? "/" : path;
}

function isOfflineRoute(url) {
  return url.origin === self.location.origin && OFFLINE_PATHS.has(normalizePath(url.pathname));
}

function isStaticAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    /\.(js|css|woff2?|ico|svg|png|jpg|jpeg|webp|json)$/i.test(url.pathname)
  );
}

function isApiRequest(url) {
  return url.pathname.startsWith("/api/");
}

async function cachePut(request, response) {
  if (request.method !== "GET" || response.status !== 200) return;
  const cache = await caches.open(
    request.mode === "navigate" || isOfflineRoute(new URL(request.url))
      ? SHELL_CACHE
      : RUNTIME_CACHE,
  );
  await cache.put(request, response.clone());
}

async function networkFirstOfflineRoute(request) {
  try {
    const response = await fetch(request);
    await cachePut(request, response);
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;

    if (request.mode === "navigate") {
      const path = normalizePath(new URL(request.url).pathname);
      const fallback = await caches.match(path);
      if (fallback) return fallback;
    }

    return new Response("Sin conexión. Abre / o /registro después de haberlas visitado con internet.", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}

async function cacheFirstStatic(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    await cachePut(request, response);
    return response;
  } catch {
    return cached ?? new Response("", { status: 504 });
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      await Promise.allSettled(PRECACHE_URLS.map((url) => cache.add(url)));
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith("ninos-a-salvo-") && key !== SHELL_CACHE && key !== RUNTIME_CACHE)
          .map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (isApiRequest(url)) return;

  if (isOfflineRoute(url)) {
    event.respondWith(networkFirstOfflineRoute(request));
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(cacheFirstStatic(request));
  }
});
