# Databases Technology Data

This folder contains the learning content for the Databases track. The material covers relational systems, NoSQL, operational performance, caching, and modern data workloads used in production today.

## Current Structure

```text
databases/
├── README.md
├── index.ts
├── fundamentals.ts
├── sql.ts
├── nosql.ts
├── performance.ts
└── modernData.ts
```

## Section Inventory

Top-level order in `databases/index.ts`:

1. Database Fundamentals
2. SQL and Relational Systems
3. NoSQL Systems
4. Performance, Caching, and Operations
5. Modern Data Workloads

## How It Works

- Each file exports one named `TopicNode`.
- `databases/index.ts` assembles the `Technology` object used by the app.
- Shared curriculum types live in `src/data/types.ts`.

## Maintenance Notes

1. Prefer concrete production tradeoffs over generic database definitions.
2. Cover query shape, indexing, consistency, and operational risk when relevant.
3. Keep examples realistic enough to teach real schema and workload decisions.
