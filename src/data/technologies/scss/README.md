# SCSS Technology Data

This folder contains the learning content for the SCSS / Sass track.

## Current Structure

```text
scss/
├── README.md
└── index.ts
```

Unlike most other technologies in this repo, the SCSS track currently stores its topic tree inline inside `index.ts` instead of splitting each top-level section into separate files.

## Section Inventory

Top-level sections currently defined in `scss/index.ts` include:

1. SCSS / Sass Fundamentals
2. Core Features
3. Control Directives
4. Maps and Lists
5. Architecture and Best Practices
6. Real-World Patterns
7. Interview Questions

## How It Works

- `scss/index.ts` exports the full `Technology` object and its nested topic tree.
- Shared types are defined in `src/data/types.ts`.

## Maintenance Notes

1. If the SCSS track grows further, split it into one file per top-level section to match the broader project pattern.
2. Prefer modern Sass guidance such as `@use` and `@forward` instead of deprecated `@import`.
3. Keep examples aligned with current CSS and design-system practices.
