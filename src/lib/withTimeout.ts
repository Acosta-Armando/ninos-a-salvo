/** Rechaza si la promesa no resuelve dentro del límite (p. ej. red caída). */
export function withTimeout<T>(
  promise: PromiseLike<T>,
  ms: number,
  message: string,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error(message)), ms);
    Promise.resolve(promise)
      .then(resolve)
      .catch(reject)
      .finally(() => window.clearTimeout(timer));
  });
}
