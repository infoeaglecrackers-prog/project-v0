interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface InFlightRequest {
  promise: Promise<any>;
  timestamp: number;
}

class APICache {
  private cache = new Map<string, CacheEntry<any>>();
  private inFlight = new Map<string, InFlightRequest>();
  private refreshIntervals = new Map<string, ReturnType<typeof setInterval>>();

  set<T>(key: string, data: T, ttlMs: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  clear(key?: string): void {
    if (key) {
      this.cache.delete(key);
      const interval = this.refreshIntervals.get(key);
      if (interval) clearInterval(interval);
      this.refreshIntervals.delete(key);
    } else {
      this.cache.clear();
      this.refreshIntervals.forEach(interval => clearInterval(interval));
      this.refreshIntervals.clear();
    }
  }

  setInFlight(key: string, promise: Promise<any>): void {
    this.inFlight.set(key, {
      promise,
      timestamp: Date.now(),
    });

    promise.finally(() => {
      this.inFlight.delete(key);
    });
  }

  getInFlight(key: string): Promise<any> | null {
    return this.inFlight.get(key)?.promise || null;
  }

  setupAutoRefresh(key: string, fetchFn: () => Promise<any>, ttlMs: number): void {
    if (this.refreshIntervals.has(key)) {
      clearInterval(this.refreshIntervals.get(key)!);
    }

    const refreshInterval = setInterval(() => {
      fetchFn().catch(err => console.warn(`Auto-refresh failed for ${key}:`, err));
    }, ttlMs * 0.8);

    this.refreshIntervals.set(key, refreshInterval);
  }
}

export const apiCache = new APICache();

export const CACHE_DURATIONS = {
  PRODUCTS: 5 * 60 * 1000,
  FEATURED: 10 * 60 * 1000,
  CATEGORIES: 10 * 60 * 1000,
  DROP_POINTS: 10 * 60 * 1000,
  USER_PROFILE: 5 * 60 * 1000,
  REVIEWS: 5 * 60 * 1000,
} as const;
