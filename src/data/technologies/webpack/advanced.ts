import type { TopicNode } from "@/data/types";

const moduleResolution: TopicNode = {
  id: "webpack-module-resolution",
  title: "Module Resolution & Aliases",
  iconName: "GitBranch",
  link: "https://webpack.js.org/configuration/resolve/",
  theory:
    "Webpack's resolve configuration controls how import paths are resolved. You can define path aliases (@ → src/), specify which file extensions to try automatically, and tell webpack to use the browser-friendly version of packages that ship both Node.js and browser builds.",
  theoryDetail: {
    keyConcepts: [
      "resolve.extensions: list of extensions to try in order — ['ts', 'tsx', 'js'] means import './Button' tries Button.ts, Button.tsx, Button.js",
      "resolve.alias: map an import prefix to a directory — { '@': path.resolve(__dirname, 'src') } makes import '@/utils' resolve to src/utils",
      "resolve.mainFields: which package.json field webpack uses to find a package's entry — ['browser', 'module', 'main'] prefers browser build",
      "resolve.modules: directories to search for modules — default is node_modules",
      "tsconfig-paths-webpack-plugin: sync TypeScript path aliases with webpack aliases — avoid duplication",
    ],
    whyItMatters:
      "Path aliases eliminate fragile relative imports like '../../../../utils'. They also keep refactoring safe — move a file, update one alias entry rather than dozens of relative paths. This is the same pattern used in Next.js (baseUrl + paths in tsconfig.json).",
    commonPitfalls: [
      "Defining aliases in webpack.config but not in tsconfig.json — TypeScript errors remain even though the build works",
      "Missing the alias in Jest config — tests fail to resolve @ imports even though webpack resolves them fine",
    ],
    examples: [
      {
        title: "Resolve aliases, extensions, and syncing with TypeScript paths",
        description: "Eliminate relative import hell with aliases that work in webpack, TypeScript, and Jest.",
        code: `// webpack.config.js — resolve configuration
const path = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
  resolve: {
    // ─── File extensions (tried in order) ───
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    // import './Button' → tries Button.ts, Button.tsx, Button.js …

    // ─── Path aliases ───
    alias: {
      "@":          path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@utils":     path.resolve(__dirname, "src/utils"),
      "@hooks":     path.resolve(__dirname, "src/hooks"),
      "@assets":    path.resolve(__dirname, "src/assets"),
    },

    // ─── Sync TypeScript path aliases automatically ───
    plugins: [
      new TsconfigPathsPlugin({
        configFile: "./tsconfig.json",
        // Reads compilerOptions.paths and compilerOptions.baseUrl
        // Adds them as webpack aliases automatically
        // → No need to duplicate aliases in both files!
      }),
    ],

    // ─── Prefer browser build of packages ───
    mainFields: ["browser", "module", "main"],
    // Some packages ship different builds for Node/browser
    // e.g. 'crypto' — use browser polyfill version

    // ─── Fallbacks for Node built-ins (webpack 5) ───
    fallback: {
      "path":    false,    // don't polyfill path — not needed in browser
      "fs":      false,    // no filesystem in browser
      "crypto":  require.resolve("crypto-browserify"),  // polyfill crypto
    },
  },
};

// tsconfig.json — matching path aliases
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*":           ["src/*"],
      "@components/*": ["src/components/*"],
      "@utils/*":      ["src/utils/*"],
      "@hooks/*":      ["src/hooks/*"]
    }
  }
}

// jest.config.js — matching aliases for tests
module.exports = {
  moduleNameMapper: {
    "^@/(.*)$":          "<rootDir>/src/$1",
    "^@components/(.*)$": "<rootDir>/src/components/$1",
    "^@utils/(.*)$":     "<rootDir>/src/utils/$1",
  },
};

// ─── Before aliases ───
import { Button } from "../../../components/ui/Button";
import { formatDate } from "../../../../utils/date";
import { useAuth } from "../../../../hooks/useAuth";

// ─── After aliases ───
import { Button }    from "@components/ui/Button";
import { formatDate } from "@utils/date";
import { useAuth }   from "@hooks/useAuth";`,
        language: "javascript",
        output: `RESOLUTION ALGORITHM
═══════════════════════════════════════════════════
  import { Button } from "@/components/Button"

  1. Check alias map:  "@" → /project/src
  2. Resolved path:    /project/src/components/Button
  3. Try extensions:
     → /project/src/components/Button.ts   ← found ✅
     → (would also try .tsx, .js, .jsx)

  import "./utils" (relative, no extension)
  1. No alias match
  2. Try extensions:
     → ./utils.ts    ← found ✅
     → (would try .tsx, .js, .jsx, index.ts, ...)

WHERE TO DEFINE ALIASES (all three must match)
═══════════════════════════════════════════════════
  webpack.config.js      → for the build
  tsconfig.json          → for TypeScript type checking
  jest.config.js         → for unit tests

  Use tsconfig-paths-webpack-plugin to auto-sync
  webpack aliases from tsconfig → only define once!`,
      },
    ],
  },
};

