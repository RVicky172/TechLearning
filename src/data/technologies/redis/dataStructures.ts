import type { TopicNode } from "@/data/types";

export const redisDataStructures: TopicNode = {
  id: "redis-data-structures",
  title: "Data Structures",
  iconName: "Layers",
  link: "https://redis.io/docs/latest/develop/data-types/",
  theory:
    "Redis's power comes from its native data structures. Each type has O(1) or O(log n) operations for the common case, and choosing the right structure for your use case avoids expensive application-side computation.",
  theoryDetail: {
    keyConcepts: [
      "String: the fundamental type — bytes up to 512 MB; supports INCR/DECR for atomic counters, APPEND, GETRANGE",
      "List: ordered sequence of strings — LPUSH/RPUSH add to head/tail, LPOP/RPOP remove; ideal for queues and activity feeds",
      "Hash: a map of field–value pairs under one key — HSET/HGET/HGETALL; models objects efficiently (one key per record)",
      "Set: unordered, deduplicated collection — SADD/SMEMBERS/SISMEMBER; supports SUNION, SINTER, SDIFF across sets",
      "Sorted Set (ZSet): set where each member has a float score — ZADD/ZRANGE/ZRANK; the native leaderboard data structure",
      "Stream: an append-only log with consumer groups — XADD/XREAD/XREADGROUP; for reliable message queues (like Kafka-lite)",
      "Bitmap / HyperLogLog: space-efficient special types — Bitmaps for per-user flags, HyperLogLog for approximate unique counts (e.g. daily active users)",
    ],
    whyItMatters:
      "Picking the right Redis data structure can eliminate complex application logic. A leaderboard is three lines of Sorted Set commands. A job queue is LPUSH + BRPOP. A unique visitor counter is a single HyperLogLog. These are patterns you'll reach for repeatedly in production systems.",
    commonPitfalls: [
      "Storing everything as a JSON string in a String key — fine for simple cases, but a Hash lets you update individual fields without deserialising the whole object",
      "Large Lists as queues without consumer tracking — if the consumer crashes, the job is lost; use Streams with consumer groups for at-least-once delivery",
      "Unbounded Sorted Sets — a leaderboard with no pruning grows forever; use ZREMRANGEBYRANK to cap size after each write",
    ],
    examples: [
      {
        title: "Hashes — storing user records",
        description: "Model objects as Hashes to update individual fields atomically.",
        code: `// Store a user object — each field is individually addressable
await redis.hset("user:42", {
  name:      "Alice",
  email:     "alice@example.com",
  loginCount: "0",
  createdAt: Date.now().toString(),
});

// Read individual fields — no need to fetch the whole object
const name  = await redis.hget("user:42", "name");     // "Alice"
const email = await redis.hget("user:42", "email");    // "alice@example.com"

// Atomic increment of a single numeric field
await redis.hincrby("user:42", "loginCount", 1);       // 0 → 1

// Read the full object
const user = await redis.hgetall("user:42");
// { name: "Alice", email: "alice@example.com", loginCount: "1", ... }`,
        language: "typescript",
      },
      {
        title: "Sorted Sets — real-time leaderboard",
        description: "ZADD, ZREVRANK, and ZREVRANGE power a leaderboard in constant time.",
        code: `// Add or update player scores
await redis.zadd("leaderboard:weekly", 4200, "player:alice");
await redis.zadd("leaderboard:weekly", 3800, "player:bob");
await redis.zadd("leaderboard:weekly", 5100, "player:carol");

// Increment score (e.g. player earns 50 points)
await redis.zincrby("leaderboard:weekly", 50, "player:alice");  // 4250

// Get rank (0-indexed, higher score = lower index with ZREVRANK)
const aliceRank = await redis.zrevrank("leaderboard:weekly", "player:alice"); // 1

// Top 10 with scores
const top10 = await redis.zrevrange("leaderboard:weekly", 0, 9, "WITHSCORES");
// ["player:carol", "5100", "player:alice", "4250", "player:bob", "3800"]

// Cap leaderboard to 1000 entries (remove lowest scores)
await redis.zremrangebyrank("leaderboard:weekly", 0, -1001);`,
        language: "typescript",
      },
      {
        title: "Lists — simple job queue",
        description: "LPUSH from producers + BRPOP blocking read from workers = a zero-dependency queue.",
        code: `// Producer: enqueue jobs
async function enqueue(job: object) {
  await redis.lpush("jobs:email", JSON.stringify(job));
}

// Worker: blocking pop (waits up to 30s for a job, then returns null)
async function worker() {
  while (true) {
    const result = await redis.brpop("jobs:email", 30);
    if (!result) continue;              // timeout, loop again
    const [_queue, raw] = result;
    const job = JSON.parse(raw);
    await processEmailJob(job);
  }
}

// Queue length
const depth = await redis.llen("jobs:email");`,
        language: "typescript",
      },
    ],
  },
};
