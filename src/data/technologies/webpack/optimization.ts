import type { TopicNode } from "@/data/types";

const codeSplitting: TopicNode = {
  id: "webpack-code-splitting",
  title: "Code Splitting",
  iconName: "Scissors",
  link: "https://webpack.js.org/guides/code-splitting/",
  theory:
    "Code splitting breaks a large bundle into smaller chunks that are loaded on demand. Instead of shipping all code upfront, users download only what they need for the current page. Webpack supports three approaches: multiple entry points, the SplitChunksPlugin (automatic vendor splitting), and dynamic import() for lazy loading.",
  theoryDetail: {
    keyConcepts: [
      "Entry-point splitting: define multiple entry points — webpack emits one bundle per entry",
      "SplitChunksPlugin: automatically extracts shared code (e.g. node_modules) into a vendor chunk — prevents duplicating dependencies across bundles",
      "Dynamic import(): import('./module') returns a Promise — webpack emits a separate async chunk loaded on demand",
      "React.lazy() + Suspense: wraps dynamic import() for lazy React component loading",
      "Magic comments: /* webpackChunkName: 'my-chunk' */ names the async chunk in the output",
      "Preloading vs prefetching: /* webpackPreload: true */ (load with parent) vs /* webpackPrefetch: true */ (load when idle)",
    ],
    whyItMatters:
      "A 5MB JavaScript bundle on initial load kills mobile performance. Code splitting is the primary technique for keeping initial bundle size small. Next.js and Create React App implement code splitting automatically via webpack — understanding why helps you diagnose bundle size regressions.",
    commonPitfalls: [
      "Not splitting vendor code — React + ReactDOM (>140KB gzipped) re-downloads on every deploy if in the main bundle",
      "Over-splitting into too many tiny chunks — HTTP/2 helps but too many round trips still hurts",
      "Forgetting Suspense fallback with React.lazy() — throws an error if no Suspense boundary is present",
    ],
    examples: [
      {
        title: "SplitChunksPlugin, dynamic import, and React.lazy code splitting",
        description: "From automatic vendor splitting to on-demand component loading.",
        code: `// ─── SplitChunksPlugin — vendor chunk separation ───
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: "all",  // split both sync and async chunks
      cacheGroups: {
        // Separate vendor bundle (third-party code changes rarely)
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
          priority: 20,
        },
        // Separate React from other vendors (most important lib)
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: "react",
          chunks: "all",
          priority: 30,  // higher priority → matched first
        },
        // Shared code used in 2+ chunks
        common: {
          name: "common",
          minChunks: 2,       // used in at least 2 chunks
          minSize: 20000,     // only split if chunk is > 20KB
          priority: 10,
          reuseExistingChunk: true,
        },
      },
    },
  },
};

// ─── Dynamic import() — lazy loading ───
// Without code splitting: entire UserDashboard loads upfront
import UserDashboard from "./UserDashboard";

// With code splitting: UserDashboard downloads only when called
async function loadDashboard() {
  const module = await import(
    /* webpackChunkName: "user-dashboard" */
    /* webpackPrefetch: true */            // prefetch when browser is idle
    "./UserDashboard"
  );
  return module.default;
}

// ─── React.lazy + Suspense (the standard React pattern) ───
import React, { lazy, Suspense } from "react";

// Each lazy() wraps a dynamic import — webpack creates a separate chunk
const UserDashboard = lazy(() => import("./UserDashboard"));
const AdminPanel    = lazy(() => import("./AdminPanel"));
const Analytics     = lazy(() => import("./Analytics"));

function App() {
  const [page, setPage] = React.useState("home");

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {page === "dashboard" && <UserDashboard />}
      {page === "admin"     && <AdminPanel />}
      {page === "analytics" && <Analytics />}
    </Suspense>
  );
}

// ─── Route-level splitting (React Router pattern) ───
import { BrowserRouter, Route, Routes } from "react-router-dom";

const Home    = lazy(() => import("./pages/Home"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));

function Router() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/profile"  element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

function PageSkeleton() {
  return <div className="skeleton-loader" />;
}`,
        language: "typescript",
        output: `WITHOUT CODE SPLITTING
═══════════════════════════════════════════════════
  dist/
  └── main.js  (3.2 MB)  ← everything, always downloaded

  Initial load: 3.2 MB  → user waits for routes they may never visit

WITH CODE SPLITTING
═══════════════════════════════════════════════════
  dist/
  ├── react.ff11ee22.js          (142 KB)  ← cached long-term
  ├── vendors.a1b2c3d4.js        (380 KB)  ← cached long-term
  ├── common.c3d4e5f6.js         ( 45 KB)  ← shared code
  ├── main.e5f6a7b8.js           ( 28 KB)  ← app shell
  ├── user-dashboard.b8c9d0.js   (210 KB)  ← loaded on /dashboard
  ├── admin-panel.d1e2f3.js      (180 KB)  ← loaded on /admin
  └── analytics.f4a5b6.js        (340 KB)  ← loaded on /analytics

  Initial load: 28 KB + 45 KB + 142 KB = 215 KB ✅ (7× smaller!)
  Dashboard page: +210 KB (only when user navigates there)

PRELOAD vs PREFETCH
═══════════════════════════════════════════════════
  webpackPreload:true   → <link rel="preload">
    Loads in parallel with parent chunk (high priority)
    Use for: chunks definitely needed for current page

  webpackPrefetch:true  → <link rel="prefetch">
    Loads during browser idle time (low priority)
    Use for: chunks likely needed soon (next page)`,
      },
    ],
  },
};

