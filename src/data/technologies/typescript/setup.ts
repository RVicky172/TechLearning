import type { TopicNode } from "@/data/types";

export const tsSetup: TopicNode = {
  id: "ts-setup",
  title: "Setup & Tooling",
  iconName: "Terminal",
  theory:
    "Get a TypeScript project running correctly from day one — install, configure strict mode, and choose the right runtime for your workflow.",
  theoryDetail: {
    keyConcepts: [
      "TypeScript is a dev-dependency — always install it locally per project, never globally only",
      "'npx tsc --init' generates tsconfig.json; enable 'strict: true' immediately",
      "ts-node and tsx run .ts files directly without a compile step",
    ],
    whyItMatters:
      "A misconfigured project silently disables TypeScript's safety checks. Getting setup right upfront prevents hours of debugging 'why didn't the compiler catch that?'",
    commonPitfalls: [
      "Installing TypeScript globally only — always add it as a local devDependency",
      "Running tsc --init and leaving strict: false — the generated config is not strict by default",
      "Using ts-node in production — compile to JS with tsc or a bundler first",
    ],
  },
  children: [
    {
      id: "ts-setup-install",
      title: "Installing TypeScript",
      iconName: "Download",
      link: "https://www.typescriptlang.org/download",
      theory:
        "Install TypeScript as a local dev dependency. Use npx tsc --noEmit in CI to catch type errors without emitting files.",
      theoryDetail: {
        keyConcepts: [
          "npm install -D typescript installs tsc as a local binary in node_modules/.bin",
          "npx tsc --version uses the local version — no global install required",
          "'typecheck' script in package.json should run tsc --noEmit in CI pipelines",
        ],
        whyItMatters:
          "Version-pinning TypeScript prevents type-check drift when team members or CI agents have different global installs.",
        commonPitfalls: [
          "Relying on a global TypeScript that differs from the project's pinned version",
          "Not adding a 'typecheck' script — type errors should block CI merges",
          "Forgetting @types/node when writing Node.js TypeScript code",
        ],
        examples: [
          {
            title: "Project setup from scratch",
            description:
              "Install TypeScript, initialize tsconfig, and add typecheck and build scripts to package.json.",
            code: `# 1. Install TypeScript and Node.js type definitions
npm install -D typescript @types/node

# 2. Generate tsconfig.json (then manually enable strict: true)
npx tsc --init

# 3. Verify the locally installed version
npx tsc --version   # e.g. Version 5.5.4

# 4. Add these scripts to package.json:
#    "typecheck": "tsc --noEmit"
#    "build":     "tsc --outDir dist"

# 5. Type-check without emitting files (CI-friendly)
npm run typecheck

# 6. Compile to JavaScript
npm run build`,
            language: "bash",
          },
        ],
      },
    },
    {
      id: "ts-setup-tsconfig",
      title: "tsconfig.json Baseline",
      iconName: "FileJson",
      link: "https://www.typescriptlang.org/tsconfig",
      theory:
        "A strict tsconfig.json is the foundation of a reliable TypeScript project. Most generated defaults are too lenient — know which flags matter most.",
      theoryDetail: {
        keyConcepts: [
          "'strict: true' enables strictNullChecks, noImplicitAny, strictFunctionTypes, and more in one flag",
          "'moduleResolution: bundler' aligns TypeScript with Vite/esbuild import rules",
          "'noUncheckedIndexedAccess: true' makes arr[0] return T | undefined instead of T",
        ],
        whyItMatters:
          "Correct tsconfig catches null dereferences, implicit any, and module resolution mismatches before they reach production.",
        commonPitfalls: [
          "Leaving 'strict: false' — you lose null checks, implicit any warnings, and more",
          "Wrong 'moduleResolution' causing 'cannot find module' even though the file exists",
          "Not setting 'include' — tsc compiles everything by default, including test helpers and scripts",
        ],
        examples: [
          {
            title: "Production-ready strict tsconfig baseline",
            description:
              "Annotated tsconfig.json for a modern Node.js app or library with all safety flags enabled.",
            code: `{
  "compilerOptions": {
    // ── Output ───────────────────────────────────────────────
    "target": "ES2022",
    "lib": ["ES2022", "DOM"],
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "sourceMap": true,

    // ── Module ───────────────────────────────────────────────
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,

    // ── Strictness ───────────────────────────────────────────
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,

    // ── Path aliases ─────────────────────────────────────────
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] },

    // ── Misc ─────────────────────────────────────────────────
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}`,
            language: "json",
          },
        ],
      },
    },
    {
      id: "ts-setup-runners",
      title: "Running TypeScript (ts-node, tsx, Bun)",
      iconName: "Play",
      link: "https://tsx.is",
      theory:
        "Several tools let you execute .ts files directly without a compile step — essential for scripts, CLIs, and fast dev iteration.",
      theoryDetail: {
        keyConcepts: [
          "ts-node: original Node.js TS runner — slower, does full type checking",
          "tsx: fast esbuild-powered TS runner — no type checking, transpile-only, recommended for scripts",
          "Bun: JavaScript runtime with native TypeScript support — no extra packages needed",
        ],
        whyItMatters:
          "Fast dev iteration requires running .ts files directly. tsx and Bun make this near-instant with esbuild or native transpilation.",
        commonPitfalls: [
          "tsx and Bun skip type checking — always run tsc --noEmit separately in CI",
          "ts-node can be slow on large projects — prefer tsx for scripts and dev entry points",
          "ts-node with ESM requires 'esm: true' in the ts-node config section of package.json",
        ],
        examples: [
          {
            title: "ts-node, tsx, and Bun compared",
            description:
              "Three ways to run TypeScript files directly — from classic ts-node to the fast tsx and Bun runtime.",
            code: `# ── ts-node (classic — with type checking) ──────────────────────
npm install -D ts-node
npx ts-node src/index.ts

# ESM support — add to package.json:
# "ts-node": { "esm": true }

# ── tsx (recommended — esbuild-powered, fast) ─────────────────────
npm install -D tsx

npx tsx src/index.ts
npx tsx watch src/index.ts    # re-runs on file change

# package.json scripts:
# "dev":  "tsx watch src/index.ts"
# "seed": "tsx src/scripts/seed.ts"

# ── Bun (native TypeScript, zero extra packages) ──────────────────
bun run src/index.ts
bun --watch src/index.ts

# ── When to use each ──────────────────────────────────────────────
# ts-node  → need type errors caught at runtime too
# tsx      → scripts, CLIs, dev servers on Node.js (fastest)
# Bun      → Bun runtime projects`,
            language: "bash",
          },
        ],
      },
    },
    {
      id: "ts-setup-vscode",
      title: "VS Code Integration",
      iconName: "Code2",
      link: "https://code.visualstudio.com/docs/languages/typescript",
      theory:
        "VS Code has deep TypeScript support built in. A few workspace settings ensure the project's local TypeScript version is used for real-time error detection.",
      theoryDetail: {
        keyConcepts: [
          "'typescript.tsdk' points VS Code at the project's local TS version instead of the built-in one",
          "Organize Imports and Fix All on save automate import cleanup automatically",
          "Inlay hints show inferred return types and parameter names inline in the editor",
        ],
        whyItMatters:
          "VS Code's language server uses TypeScript to power autocomplete, refactoring, and real-time errors. Keeping it on the project's version ensures consistency with CI.",
        commonPitfalls: [
          "VS Code using its bundled TypeScript instead of the project's — always set typescript.tsdk",
          "Forgetting to restart the TS server after tsconfig changes ('TypeScript: Restart TS Server')",
          "Not enabling 'source.organizeImports' on save — manual import cleanup wastes review time",
        ],
        examples: [
          {
            title: ".vscode/settings.json for TypeScript projects",
            description:
              "Workspace settings that enforce consistent TypeScript tooling and formatting across all contributors.",
            code: `{
  "typescript.tsdk": "node_modules/typescript/lib",

  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",

  "editor.codeActionsOnSave": {
    "source.organizeImports": "explicit",
    "source.fixAll.eslint": "explicit"
  },

  "typescript.inlayHints.parameterNames.enabled": "literals",
  "typescript.inlayHints.returnTypes.enabled": true,
  "typescript.inlayHints.variableTypes.enabled": false,

  "typescript.preferences.importModuleSpecifier": "non-relative",
  "typescript.preferences.preferTypeOnlyAutoImports": true
}`,
            language: "json",
          },
        ],
      },
    },
  ],
};
