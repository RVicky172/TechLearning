import type { TopicNode } from "@/data/types";

export const fullstackDatabases: TopicNode = {
  id: "fullstack-databases",
  title: "Databases (SQL & NoSQL)",
  iconName: "Database",
  theory:
    "Databases persist application data. SQL databases (PostgreSQL, MySQL) enforce a rigid schema and support complex relational queries. NoSQL databases (MongoDB, DynamoDB) offer flexible schemas and horizontal scalability for specific access patterns.",
  theoryDetail: {
    keyConcepts: [
      "SQL: structured, relational, ACID transactions — best for complex queries and data integrity",
      "NoSQL: flexible schema, horizontally scalable — best for high-throughput, document, or key-value workloads",
      "Indexes dramatically speed up queries but add write overhead — index columns you filter and sort on",
    ],
    whyItMatters:
      "Choosing the wrong database or misusing it leads to poor performance at scale, data inconsistencies, or painful migrations. Frontend developers who understand database basics write better queries, avoid N+1 issues, and debug slow pages.",
    commonPitfalls: [
      "Not indexing foreign keys and frequently filtered columns causing full table scans",
      "Using a NoSQL database for highly relational data requiring complex joins",
      "Running queries inside loops — always prefer batch operations or JOINs",
    ],
  },
  children: [
    {
      id: "fullstack-sql",
      title: "SQL Databases",
      iconName: "Table",
      link: "https://www.postgresql.org/docs/current/tutorial.html",
      theory:
        "SQL (Structured Query Language) databases organize data into tables with predefined schemas. ACID transactions guarantee Atomicity, Consistency, Isolation, and Durability — critical for financial and transactional data.",
      theoryDetail: {
        keyConcepts: [
          "Tables, rows, and columns form the relational model; foreign keys link tables",
          "JOINs combine rows from multiple tables: INNER, LEFT, RIGHT, FULL OUTER",
          "Indexes speed up reads; B-tree indexes are the default in most databases",
          "Transactions ensure that multiple operations succeed or fail together — BEGIN / COMMIT / ROLLBACK",
        ],
        whyItMatters:
          "PostgreSQL, MySQL, and SQLite power the majority of web applications. Understanding SQL lets you write efficient queries, design normalized schemas, and avoid the subtle bugs that ORMs can hide.",
        commonPitfalls: [
          "N+1 queries — fetching a list then running a query for each row; use JOINs or batch fetching",
          "Not using parameterized queries — string interpolation opens SQL injection vulnerabilities",
          "Over-normalizing: splitting data into many tables can make simple reads require complex joins",
        ],
        examples: [
          {
            title: "Common SQL patterns",
            description: "JOIN, aggregation, and parameterized query examples.",
            code: `-- JOIN: get users with their post counts
SELECT
  u.id,
  u.name,
  COUNT(p.id) AS post_count
FROM users u
LEFT JOIN posts p ON p.user_id = u.id
GROUP BY u.id, u.name
ORDER BY post_count DESC
LIMIT 10;

-- Parameterized query (prevents SQL injection)
-- In Node.js with node-postgres:
const { rows } = await pool.query(
  'SELECT * FROM users WHERE email = $1 AND active = $2',
  [email, true]
);

-- Transaction
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = $1;
UPDATE accounts SET balance = balance + 100 WHERE id = $2;
COMMIT;`,
            language: "sql",
          },
        ],
      },
    },
    {
      id: "fullstack-nosql",
      title: "NoSQL Databases",
      iconName: "Layers",
      link: "https://www.mongodb.com/nosql-explained",
      theory:
        "NoSQL databases abandon the rigid relational model in favor of flexible schemas optimized for specific data models: documents (MongoDB), key-value (Redis), wide-column (Cassandra), and graphs (Neo4j).",
      theoryDetail: {
        keyConcepts: [
          "Document stores (MongoDB) store JSON-like documents — schema can vary per document",
          "Key-value stores (Redis, DynamoDB) offer O(1) lookups — ideal for caching and sessions",
          "BASE (Basically Available, Soft state, Eventually consistent) vs ACID — most NoSQL is BASE",
          "Denormalization is intentional — duplicate data to optimize for your read patterns",
        ],
        whyItMatters:
          "NoSQL shines for high-write workloads (activity feeds, IoT telemetry), flexible schemas (CMS, product catalogs with varying attributes), and horizontal scaling beyond what a single SQL server can handle.",
        commonPitfalls: [
          "Treating MongoDB like a relational DB and using $lookup (join) everywhere — denormalize instead",
          "Not setting MongoDB indexes — collection scans are catastrophically slow at scale",
          "Choosing NoSQL just because it's 'modern' when your data is highly relational",
        ],
      },
    },
    {
      id: "fullstack-caching",
      title: "Caching with Redis",
      iconName: "Zap",
      link: "https://redis.io/docs/manual/",
      theory:
        "Caching stores the results of expensive operations in fast memory so subsequent requests can skip the computation or database query. Redis is the industry-standard in-memory cache, session store, and message broker.",
      theoryDetail: {
        keyConcepts: [
          "Cache-aside pattern: check cache first, fall back to DB on miss, write result to cache",
          "TTL (Time to Live) sets automatic expiry — always set TTLs to prevent stale data buildup",
          "Cache invalidation strategies: TTL expiry, write-through (update cache on write), or event-based purge",
          "Redis data structures: Strings, Lists, Sets, Sorted Sets, Hashes, Streams",
        ],
        whyItMatters:
          "A well-placed cache can reduce database load by 80–90% for read-heavy workloads. Redis also enables horizontal scaling by providing shared state (sessions, rate limit counters) across multiple server instances.",
        commonPitfalls: [
          "Caching without TTLs causing memory exhaustion as stale data accumulates",
          "Thundering herd: cache expiry causes all servers to hit the DB simultaneously — use jitter on TTLs",
          "Not invalidating related cache entries on writes leading to stale UI until TTL expires",
        ],
        examples: [
          {
            title: "Cache-aside pattern",
            description: "Read-through caching with Redis before hitting the database.",
            code: `import { createClient } from 'redis';

const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();

async function getProduct(id: string) {
  const key = \`product:\${id}\`;

  // 1. Check cache
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  // 2. Cache miss — query database
  const product = await db.products.findUnique({ where: { id } });
  if (!product) return null;

  // 3. Populate cache with 5-minute TTL
  await redis.set(key, JSON.stringify(product), { EX: 300 });
  return product;
}

// Invalidate on update
async function updateProduct(id: string, data: Partial<Product>) {
  const updated = await db.products.update({ where: { id }, data });
  await redis.del(\`product:\${id}\`); // clear stale cache
  return updated;
}`,
            language: "javascript",
          },
        ],
      },
    },
  ],
};
