/**
 * Service worker — offline para / y /registro.
 * El registro guarda datos en IndexedDB (Dexie); la sync a /api/ninos requiere red.
 */
const CACHE_VERSION = "v3";
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
    url.pathname.startsWith("/_next/") ||
    /\.(js|css|woff2?|ico|svg|png|jpg|jpeg|webp|json)$/i.test(url.pathname)
  );
}

function isRscRequest(request, url) {
  return (
    request.headers.get("rsc") === "1" ||
    request.headers.get("next-router-prefetch") === "1" ||
    url.searchParams.has("_rsc")
  );
}

function isApiRequest(url) {
  return url.pathname.startsWith("/api/");
}

function shouldHandleOffline(request, url) {
  return isOfflineRoute(url) || isStaticAsset(url) || isRscRequest(request, url);
}

async function cachePut(request, response) {
  if (request.method !== "GET" || !response || response.status !== 200) return;

  const url = new URL(request.url);
  const cacheName =
    request.mode === "navigate" || isOfflineRoute(url) ? SHELL_CACHE : RUNTIME_CACHE;

  const cache = await caches.open(cacheName);
  await cache.put(request, response.clone());
}

async function findCachedForPath(pathname) {
  const path = normalizePath(pathname);

  for (const cacheName of [SHELL_CACHE, RUNTIME_CACHE]) {
    const cache = await caches.open(cacheName);

    const direct = await cache.match(path);
    if (direct) return direct;

    const keys = await cache.keys();
    for (const req of keys) {
      const keyUrl = new URL(req.url);
      if (normalizePath(keyUrl.pathname) === path) {
        const match = await cache.match(req);
        if (match) return match;
      }
    }
  }

  return null;
}

async function networkFirstOffline(request) {
  const url = new URL(request.url);

  try {
    const response = await fetch(request);
    await cachePut(request, response);
    return response;
  } catch {
    const exact = await caches.match(request);
    if (exact) return exact;

    const byPath = await findCachedForPath(url.pathname);
    if (byPath) return byPath;

    if (request.mode === "navigate" || isRscRequest(request, url)) {
      const shell = await findCachedForPath(url.pathname);
      if (shell) return shell;
    }

    return new Response(
      "Sin conexión. Visita esta página una vez con internet para guardarla en caché.",
      {
        status: 503,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      },
    );
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
    return new Response("", { status: 504 });
  }
}

async function precacheOfflineRoutes() {
  const shell = await caches.open(SHELL_CACHE);
  const runtime = await caches.open(RUNTIME_CACHE);

  for (const path of OFFLINE_PATHS) {
    try {
      const response = await fetch(path, {
        credentials: "same-origin",
        cache: "no-store",
      });
      if (response.ok) {
        await shell.put(path, response.clone());
        await shell.put(new Request(path, { method: "GET" }), response.clone());
      }
    } catch {
      // Sin red en install/activate; se precargará desde el cliente.
    }
  }

  for (const url of PRECACHE_URLS) {
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (response.ok) {
        const cache = OFFLINE_PATHS.has(normalizePath(new URL(url, self.location.origin).pathname))
          ? shell
          : runtime;
        await cache.put(url, response.clone());
      }
    } catch {
      // Ignorar fallos individuales de precache.
    }
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      await precacheOfflineRoutes();
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
          .filter(
            (key) =>
              key.startsWith("ninos-a-salvo-") &&
              key !== SHELL_CACHE &&
              key !== RUNTIME_CACHE,
          )
          .map((key) => caches.delete(key)),
      );
      await precacheOfflineRoutes();
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "PRECACHE_OFFLINE_ROUTES") {
    event.waitUntil(precacheOfflineRoutes());
  }
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (isApiRequest(url)) return;

  if (shouldHandleOffline(request, url)) {
    event.respondWith(networkFirstOffline(request));
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(cacheFirstStatic(request));
  }
});
