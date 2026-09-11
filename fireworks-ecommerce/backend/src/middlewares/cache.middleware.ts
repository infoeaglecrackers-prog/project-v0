import { Request, Response, NextFunction } from "express";
import { isRedisReady } from "../config/redis";
import { getCachedData, setCachedData } from "../utils/cache";

interface CacheMiddlewareOptions {
  ttlSeconds?: number;
  keyPrefix?: string;
  generateKey?: (req: Request) => string;
}

/**
 * Route-level Redis caching middleware.
 * If Redis is not enabled / ready, it immediately acts as a transparent no-op pass-through.
 * Intercepts GET requests, checks Redis, and serves cached responses if present.
 * If not present, intercepts res.json to store the response in Redis before sending.
 */
export const cacheMiddleware = (options: CacheMiddlewareOptions = {}) => {
  const ttl = options.ttlSeconds || 300; // default 5 minutes
  const prefix = options.keyPrefix || "cache:route:";

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // If Redis is disabled / unavailable, immediately pass through (zero overhead)
    if (!isRedisReady()) {
      return next();
    }

    // Only cache GET or HEAD requests
    if (req.method !== "GET" && req.method !== "HEAD") {
      return next();
    }

    const cacheKey = options.generateKey
      ? options.generateKey(req)
      : `${prefix}${req.originalUrl || req.url}`;

    try {
      const cachedResponse = await getCachedData<{
        statusCode: number;
        body: unknown;
      }>(cacheKey);

      if (cachedResponse) {
        res.setHeader("X-Cache", "HIT");
        res.setHeader("X-Cache-Key", cacheKey);
        res.status(cachedResponse.statusCode).json(cachedResponse.body);
        return;
      }

      res.setHeader("X-Cache", "MISS");

      // Capture original res.json to cache the successful response body
      const originalJson = res.json.bind(res);

      res.json = ((body: unknown) => {
        // Cache only 2xx successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          setCachedData(
            cacheKey,
            {
              statusCode: res.statusCode,
              body,
            },
            ttl
          ).catch((err) => {
            console.warn(`[Cache Middleware] Failed to cache response for ${cacheKey}:`, err);
          });
        }
        return originalJson(body);
      }) as typeof res.json;

      next();
    } catch (err) {
      console.warn(`[Cache Middleware] Error processing cache for ${cacheKey}:`, err);
      next();
    }
  };
};
