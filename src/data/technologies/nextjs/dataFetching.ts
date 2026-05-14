import type { TopicNode } from "@/data/types";

export const nextjsDataFetching: TopicNode = {
  id: "nextjs-data-fetching",
  title: "Data Fetching Strategies",
  iconName: "Download",
  theoryDetail: {
    keyConcepts: [
      "Server Components can directly await data from databases or APIs—no JSON serialization needed",
      "Dynamic rendering (getServerSideProps alternative): fetch data at request time for always-fresh content",
      "Static generation (getStaticProps alternative): build-time rendering for static pages",
      "Incremental Static Regeneration (ISR): revalidate static pages on a schedule or on-demand",
      "Streaming: progressively render UI with React 18 Suspense boundaries",
      "Request deduplication: Next.js automatically dedupes identical fetch requests in the same render cycle",
    ],
    whyItMatters:
      "Choosing the right data fetching strategy impacts performance, freshness, and cost. Server Components simplify data flow by removing API boundaries between frontend and backend.",
    commonPitfalls: [
      "Fetching data in Client Components unnecessarily; use Server Components when possible",
      "Not using revalidatePath() or revalidateTag() to purge cached data after mutations",
      "Forgetting that Server Components can't use hooks; move state to Client Components",
      "Over-caching data; dynamic content should use dynamic rendering or shorter revalidation",
      "N+1 queries in Server Components; batch and optimize database queries like you would in traditional backends",
    ],
    examples: [
      {
        title: "Static, Dynamic, and ISR Rendering",
        description: "Different rendering strategies for different content types.",
        code: `// Static page (built at build time, cached forever)
export const revalidate = false; // equivalent to getStaticProps

async function getPost(id) {
  const post = await db.post.findUnique({ where: { id } });
  return post;
}

export default async function PostPage({ params }) {
  const post = await getPost(params.id);
  return <article>{post.content}</article>;
}

// ---

// Dynamic page (rendered at request time)
export const dynamic = 'force-dynamic'; // equivalent to getServerSideProps

export default async function UserDashboard() {
  const user = await getCurrentUser(); // always fresh
  return <div>Welcome, {user.name}</div>;
}

// ---

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

export default async function NewsPage() {
  const news = await fetchLatestNews();
  return <section>{news.map(n => <p key={n.id}>{n.title}</p>)}</section>;
}`,
        language: "typescript",
      },
      {
        title: "Streaming with Suspense",
        description: "Progressively render UI while data is loading.",
        code: `import { Suspense } from 'react';

async function SlowComponent() {
  await new Promise(r => setTimeout(r, 2000)); // simulate slow data
  return <div>Loaded content</div>;
}

export default function Page() {
  return (
    <main>
      <h1>Dashboard</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <SlowComponent />
      </Suspense>
    </main>
  );
}`,
        language: "typescript",
      },
    ],
  },
};
