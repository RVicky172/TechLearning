# Node.js Technology Data

This folder contains the learning content for the Node.js track. The content covers runtime fundamentals, async patterns, Express, data access, security, testing, performance, and interview preparation.

## Current Structure

```text
nodejs/
├── README.md
├── index.ts
├── fundamentals.ts
├── async.ts
├── express.ts
├── databases.ts
├── security.ts
├── testing.ts
├── performance.ts
└── interviewQuestions.ts
```

## Section Inventory

Top-level order in `nodejs/index.ts`:

1. Fundamentals
2. Async Patterns
3. Express and APIs
4. Working with Databases
5. Authentication and Security
6. Testing
7. Performance
8. Interview Questions

## How It Works

- Each file exports one named `TopicNode`.
- `nodejs/index.ts` assembles the `Technology` object for the app.
- Shared types live in `src/data/types.ts`.

## Maintenance Notes

1. Prefer production-grade Node patterns over toy scripts.
2. Include security and operational tradeoffs where they materially affect backend behavior.
3. Keep this README aligned with the actual top-level section order.
