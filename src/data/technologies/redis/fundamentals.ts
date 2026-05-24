import type { TopicNode } from "@/data/types";

export const redisFundamentals: TopicNode = {
  id: "redis-fundamentals",
  title: "Redis Fundamentals",
  iconName: "Database",
  link: "https://redis.io/docs/latest/",
  theory:
    "Redis is an in-memory data structure store used as a database, cache, and message broker. Because all data lives in RAM, reads and writes are sub-millisecond. Redis persists data to disk (RDB snapshots or AOF logs) making it more durable than a pure cache while remaining orders of magnitude faster than a relational database for the right use cases.",
  theoryDetail: {
    keyConcepts: [
      "In-memory first: all data is stored in RAM — typical read/write latency is under 1 ms vs 1–10 ms for a disk-based database",
      "Data structures: Redis isn't just a key–value store — it natively supports Strings, Lists, Sets, Sorted Sets, Hashes, Streams, and more",
      "Persistence: RDB (periodic snapshot) for fast restarts; AOF (append-only log) for durability; both can be combined",
      "Expiry (TTL): any key can have an expiry with EXPIRE or EXPIREAT — perfect for sessions, rate-limit windows, and caches",
      "Atomicity: all Redis commands are atomic; MULTI/EXEC provides transactions; Lua scripts execute atomically server-side",
      "Single-threaded: the main command loop is single-threaded — no race conditions on individual commands, but long-running commands block all others",
      "Replication & Sentinel: Redis Sentinel manages automatic failover for high availability; Redis Cluster shards data across nodes",
    ],
    whyItMatters:
      "Redis appears in nearly every production fullstack application. It powers sessions, API rate limiting, queues, leaderboards, pub/sub, and the read-through cache layer that keeps databases from being overwhelmed. Understanding Redis is a frequently tested skill in backend interviews.",
    commonPitfalls: [
      "No access control by default — always set requirepass and use ACLs in production; never expose port 6379 to the internet",
      "Forgetting TTLs — unbounded keys accumulate forever and can exhaust memory; always set EXPIRE on cache keys",
      "Using KEYS * in production — KEYS blocks the server while scanning all keys; use SCAN with a cursor instead",
      "Treating Redis as the primary database — Redis is an excellent cache and secondary store, but durability guarantees are weaker than Postgres",
      "Not monitoring memory — set maxmemory and a maxmemory-policy (e.g. allkeys-lru) so Redis evicts old data gracefully instead of crashing",
    ],
    examples: [
      {
        title: "Connecting to Redis from Node.js and basic operations",
        description: "Using the ioredis client — the most feature-complete Node.js Redis library.",
        code: `import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST ?? "localhost",
  port: 6379,
  password: process.env.REDIS_PASSWORD,
  // Automatic reconnection with exponential backoff
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

// ── Strings ──────────────────────────────────────────────
await redis.set("greeting", "hello");
await redis.set("counter", 100);
await redis.incr("counter");                // atomic increment → 101

// Set with expiry (TTL in seconds)
await redis.set("session:abc123", JSON.stringify({ userId: 42 }), "EX", 3600);

const value = await redis.get("greeting");  // "hello"
const ttl   = await redis.ttl("session:abc123"); // seconds remaining

// ── Delete ────────────────────────────────────────────────
await redis.del("greeting");
await redis.del("key1", "key2", "key3");    // batch delete

// ── Check existence ───────────────────────────────────────
const exists = await redis.exists("counter"); // 1 (true) or 0 (false)

// ── Scan (never use KEYS * in production) ────────────────
let cursor = "0";
do {
  const [nextCursor, keys] = await redis.scan(cursor, "MATCH", "session:*", "COUNT", 100);
  cursor = nextCursor;
  console.log("Found keys:", keys);
} while (cursor !== "0");`,
        language: "typescript",
      },
    ],
  },
};
