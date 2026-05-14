# Fullstack Technology Data

This folder contains the learning content for the Fullstack Concepts track. It connects frontend development to backend systems, APIs, networking, authentication, databases, infrastructure, DevOps, and system design.

## Current Structure

```text
fullstack/
├── README.md
├── index.ts
├── networking.ts
├── apis.ts
├── auth.ts
├── databases.ts
├── infrastructure.ts
├── architecture.ts
├── devops.ts
└── systemDesign.ts
```

## Section Inventory

Top-level order in `fullstack/index.ts`:

1. Networking Basics
2. APIs
3. Authentication and Authorization
4. Databases
5. Infrastructure
6. Architecture
7. DevOps and Deployment
8. System Design

Current topics also cover proxies, real-world authentication methods, authentication attacks, and CI/CD concepts.

## How It Works

- Each file exports one named `TopicNode`.
- `fullstack/index.ts` assembles the `Technology` object used by the app.
- Shared types live in `src/data/types.ts`.

## Maintenance Notes

1. Use this track for broad engineering concepts that cut across frontend, backend, and infrastructure.
2. Avoid duplicating highly specialized technology tracks unless the topic is intentionally foundational here.
3. Keep examples anchored in real production workflows and failure modes.
