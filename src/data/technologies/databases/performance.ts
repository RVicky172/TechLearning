import type { TopicNode } from "@/data/types";

export const databasesPerformance: TopicNode = {
  id: "databases-performance",
  title: "Performance, Caching, and Operations",
  iconName: "Gauge",
  theory:
    "Good database engineering is operational as much as conceptual. You need indexes, query analysis, caching, pooling, backups, observability, and incident habits that keep latency and data risk under control.",
  theoryDetail: {
    keyConcepts: [
      "Use EXPLAIN or execution plans to understand scans, joins, sort cost, and index usage.",
      "Connection pooling protects the database from bursty application traffic.",
      "Caching works best for expensive, read-heavy paths with clear invalidation and TTL strategy.",
      "Backups, restore drills, and replication are part of the learning path, not optional operations trivia.",
    ],
    whyItMatters:
      "Teams usually notice the data layer when something is already slow or broken. Operational literacy lets you prevent incidents instead of reacting late in production.",
    commonPitfalls: [
      "Adding Redis before fixing an obviously bad query or missing index.",
      "No backup restore testing, so the team has backups but no proven recovery path.",
      "Letting application servers open unbounded database connections during spikes.",
    ],
    examples: [
      {
        title: "The N+1 Query Problem",
        description: "A common performance killer in modern applications using ORMs. Fetching a list of records, and then running a separate query for each record's relations.",
        code: `// ❌ THE BAD WAY (N+1 Problem)
// 1 query to get 50 users...
const users = await db.query('SELECT * FROM users LIMIT 50');

for (const user of users) {
  // ...and 50 individual queries to get their posts! (51 queries total)
  const posts = await db.query('SELECT * FROM posts WHERE user_id = ?', [user.id]);
  user.posts = posts;
}

// ✅ THE GOOD WAY (2 Queries total)
const users = await db.query('SELECT * FROM users LIMIT 50');
const userIds = users.map(u => u.id);

// Use the SQL 'IN' clause to fetch all posts in a single round-trip
const allPosts = await db.query('SELECT * FROM posts WHERE user_id IN (?)', [userIds]);

// Then stitch them together in memory (JavaScript is fast, network I/O is slow)
users.forEach(user => {
  user.posts = allPosts.filter(p => p.user_id === user.id);
});`,
        language: "javascript",
      },
      {
        title: "Cache-aside pattern",
        description: "Cache only the expensive read path and invalidate on writes.",
        code: `async function getAccountSummary(accountId: string) {
  const cacheKey = 'account-summary:' + accountId;
  const cached = await redis.get(cacheKey);

  if (cached) return JSON.parse(cached);

  const summary = await db.accountSummary.findUnique({
    where: { accountId },
  });

  await redis.set(cacheKey, JSON.stringify(summary), { EX: 60 });
  return summary;
}`,
        language: "typescript",
      },
    ],
  },
  children: [
    {
      id: "databases-indexing",
      title: "Indexes and Query Plans",
      iconName: "Search",
      theory:
        "Read actual query plans, not just SQL text. A compound index that matches your filter and sort order often changes latency by an order of magnitude.",
      link: "https://www.postgresql.org/docs/current/using-explain.html",
    },
    {
      id: "databases-reliability",
      title: "Replication, Backups, and Recovery",
      iconName: "ShieldCheck",
      theory:
        "High availability reduces downtime, while tested backups reduce data-loss risk. Both are needed; one does not replace the other.",
      link: "https://www.postgresql.org/docs/current/backup.html",
    },
  ],
};