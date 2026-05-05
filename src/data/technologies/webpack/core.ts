import type { TopicNode } from "@/data/types";

const whatIsWebpack: TopicNode = {
  id: "webpack-what-is",
  title: "What is Webpack?",
  iconName: "Package",
  link: "https://webpack.js.org/concepts/",
  theory:
    "Webpack is a static module bundler for JavaScript applications. It builds a dependency graph starting from one or more entry points, then bundles all modules — JS, CSS, images, fonts — into one or more output files (bundles). Every file webpack touches is a module, and loaders transform non-JS files into modules webpack understands.",
  theoryDetail: {
    keyConcepts: [
      "Module bundler: resolves import/require statements and combines all files into optimized bundles",
      "Dependency graph: starting from an entry file, webpack recursively maps every import to build a complete graph",
      "Entry: the file(s) where webpack starts building the graph — default: './src/index.js'",
      "Output: where to write the bundle(s) — default: './dist/main.js'",
      "Loaders: transform files before they're added to the graph (e.g. babel-loader transpiles JSX, css-loader handles CSS)",
      "Plugins: perform broader tasks — HTML generation, bundle analysis, environment variables, minification",
      "Mode: 'development' (readable output, source maps) | 'production' (minified, tree-shaken)",
    ],
    whyItMatters:
      "Webpack (or a bundler inspired by it) powers virtually every production React, Angular, and Vue app. Understanding webpack config is essential for debugging build issues, optimising bundle size, and configuring tools like Babel, PostCSS, and TypeScript in non-CRA/Vite projects.",
    commonPitfalls: [
      "Running webpack in development mode in production — output is unminified and much larger",
      "Missing source maps in development — configure devtool: 'eval-source-map' for fast rebuilds with readable stack traces",
      "Forgetting to set process.env.NODE_ENV — many libraries (React, Redux) tree-shake dev warnings based on this",
    ],
    examples: [
      {
        title: "Minimal webpack.config.js and the core concept pipeline",
        description: "Entry → dependency graph → loaders → plugins → output.",
        code: `// webpack.config.js — minimal production-ready config
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  // ─── Mode ───────────────────────────────────────────────
  mode: "production",  // or "development"
  // Sets process.env.NODE_ENV, enables built-in optimizations

  // ─── Entry ──────────────────────────────────────────────
  entry: "./src/index.tsx",
  // Can also be an object for multiple entry points:
  // entry: { app: "./src/index.tsx", admin: "./src/admin.tsx" }

  // ─── Output ─────────────────────────────────────────────
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",  // content-based hash for cache busting
    clean: true,  // remove old dist files before each build
    publicPath: "/",  // base URL for all assets in the browser
  },

  // ─── Resolve ────────────────────────────────────────────
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],  // try these extensions in order
    alias: {
      "@": path.resolve(__dirname, "src"),  // import "@/utils" → src/utils
    },
  },

  // ─── Loaders ────────────────────────────────────────────
  module: {
    rules: [
      {
        test: /\\.tsx?$/,           // match .ts and .tsx files
        use: "babel-loader",        // transpile with Babel (+ @babel/preset-typescript)
        exclude: /node_modules/,
      },
      {
        test: /\\.css$/,
        use: [
          MiniCssExtractPlugin.loader,  // extract CSS into separate file (production)
          "css-loader",                  // resolves @import and url() in CSS
          "postcss-loader",              // runs PostCSS plugins (autoprefixer, tailwind)
        ],
      },
      {
        test: /\\.(png|jpg|gif|svg|webp)$/,
        type: "asset/resource",  // webpack 5 built-in — copies file and emits URL
      },
      {
        test: /\\.(woff2?|eot|ttf)$/,
        type: "asset/resource",
      },
    ],
  },

  // ─── Plugins ────────────────────────────────────────────
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",  // inject bundle <script> tag automatically
      favicon: "./public/favicon.ico",
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
    }),
  ],
};`,
        language: "javascript",
        output: `WEBPACK BUILD PIPELINE
═══════════════════════════════════════════════════
  Entry: src/index.tsx
      │
      ▼
  Dependency Graph
  ┌──────────────────────────────────────────────┐
  │  index.tsx  →  App.tsx  →  Button.tsx        │
  │             →  styles.css → variables.css    │
  │             →  utils.ts                      │
  │             →  logo.svg                      │
  └──────────────────────────────────────────────┘
      │
      ▼ Loaders (per-file transforms)
  babel-loader:    .tsx  →  JS
  css-loader:      .css  →  JS module
  asset/resource:  .svg  →  URL string
      │
      ▼ Plugins (bundle-wide transforms)
  HtmlWebpackPlugin   → injects <script> into HTML
  MiniCssExtractPlugin → extracts CSS to separate file
  TerserPlugin        → minifies JS (auto in production)
      │
      ▼
  Output: dist/
  ├── main.a1b2c3d4.js
  ├── main.e5f6a7b8.css
  └── index.html (with injected tags)

MODE DIFFERENCES
═══════════════════════════════════════════════════
  development:                   production:
  ─ readable output              ─ minified + mangled
  ─ fast incremental builds      ─ tree-shaken
  ─ full source maps             ─ scope-hoisted
  ─ hot module replacement       ─ content-hashed assets
  ─ no code splitting            ─ optimised chunk splitting`,
      },
    ],
  },
};