const treeShaking: TopicNode = {
  id: "webpack-tree-shaking",
  title: "Tree Shaking & Bundle Analysis",
  iconName: "Zap",
  link: "https://webpack.js.org/guides/tree-shaking/",
  theory:
    "Tree shaking is dead code elimination — webpack statically analyses ES module import/export graphs and removes exports that are never used. It only works with ES modules (import/export), not CommonJS (require). The result is a smaller bundle that contains only the code your app actually uses.",
  theoryDetail: {
    keyConcepts: [
      "Static analysis: webpack reads import/export statements at build time — no code runs during analysis",
      "sideEffects: false in package.json: tells webpack the package has no side effects — it can safely drop unused exports",
      "Named exports tree-shake better than default exports — bundlers can eliminate individual named exports",
      "CommonJS (require) does not tree-shake — the entire module is included",
      "usedExports + TerserPlugin: webpack marks unused exports, Terser removes them",
      "scope hoisting (ModuleConcatenationPlugin): merges module scope into one — further reduces size and runtime overhead",
    ],
    whyItMatters:
      "A common mistake is importing { debounce } from 'lodash' which includes the entire 70KB lodash library. With tree shaking via 'lodash-es' or individual imports, only debounce (~2KB) is included. Bundle analysis reveals exactly which packages are causing bloat.",
    commonPitfalls: [
      "import 'lodash' or import _ from 'lodash' — CJS lodash, no tree shaking. Use lodash-es or import { debounce } from 'lodash/debounce'",
      "Babel transpiling ES modules to CJS — set @babel/preset-env modules: false to preserve ESM for webpack",
      "Missing sideEffects in package.json — webpack conservatively includes everything",
    ],
    examples: [
      {
        title: "Tree shaking configuration and bundle analysis workflow",
        description: "How to configure tree shaking and find what's bloating your bundle.",
        code: `// ─── Tree shaking requires: ───
// 1. ES module syntax (import/export, not require)
// 2. mode: "production" (enables usedExports optimisation)
// 3. Babel not converting ESM to CJS

// babel.config.js — preserve ESM for webpack tree shaking
module.exports = {
  presets: [
    ["@babel/preset-env", {
      modules: false,  // ← CRITICAL: let webpack handle modules, not Babel
      // If Babel converts to CJS, webpack cannot tree-shake
    }],
    "@babel/preset-typescript",
    ["@babel/preset-react", { runtime: "automatic" }],
  ],
};

// ─── sideEffects in package.json ───
// In your project's package.json:
{
  "name": "my-app",
  "sideEffects": [
    "*.css",           // CSS files have side effects (they style things)
    "*.scss",
    "./src/polyfills.ts"  // polyfills mutate globals — can't tree-shake
  ]
  // All other files: no side effects → can safely tree-shake unused exports
}

// ─── Named exports tree-shake; default exports don't ───

// utils/math.ts
export const add      = (a: number, b: number) => a + b;  // ✅ tree-shakeable
export const subtract = (a: number, b: number) => a - b;  // ✅ can be removed
export const multiply = (a: number, b: number) => a * b;  // ✅ can be removed

// main.ts — only add is used
import { add } from "./utils/math";  // subtract & multiply are eliminated ✅

// ─── Lodash: the most common tree-shaking mistake ───

// ❌ Entire lodash library (~70KB) — no tree shaking
import _ from "lodash";
import { debounce } from "lodash";  // still imports all of lodash

// ✅ Only debounce (~2KB) — tree-shakeable
import { debounce } from "lodash-es";  // lodash as ES modules

// ✅ Direct path import (also works with CJS lodash)
import debounce from "lodash/debounce";

// ─── Bundle analysis ───
// Install: npm install --save-dev webpack-bundle-analyzer
// webpack.config.js
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
module.exports = {
  plugins: [
    ...(process.env.ANALYZE
      ? [new BundleAnalyzerPlugin({
          analyzerMode: "static",           // generate report.html file
          reportFilename: "bundle-report.html",
          openAnalyzer: true,
          defaultSizes: "gzip",             // show gzipped sizes
        })]
      : []),
  ],
};
// Run: ANALYZE=true npm run build → opens interactive treemap in browser`,
        language: "typescript",
        output: `TREE SHAKING — WHAT GETS ELIMINATED
═══════════════════════════════════════════════════
  export const a = () => "used";
  export const b = () => "unused";   // ← eliminated
  export const c = () => "unused";   // ← eliminated

  After tree shaking + minification:
  const a=()=>"used";export{a};

  Result: bundle is smaller by whatever b + c compile to

LODASH SIZE COMPARISON (gzipped)
═══════════════════════════════════════════════════
  import _ from 'lodash'           → ~24 KB gzipped
  import { debounce } from 'lodash' → ~24 KB (whole lib, CJS)
  import { debounce } from 'lodash-es' → ~2 KB ✅
  import debounce from 'lodash/debounce' → ~2 KB ✅

BUNDLE ANALYSER TREEMAP
═══════════════════════════════════════════════════
  Each rectangle = a module, sized by its bundle contribution
  Darker = deeper nesting (dependencies of dependencies)

  ┌──────────────────────────────────────────────┐
  │  react-dom (142KB)        │  lodash (68KB) ← │
  │                           │  SHOULD BE 2KB!  │
  ├───────────────────────────┴──────────────────┤
  │  moment.js (67KB) ← consider date-fns        │
  ├──────────────────────────────────────────────┤
  │  your code (28KB)    │  common (12KB)         │
  └──────────────────────────────────────────────┘

  Common bloat sources: lodash, moment, react-icons (full),
  @mui/material (if imported without path), draft-js`,
      },
    ],
  },
};

