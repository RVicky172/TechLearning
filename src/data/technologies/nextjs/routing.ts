import type { TopicNode } from "@/data/types";

export const nextjsRouting: TopicNode = {
  id: "nextjs-routing",
  title: "File-Based Routing & Layouts",
  iconName: "Route",
  theoryDetail: {
    keyConcepts: [
      "App Router uses file system convention: folder structure = URL structure",
      "Dynamic routes use square brackets: [id].tsx matches /product/123",
      "Catch-all routes use [...slug] to match any path depth",
      "Optional catch-all routes use [[...slug]] for routes with or without params",
      "Layouts provide shared structure and state across route segments",
      "Route Groups use (folder) syntax to organize code without affecting URL structure",
    ],
    whyItMatters:
      "File-based routing eliminates the need for route configuration and keeps code organized. Layouts enable shared UI, navigation, and state management across multiple pages.",
    commonPitfalls: [
      "Confusing folder structure with URL structure—app/blog/posts/[id] maps to /blog/posts/123, not /app/blog/posts",
      "Using catch-all routes too broadly; they are greedy and match all remaining segments",
      "Forgetting that layouts persist on navigation—be careful with state that shouldn't persist",
      "Not using Route Groups for organization; groups help organize code without affecting URLs",
      "Dynamic routes only generate routes that are explicitly linked or prerendered",
    ],
    examples: [
      {
        title: "Dynamic Routes & Route Groups",
        description: "Organizing routes with dynamics and grouping.",
        code: `// File structure:
// app/blog/[slug]/page.tsx
// app/products/[id]/page.tsx
// app/(dashboard)/analytics/page.tsx
// app/(dashboard)/settings/page.tsx

// app/blog/[slug]/page.tsx
export default function BlogPost({ params }) {
  return <h1>Blog: {params.slug}</h1>;
}

// app/products/[id]/page.tsx
export async function generateStaticParams() {
  const products = await fetchProducts();
  return products.map(p => ({ id: p.id.toString() }));
}

export default function ProductPage({ params }) {
  return <h1>Product {params.id}</h1>;
}`,
        language: "typescript",
      },
      {
        title: "Nested Layouts",
        description: "Shared layouts for route segments.",
        code: `// app/(dashboard)/layout.tsx - shared dashboard layout
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}

// app/(dashboard)/analytics/page.tsx - inherits dashboard layout
export default function Analytics() {
  return <h2>Analytics</h2>;
}

// app/(dashboard)/settings/page.tsx - same layout
export default function Settings() {
  return <h2>Settings</h2>;
}`,
        language: "typescript",
      },
    ],
  },
};
