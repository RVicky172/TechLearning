import type { TopicNode } from "@/data/types";

export const tsBuildTools: TopicNode = {
  id: "ts-build-tools",
  title: "Build Tools & Bundlers",
  iconName: "Hammer",
  theory:
    "TypeScript can be compiled, transpiled, or bundled by a variety of tools. Each trades type-checking depth for build speed. Choose based on your project type.",
  theoryDetail: {
    keyConcepts: [
      "tsc is the only tool that does full type checking — all others are transpile-only",
      "esbuild, SWC, and Babel strip TypeScript syntax fast but never check types",
      "Always run tsc --noEmit in CI regardless of which build tool you use",
    ],
    whyItMatters:
      "Choosing the wrong build tool leads to slow builds, incorrect module output, or missing declaration files. Understanding what each tool does — and skips — is critical for production.",
    commonPitfalls: [
      "Using esbuild or Babel alone and assuming types are being checked — they are not",
      "Publishing a library without declaration files — consumers get implicit any for all exports",
      "Mixing CJS and ESM output paths incorrectly in package.json 'exports' field",
    ],
  },
  children: [
    {
      id: "ts-build-tsc",
      title: "tsc (TypeScript Compiler)",
      iconName: "FileCode2",
      link: "https://www.typescriptlang.org/docs/handbook/compiler-options.html",
      theory:
        "tsc is the official TypeScript compiler and the only build tool that performs full type checking. Use it for CI verification and .d.ts generation.",
      theoryDetail: {
        keyConcepts: [
          "tsc --noEmit: type-check only, no output files — the CI type-safety gate",
          "tsc --watch: incremental recompile on file change — fast for development",
          "tsc --declaration --emitDeclarationOnly: generate .d.ts files without re-emitting JS",
        ],
        whyItMatters:
          "Every other build tool skips type checking. tsc --noEmit in CI is the safety net that catches type errors before they reach deployment.",
        commonPitfalls: [
          "Running tsc as the production bundler — it produces no tree-shaking or code splitting",
          "Not separating 'typecheck' from 'build' scripts — both should run in CI independently",
          "Forgetting 'composite: true' in monorepo packages — project references need it for incremental builds",
        ],
        examples: [
          {
            title: "Common tsc commands",
            description:
              "The most useful tsc invocations for type checking, watching, and generating declaration files.",
            code: `# Type-check only — no output files (run this in CI)
npx tsc --noEmit

# Compile with source maps
npx tsc --outDir dist --sourceMap

# Watch mode — recompiles on every save
npx tsc --watch

# Generate .d.ts files only (skip JS emit)
npx tsc --declaration --emitDeclarationOnly --outDir types

# Use a specific tsconfig (e.g. for library vs app builds)
npx tsc --project tsconfig.build.json

# List all files included in the compilation
npx tsc --noEmit --listFiles`,
            language: "bash",
          },
        ],
      },
    },
    {
      id: "ts-build-esbuild",
      title: "esbuild",
      iconName: "Zap",
      link: "https://esbuild.github.io",
      theory:
        "esbuild is an extremely fast JavaScript/TypeScript bundler written in Go. It transpiles TypeScript in milliseconds but never type-checks.",
      theoryDetail: {
        keyConcepts: [
          "esbuild strips TypeScript syntax — it is a transpiler, not a type checker",
          "10–100× faster than webpack for bundling and minification",
          "Used internally by Vite, tsup, Remix, and many other tools as their TS transform engine",
        ],
        whyItMatters:
          "esbuild is the de-facto fast TypeScript transform layer. Understanding it explains why Vite and tsup are so fast — and why you still need tsc for type safety.",
        commonPitfalls: [
          "Assuming esbuild checks your types — it does not; always pair with tsc --noEmit in CI",
          "const enum: esbuild cannot inline them across file boundaries — use regular enums or string literals",
          "Not specifying 'platform: node' for Node.js builds — esbuild defaults to browser mode",
        ],
        examples: [
          {
            title: "esbuild CLI and Node.js API",
            description: "Direct esbuild usage for scripts and programmatic builds with TypeScript.",
            code: `npm install -D esbuild

# ── CLI — single file bundle ─────────────────────────────────────
npx esbuild src/index.ts --bundle --outfile=dist/index.js

# Production: minify + target modern Node.js
npx esbuild src/index.ts \\
  --bundle \\
  --minify \\
  --platform=node \\
  --target=node20 \\
  --format=esm \\
  --outfile=dist/index.js

# ── Node.js API (build.mjs) ───────────────────────────────────────
import { build } from 'esbuild';

await build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  minify: true,
  platform: 'node',
  target: ['node20'],
  format: 'esm',
  outdir: 'dist',
  sourcemap: true,
});

# ── Always run tsc separately for type checking ───────────────────
# package.json:  "build": "tsc --noEmit && esbuild src/index.ts --bundle --outfile=dist/index.js"`,
            language: "bash",
          },
        ],
      },
    },
    {
      id: "ts-build-vite",
      title: "Vite",
      iconName: "Flame",
      link: "https://vitejs.dev",
      theory:
        "Vite is the modern frontend build tool with first-class TypeScript support. It uses esbuild for dev (instant HMR) and Rollup for production builds.",
      theoryDetail: {
        keyConcepts: [
          "Vite uses esbuild for TypeScript — fast transpile during dev, no type checking",
          "'vite build' does not fail on type errors unless vite-plugin-checker is added",
          "Path aliases in tsconfig must also be mirrored in vite.config.ts 'resolve.alias'",
        ],
        whyItMatters:
          "Vite is the dominant tool for React/Vue/Svelte TypeScript apps. Understanding the separation between transpile (Vite) and type-check (tsc) keeps your pipeline correct.",
        commonPitfalls: [
          "Expecting 'vite build' to fail on type errors — add vite-plugin-checker for that",
          "Forgetting 'isolatedModules: true' in tsconfig — Vite requires it for correct transforms",
          "Defining path aliases only in tsconfig but not in vite.config.ts — imports break at runtime",
        ],
        examples: [
          {
            title: "vite.config.ts with TypeScript and path aliases",
            description:
              "Minimal Vite config with React, path aliases, and background type checking via vite-plugin-checker.",
            code: `// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    checker({ typescript: true }), // background type checking in dev server
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // must mirror tsconfig "paths"
    },
  },
  build: {
    target: 'es2022',
    sourcemap: true,
  },
});

// package.json scripts
// "dev":       "vite"
// "build":     "tsc --noEmit && vite build"
// "typecheck": "tsc --noEmit"
// "preview":   "vite preview"`,
            language: "ts",
          },
        ],
      },
    },
    {
      id: "ts-build-webpack",
      title: "Webpack + ts-loader",
      iconName: "Package",
      link: "https://webpack.js.org",
      theory:
        "Webpack + ts-loader is the classic TypeScript build setup for large enterprise projects. ts-loader uses tsc under the hood; babel-loader is faster but skips type checking.",
      theoryDetail: {
        keyConcepts: [
          "ts-loader invokes tsc per file — checks types during webpack builds",
          "'transpileOnly: true' in ts-loader skips type checking for faster dev builds",
          "babel-loader + @babel/preset-typescript is fastest but completely skips type checks",
        ],
        whyItMatters:
          "Many large codebases still run on Webpack. Understanding ts-loader vs babel-loader prevents silent type check gaps in webpack builds.",
        commonPitfalls: [
          "Using babel-loader without a separate tsc --noEmit step — types are never verified",
          "Not setting 'transpileOnly: true' in development — ts-loader is significantly slower without it",
          "Forgetting '.ts' and '.tsx' in resolve.extensions — webpack won't resolve TypeScript files",
        ],
        examples: [
          {
            title: "webpack.config.js with ts-loader",
            description:
              "Webpack configuration using ts-loader with transpile-only dev mode and path alias support.",
            code: `// npm install -D webpack webpack-cli ts-loader
const path = require('path');

module.exports = (env) => ({
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            // transpileOnly in dev: fast recompile (no type checking)
            // run tsc --noEmit separately in CI for type safety
            transpileOnly: Boolean(env?.development),
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
});`,
            language: "js",
          },
        ],
      },
    },
    {
      id: "ts-build-tsup",
      title: "tsup (Library Bundler)",
      iconName: "Box",
      link: "https://tsup.egoist.dev",
      theory:
        "tsup is a zero-config TypeScript library bundler built on esbuild. It generates CJS + ESM dual output with declaration files in a single command.",
      theoryDetail: {
        keyConcepts: [
          "tsup bundles TypeScript libraries for npm publishing with CJS + ESM dual output",
          "'dts: true' generates .d.ts files automatically — no separate tsc --declaration step",
          "Supports watch mode, code splitting, and external dependency exclusion out of the box",
        ],
        whyItMatters:
          "tsup is the easiest way to publish a TypeScript library to npm with correct dual CJS/ESM output and declaration files that consumers expect.",
        commonPitfalls: [
          "Forgetting 'dts: true' — without it no .d.ts files are emitted and consumers get implicit any",
          "Not configuring the 'exports' field in package.json — consumers may get the wrong format",
          "Using tsup for apps (not libraries) — for apps, use Vite or esbuild directly",
        ],
        examples: [
          {
            title: "tsup for a TypeScript npm library",
            description:
              "Complete tsup setup with dual CJS/ESM output, declaration files, and correct package.json exports.",
            code: `npm install -D tsup

// tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],  // dual output
  dts: true,               // generate .d.ts files
  splitting: false,
  sourcemap: true,
  clean: true,
});

// package.json
{
  "main":   "./dist/index.js",
  "module": "./dist/index.mjs",
  "types":  "./dist/index.d.ts",
  "exports": {
    ".": {
      "import":  "./dist/index.mjs",
      "require": "./dist/index.js",
      "types":   "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build":     "tsup",
    "dev":       "tsup --watch",
    "typecheck": "tsc --noEmit"
  }
}`,
            language: "ts",
          },
        ],
      },
    },
    {
      id: "ts-build-swc",
      title: "SWC",
      iconName: "Cpu",
      link: "https://swc.rs",
      theory:
        "SWC is a Rust-based TypeScript/JavaScript compiler — up to 20× faster than Babel. It is the default transform in Next.js 13+ and speeds up Jest significantly via @swc/jest.",
      theoryDetail: {
        keyConcepts: [
          "SWC transpiles TypeScript but does not type check — like esbuild and Babel",
          "Next.js uses SWC by default for all TypeScript and JSX compilation since v12",
          "@swc/jest replaces babel-jest for TypeScript test transforms — measurably faster CI",
        ],
        whyItMatters:
          "SWC powers the performance of Next.js and modern Jest setups. Knowing what it does (transpile) vs what it skips (type check) keeps CI pipelines correct.",
        commonPitfalls: [
          "Expecting SWC to catch TypeScript type errors — it does not; always run tsc --noEmit separately",
          "SWC and .babelrc are mutually exclusive in Next.js — a .babelrc opts you out of SWC",
          "Legacy decorators: SWC supports them but behavior may differ from tsc in edge cases",
        ],
        examples: [
          {
            title: "@swc/jest for fast TypeScript test transforms",
            description:
              "Replace babel-jest with @swc/jest for faster TypeScript transpilation in Jest.",
            code: `npm install -D @swc/core @swc/jest

// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', {
      jsc: {
        parser: { syntax: 'typescript', tsx: true },
        target: 'es2022',
      },
    }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'node',
};

export default config;

// .swcrc (for standalone swc CLI)
{
  "jsc": {
    "parser": { "syntax": "typescript" },
    "target": "es2022"
  },
  "module": { "type": "commonjs" }
}`,
            language: "ts",
          },
        ],
      },
    },
  ],
};
