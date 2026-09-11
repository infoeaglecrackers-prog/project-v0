import Redis, { RedisOptions } from "ioredis";

let redisClient: Redis | null = null;
let isRedisAvailable = false;

// Feature toggle: Set REDIS_ENABLED=true in .env to activate Redis when a server is available.
// Defaults to false so the application is completely independent and has zero connection overhead or warnings.
export const isRedisConfigured = (): boolean => {
  const val = process.env.REDIS_ENABLED?.toLowerCase()?.trim();
  return val === "true" || val === "1";
};

export const initRedis = (): Redis | null => {
  if (!isRedisConfigured()) {
    // Kept dormant/dead code until Redis is provisioned and enabled in env
    return null;
  }

  const redisUrl = process.env.REDIS_URL;
  const redisHost = process.env.REDIS_HOST || "127.0.0.1";
  const redisPort = Number(process.env.REDIS_PORT) || 6379;
  const redisPassword = process.env.REDIS_PASSWORD || undefined;

  const redisOptions: RedisOptions = {
    retryStrategy: (times: number) => {
      // Exponential backoff with a cap of 3s, stops trying after 10 retries if Redis isn't reachable
      if (times > 10) {
        console.warn("⚠️ Redis reconnect retries exhausted. Running without cache.");
        return null;
      }
      return Math.min(times * 100, 3000);
    },
    maxRetriesPerRequest: 1,
    connectTimeout: 5000,
    lazyConnect: true,
    enableOfflineQueue: false, // Don't hold operations in memory indefinitely when Redis is down
  };

  if (redisPassword) {
    redisOptions.password = redisPassword;
  }

  try {
    if (redisUrl) {
      redisClient = new Redis(redisUrl, redisOptions);
    } else {
      redisClient = new Redis({
        ...redisOptions,
        host: redisHost,
        port: redisPort,
      });
    }

    redisClient.on("connect", () => {
      isRedisAvailable = true;
      console.log("✅ Redis connected successfully");
    });

    redisClient.on("ready", () => {
      isRedisAvailable = true;
    });

    redisClient.on("error", (err: Error) => {
      isRedisAvailable = false;
      // Log connection errors without crashing the Express server
      console.warn(`⚠️ Redis error: ${err.message}`);
    });

    redisClient.on("close", () => {
      isRedisAvailable = false;
    });

    redisClient.on("end", () => {
      isRedisAvailable = false;
    });

    // Attempt non-blocking connection
    redisClient.connect().catch((err: Error) => {
      isRedisAvailable = false;
      console.warn(`⚠️ Redis initial connection failed: ${err.message}. Backend will operate with Redis caching gracefully bypassed.`);
    });

    return redisClient;
  } catch (error) {
    isRedisAvailable = false;
    console.warn("⚠️ Failed to initialize Redis client:", error);
    return null;
  }
};

export const getRedisClient = (): Redis | null => {
  if (!isRedisConfigured()) return null;
  return redisClient;
};

export const isRedisReady = (): boolean =>
  isRedisConfigured() && isRedisAvailable && redisClient !== null && redisClient.status === "ready";

export default initRedis;