const environmentsAndMultiConfig: TopicNode = {
  id: "webpack-environments",
  title: "Multi-Environment Configuration",
  iconName: "Settings",
  link: "https://webpack.js.org/guides/production/",
  theory:
    "Production and development builds have very different requirements. The webpack-merge library lets you split config into a shared base and environment-specific overrides, keeping config DRY while allowing each environment to differ in mode, source maps, minification, and dev server settings.",
  theoryDetail: {
    keyConcepts: [
      "webpack-merge: deeply merges webpack config objects — arrays are concatenated, objects are merged",
      "Base config: entry, output, loaders, aliases — shared across all environments",
      "Development config: devtool, devServer, hot — optimised for iteration speed",
      "Production config: optimization, MiniCssExtractPlugin, contenthash — optimised for delivery",
      "env flag: webpack CLI --env flag passes environment variables into the config factory function",
      "Config as a function: module.exports = (env, argv) => ({}) — access CLI flags and mode",
    ],
    whyItMatters:
      "As projects grow, a single monolithic webpack.config.js becomes hard to maintain. Environment-specific configs keep each concern isolated. This is the pattern used by most webpack starters, Create React App (internally), and Storybook.",
    commonPitfalls: [
      "Using style-loader in production — it injects CSS into JS; use MiniCssExtractPlugin instead",
      "Using eval source maps in production — leaks source code and bloats the bundle",
      "Not using contenthash in production — browsers cache the old bundle after redeployment",
    ],
    examples: [
      {
        title: "Three-file config split: common, development, production",
        description: "Use webpack-merge to share config and override per environment.",
        code: `// ─── webpack.common.js — shared base ───
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.tsx",

  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: { "@": path.resolve(__dirname, "src") },
  },

  module: {
    rules: [
      {
        test: /\\.[jt]sx?$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\\.(png|svg|jpg)$/,
        type: "asset/resource",
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({ template: "./public/index.html" }),
  ],
};

// ─── webpack.dev.js ───
const { merge } = require("webpack-merge");
const common = require("./webpack.common");

module.exports = merge(common, {
  mode: "development",
  devtool: "eval-source-map",  // fast, readable

  output: {
    filename: "[name].js",      // no hash — dev doesn't need cache busting
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },

  module: {
    rules: [
      {
        test: /\\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
        // style-loader: fast, injects CSS into <style> tags
      },
    ],
  },

  devServer: {
    port: 3000,
    hot: true,
    historyApiFallback: true,
    proxy: { "/api": { target: "http://localhost:8080", changeOrigin: true } },
  },
});

// ─── webpack.prod.js ───
const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const common = require("./webpack.common");

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",  // separate .map files, not inlined

  output: {
    filename: "[name].[contenthash].js",  // cache-busting hashes
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    clean: true,
  },

  module: {
    rules: [
      {
        test: /\\.css$/,
        use: [
          MiniCssExtractPlugin.loader,  // extract to separate .css file
          "css-loader",
          "postcss-loader",
        ],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({ filename: "[name].[contenthash].css" }),
  ],

  optimization: {
    minimizer: ["...", new CssMinimizerPlugin()],
    splitChunks: { chunks: "all" },
  },
});

// ─── package.json scripts ───
// {
//   "scripts": {
//     "start":      "webpack serve --config webpack.dev.js",
//     "build":      "webpack --config webpack.prod.js",
//     "build:analyze": "ANALYZE=true webpack --config webpack.prod.js"
//   }
// }`,
        language: "javascript",
        output: `WEBPACK-MERGE DEEP MERGE BEHAVIOUR
═══════════════════════════════════════════════════
  base = {
    plugins: [HtmlPlugin],
    module: { rules: [babelRule] }
  }

  override = {
    plugins: [MiniCssPlugin],
    module: { rules: [cssRule] }
  }

  merge(base, override) = {
    plugins: [HtmlPlugin, MiniCssPlugin],    ← arrays concatenated
    module: { rules: [babelRule, cssRule] }  ← arrays concatenated
  }

DEV vs PROD CONFIG DIFFERENCES
═══════════════════════════════════════════════════
  Setting            Development         Production
  ─────────────────────────────────────────────────
  mode               development         production
  devtool            eval-source-map     source-map
  CSS loader         style-loader        MiniCssExtractPlugin
  filename           [name].js           [name].[contenthash].js
  minification       ✗                   ✓ (Terser + CssMinimizer)
  tree shaking       partial             full
  devServer          ✓                   ✗
  HMR                ✓                   ✗
  Bundle analysis    on demand           on demand`,
      },
    ],
  },
};

export const webpackAdvanced: TopicNode = {
  id: "webpack-advanced",
  title: "Advanced Configuration",
  iconName: "Settings",
  link: "https://webpack.js.org/configuration/",
  theory:
    "Beyond the basics, webpack configuration covers module resolution strategies, multi-environment setups, custom loaders, and performance tuning. These patterns separate a functional build from a maintainable, scalable one.",
  theoryDetail: {
    keyConcepts: [
      "Path aliases: map @ → src/ for clean imports — must be mirrored in tsconfig and jest",
      "webpack-merge: compose config from base + environment-specific overrides",
      "Multi-environment: separate dev and prod configs share common settings via merge",
    ],
    whyItMatters:
      "Real-world projects always have multiple environments, complex module structures, and team members who need readable configs. Advanced configuration knowledge is what separates someone who can use webpack from someone who can maintain it.",
    commonPitfalls: [],
  },
  children: [moduleResolution, environmentsAndMultiConfig],
};
