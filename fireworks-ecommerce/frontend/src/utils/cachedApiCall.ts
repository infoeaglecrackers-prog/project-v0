import { apiCache } from "./apiCache";

interface CachedCallOptions {
  cacheKey: string;
  ttl: number;
  deduplicateInFlight?: boolean;
}

export async function cachedApiCall<T>(
  apiFn: () => Promise<T>,
  options: CachedCallOptions
): Promise<T> {
  const { cacheKey, ttl, deduplicateInFlight = true } = options;

  const cached = apiCache.get<T>(cacheKey);
  if (cached) {
    return cached;
  }

  if (deduplicateInFlight) {
    const inFlightPromise = apiCache.getInFlight(cacheKey);
    if (inFlightPromise) {
      return inFlightPromise;
    }
  }

  const promise = apiFn().then(data => {
    apiCache.set(cacheKey, data, ttl);
    return data;
  });

  apiCache.setInFlight(cacheKey, promise);
  return promise;
}
