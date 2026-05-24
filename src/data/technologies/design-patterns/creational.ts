import type { TopicNode } from "@/data/types";

export const patternsCreational: TopicNode = {
  id: "patterns-creational",
  title: "Creational Patterns",
  iconName: "PlusCircle",
  link: "https://refactoring.guru/design-patterns/creational-patterns",
  theory:
    "Creational patterns abstract the object creation process — they decouple the code that creates objects from the code that uses them. The three most important for JavaScript/TypeScript are Singleton, Factory Method, and Builder.",
  theoryDetail: {
    keyConcepts: [
      "Singleton: ensures only one instance of a class exists — e.g. a database connection pool, a logger, a Redis client",
      "Factory Method: defines an interface for creating an object but lets subclasses/callers decide which class to instantiate — common in plugin systems",
      "Abstract Factory: creates families of related objects — e.g. a UI factory that produces a consistent set of Button, Input, Modal components",
      "Builder: constructs a complex object step by step — common in query builders (Knex, Drizzle) and test fixture builders",
      "Prototype: creates new objects by cloning an existing one — useful for object pools and undo/redo stacks",
    ],
    whyItMatters:
      "Creational patterns appear constantly in frameworks. The Singleton is how database connections are managed. The Builder is how ORMs build queries. Recognising them lets you read framework code, write testable code (factories make dependency injection easy), and answer design pattern interview questions confidently.",
    commonPitfalls: [
      "Global Singletons in tests — Singletons carry state between tests; use dependency injection so tests can swap in fresh instances",
      "Over-using Factories — factories add indirection; only add one when the creation logic is complex or needs to vary",
      "Builder methods that mutate and return void instead of this — chain-able builders must return this (or a new instance) from every method",
    ],
    examples: [
      {
        title: "Singleton — database connection pool",
        description:
          "A module-level Singleton in Node.js — guaranteed single instance via module caching.",
        code: `// ── db.ts — module-level Singleton (simplest pattern in Node.js) ─
import { Pool } from "pg";

// Node's module system guarantees this runs only once per process
let pool: Pool | null = null;

export function getDb(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 20,             // max connections in pool
      idleTimeoutMillis: 30_000,
    });
  }
  return pool;
}

// Usage — same pool instance regardless of where this is imported
const db = getDb();

// ── Builder — typesafe query builder ──────────────────────
class QueryBuilder<T> {
  private table = "";
  private conditions: string[] = [];
  private _limit = 100;
  private _orderBy = "";

  from(table: string): this {
    this.table = table;
    return this;               // return this for chaining
  }
  where(condition: string): this {
    this.conditions.push(condition);
    return this;
  }
  limit(n: number): this {
    this._limit = n;
    return this;
  }
  orderBy(col: string, dir: "ASC" | "DESC" = "ASC"): this {
    this._orderBy = \`ORDER BY \${col} \${dir}\`;
    return this;
  }
  build(): string {
    const where = this.conditions.length
      ? \`WHERE \${this.conditions.join(" AND ")}\`
      : "";
    return \`SELECT * FROM \${this.table} \${where} \${this._orderBy} LIMIT \${this._limit}\`.trim();
  }
}

const sql = new QueryBuilder()
  .from("users")
  .where("active = true")
  .where("role = 'admin'")
  .orderBy("created_at", "DESC")
  .limit(20)
  .build();
// "SELECT * FROM users WHERE active = true AND role = 'admin' ORDER BY created_at DESC LIMIT 20"`,
        language: "typescript",
      },
    ],
  },
};