const devServer: TopicNode = {
  id: "webpack-dev-server",
  title: "Dev Server & HMR",
  iconName: "RefreshCw",
  link: "https://webpack.js.org/configuration/dev-server/",
  theory:
    "webpack-dev-server provides a local development server with Hot Module Replacement (HMR). Instead of reloading the entire page on every change, HMR surgically replaces only the changed modules while preserving application state — React components update without losing component state.",
  theoryDetail: {
    keyConcepts: [
      "webpack-dev-server: serves bundles from memory (not disk) — much faster than writing to dist",
      "Hot Module Replacement: replaces changed modules without full page reload — preserves state",
      "devServer.proxy: proxies API requests to a backend server — avoids CORS in development",
      "historyApiFallback: returns index.html for all 404s — required for client-side routing (React Router)",
      "devtool: source map strategy — 'eval-source-map' for fast rebuilds with readable errors in dev",
      "watchOptions: tune file watching — can exclude large directories to reduce CPU usage",
    ],
    whyItMatters:
      "HMR is a productivity multiplier for frontend development. React Fast Refresh (used by CRA and Next.js) is built on webpack's HMR API. Understanding proxy configuration is also essential for full-stack development where the frontend and backend run on different ports.",
    commonPitfalls: [
      "Using writeToDisk: true unnecessarily — dev server is faster serving from memory",
      "Missing historyApiFallback for React Router — direct URL navigation returns 404",
      "HTTPS: true without certificate — browser blocks insecure dev servers",
    ],
    examples: [
      {
        title: "webpack-dev-server configuration with HMR, proxy, and HTTPS",
        description: "Development server setup for a full-stack app with a separate API server.",
        code: `// webpack.config.js — devServer section
const path = require("path");

module.exports = {
  mode: "development",

  // ─── Source maps: fast + readable in development ───
  devtool: "eval-source-map",
  // Options by priority:
  //   "eval-source-map"  → fast rebuild, full source maps (dev)
  //   "source-map"       → slow build, external .map file (prod)
  //   "eval"             → fastest, no source maps (CI)
  //   false              → no source maps

  devServer: {
    // ─── Server basics ───
    port: 3000,
    host: "localhost",         // or "0.0.0.0" to expose on local network
    open: true,                // open browser automatically

    // ─── Static file serving ───
    static: {
      directory: path.resolve(__dirname, "public"),  // serve public/ at root
    },

    // ─── React Router: return index.html for all routes ───
    historyApiFallback: true,
    // Without this: /dashboard returns 404 on page refresh

    // ─── Hot Module Replacement ───
    hot: true,  // default true in webpack 5

    // ─── API proxy: avoid CORS in development ───
    proxy: {
      "/api": {
        target: "http://localhost:8080",      // backend server
        changeOrigin: true,                   // changes Host header to target
        pathRewrite: { "^/api": "" },         // /api/users → /users on backend
        // Optional: enable for self-signed certs in dev
        // secure: false,
      },
      "/ws": {
        target: "ws://localhost:8080",
        ws: true,  // enable WebSocket proxying
      },
    },

    // ─── Compression ───
    compress: true,  // gzip responses — simulates production

    // ─── Client overlay (errors shown in browser) ───
    client: {
      overlay: {
        errors: true,
        warnings: false,  // don't overlay for warnings
      },
      progress: true,  // show build progress in browser console
    },

    // ─── File watching optimisation ───
    watchFiles: {
      paths: ["src/**/*.{ts,tsx,css}"],
      options: {
        ignored: /node_modules/,  // don't watch node_modules
        usePolling: false,        // set true in Docker / WSL
      },
    },
  },
};

// ─── HMR in your own code (accept module updates) ───
if (module.hot) {
  // Accept updates to this module and its dependencies
  module.hot.accept("./App", () => {
    const NextApp = require("./App").default;
    render(NextApp);
  });

  // Decline HMR for specific modules (force full reload)
  module.hot.decline("./store");
}`,
        language: "javascript",
        output: `HOT MODULE REPLACEMENT FLOW
═══════════════════════════════════════════════════
  1. You save Button.tsx
  2. webpack recompiles only Button.tsx and its dependants
  3. Dev server sends the new module via WebSocket
  4. HMR runtime replaces the old Button module in memory
  5. React Fast Refresh re-renders components using Button
  6. Component state (useState, useRef) is preserved ✅

  vs Full Page Reload:
  1. Browser navigates to /
  2. All state is reset ❌
  3. You must re-navigate to the same page ❌

DEV SERVER PROXY — SOLVING CORS IN DEVELOPMENT
═══════════════════════════════════════════════════
  Without proxy:
    Browser → localhost:3000/api/users
    Backend: localhost:8080/api/users
    Browser blocks → CORS error ❌

  With devServer.proxy:
    Browser → localhost:3000/api/users
    Dev server → localhost:8080/users  (rewritten)
    Backend responds → dev server forwards to browser ✅
    Same origin from browser's perspective ✅

DEVTOOL SOURCE MAP OPTIONS
═══════════════════════════════════════════════════
  devtool                 Rebuild speed  Quality
  ─────────────────────────────────────────────────
  eval                    ★★★★★ fastest  minimal
  eval-source-map         ★★★★☆          full (dev best)
  cheap-module-source-map ★★★☆☆          line-only
  source-map              ★★☆☆☆ slowest  full (prod)`,
      },
    ],
  },
};

