import type { TopicNode } from "@/data/types";

export const nodeDatabases: TopicNode = {
  id: "node-databases",
  title: "Working with Databases",
  iconName: "Database",
  theory:
    "Most Node.js backends connect to a database. Learn how to work with SQL databases using an ORM like Prisma, and with MongoDB using Mongoose, including connection management and query patterns.",
  theoryDetail: {
    keyConcepts: [
      "Use connection pools — opening a new connection per request exhausts database resources",
      "ORMs (Prisma, TypeORM) provide type-safe queries; raw drivers give more control but require more boilerplate",
      "Always parameterize queries — never concatenate user input into SQL strings",
    ],
    whyItMatters:
      "The database layer is the most critical and vulnerable part of most applications. Understanding how to connect, query, and close connections safely is fundamental to building production-grade backends.",
    commonPitfalls: [
      "Not using connection pools causing 'too many connections' errors under load",
      "Running N+1 queries — fetching a list then querying each item individually",
      "Not handling database errors distinctly — a unique constraint violation needs a 409, not a 500",
    ],
    examples: [
      {
        title: "Repository-layer error mapping",
        description:
          "Translate low-level database errors into stable API-level error responses.",
        code: `export async function createUser(input) {
  try {
    return await db.user.create({ data: input });
  } catch (error) {
    if (isUniqueViolation(error, 'users_email_key')) {
      throw new AppError('Email already exists', 409);
    }
    throw new AppError('Database write failed', 500);
  }
}`,
        language: "javascript",
      },
    ],
  },
  children: [
    {
      id: "node-prisma",
      title: "Prisma ORM",
      iconName: "Table",
      link: "https://www.prisma.io/docs",
      theory:
        "Prisma is a type-safe ORM for Node.js and TypeScript. It generates a client from your schema file, giving you fully typed queries with auto-completion in your IDE.",
      theoryDetail: {
        keyConcepts: [
          "schema.prisma defines models, relations, and the database provider",
          "prisma migrate dev auto-generates and applies SQL migrations",
          "PrismaClient should be a singleton — instantiating it per request wastes connection pool slots",
        ],
        whyItMatters:
          "Prisma eliminates a whole class of SQL typos and field-name mismatches at compile time. The generated types stay in sync with your database schema automatically.",
        commonPitfalls: [
          "Instantiating new PrismaClient() in every module — keep a singleton in db.ts",
          "Forgetting to run prisma generate after changing schema.prisma",
          "Using findMany() without pagination on large tables causing memory exhaustion",
        ],
        examples: [
          {
            title: "Prisma CRUD operations",
            description: "Common create, read, update, and delete patterns with Prisma.",
            code: `// db.ts — singleton client
import { PrismaClient } from '@prisma/client';
export const db = new PrismaClient();

// Create
const user = await db.user.create({
  data: { name: 'Alice', email: 'alice@example.com' },
});

// Read with pagination
const users = await db.user.findMany({
  skip: 0,
  take: 20,
  orderBy: { createdAt: 'desc' },
});

// Update
await db.user.update({
  where: { id: user.id },
  data: { name: 'Alice Smith' },
});

// Delete
await db.user.delete({ where: { id: user.id } });`,
            language: "javascript",
          },
        ],
      },
    },
    {
      id: "node-mongoose",
      title: "MongoDB with Mongoose",
      iconName: "Leaf",
      link: "https://mongoosejs.com/docs/",
      theory:
        "Mongoose provides schema-based modeling for MongoDB in Node.js. Schemas add validation, casting, and middleware (hooks) on top of raw MongoDB documents.",
      theoryDetail: {
        keyConcepts: [
          "Mongoose schemas define the document shape; Models provide the query interface",
          "Virtuals compute derived fields without storing them in the database",
          "Pre/post middleware (hooks) run before/after save, validate, find, etc.",
        ],
        whyItMatters:
          "MongoDB's schema-less nature is powerful but dangerous without validation. Mongoose schemas catch structural errors early and make collections predictable.",
        commonPitfalls: [
          "Calling mongoose.connect() on every request — connect once at startup and reuse",
          "Using Model.find() without .lean() on read-only queries — full documents are much heavier",
          "Not indexing frequently queried fields causing full collection scans",
        ],
        examples: [
          {
            title: "Mongoose schema and model",
            description: "Define a schema, create a model, and perform basic operations.",
            code: `import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  createdAt: { type: Date, default: Date.now },
});

userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);

// Create
const user = await User.create({ name: 'Alice', email: 'alice@example.com' });

// Read — .lean() returns plain objects (faster for reads)
const users = await User.find({ name: /Alice/ }).lean().limit(20);

// Update
await User.findByIdAndUpdate(id, { name: 'Alice Smith' }, { new: true });`,
            language: "javascript",
          },
        ],
      },
    },
    {
      id: "node-sql-raw",
      title: "PostgreSQL with node-postgres",
      iconName: "HardDrive",
      link: "https://node-postgres.com/",
      theory:
        "node-postgres (pg) is the low-level driver for PostgreSQL. Use it directly when you need raw SQL control, or as the base for query builders like Kysely.",
      theoryDetail: {
        keyConcepts: [
          "Pool from 'pg' manages a set of reusable connections — use it instead of Client",
          "Parameterized queries ($1, $2) prevent SQL injection — never template user input",
          "Transactions group queries atomically: BEGIN → queries → COMMIT / ROLLBACK",
        ],
        whyItMatters:
          "Sometimes ORMs obscure what SQL is actually executed. Knowing the raw driver helps you debug performance issues and write complex queries that ORMs cannot express efficiently.",
        commonPitfalls: [
          "String-interpolating user input into queries — always use parameterized $1 placeholders",
          "Forgetting to release clients back to the pool causing connection leaks",
          "Not wrapping multi-step operations in transactions leaving data in inconsistent state",
        ],
        examples: [
          {
            title: "Connection pool and parameterized query",
            description: "Safe query pattern with connection pool and transaction.",
            code: `import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Simple query
const { rows } = await pool.query(
  'SELECT * FROM users WHERE email = $1',
  [email]
);

// Transaction
const client = await pool.connect();
try {
  await client.query('BEGIN');
  await client.query('INSERT INTO orders(user_id) VALUES($1)', [userId]);
  await client.query('UPDATE inventory SET qty = qty - 1 WHERE id = $1', [itemId]);
  await client.query('COMMIT');
} catch (err) {
  await client.query('ROLLBACK');
  throw err;
} finally {
  client.release();
}`,
            language: "javascript",
          },
        ],
      },
    },
    {
      id: "node-caching-db",
      title: "Caching with Redis",
      iconName: "Zap",
      link: "https://redis.io/docs/clients/nodejs/",
      theory:
        "Redis is an in-memory data store used for caching, session storage, and pub/sub. The ioredis or node-redis clients give you a fast, type-safe interface to Redis.",
      theoryDetail: {
        keyConcepts: [
          "SET key value EX 60 stores with a 60-second TTL — always set TTLs to prevent stale data",
          "Cache-aside pattern: check cache first, fall back to DB on miss, then warm the cache",
          "Use Redis as the session store with connect-redis to share sessions across multiple server instances",
        ],
        whyItMatters:
          "Caching can cut database load by 80–90% for read-heavy workloads. Redis also enables horizontal scaling by moving shared state out of individual Node processes.",
        commonPitfalls: [
          "Caching without TTLs — stale data accumulates and Redis runs out of memory",
          "Not invalidating the cache on writes — clients see stale data until TTL expires",
          "Storing large objects in Redis — serialize only what you need, not full Mongoose documents",
        ],
        examples: [
          {
            title: "Cache-aside pattern",
            description: "Check Redis cache before hitting the database.",
            code: `import { createClient } from 'redis';

const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();

async function getUser(id) {
  const cacheKey = \`user:\${id}\`;

  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const user = await db.user.findUnique({ where: { id } });
  if (user) {
    await redis.set(cacheKey, JSON.stringify(user), { EX: 300 }); // 5 min TTL
  }
  return user;
}`,
            language: "javascript",
          },
        ],
      },
    },
  ],
};
