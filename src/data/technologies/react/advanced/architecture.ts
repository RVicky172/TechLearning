import type { TopicNode } from "@/data/types";

export const architecture: TopicNode = {
  id: "react-architecture",
  title: "Project Architecture",
  iconName: "FolderTree",
  theory:
    "React is unopinionated about how you organize files. However, as applications scale, a chaotic folder structure leads to tangled dependencies and maintenance nightmares. Modern React architecture favors 'Feature-Driven Design' (colocation) over grouping by file type, ensuring that all files related to a specific domain stay together.",
  theoryDetail: {
    keyConcepts: [
      "Colocation: Keep files that change together close together (e.g., put a component's styles, tests, and hooks in the same folder)",
      "Feature-Sliced Design: Group by domain/feature (e.g., 'auth', 'dashboard') rather than technical role (e.g., 'components', 'hooks')",
      "Barrels (index.ts): Use index files at feature boundaries to control exactly what gets exported to the rest of the app",
      "Strict Dependency Rules: Features should not import internal files from other features — only their public APIs",
    ],
    whyItMatters:
      "A poor architecture forces developers to jump across 5 different folders just to add a new button. A good architecture scales infinitely because features are isolated, preventing 'spaghetti code' where changing a hook in one place breaks a completely unrelated feature.",
    commonPitfalls: [
      "Grouping by file type ('components', 'hooks', 'types', 'api') for large apps — this separates related logic",
      "Deep nesting of folders (e.g., src/components/ui/buttons/primary/PrimaryButton.tsx) — makes imports unreadable",
      "Circular dependencies — Feature A imports from Feature B, which imports from Feature A",
      "Leaking implementation details — importing deep paths like '@/features/auth/components/LoginForm' instead of '@/features/auth'",
    ],
    examples: [
      {
        title: "Anti-pattern: Grouping by File Type",
        description:
          "In a small app, this is fine. But when the app grows, deleting the 'Auth' feature means hunting down files in 6 different folders.",
        code: `src/
├── components/
│   ├── LoginForm.tsx
│   ├── DashboardTable.tsx
│   └── UserProfile.tsx
├── hooks/
│   ├── useAuth.ts
│   └── useUserData.ts
├── services/
│   ├── authApi.ts
│   └── userApi.ts
├── types/
│   ├── auth.ts
│   └── user.ts
└── store/
    ├── authSlice.ts
    └── userSlice.ts`,
        language: "text",
      },
      {
        title: "Recommended: Feature-Driven Architecture",
        description:
          "Everything related to 'Auth' lives in one place. It acts as an isolated micro-module.",
        code: `src/
├── components/          ← Shared, generic UI components only
│   ├── Button.tsx
│   └── Modal.tsx
├── lib/                 ← Third-party setup (axios, query client)
│   └── apiClient.ts
├── features/            ← Feature modules
│   ├── auth/
│   │   ├── api/         ← API calls for auth
│   │   ├── components/  ← Auth-specific UI
│   │   ├── hooks/       ← Custom auth hooks
│   │   ├── types/       ← Auth types
│   │   └── index.ts     ← PUBLIC API: Exports only what other features need
│   │
│   └── dashboard/
│       ├── api/
│       ├── components/
│       └── index.ts
└── app/                 ← Routing/Pages layer
    ├── login/page.tsx
    └── dashboard/page.tsx`,
        language: "text",
      },
      {
        title: "The Public API Pattern (Barrels)",
        description:
          "Use an index.ts file at the root of a feature folder to expose only the necessary parts. Other features MUST import from this file, not deep internals.",
        code: `// ── src/features/auth/index.ts ──
// ✅ Export components needed elsewhere
export { LoginForm } from './components/LoginForm';
export { AuthProvider } from './components/AuthProvider';

// ✅ Export hooks and types
export { useAuth } from './hooks/useAuth';
export type { User } from './types/user';

// ❌ DO NOT export internal utilities or private components
// export { hashPassword } from './utils/hash';
// export { LoginButton } from './components/LoginButton';


// ── Usage in another feature ──
// ✅ Clean, strict boundary
import { LoginForm, useAuth } from '@/features/auth';

// ❌ Anti-pattern: Bypassing the public API
import { LoginForm } from '@/features/auth/components/LoginForm';`,
        language: "typescript",
      },
    ],
  },
};