export const webpackOptimization: TopicNode = {
  id: "webpack-optimization",
  title: "Optimization",
  iconName: "Zap",
  link: "https://webpack.js.org/configuration/optimization/",
  theory:
    "Webpack's optimization features are the difference between a 5MB blob and a 200KB initial load. Code splitting delivers only what the user needs. Tree shaking removes what they don't. The dev server with HMR keeps iteration speed fast without sacrificing the production build pipeline.",
  theoryDetail: {
    keyConcepts: [
      "Code splitting: split bundles into lazy-loaded chunks — load only what's needed for each route",
      "Tree shaking: static dead-code elimination — requires ES modules and mode: 'production'",
      "HMR: Hot Module Replacement — update changed modules in-browser without full reload",
      "contenthash: content-based file naming — stable browser caching across deployments",
    ],
    whyItMatters:
      "Performance is a feature. The webpack optimisation pipeline is what separates a 10-second load time from a 1-second load time on mobile. Every React framework (Next.js, CRA, Remix) uses these same techniques.",
    commonPitfalls: [
      "Not separating vendor code — react + react-dom change rarely, they should be in a long-lived cached chunk",
      "Using CJS lodash — imports the entire library instead of just the function you need",
    ],
  },
  children: [codeSplitting, treeShaking, devServer],
};
