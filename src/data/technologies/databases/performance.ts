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