const loaders: TopicNode = {
  id: "webpack-loaders",
  title: "Loaders",
  iconName: "Wrench",
  link: "https://webpack.js.org/concepts/loaders/",
  theory:
    "Loaders transform source files into modules that webpack can process. They run per-file, chained right-to-left: the output of the last loader in an array becomes the input for the next. Loaders turn anything — CSS, images, Markdown, JSX, TypeScript — into valid JavaScript modules.",
  theoryDetail: {
    keyConcepts: [
      "test: RegExp matching file extensions — determines which files this loader handles",
      "use: loader name(s) — string for one loader, array for chained loaders (right-to-left execution)",
      "options/query: loader-specific configuration passed inline or via separate config files",
      "Chain order: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'] — postcss runs first, then css-loader, then extract",
      "babel-loader: transpiles modern JS/JSX/TS — configured via .babelrc or babel.config.js",
      "asset modules (webpack 5): asset/resource, asset/inline, asset/source replace file-loader and url-loader",
    ],
    whyItMatters:
      "Every build feature beyond plain JavaScript — TypeScript compilation, CSS Modules, SVG imports, image optimisation — is implemented via loaders. Knowing how to configure and chain loaders is the most common webpack configuration task.",
    commonPitfalls: [
      "Forgetting to exclude node_modules from babel-loader — dramatically slows builds",
      "Wrong loader order — CSS chain must be [extract/style-loader, css-loader, preprocessor] — reversed order breaks processing",
      "Using file-loader/url-loader in webpack 5 — they are replaced by asset module types",
    ],
    examples: [
      {
        title: "Common loader configurations: Babel, CSS Modules, SCSS, SVG, and assets",
        description: "Real-world loader rules for a TypeScript + CSS Modules + SCSS project.",
        code: `// webpack.config.js — module.rules examples

module.exports = {
  module: {
    rules: [
      // ─── JavaScript / TypeScript ───
      {
        test: /\\.[jt]sx?$/,               // .js, .jsx, .ts, .tsx
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["@babel/preset-env", { targets: "> 0.25%, not dead" }],
              ["@babel/preset-react", { runtime: "automatic" }],
              "@babel/preset-typescript",
            ],
            plugins: ["@babel/plugin-transform-class-properties"],
            cacheDirectory: true,  // cache transpilation results → faster rebuilds
          },
        },
        exclude: /node_modules/,  // ALWAYS exclude — speeds up build ~10×
      },

      // ─── Global CSS ───
      {
        test: /\\.css$/,
        exclude: /\\.module\\.css$/,  // exclude CSS Modules (handled below)
        use: ["style-loader", "css-loader", "postcss-loader"],
        // style-loader: injects CSS into <style> tags (dev only)
        // css-loader:   resolves @import and url()
        // postcss-loader: runs autoprefixer, tailwind etc.
      },

      // ─── CSS Modules ───
      {
        test: /\\.module\\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[name]__[local]--[hash:base64:5]",
                // e.g. Button__container--a1b2c  →  scoped class names
              },
            },
          },
        ],
      },

      // ─── SCSS / Sass ───
      {
        test: /\\.s[ac]ss$/,
        use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
        // sass-loader compiles first, then postcss, then css-loader, then inject
      },

      // ─── Images (webpack 5 asset modules) ───
      {
        test: /\\.(png|jpg|jpeg|gif|webp)$/,
        type: "asset",  // auto-chooses: inline if < 8KB, else resource
        parser: {
          dataUrlCondition: { maxSize: 8 * 1024 },  // 8KB threshold
        },
        generator: {
          filename: "images/[name].[contenthash][ext]",
        },
      },

      // ─── SVG as React component ───
      {
        test: /\\.svg$/,
        use: ["@svgr/webpack"],
        // import Logo from './logo.svg' → React component
        // import { ReactComponent as Logo } from './logo.svg' (CRA style)
      },

      // ─── Fonts ───
      {
        test: /\\.(woff2?|eot|ttf|otf)$/,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name].[contenthash][ext]",
        },
      },
    ],
  },
};`,
        language: "javascript",
        output: `LOADER EXECUTION ORDER (right-to-left)
═══════════════════════════════════════════════════
  use: ["style-loader", "css-loader", "postcss-loader"]

  File: styles.css
    1. postcss-loader   → adds vendor prefixes, runs Tailwind
    2. css-loader       → resolves @import, url(), enables modules
    3. style-loader     → injects as <style> in the DOM
                          (dev) or MiniCssExtract (prod)

WEBPACK 5 ASSET MODULE TYPES
═══════════════════════════════════════════════════
  asset/resource  → emits file to output dir, returns URL
                    (replaces file-loader)
  asset/inline    → injects as base64 data URL
                    (replaces url-loader with limit: Infinity)
  asset/source    → returns file contents as a string
                    (replaces raw-loader)
  asset           → auto-chooses resource or inline based on size
                    (replaces url-loader with size limit)

CSS MODULES — SCOPED CLASS NAMES
═══════════════════════════════════════════════════
  // Button.module.css
  .container { padding: 8px; }

  // Button.tsx
  import styles from './Button.module.css';
  <div className={styles.container}>

  Generated HTML class: "Button__container--a1b2c"
  → guaranteed unique, no global class collisions`,
      },
    ],
  },
};

