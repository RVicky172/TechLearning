import type { TopicNode } from "@/data/types";

export const serverClientBoundaries: TopicNode = {
  id: "react-server-client-boundaries",
  title: "Server vs Client Components",
  iconName: "Split",
  link: "https://nextjs.org/docs/app/building-your-application/rendering/server-components",
  theory:
    "In the Next.js App Router, components are Server Components by default. Use Client Components only where interactivity is required. Good boundaries reduce bundle size, improve performance, and prevent hydration mismatches.",
  theoryDetail: {
    keyConcepts: [
      "Server Components can fetch data securely and avoid shipping extra JavaScript to the browser",
      "Client Components are required for hooks, browser APIs, and interactive UI",
      "Data passed from server to client must be serializable",
      "Boundary decisions shape performance, caching behavior, and hydration reliability",
    ],
    whyItMatters:
      "Most modern React apps are framework-driven. Senior developers design clear server/client boundaries so pages stay fast while still being interactive where needed.",
    commonPitfalls: [
      "Marking large trees with 'use client' and shipping unnecessary JavaScript",
      "Using window or localStorage in Server Components",
      "Passing non-serializable data (functions, class instances) from server to client",
      "Mismatch between server-rendered and client-rendered initial UI",
    ],
    examples: [
      {
        title: "Server parent + client island",
        description: "Fetch on the server, pass serializable data to a client component for interactions.",
        code: `// app/products/page.tsx (Server Component)
import { ProductFilters } from './ProductFilters';

export default async function ProductsPage() {
  const products = await fetch('https://api.example.com/products').then((r) => r.json());
  return <ProductFilters initialProducts={products} />;
}

// app/products/ProductFilters.tsx (Client Component)
'use client';

import { useMemo, useState } from 'react';

export function ProductFilters({ initialProducts }) {
  const [term, setTerm] = useState('');
  const filtered = useMemo(
    () => initialProducts.filter((p) => p.name.toLowerCase().includes(term.toLowerCase())),
    [initialProducts, term]
  );

  return (
    <div>
      <input value={term} onChange={(e) => setTerm(e.target.value)} />
      <ul>{filtered.map((p) => <li key={p.id}>{p.name}</li>)}</ul>
    </div>
  );
}`,
        language: "tsx",
      },
    ],
  },
};
