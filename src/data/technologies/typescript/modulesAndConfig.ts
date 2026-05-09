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
      title: "ES Modules & Import/Export",
      iconName: "Share2",
      link: "https://www.typescriptlang.org/docs/handbook/2/modules.html",
      theory:
        "TypeScript fully supports ES module syntax. Understanding how TypeScript resolves imports prevents runtime 'module not found' errors.",
      theoryDetail: {
        keyConcepts: [
          "import type { T } only imports the type — it is erased at compile time and safe for isolatedModules",
          "Re-export patterns: export { foo } from './foo' without importing into the module scope",
          "moduleResolution: 'bundler' lets you omit file extensions; 'node16' requires .js extensions in .ts source",
        ],
        whyItMatters:
          "Module resolution bugs are notoriously hard to debug at runtime. Understanding the resolution algorithm early prevents hours of 'Cannot find module' troubleshooting.",
        commonPitfalls: [
          "Mixing CommonJS require() and ES import in the same file under 'module: ESNext'",
          "Forgetting 'export {}' in files with no exports when 'isolatedModules' is true",
          "Not using 'import type' for type-only imports — fails under isolatedModules and Babel transforms",
        ],
        examples: [
          {
            title: "Module patterns: type imports, re-exports, barrel files",
            description:
              "Best practices for structuring imports that work with bundlers and isolatedModules.",
            code: `// ─── Type-only import: erased at runtime, safe for isolatedModules ───
import type { User } from "./types";

// ─── Value import: kept at runtime ───
import { createUser } from "./user-service";

// ─── Re-export without importing into scope ───
export { createUser } from "./user-service";
export type { User }  from "./types";

// ─── Barrel file (index.ts) — expose a clean public API ───
// src/features/users/index.ts
export { UserCard }     from "./UserCard";
export { useUsers }     from "./useUsers";
export type { UserDto } from "./types";

// Consumers import from the feature, not the internals:
import { UserCard, useUsers } from "@/features/users";

// ─── Namespace import for utility modules ───
import * as DateUtils from "./date-utils";
DateUtils.formatISO(new Date());`,
            language: "ts",
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