const plugins: TopicNode = {
  id: "webpack-plugins",
  title: "Plugins",
  iconName: "Layers",
  link: "https://webpack.js.org/concepts/plugins/",
  theory:
    "Plugins operate on the entire bundle — they can inject environment variables, generate HTML, extract CSS, analyse bundle size, and apply optimisations that loaders cannot. Plugins tap into webpack's compiler lifecycle hooks via a well-defined plugin API.",
  theoryDetail: {
    keyConcepts: [
      "HtmlWebpackPlugin: generates index.html and automatically injects bundle <script> and <link> tags",
      "MiniCssExtractPlugin: extracts CSS into separate files (instead of inline <style> tags) — essential for production",
      "DefinePlugin (built-in): replaces constants at compile time — use for process.env variables",
      "CopyWebpackPlugin: copies static assets (robots.txt, manifests) from public/ to dist/",
      "BundleAnalyzerPlugin: generates an interactive treemap of bundle size — find what's bloating your bundle",
      "webpack.ProvidePlugin (built-in): automatically imports a module when a variable is used (e.g. React in pre-JSX transform code)",
    ],
    whyItMatters:
      "Plugins are what transform webpack from a simple bundler into a complete build pipeline. Production builds critically depend on HtmlWebpackPlugin + MiniCssExtractPlugin + TerserPlugin. DefinePlugin is how environment variables reach the browser at build time (the same mechanism Create React App and Vite use).",
    commonPitfalls: [
      "DefinePlugin replaces exact string matches — values must be JSON.stringified: JSON.stringify(process.env.API_URL)",
      "Not using contenthash in filenames — old bundles remain cached in browser after deployment",
      "Using BundleAnalyzerPlugin in every build — use analyzerMode: 'static' and run only when needed",
    ],
    examples: [
      {
        title: "Essential plugins: HTML, CSS extraction, environment variables, and bundle analysis",
        description: "The plugin setup for a production React app.",
        code: `const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const isDev = process.env.NODE_ENV !== "production";

module.exports = {
  plugins: [
    // ─── HTML generation ───────────────────────────────────
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      // Automatically injects:
      //   <script src="/main.a1b2c3.js" defer></script>
      //   <link rel="stylesheet" href="/main.e5f6a7.css">
      minify: isDev ? false : {
        collapseWhitespace: true,
        removeComments: true,
      },
    }),

    // ─── CSS extraction ─────────────────────────────────────
    new MiniCssExtractPlugin({
      filename: isDev ? "[name].css" : "[name].[contenthash].css",
      chunkFilename: isDev ? "[id].css" : "[id].[contenthash].css",
    }),

    // ─── Environment variables ───────────────────────────────
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "process.env.API_URL":  JSON.stringify(process.env.API_URL),
      // These are inlined at build time — the string "process.env.API_URL"
      // is replaced with the actual value in every file
      __DEV__: JSON.stringify(isDev),
    }),

    // ─── Copy static assets ──────────────────────────────────
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "public",
          to: ".",
          globOptions: {
            ignore: ["**/index.html"],  // HtmlWebpackPlugin handles this
          },
        },
      ],
    }),

    // ─── Bundle analysis (run separately: ANALYZE=true npm run build) ───
    ...(process.env.ANALYZE === "true"
      ? [new BundleAnalyzerPlugin({ analyzerMode: "static", openAnalyzer: true })]
      : []
    ),
  ],

  // ─── Built-in optimization plugins (auto in production mode) ───
  optimization: {
    minimizer: [
      "...",  // keep webpack's default TerserPlugin (JS minifier)
      // add CssMinimizerPlugin here for CSS minification
    ],
  },
};

// Usage: npm run build            → normal build
//        ANALYZE=true npm run build → open bundle report`,
        language: "javascript",
        output: `PLUGIN vs LOADER COMPARISON
═══════════════════════════════════════════════════
  Loaders:                          Plugins:
  ─ Transform individual files      ─ Operate on entire compilation
  ─ Declared in module.rules        ─ Declared in plugins array
  ─ Run during module resolution    ─ Run at specific build lifecycle hooks
  ─ File-level: .ts → .js          ─ Bundle-level: inject tags, env vars

DEFINEPLUGIN — HOW IT WORKS
═══════════════════════════════════════════════════
  Config:
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production")
    })

  Source code:          After webpack build:
  ─────────────────     ─────────────────────
  if (process.env       if ("production"
    .NODE_ENV ===           === "production") {
    "production") {       // included
    // ...             }
  }

  Dead code eliminator then removes unreachable branches.

CONTENTHASH CACHE BUSTING
═══════════════════════════════════════════════════
  filename: "[name].[contenthash].js"

  Deploy v1:  main.a1b2c3d4.js  → browser caches forever ✅
  Deploy v2:  main.e5f6a7b8.js  → new hash, browser fetches ✅
  Unchanged:  vendor.ff11ee22.js → same hash, browser uses cache ✅`,
      },
    ],
  },
};

export const webpackCore: TopicNode = {
  id: "webpack-core",
  title: "Core Concepts",
  iconName: "Cpu",
  link: "https://webpack.js.org/concepts/",
  theory:
    "Webpack's mental model is built on five core concepts: Entry (where to start), Output (where to write bundles), Loaders (per-file transforms), Plugins (bundle-wide transforms), and Mode (development vs production). Understanding all five is the foundation of any webpack configuration.",
  theoryDetail: {
    keyConcepts: [
      "Entry: the starting point of the dependency graph",
      "Output: destination path and filename pattern for the emitted bundles",
      "Loaders: per-file transformers — turn CSS, images, TypeScript into webpack modules",
      "Plugins: bundle-level tools — HTML injection, CSS extraction, env vars, minification",
      "Mode: controls built-in optimisations and process.env.NODE_ENV",
    ],
    whyItMatters:
      "Every tool that builds on webpack (Create React App, Next.js webpack config, Storybook) exposes the same five knobs. Reading a webpack config becomes straightforward once you can identify which concept each section belongs to.",
    commonPitfalls: [],
  },
  children: [whatIsWebpack, loaders, plugins],
};
