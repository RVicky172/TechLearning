# Webpack Technology Data

This folder contains the learning content for the Webpack track. It focuses on the bundler concepts most relevant to production frontend applications: core configuration, optimization, and advanced behavior.

## Current Structure

```text
webpack/
├── README.md
├── index.ts
├── core.ts
├── optimization.ts
└── advanced.ts
```

## Section Inventory

Top-level order in `webpack/index.ts`:

1. Webpack Core
2. Optimization
3. Advanced Webpack

## How It Works

- Each file exports one named `TopicNode`.
- `webpack/index.ts` assembles the `Technology` object for the app.
- Shared types are defined in `src/data/types.ts`.

## Maintenance Notes

1. Keep topics focused on concepts developers still encounter in real build systems.
2. Prefer production concerns such as code splitting, caching, loaders, plugins, and performance.
3. Update this README when the webpack section layout changes.
