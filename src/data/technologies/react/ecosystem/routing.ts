import type { TopicNode } from "@/data/types";

export const routing: TopicNode = {
  id: "react-router",
  title: "Routing with Next.js",
  iconName: "Navigation",
  link: "https://nextjs.org/docs/app/building-your-application/routing",
  theory:
    "The App Router in Next.js uses file-based routing where folder structure maps to URL paths. React Server Components let you fetch data directly in components, eliminating unnecessary client-side state and JavaScript.",
  theoryDetail: {
    keyConcepts: [
      "Folders in app/ become URL segments; page.tsx is the route entry point",
      "layout.tsx wraps child routes with persistent UI — headers and sidebars never unmount between navigations",
      "Server Components by default fetch data directly without useEffect or client-side loading states",
      "'use client' marks components that need browser APIs or hooks — server by default, client only when needed",
    ],
    whyItMatters:
      "The App Router unifies routing and data fetching. Shared layouts persist across navigations for instant navigation, and Server Components eliminate unnecessary JavaScript sent to the browser.",
    commonPitfalls: [
      "Forgetting 'use client' when using hooks or browser APIs — Server Components don't support them",
      "Fetching the same data in a layout and a child page — use shared fetches and request deduplication",
      "Using dynamic segments ([id]) without generateStaticParams missing optimization opportunities",
      "Creating too many nested layouts — each adds nesting depth to the component tree",
    ],
    examples: [
      {
        title: "File-Based Routing Structure",
        description: "How folder structure maps to URLs in the App Router.",
        code: `// app/page.tsx → http://localhost:3000/
export default function Home() {
  return <h1>Home</h1>;
}

// app/products/page.tsx → http://localhost:3000/products
export default function Products() {
  return <h1>Products</h1>;
}

// app/products/[id]/page.tsx → http://localhost:3000/products/123
export default function ProductDetail({ params }) {
  return <h1>Product {params.id}</h1>;
}`,
        language: "javascript",
      },
      {
        title: "Layout with Persistent UI",
        description: "Layouts wrap child pages without unmounting.",
        code: `// app/layout.tsx - root layout
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

// app/dashboard/layout.tsx - nested layout
export default function DashboardLayout({ children }) {
  return (
    <div>
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}

// Header, Sidebar, Footer persist across page transitions`,
        language: "javascript",
      },
      {
        title: "Server Component with Data Fetching",
        description: "Fetch data directly in Server Components (no useEffect).",
        code: `// app/products/page.tsx - Server Component
export default async function ProductsPage() {
  // Fetch on the server - no loading state needed
  const res = await fetch('https://api.example.com/products');
  const products = await res.json();
  
  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map(p => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
}`,
        language: "javascript",
      },
      {
        title: "Mixed Server and Client Components",
        description: "Combine Server Components for data, Client Components for interactivity.",
        code: `// app/products/page.tsx - Server Component
export default async function ProductsPage() {
  const products = await fetch('/api/products').then(r => r.json());
  
  return (
    <div>
      <h1>Products</h1>
      {/* Pass data to client component */}
      <ProductList products={products} />
    </div>
  );
}

// app/components/ProductList.tsx - Client Component
'use client';

import { useState } from 'react';

export function ProductList({ products }) {
  const [filter, setFilter] = useState('');
  
  const filtered = products.filter(p =>
    p.name.includes(filter)
  );
  
  return (
    <div>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter products"
      />
      <ul>
        {filtered.map(p => <li key={p.id}>{p.name}</li>)}
      </ul>
    </div>
  );
}`,
        language: "javascript",
      },
    ],
  },
};
