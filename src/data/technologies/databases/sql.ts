import type { TopicNode } from "@/data/types";

export const databasesSql: TopicNode = {
  id: "databases-sql",
  title: "SQL and Relational Systems",
  iconName: "Table",
  theory:
    "SQL remains the default choice for business systems because it handles joins, constraints, transactions, reporting, and operational workloads extremely well. PostgreSQL is the current industry default for many product teams.",
  theoryDetail: {
    keyConcepts: [
      "Tables, relations, joins, and constraints are the core building blocks of relational modeling.",
      "PostgreSQL is often the best default because it is reliable, extensible, and handles transactional and analytical workloads well for its size.",
      "Query plans matter. Learn EXPLAIN, composite indexes, pagination strategy, and lock behavior.",
    ],
    whyItMatters:
      "A strong SQL foundation pays off across application development, analytics, debugging, and interviewing. Even if you use Prisma or an ORM, production systems still depend on query shape, indexes, and transaction boundaries.",
    commonPitfalls: [
      "Offset pagination on large datasets, which becomes slower as the offset grows.",
      "Indexing every column instead of indexing the columns used together by actual queries.",
      "Holding transactions open while waiting on network calls or user input.",
    ],
    examples: [
      {
        title: "INNER JOIN vs LEFT JOIN",
        description: "Understanding the difference between the most common join types is critical for accurate reporting.",
        code: `-- INNER JOIN: Returns ONLY users who have made an order.
SELECT u.name, o.total_amount
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- LEFT JOIN: Returns ALL users. If they haven't made an order, total_amount will be NULL.
SELECT u.name, o.total_amount
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;`,
        language: "sql",
      },
      {
        title: "Keyset pagination and aggregation",
        description: "Prefer cursor-based reads for large ordered datasets over OFFSET.",
        code: `-- Keyset pagination (Fast, uses index on created_at)
SELECT id, email, created_at
FROM users
WHERE created_at < $1
ORDER BY created_at DESC
LIMIT 20;

-- Reporting query with aggregations
SELECT plan_id, COUNT(*) AS subscribers, SUM(amount) AS revenue
FROM subscriptions
WHERE status = 'active'
GROUP BY plan_id
ORDER BY revenue DESC;`,
        language: "sql",
      },
    ],
  },
  children: [
    {
      id: "databases-postgresql",
      title: "PostgreSQL Essentials",
      iconName: "Database",
      theory:
        "Focus on indexing, constraints, CTEs, JSONB, transactions, and extensions. PostgreSQL covers most modern product needs before you need a more specialized store.",
      link: "https://www.postgresql.org/docs/current/index.html",
    },
    {
      id: "databases-sql-orms",
      title: "ORMs, Migrations, and Query Builders",
      iconName: "Blocks",
      theory:
        "Use ORMs for productivity, but inspect generated SQL and keep the team capable of dropping to raw queries when performance or correctness requires it.",
      link: "https://orm.drizzle.team/docs/overview",
    },
  ],
};