import type { TopicNode } from "@/data/types";

export const tsModulesAndConfig: TopicNode = {
  id: "ts-modules-config",
  title: "Modules & Configuration",
  iconName: "Settings",
  theory:
    "A well-configured tsconfig.json is the foundation of a reliable TypeScript project. Understanding module resolution and declaration files lets you consume and publish typed packages.",
  theoryDetail: {
    keyConcepts: [
      "strict: true enables strictNullChecks, noImplicitAny, and other safety flags simultaneously",
      "moduleResolution: 'bundler' or 'node16' aligns TypeScript with your bundler's import rules",
      "paths: {} in tsconfig maps short aliases (@/components) to real directories",
    ],
    whyItMatters:
      "tsconfig is the single source of truth for compiler behavior. Wrong settings silently disable safety checks; correct settings make TypeScript a powerful correctness tool.",
    commonPitfalls: [
      "Using an old tsconfig template that misses 'strict' or 'moduleResolution' updates",
      "Forgetting to include path aliases in both tsconfig and the bundler (Vite/webpack)",
      "Publishing a package without declaration files — consumers get 'implicit any' for all exports",
    ],
  },
  children: [
    {
      id: "ts-tsconfig",
      title: "tsconfig.json Deep Dive",
      iconName: "FileJson",
      link: "https://www.typescriptlang.org/tsconfig",
      theory:
        "tsconfig.json controls exactly which files TypeScript compiles and what rules it enforces. Every meaningful option is worth understanding.",
      theoryDetail: {
        keyConcepts: [
          "compilerOptions.target: output JS version (ES2022 is the modern default)",
          "compilerOptions.lib: type definitions available (DOM, ES2022, etc.)",
          "include/exclude/files control which source files are part of the compilation",
        ],
        whyItMatters:
          "Misconfigured tsconfig is the root cause of 'works on my machine' TypeScript failures. Understanding each option prevents hidden bugs from silent type downgrades.",
        commonPitfalls: [
          "Setting 'strict: false' globally to fix one error — this disables all strict checks",
          "Forgetting 'skipLibCheck: true' in projects with third-party type conflicts",
          "Not setting 'baseUrl' when using path aliases — aliases require both baseUrl and paths",
        ],
        examples: [
          {
            title: "Strict baseline for modern app projects",
            description:
              "A practical tsconfig profile that balances safety and build performance.",
            code: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],

    // ─── Strictness ───
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,

    // ─── Module output ───
    "esModuleInterop": true,
    "isolatedModules": true,
    "skipLibCheck": true,

    // ─── Path aliases ───
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },

    // ─── Output ───
    "outDir": "dist",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}`,
            language: "json",
          },
        ],
      },
    },
    {
      id: "ts-modules",
      title: "Modules: TS, ESM, and CommonJS",
      iconName: "Share2",
      link: "https://www.typescriptlang.org/docs/handbook/modules/introduction.html",
      theory:
        "TypeScript uses standard ES Module syntax (import/export), but it must compile that syntax into something the target environment (Node.js or Browser) can actually run. Navigating how TypeScript handles CommonJS and ESM interoperability is critical to avoiding runtime 'module not found' errors.",
      theoryDetail: {
        keyConcepts: [
          "'module' in tsconfig: Determines the OUTPUT syntax. Setting it to 'CommonJS' changes your 'import' statements into 'require()'. Setting it to 'ESNext' or 'NodeNext' keeps them as 'import' statements.",
          "'moduleResolution' in tsconfig: Determines how TypeScript FINDS the imported files. 'Bundler' is for modern frontend apps using Vite/Webpack. 'NodeNext' is for modern Node.js apps. 'Node' (or 'Node10') is the legacy setting for old CommonJS Node apps.",
          "esModuleInterop: A crucial tsconfig flag that allows you to default-import CommonJS modules as if they were ES modules (e.g., 'import React from \"react\"' instead of 'import * as React from \"react\"').",
          "File Extensions in ESM: If you are building a pure ESM Node.js app (using 'moduleResolution: \"NodeNext\"'), TypeScript strictly requires you to include the '.js' extension in your relative imports inside your '.ts' files. (Yes, '.js', not '.ts'!).",
          "Type-only imports: 'import type { User }' ensures the import is completely erased during compilation. This prevents emitting require() or import statements for interfaces/types.",
        ],
        whyItMatters:
          "The number one source of confusion in modern TypeScript is the intersection of its module settings with the Node.js ecosystem's transition from CommonJS to ESM. Misconfiguring 'module' and 'moduleResolution' leads to code that passes type-checking perfectly but crashes the moment you run the compiled JavaScript.",
        commonPitfalls: [
          "Importing without extensions in NodeNext: 'import { foo } from \"./utils\"' will fail at runtime in pure ESM Node apps. You MUST write 'import { foo } from \"./utils.js\"'.",
          "Mixing module types: Emitting CommonJS output for a project that specifies 'type': 'module' in package.json.",
          "Using 'moduleResolution: \"Node\"' in a frontend project: This legacy option fails to resolve the 'exports' field in modern package.json files. Always use 'Bundler' for frontend.",
        ],
        comparisons: [
          {
            title: "TS Module Resolution Strategies",
            summary: "Which 'moduleResolution' you should choose.",
            points: [
              "'Bundler': Use this if Vite, Webpack, esbuild, or Next.js is compiling your TS. It allows importing without extensions.",
              "'NodeNext': Use this if you are building a Node.js backend using ESM. It forces strict Node.js resolution rules, including mandatory file extensions.",
              "'Node10' (Legacy Node): Avoid unless maintaining an old CommonJS Node.js project.",
            ],
          },
        ],
        examples: [
          {
            title: "TypeScript ESM vs CommonJS Output",
            description:
              "How the 'module' setting in tsconfig.json drastically changes what TypeScript compiles.",
            code: `// --- Source TypeScript (index.ts) ---
import { add } from './math';
export const result = add(1, 2);

// --- Output if "module": "CommonJS" ---
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.result = void 0;
const math_1 = require("./math");
exports.result = (0, math_1.add)(1, 2);

// --- Output if "module": "ESNext" ---
import { add } from './math';
export const result = add(1, 2);`,
            language: "typescript",
          },
          {
            title: "Strict NodeNext ESM Imports",
            description:
              "When configuring TypeScript for modern Node.js ('moduleResolution': 'NodeNext'), you must write your imports with '.js' extensions, even though the source file is '.ts'.",
            code: `// tsconfig.json requires: "moduleResolution": "NodeNext"

// ❌ ERROR: Relative import paths need explicit file extensions in ECMAScript imports.
import { calculate } from './utils/calculator';

// ✅ CORRECT: TypeScript knows to look for 'calculator.ts' during type-checking.
import { calculate } from './utils/calculator.js';

// ✅ CORRECT: Type-only imports do not need extensions because they are erased.
import type { CalculationOptions } from './utils/calculator';`,
            language: "typescript",
          },
          {
            title: "esModuleInterop bridging the gap",
            description:
              "How 'esModuleInterop' makes importing legacy CommonJS modules seamless in TypeScript.",
            code: `// Imagine 'legacy-logger' is an old CommonJS package exported via module.exports = Logger;

// ❌ Without "esModuleInterop": true
import * as Logger from 'legacy-logger';
// You might have to call Logger.default() which is messy.

// ✅ With "esModuleInterop": true
import Logger from 'legacy-logger';
// TypeScript automatically generates a wrapper in the compiled code
// that seamlessly handles the require() interop under the hood.
const log = new Logger();`,
            language: "typescript",
          },
        ],
      },
    },
    {
      id: "ts-declaration-files",
      title: "Declaration Files (.d.ts)",
      iconName: "FileType",
      link: "https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html",
      theory:
        "Declaration files describe the types of JavaScript libraries. TypeScript ships them for built-ins; @types/* packages provide them for popular JS libraries.",
      theoryDetail: {
        keyConcepts: [
          "declare module 'lib' { } creates ambient declarations for JavaScript-only packages",
          "/// <reference types=\"node\" /> instructs the compiler to include Node.js type definitions globally",
          "When you set 'declaration: true', tsc auto-generates .d.ts files alongside output",
        ],
        whyItMatters:
          "Without declaration files, every JavaScript library you import becomes 'any', erasing TypeScript's benefits at every third-party boundary.",
        commonPitfalls: [
          "Writing a .d.ts by hand when tsc --declaration can generate it automatically",
          "Shipping a package without the 'types' field in package.json — consumers can't find the .d.ts",
          "Using 'declare var' in a module-scoped file when you need 'declare global { }' for global augmentation",
        ],
        examples: [
          {
            title: "Ambient module declaration for an untyped JS package",
            description:
              "When @types/* doesn't exist, write a minimal declaration to get type safety.",
            code: `// src/types/untyped-lib.d.ts
declare module "untyped-analytics" {
  export interface TrackOptions {
    event: string;
    userId?: string;
    properties?: Record<string, unknown>;
  }

  export function track(options: TrackOptions): void;
  export function identify(userId: string): void;
  export function reset(): void;
}

// ─── Global augmentation (e.g., extend Window) ───
// src/types/globals.d.ts
declare global {
  interface Window {
    analytics: {
      track(event: string, props?: Record<string, unknown>): void;
    };
  }
}

export {}; // required to make this a module (not a script)`,
            language: "ts",
          },
        ],
      },
    },
    {
      id: "ts-project-references",
      title: "Project References & Monorepos",
      iconName: "Workflow",
      link: "https://www.typescriptlang.org/docs/handbook/project-references.html",
      theory:
        "Project references split large codebases into composable TypeScript projects with incremental builds and explicit dependency boundaries.",
      theoryDetail: {
        keyConcepts: [
          "composite: true is required for referenced projects",
          "references: [{ path: '../shared' }] defines build order and type dependencies",
          "tsc -b performs incremental builds across referenced projects",
        ],
        whyItMatters:
          "References dramatically reduce compile time in monorepos and prevent accidental cross-package imports that break package boundaries.",
        commonPitfalls: [
          "Forgetting declaration output in referenced packages",
          "Importing source files directly across packages instead of package entry points",
          "Running plain tsc instead of tsc -b at monorepo root",
        ],
        examples: [
          {
            title: "App + shared package references",
            description:
              "Separate shared types/utilities from app code while preserving fast incremental builds.",
            code: `// packages/shared/tsconfig.json
{
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "declarationMap": true,
    "outDir": "dist"
  },
  "include": ["src"]
}

// apps/web/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "references": [
    { "path": "../../packages/shared" }
  ]
}

// Build all projects in dependency order
// $ tsc -b apps/web`,
            language: "json",
          },
        ],
      },
    },
  ],
};
