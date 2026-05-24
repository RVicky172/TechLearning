import type { TopicNode } from "@/data/types";

export const redisCaching: TopicNode = {
  id: "redis-caching",
  title: "Caching Patterns",
  iconName: "Zap",
  link: "https://redis.io/docs/latest/develop/use/patterns/",
  theory:
    "Redis is the de-facto caching layer in web applications. The three dominant patterns — Cache-Aside, Write-Through, and Write-Behind — each trade off consistency, complexity, and write latency differently. Choosing the right pattern depends on how stale data can be tolerated.",
  theoryDetail: {
    keyConcepts: [
      "Cache-Aside (Lazy Loading): app checks cache first; on miss, reads from DB, writes to cache, returns — most common pattern",
      "Write-Through: app writes to cache AND database on every write — cache is always up-to-date but adds write latency",
      "Write-Behind (Write-Back): app writes only to cache; a background process flushes to DB — low write latency but risk of data loss",
      "TTL (Time To Live): expiry set on cache keys to prevent stale data accumulating — balance freshness vs cache hit rate",
      "Cache stampede: when a popular cached key expires, many requests simultaneously miss and flood the database — mitigate with probabilistic early expiry or a lock",
      "Cache invalidation: the hard problem — strategies: TTL-based expiry, event-driven invalidation (delete key on write), versioned keys",
      "Rate limiting: a common Redis pattern — INCR + EXPIRE implements a fixed-window rate limiter atomically",
    ],
    whyItMatters:
      "A correctly implemented cache can reduce database load by 90%+ and cut API response times from 200 ms to under 5 ms for hot data. It also enables rate limiting, session storage, and idempotency — all patterns that appear in system design interviews.",
    commonPitfalls: [
      "Cache-Aside without error handling — if Redis is down, the app must fall through to the DB gracefully, not throw 500s",
      "Caching mutable user-specific data without user-scoped keys — sharing cache keys across users leaks private data",
      "Not using pipelines for bulk operations — 100 individual SET calls have 100× the round-trip overhead of a single MSET or pipeline",
      "Ignoring cache stampede under high traffic — add a short jitter to TTLs (Math.random() * 10s) to desynchronise expirations",
    ],
    examples: [
      {
        title: "Cache-Aside pattern with type-safe wrapper",
        description:
          "A reusable getOrSet helper implements cache-aside with automatic JSON serialisation, error resilience, and TTL.",
        code: `import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!);

/**
 * Cache-Aside: return cached value or call fetcher, cache it, and return.
 * Falls back to fetcher if Redis is unavailable.
 */
async function getOrSet<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds = 60,
): Promise<T> {
  try {
    const cached = await redis.get(key);
    if (cached) return JSON.parse(cached) as T;
  } catch {
    // Redis unavailable — fall through to source of truth
  }

  const value = await fetcher();

  try {
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
  } catch {
    // Don't throw if we can't cache — serve the fresh value
  }

  return value;
}

// ── Usage ─────────────────────────────────────────────────
const user = await getOrSet(
  \`user:\${userId}\`,
  () => db.query("SELECT * FROM users WHERE id = ?", [userId]),
  300, // cache for 5 minutes
);

// ── Rate limiting — fixed window with INCR ────────────────
async function rateLimit(ip: string, maxRequests = 100): Promise<boolean> {
  const key = \`rl:\${ip}:\${Math.floor(Date.now() / 60_000)}\`; // 1-min window
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, 60); // set TTL on first request
  return count <= maxRequests;
}`,
        language: "typescript",
      },
    ],
  },
};
