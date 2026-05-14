# TypeScript Technology Data

This folder contains the learning content for the TypeScript track. The content is split across setup, language fundamentals, advanced type-system features, practical usage, and interview preparation.

## Current Structure

```text
typescript/
├── README.md
├── index.ts
├── setup.ts
├── buildTools.ts
├── fileTypes.ts
├── fundamentals.ts
├── advanced.ts
├── functions.ts
├── classes.ts
├── enumsAndLiterals.ts
├── modulesAndConfig.ts
├── inPractice.ts
├── interviewQuestions.ts
└── interviewQuestions/
    ├── index.ts
    ├── easy.ts
    ├── medium.ts
    └── hard.ts
```

## Section Inventory

Top-level order in `typescript/index.ts`:

1. Setup
2. Build Tools
3. File Types
4. Fundamentals
5. Advanced Types
6. Functions
7. Classes
8. Enums and Literals
9. Modules and Configuration
10. In Practice
11. Interview Questions

## How It Works

- Each top-level file exports one named `TopicNode`.
- `interviewQuestions.ts` re-exports the nested interview questions section.
- `typescript/index.ts` assembles the final `Technology` object.
- Shared types live in `src/data/types.ts`.

## Maintenance Notes

1. Keep examples strongly typed and realistic rather than purely academic.
2. When adding advanced topics, favor production TypeScript usage over obscure type puzzles.
3. Update this README whenever the section map changes.
