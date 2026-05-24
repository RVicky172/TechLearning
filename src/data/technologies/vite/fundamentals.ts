import type { TopicNode } from "@/data/types";

export const viteFundamentals: TopicNode = {
  id: "vite-fundamentals",
  title: "Why Vite is Fast",
  iconName: "Zap",
  link: "https://vite.dev/guide/why.html",
  theory:
    "Vite is a build tool that exploits native ES Modules in modern browsers to serve source files without bundling during development. The server starts in under 300 ms regardless of app size, and Hot Module Replacement (HMR) updates only the changed module — not the whole page. Production builds use Rollup for optimised, tree-shaken output.",
  theoryDetail: {
    keyConcepts: [
      "Native ESM dev server: Vite serves each file as an ES Module; the browser imports only what it needs — no upfront bundle step",
      "Dependency pre-bundling: third-party packages from node_modules are pre-bundled with esbuild (written in Go, 10–100× faster than JS bundlers) into single ESM files on first start",
      "HMR (Hot Module Replacement): only the changed module is re-evaluated; React component state is preserved across edits using @vitejs/plugin-react",
      "Production bundling: Vite uses Rollup for production — code splitting, tree shaking, and asset hashing are handled automatically",
      "Environment variables: VITE_-prefixed vars in .env files are statically replaced in the browser bundle; other vars remain server-only",
      "Plugins: Vite's plugin API is a superset of Rollup's — official plugins for React, Vue, Svelte, PWA, and more",
    ],
    whyItMatters:
      "Development experience directly affects productivity. Webpack cold starts of 30+ seconds and HMR delays of 2–5 seconds have been replaced by sub-second starts and instant updates with Vite. All major React meta-frameworks (Remix, TanStack Start) and non-Next.js projects now default to Vite.",
    commonPitfalls: [
      "Accessing process.env directly in client code — Vite replaces import.meta.env.VITE_* at build time; process.env is Node.js only",
      "Forgetting the VITE_ prefix — environment variables without it are not exposed to the browser bundle (security feature, not a bug)",
      "Assuming Vite = Webpack — Vite uses Rollup for production, which has different code-splitting behaviour and plugin ecosystem",
      "Using require() in source files — Vite is ESM-first; use import/export; CJS interop exists but is a fallback not a goal",
    ],
    examples: [
      {
        title: "Scaffold and configure a React + TypeScript Vite project",
        description: "The canonical setup and vite.config.ts patterns every project needs.",
        code: `# Create project
npm create vite@latest my-app -- --template react-ts
cd my-app && npm install && npm run dev

# Other templates: vanilla, vue, svelte, lit, react-swc-ts`,
        language: "bash",
      },
    ],
  },
};
