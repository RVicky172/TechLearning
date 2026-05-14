import type { TopicNode } from "@/data/types";

export const nextjsFundamentals: TopicNode = {
  id: "nextjs-fundamentals",
  title: "Next.js Fundamentals",
  iconName: "Zap",
  theoryDetail: {
    keyConcepts: [
      "Next.js is a React metaframework with built-in SSR, SSG, and incremental static regeneration",
      "App Router (Next.js 13+) replaces Pages Router for modern file-based routing",
      "Server Components by default reduce JavaScript sent to the browser",
      "Automatic code splitting and image optimization improve performance out of the box",
      "Deployment is simplified—deploy to Vercel or any Node.js host",
    ],
    whyItMatters:
      "Next.js provides the infrastructure for production-grade React applications. It handles routing, rendering strategies, and optimization so you can focus on features. Its SSR/SSG capabilities improve SEO and initial page load performance.",
    commonPitfalls: [
      "Confusing Server Components (default) with Client Components—'use client' directive is required for browser interactivity",
      "Over-fetching data in Server Components; use React patterns like `<Suspense>` and `<ErrorBoundary>`",
      "Not leveraging automatic code splitting; every route is code-split by default",
      "Mixing old Pages Router patterns with new App Router; understand which version you're using",
      "Forgetting that environment variables are inlined at build time—use `NEXT_PUBLIC_` prefix for client-side vars",
    ],
    examples: [
      {
        title: "Basic Next.js App Structure (App Router)",
        description: "Modern Next.js structure using the App Router and server components.",
        code: `// app/layout.tsx - Root layout
export const metadata = { title: "My App" };

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}

// app/page.tsx - Home page
export default function Home() {
  return <h1>Welcome to Next.js</h1>;
}

// app/products/[id]/page.tsx - Dynamic route
export default function Product({ params }) {
  return <h1>Product {params.id}</h1>;
}`,
        language: "typescript",
      },
      {
        title: "Server vs Client Components",
        description: "Understand the difference and when to use each.",
        code: `// Server Component (default) - runs only on server
export default function UserList() {
  const users = await fetchUsers(); // Direct DB access
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}

// Client Component - requires 'use client' directive
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}`,
        language: "typescript",
      },
    ],
  },
};
