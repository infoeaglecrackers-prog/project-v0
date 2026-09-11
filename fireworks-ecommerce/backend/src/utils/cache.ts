import { getRedisClient, isRedisReady } from "../config/redis";

const DEFAULT_TTL_SECONDS = 300; // 5 minutes

/**
 * Standard prefix namespaces for clean cache organization
 */
export const CACHE_KEYS = {
  PRODUCTS_PREFIX: "cache:products:",
  PRODUCTS_LIST: "cache:products:list:*",
  PRODUCTS_FEATURED: "cache:products:featured:*",
  PRODUCTS_BESTSELLERS: "cache:products:bestsellers:*",
  PRODUCT_DETAIL: (id: string) => `cache:products:item:${id}`,
  CATEGORIES_PREFIX: "cache:categories:",
  CATEGORIES_LIST: "cache:categories:list:*",
  CATEGORY_DETAIL: (id: string) => `cache:categories:item:${id}`,
  DROPPOINTS_PREFIX: "cache:droppoints:",
  DROPPOINTS_LIST: "cache:droppoints:list:*",
  PROMOS_ACTIVE: "cache:promos:active",
};

/**
 * Retrieves a parsed JSON value from Redis
 */
export const getCachedData = async <T>(key: string): Promise<T | null> => {
  if (!isRedisReady()) return null;
  const client = getRedisClient();
  if (!client) return null;

  try {
    const data = await client.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  } catch (error) {
    console.warn(`[Redis] Error getting key "${key}":`, error);
    return null;
  }
};

/**
 * Serializes and sets data in Redis with TTL (in seconds)
 */
export const setCachedData = async (
  key: string,
  data: unknown,
  ttlSeconds: number = DEFAULT_TTL_SECONDS
): Promise<boolean> => {
  if (!isRedisReady()) return false;
  const client = getRedisClient();
  if (!client) return false;

  try {
    const serialized = JSON.stringify(data);
    await client.set(key, serialized, "EX", ttlSeconds);
    return true;
  } catch (error) {
    console.warn(`[Redis] Error setting key "${key}":`, error);
    return false;
  }
};

/**
 * Deletes one or more specific keys
 */
export const deleteCachedKey = async (...keys: string[]): Promise<number> => {
  if (!isRedisReady() || keys.length === 0) return 0;
  const client = getRedisClient();
  if (!client) return 0;

  try {
    return await client.del(...keys);
  } catch (error) {
    console.warn(`[Redis] Error deleting keys:`, error);
    return 0;
  }
};

/**
 * Deletes keys matching a pattern using SCAN to avoid blocking Redis event loop
 */
export const deleteKeysByPattern = async (pattern: string): Promise<number> => {
  if (!isRedisReady()) return 0;
  const client = getRedisClient();
  if (!client) return 0;

  try {
    let cursor = "0";
    let deletedCount = 0;

    do {
      const [nextCursor, keys] = await client.scan(cursor, "MATCH", pattern, "COUNT", 100);
      cursor = nextCursor;

      if (keys.length > 0) {
        const count = await client.del(...keys);
        deletedCount += count;
      }
    } while (cursor !== "0");

    return deletedCount;
  } catch (error) {
    console.warn(`[Redis] Error clearing cache for pattern "${pattern}":`, error);
    return 0;
  }
};

/**
 * Helpers for invalidating related caches after mutations
 */
export const invalidateProductCache = async (productId?: string): Promise<void> => {
  await Promise.all([
    deleteKeysByPattern("cache:products:*"),
    productId ? deleteCachedKey(CACHE_KEYS.PRODUCT_DETAIL(productId)) : Promise.resolve(0),
  ]);
};

export const invalidateCategoryCache = async (categoryId?: string): Promise<void> => {
  await Promise.all([
    deleteKeysByPattern("cache:categories:*"),
    // Category updates also impact product category populated listings
    deleteKeysByPattern("cache:products:*"),
    categoryId ? deleteCachedKey(CACHE_KEYS.CATEGORY_DETAIL(categoryId)) : Promise.resolve(0),
  ]);
};

export const invalidateDropPointCache = async (): Promise<void> => {
  await deleteKeysByPattern("cache:droppoints:*");
};
