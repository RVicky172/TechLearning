import type { TopicNode } from "@/data/types";

export const tsFileTypes: TopicNode = {
  id: "ts-file-types",
  title: "TypeScript File Types",
  iconName: "Files",
  theory:
    "TypeScript uses several file extensions, each with distinct semantics. Knowing when to use .ts, .tsx, .d.ts, .mts, or .cts prevents confusing module errors and compiler warnings.",
  theoryDetail: {
    keyConcepts: [
      ".ts: TypeScript module — the default for logic, utilities, and all non-JSX code",
      ".tsx: TypeScript with JSX — required for React components, enables JSX syntax",
      ".d.ts: declaration file — types only, no runtime code ever executed",
    ],
    whyItMatters:
      "Using the wrong extension causes silent bugs: JSX in .ts fails at compile, .d.ts with runtime code is never executed, mixing .mts/.cts incorrectly breaks ESM/CJS interop.",
    commonPitfalls: [
      "Using .tsx for non-JSX files — not wrong, but signals wrong intent to readers and tools",
      "Writing runtime code in .d.ts files — it is silently ignored, never executed",
      "Using .ts extension in ESM import statements in Node.js — .js extension is required in source with node16 resolution",
    ],
  },
  children: [
    {
      id: "ts-file-ts-tsx",
      title: ".ts and .tsx",
      iconName: "FileCode2",
      link: "https://www.typescriptlang.org/docs/handbook/jsx.html",
      theory:
        ".ts is for TypeScript modules. .tsx is required whenever the file contains JSX syntax (<Component /> or HTML-like tags).",
      theoryDetail: {
        keyConcepts: [
          ".ts: all TypeScript without JSX — functions, classes, utilities, config, types",
          ".tsx: TypeScript + JSX — required for React/Solid/Preact/Qwik components",
          "tsconfig 'jsx' option: 'react-jsx' for React 17+ (no need to import React manually)",
        ],
        whyItMatters:
          "Using .tsx when there is no JSX confuses tooling. Using .ts for React components causes a parse error on the first angle bracket.",
        commonPitfalls: [
          "Generic syntax ambiguity in .tsx: <T> is parsed as JSX — use <T,> or <T extends unknown> to fix",
          "Forgetting 'jsx': 'react-jsx' in tsconfig for React 17+ — causes 'React not in scope' errors",
          "Using .tsx for server-only utility files — signals JSX presence where there is none",
        ],
        examples: [
          {
            title: ".ts vs .tsx — when to use each",
            description:
              "Correct extension usage and the generic type parameter gotcha specific to .tsx files.",
            code: `// ── utils/format.ts ── (no JSX — use .ts) ─────────────────────
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

// Generics work fine in .ts
function identity<T>(value: T): T {
  return value;
}

// ── components/Button.tsx ── (has JSX — must use .tsx) ──────────
type ButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

export function Button({ label, onClick, disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}

// ── Generic components in .tsx — trailing comma avoids JSX ambiguity ──
// ❌ <T> alone looks like a JSX opening tag in .tsx
// ✅ Use <T,> or <T extends unknown> instead
function first<T,>(arr: T[]): T | undefined {
  return arr[0];
}`,
            language: "tsx",
          },
        ],
      },
    },
    {
      id: "ts-file-dts",
      title: "Declaration Files (.d.ts)",
      iconName: "FileType",
      link: "https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html",
      theory:
        ".d.ts files contain type information only — no runtime code. They describe the shape of JavaScript libraries or augment global types for TypeScript consumers.",
      theoryDetail: {
        keyConcepts: [
          "tsc --declaration auto-generates .d.ts alongside compiled JS — always prefer this over hand-writing",
          "Ambient declarations (declare module, declare global) extend the TypeScript environment",
          "@types/* packages on npm are community-maintained .d.ts files for popular JS libraries",
        ],
        whyItMatters:
          "Without .d.ts files, every import of a JS library becomes 'any', stripping TypeScript's benefits at every third-party boundary.",
        commonPitfalls: [
          "Hand-writing .d.ts when tsc --declaration can generate it accurately",
          "Shipping an npm package without the 'types' field in package.json — consumers cannot find declarations",
          "Using 'declare var' in a non-ambient context when 'declare global {}' is needed",
        ],
        examples: [
          {
            title: "Ambient declarations and global type augmentation",
            description:
              "Declare an untyped JS library, augment the global Window type, and type process.env.",
            code: `// types/legacy-analytics.d.ts — type an untyped JS package
declare module 'legacy-analytics' {
  export interface TrackOptions {
    event: string;
    userId?: string;
    properties?: Record<string, unknown>;
  }
  export function track(options: TrackOptions): void;
  export function identify(userId: string): void;
}

// types/globals.d.ts — augment global browser types
declare global {
  interface Window {
    __APP_VERSION__: string;
    analytics: {
      track(event: string, props?: Record<string, unknown>): void;
    };
  }
}
export {}; // ensures this is treated as a module, not a script

// types/env.d.ts — type process.env for Node.js
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly DATABASE_URL: string;
    readonly JWT_SECRET: string;
    readonly PORT?: string;
  }
}`,
            language: "ts",
          },
        ],
      },
    },
    {
      id: "ts-file-mts-cts",
      title: "ESM & CJS Explicit (.mts / .cts)",
      iconName: "Shuffle",
      link: "https://www.typescriptlang.org/docs/handbook/esm-node.html",
      theory:
        ".mts and .cts explicitly mark a file as ESM or CommonJS, overriding the package.json 'type' field. Used in projects that need to mix both module formats.",
      theoryDetail: {
        keyConcepts: [
          ".mts compiles to .mjs (ES module); .cts compiles to .cjs (CommonJS)",
          "Useful in packages that export both formats or need a specific file to be a different format",
          "moduleResolution: 'node16' requires .js extensions in import paths even in .ts source",
        ],
        whyItMatters:
          "ESM/CJS interop is one of the most common Node.js TypeScript pain points. Explicit file extensions prevent the dual-module hazard where the same package gets initialized twice.",
        commonPitfalls: [
          "Mixing 'import' and 'require()' in a package with 'type: module' — CJS syntax throws a SyntaxError",
          "Forgetting .js extensions in import paths under 'moduleResolution: node16'",
          "Using .mts/.cts when a standard .ts with correct tsconfig settings is sufficient",
        ],
        examples: [
          {
            title: ".mts and .cts in a dual-format package",
            description:
              "Explicit module format overrides for edge cases in packages that publish both ESM and CJS.",
            code: `// src/index.ts — standard file, format decided by package.json "type" field
export { computeHash } from './hash';

// src/esm-only.mts — always compiles to .mjs regardless of package.json
import { readFile } from 'node:fs/promises';

export async function readConfig(path: string): Promise<unknown> {
  const raw = await readFile(path, 'utf8');
  return JSON.parse(raw);
}

// src/cjs-compat.cts — always compiles to .cjs (for __dirname, require())
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const require    = createRequire(import.meta.url);

export const pkg = require('./package.json') as { version: string };

// tsconfig.json for node16:
// "module": "node16",
// "moduleResolution": "node16"
//
// With node16, import paths in .ts source must use .js extension:
// import { hash } from './hash.js'; // resolves to hash.ts at compile time`,
            language: "ts",
          },
        ],
      },
    },
    {
      id: "ts-file-ambient",
      title: "Ambient Modules & Global Types",
      iconName: "Globe",
      link: "https://www.typescriptlang.org/docs/handbook/modules.html#ambient-modules",
      theory:
        "Ambient declarations add types to untyped JavaScript or to the global scope without any runtime code — bridging TypeScript and the wider JS ecosystem.",
      theoryDetail: {
        keyConcepts: [
          "declare module 'name' {} adds types for modules with no @types package available",
          "Wildcard declarations: declare module '*.svg' types all SVG imports at once",
          "declare global {} adds properties to Window, globalThis, or process.env",
        ],
        whyItMatters:
          "Ambient declarations make untyped legacy code, static assets, and global polyfills fully typed without changing any runtime behavior.",
        commonPitfalls: [
          "Forgetting 'export {}' at the bottom of an ambient .d.ts — without it the file is a script, not a module",
          "Declaring a module that already has @types/* — creates duplicate, conflicting declarations",
          "Using wildcard module declarations too broadly — they suppress legitimate missing-module errors",
        ],
        examples: [
          {
            title: "Wildcard asset declarations and global augmentation",
            description:
              "Type imported static assets for bundlers and augment process.env for tighter config typing.",
            code: `// types/assets.d.ts — type all static asset imports ─────────────
declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}
declare module '*.png' {
  const src: string;
  export default src;
}
declare module '*.css' {
  const styles: Record<string, string>;
  export default styles;
}

// types/env.d.ts — strict process.env typing ──────────────────────
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly DATABASE_URL: string;
    readonly REDIS_URL: string;
    readonly PORT?: string;          // optional — has a default
    readonly NEXT_PUBLIC_API_URL: string;
  }
}

// Usage: TypeScript now knows the exact type of each env variable
const dbUrl: string = process.env.DATABASE_URL;   // string
const port: string | undefined = process.env.PORT; // string | undefined`,
            language: "ts",
          },
        ],
      },
    },
    {
      id: "ts-file-json-imports",
      title: "JSON & Asset Imports",
      iconName: "FileJson",
      link: "https://www.typescriptlang.org/tsconfig#resolveJsonModule",
      theory:
        "TypeScript can import JSON files as fully typed objects with 'resolveJsonModule: true'. The type is inferred directly from the JSON content.",
      theoryDetail: {
        keyConcepts: [
          "'resolveJsonModule: true' enables: import data from './data.json'",
          "JSON imports are typed to the exact shape of the file — changes to the file update the type",
          "For bundlers (Vite, webpack), asset imports also need the corresponding loader or plugin",
        ],
        whyItMatters:
          "Typed JSON imports eliminate manual type declarations for config files, locales, and test fixtures. The inferred type is always in sync with the actual file content.",
        commonPitfalls: [
          "Very large JSON files slow TypeScript's type checker — prefer Zod schemas for validation instead",
          "Default JSON imports require 'esModuleInterop: true'; named exports need 'moduleResolution: bundler'",
          "Importing package.json in src/ for its 'version' creates a circular dependency warning in some setups",
        ],
        examples: [
          {
            title: "Typed JSON imports",
            description:
              "Import a config JSON and a package.json version string with full TypeScript type inference.",
            code: `// tsconfig.json — required settings
// "resolveJsonModule": true,
// "esModuleInterop": true

// config/features.json
// {
//   "enableDarkMode": true,
//   "maxUploadSizeMB": 10,
//   "allowedRoles": ["admin", "editor", "viewer"]
// }

import features from '../config/features.json';
// TypeScript infers the exact type from the JSON:
// {
//   enableDarkMode: boolean;
//   maxUploadSizeMB: number;
//   allowedRoles: string[];
// }

if (features.enableDarkMode) {
  document.documentElement.setAttribute('data-theme', 'dark');
}

const maxMB: number = features.maxUploadSizeMB; // fully typed

// ── Importing package.json version (common in CLIs) ──────────────
import pkg from '../package.json';
// pkg.version is inferred as string
console.log(\`Running v\${pkg.version}\`);`,
            language: "ts",
          },
        ],
      },
    },
  ],
};
