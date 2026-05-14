import type { TopicNode } from "@/data/types";

export const databasesFundamentals: TopicNode = {
  id: "databases-fundamentals",
  title: "Database Fundamentals",
  iconName: "BookOpen",
  theory:
    "Before choosing a database, you need a clear model for how data is structured, accessed, and kept consistent. The modern baseline is understanding entities, relationships, transactions, indexes, and the tradeoff between normalization and read performance.",
  theoryDetail: {
    keyConcepts: [
      "Data modeling starts from access patterns, not tables alone. Design for the reads and writes your product actually performs.",
      "Primary keys identify records uniquely; foreign keys express relationships and protect referential integrity.",
      "Transactions keep related writes consistent. Use them when multiple changes must succeed or fail together.",
      "Normalization reduces duplication, while denormalization can improve read speed in hot paths.",
    ],
    whyItMatters:
      "Most application performance and correctness issues eventually trace back to the data layer. Engineers who understand modeling and consistency make better schema decisions, debug production issues faster, and avoid expensive migrations later.",
    commonPitfalls: [
      "Designing the schema before understanding the API and query patterns.",
      "Using UUIDs, timestamps, and counters without considering sort order and index size.",
      "Treating the ORM model as the database design instead of validating the actual SQL or document shape.",
    ],
    examples: [
      {
        title: "Start from the access pattern",
        description: "Shape the model around the product questions you need to answer quickly.",
        code: `Product questions:
- Show the latest orders for one customer
- Find unpaid invoices older than 30 days
- Aggregate monthly revenue by plan

Schema implications:
- orders(customer_id, created_at)
- invoices(status, due_date)
- payments(plan_id, paid_at, amount)

Index implication:
- CREATE INDEX idx_orders_customer_created_at
  ON orders (customer_id, created_at DESC);`,
        language: "sql",
      },
    ],
  },
  children: [
    {
      id: "databases-acid-cap",
      title: "Consistency Models",
      iconName: "Shield",
      theory:
        "Relational systems usually optimize for strong consistency and transactions, while distributed systems often trade that for availability or partition tolerance. You need to know when eventual consistency is acceptable and when it is not.",
      link: "https://jepsen.io/consistency",
    },
    {
      id: "databases-schema-migrations",
      title: "Schema Changes and Migrations",
      iconName: "GitBranch",
      theory:
        "Safe migrations are additive first: add new columns, backfill, cut over reads and writes, then remove old structures after deployment risk is gone.",
      link: "https://www.prisma.io/docs/orm/prisma-migrate/understanding-prisma-migrate/overview",
    },
  ],
};