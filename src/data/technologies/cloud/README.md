# Cloud Technology Data

This folder contains the learning content for the Cloud Infrastructure track. The content focuses on the practical skills needed to deploy, operate, and secure modern cloud applications.

## Current Structure

```text
cloud/
├── README.md
├── index.ts
├── fundamentals.ts
├── compute.ts
├── containers.ts
├── delivery.ts
└── reliability.ts
```

## Section Inventory

Top-level order in `cloud/index.ts`:

1. Cloud Fundamentals
2. Compute Models
3. Containers and Orchestration
4. Infrastructure as Code and Delivery
5. Reliability, Security, and Cost

Current coverage includes CI/CD, progressive delivery, and deploying applications to cloud platforms.

## How It Works

- Each file exports one named `TopicNode`.
- `cloud/index.ts` assembles the `Technology` object for the catalog.
- Shared types are defined in `src/data/types.ts`.

## Maintenance Notes

1. Favor platform-agnostic cloud concepts before provider-specific details.
2. Include real deployment and operations concerns such as rollout strategy, secrets, observability, and cost.
3. Keep this README aligned with the actual section order in `cloud/index.ts`.
