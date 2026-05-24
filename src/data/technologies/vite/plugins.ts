import type { TopicNode } from "@/data/types";

export const vitePlugins: TopicNode = {
  id: "vite-plugins",
  title: "Plugins & Optimisation",
  iconName: "Package",
  link: "https://vite.dev/plugins/",
  theory:
    "Vite's plugin system is a superset of Rollup plugins, extended with Vite-specific hooks for dev-server features like HMR. Official first-party plugins cover the major frameworks; the ecosystem provides everything from SVG imports to PWA generation.",
  theoryDetail: {
    keyConcepts: [
      "@vitejs/plugin-react: Babel-based React plugin — JSX transform, Fast Refresh (HMR with state preservation)",
      "@vitejs/plugin-react-swc: SWC-based alternative — same features, 20× faster transforms, recommended for large codebases",
      "vite-plugin-svgr: import SVGs as React components (import Logo from './logo.svg?react')",
      "vite-tsconfig-paths: automatically syncs tsconfig paths to Vite resolve.alias — eliminates manual duplication",
      "rollup-plugin-visualizer: generates an interactive treemap of your bundle — find what's making it large",
      "@vite-pwa/vite-plugin: generates service worker, manifest, and icons for Progressive Web Apps",
      "Plugin hooks: transformIndexHtml, resolveId, load, transform — custom plugins can intercept any step of the pipeline",
    ],
    whyItMatters:
      "The right plugins dramatically reduce boilerplate. vite-tsconfig-paths eliminates double-maintaining alias configs; visualizer surfaces bundle size regressions before they ship; react-swc cuts transform time on large codebases from seconds to milliseconds.",
    commonPitfalls: [
      "Mixing @vitejs/plugin-react and @vitejs/plugin-react-swc — only install one; they both handle JSX transform and conflict",
      "Not auditing bundle size — add rollup-plugin-visualizer to CI to catch accidental large imports (lodash instead of lodash-es, moment instead of date-fns)",
      "Writing custom plugins that run expensive transforms on every module — use the enforce option and filter with id.endsWith() to limit scope",
    ],
    examples: [
      {
        title: "Plugin setup — React SWC, SVG as components, path sync, bundle analysis",
        description: "A complete plugin array for a production React app.",
        code: `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    // React with SWC (fast Rust-based transforms + HMR)
    react(),

    // Import SVGs as React components
    // Usage: import Logo from "@/assets/logo.svg?react";
    svgr(),

    // Auto-sync tsconfig paths → no duplication in vite.config.ts
    tsconfigPaths(),

    // Bundle analysis — only in analyse mode
    // Run: ANALYZE=true npm run build  → opens stats.html
    process.env.ANALYZE === "true" &&
      visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
        filename: "dist/stats.html",
      }),
  ].filter(Boolean),
});`,
        language: "typescript",
      },
    ],
  },
};
