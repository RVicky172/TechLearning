import type { TopicNode } from "@/data/types";

export const databasesRelational: TopicNode = {
  id: "databases-relational",
  title: "Relational Databases",
  iconName: "Table",
  link: "https://www.postgresql.org/docs/current/",
  theory:
    "Relational databases store data in tables with rows and columns, enforce relationships via foreign keys, and guarantee ACID transactions. PostgreSQL, MySQL/MariaDB, and SQLite are the three most-used open-source relational databases — each has a distinct sweet spot.",
  theoryDetail: {
    keyConcepts: [
      "PostgreSQL: the most feature-rich open-source RDBMS — supports JSON/JSONB, full-text search, window functions, CTEs, table inheritance, LISTEN/NOTIFY, logical replication, and extensions like pgvector and PostGIS. Best default choice for new projects.",
      "MySQL / MariaDB: extremely widely deployed (especially in LAMP stacks); faster for simple read-heavy workloads but historically weaker on window functions, CTEs, and transactional DDL. MariaDB is a community fork with extra features.",
      "SQLite: a file-based, single-writer database — no server required, zero setup, perfect for local dev, desktop apps, and edge runtimes (Cloudflare D1, Turso, Bun's built-in SQLite). Not suitable for concurrent write-heavy server workloads.",
      "ACID: Atomicity (all or nothing), Consistency (constraints are never violated), Isolation (concurrent transactions don't interfere), Durability (committed data survives crashes)",
      "Connection pooling: databases have a max connection limit (PostgreSQL default: 100); always use a pool (pg.Pool, PgBouncer, Prisma's built-in pool) — never open a new connection per request",
      "Indexes: a B-Tree index speeds up WHERE, ORDER BY, and JOIN lookups — composite indexes serve multiple query patterns; covering indexes include all selected columns so the table isn't touched",
      "EXPLAIN ANALYZE: run before blaming slow queries on the network — identifies sequential scans, missing indexes, and row estimation errors",
    ],
    whyItMatters:
      "PostgreSQL is the default database for most modern fullstack applications. MySQL remains dominant in legacy and high-traffic sites (WordPress, GitHub historically). SQLite is the most deployed database in the world (in every Android device, browser, and embedded system). Knowing when to use each and how to operate them is a core backend skill.",
    commonPitfalls: [
      "SELECT * in production — always select only the columns you need; SELECT * defeats covering indexes and over-fetches data across the wire",
      "No connection pooling — each new connection costs ~5 MB RAM and time on the database server; pool connections",
      "Missing foreign key indexes — the foreign key constraint only prevents bad data; you must add a separate index on the FK column for join performance",
      "N+1 queries — loading a list of 100 orders and then fetching the customer for each with a separate query = 101 queries; use JOIN or include in the ORM",
    ],
    examples: [
      {
        title: "PostgreSQL: connection pool, window function, and EXPLAIN",
        description:
          "PgBouncer-style connection pooling, rank() window function for leaderboards, and EXPLAIN ANALYZE for query tuning.",
        code: `import { Pool } from "pg";

// ── Connection pool — share across your entire application ─
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,                  // max simultaneous connections
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 3_000,
});

// ── Window function — rank users by total spend ────────────
const { rows: leaderboard } = await pool.query(\`
  SELECT
    user_id,
    SUM(amount)                              AS total_spend,
    RANK() OVER (ORDER BY SUM(amount) DESC) AS rank
  FROM orders
  WHERE status = 'paid'
    AND created_at >= NOW() - INTERVAL '30 days'
  GROUP BY user_id
  ORDER BY rank
  LIMIT 10
\`);

// ── CTE — readable complex queries ────────────────────────
const { rows } = await pool.query(\`
  WITH recent_orders AS (
    SELECT customer_id, COUNT(*) AS order_count
    FROM orders
    WHERE created_at >= NOW() - INTERVAL '7 days'
    GROUP BY customer_id
  )
  SELECT c.id, c.email, ro.order_count
  FROM customers c
  JOIN recent_orders ro ON ro.customer_id = c.id
  WHERE ro.order_count >= 3
  ORDER BY ro.order_count DESC
\`);

-- EXPLAIN ANALYZE — always run before optimising
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
  SELECT * FROM orders
  WHERE customer_id = '550e8400-e29b-41d4-a716-446655440000'
  ORDER BY created_at DESC
  LIMIT 20;

-- Look for: "Seq Scan" → should be "Index Scan"
-- If seq scan: CREATE INDEX idx_orders_customer_created
--   ON orders (customer_id, created_at DESC);`,
        language: "sql",
      },
    ],
  },
  children: [
    {
      id: "databases-mysql",
      title: "MySQL vs PostgreSQL",
      iconName: "ArrowRightLeft",
      theory:
        "MySQL is faster for simple read-heavy workloads and is more widely hosted. PostgreSQL is better for complex queries, JSON storage, full-text search, and correctness. For new projects, default to PostgreSQL; for managed hosting cost sensitivity, PlanetScale (MySQL) or Neon (PostgreSQL) are popular choices.",
      link: "https://dev.mysql.com/doc/refman/8.0/en/",
    },
    {
      id: "databases-sqlite",
      title: "SQLite & Edge Databases",
      iconName: "HardDrive",
      theory:
        "SQLite is the right choice for local development, CLI tools, desktop apps, and edge runtimes. Turso (distributed SQLite), Cloudflare D1, and Bun's built-in SQLite are making it viable for production edge deployments with read replicas close to users.",
      link: "https://www.sqlite.org/index.html",
    },
  ],
};
