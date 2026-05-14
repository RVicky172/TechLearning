# DSA Technology Data

This folder contains the learning content for the Data Structures & Algorithms track. The content is organized around core interview and systems foundations: complexity analysis, bitwise reasoning, data structures, and algorithms.

## Current Structure

```text
dsa/
├── README.md
├── index.ts
├── bigO.ts
├── bitwise.ts
├── dataStructures.ts
└── algorithms.ts
```

## Section Inventory

Top-level order in `dsa/index.ts`:

1. Big O Notation
2. Bitwise Operations
3. Data Structures
4. Algorithms

## How It Works

- Each file exports one named `TopicNode`.
- `dsa/index.ts` assembles the final `Technology` object.
- Shared types are defined in `src/data/types.ts`.

## Maintenance Notes

1. Keep explanations rigorous but concise enough to scan.
2. Prefer examples that connect complexity analysis to actual implementation choices.
3. Update this README when new DSA sections are added.
