import type { TopicNode } from "@/data/types";

export const databasesChoosing: TopicNode = {
  id: "databases-choosing",
  title: "Choosing the Right Database",
  iconName: "GitBranch",
  theory:
    "There is no universally best database. The right choice depends on your data model, access patterns, consistency requirements, team expertise, and operational constraints. Most production systems use multiple databases together — one for durable records, one for caching, one for search.",
  theoryDetail: {
    keyConcepts: [
      "Start with PostgreSQL: for any new project without extreme scale requirements, PostgreSQL + pgvector + pg full-text search covers 80% of needs in a single engine you only have to operate and back up once",
      "Add Redis for: ephemeral caching (TTL-based), pub/sub, rate limiting counters, session storage, queues (BullMQ) — anything that can be reconstructed if lost",
      "Add Elasticsearch/Typesense when: you need relevance ranking, fuzzy search, faceted navigation, or auto-complete across millions of documents where pg full-text search starts to struggle",
      "Choose MongoDB when: your data is truly document-shaped with highly variable structure and you need horizontal sharding from the start — not just because JSON feels convenient",
      "Choose DynamoDB when: you need single-digit-ms latency at any scale with zero server management and can design your schema around a known set of access patterns up front",
      "Choose Cassandra/ScyllaDB when: you need millions of writes/second, global multi-region active-active replication, and can accept eventual consistency",
      "Choose a time-series DB (TimescaleDB, InfluxDB) when: you're ingesting sensor, metrics, or financial data where most queries filter by time range and aggregate",
      "Choose Neo4j when: your queries traverse deep relationships (friend-of-friend-of-friend) and would require many self-joins in SQL",
    ],
    whyItMatters:
      "Database migration is one of the most expensive engineering projects. Getting the choice right early (or knowing how to evolve safely) saves months of work. This is consistently a senior engineering interview topic.",
    commonPitfalls: [
      "MongoDB for everything because it's 'flexible' — flexibility means no enforced schema, which leads to inconsistent documents and hard-to-query data at scale",
      "Premature microservice database splitting — start with one database and split only when you have a concrete reason (team ownership boundary, independent scaling requirement, isolation for compliance)",
      "Ignoring managed vs self-hosted cost — self-hosting Elasticsearch on EC2 is operationally heavy; Elastic Cloud or OpenSearch Serverless may be cheaper total cost of ownership",
    ],
    examples: [
      {
        title: "Decision tree: which database?",
        description:
          "A practical heuristic for choosing a database type at project start.",
        code: `Need a database?
│
├─ Data has fixed structure + need transactions?
│   └─ PostgreSQL (default choice)
│       ├─ Need vectors/AI search?   → + pgvector extension
│       ├─ Need full-text search?    → + tsvector / Typesense
│       └─ Need time-series?         → + TimescaleDB extension
│
├─ Need extreme write throughput (millions/s, global)?
│   └─ Cassandra / ScyllaDB / DynamoDB
│
├─ Need ephemeral caching / pub-sub / rate-limits?
│   └─ Redis (alongside your primary DB)
│
├─ Need full-text search with relevance ranking at scale?
│   └─ Elasticsearch / Meilisearch / Typesense
│
├─ Need vector/semantic search?
│   └─ pgvector (in Postgres) OR Pinecone / Qdrant
│
├─ Need relationship traversal (social graph, fraud)?
│   └─ Neo4j / Amazon Neptune
│
└─ Need flexible document storage + horizontal sharding?
    └─ MongoDB / Firestore

Popular managed combos:
  Startup:     Supabase (Postgres) + Upstash Redis
  Mid-scale:   Neon (serverless Postgres) + Upstash Redis + Typesense
  Enterprise:  RDS Aurora + ElastiCache + OpenSearch + DynamoDB (for hot paths)`,
        language: "bash",
      },
    ],
  },
};
